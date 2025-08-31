import { NextRequest, NextResponse } from 'next/server';
import MongoDBService from '@/lib/mongodb-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const includeStats = searchParams.get('includeStats') === 'true';

        if (includeStats) {
            // Get store statistics from MongoDB
            const dbService = MongoDBService.getInstance();
            const products = await dbService.getProducts(1000);
            const categories = await dbService.getAllCategories();

            const totalProducts = products.length;
            const activeProducts = products.filter(p => p.isActive).length;
            const totalCategories = categories.length;

            const totalValue = products.reduce((sum, product) => {
                return sum + ((product.salePrice || product.basePrice) * (product.stockQuantity || 0));
            }, 0);

            const topCategories = categories.map(category => {
                const categoryProducts = products.filter(p => p.categoryId === category._id?.toString());
                const categoryRevenue = categoryProducts.reduce((sum, product) => {
                    return sum + ((product.salePrice || product.basePrice) * (product.soldCount || 0));
                }, 0);

                return {
                    ...category,
                    productCount: categoryProducts.length,
                    revenue: Math.round(categoryRevenue * 100) / 100
                };
            }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

            const stats = {
                totalProducts,
                activeProducts,
                totalCategories,
                totalValue: Math.round(totalValue * 100) / 100,
                topCategories
            };

            return NextResponse.json({
                success: true,
                data: stats
            });
        } else {
            // Get basic store information
            const storeInfo = {
                name: 'MidoStore',
                description: 'Your premier destination for quality products and exceptional service',
                founded: '2024',
                headquarters: 'Dubai, UAE',
                website: 'https://midostore.com',
                contact: {
                    email: 'info@midostore.com',
                    phone: '+971-4-123-4567',
                    address: 'Sheikh Zayed Road, Dubai, UAE'
                },
                socialMedia: {
                    instagram: '@midostore',
                    twitter: '@midostore',
                    facebook: 'midostore',
                    linkedin: 'midostore'
                }
            };

            return NextResponse.json({
                success: true,
                data: storeInfo
            });
        }

    } catch (error) {
        console.error('Error fetching store data:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch store data' },
            { status: 500 }
        );
    }
}