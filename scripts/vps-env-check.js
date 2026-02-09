#!/usr/bin/env node

const required = [
    'DATABASE_URL',
    'MONGODB_URI',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'BYBIT_API_KEY',
    'BYBIT_API_SECRET'
];

console.log('--- VPS Environment Health Check ---');
const missing = [];

required.forEach(v => {
    if (!process.env[v]) {
        missing.push(v);
        console.log(`❌ ${v} is MISSING`);
    } else {
        console.log(`✅ ${v} is set`);
    }
});

if (missing.length > 0) {
    console.log('\nCritical setup required. Please update your .env file.');
    process.exit(1);
} else {
    console.log('\nAll critical environment variables are set. Ready for deployment!');
}
