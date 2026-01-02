import 'dotenv/config';
import { buildApp } from './app.js';
import { logger } from './utils/logger.js';

import { SocketService } from './socket/SocketService.js';

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Check required environment variables
function checkEnvVars() {
    const required = ['JWT_SECRET'];
    const optional = ['DATABASE_URL', 'REDIS_URL', 'RESEND_API_KEY', 'FRONTEND_URL'];

    console.log('=== Environment Check ===');
    console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    console.log(`PORT: ${PORT}`);
    console.log(`HOST: ${HOST}`);

    let hasErrors = false;

    for (const key of required) {
        if (!process.env[key]) {
            console.error(`❌ MISSING REQUIRED: ${key}`);
            hasErrors = true;
        } else {
            console.log(`✅ ${key}: configured`);
        }
    }

    for (const key of optional) {
        if (!process.env[key]) {
            console.log(`⚠️  ${key}: not set (optional)`);
        } else {
            console.log(`✅ ${key}: configured`);
        }
    }

    if (hasErrors) {
        console.error('Some required environment variables are missing!');
        // Don't exit - let the app try to start anyway
    }

    console.log('=========================\n');
}

async function start() {
    try {
        console.log('SNORQ Backend starting...');
        checkEnvVars();

        const app = await buildApp();
        console.log('Fastify app built successfully');

        console.log(`[BOOT] Attempting to listen on ${HOST}:${PORT}...`);
        await app.listen({ port: PORT, host: HOST });
        console.log(`✅ [BOOT] Server is now listening on http://${HOST}:${PORT}`);

        // Initialize Socket.io
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            'http://localhost:5173',
            'https://localhost:5173',
            'https://snorq.xyz',
            'https://www.snorq.xyz'
        ].filter(Boolean) as string[];

        SocketService.getInstance().initialize(app.server, allowedOrigins);

        logger.info(`🚀 SNORQ API server running on http://${HOST}:${PORT}`);
        logger.info(`📚 Health check: http://${HOST}:${PORT}/api/v1/health`);
        logger.info(`🏥 Alive check: http://${HOST}:${PORT}/api/v1/alive`);
        logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully...');
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    logger.error('Unhandled Rejection:', reason);
});

start();

