import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { AlibabaReviewService } from '@/lib/alibaba-review-service';
import { ReviewSeedingService } from '@/lib/review-seeding-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');
        const source = searchParams.get('source') || 'all';
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        if (!productId) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        // Build where clause
        const where: any = { productId };
        if (source !== 'all') {
            where.source = source;
        }

        // Fetch reviews from database
        const reviews = await prisma.review.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });

        // Get total count
        const totalCount = await prisma.review.count({ where });

        return NextResponse.json({
            success: true,
            data: {
                reviews,
                pagination: {
                    total: totalCount,
                    limit,
                    offset,
                    hasMore: offset + limit < totalCount,
                },
            },
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, productId, source, reviewCount = 10 } = body;

        if (!productId) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        switch (action) {
            case 'import':
                // Import reviews from external source
                if (!source || !['alibaba', 'aliexpress'].includes(source)) {
                    return NextResponse.json(
                        { error: 'Valid source (alibaba or aliexpress) is required for import' },
                        { status: 400 }
                    );
                }

                const reviewService = new AlibabaReviewService(prisma);
                await reviewService.importReviewsToDatabase(productId, source, reviewCount);

                return NextResponse.json({
                    success: true,
                    message: `Reviews imported successfully from ${source}`,
                });

            case 'generate':
                // Generate synthetic reviews
                if (!reviewCount || reviewCount < 1 || reviewCount > 100) {
                    return NextResponse.json(
                        { error: 'Review count must be between 1 and 100' },
                        { status: 400 }
                    );
                }

                // Get product info for review generation
                const product = await prisma.product.findUnique({
                    where: { id: productId },
                    select: { title: true, category: true },
                });

                if (!product) {
                    return NextResponse.json(
                        { error: 'Product not found' },
                        { status: 404 }
                    );
                }

                const seedingService = new ReviewSeedingService(prisma);
                await seedingService.generateReviewsForProduct(
                    productId,
                    product.title,
                    product.category,
                    reviewCount,
                    'generated'
                );

                return NextResponse.json({
                    success: true,
                    message: `${reviewCount} reviews generated successfully`,
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action. Must be "import" or "generate"' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error processing review action:', error);
        return NextResponse.json(
            { error: 'Failed to process review action' },
            { status: 500 }
        );
    }
}