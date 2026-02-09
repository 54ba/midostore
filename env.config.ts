// This file is generated or manually updated to provide application-wide configuration
const envConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  NEXT_PORT: process.env.NEXT_PORT || '3000',
  NEXT_HOST: process.env.NEXT_HOST || 'localhost',
  API_PORT: process.env.API_PORT || '8000',
  API_HOST: process.env.API_HOST || '0.0.0.0',
  PYTHON_PATH: process.env.PYTHON_PATH || 'python3',
  VENV_PATH: process.env.VENV_PATH || './ai/venv',
  DATABASE_URL: process.env.DATABASE_URL || '',
  DATABASE_TYPE: process.env.DATABASE_TYPE || 'postgresql',
  LOG_LEVEL: process.env.LOG_LEVEL || 'INFO',
  ENABLE_AI_TRAINING: process.env.ENABLE_AI_TRAINING === 'true',

  // Exchange Rate Configuration
  exchangeRate: {
    cacheDuration: 60, // Minutes
    updateFrequency: 240, // Minutes
    primary: {
      name: 'ExchangeRate-API',
      baseUrl: 'https://v6.exchangerate-api.com/v6',
      apiKey: process.env.EXCHANGE_RATE_API_KEY || '',
    },
    fixer: {
      name: 'Fixer.io',
      baseUrl: 'http://data.fixer.io/api',
      apiKey: process.env.FIXER_API_KEY || '',
    },
    currency: {
      name: 'CurrencyAPI',
      baseUrl: 'https://api.currencyapi.com/v3',
      apiKey: process.env.CURRENCY_API_KEY || '',
    },
    openExchangeRates: {
      name: 'Open Exchange Rates',
      baseUrl: 'https://openexchangerates.org/api',
      apiKey: process.env.OPEN_EXCHANGE_RATES_API_KEY || '',
    },
    currencyLayer: {
      name: 'Currency Layer',
      baseUrl: 'http://apilayer.net/api',
      apiKey: process.env.CURRENCY_LAYER_API_KEY || '',
    },
  },

  // Gulf Countries Configuration
  gulfCountries: [
    { name: 'United Arab Emirates', code: 'AE', currency: 'AED', locale: 'ar-AE' },
    { name: 'Saudi Arabia', code: 'SA', currency: 'SAR', locale: 'ar-SA' },
    { name: 'Qatar', code: 'QA', currency: 'QAR', locale: 'ar-QA' },
    { name: 'Kuwait', code: 'KW', currency: 'KWD', locale: 'ar-KW' },
    { name: 'Bahrain', code: 'BH', currency: 'BHD', locale: 'ar-BH' },
    { name: 'Oman', code: 'OM', currency: 'OMR', locale: 'ar-OM' },
  ],
};

export const config = envConfig;
export default envConfig;
