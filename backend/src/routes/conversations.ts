
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

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

export async function conversationRoutes(app: FastifyInstance): Promise<void> {

    // GET /organizations/:organizationId/conversations
    app.get('/organizations/:organizationId/conversations', async (request: FastifyRequest<{ Params: { organizationId: string } }>, reply: FastifyReply) => {
        try {
            const decoded = await verifyToken(request.headers.authorization);
            if (!decoded) {
                return reply.status(401).send({ success: false, error: { code: 401, message: 'Unauthorized' } });
            }

            const { organizationId } = request.params;

            // TODO: Verify user belongs to organization

            // Fetch conversations
            const conversations = await prisma.conversation.findMany({
                where: {
                    organizationId,
                    // status: 'OPEN' // Optional: filter by status
                },
                orderBy: {
                    updatedAt: 'desc'
                },
                include: {
                    platformConnection: {
                        select: {
                            platform: true,
                            platformUsername: true
                        }
                    }
                }
            });

            console.log(`Found ${conversations.length} conversations for org ${organizationId}`);

            return reply.send({
                success: true,
                data: conversations
            });
        } catch (error) {
            console.error('Fetch Conversations Error:', error);
            return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
        }
    });

    // GET /conversations/:conversationId/messages
    app.get('/conversations/:conversationId/messages', async (request: FastifyRequest<{ Params: { conversationId: string } }>, reply: FastifyReply) => {
        try {
            const decoded = await verifyToken(request.headers.authorization);
            if (!decoded) {
                return reply.status(401).send({ success: false, error: { code: 401, message: 'Unauthorized' } });
            }

            const { conversationId } = request.params;

            // TODO: Verify user access to conversation

            const messages = await prisma.message.findMany({
                where: {
                    conversationId
                },
                orderBy: {
                    createdAt: 'asc'
                }
            });

            return reply.send({
                success: true,
                data: messages
            });
        } catch (error) {
            console.error('Fetch Messages Error:', error);
            return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
        }
    });
    // POST /conversations/:conversationId/messages
    app.post('/conversations/:conversationId/messages', async (request: FastifyRequest<{ Params: { conversationId: string }, Body: { content: string } }>, reply: FastifyReply) => {
        try {
            const decoded = await verifyToken(request.headers.authorization);
            if (!decoded) {
                return reply.status(401).send({ success: false, error: { code: 401, message: 'Unauthorized' } });
            }

            const { conversationId } = request.params;
            const { content } = request.body;

            if (!content || !content.trim()) {
                return reply.status(400).send({ success: false, error: { message: 'Message content required' } });
            }

            // 1. Get Conversation & Connection Details
            const conversation = await prisma.conversation.findUnique({
                where: { id: conversationId },
                include: { platformConnection: true }
            });

            if (!conversation || !conversation.platformConnection) {
                return reply.status(404).send({ success: false, error: { message: 'Conversation not found' } });
            }

            // 2. Create Message in DB (Pending)
            const message = await prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    direction: 'OUTBOUND',
                    content: content,
                    contentType: 'TEXT',
                    status: 'PENDING',
                    sentByUserId: decoded.userId,
                    createdAt: new Date()
                }
            });

            // 3. Send to Facebook
            if (conversation.platform === 'FACEBOOK') {
                const pageAccessToken = conversation.platformConnection.accessToken;
                const recipientId = conversation.externalId; // PSID

                const fbUrl = `https://graph.facebook.com/v18.0/me/messages?access_token=${pageAccessToken}`;
                const payload = {
                    recipient: { id: recipientId },
                    message: { text: content },
                    messaging_type: "RESPONSE"
                };

                const fbRes = await fetch(fbUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const fbData = await fbRes.json() as any;

                if (fbData.error) {
                    console.error('Facebook Send Error:', fbData.error);
                    await prisma.message.update({
                        where: { id: message.id },
                        data: { status: 'FAILED' } // Should store error details ideally
                    });
                    throw new Error(fbData.error.message);
                }

                // 4. Update Message Status
                await prisma.message.update({
                    where: { id: message.id },
                    data: {
                        status: 'SENT',
                        externalId: fbData.message_id
                    }
                });

                // Update Conversation Last Message
                await prisma.conversation.update({
                    where: { id: conversation.id },
                    data: {
                        lastMessageAt: new Date(),
                        lastMessagePreview: `You: ${content}`,
                        status: 'OPEN'
                    }
                });
            }

            return reply.send({
                success: true,
                data: message
            });

        } catch (error: any) {
            console.error('Send Message Error:', error);
            return reply.status(500).send({ success: false, error: { message: error.message || 'Failed to send message' } });
        }
    });
}
