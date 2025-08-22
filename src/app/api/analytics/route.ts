import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');
        const limit = parseInt(searchParams.get('limit') || '10');
        const timeRange = searchParams.get('timeRange') || '7d';
        const currency = searchParams.get('currency') || 'USD';

        // Calculate start date based on time range
        const startDate = new Date();
        switch (timeRange) {
            case '1d':
                startDate.setDate(startDate.getDate() - 1);
                break;
            case '7d':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(startDate.getDate() - 90);
                break;
            default:
                startDate.setDate(startDate.getDate() - 7);
        }

        // Check if prisma is available
        if (!prisma || typeof prisma.product?.count !== 'function') {
            // Return mock data if database is not available
            const mockAnalyticsData = {
                overview: {
                    totalProducts: 1250,
                    totalOrders: 15420,
                    totalRevenue: 1250000,
                    totalCustomers: 8900,
                    averageRating: 4.2,
                    totalReviews: 45600
                },
                trends: {
                    topCategories: [
                        { name: 'Electronics', count: 450, revenue: 450000 },
                        { name: 'Fashion', count: 380, revenue: 380000 },
                        { name: 'Home & Garden', count: 320, revenue: 320000 }
                    ],
                    topProducts: [
                        { id: '1', title: 'Wireless Headphones', soldCount: 1250, revenue: 125000 },
                        { id: '2', title: 'Smart Watch', soldCount: 980, revenue: 98000 },
                        { id: '3', title: 'Coffee Maker', soldCount: 750, revenue: 75000 }
                    ],
                    monthlyRevenue: [
                        { month: 'Jan', revenue: 95000 },
                        { month: 'Feb', revenue: 105000 },
                        { month: 'Mar', revenue: 115000 }
                    ],
                    categoryPerformance: [
                        { category: 'Electronics', performance: 85, growth: 12 },
                        { category: 'Fashion', performance: 78, growth: 8 },
                        { category: 'Home & Garden', performance: 72, growth: 15 }
                    ]
                },
                insights: {
                    bestPerformingProducts: [
                        { id: '1', title: 'Wireless Headphones', performance: 95, growth: 25 },
                        { id: '2', title: 'Smart Watch', performance: 88, growth: 18 },
                        { id: '3', title: 'Coffee Maker', performance: 82, growth: 22 }
                    ],
                    categoryOpportunities: [
                        { category: 'Electronics', opportunity: 'High', potential: 150000 },
                        { category: 'Fashion', opportunity: 'Medium', potential: 120000 },
                        { category: 'Home & Garden', opportunity: 'High', potential: 180000 }
                    ],
                    seasonalTrends: [
                        { season: 'Spring', trend: 'Home & Garden', growth: 25 },
                        { season: 'Summer', trend: 'Electronics', growth: 20 },
                        { season: 'Fall', trend: 'Fashion', growth: 30 }
                    ],
                    profitAnalysis: [
                        { category: 'Electronics', margin: 35, trend: 'increasing' },
                        { category: 'Fashion', margin: 28, trend: 'stable' },
                        { category: 'Home & Garden', margin: 32, trend: 'increasing' }
                    ]
                },
                recommendations: [
                    'Focus on Electronics category - highest growth potential',
                    'Expand Fashion line during fall season',
                    'Increase marketing for Home & Garden products'
                ]
            };

            return NextResponse.json({
                success: true,
                data: mockAnalyticsData,
                timestamp: new Date().toISOString(),
                timeRange,
                note: 'Using mock data - database not available'
            });
        }

        // Handle specific actions
        if (action === 'live-sales') {
            return await getLiveSales(limit);
        }

        if (action === 'price-updates') {
            return await getPriceUpdates(limit);
        }

        if (action === 'inventory-updates') {
            return await getInventoryUpdates(limit);
        }

        if (action === 'dashboard-metrics') {
            return await getDashboardMetrics(timeRange, currency);
        }

        if (action === 'revenue-chart') {
            return await getRevenueChart(timeRange, currency);
        }

        // Default analytics behavior
        const analysisType = searchParams.get('type') || 'comprehensive';

        // Fetch analytics data from database
        const [
            totalProducts,
            totalOrders,
            totalRevenue,
            totalCustomers,
            averageRating,
            totalReviews,
            products,
            orders,
            reviews
        ] = await Promise.all([
            prisma.product.count({ where: { isActive: true } }),
            prisma.order.count({ where: { createdAt: { gte: startDate } } }),
            getTotalRevenue(startDate),
            prisma.user.count(),
            getAverageRating(),
            prisma.review.count(),
            prisma.product.findMany({
                where: { isActive: true },
                select: {
                    id: true,
                    title: true,
                    soldCount: true,
                    price: true,
                    rating: true,
                    reviewCount: true,
                    category: true,
                    profitMargin: true,
                    tags: true,
                    createdAt: true
                }
            }),
            prisma.order.findMany({
                where: { createdAt: { gte: startDate } },
                select: {
                    id: true,
                    total: true,
                    createdAt: true,
                    status: true
                }
            }),
            prisma.review.findMany({
                where: { createdAt: { gte: startDate } },
                select: {
                    id: true,
                    rating: true,
                    createdAt: true,
                    productId: true
                }
            })
        ]);

        // Process data for analytics
        const analyticsData = {
            overview: {
                totalProducts,
                totalOrders,
                totalRevenue,
                totalCustomers,
                averageRating,
                totalReviews
            },
            trends: {
                topCategories: await getTopCategories(products),
                topProducts: getTopProducts(products),
                monthlyRevenue: getMonthlyRevenue(orders, startDate),
                categoryPerformance: await getCategoryPerformance(products, orders)
            },
            insights: {
                bestPerformingProducts: getBestPerformingProducts(products),
                categoryOpportunities: getCategoryOpportunities(products),
                seasonalTrends: getSeasonalTrends(products, startDate),
                profitAnalysis: getProfitAnalysis(products)
            },
            recommendations: generateRecommendations(products, orders, reviews)
        };

        return NextResponse.json({
            success: true,
            data: analyticsData,
            timestamp: new Date().toISOString(),
            timeRange
        });

    } catch (error) {
        console.error('Analytics API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch analytics data',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// Helper functions
async function getTotalRevenue(startDate: Date): Promise<number> {
    const orders = await prisma.order.findMany({
        where: { createdAt: { gte: startDate } },
        select: { total: true }
    });
    return orders.reduce((sum: number, order: { total: number }) => sum + order.total, 0);
}

async function getAverageRating(): Promise<number> {
    const result = await prisma.product.aggregate({
        where: { isActive: true },
        _avg: { rating: true }
    });
    return result._avg.rating || 0;
}

function getTopCategories(products: any[]) {
    const categoryStats = new Map<string, { count: number; revenue: number }>();

    products.forEach(product => {
        const category = product.category || 'Unknown';
        const revenue = Number(product.price) * product.soldCount;

        const current = categoryStats.get(category) || { count: 0, revenue: 0 };
        current.count += 1;
        current.revenue += revenue;
        categoryStats.set(category, current);
    });

    return Array.from(categoryStats.entries())
        .map(([category, stats]) => ({
            category,
            count: stats.count,
            revenue: Math.round(stats.revenue * 100) / 100
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);
}

function getTopProducts(products: any[]) {
    return products
        .sort((a, b) => b.soldCount - a.soldCount)
        .slice(0, 20)
        .map(product => ({
            id: product.id,
            title: product.title,
            sales: product.soldCount,
            revenue: Number(product.price) * product.soldCount,
            rating: product.rating || 0
        }));
}

function getMonthlyRevenue(orders: any[], startDate: Date) {
    const monthlyData = new Map<string, { revenue: number; orders: number }>();

    orders.forEach(order => {
        const month = order.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const current = monthlyData.get(month) || { revenue: 0, orders: 0 };
        current.revenue += order.total;
        current.orders += 1;
        monthlyData.set(month, current);
    });

    return Array.from(monthlyData.entries())
        .map(([month, data]) => ({
            month,
            revenue: Math.round(data.revenue * 100) / 100,
            orders: data.orders
        }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
}

async function getCategoryPerformance(products: any[], orders: any[]) {
    const categoryStats = new Map<string, { products: number; orders: number; totalRevenue: number }>();

    products.forEach(product => {
        const category = product.category || 'Unknown';
        const current = categoryStats.get(category) || { products: 0, orders: 0, totalRevenue: 0 };
        current.products += 1;
        current.totalRevenue += Number(product.price) * product.soldCount;
        categoryStats.set(category, current);
    });

    const totalOrders = orders.length;

    return Array.from(categoryStats.entries()).map(([category, stats]) => ({
        category,
        conversionRate: totalOrders > 0 ? (stats.orders / stats.products) * 100 : 0,
        avgOrderValue: stats.orders > 0 ? stats.totalRevenue / stats.orders : 0
    }));
}

function getBestPerformingProducts(products: any[]) {
    return products
        .sort((a, b) => b.soldCount - a.soldCount)
        .slice(0, 10)
        .map(product => ({
            id: product.id,
            title: product.title,
            metrics: {
                sales: product.soldCount,
                revenue: Number(product.price) * product.soldCount,
                rating: product.rating || 0,
                reviews: product.reviewCount,
                profitMargin: product.profitMargin || 20,
                category: product.category
            }
        }));
}

function getCategoryOpportunities(products: any[]) {
    const categoryStats = new Map<string, { count: number; avgRating: number; avgSales: number; totalRating: number; totalSales: number }>();

    products.forEach(product => {
        const category = product.category || 'Unknown';
        const current = categoryStats.get(category) || { count: 0, avgRating: 0, avgSales: 0, totalRating: 0, totalSales: 0 };
        current.count += 1;
        current.totalRating += product.rating || 0;
        current.totalSales += product.soldCount;
        categoryStats.set(category, current);
    });

    return Array.from(categoryStats.entries())
        .map(([category, stats]) => {
            const avgRating = stats.totalRating / stats.count;
            const avgSales = stats.totalSales / stats.count;

            let opportunity = '';
            let potential = 0;

            if (avgRating < 4.0 && stats.count > 5) {
                opportunity = 'Improve product quality and customer satisfaction';
                potential = 0.8;
            } else if (avgSales < 10 && stats.count > 3) {
                opportunity = 'Increase marketing and visibility';
                potential = 0.7;
            } else if (stats.count < 5) {
                opportunity = 'Expand product range in this category';
                potential = 0.9;
            } else {
                opportunity = 'Maintain current performance';
                potential = 0.3;
            }

            return { category, opportunity, potential };
        })
        .sort((a, b) => b.potential - a.potential)
        .slice(0, 5);
}

function getSeasonalTrends(products: any[], startDate: Date) {
    const currentMonth = new Date().getMonth();
    const season = getSeason(currentMonth);

    const seasonalKeywords = {
        Spring: ['light', 'fresh', 'outdoor', 'garden'],
        Summer: ['cool', 'beach', 'vacation', 'outdoor'],
        Fall: ['warm', 'cozy', 'indoor', 'autumn'],
        Winter: ['warm', 'cozy', 'indoor', 'winter']
    };

    const keywords = seasonalKeywords[season as keyof typeof seasonalKeywords] || [];
    let seasonalScore = 0;

    products.forEach(product => {
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

    return [{ season, trend, impact }];
}

function getSeason(month: number): string {
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Fall';
    return 'Winter';
}

function getProfitAnalysis(products: any[]) {
    let totalProfit = 0;
    const categoryProfits = new Map<string, { profit: number; revenue: number }>();

    products.forEach(product => {
        const revenue = Number(product.price) * product.soldCount;
        const profit = revenue * ((product.profitMargin || 20) / 100);
        totalProfit += profit;

        const category = product.category || 'Unknown';
        const current = categoryProfits.get(category) || { profit: 0, revenue: 0 };
        current.profit += profit;
        current.revenue += revenue;
        categoryProfits.set(category, current);
    });

    const totalRevenue = products.reduce((sum, p) => sum + (Number(p.price) * p.soldCount), 0);
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    const topProfitCategories = Array.from(categoryProfits.entries())
        .map(([category, data]) => ({
            category,
            profit: Math.round(data.profit * 100) / 100,
            margin: data.revenue > 0 ? Math.round((data.profit / data.revenue) * 100 * 100) / 100 : 0
        }))
        .sort((a, b) => b.profit - a.profit)
        .slice(0, 5);

    return {
        totalProfit: Math.round(totalProfit * 100) / 100,
        profitMargin: Math.round(profitMargin * 100) / 100,
        topProfitCategories
    };
}

function generateRecommendations(products: any[], orders: any[], reviews: any[]) {
    const recommendations = [];

    // Analyze product performance
    const lowRatedProducts = products.filter(p => (p.rating || 0) < 4.0 && p.reviewCount > 5);
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
    const categoryCounts = new Map<string, number>();
    products.forEach(p => {
        const category = p.category || 'Unknown';
        categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
    });

    const underRepresented = Array.from(categoryCounts.entries()).filter(([_, count]) => count < 5);
    if (underRepresented.length > 0) {
        recommendations.push({
            type: 'category' as const,
            title: 'Expand Product Categories',
            description: `${underRepresented.length} categories have fewer than 5 products. Consider expanding these categories.`,
            impact: 'medium' as const,
            action: 'Add more products to under-represented categories'
        });
    }

    // Analyze pricing strategy
    const avgProfitMargin = products.reduce((sum, p) => sum + (p.profitMargin || 20), 0) / products.length;
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
    const lowVisibilityProducts = products.filter(p => p.soldCount < 5 && (p.rating || 0) >= 4.0);
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

// Action handlers for LiveSalesTicker component
async function getLiveSales(limit: number) {
    try {
        // Mock live sales data for now
        const mockSales = [
            {
                id: 'sale-1',
                customer: 'Ahmed Hassan',
                productTitle: 'Wireless Bluetooth Headphones',
                amount: 89.99,
                currency: 'USD',
                paymentMethod: 'card' as const,
                location: 'Dubai, UAE',
                timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
            },
            {
                id: 'sale-2',
                customer: 'Fatima Kuwait',
                productTitle: 'Smart Fitness Watch',
                amount: 199.99,
                currency: 'USD',
                paymentMethod: 'crypto' as const,
                cryptoAmount: 0.005,
                cryptoType: 'BTC',
                location: 'Kuwait City, Kuwait',
                timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
            },
            {
                id: 'sale-3',
                customer: 'Omar Dubai',
                productTitle: 'Organic Face Cream',
                amount: 29.99,
                currency: 'USD',
                paymentMethod: 'card' as const,
                location: 'Abu Dhabi, UAE',
                timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 mins ago
            }
        ];

        return NextResponse.json({
            success: true,
            data: mockSales.slice(0, limit)
        });
    } catch (error) {
        console.error('Error getting live sales:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to get live sales' },
            { status: 500 }
        );
    }
}

async function getPriceUpdates(limit: number) {
    try {
        // Mock price updates data for now
        const mockPriceUpdates = [
            {
                id: 'price-1',
                productId: 'prod-1',
                productTitle: 'Wireless Bluetooth Headphones',
                oldPrice: 89.99,
                newPrice: 79.99,
                currency: 'USD',
                changePercent: -11.1,
                isVolatile: false,
                timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 mins ago
            },
            {
                id: 'price-2',
                productId: 'prod-2',
                productTitle: 'Smart Fitness Watch',
                oldPrice: 199.99,
                newPrice: 189.99,
                currency: 'USD',
                changePercent: -5.0,
                isVolatile: false,
                timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
            }
        ];

        return NextResponse.json({
            success: true,
            data: mockPriceUpdates.slice(0, limit)
        });
    } catch (error) {
        console.error('Error getting price updates:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to get price updates' },
            { status: 500 }
        );
    }
}

async function getInventoryUpdates(limit: number) {
    try {
        // Mock inventory updates data for now
        const mockInventoryUpdates = [
            {
                id: 'inventory-1',
                productId: 'prod-1',
                productTitle: 'Wireless Bluetooth Headphones',
                action: 'restocked' as const,
                quantity: 50,
                timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 mins ago
            },
            {
                id: 'inventory-2',
                productId: 'prod-3',
                productTitle: 'Organic Face Cream',
                action: 'low_stock' as const,
                quantity: 5,
                timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
            }
        ];

        return NextResponse.json({
            success: true,
            data: mockInventoryUpdates.slice(0, limit)
        });
    } catch (error) {
        console.error('Error getting inventory updates:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to get inventory updates' },
            { status: 500 }
        );
    }
}

async function getDashboardMetrics(timeRange: string, currency: string) {
    try {
        // Mock dashboard metrics data
        const mockMetrics = {
            totalRevenue: 1250000,
            totalOrders: 15420,
            totalCustomers: 8900,
            averageOrderValue: 89.45,
            conversionRate: 3.2,
            customerLifetime: 1247,
            topProducts: [
                { id: '1', title: 'Wireless Headphones', sales: 1250, revenue: 125000 },
                { id: '2', title: 'Smart Watch', sales: 980, revenue: 98000 },
                { id: '3', title: 'Coffee Maker', sales: 750, revenue: 75000 }
            ],
            topCategories: [
                { name: 'Electronics', revenue: 450000, growth: 12 },
                { name: 'Fashion', revenue: 380000, growth: 8 },
                { name: 'Home & Garden', revenue: 320000, growth: 15 }
            ]
        };

        return NextResponse.json({
            success: true,
            data: mockMetrics
        });
    } catch (error) {
        console.error('Error getting dashboard metrics:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to get dashboard metrics' },
            { status: 500 }
        );
    }
}

async function getRevenueChart(timeRange: string, currency: string) {
    try {
        // Mock revenue chart data
        const mockRevenueData = [
            { month: 'Jan', revenue: 95000, orders: 1200 },
            { month: 'Feb', revenue: 105000, orders: 1350 },
            { month: 'Mar', revenue: 115000, orders: 1480 },
            { month: 'Apr', revenue: 125000, orders: 1620 },
            { month: 'May', revenue: 135000, orders: 1750 },
            { month: 'Jun', revenue: 145000, orders: 1880 }
        ];

        return NextResponse.json({
            success: true,
            data: mockRevenueData
        });
    } catch (error) {
        console.error('Error getting revenue chart:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to get revenue chart' },
            { status: 500 }
        );
    }
}