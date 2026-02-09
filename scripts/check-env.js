/**
 * Environment Variable Check Script for Netlify
 * Ensures all required environment variables are set before building
 */

require('dotenv').config();

const requiredEnvVars = [
    'DATABASE_URL',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY'
];

const optionalEnvVars = [
    'EXCHANGE_RATE_API_KEY',
    'FIXER_API_KEY',
    'CURRENCY_API_KEY',
    'OPEN_EXCHANGE_RATES_API_KEY',
    'CURRENCY_LAYER_API_KEY',
    'AI_MODEL_PATH',
    'ENABLE_AI_TRAINING'
];

function checkEnvironment() {
    console.log('🔍 Checking environment variables...');

    const missing = [];
    const warnings = [];

    // Check required environment variables
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            missing.push(envVar);
        } else {
            console.log(`✅ ${envVar}: ${process.env[envVar].substring(0, 20)}...`);
        }
    }

    // Check optional environment variables
    for (const envVar of optionalEnvVars) {
        if (!process.env[envVar]) {
            warnings.push(envVar);
        } else {
            console.log(`✅ ${envVar}: ${process.env[envVar].substring(0, 20)}...`);
        }
    }

    // Report results
    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:');
        missing.forEach(envVar => console.error(`   - ${envVar}`));
        console.error('\nPlease set these variables in your Netlify dashboard.');
        process.exit(1);
    }

    if (warnings.length > 0) {
        console.warn('⚠️  Missing optional environment variables:');
        warnings.forEach(envVar => console.warn(`   - ${envVar}`));
        console.warn('\nThese are optional but recommended for full functionality.');
    }

    // Check build environment
    console.log('\n🏗️  Build Environment:');
    console.log(`   - NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   - NODE_VERSION: ${process.env.NODE_VERSION || 'unknown'}`);
    console.log(`   - NPM_VERSION: ${process.env.NPM_VERSION || 'unknown'}`);
    console.log(`   - PYTHON_VERSION: ${process.env.PYTHON_VERSION || 'unknown'}`);

    // Check if we're on Netlify
    if (process.env.NETLIFY) {
        console.log('   - Platform: Netlify');
        console.log(`   - Site ID: ${process.env.SITE_ID || 'unknown'}`);
        console.log(`   - Context: ${process.env.CONTEXT || 'unknown'}`);
    } else {
        console.log('   - Platform: Local Development');
    }

    console.log('\n✅ Environment check completed successfully!');
}

// Run the check
try {
    checkEnvironment();
} catch (error) {
    console.error('❌ Environment check failed:', error.message);
    process.exit(1);
}