import { NextRequest, NextResponse } from 'next/server';
import { EnhancedAnalyticsService } from '@/lib/enhanced-analytics-service';

const enhancedAnalyticsService = new EnhancedAnalyticsService();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const timeRange = searchParams.get('timeRange') || '30d';
        const includeRealTime = searchParams.get('realTime') === 'true';
        const exportFormat = searchParams.get('export') as 'json' | 'csv' | 'excel' | null;

        // Handle export requests
        if (exportFormat) {
            const exportedData = await enhancedAnalyticsService.exportAnalyticsData(exportFormat, timeRange);

            if (exportFormat === 'csv') {
                return new NextResponse(exportedData as string, {
                    headers: {
                        'Content-Type': 'text/csv',
                        'Content-Disposition': `attachment; filename="analytics-${timeRange}.csv"`,
                    },
                });
            }

            return NextResponse.json({ data: exportedData });
        }

        // Get enhanced analytics data
        let analyticsData;
        if (includeRealTime) {
            analyticsData = await enhancedAnalyticsService.getRealTimeDashboardData();
        } else {
            analyticsData = await enhancedAnalyticsService.getEnhancedAnalyticsData(timeRange);
        }

        return NextResponse.json({
            success: true,
            data: analyticsData,
            timestamp: new Date().toISOString(),
            timeRange,
            includesRealTime: includeRealTime,
        });

    } catch (error) {
        console.error('Enhanced analytics API error:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch enhanced analytics data',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, timeRange, filters } = body;

        switch (action) {
            case 'get_cross_platform_insights':
                const enhancedData = await enhancedAnalyticsService.getEnhancedAnalyticsData(timeRange || '30d');
                return NextResponse.json({
                    success: true,
                    data: {
                        insights: enhancedData.insights,
                        webAnalytics: enhancedData.webAnalytics,
                    },
                });

            case 'get_traffic_quality_analysis':
                const trafficData = await enhancedAnalyticsService.getEnhancedAnalyticsData(timeRange || '30d');
                return NextResponse.json({
                    success: true,
                    data: {
                        trafficQuality: trafficData.webAnalytics.aiInsights.trafficQuality,
                        userBehavior: trafficData.webAnalytics.aiInsights.userBehaviorPatterns,
                    },
                });

            case 'get_conversion_optimization':
                const conversionData = await enhancedAnalyticsService.getEnhancedAnalyticsData(timeRange || '30d');
                return NextResponse.json({
                    success: true,
                    data: {
                        conversionOptimization: conversionData.webAnalytics.aiInsights.conversionOptimization,
                        seoOpportunities: conversionData.webAnalytics.aiInsights.seoOpportunities,
                    },
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action specified' },
                    { status: 400 }
                );
        }

    } catch (error) {
        console.error('Enhanced analytics POST API error:', error);
        return NextResponse.json(
            {
                error: 'Failed to process analytics request',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}