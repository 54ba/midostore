import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

export interface Product {
    _id?: ObjectId;
    externalId: string;
    source: string;
    title: string;
    description: string;
    shortDescription?: string;
    price: number;
    originalPrice: number;
    currency: string;
    images: string[];
    category: string;
    subcategory: string;
    tags: string[];
    rating: number;
    reviewCount: number;
    soldCount: number;
    minOrderQuantity: number;
    maxOrderQuantity: number;
    shippingWeight: number;
    shippingDimensions: string;
    profitMargin: number;
    gulfPrice: number;
    gulfCurrency: string;
    brand?: string;
    model?: string;
    sku: string;
    stockQuantity: number;
    isActive: boolean;
    supplierId?: string;
    createdAt: Date;
    updatedAt: Date;
    lastScraped: Date;
}

export interface Category {
    _id?: ObjectId;
    id: string;
    name: string;
    nameAr?: string;
    description: string;
    slug: string;
    image: string;
    isActive: boolean;
    sortOrder: number;
    subcategories: string[];
    productCount: number;
    featuredCount: number;
    isFeatured: boolean;
    isTrending: boolean;
    isNew: boolean;
    gradient: string;
}

export interface Subcategory {
    _id?: ObjectId;
    id: string;
    name: string;
    description: string;
    slug: string;
    categoryId: string;
    image: string;
    isActive: boolean;
    productCount: number;
}

export interface Supplier {
    _id?: ObjectId;
    id: string;
    name: string;
    description: string;
    rating: number;
    verified: boolean;
    goldMember: boolean;
    country: string;
    responseTime: number;
    minOrderAmount: number;
    logo?: string;
    website?: string;
    contactEmail?: string;
    contactPhone?: string;
    productCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Review {
    _id?: ObjectId;
    id: string;
    productId: string;
    productTitle: string;
    productImage: string;
    productPrice: number;
    productOriginalPrice: number;
    productCategory: string;
    reviewerName: string;
    rating: number;
    title?: string;
    content: string;
    helpful: number;
    verified: boolean;
    source: string;
    createdAt: Date;
}

export interface User {
    _id?: ObjectId;
    id: string;
    email: string;
    name?: string;
    role: string;
    avatar?: string;
    phone?: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other';
    address?: Address;
    preferences?: UserPreference;
    businessName?: string;
    businessType?: string;
    taxId?: string;
    isVerified: boolean;
    kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: Date;
    updatedAt: Date;
}

export interface Address {
    _id?: ObjectId;
    userId: string;
    type: 'BILLING' | 'SHIPPING' | 'BOTH';
    isDefault: boolean;
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
}

export interface UserPreference {
    _id?: ObjectId;
    userId: string;
    language: string;
    currency: string;
    timezone: string;
    notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
    };
    marketing: {
        email: boolean;
        sms: boolean;
        push: boolean;
    };
}

export interface Order {
    _id?: ObjectId;
    id: string;
    userId: string;
    status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    items: OrderItem[];
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
    currency: string;
    paymentMethod: string;
    paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
    shippingAddress: Address;
    billingAddress: Address;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderItem {
    productId: string;
    productTitle: string;
    productImage: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    supplierId: string;
}

export interface PaymentMethod {
    _id?: ObjectId;
    userId: string;
    type: 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'CRYPTO' | 'PAYPAL' | 'STRIPE';
    name: string;
    isDefault: boolean;
    details: any;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CryptoPayment {
    _id?: ObjectId;
    orderId: string;
    userId: string;
    cryptocurrency: string;
    amount: number;
    exchangeRate: number;
    walletAddress: string;
    transactionHash?: string;
    status: 'PENDING' | 'CONFIRMED' | 'FAILED';
    confirmedAt?: Date;
    createdAt: Date;
}

export interface AIService {
    _id?: ObjectId;
    id: string;
    name: string;
    description: string;
    type: 'SCRAPING' | 'ANALYTICS' | 'RECOMMENDATIONS' | 'CHATBOT' | 'OPTIMIZATION';
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
    apiEndpoint: string;
    apiKey?: string;
    pricing: {
        model: 'FREE' | 'PAY_PER_USE' | 'SUBSCRIPTION';
        price?: number;
        currency: string;
    };
    features: string[];
    usage: {
        totalRequests: number;
        successfulRequests: number;
        failedRequests: number;
        lastUsed: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface AIAgent {
    _id?: ObjectId;
    id: string;
    name: string;
    description: string;
    type: 'CUSTOMER_SERVICE' | 'SALES' | 'ANALYTICS' | 'OPTIMIZATION';
    status: 'ONLINE' | 'OFFLINE' | 'BUSY';
    capabilities: string[];
    performance: {
        totalInteractions: number;
        successRate: number;
        averageResponseTime: number;
        customerSatisfaction: number;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface AdvertisingCampaign {
    _id?: ObjectId;
    id: string;
    name: string;
    description: string;
    type: 'SOCIAL_MEDIA' | 'SEARCH_ENGINE' | 'DISPLAY' | 'VIDEO' | 'INFLUENCER';
    status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
    budget: {
        total: number;
        spent: number;
        currency: string;
    };
    targetAudience: {
        ageRange: string;
        gender: string;
        interests: string[];
        locations: string[];
    };
    platforms: string[];
    startDate: Date;
    endDate: Date;
    metrics: {
        impressions: number;
        clicks: number;
        conversions: number;
        ctr: number;
        cpc: number;
        roas: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface SocialMediaAccount {
    _id?: ObjectId;
    id: string;
    platform: 'FACEBOOK' | 'INSTAGRAM' | 'TWITTER' | 'LINKEDIN' | 'TIKTOK' | 'YOUTUBE';
    username: string;
    displayName: string;
    profileImage: string;
    followers: number;
    following: number;
    posts: number;
    engagement: number;
    isVerified: boolean;
    isActive: boolean;
    lastUpdated: Date;
    createdAt: Date;
}

export interface SocialTrend {
    _id?: ObjectId;
    id: string;
    platform: string;
    topic: string;
    category: string;
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    engagement: {
        score: number;
        mentions: number;
        upvotes: number;
        comments: number;
        shares: number;
    };
    trendingScore: number;
    relatedProducts: string[];
    keywords: string[];
    timestamp: Date;
    source: string;
    url: string;
    aiInsights: {
        productOpportunity: number;
        marketDemand: number;
        competitiveLandscape: string;
        recommendedActions: string[];
        confidence: number;
    };
}

export interface IntegrationPackage {
    _id?: ObjectId;
    id: string;
    name: string;
    description: string;
    category: 'PAYMENT' | 'SHIPPING' | 'ANALYTICS' | 'MARKETING' | 'INVENTORY' | 'CUSTOMER_SERVICE';
    provider: string;
    version: string;
    status: 'ACTIVE' | 'INACTIVE' | 'BETA' | 'DEPRECATED';
    pricing: {
        model: 'FREE' | 'PAID' | 'FREEMIUM';
        price?: number;
        currency: string;
        billingCycle?: string;
    };
    features: string[];
    requirements: string[];
    installationSteps: string[];
    isInstalled: boolean;
    installedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface MiningOperation {
    _id?: ObjectId;
    id: string;
    name: string;
    type: 'BITCOIN' | 'ETHEREUM' | 'LITECOIN' | 'OTHER';
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
    hardware: {
        type: string;
        model: string;
        hashRate: number;
        powerConsumption: number;
    };
    performance: {
        currentHashRate: number;
        totalMined: number;
        efficiency: number;
        uptime: number;
    };
    costs: {
        electricity: number;
        maintenance: number;
        hardware: number;
        total: number;
    };
    revenue: {
        daily: number;
        weekly: number;
        monthly: number;
        total: number;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Localization {
    _id?: ObjectId;
    id: string;
    language: string;
    languageCode: string;
    country: string;
    countryCode: string;
    locale: string;
    isActive: boolean;
    isDefault: boolean;
    translations: Record<string, string>;
    currency: string;
    timezone: string;
    dateFormat: string;
    numberFormat: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ShippingMethod {
    _id?: ObjectId;
    id: string;
    name: string;
    description: string;
    carrier: string;
    service: string;
    deliveryTime: {
        min: number;
        max: number;
        unit: 'HOURS' | 'DAYS' | 'WEEKS';
    };
    pricing: {
        base: number;
        perKg: number;
        currency: string;
    };
    restrictions: {
        maxWeight: number;
        maxDimensions: string;
        countries: string[];
        excludedCountries: string[];
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Analytics {
    totalSales: number;
    activeUsers: number;
    productsInStock: number;
    conversionRate: number;
    averageOrderValue: number;
    customerLifetimeValue: number;
    topCategories: Array<{
        name: string;
        productCount: number;
        sales: number;
    }>;
    recentOrders: Array<{
        id: string;
        amount: number;
        status: string;
        createdAt: Date;
    }>;
}

class MongoDBService {
    private client: MongoClient | null = null;
    private db: Db | null = null;
    private static instance: MongoDBService;

    private constructor() { }

    public static getInstance(): MongoDBService {
        if (!MongoDBService.instance) {
            MongoDBService.instance = new MongoDBService();
        }
        return MongoDBService.instance;
    }

    public async initialize(): Promise<void> {
        if (this.client) return;

        try {
            const uri = process.env.DATABASE_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/midostore';
            this.client = new MongoClient(uri);
            await this.client.connect();

            this.db = this.client.db();
            console.log('✅ MongoDB service initialized successfully');

            // Create indexes for better performance
            await this.createIndexes();
        } catch (error) {
            console.error('❌ Failed to initialize MongoDB service:', error);
            throw error;
        }
    }

    private async createIndexes(): Promise<void> {
        if (!this.db) return;

        try {
            // Products indexes
            await this.db.collection('products').createIndex({ source: 1, externalId: 1 }, { unique: true });
            await this.db.collection('products').createIndex({ category: 1, isActive: 1 });
            await this.db.collection('products').createIndex({ isFeatured: 1 });
            await this.db.collection('products').createIndex({ rating: -1, reviewCount: -1 });
            await this.db.collection('products').createIndex({ tags: 1 });
            await this.db.collection('products').createIndex({ brand: 1 });
            await this.db.collection('products').createIndex({ price: 1 });
            await this.db.collection('products').createIndex({ createdAt: -1 });

            // Categories indexes
            await this.db.collection('categories').createIndex({ slug: 1 }, { unique: true });
            await this.db.collection('categories').createIndex({ isActive: 1, sortOrder: 1 });

            // Reviews indexes
            await this.db.collection('reviews').createIndex({ productId: 1 });
            await this.db.collection('reviews').createIndex({ rating: -1 });
            await this.db.collection('reviews').createIndex({ createdAt: -1 });

            // Suppliers indexes
            await this.db.collection('suppliers').createIndex({ rating: -1, verified: 1 });
            await this.db.collection('suppliers').createIndex({ country: 1 });

            // Users indexes
            await this.db.collection('users').createIndex({ email: 1 }, { unique: true });
            await this.db.collection('users').createIndex({ role: 1 });
            await this.db.collection('users').createIndex({ isVerified: 1 });

            // Orders indexes
            await this.db.collection('orders').createIndex({ userId: 1 });
            await this.db.collection('orders').createIndex({ status: 1 });
            await this.db.collection('orders').createIndex({ createdAt: -1 });

            // AI Services indexes
            await this.db.collection('ai_services').createIndex({ type: 1, status: 1 });
            await this.db.collection('ai_services').createIndex({ isActive: 1 });

            // Advertising indexes
            await this.db.collection('advertising_campaigns').createIndex({ status: 1, type: 1 });
            await this.db.collection('advertising_campaigns').createIndex({ startDate: 1, endDate: 1 });

            // Social Media indexes
            await this.db.collection('social_media_accounts').createIndex({ platform: 1, isActive: 1 });
            await this.db.collection('social_trends').createIndex({ platform: 1, timestamp: -1 });

            // Integration indexes
            await this.db.collection('integration_packages').createIndex({ category: 1, status: 1 });
            await this.db.collection('integration_packages').createIndex({ isInstalled: 1 });

            // Mining indexes
            await this.db.collection('mining_operations').createIndex({ type: 1, status: 1 });
            await this.db.collection('mining_operations').createIndex({ isActive: 1 });

            // Localization indexes
            await this.db.collection('localizations').createIndex({ locale: 1 }, { unique: true });
            await this.db.collection('localizations').createIndex({ isActive: 1 });

            console.log('✅ Database indexes created successfully');
        } catch (error) {
            console.error('Error creating indexes:', error);
        }
    }

    // Product operations
    public async getProducts(limit: number = 50, offset: number = 0, categoryId?: string): Promise<Product[]> {
        try {
            if (!this.db) {
                await this.initialize();
            }

            const filter: any = { isActive: true };
            if (categoryId) {
                filter.category = categoryId;
            }

            return await this.db!.collection('products')
                .find(filter)
                .sort({ rating: -1, reviewCount: -1 })
                .skip(offset)
                .limit(limit)
                .toArray();
        } catch (error) {
            console.error('Error getting products:', error);
            return [];
        }
    }

    public async getProductById(id: string): Promise<Product | null> {
        if (!this.db) await this.initialize();

        try {
            return await this.db!.collection('products').findOne({ _id: new ObjectId(id), isActive: true });
        } catch (error) {
            console.error('Error getting product by id:', error);
            return null;
        }
    }

    public async getProductByExternalId(externalId: string, source: string): Promise<Product | null> {
        if (!this.db) await this.initialize();

        try {
            return await this.db!.collection('products').findOne({ externalId, source });
        } catch (error) {
            console.error('Error getting product by external id:', error);
            return null;
        }
    }

    public async searchProducts(query: string, limit: number = 20): Promise<Product[]> {
        if (!this.db) await this.initialize();

        try {
            const searchFilter = {
                isActive: true,
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                    { brand: { $regex: query, $options: 'i' } },
                    { tags: { $in: [new RegExp(query, 'i')] } }
                ]
            };

            return await this.db!.collection('products')
                .find(searchFilter)
                .sort({ rating: -1, reviewCount: -1 })
                .limit(limit)
                .toArray();
        } catch (error) {
            console.error('Error searching products:', error);
            return [];
        }
    }

    public async getProductsByCategory(categoryId: string, limit: number = 50): Promise<Product[]> {
        if (!this.db) await this.initialize();

        try {
            return await this.db!.collection('products')
                .find({ category: categoryId, isActive: true })
                .sort({ rating: -1, reviewCount: -1 })
                .limit(limit)
                .toArray();
        } catch (error) {
            console.error('Error getting products by category:', error);
            return [];
        }
    }

    public async getFeaturedProducts(limit: number = 12): Promise<Product[]> {
        if (!this.db) await this.initialize();

        try {
            return await this.db!.collection('products')
                .find({ isActive: true, rating: { $gte: 4.5 } })
                .sort({ rating: -1, reviewCount: -1 })
                .limit(limit)
                .toArray();
        } catch (error) {
            console.error('Error getting featured products:', error);
            return [];
        }
    }

    public async createProduct(product: Omit<Product, '_id' | 'createdAt' | 'updatedAt' | 'lastScraped'>): Promise<Product> {
        if (!this.db) await this.initialize();

        try {
            const now = new Date();
            const newProduct: Product = {
                ...product,
                createdAt: now,
                updatedAt: now,
                lastScraped: now
            };

            const result = await this.db!.collection('products').insertOne(newProduct);
            return { ...newProduct, _id: result.insertedId };
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    public async updateProduct(externalId: string, source: string, updates: Partial<Product>): Promise<boolean> {
        if (!this.db) await this.initialize();

        try {
            const result = await this.db!.collection('products').updateOne(
                { externalId, source },
                {
                    $set: {
                        ...updates,
                        updatedAt: new Date(),
                        lastScraped: new Date()
                    }
                }
            );
            return result.modifiedCount > 0;
        } catch (error) {
            console.error('Error updating product:', error);
            return false;
        }
    }

    // Category operations
    public async getCategories(): Promise<Category[]> {
        try {
            if (!this.db) {
                await this.initialize();
            }

            return await this.db!.collection('categories')
                .find({ isActive: true })
                .sort({ sortOrder: 1, name: 1 })
                .toArray();
        } catch (error) {
            console.error('Error getting categories:', error);
            return [];
        }
    }

    public async getAllCategories(): Promise<Category[]> {
        try {
            if (!this.db) {
                await this.initialize();
            }

            return await this.db!.collection('categories')
                .find({})
                .sort({ sortOrder: 1, name: 1 })
                .toArray();
        } catch (error) {
            console.error('Error getting all categories:', error);
            return [];
        }
    }

    public async getCategoryBySlug(slug: string): Promise<Category | null> {
        try {
            if (!this.db) {
                await this.initialize();
            }

            return await this.db!.collection('categories').findOne({ slug, isActive: true });
        } catch (error) {
            console.error('Error getting category by slug:', error);
            return null;
        }
    }

    public async createCategory(category: Omit<Category, '_id'>): Promise<Category> {
        try {
            if (!this.db) {
                await this.initialize();
            }

            const result = await this.db!.collection('categories').insertOne(category);
            return { ...category, _id: result.insertedId };
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    }

    // Supplier operations
    public async getSuppliers(): Promise<Supplier[]> {
        try {
            if (!this.db) {
                await this.initialize();
            }

            return await this.db!.collection('suppliers')
                .find({})
                .sort({ rating: -1, verified: -1 })
                .toArray();
        } catch (error) {
            console.error('Error getting suppliers:', error);
            return [];
        }
    }

    public async getAllSuppliers(): Promise<Supplier[]> {
        try {
            if (!this.db) {
                await this.initialize();
            }

            return await this.db!.collection('suppliers')
                .find({})
                .sort({ rating: -1, verified: -1 })
                .toArray();
        } catch (error) {
            console.error('Error getting all suppliers:', error);
            return [];
        }
    }

    public async createSupplier(supplier: Omit<Supplier, '_id' | 'createdAt' | 'updatedAt'>): Promise<Supplier> {
        try {
            if (!this.db) {
                await this.initialize();
            }

            const now = new Date();
            const newSupplier: Supplier = {
                ...supplier,
                createdAt: now,
                updatedAt: now
            };

            const result = await this.db!.collection('suppliers').insertOne(newSupplier);
            return { ...newSupplier, _id: result.insertedId };
        } catch (error) {
            console.error('Error creating supplier:', error);
            throw error;
        }
    }

    // Review operations
    public async getReviews(productId: string, limit: number = 20): Promise<Review[]> {
        try {
            if (!this.db) {
                await this.initialize();
            }

            return await this.db!.collection('reviews')
                .find({ productId })
                .sort({ createdAt: -1 })
                .limit(limit)
                .toArray();
        } catch (error) {
            console.error('Error getting reviews:', error);
            return [];
        }
    }

    public async createReview(review: Omit<Review, '_id' | 'createdAt'>): Promise<Review> {
        try {
            if (!this.db) {
                await this.initialize();
            }

            const newReview: Review = {
                ...review,
                createdAt: new Date()
            };

            const result = await this.db!.collection('reviews').insertOne(newReview);
            return { ...newReview, _id: result.insertedId };
        } catch (error) {
            console.error('Error creating review:', error);
            throw error;
        }
    }

    // User operations
    public async createUser(user: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        try {
            if (!this.db) {
                await this.initialize();
            }

            const now = new Date();
            const newUser: User = {
                ...user,
                createdAt: now,
                updatedAt: now
            };

            const result = await this.db!.collection('users').insertOne(newUser);
            return { ...newUser, _id: result.insertedId };
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        try {
            if (!this.db) {
                await this.initialize();
            }

            return await this.db!.collection('users').findOne({ email });
        } catch (error) {
            console.error('Error getting user by email:', error);
            return null;
        }
    }

    // Order operations
    public async createOrder(order: Omit<Order, '_id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
        try {
            if (!this.db) {
                await this.initialize();
            }

            const now = new Date();
            const newOrder: Order = {
                ...order,
                createdAt: now,
                updatedAt: now
            };

            const result = await this.db!.collection('orders').insertOne(newOrder);
            return { ...newOrder, _id: result.insertedId };
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }

    public async getOrdersByUser(userId: string, limit: number = 20): Promise<Order[]> {
        try {
            if (!this.db) {
                await this.initialize();
            }

            return await this.db!.collection('orders')
                .find({ userId })
                .sort({ createdAt: -1 })
                .limit(limit)
                .toArray();
        } catch (error) {
            console.error('Error getting orders by user:', error);
            return [];
        }
    }

    // AI Service operations
    public async createAIService(service: Omit<AIService, '_id' | 'createdAt' | 'updatedAt'>): Promise<AIService> {
        try {
            if (!this.db) {
                await this.initialize();
            }

            const now = new Date();
            const newService: AIService = {
                ...service,
                createdAt: now,
                updatedAt: now
            };

            const result = await this.db!.collection('ai_services').insertOne(newService);
            return { ...newService, _id: result.insertedId };
        } catch (error) {
            console.error('Error creating AI service:', error);
            throw error;
        }
    }

    public async getAIServices(type?: string): Promise<AIService[]> {
        try {
            if (!this.db) {
                await this.initialize();
            }

            const filter: any = { status: 'ACTIVE' };
            if (type) filter.type = type;

            return await this.db!.collection('ai_services')
                .find(filter)
                .sort({ name: 1 })
                .toArray();
        } catch (error) {
            console.error('Error getting AI services:', error);
            return [];
        }
    }

    // AI Agent operations
    public async createAIAgent(agent: Omit<AIAgent, '_id' | 'createdAt' | 'updatedAt'>): Promise<AIAgent> {
        try {
            if (!this.db) {
                await this.initialize();
            }

            const now = new Date();
            const newAgent: AIAgent = {
                ...agent,
                createdAt: now,
                updatedAt: now
            };

            const result = await this.db!.collection('ai_agents').insertOne(newAgent);
            return { ...newAgent, _id: result.insertedId };
        } catch (error) {
            console.error('Error creating AI agent:', error);
            throw error;
        }
    }

    public async getAIAgents(type?: string): Promise<AIAgent[]> {
        try {
            if (!this.db) {
                await this.initialize();
            }

            const filter: any = { isActive: true };
            if (type) filter.type = type;

            return await this.db!.collection('ai_agents')
                .find(filter)
                .sort({ name: 1 })
                .toArray();
        } catch (error) {
            console.error('Error getting AI agents:', error);
            return [];
        }
    }

    // Advertising operations
    public async createAdvertisingCampaign(campaign: Omit<AdvertisingCampaign, '_id' | 'createdAt' | 'updatedAt'>): Promise<AdvertisingCampaign> {
        try {
            if (!this.db) {
                await this.initialize();
            }

            const now = new Date();
            const newCampaign: AdvertisingCampaign = {
                ...campaign,
                createdAt: now,
                updatedAt: now
            };

            const result = await this.db!.collection('advertising_campaigns').insertOne(newCampaign);
            return { ...newCampaign, _id: result.insertedId };
        } catch (error) {
            console.error('Error creating advertising campaign:', error);
            throw error;
        }
    }

    public async getAdvertisingCampaigns(status?: string): Promise<AdvertisingCampaign[]> {
        try {
            if (!this.db) {
                await this.initialize();
            }

            const filter: any = {};
            if (status) filter.status = status;

            return await this.db!.collection('advertising_campaigns')
                .find(filter)
                .sort({ createdAt: -1 })
                .toArray();
        } catch (error) {
            console.error('Error getting advertising campaigns:', error);
            return [];
        }
    }

    // Social Media operations
    public async createSocialMediaAccount(account: Omit<SocialMediaAccount, '_id' | 'createdAt'>): Promise<SocialMediaAccount> {
        if (!this.db) await this.initialize();

        try {
            const newAccount: SocialMediaAccount = {
                ...account,
                createdAt: new Date()
            };

            const result = await this.db!.collection('social_media_accounts').insertOne(newAccount);
            return { ...newAccount, _id: result.insertedId };
        } catch (error) {
            console.error('Error creating social media account:', error);
            throw error;
        }
    }

    public async getSocialMediaAccounts(platform?: string): Promise<SocialMediaAccount[]> {
        if (!this.db) await this.initialize();

        try {
            const filter: any = { isActive: true };
            if (platform) filter.platform = platform;

            return await this.db!.collection('social_media_accounts')
                .find(filter)
                .sort({ followers: -1 })
                .toArray();
        } catch (error) {
            console.error('Error getting social media accounts:', error);
            return [];
        }
    }

    // Social Trend operations
    public async createSocialTrend(trend: Omit<SocialTrend, '_id'>): Promise<SocialTrend> {
        if (!this.db) await this.initialize();

        try {
            const result = await this.db!.collection('social_trends').insertOne(trend);
            return { ...trend, _id: result.insertedId };
        } catch (error) {
            console.error('Error creating social trend:', error);
            throw error;
        }
    }

    public async getSocialTrends(platform?: string, limit: number = 20): Promise<SocialTrend[]> {
        if (!this.db) await this.initialize();

        try {
            const filter: any = {};
            if (platform) filter.platform = platform;

            return await this.db!.collection('social_trends')
                .find(filter)
                .sort({ timestamp: -1 })
                .limit(limit)
                .toArray();
        } catch (error) {
            console.error('Error getting social trends:', error);
            return [];
        }
    }

    // Integration Package operations
    public async createIntegrationPackage(pkg: Omit<IntegrationPackage, '_id' | 'createdAt' | 'updatedAt'>): Promise<IntegrationPackage> {
        if (!this.db) await this.initialize();

        try {
            const now = new Date();
            const newPackage: IntegrationPackage = {
                ...pkg,
                createdAt: now,
                updatedAt: now
            };

            const result = await this.db!.collection('integration_packages').insertOne(newPackage);
            return { ...newPackage, _id: result.insertedId };
        } catch (error) {
            console.error('Error creating integration package:', error);
            throw error;
        }
    }

    public async getIntegrationPackages(category?: string): Promise<IntegrationPackage[]> {
        if (!this.db) await this.initialize();

        try {
            const filter: any = { status: 'ACTIVE' };
            if (category) filter.category = category;

            return await this.db!.collection('integration_packages')
                .find(filter)
                .sort({ name: 1 })
                .toArray();
        } catch (error) {
            console.error('Error getting integration packages:', error);
            return [];
        }
    }

    // Mining operations
    public async createMiningOperation(operation: Omit<MiningOperation, '_id' | 'createdAt' | 'updatedAt'>): Promise<MiningOperation> {
        if (!this.db) await this.initialize();

        try {
            const now = new Date();
            const newOperation: MiningOperation = {
                ...operation,
                createdAt: now,
                updatedAt: now
            };

            const result = await this.db!.collection('mining_operations').insertOne(newOperation);
            return { ...newOperation, _id: result.insertedId };
        } catch (error) {
            console.error('Error creating mining operation:', error);
            throw error;
        }
    }

    public async getMiningOperations(type?: string): Promise<MiningOperation[]> {
        if (!this.db) await this.initialize();

        try {
            const filter: any = { isActive: true };
            if (type) filter.type = type;

            return await this.db!.collection('mining_operations')
                .find(filter)
                .sort({ createdAt: -1 })
                .toArray();
        } catch (error) {
            console.error('Error getting mining operations:', error);
            return [];
        }
    }

    // Localization operations
    public async createLocalization(localization: Omit<Localization, '_id' | 'createdAt' | 'updatedAt'>): Promise<Localization> {
        if (!this.db) await this.initialize();

        try {
            const now = new Date();
            const newLocalization: Localization = {
                ...localization,
                createdAt: now,
                updatedAt: now
            };

            const result = await this.db!.collection('localizations').insertOne(newLocalization);
            return { ...newLocalization, _id: result.insertedId };
        } catch (error) {
            console.error('Error creating localization:', error);
            throw error;
        }
    }

    public async getLocalizations(): Promise<Localization[]> {
        if (!this.db) await this.initialize();

        try {
            return await this.db!.collection('localizations')
                .find({ isActive: true })
                .sort({ language: 1 })
                .toArray();
        } catch (error) {
            console.error('Error getting localizations:', error);
            return [];
        }
    }

    // Shipping operations
    public async createShippingMethod(method: Omit<ShippingMethod, '_id' | 'createdAt' | 'updatedAt'>): Promise<ShippingMethod> {
        if (!this.db) await this.initialize();

        try {
            const now = new Date();
            const newMethod: ShippingMethod = {
                ...method,
                createdAt: now,
                updatedAt: now
            };

            const result = await this.db!.collection('shipping_methods').insertOne(newMethod);
            return { ...newMethod, _id: result.insertedId };
        } catch (error) {
            console.error('Error creating shipping method:', error);
            throw error;
        }
    }

    public async getShippingMethods(): Promise<ShippingMethod[]> {
        if (!this.db) await this.initialize();

        try {
            return await this.db!.collection('shipping_methods')
                .find({ isActive: true })
                .sort({ name: 1 })
                .toArray();
        } catch (error) {
            console.error('Error getting shipping methods:', error);
            return [];
        }
    }

    // Analytics operations
    public async getAnalytics(): Promise<Analytics> {
        if (!this.db) await this.initialize();

        try {
            const [totalProducts, totalCategories, totalSuppliers, avgRating] = await Promise.all([
                this.db!.collection('products').countDocuments({ isActive: true }),
                this.db!.collection('categories').countDocuments({ isActive: true }),
                this.db!.collection('suppliers').countDocuments({}),
                this.db!.collection('products').aggregate([
                    { $match: { isActive: true, rating: { $gt: 0 } } },
                    { $group: { _id: null, avg: { $avg: '$rating' } } }
                ]).toArray()
            ]);

            const topCategories = await this.db!.collection('products').aggregate([
                { $match: { isActive: true } },
                { $group: { _id: '$category', productCount: { $sum: 1 } } },
                { $sort: { productCount: -1 } },
                { $limit: 5 }
            ]).toArray();

            return {
                totalSales: 0, // Will be calculated from orders
                activeUsers: 0, // Will be calculated from users
                productsInStock: totalProducts,
                conversionRate: 0, // Will be calculated from analytics
                averageOrderValue: 0, // Will be calculated from orders
                customerLifetimeValue: 0, // Will be calculated from user data
                topCategories: topCategories.map(cat => ({
                    name: cat._id,
                    productCount: cat.productCount,
                    sales: 0 // Will be calculated from orders
                })),
                recentOrders: [] // Will be populated from orders collection
            };
        } catch (error) {
            console.error('Error getting analytics:', error);
            return {
                totalSales: 0,
                activeUsers: 0,
                productsInStock: 0,
                conversionRate: 0,
                averageOrderValue: 0,
                customerLifetimeValue: 0,
                topCategories: [],
                recentOrders: []
            };
        }
    }

    // Bulk operations for seeding
    public async bulkInsertProducts(products: Omit<Product, '_id' | 'createdAt' | 'updatedAt' | 'lastScraped'>[]): Promise<number> {
        if (!this.db) await this.initialize();

        try {
            const now = new Date();
            const productsWithTimestamps = products.map(product => ({
                ...product,
                createdAt: now,
                updatedAt: now,
                lastScraped: now
            }));

            const result = await this.db!.collection('products').insertMany(productsWithTimestamps);
            return result.insertedCount;
        } catch (error) {
            console.error('Error bulk inserting products:', error);
            throw error;
        }
    }

    public async bulkInsertCategories(categories: Omit<Category, '_id'>[]): Promise<number> {
        if (!this.db) await this.initialize();

        try {
            const result = await this.db!.collection('categories').insertMany(categories);
            return result.insertedCount;
        } catch (error) {
            console.error('Error bulk inserting categories:', error);
            throw error;
        }
    }

    public async bulkInsertSuppliers(suppliers: Omit<Supplier, '_id' | 'createdAt' | 'updatedAt'>[]): Promise<number> {
        if (!this.db) await this.initialize();

        try {
            const now = new Date();
            const suppliersWithTimestamps = suppliers.map(supplier => ({
                ...supplier,
                createdAt: now,
                updatedAt: now
            }));

            const result = await this.db!.collection('suppliers').insertMany(suppliersWithTimestamps);
            return result.insertedCount;
        } catch (error) {
            console.error('Error bulk inserting suppliers:', error);
            throw error;
        }
    }

    public async close(): Promise<void> {
        if (this.client) {
            await this.client.close();
            this.client = null;
            this.db = null;
        }
    }
}

export default MongoDBService;