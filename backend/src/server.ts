import 'dotenv/config';
import { buildApp } from './app.js';
import { logger } from './utils/logger.js';

import { SocketService } from './socket/SocketService.js';

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

async function start() {
    try {
        const app = await buildApp();

        await app.listen({ port: PORT, host: HOST });

        // Initialize Socket.io
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            'http://localhost:5173',
            'https://snorq.xyz',
            'https://www.snorq.xyz'
        ].filter(Boolean) as string[];

        SocketService.getInstance().initialize(app.server, allowedOrigins);

        logger.info(`🚀 SNORQ API server running on http://${HOST}:${PORT}`);
        logger.info(`📚 Health check: http://${HOST}:${PORT}/api/v1/health`);
        logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    } catch (error) {
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

start();
