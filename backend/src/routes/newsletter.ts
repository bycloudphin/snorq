import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../utils/db.js';
import { z } from 'zod';

import { Resend } from 'resend';


// Initialize Resend safely
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Validation schema
const subscribeSchema = z.object({
    email: z.string().email('Invalid email address'),
});

interface SubscribeBody {
    email: string;
}

export async function newsletterRoutes(app: FastifyInstance): Promise<void> {
    app.post('/waitlist/join', async (request: FastifyRequest<{ Body: SubscribeBody }>, reply: FastifyReply) => {
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

            // Use upsert to handle duplicate subscriptions
            await prisma.newsletterSubscriber.upsert({
                where: { email },
                update: { isActive: true },
                create: {
                    email,
                    isActive: true,
                },
            });

            // Send Welcome Email
            if (resend) {
                try {
                    await resend.emails.send({
                        from: 'SNORQ <welcome@snorq.xyz>', // Update with verified domain later
                        to: email,
                        subject: 'Welcome to the SNORQ Waiting List! 🚀',
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                <h1 style="color: #10b981;">Welcome to SNORQ!</h1>
                                <p>Thanks for joining our waiting list. We're building the future of unified messaging, and we're thrilled to have you with us.</p>
                                <p>We'll notify you as soon as we launch. In the meantime, feel free to reply to this email if you have any questions.</p>
                                <br/>
                                <p>Best,</p>
                                <p>The SNORQ Team</p>
                            </div>
                        `
                    });
                } catch (emailError) {
                    // Log but don't fail the request
                    console.error('Failed to send welcome email:', emailError);
                }
            } else {
                console.warn('RESEND_API_KEY is missing. Skipping welcome email.');
            }

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
