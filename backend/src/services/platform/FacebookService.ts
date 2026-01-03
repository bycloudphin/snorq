/**
 * FacebookService - Handles all communication with the Meta (Facebook/Instagram) Graph API
 * 
 * This service implements the PlatformService interface and provides methods for:
 * - Sending messages to Facebook Page conversations
 * - Syncing conversations from a connected Facebook Page
 * - Fetching message history for individual conversations
 * 
 * @module services/platform/FacebookService
 */

import { PlatformConnection } from '@prisma/client';
import { PlatformService, SendMessageResult } from './PlatformService';

/**
 * Interface for Facebook Graph API error responses
 */
interface FacebookApiError {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
}

/**
 * Interface for Facebook Graph API response
 */
interface FacebookApiResponse<T> {
    data?: T;
    error?: FacebookApiError;
    paging?: { cursors: { before: string; after: string } };
}

/**
 * Service class for Facebook/Instagram messaging operations
 * Implements the PlatformService interface for unified platform handling
 */
export class FacebookService implements PlatformService {
    /** Current Graph API version - update when Meta releases new versions */
    private readonly API_VERSION = 'v18.0';

    /** Base URL for all Graph API requests */
    private readonly BASE_URL = 'https://graph.facebook.com';

    /**
     * Sends a text message to a Facebook Page conversation
     * 
     * @param connection - The platform connection containing the Page access token
     * @param recipientId - The PSID (Page-Scoped User ID) of the message recipient
     * @param content - The text content of the message to send
     * @returns Promise resolving to the external message ID from Facebook
     * @throws Error if the message fails to send (e.g., 24-hour window expired)
     * 
     * @remarks
     * Facebook has a 24-hour messaging window policy. After that period, you can
     * only respond using Message Tags (requires Meta approval) or Sponsored Messages.
     * 
     * @example
     * ```typescript
     * const result = await facebookService.sendMessage(connection, 'psid_123', 'Hello!');
     * console.log('Message sent with ID:', result.externalId);
     * ```
     */
    async sendMessage(
        connection: PlatformConnection,
        recipientId: string,
        content: string
    ): Promise<SendMessageResult> {
        const pageAccessToken = connection.accessToken;
        const url = `${this.BASE_URL}/${this.API_VERSION}/me/messages?access_token=${pageAccessToken}`;

        // Build the message payload following Meta's Send API specification
        // messaging_type: RESPONSE is the standard type for responding to user messages
        // Note: HUMAN_AGENT tag extends window to 7 days but requires Meta approval
        const payload = {
            recipient: { id: recipientId },
            message: { text: content },
            messaging_type: 'RESPONSE'
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json() as { message_id?: string; error?: FacebookApiError };

            if (data.error) {
                console.error('[FacebookService] Send Error:', data.error);
                throw new Error(data.error.message || 'Failed to send message to Facebook');
            }

            return {
                externalId: data.message_id || null
            };
        } catch (error: unknown) {
            console.error('[FacebookService] Network/Send Error:', error);
            throw error;
        }
    }

    /**
     * Fetches all conversations from a connected Facebook Page
     * 
     * @param connection - The platform connection containing the Page access token
     * @returns Promise resolving to an array of conversation thread objects
     * 
     * @remarks
     * Each conversation includes:
     * - Thread ID and last update time
     * - Most recent message preview
     * - Participant information (including profile pictures)
     * 
     * @example
     * ```typescript
     * const threads = await facebookService.syncConversations(connection);
     * threads.forEach(thread => console.log(thread.participants.data));
     * ```
     */
    async syncConversations(connection: PlatformConnection): Promise<unknown[]> {
        const pageAccessToken = connection.accessToken;

        // Construct URL with necessary fields for conversation sync
        // - messages.limit(1): Get just the latest message for preview
        // - participants{id,name,picture}: Get participant details including avatars
        const fields = 'id,updated_time,messages.limit(1){message,from,created_time},participants{id,name,picture}';
        const url = `${this.BASE_URL}/${this.API_VERSION}/me/conversations?fields=${fields}&access_token=${pageAccessToken}`;

        try {
            const response = await fetch(url);
            const data = await response.json() as FacebookApiResponse<unknown[]>;

            if (data.error) {
                console.error('[FacebookService] Sync Error:', data.error);
                throw new Error(data.error.message || 'Failed to sync conversations from Facebook');
            }

            return data.data || [];
        } catch (error: unknown) {
            console.error('[FacebookService] Sync Network Error:', error);
            throw error;
        }
    }

    /**
     * Fetches the message history for a specific conversation thread
     * 
     * @param connection - The platform connection containing the Page access token  
     * @param conversationId - The Facebook thread ID to fetch messages from
     * @returns Promise resolving to an array of message objects
     * 
     * @remarks
     * Messages include:
     * - Message ID, text content, sender info, and timestamp
     * - Attachment information (images, videos, files)
     * 
     * @example
     * ```typescript
     * const messages = await facebookService.getMessageHistory(connection, 't_123456');
     * messages.forEach(msg => console.log(msg.message, msg.from.name));
     * ```
     */
    async getMessageHistory(
        connection: PlatformConnection,
        conversationId: string
    ): Promise<unknown[]> {
        const pageAccessToken = connection.accessToken;

        // Fetch messages with attachment data for media handling
        const fields = 'id,message,from,created_time,attachments';
        const url = `${this.BASE_URL}/${this.API_VERSION}/${conversationId}/messages?fields=${fields}&access_token=${pageAccessToken}`;

        try {
            const response = await fetch(url);
            const data = await response.json() as FacebookApiResponse<unknown[]>;

            if (data.error) {
                console.error('[FacebookService] History Error:', data.error);
                throw new Error(data.error.message || 'Failed to fetch message history');
            }

            return data.data || [];
        } catch (error: unknown) {
            console.error('[FacebookService] History Network Error:', error);
            throw error;
        }
    }
}
