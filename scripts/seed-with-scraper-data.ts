#!/usr/bin/env tsx

import { prisma, isRealDatabase, databaseType } from '../lib/db';
import { ScrapingService } from '../lib/scraping-service';

console.log(`🌱 Starting database seeding with ${databaseType}...`);

// Sample scraper data (realistic product data)
const scraperData = {
    products: [
        {
            externalId: 'ALI001',
            source: 'alibaba',
            title: 'Wireless Bluetooth Headphones Pro',
            description: 'High-quality wireless headphones with active noise cancellation, 40-hour battery life, and premium sound quality. Perfect for music lovers and professionals.',
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
            shippingWeight: 0.5,
            shippingDimensions: '15x10x5cm',
            profitMargin: 25,
            gulfPrice: 329.99,
            gulfCurrency: 'AED'
        },
        {
            externalId: 'ALI002',
            source: 'alibaba',
            title: 'Smart Fitness Watch Series 5',
            description: 'Advanced fitness tracker with heart rate monitoring, GPS tracking, sleep analysis, and 7-day battery life. Compatible with iOS and Android.',
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
            shippingWeight: 0.3,
            shippingDimensions: '12x8x2cm',
            profitMargin: 30,
            gulfPrice: 734.99,
            gulfCurrency: 'AED'
        },
        {
            externalId: 'ALI003',
            source: 'alibaba',
            title: 'Portable Power Bank 20000mAh',
            description: 'High-capacity power bank with fast charging technology, multiple USB ports, and LED display. Charges phones, tablets, and laptops.',
            price: 29.99,
            originalPrice: 49.99,
            currency: 'USD',
            images: [
                'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=300&h=300&fit=crop',
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
            shippingWeight: 0.4,
            shippingDimensions: '10x8x2cm',
            profitMargin: 20,
            gulfPrice: 109.99,
            gulfCurrency: 'AED'
        },
        {
            externalId: 'ALI004',
            source: 'alibaba',
            title: 'Premium Cotton T-Shirt Collection',
            description: 'High-quality 100% cotton t-shirts in various colors and sizes. Soft, breathable, and comfortable for everyday wear.',
            price: 24.99,
            originalPrice: 39.99,
            currency: 'USD',
            images: [
                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
                'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=300&h=300&fit=crop'
            ],
            category: 'Fashion',
            subcategory: 'Men\'s Clothing',
            tags: ['fashion', 'clothing', 'cotton', 'comfortable', 'casual', 'stylish'],
            rating: 4.5,
            reviewCount: 89,
            soldCount: 3456,
            minOrderQuantity: 10,
            maxOrderQuantity: 5000,
            shippingWeight: 0.2,
            shippingDimensions: '20x15x2cm',
            profitMargin: 30,
            gulfPrice: 91.99,
            gulfCurrency: 'AED'
        },
        {
            externalId: 'ALI005',
            source: 'alibaba',
            title: 'LED Desk Lamp with Touch Control',
            description: 'Modern LED desk lamp with touch-sensitive controls, adjustable brightness, and color temperature. Perfect for study and work.',
            price: 34.99,
            originalPrice: 59.99,
            currency: 'USD',
            images: [
                'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop',
                'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop'
            ],
            category: 'Home & Garden',
            subcategory: 'Lighting',
            tags: ['home', 'lighting', 'led', 'desk', 'modern', 'adjustable'],
            rating: 4.4,
            reviewCount: 67,
            soldCount: 1890,
            minOrderQuantity: 1,
            maxOrderQuantity: 1000,
            shippingWeight: 0.8,
            shippingDimensions: '25x20x8cm',
            profitMargin: 20,
            gulfPrice: 128.99,
            gulfCurrency: 'AED'
        }
    ],
    suppliers: [
        {
            externalId: 'SUP001',
            source: 'alibaba',
            name: 'TechPro Solutions',
            companyName: 'TechPro Solutions Ltd.',
            country: 'China',
            city: 'Shenzhen',
            rating: 4.8,
            responseRate: 98,
            responseTime: '2-4 hours',
            verified: true,
            goldMember: true
        },
        {
            externalId: 'SUP002',
            source: 'alibaba',
            name: 'Fashion Forward',
            companyName: 'Fashion Forward International',
            country: 'Turkey',
            city: 'Istanbul',
            rating: 4.6,
            responseRate: 95,
            responseTime: '4-6 hours',
            verified: true,
            goldMember: true
        },
        {
            externalId: 'SUP003',
            source: 'alibaba',
            name: 'Home Essentials',
            companyName: 'Home Essentials Co.',
            country: 'India',
            city: 'Mumbai',
            rating: 4.5,
            responseRate: 92,
            responseTime: '6-8 hours',
            verified: true,
            goldMember: false
        }
    ],
    reviews: [
        {
            productId: 'ALI001',
            reviewerName: 'Ahmed Ali',
            rating: 5,
            title: 'Excellent Quality Headphones!',
            content: 'These headphones are amazing! The sound quality is incredible and the noise cancellation works perfectly. Battery life is impressive too.',
            helpful: 12,
            verified: true,
            source: 'generated',
            externalId: 'REV001'
        },
        {
            productId: 'ALI001',
            reviewerName: 'Sarah Johnson',
            rating: 4,
            title: 'Great Sound, Minor Issues',
            content: 'Very good sound quality and comfortable to wear. The only issue is the touch controls can be a bit sensitive sometimes.',
            helpful: 8,
            verified: true,
            source: 'generated',
            externalId: 'REV002'
        },
        {
            productId: 'ALI002',
            reviewerName: 'Mohammed Hassan',
            rating: 5,
            title: 'Perfect Fitness Companion',
            content: 'This watch tracks everything perfectly. Heart rate, steps, sleep - all very accurate. Battery lasts a full week as promised.',
            helpful: 15,
            verified: true,
            source: 'generated',
            externalId: 'REV003'
        },
        {
            productId: 'ALI003',
            reviewerName: 'Lisa Chen',
            rating: 4,
            title: 'Reliable Power Bank',
            content: 'Great capacity and fast charging. Charges my phone multiple times. The LED display is helpful to know remaining power.',
            helpful: 6,
            verified: true,
            source: 'generated',
            externalId: 'REV004'
        }
    ],
    gulfCountries: [
        { code: 'AE', name: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة', currency: 'AED', currencyAr: 'درهم إماراتي', timezone: 'Asia/Dubai', locale: 'ar-AE' },
        { code: 'SA', name: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', currency: 'SAR', currencyAr: 'ريال سعودي', timezone: 'Asia/Riyadh', locale: 'ar-SA' },
        { code: 'KW', name: 'Kuwait', nameAr: 'الكويت', currency: 'KWD', currencyAr: 'دينار كويتي', timezone: 'Asia/Kuwait', locale: 'ar-KW' },
        { code: 'QA', name: 'Qatar', nameAr: 'قطر', currency: 'QAR', currencyAr: 'ريال قطري', timezone: 'Asia/Qatar', locale: 'ar-QA' },
        { code: 'BH', name: 'Bahrain', nameAr: 'البحرين', currency: 'BHD', currencyAr: 'دينار بحريني', timezone: 'Asia/Bahrain', locale: 'ar-BH' },
        { code: 'OM', name: 'Oman', nameAr: 'عُمان', currency: 'OMR', currencyAr: 'ريال عماني', timezone: 'Asia/Muscat', locale: 'ar-OM' }
    ],
    exchangeRates: [
        { fromCurrency: 'USD', toCurrency: 'AED', rate: 3.67, source: 'mock-api' },
        { fromCurrency: 'USD', toCurrency: 'SAR', rate: 3.75, source: 'mock-api' },
        { fromCurrency: 'USD', toCurrency: 'KWD', rate: 0.31, source: 'mock-api' },
        { fromCurrency: 'USD', toCurrency: 'QAR', rate: 3.64, source: 'mock-api' },
        { fromCurrency: 'USD', toCurrency: 'BHD', rate: 0.38, source: 'mock-api' },
        { fromCurrency: 'USD', toCurrency: 'OMR', rate: 0.38, source: 'mock-api' }
    ]
};

async function seedDatabase() {
    try {
        console.log('🚀 Starting database seeding...');

        // Seed Gulf Countries
        console.log('🌍 Seeding Gulf countries...');
        for (const country of scraperData.gulfCountries) {
            try {
                await prisma.gulfCountry.upsert({
                    where: { code: country.code },
                    update: country,
                    create: country
                });
            } catch (error) {
                console.log(`⚠️ Could not seed country ${country.code}:`, error.message);
            }
        }

        // Seed Suppliers
        console.log('🏢 Seeding suppliers...');
        for (const supplier of scraperData.suppliers) {
            try {
                await prisma.supplier.upsert({
                    where: { externalId: supplier.externalId },
                    update: supplier,
                    create: supplier
                });
            } catch (error) {
                console.log(`⚠️ Could not seed supplier ${supplier.name}:`, error.message);
            }
        }

        // Seed Products
        console.log('📦 Seeding products...');
        for (const product of scraperData.products) {
            try {
                // Get supplier ID
                const supplier = await prisma.supplier.findFirst({
                    where: { source: product.source }
                });

                if (!supplier) {
                    console.log(`⚠️ No supplier found for ${product.source}, skipping product ${product.title}`);
                    continue;
                }

                const productData = {
                    ...product,
                    supplierId: supplier.id
                };

                await prisma.product.upsert({
                    where: { externalId: product.externalId },
                    update: productData,
                    create: productData
                });

                console.log(`✅ Seeded product: ${product.title}`);
            } catch (error) {
                console.log(`⚠️ Could not seed product ${product.title}:`, error.message);
            }
        }

        // Seed Reviews
        console.log('⭐ Seeding reviews...');
        for (const review of scraperData.reviews) {
            try {
                // Get product ID
                const product = await prisma.product.findFirst({
                    where: { externalId: review.productId }
                });

                if (!product) {
                    console.log(`⚠️ No product found for review ${review.externalId}, skipping`);
                    continue;
                }

                const reviewData = {
                    ...review,
                    productId: product.id
                };

                await prisma.review.upsert({
                    where: { externalId: review.externalId },
                    update: reviewData,
                    create: reviewData
                });

                console.log(`✅ Seeded review: ${review.title}`);
            } catch (error) {
                console.log(`⚠️ Could not seed review ${review.title}:`, error.message);
            }
        }

        // Seed Exchange Rates
        console.log('💱 Seeding exchange rates...');
        for (const rate of scraperData.exchangeRates) {
            try {
                await prisma.exchangeRate.upsert({
                    where: {
                        fromCurrency_toCurrency: {
                            fromCurrency: rate.fromCurrency,
                            toCurrency: rate.toCurrency
                        }
                    },
                    update: rate,
                    create: rate
                });
            } catch (error) {
                console.log(`⚠️ Could not seed exchange rate ${rate.fromCurrency}->${rate.toCurrency}:`, error.message);
            }
        }

        // Create sample user
        console.log('👤 Creating sample user...');
        try {
            await prisma.user.upsert({
                where: { email: 'demo@midostore.com' },
                update: {},
                create: {
                    user_id: 'user_001',
                    email: 'demo@midostore.com',
                    full_name: 'Demo User',
                    phone: '+971501234567'
                }
            });
            console.log('✅ Created sample user');
        } catch (error) {
            console.log('⚠️ Could not create sample user:', error.message);
        }

        console.log('\n🎉 Database seeding completed!');
        console.log(`📊 Database type: ${databaseType}`);

        // Show summary
        const productCount = await prisma.product.count();
        const supplierCount = await prisma.supplier.count();
        const reviewCount = await prisma.review.count();
        const userCount = await prisma.user.count();

        console.log('\n📈 Seeding Summary:');
        console.log(`   - Products: ${productCount}`);
        console.log(`   - Suppliers: ${supplierCount}`);
        console.log(`   - Reviews: ${reviewCount}`);
        console.log(`   - Users: ${userCount}`);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Run seeding
seedDatabase().catch(console.error);