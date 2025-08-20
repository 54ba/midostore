import { PrismaClient } from '@prisma/client';

export interface AnalyticsData {
    overview: {
        totalProducts: number;
        totalOrders: number;
        totalRevenue: number;
        totalCustomers: number;
        averageRating: number;
        totalReviews: number;
    };
    trends: {
        topCategories: Array<{ category: string; count: number; revenue: number }>;
        topProducts: Array<{ id: string; title: string; sales: number; revenue: number; rating: number }>;
        monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>;
        categoryPerformance: Array<{ category: string; conversionRate: number; avgOrderValue: number }>;
    };
    insights: {
        bestPerformingProducts: Array<{ id: string; title: string; metrics: any }>;
        categoryOpportunities: Array<{ category: string; opportunity: string; potential: number }>;
        seasonalTrends: Array<{ season: string; trend: string; impact: number }>;
        profitAnalysis: {
            totalProfit: number;
            profitMargin: number;
            topProfitCategories: Array<{ category: string; profit: number; margin: number }>;
        };
    };
    recommendations: Array<{
        type: 'product' | 'category' | 'pricing' | 'marketing';
        title: string;
        description: string;
        impact: 'high' | 'medium' | 'low';
        action: string;
    }>;
}

export class AnalyticsService {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    // Get comprehensive analytics data
    async getAnalyticsData(): Promise<AnalyticsData> {
        const [
            overview,
            topCategories,
            topProducts,
            monthlyRevenue,
            categoryPerformance,
            bestPerformingProducts,
            categoryOpportunities,
            seasonalTrends,
            profitAnalysis,
            recommendations
        ] = await Promise.all([
            this.getOverviewData(),
            this.getTopCategories(),
            this.getTopProducts(),
            this.getMonthlyRevenue(),
            this.getCategoryPerformance(),
            this.getBestPerformingProducts(),
            this.getCategoryOpportunities(),
            this.getSeasonalTrends(),
            this.getProfitAnalysis(),
            this.generateRecommendations()
        ]);

        return {
            overview,
            trends: {
                topCategories,
                topProducts,
                monthlyRevenue,
                categoryPerformance
            },
            insights: {
                bestPerformingProducts,
                categoryOpportunities,
                seasonalTrends,
                profitAnalysis
            },
            recommendations
        };
    }

    // Get overview statistics
    private async getOverviewData() {
        const [
            totalProducts,
            totalOrders,
            totalRevenue,
            totalCustomers,
            averageRating,
            totalReviews
        ] = await Promise.all([
            this.prisma.product.count({ where: { isActive: true } }),
            this.prisma.order.count(),
            this.getTotalRevenue(),
            this.prisma.user.count(),
            this.getAverageRating(),
            this.prisma.review.count()
        ]);

        return {
            totalProducts,
            totalOrders,
            totalRevenue,
            totalCustomers,
            averageRating,
            totalReviews
        };
    }

    // Get top performing categories
    private async getTopCategories() {
        const categories = await this.prisma.product.groupBy({
            by: ['category'],
            where: { isActive: true },
            _count: { id: true },
            _sum: { soldCount: true }
        });

        const categoryData = await Promise.all(
            categories.map(async (cat: { category: any; _count: { id: any; }; }) => {
                const revenue = await this.getCategoryRevenue(cat.category || 'Unknown');
                return {
                    category: cat.category || 'Unknown',
                    count: cat._count.id,
                    revenue: revenue
                };
            })
        );

        return categoryData
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);
    }

    // Get top performing products
    private async getTopProducts() {
        const products = await this.prisma.product.findMany({
            where: { isActive: true },
            select: {
                id: true,
                title: true,
                soldCount: true,
                price: true,
                rating: true,
                category: true
            },
            orderBy: { soldCount: 'desc' },
            take: 20
        });

        return products.map((product: { id: any; title: any; soldCount: any; price: any; rating: any; }) => ({
            id: product.id,
            title: product.title,
            sales: product.soldCount,
            revenue: Number(product.price) * product.soldCount,
            rating: product.rating || 0
        }));
    }

    // Get monthly revenue trends
    private async getMonthlyRevenue() {
        const orders = await this.prisma.order.findMany({
            where: {
                createdAt: {
                    gte: new Date(new Date().getFullYear(), 0, 1) // Start of current year
                }
            },
            select: {
                total: true,
                createdAt: true
            }
        });

        const monthlyData = new Map<string, { revenue: number; orders: number }>();

        orders.forEach((order: { createdAt: Date; total: number; }) => {
            const month = order.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            const current = monthlyData.get(month) || { revenue: 0, orders: 0 };
            current.revenue += order.total;
            current.orders += 1;
            monthlyData.set(month, current);
        });

        return Array.from(monthlyData.entries()).map(([month, data]) => ({
            month,
            revenue: data.revenue,
            orders: data.orders
        }));
    }

    // Get category performance metrics
    private async getCategoryPerformance() {
        const categories = await this.prisma.product.groupBy({
            by: ['category'],
            where: { isActive: true },
            _count: { id: true },
            _avg: { rating: true }
        });

        return await Promise.all(
            categories.map(async (cat: { category: any; }) => {
                const conversionRate = await this.getCategoryConversionRate(cat.category || 'Unknown');
                const avgOrderValue = await this.getCategoryAverageOrderValue(cat.category || 'Unknown');

                return {
                    category: cat.category || 'Unknown',
                    conversionRate,
                    avgOrderValue
                };
            })
        );
    }

    // Get best performing products with detailed metrics
    private async getBestPerformingProducts() {
        const products = await this.prisma.product.findMany({
            where: { isActive: true },
            select: {
                id: true,
                title: true,
                soldCount: true,
                price: true,
                rating: true,
                reviewCount: true,
                category: true,
                profitMargin: true
            },
            orderBy: { soldCount: 'desc' },
            take: 10
        });

        return products.map((product: { id: any; title: any; soldCount: any; price: any; rating: any; reviewCount: any; profitMargin: any; category: any; }) => ({
            id: product.id,
            title: product.title,
            metrics: {
                sales: product.soldCount,
                revenue: Number(product.price) * product.soldCount,
                rating: product.rating || 0,
                reviews: product.reviewCount,
                profitMargin: product.profitMargin || 0,
                category: product.category
            }
        }));
    }

    // Identify category opportunities
    private async getCategoryOpportunities() {
        const categories = await this.prisma.product.groupBy({
            by: ['category'],
            where: { isActive: true },
            _count: { id: true },
            _avg: { rating: true, soldCount: true }
        });

        const opportunities = categories
            .filter((cat: { category: any; }) => cat.category)
            .map((cat: { category: any; _avg: { rating: any; soldCount: any; }; _count: { id: any; }; }) => {
                const avgRating = cat._avg.rating || 0;
                const avgSales = cat._avg.soldCount || 0;
                const count = cat._count.id;

                let opportunity = '';
                let potential = 0;

                if (avgRating < 4.0 && count > 5) {
                    opportunity = 'Improve product quality and customer satisfaction';
                    potential = 0.8;
                } else if (avgSales < 10 && count > 3) {
                    opportunity = 'Increase marketing and visibility';
                    potential = 0.7;
                } else if (count < 5) {
                    opportunity = 'Expand product range in this category';
                    potential = 0.9;
                } else {
                    opportunity = 'Maintain current performance';
                    potential = 0.3;
                }

                return {
                    category: cat.category!,
                    opportunity,
                    potential
                };
            })
            .sort((a: { potential: number; }, b: { potential: number; }) => b.potential - a.potential);

        return opportunities.slice(0, 5);
    }

    // Analyze seasonal trends
    private async getSeasonalTrends() {
        const currentMonth = new Date().getMonth();
        const season = this.getSeason(currentMonth);

        // Analyze product performance by season
        const seasonalProducts = await this.prisma.product.findMany({
            where: { isActive: true },
            select: {
                category: true,
                soldCount: true,
                tags: true
            }
        });

        const seasonalAnalysis = this.analyzeSeasonalPerformance(seasonalProducts, season);

        return [
            {
                season,
                trend: seasonalAnalysis.trend,
                impact: seasonalAnalysis.impact
            }
        ];
    }

    // Get profit analysis
    private async getProfitAnalysis() {
        const products = await this.prisma.product.findMany({
            where: { isActive: true },
            select: {
                price: true,
                soldCount: true,
                profitMargin: true,
                category: true
            }
        });

        let totalProfit = 0;
        const categoryProfits = new Map<string, { profit: number; revenue: number }>();

        products.forEach((product: { price: any; soldCount: any; profitMargin: any; category: any; }) => {
            const revenue = Number(product.price) * product.soldCount;
            const profit = revenue * ((product.profitMargin || 20) / 100);
            totalProfit += profit;

            const category = product.category || 'Unknown';
            const current = categoryProfits.get(category) || { profit: 0, revenue: 0 };
            current.profit += profit;
            current.revenue += revenue;
            categoryProfits.set(category, current);
        });

        const totalRevenue = products.reduce((sum: number, p: { price: any; soldCount: any; }) => sum + (Number(p.price) * p.soldCount), 0);
        const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

        const topProfitCategories = Array.from(categoryProfits.entries())
            .map(([category, data]) => ({
                category,
                profit: data.profit,
                margin: data.revenue > 0 ? (data.profit / data.revenue) * 100 : 0
            }))
            .sort((a, b) => b.profit - a.profit)
            .slice(0, 5);

        return {
            totalProfit,
            profitMargin,
            topProfitCategories
        };
    }

    // Generate actionable recommendations
    private async generateRecommendations() {
        const recommendations = [];

        // Analyze product performance
        const lowRatedProducts = await this.prisma.product.findMany({
            where: {
                isActive: true,
                rating: { lt: 4.0 },
                reviewCount: { gt: 5 }
            },
            take: 5
        });

        if (lowRatedProducts.length > 0) {
            recommendations.push({
                type: 'product' as const,
                title: 'Improve Product Quality',
                description: `${lowRatedProducts.length} products have ratings below 4.0. Consider improving quality or finding better suppliers.`,
                impact: 'high' as const,
                action: 'Review and improve low-rated products'
            });
        }

        // Analyze category gaps
        const categories = await this.prisma.product.groupBy({
            by: ['category'],
            _count: { id: true }
        });

        const lowCategoryCount = categories.filter((cat: { _count: { id: any; }; }) => cat._count.id < 5);
        if (lowCategoryCount.length > 0) {
            recommendations.push({
                type: 'category' as const,
                title: 'Expand Product Categories',
                description: `${lowCategoryCount.length} categories have fewer than 5 products. Consider expanding these categories.`,
                impact: 'medium' as const,
                action: 'Add more products to under-represented categories'
            });
        }

        // Analyze pricing strategy
        const avgProfitMargin = await this.getAverageProfitMargin();
        if (avgProfitMargin < 25) {
            recommendations.push({
                type: 'pricing' as const,
                title: 'Optimize Pricing Strategy',
                description: `Current average profit margin is ${avgProfitMargin.toFixed(1)}%. Consider adjusting prices for better profitability.`,
                impact: 'high' as const,
                action: 'Review and adjust product pricing'
            });
        }

        // Marketing recommendations
        const lowVisibilityProducts = await this.prisma.product.findMany({
            where: {
                isActive: true,
                soldCount: { lt: 5 },
                rating: { gte: 4.0 }
            },
            take: 5
        });

        if (lowVisibilityProducts.length > 0) {
            recommendations.push({
                type: 'marketing' as const,
                title: 'Boost Product Visibility',
                description: `${lowVisibilityProducts.length} high-rated products have low sales. Consider marketing campaigns to increase visibility.`,
                impact: 'medium' as const,
                action: 'Implement marketing campaigns for high-quality, low-visibility products'
            });
        }

        return recommendations;
    }

    // Helper methods
    private async getTotalRevenue(): Promise<number> {
        const orders = await this.prisma.order.findMany({
            select: { total: true }
        });
        return orders.reduce((sum: number, order: { total: number; }) => sum + order.total, 0);
    }

    private async getAverageRating(): Promise<number> {
        const result = await this.prisma.product.aggregate({
            where: { isActive: true },
            _avg: { rating: true }
        });
        return result._avg.rating || 0;
    }

    private async getCategoryRevenue(category: string): Promise<number> {
        const products = await this.prisma.product.findMany({
            where: { category, isActive: true },
            select: { price: true, soldCount: true }
        });
        return products.reduce((sum: number, p: { price: any; soldCount: any; }) => sum + (Number(p.price) * p.soldCount), 0);
    }

    private async getCategoryConversionRate(category: string): Promise<number> {
        const products = await this.prisma.product.count({ where: { category, isActive: true } });
        const orders = await this.prisma.order.count();
        return products > 0 ? (orders / products) * 100 : 0;
    }

    private async getCategoryAverageOrderValue(category: string): Promise<number> {
        const result = await this.prisma.order.aggregate({
            _avg: { total: true }
        });
        return result._avg.total || 0;
    }

    private async getAverageProfitMargin(): Promise<number> {
        const result = await this.prisma.product.aggregate({
            where: { isActive: true },
            _avg: { profitMargin: true }
        });
        return result._avg.profitMargin || 0;
    }

    private getSeason(month: number): string {
        if (month >= 2 && month <= 4) return 'Spring';
        if (month >= 5 && month <= 7) return 'Summer';
        if (month >= 8 && month <= 10) return 'Fall';
        return 'Winter';
    }

    private analyzeSeasonalPerformance(products: any[], season: string) {
        // Simple seasonal analysis - in a real implementation, you'd use more sophisticated algorithms
        const seasonalKeywords = {
            Spring: ['light', 'fresh', 'outdoor', 'garden'],
            Summer: ['cool', 'beach', 'vacation', 'outdoor'],
            Fall: ['warm', 'cozy', 'indoor', 'autumn'],
            Winter: ['warm', 'cozy', 'indoor', 'winter']
        };

        const keywords = seasonalKeywords[season as keyof typeof seasonalKeywords] || [];
        let seasonalScore = 0;

        products.forEach((product: { tags: any; category: any; soldCount: any; }) => {
            const tags = product.tags || [];
            const category = product.category || '';

            keywords.forEach(keyword => {
                if (tags.some((tag: string) => tag.toLowerCase().includes(keyword)) ||
                    category.toLowerCase().includes(keyword)) {
                    seasonalScore += product.soldCount;
                }
            });
        });

        const trend = seasonalScore > 100 ? 'Strong seasonal demand' : 'Moderate seasonal demand';
        const impact = Math.min(seasonalScore / 100, 1.0);

        return { trend, impact };
    }
}