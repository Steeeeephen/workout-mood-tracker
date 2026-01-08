import { prisma } from './src/lib/prisma.js'

async function main() {
    const user = await prisma.user.create({
        data: {
            first_name: 'Stephen',
            last_name: 'Zalalas',
            email: 'stephen@stephen.com',
            password: '12345'
        }
    })
    console.log('Created user:', user)
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