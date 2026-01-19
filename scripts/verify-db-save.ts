import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const lastEntry = await prisma.ecomDb.findFirst({
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (lastEntry) {
            console.log('✅ Found latest entry in ecom_db:');
            console.log(JSON.stringify(lastEntry, null, 2));
        } else {
            console.log('⚠️ No entries found in ecom_db.');
        }
    } catch (error) {
        console.error('❌ Error verifying ecom_db:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
