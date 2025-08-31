import { NextRequest, NextResponse } from 'next/server';
import CryptoPaymentService from '@/lib/crypto-payment-service';

const cryptoService = new CryptoPaymentService();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action') || 'transactions';
        const transactionId = searchParams.get('transactionId');
        const userId = searchParams.get('userId');

        switch (action) {
            case 'transactions':
                if (transactionId) {
                    const transaction = await cryptoService.getP2PTransaction(transactionId);
                    if (!transaction) {
                        return NextResponse.json(
                            { error: 'P2P transaction not found' },
                            { status: 404 }
                        );
                    }
                    return NextResponse.json({ success: true, data: transaction });
                } else if (userId) {
                    // Get all transactions for a specific user
                    // This would require additional methods in the service
                    return NextResponse.json({
                        success: true,
                        data: [],
                        message: 'User transaction history not implemented yet',
                    });
                } else {
                    return NextResponse.json({
                        success: true,
                        data: [],
                        message: 'Please provide transactionId or userId',
                    });
                }

            case 'rates':
                const currency = searchParams.get('currency');
                if (!currency) {
                    return NextResponse.json(
                        { error: 'Currency is required' },
                        { status: 400 }
                    );
                }
                const rate = await cryptoService.getCryptoRate(currency);
                return NextResponse.json({ success: true, data: rate });

            case 'supported-cryptos':
                const cryptos = cryptoService.getSupportedCryptos();
                return NextResponse.json({ success: true, data: cryptos });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in P2P GET:', error);
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
            case 'create-transaction':
                const { orderId, buyerId, sellerId, amount, currency } = data;

                if (!orderId || !buyerId || !sellerId || !amount || !currency) {
                    return NextResponse.json(
                        { error: 'Order ID, buyer ID, seller ID, amount, and currency are required' },
                        { status: 400 }
                    );
                }

                const transaction = await cryptoService.createP2PTransaction(
                    orderId,
                    buyerId,
                    sellerId,
                    amount,
                    currency
                );

                return NextResponse.json({
                    success: true,
                    data: transaction,
                    message: 'P2P transaction created successfully',
                });

            case 'update-status':
                const { transactionId, status } = data;

                if (!transactionId || !status) {
                    return NextResponse.json(
                        { error: 'Transaction ID and status are required' },
                        { status: 400 }
                    );
                }

                const updated = await cryptoService.updateP2PStatus(transactionId, status);

                if (!updated) {
                    return NextResponse.json(
                        { error: 'Failed to update P2P transaction status' },
                        { status: 400 }
                    );
                }

                return NextResponse.json({
                    success: true,
                    message: 'P2P transaction status updated successfully',
                });

            case 'dispute':
                const { transactionId: disputeTransactionId, reason, evidence } = data;

                if (!disputeTransactionId || !reason) {
                    return NextResponse.json(
                        { error: 'Transaction ID and reason are required' },
                        { status: 400 }
                    );
                }

                // Update status to disputed
                const disputed = await cryptoService.updateP2PStatus(
                    disputeTransactionId,
                    'disputed'
                );

                if (!disputed) {
                    return NextResponse.json(
                        { error: 'Failed to create dispute' },
                        { status: 400 }
                    );
                }

                return NextResponse.json({
                    success: true,
                    message: 'Dispute created successfully',
                    data: {
                        transactionId: disputeTransactionId,
                        status: 'disputed',
                        reason,
                        evidence,
                        createdAt: new Date().toISOString(),
                    },
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in P2P POST:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { transactionId, status } = body;

        if (!transactionId || !status) {
            return NextResponse.json(
                { error: 'Transaction ID and status are required' },
                { status: 400 }
            );
        }

        const updated = await cryptoService.updateP2PStatus(transactionId, status);

        if (!updated) {
            return NextResponse.json(
                { error: 'Failed to update P2P transaction status' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'P2P transaction status updated successfully',
        });
    } catch (error) {
        console.error('Error in P2P PUT:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}