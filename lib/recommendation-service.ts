// @ts-nocheck
import { prisma } from './db';
import { config } from '../env.config';

export interface RecommendationResult {
    item_id: string;
    score: number;
    rank: number;
    type?: 'personalized' | 'popular' | 'similar';
    confidence?: number;
}

export interface UserInteraction {
    user_id: string;
    product_id: string;
    type: 'view' | 'like' | 'cart' | 'purchase';
    timestamp: Date;
    metadata?: Record<string, any>;
}

export class RecommendationService {
    private isModelReady: boolean = false;

    constructor() {
        this.isModelReady = false;
    }

    async trainModel(): Promise<boolean> {
        try {
            console.log('🚀 Starting lightweight recommendation model training...');

            // For Netlify deployment, we'll use a lightweight approach
            // instead of Python-shell which causes size issues

            // Export data from database for analysis
            await this.exportTrainingData();

            // Use JavaScript-based recommendation logic
            this.isModelReady = true;
            console.log('✅ Lightweight model training completed');
            return true;
        } catch (error) {
            console.error('Error training model:', error);
            return false;
        }
    }

    async getPersonalizedRecommendations(
        userId: string,
        nItems: number = 10,
        category?: string
    ): Promise<RecommendationResult[]> {
        try {
            if (!this.isModelReady) {
                console.warn('⚠️ Model not ready, returning popular items');
                return this.getPopularItems(nItems, category);
            }

            // Use lightweight JavaScript-based recommendations
            return this.getLightweightRecommendations(userId, nItems, category);
        } catch (error) {
            console.error('Error getting personalized recommendations:', error);
            return this.getPopularItems(nItems, category);
        }
    }

    private async getLightweightRecommendations(
        userId: string,
        nItems: number,
        category?: string
    ): Promise<RecommendationResult[]> {
        try {
            // Get user's interaction history
            const userInteractions = await prisma.userInteraction.findMany({
                where: { userId },
                orderBy: { timestamp: 'desc' },
                take: 100
            });

            // Get products in the same category as user's interactions
            const userCategories = userInteractions.map((interaction: any) => interaction.productId);
            const userProducts = await prisma.product.findMany({
                where: { id: { in: userCategories } },
                select: { category: true }
            });

            const userPreferredCategories = [...new Set(userProducts.map((p: any) => p.category))];

            // Find similar products based on user preferences
            const similarProducts = await prisma.product.findMany({
                where: {
                    category: { in: userPreferredCategories },
                    isActive: true,
                    ...(category && { category })
                },
                orderBy: { rating: 'desc' },
                take: nItems * 2
            });

            // Score products based on user preferences
            const scoredProducts = similarProducts.map((product: any, index: number) => ({
                item_id: product.id,
                score: this.calculateProductScore(product, userInteractions),
                rank: index + 1,
                type: 'personalized' as const,
                confidence: 0.8
            }));

            // Sort by score and return top items
            return scoredProducts
                .sort((a: any, b: any) => b.score - a.score)
                .slice(0, nItems);

        } catch (error) {
            console.error('Error in lightweight recommendations:', error);
            return this.getPopularItems(nItems, category);
        }
    }

    private calculateProductScore(product: any, userInteractions: any[]): number {
        let score = 0;

        // Base score from product rating
        score += (product.rating || 0) * 0.3;

        // Score from popularity (sold count)
        score += Math.min((product.soldCount || 0) / 100, 1) * 0.2;

        // Score from recent activity
        const recentInteractions = userInteractions.filter(
            interaction => interaction.productId === product.id
        );
        score += recentInteractions.length * 0.3;

        // Score from category preference
        const userCategoryInteractions = userInteractions.filter(
            interaction => interaction.productId === product.id
        );
        if (userCategoryInteractions.length > 0) {
            score += 0.2;
        }

        return Math.min(score, 1);
    }

    async getPopularItems(nItems: number = 10, category?: string): Promise<RecommendationResult[]> {
        try {
            const products = await prisma.product.findMany({
                where: {
                    isActive: true,
                    ...(category && { category })
                },
                orderBy: [
                    { soldCount: 'desc' },
                    { rating: 'desc' }
                ],
                take: nItems
            });

            return products.map((product: any, index: number) => ({
                item_id: product.id,
                score: this.calculatePopularityScore(product),
                rank: index + 1,
                type: 'popular' as const,
                confidence: 0.9
            }));
        } catch (error) {
            console.error('Error getting popular items:', error);
            return [];
        }
    }

    private calculatePopularityScore(product: any): number {
        let score = 0;

        // Sold count score (0-0.5)
        score += Math.min((product.soldCount || 0) / 1000, 1) * 0.5;

        // Rating score (0-0.3)
        score += (product.rating || 0) / 5 * 0.3;

        // Review count score (0-0.2)
        score += Math.min((product.reviewCount || 0) / 100, 1) * 0.2;

        return Math.min(score, 1);
    }

    async getSimilarItems(
        productId: string,
        nItems: number = 10
    ): Promise<RecommendationResult[]> {
        try {
            const targetProduct = await prisma.product.findUnique({
                where: { id: productId },
                select: { category: true, tags: true, price: true }
            });

            if (!targetProduct) {
                return this.getPopularItems(nItems);
            }

            const similarProducts = await prisma.product.findMany({
                where: {
                    id: { not: productId },
                    category: targetProduct.category,
                    isActive: true
                },
                orderBy: { rating: 'desc' },
                take: nItems * 2
            });

            // Score based on similarity
            const scoredProducts = similarProducts.map((product: any, index: number) => ({
                item_id: product.id,
                score: this.calculateSimilarityScore(product, targetProduct),
                rank: index + 1,
                type: 'similar' as const,
                confidence: 0.7
            }));

            return scoredProducts
                .sort((a: any, b: any) => b.score - a.score)
                .slice(0, nItems);

        } catch (error) {
            console.error('Error getting similar items:', error);
            return this.getPopularItems(nItems);
        }
    }

    private calculateSimilarityScore(product: any, targetProduct: any): number {
        let score = 0;

        // Category match
        if (product.category === targetProduct.category) {
            score += 0.4;
        }

        // Price similarity
        const priceDiff = Math.abs((product.price || 0) - (targetProduct.price || 0));
        const maxPrice = Math.max(product.price || 1, targetProduct.price || 1);
        if (maxPrice > 0) {
            score += (1 - priceDiff / maxPrice) * 0.3;
        }

        // Tag similarity
        const productTags = product.tags || [];
        const targetTags = targetProduct.tags || [];
        const commonTags = productTags.filter((tag: any) => targetTags.includes(tag));
        score += (commonTags.length / Math.max(productTags.length, targetTags.length, 1)) * 0.3;

        return Math.min(score, 1);
    }

    async exportTrainingData(): Promise<void> {
        try {
            console.log('📊 Exporting training data...');

            // Export user interactions
            const interactions = await prisma.userInteraction.findMany({
                take: 1000 // Limit for lightweight processing
            });

            // Export products
            const products = await prisma.product.findMany({
                where: { isActive: true },
                take: 1000 // Limit for lightweight processing
            });

            console.log(`✅ Exported ${interactions.length} interactions and ${products.length} products`);
        } catch (error) {
            console.error('Error exporting training data:', error);
        }
    }

    async addInteraction(interaction: Omit<UserInteraction, 'timestamp'>): Promise<void> {
        try {
            await prisma.userInteraction.create({
                data: {
                    ...interaction,
                    timestamp: new Date()
                }
            });
        } catch (error) {
            console.error('Error adding interaction:', error);
        }
    }

    async getRecommendationStats(): Promise<{
        totalInteractions: number;
        totalProducts: number;
        modelStatus: string;
    }> {
        try {
            const [totalInteractions, totalProducts] = await Promise.all([
                prisma.userInteraction.count(),
                prisma.product.count({ where: { isActive: true } })
            ]);

            return {
                totalInteractions,
                totalProducts,
                modelStatus: this.isModelReady ? 'ready' : 'not_ready'
            };
        } catch (error) {
            console.error('Error getting recommendation stats:', error);
            return {
                totalInteractions: 0,
                totalProducts: 0,
                modelStatus: 'error'
            };
        }
    }
}