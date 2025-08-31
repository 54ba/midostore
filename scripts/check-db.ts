#!/usr/bin/env tsx

import MongoDBService from '../src/lib/mongodb-service';

async function checkDatabase() {
    try {
        console.log('🔍 Checking MongoDB database contents...');
        const dbService = MongoDBService.getInstance();

        // Initialize the service
        await dbService.initialize();

        // Check products
        console.log('\n📦 Checking products...');
        const products = await dbService.getProducts(10);
        console.log(`Found ${products.length} products`);
        if (products.length > 0) {
            console.log('First product:', JSON.stringify(products[0], null, 2));
        }

        // Check categories
        console.log('\n📂 Checking categories...');
        const categories = await dbService.getCategories();
        console.log(`Found ${categories.length} categories`);
        if (categories.length > 0) {
            console.log('First category:', JSON.stringify(categories[0], null, 2));
        }

        // Check suppliers
        console.log('\n🏢 Checking suppliers...');
        const suppliers = await dbService.getSuppliers();
        console.log(`Found ${suppliers.length} suppliers`);
        if (suppliers.length > 0) {
            console.log('First supplier:', JSON.stringify(suppliers[0], null, 2));
        }

        // Check users
        console.log('\n👥 Checking users...');
        try {
            const users = await dbService.getAllUsers();
            console.log(`Found ${users.length} users`);
            if (users.length > 0) {
                console.log('First user:', JSON.stringify(users[0], null, 2));
            }
        } catch (error) {
            console.log('Could not get users:', error.message);
        }

        console.log('\n✅ Database check completed!');

    } catch (error) {
        console.error('❌ Failed to check database:', error);
    } finally {
        await dbService.close();
    }
}

checkDatabase();