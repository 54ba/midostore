// Hybrid database approach - tries Prisma, falls back to mock data
let prismaClient: any;

try {
  // Try to import Prisma client
  const { PrismaClient } = require('@prisma/client');
  prismaClient = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
} catch (error) {
  console.warn('Prisma client not available, using mock database');

  // Fallback to mock database
  class MockPrismaClient {
    log: any;
    product: any;
    user: any;
    order: any;
    review: any;
    supplier: any;
    exchangeRate: any;
    scrapingJob: any;
    productLocalization: any;
    productVariant: any;
    userInteraction: any;
    userPreference: any;
    orderItem: any;
    trendData: any;
    gulfCountry: any;
    feature: any;
    p2PListing: any;
    shareAnalytics: any;
    cryptoPayment: any;
    rewardActivity: any;
    shipment: any;
    trackingInfo: any;
    adCampaign: any;
    adCreative: any;
    userCredits: any;
    creditTransaction: any;
    adPlatform: any;
    productShare: any;
    pricingTier: any;

    constructor() {
      // Initialize mock models with basic functionality
      this.product = {
        findMany: async () => [
          { id: 'mock-1', title: 'Wireless Headphones', price: 29.99, updatedAt: new Date() },
          { id: 'mock-2', title: 'Smart Watch', price: 199.99, updatedAt: new Date() }
        ],
        findUnique: async (options: any) => {
          if (options.where.id === 'mock-1') {
            return { id: 'mock-1', title: 'Wireless Headphones', price: 29.99, updatedAt: new Date() };
          }
          return null;
        },
        findFirst: async () => null,
        create: async (data: any) => ({ id: 'mock-new', ...data.data }),
        update: async (data: any) => ({ id: data.where.id, ...data.data }),
        delete: async (options: any) => ({ id: options.where.id }),
        count: async () => 2,
        aggregate: async () => ({ _count: { id: 2 } }),
        groupBy: async () => []
      };

      this.user = {
        findMany: async () => [],
        findFirst: async () => null,
        findUnique: async () => null,
        create: async (data: any) => ({ id: 'mock-user', ...data.data }),
        update: async (data: any) => ({ id: data.where.id, ...data.data }),
        delete: async (options: any) => ({ id: options.where.id }),
        count: async () => 0
      };

      this.order = {
        findMany: async () => [],
        findFirst: async () => null,
        findUnique: async () => null,
        create: async (data: any) => ({ id: 'mock-order', ...data.data }),
        update: async (data: any) => ({ id: data.where.id, ...data.data }),
        delete: async (options: any) => ({ id: options.where.id }),
        count: async () => 0,
        aggregate: async () => ({ _avg: { total: 0 } })
      };

      this.review = {
        findMany: async () => [
          { id: 'review-1', rating: 5, content: 'Great product!', createdAt: new Date() },
          { id: 'review-2', rating: 4, content: 'Good quality', createdAt: new Date() }
        ],
        findFirst: async () => null,
        findUnique: async () => null,
        create: async (data: any) => ({ id: 'mock-review', ...data.data }),
        update: async (data: any) => ({ id: data.where.id, ...data.data }),
        delete: async (options: any) => ({ id: options.where.id }),
        count: async () => 2
      };

      // Add other required models with basic mock functionality
      this.supplier = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };
      this.exchangeRate = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };
      this.scrapingJob = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };
      this.productLocalization = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };
      this.productVariant = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };
      this.userInteraction = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };
      this.userPreference = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };
      this.orderItem = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };
      this.trendData = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };
      this.gulfCountry = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };
      this.feature = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };
      this.p2PListing = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };
      this.shareAnalytics = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };
      this.cryptoPayment = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };
      this.rewardActivity = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };
      this.shipment = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };
      this.trackingInfo = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };
      this.adCampaign = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };
      this.adCreative = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };
      this.userCredits = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };
      this.creditTransaction = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };
      this.adPlatform = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };
      this.productShare = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };
      this.pricingTier = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null };

      // Add required PrismaClient methods
      this.$on = () => {};
      this.$connect = async () => {};
      this.$disconnect = async () => {};
      this.$executeRaw = async () => ({});
      this.$executeRawUnsafe = async () => ({});
      this.$queryRaw = async () => [];
      this.$queryRawUnsafe = async () => [];
      this.$runCommandRaw = async () => ({});
      this.$transaction = async (fn: any) => fn();
      this.$use = () => this;
      this.$extends = () => this;
    }
  }

  prismaClient = new MockPrismaClient();
}

declare global {
  var __prisma: any;
}

export const prisma = globalThis.__prisma || prismaClient;

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export default prisma;