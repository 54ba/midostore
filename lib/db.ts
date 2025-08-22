// Hybrid database approach with real SQLite support and fallback
import { mockPrisma, sqliteClient } from './sqlite-client.js';

let prismaClient: any;
let isRealPrisma = false;

// Initialize database client
async function initializeDatabase() {
  // Try to initialize Prisma client
  try {
    const { PrismaClient } = await import('@prisma/client');
    prismaClient = new PrismaClient();
    isRealPrisma = true;
    console.log('✅ Prisma client initialized successfully');
  } catch (error) {
    console.warn('⚠️ Prisma client not available, trying custom SQLite client...');

    // Try to connect to SQLite database using our custom client (only on server side)
    if (typeof window === 'undefined') {
      try {
        await sqliteClient.connect();
        console.log('✅ Connected to SQLite database via custom client');
        prismaClient = mockPrisma;
        isRealPrisma = false;
      } catch (sqliteError) {
        console.warn('⚠️ Custom SQLite connection failed, using enhanced mock database');
        prismaClient = mockPrisma;
        isRealPrisma = false;
      }
    } else {
      console.warn('⚠️ Using enhanced mock database');
      prismaClient = mockPrisma;
      isRealPrisma = false;
    }
  }

  // If PrismaClient or custom SQLite client failed, use EnhancedMockPrismaClient
  if (!prismaClient) {
    prismaClient = new EnhancedMockPrismaClient();
  }
}

// Initialize immediately
initializeDatabase().catch(console.error);

// Enhanced mock database with real data structure
class EnhancedMockPrismaClient {
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
    // Initialize with realistic mock data
    this.initializeMockData();

    // Add required PrismaClient methods
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
  }

  private initializeMockData() {
    // Initialize with comprehensive mock data
    this.product = this.createProductModel();
    this.user = this.createUserModel();
    this.order = this.createOrderModel();
    this.review = this.createReviewModel();
    this.supplier = this.createSupplierModel();
    this.exchangeRate = this.createExchangeRateModel();
    this.scrapingJob = this.createScrapingJobModel();
    this.productLocalization = this.createProductLocalizationModel();
    this.productVariant = this.createProductVariantModel();
    this.userInteraction = this.createUserInteractionModel();
    this.userPreference = this.createUserPreferenceModel();
    this.orderItem = this.createOrderItemModel();
    this.trendData = this.createTrendDataModel();
    this.gulfCountry = this.createGulfCountryModel();
    this.feature = this.createFeatureModel();
    this.p2PListing = this.createP2PListingModel();
    this.shareAnalytics = this.createShareAnalyticsModel();
    this.cryptoPayment = this.createCryptoPaymentModel();
    this.rewardActivity = this.createRewardActivityModel();
    this.shipment = this.createShipmentModel();
    this.trackingInfo = this.createTrackingInfoModel();
    this.adCampaign = this.createAdCampaignModel();
    this.adCreative = this.createAdCreativeModel();
    this.userCredits = this.createUserCreditsModel();
    this.creditTransaction = this.createCreditTransactionModel();
    this.adPlatform = this.createAdPlatformModel();
    this.productShare = this.createProductShareModel();
    this.pricingTier = this.createPricingTierModel();
  }

  private createProductModel() {
    const mockProducts = [
      {
        id: 'prod-1',
        name: 'Wireless Bluetooth Headphones Pro',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 89.99,
        currency: 'USD',
        category: 'Electronics',
        stock: 150,
        rating: 4.5,
        reviewCount: 127,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prod-2',
        name: 'Smart Fitness Watch',
        description: 'Advanced fitness tracking with heart rate monitor',
        price: 199.99,
        currency: 'USD',
        category: 'Wearables',
        stock: 89,
        rating: 4.3,
        reviewCount: 89,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    return {
      findMany: async (options: any = {}) => {
        let results = [...mockProducts];

        if (options.where) {
          Object.entries(options.where).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              results = results.filter(product => product[key] === value);
            }
          });
        }

        if (options.orderBy) {
          Object.entries(options.orderBy).forEach(([key, order]) => {
            results.sort((a, b) => {
              if (order === 'desc') {
                return b[key] > a[key] ? 1 : -1;
              }
              return a[key] > b[key] ? 1 : -1;
            });
          });
        }

        if (options.take) {
          results = results.slice(0, options.take);
        }

        // Handle includes for relationships
        if (options.include) {
          results = results.map(product => {
            const result = { ...product };

            if (options.include.supplier) {
              result.supplier = {
                id: product.supplierId || 'supplier-1',
                name: 'Mock Supplier',
                companyName: 'Mock Company Ltd.',
                country: 'China',
                city: 'Shenzhen',
                rating: 4.5,
                responseRate: 95.0,
                responseTime: '2-4 hours',
                verified: true,
                goldMember: false,
                createdAt: new Date(),
                updatedAt: new Date()
              };
            }

            return result;
          });
        }

        return results;
      },
      findFirst: async (options: any = {}) => {
        const results = await this.product.findMany(options);
        return results[0] || null;
      },
      findUnique: async (options: any = {}) => {
        const { where } = options;
        const key = Object.keys(where)[0];
        const value = where[key];
        return mockProducts.find(product => product[key] === value) || null;
      },
      create: async (data: any) => {
        const newProduct = {
          id: `prod-${Date.now()}`,
          ...data.data,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        mockProducts.push(newProduct);
        return newProduct;
      },
      update: async (data: any) => {
        const { where, data: updateData } = data;
        const key = Object.keys(where)[0];
        const value = where[key];
        const productIndex = mockProducts.findIndex(product => product[key] === value);

        if (productIndex !== -1) {
          mockProducts[productIndex] = {
            ...mockProducts[productIndex],
            ...updateData,
            updatedAt: new Date()
          };
          return mockProducts[productIndex];
        }
        return null;
      },
      delete: async (options: any) => {
        const { where } = options;
        const key = Object.keys(where)[0];
        const value = where[key];
        const productIndex = mockProducts.findIndex(product => product[key] === value);

        if (productIndex !== -1) {
          const deletedProduct = mockProducts[productIndex];
          mockProducts.splice(productIndex, 1);
          return deletedProduct;
        }
        return null;
      },
      count: async (options: any = {}) => {
        let results = [...mockProducts];

        if (options.where) {
          Object.entries(options.where).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              results = results.filter(product => product[key] === value);
            }
          });
        }

        return results.length;
      }
    };
  }

  private createUserModel() {
    const mockUsers = [
      {
        id: 'user-1',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'user-2',
        email: 'jane@example.com',
        name: 'Jane Smith',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    return {
      findMany: async (options: any = {}) => {
        let results = [...mockUsers];

        if (options.where) {
          Object.entries(options.where).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              results = results.filter(user => user[key] === value);
            }
          });
        }

        return results;
      },
      findFirst: async (options: any = {}) => {
        const results = await this.user.findMany(options);
        return results[0] || null;
      },
      findUnique: async (options: any = {}) => {
        const { where } = options;
        const key = Object.keys(where)[0];
        const value = where[key];
        return mockUsers.find(user => user[key] === value) || null;
      },
      create: async (data: any) => {
        const newUser = {
          id: `user-${Date.now()}`,
          ...data.data,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        mockUsers.push(newUser);
        return newUser;
      },
      update: async (data: any) => {
        const { where, data: updateData } = data;
        const key = Object.keys(where)[0];
        const value = where[key];
        const userIndex = mockUsers.findIndex(user => user[key] === value);

        if (userIndex !== -1) {
          mockUsers[userIndex] = {
            ...mockUsers[userIndex],
            ...updateData,
            updatedAt: new Date()
          };
          return mockUsers[userIndex];
        }
        return null;
      },
      delete: async (options: any) => {
        const { where } = options;
        const key = Object.keys(where)[0];
        const value = where[key];
        const userIndex = mockUsers.findIndex(user => user[key] === value);

        if (userIndex !== -1) {
          const deletedUser = mockUsers[userIndex];
          mockUsers.splice(userIndex, 1);
          return deletedUser;
        }
        return null;
      }
    };
  }

  private createOrderModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `order-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id })
    };
  }

  private createReviewModel() {
    const mockReviews = [
      {
        id: 'review-1',
        productId: 'prod-1',
        userId: 'user-1',
        rating: 5,
        comment: 'Excellent headphones! Great sound quality.',
        verified: true,
        createdAt: new Date()
      },
      {
        id: 'review-2',
        productId: 'prod-2',
        userId: 'user-2',
        rating: 4,
        comment: 'Good fitness watch, tracks everything I need.',
        verified: true,
        createdAt: new Date()
      }
    ];

    return {
      findMany: async (options: any = {}) => {
        let results = [...mockReviews];

        if (options.where) {
          Object.entries(options.where).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              if (typeof value === 'object' && value.not !== null) {
                results = results.filter(review => review[key] !== null);
              } else {
                results = results.filter(review => review[key] === value);
              }
            }
          });
        }

        if (options.orderBy) {
          Object.entries(options.orderBy).forEach(([key, order]) => {
            results.sort((a, b) => {
              if (order === 'desc') {
                return b[key] > a[key] ? 1 : -1;
              }
              return a[key] > b[key] ? 1 : -1;
            });
          });
        }

        if (options.take) {
          results = results.slice(0, options.take);
        }

        return results;
      },
      findFirst: async (options: any = {}) => {
        const results = await this.review.findMany(options);
        return results[0] || null;
      },
      findUnique: async (options: any = {}) => {
        const { where } = options;
        const key = Object.keys(where)[0];
        const value = where[key];
        return mockReviews.find(review => review[key] === value) || null;
      },
      create: async (data: any) => {
        const newReview = {
          id: `review-${Date.now()}`,
          ...data.data,
          createdAt: new Date()
        };
        mockReviews.push(newReview);
        return newReview;
      },
      update: async (data: any) => {
        const { where, data: updateData } = data;
        const key = Object.keys(where)[0];
        const value = where[key];
        const reviewIndex = mockReviews.findIndex(review => review[key] === value);

        if (reviewIndex !== -1) {
          mockReviews[reviewIndex] = {
            ...mockReviews[reviewIndex],
            ...updateData
          };
          return mockReviews[reviewIndex];
        }
        return null;
      },
      delete: async (options: any) => {
        const { where } = options;
        const key = Object.keys(where)[0];
        const value = where[key];
        const reviewIndex = mockReviews.findIndex(review => review[key] === value);

        if (reviewIndex !== -1) {
          const deletedReview = mockReviews[reviewIndex];
          mockReviews.splice(reviewIndex, 1);
          return deletedReview;
        }
        return null;
      },
      count: async (options: any = {}) => {
        let results = [...mockReviews];

        if (options.where) {
          Object.entries(options.where).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              if (typeof value === 'object' && value.not !== null) {
                results = results.filter(review => review[key] !== null);
              } else {
                results = results.filter(review => review[key] === value);
              }
            }
          });
        }

        return results.length;
      }
    };
  }

  private createSupplierModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `supplier-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id }),
      upsert: async (options: any) => {
        const { where, update, create } = options;
        const { externalId } = where;

        // For mock purposes, always create a new supplier
        const newSupplier = {
          id: `supplier-${Date.now()}`,
          externalId,
          ...create,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        return newSupplier;
      }
    };
  }

  private createExchangeRateModel() {
    const mockRates = [
      {
        id: 'rate-1',
        currency: 'USD',
        rate: 1.0,
        isStable: true,
        volatility: 0.02,
        lastUpdated: new Date()
      },
      {
        id: 'rate-2',
        currency: 'EUR',
        rate: 0.85,
        isStable: true,
        volatility: 0.03,
        lastUpdated: new Date()
      },
      {
        id: 'rate-3',
        currency: 'AED',
        rate: 3.67,
        isStable: true,
        volatility: 0.01,
        lastUpdated: new Date()
      },
      {
        id: 'rate-4',
        currency: 'SAR',
        rate: 3.75,
        isStable: true,
        volatility: 0.01,
        lastUpdated: new Date()
      },
      {
        id: 'rate-5',
        currency: 'KWD',
        rate: 0.30,
        isStable: true,
        volatility: 0.01,
        lastUpdated: new Date()
      },
      {
        id: 'rate-6',
        currency: 'BHD',
        rate: 0.38,
        isStable: true,
        volatility: 0.01,
        lastUpdated: new Date()
      },
      {
        id: 'rate-7',
        currency: 'QAR',
        rate: 3.64,
        isStable: true,
        volatility: 0.01,
        lastUpdated: new Date()
      },
      {
        id: 'rate-8',
        currency: 'OMR',
        rate: 0.38,
        isStable: true,
        volatility: 0.01,
        lastUpdated: new Date()
      }
    ];

    return {
      findMany: async (options: any = {}) => {
        let results = [...mockRates];

        if (options.where) {
          Object.entries(options.where).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              if (typeof value === 'object' && value.not !== null) {
                results = results.filter(rate => rate[key] !== null);
              } else {
                results = results.filter(rate => rate[key] === value);
              }
            }
          });
        }

        return results;
      },
      findFirst: async (options: any = {}) => {
        const results = await this.exchangeRate.findMany(options);
        return results[0] || null;
      },
      findUnique: async (options: any = {}) => {
        const { where } = options;
        const key = Object.keys(where)[0];
        const value = where[key];
        return mockRates.find(rate => rate[key] === value) || null;
      },
      upsert: async (options: any) => {
        const { where, update, create } = options;
        const { currency } = where;

        const existingRateIndex = mockRates.findIndex(rate => rate.currency === currency);

        if (existingRateIndex !== -1) {
          // Update existing rate
          mockRates[existingRateIndex] = {
            ...mockRates[existingRateIndex],
            ...update,
            lastUpdated: new Date()
          };
          return mockRates[existingRateIndex];
        } else {
          // Create new rate
          const newRate = {
            id: `rate-${Date.now()}`,
            currency,
            ...create,
            lastUpdated: new Date()
          };
          mockRates.push(newRate);
          return newRate;
        }
      }
    };
  }

  private createScrapingJobModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `job-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id })
    };
  }

  private createProductLocalizationModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `loc-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id })
    };
  }

  private createProductVariantModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `variant-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id })
    };
  }

  private createUserInteractionModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `interaction-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id })
    };
  }

  private createUserPreferenceModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `pref-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id })
    };
  }

  private createOrderItemModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `item-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id })
    };
  }

  private createTrendDataModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `trend-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id })
    };
  }

  private createGulfCountryModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `country-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id })
    };
  }

  private createFeatureModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `feature-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id })
    };
  }

  private createP2PListingModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `listing-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id })
    };
  }

  private createShareAnalyticsModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `share-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id })
    };
  }

  private createCryptoPaymentModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `crypto-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id })
    };
  }

  private createRewardActivityModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `reward-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id })
    };
  }

  private createShipmentModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `shipment-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id })
    };
  }

  private createTrackingInfoModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `tracking-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id })
    };
  }

  private createAdCampaignModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `campaign-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id }),
      count: async () => 0
    };
  }

  private createAdCreativeModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `creative-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id }),
      count: async () => 0
    };
  }

  private createUserCreditsModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `credits-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id }),
      count: async () => 0
    };
  }

  private createCreditTransactionModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `transaction-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id }),
      count: async () => 0
    };
  }

  private createAdPlatformModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `platform-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id }),
      count: async () => 0
    };
  }

  private createProductShareModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `share-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id }),
      count: async () => 0
    };
  }

  private createPricingTierModel() {
    return {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (data: any) => ({ id: `tier-${Date.now()}`, ...data.data }),
      update: async (data: any) => ({ id: data.where.id, ...data.data }),
      delete: async (options: any) => ({ id: options.where.id }),
      count: async () => 0
    };
  }
}

if (!prismaClient) {
  prismaClient = new EnhancedMockPrismaClient();
}

declare global {
  var __prisma: any;
}

export const prisma = globalThis.__prisma || prismaClient;

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

// Export database status
export const isRealDatabase = isRealPrisma || (prismaClient === mockPrisma);
export const databaseType = isRealPrisma ? 'Prisma SQLite' : (prismaClient === mockPrisma ? 'Custom SQLite' : 'Enhanced Mock');

export default prisma;