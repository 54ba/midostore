#!/usr/bin/env npx tsx

import { prisma } from '../lib/db';
import { ScrapingService } from '../lib/scraping-service';
import { ProductService } from '../lib/product-service';

async function main() {
    console.log('🌱 Starting database seeding...');

    try {
        // Check if database is connected
        await prisma.$connect();
        console.log('✅ Database connected');

        // Check if we already have products
        const existingProducts = await prisma.product.count();
        if (existingProducts > 0) {
            console.log(`⚠️ Database already has ${existingProducts} products. Skipping seeding.`);
            return;
        }

        // Create sample suppliers first
        console.log('🏭 Creating sample suppliers...');
        const suppliers = await createSampleSuppliers();

        // Create sample products
        console.log('📦 Creating sample products...');
        await createSampleProducts(suppliers);

        // Create sample reviews
        console.log('⭐ Creating sample reviews...');
        await createSampleReviews();

        // Create sample categories
        console.log('🏷️ Creating sample categories...');
        await createSampleCategories();

        console.log('🎉 Database seeding completed successfully!');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

async function createSampleSuppliers() {
    const suppliers = [
        {
            externalId: 'supplier_001',
            source: 'alibaba',
            name: 'TechPro Electronics',
            companyName: 'TechPro Electronics Co., Ltd.',
            country: 'China',
            city: 'Shenzhen',
            rating: 4.8,
            responseRate: 98.5,
            responseTime: '2-4 hours',
            verified: true,
            goldMember: true,
        },
        {
            externalId: 'supplier_002',
            source: 'alibaba',
            name: 'Fashion Forward',
            companyName: 'Fashion Forward Trading Co.',
            country: 'China',
            city: 'Guangzhou',
            rating: 4.6,
            responseRate: 95.2,
            responseTime: '4-6 hours',
            verified: true,
            goldMember: false,
        },
        {
            externalId: 'supplier_003',
            source: 'aliexpress',
            name: 'Home & Garden Plus',
            companyName: 'Home & Garden Plus Ltd.',
            country: 'China',
            city: 'Yiwu',
            rating: 4.7,
            responseRate: 96.8,
            responseTime: '3-5 hours',
            verified: true,
            goldMember: true,
        },
    ];

    const createdSuppliers = [];
    for (const supplier of suppliers) {
        const created = await prisma.supplier.create({
            data: supplier,
        });
        createdSuppliers.push(created);
        console.log(`✅ Created supplier: ${created.name}`);
    }

    return createdSuppliers;
}

async function createSampleProducts(suppliers: any[]) {
    const products = [
        {
            externalId: 'ALI001',
            source: 'alibaba',
            title: 'Wireless Bluetooth Headphones Pro',
            description: 'High-quality wireless headphones with active noise cancellation, 40-hour battery life, and premium sound quality.',
            price: 89.99,
            originalPrice: 149.99,
            currency: 'USD',
            images: [
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
                'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop'
            ],
            category: 'Electronics',
            subcategory: 'Audio',
            tags: ['tech', 'digital', 'modern', 'wireless', 'smart', 'noise-cancelling'],
            rating: 4.8,
            reviewCount: 156,
            soldCount: 2340,
            minOrderQuantity: 1,
            maxOrderQuantity: 1000,
            supplierId: suppliers[0].id,
            profitMargin: 25,
            gulfPrice: 329.99,
            gulfCurrency: 'AED',
        },
        {
            externalId: 'ALI002',
            source: 'alibaba',
            title: 'Smart Fitness Watch Series 5',
            description: 'Advanced fitness tracker with heart rate monitoring, GPS tracking, sleep analysis, and 7-day battery life.',
            price: 199.99,
            originalPrice: 299.99,
            currency: 'USD',
            images: [
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
                'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&h=300&fit=crop'
            ],
            category: 'Electronics',
            subcategory: 'Wearables',
            tags: ['tech', 'fitness', 'health', 'smart', 'tracking', 'gps'],
            rating: 4.7,
            reviewCount: 89,
            soldCount: 1234,
            minOrderQuantity: 1,
            maxOrderQuantity: 500,
            supplierId: suppliers[0].id,
            profitMargin: 30,
            gulfPrice: 734.99,
            gulfCurrency: 'AED',
        },
        {
            externalId: 'ALI003',
            source: 'alibaba',
            title: 'Premium Cotton T-Shirt Collection',
            description: 'High-quality 100% cotton t-shirts in various colors and sizes. Soft, breathable, and comfortable.',
            price: 24.99,
            originalPrice: 39.99,
            currency: 'USD',
            images: [
                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
                'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=300&h=300&fit=crop'
            ],
            category: 'Clothing',
            subcategory: 'T-Shirts',
            tags: ['fashion', 'clothing', 'cotton', 'comfortable', 'casual', 'stylish'],
            rating: 4.6,
            reviewCount: 234,
            soldCount: 5678,
            minOrderQuantity: 1,
            maxOrderQuantity: 2000,
            supplierId: suppliers[1].id,
            profitMargin: 20,
            gulfPrice: 91.99,
            gulfCurrency: 'AED',
        },
        {
            externalId: 'ALI004',
            source: 'alibaba',
            title: 'Portable Power Bank 20000mAh',
            description: 'High-capacity power bank with fast charging technology, multiple USB ports, and LED display.',
            price: 29.99,
            originalPrice: 49.99,
            currency: 'USD',
            images: [
                'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=300&h=300&fit=crop'
            ],
            category: 'Electronics',
            subcategory: 'Accessories',
            tags: ['tech', 'power', 'charging', 'portable', 'battery'],
            rating: 4.6,
            reviewCount: 234,
            soldCount: 5678,
            minOrderQuantity: 1,
            maxOrderQuantity: 2000,
            supplierId: suppliers[0].id,
            profitMargin: 20,
            gulfPrice: 109.99,
            gulfCurrency: 'AED',
        },
        {
            externalId: 'ALI005',
            source: 'alibaba',
            title: 'Smart LED Strip Lights',
            description: 'WiFi-enabled LED strip lights with 16 million colors, music sync, and smartphone control.',
            price: 19.99,
            originalPrice: 39.99,
            currency: 'USD',
            images: [
                'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&h=300&fit=crop'
            ],
            category: 'Home & Garden',
            subcategory: 'Lighting',
            tags: ['home', 'lighting', 'smart', 'led', 'wifi', 'decorative'],
            rating: 4.5,
            reviewCount: 189,
            soldCount: 3456,
            minOrderQuantity: 1,
            maxOrderQuantity: 1500,
            supplierId: suppliers[2].id,
            profitMargin: 25,
            gulfPrice: 73.99,
            gulfCurrency: 'AED',
        },
    ];

    for (const product of products) {
        const created = await prisma.product.create({
            data: product,
        });
        console.log(`✅ Created product: ${created.title}`);
    }
}

async function createSampleReviews() {
    const products = await prisma.product.findMany({ take: 5 });

    for (const product of products) {
        const reviewCount = Math.floor(Math.random() * 3) + 1; // 1-3 reviews per product

        for (let i = 0; i < reviewCount; i++) {
            const review = await prisma.review.create({
                data: {
                    productId: product.id,
                    reviewerName: `Customer_${Math.random().toString(36).substr(2, 6)}`,
                    rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
                    title: `Great ${product.title.split(' ')[0]} product!`,
                    content: `I really love this product. The quality is excellent and it works perfectly. Highly recommended!`,
                    helpful: Math.floor(Math.random() * 10),
                    verified: Math.random() > 0.3, // 70% verified
                    source: 'generated',
                },
            });
            console.log(`✅ Created review for: ${product.title}`);
        }
    }
}

async function createSampleCategories() {
    const categories = [
        { name: 'Electronics', description: 'Electronic devices and accessories' },
        { name: 'Clothing', description: 'Fashion and apparel items' },
        { name: 'Home & Garden', description: 'Home improvement and garden supplies' },
        { name: 'Beauty & Health', description: 'Beauty products and health items' },
        { name: 'Sports & Outdoor', description: 'Sports equipment and outdoor gear' },
        { name: 'Toys & Games', description: 'Toys, games, and entertainment' },
        { name: 'Automotive', description: 'Car accessories and automotive parts' },
        { name: 'Books & Media', description: 'Books, magazines, and digital content' },
    ];

    for (const category of categories) {
        console.log(`✅ Category: ${category.name}`);
    }
}

main().catch(console.error);