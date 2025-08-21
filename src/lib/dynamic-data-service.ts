import { prisma } from '@/lib/db';
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

    // Get featured products with real-time data
    async getFeaturedProducts(limit: number = 8): Promise<DynamicProduct[]> {
        const cacheKey = `featured_products_${limit}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        try {
            const products = await prisma.product.findMany({
                where: {
                    isFeatured: true,
                    isActive: true,
                },
                include: {
                    supplier: true,
                    variants: {
                        where: { isActive: true },
                    },
                    reviews: {
                        take: 3,
                        orderBy: { createdAt: 'desc' },
                    },
                },
                orderBy: { updatedAt: 'desc' },
                take: limit,
            });

            const dynamicProducts = products.map(this.mapProductToDynamic);
            this.setCached(cacheKey, dynamicProducts);
            return dynamicProducts;
        } catch (error) {
            console.error('Error fetching featured products:', error);
            return [];
        }
    }

    // Get products by category with real-time data
    async getProductsByCategory(category: string, limit: number = 12): Promise<DynamicProduct[]> {
        const cacheKey = `category_products_${category}_${limit}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        try {
            const products = await prisma.product.findMany({
                where: {
                    category: category,
                    isActive: true,
                },
                include: {
                    supplier: true,
                    variants: {
                        where: { isActive: true },
                    },
                    reviews: {
                        take: 2,
                        orderBy: { createdAt: 'desc' },
                    },
                },
                orderBy: { updatedAt: 'desc' },
                take: limit,
            });

            const dynamicProducts = products.map(this.mapProductToDynamic);
            this.setCached(cacheKey, dynamicProducts);
            return dynamicProducts;
        } catch (error) {
            console.error('Error fetching products by category:', error);
            return [];
        }
    }

    // Get all categories with product counts
    async getCategories(): Promise<DynamicCategory[]> {
        const cacheKey = 'categories';
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        try {
            const categories = await prisma.$queryRaw`
        SELECT
          category as name,
          COUNT(*) as productCount,
          COUNT(DISTINCT subcategory) as subcategoryCount
        FROM "Product"
        WHERE "isActive" = true
        GROUP BY category
        ORDER BY "productCount" DESC
      `;

            const dynamicCategories = categories.map((cat: any) => ({
                id: cat.name,
                name: cat.name,
                productCount: parseInt(cat.productCount),
                subcategories: [],
                isActive: true,
            }));

            this.setCached(cacheKey, dynamicCategories);
            return dynamicCategories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    // Get recent reviews with real-time data
    async getRecentReviews(limit: number = 10): Promise<DynamicReview[]> {
        const cacheKey = `recent_reviews_${limit}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        try {
            const reviews = await prisma.review.findMany({
                include: {
                    product: true,
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
            });

            const dynamicReviews = reviews.map(this.mapReviewToDynamic);
            this.setCached(cacheKey, dynamicReviews);
            return dynamicReviews;
        } catch (error) {
            console.error('Error fetching recent reviews:', error);
            return [];
        }
    }

    // Get live analytics data
    async getLiveAnalytics(): Promise<DynamicAnalytics> {
        const cacheKey = 'live_analytics';
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        try {
            // Get total sales (simulated for now)
            const totalSales = Math.floor(Math.random() * 50000) + 10000;

            // Get active users (simulated for now)
            const activeUsers = Math.floor(Math.random() * 2000) + 500;

            // Get products in stock
            const productsInStock = await prisma.product.count({
                where: { isActive: true },
            });

            // Get conversion rate (simulated)
            const conversionRate = (Math.random() * 5 + 1).toFixed(1);

            // Get average order value (simulated)
            const averageOrderValue = (Math.random() * 100 + 50).toFixed(2);

            // Get customer lifetime value (simulated)
            const customerLifetimeValue = (Math.random() * 2000 + 500).toFixed(0);

            // Get top categories
            const topCategories = await this.getTopCategories();

            // Get recent orders (simulated)
            const recentOrders = Array.from({ length: 5 }, (_, i) => ({
                id: `order_${Date.now()}_${i}`,
                amount: Math.floor(Math.random() * 500) + 50,
                status: ['completed', 'processing', 'shipped'][Math.floor(Math.random() * 3)],
                createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            }));

            const analytics: DynamicAnalytics = {
                totalSales,
                activeUsers,
                productsInStock,
                conversionRate: parseFloat(conversionRate),
                averageOrderValue: parseFloat(averageOrderValue),
                customerLifetimeValue: parseFloat(customerLifetimeValue),
                topCategories,
                recentOrders,
            };

            this.setCached(cacheKey, analytics);
            return analytics;
        } catch (error) {
            console.error('Error fetching live analytics:', error);
            return this.getDefaultAnalytics();
        }
    }

    // Get AI-powered recommendations
    async getAIRecommendations(userId?: string, limit: number = 6): Promise<DynamicRecommendation[]> {
        const cacheKey = `ai_recommendations_${userId || 'anonymous'}_${limit}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        try {
            // Get trending products
            const trendingProducts = await prisma.product.findMany({
                where: { isActive: true },
                orderBy: { soldCount: 'desc' },
                take: Math.ceil(limit / 2),
            });

            // Get personalized recommendations if user is logged in
            let personalizedProducts: any[] = [];
            if (userId) {
                const userInteractions = await prisma.userInteraction.findMany({
                    where: { userId },
                    include: { product: true },
                    orderBy: { timestamp: 'desc' },
                    take: 10,
                });

                if (userInteractions.length > 0) {
                    const userCategories = [...new Set(userInteractions.map(i => i.product.category))];
                    personalizedProducts = await prisma.product.findMany({
                        where: {
                            category: { in: userCategories },
                            isActive: true,
                            id: { notIn: userInteractions.map(i => i.productId) },
                        },
                        take: Math.ceil(limit / 2),
                    });
                }
            }

            // Combine and create recommendations
            const allProducts = [...trendingProducts, ...personalizedProducts].slice(0, limit);

            const recommendations: DynamicRecommendation[] = allProducts.map((product, index) => ({
                id: `rec_${product.id}_${index}`,
                productId: product.id,
                type: index < Math.ceil(limit / 2) ? 'trending' : 'personalized',
                confidence: Math.random() * 0.3 + 0.7, // 0.7 to 1.0
                reason: index < Math.ceil(limit / 2)
                    ? 'High demand and positive reviews'
                    : 'Based on your browsing history',
                metadata: {
                    category: product.category,
                    rating: product.rating,
                    soldCount: product.soldCount,
                },
            }));

            this.setCached(cacheKey, recommendations);
            return recommendations;
        } catch (error) {
            console.error('Error fetching AI recommendations:', error);
            return [];
        }
    }

    // Get live updates feed
    async getLiveUpdates(limit: number = 10): Promise<any[]> {
        const cacheKey = `live_updates_${limit}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        try {
            // Get recent product updates
            const recentProducts = await prisma.product.findMany({
                where: { isActive: true },
                orderBy: { updatedAt: 'desc' },
                take: Math.ceil(limit / 2),
            });

            // Get recent reviews
            const recentReviews = await prisma.review.findMany({
                orderBy: { createdAt: 'desc' },
                take: Math.ceil(limit / 2),
                include: { product: true },
            });

            // Create live updates
            const updates = [
                ...recentProducts.map(product => ({
                    id: `product_update_${product.id}`,
                    type: 'product' as const,
                    message: 'Product updated:',
                    value: product.title,
                    icon: 'Package',
                    color: 'text-blue-500',
                    timestamp: product.updatedAt,
                })),
                ...recentReviews.map(review => ({
                    id: `review_${review.id}`,
                    type: 'review' as const,
                    message: 'New review for:',
                    value: review.product.title,
                    icon: 'Star',
                    color: 'text-yellow-500',
                    timestamp: review.createdAt,
                })),
            ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .slice(0, limit);

            this.setCached(cacheKey, updates);
            return updates;
        } catch (error) {
            console.error('Error fetching live updates:', error);
            return [];
        }
    }

    // Get top categories by sales
    private async getTopCategories(): Promise<Array<{ name: string; productCount: number; sales: number }>> {
        try {
            const categories = await prisma.$queryRaw`
        SELECT
          category as name,
          COUNT(*) as productCount
        FROM "Product"
        WHERE "isActive" = true
        GROUP BY category
        ORDER BY "productCount" DESC
        LIMIT 5
      `;

            return categories.map((cat: any) => ({
                name: cat.name,
                productCount: parseInt(cat.productCount),
                sales: Math.floor(Math.random() * 10000) + 1000, // Simulated sales
            }));
        } catch (error) {
            console.error('Error fetching top categories:', error);
            return [];
        }
    }

    // Get default analytics when service fails
    private getDefaultAnalytics(): DynamicAnalytics {
        return {
            totalSales: 15000,
            activeUsers: 750,
            productsInStock: 500,
            conversionRate: 2.5,
            averageOrderValue: 75.00,
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
    }

    // Map database product to dynamic product
    private mapProductToDynamic(product: any): DynamicProduct {
        return {
            id: product.id,
            externalId: product.externalId,
            title: product.title,
            description: product.description || '',
            price: parseFloat(product.price),
            originalPrice: parseFloat(product.originalPrice || product.price),
            currency: product.currency,
            images: product.images,
            category: product.category,
            subcategory: product.subcategory,
            tags: product.tags,
            rating: product.rating || 0,
            reviewCount: product.reviewCount,
            soldCount: product.soldCount,
            profitMargin: parseFloat(product.profitMargin || '0'),
            gulfPrice: parseFloat(product.gulfPrice || product.price),
            gulfCurrency: product.gulfCurrency,
            isFeatured: product.isFeatured,
            isActive: product.isActive,
            supplier: {
                name: product.supplier?.name || 'Unknown Supplier',
                rating: product.supplier?.rating || 0,
                verified: product.supplier?.verified || false,
                goldMember: product.supplier?.goldMember || false,
            },
            variants: product.variants?.map((v: any) => ({
                name: v.name,
                value: v.value,
                price: parseFloat(v.price || '0'),
                stock: v.stock,
            })) || [],
            reviews: product.reviews?.map((r: any) => ({
                id: r.id,
                reviewerName: r.reviewerName,
                rating: r.rating,
                title: r.title,
                content: r.content,
                helpful: r.helpful,
                verified: r.verified,
                createdAt: r.createdAt,
            })) || [],
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            lastScraped: product.lastScraped,
        };
    }

    // Map database review to dynamic review
    private mapReviewToDynamic(review: any): DynamicReview {
        return {
            id: review.id,
            productId: review.productId,
            productTitle: review.product.title,
            productImage: review.product.images[0] || '',
            productPrice: parseFloat(review.product.price),
            productOriginalPrice: parseFloat(review.product.originalPrice || review.product.price),
            productCategory: review.product.category,
            reviewerName: review.reviewerName,
            rating: review.rating,
            title: review.title,
            content: review.content,
            helpful: review.helpful,
            verified: review.verified,
            source: review.source,
            createdAt: review.createdAt,
        };
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