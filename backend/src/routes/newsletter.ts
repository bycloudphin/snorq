import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema
const subscribeSchema = z.object({
    email: z.string().email('Invalid email address'),
});

interface SubscribeBody {
    email: string;
}

export async function newsletterRoutes(app: FastifyInstance): Promise<void> {
    app.post('/newsletter/subscribe', async (request: FastifyRequest<{ Body: SubscribeBody }>, reply: FastifyReply) => {
        try {
            const validation = subscribeSchema.safeParse(request.body);
            if (!validation.success) {
                return reply.status(400).send({
                    success: false,
                    error: {
                        code: 400,
                        message: 'Validation error',
                        details: validation.error.errors,
                    },
                });
            }

            const { email } = validation.data;

            // Use upsert to handle duplicate subscriptions (if they already exist, just update updated_at)
            await prisma.newsletterSubscriber.upsert({
                where: { email },
                update: { isActive: true }, // Re-activate if they unsubscribed previously (logic implies they want to sub again)
                create: {
                    email,
                    isActive: true,
                },
            });

            return reply.status(200).send({
                success: true,
                message: 'Successfully subscribed to the newsletter',
            });
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            return reply.status(500).send({
                success: false,
                error: {
                    code: 500,
                    message: 'Internal server error',
                },
            });
        }
    });
}
