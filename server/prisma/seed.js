import { prisma } from '../src/lib/prisma.js';
import { faker } from '@faker-js/faker';


async function main() {
    console.log('Start seeding...');

    // Create 3 test users
    const users = [];
    for (let i = 0; i < 3; i++) {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                password: faker.internet.password(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName()
            },
        });
        users.push(user);
        console.log(`Created user: ${user.name}`);
    }

    // Create 20 random entries across users
    const entryTypes = ['PRE_WORKOUT', 'WORKOUT', 'POST_WORKOUT', 'MISC'];

    for (let i = 0; i < 20; i++) {
        await prisma.entry.create({
            data: {
                user_id: faker.helpers.arrayElement(users).id,
                entry_type: faker.helpers.arrayElement(entryTypes),
                mood_rating: faker.number.int({ min: 1, max: 5 }),
                content: faker.lorem.sentence(),
                details: {
                    duration: faker.number.int({ min: 30, max: 120 }),
                    exercises: faker.helpers.arrayElements(['squats', 'bench press', 'deadlift', 'rows'], 2)
                },
                created_at: faker.date.recent({ days: 30 }) // Random date within last 30 days
            }
        });
    }

    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });