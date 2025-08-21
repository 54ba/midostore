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
    userPreference: any;
    order: any;
    orderItem: any;
    review: any;
    trendData: any;
    gulfCountry: any;
    productVariant: any;
    feature: any;

    // Add required PrismaClient methods
    $on: any;
    $connect: any;
    $disconnect: any;
    $executeRaw: any;
    $executeRawUnsafe: any;
    $queryRaw: any;
    $queryRawUnsafe: any;
    $runCommandRaw: any;
    $transaction: any;
    $use: any;
    $extends: any;

    // Add index signature for symbol type to satisfy PrismaClient requirements
    [key: symbol]: any;

    constructor(options?: any) {
        this.log = options?.log || [];

        // Initialize required PrismaClient methods
        this.$on = () => { };
        this.$connect = async () => { };
        this.$disconnect = async () => { };
        this.$executeRaw = async () => ({});
        this.$executeRawUnsafe = async () => ({});
        this.$queryRaw = async () => [];
        this.$queryRawUnsafe = async () => [];
        this.$runCommandRaw = async () => ({});
        this.$transaction = async (fn: any) => fn();
        this.$use = () => this;
        this.$extends = () => this;

        this.scrapingJob = {
            create: async (data: any) => ({ id: 'mock-id', ...data.data }),
            update: async (data: any) => ({ id: data.where.id, ...data.data }),
            updateMany: async (data: any) => ({ count: 1 }),
            findMany: async (options: any) => [],
            findFirst: async (options: any) => null,
            findUnique: async (options: any) => null,
            delete: async (options: any) => ({ id: options.where.id }),
            count: async (options: any) => 0,
            aggregate: async (options: any) => ({ _count: { id: 0 } }),
            groupBy: async (options: any) => [],
        };
        this.product = {
            create: async (data: any) => ({ id: 'mock-product-id', ...data.data }),
            findMany: async (options: any) => [
                {
                    id: 'mock-product-1',
                    title: 'Wireless Headphones Pro',
                    updatedAt: new Date()
                },
                {
                    id: 'mock-product-2',
                    title: 'Smart Fitness Watch',
                    updatedAt: new Date()
                }
            ],
            findUnique: async (options: any) => null,
            findFirst: async (options: any) => null,
            update: async (data: any) => ({ id: data.where.id, ...data.data }),
            updateMany: async (data: any) => ({ count: 1 }),
            delete: async (options: any) => ({ id: options.where.id }),
            count: async (options: any) => 0,
            upsert: async (data: any) => ({ id: data.where?.id || 'mock-id', ...data.create }),
            aggregate: async (options: any) => ({ _avg: { rating: 0, profitMargin: 0, total: 0 }, _count: { id: 0 } }),
            groupBy: async (options: any) => [],
        };
        this.productLocalization = {
            upsert: async (data: any) => ({ id: 'mock-localization-id', ...data.create }),
            create: async (data: any) => ({ id: 'mock-localization-id', ...data.data }),
            findMany: async (options: any) => [],
            findFirst: async (options: any) => null,
            findUnique: async (options: any) => null,
            update: async (data: any) => ({ id: data.where.id, ...data.data }),
            delete: async (options: any) => ({ id: options.where.id }),
            count: async (options: any) => 0,
        };
        this.exchangeRate = {
            findUnique: async (options: any) => null,
            findFirst: async (options: any) => null,
            findMany: async (options: any) => [],
            upsert: async (data: any) => ({ id: 'mock-rate-id', ...data.create }),
            create: async (data: any) => ({ id: 'mock-rate-id', ...data.data }),
            update: async (data: any) => ({ id: data.where.id, ...data.data }),
            delete: async (options: any) => ({ id: options.where.id }),
            count: async (options: any) => 0,
        };
        this.supplier = {
            upsert: async (data: any) => ({ id: 'mock-supplier-id', ...data.create }),
            create: async (data: any) => ({ id: 'mock-supplier-id', ...data.data }),
            findMany: async (options: any) => [],
            findFirst: async (options: any) => null,
            findUnique: async (options: any) => null,
            update: async (data: any) => ({ id: data.where.id, ...data.data }),
            delete: async (options: any) => ({ id: options.where.id }),
            count: async (options: any) => 0,
        };
        this.userInteraction = {
            upsert: async (data: any) => ({ id: 'mock-interaction-id', ...data.create }),
            create: async (data: any) => ({ id: 'mock-interaction-id', ...data.data }),
            groupBy: async (options: any) => [],
            findMany: async (options: any) => [],
            findFirst: async (options: any) => null,
            findUnique: async (options: any) => null,
            update: async (data: any) => ({ id: data.where.id, ...data.data }),
            delete: async (options: any) => ({ id: options.where.id }),
            count: async (options: any) => 0,
        };
        this.user = {
            findMany: async (options: any) => [],
            findFirst: async (options: any) => null,
            findUnique: async (options: any) => null,
            create: async (data: any) => ({ id: 'mock-user-id', ...data.data }),
            update: async (data: any) => ({ id: data.where.id, ...data.data }),
            delete: async (options: any) => ({ id: options.where.id }),
            count: async (options: any) => 0,
            upsert: async (data: any) => ({ id: data.where?.id || 'mock-user-id', ...data.create }),
        };
        this.userPreference = {
            findMany: async (options: any) => [],
            findFirst: async (options: any) => null,
            findUnique: async (options: any) => null,
            create: async (data: any) => ({ id: 'mock-user-preference-id', ...data.data }),
            update: async (data: any) => ({ id: data.where.id, ...data.data }),
            delete: async (options: any) => ({ id: options.where.id }),
            count: async (options: any) => 0,
            upsert: async (data: any) => ({ id: data.where?.id || 'mock-user-preference-id', ...data.create }),
        };
        this.order = {
            findMany: async (options: any) => [],
            findFirst: async (options: any) => null,
            findUnique: async (options: any) => null,
            create: async (data: any) => ({ id: 'mock-order-id', ...data.data }),
            update: async (data: any) => ({ id: data.where.id, ...data.data }),
            updateMany: async (data: any) => ({ count: 1 }),
            delete: async (options: any) => ({ id: options.where.id }),
            count: async (options: any) => 0,
            aggregate: async (options: any) => ({ _avg: { total: 0 } }),
            upsert: async (data: any) => ({ id: data.where?.id || 'mock-order-id', ...data.create }),
        };
        this.orderItem = {
            findMany: async (options: any) => [],
            findFirst: async (options: any) => null,
            findUnique: async (options: any) => null,
            create: async (data: any) => ({ id: 'mock-order-item-id', ...data.data }),
            update: async (data: any) => ({ id: data.where.id, ...data.data }),
            delete: async (options: any) => ({ id: options.where.id }),
            count: async (options: any) => 0,
            groupBy: async (options: any) => {
                // Mock groupBy response for analytics
                return [
                    {
                        productId: 'mock-product-1',
                        _sum: { quantity: 10, price: 299.99 },
                        _count: { _all: 5 }
                    },
                    {
                        productId: 'mock-product-2',
                        _sum: { quantity: 8, price: 199.99 },
                        _count: { _all: 3 }
                    }
                ];
            },
            upsert: async (data: any) => ({ id: data.where?.id || 'mock-order-item-id', ...data.create }),
        };
        this.review = {
            findMany: async (options: any) => {
                // Handle include option for mock data
                if (options?.include?.product) {
                    return [
                        {
                            id: 'mock-review-1',
                            product: {
                                id: 'mock-product-1',
                                title: 'Wireless Headphones Pro',
                                updatedAt: new Date()
                            },
                            createdAt: new Date()
                        },
                        {
                            id: 'mock-review-2',
                            product: {
                                id: 'mock-product-2',
                                title: 'Smart Fitness Watch',
                                updatedAt: new Date()
                            },
                            createdAt: new Date()
                        }
                    ];
                }
                return [];
            },
            findFirst: async (options: any) => null,
            findUnique: async (options: any) => null,
            create: async (data: any) => ({ id: 'mock-review-id', ...data.data }),
            update: async (data: any) => ({ id: data.where.id, ...data.data }),
            updateMany: async (data: any) => ({ count: 1 }),
            delete: async (options: any) => ({ id: options.where.id }),
            count: async (options: any) => 0,
            createMany: async (data: any) => ({ count: data.data.length }),
            upsert: async (options: any) => ({ id: options.where?.id || 'mock-review-id', ...options.create }),
        };
        this.trendData = {
            upsert: async (data: any) => ({ id: data.where?.id || 'mock-trend-id', ...data.create }),
            findMany: async (options: any) => [],
            findFirst: async (options: any) => null,
            findUnique: async (options: any) => null,
            create: async (data: any) => ({ id: 'mock-trend-id', ...data.data }),
            update: async (data: any) => ({ id: data.where.id, ...data.data }),
            delete: async (options: any) => ({ id: options.where.id }),
            count: async (options: any) => 0,
            aggregate: async (options: any) => ({ _count: { id: 0 } }),
            groupBy: async (options: any) => [],
        };
        this.gulfCountry = {
            upsert: async (data: any) => ({ id: 'mock-gulf-country-id', ...data.create }),
            create: async (data: any) => ({ id: 'mock-gulf-country-id', ...data.data }),
            findMany: async (options: any) => [],
            findFirst: async (options: any) => null,
            findUnique: async (options: any) => null,
            update: async (data: any) => ({ id: data.where.id, ...data.data }),
            delete: async (options: any) => ({ id: options.where.id }),
            count: async (options: any) => 0,
        };
        this.productVariant = {
            upsert: async (data: any) => ({ id: 'mock-product-variant-id', ...data.create }),
            create: async (data: any) => ({ id: 'mock-product-variant-id', ...data.data }),
            findMany: async (options: any) => [],
            findFirst: async (options: any) => null,
            findUnique: async (options: any) => null,
            update: async (data: any) => ({ id: data.where.id, ...data.data }),
            delete: async (options: any) => ({ id: options.where.id }),
            count: async (options: any) => 0,
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