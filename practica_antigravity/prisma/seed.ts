import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    const roles = ['ADMIN', 'EMPRENDEDOR', 'MENTOR', 'CLIENTE'];

    for (const nombre of roles) {
        const role = await prisma.rol.upsert({
            where: { nombre },
            update: {},
            create: { nombre },
        });
        console.log(`Created role: ${role.nombre}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
