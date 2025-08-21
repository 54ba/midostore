// @ts-nocheck
import cron from 'node-cron';
import { ExchangeRateService } from './exchange-rate-service';
import { ProductService } from './product-service';
import { config } from '../env.config';

export class ScheduledTaskService {
    private exchangeRateService: ExchangeRateService;
    private productService: ProductService;
    private isRunning: boolean = false;

    constructor() {
        this.exchangeRateService = new ExchangeRateService();
        this.productService = new ProductService();
    }

    start(): void {
        if (this.isRunning) {
            console.log('⚠️ Scheduled tasks are already running');
            return;
        }

        console.log('🚀 Starting scheduled tasks...');
        this.isRunning = true;

        // Update exchange rates every 15 minutes
        cron.schedule('*/15 * * * *', async () => {
            console.log('🕐 Scheduled task: Updating exchange rates...');
            try {
                await this.updateExchangeRates();
                console.log('✅ Exchange rates updated successfully');
            } catch (error) {
                console.error('❌ Failed to update exchange rates:', error);
            }
        }, {
            timezone: 'UTC'
        });

        // Update product prices every hour
        cron.schedule('0 * * * *', async () => {
            console.log('🕐 Scheduled task: Updating product prices...');
            try {
                await this.updateProductPrices();
                console.log('✅ Product prices updated successfully');
            } catch (error) {
                console.error('❌ Failed to update product prices:', error);
            }
        }, {
            timezone: 'UTC'
        });

        // Clear expired cache every 30 minutes
        cron.schedule('*/30 * * * *', () => {
            console.log('🕐 Scheduled task: Clearing expired cache...');
            try {
                this.exchangeRateService.clearExpiredCache();
                const stats = this.exchangeRateService.getCacheStats();
                console.log(`✅ Cache cleared. Stats:`, stats);
            } catch (error) {
                console.error('❌ Failed to clear cache:', error);
            }
        }, {
            timezone: 'UTC'
        });

        // Daily maintenance at 2 AM UTC
        cron.schedule('0 2 * * *', async () => {
            console.log('🕐 Scheduled task: Daily maintenance...');
            try {
                await this.performDailyMaintenance();
                console.log('✅ Daily maintenance completed');
            } catch (error) {
                console.error('❌ Daily maintenance failed:', error);
            }
        }, {
            timezone: 'UTC'
        });

        console.log('✅ Scheduled tasks started successfully');
        console.log('📅 Task Schedule:');
        console.log('  - Exchange rates: Every 15 minutes');
        console.log('  - Product prices: Every hour');
        console.log('  - Cache cleanup: Every 30 minutes');
        console.log('  - Daily maintenance: 2 AM UTC');
    }

    stop(): void {
        if (!this.isRunning) {
            console.log('⚠️ Scheduled tasks are not running');
            return;
        }

        console.log('🛑 Stopping scheduled tasks...');
        cron.getTasks().forEach(task => task.stop());
        this.isRunning = false;
        console.log('✅ Scheduled tasks stopped');
    }

    private async updateExchangeRates(): Promise<void> {
        try {
            await this.exchangeRateService.updateAllRates();

            // Get cache statistics for monitoring
            const cacheStats = this.exchangeRateService.getCacheStats();
            console.log(`📊 Cache stats after update:`, cacheStats);

        } catch (error) {
            console.error('Error updating exchange rates:', error);
            throw error;
        }
    }

    private async updateProductPrices(): Promise<void> {
        try {
            await this.productService.updateProductPrices();
        } catch (error) {
            console.error('Error updating product prices:', error);
            throw error;
        }
    }

    private async performDailyMaintenance(): Promise<void> {
        try {
            console.log('🧹 Starting daily maintenance...');

            // Update all exchange rates
            console.log('💱 Updating all exchange rates...');
            await this.updateExchangeRates();

            // Update all product prices
            console.log('💰 Updating all product prices...');
            await this.updateProductPrices();

            // Clear all expired cache
            console.log('🗑️ Clearing expired cache...');
            this.exchangeRateService.clearExpiredCache();

            // Log final cache statistics
            const cacheStats = this.exchangeRateService.getCacheStats();
            console.log('📊 Final cache statistics:', cacheStats);

            console.log('✅ Daily maintenance completed successfully');
        } catch (error) {
            console.error('Error during daily maintenance:', error);
            throw error;
        }
    }

    // Manual trigger methods for immediate execution
    async triggerExchangeRateUpdate(): Promise<void> {
        console.log('🔄 Manual trigger: Updating exchange rates...');
        await this.updateExchangeRates();
    }

    async triggerProductPriceUpdate(): Promise<void> {
        console.log('🔄 Manual trigger: Updating product prices...');
        await this.updateProductPrices();
    }

    async triggerMaintenance(): Promise<void> {
        console.log('🔄 Manual trigger: Running maintenance...');
        await this.performDailyMaintenance();
    }

    // Get service status
    getStatus(): { isRunning: boolean; nextRuns: string[] } {
        const tasks = cron.getTasks();
        const nextRuns: string[] = [];

        tasks.forEach((task: any, name) => {
            if (task.running) {
                const nextRun = task.nextDate();
                if (nextRun) {
                    nextRuns.push(`${name}: ${nextRun.toISOString()}`);
                }
            }
        });

        return {
            isRunning: this.isRunning,
            nextRuns
        };
    }
}

export default ScheduledTaskService;