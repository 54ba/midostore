import { NextRequest, NextResponse } from 'next/server';
import BuyerService from '@/lib/buyer-service';

const buyerService = new BuyerService();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');
        const category = searchParams.get('category');
        const query = searchParams.get('query');
        const sellerId = searchParams.get('sellerId');
        const baseProductId = searchParams.get('baseProductId');
        const userId = searchParams.get('userId');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');
        const sortBy = searchParams.get('sortBy') || 'popularity';

        switch (action) {
            case 'category':
                if (category) {
                    const products = await buyerService.getProductsByCategory(category, limit, offset, sortBy);
                    return NextResponse.json({ products });
                }
                break;

            case 'search':
                if (query) {
                    const products = await buyerService.searchProducts(query, limit, offset);
                    return NextResponse.json({ products });
                }
                break;

            case 'seller':
                if (sellerId) {
                    const products = await buyerService.getProductsBySeller(sellerId, limit, offset);
                    return NextResponse.json({ products });
                }
                break;

            case 'comparison':
                if (baseProductId) {
                    const comparison = await buyerService.getProductComparison(baseProductId);
                    if (!comparison) {
                        return NextResponse.json({ error: 'Product comparison not found' }, { status: 404 });
                    }
                    return NextResponse.json({ comparison });
                }
                break;

            case 'featured':
                const featuredProducts = await buyerService.getFeaturedProducts(limit);
                return NextResponse.json({ products: featuredProducts });

            case 'recommended':
                if (userId) {
                    const recommendedProducts = await buyerService.getRecommendedProducts(userId, limit);
                    return NextResponse.json({ products: recommendedProducts });
                }
                break;

            case 'categories':
                const categories = await buyerService.getCategories();
                return NextResponse.json({ categories });

            case 'topSellers':
                const topSellers = await buyerService.getTopSellers(limit);
                return NextResponse.json({ sellers: topSellers });

            case 'preferences':
                if (userId) {
                    const preferences = await buyerService.getUserPreferences(userId);
                    return NextResponse.json({ preferences });
                }
                break;

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    } catch (error) {
        console.error('Buyer API error:', error);
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
        const userId = searchParams.get('userId');
        const baseProductId = searchParams.get('baseProductId');
        const type = searchParams.get('type');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        switch (action) {
            case 'interaction':
                if (baseProductId && type) {
                    if (!['VIEW', 'LIKE', 'CART', 'PURCHASE'].includes(type)) {
                        return NextResponse.json({ error: 'Invalid interaction type' }, { status: 400 });
                    }
                    await buyerService.recordInteraction(userId, baseProductId, type as any);
                    return NextResponse.json({ message: 'Interaction recorded successfully' });
                }
                break;

            case 'preferences':
                const preferences = await request.json();
                const updated = await buyerService.updateUserPreferences(userId, preferences);
                if (updated) {
                    return NextResponse.json({ message: 'Preferences updated successfully' });
                }
                return NextResponse.json({ error: 'Failed to update preferences' }, { status: 400 });

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('Buyer API error:', error);
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
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        switch (action) {
            case 'preferences':
                const preferences = await request.json();
                const updated = await buyerService.updateUserPreferences(userId, preferences);
                if (updated) {
                    return NextResponse.json({ message: 'Preferences updated successfully' });
                }
                return NextResponse.json({ error: 'Failed to update preferences' }, { status: 400 });

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('Buyer API error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}