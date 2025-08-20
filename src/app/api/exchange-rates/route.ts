import { NextRequest, NextResponse } from 'next/server';
import { ExchangeRateService } from '../../../../lib/exchange-rate-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const fromCurrency = searchParams.get('from') || 'USD';
        const toCurrency = searchParams.get('to');

        const exchangeRateService = new ExchangeRateService();

        if (toCurrency) {
            // Get specific exchange rate
            const rate = await exchangeRateService.getExchangeRate(fromCurrency, toCurrency);
            return NextResponse.json({
                success: true,
                data: {
                    fromCurrency,
                    toCurrency,
                    rate,
                    timestamp: new Date().toISOString(),
                },
            });
        } else {
            // Get all Gulf country rates
            const gulfRates = await exchangeRateService.getGulfCountryRates();
            return NextResponse.json({
                success: true,
                data: {
                    baseCurrency: fromCurrency,
                    rates: gulfRates,
                    timestamp: new Date().toISOString(),
                },
            });
        }
    } catch (error) {
        console.error('Error getting exchange rates:', error);
        return NextResponse.json(
            { error: 'Failed to get exchange rates' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const exchangeRateService = new ExchangeRateService();

        // Update all exchange rates
        await exchangeRateService.updateAllRates();

        return NextResponse.json({
            success: true,
            message: 'Exchange rates updated successfully',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error updating exchange rates:', error);
        return NextResponse.json(
            { error: 'Failed to update exchange rates' },
            { status: 500 }
        );
    }
}