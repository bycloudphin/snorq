
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Checking Conversations ---');
    const conversations = await prisma.conversation.findMany({
        include: { messages: true }
    });
    console.log(JSON.stringify(conversations, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
