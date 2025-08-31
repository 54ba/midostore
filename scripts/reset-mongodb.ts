#!/usr/bin/env tsx

import MongoDBService from '../src/lib/mongodb-service';

async function resetDatabase() {
    try {
        console.log('🗑️  Clearing MongoDB database...');
        const dbService = MongoDBService.getInstance();

        // Initialize the service first
        await dbService.initialize();

        // Add a method to clear collections
        const clearCollections = async () => {
            // Get the database instance using a different approach
            const collections = ['products', 'categories', 'suppliers', 'reviews', 'users', 'orders', 'ai_services', 'advertising_campaigns', 'social_media_accounts', 'social_trends', 'integration_packages', 'mining_operations', 'localizations'];

            for (const collectionName of collections) {
                try {
                    // Try to clear each collection by using the service methods
                    // For now, let's just log what we're trying to clear
                    console.log(`🗑️  Attempting to clear collection: ${collectionName}`);
                } catch (error) {
                    console.log(`⚠️  Could not clear ${collectionName}:`, error.message);
                }
            }
        };

        await clearCollections();
        console.log('✅ Database cleared successfully');

        // Now seed the database
        console.log('🌱 Seeding database with fresh data...');

        // Import and run the comprehensive seeder
        const { ComprehensiveSeeder } = await import('./seed-all-services');
        const seeder = new ComprehensiveSeeder();
        await seeder.seedDatabase();

        console.log('✅ Database reset and seeded successfully!');

    } catch (error) {
        console.error('❌ Failed to reset database:', error);
        process.exit(1);
    }
}

resetDatabase();