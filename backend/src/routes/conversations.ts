
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Platform, ConnectionStatus, ContentType } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/db.js';
import { FacebookService } from '../services/platform/FacebookService';
import { SocketService } from '../socket/SocketService';


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

                            const conv = await prisma.conversation.upsert({
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
                                    contactAvatarUrl: participant.picture?.data?.url || null,
                                    updatedAt: new Date()
                                },
                                create: {
                                    organizationId,
                                    platform: connection.platform,
                                    platformConnectionId: connection.id,
                                    externalId: participant.id,
                                    contactExternalId: participant.id,
                                    contactName: participant.name || 'User',
                                    contactAvatarUrl: participant.picture?.data?.url || null,
                                    status: 'OPEN',
                                    lastMessageAt: thread.updated_time ? new Date(thread.updated_time) : new Date(),
                                    lastMessagePreview: lastMsg?.message || 'No preview'
                                }
                            });

                            // --- SYNC HISTORY (Last 10 messages) ---
                            try {
                                const history = await facebookService.getMessageHistory(connection, thread.id);
                                for (const hMsg of history.slice(0, 10)) {
                                    let hMediaUrl = null;
                                    let hContentType: ContentType = 'TEXT';

                                    if (hMsg.attachments?.data?.[0]) {
                                        const att = hMsg.attachments.data[0];
                                        hMediaUrl = att.image_data?.url || att.video_data?.url || att.file_url;
                                        if (att.image_data) hContentType = 'IMAGE';
                                        else if (att.video_data) hContentType = 'VIDEO';
                                    }

                                    await prisma.message.upsert({
                                        where: { id: `ext_${hMsg.id}` },
                                        update: {},
                                        create: {
                                            id: `ext_${hMsg.id}`,
                                            conversationId: conv.id,
                                            externalId: hMsg.id,
                                            direction: hMsg.from?.id === connection.platformUserId ? 'OUTBOUND' : 'INBOUND',
                                            content: hMsg.message,
                                            contentType: hContentType,
                                            mediaUrl: hMediaUrl,
                                            platformTimestamp: new Date(hMsg.created_time),
                                            status: 'DELIVERED'
                                        }
                                    });
                                }
                            } catch (hErr) {
                                console.error(`Failed to sync history for thread ${thread.id}:`, hErr);
                            }

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
            console.log(`[FETCH] Fetching conversations for Org: ${organizationId} (Requested by User: ${decoded.userId})`);

            // Fetch conversations
            const conversations = await prisma.conversation.findMany({
                where: {
                    organizationId,
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

            console.log(`[FETCH] Found ${conversations.length} conversations for org ${organizationId}`);

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

                    // 4. Update Conversation in DB
                    const updatedConv = await prisma.conversation.update({
                        where: { id: conversation.id },
                        data: {
                            lastMessageAt: new Date(),
                            lastMessagePreview: `You: ${content}`,
                            status: 'OPEN',
                            updatedAt: new Date()
                        }
                    });

                    // 5. Emit Real-time Event to Org
                    SocketService.getInstance().emitToOrganization(conversation.organizationId, 'new_message', {
                        conversationId: conversation.id,
                        message: {
                            ...message,
                            status: 'SENT',
                            externalId: result.externalId
                        },
                        conversation: updatedConv
                    });

                } catch (error: any) {
                    await prisma.message.update({
                        where: { id: message.id },
                        data: { status: 'FAILED' }
                    });

                    // If it's a known Facebook policy error, return a cleaner message
                    if (error.message?.includes('outside the allowed window') || error.message?.includes('24-hour window')) {
                        return reply.status(400).send({
                            success: false,
                            error: {
                                message: 'Facebook 24-hour window expired. You can only reply if the user messaged you in the last 24 hours.'
                            }
                        });
                    }

                    if (error.message?.includes('HUMAN_AGENT') && error.message?.includes('approval')) {
                        return reply.status(400).send({
                            success: false,
                            error: {
                                message: 'Facebook Human Agent tag requires Meta App approval. Please request this permission in Meta Developer Portal or use standard replies within 24 hours.'
                            }
                        });
                    }

                    throw error;
                }
            }

            return reply.send({
                success: true,
                data: message
            });

        } catch (error: any) {
            console.error('Send Message Error:', error);
            const status = error.statusCode || 500;
            return reply.status(status).send({
                success: false,
                error: {
                    message: error.message || 'Failed to send message'
                }
            });
        }
    });
}
