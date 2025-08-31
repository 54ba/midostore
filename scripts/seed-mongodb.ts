#!/usr/bin/env tsx

import MongoDBService, { Product, Category, Supplier, Review } from '../src/lib/mongodb-service';

interface ScrapedProductData {
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

interface ScrapedCategoryData {
    id: string;
    name: string;
    nameAr?: string;
    description: string;
    slug: string;
    image: string;
    sortOrder: number;
    subcategories: string[];
    isFeatured: boolean;
    isTrending: boolean;
    isNew: boolean;
    gradient: string;
}

interface ScrapedSupplierData {
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

class MongoDBSeeder {
    private dbService: MongoDBService;

    constructor() {
        this.dbService = MongoDBService.getInstance();
    }

    async seedCategories(): Promise<void> {
        console.log('🌱 Seeding categories...');

        const categories: ScrapedCategoryData[] = [
            {
                id: 'cat-1',
                name: 'Electronics',
                nameAr: 'الإلكترونيات',
                description: 'Latest gadgets, smartphones, laptops, and smart home devices',
                slug: 'electronics',
                image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
                sortOrder: 1,
                subcategories: ['Smartphones', 'Laptops', 'Audio', 'Smart Home', 'Gaming', 'Accessories'],
                isFeatured: true,
                isTrending: true,
                isNew: false,
                gradient: 'from-blue-500 via-blue-600 to-cyan-500'
            },
            {
                id: 'cat-2',
                name: 'Fashion & Accessories',
                nameAr: 'الأزياء والإكسسوارات',
                description: 'Clothing, shoes, bags, jewelry, and fashion accessories',
                slug: 'fashion-accessories',
                image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
                sortOrder: 2,
                subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Bags', 'Jewelry', 'Watches'],
                isFeatured: true,
                isTrending: true,
                isNew: false,
                gradient: 'from-indigo-500 via-purple-500 to-pink-500'
            },
            {
                id: 'cat-3',
                name: 'Home & Garden',
                nameAr: 'المنزل والحديقة',
                description: 'Furniture, decor, gardening tools, and home improvement',
                slug: 'home-garden',
                image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
                sortOrder: 3,
                subcategories: ['Furniture', 'Decor', 'Kitchen', 'Bathroom', 'Garden', 'Tools'],
                isFeatured: false,
                isTrending: false,
                isNew: false,
                gradient: 'from-emerald-500 via-teal-500 to-cyan-500'
            },
            {
                id: 'cat-4',
                name: 'Beauty & Health',
                nameAr: 'الجمال والصحة',
                description: 'Skincare, makeup, wellness products, and personal care',
                slug: 'beauty-health',
                image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop',
                sortOrder: 4,
                subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Wellness', 'Personal Care'],
                isFeatured: true,
                isTrending: true,
                isNew: false,
                gradient: 'from-rose-500 via-pink-500 to-red-500'
            },
            {
                id: 'cat-5',
                name: 'Sports & Outdoor',
                nameAr: 'الرياضة والهواء الطلق',
                description: 'Sports equipment, outdoor gear, fitness, and adventure',
                slug: 'sports-outdoor',
                image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
                sortOrder: 5,
                subcategories: ['Fitness', 'Team Sports', 'Outdoor Gear', 'Swimming', 'Cycling', 'Yoga'],
                isFeatured: false,
                isTrending: false,
                isNew: false,
                gradient: 'from-orange-500 via-red-500 to-pink-500'
            },
            {
                id: 'cat-6',
                name: 'Toys & Games',
                nameAr: 'الألعاب والألعاب',
                description: 'Educational toys, board games, and entertainment for all ages',
                slug: 'toys-games',
                image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop',
                sortOrder: 6,
                subcategories: ['Educational', 'Board Games', 'Puzzles', 'Building Sets', 'Arts & Crafts', 'Collectibles'],
                isFeatured: true,
                isTrending: false,
                isNew: true,
                gradient: 'from-purple-500 via-purple-600 to-pink-500'
            }
        ];

        for (const categoryData of categories) {
            const category: Omit<Category, '_id'> = {
                ...categoryData,
                isActive: true,
                productCount: 0,
                featuredCount: 0
            };

            await this.dbService.createCategory(category);
            console.log(`✅ Created category: ${category.name}`);
        }

        console.log(`✅ Seeded ${categories.length} categories`);
    }

    async seedSuppliers(): Promise<void> {
        console.log('🏭 Seeding suppliers...');

        const suppliers: ScrapedSupplierData[] = [
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

        for (const supplierData of suppliers) {
            const supplier: Omit<Supplier, '_id' | 'createdAt' | 'updatedAt'> = {
                ...supplierData,
                productCount: 0
            };

            await this.dbService.createSupplier(supplier);
            console.log(`✅ Created supplier: ${supplier.name}`);
        }

        console.log(`✅ Seeded ${suppliers.length} suppliers`);
    }

    async seedProducts(): Promise<void> {
        console.log('📦 Seeding products...');

        const products: ScrapedProductData[] = [
            // Electronics - Smartphones
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
                subcategory: 'Smartphones',
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
                title: 'Samsung Galaxy S24 Ultra - 512GB - Titanium Gray',
                description: 'Premium Android flagship with S Pen, 200MP camera, and AI-powered features. Perfect for productivity and creativity.',
                price: 1299.99,
                originalPrice: 1499.99,
                currency: 'USD',
                images: [
                    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
                ],
                category: 'cat-1',
                subcategory: 'Smartphones',
                tags: ['smartphone', 'samsung', 'android', '5g', 'camera', 's-pen'],
                rating: 4.8,
                reviewCount: 980,
                soldCount: 6200,
                minOrderQuantity: 1,
                maxOrderQuantity: 100,
                shippingWeight: 0.23,
                shippingDimensions: '16x8x1cm',
                profitMargin: 28,
                gulfPrice: 4799.99,
                gulfCurrency: 'AED',
                brand: 'Samsung',
                model: 'Galaxy S24 Ultra'
            },
            // Electronics - Laptops
            {
                externalId: 'ALI003',
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
                subcategory: 'Laptops',
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
            // Electronics - Audio
            {
                externalId: 'ALI004',
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
                subcategory: 'Audio',
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
            // Fashion - Men's Clothing
            {
                externalId: 'ALI005',
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
                subcategory: 'Men\'s Clothing',
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
            // Fashion - Women's Clothing
            {
                externalId: 'ALI006',
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
                subcategory: 'Bags',
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
            // Home & Garden - Smart Home
            {
                externalId: 'ALI007',
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
                subcategory: 'Smart Home',
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
            // Beauty & Health - Skincare
            {
                externalId: 'ALI008',
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
                subcategory: 'Skincare',
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
            // Sports & Outdoor - Fitness
            {
                externalId: 'ALI009',
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
                subcategory: 'Yoga',
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
            // Toys & Games - Educational
            {
                externalId: 'ALI010',
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
                subcategory: 'Educational',
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

        for (const productData of products) {
            const product: Omit<Product, '_id' | 'createdAt' | 'updatedAt' | 'lastScraped'> = {
                ...productData,
                shortDescription: productData.description.substring(0, 100),
                sku: `SKU-${productData.externalId}`,
                stockQuantity: Math.floor(Math.random() * 1000) + 100,
                isActive: true,
                supplierId: productData.category === 'cat-1' ? 'supp-1' :
                    productData.category === 'cat-2' ? 'supp-2' :
                        productData.category === 'cat-3' ? 'supp-3' :
                            productData.category === 'cat-4' ? 'supp-4' :
                                productData.category === 'cat-5' ? 'supp-5' : 'supp-1'
            };

            await this.dbService.createProduct(product);
            console.log(`✅ Created product: ${product.title}`);
        }

        console.log(`✅ Seeded ${products.length} products`);
    }

    async seedReviews(): Promise<void> {
        console.log('⭐ Seeding reviews...');

        // Get all products
        const products = await this.dbService.getProducts(1000);

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
                const reviewId = `review-${product._id}-${i + 1}`;
                const reviewerName = `Customer${Math.floor(Math.random() * 1000) + 1}`;

                const review: Omit<Review, '_id' | 'createdAt'> = {
                    id: reviewId,
                    productId: product._id!.toString(),
                    productTitle: product.title,
                    productImage: product.images[0] || '',
                    productPrice: product.price,
                    productOriginalPrice: product.originalPrice,
                    productCategory: product.category,
                    reviewerName,
                    rating: template.rating,
                    content: template.content,
                    helpful: Math.floor(Math.random() * 50),
                    verified: Math.random() > 0.3,
                    source: 'customer'
                };

                await this.dbService.createReview(review);
                reviewCount++;
            }
        }
        console.log(`✅ Seeded ${reviewCount} reviews`);
    }

    async run(): Promise<void> {
        try {
            console.log('🚀 Starting MongoDB database seeding...');

            await this.dbService.initialize();

            // Clear existing data (optional - comment out if you want to keep existing data)
            // await this.clearCollections();

            await this.seedCategories();
            await this.seedSuppliers();
            await this.seedProducts();
            await this.seedReviews();

            console.log('🎉 Database seeding completed successfully!');
            console.log('📊 Database now contains:');
            console.log('   - Categories with subcategories');
            console.log('   - Verified suppliers');
            console.log('   - Realistic products with pricing');
            console.log('   - Customer reviews');

        } catch (error) {
            console.error('❌ Seeding failed:', error);
            throw error;
        } finally {
            await this.dbService.close();
        }
    }

    async clearCollections(): Promise<void> {
        console.log('🗑️ Clearing existing collections...');
        // This would clear all data - use with caution
        // await this.dbService.clearAllCollections();
    }
}

async function main() {
    const seeder = new MongoDBSeeder();
    await seeder.run();
}

if (require.main === module) {
    main().catch(console.error);
}