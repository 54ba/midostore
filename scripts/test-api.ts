#!/usr/bin/env tsx

import MongoDBService from '../src/lib/mongodb-service';

async function testAPI() {
    try {
        console.log('🧪 Testing MongoDB service methods...');
        const dbService = MongoDBService.getInstance();

        // Initialize the service
        await dbService.initialize();

        // Test getProducts method
        console.log('\n📦 Testing getProducts method...');
        const products = await dbService.getProducts(10, 0);
        console.log(`getProducts returned ${products.length} products`);

        if (products.length > 0) {
            console.log('First product isActive:', products[0].isActive, typeof products[0].isActive);
            console.log('First product category:', products[0].category);
        }

        // Test getCategories method
        console.log('\n📂 Testing getCategories method...');
        const categories = await dbService.getCategories();
        console.log(`getCategories returned ${categories.length} categories`);

        if (categories.length > 0) {
            console.log('First category isActive:', categories[0].isActive, typeof categories[0].isActive);
        }

        console.log('\n✅ API test completed!');

    } catch (error) {
        console.error('❌ API test failed:', error);
    } finally {
        await dbService.close();
    }
}

testAPI();