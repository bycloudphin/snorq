/**
 * Conversation Routes - Handles all conversation and messaging endpoints
 * 
 * This module provides REST API endpoints for:
 * - Syncing conversations from connected platforms (Facebook, Instagram)
 * - Fetching conversations for an organization
 * - Fetching messages within a conversation
 * - Sending messages to conversations
 * 
 * @module routes/conversations
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Platform, ConnectionStatus, ContentType } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/db.js';
import { FacebookService } from '../services/platform/FacebookService';
import { SocketService } from '../socket/SocketService';

// ============================================================================
// Constants & Configuration
// ============================================================================

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

// ============================================================================
// Types & Interfaces
// ============================================================================

/** Decoded JWT payload structure */
interface DecodedToken {
    userId: string;
    email: string;
}

/** Facebook thread participant data */
interface FacebookParticipant {
    id: string;
    name?: string;
    picture?: {
        data?: {
            url?: string;
        };
    };
}

/** Facebook message attachment structure */
interface FacebookAttachment {
    image_data?: { url?: string };
    video_data?: { url?: string };
    file_url?: string;
}

/** Facebook historical message structure */
interface FacebookMessage {
    id: string;
    message: string;
    from?: { id: string };
    created_time: string;
    attachments?: {
        data?: FacebookAttachment[];
    };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Verifies and decodes a JWT access token from the Authorization header
 * 
 * @param authHeader - The Authorization header value (e.g., "Bearer xxx")
 * @returns Decoded token payload or null if invalid
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
 * Determines the content type based on attachment data
 * 
 * @param attachment - Facebook attachment object
 * @returns The appropriate ContentType enum value
 */
function getContentTypeFromAttachment(attachment: FacebookAttachment): ContentType {
    if (attachment.image_data) return 'IMAGE';
    if (attachment.video_data) return 'VIDEO';
    return 'FILE';
}

/**
 * Extracts media URL from a Facebook attachment
 * 
 * @param attachment - Facebook attachment object
 * @returns The media URL or null
 */
function getMediaUrlFromAttachment(attachment: FacebookAttachment): string | null {
    return attachment.image_data?.url || attachment.video_data?.url || attachment.file_url || null;
}

// ============================================================================
// Route Definitions
// ============================================================================

export async function conversationRoutes(app: FastifyInstance): Promise<void> {

    /**
     * POST /organizations/:organizationId/sync
     * 
     * Syncs conversations from all connected platforms for an organization.
     * Fetches conversations and their recent message history from Facebook/Instagram.
     * 
     * @requires Authorization Bearer token
     */
    app.post('/organizations/:organizationId/sync', async (
        request: FastifyRequest<{ Params: { organizationId: string } }>,
        reply: FastifyReply
    ) => {
        try {
            // Verify authentication
            const decoded = await verifyToken(request.headers.authorization);
            if (!decoded) {
                return reply.status(401).send({
                    success: false,
                    error: { code: 401, message: 'Unauthorized' }
                });
            }

            const { organizationId } = request.params;

            // Find all active platform connections for this organization
            const connections = await prisma.platformConnection.findMany({
                where: {
                    organizationId,
                    status: ConnectionStatus.ACTIVE
                }
            });

            if (connections.length === 0) {
                return reply.send({
                    success: true,
                    data: { message: 'No connections to sync' }
                });
            }

            const facebookService = new FacebookService();
            let totalSynced = 0;

            // Process each platform connection
            for (const connection of connections) {
                if (connection.platform === Platform.FACEBOOK || connection.platform === Platform.INSTAGRAM) {
                    try {
                        // Fetch conversation threads from Facebook
                        const fbThreads = await facebookService.syncConversations(connection) as Array<{
                            id: string;
                            updated_time?: string;
                            messages?: { data?: Array<{ message?: string }> };
                            participants?: { data?: FacebookParticipant[] };
                        }>;

                        for (const thread of fbThreads) {
                            const lastMsg = thread.messages?.data?.[0];

                            // Find the external participant (not the Page itself)
                            const participant = thread.participants?.data?.find(
                                (p) => p.id !== connection.platformUserId
                            );

                            if (!participant) continue;

                            // Upsert conversation record
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

                            // Sync message history (last 10 messages)
                            try {
                                const history = await facebookService.getMessageHistory(connection, thread.id) as FacebookMessage[];

                                for (const hMsg of history.slice(0, 10)) {
                                    const attachment = hMsg.attachments?.data?.[0];
                                    const hMediaUrl = attachment ? getMediaUrlFromAttachment(attachment) : null;
                                    const hContentType: ContentType = attachment
                                        ? getContentTypeFromAttachment(attachment)
                                        : 'TEXT';

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
                                console.error(`[SYNC] Failed to sync history for thread ${thread.id}:`, hErr);
                            }

                            totalSynced++;
                        }
                    } catch (err) {
                        console.error(`[SYNC] Failed for connection ${connection.id}:`, err);
                    }
                }
            }

            return reply.send({
                success: true,
                data: { message: `Synced ${totalSynced} conversations` }
            });

        } catch (error) {
            console.error('[SYNC] Error:', error);
            return reply.status(500).send({
                success: false,
                error: { message: 'Internal server error' }
            });
        }
    });

    /**
     * GET /organizations/:organizationId/conversations
     * 
     * Retrieves all conversations for an organization, sorted by most recent.
     * 
     * @requires Authorization Bearer token
     */
    app.get('/organizations/:organizationId/conversations', async (
        request: FastifyRequest<{ Params: { organizationId: string } }>,
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

            const { organizationId } = request.params;
            console.log(`[FETCH] Conversations for Org: ${organizationId} (User: ${decoded.userId})`);

            const conversations = await prisma.conversation.findMany({
                where: { organizationId },
                orderBy: { updatedAt: 'desc' },
                include: {
                    platformConnection: {
                        select: {
                            platform: true,
                            platformUsername: true
                        }
                    }
                }
            });

            console.log(`[FETCH] Found ${conversations.length} conversations`);

            return reply.send({
                success: true,
                data: conversations
            });
        } catch (error) {
            console.error('[FETCH] Conversations Error:', error);
            return reply.status(500).send({
                success: false,
                error: { message: 'Internal server error' }
            });
        }
    });

    /**
     * GET /conversations/:conversationId/messages
     * 
     * Retrieves all messages for a specific conversation.
     * 
     * @requires Authorization Bearer token
     * @todo Add conversation access verification
     */
    app.get('/conversations/:conversationId/messages', async (
        request: FastifyRequest<{ Params: { conversationId: string } }>,
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

            const { conversationId } = request.params;

            // TODO: Verify user has access to this conversation's organization

            const messages = await prisma.message.findMany({
                where: { conversationId },
                orderBy: { createdAt: 'asc' }
            });

            return reply.send({
                success: true,
                data: messages
            });
        } catch (error) {
            console.error('[FETCH] Messages Error:', error);
            return reply.status(500).send({
                success: false,
                error: { message: 'Internal server error' }
            });
        }
    });

    /**
     * POST /conversations/:conversationId/messages
     * 
     * Sends a new message in a conversation.
     * 
     * Flow:
     * 1. Validate message content
     * 2. Find conversation and platform connection
     * 3. Send message to external platform (Facebook/Instagram)
     * 4. On success, save message to database
     * 5. Update conversation metadata
     * 6. Emit real-time event to organization
     * 
     * @requires Authorization Bearer token
     * 
     * @remarks
     * Messages are only saved to the database if they are successfully
     * delivered to the external platform. This prevents "ghost" messages.
     */
    app.post('/conversations/:conversationId/messages', async (
        request: FastifyRequest<{
            Params: { conversationId: string };
            Body: { content: string }
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

            const { conversationId } = request.params;
            const { content } = request.body;

            // Validate message content
            if (!content || !content.trim()) {
                return reply.status(400).send({
                    success: false,
                    error: { message: 'Message content required' }
                });
            }

            // Step 1: Get conversation and platform connection
            const conversation = await prisma.conversation.findUnique({
                where: { id: conversationId },
                include: { platformConnection: true }
            });

            if (!conversation || !conversation.platformConnection) {
                return reply.status(404).send({
                    success: false,
                    error: { message: 'Conversation not found' }
                });
            }

            let externalId: string | null = null;

            // Step 2: Send to external platform
            if (conversation.platform === 'FACEBOOK') {
                const facebookService = new FacebookService();

                try {
                    const result = await facebookService.sendMessage(
                        conversation.platformConnection,
                        conversation.externalId,
                        content
                    );
                    externalId = result.externalId;
                } catch (error: unknown) {
                    console.error('[SEND] Meta Send Error:', error);

                    // Provide user-friendly error messages for common issues
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    let cleanMessage = errorMessage || 'Failed to send message to Facebook';

                    if (errorMessage.includes('outside the allowed window') ||
                        errorMessage.includes('24-hour window')) {
                        cleanMessage = 'Facebook 24-hour window expired. You can only reply if the user messaged you in the last 24 hours.';
                    } else if (errorMessage.includes('HUMAN_AGENT') &&
                        errorMessage.includes('approval')) {
                        cleanMessage = 'Facebook Human Agent tag requires Meta App approval. Please request this permission in Meta Developer Portal or use standard replies within 24 hours.';
                    }

                    return reply.status(400).send({
                        success: false,
                        error: { message: cleanMessage }
                    });
                }
            }

            // Step 3: Save message to database (only after successful send)
            const message = await prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    direction: 'OUTBOUND',
                    content: content,
                    contentType: 'TEXT',
                    status: 'SENT',
                    externalId,
                    sentByUserId: decoded.userId,
                    createdAt: new Date()
                }
            });

            // Step 4: Update conversation metadata
            const updatedConv = await prisma.conversation.update({
                where: { id: conversation.id },
                data: {
                    lastMessageAt: new Date(),
                    lastMessagePreview: `You: ${content}`,
                    status: 'OPEN',
                    updatedAt: new Date()
                }
            });

            // Step 5: Emit real-time event for live updates
            SocketService.getInstance().emitToOrganization(
                conversation.organizationId,
                'new_message',
                {
                    conversationId: conversation.id,
                    message,
                    conversation: updatedConv
                }
            );

            return reply.send({
                success: true,
                data: message
            });

        } catch (error: unknown) {
            console.error('[SEND] Message Error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to send message';

            return reply.status(500).send({
                success: false,
                error: { message: errorMessage }
            });
        }
    });
}
