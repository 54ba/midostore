#!/usr/bin/env node

console.log('🔧 Testing Environment Variable Setup...\n');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Test categories
const testCategories = {
    'Authentication (Clerk)': [
        'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
        'CLERK_SECRET_KEY',
        'NEXT_PUBLIC_CLERK_FRONTEND_API'
    ],
    'AI & Analytics': [
        'OPENAI_API_KEY',
        'ANTHROPIC_API_KEY',
        'AI_ANALYTICS_ENDPOINT'
    ],
    'Database': [
        'DATABASE_URL'
    ],
    'Exchange Rates': [
        'EXCHANGE_RATE_API_KEY',
        'FIXER_API_KEY',
        'CURRENCY_API_KEY'
    ],
    'Cryptocurrency': [
        'BTC_WALLET_ADDRESS',
        'COINGECKO_API_KEY',
        'BINANCE_API_KEY'
    ],
    'Shipping': [
        'DHL_API_KEY',
        'FEDEX_API_KEY',
        'UPS_API_KEY'
    ],
    'Advertising': [
        'FACEBOOK_ADS_API_KEY',
        'GOOGLE_ADS_API_KEY',
        'INSTAGRAM_ADS_API_KEY'
    ],
    'Web3': [
        'NEXT_PUBLIC_WEB3_ENABLED',
        'NEXT_PUBLIC_WEB3_NETWORK',
        'WEB3_INFURA_API_KEY'
    ],
    'Scraping': [
        'SCRAPING_SOURCES',
        'SCRAPING_CATEGORIES',
        'CATEGORY_PROFIT_MARGINS'
    ]
};

let totalVars = 0;
let configuredVars = 0;
let missingCritical = [];

console.log('📋 Environment Variable Status:\n');

Object.entries(testCategories).forEach(([category, vars]) => {
    console.log(`\n🔍 ${category}:`);

    vars.forEach(varName => {
        totalVars++;
        const value = process.env[varName];
        const isConfigured = value && value !== `your_${varName.toLowerCase()}` && value !== 'your_api_key';

        if (isConfigured) {
            configuredVars++;
            // Show partial value for security
            const displayValue = value.length > 20
                ? `${value.substring(0, 8)}...${value.substring(value.length - 4)}`
                : value.substring(0, 20);
            console.log(`  ✅ ${varName}: ${displayValue}`);
        } else {
            console.log(`  ❌ ${varName}: Not configured`);

            // Mark critical variables
            if (['NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', 'CLERK_SECRET_KEY', 'DATABASE_URL', 'OPENAI_API_KEY', 'ANTHROPIC_API_KEY'].includes(varName)) {
                missingCritical.push(varName);
            }
        }
    });
});

console.log('\n' + '='.repeat(60));
console.log(`📊 Configuration Summary:`);
console.log(`   Total Variables: ${totalVars}`);
console.log(`   Configured: ${configuredVars}`);
console.log(`   Missing: ${totalVars - configuredVars}`);
console.log(`   Configuration Rate: ${Math.round((configuredVars / totalVars) * 100)}%`);

if (missingCritical.length > 0) {
    console.log('\n⚠️  Critical Variables Missing:');
    missingCritical.forEach(varName => {
        console.log(`   - ${varName}`);
    });

    console.log('\n🔧 To configure critical variables:');
    console.log('   1. Edit .env.local file');
    console.log('   2. Replace placeholder values with your actual API keys');
    console.log('   3. For Clerk: Run ./scripts/setup-clerk.sh');
    console.log('   4. For AI: Add your OpenAI or Anthropic API key');
    console.log('   5. For Database: Add your PostgreSQL connection string');
} else {
    console.log('\n✅ All critical variables are configured!');
}

console.log('\n🚀 Next Steps:');
console.log('   1. Configure missing API keys in .env.local');
console.log('   2. Test the application: npm run dev');
console.log('   3. Test AI agents: npm run test:ai-agents');
console.log('   4. Test orchestrator: npm run test:orchestrator');

// Test JSON parsing for complex variables
console.log('\n🧪 Testing JSON Variables:');

const jsonVars = ['SCRAPING_SOURCES', 'SCRAPING_CATEGORIES', 'CATEGORY_PROFIT_MARGINS', 'SUPPORTED_LOCALES'];

jsonVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
        try {
            const parsed = JSON.parse(value);
            console.log(`  ✅ ${varName}: Valid JSON (${Array.isArray(parsed) ? parsed.length + ' items' : typeof parsed})`);
        } catch (error) {
            console.log(`  ❌ ${varName}: Invalid JSON - ${error.message}`);
        }
    } else {
        console.log(`  ⚠️  ${varName}: Not set`);
    }
});

// Test environment-specific configurations
console.log('\n🌍 Environment Configuration:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`   AI_ANALYTICS_ENDPOINT: ${process.env.AI_ANALYTICS_ENDPOINT || 'http://localhost:8000'}`);
console.log(`   DEFAULT_LOCALE: ${process.env.DEFAULT_LOCALE || 'en-AE'}`);
console.log(`   DEFAULT_CURRENCY: ${process.env.DEFAULT_CURRENCY || 'AED'}`);

console.log('\n✨ Environment setup test completed!');

// Exit with appropriate code
if (missingCritical.length > 0) {
    console.log('\n⚠️  Some critical variables are missing. Please configure them before running the application.');
    process.exit(1);
} else {
    console.log('\n🎉 Environment is properly configured!');
    process.exit(0);
}