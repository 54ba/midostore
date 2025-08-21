import { NextRequest, NextResponse } from 'next/server';
import CryptoPaymentService from '@/lib/crypto-payment-service';

const cryptoService = new CryptoPaymentService();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action') || 'supported-cryptos';
        const paymentId = searchParams.get('paymentId');
        const currency = searchParams.get('currency');

        switch (action) {
            case 'supported-cryptos':
                return NextResponse.json({
                    success: true,
                    data: cryptoService.getSupportedCryptos(),
                });

            case 'network-info':
                if (!currency) {
                    return NextResponse.json(
                        { error: 'Currency is required' },
                        { status: 400 }
                    );
                }

                const networkInfo = cryptoService.getNetworkInfo(currency);
                if (!networkInfo) {
                    return NextResponse.json(
                        { error: 'Unsupported cryptocurrency' },
                        { status: 400 }
                    );
                }

                return NextResponse.json({
                    success: true,
                    data: networkInfo,
                });

            case 'payment-status':
                if (!paymentId) {
                    return NextResponse.json(
                        { error: 'Payment ID is required' },
                        { status: 400 }
                    );
                }

                const payment = await cryptoService.checkPaymentStatus(paymentId);
                if (!payment) {
                    return NextResponse.json(
                        { error: 'Payment not found' },
                        { status: 404 }
                    );
                }

                return NextResponse.json({
                    success: true,
                    data: payment,
                });

            case 'crypto-rate':
                if (!currency) {
                    return NextResponse.json(
                        { error: 'Currency is required' },
                        { status: 400 }
                    );
                }

                const rate = await cryptoService.getCryptoRate(currency);
                return NextResponse.json({
                    success: true,
                    data: { currency, rate, timestamp: new Date() },
                });

            case 'wallet-balance':
                if (!currency) {
                    return NextResponse.json(
                        { error: 'Currency is required' },
                        { status: 400 }
                    );
                }

                const balance = await cryptoService.getWalletBalance(currency);
                return NextResponse.json({
                    success: true,
                    data: { currency, balance, timestamp: new Date() },
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in crypto GET:', error);
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
            case 'create-payment':
                const { orderId, currency, usdAmount } = data;

                if (!orderId || !currency || !usdAmount) {
                    return NextResponse.json(
                        { error: 'Order ID, currency, and USD amount are required' },
                        { status: 400 }
                    );
                }

                const payment = await cryptoService.createCryptoPayment(
                    orderId,
                    currency,
                    usdAmount
                );

                return NextResponse.json({
                    success: true,
                    data: payment,
                });

            case 'update-transaction':
                const { paymentId, txHash } = data;

                if (!paymentId || !txHash) {
                    return NextResponse.json(
                        { error: 'Payment ID and transaction hash are required' },
                        { status: 400 }
                    );
                }

                const updated = await cryptoService.updatePaymentTransaction(
                    paymentId,
                    txHash
                );

                return NextResponse.json({
                    success: updated,
                    message: updated ? 'Transaction updated successfully' : 'Failed to update transaction',
                });

            case 'scrape-crypto-products':
                const { source, category, pageCount } = data;

                if (!source) {
                    return NextResponse.json(
                        { error: 'Source is required' },
                        { status: 400 }
                    );
                }

                const products = await cryptoService.scrapeCryptoProducts(
                    source,
                    category || 'crypto',
                    pageCount || 1
                );

                return NextResponse.json({
                    success: true,
                    data: products,
                    message: `Scraped ${products.length} crypto products from ${source}`,
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in crypto POST:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}