require('dotenv').config();
const { Client } = require('pg');

async function testConnection() {
    const url = process.env.DATABASE_URL;
    console.log('🔍 Testing connection to:', url ? url.split('@')[1] : 'UNDEFINED');

    const client = new Client({
        connectionString: url,
        ssl: {
            rejectUnauthorized: false
        },
        connectionTimeoutMillis: 10000,
    });

    try {
        console.log('⏳ Attempting to connect...');
        await client.connect();
        console.log('✅ Success! Connected to database.');

        const res = await client.query('SELECT NOW()');
        console.log('📊 Database time:', res.rows[0].now);

        await client.end();
    } catch (err) {
        console.error('❌ Connection failed:');
        console.error(err.message);
        if (err.message.includes('timeout')) {
            console.log('💡 Tip: This looks like a network timeout or firewall blockage.');
        } else if (err.message.includes('SSL')) {
            console.log('💡 Tip: This looks like an SSL handshake issue.');
        }
        process.exit(1);
    }
}

testConnection();
