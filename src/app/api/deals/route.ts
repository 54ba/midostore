import { NextRequest, NextResponse } from 'next/server';
import MongoDBService from '@/lib/mongodb-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '12');
        const category = searchParams.get('category') || 'all';

        // Get real deals from MongoDB
        const dbService = MongoDBService.getInstance();
        const products = await dbService.getProducts(1000);

        // Filter products with discounts
        const deals = products
            .filter(product => product.price && product.originalPrice && product.price < product.originalPrice)
            .map(product => ({
                id: product._id?.toString() || product.id,
                title: product.title || product.name,
                description: product.description,
                originalPrice: product.originalPrice,
                discountedPrice: product.price,
                discountPercentage: Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100),
                image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
                category: product.category?.toLowerCase() || 'electronics',
                seller: product.supplierName || 'MidoStore',
                rating: product.rating || 4.5,
                reviewCount: product.reviewCount || 0,
                timeLeft: generateTimeLeft(),
                dealType: generateDealType(),
                soldCount: product.soldCount || 0,
                stockCount: product.stockQuantity || 0,
                featured: (product.soldCount || 0) > 100 || ((product.rating || 0) > 4.5)
            }))
            .sort((a, b) => b.discountPercentage - a.discountPercentage)
            .slice(0, limit);

        // Filter by category if specified
        let filteredDeals = deals;
        if (category !== 'all') {
            filteredDeals = deals.filter(deal =>
                deal.category?.toLowerCase().includes(category.toLowerCase())
            );
        }

        return NextResponse.json({
            success: true,
            deals: filteredDeals,
            total: filteredDeals.length
        });

    } catch (error) {
        console.error('Error fetching deals:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch deals' },
            { status: 500 }
        );
    }
}

function generateTimeLeft(): string {
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    if (hours === 0) {
        return `${minutes}m`;
    }
    return `${hours}h ${minutes}m`;
}

function generateDealType(): 'flash' | 'daily' | 'weekly' | 'clearance' {
    const types: ('flash' | 'daily' | 'weekly' | 'clearance')[] = ['flash', 'daily', 'weekly', 'clearance'];
    return types[Math.floor(Math.random() * types.length)];
}