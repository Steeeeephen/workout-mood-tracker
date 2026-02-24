import { prisma } from '../src/lib/prisma.js';
import { faker } from '@faker-js/faker';
import bcrypt from "bcrypt";


async function main() {

    // Hash the password once for all users
    const hashedPassword = await bcrypt.hash('12345', 10);

    // Clear existing data (optional)
    await prisma.entry.deleteMany();
    await prisma.user.deleteMany();

    const users = [];
    for (let i = 0; i < 20; i++) {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                password: hashedPassword,
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName()
            },
        });
        users.push(user);
    }

    // Create 20 random entries across users
    const entryTypes = ['PRE_WORKOUT', 'WORKOUT', 'POST_WORKOUT', 'MISC'];

    for (let i = 0; i < 20; i++) {
        await prisma.entry.create({
            data: {
                user_id: faker.helpers.arrayElement(users).id,
                entry_type: faker.helpers.arrayElement(entryTypes),
                entry_datetime: faker.date.between({
                    from: '2026-02-01',
                    to: '2026-02-08'
                }),
                mood: faker.number.int({ min: 1, max: 5 }),
                content: faker.lorem.sentence(),
                details: {
                    duration: faker.number.int({ min: 30, max: 120 }),
                    exercises: faker.helpers.arrayElements(['squats', 'bench press', 'deadlift', 'rows'], 2)
                },
                created_at: faker.date.recent({ days: 30 }) // Random date within last 30 days
            }
        });
    }

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });