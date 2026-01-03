/**
 * Meta Routes - Handles Facebook and Instagram integration via Meta Graph API
 * 
 * This module provides endpoints for:
 * - OAuth authentication flow with Facebook
 * - Page connection and token management
 * - Webhook handling for incoming messages
 * - Meta compliance callbacks (deauthorization, data deletion)
 * 
 * @module routes/meta
 * @see https://developers.facebook.com/docs/messenger-platform
 * @see https://developers.facebook.com/docs/instagram-api
 */

import crypto from 'crypto';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Platform, ConnectionStatus, ContentType } from '@prisma/client';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/db.js';
import { SocketService } from '../socket/SocketService';

// ============================================================================
// Configuration & Constants
// ============================================================================

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

/** Current Meta Graph API version */
const META_API_VERSION = 'v18.0';

/** Base URL for all Meta Graph API requests */
const META_API_BASE = 'https://graph.facebook.com';

/** OAuth scopes required for Facebook/Instagram messaging */
const OAUTH_SCOPES = [
    'public_profile',
    'pages_show_list',
    'pages_messaging',
    'pages_manage_metadata',
    'instagram_basic',
    'instagram_manage_messages'
];

// ============================================================================
// Types & Interfaces
// ============================================================================

/** Meta API error structure */
interface MetaError {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
}

/** Response from token exchange endpoint */
interface MetaTokenResponse {
    access_token: string;
    token_type: string;
    expires_in?: number;
    error?: MetaError;
}

/** Facebook Page object from Me/Accounts */
interface MetaPage {
    id: string;
    name: string;
    category: string;
    access_token: string;
    instagram_business_account?: {
        id: string;
    };
}

/** Response from pages listing endpoint */
interface MetaPagesResponse {
    data: MetaPage[];
    paging?: { cursors: { before: string; after: string } };
    error?: MetaError;
}

/** Decoded JWT payload */
interface DecodedToken {
    userId: string;
    email: string;
}

/** Facebook user profile data */
interface MetaProfile {
    first_name?: string;
    last_name?: string;
    username?: string;
    profile_pic?: string;
    error?: MetaError;
}

/** Webhook message event structure */
interface WebhookMessage {
    mid?: string;
    text?: string;
    attachments?: Array<{
        type: string;
        payload?: { url?: string };
    }>;
    is_echo?: boolean;
}

/** Webhook event structure */
interface WebhookEvent {
    sender: { id: string };
    recipient: { id: string };
    timestamp: number;
    message?: WebhookMessage;
    postback?: { title?: string; mid?: string };
    delivery?: { mids: string[] };
    read?: { watermark: number };
}

// ============================================================================
// Validation Schemas
// ============================================================================

const exchangeTokenSchema = z.object({
    code: z.string().min(1, 'Authorization code is required'),
});

const connectPageSchema = z.object({
    pageId: z.string().min(1),
    pageAccessToken: z.string().min(1),
    pageName: z.string().min(1),
    instagramId: z.string().optional(),
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Verifies and decodes a JWT access token
 * 
 * @param authHeader - Authorization header value
 * @returns Decoded token or null if invalid
 */
async function verifyToken(authHeader: string | undefined): Promise<DecodedToken | null> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.substring(7);

    try {
        return jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch {
        return null;
    }
}

/**
 * Parses and verifies a Facebook signed_request payload
 * 
 * Used for security-sensitive callbacks like deauthorization and data deletion.
 * The signed_request is a base64-encoded JSON payload with an HMAC signature.
 * 
 * @param signedRequest - The signed_request string from Facebook
 * @returns Parsed payload data or null if verification fails
 * @see https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow#checksr
 */
function parseSignedRequest(signedRequest: string): { user_id?: string } | null {
    if (!signedRequest || !FACEBOOK_APP_SECRET) {
        return null;
    }

    try {
        const [encodedSig, payload] = signedRequest.split('.');

        // Decode the payload (base64url to JSON)
        const decodedPayload = Buffer.from(
            payload.replace(/-/g, '+').replace(/_/g, '/'),
            'base64'
        ).toString();
        const data = JSON.parse(decodedPayload);

        // Verify the signature using HMAC-SHA256
        const hmac = crypto.createHmac('sha256', FACEBOOK_APP_SECRET);
        hmac.update(payload);
        const expectedSig = hmac.digest('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');

        if (encodedSig !== expectedSig) {
            console.error('[META] Invalid signed_request signature');
            return null;
        }

        return data;
    } catch (err) {
        console.error('[META] Error parsing signed_request:', err);
        return null;
    }
}

/**
 * Verifies the X-Hub-Signature-256 header for webhook requests
 * 
 * Meta signs all webhook payloads using HMAC-SHA256 with the App Secret.
 * This verification ensures the request is genuinely from Meta.
 * 
 * @param signature - The X-Hub-Signature-256 header value (format: "sha256=xxx")
 * @param rawBody - The raw request body as a string
 * @returns true if signature is valid, false otherwise
 * @see https://developers.facebook.com/docs/messenger-platform/webhooks#validate-payloads
 */
function verifyWebhookSignature(signature: string | undefined, rawBody: string): boolean {
    if (!signature || !FACEBOOK_APP_SECRET) {
        console.error('[META] Missing signature or App Secret for webhook verification');
        return false;
    }

    // Signature format is "sha256=<hash>"
    const signatureParts = signature.split('=');
    if (signatureParts.length !== 2 || signatureParts[0] !== 'sha256') {
        console.error('[META] Invalid signature format');
        return false;
    }

    const receivedHash = signatureParts[1];

    // Compute expected signature
    const expectedHash = crypto
        .createHmac('sha256', FACEBOOK_APP_SECRET)
        .update(rawBody)
        .digest('hex');

    // Use timing-safe comparison to prevent timing attacks
    try {
        const receivedBuffer = Buffer.from(receivedHash, 'hex');
        const expectedBuffer = Buffer.from(expectedHash, 'hex');

        if (receivedBuffer.length !== expectedBuffer.length) {
            console.error('[META] Signature length mismatch');
            return false;
        }

        return crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
    } catch (err) {
        console.error('[META] Error verifying signature:', err);
        return false;
    }
}

/**
 * Generates the OAuth redirect URI based on environment
 * 
 * @returns The fully qualified redirect URI
 */
function getRedirectUri(): string {
    if (process.env.FACEBOOK_REDIRECT_URI) {
        return process.env.FACEBOOK_REDIRECT_URI;
    }

    if (process.env.FRONTEND_URL) {
        const baseUrl = process.env.FRONTEND_URL.replace(/\/$/, '');
        return `${baseUrl}/dashboard/settings/integrations/facebook/callback`;
    }

    return 'http://localhost:5173/dashboard/settings/integrations/facebook/callback';
}

/**
 * Fetches user profile from Meta Graph API
 * 
 * @param psid - Page-scoped user ID
 * @param accessToken - Page access token
 * @param platform - The platform (FACEBOOK or INSTAGRAM)
 * @returns Profile data with name and avatar URL
 */
async function fetchUserProfile(
    psid: string,
    accessToken: string,
    platform: Platform
): Promise<{ name: string; avatarUrl: string | null }> {
    const fields = platform === Platform.FACEBOOK
        ? 'first_name,last_name,profile_pic'
        : 'username,profile_pic';

    const url = `${META_API_BASE}/${META_API_VERSION}/${psid}?fields=${fields}&access_token=${accessToken}`;

    try {
        const response = await fetch(url);
        const data = await response.json() as MetaProfile;

        if (data.error) {
            console.warn('[META] Profile fetch error:', data.error.message);
            return { name: `User ${psid.slice(0, 5)}`, avatarUrl: null };
        }

        const name = platform === Platform.FACEBOOK
            ? `${data.first_name || ''} ${data.last_name || ''}`.trim()
            : data.username || '';

        return {
            name: name || `User ${psid.slice(0, 5)}`,
            avatarUrl: data.profile_pic || null
        };
    } catch (err) {
        console.error('[META] Failed to fetch profile:', err);
        return { name: `User ${psid.slice(0, 5)}`, avatarUrl: null };
    }
}

// ============================================================================
// Route Definitions
// ============================================================================

export async function metaRoutes(app: FastifyInstance): Promise<void> {

    // ========================================================================
    // Meta Compliance Endpoints (Required by Meta Platform Policy)
    // ========================================================================

    /**
     * POST /meta/deauthorize
     * 
     * Callback invoked when a user removes the app from their Facebook settings.
     * Disconnects all platform connections for the affected user.
     * 
     * @see https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow#deauth
     */
    app.post('/meta/deauthorize', async (request, reply) => {
        const body = request.body as { signed_request?: string };
        const signedRequest = body.signed_request;

        const data = parseSignedRequest(signedRequest || '');
        if (!data || !data.user_id) {
            return reply.status(400).send({ message: 'Invalid signed request' });
        }

        console.log(`[META] Deauthorize callback for user: ${data.user_id}`);

        // Disconnect all connections for this Facebook user
        await prisma.platformConnection.updateMany({
            where: { platformUserId: data.user_id },
            data: { status: ConnectionStatus.DISCONNECTED }
        });

        return reply.status(200).send({ success: true });
    });

    /**
     * POST /meta/deletion
     * 
     * Data deletion callback required by Meta for GDPR compliance.
     * Handles user requests to delete their data from our systems.
     * 
     * @see https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback
     */
    app.post('/meta/deletion', async (request, reply) => {
        const body = request.body as { signed_request?: string };
        const signedRequest = body.signed_request;

        const data = parseSignedRequest(signedRequest || '');
        if (!data || !data.user_id) {
            return reply.status(400).send({ message: 'Invalid signed request' });
        }

        console.log(`[META] Data deletion request for user: ${data.user_id}`);

        // Disconnect connections (could also delete associated data here)
        await prisma.platformConnection.updateMany({
            where: { platformUserId: data.user_id },
            data: { status: ConnectionStatus.DISCONNECTED }
        });

        // Meta requires a confirmation response with a status URL
        return reply.status(200).send({
            url: `${process.env.FRONTEND_URL}/privacy-policy`,
            confirmation_code: `del_${data.user_id}_${Date.now()}`
        });
    });

    // ========================================================================
    // OAuth Flow Endpoints
    // ========================================================================

    /**
     * GET /meta/auth-url
     * 
     * Generates the Facebook OAuth authorization URL.
     * Redirects user to Facebook to grant permissions.
     */
    app.get('/meta/auth-url', async (_request, reply) => {
        // Verify configuration
        if (!FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET) {
            console.error('[META] Missing FACEBOOK_APP_ID or FACEBOOK_APP_SECRET');
            return reply.status(500).send({
                success: false,
                error: {
                    message: 'Facebook integration is not configured. Please add FACEBOOK_APP_ID and FACEBOOK_APP_SECRET to your environment variables.'
                }
            });
        }

        const redirectUri = getRedirectUri();
        const scopes = OAUTH_SCOPES.join(',');

        const authUrl = `https://www.facebook.com/${META_API_VERSION}/dialog/oauth` +
            `?client_id=${FACEBOOK_APP_ID}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&scope=${scopes}` +
            `&response_type=code`;

        console.log(`[META] Generated auth URL with redirect: ${redirectUri}`);

        return reply.send({
            success: true,
            data: { url: authUrl }
        });
    });

    /**
     * POST /meta/exchange-token
     * 
     * Exchanges an OAuth code for access tokens and lists available pages.
     * 
     * Flow:
     * 1. Exchange code for short-lived user token
     * 2. Exchange short-lived token for long-lived token
     * 3. Fetch list of pages the user manages
     * 
     * @requires Authorization Bearer token
     */
    app.post('/meta/exchange-token', async (
        request: FastifyRequest<{ Body: { code: string } }>,
        reply: FastifyReply
    ) => {
        try {
            const decoded = await verifyToken(request.headers.authorization);
            if (!decoded) {
                return reply.status(401).send({
                    success: false,
                    error: { code: 401, message: 'Unauthorized' }
                });
            }

            const { code } = exchangeTokenSchema.parse(request.body);
            const redirectUri = getRedirectUri();

            // Step 1: Exchange code for short-lived token
            const tokenUrl = `${META_API_BASE}/${META_API_VERSION}/oauth/access_token` +
                `?client_id=${FACEBOOK_APP_ID}` +
                `&redirect_uri=${encodeURIComponent(redirectUri)}` +
                `&client_secret=${FACEBOOK_APP_SECRET}` +
                `&code=${code}`;

            const tokenRes = await fetch(tokenUrl);
            const tokenData = await tokenRes.json() as MetaTokenResponse;

            if (tokenData.error) {
                console.error('[META] Token exchange error:', tokenData.error);
                return reply.status(400).send({
                    success: false,
                    error: { message: tokenData.error.message }
                });
            }

            const shortLivedToken = tokenData.access_token;

            // Step 2: Exchange for long-lived token (60 days validity)
            const longTokenUrl = `${META_API_BASE}/${META_API_VERSION}/oauth/access_token` +
                `?grant_type=fb_exchange_token` +
                `&client_id=${FACEBOOK_APP_ID}` +
                `&client_secret=${FACEBOOK_APP_SECRET}` +
                `&fb_exchange_token=${shortLivedToken}`;

            const longTokenRes = await fetch(longTokenUrl);
            const longTokenData = await longTokenRes.json() as MetaTokenResponse;

            const userAccessToken = longTokenData.access_token || shortLivedToken;

            // Step 3: Fetch user's pages
            const pagesUrl = `${META_API_BASE}/${META_API_VERSION}/me/accounts?access_token=${userAccessToken}`;
            const pagesRes = await fetch(pagesUrl);
            const pagesData = await pagesRes.json() as MetaPagesResponse;

            if (pagesData.error) {
                return reply.status(400).send({
                    success: false,
                    error: { message: pagesData.error.message }
                });
            }

            // Map pages to a clean response format
            const pages = pagesData.data.map((p) => ({
                id: p.id,
                name: p.name,
                category: p.category,
                access_token: p.access_token,
                instagram_business_account: p.instagram_business_account
            }));

            return reply.send({
                success: true,
                data: { userAccessToken, pages }
            });

        } catch (error) {
            console.error('[META] Exchange error:', error);
            return reply.status(500).send({
                success: false,
                error: { message: 'Internal server error' }
            });
        }
    });

    /**
     * POST /meta/connect-page
     * 
     * Connects a Facebook Page (and optionally linked Instagram) to the organization.
     * Creates or updates PlatformConnection records in the database.
     * 
     * @requires Authorization Bearer token
     */
    app.post('/meta/connect-page', async (
        request: FastifyRequest<{
            Body: {
                pageId: string;
                pageAccessToken: string;
                pageName: string;
                instagramId?: string
            }
        }>,
        reply: FastifyReply
    ) => {
        try {
            const decoded = await verifyToken(request.headers.authorization);
            if (!decoded) {
                return reply.status(401).send({
                    success: false,
                    error: { code: 401, message: 'Unauthorized' }
                });
            }

            // Validate request body
            const validatedData = connectPageSchema.safeParse(request.body);
            if (!validatedData.success) {
                return reply.status(400).send({
                    success: false,
                    error: { message: 'Missing required page details' }
                });
            }

            const { pageId, pageAccessToken, pageName, instagramId } = validatedData.data;

            // Find user's organization
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                include: {
                    memberships: {
                        take: 1,
                        include: { organization: true }
                    }
                }
            });

            if (!user || user.memberships.length === 0) {
                return reply.status(400).send({
                    success: false,
                    error: { message: 'User has no organization' }
                });
            }

            const organizationId = user.memberships[0].organizationId;

            // Upsert Facebook Page connection
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

            // Upsert Instagram connection if available
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
                        accessToken: pageAccessToken,
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
            console.error('[META] Connect page error:', error);
            return reply.status(500).send({
                success: false,
                error: { message: 'Internal server error' }
            });
        }
    });

    // ========================================================================
    // Webhook Endpoints
    // ========================================================================

    /**
     * GET /meta/webhook
     * 
     * Webhook verification endpoint required by Meta.
     * Meta sends a challenge that must be echoed back.
     * 
     * @see https://developers.facebook.com/docs/messenger-platform/webhooks
     */
    app.get('/meta/webhook', async (
        request: FastifyRequest<{
            Querystring: {
                'hub.mode': string;
                'hub.challenge': string;
                'hub.verify_token': string
            }
        }>,
        reply: FastifyReply
    ) => {
        const mode = request.query['hub.mode'];
        const token = request.query['hub.verify_token'];
        const challenge = request.query['hub.challenge'];

        const VERIFY_TOKEN = process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN || 'snorq_webhook_token_123';

        if (mode && token) {
            if (mode === 'subscribe' && token === VERIFY_TOKEN) {
                console.log('[META] Webhook verified successfully');
                return reply.status(200).send(challenge);
            } else {
                console.error('[META] Webhook verification failed - token mismatch');
                return reply.status(403).send('Verification failed');
            }
        }

        return reply.status(400).send('Missing verification parameters');
    });

    /**
     * POST /meta/webhook
     * 
     * Handles incoming webhook events from Meta.
     * 
     * Security: Verifies X-Hub-Signature-256 header to ensure request is from Meta.
     * 
     * Event types handled:
     * - message: New message from user
     * - postback: Button click callback
     * - delivery: Message delivered confirmation
     * - read: Message read confirmation
     * - echo: Message sent by Page (ignored)
     * 
     * @see https://developers.facebook.com/docs/messenger-platform/reference/webhook-events
     */
    app.post('/meta/webhook', async (request: FastifyRequest, reply: FastifyReply) => {
        // ================================================================
        // Step 0: Verify webhook signature (CRITICAL SECURITY CHECK)
        // ================================================================
        const signature = request.headers['x-hub-signature-256'] as string | undefined;
        const rawBody = (request as any).rawBody || JSON.stringify(request.body);

        // In production, always verify signatures. In development, log warning but allow.
        const isProduction = process.env.NODE_ENV === 'production';
        const isValidSignature = verifyWebhookSignature(signature, rawBody);

        if (!isValidSignature) {
            if (isProduction) {
                console.error('[META] SECURITY: Invalid webhook signature - rejecting request');
                return reply.status(401).send('Invalid signature');
            } else {
                console.warn('[META] WARNING: Invalid webhook signature - allowing in development mode');
            }
        } else {
            console.log('[META] Webhook signature verified successfully');
        }

        const body = request.body as {
            object?: string;
            entry?: Array<{ messaging?: WebhookEvent[] }>
        };

        // Only process page and instagram events
        if (body.object !== 'page' && body.object !== 'instagram') {
            return reply.status(404).send();
        }

        const platform = body.object === 'page' ? Platform.FACEBOOK : Platform.INSTAGRAM;

        // Process each entry in the webhook payload
        for (const entry of body.entry || []) {
            const webhookEvent = entry.messaging?.[0];
            if (!webhookEvent) continue;

            // ----------------------------------------------------------------
            // Handle Echo Messages (ignore - these are messages sent by us)
            // ----------------------------------------------------------------
            if (webhookEvent.message?.is_echo) {
                console.log(`[META] Ignoring echo: ${webhookEvent.message.mid}`);
                continue;
            }

            // ----------------------------------------------------------------
            // Handle Delivery & Read Receipts
            // ----------------------------------------------------------------
            if (webhookEvent.delivery || webhookEvent.read) {
                const eventType = webhookEvent.delivery ? 'DELIVERY' : 'READ';
                console.log(`[META] Processing ${eventType} receipt`);

                // Update delivery status for specific message IDs
                if (webhookEvent.delivery?.mids.length) {
                    await prisma.message.updateMany({
                        where: { externalId: { in: webhookEvent.delivery.mids } },
                        data: { status: 'DELIVERED' }
                    });
                }

                // Update read status for messages before watermark timestamp
                if (webhookEvent.read?.watermark) {
                    await prisma.message.updateMany({
                        where: {
                            direction: 'OUTBOUND',
                            platformTimestamp: { lte: new Date(webhookEvent.read.watermark) },
                            status: { not: 'READ' }
                        },
                        data: { status: 'READ' }
                    });
                }

                continue;
            }

            // ----------------------------------------------------------------
            // Handle New Messages & Postbacks
            // ----------------------------------------------------------------
            if (webhookEvent.message || webhookEvent.postback) {
                console.log(`[META] Processing ${platform} message:`);
                console.log(JSON.stringify(webhookEvent, null, 2));

                const senderId = webhookEvent.sender.id;
                const recipientId = webhookEvent.recipient.id;
                const messageText = webhookEvent.message?.text ||
                    webhookEvent.postback?.title ||
                    '[Media/Attachment]';
                const mid = webhookEvent.message?.mid ||
                    webhookEvent.postback?.mid ||
                    `pb_${Date.now()}`;
                const timestamp = webhookEvent.timestamp;

                try {
                    // Step 1: Find the platform connection for this Page/Account
                    const platformConnection = await prisma.platformConnection.findFirst({
                        where: {
                            platform,
                            platformUserId: recipientId
                        }
                    });

                    if (!platformConnection) {
                        console.error(`[META] No connection found for ${platform} ID: ${recipientId}`);
                        continue;
                    }

                    console.log(`[META] Found connection: ${platformConnection.id}`);

                    // Step 2: Fetch sender's profile
                    const profile = await fetchUserProfile(
                        senderId,
                        platformConnection.accessToken,
                        platform
                    );

                    // Step 3: Find or create conversation
                    let conversation = await prisma.conversation.findUnique({
                        where: {
                            platformConnectionId_externalId: {
                                platformConnectionId: platformConnection.id,
                                externalId: senderId
                            }
                        }
                    });

                    if (!conversation) {
                        console.log('[META] Creating new conversation');
                        conversation = await prisma.conversation.create({
                            data: {
                                platform,
                                externalId: senderId,
                                contactExternalId: senderId,
                                contactName: profile.name,
                                contactAvatarUrl: profile.avatarUrl,
                                platformConnectionId: platformConnection.id,
                                organizationId: platformConnection.organizationId,
                                status: 'OPEN',
                                unreadCount: 1,
                                lastMessageAt: new Date(timestamp),
                                lastMessagePreview: messageText
                            }
                        });
                        console.log(`[META] Conversation created: ${conversation.id}`);
                    } else {
                        // Update existing conversation
                        await prisma.conversation.update({
                            where: { id: conversation.id },
                            data: {
                                unreadCount: { increment: 1 },
                                lastMessageAt: new Date(timestamp),
                                lastMessagePreview: messageText,
                                status: 'OPEN',
                                contactName: profile.name,
                                contactAvatarUrl: profile.avatarUrl
                            }
                        });
                    }

                    // Step 4: Handle attachments
                    let mediaUrl: string | null = null;
                    let contentType: ContentType = 'TEXT';

                    if (webhookEvent.message?.attachments?.length) {
                        const firstAttachment = webhookEvent.message.attachments[0];
                        mediaUrl = firstAttachment.payload?.url || null;

                        switch (firstAttachment.type) {
                            case 'image': contentType = 'IMAGE'; break;
                            case 'video': contentType = 'VIDEO'; break;
                            case 'file': contentType = 'FILE'; break;
                        }
                    }

                    // Step 5: Save message to database
                    const newMessage = await prisma.message.create({
                        data: {
                            conversationId: conversation.id,
                            direction: 'INBOUND',
                            content: messageText,
                            externalId: mid,
                            contentType,
                            mediaUrl,
                            status: 'DELIVERED',
                            platformTimestamp: new Date(timestamp),
                            createdAt: new Date()
                        }
                    });

                    console.log(`[META] Message saved: ${newMessage.id}`);

                    // Step 6: Emit real-time event
                    SocketService.getInstance().emitToOrganization(
                        platformConnection.organizationId,
                        'new_message',
                        {
                            conversationId: conversation.id,
                            message: newMessage,
                            conversation: {
                                ...conversation,
                                lastMessagePreview: messageText,
                                lastMessageAt: new Date(timestamp)
                            }
                        }
                    );

                } catch (error) {
                    console.error('[META] Error processing webhook:', error);
                }
            }
        }

        // Always return 200 to acknowledge receipt
        return reply.status(200).send('EVENT_RECEIVED');
    });
}
