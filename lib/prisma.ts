import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma || (process.env.DATABASE_URL ? new PrismaClient() : undefined);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
