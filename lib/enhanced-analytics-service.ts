import { AnalyticsService, AnalyticsData } from './analytics-service';
import { SimpleAnalyticsService, EnhancedAnalyticsData, SimpleAnalyticsData } from './simpleanalytics-service';
import { Parser } from 'json2csv';
import { prisma } from './db';

// Extend the AnalyticsData interface to include cross-platform insights
interface ExtendedAnalyticsData extends AnalyticsData {
    insights: AnalyticsData['insights'] & {
        crossPlatformInsights: Array<{
            type: string;
            title: string;
            description: string;
            priority: 'high' | 'medium' | 'low';
            recommendations: string[];
        }>;
    };
}

export class EnhancedAnalyticsService {
    private analyticsService: AnalyticsService;
    private simpleAnalyticsService: SimpleAnalyticsService;
    private prisma: any;

    constructor(prisma?: any) {
        this.prisma = prisma || prisma;
        this.analyticsService = new AnalyticsService(this.prisma);
        this.simpleAnalyticsService = new SimpleAnalyticsService();
    }

    /**
     * Get comprehensive analytics data including SimpleAnalytics and AI insights
     */
    async getEnhancedAnalyticsData(timeRange: string = '30d'): Promise<EnhancedAnalyticsData> {
        try {
            // Get base analytics data
            const baseAnalytics = await this.analyticsService.getAnalyticsData();

            // Get SimpleAnalytics data
            const { startDate, endDate } = this.calculateDateRange(timeRange);
            const simpleAnalyticsData = await this.simpleAnalyticsService.fetchAnalyticsData(
                startDate.toISOString().split('T')[0],
                endDate.toISOString().split('T')[0]
            );

            // Generate AI insights from SimpleAnalytics data
            const aiInsights = this.simpleAnalyticsService.generateAIInsights(simpleAnalyticsData);

            // Combine and enhance the data
            const enhancedData: EnhancedAnalyticsData = {
                ...baseAnalytics,
                webAnalytics: {
                    simpleAnalytics: simpleAnalyticsData,
                    aiInsights,
                },
                insights: {
                    ...baseAnalytics.insights,
                    crossPlatformInsights: this.generateCrossPlatformInsights(
                        baseAnalytics,
                        simpleAnalyticsData,
                        aiInsights
                    ),
                } as ExtendedAnalyticsData['insights'],
            };

            return enhancedData;
        } catch (error) {
            console.error('Error getting enhanced analytics data:', error);
            throw error;
        }
    }

    /**
     * Calculate date range based on time range string
     */
    private calculateDateRange(timeRange: string): { startDate: Date; endDate: Date } {
        const endDate = new Date();
        const startDate = new Date();

        switch (timeRange) {
            case '7d':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(endDate.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(endDate.getDate() - 90);
                break;
            case '1y':
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
            default:
                startDate.setDate(endDate.getDate() - 30);
        }

        return { startDate, endDate };
    }

    /**
     * Generate cross-platform insights combining business and web analytics
     */
    private generateCrossPlatformInsights(
        businessAnalytics: AnalyticsData,
        webAnalytics: SimpleAnalyticsData,
        aiInsights: any
    ) {
        const insights = [];

        // Conversion rate analysis
        const conversionRate = (businessAnalytics.overview.totalOrders / webAnalytics.uniqueVisitors) * 100;
        if (conversionRate < 2) {
            insights.push({
                type: 'conversion',
                title: 'Low Conversion Rate',
                description: `Current conversion rate is ${conversionRate.toFixed(2)}%. Consider optimizing checkout flow and product pages.`,
                priority: 'high' as const,
                recommendations: [
                    'Implement exit-intent popups',
                    'Optimize product page CTAs',
                    'Improve mobile checkout experience',
                ],
            });
        }

        // Traffic quality vs revenue correlation
        const revenuePerVisitor = businessAnalytics.overview.totalRevenue / webAnalytics.uniqueVisitors;
        if (revenuePerVisitor < 5) {
            insights.push({
                type: 'revenue',
                title: 'Low Revenue Per Visitor',
                description: `Revenue per visitor is $${revenuePerVisitor.toFixed(2)}. Focus on increasing average order value.`,
                priority: 'medium' as const,
                recommendations: [
                    'Implement upselling strategies',
                    'Bundle related products',
                    'Offer volume discounts',
                ],
            });
        }

        // Page performance analysis
        const topPages = webAnalytics.topPages.slice(0, 5);
        topPages.forEach(page => {
            if (page.views > 1000 && page.page !== '/') {
                insights.push({
                    type: 'performance',
                    title: `High-Traffic Page: ${page.page}`,
                    description: `This page receives ${page.views} views. Optimize for conversions.`,
                    priority: 'medium' as const,
                    recommendations: [
                        'Add product recommendations',
                        'Implement A/B testing',
                        'Optimize page load speed',
                    ],
                });
            }
        });

        // Seasonal traffic patterns
        if (webAnalytics.timeSeries.length > 7) {
            const recentTraffic = webAnalytics.timeSeries.slice(-7);
            const avgTraffic = recentTraffic.reduce((sum, day) => sum + day.pageviews, 0) / 7;
            const currentTraffic = recentTraffic[recentTraffic.length - 1].pageviews;

            if (currentTraffic > avgTraffic * 1.2) {
                insights.push({
                    type: 'trend',
                    title: 'Traffic Surge Detected',
                    description: 'Recent traffic is 20% above average. Capitalize on increased visibility.',
                    priority: 'high' as const,
                    recommendations: [
                        'Increase ad spend',
                        'Promote trending products',
                        'Prepare for higher order volume',
                    ],
                });
            }
        }

        return insights;
    }

    /**
     * Get real-time analytics dashboard data
     */
    async getRealTimeDashboardData() {
        try {
            const [enhancedData, realTimeMetrics] = await Promise.all([
                this.getEnhancedAnalyticsData('7d'),
                this.getRealTimeMetrics(),
            ]);

            return {
                ...enhancedData,
                realTime: realTimeMetrics,
            };
        } catch (error) {
            console.error('Error getting real-time dashboard data:', error);
            throw error;
        }
    }

    /**
     * Get real-time metrics
     */
    private async getRealTimeMetrics() {
        // This would typically connect to a real-time analytics service
        // For now, we'll return simulated real-time data
        return {
            currentVisitors: Math.floor(Math.random() * 50) + 10,
            activePages: [
                { page: '/products', visitors: Math.floor(Math.random() * 20) + 5 },
                { page: '/', visitors: Math.floor(Math.random() * 15) + 3 },
                { page: '/dashboard', visitors: Math.floor(Math.random() * 10) + 2 },
            ],
            recentEvents: [
                { time: new Date().toISOString(), event: 'page_view', page: '/products' },
                { time: new Date(Date.now() - 30000).toISOString(), event: 'product_view', product: 'Smartphone X' },
                { time: new Date(Date.now() - 60000).toISOString(), event: 'add_to_cart', product: 'Wireless Earbuds' },
            ],
        };
    }

    /**
     * Export analytics data for external tools
     */
    async exportAnalyticsData(format: 'json' | 'csv' | 'excel', timeRange: string = '30d') {
        const data = await this.getEnhancedAnalyticsData(timeRange);

        switch (format) {
            case 'json':
                return JSON.stringify(data, null, 2);
            case 'csv':
                return this.convertToCSV(data);
            case 'excel':
                return this.convertToExcel(data);
            default:
                throw new Error(`Unsupported export format: ${format}`);
        }
    }

    /**
     * Convert data to CSV format using json2csv
     */
    private convertToCSV(data: any): string {
        try {
            // Flatten nested objects for CSV export
            const flattenedData = this.flattenObject(data);

            // Convert to array format for json2csv
            const csvData = Array.isArray(flattenedData) ? flattenedData : [flattenedData];

            // Parse to CSV
            const parser = new Parser();
            return parser.parse(csvData);
        } catch (error) {
            console.error('Error converting to CSV:', error);
            // Fallback to simple CSV conversion
            return this.simpleCSVConversion(data);
        }
    }

    /**
     * Flatten nested objects for CSV export
     */
    private flattenObject(obj: any, prefix = ''): Record<string, any> {
        return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
            const pre = prefix.length ? prefix + '.' : '';
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                Object.assign(acc, this.flattenObject(obj[key], pre + key));
            } else if (Array.isArray(obj[key])) {
                // Handle arrays by creating separate rows
                obj[key].forEach((item: any, index: number) => {
                    if (typeof item === 'object' && item !== null) {
                        Object.assign(acc, this.flattenObject(item, `${pre}${key}[${index}]`));
                    } else {
                        acc[`${pre}${key}[${index}]`] = item;
                    }
                });
            } else {
                acc[pre + key] = obj[key];
            }
            return acc;
        }, {});
    }

    /**
     * Simple CSV conversion fallback
     */
    private simpleCSVConversion(data: any): string {
        const flattenObject = (obj: any, prefix = ''): Record<string, string> => {
            return Object.keys(obj).reduce((acc: Record<string, string>, key: string) => {
                const pre = prefix.length ? prefix + '.' : '';
                if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                    Object.assign(acc, flattenObject(obj[key], pre + key));
                } else {
                    acc[pre + key] = String(obj[key]);
                }
                return acc;
            }, {});
        };

        const flattened = flattenObject(data);
        const headers = Object.keys(flattened);
        const values = Object.values(flattened);

        return [headers.join(','), values.join(',')].join('\n');
    }

    /**
     * Convert data to Excel format
     */
    private convertToExcel(data: any): Buffer {
        // Implementation for Excel conversion using xlsx library
        // This is a placeholder - implement when needed
        throw new Error('Excel export not yet implemented');
    }
}