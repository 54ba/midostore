import { NextRequest, NextResponse } from 'next/server';
import SellerService from '@/lib/seller-service';

const sellerService = new SellerService();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');
        const sellerId = searchParams.get('sellerId');
        const userId = searchParams.get('userId');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        switch (action) {
            case 'get':
                if (sellerId) {
                    const seller = await sellerService.getSeller(sellerId);
                    if (!seller) {
                        return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
                    }
                    return NextResponse.json({ seller });
                }
                break;

            case 'getByUserId':
                if (userId) {
                    const seller = await sellerService.getSellerByUserId(userId);
                    if (!seller) {
                        return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
                    }
                    return NextResponse.json({ seller });
                }
                break;

            case 'all':
                const sellers = await sellerService.getAllSellers(limit, offset);
                return NextResponse.json({ sellers });

            case 'verified':
                const verifiedSellers = await sellerService.getVerifiedSellers();
                return NextResponse.json({ sellers: verifiedSellers });

            case 'dashboard':
                if (sellerId) {
                    const dashboard = await sellerService.getSellerDashboard(sellerId);
                    if (!dashboard) {
                        return NextResponse.json({ error: 'Dashboard not found' }, { status: 404 });
                    }
                    return NextResponse.json({ dashboard });
                }
                break;

            case 'recommended':
                if (sellerId) {
                    const category = searchParams.get('category');
                    const recommendedProducts = await sellerService.getRecommendedProducts(sellerId, category, limit);
                    return NextResponse.json({ products: recommendedProducts });
                }
                break;

            case 'trending':
                if (sellerId) {
                    const trendingProducts = await sellerService.getTrendingProducts(sellerId, limit);
                    return NextResponse.json({ products: trendingProducts });
                }
                break;

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    } catch (error) {
        console.error('Seller API error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');

        switch (action) {
            case 'create':
                const sellerData = await request.json();
                const seller = await sellerService.createSeller(sellerData);
                return NextResponse.json({ seller }, { status: 201 });

            case 'createProduct':
                const productData = await request.json();
                const sellerProduct = await sellerService.createSellerProduct(productData);
                return NextResponse.json({ sellerProduct }, { status: 201 });

            case 'analytics':
                const analyticsData = await request.json();
                const analytics = await sellerService.createAnalytics(analyticsData);
                return NextResponse.json({ analytics }, { status: 201 });

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('Seller API error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');
        const sellerId = searchParams.get('sellerId');
        const productId = searchParams.get('productId');

        if (!sellerId) {
            return NextResponse.json({ error: 'Seller ID required' }, { status: 400 });
        }

        switch (action) {
            case 'updateSeller':
                const sellerUpdates = await request.json();
                const sellerUpdated = await sellerService.updateSeller(sellerId, sellerUpdates);
                if (sellerUpdated) {
                    return NextResponse.json({ message: 'Seller updated successfully' });
                }
                return NextResponse.json({ error: 'Failed to update seller' }, { status: 400 });

            case 'updateProduct':
                if (!productId) {
                    return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
                }
                const productUpdates = await request.json();
                const productUpdated = await sellerService.updateSellerProduct(productId, productUpdates);
                if (productUpdated) {
                    return NextResponse.json({ message: 'Product updated successfully' });
                }
                return NextResponse.json({ error: 'Failed to update product' }, { status: 400 });

            case 'updateMetrics':
                if (!productId) {
                    return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
                }
                const { metric, value } = await request.json();
                await sellerService.updateProductMetrics(productId, metric, value);
                return NextResponse.json({ message: 'Metrics updated successfully' });

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('Seller API error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');
        const sellerId = searchParams.get('sellerId');

        if (!productId || !sellerId) {
            return NextResponse.json({ error: 'Product ID and Seller ID required' }, { status: 400 });
        }

        const deleted = await sellerService.deleteSellerProduct(productId, sellerId);
        if (deleted) {
            return NextResponse.json({ message: 'Product deleted successfully' });
        }
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 400 });
    } catch (error) {
        console.error('Seller API error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}