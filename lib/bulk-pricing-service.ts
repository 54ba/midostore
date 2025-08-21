import { prisma } from './db';
import envConfig from '../env.config';

export interface PricingTier {
    id: string;
    productId: string;
    minQuantity: number;
    maxQuantity: number;
    price: number;
    discount: number;
    savings: number;
    isActive: boolean;
    expiresAt?: Date;
    maxOrders: number;
    currentOrders: number;
    timeRemaining: number; // in seconds
}

export interface BulkOrder {
    id: string;
    productId: string;
    userId: string;
    quantity: number;
    tierPrice: number;
    originalPrice: number;
    savings: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: Date;
    expiresAt: Date;
}

export interface ProductBulkPricing {
    productId: string;
    productTitle: string;
    basePrice: number;
    currency: string;
    currentTier: PricingTier | null;
    nextTier: PricingTier | null;
    totalOrders: number;
    totalQuantity: number;
    timeToNextTier: number;
    isHotDeal: boolean;
    dealProgress: number; // 0-100%
}

export interface BulkPricingRule {
    id: string;
    productId: string;
    name: string;
    description: string;
    tiers: {
        minQuantity: number;
        maxQuantity: number;
        discount: number;
        maxOrders: number;
        timeLimit: number; // in hours
    }[];
    isActive: boolean;
    startDate: Date;
    endDate: Date;
    priority: number;
}

export class BulkPricingService {
    private defaultTiers = [
        { minQuantity: 1, maxQuantity: 9, discount: 0, maxOrders: 100, timeLimit: 24 },
        { minQuantity: 10, maxQuantity: 49, discount: 15, maxOrders: 50, timeLimit: 12 },
        { minQuantity: 50, maxQuantity: 99, discount: 25, maxOrders: 30, timeLimit: 8 },
        { minQuantity: 100, maxQuantity: 499, discount: 35, maxOrders: 20, timeLimit: 6 },
        { minQuantity: 500, maxQuantity: 999, discount: 45, maxOrders: 10, timeLimit: 4 },
        { minQuantity: 1000, maxQuantity: 9999, discount: 60, maxOrders: 5, timeLimit: 2 },
    ];

    // Create or update bulk pricing for a product
    async setupBulkPricing(
        productId: string,
        customTiers?: any[]
    ): Promise<ProductBulkPricing> {
        try {
            const product = await prisma.product.findUnique({
                where: { id: productId },
            });

            if (!product) {
                throw new Error('Product not found');
            }

            const tiers = customTiers || this.defaultTiers;
            const basePrice = product.price;

            // Create pricing tiers
            for (const tier of tiers) {
                const tierPrice = basePrice * (1 - tier.discount / 100);
                const savings = basePrice - tierPrice;

                await prisma.pricingTier.upsert({
                    where: {
                        productId_minQuantity: {
                            productId,
                            minQuantity: tier.minQuantity,
                        },
                    },
                    update: {
                        maxQuantity: tier.maxQuantity,
                        price: tierPrice,
                        discount: tier.discount,
                        savings,
                        maxOrders: tier.maxOrders,
                        timeLimit: tier.timeLimit,
                        isActive: true,
                    },
                    create: {
                        productId,
                        minQuantity: tier.minQuantity,
                        maxQuantity: tier.maxQuantity,
                        price: tierPrice,
                        discount: tier.discount,
                        savings,
                        maxOrders: tier.maxOrders,
                        timeLimit: tier.timeLimit,
                        isActive: true,
                        expiresAt: new Date(Date.now() + tier.timeLimit * 60 * 60 * 1000),
                    },
                });
            }

            // Get current pricing status
            return await this.getProductBulkPricing(productId);
        } catch (error) {
            console.error('Error setting up bulk pricing:', error);
            throw error;
        }
    }

    // Get bulk pricing for a product
    async getProductBulkPricing(productId: string): Promise<ProductBulkPricing> {
        try {
            const product = await prisma.product.findUnique({
                where: { id: productId },
                include: {
                    pricingTiers: {
                        where: { isActive: true },
                        orderBy: { minQuantity: 'asc' },
                    },
                },
            });

            if (!product) {
                throw new Error('Product not found');
            }

            // Get current order statistics
            const orderStats = await this.getProductOrderStats(productId);

            // Find current and next tier
            const currentTier = this.findCurrentTier(product.pricingTiers, orderStats.totalQuantity);
            const nextTier = this.findNextTier(product.pricingTiers, orderStats.totalQuantity);

            // Calculate time to next tier
            const timeToNextTier = nextTier ? this.calculateTimeToNextTier(nextTier, orderStats) : 0;

            // Determine if it's a hot deal
            const isHotDeal = this.isHotDeal(currentTier, orderStats);

            // Calculate deal progress
            const dealProgress = this.calculateDealProgress(currentTier, orderStats);

            return {
                productId: product.id,
                productTitle: product.title,
                basePrice: product.price,
                currency: product.currency,
                currentTier,
                nextTier,
                totalOrders: orderStats.totalOrders,
                totalQuantity: orderStats.totalQuantity,
                timeToNextTier,
                isHotDeal,
                dealProgress,
            };
        } catch (error) {
            console.error('Error getting product bulk pricing:', error);
            throw error;
        }
    }

    // Place bulk order
    async placeBulkOrder(
        productId: string,
        userId: string,
        quantity: number
    ): Promise<BulkOrder> {
        try {
            // Validate quantity and get applicable tier
            const tier = await this.getApplicableTier(productId, quantity);
            if (!tier) {
                throw new Error('No applicable pricing tier found for this quantity');
            }

            // Check if tier is still available
            if (tier.currentOrders >= tier.maxOrders) {
                throw new Error('This pricing tier is no longer available');
            }

            // Check if tier has expired
            if (tier.expiresAt && tier.expiresAt < new Date()) {
                throw new Error('This pricing tier has expired');
            }

            // Calculate order details
            const originalPrice = quantity * tier.basePrice;
            const tierPrice = quantity * tier.price;
            const savings = originalPrice - tierPrice;

            // Create bulk order
            const bulkOrder = await prisma.bulkOrder.create({
                data: {
                    productId,
                    userId,
                    quantity,
                    tierPrice,
                    originalPrice,
                    savings,
                    status: 'pending',
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours to confirm
                },
            });

            // Update tier order count
            await prisma.pricingTier.update({
                where: { id: tier.id },
                data: { currentOrders: { increment: 1 } },
            });

            // Check if tier threshold is reached
            await this.checkTierThreshold(tier.id);

            return bulkOrder;
        } catch (error) {
            console.error('Error placing bulk order:', error);
            throw error;
        }
    }

    // Get all active bulk pricing products
    async getActiveBulkPricing(): Promise<ProductBulkPricing[]> {
        try {
            const products = await prisma.product.findMany({
                where: {
                    pricingTiers: {
                        some: {
                            isActive: true,
                            expiresAt: { gt: new Date() },
                        },
                    },
                },
                include: {
                    pricingTiers: {
                        where: { isActive: true },
                        orderBy: { minQuantity: 'asc' },
                    },
                },
            });

            const bulkPricingProducts: ProductBulkPricing[] = [];

            for (const product of products) {
                try {
                    const bulkPricing = await this.getProductBulkPricing(product.id);
                    bulkPricingProducts.push(bulkPricing);
                } catch (error) {
                    console.warn(`Error getting bulk pricing for product ${product.id}:`, error);
                }
            }

            // Sort by deal progress and hot deals first
            return bulkPricingProducts.sort((a, b) => {
                if (a.isHotDeal && !b.isHotDeal) return -1;
                if (!a.isHotDeal && b.isHotDeal) return 1;
                return b.dealProgress - a.dealProgress;
            });
        } catch (error) {
            console.error('Error getting active bulk pricing:', error);
            return [];
        }
    }

    // Get hot deals (tiers that are filling up fast)
    async getHotDeals(limit: number = 10): Promise<ProductBulkPricing[]> {
        try {
            const allProducts = await this.getActiveBulkPricing();
            const hotDeals = allProducts
                .filter(product => product.isHotDeal)
                .sort((a, b) => b.dealProgress - a.dealProgress)
                .slice(0, limit);

            return hotDeals;
        } catch (error) {
            console.error('Error getting hot deals:', error);
            return [];
        }
    }

    // Get expiring deals
    async getExpiringDeals(limit: number = 10): Promise<ProductBulkPricing[]> {
        try {
            const allProducts = await this.getActiveBulkPricing();
            const expiringDeals = allProducts
                .filter(product => product.timeToNextTier > 0 && product.timeToNextTier < 3600) // Less than 1 hour
                .sort((a, b) => a.timeToNextTier - b.timeToNextTier)
                .slice(0, limit);

            return expiringDeals;
        } catch (error) {
            console.error('Error getting expiring deals:', error);
            return [];
        }
    }

    // Update pricing based on order volume
    async updatePricingBasedOnVolume(productId: string): Promise<void> {
        try {
            const orderStats = await this.getProductOrderStats(productId);
            const product = await prisma.product.findUnique({
                where: { id: productId },
                include: { pricingTiers: true },
            });

            if (!product) return;

            // Check if we need to activate next tier
            const currentTier = this.findCurrentTier(product.pricingTiers, orderStats.totalQuantity);
            const nextTier = this.findNextTier(product.pricingTiers, orderStats.totalQuantity);

            if (nextTier && orderStats.totalQuantity >= nextTier.minQuantity) {
                // Activate next tier
                await prisma.pricingTier.update({
                    where: { id: nextTier.id },
                    data: {
                        isActive: true,
                        expiresAt: new Date(Date.now() + nextTier.timeLimit * 60 * 60 * 1000),
                    },
                });

                // Deactivate current tier if it exists
                if (currentTier) {
                    await prisma.pricingTier.update({
                        where: { id: currentTier.id },
                        data: { isActive: false },
                    });
                }

                // Send notifications about new tier activation
                await this.notifyTierActivation(productId, nextTier);
            }
        } catch (error) {
            console.error('Error updating pricing based on volume:', error);
        }
    }

    // Private helper methods
    private async getProductOrderStats(productId: string) {
        const orders = await prisma.bulkOrder.findMany({
            where: {
                productId,
                status: { in: ['confirmed', 'pending'] },
                createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
            },
        });

        return {
            totalOrders: orders.length,
            totalQuantity: orders.reduce((sum, order) => sum + order.quantity, 0),
        };
    }

    private findCurrentTier(tiers: any[], totalQuantity: number): any | null {
        return tiers.find(tier =>
            totalQuantity >= tier.minQuantity && totalQuantity <= tier.maxQuantity
        ) || null;
    }

    private findNextTier(tiers: any[], totalQuantity: number): any | null {
        return tiers.find(tier => totalQuantity < tier.minQuantity) || null;
    }

    private calculateTimeToNextTier(nextTier: any, orderStats: any): number {
        if (!nextTier) return 0;

        const remainingQuantity = nextTier.minQuantity - orderStats.totalQuantity;
        const averageOrdersPerHour = orderStats.totalOrders / 24; // Assuming 24-hour period

        if (averageOrdersPerHour <= 0) return 0;

        const estimatedHours = remainingQuantity / averageOrdersPerHour;
        return Math.max(0, estimatedHours * 60 * 60); // Convert to seconds
    }

    private isHotDeal(tier: any, orderStats: any): boolean {
        if (!tier) return false;

        const progress = this.calculateDealProgress(tier, orderStats);
        return progress >= 80; // 80% or more filled
    }

    private calculateDealProgress(tier: any, orderStats: any): number {
        if (!tier) return 0;

        const progress = (orderStats.totalQuantity / tier.maxQuantity) * 100;
        return Math.min(100, Math.max(0, progress));
    }

    private async getApplicableTier(productId: string, quantity: number): Promise<any | null> {
        const tiers = await prisma.pricingTier.findMany({
            where: {
                productId,
                isActive: true,
                minQuantity: { lte: quantity },
                maxQuantity: { gte: quantity },
                expiresAt: { gt: new Date() },
            },
            orderBy: { discount: 'desc' }, // Best discount first
        });

        return tiers[0] || null;
    }

    private async checkTierThreshold(tierId: string): Promise<void> {
        const tier = await prisma.pricingTier.findUnique({
            where: { id: tierId },
        });

        if (tier && tier.currentOrders >= tier.maxOrders) {
            // Tier is full, deactivate it
            await prisma.pricingTier.update({
                where: { id: tierId },
                data: { isActive: false },
            });

            // Notify about tier completion
            await this.notifyTierCompletion(tier.productId, tier);
        }
    }

    private async notifyTierActivation(productId: string, tier: any): Promise<void> {
        // This would integrate with notification service
        console.log(`New pricing tier activated for product ${productId}: ${tier.minQuantity}+ units at ${tier.discount}% off`);
    }

    private async notifyTierCompletion(productId: string, tier: any): Promise<void> {
        // This would integrate with notification service
        console.log(`Pricing tier completed for product ${productId}: ${tier.minQuantity}+ units tier is now full`);
    }

    // Get bulk pricing analytics
    async getBulkPricingAnalytics(productId?: string) {
        try {
            const where = productId ? { productId } : {};

            const analytics = await prisma.bulkOrder.groupBy({
                by: ['productId', 'status'],
                where,
                _count: { id: true },
                _sum: { quantity: true, savings: true },
            });

            return analytics;
        } catch (error) {
            console.error('Error getting bulk pricing analytics:', error);
            return [];
        }
    }
}

export default BulkPricingService;