const { PrismaClient } = require('@prisma/client');

async function main() {
    console.log('⏳ Initializing Prisma Client...');
    const prisma = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });

    try {
        console.log('⏳ Attempting a simple query (SELECT 1)...');
        const result = await prisma.$queryRaw`SELECT 1 as result`;
        console.log('✅ Success! Prisma Client connected and queried successfully.');
        console.log('📊 Result:', result);
    } catch (err) {
        console.error('❌ Prisma Client failed to connect:');
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
