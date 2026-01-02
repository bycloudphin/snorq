
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Platform, ConnectionStatus } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/db.js';
import { FacebookService } from '../services/platform/FacebookService';


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

    // POST /organizations/:organizationId/sync
    app.post('/organizations/:organizationId/sync', async (request: FastifyRequest<{ Params: { organizationId: string } }>, reply: FastifyReply) => {
        try {
            const decoded = await verifyToken(request.headers.authorization);
            if (!decoded) {
                return reply.status(401).send({ success: false, error: { code: 401, message: 'Unauthorized' } });
            }

            const { organizationId } = request.params;

            // 1. Find all active platform connections for this org
            const connections = await prisma.platformConnection.findMany({
                where: { organizationId, status: ConnectionStatus.ACTIVE }
            });

            if (connections.length === 0) {
                return reply.send({ success: true, data: { message: 'No connections to sync' } });
            }

            const facebookService = new FacebookService();
            let totalSynced = 0;

            for (const connection of connections) {
                if (connection.platform === Platform.FACEBOOK || connection.platform === Platform.INSTAGRAM) {
                    try {
                        const fbThreads = await facebookService.syncConversations(connection);

                        for (const thread of fbThreads) {
                            const lastMsg = thread.messages?.data?.[0];
                            const participant = thread.participants?.data?.find((p: any) => p.id !== connection.platformUserId);

                            if (!participant) continue;

                            await prisma.conversation.upsert({
                                where: {
                                    platformConnectionId_externalId: {
                                        platformConnectionId: connection.id,
                                        externalId: participant.id
                                    }
                                },
                                update: {
                                    lastMessageAt: thread.updated_time ? new Date(thread.updated_time) : new Date(),
                                    lastMessagePreview: lastMsg?.message || 'No preview',
                                    contactName: participant.name || 'User',
                                    updatedAt: new Date()
                                },
                                create: {
                                    organizationId,
                                    platform: connection.platform,
                                    platformConnectionId: connection.id,
                                    externalId: participant.id,
                                    contactExternalId: participant.id,
                                    contactName: participant.name || 'User',
                                    status: 'OPEN',
                                    lastMessageAt: thread.updated_time ? new Date(thread.updated_time) : new Date(),
                                    lastMessagePreview: lastMsg?.message || 'No preview'
                                }
                            });
                            totalSynced++;
                        }
                    } catch (err) {
                        console.error(`Sync failed for connection ${connection.id}:`, err);
                    }
                }
            }

            return reply.send({
                success: true,
                data: { message: `Synced ${totalSynced} conversations` }
            });

        } catch (error) {
            console.error('Sync Error:', error);
            return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
        }
    });

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
                const facebookService = new FacebookService();
                try {
                    const result = await facebookService.sendMessage(
                        conversation.platformConnection,
                        conversation.externalId,
                        content
                    );

                    // 4. Update Message Status
                    await prisma.message.update({
                        where: { id: message.id },
                        data: {
                            status: 'SENT',
                            externalId: result.externalId
                        }
                    });

                    // Update Conversation Last Message
                    await prisma.conversation.update({
                        where: { id: conversation.id },
                        data: {
                            lastMessageAt: new Date(),
                            lastMessagePreview: `You: ${content}`,
                            status: 'OPEN',
                            updatedAt: new Date()
                        }
                    });

                } catch (error) {
                    await prisma.message.update({
                        where: { id: message.id },
                        data: { status: 'FAILED' }
                    });
                    throw error;
                }
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
