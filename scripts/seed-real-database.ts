#!/usr/bin/env tsx

import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

interface ScrapedProduct {
    externalId: string;
    source: string;
    title: string;
    description: string;
    price: number;
    originalPrice: number;
    currency: string;
    images: string[];
    category: string;
    subcategory: string;
    tags: string[];
    rating: number;
    reviewCount: number;
    soldCount: number;
    minOrderQuantity: number;
    maxOrderQuantity: number;
    shippingWeight: number;
    shippingDimensions: string;
    profitMargin: number;
    gulfPrice: number;
    gulfCurrency: string;
    brand?: string;
    model?: string;
}

interface ScrapedCategory {
    id: string;
    name: string;
    description: string;
    slug: string;
    image: string;
    sortOrder: number;
    subcategories: string[];
}

interface ScrapedSupplier {
    id: string;
    name: string;
    description: string;
    rating: number;
    verified: boolean;
    goldMember: boolean;
    country: string;
    responseTime: number;
    minOrderAmount: number;
    logo?: string;
    website?: string;
}

class DatabaseSeeder {
    private db: Database | null = null;

    async initialize(): Promise<void> {
        const dbPath = path.join(process.cwd(), 'data', 'midostore.db');
        this.db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        console.log('✅ Database connection established');
    }

    async seedCategories(): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        const categories: ScrapedCategory[] = [
            {
                id: 'cat-1',
                name: 'Electronics',
                description: 'Latest gadgets, smartphones, laptops, and smart home devices',
                slug: 'electronics',
                image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
                sortOrder: 1,
                subcategories: ['Smartphones', 'Laptops', 'Audio', 'Smart Home', 'Gaming', 'Accessories']
            },
            {
                id: 'cat-2',
                name: 'Fashion & Accessories',
                description: 'Clothing, shoes, bags, jewelry, and fashion accessories',
                slug: 'fashion-accessories',
                image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
                sortOrder: 2,
                subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Bags', 'Jewelry', 'Watches']
            },
            {
                id: 'cat-3',
                name: 'Home & Garden',
                description: 'Furniture, decor, gardening tools, and home improvement',
                slug: 'home-garden',
                image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
                sortOrder: 3,
                subcategories: ['Furniture', 'Decor', 'Kitchen', 'Bathroom', 'Garden', 'Tools']
            },
            {
                id: 'cat-4',
                name: 'Beauty & Health',
                description: 'Skincare, makeup, wellness products, and personal care',
                slug: 'beauty-health',
                image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop',
                sortOrder: 4,
                subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Wellness', 'Personal Care']
            },
            {
                id: 'cat-5',
                name: 'Sports & Outdoor',
                description: 'Sports equipment, outdoor gear, fitness, and adventure',
                slug: 'sports-outdoor',
                image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
                sortOrder: 5,
                subcategories: ['Fitness', 'Team Sports', 'Outdoor Gear', 'Swimming', 'Cycling', 'Yoga']
            },
            {
                id: 'cat-6',
                name: 'Toys & Games',
                description: 'Educational toys, board games, and entertainment for all ages',
                slug: 'toys-games',
                image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop',
                sortOrder: 6,
                subcategories: ['Educational', 'Board Games', 'Puzzles', 'Building Sets', 'Arts & Crafts', 'Collectibles']
            }
        ];

        console.log('🌱 Seeding categories...');
        for (const category of categories) {
            await this.db!.run(`
        INSERT OR REPLACE INTO categories (id, name, description, slug, image, isActive, sortOrder)
        VALUES (?, ?, ?, ?, ?, 1, ?)
      `, [category.id, category.name, category.description, category.slug, category.image, category.sortOrder]);

            // Create subcategories
            for (let i = 0; i < category.subcategories.length; i++) {
                const subcatId = `${category.id}-sub-${i + 1}`;
                await this.db!.run(`
          INSERT OR REPLACE INTO subcategories (id, name, description, slug, categoryId, image, isActive)
          VALUES (?, ?, ?, ?, ?, ?, 1)
        `, [
                    subcatId,
                    category.subcategories[i],
                    `${category.subcategories[i]} products and accessories`,
                    category.subcategories[i].toLowerCase().replace(/\s+/g, '-'),
                    category.id,
                    category.image
                ]);
            }
        }
        console.log(`✅ Seeded ${categories.length} categories with subcategories`);
    }

    async seedSuppliers(): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        const suppliers: ScrapedSupplier[] = [
            {
                id: 'supp-1',
                name: 'TechPro Solutions',
                description: 'Premium electronics supplier with verified quality and fast shipping',
                rating: 4.8,
                verified: true,
                goldMember: true,
                country: 'China',
                responseTime: 2,
                minOrderAmount: 100,
                logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
                website: 'https://techpro-solutions.com'
            },
            {
                id: 'supp-2',
                name: 'Fashion Forward Ltd',
                description: 'Trendy fashion items with competitive pricing and bulk discounts',
                rating: 4.6,
                verified: true,
                goldMember: true,
                country: 'Turkey',
                responseTime: 4,
                minOrderAmount: 200,
                logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop',
                website: 'https://fashion-forward.com'
            },
            {
                id: 'supp-3',
                name: 'Home Essentials Co',
                description: 'Quality home and garden products with wholesale pricing',
                rating: 4.7,
                verified: true,
                goldMember: false,
                country: 'India',
                responseTime: 6,
                minOrderAmount: 150,
                logo: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop',
                website: 'https://home-essentials.com'
            },
            {
                id: 'supp-4',
                name: 'Beauty World Trading',
                description: 'Premium beauty and health products with authentic certifications',
                rating: 4.5,
                verified: true,
                goldMember: true,
                country: 'South Korea',
                responseTime: 3,
                minOrderAmount: 300,
                logo: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=100&h=100&fit=crop',
                website: 'https://beauty-world.com'
            },
            {
                id: 'supp-5',
                name: 'Sports Gear Pro',
                description: 'Professional sports equipment and outdoor gear supplier',
                rating: 4.4,
                verified: true,
                goldMember: false,
                country: 'Germany',
                responseTime: 5,
                minOrderAmount: 250,
                logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
                website: 'https://sports-gear-pro.com'
            }
        ];

        console.log('🏭 Seeding suppliers...');
        for (const supplier of suppliers) {
            await this.db!.run(`
        INSERT OR REPLACE INTO suppliers (id, name, description, rating, verified, goldMember, country, responseTime, minOrderAmount, logo, website, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [
                supplier.id, supplier.name, supplier.description, supplier.rating, supplier.verified ? 1 : 0,
                supplier.goldMember ? 1 : 0, supplier.country, supplier.responseTime, supplier.minOrderAmount,
                supplier.logo, supplier.website
            ]);
        }
        console.log(`✅ Seeded ${suppliers.length} suppliers`);
    }

    async seedProducts(): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        const products: ScrapedProduct[] = [
            // Electronics
            {
                externalId: 'ALI001',
                source: 'alibaba',
                title: 'iPhone 15 Pro Max - 256GB - Space Black',
                description: 'Latest iPhone with A17 Pro chip, 48MP camera, and titanium design. Includes fast charging and wireless charging capabilities.',
                price: 1199.99,
                originalPrice: 1399.99,
                currency: 'USD',
                images: [
                    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop'
                ],
                category: 'cat-1',
                subcategory: 'cat-1-sub-1',
                tags: ['smartphone', 'iphone', 'apple', '5g', 'camera', 'titanium'],
                rating: 4.9,
                reviewCount: 1250,
                soldCount: 8500,
                minOrderQuantity: 1,
                maxOrderQuantity: 100,
                shippingWeight: 0.2,
                shippingDimensions: '15x8x1cm',
                profitMargin: 25,
                gulfPrice: 4399.99,
                gulfCurrency: 'AED',
                brand: 'Apple',
                model: 'iPhone 15 Pro Max'
            },
            {
                externalId: 'ALI002',
                source: 'alibaba',
                title: 'MacBook Air M3 - 13" 512GB - Midnight',
                description: 'Powerful M3 chip, 13.6-inch Liquid Retina display, up to 18 hours battery life. Perfect for work and creativity.',
                price: 1299.99,
                originalPrice: 1499.99,
                currency: 'USD',
                images: [
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop'
                ],
                category: 'cat-1',
                subcategory: 'cat-1-sub-2',
                tags: ['laptop', 'macbook', 'apple', 'm3', 'ultrabook', 'retina'],
                rating: 4.8,
                reviewCount: 890,
                soldCount: 3200,
                minOrderQuantity: 1,
                maxOrderQuantity: 50,
                shippingWeight: 1.3,
                shippingDimensions: '30x21x1.5cm',
                profitMargin: 30,
                gulfPrice: 4799.99,
                gulfCurrency: 'AED',
                brand: 'Apple',
                model: 'MacBook Air M3'
            },
            {
                externalId: 'ALI003',
                source: 'alibaba',
                title: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
                description: 'Industry-leading noise cancellation, 30-hour battery life, premium comfort, and exceptional sound quality.',
                price: 399.99,
                originalPrice: 499.99,
                currency: 'USD',
                images: [
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop'
                ],
                category: 'cat-1',
                subcategory: 'cat-1-sub-3',
                tags: ['headphones', 'wireless', 'noise-canceling', 'sony', 'bluetooth', 'audio'],
                rating: 4.7,
                reviewCount: 1560,
                soldCount: 7800,
                minOrderQuantity: 1,
                maxOrderQuantity: 200,
                shippingWeight: 0.25,
                shippingDimensions: '18x12x8cm',
                profitMargin: 20,
                gulfPrice: 1469.99,
                gulfCurrency: 'AED',
                brand: 'Sony',
                model: 'WH-1000XM5'
            },
            // Fashion
            {
                externalId: 'ALI004',
                source: 'alibaba',
                title: 'Premium Cotton T-Shirt Collection - Men\'s',
                description: 'High-quality 100% cotton t-shirts in various colors and sizes. Soft, breathable, and comfortable for everyday wear.',
                price: 24.99,
                originalPrice: 39.99,
                currency: 'USD',
                images: [
                    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop'
                ],
                category: 'cat-2',
                subcategory: 'cat-2-sub-1',
                tags: ['t-shirt', 'cotton', 'men', 'casual', 'comfortable', 'breathable'],
                rating: 4.6,
                reviewCount: 2340,
                soldCount: 15600,
                minOrderQuantity: 10,
                maxOrderQuantity: 1000,
                shippingWeight: 0.3,
                shippingDimensions: '30x20x2cm',
                profitMargin: 35,
                gulfPrice: 91.99,
                gulfCurrency: 'AED',
                brand: 'Premium Cotton',
                model: 'Classic T-Shirt'
            },
            {
                externalId: 'ALI005',
                source: 'alibaba',
                title: 'Designer Handbag Collection - Women\'s',
                description: 'Elegant designer-inspired handbags in various styles and colors. Perfect for work, casual, and formal occasions.',
                price: 89.99,
                originalPrice: 149.99,
                currency: 'USD',
                images: [
                    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop'
                ],
                category: 'cat-2',
                subcategory: 'cat-2-sub-4',
                tags: ['handbag', 'designer', 'women', 'fashion', 'elegant', 'luxury'],
                rating: 4.5,
                reviewCount: 890,
                soldCount: 4200,
                minOrderQuantity: 1,
                maxOrderQuantity: 500,
                shippingWeight: 0.8,
                shippingDimensions: '35x25x15cm',
                profitMargin: 40,
                gulfPrice: 329.99,
                gulfCurrency: 'AED',
                brand: 'Designer Collection',
                model: 'Premium Handbag'
            },
            // Home & Garden
            {
                externalId: 'ALI006',
                source: 'alibaba',
                title: 'Smart LED Light Bulb Pack - 4 Pack',
                description: 'WiFi-enabled smart LED bulbs with 16 million colors, voice control, and energy-efficient technology.',
                price: 29.99,
                originalPrice: 49.99,
                currency: 'USD',
                images: [
                    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop'
                ],
                category: 'cat-3',
                subcategory: 'cat-3-sub-1',
                tags: ['smart', 'led', 'lighting', 'wifi', 'voice-control', 'energy-efficient'],
                rating: 4.4,
                reviewCount: 1230,
                soldCount: 8900,
                minOrderQuantity: 1,
                maxOrderQuantity: 1000,
                shippingWeight: 0.5,
                shippingDimensions: '12x8x6cm',
                profitMargin: 25,
                gulfPrice: 109.99,
                gulfCurrency: 'AED',
                brand: 'SmartLight',
                model: 'WiFi LED Bulb'
            },
            // Beauty & Health
            {
                externalId: 'ALI007',
                source: 'alibaba',
                title: 'Korean Skincare Set - 5 Piece Collection',
                description: 'Complete Korean skincare routine with cleanser, toner, serum, moisturizer, and sunscreen.',
                price: 49.99,
                originalPrice: 79.99,
                currency: 'USD',
                images: [
                    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop'
                ],
                category: 'cat-4',
                subcategory: 'cat-4-sub-1',
                tags: ['skincare', 'korean', 'routine', 'cleanser', 'serum', 'moisturizer'],
                rating: 4.8,
                reviewCount: 2100,
                soldCount: 12500,
                minOrderQuantity: 1,
                maxOrderQuantity: 200,
                shippingWeight: 0.6,
                shippingDimensions: '20x15x8cm',
                profitMargin: 30,
                gulfPrice: 183.99,
                gulfCurrency: 'AED',
                brand: 'Korean Beauty',
                model: '5-Piece Set'
            },
            // Sports & Outdoor
            {
                externalId: 'ALI008',
                source: 'alibaba',
                title: 'Professional Yoga Mat - Non-Slip & Eco-Friendly',
                description: 'Premium yoga mat with excellent grip, cushioning, and eco-friendly materials. Perfect for all yoga styles.',
                price: 34.99,
                originalPrice: 59.99,
                currency: 'USD',
                images: [
                    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
                ],
                category: 'cat-5',
                subcategory: 'cat-5-sub-6',
                tags: ['yoga', 'mat', 'non-slip', 'eco-friendly', 'fitness', 'meditation'],
                rating: 4.6,
                reviewCount: 890,
                soldCount: 5600,
                minOrderQuantity: 1,
                maxOrderQuantity: 500,
                shippingWeight: 1.2,
                shippingDimensions: '180x60x0.5cm',
                profitMargin: 35,
                gulfPrice: 128.99,
                gulfCurrency: 'AED',
                brand: 'YogaPro',
                model: 'Premium Mat'
            },
            // Toys & Games
            {
                externalId: 'ALI009',
                source: 'alibaba',
                title: 'Educational Building Blocks Set - 500 Pieces',
                description: 'Creative building blocks for children with various shapes and colors. Promotes creativity and problem-solving skills.',
                price: 39.99,
                originalPrice: 69.99,
                currency: 'USD',
                images: [
                    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop'
                ],
                category: 'cat-6',
                subcategory: 'cat-6-sub-1',
                tags: ['building', 'blocks', 'educational', 'creative', 'children', 'toys'],
                rating: 4.7,
                reviewCount: 1560,
                soldCount: 8900,
                minOrderQuantity: 1,
                maxOrderQuantity: 100,
                shippingWeight: 2.5,
                shippingDimensions: '40x30x15cm',
                profitMargin: 30,
                gulfPrice: 146.99,
                gulfCurrency: 'AED',
                brand: 'EduBlocks',
                model: '500-Piece Set'
            }
        ];

        console.log('📦 Seeding products...');
        for (const product of products) {
            const productId = `prod-${product.externalId}`;
            const supplierId = product.category === 'cat-1' ? 'supp-1' :
                product.category === 'cat-2' ? 'supp-2' :
                    product.category === 'cat-3' ? 'supp-3' :
                        product.category === 'cat-4' ? 'supp-4' :
                            product.category === 'cat-5' ? 'supp-5' : 'supp-1';

            await this.db!.run(`
        INSERT OR REPLACE INTO products (
          id, name, description, shortDescription, sku, brand, model, basePrice, salePrice, costPrice,
          currency, profitMargin, stockQuantity, isActive, categoryId, subcategoryId, images,
          averageRating, reviewCount, soldCount, tags, supplierId, externalId, source, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [
                productId, product.title, product.description, product.description.substring(0, 100),
                `SKU-${product.externalId}`, product.brand, product.model, product.price, product.salePrice || product.price * 0.8,
                product.price * 0.6, product.currency, product.profitMargin, Math.floor(Math.random() * 1000) + 100,
                1, product.category, product.subcategory, JSON.stringify(product.images), product.rating,
                product.reviewCount, product.soldCount, JSON.stringify(product.tags), supplierId,
                product.externalId, product.source
            ]);
        }
        console.log(`✅ Seeded ${products.length} products`);
    }

    async seedReviews(): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        console.log('⭐ Seeding reviews...');

        // Get all products
        const products = await this.db.all('SELECT id, name FROM products');

        const reviewTemplates = [
            { rating: 5, content: 'Excellent product! Exceeded my expectations. Highly recommended!' },
            { rating: 5, content: 'Great quality and fast shipping. Will definitely buy again!' },
            { rating: 4, content: 'Very good product, good value for money. Minor issues but overall satisfied.' },
            { rating: 4, content: 'Good quality, meets expectations. Shipping was a bit slow but product is great.' },
            { rating: 5, content: 'Amazing product! Better than expected. Fast delivery and excellent packaging.' },
            { rating: 4, content: 'Good product, good price. Would recommend to others.' },
            { rating: 5, content: 'Perfect! Exactly what I was looking for. Great customer service too!' },
            { rating: 4, content: 'Nice product, good quality. Happy with the purchase.' }
        ];

        let reviewCount = 0;
        for (const product of products) {
            // Generate 3-8 reviews per product
            const numReviews = Math.floor(Math.random() * 6) + 3;

            for (let i = 0; i < numReviews; i++) {
                const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
                const reviewId = `review-${product.id}-${i + 1}`;
                const reviewerName = `Customer${Math.floor(Math.random() * 1000) + 1}`;

                await this.db!.run(`
          INSERT OR REPLACE INTO reviews (id, productId, reviewerName, rating, content, helpful, verified, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `, [
                    reviewId, product.id, reviewerName, template.rating, template.content,
                    Math.floor(Math.random() * 50), Math.random() > 0.3
                ]);
                reviewCount++;
            }
        }
        console.log(`✅ Seeded ${reviewCount} reviews`);
    }

    async close(): Promise<void> {
        if (this.db) {
            await this.db.close();
        }
    }
}

async function main() {
    console.log('🚀 Starting comprehensive database seeding...');

    const seeder = new DatabaseSeeder();

    try {
        await seeder.initialize();
        await seeder.seedCategories();
        await seeder.seedSuppliers();
        await seeder.seedProducts();
        await seeder.seedReviews();

        console.log('🎉 Database seeding completed successfully!');
        console.log('📊 Database now contains:');
        console.log('   - Categories with subcategories');
        console.log('   - Verified suppliers');
        console.log('   - Realistic products with pricing');
        console.log('   - Customer reviews');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        await seeder.close();
    }
}

if (require.main === module) {
    main();
}