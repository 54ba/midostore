// @ts-nocheck
import { prisma } from './db';
import envConfig from '../env.config';

export interface Currency {
    code: string;
    name: string;
    symbol: string;
    rate: number;
    lastUpdated: Date;
    isStable: boolean;
    volatility: number;
}

export interface Language {
    code: string;
    name: string;
    nativeName: string;
    rtl: boolean;
    flag: string;
}

export interface LocalizedProduct {
    id: string;
    title: string;
    description: string;
    price: number;
    originalPrice: number;
    currency: string;
    priceHistory: PriceHistory[];
    isVolatile: boolean;
    lastPriceUpdate: Date;
}

export interface PriceHistory {
    id: string;
    productId: string;
    price: number;
    currency: string;
    timestamp: Date;
    source: string;
    conversionRate: number;
}

export interface ShippingZone {
    id: string;
    name: string;
    countries: string[];
    baseFee: number;
    perKgFee: number;
    freeShippingThreshold: number;
    estimatedDays: { min: number; max: number };
    trackingEnabled: boolean;
}

export class EnhancedLocalizationService {
    private supportedLanguages: Language[] = [
        { code: 'en', name: 'English', nativeName: 'English', rtl: false, flag: '🇺🇸' },
        { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true, flag: '🇸🇦' },
        { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false, flag: '🇪🇸' },
        { code: 'fr', name: 'French', nativeName: 'Français', rtl: false, flag: '🇫🇷' },
        { code: 'de', name: 'German', nativeName: 'Deutsch', rtl: false, flag: '🇩🇪' },
        { code: 'zh', name: 'Chinese', nativeName: '中文', rtl: false, flag: '🇨🇳' },
        { code: 'ja', name: 'Japanese', nativeName: '日本語', rtl: false, flag: '🇯🇵' },
        { code: 'ko', name: 'Korean', nativeName: '한국어', rtl: false, flag: '🇰🇷' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', rtl: false, flag: '🇮🇳' },
        { code: 'pt', name: 'Portuguese', nativeName: 'Português', rtl: false, flag: '🇵🇹' },
        { code: 'ru', name: 'Russian', nativeName: 'Русский', rtl: false, flag: '🇷🇺' },
        { code: 'it', name: 'Italian', nativeName: 'Italiano', rtl: false, flag: '🇮🇹' },
        { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', rtl: false, flag: '🇹🇷' },
        { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', rtl: false, flag: '🇳🇱' },
        { code: 'sv', name: 'Swedish', nativeName: 'Svenska', rtl: false, flag: '🇸🇪' },
    ];

    private supportedCurrencies: Currency[] = [
        // Traditional currencies
        { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1, lastUpdated: new Date(), isStable: true, volatility: 0.02 },
        { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85, lastUpdated: new Date(), isStable: true, volatility: 0.03 },
        { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.73, lastUpdated: new Date(), isStable: true, volatility: 0.04 },
        { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 110, lastUpdated: new Date(), isStable: true, volatility: 0.05 },
        { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.25, lastUpdated: new Date(), isStable: true, volatility: 0.03 },
        { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.35, lastUpdated: new Date(), isStable: true, volatility: 0.04 },
        { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', rate: 0.92, lastUpdated: new Date(), isStable: true, volatility: 0.02 },
        { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 6.45, lastUpdated: new Date(), isStable: true, volatility: 0.03 },

        // Gulf currencies
        { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 3.67, lastUpdated: new Date(), isStable: true, volatility: 0.01 },
        { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س', rate: 3.75, lastUpdated: new Date(), isStable: true, volatility: 0.01 },
        { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق', rate: 3.64, lastUpdated: new Date(), isStable: true, volatility: 0.01 },
        { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', rate: 0.30, lastUpdated: new Date(), isStable: true, volatility: 0.02 },
        { code: 'BHD', name: 'Bahraini Dinar', symbol: 'ب.د', rate: 0.38, lastUpdated: new Date(), isStable: true, volatility: 0.01 },
        { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع.', rate: 0.38, lastUpdated: new Date(), isStable: true, volatility: 0.01 },

        // Cryptocurrencies
        { code: 'BTC', name: 'Bitcoin', symbol: '₿', rate: 0.000023, lastUpdated: new Date(), isStable: false, volatility: 0.15 },
        { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', rate: 0.00035, lastUpdated: new Date(), isStable: false, volatility: 0.18 },
        { code: 'USDT', name: 'Tether', symbol: '₮', rate: 1.00, lastUpdated: new Date(), isStable: true, volatility: 0.005 },
        { code: 'BNB', name: 'Binance Coin', symbol: 'BNB', rate: 0.0025, lastUpdated: new Date(), isStable: false, volatility: 0.20 },
        { code: 'ADA', name: 'Cardano', symbol: '₳', rate: 2.5, lastUpdated: new Date(), isStable: false, volatility: 0.25 },
        { code: 'DOT', name: 'Polkadot', symbol: 'DOT', rate: 0.15, lastUpdated: new Date(), isStable: false, volatility: 0.22 },
        { code: 'MATIC', name: 'Polygon', symbol: 'MATIC', rate: 1.2, lastUpdated: new Date(), isStable: false, volatility: 0.28 },
        { code: 'SOL', name: 'Solana', symbol: 'SOL', rate: 0.01, lastUpdated: new Date(), isStable: false, volatility: 0.30 },
    ];

    private shippingZones: ShippingZone[] = [
        {
            id: 'gulf',
            name: 'Gulf Countries',
            countries: ['AE', 'SA', 'KW', 'QA', 'BH', 'OM'],
            baseFee: 15,
            perKgFee: 5,
            freeShippingThreshold: 200,
            estimatedDays: { min: 2, max: 5 },
            trackingEnabled: true,
        },
        {
            id: 'middle-east',
            name: 'Middle East',
            countries: ['JO', 'LB', 'SY', 'IQ', 'IR', 'TR', 'EG'],
            baseFee: 25,
            perKgFee: 8,
            freeShippingThreshold: 300,
            estimatedDays: { min: 5, max: 10 },
            trackingEnabled: true,
        },
        {
            id: 'europe',
            name: 'Europe',
            countries: ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK'],
            baseFee: 35,
            perKgFee: 12,
            freeShippingThreshold: 400,
            estimatedDays: { min: 7, max: 14 },
            trackingEnabled: true,
        },
        {
            id: 'north-america',
            name: 'North America',
            countries: ['US', 'CA', 'MX'],
            baseFee: 40,
            perKgFee: 15,
            freeShippingThreshold: 500,
            estimatedDays: { min: 10, max: 21 },
            trackingEnabled: true,
        },
        {
            id: 'asia-pacific',
            name: 'Asia Pacific',
            countries: ['CN', 'JP', 'KR', 'SG', 'HK', 'TW', 'TH', 'MY', 'IN', 'AU', 'NZ'],
            baseFee: 30,
            perKgFee: 10,
            freeShippingThreshold: 350,
            estimatedDays: { min: 7, max: 18 },
            trackingEnabled: true,
        },
    ];

    // Get real-time exchange rates
    async updateExchangeRates(): Promise<void> {
        try {
            // Update traditional currencies
            await this.updateTraditionalRates();

            // Update cryptocurrency rates
            await this.updateCryptoRates();

            // Calculate volatility and stability
            await this.calculateVolatility();

            // Update database
            await this.persistRates();
        } catch (error) {
            console.error('Error updating exchange rates:', error);
        }
    }

    // Convert price between currencies
    async convertPrice(
        amount: number,
        fromCurrency: string,
        toCurrency: string,
        includeHistory: boolean = false
    ): Promise<{ convertedAmount: number; rate: number; isVolatile: boolean; history?: PriceHistory[] }> {
        const fromRate = await this.getExchangeRate(fromCurrency);
        const toRate = await this.getExchangeRate(toCurrency);

        if (!fromRate || !toRate) {
            throw new Error(`Exchange rate not found for ${fromCurrency} or ${toCurrency}`);
        }

        const usdAmount = amount / fromRate.rate;
        const convertedAmount = usdAmount * toRate.rate;
        const rate = toRate.rate / fromRate.rate;

        const isVolatile = fromRate.volatility > 0.1 || toRate.volatility > 0.1;

        let history: PriceHistory[] = [];
        if (includeHistory) {
            history = await this.getPriceHistory(fromCurrency, toCurrency, 30);
        }

        return {
            convertedAmount: Math.round(convertedAmount * 100) / 100,
            rate,
            isVolatile,
            history,
        };
    }

    // Track price history
    async trackPriceHistory(
        productId: string,
        price: number,
        currency: string,
        source: string = 'system'
    ): Promise<void> {
        try {
            // Get current conversion rate to USD
            const conversionRate = await this.getExchangeRate(currency);

            await prisma.priceHistory.create({
                data: {
                    productId,
                    price,
                    currency,
                    source,
                    conversionRate: conversionRate?.rate || 1,
                    timestamp: new Date(),
                },
            });

            // Update product with latest price info
            await this.updateProductPriceInfo(productId, price, currency);
        } catch (error) {
            console.error('Error tracking price history:', error);
        }
    }

    // Get localized product with price history
    async getLocalizedProduct(
        productId: string,
        targetCurrency: string,
        language: string = 'en'
    ): Promise<LocalizedProduct | null> {
        try {
            const product = await prisma.product.findUnique({
                where: { id: productId },
                include: {
                    priceHistory: {
                        orderBy: { timestamp: 'desc' },
                        take: 100,
                    },
                    localizations: {
                        where: { locale: language },
                    },
                },
            });

            if (!product) return null;

            const localization = product.localizations[0];
            const conversion = await this.convertPrice(
                product.price,
                product.currency,
                targetCurrency,
                true
            );

            return {
                id: product.id,
                title: localization?.title || product.title,
                description: localization?.description || product.description || '',
                price: conversion.convertedAmount,
                originalPrice: product.originalPrice ?
                    (await this.convertPrice(product.originalPrice, product.currency, targetCurrency)).convertedAmount :
                    conversion.convertedAmount,
                currency: targetCurrency,
                priceHistory: product.priceHistory.map(h => ({
                    id: h.id,
                    productId: h.productId,
                    price: h.price,
                    currency: h.currency,
                    timestamp: h.timestamp,
                    source: h.source,
                    conversionRate: h.conversionRate,
                })),
                isVolatile: conversion.isVolatile,
                lastPriceUpdate: product.updatedAt,
            };
        } catch (error) {
            console.error('Error getting localized product:', error);
            return null;
        }
    }

    // Calculate shipping fees
    async calculateShipping(
        countryCode: string,
        weight: number,
        orderValue: number,
        currency: string = 'USD'
    ): Promise<{
        baseFee: number;
        weightFee: number;
        totalFee: number;
        isFree: boolean;
        estimatedDays: { min: number; max: number };
        trackingAvailable: boolean;
        zone: string;
    }> {
        const zone = this.shippingZones.find(z =>
            z.countries.includes(countryCode.toUpperCase())
        ) || this.shippingZones[this.shippingZones.length - 1]; // Default to last zone

        // Convert thresholds to target currency
        const conversion = await this.convertPrice(zone.freeShippingThreshold, 'USD', currency);
        const freeShippingThreshold = conversion.convertedAmount;

        const isFree = orderValue >= freeShippingThreshold;
        const baseFee = isFree ? 0 : zone.baseFee;
        const weightFee = isFree ? 0 : Math.max(0, (weight - 1) * zone.perKgFee);
        const totalFee = baseFee + weightFee;

        // Convert fees to target currency
        const feeConversion = await this.convertPrice(totalFee, 'USD', currency);

        return {
            baseFee: (await this.convertPrice(baseFee, 'USD', currency)).convertedAmount,
            weightFee: (await this.convertPrice(weightFee, 'USD', currency)).convertedAmount,
            totalFee: feeConversion.convertedAmount,
            isFree,
            estimatedDays: zone.estimatedDays,
            trackingAvailable: zone.trackingEnabled,
            zone: zone.name,
        };
    }

    // Get supported languages and currencies
    getSupportedLanguages(): Language[] {
        return this.supportedLanguages;
    }

    getSupportedCurrencies(): Currency[] {
        return this.supportedCurrencies;
    }

    getCryptoCurrencies(): Currency[] {
        return this.supportedCurrencies.filter(c => ['BTC', 'ETH', 'USDT', 'BNB', 'ADA', 'DOT', 'MATIC', 'SOL'].includes(c.code));
    }

    getShippingZones(): ShippingZone[] {
        return this.shippingZones;
    }

    // Private helper methods
    private async updateTraditionalRates(): Promise<void> {
        try {
            // This would integrate with multiple exchange rate APIs
            const apis = [
                'https://api.exchangerate-api.com/v4/latest/USD',
                'https://api.fixer.io/latest?access_key=' + envConfig.FIXER_API_KEY,
                'https://api.currencyapi.com/v3/latest?apikey=' + envConfig.CURRENCY_API_KEY,
            ];

            for (const api of apis) {
                try {
                    const response = await fetch(api);
                    const data = await response.json();

                    if (data.rates) {
                        // Update rates from this source
                        for (const [code, rate] of Object.entries(data.rates)) {
                            const currency = this.supportedCurrencies.find(c => c.code === code);
                            if (currency) {
                                currency.rate = rate as number;
                                currency.lastUpdated = new Date();
                            }
                        }
                        break; // Use first successful API
                    }
                } catch (error) {
                    console.warn(`Failed to fetch from ${api}:`, error);
                    continue;
                }
            }
        } catch (error) {
            console.error('Error updating traditional rates:', error);
        }
    }

    private async updateCryptoRates(): Promise<void> {
        try {
            // Use CoinGecko API for crypto rates
            const cryptoCodes = this.getCryptoCurrencies().map(c => c.code.toLowerCase()).join(',');
            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoCodes}&vs_currencies=usd`
            );

            const data = await response.json();

            for (const [id, priceData] of Object.entries(data)) {
                const currency = this.supportedCurrencies.find(c => c.code.toLowerCase() === id);
                if (currency && priceData && typeof priceData === 'object') {
                    currency.rate = 1 / (priceData as any).usd; // Convert to rate format
                    currency.lastUpdated = new Date();
                }
            }
        } catch (error) {
            console.error('Error updating crypto rates:', error);
        }
    }

    private async calculateVolatility(): Promise<void> {
        // Calculate volatility based on price history
        for (const currency of this.supportedCurrencies) {
            try {
                const history = await this.getCurrencyHistory(currency.code, 30);
                if (history.length > 1) {
                    const prices = history.map(h => h.rate);
                    const mean = prices.reduce((a, b) => a + b) / prices.length;
                    const variance = prices.reduce((a, b) => a + Math.pow(b - mean, 2)) / prices.length;
                    currency.volatility = Math.sqrt(variance) / mean;
                    currency.isStable = currency.volatility < 0.1;
                }
            } catch (error) {
                console.warn(`Error calculating volatility for ${currency.code}:`, error);
            }
        }
    }

    private async persistRates(): Promise<void> {
        try {
            for (const currency of this.supportedCurrencies) {
                await prisma.exchangeRate.upsert({
                    where: { currency: currency.code },
                    update: {
                        rate: currency.rate,
                        isStable: currency.isStable,
                        volatility: currency.volatility,
                        lastUpdated: currency.lastUpdated,
                    },
                    create: {
                        currency: currency.code,
                        rate: currency.rate,
                        isStable: currency.isStable,
                        volatility: currency.volatility,
                        lastUpdated: currency.lastUpdated,
                    },
                });
            }
        } catch (error) {
            console.error('Error persisting rates:', error);
        }
    }

    private async getExchangeRate(currency: string): Promise<Currency | null> {
        return this.supportedCurrencies.find(c => c.code === currency) || null;
    }

    private async getPriceHistory(
        fromCurrency: string,
        toCurrency: string,
        days: number
    ): Promise<PriceHistory[]> {
        try {
            const history = await prisma.currencyHistory.findMany({
                where: {
                    fromCurrency,
                    toCurrency,
                    timestamp: {
                        gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
                    },
                },
                orderBy: { timestamp: 'desc' },
            });

            return history.map(h => ({
                id: h.id,
                productId: '', // Not applicable for currency history
                price: h.rate,
                currency: h.toCurrency,
                timestamp: h.timestamp,
                source: 'exchange',
                conversionRate: h.rate,
            }));
        } catch (error) {
            console.error('Error getting price history:', error);
            return [];
        }
    }

    private async getCurrencyHistory(currency: string, days: number): Promise<any[]> {
        try {
            return await prisma.exchangeRate.findMany({
                where: {
                    currency,
                    lastUpdated: {
                        gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
                    },
                },
                orderBy: { lastUpdated: 'desc' },
            });
        } catch (error) {
            console.error('Error getting currency history:', error);
            return [];
        }
    }

    private async updateProductPriceInfo(
        productId: string,
        price: number,
        currency: string
    ): Promise<void> {
        try {
            const currencyInfo = await this.getExchangeRate(currency);
            const isVolatile = currencyInfo ? currencyInfo.volatility > 0.1 : false;

            await prisma.product.update({
                where: { id: productId },
                data: {
                    price,
                    currency,
                    isVolatile,
                    lastPriceUpdate: new Date(),
                },
            });
        } catch (error) {
            console.error('Error updating product price info:', error);
        }
    }

    async getPriceUpdates(limit: number = 10): Promise<any[]> {
        try {
            // Get recent price updates from products
            const recentProducts = await prisma.product.findMany({
                where: {
                    lastPriceUpdate: {
                        not: null,
                    },
                },
                orderBy: {
                    lastPriceUpdate: 'desc',
                },
                take: limit,
                select: {
                    id: true,
                    title: true,
                    price: true,
                    currency: true,
                    lastPriceUpdate: true,
                    isVolatile: true,
                },
            });

            // Get recent exchange rate updates
            const recentRates = await prisma.exchangeRate.findMany({
                where: {
                    lastUpdated: {
                        not: null,
                    },
                },
                orderBy: {
                    lastUpdated: 'desc',
                },
                take: Math.floor(limit / 2),
                select: {
                    currency: true,
                    rate: true,
                    volatility: true,
                    lastUpdated: true,
                },
            });

            // Combine and format the data
            const updates = [
                ...recentProducts.map(product => ({
                    type: 'product',
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    currency: product.currency,
                    timestamp: product.lastPriceUpdate,
                    isVolatile: product.isVolatile,
                })),
                ...recentRates.map(rate => ({
                    type: 'currency',
                    id: rate.currency,
                    title: `${rate.currency} Exchange Rate`,
                    price: rate.rate,
                    currency: 'USD',
                    timestamp: rate.lastUpdated,
                    isVolatile: rate.volatility > 0.05,
                })),
            ];

            return updates
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, limit);
        } catch (error) {
            console.error('Error getting price updates:', error);
            return [];
        }
    }
}

export default EnhancedLocalizationService;