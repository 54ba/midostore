import clientPromise from './mongodb';

export interface Seller {
    id: string;
    userId: string;
    businessName: string;
    businessType: 'individual' | 'company' | 'store';
    description?: string;
    logo?: string;
    banner?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    website?: string;
    commissionRate: number;
    markupRate: number;
    minOrderAmount: number;
    freeShippingThreshold?: number;
    isVerified: boolean;
    isActive: boolean;
    verificationDate?: Date;
    totalProducts: number;
    totalSales: number;
    totalOrders: number;
    averageRating: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface SellerProduct {
    id: string;
    sellerId: string;
    baseProductId: string;
    sellingPrice: number;
    currency: string;
    commission: number;
    markup: number;
    isActive: boolean;
    isFeatured: boolean;
    customTitle?: string;
    customDescription?: string;
    customImages: string[];
    availableStock: number;
    shippingCost: number;
    estimatedDelivery?: string;
    views: number;
    likes: number;
    cartAdds: number;
    sales: number;
    revenue: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface SellerAnalytics {
    id: string;
    sellerId: string;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate: Date;
    endDate: Date;
    totalViews: number;
    totalLikes: number;
    totalCartAdds: number;
    totalSales: number;
    totalOrders: number;
    totalRevenue: number;
    totalCommission: number;
    topProducts: string[];
    createdAt: Date;
    updatedAt: Date;
}

export default class SellerService {
    private db: any;
    private sellers: any;
    private sellerProducts: any;
    private sellerAnalytics: any;
    private baseProducts: any;

    constructor() {
        this.init();
    }

    private async init() {
        try {
            const client = await clientPromise;
            this.db = client.db('midostore');
            this.sellers = this.db.collection('sellers');
            this.sellerProducts = this.db.collection('sellerProducts');
            this.sellerAnalytics = this.db.collection('sellerAnalytics');
            this.baseProducts = this.db.collection('baseProducts');
        } catch (error) {
            console.error('Failed to initialize SellerService:', error);
        }
    }

    // Seller Management
    async createSeller(sellerData: Omit<Seller, 'id' | 'createdAt' | 'updatedAt'>): Promise<Seller> {
        await this.init();

        const seller: Seller = {
            id: this.generateId(),
            ...sellerData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await this.sellers.insertOne(seller);
        return { ...seller, id: result.insertedId.toString() };
    }

    async getSeller(sellerId: string): Promise<Seller | null> {
        await this.init();
        return await this.sellers.findOne({ id: sellerId });
    }

    async getSellerByUserId(userId: string): Promise<Seller | null> {
        await this.init();
        return await this.sellers.findOne({ userId });
    }

    async updateSeller(sellerId: string, updates: Partial<Seller>): Promise<boolean> {
        await this.init();
        const result = await this.sellers.updateOne(
            { id: sellerId },
            { $set: { ...updates, updatedAt: new Date() } }
        );
        return result.modifiedCount > 0;
    }

    async getAllSellers(limit = 50, offset = 0): Promise<Seller[]> {
        await this.init();
        return await this.sellers
            .find({ isActive: true })
            .sort({ totalSales: -1 })
            .skip(offset)
            .limit(limit)
            .toArray();
    }

    async getVerifiedSellers(): Promise<Seller[]> {
        await this.init();
        return await this.sellers
            .find({ isActive: true, isVerified: true })
            .sort({ totalSales: -1 })
            .toArray();
    }

    // Seller Products Management
    async createSellerProduct(productData: Omit<SellerProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<SellerProduct> {
        await this.init();

        const sellerProduct: SellerProduct = {
            id: this.generateId(),
            ...productData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await this.sellerProducts.insertOne(sellerProduct);

        // Update seller's total products count
        await this.sellers.updateOne(
            { id: productData.sellerId },
            { $inc: { totalProducts: 1 } }
        );

        return { ...sellerProduct, id: result.insertedId.toString() };
    }

    async getSellerProduct(sellerProductId: string): Promise<SellerProduct | null> {
        await this.init();
        return await this.sellerProducts.findOne({ id: sellerProductId });
    }

    async getSellerProducts(sellerId: string, limit = 50, offset = 0): Promise<SellerProduct[]> {
        await this.init();
        return await this.sellerProducts
            .find({ sellerId, isActive: true })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)
            .toArray();
    }

    async getSellerProductByBaseProduct(sellerId: string, baseProductId: string): Promise<SellerProduct | null> {
        await this.init();
        return await this.sellerProducts.findOne({ sellerId, baseProductId });
    }

    async updateSellerProduct(sellerProductId: string, updates: Partial<SellerProduct>): Promise<boolean> {
        await this.init();
        const result = await this.sellerProducts.updateOne(
            { id: sellerProductId },
            { $set: { ...updates, updatedAt: new Date() } }
        );
        return result.modifiedCount > 0;
    }

    async deleteSellerProduct(sellerProductId: string, sellerId: string): Promise<boolean> {
        await this.init();
        const result = await this.sellerProducts.deleteOne({ id: sellerProductId, sellerId });

        if (result.deletedCount > 0) {
            // Update seller's total products count
            await this.sellers.updateOne(
                { id: sellerId },
                { $inc: { totalProducts: -1 } }
            );
        }

        return result.deletedCount > 0;
    }

    // Product Discovery for Sellers
    async getRecommendedProducts(sellerId: string, category?: string, limit = 20): Promise<any[]> {
        await this.init();

        const pipeline = [
            { $match: { isActive: true } },
            { $lookup: { from: 'sellerProducts', localField: 'id', foreignField: 'baseProductId', as: 'sellerProducts' } },
            { $match: { 'sellerProducts.sellerId': { $ne: sellerId } } }, // Exclude products already sold by this seller
            { $sort: { soldCount: -1, rating: -1 } },
            { $limit: limit }
        ];

        if (category) {
            pipeline.unshift({ $match: { category, isActive: true } });
        }

        return await this.baseProducts.aggregate(pipeline).toArray();
    }

    async getTrendingProducts(sellerId: string, limit = 20): Promise<any[]> {
        await this.init();

        const pipeline = [
            { $match: { isActive: true } },
            { $lookup: { from: 'sellerProducts', localField: 'id', foreignField: 'baseProductId', as: 'sellerProducts' } },
            { $match: { 'sellerProducts.sellerId': { $ne: sellerId } } },
            { $sort: { soldCount: -1, reviewCount: -1 } },
            { $limit: limit }
        ];

        return await this.baseProducts.aggregate(pipeline).toArray();
    }

    // Analytics
    async createAnalytics(analyticsData: Omit<SellerAnalytics, 'id' | 'createdAt' | 'updatedAt'>): Promise<SellerAnalytics> {
        await this.init();

        const analytics: SellerAnalytics = {
            id: this.generateId(),
            ...analyticsData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await this.sellerAnalytics.insertOne(analytics);
        return { ...analytics, id: result.insertedId.toString() };
    }

    async getSellerAnalytics(sellerId: string, period: string, startDate: Date, endDate: Date): Promise<SellerAnalytics | null> {
        await this.init();
        return await this.sellerAnalytics.findOne({
            sellerId,
            period,
            startDate,
            endDate
        });
    }

    async updateProductMetrics(sellerProductId: string, metric: 'views' | 'likes' | 'cartAdds' | 'sales', value: number = 1): Promise<void> {
        await this.init();

        const updateData: any = {};
        updateData[metric] = value;
        if (metric === 'sales') {
            updateData.revenue = value; // This should be calculated based on actual sale price
        }

        await this.sellerProducts.updateOne(
            { id: sellerProductId },
            { $inc: updateData }
        );
    }

    // Dashboard Data
    async getSellerDashboard(sellerId: string): Promise<any> {
        await this.init();

        const seller = await this.getSeller(sellerId);
        if (!seller) return null;

        const [totalProducts, totalViews, totalLikes, totalCartAdds, totalSales, totalRevenue] = await Promise.all([
            this.sellerProducts.countDocuments({ sellerId, isActive: true }),
            this.sellerProducts.aggregate([
                { $match: { sellerId } },
                { $group: { _id: null, total: { $sum: '$views' } } }
            ]).toArray(),
            this.sellerProducts.aggregate([
                { $match: { sellerId } },
                { $group: { _id: null, total: { $sum: '$likes' } } }
            ]).toArray(),
            this.sellerProducts.aggregate([
                { $match: { sellerId } },
                { $group: { _id: null, total: { $sum: '$cartAdds' } } }
            ]).toArray(),
            this.sellerProducts.aggregate([
                { $match: { sellerId } },
                { $group: { _id: null, total: { $sum: '$sales' } } }
            ]).toArray(),
            this.sellerProducts.aggregate([
                { $match: { sellerId } },
                { $group: { _id: null, total: { $sum: '$revenue' } } }
            ]).toArray()
        ]);

        const topProducts = await this.sellerProducts
            .find({ sellerId, isActive: true })
            .sort({ revenue: -1 })
            .limit(5)
            .toArray();

        return {
            seller,
            metrics: {
                totalProducts,
                totalViews: totalViews[0]?.total || 0,
                totalLikes: totalLikes[0]?.total || 0,
                totalCartAdds: totalCartAdds[0]?.total || 0,
                totalSales: totalSales[0]?.total || 0,
                totalRevenue: totalRevenue[0]?.total || 0,
            },
            topProducts
        };
    }

    // Utility methods
    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    async searchProducts(query: string, category?: string, limit = 20): Promise<any[]> {
        await this.init();

        const filter: any = { isActive: true };

        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { tags: { $in: [new RegExp(query, 'i')] } }
            ];
        }

        if (category) {
            filter.category = category;
        }

        return await this.baseProducts
            .find(filter)
            .sort({ soldCount: -1, rating: -1 })
            .limit(limit)
            .toArray();
    }
}