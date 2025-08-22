import { NextRequest, NextResponse } from 'next/server';
import EnhancedLocalizationService from '@/lib/enhanced-localization-service';

const localizationService = new EnhancedLocalizationService();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action') || 'languages';
        const productId = searchParams.get('productId');
        const currency = searchParams.get('currency') || 'USD';
        const language = searchParams.get('language') || 'en';

        switch (action) {
            case 'languages':
                return NextResponse.json({
                    success: true,
                    data: localizationService.getSupportedLanguages(),
                });

            case 'currencies':
                return NextResponse.json({
                    success: true,
                    data: localizationService.getSupportedCurrencies(),
                });

            case 'shipping-zones':
                return NextResponse.json({
                    success: true,
                    data: localizationService.getShippingZones(),
                });

            case 'localized-product':
                if (!productId) {
                    return NextResponse.json(
                        { error: 'Product ID is required' },
                        { status: 400 }
                    );
                }

                const product = await localizationService.getLocalizedProduct(
                    productId,
                    currency,
                    language
                );

                return NextResponse.json({
                    success: true,
                    data: product,
                });

            case 'shipping-calculator':
                const countryCode = searchParams.get('countryCode');
                const weight = parseFloat(searchParams.get('weight') || '1');
                const orderValue = parseFloat(searchParams.get('orderValue') || '0');

                if (!countryCode) {
                    return NextResponse.json(
                        { error: 'Country code is required' },
                        { status: 400 }
                    );
                }

                const shipping = await localizationService.calculateShipping(
                    countryCode,
                    weight,
                    orderValue,
                    currency
                );

                return NextResponse.json({
                    success: true,
                    data: shipping,
                });

            case 'price-updates':
                const limit = parseInt(searchParams.get('limit') || '10');
                const priceUpdates = await localizationService.getPriceUpdates(limit);

                return NextResponse.json({
                    success: true,
                    data: priceUpdates,
                });

            case 'currency-rates':
                const currencyRates = await localizationService.getCurrencyRates();
                return NextResponse.json({
                    success: true,
                    data: currencyRates,
                });

            case 'language-support':
                const languageSupport = await localizationService.getSupportedLanguages();
                return NextResponse.json({
                    success: true,
                    data: languageSupport,
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in localization GET:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, ...data } = body;

        switch (action) {
            case 'convert-price':
                const { amount, fromCurrency, toCurrency, includeHistory } = data;

                if (!amount || !fromCurrency || !toCurrency) {
                    return NextResponse.json(
                        { error: 'Amount, fromCurrency, and toCurrency are required' },
                        { status: 400 }
                    );
                }

                const conversion = await localizationService.convertPrice(
                    amount,
                    fromCurrency,
                    toCurrency,
                    includeHistory
                );

                return NextResponse.json({
                    success: true,
                    data: conversion,
                });

            case 'track-price-history':
                const { productId, price, currency, source } = data;

                if (!productId || !price || !currency) {
                    return NextResponse.json(
                        { error: 'Product ID, price, and currency are required' },
                        { status: 400 }
                    );
                }

                await localizationService.trackPriceHistory(
                    productId,
                    price,
                    currency,
                    source
                );

                return NextResponse.json({
                    success: true,
                    message: 'Price history tracked successfully',
                });

            case 'update-exchange-rates':
                await localizationService.updateExchangeRates();

                return NextResponse.json({
                    success: true,
                    message: 'Exchange rates updated successfully',
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in localization POST:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}