import { useThemeStyles } from '@/hooks/useThemeStyles';

export interface DynamicProduct {
    id: string;
    externalId: string;
    title: string;
    description: string;
    price: number;
    originalPrice: number;
    currency: string;
    images: string[];
    category: string;
    subcategory?: string;
    tags: string[];
    rating: number;
    reviewCount: number;
    soldCount: number;
    profitMargin: number;
    gulfPrice: number;
    gulfCurrency: string;
    isFeatured: boolean;
    isActive: boolean;
    supplier: {
        name: string;
        rating: number;
        verified: boolean;
        goldMember: boolean;
    };
    variants: Array<{
        name: string;
        value: string;
        price: number;
        stock: number;
    }>;
    reviews: Array<{
        id: string;
        reviewerName: string;
        rating: number;
        title?: string;
        content: string;
        helpful: number;
        verified: boolean;
        createdAt: Date;
    }>;
    createdAt: Date;
    updatedAt: Date;
    lastScraped: Date;
}

export interface DynamicCategory {
    id: string;
    name: string;
    nameAr?: string;
    description?: string;
    image?: string;
    productCount: number;
    subcategories: string[];
    isActive: boolean;
}

export interface DynamicReview {
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

export interface DynamicAnalytics {
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

export interface DynamicRecommendation {
    id: string;
    productId: string;
    type: 'personalized' | 'trending' | 'similar' | 'category';
    confidence: number;
    reason: string;
    metadata: Record<string, any>;
}

export class DynamicDataService {
    private static instance: DynamicDataService;
    private cache: Map<string, { data: any; timestamp: number }> = new Map();
    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    private constructor() { }

    static getInstance(): DynamicDataService {
        if (!DynamicDataService.instance) {
            DynamicDataService.instance = new DynamicDataService();
        }
        return DynamicDataService.instance;
    }

    // Get featured products with mock data
    async getFeaturedProducts(limit: number = 8): Promise<DynamicProduct[]> {
        const cacheKey = `featured_products_${limit}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        // Mock featured products data
        const mockProducts: DynamicProduct[] = [
            {
                id: '1',
                externalId: 'ext_1',
                title: 'Wireless Headphones Pro',
                description: 'Premium wireless headphones with noise cancellation',
                price: 89.99,
                originalPrice: 129.99,
                currency: 'USD',
                images: ['/api/placeholder/300/300?text=Headphones'],
                category: 'Electronics',
                subcategory: 'Audio',
                tags: ['wireless', 'noise-cancelling', 'bluetooth'],
                rating: 4.8,
                reviewCount: 156,
                soldCount: 1200,
                profitMargin: 25.0,
                gulfPrice: 330.00,
                gulfCurrency: 'AED',
                isFeatured: true,
                isActive: true,
                supplier: {
                    name: 'AudioTech Solutions',
                    rating: 4.9,
                    verified: true,
                    goldMember: true,
                },
                variants: [
                    { name: 'Color', value: 'Black', price: 89.99, stock: 50 },
                    { name: 'Color', value: 'White', price: 89.99, stock: 30 },
                ],
                reviews: [
                    {
                        id: 'rev_1',
                        reviewerName: 'Ahmed M.',
                        rating: 5,
                        title: 'Excellent sound quality',
                        content: 'Amazing headphones with great sound quality',
                        helpful: 12,
                        verified: true,
                        createdAt: new Date(),
                    }
                ],
                createdAt: new Date(),
                updatedAt: new Date(),
                lastScraped: new Date(),
            },
            {
                id: '2',
                externalId: 'ext_2',
                title: 'Smart Fitness Watch',
                description: 'Advanced fitness tracking with heart rate monitor',
                price: 199.99,
                originalPrice: 299.99,
                currency: 'USD',
                images: ['/api/placeholder/300/300?text=Smart Watch'],
                category: 'Electronics',
                subcategory: 'Wearables',
                tags: ['fitness', 'smartwatch', 'health'],
                rating: 4.6,
                reviewCount: 89,
                soldCount: 450,
                profitMargin: 30.0,
                gulfPrice: 735.00,
                gulfCurrency: 'AED',
                isFeatured: true,
                isActive: true,
                supplier: {
                    name: 'FitnessTech Pro',
                    rating: 4.7,
                    verified: true,
                    goldMember: true,
                },
                variants: [
                    { name: 'Size', value: '42mm', price: 199.99, stock: 25 },
                    { name: 'Size', value: '46mm', price: 199.99, stock: 20 },
                ],
                reviews: [
                    {
                        id: 'rev_2',
                        reviewerName: 'Sarah K.',
                        rating: 4,
                        title: 'Great fitness tracker',
                        content: 'Perfect for tracking workouts and health metrics',
                        helpful: 8,
                        verified: true,
                        createdAt: new Date(),
                    }
                ],
                createdAt: new Date(),
                updatedAt: new Date(),
                lastScraped: new Date(),
            }
        ];

        const products = mockProducts.slice(0, limit);
        this.setCached(cacheKey, products);
        return products;
    }

    // Get products by category with mock data
    async getProductsByCategory(category: string, limit: number = 12): Promise<DynamicProduct[]> {
        const cacheKey = `category_products_${category}_${limit}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        // Mock category products data
        const mockProducts: DynamicProduct[] = [
            {
                id: '3',
                externalId: 'ext_3',
                title: 'Portable Bluetooth Speaker',
                description: 'Waterproof portable speaker with 20W output',
                price: 49.99,
                originalPrice: 79.99,
                currency: 'USD',
                images: ['/api/placeholder/300/300?text=Bluetooth Speaker'],
                category: category,
                subcategory: 'Audio',
                tags: ['portable', 'bluetooth', 'waterproof'],
                rating: 4.7,
                reviewCount: 234,
                soldCount: 1800,
                profitMargin: 20.0,
                gulfPrice: 185.00,
                gulfCurrency: 'AED',
                isFeatured: false,
                isActive: true,
                supplier: {
                    name: 'SoundWave Inc',
                    rating: 4.6,
                    verified: true,
                    goldMember: false,
                },
                variants: [
                    { name: 'Color', value: 'Black', price: 49.99, stock: 100 },
                    { name: 'Color', value: 'Blue', price: 49.99, stock: 75 },
                ],
                reviews: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                lastScraped: new Date(),
            }
        ];

        const products = mockProducts.slice(0, limit);
        this.setCached(cacheKey, products);
        return products;
    }

    // Get all categories with mock data
    async getCategories(): Promise<DynamicCategory[]> {
        const cacheKey = 'categories';
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        const mockCategories: DynamicCategory[] = [
            {
                id: 'electronics',
                name: 'Electronics',
                nameAr: 'الإلكترونيات',
                description: 'Latest electronic devices and gadgets',
                image: '/api/placeholder/200/200?text=Electronics',
                productCount: 150,
                subcategories: ['Smartphones', 'Laptops', 'Audio', 'Wearables'],
                isActive: true,
            },
            {
                id: 'fashion',
                name: 'Fashion',
                nameAr: 'الأزياء',
                description: 'Trendy clothing and accessories',
                image: '/api/placeholder/200/200?text=Fashion',
                productCount: 120,
                subcategories: ['Men', 'Women', 'Kids', 'Accessories'],
                isActive: true,
            },
            {
                id: 'home-garden',
                name: 'Home & Garden',
                nameAr: 'المنزل والحديقة',
                description: 'Everything for your home and garden',
                image: '/api/placeholder/200/200?text=Home',
                productCount: 100,
                subcategories: ['Furniture', 'Decor', 'Garden', 'Kitchen'],
                isActive: true,
            }
        ];

        this.setCached(cacheKey, mockCategories);
        return mockCategories;
    }

    // Get recent reviews with mock data
    async getRecentReviews(limit: number = 10): Promise<DynamicReview[]> {
        const cacheKey = `recent_reviews_${limit}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        const mockReviews: DynamicReview[] = [
            {
                id: 'rev_3',
                productId: '1',
                productTitle: 'Wireless Headphones Pro',
                productImage: '/api/placeholder/100/100?text=Headphones',
                productPrice: 89.99,
                productOriginalPrice: 129.99,
                productCategory: 'Electronics',
                reviewerName: 'Mohammed A.',
                rating: 5,
                title: 'Outstanding quality',
                content: 'These headphones exceeded my expectations. Great sound quality and comfortable fit.',
                helpful: 15,
                verified: true,
                source: 'verified_purchase',
                createdAt: new Date(),
            }
        ];

        const reviews = mockReviews.slice(0, limit);
        this.setCached(cacheKey, reviews);
        return reviews;
    }

    // Get live analytics data with mock data
    async getLiveAnalytics(): Promise<DynamicAnalytics> {
        const cacheKey = 'live_analytics';
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        const analytics: DynamicAnalytics = {
            totalSales: 15499.95,
            activeUsers: 750,
            productsInStock: 500,
            conversionRate: 3.2,
            averageOrderValue: 99.36,
            customerLifetimeValue: 1200,
            topCategories: [
                { name: 'Electronics', productCount: 150, sales: 8000 },
                { name: 'Fashion', productCount: 120, sales: 6000 },
                { name: 'Home & Garden', productCount: 100, sales: 4000 },
            ],
            recentOrders: [
                { id: 'order_1', amount: 125, status: 'completed', createdAt: new Date() },
                { id: 'order_2', amount: 89, status: 'processing', createdAt: new Date() },
            ],
        };

        this.setCached(cacheKey, analytics);
        return analytics;
    }

    // Get AI-powered recommendations with mock data
    async getAIRecommendations(userId?: string, limit: number = 6): Promise<DynamicRecommendation[]> {
        const cacheKey = `ai_recommendations_${userId || 'anonymous'}_${limit}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        const recommendations: DynamicRecommendation[] = [
            {
                id: 'rec_1',
                productId: '1',
                type: 'trending',
                confidence: 0.9,
                reason: 'High demand and positive reviews',
                metadata: {
                    category: 'Electronics',
                    rating: 4.8,
                    soldCount: 1200,
                },
            },
            {
                id: 'rec_2',
                productId: '2',
                type: 'personalized',
                confidence: 0.8,
                reason: 'Based on your browsing history',
                metadata: {
                    category: 'Electronics',
                    rating: 4.6,
                    soldCount: 450,
                },
            }
        ];

        const result = recommendations.slice(0, limit);
        this.setCached(cacheKey, result);
        return result;
    }

    // Get live updates feed with mock data
    async getLiveUpdates(limit: number = 10): Promise<any[]> {
        const cacheKey = `live_updates_${limit}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        const updates = [
            {
                id: 'product_update_1',
                type: 'product' as const,
                message: 'Product updated:',
                value: 'Wireless Headphones Pro',
                icon: 'Package',
                color: 'text-blue-500',
                timestamp: new Date(),
            },
            {
                id: 'review_1',
                type: 'review' as const,
                message: 'New review for:',
                value: 'Smart Fitness Watch',
                icon: 'Star',
                color: 'text-yellow-500',
                timestamp: new Date(Date.now() - 300000),
            }
        ];

        const result = updates.slice(0, limit);
        this.setCached(cacheKey, result);
        return result;
    }

    // Cache management
    private getCached(key: string): any | null {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
            return cached.data;
        }
        return null;
    }

    private setCached(key: string, data: any): void {
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    // Clear cache
    clearCache(): void {
        this.cache.clear();
    }

    // Clear expired cache entries
    clearExpiredCache(): void {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > this.CACHE_TTL) {
                this.cache.delete(key);
            }
        }
    }
}

// Export singleton instance
export const dynamicDataService = DynamicDataService.getInstance();