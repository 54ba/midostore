import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
console.log('Available models:', Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_')));
// Check Supplier unique fields
console.log('Supplier methods:', Object.keys((prisma as any).supplier || {}));
prisma.$disconnect();
