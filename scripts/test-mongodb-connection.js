#!/usr/bin/env node

const { MongoClient } = require('mongodb');

async function testMongoDBConnection() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/midostore';

    console.log('🔍 Testing MongoDB connection...');
    console.log(`📡 Connection URI: ${uri}`);

    try {
        const client = new MongoClient(uri);

        console.log('🔄 Connecting to MongoDB...');
        await client.connect();

        console.log('✅ Successfully connected to MongoDB!');

        // Test database operations
        const db = client.db();
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

        // Test basic operations
        console.log('\n🧪 Testing basic operations...');

        // Test insert
        const testCollection = db.collection('connection_test');
        const insertResult = await testCollection.insertOne({
            test: true,
            timestamp: new Date(),
            message: 'Connection test successful'
        });
        console.log(`   ✅ Insert test: ${insertResult.acknowledged ? 'PASSED' : 'FAILED'}`);

        // Test find
        const findResult = await testCollection.findOne({ test: true });
        console.log(`   ✅ Find test: ${findResult ? 'PASSED' : 'FAILED'}`);

        // Test update
        const updateResult = await testCollection.updateOne(
            { test: true },
            { $set: { updated: true } }
        );
        console.log(`   ✅ Update test: ${updateResult.modifiedCount > 0 ? 'PASSED' : 'FAILED'}`);

        // Test delete
        const deleteResult = await testCollection.deleteOne({ test: true });
        console.log(`   ✅ Delete test: ${deleteResult.deletedCount > 0 ? 'PASSED' : 'FAILED'}`);

        // Test aggregation
        const aggregateResult = await testCollection.aggregate([
            { $match: { test: true } },
            { $count: 'total' }
        ]).toArray();
        console.log(`   ✅ Aggregation test: ${Array.isArray(aggregateResult) ? 'PASSED' : 'FAILED'}`);

        console.log('\n🎉 All MongoDB operations tested successfully!');

        await client.close();
        console.log('🔌 Connection closed.');

    } catch (error) {
        console.error('❌ MongoDB connection test failed:');
        console.error('   Error:', error.message);

        if (error.message.includes('ECONNREFUSED')) {
            console.log('\n💡 Troubleshooting tips:');
            console.log('   1. Make sure MongoDB is running: sudo systemctl status mongodb');
            console.log('   2. Start MongoDB: sudo systemctl start mongodb');
            console.log('   3. Check if MongoDB is listening on port 27017: netstat -tlnp | grep 27017');
        } else if (error.message.includes('authentication')) {
            console.log('\n💡 Authentication issue detected:');
            console.log('   1. Check your MongoDB credentials');
            console.log('   2. Verify the connection string format');
            console.log('   3. Ensure the user has proper permissions');
        }

        process.exit(1);
    }
}

// Run the test
testMongoDBConnection();