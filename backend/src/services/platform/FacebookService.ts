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

        const payload = {
            recipient: { id: recipientId },
            message: { text: content },
            messaging_type: "RESPONSE"
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
}
