// @ts-nocheck
import axios from 'axios';
import { prisma } from './db';
import envConfig from '../env.config';

export interface ExchangeRateData {
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    lastUpdated: Date;
}

export class ExchangeRateService {
    private cache: Map<string, { rate: number; timestamp: number }> = new Map();
    private readonly CACHE_DURATION = envConfig.exchangeRate.cacheDuration * 60 * 1000; // Convert minutes to milliseconds

    async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
        const cacheKey = `${fromCurrency}-${toCurrency}`;
        const cached = this.cache.get(cacheKey);

        if (cached && this.isRateFresh(cached.timestamp)) {
            return cached.rate;
        }

        try {
            const rate = await this.fetchRateFromAPI(fromCurrency, toCurrency);

            // Cache the successful result
            this.cache.set(cacheKey, {
                rate,
                timestamp: Date.now(),
            });

            return rate;
        } catch (error) {
            console.warn(`Failed to fetch exchange rate for ${fromCurrency}-${toCurrency}:`, error);

            // Return cached rate even if expired, or fallback to demo rate
            if (cached) {
                console.log(`Using expired cached rate for ${fromCurrency}-${toCurrency}`);
                return cached.rate;
            }

            // Fallback to demo rate if no cache available
            const demoRate = this.getDemoRate(fromCurrency, toCurrency);
            console.log(`Using demo rate for ${fromCurrency}-${toCurrency}: ${demoRate}`);

            // Cache the demo rate to avoid repeated API calls
            this.cache.set(cacheKey, {
                rate: demoRate,
                timestamp: Date.now(),
            });

            return demoRate;
        }
    }

    async convertPrice(price: number, fromCurrency: string, toCurrency: string): Promise<number> {
        if (fromCurrency === toCurrency) {
            return price;
        }

        const rate = await this.getExchangeRate(fromCurrency, toCurrency);
        return price * rate;
    }

    async getGulfCountryRates(): Promise<Record<string, number>> {
        const gulfCurrencies = envConfig.gulfCountries.map(country => country.currency);
        const rates: Record<string, number> = {};

        // Fetch all rates concurrently for better performance
        const ratePromises = gulfCurrencies.map(async (currency) => {
            try {
                const rate = await this.getExchangeRate('USD', currency);
                return { currency, rate };
            } catch (error) {
                console.error(`Error getting rate for ${currency}:`, error);
                return { currency, rate: null };
            }
        });

        const rateResults = await Promise.all(ratePromises);

        for (const result of rateResults) {
            if (result.rate !== null) {
                rates[result.currency] = result.rate;
            }
        }

        return rates;
    }

    async updateAllRates(): Promise<void> {
        console.log('🔄 Starting exchange rate update...');

        const currencies = ['USD', 'EUR', 'GBP', 'CNY', ...envConfig.gulfCountries.map(c => c.currency)];
        const updatePromises: Promise<void>[] = [];

        for (const fromCurrency of currencies) {
            for (const toCurrency of currencies) {
                if (fromCurrency !== toCurrency) {
                    const updatePromise = this.updateSingleRate(fromCurrency, toCurrency);
                    updatePromises.push(updatePromise);
                }
            }
        }

        // Process updates sequentially to avoid connection pool timeouts (P2024)
        for (const updatePromise of updatePromises) {
            await updatePromise;
            // Add a small delay between updates to avoid API rate limits
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log('✅ Exchange rate update completed');
    }

    private async updateSingleRate(fromCurrency: string, toCurrency: string): Promise<void> {
        try {
            const rate = await this.fetchRateFromAPI(fromCurrency, toCurrency);
            await this.storeRateInDatabase(fromCurrency, toCurrency, rate);

            // Update cache
            const cacheKey = `${fromCurrency}-${toCurrency}`;
            this.cache.set(cacheKey, { rate, timestamp: Date.now() });

            console.log(`✅ Updated ${fromCurrency} to ${toCurrency}: ${rate}`);
        } catch (error) {
            console.error(`❌ Failed to update ${fromCurrency} to ${toCurrency}:`, error);
        }
    }

    private async getRateFromDatabase(fromCurrency: string, toCurrency: string): Promise<ExchangeRateData | null> {
        try {
            const rate = await prisma.exchangeRate.findUnique({
                where: {
                    fromCurrency_toCurrency: {
                        fromCurrency,
                        toCurrency,
                    },
                },
            });

            return rate ? {
                fromCurrency: rate.fromCurrency,
                toCurrency: rate.toCurrency,
                rate: rate.rate.toNumber(),
                lastUpdated: rate.lastUpdated,
            } : null;
        } catch (error) {
            console.error('Error getting rate from database:', error);
            return null;
        }
    }

    private async storeRateInDatabase(fromCurrency: string, toCurrency: string, rate: number): Promise<void> {
        try {
            await prisma.exchangeRate.upsert({
                where: {
                    fromCurrency_toCurrency: {
                        fromCurrency,
                        toCurrency,
                    },
                },
                update: {
                    rate,
                    lastUpdated: new Date(),
                },
                create: {
                    fromCurrency,
                    toCurrency,
                    rate,
                },
            });
        } catch (error) {
            console.error('Error storing rate in database:', error);
        }
    }

    private async fetchRateFromAPI(fromCurrency: string, toCurrency: string): Promise<number> {
        const apis = [
            {
                name: 'Primary',
                method: () => this.fetchFromExchangeRateAPI(fromCurrency, toCurrency),
                hasKey: !!envConfig.exchangeRate.primary.apiKey
            },
            {
                name: 'Fixer',
                method: () => this.fetchFromFixerAPI(fromCurrency, toCurrency),
                hasKey: !!envConfig.exchangeRate.fixer.apiKey
            },
            {
                name: 'Currency',
                method: () => this.fetchFromCurrencyAPI(fromCurrency, toCurrency),
                hasKey: !!envConfig.exchangeRate.currency.apiKey
            },
            {
                name: 'Open Exchange Rates',
                method: () => this.fetchFromOpenExchangeRatesAPI(fromCurrency, toCurrency),
                hasKey: !!envConfig.exchangeRate.openExchangeRates.apiKey
            },
            {
                name: 'Currency Layer',
                method: () => this.fetchFromCurrencyLayerAPI(fromCurrency, toCurrency),
                hasKey: !!envConfig.exchangeRate.currencyLayer.apiKey
            },
        ];

        const errors: string[] = [];
        const availableApis = apis.filter(api => api.hasKey);

        if (availableApis.length === 0) {
            console.warn('No exchange rate API keys configured, using demo rates');
            return this.getDemoRate(fromCurrency, toCurrency);
        }

        // Try each API with shorter timeout for faster fallback
        for (const api of availableApis) {
            try {
                console.log(`Trying ${api.name} API for ${fromCurrency}-${toCurrency}...`);
                const rate = await Promise.race([
                    api.method(),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('API timeout')), 3000)
                    )
                ]);
                console.log(`Successfully fetched rate from ${api.name} API: ${rate}`);
                return rate;
            } catch (error) {
                const errorMessage = error instanceof Error ? (error as Error).message : 'Unknown error';
                console.warn(`${api.name} API failed: ${errorMessage}`);
                errors.push(`${api.name}: ${errorMessage}`);
            }
        }

        console.error('All available exchange rate APIs failed:', errors);
        // Instead of throwing, return demo rate
        console.log(`Falling back to demo rate for ${fromCurrency}-${toCurrency}`);
        return this.getDemoRate(fromCurrency, toCurrency);
    }

    private async fetchFromExchangeRateAPI(fromCurrency: string, toCurrency: string): Promise<number> {
        if (!envConfig.exchangeRate.primary.apiKey) {
            console.warn('Primary Exchange Rate API key not configured, skipping...');
            throw new Error('Primary Exchange Rate API key not configured');
        }

        try {
            const response = await axios.get(`${envConfig.exchangeRate.primary.baseUrl}/${fromCurrency}`, {
                params: {
                    apikey: envConfig.exchangeRate.primary.apiKey,
                },
                timeout: 10000,
            });
            const data = response.data;

            if (data.rates && data.rates[toCurrency]) {
                return data.rates[toCurrency];
            }

            if (data.error) {
                console.warn('Primary Exchange Rate API error:', data.error);
                throw new Error(`Primary Exchange Rate API error: ${data.error}`);
            }

            throw new Error('Primary Exchange Rate API response format unexpected');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.warn(`Primary Exchange Rate API HTTP error: ${error.response.status} - ${error.response.statusText}`);
                    throw new Error(`Primary Exchange Rate API HTTP error: ${error.response.status}`);
                } else if (error.request) {
                    console.warn('Primary Exchange Rate API request failed - no response received');
                    throw new Error('Primary Exchange Rate API request failed - no response received');
                }
            }
            console.warn('Primary Exchange Rate API request error:', error);
            throw new Error(`Primary Exchange Rate API request failed: ${error instanceof Error ? (error as Error).message : 'Unknown error'}`);
        }
    }

    private async fetchFromFixerAPI(fromCurrency: string, toCurrency: string): Promise<number> {
        if (!envConfig.exchangeRate.fixer.apiKey) {
            console.warn('Fixer API key not configured, skipping...');
            throw new Error('Fixer API key not configured');
        }

        try {
            const response = await axios.get(`${envConfig.exchangeRate.fixer.baseUrl}/latest`, {
                params: {
                    access_key: envConfig.exchangeRate.fixer.apiKey,
                    base: fromCurrency,
                    symbols: toCurrency,
                },
                timeout: 10000,
            });
            const data = response.data;

            if (data.success && data.rates && data.rates[toCurrency]) {
                return data.rates[toCurrency];
            }

            if (data.error) {
                console.warn('Fixer API error:', data.error);
                throw new Error(`Fixer API error: ${data.error.info || data.error.code}`);
            }

            throw new Error('Fixer API response format unexpected');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.warn(`Fixer API HTTP error: ${error.response.status} - ${error.response.statusText}`);
                    throw new Error(`Fixer API HTTP error: ${error.response.status}`);
                } else if (error.request) {
                    console.warn('Fixer API request failed - no response received');
                    throw new Error('Fixer API request failed - no response received');
                }
            }
            console.warn('Fixer API request error:', error);
            throw new Error(`Fixer API request failed: ${error instanceof Error ? (error as Error).message : 'Unknown error'}`);
        }
    }

    private async fetchFromCurrencyAPI(fromCurrency: string, toCurrency: string): Promise<number> {
        if (!envConfig.exchangeRate.currency.apiKey) {
            console.warn('Currency API key not configured, skipping...');
            throw new Error('Currency API key not configured');
        }

        try {
            const response = await axios.get(`${envConfig.exchangeRate.currency.baseUrl}/latest`, {
                params: {
                    base_currency: fromCurrency,
                    currencies: toCurrency,
                    apikey: envConfig.exchangeRate.currency.apiKey,
                },
                timeout: 10000,
            });
            const data = response.data;

            if (data.data && data.data[toCurrency]) {
                return data.data[toCurrency].value;
            }

            if (data.errors) {
                console.warn('Currency API errors:', data.errors);
                throw new Error(`Currency API errors: ${JSON.stringify(data.errors)}`);
            }

            throw new Error('Currency API response format unexpected');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.warn(`Currency API HTTP error: ${error.response.status} - ${error.response.statusText}`);
                    throw new Error(`Currency API HTTP error: ${error.response.status}`);
                } else if (error.request) {
                    console.warn('Currency API request failed - no response received');
                    throw new Error('Currency API request failed - no response received');
                }
            }
            console.warn('Currency API request error:', error);
            throw new Error(`Currency API request failed: ${error instanceof Error ? (error as Error).message : 'Unknown error'}`);
        }
    }

    private async fetchFromOpenExchangeRatesAPI(fromCurrency: string, toCurrency: string): Promise<number> {
        if (!envConfig.exchangeRate.openExchangeRates.apiKey) {
            console.warn('Open Exchange Rates API key not configured, skipping...');
            throw new Error('Open Exchange Rates API key not configured');
        }

        try {
            const response = await axios.get(`${envConfig.exchangeRate.openExchangeRates.baseUrl}/latest/${fromCurrency}`, {
                params: {
                    app_id: envConfig.exchangeRate.openExchangeRates.apiKey,
                },
                timeout: 10000,
            });
            const data = response.data;

            if (data.rates && data.rates[toCurrency]) {
                return data.rates[toCurrency];
            }

            if (data.error) {
                console.warn('Open Exchange Rates API error:', data.error);
                throw new Error(`Open Exchange Rates API error: ${data.error}`);
            }

            throw new Error('Open Exchange Rates API response format unexpected');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.warn(`Open Exchange Rates API HTTP error: ${error.response.status} - ${error.response.statusText}`);
                    throw new Error(`Open Exchange Rates API HTTP error: ${error.response.status}`);
                } else if (error.request) {
                    console.warn('Open Exchange Rates API request failed - no response received');
                    throw new Error('Open Exchange Rates API request failed - no response received');
                }
            }
            console.warn('Open Exchange Rates API request error:', error);
            throw new Error(`Open Exchange Rates API request failed: ${error instanceof Error ? (error as Error).message : 'Unknown error'}`);
        }
    }

    private async fetchFromCurrencyLayerAPI(fromCurrency: string, toCurrency: string): Promise<number> {
        if (!envConfig.exchangeRate.currencyLayer.apiKey) {
            console.warn('Currency Layer API key not configured, skipping...');
            throw new Error('Currency Layer API key not configured');
        }

        try {
            const response = await axios.get(`${envConfig.exchangeRate.currencyLayer.baseUrl}/live`, {
                params: {
                    access_key: envConfig.exchangeRate.currencyLayer.apiKey,
                    source: fromCurrency,
                    currencies: toCurrency,
                    format: 1,
                },
                timeout: 10000,
            });

            const data = response.data;

            if (data.success && data.quotes && data.quotes[`${fromCurrency}${toCurrency}`]) {
                return data.quotes[`${fromCurrency}${toCurrency}`];
            }

            if (data.error) {
                console.warn('Currency Layer API error:', data.error);
                throw new Error(`Currency Layer API error: ${data.error.info || data.error.code}`);
            }

            console.warn('Currency Layer API response format unexpected:', data);
            throw new Error('Currency Layer API response format unexpected');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.warn(`Currency Layer API HTTP error: ${error.response.status} - ${error.response.statusText}`);
                    throw new Error(`Currency Layer API HTTP error: ${error.response.status}`);
                } else if (error.request) {
                    console.warn('Currency Layer API request failed - no response received');
                    throw new Error('Currency Layer API request failed - no response received');
                }
            }
            console.warn('Currency Layer API request error:', error);
            throw new Error(`Currency Layer API request failed: ${error instanceof Error ? (error as Error).message : 'Unknown error'}`);
        }
    }

    private isRateFresh(lastUpdated: Date): boolean {
        const now = new Date();
        const diff = now.getTime() - lastUpdated.getTime();
        return diff < this.CACHE_DURATION;
    }

    // Get demo rate for fallback when APIs fail
    private getDemoRate(fromCurrency: string, toCurrency: string): number {
        if (fromCurrency === toCurrency) {
            return 1;
        }

        // Common demo rates for testing
        const demoRates: Record<string, Record<string, number>> = {
            'USD': {
                'EUR': 0.85,
                'GBP': 0.73,
                'JPY': 110.0,
                'CAD': 1.25,
                'AUD': 1.35,
                'AED': 3.67,
                'SAR': 3.75,
                'KWD': 0.30,
                'BHD': 0.38,
                'QAR': 3.64,
                'OMR': 0.38
            },
            'EUR': {
                'USD': 1.18,
                'GBP': 0.86,
                'JPY': 129.4,
                'AED': 4.32,
                'SAR': 4.41
            },
            'GBP': {
                'USD': 1.37,
                'EUR': 1.16,
                'JPY': 150.7,
                'AED': 5.03,
                'SAR': 5.14
            }
        };

        // Try to find demo rate
        if (demoRates[fromCurrency] && demoRates[fromCurrency][toCurrency]) {
            return demoRates[fromCurrency][toCurrency];
        }

        // If no demo rate found, return a reasonable estimate based on common patterns
        if (toCurrency === 'AED' || toCurrency === 'SAR' || toCurrency === 'KWD' || toCurrency === 'BHD' || toCurrency === 'QAR' || toCurrency === 'OMR') {
            // Gulf currencies are typically pegged to USD
            if (fromCurrency === 'USD') {
                return toCurrency === 'KWD' ? 0.30 : toCurrency === 'BHD' ? 0.38 : 3.7;
            }
            // Convert through USD
            const usdRate = this.getDemoRate(fromCurrency, 'USD');
            const targetRate = this.getDemoRate('USD', toCurrency);
            return usdRate * targetRate;
        }

        // Default fallback: return 1.0 for unknown currency pairs
        console.warn(`No demo rate available for ${fromCurrency}-${toCurrency}, using 1.0`);
        return 1.0;
    }

    // Get cache statistics for monitoring
    getCacheStats() {
        const now = Date.now();
        let validEntries = 0;
        let expiredEntries = 0;

        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp < this.CACHE_DURATION) {
                validEntries++;
            } else {
                expiredEntries++;
            }
        }

        return {
            total: this.cache.size,
            valid: validEntries,
            expired: expiredEntries,
            cacheDuration: this.CACHE_DURATION,
            cacheDurationMinutes: envConfig.exchangeRate.cacheDuration,
            updateFrequencyMinutes: envConfig.exchangeRate.updateFrequency,
        };
    }

    // Clear expired cache entries
    clearExpiredCache(): void {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp >= this.CACHE_DURATION) {
                this.cache.delete(key);
            }
        }
    }

    // Get API status for monitoring
    getAPIStatus(): Record<string, { configured: boolean; name: string }> {
        return {
            primary: {
                configured: !!envConfig.exchangeRate.primary.apiKey,
                name: envConfig.exchangeRate.primary.name,
            },
            fixer: {
                configured: !!envConfig.exchangeRate.fixer.apiKey,
                name: envConfig.exchangeRate.fixer.name,
            },
            currency: {
                configured: !!envConfig.exchangeRate.currency.apiKey,
                name: envConfig.exchangeRate.currency.name,
            },
            openExchangeRates: {
                configured: !!envConfig.exchangeRate.openExchangeRates.apiKey,
                name: envConfig.exchangeRate.openExchangeRates.name,
            },
            currencyLayer: {
                configured: !!envConfig.exchangeRate.currencyLayer.apiKey,
                name: envConfig.exchangeRate.currencyLayer.name,
            },
        };
    }
}

export default ExchangeRateService;