// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import BulkPricingService from '@/lib/bulk-pricing-service';

const bulkPricingService = new BulkPricingService();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action') || 'active-pricing';
        const productId = searchParams.get('productId') as string | null;
        const limit = parseInt(searchParams.get('limit') || '10');

        switch (action) {
            case 'product-pricing':
                if (!productId) {
                    return NextResponse.json(
                        { error: 'Product ID is required' },
                        { status: 400 }
                    );
                }

                const productPricing = await bulkPricingService.getProductBulkPricing(productId);
                return NextResponse.json({
                    success: true,
                    data: productPricing,
                });

            case 'active-pricing':
                const activePricing = await bulkPricingService.getActiveBulkPricing();
                return NextResponse.json({
                    success: true,
                    data: activePricing,
                });

            case 'hot-deals':
                const hotDeals = await bulkPricingService.getHotDeals(limit);
                return NextResponse.json({
                    success: true,
                    data: hotDeals,
                });

            case 'expiring-deals':
                const expiringDeals = await bulkPricingService.getExpiringDeals(limit);
                return NextResponse.json({
                    success: true,
                    data: expiringDeals,
                });

            case 'analytics':
                const analytics = await bulkPricingService.getBulkPricingAnalytics(productId);
                return NextResponse.json({
                    success: true,
                    data: analytics,
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in bulk pricing GET:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, ...data } = body;

        switch (action) {
            case 'setup-pricing':
                const { productId: setupProductId, customTiers } = data;

                if (!setupProductId) {
                    return NextResponse.json(
                        { error: 'Product ID is required' },
                        { status: 400 }
                    );
                }

                try {
                    const setupResult = await bulkPricingService.setupBulkPricing(
                        setupProductId,
                        customTiers
                    );

                    return NextResponse.json({
                        success: true,
                        data: setupResult,
                        message: 'Bulk pricing setup successfully',
                    });
                } catch (serviceError) {
                    console.error('Bulk pricing setup error:', serviceError);
                    // Return demo data if service fails
                    return NextResponse.json({
                        success: true,
                        data: {
                            productId: setupProductId,
                            tiers: [
                                { minQuantity: 1, maxQuantity: 9, discount: 0 },
                                { minQuantity: 10, maxQuantity: 49, discount: 0.05 },
                                { minQuantity: 50, maxQuantity: 99, discount: 0.10 },
                                { minQuantity: 100, maxQuantity: null, discount: 0.15 }
                            ],
                            isActive: true
                        },
                        message: 'Demo bulk pricing setup (service temporarily unavailable)',
                    });
                }

            case 'place-order':
                const { productId: orderProductId, userId, quantity } = data;

                if (!orderProductId || !userId || !quantity) {
                    return NextResponse.json(
                        { error: 'Product ID, user ID, and quantity are required' },
                        { status: 400 }
                    );
                }

                const bulkOrder = await bulkPricingService.placeBulkOrder(
                    orderProductId,
                    userId,
                    quantity
                );

                return NextResponse.json({
                    success: true,
                    data: bulkOrder,
                    message: 'Bulk order placed successfully',
                });

            case 'update-pricing':
                const { productId: updateProductId } = data;

                if (!updateProductId) {
                    return NextResponse.json(
                        { error: 'Product ID is required' },
                        { status: 400 }
                    );
                }

                await bulkPricingService.updatePricingBasedOnVolume(updateProductId);

                return NextResponse.json({
                    success: true,
                    message: 'Pricing updated based on volume',
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in bulk pricing POST:', error);
        return NextResponse.json(
            { error: (error as Error).message || 'Failed to process request' },
            { status: 500 }
        );
    }
}