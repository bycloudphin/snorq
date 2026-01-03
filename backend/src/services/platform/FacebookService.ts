import { PlatformConnection } from '@prisma/client';
import { PlatformService, SendMessageResult } from './PlatformService';

export class FacebookService implements PlatformService {
    private readonly API_VERSION = 'v18.0';
    private readonly BASE_URL = 'https://graph.facebook.com';

    async sendMessage(
        connection: PlatformConnection,
        recipientId: string,
        content: string
    ): Promise<SendMessageResult> {
        const pageAccessToken = connection.accessToken;
        const url = `${this.BASE_URL}/${this.API_VERSION}/me/messages?access_token=${pageAccessToken}`;

        const payload: any = {
            recipient: { id: recipientId },
            message: { text: content },
            messaging_type: "RESPONSE" // Note: HUMAN_AGENT requires Meta approval
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json() as any;

            if (data.error) {
                console.error('Facebook Send Error:', data.error);
                throw new Error(data.error.message || 'Failed to send message to Facebook');
            }

            return {
                externalId: data.message_id
            };
        } catch (error: any) {
            console.error('FacebookService Error:', error);
            throw error;
        }
    }

    async syncConversations(
        connection: PlatformConnection
    ): Promise<any[]> {
        const pageAccessToken = connection.accessToken;
        // Fetch conversations with recent messages and participants (including profile pictures)
        const url = `${this.BASE_URL}/${this.API_VERSION}/me/conversations?fields=id,updated_time,messages.limit(1){message,from,created_time},participants{id,name,picture}&access_token=${pageAccessToken}`;

        try {
            const response = await fetch(url);
            const data = await response.json() as any;

            if (data.error) {
                console.error('Facebook Sync Error:', data.error);
                throw new Error(data.error.message || 'Failed to sync conversations from Facebook');
            }

            return data.data || [];
        } catch (error) {
            console.error('FacebookService Sync Error:', error);
            throw error;
        }
    }

    async getMessageHistory(
        connection: PlatformConnection,
        conversationId: string
    ): Promise<any[]> {
        const pageAccessToken = connection.accessToken;
        const url = `${this.BASE_URL}/${this.API_VERSION}/${conversationId}/messages?fields=id,message,from,created_time,attachments&access_token=${pageAccessToken}`;

        try {
            const response = await fetch(url);
            const data = await response.json() as any;

            if (data.error) {
                throw new Error(data.error.message);
            }

            return data.data || [];
        } catch (error) {
            console.error('FacebookService History Error:', error);
            throw error;
        }
    }
}
