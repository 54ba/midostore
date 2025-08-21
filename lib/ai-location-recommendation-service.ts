import { PrismaClient } from '@prisma/client';
import axios from 'axios';

export interface UserContext {
    ipAddress?: string;
    location?: {
        country: string;
        region: string;
        city: string;
        latitude: number;
        longitude: number;
        timezone: string;
    };
    device?: {
        os: string;
        browser: string;
        deviceType: 'mobile' | 'desktop' | 'tablet';
        screenResolution: string;
        language: string;
    };
    behavior?: {
        previousSearches: string[];
        viewedProducts: string[];
        purchaseHistory: string[];
        sessionDuration: number;
        pageViews: number;
        lastVisit: Date;
    };
    preferences?: {
        categories: string[];
        priceRange: { min: number; max: number };
        brandPreferences: string[];
        seasonalInterests: string[];
    };
}

export interface LocationInsights {
    marketTrends: {
        popularCategories: Array<{ category: string; demand: number; trend: 'rising' | 'stable' | 'declining' }>;
        seasonalProducts: Array<{ category: string; season: string; demand: number }>;
        localPreferences: Array<{ preference: string; strength: number }>;
    };
    competitiveAnalysis: {
        localCompetitors: Array<{ name: string; strength: number; focus: string }>;
        marketGaps: Array<{ category: string; opportunity: number; description: string }>;
        pricingInsights: Array<{ category: string; avgPrice: number; priceRange: string }>;
    };
    demographicInsights: {
        ageGroups: Array<{ range: string; percentage: number; preferences: string[] }>;
        incomeLevels: Array<{ level: string; percentage: number; spendingPatterns: string[] }>;
        culturalFactors: Array<{ factor: string; influence: number; impact: string[] }>;
    };
}

export interface ProductRecommendation {
    productId: string;
    title: string;
    category: string | null;
    price: number;
    rating: number | null;
    relevanceScore: number;
    reasoning: {
        locationFactor: number;
        behaviorFactor: number;
        trendFactor: number;
        seasonalFactor: number;
        personalizationFactor: number;
    };
    matchFactors: string[];
    estimatedDemand: number;
    competitiveAdvantage: string;
}

export class AILocationRecommendationService {
    private prisma: PrismaClient;
    private ipApiKey: string;
    private weatherApiKey: string;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.ipApiKey = process.env.IP_API_KEY || '';
        this.weatherApiKey = process.env.WEATHER_API_KEY || '';
    }

    // Main recommendation method
    async getPersonalizedRecommendations(
        userContext: UserContext,
        limit: number = 20
    ): Promise<ProductRecommendation[]> {
        try {
            // Enrich user context with location data
            const enrichedContext = await this.enrichUserContext(userContext);

            // Analyze location-based market trends
            const locationInsights = await this.analyzeLocationMarketTrends(enrichedContext.location!);

            // Analyze user behavior patterns
            const behaviorInsights = await this.analyzeUserBehavior(enrichedContext.behavior!);

            // Get seasonal and cultural factors
            const seasonalFactors = await this.analyzeSeasonalTrends(enrichedContext.location!);

            // Generate product recommendations
            const recommendations = await this.generateRecommendations(
                enrichedContext,
                locationInsights,
                behaviorInsights,
                seasonalFactors,
                limit
            );

            return recommendations;
        } catch (error) {
            console.error('Error generating recommendations:', error);
            return [];
        }
    }

    // Enrich user context with additional data
    private async enrichUserContext(userContext: UserContext): Promise<UserContext> {
        const enriched = { ...userContext };

        // Get location from IP if not provided
        if (!enriched.location && enriched.ipAddress) {
            enriched.location = await this.getLocationFromIP(enriched.ipAddress);
        }

        // Get weather data for seasonal analysis
        if (enriched.location) {
            const weather = await this.getWeatherData(enriched.location.latitude, enriched.location.longitude);
            enriched.location = {
                country: enriched.location.country,
                region: enriched.location.region,
                city: enriched.location.city,
                latitude: enriched.location.latitude,
                longitude: enriched.location.longitude,
                timezone: enriched.location.timezone
            };
        }

        // Analyze device patterns
        if (enriched.device) {
            enriched.device = await this.analyzeDevicePatterns(enriched.device);
        }

        return enriched;
    }

    // Get location data from IP address
    private async getLocationFromIP(ipAddress: string): Promise<any> {
        try {
            if (!this.ipApiKey) {
                // Fallback to free IP API
                const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
                const data = response.data;

                return {
                    country: data.country,
                    region: data.regionName,
                    city: data.city,
                    latitude: data.lat,
                    longitude: data.lon,
                    timezone: data.timezone,
                    isp: data.isp,
                    org: data.org
                };
            } else {
                // Use premium IP API service
                const response = await axios.get(`https://api.ipapi.com/${ipAddress}?access_key=${this.ipApiKey}`);
                const data = response.data;

                return {
                    country: data.country_name,
                    region: data.region,
                    city: data.city,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    timezone: data.time_zone?.id,
                    isp: data.connection?.isp,
                    org: data.connection?.organization
                };
            }
        } catch (error) {
            console.error('Error getting location from IP:', error);
            return null;
        }
    }

    // Get weather data for seasonal analysis
    private async getWeatherData(lat: number, lon: number): Promise<any> {
        try {
            if (!this.weatherApiKey) {
                // Fallback to free weather API
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.weatherApiKey || 'demo'}`);
                const data = response.data;

                return {
                    temperature: data.main?.temp,
                    weather: data.weather?.[0]?.main,
                    description: data.weather?.[0]?.description,
                    humidity: data.main?.humidity,
                    windSpeed: data.wind?.speed
                };
            }
        } catch (error) {
            console.error('Error getting weather data:', error);
            return null;
        }
    }

    // Analyze device patterns and preferences
    private async analyzeDevicePatterns(device: any): Promise<any> {
        const patterns = {
            ...device,
            preferences: []
        };

        // Analyze OS preferences
        if (device.os.toLowerCase().includes('ios') || device.os.toLowerCase().includes('mac')) {
            patterns.preferences.push('premium_products', 'design_focused', 'tech_savvy');
        } else if (device.os.toLowerCase().includes('android')) {
            patterns.preferences.push('value_products', 'feature_rich', 'customizable');
        } else if (device.os.toLowerCase().includes('windows')) {
            patterns.preferences.push('business_products', 'gaming', 'productivity');
        }

        // Analyze device type preferences
        if (device.deviceType === 'mobile') {
            patterns.preferences.push('mobile_optimized', 'on_the_go', 'quick_purchase');
        } else if (device.deviceType === 'desktop') {
            patterns.preferences.push('detailed_research', 'comparison_shopping', 'bulk_purchases');
        }

        return patterns;
    }

    // Analyze location-based market trends
    private async analyzeLocationMarketTrends(location: any): Promise<LocationInsights> {
        const insights: LocationInsights = {
            marketTrends: {
                popularCategories: [],
                seasonalProducts: [],
                localPreferences: []
            },
            competitiveAnalysis: {
                localCompetitors: [],
                marketGaps: [],
                pricingInsights: []
            },
            demographicInsights: {
                ageGroups: [],
                incomeLevels: [],
                culturalFactors: []
            }
        };

        try {
            // Analyze local market data based on location
            const localMarketData = await this.getLocalMarketData(location);

            // Analyze seasonal trends based on location
            const seasonalData = await this.analyzeSeasonalTrends(location);

            // Analyze cultural and demographic factors
            const demographicData = await this.analyzeDemographicFactors(location);

            // Combine insights
            insights.marketTrends = {
                popularCategories: localMarketData.categories,
                seasonalProducts: seasonalData.products,
                localPreferences: localMarketData.preferences
            };

            insights.competitiveAnalysis = localMarketData.competition;
            insights.demographicInsights = demographicData;

        } catch (error) {
            console.error('Error analyzing location market trends:', error);
        }

        return insights;
    }

    // Get local market data based on location
    private async getLocalMarketData(location: any): Promise<any> {
        // This would integrate with external market data APIs
        // For now, using intelligent mock data based on location

        const mockData = {
            categories: [] as Array<{ category: string; demand: number; trend: 'rising' | 'stable' | 'declining' }>,
            preferences: [] as Array<{ preference: string; strength: number }>,
            competition: {
                localCompetitors: [] as Array<{ name: string; strength: number; focus: string }>,
                marketGaps: [] as Array<{ category: string; opportunity: number; description: string }>,
                pricingInsights: [] as Array<{ category: string; avgPrice: number; priceRange: string }>
            }
        };

        // Analyze based on country/region
        if (location.country === 'United States') {
            mockData.categories = [
                { category: 'Electronics', demand: 0.9, trend: 'rising' as const },
                { category: 'Fashion', demand: 0.8, trend: 'stable' as const },
                { category: 'Home & Garden', demand: 0.7, trend: 'rising' as const }
            ];

            mockData.preferences = [
                { preference: 'Fast Shipping', strength: 0.9 },
                { preference: 'Quality Products', strength: 0.8 },
                { preference: 'Competitive Pricing', strength: 0.7 }
            ];
        } else if (location.country === 'United Kingdom') {
            mockData.categories = [
                { category: 'Fashion', demand: 0.9, trend: 'rising' as const },
                { category: 'Home & Garden', demand: 0.8, trend: 'stable' as const },
                { category: 'Beauty', demand: 0.7, trend: 'rising' as const }
            ];

            mockData.preferences = [
                { preference: 'Sustainable Products', strength: 0.8 },
                { preference: 'Premium Quality', strength: 0.7 },
                { preference: 'Fast Delivery', strength: 0.6 }
            ];
        }

        return mockData;
    }

    // Analyze seasonal trends based on location
    private async analyzeSeasonalTrends(location: any): Promise<any> {
        const currentMonth = new Date().getMonth();
        const season = this.getSeason(currentMonth, location.latitude);

        const seasonalProducts = [];

        if (season === 'Summer') {
            seasonalProducts.push(
                { category: 'Outdoor & Garden', season: 'Summer', demand: 0.9 },
                { category: 'Beach & Vacation', season: 'Summer', demand: 0.8 },
                { category: 'Summer Fashion', season: 'Summer', demand: 0.9 }
            );
        } else if (season === 'Winter') {
            seasonalProducts.push(
                { category: 'Winter Clothing', season: 'Winter', demand: 0.9 },
                { category: 'Home Heating', season: 'Winter', demand: 0.8 },
                { category: 'Holiday Gifts', season: 'Winter', demand: 0.9 }
            );
        }

        return { products: seasonalProducts };
    }

    // Get season based on month and latitude
    private getSeason(month: number, latitude: number): string {
        // Northern hemisphere
        if (latitude > 0) {
            if (month >= 2 && month <= 4) return 'Spring';
            if (month >= 5 && month <= 7) return 'Summer';
            if (month >= 8 && month <= 10) return 'Fall';
            return 'Winter';
        } else {
            // Southern hemisphere (opposite seasons)
            if (month >= 2 && month <= 4) return 'Fall';
            if (month >= 5 && month <= 7) return 'Winter';
            if (month >= 8 && month <= 10) return 'Spring';
            return 'Summer';
        }
    }

    // Analyze demographic factors based on location
    private async analyzeDemographicFactors(location: any): Promise<any> {
        // This would integrate with demographic data APIs
        // For now, using intelligent mock data

        return {
            ageGroups: [
                { range: '18-25', percentage: 0.25, preferences: ['Tech', 'Fashion', 'Gaming'] },
                { range: '26-35', percentage: 0.30, preferences: ['Home', 'Fitness', 'Electronics'] },
                { range: '36-50', percentage: 0.25, preferences: ['Family', 'Home Improvement', 'Health'] },
                { range: '50+', percentage: 0.20, preferences: ['Health', 'Travel', 'Hobbies'] }
            ],
            incomeLevels: [
                { level: 'Low', percentage: 0.30, spendingPatterns: ['Value', 'Essential', 'Budget'] },
                { level: 'Medium', percentage: 0.45, spendingPatterns: ['Quality', 'Balanced', 'Moderate'] },
                { level: 'High', percentage: 0.25, spendingPatterns: ['Premium', 'Luxury', 'Exclusive'] }
            ],
            culturalFactors: [
                { factor: 'Local Traditions', influence: 0.7, impact: ['Seasonal', 'Cultural', 'Local'] },
                { factor: 'Modern Trends', influence: 0.8, impact: ['Technology', 'Innovation', 'Global'] },
                { factor: 'Sustainability', influence: 0.6, impact: ['Eco-friendly', 'Ethical', 'Green'] }
            ]
        };
    }

    // Analyze user behavior patterns
    private async analyzeUserBehavior(behavior: any): Promise<any> {
        const insights = {
            searchPatterns: [] as Array<{ category: string; frequency: number; recentSearches: string[]; trend: 'increasing' | 'stable' }>,
            productPreferences: [] as Array<{ category: string; interest: number; pricePreference: number; qualityPreference: number }>,
            purchaseBehavior: [] as Array<{ pattern: string; confidence: number }>,
            engagementLevel: 'medium'
        };

        // Analyze search patterns
        if (behavior.previousSearches.length > 0) {
            const searchAnalysis = await this.analyzeSearchPatterns(behavior.previousSearches);
            insights.searchPatterns = searchAnalysis;
        }

        // Analyze product preferences
        if (behavior.viewedProducts.length > 0) {
            const productAnalysis = await this.analyzeProductPreferences(behavior.viewedProducts);
            insights.productPreferences = productAnalysis;
        }

        // Analyze purchase behavior
        if (behavior.purchaseHistory.length > 0) {
            const purchaseAnalysis = await this.analyzePurchaseBehavior(behavior.purchaseHistory);
            insights.purchaseBehavior = purchaseAnalysis;
        }

        // Determine engagement level
        insights.engagementLevel = this.calculateEngagementLevel(behavior);

        return insights;
    }

    // Analyze search patterns
    private async analyzeSearchPatterns(searches: string[]): Promise<any[]> {
        const patterns = [] as Array<{ category: string; frequency: number; recentSearches: string[]; trend: 'increasing' | 'stable' }>;

        // Group searches by category
        const categorySearches = searches.reduce((acc, search) => {
            const category = this.categorizeSearch(search);
            if (!acc[category]) acc[category] = [];
            acc[category].push(search);
            return acc;
        }, {} as Record<string, string[]>);

        // Analyze each category
        for (const [category, searchList] of Object.entries(categorySearches)) {
            patterns.push({
                category,
                frequency: searchList.length,
                recentSearches: searchList.slice(-3),
                trend: searchList.length > 2 ? 'increasing' : 'stable'
            });
        }

        return patterns;
    }

    // Categorize search terms
    private categorizeSearch(search: string): string {
        const searchLower = search.toLowerCase();

        if (searchLower.includes('phone') || searchLower.includes('laptop') || searchLower.includes('tech')) {
            return 'Electronics';
        } else if (searchLower.includes('shirt') || searchLower.includes('dress') || searchLower.includes('shoes')) {
            return 'Fashion';
        } else if (searchLower.includes('home') || searchLower.includes('kitchen') || searchLower.includes('garden')) {
            return 'Home & Garden';
        } else if (searchLower.includes('beauty') || searchLower.includes('makeup') || searchLower.includes('skincare')) {
            return 'Beauty';
        } else {
            return 'General';
        }
    }

    // Analyze product preferences
    private async analyzeProductPreferences(productIds: string[]): Promise<any[]> {
        const preferences = [] as Array<{ category: string; interest: number; pricePreference: number; qualityPreference: number }>;

        // Get product details from database
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { category: true, price: true, rating: true, tags: true }
        });

        // Analyze preferences
        const categoryPreferences = products.reduce((acc: Record<string, any>, product: { category: string | null; price: any; rating: number | null; tags: string[] }) => {
            if (!product.category) return acc;
            if (!acc[product.category]) acc[product.category] = { count: 0, totalPrice: 0, avgRating: 0 };
            acc[product.category].count++;
            acc[product.category].totalPrice += Number(product.price);
            acc[product.category].avgRating += product.rating || 0;
            return acc;
        }, {} as Record<string, any>);

        for (const [category, data] of Object.entries(categoryPreferences)) {
            preferences.push({
                category,
                interest: (data as { count: number; totalPrice: number; avgRating: number; }).count as number,
                pricePreference: ((data as { totalPrice: number; count: number; }).totalPrice as number) / ((data as { count: number; }).count as number),
                qualityPreference: ((data as { avgRating: number; count: number; }).avgRating as number) / ((data as { count: number; }).count as number)
            });
        }

        return preferences;
    }

    // Analyze purchase behavior
    private async analyzePurchaseBehavior(purchaseIds: string[]): Promise<any[]> {
        // This would analyze actual purchase data
        // For now, returning mock analysis
        return [
            { pattern: 'Impulse Buyer', confidence: 0.7 },
            { pattern: 'Research Heavy', confidence: 0.6 },
            { pattern: 'Price Sensitive', confidence: 0.8 }
        ];
    }

    // Calculate engagement level
    private calculateEngagementLevel(behavior: any): string {
        const score = (behavior.pageViews * 0.3) +
            (behavior.sessionDuration * 0.2) +
            (behavior.viewedProducts.length * 0.3) +
            (behavior.purchaseHistory.length * 0.2);

        if (score > 8) return 'high';
        if (score > 4) return 'medium';
        return 'low';
    }

    // Generate final product recommendations
    private async generateRecommendations(
        userContext: UserContext,
        locationInsights: LocationInsights,
        behaviorInsights: any,
        seasonalFactors: any,
        limit: number
    ): Promise<ProductRecommendation[]> {
        try {
            // Get all available products
            const products = await this.prisma.product.findMany({
                where: { isActive: true },
                select: {
                    id: true,
                    title: true,
                    category: true,
                    price: true,
                    rating: true,
                    tags: true,
                    soldCount: true,
                    reviewCount: true,
                    profitMargin: true
                }
            });

            // Score each product based on multiple factors
            const scoredProducts = products.map((product: { id: string; title: string; category: string | null; price: any; rating: number | null; tags: string[]; soldCount: number; reviewCount: number; profitMargin: any }) => {
                const score: { total: number; reasoning: any; factors: string[]; demand: number; advantage: string; } = this.calculateProductScore(
                    product,
                    userContext,
                    locationInsights,
                    behaviorInsights,
                    seasonalFactors
                );

                return {
                    ...product,
                    relevanceScore: score.total,
                    reasoning: score.reasoning,
                    matchFactors: score.factors,
                    estimatedDemand: score.demand,
                    competitiveAdvantage: score.advantage
                };
            });

            // Sort by relevance score and return top results
            return scoredProducts
                .sort((a: { relevanceScore: number; }, b: { relevanceScore: number; }) => b.relevanceScore - a.relevanceScore)
                .slice(0, limit)
                .map((product: { id: string; title: string; category: string | null; price: any; rating: number | null; relevanceScore: number; reasoning: any; matchFactors: string[]; estimatedDemand: number; competitiveAdvantage: string; }) => ({
                    productId: product.id,
                    title: product.title,
                    category: product.category || 'General',
                    price: Number(product.price),
                    rating: product.rating || 0,
                    relevanceScore: product.relevanceScore,
                    reasoning: product.reasoning,
                    matchFactors: product.matchFactors,
                    estimatedDemand: product.estimatedDemand,
                    competitiveAdvantage: product.competitiveAdvantage
                }));

        } catch (error) {
            console.error('Error generating recommendations:', error);
            return [];
        }
    }

    // Calculate product relevance score
    private calculateProductScore(
        product: any,
        userContext: UserContext,
        locationInsights: LocationInsights,
        behaviorInsights: any,
        seasonalFactors: any
    ): any {
        let locationFactor = 0;
        let behaviorFactor = 0;
        let trendFactor = 0;
        let seasonalFactor = 0;
        let personalizationFactor = 0;

        const factors: string[] = [];
        let totalScore = 0;

        // Location factor (0-1)
        if (locationInsights.marketTrends.popularCategories.some(cat => cat.category === product.category)) {
            locationFactor = 0.9;
            factors.push('Popular in your area');
        } else {
            locationFactor = 0.3;
        }

        // Behavior factor (0-1)
        if (behaviorInsights.productPreferences.some((pref: any) => pref.category === product.category)) {
            behaviorFactor = 0.9;
            factors.push('Matches your interests');
        } else {
            behaviorFactor = 0.4;
        }

        // Trend factor (0-1)
        const trend = locationInsights.marketTrends.popularCategories.find(cat => cat.category === product.category);
        if (trend) {
            if (trend.trend === 'rising') {
                trendFactor = 0.9;
                factors.push('Trending upward');
            } else if (trend.trend === 'stable') {
                trendFactor = 0.7;
                factors.push('Stable demand');
            } else {
                trendFactor = 0.4;
                factors.push('Declining trend');
            }
        }

        // Seasonal factor (0-1)
        if (seasonalFactors.products.some((s: any) => s.category === product.category)) {
            seasonalFactor = 0.9;
            factors.push('Seasonally relevant');
        } else {
            seasonalFactor = 0.5;
        }

        // Personalization factor (0-1)
        if (userContext.preferences?.categories.includes(product.category)) {
            personalizationFactor = 0.9;
            factors.push('Matches your preferences');
        } else {
            personalizationFactor = 0.5;
        }

        // Calculate total score
        totalScore = (locationFactor * 0.25) +
            (behaviorFactor * 0.25) +
            (trendFactor * 0.20) +
            (seasonalFactor * 0.15) +
            (personalizationFactor * 0.15);

        // Estimate demand
        const demand = Math.min(totalScore * 100, 95);

        // Determine competitive advantage
        let advantage = 'Standard';
        if (totalScore > 0.8) advantage = 'High demand, low competition';
        else if (totalScore > 0.6) advantage = 'Good opportunity';
        else if (totalScore > 0.4) advantage = 'Moderate potential';

        return {
            total: totalScore,
            reasoning: {
                locationFactor,
                behaviorFactor,
                trendFactor,
                seasonalFactor,
                personalizationFactor
            },
            factors,
            demand,
            advantage
        };
    }

    // Get trending products by location
    async getTrendingProductsByLocation(location: any, limit: number = 10): Promise<any[]> {
        try {
            const locationInsights = await this.analyzeLocationMarketTrends(location);

            // Get products from trending categories
            const trendingCategories = locationInsights.marketTrends.popularCategories
                .filter(cat => cat.trend === 'rising')
                .map(cat => cat.category);

            const trendingProducts = await this.prisma.product.findMany({
                where: {
                    isActive: true,
                    category: { in: trendingCategories }
                },
                select: {
                    id: true,
                    title: true,
                    category: true,
                    price: true,
                    rating: true,
                    soldCount: true,
                    images: true
                },
                orderBy: { soldCount: 'desc' },
                take: limit
            });

            return trendingProducts.map((product: { id: string; title: string; category: string | null; price: any; rating: number | null; soldCount: number; images: string[] }) => ({
                ...product,
                price: Number(product.price),
                trendReason: `Trending in ${location.city}, ${location.country}`
            }));

        } catch (error) {
            console.error('Error getting trending products:', error);
            return [];
        }
    }

    // Get seasonal recommendations
    async getSeasonalRecommendations(location: any, limit: number = 10): Promise<any[]> {
        try {
            const seasonalFactors = await this.analyzeSeasonalTrends(location);
            const seasonalCategories = seasonalFactors.products.map((p: any) => p.category);

            const seasonalProducts = await this.prisma.product.findMany({
                where: {
                    isActive: true,
                    category: { in: seasonalCategories }
                },
                select: {
                    id: true,
                    title: true,
                    category: true,
                    price: true,
                    rating: true,
                    soldCount: true,
                    images: true
                },
                orderBy: { rating: 'desc' },
                take: limit
            });

            return seasonalProducts.map((product: { id: string; title: string; category: string | null; price: any; rating: number | null; soldCount: number; images: string[] }) => ({
                ...product,
                price: Number(product.price),
                seasonalReason: `Perfect for ${this.getSeason(new Date().getMonth(), location.latitude)} in ${location.city}`
            }));

        } catch (error) {
            console.error('Error getting seasonal recommendations:', error);
            return [];
        }
    }
}