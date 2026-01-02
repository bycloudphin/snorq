import { PrismaClient } from '@prisma/client';

// Create a single shared PrismaClient instance with lazy connection
// This avoids connecting to DB immediately at import time
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient(): PrismaClient {
    const client = new PrismaClient({
        log: process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
        // Prevent eager connection - connect only when first query is made
    });

    // Log connection events for debugging
    client.$connect()
        .then(() => console.log('✅ Prisma connected to database'))
        .catch((err) => console.error('❌ Prisma connection error:', err.message));

    return client;
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

// Handle graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

