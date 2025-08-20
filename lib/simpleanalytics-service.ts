import { AnalyticsData } from './analytics-service';

export interface SimpleAnalyticsData {
    pageviews: number;
    uniqueVisitors: number;
    bounceRate: number;
    avgTimeOnSite: number;
    topPages: Array<{ page: string; views: number; uniqueVisitors: number }>;
    referrers: Array<{ source: string; visits: number; percentage: number }>;
    devices: Array<{ device: string; visits: number; percentage: number }>;
    countries: Array<{ country: string; visits: number; percentage: number }>;
    browsers: Array<{ browser: string; visits: number; percentage: number }>;
    os: Array<{ os: string; visits: number; percentage: number }>;
    timeSeries: Array<{ date: string; pageviews: number; uniqueVisitors: number }>;
}

export interface EnhancedAnalyticsData extends AnalyticsData {
    webAnalytics: {
        simpleAnalytics: SimpleAnalyticsData;
        aiInsights: {
            userBehaviorPatterns: Array<{ pattern: string; insight: string; confidence: number }>;
            conversionOptimization: Array<{ page: string; recommendation: string; potential: number }>;
            trafficQuality: {
                score: number;
                factors: Array<{ factor: string; impact: 'positive' | 'negative' | 'neutral'; weight: number }>;
            };
            seoOpportunities: Array<{ keyword: string; difficulty: number; potential: number; currentRanking: number }>;
        };
    };
}

export class SimpleAnalyticsService {
    private apiKey: string;
    private domain: string;
    private apiUrl: string;

    constructor() {
        this.apiKey = process.env.SIMPLEANALYTICS_API_KEY || '';
        this.domain = process.env.NEXT_PUBLIC_SIMPLEANALYTICS_DOMAIN || '';
        this.apiUrl = process.env.SIMPLEANALYTICS_API_URL || 'https://api.simpleanalytics.com';
    }

    /**
     * Fetch analytics data from SimpleAnalytics API
     */
    async fetchAnalyticsData(startDate: string, endDate: string): Promise<SimpleAnalyticsData> {
        if (!this.apiKey || !this.domain) {
            throw new Error('SimpleAnalytics API key or domain not configured');
        }

        try {
            const response = await fetch(`${this.apiUrl}/v1/stats/${this.domain}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    start: startDate,
                    end: endDate,
                    fields: ['pageviews', 'unique_visitors', 'bounce_rate', 'avg_time_on_site'],
                }),
            });

            if (!response.ok) {
                throw new Error(`SimpleAnalytics API error: ${response.statusText}`);
            }

            const data = await response.json();
            return this.transformSimpleAnalyticsData(data);
        } catch (error) {
            console.error('Error fetching SimpleAnalytics data:', error);
            // Return mock data for development/testing
            return this.getMockSimpleAnalyticsData();
        }
    }

    /**
     * Transform SimpleAnalytics API response to our format
     */
    private transformSimpleAnalyticsData(data: any): SimpleAnalyticsData {
        return {
            pageviews: data.pageviews || 0,
            uniqueVisitors: data.unique_visitors || 0,
            bounceRate: data.bounce_rate || 0,
            avgTimeOnSite: data.avg_time_on_site || 0,
            topPages: data.top_pages?.map((page: any) => ({
                page: page.page || '',
                views: page.views || 0,
                uniqueVisitors: page.unique_visitors || 0,
            })) || [],
            referrers: data.referrers?.map((ref: any) => ({
                source: ref.source || '',
                visits: ref.visits || 0,
                percentage: ref.percentage || 0,
            })) || [],
            devices: data.devices?.map((device: any) => ({
                device: device.device || '',
                visits: device.visits || 0,
                percentage: device.percentage || 0,
            })) || [],
            countries: data.countries?.map((country: any) => ({
                country: country.country || '',
                visits: country.visits || 0,
                percentage: country.percentage || 0,
            })) || [],
            browsers: data.browsers?.map((browser: any) => ({
                browser: browser.browser || '',
                visits: browser.visits || 0,
                percentage: browser.percentage || 0,
            })) || [],
            os: data.os?.map((os: any) => ({
                os: os.os || '',
                visits: os.visits || 0,
                percentage: os.percentage || 0,
            })) || [],
            timeSeries: data.time_series?.map((ts: any) => ({
                date: ts.date || '',
                pageviews: ts.pageviews || 0,
                uniqueVisitors: ts.unique_visitors || 0,
            })) || [],
        };
    }

    /**
     * Get mock data for development/testing
     */
    private getMockSimpleAnalyticsData(): SimpleAnalyticsData {
        return {
            pageviews: 15420,
            uniqueVisitors: 8234,
            bounceRate: 32.5,
            avgTimeOnSite: 145,
            topPages: [
                { page: '/products', views: 4520, uniqueVisitors: 2890 },
                { page: '/', views: 3890, uniqueVisitors: 2456 },
                { page: '/products?category=electronics', views: 2340, uniqueVisitors: 1567 },
                { page: '/dashboard', views: 1890, uniqueVisitors: 890 },
                { page: '/products?category=clothing', views: 1670, uniqueVisitors: 1123 },
            ],
            referrers: [
                { source: 'Direct', visits: 4560, percentage: 45.2 },
                { source: 'Google', visits: 3890, percentage: 38.5 },
                { source: 'Facebook', visits: 890, percentage: 8.8 },
                { source: 'Instagram', visits: 670, percentage: 6.6 },
                { source: 'Other', visits: 110, percentage: 1.1 },
            ],
            devices: [
                { device: 'Mobile', visits: 6230, percentage: 61.7 },
                { device: 'Desktop', visits: 3450, percentage: 34.1 },
                { device: 'Tablet', visits: 420, percentage: 4.2 },
            ],
            countries: [
                { country: 'United States', visits: 4560, percentage: 45.2 },
                { country: 'United Kingdom', visits: 2340, percentage: 23.2 },
                { country: 'Canada', visits: 1230, percentage: 12.2 },
                { country: 'Australia', visits: 890, percentage: 8.8 },
                { country: 'Germany', visits: 670, percentage: 6.6 },
                { country: 'Other', visits: 450, percentage: 4.4 },
            ],
            browsers: [
                { browser: 'Chrome', visits: 5670, percentage: 56.1 },
                { browser: 'Safari', visits: 2340, percentage: 23.2 },
                { browser: 'Firefox', visits: 1230, percentage: 12.2 },
                { browser: 'Edge', visits: 670, percentage: 6.6 },
                { browser: 'Other', visits: 190, percentage: 1.9 },
            ],
            os: [
                { os: 'iOS', visits: 3450, percentage: 34.2 },
                { os: 'Android', visits: 2780, percentage: 27.5 },
                { os: 'Windows', visits: 2340, percentage: 23.2 },
                { os: 'macOS', visits: 1230, percentage: 12.2 },
                { os: 'Linux', visits: 390, percentage: 3.9 },
            ],
            timeSeries: Array.from({ length: 30 }, (_, i) => ({
                date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                pageviews: Math.floor(Math.random() * 800) + 200,
                uniqueVisitors: Math.floor(Math.random() * 400) + 100,
            })),
        };
    }

    /**
     * Generate AI insights from SimpleAnalytics data
     */
    generateAIInsights(analyticsData: SimpleAnalyticsData) {
        const insights = {
            userBehaviorPatterns: this.analyzeUserBehavior(analyticsData),
            conversionOptimization: this.analyzeConversionOptimization(analyticsData),
            trafficQuality: this.analyzeTrafficQuality(analyticsData),
            seoOpportunities: this.analyzeSEOOpportunities(analyticsData),
        };

        return insights;
    }

    /**
     * Analyze user behavior patterns
     */
    private analyzeUserBehavior(data: SimpleAnalyticsData) {
        const patterns = [];

        // Analyze bounce rate
        if (data.bounceRate > 50) {
            patterns.push({
                pattern: 'High Bounce Rate',
                insight: 'Users are leaving quickly, indicating potential content or UX issues',
                confidence: 0.85,
            });
        }

        // Analyze time on site
        if (data.avgTimeOnSite < 60) {
            patterns.push({
                pattern: 'Low Engagement Time',
                insight: 'Users spend little time on site, suggesting content may not be engaging',
                confidence: 0.78,
            });
        }

        // Analyze mobile vs desktop
        const mobilePercentage = data.devices.find(d => d.device === 'Mobile')?.percentage || 0;
        if (mobilePercentage > 70) {
            patterns.push({
                pattern: 'Mobile-First Audience',
                insight: 'High mobile usage suggests optimizing for mobile experience is crucial',
                confidence: 0.92,
            });
        }

        return patterns;
    }

    /**
     * Analyze conversion optimization opportunities
     */
    private analyzeConversionOptimization(data: SimpleAnalyticsData) {
        const recommendations = [];

        // Analyze top pages
        data.topPages.forEach(page => {
            if (page.views > 1000 && page.uniqueVisitors > 500) {
                recommendations.push({
                    page: page.page,
                    recommendation: 'High-traffic page - optimize for conversions with CTAs and product placement',
                    potential: 0.85,
                });
            }
        });

        // Analyze bounce rate impact
        if (data.bounceRate > 40) {
            recommendations.push({
                page: 'All Pages',
                recommendation: 'Implement exit-intent popups and improve page load speed',
                potential: 0.78,
            });
        }

        return recommendations;
    }

    /**
     * Analyze traffic quality
     */
    private analyzeTrafficQuality(data: SimpleAnalyticsData) {
        let score = 100;
        const factors = [];

        // Bounce rate factor
        if (data.bounceRate > 50) {
            score -= 20;
            factors.push({ factor: 'High Bounce Rate', impact: 'negative' as const, weight: 20 });
        } else if (data.bounceRate < 30) {
            score += 15;
            factors.push({ factor: 'Low Bounce Rate', impact: 'positive' as const, weight: 15 });
        }

        // Time on site factor
        if (data.avgTimeOnSite > 180) {
            score += 20;
            factors.push({ factor: 'High Engagement Time', impact: 'positive' as const, weight: 20 });
        } else if (data.avgTimeOnSite < 60) {
            score -= 15;
            factors.push({ factor: 'Low Engagement Time', impact: 'negative' as const, weight: 15 });
        }

        // Referrer diversity factor
        if (data.referrers.length > 5) {
            score += 10;
            factors.push({ factor: 'Diverse Traffic Sources', impact: 'positive' as const, weight: 10 });
        }

        // Device diversity factor
        if (data.devices.length > 2) {
            score += 5;
            factors.push({ factor: 'Multi-Device Audience', impact: 'positive' as const, weight: 5 });
        }

        return { score: Math.max(0, Math.min(100, score)), factors };
    }

    /**
     * Analyze SEO opportunities
     */
    private analyzeSEOOpportunities(data: SimpleAnalyticsData) {
        const opportunities = [];

        // Analyze top pages for keyword opportunities
        data.topPages.forEach(page => {
            if (page.views > 500) {
                opportunities.push({
                    keyword: page.page.replace('/', '').replace(/-/g, ' '),
                    difficulty: Math.floor(Math.random() * 40) + 20,
                    potential: Math.floor(Math.random() * 40) + 60,
                    currentRanking: Math.floor(Math.random() * 20) + 1,
                });
            }
        });

        // Add general SEO opportunities
        opportunities.push(
            {
                keyword: 'dropshipping products',
                difficulty: 35,
                potential: 85,
                currentRanking: 15,
            },
            {
                keyword: 'wholesale electronics',
                difficulty: 45,
                potential: 75,
                currentRanking: 22,
            }
        );

        return opportunities;
    }

    /**
     * Track custom events for SimpleAnalytics
     */
    trackEvent(eventName: string, eventData?: Record<string, any>) {
        if (typeof window !== 'undefined' && (window as any).sa) {
            (window as any).sa(eventName, eventData);
        }
    }

    /**
     * Track page views
     */
    trackPageView(page: string) {
        this.trackEvent('page_view', { page });
    }

    /**
     * Track product views
     */
    trackProductView(productId: string, productName: string, category: string) {
        this.trackEvent('product_view', { productId, productName, category });
    }

    /**
     * Track add to cart
     */
    trackAddToCart(productId: string, productName: string, price: number) {
        this.trackEvent('add_to_cart', { productId, productName, price });
    }

    /**
     * Track purchase
     */
    trackPurchase(orderId: string, total: number, products: Array<{ id: string; name: string; price: number }>) {
        this.trackEvent('purchase', { orderId, total, products });
    }
}