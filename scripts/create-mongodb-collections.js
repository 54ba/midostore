#!/usr/bin/env node

const { MongoClient } = require('mongodb');

async function createCollections() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/midostore';

    console.log('🔍 Creating MongoDB collections for Multi-Seller Dropshipping System...');
    console.log(`📡 Connection URI: ${uri}`);

    try {
        const client = new MongoClient(uri);

        console.log('🔄 Connecting to MongoDB...');
        await client.connect();

        console.log('✅ Successfully connected to MongoDB!');

        const db = client.db('midostore');

        // Create collections for the new multi-seller system
        console.log('📁 Creating collections...');

        // Core collections
        await db.createCollection('baseProducts');
        console.log('   ✅ baseProducts collection created');

        await db.createCollection('sellerProducts');
        console.log('   ✅ sellerProducts collection created');

        await db.createCollection('sellers');
        console.log('   ✅ sellers collection created');

        await db.createCollection('sellerAnalytics');
        console.log('   ✅ sellerAnalytics collection created');

        await db.createCollection('sellerOrders');
        console.log('   ✅ sellerOrders collection created');

        await db.createCollection('sellerOrderItems');
        console.log('   ✅ sellerOrderItems collection created');

        await db.createCollection('sellerProductReviews');
        console.log('   ✅ sellerProductReviews collection created');

        // Legacy collections (for backward compatibility)
        await db.createCollection('products');
        console.log('   ✅ products collection created (legacy)');

        await db.createCollection('reviews');
        console.log('   ✅ reviews collection created (legacy)');

        await db.createCollection('suppliers');
        console.log('   ✅ suppliers collection created');

        await db.createCollection('orders');
        console.log('   ✅ orders collection created (legacy)');

        await db.createCollection('orderItems');
        console.log('   ✅ orderItems collection created (legacy)');

        await db.createCollection('users');
        console.log('   ✅ users collection created');

        await db.createCollection('userInteractions');
        console.log('   ✅ userInteractions collection created');

        await db.createCollection('userPreferences');
        console.log('   ✅ userPreferences collection created');

        // Other collections
        await db.createCollection('baseProductVariants');
        console.log('   ✅ baseProductVariants collection created');

        await db.createCollection('baseProductLocalizations');
        console.log('   ✅ baseProductLocalizations collection created');

        await db.createCollection('exchangeRates');
        console.log('   ✅ exchangeRates collection created');

        await db.createCollection('scrapingJobs');
        console.log('   ✅ scrapingJobs collection created');

        await db.createCollection('gulfCountries');
        console.log('   ✅ gulfCountries collection created');

        await db.createCollection('trendData');
        console.log('   ✅ trendData collection created');

        // Create indexes for better performance
        console.log('📊 Creating indexes...');

        // Base Products indexes
        await db.collection('baseProducts').createIndex({ 'source': 1, 'externalId': 1 });
        console.log('   ✅ baseProducts source+externalId index created');

        await db.collection('baseProducts').createIndex({ 'category': 1, 'isActive': 1 });
        console.log('   ✅ baseProducts category+isActive index created');

        await db.collection('baseProducts').createIndex({ 'isFeatured': 1 });
        console.log('   ✅ baseProducts isFeatured index created');

        // Seller Products indexes
        await db.collection('sellerProducts').createIndex({ 'sellerId': 1, 'isActive': 1 });
        console.log('   ✅ sellerProducts sellerId+isActive index created');

        await db.collection('sellerProducts').createIndex({ 'baseProductId': 1 });
        console.log('   ✅ sellerProducts baseProductId index created');

        await db.collection('sellerProducts').createIndex({ 'isFeatured': 1 });
        console.log('   ✅ sellerProducts isFeatured index created');

        // Sellers indexes
        await db.collection('sellers').createIndex({ 'isActive': 1, 'isVerified': 1 });
        console.log('   ✅ sellers isActive+isVerified index created');

        await db.collection('sellers').createIndex({ 'businessName': 1 });
        console.log('   ✅ sellers businessName index created');

        // Seller Analytics indexes
        await db.collection('sellerAnalytics').createIndex({ 'sellerId': 1, 'period': 1 });
        console.log('   ✅ sellerAnalytics sellerId+period index created');

        // Seller Orders indexes
        await db.collection('sellerOrders').createIndex({ 'sellerId': 1, 'status': 1 });
        console.log('   ✅ sellerOrders sellerId+status index created');

        await db.collection('sellerOrders').createIndex({ 'customerId': 1, 'status': 1 });
        console.log('   ✅ sellerOrders customerId+status index created');

        await db.collection('sellerOrders').createIndex({ 'orderNumber': 1 });
        console.log('   ✅ sellerOrders orderNumber index created');

        // Users indexes
        await db.collection('users').createIndex({ 'userType': 1 });
        console.log('   ✅ users userType index created');

        await db.collection('users').createIndex({ 'email': 1 });
        console.log('   ✅ users email index created');

        // User Interactions indexes
        await db.collection('userInteractions').createIndex({ 'userId': 1, 'baseProductId': 1, 'type': 1 });
        console.log('   ✅ userInteractions userId+baseProductId+type index created');

        // Reviews indexes
        await db.collection('reviews').createIndex({ 'baseProductId': 1 });
        console.log('   ✅ reviews baseProductId index created');

        await db.collection('reviews').createIndex({ 'rating': 1 });
        console.log('   ✅ reviews rating index created');

        // Legacy indexes (for backward compatibility)
        await db.collection('products').createIndex({ 'source': 1, 'externalId': 1 });
        console.log('   ✅ products source+externalId index created (legacy)');

        await db.collection('orders').createIndex({ 'userId': 1 });
        console.log('   ✅ orders userId index created (legacy)');

        await db.collection('orders').createIndex({ 'status': 1 });
        console.log('   ✅ orders status index created (legacy)');

        // Exchange Rates indexes
        await db.collection('exchangeRates').createIndex({ 'fromCurrency': 1, 'toCurrency': 1 });
        console.log('   ✅ exchangeRates fromCurrency+toCurrency index created');

        // Show collections
        const collections = await db.listCollections().toArray();
        console.log('\n📊 Database Information:');
        console.log(`   Database Name: ${db.databaseName}`);
        console.log(`   Collections: ${collections.length}`);

        if (collections.length > 0) {
            console.log('\n📁 Available Collections:');
            collections.forEach(collection => {
                console.log(`   - ${collection.name}`);
            });
        }

        console.log('\n🎉 Multi-Seller Dropshipping System setup completed successfully!');
        console.log('\n📋 System Overview:');
        console.log('   • Base Products: External products from Alibaba/AliExpress');
        console.log('   • Seller Products: Customized versions with pricing and commission');
        console.log('   • Sellers: Dropshipping businesses with analytics');
        console.log('   • Users: Both buyers and sellers with different dashboards');
        console.log('   • Orders: Seller-specific order management');
        console.log('   • Analytics: Performance tracking for sellers');

        await client.close();
        console.log('🔌 Connection closed.');

    } catch (error) {
        console.error('❌ MongoDB setup failed:');
        console.error('   Error:', error.message);
        process.exit(1);
    }
}

// Run the setup
createCollections();