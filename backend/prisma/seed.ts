import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    const email = 'demo@snorq.com'
    const password = 'password123'
    const hashedPassword = await bcrypt.hash(password, 12)

    console.log(`Creating user: ${email}...`)

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: 'Demo User',
            passwordHash: hashedPassword,
            emailVerified: true,
        },
    })

    console.log(`User created/found: ${user.id}`)

    const slug = 'demo-workspace'
    const existingOrg = await prisma.organization.findUnique({ where: { slug } })

    if (!existingOrg) {
        console.log(`Creating organization: ${slug}...`)
        await prisma.organization.create({
            data: {
                name: 'Demo Workspace',
                slug,
                plan: 'FREE',
                ownerId: user.id,
                members: {
                    create: {
                        userId: user.id,
                        role: 'OWNER',
                    },
                },
            },
        })
        console.log('Organization created.')
    } else {
        console.log('Organization already exists.')
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
