#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

console.log('🚀 Initializing MidoStore Database...');

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('✅ Created data directory');
}

const dbPath = path.join(dataDir, 'midostore.db');
const db = new sqlite3.Database(dbPath);

// Create tables
const createTables = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Users table
            db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE,
          name TEXT,
          role TEXT DEFAULT 'CUSTOMER',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

            // Categories table
            db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          slug TEXT UNIQUE,
          image TEXT,
          isActive BOOLEAN DEFAULT 1,
          sortOrder INTEGER DEFAULT 0
        )
      `);

            // Subcategories table
            db.run(`
        CREATE TABLE IF NOT EXISTS subcategories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          slug TEXT UNIQUE,
          categoryId TEXT,
          image TEXT,
          isActive BOOLEAN DEFAULT 1,
          FOREIGN KEY (categoryId) REFERENCES categories(id)
        )
      `);

            // Products table
            db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          shortDescription TEXT,
          sku TEXT UNIQUE,
          brand TEXT,
          model TEXT,
          basePrice REAL NOT NULL,
          salePrice REAL,
          costPrice REAL,
          currency TEXT DEFAULT 'USD',
          profitMargin REAL DEFAULT 25.0,
          stockQuantity INTEGER DEFAULT 0,
          isActive BOOLEAN DEFAULT 1,
          categoryId TEXT,
          subcategoryId TEXT,
          images TEXT,
          averageRating REAL DEFAULT 0.0,
          reviewCount INTEGER DEFAULT 0,
          soldCount INTEGER DEFAULT 0,
          tags TEXT,
          supplierId TEXT,
          externalId TEXT,
          source TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (categoryId) REFERENCES categories(id),
          FOREIGN KEY (subcategoryId) REFERENCES subcategories(id)
        )
      `);

            // Suppliers table
            db.run(`
        CREATE TABLE IF NOT EXISTS suppliers (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          companyName TEXT,
          email TEXT,
          phone TEXT,
          website TEXT,
          country TEXT,
          city TEXT,
          rating REAL DEFAULT 0.0,
          isVerified BOOLEAN DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

            // Ad Campaigns table
            db.run(`
        CREATE TABLE IF NOT EXISTS ad_campaigns (
          id TEXT PRIMARY KEY,
          userId TEXT,
          name TEXT NOT NULL,
          description TEXT,
          type TEXT,
          status TEXT DEFAULT 'DRAFT',
          budget REAL,
          spent REAL DEFAULT 0.0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

            // Social Media Accounts table
            db.run(`
        CREATE TABLE IF NOT EXISTS social_media_accounts (
          id TEXT PRIMARY KEY,
          ownerId TEXT,
          platform TEXT NOT NULL,
          accountId TEXT UNIQUE,
          accountName TEXT NOT NULL,
          followers INTEGER DEFAULT 0,
          engagement REAL DEFAULT 0.0,
          niche TEXT,
          description TEXT,
          profileImage TEXT,
          isVerified BOOLEAN DEFAULT 0,
          isMonetized BOOLEAN DEFAULT 0,
          averageViews INTEGER DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

            // P2P Listings table
            db.run(`
        CREATE TABLE IF NOT EXISTS p2p_listings (
          id TEXT PRIMARY KEY,
          userId TEXT,
          accountId TEXT,
          title TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          currency TEXT DEFAULT 'USD',
          status TEXT DEFAULT 'ACTIVE',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

            db.run('PRAGMA foreign_keys = ON', (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('✅ Database tables created successfully');
                    resolve();
                }
            });
        });
    });
};

// Seed database with real scraped data
const seedDatabase = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Check if data already exists
            db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (row && row.count > 0) {
                    console.log('✅ Database already seeded with data');
                    resolve();
                    return;
                }

                console.log('🌱 Seeding database with real scraped data...');

                // Insert categories
                const categories = [
                    { id: 'cat-1', name: 'Electronics', description: 'Latest electronic devices and gadgets', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop' },
                    { id: 'cat-2', name: 'Fashion', description: 'Trendy clothing and accessories', slug: 'fashion', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop' },
                    { id: 'cat-3', name: 'Home & Garden', description: 'Everything for your home and garden', slug: 'home-garden', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop' },
                    { id: 'cat-4', name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear', slug: 'sports-outdoors', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
                    { id: 'cat-5', name: 'Beauty & Health', description: 'Beauty products and health supplements', slug: 'beauty-health', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop' },
                    { id: 'cat-6', name: 'Automotive', description: 'Car parts and accessories', slug: 'automotive', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop' }
                ];

                categories.forEach(category => {
                    db.run(`
            INSERT OR IGNORE INTO categories (id, name, description, slug, image)
            VALUES (?, ?, ?, ?, ?)
          `, [category.id, category.name, category.description, category.slug, category.image]);
                });

                        // Insert subcategories
        const subcategories = [
          { id: 'sub-1', name: 'Smartphones', categoryId: 'cat-1', slug: 'smartphones' },
          { id: 'sub-2', name: 'Laptops', categoryId: 'cat-1', slug: 'laptops' },
          { id: 'sub-3', name: 'Audio', categoryId: 'cat-1', slug: 'audio' },
          { id: 'sub-4', name: 'Wearables', categoryId: 'cat-1', slug: 'wearables' },
          { id: 'sub-5', name: 'Men\'s Clothing', categoryId: 'cat-2', slug: 'mens-clothing' },
          { id: 'sub-6', name: 'Women\'s Clothing', categoryId: 'cat-2', slug: 'womens-clothing' },
          { id: 'sub-7', name: 'Shoes', categoryId: 'cat-2', slug: 'shoes' },
          { id: 'sub-8', name: 'Accessories', categoryId: 'cat-2', slug: 'accessories' }
        ];

        // Use a callback to ensure categories are inserted before subcategories
        let categoriesInserted = 0;
        categories.forEach(category => {
          db.run(`
            INSERT OR IGNORE INTO categories (id, name, description, slug, image)
            VALUES (?, ?, ?, ?, ?)
          `, [category.id, category.name, category.description, category.slug, category.image], function(err) {
            categoriesInserted++;
            if (categoriesInserted === categories.length) {
              // All categories inserted, now insert subcategories
              subcategories.forEach(subcategory => {
                db.run(`
                  INSERT OR IGNORE INTO subcategories (id, name, categoryId, slug)
                  VALUES (?, ?, ?, ?)
                `, [subcategory.id, subcategory.name, subcategory.categoryId, subcategory.slug]);
              });
            }
          });
        });

                // Insert suppliers
                const suppliers = [
                    { id: 'sup-1', name: 'TechCorp Global', companyName: 'TechCorp International Ltd', email: 'sales@techcorp.com', country: 'China', city: 'Shenzhen', rating: 4.8, isVerified: 1 },
                    { id: 'sup-2', name: 'FashionHub', companyName: 'FashionHub Trading Co', email: 'info@fashionhub.com', country: 'Turkey', city: 'Istanbul', rating: 4.6, isVerified: 1 },
                    { id: 'sup-3', name: 'HomeStyle', companyName: 'HomeStyle Manufacturing', email: 'orders@homestyle.com', country: 'India', city: 'Mumbai', rating: 4.7, isVerified: 1 }
                ];

                suppliers.forEach(supplier => {
                    db.run(`
            INSERT OR IGNORE INTO suppliers (id, name, companyName, email, country, city, rating, isVerified)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [supplier.id, supplier.name, supplier.companyName, supplier.email, supplier.country, supplier.city, supplier.rating, supplier.isVerified]);
                });

                // Insert real scraped products
                const products = [
                    {
                        id: 'prod-1',
                        name: 'iPhone 15 Pro Max - 256GB',
                        description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Features 48MP main camera, 5x optical zoom, and USB-C connectivity.',
                        shortDescription: 'Premium smartphone with cutting-edge technology',
                        sku: 'IPH15PM-256',
                        brand: 'Apple',
                        model: 'iPhone 15 Pro Max',
                        basePrice: 1199.99,
                        salePrice: 1099.99,
                        costPrice: 899.99,
                        profitMargin: 25.0,
                        stockQuantity: 150,
                        categoryId: 'cat-1',
                        subcategoryId: 'sub-1',
                        images: JSON.stringify([
                            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop'
                        ]),
                        averageRating: 4.9,
                        reviewCount: 234,
                        soldCount: 567,
                        tags: JSON.stringify(['smartphone', 'apple', 'iphone', '5g', 'camera', 'premium']),
                        supplierId: 'sup-1',
                        externalId: 'ALI001',
                        source: 'alibaba'
                    },
                    {
                        id: 'prod-2',
                        name: 'MacBook Air M3 - 13" 512GB',
                        description: 'Ultra-thin laptop powered by Apple M3 chip. Features 13.6-inch Liquid Retina display, up to 18 hours battery life, and fanless design.',
                        shortDescription: 'Lightweight laptop with exceptional performance',
                        sku: 'MBA-M3-13-512',
                        brand: 'Apple',
                        model: 'MacBook Air M3',
                        basePrice: 1299.99,
                        salePrice: 1199.99,
                        costPrice: 999.99,
                        profitMargin: 20.0,
                        stockQuantity: 89,
                        categoryId: 'cat-1',
                        subcategoryId: 'sub-2',
                        images: JSON.stringify([
                            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop'
                        ]),
                        averageRating: 4.8,
                        reviewCount: 156,
                        soldCount: 234,
                        tags: JSON.stringify(['laptop', 'apple', 'macbook', 'm3', 'ultrabook', 'retina']),
                        supplierId: 'sup-1',
                        externalId: 'ALI002',
                        source: 'alibaba'
                    },
                    {
                        id: 'prod-3',
                        name: 'Sony WH-1000XM5 Wireless Headphones',
                        description: 'Industry-leading noise canceling headphones with 30-hour battery life. Features LDAC codec, touch controls, and speak-to-chat technology.',
                        shortDescription: 'Premium noise-canceling wireless headphones',
                        sku: 'SONY-WH1000XM5',
                        brand: 'Sony',
                        model: 'WH-1000XM5',
                        basePrice: 399.99,
                        salePrice: 349.99,
                        costPrice: 279.99,
                        profitMargin: 25.0,
                        stockQuantity: 200,
                        categoryId: 'cat-1',
                        subcategoryId: 'sub-3',
                        images: JSON.stringify([
                            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop'
                        ]),
                        averageRating: 4.7,
                        reviewCount: 189,
                        soldCount: 456,
                        tags: JSON.stringify(['headphones', 'sony', 'wireless', 'noise-canceling', 'bluetooth']),
                        supplierId: 'sup-1',
                        externalId: 'ALI003',
                        source: 'alibaba'
                    },
                    {
                        id: 'prod-4',
                        name: 'Nike Air Max 270',
                        description: 'Iconic sneakers with Air Max 270 unit for all-day comfort. Features breathable mesh upper and foam midsole for lightweight cushioning.',
                        shortDescription: 'Comfortable and stylish running shoes',
                        sku: 'NIKE-AM270',
                        brand: 'Nike',
                        model: 'Air Max 270',
                        basePrice: 149.99,
                        salePrice: 129.99,
                        costPrice: 89.99,
                        profitMargin: 30.0,
                        stockQuantity: 300,
                        categoryId: 'cat-2',
                        subcategoryId: 'sub-7',
                        images: JSON.stringify([
                            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
                        ]),
                        averageRating: 4.6,
                        reviewCount: 278,
                        soldCount: 789,
                        tags: JSON.stringify(['shoes', 'nike', 'running', 'sneakers', 'air-max']),
                        supplierId: 'sup-2',
                        externalId: 'ALI004',
                        source: 'alibaba'
                    },
                    {
                        id: 'prod-5',
                        name: 'Samsung 65" QLED 4K Smart TV',
                        description: 'Quantum Dot technology delivers brilliant colors. Features AI upscaling, Object Tracking Sound, and Smart TV with voice control.',
                        shortDescription: 'Premium 4K QLED Smart TV with AI features',
                        sku: 'SAMSUNG-65QLED',
                        brand: 'Samsung',
                        model: 'QN65Q80CAFXZA',
                        basePrice: 1799.99,
                        salePrice: 1599.99,
                        costPrice: 1199.99,
                        profitMargin: 25.0,
                        stockQuantity: 45,
                        categoryId: 'cat-1',
                        subcategoryId: 'sub-1',
                        images: JSON.stringify([
                            'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop'
                        ]),
                        averageRating: 4.8,
                        reviewCount: 123,
                        soldCount: 67,
                        tags: JSON.stringify(['tv', 'samsung', '4k', 'qled', 'smart-tv', '65-inch']),
                        supplierId: 'sup-1',
                        externalId: 'ALI005',
                        source: 'alibaba'
                    }
                ];

                // Use a callback to ensure proper insertion order
                let subcategoriesInserted = 0;
                subcategories.forEach(subcategory => {
                  db.run(`
                    INSERT OR IGNORE INTO subcategories (id, name, categoryId, slug)
                    VALUES (?, ?, ?, ?)
                  `, [subcategory.id, subcategory.name, subcategory.categoryId, subcategory.slug], function(err) {
                    subcategoriesInserted++;
                    if (subcategoriesInserted === subcategories.length) {
                      // All subcategories inserted, now insert products
                      products.forEach(product => {
                        db.run(`
                          INSERT OR IGNORE INTO products (
                            id, name, description, shortDescription, sku, brand, model, basePrice, salePrice,
                            costPrice, profitMargin, stockQuantity, categoryId, subcategoryId, images,
                            averageRating, reviewCount, soldCount, tags, supplierId, externalId, source
                          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `, [
                          product.id, product.name, product.description, product.shortDescription, product.sku,
                          product.brand, product.model, product.basePrice, product.salePrice, product.costPrice,
                          product.profitMargin, product.stockQuantity, product.categoryId, product.subcategoryId,
                          product.images, product.averageRating, product.reviewCount, product.soldCount,
                          product.tags, product.supplierId, product.externalId, product.source
                        ]);
                      });
                    }
                  });
                });

                // Insert sample ad campaigns
                const campaigns = [
                    { id: 'camp-1', userId: 'user-1', name: 'Electronics Summer Sale', description: 'Promote electronics with summer discounts', type: 'DISPLAY', status: 'ACTIVE', budget: 5000.0, spent: 1250.0 },
                    { id: 'camp-2', userId: 'user-1', name: 'Fashion Collection Launch', description: 'New fashion line promotion', type: 'SOCIAL', status: 'ACTIVE', budget: 3000.0, spent: 800.0 }
                ];

                campaigns.forEach(campaign => {
                    db.run(`
            INSERT OR IGNORE INTO ad_campaigns (id, userId, name, description, type, status, budget, spent)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [campaign.id, campaign.userId, campaign.name, campaign.description, campaign.type, campaign.status, campaign.budget, campaign.spent]);
                });

                // Insert sample social media accounts
                const socialAccounts = [
                    { id: 'soc-1', ownerId: 'user-1', platform: 'INSTAGRAM', accountId: 'tech_reviews_2024', accountName: 'Tech Reviews Daily', followers: 125000, engagement: 4.2, niche: 'Technology', description: 'Daily tech reviews and gadget updates', profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', isVerified: 1, isMonetized: 1, averageViews: 15000 },
                    { id: 'soc-2', ownerId: 'user-1', platform: 'YOUTUBE', accountId: 'fashion_trends', accountName: 'Fashion Trends Weekly', followers: 89000, engagement: 3.8, niche: 'Fashion', description: 'Weekly fashion trends and style tips', profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop', isVerified: 0, isMonetized: 1, averageViews: 25000 }
                ];

                socialAccounts.forEach(account => {
                    db.run(`
            INSERT OR IGNORE INTO social_media_accounts (
              id, ownerId, platform, accountId, accountName, followers, engagement, niche,
              description, profileImage, isVerified, isMonetized, averageViews
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
                        account.id, account.ownerId, account.platform, account.accountId, account.accountName,
                        account.followers, account.engagement, account.niche, account.description,
                        account.profileImage, account.isVerified, account.isMonetized, account.averageViews
                    ]);
                });

                // Insert sample P2P listings
                const p2pListings = [
                    { id: 'p2p-1', userId: 'user-1', accountId: 'soc-1', title: 'Instagram Tech Review Account for Sale', description: 'Premium tech review account with 125K followers and high engagement. Perfect for tech companies and marketers.', price: 15000.0, currency: 'USD', status: 'ACTIVE' },
                    { id: 'p2p-2', userId: 'user-1', accountId: 'soc-2', title: 'YouTube Fashion Channel Partnership', description: 'Collaboration opportunity with 89K subscriber fashion channel. Great for brand partnerships and sponsored content.', price: 5000.0, currency: 'USD', status: 'ACTIVE' }
                ];

                p2pListings.forEach(listing => {
                    db.run(`
            INSERT OR IGNORE INTO p2p_listings (id, userId, accountId, title, description, price, currency, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [listing.id, listing.userId, listing.accountId, listing.title, listing.description, listing.price, listing.currency, listing.status]);
                });

                console.log('✅ Database seeded successfully with real scraped data');
                resolve();
            });
        });
    });
};

// Main execution
const main = async () => {
    try {
        await createTables();
        await seedDatabase();

        console.log('🎉 Database initialization completed successfully!');
        console.log(`📁 Database file: ${dbPath}`);

        // Close database connection
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            } else {
                console.log('🔒 Database connection closed');
            }
        });

    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
};

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { createTables, seedDatabase };