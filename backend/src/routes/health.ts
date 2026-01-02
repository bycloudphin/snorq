import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../utils/db.js';
import Redis from 'ioredis';


export const healthRoutes: FastifyPluginAsync = async (fastify) => {
    // Simple alive endpoint - bypasses all dependencies
    // This is used by Railway for basic healthcheck
    fastify.get('/alive', async (_request, reply) => {
        return reply.status(200).send({
            status: 'alive',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
        });
    });

    // Simple ping endpoint - also bypasses dependencies
    fastify.get('/ping', async () => {
        return { pong: true, timestamp: new Date().toISOString() };
    });

    // Deep health check - checks all dependencies
    fastify.get('/health', async (_request, reply) => {
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: process.env.npm_package_version || '1.1.0',
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            services: {
                database: 'unknown' as string,
                redis: 'unknown' as string,
            },
        };

        // Check database connection with timeout
        try {
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Database timeout')), 5000)
            );
            await Promise.race([
                prisma.$queryRaw`SELECT 1`,
                timeoutPromise
            ]);
            health.services.database = 'connected';
        } catch (error) {
            console.error('Database health check failed:', error);
            health.services.database = 'disconnected';
            health.status = 'degraded';
        }

        // Check Redis connection with timeout
        try {
            if (process.env.REDIS_URL) {
                const redis = new Redis(process.env.REDIS_URL, {
                    maxRetriesPerRequest: 1,
                    lazyConnect: true,
                    connectTimeout: 5000,
                });
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Redis timeout')), 5000)
                );
                await Promise.race([redis.ping(), timeoutPromise]);
                await redis.quit();
                health.services.redis = 'connected';
            } else {
                health.services.redis = 'not configured';
            }
        } catch (error) {
            console.error('Redis health check failed:', error);
            health.services.redis = 'disconnected';
            // Redis is optional, don't degrade status
        }

        // Return 200 even if degraded - Railway should use /alive for basic healthcheck
        return reply.status(200).send(health);
    });
};
