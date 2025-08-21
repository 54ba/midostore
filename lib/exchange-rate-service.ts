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

        // Check if we have a valid cached rate
        if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
            return cached.rate;
        }

        try {
            // First try to get from database
            const dbRate = await this.getRateFromDatabase(fromCurrency, toCurrency);
            if (dbRate && this.isRateFresh(dbRate.lastUpdated)) {
                this.cache.set(cacheKey, { rate: dbRate.rate, timestamp: Date.now() });
                return dbRate.rate;
            }

            // If not in database or stale, fetch from API
            const apiRate = await this.fetchRateFromAPI(fromCurrency, toCurrency);

            // Store in database
            await this.storeRateInDatabase(fromCurrency, toCurrency, apiRate);

            // Update cache
            this.cache.set(cacheKey, { rate: apiRate, timestamp: Date.now() });

            return apiRate;
        } catch (error) {
            console.error(`Error getting exchange rate for ${fromCurrency} to ${toCurrency}:`, error);

            // Fallback to cached rate if available
            if (cached) {
                console.log(`Using cached rate for ${fromCurrency} to ${toCurrency}: ${cached.rate}`);
                return cached.rate;
            }

            // If no cached rate, try to get from database even if stale
            try {
                const staleRate = await this.getRateFromDatabase(fromCurrency, toCurrency);
                if (staleRate) {
                    console.log(`Using stale database rate for ${fromCurrency} to ${toCurrency}: ${staleRate.rate}`);
                    return staleRate.rate;
                }
            } catch (dbError) {
                console.error('Database fallback also failed:', dbError);
            }

            // Last resort: return 1:1 rate for same currency, throw error for different currencies
            if (fromCurrency === toCurrency) {
                return 1;
            }

            throw new Error(`Unable to get exchange rate for ${fromCurrency} to ${toCurrency}`);
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

        // Process updates in batches to avoid overwhelming APIs
        const batchSize = 5;
        for (let i = 0; i < updatePromises.length; i += batchSize) {
            const batch = updatePromises.slice(i, i + batchSize);
            await Promise.allSettled(batch);

            // Small delay between batches
            if (i + batchSize < updatePromises.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
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
                    source: 'api',
                },
            });
        } catch (error) {
            console.error('Error storing rate in database:', error);
        }
    }

    private async fetchRateFromAPI(fromCurrency: string, toCurrency: string): Promise<number> {
        try {
            // Try multiple exchange rate APIs for redundancy
            const apis = [
                () => this.fetchFromExchangeRateAPI(fromCurrency, toCurrency),
                () => this.fetchFromFixerAPI(fromCurrency, toCurrency),
                () => this.fetchFromCurrencyAPI(fromCurrency, toCurrency),
                () => this.fetchFromOpenExchangeRatesAPI(fromCurrency, toCurrency),
                () => this.fetchFromCurrencyLayerAPI(fromCurrency, toCurrency),
            ];

            for (const api of apis) {
                try {
                    const rate = await api();
                    if (rate > 0) {
                        return rate;
                    }
                } catch (error) {
                    console.error(`API failed:`, error);
                    continue;
                }
            }

            throw new Error('All exchange rate APIs failed');
        } catch (error) {
            console.error('Error fetching from all APIs:', error);
            throw error;
        }
    }

    private async fetchFromExchangeRateAPI(fromCurrency: string, toCurrency: string): Promise<number> {
        const response = await axios.get(`${envConfig.exchangeRate.primary.baseUrl}/${fromCurrency}`, {
            timeout: 10000,
        });
        const data = response.data;

        if (data.rates && data.rates[toCurrency]) {
            return data.rates[toCurrency];
        }

        throw new Error('Rate not found in response');
    }

    private async fetchFromFixerAPI(fromCurrency: string, toCurrency: string): Promise<number> {
        if (!envConfig.exchangeRate.fixer.apiKey) {
            throw new Error('Fixer API key not configured');
        }

        const response = await axios.get(`${envConfig.exchangeRate.fixer.baseUrl}/latest`, {
            params: {
                base: fromCurrency,
                symbols: toCurrency,
                access_key: envConfig.exchangeRate.fixer.apiKey,
            },
            timeout: 10000,
        });
        const data = response.data;

        if (data.success && data.rates && data.rates[toCurrency]) {
            return data.rates[toCurrency];
        }

        throw new Error('Fixer API failed');
    }

    private async fetchFromCurrencyAPI(fromCurrency: string, toCurrency: string): Promise<number> {
        if (!envConfig.exchangeRate.currency.apiKey) {
            throw new Error('Currency API key not configured');
        }

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

        throw new Error('Currency API failed');
    }

    private async fetchFromOpenExchangeRatesAPI(fromCurrency: string, toCurrency: string): Promise<number> {
        if (!envConfig.exchangeRate.openExchangeRates.apiKey) {
            throw new Error('Open Exchange Rates API key not configured');
        }

        const response = await axios.get(`${envConfig.exchangeRate.openExchangeRates.baseUrl}/latest/${fromCurrency}`, {
            timeout: 10000,
        });
        const data = response.data;

        if (data.rates && data.rates[toCurrency]) {
            return data.rates[toCurrency];
        }

        throw new Error('Open Exchange Rates API failed');
    }

    private async fetchFromCurrencyLayerAPI(fromCurrency: string, toCurrency: string): Promise<number> {
        if (!envConfig.exchangeRate.currencyLayer.apiKey) {
            throw new Error('Currency Layer API key not configured');
        }

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

        throw new Error('Currency Layer API failed');
    }

    private isRateFresh(lastUpdated: Date): boolean {
        const now = new Date();
        const diff = now.getTime() - lastUpdated.getTime();
        return diff < this.CACHE_DURATION;
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