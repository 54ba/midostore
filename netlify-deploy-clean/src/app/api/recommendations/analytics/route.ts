import { NextRequest, NextResponse } from 'next/server';
import { RecommendationService } from '../../../../../lib/recommendation-service';

const recommendationService = new RecommendationService();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');

        switch (action) {
            case 'status':
                const stats = await recommendationService.getRecommendationStats();
                return NextResponse.json({
                    success: true,
                    data: {
                        isReady: stats.modelStatus === 'ready',
                        modelStatus: stats.modelStatus,
                        totalInteractions: stats.totalInteractions,
                        totalProducts: stats.totalProducts
                    },
                    timestamp: new Date().toISOString()
                });

            case 'analytics':
                const analytics = await recommendationService.getRecommendationStats();
                return NextResponse.json({
                    success: true,
                    data: analytics,
                    timestamp: new Date().toISOString()
                });

            default:
                // Return both status and analytics by default
                const defaultStats = await recommendationService.getRecommendationStats();

                return NextResponse.json({
                    success: true,
                    data: {
                        model: {
                            isReady: defaultStats.modelStatus === 'ready',
                            modelStatus: defaultStats.modelStatus
                        },
                        analytics: defaultStats
                    },
                    timestamp: new Date().toISOString()
                });
        }

    } catch (error) {
        console.error('Error getting recommendation analytics:', error);
        return NextResponse.json(
            {
                error: 'Failed to get recommendation analytics',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action } = body;

        switch (action) {
            case 'export-data':
                console.log('📊 Exporting training data...');
                await recommendationService.exportTrainingData();
                return NextResponse.json({
                    success: true,
                    message: 'Training data exported successfully',
                    timestamp: new Date().toISOString()
                });

            case 'retrain':
                console.log('🔄 Retraining recommendation model...');
                const trainingResult = await recommendationService.trainModel();
                return NextResponse.json({
                    success: trainingResult,
                    message: trainingResult ? 'Model retraining started successfully' : 'Model retraining failed',
                    timestamp: new Date().toISOString()
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action. Valid actions: export-data, retrain' },
                    { status: 400 }
                );
        }

    } catch (error) {
        console.error('Error in recommendation analytics API:', error);
        return NextResponse.json(
            {
                error: 'Failed to process request',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}