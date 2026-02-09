require('dotenv').config();
const { Client } = require('pg');

async function testConnection() {
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error('❌ DATABASE_URL is not set in .env');
        process.exit(1);
    }

    try {
        const parsed = new URL(url.replace('postgresql://', 'http://')); // URL parser trick
        console.log('🔍 URI Components:');
        console.log('   - Host:', parsed.hostname);
        console.log('   - Port:', parsed.port);
        console.log('   - Path (DB Name):', parsed.pathname);
        console.log('   - Search (Options):', parsed.search);

        if (!parsed.search.includes('?')) {
            console.warn('⚠️  Warning: No "?" found in connection string. Options might be seen as part of the DB name.');
        }
    } catch (e) {
        console.error('❌ Failed to parse DATABASE_URL. Check for special characters in password.');
    }

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
