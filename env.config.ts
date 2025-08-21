import { z } from 'zod'

// Environment variable schema
const envSchema = z.object({
    // Clerk Authentication
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
    CLERK_SECRET_KEY: z.string().optional(),
    NEXT_PUBLIC_CLERK_FRONTEND_API: z.string().optional(),

    // Clerk URLs
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default('/sign-in'),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default('/sign-up'),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().default('/dashboard'),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().default('/dashboard'),
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z.string().default('/'),
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: z.string().default('/'),

    // Netlify Configuration
    NEXT_PUBLIC_NETLIFY_SITE_URL: z.string().default('https://midostore.netlify.app'),

    // Database Configuration
    DATABASE_URL: z.string().optional(),

    // API Keys
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_PUBLISHABLE_KEY: z.string().optional(),

    // Exchange Rate API
    EXCHANGE_RATE_API_KEY: z.string().optional(),
    EXCHANGE_RATE_API_BASE_URL: z.string().default('https://api.exchangerate-api.com/v4'),

    // Alibaba/AliExpress API Configuration
    ALIBABA_API_BASE_URL: z.string().default('https://api.alibaba.com'),
    ALIBABA_API_KEY: z.string().optional(),

    // Prisma Engine Configuration (for NixOS compatibility)
    PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING: z.string().default('1'),

    // AI Location-Based Search Configuration
    NEXT_PUBLIC_WEATHER_API_KEY: z.string().optional(),
    IP_API_KEY: z.string().optional(),

    // SimpleAnalytics Configuration
    NEXT_PUBLIC_SIMPLEANALYTICS_DOMAIN: z.string().optional(),
    SIMPLEANALYTICS_API_KEY: z.string().optional(),
    SIMPLEANALYTICS_API_URL: z.string().default('https://api.simpleanalytics.com'),

    // Node.js Configuration
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    NEXT_PORT: z.string().default('3000'),
    NEXT_HOST: z.string().default('localhost'),

    // AI Service Configuration
    API_PORT: z.string().default('8000'),
    API_HOST: z.string().default('0.0.0.0'),
    PYTHON_PATH: z.string().default('python3'),
    VENV_PATH: z.string().default('./ai/venv'),

    // Database Type
    DATABASE_TYPE: z.string().default('postgresql'),

    // Additional Configuration
    LOG_LEVEL: z.string().default('INFO'),
    ENABLE_AI_TRAINING: z.string().default('true'),

    // Stripe Configuration
    STRIPE_WEBHOOK_SECRET: z.string().optional(),

    // Analytics Configuration
    NEXT_PUBLIC_SIMPLE_ANALYTICS_DOMAIN: z.string().optional(),
    SIMPLE_ANALYTICS_API_KEY: z.string().optional(),

    // Scraping Configuration
    SCRAPING_SOURCES: z.string().optional(),
    SCRAPING_CATEGORIES: z.string().optional(),
    CATEGORY_PROFIT_MARGINS: z.string().optional(),
    SUPPORTED_LOCALES: z.string().optional(),
    EXCHANGE_RATE_CACHE_DURATION: z.string().optional(),
    EXCHANGE_RATE_UPDATE_FREQUENCY: z.string().optional(),
    FIXER_API_KEY: z.string().optional(),
    CURRENCY_API_KEY: z.string().optional(),
    OPEN_EXCHANGE_RATES_API_KEY: z.string().optional(),
    CURRENCY_LAYER_API_KEY: z.string().optional(),
    DEFAULT_PROFIT_MARGIN: z.string().optional(),
    SCRAPING_DELAY_MS: z.string().optional(),
    SCRAPING_TIMEOUT_MS: z.string().optional(),
    MAX_CONCURRENT_SCRAPES: z.string().optional(),

    // Cryptocurrency API Keys
    BTC_WALLET_ADDRESS: z.string().optional(),
    ETH_WALLET_ADDRESS: z.string().optional(),
    USDT_WALLET_ADDRESS: z.string().optional(),
    BNB_WALLET_ADDRESS: z.string().optional(),
    COINGECKO_API_KEY: z.string().optional(),
    COINBASE_API_KEY: z.string().optional(),
    BINANCE_API_KEY: z.string().optional(),
    ETHERSCAN_API_KEY: z.string().optional(),
    BSCSCAN_API_KEY: z.string().optional(),

    // Shipping API Keys
    DHL_API_KEY: z.string().optional(),
    FEDEX_API_KEY: z.string().optional(),
    UPS_API_KEY: z.string().optional(),
    ARAMEX_API_KEY: z.string().optional(),
    TRACK17_API_KEY: z.string().optional(),

    // Enhanced Localization
    GOOGLE_TRANSLATE_API_KEY: z.string().optional(),
    DEEPL_API_KEY: z.string().optional(),
    AZURE_TRANSLATOR_KEY: z.string().optional(),

    // Real-time Price Monitoring
    PRICE_ALERT_WEBHOOK_URL: z.string().optional(),
    VOLATILITY_THRESHOLD: z.string().optional(),
    PRICE_UPDATE_INTERVAL: z.string().optional(),

    // AI Analytics
    OPENAI_API_KEY: z.string().optional(),
    ANTHROPIC_API_KEY: z.string().optional(),
    AI_ANALYTICS_ENDPOINT: z.string().optional(),
})

// Parse environment variables
const env = envSchema.parse(process.env)

// Helper function to check if Clerk is configured
export const isClerkConfigured = () => {
    const publishableKey = env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    const frontendApi = env.NEXT_PUBLIC_CLERK_FRONTEND_API

    return (publishableKey || frontendApi) &&
        publishableKey !== 'your_clerk_publishable_key_here' &&
        publishableKey !== 'pk_test_your_clerk_publishable_key_here' &&
        publishableKey !== 'pk_test_your_actual_publishable_key_here' &&
        frontendApi !== 'https://handy-cow-68.clerk.accounts.dev'
}

// Export environment variables
export default {
    ...env,
    // Parse JSON strings back to objects/arrays
    scrapingSources: JSON.parse(env.SCRAPING_SOURCES || '["alibaba", "aliexpress"]'),
    scrapingCategories: JSON.parse(env.SCRAPING_CATEGORIES || '["electronics", "clothing", "home", "beauty", "sports", "automotive", "toys", "jewelry"]'),
    categoryProfitMargins: JSON.parse(env.CATEGORY_PROFIT_MARGINS || '{"electronics": 20, "clothing": 30, "home": 25, "beauty": 35, "sports": 25}'),
    supportedLocales: JSON.parse(env.SUPPORTED_LOCALES || '["en-AE", "ar-AE", "en-SA", "ar-SA", "en-KW", "ar-KW", "en-QA", "ar-QA", "en-BH", "ar-BH", "en-OM", "ar-OM"]'),
    // Add structured config for services that previously used `config` object
    exchangeRate: {
        cacheDuration: parseInt(env.EXCHANGE_RATE_CACHE_DURATION || '15'),
        updateFrequency: parseInt(env.EXCHANGE_RATE_UPDATE_FREQUENCY || '15'),
        primary: {
            apiKey: env.EXCHANGE_RATE_API_KEY,
            baseUrl: env.EXCHANGE_RATE_API_BASE_URL,
            name: 'ExchangeRate-API'
        },
        fixer: {
            apiKey: env.FIXER_API_KEY, // Assuming FIXER_API_KEY is also in env
            baseUrl: 'http://data.fixer.io/api',
            name: 'Fixer'
        },
        currency: {
            apiKey: env.CURRENCY_API_KEY, // Assuming CURRENCY_API_KEY is also in env
            baseUrl: 'https://api.currencyapi.com/v3',
            name: 'CurrencyAPI'
        },
        openExchangeRates: {
            apiKey: env.OPEN_EXCHANGE_RATES_API_KEY, // Assuming OPEN_EXCHANGE_RATES_API_KEY is also in env
            baseUrl: 'https://openexchangerates.org/api',
            name: 'OpenExchangeRates'
        },
        currencyLayer: {
            apiKey: env.CURRENCY_LAYER_API_KEY, // Assuming CURRENCY_LAYER_API_KEY is also in env
            baseUrl: 'http://api.currencylayer.com',
            name: 'CurrencyLayer'
        }
    },
    gulfCountries: [
        { name: 'United Arab Emirates', locale: 'en-AE', currency: 'AED' },
        { name: 'Saudi Arabia', locale: 'en-SA', currency: 'SAR' },
        { name: 'Kuwait', locale: 'en-KW', currency: 'KWD' },
        { name: 'Qatar', locale: 'en-QA', currency: 'QAR' },
        { name: 'Bahrain', locale: 'en-BH', currency: 'BHD' },
        { name: 'Oman', locale: 'en-OM', currency: 'OMR' },
    ],
    profitMargins: {
        default: parseInt(env.DEFAULT_PROFIT_MARGIN || '25'),
        byCategory: JSON.parse(env.CATEGORY_PROFIT_MARGINS || '{"electronics": 20, "clothing": 30, "home": 25, "beauty": 35, "sports": 25}')
    },
    scraping: {
        delayMs: parseInt(env.SCRAPING_DELAY_MS || '2000'),
        timeoutMs: parseInt(env.SCRAPING_TIMEOUT_MS || '30000'),
        maxConcurrent: parseInt(env.MAX_CONCURRENT_SCRAPES || '3')
    }
}