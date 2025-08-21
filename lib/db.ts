// Temporary mock for build purposes - will be replaced with real Prisma client in production
class MockPrismaClient {
    log: any;
    scrapingJob: any;
    product: any;
    productLocalization: any;
    exchangeRate: any;
    supplier: any;
    userInteraction: any;
    user: any;
    order: any;
    review: any;
    trendData: any;

    constructor(options?: any) {
        this.log = options?.log || [];
        this.scrapingJob = {
            create: async (data: any) => ({ id: 'mock-id', ...data.data }),
            update: async (data: any) => ({ id: data.where.id, ...data.data }),
            findMany: async (options: any) => [],
            count: async (options: any) => 0,
        };
        this.product = {
            create: async (data: any) => ({ id: 'mock-product-id', ...data.data }),
            findMany: async (options: any) => [],
            findUnique: async (options: any) => null,
            update: async (data: any) => ({ id: data.where.id, ...data.data }),
            count: async (options: any) => 0,
            upsert: async (data: any) => ({ id: data.where?.id || 'mock-id', ...data.create }),
            aggregate: async (options: any) => ({ _avg: { rating: 0, profitMargin: 0, total: 0 }, _count: { id: 0 } }),
            groupBy: async (options: any) => [],
        };
        this.productLocalization = {
            upsert: async (data: any) => ({ id: 'mock-localization-id', ...data.create }),
            create: async (data: any) => ({ id: 'mock-localization-id', ...data.data }),
        };
        this.exchangeRate = {
            findUnique: async (options: any) => null,
            upsert: async (data: any) => ({ id: 'mock-rate-id', ...data.create }),
        };
        this.supplier = {
            upsert: async (data: any) => ({ id: 'mock-supplier-id', ...data.create }),
        };
        this.userInteraction = {
            upsert: async (data: any) => ({ id: 'mock-interaction-id', ...data.create }),
            groupBy: async (options: any) => [],
            findMany: async (options: any) => [],
        };
        this.user = {
            findMany: async (options: any) => [],
            count: async (options: any) => 0,
        };
        this.order = {
            findMany: async (options: any) => [],
            count: async (options: any) => 0,
            aggregate: async (options: any) => ({ _avg: { total: 0 } }),
        };
        this.review = {
            findMany: async (options: any) => [],
            count: async (options: any) => 0,
            createMany: async (data: any) => ({ count: data.data.length }),
        };
        this.trendData = {
            upsert: async (data: any) => ({ id: data.where?.id || 'mock-trend-id', ...data.create }),
            findMany: async (options: any) => [],
        };
    }
}

declare global {
    var __prisma: MockPrismaClient | undefined;
}

export const prisma = globalThis.__prisma || new MockPrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
    globalThis.__prisma = prisma;
}

export default prisma;