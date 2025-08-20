import { NextRequest, NextResponse } from 'next/server';
import { ExchangeRateService } from '../../../../../lib/exchange-rate-service';
import { ScheduledTaskService } from '../../../../../lib/scheduled-tasks';

export async function POST(request: NextRequest) {
    try {
        const { action = 'update' } = await request.json();

        const exchangeRateService = new ExchangeRateService();
        const scheduledTaskService = new ScheduledTaskService();

        let result: any = {};

        switch (action) {
            case 'update':
                console.log('🔄 Manual exchange rate update triggered');
                await exchangeRateService.updateAllRates();
                result = {
                    success: true,
                    message: 'Exchange rates updated successfully',
                    timestamp: new Date().toISOString(),
                };
                break;

            case 'update-product-prices':
                console.log('💰 Manual product price update triggered');
                await scheduledTaskService.triggerProductPriceUpdate();
                result = {
                    success: true,
                    message: 'Product prices updated successfully',
                    timestamp: new Date().toISOString(),
                };
                break;

            case 'maintenance':
                console.log('🧹 Manual maintenance triggered');
                await scheduledTaskService.triggerMaintenance();
                result = {
                    success: true,
                    message: 'Maintenance completed successfully',
                    timestamp: new Date().toISOString(),
                };
                break;

            case 'cache-stats':
                const cacheStats = exchangeRateService.getCacheStats();
                result = {
                    success: true,
                    data: cacheStats,
                    timestamp: new Date().toISOString(),
                };
                break;

            case 'clear-cache':
                exchangeRateService.clearExpiredCache();
                const clearedStats = exchangeRateService.getCacheStats();
                result = {
                    success: true,
                    message: 'Cache cleared successfully',
                    data: clearedStats,
                    timestamp: new Date().toISOString(),
                };
                break;

            default:
                return NextResponse.json(
                    { error: 'Invalid action. Valid actions: update, update-product-prices, maintenance, cache-stats, clear-cache' },
                    { status: 400 }
                );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error in exchange rate update:', error);
        return NextResponse.json(
            {
                error: 'Failed to update exchange rates',
                details: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');

        if (action === 'status') {
            const scheduledTaskService = new ScheduledTaskService();
            const status = scheduledTaskService.getStatus();

            return NextResponse.json({
                success: true,
                data: status,
                timestamp: new Date().toISOString(),
            });
        }

        // Default: return cache statistics
        const exchangeRateService = new ExchangeRateService();
        const cacheStats = exchangeRateService.getCacheStats();

        return NextResponse.json({
            success: true,
            data: {
                cache: cacheStats,
                message: 'Use POST /api/exchange-rates/update with action to trigger updates',
                availableActions: [
                    'update',
                    'update-product-prices',
                    'maintenance',
                    'cache-stats',
                    'clear-cache'
                ]
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error getting exchange rate status:', error);
        return NextResponse.json(
            { error: 'Failed to get exchange rate status' },
            { status: 500 }
        );
    }
}