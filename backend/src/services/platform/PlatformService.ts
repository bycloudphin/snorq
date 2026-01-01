import { PlatformConnection } from '@prisma/client';

export interface SendMessageResult {
    externalId: string;
    // Add other metadata if needed
}

export interface PlatformService {
    sendMessage(
        connection: PlatformConnection,
        recipientId: string,
        content: string
    ): Promise<SendMessageResult>;
}
