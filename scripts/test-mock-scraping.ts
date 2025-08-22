#!/usr/bin/env npx tsx

import { prisma } from '../lib/db';
import { ProductService } from '../lib/product-service';

// Mock scraped product data
const mockScrapedProducts = [
    {
        externalId: 'MOCK001',
        source: 'alibaba' as const,
        title: 'Mock Wireless Headphones',
        description: 'This is a mock product for testing purposes',
        price: 49.99,
        originalPrice: 79.99,
        currency: 'USD',
        images: ['https://via.placeholder.com/300x300?text=Mock+Product'],
        category: 'Electronics',
        subcategory: 'Audio',
        tags: ['mock', 'test', 'electronics'],
        rating: 4.5,
        reviewCount: 25,
        soldCount: 100,
        minOrderQuantity: 1,
        maxOrderQuantity: 500,
        shippingWeight: 0.3,
        shippingDimensions: '10x5x2cm',
        variants: [
            {
                name: 'Color',
                value: 'Black',
                price: 49.99,
                stock: 50,
                sku: 'MOCK001-BLK',
            },
        ],
        supplier: {
            externalId: 'mock_supplier_001',
            name: 'Mock Electronics Supplier',
            companyName: 'Mock Electronics Co., Ltd.',
            country: 'China',
            city: 'Shenzhen',
            rating: 4.8,
            responseRate: 98.5,
            responseTime: '2-4 hours',
            verified: true,
            goldMember: true,
        },
    },
    {
        externalId: 'MOCK002',
        source: 'aliexpress' as const,
        title: 'Mock Smart Watch',
        description: 'Another mock product for testing',
        price: 89.99,
        originalPrice: 129.99,
        currency: 'USD',
        images: ['https://via.placeholder.com/300x300?text=Mock+Watch'],
        category: 'Electronics',
        subcategory: 'Wearables',
        tags: ['mock', 'test', 'wearables'],
        rating: 4.3,
        reviewCount: 15,
        soldCount: 75,
        minOrderQuantity: 1,
        maxOrderQuantity: 200,
        shippingWeight: 0.2,
        shippingDimensions: '8x4x1cm',
        variants: [],
        supplier: {
            externalId: 'mock_supplier_002',
            name: 'Mock Wearables Supplier',
            companyName: 'Mock Wearables Ltd.',
            country: 'China',
            city: 'Guangzhou',
            rating: 4.6,
            responseRate: 95.2,
            responseTime: '4-6 hours',
            verified: true,
            goldMember: false,
        },
    },
];

async function main() {
    console.log('🧪 Testing mock scraping and database integration...');

    try {
        // Check database connection
        await prisma.$connect();
        console.log('✅ Database connected');

        const productService = new ProductService();

        // Process mock products
        console.log('🔄 Processing mock products...');
        let successCount = 0;
        let errorCount = 0;

        for (const product of mockScrapedProducts) {
            try {
                const productId = await productService.createProductFromScraped(product);
                successCount++;
                console.log(`✅ Created product: ${product.title} (ID: ${productId})`);
            } catch (error) {
                errorCount++;
                console.error(`❌ Failed to create product: ${product.title}`, error);
            }
        }

        console.log(`\n🎉 Mock scraping test completed!`);
        console.log(`📊 Results:`);
        console.log(`   - Successfully created: ${successCount}`);
        console.log(`   - Errors: ${errorCount}`);

        // Show created products
        if (successCount > 0) {
            console.log('\n📋 Created products:');
            const products = await prisma.product.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { supplier: true },
            });

            products.forEach((product, index) => {
                console.log(`\n${index + 1}. ${product.title}`);
                console.log(`   Price: ${product.price} ${product.currency}`);
                console.log(`   Supplier: ${product.supplier.name}`);
                console.log(`   Category: ${product.category}`);
            });
        }

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch(console.error);