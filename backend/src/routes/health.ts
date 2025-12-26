import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const prisma = new PrismaClient();

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.get('/health', async (request, reply) => {
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: process.env.npm_package_version || '0.1.0',
            uptime: process.uptime(),
            services: {
                database: 'unknown',
                redis: 'unknown',
            },
        };

        // Check database connection
        try {
            await prisma.$queryRaw`SELECT 1`;
            health.services.database = 'connected';
        } catch (error) {
            health.services.database = 'disconnected';
            health.status = 'degraded';
        }

        // Check Redis connection
        try {
            if (process.env.REDIS_URL) {
                const redis = new Redis(process.env.REDIS_URL, {
                    maxRetriesPerRequest: 1,
                    lazyConnect: true,
                });
                await redis.ping();
                await redis.quit();
                health.services.redis = 'connected';
            } else {
                health.services.redis = 'not configured';
            }
        } catch (error) {
            health.services.redis = 'disconnected';
            health.status = 'degraded';
        }

        const statusCode = health.status === 'healthy' ? 200 : 503;
        return reply.status(statusCode).send(health);
    });

    // Simple ping endpoint
    fastify.get('/ping', async () => {
        return { pong: true, timestamp: new Date().toISOString() };
    });
};
