// @ts-nocheck
import { prisma } from './db';
import { ExchangeRateService } from './exchange-rate-service';
import { config } from '../env.config';

export interface ShippingZone {
    id: string;
    name: string;
    countries: string[];
    baseRate: number;
    perKgRate: number;
    currency: string;
    estimatedDays: {
        min: number;
        max: number;
    };
}

export interface ShippingMethod {
    id: string;
    name: string;
    description: string;
    baseRate: number;
    perKgRate: number;
    currency: string;
    estimatedDays: {
        min: number;
        max: number;
    };
    isExpress: boolean;
    isFree: boolean;
    minOrderValue?: number;
}

export interface PricingBreakdown {
    basePrice: number;
    originalPrice: number;
    profitMargin: number;
    profitAmount: number;
    shippingCost: number;
    totalPrice: number;
    currency: string;
    savings: number;
    savingsPercentage: number;
    isProfitable: boolean;
    recommendedPrice: number;
}

export interface WinMarginConfig {
    minMargin: number;
    targetMargin: number;
    maxMargin: number;
    competitiveAdjustment: number;
    seasonalMultiplier: number;
    categoryMultiplier: number;
}

export class PricingService {
    private exchangeRateService: ExchangeRateService;

    // Shipping zones for Gulf countries
    private shippingZones: ShippingZone[] = [
        {
            id: 'gulf-express',
            name: 'Gulf Express',
            countries: ['AE', 'SA', 'KW', 'QA', 'BH', 'OM'],
            baseRate: 15.00,
            perKgRate: 8.50,
            currency: 'USD',
            estimatedDays: { min: 3, max: 7 }
        },
        {
            id: 'gulf-standard',
            name: 'Gulf Standard',
            countries: ['AE', 'SA', 'KW', 'QA', 'BH', 'OM'],
            baseRate: 8.00,
            perKgRate: 4.50,
            currency: 'USD',
            estimatedDays: { min: 7, max: 14 }
        },
        {
            id: 'gulf-economy',
            name: 'Gulf Economy',
            countries: ['AE', 'SA', 'KW', 'QA', 'BH', 'OM'],
            baseRate: 5.00,
            perKgRate: 2.50,
            currency: 'USD',
            estimatedDays: { min: 14, max: 21 }
        }
    ];

    // Shipping methods
    private shippingMethods: ShippingMethod[] = [
        {
            id: 'express',
            name: 'Express Shipping',
            description: 'Fast delivery within 3-7 business days',
            baseRate: 25.00,
            perKgRate: 12.00,
            currency: 'USD',
            estimatedDays: { min: 3, max: 7 },
            isExpress: true,
            isFree: false
        },
        {
            id: 'standard',
            name: 'Standard Shipping',
            description: 'Regular delivery within 7-14 business days',
            baseRate: 12.00,
            perKgRate: 6.00,
            currency: 'USD',
            estimatedDays: { min: 7, max: 14 },
            isExpress: false,
            isFree: false
        },
        {
            id: 'economy',
            name: 'Economy Shipping',
            description: 'Budget-friendly delivery within 14-21 business days',
            baseRate: 8.00,
            perKgRate: 3.50,
            currency: 'USD',
            estimatedDays: { min: 14, max: 21 },
            isExpress: false,
            isFree: false
        },
        {
            id: 'free-shipping',
            name: 'Free Shipping',
            description: 'Free delivery on orders over $100',
            baseRate: 0.00,
            perKgRate: 0.00,
            currency: 'USD',
            estimatedDays: { min: 7, max: 14 },
            isExpress: false,
            isFree: true,
            minOrderValue: 100.00
        }
    ];

    // Win margin configurations by category
    private winMarginConfigs: Record<string, WinMarginConfig> = {
        electronics: {
            minMargin: 15,
            targetMargin: 25,
            maxMargin: 35,
            competitiveAdjustment: 0.95,
            seasonalMultiplier: 1.0,
            categoryMultiplier: 1.1
        },
        toys: {
            minMargin: 20,
            targetMargin: 30,
            maxMargin: 40,
            competitiveAdjustment: 0.98,
            seasonalMultiplier: 1.2,
            categoryMultiplier: 1.0
        },
        beauty: {
            minMargin: 25,
            targetMargin: 35,
            maxMargin: 45,
            competitiveAdjustment: 0.97,
            seasonalMultiplier: 1.1,
            categoryMultiplier: 1.15
        },
        home: {
            minMargin: 18,
            targetMargin: 28,
            maxMargin: 38,
            competitiveAdjustment: 0.96,
            seasonalMultiplier: 1.0,
            categoryMultiplier: 1.05
        },
        clothing: {
            minMargin: 22,
            targetMargin: 32,
            maxMargin: 42,
            competitiveAdjustment: 0.94,
            seasonalMultiplier: 1.15,
            categoryMultiplier: 1.0
        },
        sports: {
            minMargin: 20,
            targetMargin: 30,
            maxMargin: 40,
            competitiveAdjustment: 0.95,
            seasonalMultiplier: 1.1,
            categoryMultiplier: 1.0
        }
    };

    constructor() {
        this.exchangeRateService = new ExchangeRateService();
    }

    /**
     * Calculate shipping cost based on weight, dimensions, and destination
     */
    async calculateShippingCost(
        weight: number,
        dimensions: { length: number; width: number; height: number },
        destinationCountry: string,
        shippingMethod: string = 'standard',
        orderValue: number = 0
    ): Promise<{
        cost: number;
        currency: string;
        estimatedDays: { min: number; max: number };
        method: ShippingMethod;
    }> {
        const method = this.shippingMethods.find(m => m.id === shippingMethod) || this.shippingMethods[1];

        // Check if free shipping applies
        if (method.isFree && method.minOrderValue && orderValue >= method.minOrderValue) {
            return {
                cost: 0,
                currency: method.currency,
                estimatedDays: method.estimatedDays,
                method
            };
        }

        // Calculate dimensional weight (length × width × height ÷ 139)
        const dimensionalWeight = (dimensions.length * dimensions.width * dimensions.height) / 139;
        const chargeableWeight = Math.max(weight, dimensionalWeight);

        // Calculate shipping cost
        let cost = method.baseRate + (chargeableWeight * method.perKgRate);

        // Apply destination adjustments
        const zone = this.shippingZones.find(z => z.countries.includes(destinationCountry));
        if (zone) {
            // Convert to zone currency if different
            if (zone.currency !== method.currency) {
                cost = await this.exchangeRateService.convertPrice(cost, method.currency, zone.currency);
            }
        }

        // Apply seasonal adjustments
        cost = this.applySeasonalAdjustments(cost, new Date());

        return {
            cost: Math.round(cost * 100) / 100, // Round to 2 decimal places
            currency: method.currency,
            estimatedDays: method.estimatedDays,
            method
        };
    }

    /**
     * Calculate optimal pricing with win margins
     */
    async calculateOptimalPricing(
        alibabaPrice: number,
        alibabaCurrency: string = 'USD',
        category: string,
        targetCountry: string,
        targetCurrency: string,
        weight: number,
        dimensions: { length: number; width: number; height: number },
        competitivePrice?: number
    ): Promise<PricingBreakdown> {
        // Convert Alibaba price to target currency
        const basePrice = await this.exchangeRateService.convertPrice(
            alibabaPrice,
            alibabaCurrency,
            targetCurrency
        );

        // Get win margin configuration for category
        const marginConfig = this.winMarginConfigs[category.toLowerCase()] || this.winMarginConfigs.electronics;

        // Calculate shipping cost
        const shippingInfo = await this.calculateShippingCost(weight, dimensions, targetCountry, 'standard');
        const shippingCost = await this.exchangeRateService.convertPrice(
            shippingInfo.cost,
            shippingInfo.currency,
            targetCurrency
        );

        // Calculate competitive adjustment
        let competitiveAdjustment = marginConfig.competitiveAdjustment;
        if (competitivePrice) {
            const competitivePriceInTargetCurrency = await this.exchangeRateService.convertPrice(
                competitivePrice,
                alibabaCurrency,
                targetCurrency
            );

            // Adjust margin if competitive price is significantly lower
            if (competitivePriceInTargetCurrency < basePrice * 1.2) {
                competitiveAdjustment *= 0.9; // Reduce margin to stay competitive
            }
        }

        // Calculate seasonal multiplier
        const seasonalMultiplier = this.getSeasonalMultiplier(new Date(), category);

        // Calculate optimal profit margin
        let profitMargin = marginConfig.targetMargin * competitiveAdjustment * seasonalMultiplier * marginConfig.categoryMultiplier;
        profitMargin = Math.max(marginConfig.minMargin, Math.min(marginConfig.maxMargin, profitMargin));

        // Calculate final price
        const profitAmount = basePrice * (profitMargin / 100);
        const totalPrice = basePrice + profitAmount + shippingCost;
        const originalPrice = basePrice + shippingCost;

        // Calculate savings
        const savings = originalPrice - totalPrice;
        const savingsPercentage = (savings / originalPrice) * 100;

        // Determine if profitable
        const isProfitable = totalPrice > (basePrice + shippingCost);

        // Calculate recommended price (with some buffer for negotiations)
        const recommendedPrice = totalPrice * 1.05;

        return {
            basePrice,
            originalPrice,
            profitMargin: Math.round(profitMargin * 100) / 100,
            profitAmount: Math.round(profitAmount * 100) / 100,
            shippingCost: Math.round(shippingCost * 100) / 100,
            totalPrice: Math.round(totalPrice * 100) / 100,
            currency: targetCurrency,
            savings: Math.round(savings * 100) / 100,
            savingsPercentage: Math.round(savingsPercentage * 100) / 100,
            isProfitable,
            recommendedPrice: Math.round(recommendedPrice * 100) / 100
        };
    }

    /**
     * Get seasonal multiplier based on date and category
     */
    private getSeasonalMultiplier(date: Date, category: string): number {
        const month = date.getMonth() + 1; // 1-12

        // Holiday season (November-December)
        if (month >= 11 || month <= 1) {
            if (category === 'toys' || category === 'electronics') {
                return 1.3; // Higher margins during holidays
            }
            return 1.15;
        }

        // Back to school (August-September)
        if (month >= 8 && month <= 9) {
            if (category === 'electronics' || category === 'clothing') {
                return 1.2;
            }
            return 1.1;
        }

        // Summer season (June-August)
        if (month >= 6 && month <= 8) {
            if (category === 'sports' || category === 'clothing') {
                return 1.1;
            }
            return 1.0;
        }

        return 1.0; // Default multiplier
    }

    /**
     * Apply seasonal adjustments to shipping costs
     */
    private applySeasonalAdjustments(cost: number, date: Date): number {
        const month = date.getMonth() + 1;

        // Holiday season shipping surcharge
        if (month >= 11 || month <= 1) {
            return cost * 1.2; // 20% surcharge during holidays
        }

        // Peak season (summer)
        if (month >= 6 && month <= 8) {
            return cost * 1.1; // 10% surcharge during summer
        }

        return cost;
    }

    /**
     * Get available shipping methods for a destination
     */
    getAvailableShippingMethods(
        destinationCountry: string,
        orderValue: number = 0,
        weight: number = 0
    ): ShippingMethod[] {
        const availableMethods = this.shippingMethods.filter(method => {
            // Check if free shipping applies
            if (method.isFree && method.minOrderValue) {
                return orderValue >= method.minOrderValue;
            }
            return true;
        });

        return availableMethods.map(method => ({
            ...method,
            estimatedCost: this.estimateShippingCost(method, weight, destinationCountry)
        }));
    }

    /**
     * Estimate shipping cost for a method
     */
    private estimateShippingCost(method: ShippingMethod, weight: number, destinationCountry: string): number {
        const zone = this.shippingZones.find(z => z.countries.includes(destinationCountry));
        if (!zone) return method.baseRate;

        let cost = method.baseRate + (weight * method.perKgRate);

        // Apply zone adjustments
        if (zone.currency !== method.currency) {
            // This would need actual conversion, but for now return in method currency
            return cost;
        }

        return cost;
    }

    /**
     * Update product pricing with new win margins
     */
    async updateProductPricing(productId: string): Promise<void> {
        try {
            const product = await prisma.product.findUnique({
                where: { id: productId },
                include: { supplier: true }
            });

            if (!product) return;

            // Get current market data (this would typically come from external APIs)
            const marketData = await this.getMarketData(product.category, product.externalId);

            // Calculate optimal pricing for each Gulf country
            for (const gulfCountry of config.gulfCountries) {
                const pricing = await this.calculateOptimalPricing(
                    Number(product.price),
                    product.currency,
                    product.category || 'electronics',
                    gulfCountry.code,
                    gulfCountry.currency,
                    product.shippingWeight || 1,
                    this.parseShippingDimensions(product.shippingDimensions),
                    marketData?.competitivePrice
                );

                // Update localization
                await prisma.productLocalization.upsert({
                    where: {
                        productId_locale: {
                            productId,
                            locale: gulfCountry.locale,
                        },
                    },
                    update: {
                        price: pricing.totalPrice,
                        currency: gulfCountry.currency,
                    },
                    create: {
                        productId,
                        locale: gulfCountry.locale,
                        title: product.title,
                        description: product.description,
                        price: pricing.totalPrice,
                        currency: gulfCountry.currency,
                    },
                });
            }

            // Update main product with new pricing
            const uaePricing = await this.calculateOptimalPricing(
                Number(product.price),
                product.currency,
                product.category || 'electronics',
                'AE',
                'AED',
                product.shippingWeight || 1,
                this.parseShippingDimensions(product.shippingDimensions)
            );

            await prisma.product.update({
                where: { id: productId },
                data: {
                    gulfPrice: uaePricing.totalPrice,
                    gulfCurrency: 'AED',
                    profitMargin: uaePricing.profitMargin,
                },
            });

        } catch (error) {
            console.error(`Error updating product pricing for ${productId}:`, error);
        }
    }

    /**
     * Parse shipping dimensions string
     */
    private parseShippingDimensions(dimensionsString?: string): { length: number; width: number; height: number } {
        if (!dimensionsString) {
            return { length: 10, width: 10, height: 10 }; // Default dimensions
        }

        try {
            const [length, width, height] = dimensionsString.split('x').map(Number);
            return { length: length || 10, width: width || 10, height: height || 10 };
        } catch {
            return { length: 10, width: 10, height: 10 };
        }
    }

    /**
     * Get market data for competitive pricing (placeholder)
     */
    private async getMarketData(category?: string, externalId?: string): Promise<{ competitivePrice?: number } | null> {
        // This would typically integrate with external APIs to get competitive pricing
        // For now, return null to use default margins
        return null;
    }

    /**
     * Get pricing breakdown for display
     */
    async getPricingBreakdown(
        productId: string,
        locale: string = 'en-AE',
        quantity: number = 1
    ): Promise<PricingBreakdown | null> {
        try {
            const product = await prisma.product.findUnique({
                where: { id: productId },
                include: { supplier: true }
            });

            if (!product) return null;

            const localization = await prisma.productLocalization.findFirst({
                where: { productId, locale, isActive: true }
            });

            if (!localization) return null;

            const gulfCountry = config.gulfCountries.find(gc => gc.locale === locale);
            if (!gulfCountry) return null;

            const pricing = await this.calculateOptimalPricing(
                Number(product.price),
                product.currency,
                product.category || 'electronics',
                gulfCountry.code,
                gulfCountry.currency,
                product.shippingWeight || 1,
                this.parseShippingDimensions(product.shippingDimensions)
            );

            // Apply quantity multiplier
            if (quantity > 1) {
                pricing.totalPrice *= quantity;
                pricing.shippingCost *= Math.min(quantity * 0.8, 1); // Shipping discount for bulk
                pricing.profitAmount *= quantity;
            }

            return pricing;
        } catch (error) {
            console.error(`Error getting pricing breakdown for ${productId}:`, error);
            return null;
        }
    }
}