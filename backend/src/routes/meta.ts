import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient, Platform, ConnectionStatus } from '@prisma/client';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const FACEBOOK_REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:5173/dashboard/settings/integrations/facebook/callback';

// Types for Meta API responses
interface MetaError {
    message: string;
    type: string;
    code: number;
}

interface MetaTokenResponse {
    access_token: string;
    token_type: string;
    expires_in?: number;
    error?: MetaError;
}

interface MetaPage {
    id: string;
    name: string;
    category: string;
    access_token: string;
    instagram_business_account?: {
        id: string;
    };
}

interface MetaPagesResponse {
    data: MetaPage[];
    paging?: any;
    error?: MetaError;
}

// Helper to verify JWT
async function verifyToken(authHeader: string | undefined): Promise<{ userId: string; email: string } | null> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.substring(7);
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    } catch {
        return null;
    }
}

// Validation Schemas
const exchangeTokenSchema = z.object({
    code: z.string(),
});

export async function metaRoutes(app: FastifyInstance): Promise<void> {


    // 1. Get Facebook Auth URL
    app.get('/meta/auth-url', async (_request, reply) => {
        if (!FACEBOOK_APP_ID) {
            return reply.status(500).send({ success: false, error: { message: 'Facebook App ID not configured' } });
        }

        const scopes = [
            'public_profile',
            // 'email', // user reported generic error for this
            'pages_show_list',
            'pages_messaging',
            'pages_manage_metadata',
            // 'pages_read_engagement', // User reported invalid scope
            // 'pages_read_user_content', // User reported invalid scope
            // 'instagram_basic', // user reported error for this
            // 'instagram_manage_messages' // likely also invalid if basic is
        ].join(',');

        const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(FACEBOOK_REDIRECT_URI)}&scope=${scopes}&response_type=code`;

        return reply.send({
            success: true,
            data: { url }
        });
    });

    // 2. Exchange Code for Token and List Pages
    app.post('/meta/exchange-token', async (request: FastifyRequest<{ Body: { code: string } }>, reply: FastifyReply) => {
        try {
            const decoded = await verifyToken(request.headers.authorization);
            if (!decoded) {
                return reply.status(401).send({ success: false, error: { code: 401, message: 'Unauthorized' } });
            }

            const { code } = exchangeTokenSchema.parse(request.body);

            // A. Search for User Token
            const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(FACEBOOK_REDIRECT_URI)}&client_secret=${FACEBOOK_APP_SECRET}&code=${code}`;

            const tokenRes = await fetch(tokenUrl);
            const tokenData = await tokenRes.json() as MetaTokenResponse;

            if (tokenData.error) {
                console.error('FB Token Error:', tokenData.error);
                return reply.status(400).send({ success: false, error: { message: tokenData.error.message } });
            }

            const shortLivedToken = tokenData.access_token;

            // B. Exchange for Long-Lived Token
            const longTokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&fb_exchange_token=${shortLivedToken}`;

            const longTokenRes = await fetch(longTokenUrl);
            const longTokenData = await longTokenRes.json() as MetaTokenResponse;

            const userAccessToken = longTokenData.access_token || shortLivedToken;

            // C. Fetch Pages
            const pagesUrl = `https://graph.facebook.com/v18.0/me/accounts?access_token=${userAccessToken}`;
            const pagesRes = await fetch(pagesUrl);
            const pagesData = await pagesRes.json() as MetaPagesResponse;

            if (pagesData.error) {
                return reply.status(400).send({ success: false, error: { message: pagesData.error.message } });
            }

            const pages = pagesData.data.map((p) => ({
                id: p.id,
                name: p.name,
                category: p.category,
                access_token: p.access_token,
                instagram_business_account: p.instagram_business_account
            }));

            return reply.send({
                success: true,
                data: {
                    userAccessToken,
                    pages
                }
            });

        } catch (error) {
            console.error('Meta Exchange Error:', error);
            return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
        }
    });

    // 3. Connect Selected Page (and Link Instagram if available)
    app.post('/meta/connect-page', async (request: FastifyRequest<{ Body: { pageId: string, pageAccessToken: string, pageName: string, instagramId?: string } }>, reply: FastifyReply) => {
        try {
            const decoded = await verifyToken(request.headers.authorization);
            if (!decoded) {
                return reply.status(401).send({ success: false, error: { code: 401, message: 'Unauthorized' } });
            }

            const { pageId, pageAccessToken, pageName, instagramId } = request.body;
            // Validate presence manually since we are skipping the strict schema for now or would need to update it
            if (!pageId || !pageAccessToken || !pageName) {
                return reply.status(400).send({ success: false, error: { message: 'Missing required page details' } });
            }

            // Get User to find their organization
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                include: { memberships: { take: 1, include: { organization: true } } }
            });

            if (!user || user.memberships.length === 0) {
                return reply.status(400).send({ success: false, error: { message: 'User has no organization' } });
            }
            const organizationId = user.memberships[0].organizationId;

            // Upsert PlatformConnection for Facebook Page
            await prisma.platformConnection.upsert({
                where: {
                    organizationId_platform_platformUserId: {
                        organizationId,
                        platform: Platform.FACEBOOK,
                        platformUserId: pageId
                    }
                },
                update: {
                    accessToken: pageAccessToken,
                    platformUsername: pageName,
                    status: ConnectionStatus.ACTIVE,
                    updatedAt: new Date(),
                },
                create: {
                    organizationId,
                    platform: Platform.FACEBOOK,
                    platformUserId: pageId,
                    platformUsername: pageName,
                    accessToken: pageAccessToken,
                    status: ConnectionStatus.ACTIVE
                }
            });

            // Upsert PlatformConnection for Instagram (if exists)
            if (instagramId) {
                await prisma.platformConnection.upsert({
                    where: {
                        organizationId_platform_platformUserId: {
                            organizationId,
                            platform: Platform.INSTAGRAM,
                            platformUserId: instagramId
                        }
                    },
                    update: {
                        accessToken: pageAccessToken, // Using Page Token as per IG Graph API requirement
                        status: ConnectionStatus.ACTIVE,
                        updatedAt: new Date(),
                    },
                    create: {
                        organizationId,
                        platform: Platform.INSTAGRAM,
                        platformUserId: instagramId,
                        platformUsername: `${pageName} (Instagram)`,
                        accessToken: pageAccessToken,
                        status: ConnectionStatus.ACTIVE
                    }
                });
            }

            return reply.send({
                success: true,
                data: { message: 'Page connected successfully' }
            });

        } catch (error) {
            console.error('Meta Connect Error:', error);
            return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
        }
    });

    // 4. Webhook Verification (GET)
    app.get('/meta/webhook', async (request: FastifyRequest<{ Querystring: { 'hub.mode': string, 'hub.challenge': string, 'hub.verify_token': string } }>, reply: FastifyReply) => {
        const mode = request.query['hub.mode'];
        const token = request.query['hub.verify_token'];
        const challenge = request.query['hub.challenge'];

        const VERIFY_TOKEN = process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN || 'snorq_webhook_token_123';

        if (mode && token) {
            if (mode === 'subscribe' && token === VERIFY_TOKEN) {
                console.log('WEBHOOK_VERIFIED');
                return reply.status(200).send(challenge);
            } else {
                return reply.status(403).send('Verification failed');
            }
        }
        return reply.status(400).send('Missing params');
    });

    // 5. Webhook Event Handling (POST)
    app.post('/meta/webhook', async (request: FastifyRequest, reply: FastifyReply) => {
        const body = request.body as any;

        // Check if this is an event from a page subscription
        if (body.object === 'page') {
            // Iterate over each entry
            for (const entry of body.entry) {
                const webhookEvent = entry.messaging?.[0];
                if (webhookEvent && webhookEvent.message) {
                    console.log('--- INCOMING WEBHOOK MESSAGE ---');
                    console.log(JSON.stringify(webhookEvent, null, 2));

                    const senderId = webhookEvent.sender.id;
                    const recipientId = webhookEvent.recipient.id;
                    const messageText = webhookEvent.message.text;
                    const mid = webhookEvent.message.mid;
                    const timestamp = webhookEvent.timestamp;

                    console.log(`Processing message from ${senderId} to ${recipientId}`);

                    try {
                        // 1. Find the PlatformConnection for this Page
                        const platformConnection = await prisma.platformConnection.findFirst({
                            where: {
                                platform: Platform.FACEBOOK,
                                platformUserId: recipientId
                            }
                        });

                        if (!platformConnection) {
                            console.error(`❌ No PlatformConnection found for page ID: ${recipientId}`);
                            // Log all FB connections to debug
                            const allFb = await prisma.platformConnection.findMany({ select: { platformUserId: true } });
                            console.log('Available FB Page IDs in DB:', allFb.map(c => c.platformUserId));
                            continue;
                        }

                        console.log(`✅ Found PlatformConnection: ${platformConnection.id}`);

                        // 2. Find or Create Conversation
                        let conversation = await prisma.conversation.findUnique({
                            where: {
                                platformConnectionId_externalId: {
                                    platformConnectionId: platformConnection.id,
                                    externalId: senderId
                                }
                            }
                        });

                        if (!conversation) {
                            console.log('Creating new conversation...');
                            conversation = await prisma.conversation.create({
                                data: {
                                    platform: Platform.FACEBOOK,
                                    externalId: senderId,
                                    contactExternalId: senderId,
                                    contactName: `User ${senderId.slice(0, 5)}`,
                                    platformConnectionId: platformConnection.id,
                                    organizationId: platformConnection.organizationId,
                                    status: 'OPEN',
                                    unreadCount: 1,
                                    lastMessageAt: new Date(timestamp),
                                    lastMessagePreview: messageText
                                }
                            });
                            console.log(`✅ Conversation created: ${conversation.id}`);
                        } else {
                            console.log(`Using existing conversation: ${conversation.id}`);
                            await prisma.conversation.update({
                                where: { id: conversation.id },
                                data: {
                                    unreadCount: { increment: 1 },
                                    lastMessageAt: new Date(timestamp),
                                    lastMessagePreview: messageText,
                                    status: 'OPEN'
                                }
                            });
                        }

                        // 3. Create Message
                        const newMessage = await prisma.message.create({
                            data: {
                                conversationId: conversation.id,
                                direction: 'INBOUND',
                                content: messageText,
                                externalId: mid,
                                contentType: 'TEXT',
                                status: 'DELIVERED',
                                platformTimestamp: new Date(timestamp),
                                createdAt: new Date()
                            }
                        });

                        console.log(`✅ Message saved to DB: ${newMessage.id}`);

                    } catch (error) {
                        console.error('❌ Error processing webhook event:', error);
                        if (error instanceof Error) {
                            console.error(error.stack);
                        }
                    }
                }
            }

            return reply.status(200).send('EVENT_RECEIVED');
        } else {
            return reply.status(404).send();
        }
    });
}
