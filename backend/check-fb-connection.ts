
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const connections = await prisma.platformConnection.findMany({
        where: { platform: 'FACEBOOK' }
    });
    console.log(JSON.stringify(connections, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
