require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function initializeDb() {
    const url = process.env.DATABASE_URL;
    const sqlPath = path.join(__dirname, '../prisma/init.sql');

    if (!fs.existsSync(sqlPath)) {
        console.error('❌ init.sql not found at:', sqlPath);
        process.exit(1);
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('📖 Loaded init.sql (' + sql.length + ' bytes)');

    const client = new Client({
        connectionString: url,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('⏳ Connecting to Supabase via manual driver...');
        await client.connect();
        console.log('✅ Connected!');

        console.log('⏳ Executing schema creation... (This may take a moment)');
        // Split by semicolons for cleaner execution, though pg handles multi-statements in query()
        await client.query(sql);
        console.log('✅ Schema created successfully!');

    } catch (err) {
        console.error('❌ Initialization failed:');
        console.error(err.message);
    } finally {
        await client.end();
    }
}

initializeDb();
