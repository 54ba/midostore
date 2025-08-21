import { NextRequest, NextResponse } from 'next/server';
import { RecommendationService } from '../../../../lib/recommendation-service';

const recommendationService = new RecommendationService();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const type = searchParams.get('type') || 'personalized';
        const nItems = parseInt(searchParams.get('nItems') || '10');
        const category = searchParams.get('category') || 'all';

        let recommendations;
        switch (type) {
            case 'personalized':
                if (!userId) {
                    // For guest users, fall back to popular recommendations
                    console.log('👤 Guest user requesting personalized recommendations, falling back to popular');
                    recommendations = await recommendationService.getPopularItems(nItems, category);
                } else {
                    recommendations = await recommendationService.getPersonalizedRecommendations(
                        userId,
                        nItems,
                        category
                    );
                }
                break;

            case 'popular':
                recommendations = await recommendationService.getPopularItems(nItems, category);
                break;

            default:
                return NextResponse.json(
                    { error: 'Invalid type. Valid types: personalized, popular' },
                    { status: 400 }
                );
        }

        return NextResponse.json({
            success: true,
            data: {
                recommendations,
                type: userId ? type : 'popular', // Indicate fallback for guests
                category,
                nItems,
                userId: userId || null,
                isGuest: !userId
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error getting recommendations:', error);
        return NextResponse.json(
            {
                error: 'Failed to get recommendations',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, ...params } = body;

        switch (action) {
            case 'train':
                console.log('🚀 Training recommendation model...');
                const trainingResult = await recommendationService.trainModel();
                return NextResponse.json({
                    success: trainingResult,
                    message: trainingResult ? 'Model training started successfully' : 'Model training failed',
                    timestamp: new Date().toISOString()
                });

            case 'interaction':
                const { user_id, product_id, type, metadata } = params;
                if (!user_id || !product_id || !type) {
                    return NextResponse.json(
                        { error: 'Missing required fields: user_id, product_id, type' },
                        { status: 400 }
                    );
                }

                await recommendationService.addInteraction({
                    user_id,
                    product_id,
                    type,
                    metadata
                });

                return NextResponse.json({
                    success: true,
                    message: 'User interaction recorded successfully',
                    timestamp: new Date().toISOString()
                });

            case 'similar':
                const { productId, nItems = 10 } = params;
                if (!productId) {
                    return NextResponse.json(
                        { error: 'Missing required field: productId' },
                        { status: 400 }
                    );
                }

                const similarItems = await recommendationService.getSimilarItems(productId, nItems);
                return NextResponse.json({
                    success: true,
                    data: {
                        recommendations: similarItems,
                        sourceProduct: productId,
                        nItems
                    },
                    timestamp: new Date().toISOString()
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action. Valid actions: train, interaction, similar' },
                    { status: 400 }
                );
        }

    } catch (error) {
        console.error('Error in recommendations API:', error);
        return NextResponse.json(
            {
                error: 'Failed to process request',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}