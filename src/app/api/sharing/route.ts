import { NextRequest, NextResponse } from 'next/server';
import SharingService from '@/lib/sharing-service';
import { prisma } from '@/lib/db';

const sharingService = new SharingService();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action') || 'insights';
        const productId = searchParams.get('productId');
        const platform = searchParams.get('platform');
        const userId = searchParams.get('userId') || 'anonymous';

        switch (action) {
            case 'analytics':
                const analytics = await sharingService.getShareAnalytics(
                    productId || undefined,
                    platform || undefined
                );
                return NextResponse.json({
                    success: true,
                    data: analytics,
                });

            case 'insights':
                const insights = await sharingService.getTrendingInsights(userId);
                return NextResponse.json({
                    success: true,
                    data: insights,
                });

            case 'product-shares':
                if (!productId) {
                    return NextResponse.json(
                        { error: 'Product ID is required' },
                        { status: 400 }
                    );
                }

                const shares = await prisma.productShare.findMany({
                    where: { productId },
                    include: {
                        analytics: true,
                    },
                    orderBy: { createdAt: 'desc' },
                });

                return NextResponse.json({
                    success: true,
                    data: shares,
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in sharing GET:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, productId, userId, platform, ...data } = body;

        switch (action) {
            case 'create-share-link':
                if (!productId || !userId) {
                    return NextResponse.json(
                        { error: 'Product ID and User ID are required' },
                        { status: 400 }
                    );
                }

                const shareUrl = await sharingService.createShareableLink(
                    productId,
                    userId,
                    platform,
                    data.customParams
                );

                return NextResponse.json({
                    success: true,
                    data: { shareUrl },
                });

            case 'generate-social-post':
                if (!productId) {
                    return NextResponse.json(
                        { error: 'Product ID is required' },
                        { status: 400 }
                    );
                }

                // Get product data
                const product = await prisma.product.findUnique({
                    where: { id: productId },
                });

                if (!product) {
                    return NextResponse.json(
                        { error: 'Product not found' },
                        { status: 404 }
                    );
                }

                const socialPost = await sharingService.generateSocialMediaPost(
                    {
                        product_id: product.id,
                        title: product.title,
                        description: product.description || '',
                        price: product.price,
                        currency: product.currency,
                        images: product.images || [],
                        category: product.category,
                        tags: product.tags || [],
                        rating: product.rating,
                        reviewCount: product.reviewCount,
                    },
                    platform,
                    data.tone
                );

                return NextResponse.json({
                    success: true,
                    data: socialPost,
                });

            case 'generate-embed':
                if (!productId) {
                    return NextResponse.json(
                        { error: 'Product ID is required' },
                        { status: 400 }
                    );
                }

                const embedCode = sharingService.generateEmbedCode(
                    productId,
                    data.options
                );

                return NextResponse.json({
                    success: true,
                    data: { embedCode },
                });

            case 'track-click':
                if (!data.shareId) {
                    return NextResponse.json(
                        { error: 'Share ID is required' },
                        { status: 400 }
                    );
                }

                await sharingService.trackShareClick(data.shareId, data.metadata);

                return NextResponse.json({
                    success: true,
                    message: 'Click tracked successfully',
                });

            case 'track-conversion':
                if (!data.shareId) {
                    return NextResponse.json(
                        { error: 'Share ID is required' },
                        { status: 400 }
                    );
                }

                await sharingService.trackShareConversion(
                    data.shareId,
                    data.revenue,
                    data.metadata
                );

                return NextResponse.json({
                    success: true,
                    message: 'Conversion tracked successfully',
                });

            case 'generate-ai-content':
                if (!productId) {
                    return NextResponse.json(
                        { error: 'Product ID is required' },
                        { status: 400 }
                    );
                }

                // Get product data
                const aiProduct = await prisma.product.findUnique({
                    where: { id: productId },
                });

                if (!aiProduct) {
                    return NextResponse.json(
                        { error: 'Product not found' },
                        { status: 404 }
                    );
                }

                const aiContent = await sharingService.generateAIContent(
                    {
                        product_id: aiProduct.id,
                        title: aiProduct.title,
                        description: aiProduct.description || '',
                        price: aiProduct.price,
                        currency: aiProduct.currency,
                        images: aiProduct.images || [],
                        category: aiProduct.category,
                        tags: aiProduct.tags || [],
                        rating: aiProduct.rating,
                        reviewCount: aiProduct.reviewCount,
                    },
                    platform,
                    data.audience
                );

                return NextResponse.json({
                    success: true,
                    data: { content: aiContent },
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in sharing POST:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}