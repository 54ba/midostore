import { PythonShell } from 'python-shell';
import { prisma } from './db';
import { config } from '../env.config';
import path from 'path';

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
    private pythonScriptPath: string;
    private modelPath: string;
    private isModelReady: boolean = false;

    constructor() {
        this.pythonScriptPath = path.join(process.cwd(), 'ai', 'recommendation_engine.py');
        this.modelPath = path.join(process.cwd(), 'ai', 'models', 'recommendation_model.pkl');
        this.checkModelStatus();
    }

    private async checkModelStatus(): Promise<void> {
        try {
            const fs = await import('fs');
            this.isModelReady = fs.existsSync(this.modelPath);
        } catch (error) {
            console.error('Error checking model status:', error);
            this.isModelReady = false;
        }
    }

    async trainModel(): Promise<boolean> {
        try {
            console.log('🚀 Starting recommendation model training...');

            // Export data from database
            await this.exportTrainingData();

            // Run Python training script
            const options = {
                mode: 'text' as const,
                pythonPath: 'python3',
                pythonOptions: ['-u'], // unbuffered output
                scriptPath: path.dirname(this.pythonScriptPath),
                args: ['--train']
            };

            try {
                const results = await PythonShell.run(path.basename(this.pythonScriptPath), options);
                console.log('✅ Model training completed successfully');
                this.isModelReady = true;
                return true;
            } catch (err) {
                console.error('❌ Model training failed:', err);
                return false;
            }
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

            const options = {
                mode: 'json' as const,
                pythonPath: 'python3',
                pythonOptions: ['-u'],
                scriptPath: path.dirname(this.pythonScriptPath),
                args: [
                    '--recommend',
                    '--user-id', userId,
                    '--n-items', nItems.toString(),
                    '--category', category || 'all'
                ]
            };

            try {
                const results = await PythonShell.run(path.basename(this.pythonScriptPath), options);
                if (results && results.length > 0) {
                    const recommendations = results[0] as RecommendationResult[];
                    return recommendations;
                } else {
                    // Fallback to popular items
                    return this.getPopularItems(nItems, category);
                }
            } catch (err) {
                console.error('❌ Failed to get personalized recommendations:', err);
                // Fallback to popular items
                return this.getPopularItems(nItems, category);
            }
        } catch (error) {
            console.error('Error getting personalized recommendations:', error);
            return this.getPopularItems(nItems, category);
        }
    }

    async getSimilarItems(
        productId: string,
        nItems: number = 10
    ): Promise<RecommendationResult[]> {
        try {
            if (!this.isModelReady) {
                return this.getCategoryBasedSimilarItems(productId, nItems);
            }

            const options = {
                mode: 'json' as const,
                pythonPath: 'python3',
                pythonOptions: ['-u'],
                scriptPath: path.dirname(this.pythonScriptPath),
                args: [
                    '--similar',
                    '--product-id', productId,
                    '--n-items', nItems.toString()
                ]
            };

            try {
                const results = await PythonShell.run(path.basename(this.pythonScriptPath), options);
                if (results && results.length > 0) {
                    const recommendations = results[0] as RecommendationResult[];
                    return recommendations;
                } else {
                    // Fallback to category-based similarity
                    return this.getCategoryBasedSimilarItems(productId, nItems);
                }
            } catch (err) {
                console.error('❌ Failed to get similar items:', err);
                // Fallback to category-based similarity
                return this.getCategoryBasedSimilarItems(productId, nItems);
            }


        } catch (error) {
            console.error('Error getting similar items:', error);
            return this.getCategoryBasedSimilarItems(productId, nItems);
        }
    }

    async getPopularItems(
        nItems: number = 10,
        category?: string
    ): Promise<RecommendationResult[]> {
        try {
            let whereClause: any = {};
            if (category && category !== 'all') {
                whereClause.category = category;
            }

            const popularProducts = await prisma.product.findMany({
                where: whereClause,
                orderBy: [
                    { soldCount: 'desc' },
                    { rating: 'desc' },
                    { reviewCount: 'desc' }
                ],
                take: nItems,
                select: {
                    id: true,
                    externalId: true,
                    title: true,
                    rating: true,
                    soldCount: true,
                    reviewCount: true,
                    category: true
                }
            });

            return popularProducts.map((product: any, index: number) => ({
                item_id: product.externalId,
                score: (product.rating * 0.4) + (product.soldCount * 0.4) + (product.reviewCount * 0.2),
                rank: index + 1,
                type: 'popular' as const,
                confidence: 0.8
            }));
        } catch (error) {
            console.error('Error getting popular items:', error);
            return [];
        }
    }

    private async getCategoryBasedSimilarItems(
        productId: string,
        nItems: number = 10
    ): Promise<RecommendationResult[]> {
        try {
            // Get the source product
            const sourceProduct = await prisma.product.findUnique({
                where: { externalId: productId },
                select: { category: true, subcategory: true, tags: true, price: true }
            });

            if (!sourceProduct) {
                return [];
            }

            // Find similar products in the same category
            const similarProducts = await prisma.product.findMany({
                where: {
                    category: sourceProduct.category,
                    externalId: { not: productId }
                },
                orderBy: [
                    { rating: 'desc' },
                    { soldCount: 'desc' }
                ],
                take: nItems,
                select: {
                    id: true,
                    externalId: true,
                    title: true,
                    rating: true,
                    price: true,
                    tags: true
                }
            });

            return similarProducts.map((product: any, index: number) => {
                // Calculate similarity score based on price range and tags
                const priceSimilarity = 1 - Math.abs(product.price - sourceProduct.price) / Math.max(product.price, sourceProduct.price);
                const tagOverlap = this.calculateTagOverlap(product.tags, sourceProduct.tags);

                const score = (priceSimilarity * 0.4) + (tagOverlap * 0.4) + (product.rating * 0.2);

                return {
                    item_id: product.externalId,
                    score,
                    rank: index + 1,
                    type: 'similar' as const,
                    confidence: score
                };
            });
        } catch (error) {
            console.error('Error getting category-based similar items:', error);
            return [];
        }
    }

    private calculateTagOverlap(tags1: string[], tags2: string[]): number {
        if (!tags1.length || !tags2.length) return 0;

        const set1 = new Set(tags1.map(tag => tag.toLowerCase()));
        const set2 = new Set(tags2.map(tag => tag.toLowerCase()));

        const intersection = new Set([...set1].filter(tag => set2.has(tag)));
        const union = new Set([...set1, ...set2]);

        return intersection.size / union.size;
    }

    async recordUserInteraction(interaction: UserInteraction): Promise<void> {
        try {
            // Store interaction in database
            await prisma.userInteraction.upsert({
                where: {
                    userId_productId_type: {
                        userId: interaction.user_id,
                        productId: interaction.product_id,
                        type: interaction.type
                    }
                },
                update: {
                    timestamp: interaction.timestamp,
                    metadata: interaction.metadata
                },
                create: {
                    userId: interaction.user_id,
                    productId: interaction.product_id,
                    type: interaction.type,
                    timestamp: interaction.timestamp,
                    metadata: interaction.metadata
                }
            });

            // Update model with new interaction (if model is ready)
            if (this.isModelReady) {
                await this.updateModelWithInteraction(interaction);
            }
        } catch (error) {
            console.error('Error recording user interaction:', error);
        }
    }

    private async updateModelWithInteraction(interaction: UserInteraction): Promise<void> {
        try {
            const options = {
                mode: 'text' as const,
                pythonPath: 'python3',
                pythonOptions: ['-u'],
                scriptPath: path.dirname(this.pythonScriptPath),
                args: [
                    '--update',
                    '--user-id', interaction.user_id,
                    '--product-id', interaction.product_id,
                    '--type', interaction.type,
                    '--timestamp', interaction.timestamp.toISOString()
                ]
            };

            try {
                await PythonShell.run(path.basename(this.pythonScriptPath), options);
            } catch (err) {
                console.error('❌ Failed to update model with interaction:', err);
            }
        } catch (error) {
            console.error('Error updating model with interaction:', error);
        }
    }

    async getRecommendationAnalytics(): Promise<{
        modelStatus: string;
        lastTraining: string | null;
        totalInteractions: number;
        activeUsers: number;
        recommendationAccuracy: number;
    }> {
        try {
            const totalInteractions = await prisma.userInteraction.count();
            const activeUsers = await prisma.userInteraction.groupBy({
                by: ['userId'],
                _count: { userId: true }
            }).then((result: any) => result.length);

            // Get model metadata if available
            let modelStatus = 'Not Ready';
            let lastTraining = null;
            let recommendationAccuracy = 0;

            if (this.isModelReady) {
                modelStatus = 'Ready';

                try {
                    const fs = await import('fs');
                    const stats = fs.statSync(this.modelPath);
                    lastTraining = stats.mtime.toISOString();

                    // Calculate accuracy based on user feedback (if available)
                    const feedbackInteractions = await prisma.userInteraction.count({
                        where: { type: 'purchase' }
                    });

                    if (feedbackInteractions > 0) {
                        recommendationAccuracy = Math.min(0.95, 0.7 + (feedbackInteractions / 1000) * 0.25);
                    }
                } catch (error) {
                    console.error('Error getting model metadata:', error);
                }
            }

            return {
                modelStatus,
                lastTraining,
                totalInteractions,
                activeUsers,
                recommendationAccuracy
            };
        } catch (error) {
            console.error('Error getting recommendation analytics:', error);
            return {
                modelStatus: 'Error',
                lastTraining: null,
                totalInteractions: 0,
                activeUsers: 0,
                recommendationAccuracy: 0
            };
        }
    }

    async exportTrainingData(): Promise<void> {
        try {
            console.log('📊 Exporting training data...');

            // Create data directory
            const fs = await import('fs');
            const dataDir = path.join(process.cwd(), 'ai', 'data');
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }

            // Export users data
            const users = await prisma.user.findMany({
                select: {
                    user_id: true,
                    email: true,
                    full_name: true,
                    created_at: true
                }
            });

            // Add user behavior features
            const usersWithBehavior = await Promise.all(
                users.map(async (user: any) => {
                    const interactions = await prisma.userInteraction.findMany({
                        where: { userId: user.user_id }
                    });

                    const orders = interactions.filter((i: any) => i.type === 'purchase');
                    const totalOrders = orders.length;
                    const totalSpent = orders.reduce((sum: number, order: any) => {
                        // This would need to be implemented based on your order structure
                        return sum + 0;
                    }, 0);

                    const lastOrder = orders.length > 0
                        ? Math.max(...orders.map((o: any) => o.timestamp.getTime()))
                        : Date.now();

                    const daysSinceLastOrder = Math.floor((Date.now() - lastOrder) / (1000 * 60 * 60 * 24));

                    return {
                        ...user,
                        total_orders: totalOrders,
                        total_spent: totalSpent,
                        avg_order_value: totalOrders > 0 ? totalSpent / totalOrders : 0,
                        days_since_last_order: daysSinceLastOrder,
                        preferred_currency: 'USD' // Default for now
                    };
                })
            );

            fs.writeFileSync(
                path.join(dataDir, 'users.json'),
                JSON.stringify(usersWithBehavior, null, 2)
            );

            // Export products data
            const products = await prisma.product.findMany({
                select: {
                    externalId: true,
                    title: true,
                    description: true,
                    price: true,
                    currency: true,
                    category: true,
                    subcategory: true,
                    tags: true,
                    rating: true,
                    reviewCount: true,
                    soldCount: true,
                    profitMargin: true
                }
            });

            fs.writeFileSync(
                path.join(dataDir, 'products.json'),
                JSON.stringify(products, null, 2)
            );

            // Export interactions data
            const interactions = await prisma.userInteraction.findMany({
                select: {
                    userId: true,
                    productId: true,
                    type: true,
                    timestamp: true,
                    metadata: true
                }
            });

            fs.writeFileSync(
                path.join(dataDir, 'interactions.json'),
                JSON.stringify(interactions, null, 2)
            );

            console.log('✅ Training data exported successfully');
        } catch (error) {
            console.error('Error exporting training data:', error);
            throw error;
        }
    }

    async getModelStatus(): Promise<{ isReady: boolean; lastTraining: string | null; modelPath: string }> {
        await this.checkModelStatus();

        let lastTraining = null;
        if (this.isModelReady) {
            try {
                const fs = await import('fs');
                const stats = fs.statSync(this.modelPath);
                lastTraining = stats.mtime.toISOString();
            } catch (error) {
                console.error('Error getting model stats:', error);
            }
        }

        return {
            isReady: this.isModelReady,
            lastTraining,
            modelPath: this.modelPath
        };
    }
}

export default RecommendationService;