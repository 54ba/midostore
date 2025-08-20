export const config = {
    // Database
    database: {
        url: process.env.DATABASE_URL || "postgresql://username:password@localhost:5432/midostore_db",
    },

    // Clerk Authentication - Updated for Netlify integration
    clerk: {
        publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
        secretKey: process.env.CLERK_SECRET_KEY || "",
        // Use Clerk's built-in auth routes instead of custom ones
        signInUrl: "/sign-in",
        signUpUrl: "/sign-up",
        afterSignInUrl: "/dashboard",
        afterSignUpUrl: "/dashboard",
    },

    // Alibaba API (if available)
    alibaba: {
        appKey: process.env.ALIBABA_APP_KEY || "",
        appSecret: process.env.ALIBABA_APP_SECRET || "",
        accessToken: process.env.ALIBABA_ACCESS_TOKEN || "",
    },

    // AliExpress API (if available)
    aliexpress: {
        appKey: process.env.ALIEXPRESS_APP_KEY || "",
        appSecret: process.env.ALIEXPRESS_APP_SECRET || "",
        accessToken: process.env.ALIEXPRESS_ACCESS_TOKEN || "",
    },

    // Exchange Rate APIs (multiple sources for redundancy)
    exchangeRate: {
        // Primary API
        primary: {
            apiKey: process.env.EXCHANGE_RATE_API_KEY || "",
            baseUrl: process.env.EXCHANGE_RATE_BASE_URL || "https://api.exchangerate-api.com/v4/latest",
            name: "Exchange Rate API",
        },
        // Fixer.io API
        fixer: {
            apiKey: process.env.FIXER_API_KEY || "",
            baseUrl: "http://data.fixer.io/api",
            name: "Fixer.io",
        },
        // Currency API
        currency: {
            apiKey: process.env.CURRENCY_API_KEY || "",
            baseUrl: "https://api.currencyapi.com/v3",
            name: "Currency API",
        },
        // Open Exchange Rates API
        openExchangeRates: {
            apiKey: process.env.OPEN_EXCHANGE_RATES_API_KEY || "",
            baseUrl: "https://open.er-api.com/v6",
            name: "Open Exchange Rates",
        },
        // Currency Layer API
        currencyLayer: {
            apiKey: process.env.CURRENCY_LAYER_API_KEY || "",
            baseUrl: "http://api.currencylayer.com",
            name: "Currency Layer",
        },
        // Update frequency in minutes
        updateFrequency: parseInt(process.env.EXCHANGE_RATE_UPDATE_FREQUENCY || "15"),
        // Cache duration in minutes
        cacheDuration: parseInt(process.env.EXCHANGE_RATE_CACHE_DURATION || "15"),
    },

    // Netlify Functions
    netlify: {
        functionsDir: process.env.NETLIFY_FUNCTIONS_DIR || "netlify/functions",
        siteUrl: process.env.URL || "https://handy-cow-68.netlify.app",
    },

    // Scraping Configuration
    scraping: {
        delayMs: parseInt(process.env.SCRAPING_DELAY_MS || "2000"),
        maxConcurrent: parseInt(process.env.MAX_CONCURRENT_SCRAPES || "3"),
        timeoutMs: parseInt(process.env.SCRAPING_TIMEOUT_MS || "30000"),
    },

    // Localization
    localization: {
        defaultLocale: process.env.DEFAULT_LOCALE || "en-AE",
        defaultCurrency: process.env.DEFAULT_CURRENCY || "AED",
        supportedLocales: process.env.SUPPORTED_LOCALES
            ? JSON.parse(process.env.SUPPORTED_LOCALES)
            : ["en-AE", "ar-AE", "en-SA", "ar-SA", "en-KW", "ar-KW", "en-QA", "ar-QA", "en-BH", "ar-BH", "en-OM", "ar-OM"],
    },

    // Gulf Countries Configuration
    gulfCountries: [
        {
            code: "AE",
            name: "United Arab Emirates",
            nameAr: "الإمارات العربية المتحدة",
            currency: "AED",
            currencyAr: "درهم إماراتي",
            timezone: "Asia/Dubai",
            locale: "ar-AE",
        },
        {
            code: "SA",
            name: "Saudi Arabia",
            nameAr: "المملكة العربية السعودية",
            currency: "SAR",
            currencyAr: "ريال سعودي",
            timezone: "Asia/Riyadh",
            locale: "ar-SA",
        },
        {
            code: "KW",
            name: "Kuwait",
            nameAr: "الكويت",
            currency: "KWD",
            currencyAr: "دينار كويتي",
            timezone: "Asia/Kuwait",
            locale: "ar-KW",
        },
        {
            code: "QA",
            name: "Qatar",
            nameAr: "قطر",
            currency: "QAR",
            currencyAr: "ريال قطري",
            timezone: "Asia/Qatar",
            locale: "ar-QA",
        },
        {
            code: "BH",
            name: "Bahrain",
            nameAr: "البحرين",
            currency: "BHD",
            currencyAr: "دينار بحريني",
            timezone: "Asia/Bahrain",
            locale: "ar-BH",
        },
        {
            code: "OM",
            name: "Oman",
            nameAr: "عُمان",
            currency: "OMR",
            currencyAr: "ريال عماني",
            timezone: "Asia/Muscat",
            locale: "ar-OM",
        },
    ],

    // Profit Margins (percentage)
    profitMargins: {
        default: parseFloat(process.env.DEFAULT_PROFIT_MARGIN || "25"),
        byCategory: process.env.CATEGORY_PROFIT_MARGINS
            ? JSON.parse(process.env.CATEGORY_PROFIT_MARGINS)
            : {
                electronics: 20,
                clothing: 30,
                home: 25,
                beauty: 35,
                sports: 25,
            },
    },

    // Scraping Sources
    scrapingSources: process.env.SCRAPING_SOURCES
        ? JSON.parse(process.env.SCRAPING_SOURCES)
        : ["alibaba", "aliexpress"],

    scrapingCategories: process.env.SCRAPING_CATEGORIES
        ? JSON.parse(process.env.SCRAPING_CATEGORIES)
        : ["electronics", "clothing", "home", "beauty", "sports", "automotive", "toys", "jewelry"],

    // Scheduled Tasks Configuration
    scheduledTasks: {
        exchangeRateUpdateInterval: process.env.EXCHANGE_RATE_UPDATE_INTERVAL || "*/15 * * * *", // Every 15 minutes
        productPriceUpdateInterval: process.env.PRODUCT_PRICE_UPDATE_INTERVAL || "0 * * * *", // Every hour
        cacheCleanupInterval: process.env.CACHE_CLEANUP_INTERVAL || "*/30 * * * *", // Every 30 minutes
        dailyMaintenanceTime: process.env.DAILY_MAINTENANCE_TIME || "0 2 * * *", // 2 AM UTC
        timezone: process.env.TASK_TIMEZONE || "UTC",
    },
};

export default config;