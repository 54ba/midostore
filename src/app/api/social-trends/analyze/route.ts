import { NextRequest, NextResponse } from 'next/server';
import { SocialTrendAnalysisService } from '@/lib/social-trend-analysis-service';
import { prisma } from '@/lib/db';

const trendService = new SocialTrendAnalysisService(prisma);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, config, trendId } = body;

        switch (action) {
            case 'analyze':
                return await handleTrendAnalysis(config);
            case 'match_products':
                return await handleProductMatching();
            case 'get_trends':
                return await handleGetTrends();
            case 'get_trend':
                return await handleGetTrend(trendId);
            default:
                return NextResponse.json(
                    { error: 'Invalid action. Must be one of: analyze, match_products, get_trends, get_trend' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in social trend analysis API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

async function handleTrendAnalysis(config: any) {
    try {
        // Validate configuration
        if (!config.platforms || !config.categories || !config.timeRange) {
            return NextResponse.json(
                { error: 'Missing required configuration: platforms, categories, timeRange' },
                { status: 400 }
            );
        }

        // Validate platforms
        const validPlatforms = ['reddit', 'twitter', 'news'];
        for (const platform of Object.keys(config.platforms)) {
            if (!validPlatforms.includes(platform)) {
                return NextResponse.json(
                    { error: `Invalid platform: ${platform}. Must be one of: ${validPlatforms.join(', ')}` },
                    { status: 400 }
                );
            }
        }

        // Validate time range
        const validTimeRanges = ['1h', '6h', '24h', '7d', '30d'];
        if (!validTimeRanges.includes(config.timeRange)) {
            return NextResponse.json(
                { error: `Invalid time range: ${config.timeRange}. Must be one of: ${validTimeRanges.join(', ')}` },
                { status: 400 }
            );
        }

        // Start trend analysis
        const trends = await trendService.analyzeTrends(config);

        return NextResponse.json({
            success: true,
            trends,
            total: trends.length,
            message: 'Trend analysis completed successfully',
        });
    } catch (error) {
        console.error('Error analyzing trends:', error);
        return NextResponse.json(
            { error: 'Failed to analyze trends' },
            { status: 500 }
        );
    }
}

async function handleProductMatching() {
    try {
        // Get all trends from database
        const trends = await prisma.trendData.findMany({
            orderBy: { timestamp: 'desc' },
            take: 100, // Limit to recent trends
        });

        // Match products with trends
        const productMatches = await trendService.matchProductsWithTrends(trends);

        return NextResponse.json({
            success: true,
            productMatches,
            total: productMatches.length,
            message: 'Product matching completed successfully',
        });
    } catch (error) {
        console.error('Error matching products:', error);
        return NextResponse.json(
            { error: 'Failed to match products with trends' },
            { status: 500 }
        );
    }
}

async function handleGetTrends() {
    try {
        // Get all trends from database
        const trends = await prisma.trendData.findMany({
            orderBy: { timestamp: 'desc' },
            take: 100, // Limit to recent trends
        });

        return NextResponse.json({
            success: true,
            trends,
            total: trends.length,
        });
    } catch (error) {
        console.error('Error getting trends:', error);
        return NextResponse.json(
            { error: 'Failed to get trends' },
            { status: 500 }
        );
    }
}

async function handleGetTrend(trendId: string) {
    try {
        if (!trendId) {
            return NextResponse.json(
                { error: 'Trend ID is required' },
                { status: 400 }
            );
        }

        // Get specific trend from database
        const trend = await prisma.trendData.findUnique({
            where: { id: trendId },
        });

        if (!trend) {
            return NextResponse.json(
                { error: 'Trend not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            trend,
        });
    } catch (error) {
        console.error('Error getting trend:', error);
        return NextResponse.json(
            { error: 'Failed to get trend' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const trendId = searchParams.get('trendId');
        const platform = searchParams.get('platform');
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '50');

        if (trendId) {
            return await handleGetTrend(trendId);
        }

        // Build filter conditions
        const where: any = {};

        if (platform && platform !== 'all') {
            where.platform = platform;
        }

        if (category && category !== 'all') {
            where.category = category;
        }

        // Get filtered trends from database
        const trends = await prisma.trendData.findMany({
            where,
            orderBy: { timestamp: 'desc' },
            take: limit,
        });

        return NextResponse.json({
            success: true,
            trends,
            total: trends.length,
            filters: { platform, category, limit },
        });
    } catch (error) {
        console.error('Error in social trends GET API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}