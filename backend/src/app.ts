import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import { logger } from './utils/logger.js';
import { healthRoutes } from './routes/health.js';
import { authRoutes } from './routes/auth.js';
import { metaRoutes } from './routes/meta.js';
import { newsletterRoutes } from './routes/newsletter.js';
import { conversationRoutes } from './routes/conversations.js';

export async function buildApp(): Promise<FastifyInstance> {
    const app = Fastify({
        logger: false, // We use our own logger
        trustProxy: true,
    });

    // Security headers
    await app.register(helmet, {
        contentSecurityPolicy: process.env.NODE_ENV === 'production',
    });

    // CORS
    await app.register(cors, {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });

    // Cookies
    await app.register(cookie, {
        secret: process.env.JWT_SECRET,
        hook: 'onRequest',
        parseOptions: {
            secure: process.env.NODE_ENV === 'production' || process.env.FRONTEND_URL?.includes('https'),
            sameSite: 'none', // Required for cross-site cookie usage
            path: '/',
            httpOnly: true
        }
    });

    // Rate limiting
    await app.register(rateLimit, {
        max: 100,
        timeWindow: '1 minute',
    });

    // Request logging
    app.addHook('onRequest', async (request) => {
        logger.debug({
            method: request.method,
            url: request.url,
            ip: request.ip,
        }, 'Incoming request');
    });

    // Response logging
    app.addHook('onResponse', async (request, reply) => {
        logger.debug({
            method: request.method,
            url: request.url,
            statusCode: reply.statusCode,
            responseTime: reply.elapsedTime,
        }, 'Request completed');
    });

    // Register routes
    await app.register(healthRoutes, { prefix: '/api/v1' });
    await app.register(authRoutes, { prefix: '/api/v1' });
    await app.register(metaRoutes, { prefix: '/api/v1' });
    await app.register(newsletterRoutes, { prefix: '/api/v1' });
    await app.register(conversationRoutes, { prefix: '/api/v1' });

    // Error handler
    app.setErrorHandler((error, request, reply) => {
        logger.error({
            error: error.message,
            stack: error.stack,
            url: request.url,
            method: request.method,
        }, 'Request error');

        const statusCode = error.statusCode || 500;

        reply.status(statusCode).send({
            success: false,
            error: {
                code: statusCode,
                message: error.message || 'Internal Server Error',
            },
            timestamp: new Date().toISOString(),
        });
    });

    // 404 handler
    app.setNotFoundHandler((request, reply) => {
        reply.status(404).send({
            success: false,
            error: {
                code: 404,
                message: `Route ${request.method} ${request.url} not found`,
            },
            timestamp: new Date().toISOString(),
        });
    });

    return app;
}
