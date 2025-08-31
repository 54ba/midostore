#!/usr/bin/env tsx

import MongoDBService, {
    Product, Category, Supplier, Review, User, Order, AIService, AIAgent,
    AdvertisingCampaign, SocialMediaAccount, SocialTrend, IntegrationPackage,
    MiningOperation, Localization, ShippingMethod, PaymentMethod, CryptoPayment
} from '../src/lib/mongodb-service';

class ComprehensiveSeeder {
    private dbService: MongoDBService;

    constructor() {
        this.dbService = MongoDBService.getInstance();
    }

    async seedUsers(): Promise<void> {
        console.log('👥 Seeding users...');

        const users = [
            {
                id: 'user-1',
                email: 'john.doe@example.com',
                name: 'John Doe',
                role: 'CUSTOMER',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
                phone: '+1-555-0123',
                dateOfBirth: new Date('1990-05-15'),
                gender: 'male' as const,
                isVerified: true,
                kycStatus: 'APPROVED' as const
            },
            {
                id: 'user-2',
                email: 'jane.smith@example.com',
                name: 'Jane Smith',
                role: 'SELLER',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop',
                phone: '+1-555-0124',
                dateOfBirth: new Date('1988-12-20'),
                gender: 'female' as const,
                businessName: 'Smith Enterprises',
                businessType: 'Electronics Retail',
                taxId: 'TAX123456',
                isVerified: true,
                kycStatus: 'APPROVED' as const
            },
            {
                id: 'user-3',
                email: 'admin@midostore.com',
                name: 'Admin User',
                role: 'ADMIN',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
                phone: '+1-555-0125',
                isVerified: true,
                kycStatus: 'APPROVED' as const
            },
            {
                id: 'user-4',
                email: 'mike.wilson@example.com',
                name: 'Mike Wilson',
                role: 'CUSTOMER',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
                phone: '+1-555-0126',
                dateOfBirth: new Date('1992-08-10'),
                gender: 'male' as const,
                isVerified: true,
                kycStatus: 'APPROVED' as const
            },
            {
                id: 'user-5',
                email: 'sarah.johnson@example.com',
                name: 'Sarah Johnson',
                role: 'SELLER',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
                phone: '+1-555-0127',
                dateOfBirth: new Date('1985-03-25'),
                gender: 'female' as const,
                businessName: 'Johnson Fashion',
                businessType: 'Fashion Retail',
                taxId: 'TAX789012',
                isVerified: true,
                kycStatus: 'APPROVED' as const
            }
        ];

        for (const userData of users) {
            await this.dbService.createUser(userData);
            console.log(`✅ Created user: ${userData.name}`);
        }

        console.log(`✅ Seeded ${users.length} users`);
    }

    async seedOrders(): Promise<void> {
        console.log('📦 Seeding orders...');

        const orders = [
            {
                id: 'ORD-001',
                userId: 'user-1',
                status: 'DELIVERED' as const,
                items: [
                    {
                        productId: 'product-1',
                        productTitle: 'iPhone 15 Pro Max - 256GB - Space Black',
                        productImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop',
                        quantity: 1,
                        unitPrice: 1199.99,
                        totalPrice: 1199.99,
                        supplierId: 'supp-1'
                    }
                ],
                subtotal: 1199.99,
                tax: 119.99,
                shipping: 29.99,
                discount: 50.00,
                total: 1299.97,
                currency: 'USD',
                paymentMethod: 'CREDIT_CARD',
                paymentStatus: 'PAID' as const,
                shippingAddress: {
                    userId: 'user-1',
                    type: 'SHIPPING' as const,
                    isDefault: true,
                    firstName: 'John',
                    lastName: 'Doe',
                    address1: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    postalCode: '10001',
                    country: 'USA',
                    phone: '+1-555-0123'
                },
                billingAddress: {
                    userId: 'user-1',
                    type: 'BILLING' as const,
                    isDefault: true,
                    firstName: 'John',
                    lastName: 'Doe',
                    address1: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    postalCode: '10001',
                    country: 'USA',
                    phone: '+1-555-0123'
                },
                notes: 'Please deliver during business hours'
            },
            {
                id: 'ORD-002',
                userId: 'user-4',
                status: 'PROCESSING' as const,
                items: [
                    {
                        productId: 'product-2',
                        productTitle: 'Samsung Galaxy S24 Ultra - 512GB - Titanium Gray',
                        productImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop',
                        quantity: 1,
                        unitPrice: 1299.99,
                        totalPrice: 1299.99,
                        supplierId: 'supp-1'
                    }
                ],
                subtotal: 1299.99,
                tax: 129.99,
                shipping: 29.99,
                discount: 0,
                total: 1459.97,
                currency: 'USD',
                paymentMethod: 'CRYPTO',
                paymentStatus: 'PAID' as const,
                shippingAddress: {
                    userId: 'user-4',
                    type: 'SHIPPING' as const,
                    isDefault: true,
                    firstName: 'Mike',
                    lastName: 'Wilson',
                    address1: '456 Oak Ave',
                    city: 'Los Angeles',
                    state: 'CA',
                    postalCode: '90210',
                    country: 'USA',
                    phone: '+1-555-0126'
                },
                billingAddress: {
                    userId: 'user-4',
                    type: 'BILLING' as const,
                    isDefault: true,
                    firstName: 'Mike',
                    lastName: 'Wilson',
                    address1: '456 Oak Ave',
                    city: 'Los Angeles',
                    state: 'CA',
                    postalCode: '90210',
                    country: 'USA',
                    phone: '+1-555-0126'
                }
            }
        ];

        for (const orderData of orders) {
            await this.dbService.createOrder(orderData);
            console.log(`✅ Created order: ${orderData.id}`);
        }

        console.log(`✅ Seeded ${orders.length} orders`);
    }

    async seedAIServices(): Promise<void> {
        console.log('🤖 Seeding AI services...');

        const aiServices = [
            {
                id: 'ai-service-1',
                name: 'Product Scraping AI',
                description: 'Advanced AI-powered product scraping service for e-commerce platforms',
                type: 'SCRAPING' as const,
                status: 'ACTIVE' as const,
                apiEndpoint: 'https://api.midostore.com/ai/scraping',
                pricing: {
                    model: 'PAY_PER_USE' as const,
                    price: 0.10,
                    currency: 'USD'
                },
                features: [
                    'Multi-platform scraping',
                    'Real-time price monitoring',
                    'Competitor analysis',
                    'Automated data validation'
                ],
                usage: {
                    totalRequests: 15420,
                    successfulRequests: 15200,
                    failedRequests: 220,
                    lastUsed: new Date()
                }
            },
            {
                id: 'ai-service-2',
                name: 'Customer Analytics AI',
                description: 'AI-powered customer behavior analysis and insights',
                type: 'ANALYTICS' as const,
                status: 'ACTIVE' as const,
                apiEndpoint: 'https://api.midostore.com/ai/analytics',
                pricing: {
                    model: 'SUBSCRIPTION' as const,
                    price: 99.99,
                    currency: 'USD'
                },
                features: [
                    'Customer segmentation',
                    'Purchase prediction',
                    'Churn analysis',
                    'Personalized recommendations'
                ],
                usage: {
                    totalRequests: 8920,
                    successfulRequests: 8900,
                    failedRequests: 20,
                    lastUsed: new Date()
                }
            },
            {
                id: 'ai-service-3',
                name: 'Smart Pricing AI',
                description: 'Dynamic pricing optimization using machine learning',
                type: 'OPTIMIZATION' as const,
                status: 'ACTIVE' as const,
                apiEndpoint: 'https://api.midostore.com/ai/pricing',
                pricing: {
                    model: 'SUBSCRIPTION' as const,
                    price: 149.99,
                    currency: 'USD'
                },
                features: [
                    'Market price analysis',
                    'Demand forecasting',
                    'Competitive pricing',
                    'Profit optimization'
                ],
                usage: {
                    totalRequests: 5670,
                    successfulRequests: 5650,
                    failedRequests: 20,
                    lastUsed: new Date()
                }
            }
        ];

        for (const serviceData of aiServices) {
            await this.dbService.createAIService(serviceData);
            console.log(`✅ Created AI service: ${serviceData.name}`);
        }

        console.log(`✅ Seeded ${aiServices.length} AI services`);
    }

    async seedAIAgents(): Promise<void> {
        console.log('🤖 Seeding AI agents...');

        const aiAgents = [
            {
                id: 'ai-agent-1',
                name: 'Customer Service Bot',
                description: '24/7 customer service AI agent for product inquiries and support',
                type: 'CUSTOMER_SERVICE' as const,
                status: 'ONLINE' as const,
                capabilities: [
                    'Product information',
                    'Order tracking',
                    'Return processing',
                    'Technical support'
                ],
                performance: {
                    totalInteractions: 12500,
                    successRate: 94.5,
                    averageResponseTime: 2.3,
                    customerSatisfaction: 4.7
                },
                isActive: true
            },
            {
                id: 'ai-agent-2',
                name: 'Sales Assistant',
                description: 'AI-powered sales agent for product recommendations and upselling',
                type: 'SALES' as const,
                status: 'ONLINE' as const,
                capabilities: [
                    'Product recommendations',
                    'Cross-selling',
                    'Discount offers',
                    'Purchase guidance'
                ],
                performance: {
                    totalInteractions: 8900,
                    successRate: 87.2,
                    averageResponseTime: 1.8,
                    customerSatisfaction: 4.5
                },
                isActive: true
            },
            {
                id: 'ai-agent-3',
                name: 'Analytics Expert',
                description: 'AI agent for business analytics and performance insights',
                type: 'ANALYTICS' as const,
                status: 'ONLINE' as const,
                capabilities: [
                    'Performance metrics',
                    'Trend analysis',
                    'Growth insights',
                    'Strategy recommendations'
                ],
                performance: {
                    totalInteractions: 3400,
                    successRate: 96.8,
                    averageResponseTime: 3.1,
                    customerSatisfaction: 4.8
                },
                isActive: true
            }
        ];

        for (const agentData of aiAgents) {
            await this.dbService.createAIAgent(agentData);
            console.log(`✅ Created AI agent: ${agentData.name}`);
        }

        console.log(`✅ Seeded ${aiAgents.length} AI agents`);
    }

    async seedAdvertisingCampaigns(): Promise<void> {
        console.log('📢 Seeding advertising campaigns...');

        const campaigns = [
            {
                id: 'campaign-1',
                name: 'Summer Electronics Sale',
                description: 'Promote electronics products with summer discounts',
                type: 'SOCIAL_MEDIA' as const,
                status: 'ACTIVE' as const,
                budget: {
                    total: 5000,
                    spent: 3200,
                    currency: 'USD'
                },
                targetAudience: {
                    ageRange: '18-45',
                    gender: 'all',
                    interests: ['technology', 'electronics', 'gadgets'],
                    locations: ['USA', 'Canada', 'UK']
                },
                platforms: ['Facebook', 'Instagram', 'Google Ads'],
                startDate: new Date('2024-06-01'),
                endDate: new Date('2024-08-31'),
                metrics: {
                    impressions: 125000,
                    clicks: 8900,
                    conversions: 445,
                    ctr: 7.12,
                    cpc: 0.36,
                    roas: 3.2
                }
            },
            {
                id: 'campaign-2',
                name: 'Fashion Forward',
                description: 'Promote fashion and accessories collection',
                type: 'INFLUENCER' as const,
                status: 'ACTIVE' as const,
                budget: {
                    total: 3000,
                    spent: 1800,
                    currency: 'USD'
                },
                targetAudience: {
                    ageRange: '16-35',
                    gender: 'female',
                    interests: ['fashion', 'beauty', 'lifestyle'],
                    locations: ['USA', 'Canada']
                },
                platforms: ['Instagram', 'TikTok', 'YouTube'],
                startDate: new Date('2024-07-01'),
                endDate: new Date('2024-09-30'),
                metrics: {
                    impressions: 89000,
                    clicks: 6700,
                    conversions: 335,
                    ctr: 7.53,
                    cpc: 0.27,
                    roas: 4.1
                }
            }
        ];

        for (const campaignData of campaigns) {
            await this.dbService.createAdvertisingCampaign(campaignData);
            console.log(`✅ Created advertising campaign: ${campaignData.name}`);
        }

        console.log(`✅ Seeded ${campaigns.length} advertising campaigns`);
    }

    async seedSocialMediaAccounts(): Promise<void> {
        console.log('📱 Seeding social media accounts...');

        const accounts = [
            {
                id: 'social-1',
                platform: 'INSTAGRAM' as const,
                username: 'midostore_official',
                displayName: 'MidoStore Official',
                profileImage: 'https://images.unsplash.com/photo-1611162617213-9d7c9fa143a9?w=150&h=150&fit=crop',
                followers: 125000,
                following: 1200,
                posts: 890,
                engagement: 4.8,
                isVerified: true,
                isActive: true,
                lastUpdated: new Date()
            },
            {
                id: 'social-2',
                platform: 'FACEBOOK' as const,
                username: 'midostore',
                displayName: 'MidoStore',
                profileImage: 'https://images.unsplash.com/photo-1611162617213-9d7c9fa143a9?w=150&h=150&fit=crop',
                followers: 89000,
                following: 800,
                posts: 650,
                engagement: 3.9,
                isVerified: true,
                isActive: true,
                lastUpdated: new Date()
            },
            {
                id: 'social-3',
                platform: 'TWITTER' as const,
                username: 'midostore',
                displayName: 'MidoStore',
                profileImage: 'https://images.unsplash.com/photo-1611162617213-9d7c9fa143a9?w=150&h=150&fit=crop',
                followers: 67000,
                following: 1200,
                posts: 2340,
                engagement: 2.8,
                isVerified: true,
                isActive: true,
                lastUpdated: new Date()
            },
            {
                id: 'social-4',
                platform: 'TIKTOK' as const,
                username: '@midostore',
                displayName: 'MidoStore',
                profileImage: 'https://images.unsplash.com/photo-1611162617213-9d7c9fa143a9?w=150&h=150&fit=crop',
                followers: 234000,
                following: 500,
                posts: 120,
                engagement: 8.9,
                isVerified: true,
                isActive: true,
                lastUpdated: new Date()
            }
        ];

        for (const accountData of accounts) {
            await this.dbService.createSocialMediaAccount(accountData);
            console.log(`✅ Created social media account: ${accountData.displayName} on ${accountData.platform}`);
        }

        console.log(`✅ Seeded ${accounts.length} social media accounts`);
    }

    async seedSocialTrends(): Promise<void> {
        console.log('📈 Seeding social trends...');

        const trends = [
            {
                id: 'trend-1',
                platform: 'INSTAGRAM',
                topic: 'Sustainable Fashion',
                category: 'FASHION',
                sentiment: 'POSITIVE' as const,
                engagement: {
                    score: 8.7,
                    mentions: 12500,
                    upvotes: 8900,
                    comments: 3400,
                    shares: 2100
                },
                trendingScore: 9.2,
                relatedProducts: ['eco-friendly clothing', 'sustainable accessories', 'organic materials'],
                keywords: ['sustainable', 'eco-friendly', 'fashion', 'environmental'],
                timestamp: new Date(),
                source: 'Instagram Trends API',
                url: 'https://instagram.com/explore/tags/sustainablefashion',
                aiInsights: {
                    productOpportunity: 0.85,
                    marketDemand: 0.78,
                    competitiveLandscape: 'Medium competition, high growth potential',
                    recommendedActions: [
                        'Add sustainable fashion products',
                        'Partner with eco-friendly brands',
                        'Create sustainability-focused content'
                    ],
                    confidence: 0.92
                }
            },
            {
                id: 'trend-2',
                platform: 'TIKTOK',
                topic: 'Smart Home Technology',
                category: 'TECHNOLOGY',
                sentiment: 'POSITIVE' as const,
                engagement: {
                    score: 9.1,
                    mentions: 18900,
                    upvotes: 15600,
                    comments: 6700,
                    shares: 4200
                },
                trendingScore: 9.5,
                relatedProducts: ['smart bulbs', 'security cameras', 'voice assistants', 'smart thermostats'],
                keywords: ['smart home', 'technology', 'automation', 'IoT'],
                timestamp: new Date(),
                source: 'TikTok Trends API',
                url: 'https://tiktok.com/tag/smarthome',
                aiInsights: {
                    productOpportunity: 0.92,
                    marketDemand: 0.89,
                    competitiveLandscape: 'High competition, very high demand',
                    recommendedActions: [
                        'Expand smart home product range',
                        'Create tech tutorial content',
                        'Offer bundle deals'
                    ],
                    confidence: 0.95
                }
            }
        ];

        for (const trendData of trends) {
            await this.dbService.createSocialTrend(trendData);
            console.log(`✅ Created social trend: ${trendData.topic} on ${trendData.platform}`);
        }

        console.log(`✅ Seeded ${trends.length} social trends`);
    }

    async seedIntegrationPackages(): Promise<void> {
        console.log('🔌 Seeding integration packages...');

        const packages = [
            {
                id: 'integration-1',
                name: 'Stripe Payment Gateway',
                description: 'Secure payment processing with Stripe integration',
                category: 'PAYMENT' as const,
                provider: 'Stripe',
                version: '2.0.1',
                status: 'ACTIVE' as const,
                pricing: {
                    model: 'PAID' as const,
                    price: 29.99,
                    currency: 'USD',
                    billingCycle: 'monthly'
                },
                features: [
                    'Credit card processing',
                    'Digital wallet support',
                    'Subscription billing',
                    'Fraud protection'
                ],
                requirements: [
                    'Stripe account',
                    'SSL certificate',
                    'PCI compliance'
                ],
                installationSteps: [
                    'Install package via npm',
                    'Configure API keys',
                    'Set up webhooks',
                    'Test payment flow'
                ],
                isInstalled: true,
                installedAt: new Date('2024-01-15')
            },
            {
                id: 'integration-2',
                name: 'Shopify Connector',
                description: 'Seamless integration with Shopify stores',
                category: 'INVENTORY' as const,
                provider: 'Shopify',
                version: '1.5.2',
                status: 'ACTIVE' as const,
                pricing: {
                    model: 'FREEMIUM' as const,
                    price: 0,
                    currency: 'USD'
                },
                features: [
                    'Product sync',
                    'Inventory management',
                    'Order synchronization',
                    'Customer data sync'
                ],
                requirements: [
                    'Shopify store',
                    'API access',
                    'Webhook permissions'
                ],
                installationSteps: [
                    'Connect Shopify account',
                    'Authorize API access',
                    'Configure sync settings',
                    'Map data fields'
                ],
                isInstalled: true,
                installedAt: new Date('2024-02-20')
            },
            {
                id: 'integration-3',
                name: 'Google Analytics',
                description: 'Advanced analytics and tracking integration',
                category: 'ANALYTICS' as const,
                provider: 'Google',
                version: '4.0.0',
                status: 'ACTIVE' as const,
                pricing: {
                    model: 'FREE' as const,
                    price: 0,
                    currency: 'USD'
                },
                features: [
                    'Traffic analysis',
                    'Conversion tracking',
                    'User behavior insights',
                    'Custom reporting'
                ],
                requirements: [
                    'Google account',
                    'Analytics property',
                    'Tracking code'
                ],
                installationSteps: [
                    'Create Google Analytics account',
                    'Add tracking code to website',
                    'Configure goals and events',
                    'Set up custom dimensions'
                ],
                isInstalled: true,
                installedAt: new Date('2024-01-01')
            }
        ];

        for (const packageData of packages) {
            await this.dbService.createIntegrationPackage(packageData);
            console.log(`✅ Created integration package: ${packageData.name}`);
        }

        console.log(`✅ Seeded ${packages.length} integration packages`);
    }

    async seedMiningOperations(): Promise<void> {
        console.log('⛏️ Seeding mining operations...');

        const operations = [
            {
                id: 'mining-1',
                name: 'Bitcoin Mining Farm Alpha',
                type: 'BITCOIN' as const,
                status: 'ACTIVE' as const,
                hardware: {
                    type: 'ASIC Miner',
                    model: 'Antminer S19 XP',
                    hashRate: 140,
                    powerConsumption: 3010
                },
                performance: {
                    currentHashRate: 138.5,
                    totalMined: 0.0234,
                    efficiency: 94.2,
                    uptime: 98.7
                },
                costs: {
                    electricity: 180.60,
                    maintenance: 45.15,
                    hardware: 1200.00,
                    total: 1425.75
                },
                revenue: {
                    daily: 89.45,
                    weekly: 626.15,
                    monthly: 2683.50,
                    total: 15678.90
                },
                isActive: true
            },
            {
                id: 'mining-2',
                name: 'Ethereum Mining Rig Beta',
                type: 'ETHEREUM' as const,
                status: 'ACTIVE' as const,
                hardware: {
                    type: 'GPU Rig',
                    model: 'RTX 4090 x6',
                    hashRate: 0.72,
                    powerConsumption: 1800
                },
                performance: {
                    currentHashRate: 0.71,
                    totalMined: 2.45,
                    efficiency: 98.6,
                    uptime: 99.1
                },
                costs: {
                    electricity: 108.00,
                    maintenance: 27.00,
                    hardware: 3600.00,
                    total: 3735.00
                },
                revenue: {
                    daily: 45.67,
                    weekly: 319.69,
                    monthly: 1370.10,
                    total: 8012.40
                },
                isActive: true
            }
        ];

        for (const operationData of operations) {
            await this.dbService.createMiningOperation(operationData);
            console.log(`✅ Created mining operation: ${operationData.name}`);
        }

        console.log(`✅ Seeded ${operations.length} mining operations`);
    }

    async seedLocalizations(): Promise<void> {
        console.log('🌍 Seeding localizations...');

        const localizations = [
            {
                id: 'localization-1',
                language: 'English',
                languageCode: 'en',
                country: 'United States',
                countryCode: 'US',
                locale: 'en-US',
                isActive: true,
                isDefault: true,
                translations: {
                    'welcome': 'Welcome to MidoStore',
                    'products': 'Products',
                    'categories': 'Categories',
                    'cart': 'Shopping Cart',
                    'checkout': 'Checkout'
                },
                currency: 'USD',
                timezone: 'America/New_York',
                dateFormat: 'MM/DD/YYYY',
                numberFormat: '#,##0.00'
            },
            {
                id: 'localization-2',
                language: 'Arabic',
                languageCode: 'ar',
                country: 'United Arab Emirates',
                countryCode: 'AE',
                locale: 'ar-AE',
                isActive: true,
                isDefault: false,
                translations: {
                    'welcome': 'مرحباً بكم في ميدو ستور',
                    'products': 'المنتجات',
                    'categories': 'الفئات',
                    'cart': 'عربة التسوق',
                    'checkout': 'إتمام الشراء'
                },
                currency: 'AED',
                timezone: 'Asia/Dubai',
                dateFormat: 'DD/MM/YYYY',
                numberFormat: '#,##0.00'
            },
            {
                id: 'localization-3',
                language: 'Spanish',
                languageCode: 'es',
                country: 'Spain',
                countryCode: 'ES',
                locale: 'es-ES',
                isActive: true,
                isDefault: false,
                translations: {
                    'welcome': 'Bienvenido a MidoStore',
                    'products': 'Productos',
                    'categories': 'Categorías',
                    'cart': 'Carrito de Compras',
                    'checkout': 'Finalizar Compra'
                },
                currency: 'EUR',
                timezone: 'Europe/Madrid',
                dateFormat: 'DD/MM/YYYY',
                numberFormat: '#,##0.00'
            }
        ];

        for (const localizationData of localizations) {
            await this.dbService.createLocalization(localizationData);
            console.log(`✅ Created localization: ${localizationData.language} (${localizationData.country})`);
        }

        console.log(`✅ Seeded ${localizations.length} localizations`);
    }

    async seedShippingMethods(): Promise<void> {
        console.log('🚚 Seeding shipping methods...');

        const methods = [
            {
                id: 'shipping-1',
                name: 'Standard Shipping',
                description: 'Standard ground shipping within 5-7 business days',
                carrier: 'FedEx',
                service: 'Ground',
                deliveryTime: {
                    min: 5,
                    max: 7,
                    unit: 'DAYS' as const
                },
                pricing: {
                    base: 9.99,
                    perKg: 2.50,
                    currency: 'USD'
                },
                restrictions: {
                    maxWeight: 50,
                    maxDimensions: '108x54x54 inches',
                    countries: ['USA', 'Canada'],
                    excludedCountries: []
                },
                isActive: true
            },
            {
                id: 'shipping-2',
                name: 'Express Shipping',
                description: 'Fast shipping within 2-3 business days',
                carrier: 'FedEx',
                service: 'Express',
                deliveryTime: {
                    min: 2,
                    max: 3,
                    unit: 'DAYS' as const
                },
                pricing: {
                    base: 24.99,
                    perKg: 5.00,
                    currency: 'USD'
                },
                restrictions: {
                    maxWeight: 70,
                    maxDimensions: '108x54x54 inches',
                    countries: ['USA', 'Canada'],
                    excludedCountries: []
                },
                isActive: true
            },
            {
                id: 'shipping-3',
                name: 'International Shipping',
                description: 'Worldwide shipping with tracking',
                carrier: 'DHL',
                service: 'Express Worldwide',
                deliveryTime: {
                    min: 3,
                    max: 7,
                    unit: 'DAYS' as const
                },
                pricing: {
                    base: 49.99,
                    perKg: 8.00,
                    currency: 'USD'
                },
                restrictions: {
                    maxWeight: 30,
                    maxDimensions: '47x31x31 inches',
                    countries: ['All'],
                    excludedCountries: ['North Korea', 'Cuba']
                },
                isActive: true
            }
        ];

        for (const methodData of methods) {
            await this.dbService.createShippingMethod(methodData);
            console.log(`✅ Created shipping method: ${methodData.name}`);
        }

        console.log(`✅ Seeded ${methods.length} shipping methods`);
    }

    async run(): Promise<void> {
        try {
            console.log('🚀 Starting comprehensive database seeding for all services...');

            await this.dbService.initialize();

            // Seed all services
            await this.seedUsers();
            await this.seedOrders();
            await this.seedAIServices();
            await this.seedAIAgents();
            await this.seedAdvertisingCampaigns();
            await this.seedSocialMediaAccounts();
            await this.seedSocialTrends();
            await this.seedIntegrationPackages();
            await this.seedMiningOperations();
            await this.seedLocalizations();
            await this.seedShippingMethods();

            console.log('🎉 Comprehensive database seeding completed successfully!');
            console.log('📊 Database now contains:');
            console.log('   - Users and authentication data');
            console.log('   - Orders and transactions');
            console.log('   - AI services and agents');
            console.log('   - Advertising campaigns');
            console.log('   - Social media accounts and trends');
            console.log('   - Integration packages');
            console.log('   - Mining operations');
            console.log('   - Localization data');
            console.log('   - Shipping methods');
            console.log('   - All previous data (products, categories, suppliers, reviews)');

        } catch (error) {
            console.error('❌ Comprehensive seeding failed:', error);
            throw error;
        } finally {
            await this.dbService.close();
        }
    }
}

async function main() {
    const seeder = new ComprehensiveSeeder();
    await seeder.run();
}

if (require.main === module) {
    main().catch(console.error);
}