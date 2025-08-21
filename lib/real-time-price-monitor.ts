// @ts-nocheck
import { prisma } from './db';
import EnhancedLocalizationService from './enhanced-localization-service';
import envConfig from '../env.config';

export interface PriceAlert {
    id: string;
    productId: string;
    productTitle: string;
    oldPrice: number;
    newPrice: number;
    currency: string;
    changePercent: number;
    isVolatile: boolean;
    threshold: number;
    timestamp: Date;
}

export interface MonitoringRule {
    productId: string;
    currency: string;
    threshold: number; // Percentage change threshold
    isActive: boolean;
    lastCheck: Date;
    alertWebhook?: string;
}

export class RealTimePriceMonitor {
    private localizationService: EnhancedLocalizationService;
    private monitoringInterval: NodeJS.Timeout | null = null;
    private isRunning: boolean = false;

    constructor() {
        this.localizationService = new EnhancedLocalizationService();
    }

    // Start real-time monitoring
    async startMonitoring(): Promise<void> {
        if (this.isRunning) {
            console.log('Price monitoring is already running');
            return;
        }

        this.isRunning = true;
        const intervalMs = parseInt(envConfig.PRICE_UPDATE_INTERVAL || '300000'); // Default 5 minutes

        console.log(`Starting real-time price monitoring with ${intervalMs}ms interval`);

        this.monitoringInterval = setInterval(async () => {
            try {
                await this.checkAllPrices();
            } catch (error) {
                console.error('Error in price monitoring cycle:', error);
            }
        }, intervalMs);

        // Run initial check
        await this.checkAllPrices();
    }

    // Stop monitoring
    stopMonitoring(): void {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        this.isRunning = false;
        console.log('Price monitoring stopped');
    }

    // Check all product prices
    async checkAllPrices(): Promise<PriceAlert[]> {
        try {
            console.log('Checking product prices...');

            // Get all active products
            const products = await prisma.product.findMany({
                where: {
                    isActive: true,
                    OR: [
                        { isVolatile: true },
                        { acceptsCrypto: true },
                        { lastPriceUpdate: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }, // Not updated in 24h
                    ],
                },
                include: {
                    priceHistory: {
                        orderBy: { timestamp: 'desc' },
                        take: 2,
                    },
                },
            });

            const alerts: PriceAlert[] = [];

            for (const product of products) {
                try {
                    const alert = await this.checkProductPrice(product);
                    if (alert) {
                        alerts.push(alert);
                    }
                } catch (error) {
                    console.error(`Error checking price for product ${product.id}:`, error);
                }
            }

            console.log(`Price check completed. Generated ${alerts.length} alerts.`);
            return alerts;
        } catch (error) {
            console.error('Error checking all prices:', error);
            return [];
        }
    }

    // Check individual product price
    async checkProductPrice(product: any): Promise<PriceAlert | null> {
        try {
            // Get current price from source
            const currentPrice = await this.getCurrentPrice(product);
            if (!currentPrice) {
                return null;
            }

            const oldPrice = product.price;
            const changePercent = ((currentPrice - oldPrice) / oldPrice) * 100;
            const threshold = parseFloat(envConfig.VOLATILITY_THRESHOLD || '5'); // Default 5%

            // Check if change exceeds threshold
            if (Math.abs(changePercent) >= threshold) {
                // Create price history entry
                await this.localizationService.trackPriceHistory(
                    product.id,
                    currentPrice,
                    product.currency,
                    'monitor'
                );

                // Update product price
                await prisma.product.update({
                    where: { id: product.id },
                    data: {
                        price: currentPrice,
                        lastPriceUpdate: new Date(),
                        isVolatile: Math.abs(changePercent) > 10, // Mark as volatile if >10% change
                    },
                });

                // Create alert
                const alert: PriceAlert = {
                    id: `alert-${product.id}-${Date.now()}`,
                    productId: product.id,
                    productTitle: product.title,
                    oldPrice,
                    newPrice: currentPrice,
                    currency: product.currency,
                    changePercent,
                    isVolatile: Math.abs(changePercent) > 10,
                    threshold,
                    timestamp: new Date(),
                };

                // Save alert to database
                await this.saveAlert(alert);

                // Send notifications
                await this.sendAlert(alert);

                return alert;
            }

            return null;
        } catch (error) {
            console.error(`Error checking price for product ${product.id}:`, error);
            return null;
        }
    }

    // Get current price from source
    private async getCurrentPrice(product: any): Promise<number | null> {
        try {
            if (product.acceptsCrypto && this.isCryptoCurrency(product.currency)) {
                // Get crypto price
                return await this.getCryptoPrice(product, product.currency);
            } else if (product.source && product.externalId) {
                // Scrape price from original source
                return await this.scrapePrice(product);
            } else if (product.currency !== 'USD') {
                // Convert price using exchange rates
                return await this.convertPrice(product);
            }

            return null;
        } catch (error) {
            console.error('Error getting current price:', error);
            return null;
        }
    }

    // Get cryptocurrency price
    private async getCryptoPrice(product: any, currency: string): Promise<number | null> {
        try {
            // If product is priced in crypto, get USD equivalent
            if (this.isCryptoCurrency(currency)) {
                const rate = await this.localizationService.convertPrice(1, currency, 'USD');
                return product.price * rate.convertedAmount;
            }

            // If product is priced in USD but accepts crypto, check if crypto price has changed
            const cryptoRates = await Promise.all([
                this.localizationService.convertPrice(product.price, 'USD', 'BTC'),
                this.localizationService.convertPrice(product.price, 'USD', 'ETH'),
            ]);

            // Use the most stable crypto rate for comparison
            const btcPrice = cryptoRates[0].convertedAmount;
            const ethPrice = cryptoRates[1].convertedAmount;

            // Return USD price (no change needed for crypto acceptance products)
            return product.price;
        } catch (error) {
            console.error('Error getting crypto price:', error);
            return null;
        }
    }

    // Scrape price from original source
    private async scrapePrice(product: any): Promise<number | null> {
        try {
            // This would integrate with the scraping service
            // For now, simulate price changes
            const volatility = product.isVolatile ? 0.15 : 0.05;
            const randomChange = (Math.random() - 0.5) * 2 * volatility;
            return product.price * (1 + randomChange);
        } catch (error) {
            console.error('Error scraping price:', error);
            return null;
        }
    }

    // Convert price using current exchange rates
    private async convertPrice(product: any): Promise<number | null> {
        try {
            const conversion = await this.localizationService.convertPrice(
                product.originalPrice || product.price,
                product.originalCurrency || 'USD',
                product.currency
            );
            return conversion.convertedAmount;
        } catch (error) {
            console.error('Error converting price:', error);
            return null;
        }
    }

    // Save alert to database
    private async saveAlert(alert: PriceAlert): Promise<void> {
        try {
            await prisma.priceAlert.create({
                data: {
                    productId: alert.productId,
                    oldPrice: alert.oldPrice,
                    newPrice: alert.newPrice,
                    currency: alert.currency,
                    changePercent: alert.changePercent,
                    isVolatile: alert.isVolatile,
                    threshold: alert.threshold,
                    timestamp: alert.timestamp,
                },
            });
        } catch (error) {
            console.error('Error saving alert:', error);
        }
    }

    // Send alert notifications
    private async sendAlert(alert: PriceAlert): Promise<void> {
        try {
            // Send webhook notification
            if (envConfig.PRICE_ALERT_WEBHOOK_URL) {
                await fetch(envConfig.PRICE_ALERT_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'price_alert',
                        alert,
                        timestamp: new Date().toISOString(),
                    }),
                });
            }

            // Log alert
            console.log(`🚨 Price Alert: ${alert.productTitle} - ${alert.changePercent.toFixed(2)}% change`);

            // Could also send email, SMS, or push notifications here
        } catch (error) {
            console.error('Error sending alert:', error);
        }
    }

    // Add monitoring rule
    async addMonitoringRule(rule: Omit<MonitoringRule, 'lastCheck'>): Promise<void> {
        try {
            await prisma.priceMonitoringRule.create({
                data: {
                    ...rule,
                    lastCheck: new Date(),
                },
            });
        } catch (error) {
            console.error('Error adding monitoring rule:', error);
        }
    }

    // Remove monitoring rule
    async removeMonitoringRule(productId: string, currency: string): Promise<void> {
        try {
            await prisma.priceMonitoringRule.deleteMany({
                where: {
                    productId,
                    currency,
                },
            });
        } catch (error) {
            console.error('Error removing monitoring rule:', error);
        }
    }

    // Get recent alerts
    async getRecentAlerts(limit: number = 50): Promise<PriceAlert[]> {
        try {
            const alerts = await prisma.priceAlert.findMany({
                take: limit,
                orderBy: { timestamp: 'desc' },
                include: {
                    product: {
                        select: {
                            title: true,
                        },
                    },
                },
            });

            return alerts.map(alert => ({
                id: alert.id,
                productId: alert.productId,
                productTitle: alert.product.title,
                oldPrice: alert.oldPrice,
                newPrice: alert.newPrice,
                currency: alert.currency,
                changePercent: alert.changePercent,
                isVolatile: alert.isVolatile,
                threshold: alert.threshold,
                timestamp: alert.timestamp,
            }));
        } catch (error) {
            console.error('Error getting recent alerts:', error);
            return [];
        }
    }

    // Get price history for product
    async getPriceHistory(productId: string, days: number = 30): Promise<any[]> {
        try {
            const history = await prisma.priceHistory.findMany({
                where: {
                    productId,
                    timestamp: {
                        gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
                    },
                },
                orderBy: { timestamp: 'asc' },
            });

            return history.map(h => ({
                date: h.timestamp.toISOString().split('T')[0],
                price: h.price,
                currency: h.currency,
                source: h.source,
            }));
        } catch (error) {
            console.error('Error getting price history:', error);
            return [];
        }
    }

    // Utility methods
    private isCryptoCurrency(currency: string): boolean {
        const cryptos = ['BTC', 'ETH', 'USDT', 'BNB', 'ADA', 'DOT', 'MATIC', 'SOL'];
        return cryptos.includes(currency.toUpperCase());
    }

    // Get monitoring status
    getStatus(): { isRunning: boolean; interval: string } {
        return {
            isRunning: this.isRunning,
            interval: envConfig.PRICE_UPDATE_INTERVAL || '300000',
        };
    }
}

export default RealTimePriceMonitor;