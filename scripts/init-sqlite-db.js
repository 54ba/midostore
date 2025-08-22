#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

console.log('🗄️ Initializing SQLite database for MidoStore...');

// Database file path
const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
const dbDir = path.dirname(dbPath);

// Create prisma directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('✅ Created prisma directory');
}

// Initialize database
const db = new sqlite3.Database(dbPath);

// Create tables based on Prisma schema
const createTables = `
-- Products table
CREATE TABLE IF NOT EXISTS Product (
    id TEXT PRIMARY KEY,
    externalId TEXT UNIQUE,
    source TEXT,
    title TEXT,
    description TEXT,
    price REAL,
    originalPrice REAL,
    currency TEXT DEFAULT 'USD',
    images TEXT,
    category TEXT,
    subcategory TEXT,
    tags TEXT,
    rating REAL,
    reviewCount INTEGER DEFAULT 0,
    soldCount INTEGER DEFAULT 0,
    minOrderQuantity INTEGER DEFAULT 1,
    maxOrderQuantity INTEGER,
    shippingWeight REAL,
    shippingDimensions TEXT,
    supplierId TEXT,
    profitMargin REAL,
    gulfPrice REAL,
    gulfCurrency TEXT DEFAULT 'AED',
    createdAt TEXT,
    updatedAt TEXT,
    lastScraped TEXT,
    isActive INTEGER DEFAULT 1,
    isFeatured INTEGER DEFAULT 0
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS Supplier (
    id TEXT PRIMARY KEY,
    externalId TEXT UNIQUE,
    source TEXT,
    name TEXT,
    companyName TEXT,
    country TEXT,
    city TEXT,
    rating REAL,
    responseRate REAL,
    responseTime TEXT,
    verified INTEGER DEFAULT 0,
    goldMember INTEGER DEFAULT 0,
    createdAt TEXT,
    updatedAt TEXT
);

-- Reviews table
CREATE TABLE IF NOT EXISTS Review (
    id TEXT PRIMARY KEY,
    productId TEXT,
    reviewerName TEXT,
    rating INTEGER,
    title TEXT,
    content TEXT,
    helpful INTEGER DEFAULT 0,
    verified INTEGER DEFAULT 0,
    source TEXT,
    externalId TEXT,
    createdAt TEXT,
    updatedAt TEXT
);

-- Users table
CREATE TABLE IF NOT EXISTS User (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE,
    email TEXT UNIQUE,
    full_name TEXT,
    phone TEXT,
    created_at TEXT,
    updated_at TEXT
);

-- Gulf Countries table
CREATE TABLE IF NOT EXISTS GulfCountry (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE,
    name TEXT,
    nameAr TEXT,
    currency TEXT,
    currencyAr TEXT,
    timezone TEXT,
    locale TEXT,
    isActive INTEGER DEFAULT 1,
    createdAt TEXT,
    updatedAt TEXT
);

-- Exchange Rates table
CREATE TABLE IF NOT EXISTS ExchangeRate (
    id TEXT PRIMARY KEY,
    fromCurrency TEXT,
    toCurrency TEXT,
    rate REAL,
    lastUpdated TEXT,
    source TEXT,
    UNIQUE(fromCurrency, toCurrency)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_product_source ON Product(source);
CREATE INDEX IF NOT EXISTS idx_product_category ON Product(category);
CREATE INDEX IF NOT EXISTS idx_product_featured ON Product(isFeatured);
CREATE INDEX IF NOT EXISTS idx_supplier_source ON Supplier(source);
CREATE INDEX IF NOT EXISTS idx_review_product ON Review(productId);
CREATE INDEX IF NOT EXISTS idx_exchange_rate_currencies ON ExchangeRate(fromCurrency, toCurrency);
`;

db.serialize(() => {
    console.log('📋 Creating database tables...');

    // Split SQL into individual statements
    const statements = createTables.split(';').filter(stmt => stmt.trim());

    statements.forEach((statement, index) => {
        if (statement.trim()) {
            db.run(statement + ';', (err) => {
                if (err) {
                    console.log(`⚠️ Statement ${index + 1}:`, err.message);
                }
            });
        }
    });

    console.log('✅ Database tables created successfully');

    // Insert sample data
    console.log('🌱 Inserting sample data...');

    // Insert Gulf Countries
    const gulfCountries = [
        ['AE', 'United Arab Emirates', 'الإمارات العربية المتحدة', 'AED', 'درهم إماراتي', 'Asia/Dubai', 'ar-AE'],
        ['SA', 'Saudi Arabia', 'المملكة العربية السعودية', 'SAR', 'ريال سعودي', 'Asia/Riyadh', 'ar-SA'],
        ['KW', 'Kuwait', 'الكويت', 'KWD', 'دينار كويتي', 'Asia/Kuwait', 'ar-KW'],
        ['QA', 'Qatar', 'قطر', 'QAR', 'ريال قطري', 'Asia/Qatar', 'ar-QA'],
        ['BH', 'Bahrain', 'البحرين', 'BHD', 'دينار بحريني', 'Asia/Bahrain', 'ar-BH'],
        ['OM', 'Oman', 'عُمان', 'OMR', 'ريال عماني', 'Asia/Muscat', 'ar-OM']
    ];

    const insertCountry = db.prepare('INSERT OR REPLACE INTO GulfCountry (code, name, nameAr, currency, currencyAr, timezone, locale, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))');

    gulfCountries.forEach(country => {
        insertCountry.run(country);
    });

    insertCountry.finalize();
    console.log('✅ Gulf countries inserted');

    // Insert sample supplier
    const supplier = db.prepare('INSERT OR REPLACE INTO Supplier (id, externalId, source, name, companyName, country, city, rating, responseRate, responseTime, verified, goldMember, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))');
    supplier.run('supplier-1', 'SUP001', 'alibaba', 'TechPro Solutions', 'TechPro Solutions Ltd.', 'China', 'Shenzhen', 4.8, 98, '2-4 hours', 1, 1);
    supplier.finalize();
    console.log('✅ Sample supplier inserted');

    // Insert sample products
    const products = [
        ['prod-1', 'ALI001', 'alibaba', 'Wireless Bluetooth Headphones Pro', 'High-quality wireless headphones with noise cancellation and long battery life', 89.99, 149.99, 'USD', '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop"]', 'Electronics', 'Audio', '["tech", "digital", "modern", "wireless", "smart"]', 4.8, 156, 2340, 1, 1000, 0.5, '15x10x5cm', 'supplier-1', 25, 329.99, 'AED'],
        ['prod-2', 'ALI002', 'alibaba', 'Smart Fitness Watch Series 5', 'Advanced fitness tracker with heart rate monitoring and GPS', 199.99, 299.99, 'USD', '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop"]', 'Electronics', 'Wearables', '["tech", "fitness", "health", "smart", "tracking"]', 4.7, 89, 1234, 1, 500, 0.3, '12x8x2cm', 'supplier-1', 30, 734.99, 'AED']
    ];

    const insertProduct = db.prepare('INSERT OR REPLACE INTO Product (id, externalId, source, title, description, price, originalPrice, currency, images, category, subcategory, tags, rating, reviewCount, soldCount, minOrderQuantity, maxOrderQuantity, shippingWeight, shippingDimensions, supplierId, profitMargin, gulfPrice, gulfCurrency, createdAt, updatedAt, lastScraped, isActive, isFeatured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"), datetime("now"), 1, 1)');

    products.forEach(product => {
        insertProduct.run(product);
    });

    insertProduct.finalize();
    console.log('✅ Sample products inserted');

    // Insert sample reviews
    const reviews = [
        ['review-1', 'prod-1', 'Ahmed Ali', 5, 'Excellent Quality!', 'These headphones are amazing! Great sound quality and battery life.', 12, 1, 'generated', 'REV001'],
        ['review-2', 'prod-2', 'Sarah Johnson', 4, 'Great Fitness Tracker', 'Very accurate tracking and comfortable to wear. Battery could be better.', 8, 1, 'generated', 'REV002']
    ];

    const insertReview = db.prepare('INSERT OR REPLACE INTO Review (id, productId, reviewerName, rating, title, content, helpful, verified, source, externalId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))');

    reviews.forEach(review => {
        insertReview.run(review);
    });

    insertReview.finalize();
    console.log('✅ Sample reviews inserted');

    // Insert exchange rates
    const rates = [
        ['USD', 'AED', 3.67, 'mock-api'],
        ['USD', 'SAR', 3.75, 'mock-api'],
        ['USD', 'KWD', 0.31, 'mock-api']
    ];

    const insertRate = db.prepare('INSERT OR REPLACE INTO ExchangeRate (fromCurrency, toCurrency, rate, source, lastUpdated) VALUES (?, ?, ?, ?, datetime("now"))');

    rates.forEach(rate => {
        insertRate.run(rate);
    });

    insertRate.finalize();
    console.log('✅ Exchange rates inserted');

    // Insert sample user
    const user = db.prepare('INSERT OR REPLACE INTO User (id, user_id, email, full_name, phone, created_at, updated_at) VALUES (?, ?, ?, ?, ?, datetime("now"), datetime("now"))');
    user.run('user-1', 'user_001', 'demo@midostore.com', 'Demo User', '+971501234567');
    user.finalize();
    console.log('✅ Sample user inserted');

    console.log('\n🎉 Database initialization completed!');
    console.log(`🗄️ Database file: ${dbPath}`);
    console.log('📊 You can now run the application with real data');

    db.close();
});