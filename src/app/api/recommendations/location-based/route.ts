import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            location,
            userContext,
            searchQuery,
            limit = 20,
            includeTrending = true,
            includeSeasonal = true
        } = body;

        if (!location) {
            return NextResponse.json(
                { error: 'Location data is required' },
                { status: 400 }
            );
        }

        // Get user's IP address for additional context
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';

        // Enhanced user context with IP and headers
        const enhancedContext = {
            ...userContext,
            ipAddress: ip,
            device: {
                userAgent: request.headers.get('user-agent') || '',
                acceptLanguage: request.headers.get('accept-language') || '',
                referer: request.headers.get('referer') || '',
                ...userContext?.device
            }
        };

        // Get location-based recommendations
        const recommendations = await getLocationBasedRecommendations(
            location,
            enhancedContext,
            searchQuery,
            limit
        );

        // Get trending products if requested
        let trendingProducts = [];
        if (includeTrending) {
            trendingProducts = await getTrendingProductsByLocation(location, 5);
        }

        // Get seasonal recommendations if requested
        let seasonalProducts = [];
        if (includeSeasonal) {
            seasonalProducts = await getSeasonalRecommendations(location, 5);
        }

        // Get market insights
        const marketInsights = await getMarketInsights(location);

        return NextResponse.json({
            success: true,
            data: {
                recommendations,
                trendingProducts,
                seasonalProducts,
                marketInsights,
                userContext: enhancedContext
            }
        });

    } catch (error) {
        console.error('Error in location-based recommendations:', error);
        return NextResponse.json(
            { error: 'Failed to generate recommendations' },
            { status: 500 }
        );
    }
}

// Get location-based product recommendations
async function getLocationBasedRecommendations(
    location: any,
    userContext: any,
    searchQuery: string,
    limit: number
) {
    try {
        // Get all active products
        const products = await prisma.product.findMany({
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
                profitMargin: true,
                images: true,
                createdAt: true
            }
        });

        // Score products based on location and user context
        const scoredProducts = products.map(product => {
            const score = calculateLocationScore(product, location, userContext, searchQuery);
            return { ...product, relevanceScore: score.total, reasoning: score.reasoning };
        });

        // Sort by relevance and return top results
        return scoredProducts
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, limit)
            .map(product => ({
                productId: product.id,
                title: product.title,
                category: product.category || 'General',
                price: Number(product.price),
                rating: product.rating || 0,
                relevanceScore: product.relevanceScore,
                reasoning: product.reasoning,
                matchFactors: generateMatchFactors(product, location, userContext),
                estimatedDemand: Math.round(product.relevanceScore * 100),
                competitiveAdvantage: getCompetitiveAdvantage(product.relevanceScore),
                image: product.images[0] || null
            }));

    } catch (error) {
        console.error('Error getting location-based recommendations:', error);
        return [];
    }
}

// Calculate location-based score for a product
function calculateLocationScore(product: any, location: any, userContext: any, searchQuery: string) {
    let locationFactor = 0;
    let behaviorFactor = 0;
    let trendFactor = 0;
    let seasonalFactor = 0;
    let personalizationFactor = 0;

    // Location factor based on market trends
    if (location.country === 'United States') {
        if (product.category === 'Electronics') locationFactor = 0.9;
        else if (product.category === 'Fashion') locationFactor = 0.8;
        else if (product.category === 'Home & Garden') locationFactor = 0.7;
    } else if (location.country === 'United Kingdom') {
        if (product.category === 'Fashion') locationFactor = 0.9;
        else if (product.category === 'Home & Garden') locationFactor = 0.8;
        else if (product.category === 'Beauty') locationFactor = 0.7;
    } else {
        locationFactor = 0.6; // Default for other countries
    }

    // Behavior factor based on user preferences
    if (userContext?.preferences?.categories?.includes(product.category)) {
        behaviorFactor = 0.9;
    } else if (userContext?.behavior?.viewedProducts?.includes(product.id)) {
        behaviorFactor = 0.7;
    } else {
        behaviorFactor = 0.4;
    }

    // Trend factor based on sales and reviews
    if (product.soldCount > 100 && product.rating > 4.5) {
        trendFactor = 0.9;
    } else if (product.soldCount > 50 && product.rating > 4.0) {
        trendFactor = 0.7;
    } else {
        trendFactor = 0.5;
    }

    // Seasonal factor
    const currentMonth = new Date().getMonth();
    const season = getSeason(currentMonth, location.latitude);
    seasonalFactor = getSeasonalRelevance(product.category, season);

    // Personalization factor based on search query
    if (searchQuery && product.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        personalizationFactor = 0.9;
    } else if (searchQuery && product.category.toLowerCase().includes(searchQuery.toLowerCase())) {
        personalizationFactor = 0.7;
    } else {
        personalizationFactor = 0.5;
    }

    // Calculate total score
    const totalScore = (locationFactor * 0.25) +
        (behaviorFactor * 0.25) +
        (trendFactor * 0.20) +
        (seasonalFactor * 0.15) +
        (personalizationFactor * 0.15);

    return {
        total: totalScore,
        reasoning: {
            locationFactor,
            behaviorFactor,
            trendFactor,
            seasonalFactor,
            personalizationFactor
        }
    };
}

// Get trending products by location
async function getTrendingProductsByLocation(location: any, limit: number) {
    try {
        // Get products with high sales and ratings
        const trendingProducts = await prisma.product.findMany({
            where: {
                isActive: true,
                soldCount: { gt: 50 },
                rating: { gt: 4.0 }
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
            orderBy: [
                { soldCount: 'desc' },
                { rating: 'desc' }
            ],
            take: limit
        });

        return trendingProducts.map(product => ({
            ...product,
            price: Number(product.price),
            trendReason: `Trending in ${location.city}, ${location.country}`,
            image: product.images[0] || null
        }));

    } catch (error) {
        console.error('Error getting trending products:', error);
        return [];
    }
}

// Get seasonal recommendations
async function getSeasonalRecommendations(location: any, limit: number) {
    try {
        const currentMonth = new Date().getMonth();
        const season = getSeason(currentMonth, location.latitude);

        // Get products from seasonal categories
        const seasonalCategories = getSeasonalCategories(season);

        const seasonalProducts = await prisma.product.findMany({
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

        return seasonalProducts.map(product => ({
            ...product,
            price: Number(product.price),
            seasonalReason: `Perfect for ${season} in ${location.city}`,
            image: product.images[0] || null
        }));

    } catch (error) {
        console.error('Error getting seasonal recommendations:', error);
        return [];
    }
}

// Get market insights for location
async function getMarketInsights(location: any) {
    try {
        // Get category performance data
        const categoryStats = await prisma.product.groupBy({
            by: ['category'],
            where: { isActive: true },
            _count: { id: true },
            _avg: { price: true, rating: true },
            _sum: { soldCount: true }
        });

        // Get trending categories
        const trendingCategories = categoryStats
            .sort((a, b) => (b._sum.soldCount || 0) - (a._sum.soldCount || 0))
            .slice(0, 5)
            .map(cat => ({
                category: cat.category || 'General',
                productCount: cat._count.id,
                avgPrice: Number(cat._avg.price || 0),
                avgRating: Number(cat._avg.rating || 0),
                totalSales: cat._sum.soldCount || 0
            }));

        // Get market opportunities
        const marketOpportunities = categoryStats
            .filter(cat => (cat._sum.soldCount || 0) < 100 && (cat._avg.rating || 0) > 4.0)
            .map(cat => ({
                category: cat.category || 'General',
                opportunity: 'High demand, low supply',
                potential: 'High'
            }));

        return {
            trendingCategories,
            marketOpportunities,
            location: {
                city: location.city,
                country: location.country,
                marketSize: 'Medium', // This would come from external data
                competitionLevel: 'Moderate' // This would come from external data
            }
        };

    } catch (error) {
        console.error('Error getting market insights:', error);
        return {
            trendingCategories: [],
            marketOpportunities: [],
            location: location
        };
    }
}

// Helper functions
function getSeason(month: number, latitude: number): string {
    if (latitude > 0) { // Northern hemisphere
        if (month >= 2 && month <= 4) return 'Spring';
        if (month >= 5 && month <= 7) return 'Summer';
        if (month >= 8 && month <= 10) return 'Fall';
        return 'Winter';
    } else { // Southern hemisphere
        if (month >= 2 && month <= 4) return 'Fall';
        if (month >= 5 && month <= 7) return 'Winter';
        if (month >= 8 && month <= 10) return 'Spring';
        return 'Summer';
    }
}

function getSeasonalCategories(season: string): string[] {
    const seasonalMap: Record<string, string[]> = {
        'Spring': ['Home & Garden', 'Fashion', 'Outdoor'],
        'Summer': ['Outdoor & Garden', 'Beach & Vacation', 'Summer Fashion'],
        'Fall': ['Fashion', 'Home & Garden', 'Holiday'],
        'Winter': ['Winter Clothing', 'Home Heating', 'Holiday Gifts']
    };

    return seasonalMap[season] || ['General'];
}

function getSeasonalRelevance(category: string, season: string): number {
    const seasonalMap: Record<string, Record<string, number>> = {
        'Spring': { 'Home & Garden': 0.9, 'Fashion': 0.8, 'Outdoor': 0.9 },
        'Summer': { 'Outdoor & Garden': 0.9, 'Beach & Vacation': 0.9, 'Summer Fashion': 0.9 },
        'Fall': { 'Fashion': 0.8, 'Home & Garden': 0.7, 'Holiday': 0.8 },
        'Winter': { 'Winter Clothing': 0.9, 'Home Heating': 0.9, 'Holiday Gifts': 0.9 }
    };

    return seasonalMap[season]?.[category] || 0.5;
}

function generateMatchFactors(product: any, location: any, userContext: any): string[] {
    const factors = [];

    if (location.country === 'United States' && product.category === 'Electronics') {
        factors.push('Popular in your area');
    }

    if (product.rating > 4.5) {
        factors.push('Highly rated');
    }

    if (product.soldCount > 100) {
        factors.push('Best seller');
    }

    if (userContext?.preferences?.categories?.includes(product.category)) {
        factors.push('Matches your interests');
    }

    return factors.slice(0, 3);
}

function getCompetitiveAdvantage(relevanceScore: number): string {
    if (relevanceScore > 0.8) return 'High demand, low competition';
    if (relevanceScore > 0.6) return 'Good opportunity';
    return 'Standard market';
}