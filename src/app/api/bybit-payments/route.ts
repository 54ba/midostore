import { NextRequest, NextResponse } from 'next/server';
import BybitPaymentService from '@/lib/bybit-payment-service';

// Create service instance inside handlers to avoid issues in development mode
function getBybitService() {
    return new BybitPaymentService();
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action') || 'methods';
        const paymentId = searchParams.get('paymentId');
        const methodType = searchParams.get('type');

        const bybitService = getBybitService();
        switch (action) {
            case 'methods':
                if (methodType) {
                    const methods = await bybitService.getPaymentMethodsByType(methodType as 'crypto' | 'fiat' | 'p2p');
                    return NextResponse.json({ success: true, data: methods });
                } else {
                    const methods = await bybitService.getSupportedPaymentMethods();
                    return NextResponse.json({ success: true, data: methods });
                }

            case 'order':
                if (!paymentId) {
                    return NextResponse.json(
                        { error: 'Payment ID is required' },
                        { status: 400 }
                    );
                }
                const order = await bybitService.getPaymentOrder(paymentId);
                if (!order) {
                    return NextResponse.json(
                        { error: 'Payment order not found' },
                        { status: 404 }
                    );
                }
                return NextResponse.json({ success: true, data: order });

            case 'fees':
                const amount = searchParams.get('amount');
                const methodId = searchParams.get('methodId');

                if (!amount || !methodId) {
                    return NextResponse.json(
                        { error: 'Amount and method ID are required' },
                        { status: 400 }
                    );
                }

                const fees = await bybitService.calculateFees(parseFloat(amount), methodId);
                return NextResponse.json({ success: true, data: fees });

            case 'statistics':
                const stats = await bybitService.getPaymentStatistics();
                return NextResponse.json({ success: true, data: stats });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in Bybit payments GET:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const bybitService = getBybitService();
        const body = await request.json();
        const { action, ...data } = body;

        switch (action) {
            case 'create-order':
                const { orderId, amount, currency, methodId, metadata } = data;

                if (!orderId || !amount || !currency || !methodId) {
                    return NextResponse.json(
                        { error: 'Order ID, amount, currency, and method ID are required' },
                        { status: 400 }
                    );
                }

                const paymentOrder = await bybitService.createPaymentOrder(
                    orderId,
                    amount,
                    currency,
                    methodId,
                    metadata
                );

                return NextResponse.json({
                    success: true,
                    data: paymentOrder,
                    message: 'Payment order created successfully',
                });

            case 'update-status':
                const { paymentId, status, bybitOrderId, additionalData } = data;

                if (!paymentId || !status) {
                    return NextResponse.json(
                        { error: 'Payment ID and status are required' },
                        { status: 400 }
                    );
                }

                const updated = await bybitService.updatePaymentStatus(
                    paymentId,
                    status,
                    bybitOrderId,
                    additionalData
                );

                if (!updated) {
                    return NextResponse.json(
                        { error: 'Payment order not found' },
                        { status: 404 }
                    );
                }

                return NextResponse.json({
                    success: true,
                    message: 'Payment status updated successfully',
                });

            case 'cancel-order':
                const { paymentId: cancelPaymentId } = data;

                if (!cancelPaymentId) {
                    return NextResponse.json(
                        { error: 'Payment ID is required' },
                        { status: 400 }
                    );
                }

                const cancelled = await bybitService.cancelPaymentOrder(cancelPaymentId);

                if (!cancelled) {
                    return NextResponse.json(
                        { error: 'Failed to cancel payment order' },
                        { status: 400 }
                    );
                }

                return NextResponse.json({
                    success: true,
                    message: 'Payment order cancelled successfully',
                });

            case 'refund':
                const { paymentId: refundPaymentId, refundAmount, reason } = data;

                if (!refundPaymentId || !refundAmount || !reason) {
                    return NextResponse.json(
                        { error: 'Payment ID, refund amount, and reason are required' },
                        { status: 400 }
                    );
                }

                const refunded = await bybitService.refundPaymentOrder(
                    refundPaymentId,
                    refundAmount,
                    reason
                );

                if (!refunded) {
                    return NextResponse.json(
                        { error: 'Failed to process refund' },
                        { status: 400 }
                    );
                }

                return NextResponse.json({
                    success: true,
                    message: 'Refund processed successfully',
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in Bybit payments POST:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { paymentId, status, bybitOrderId, additionalData } = body;

        if (!paymentId || !status) {
            return NextResponse.json(
                { error: 'Payment ID and status are required' },
                { status: 400 }
            );
        }

        const updated = await bybitService.updatePaymentStatus(
            paymentId,
            status,
            bybitOrderId,
            additionalData
        );

        if (!updated) {
            return NextResponse.json(
                { error: 'Payment order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Payment status updated successfully',
        });
    } catch (error) {
        console.error('Error in Bybit payments PUT:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const paymentId = searchParams.get('paymentId');

        if (!paymentId) {
            return NextResponse.json(
                { error: 'Payment ID is required' },
                { status: 400 }
            );
        }

        const cancelled = await bybitService.cancelPaymentOrder(paymentId);

        if (!cancelled) {
            return NextResponse.json(
                { error: 'Failed to cancel payment order' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Payment order cancelled successfully',
        });
    } catch (error) {
        console.error('Error in Bybit payments DELETE:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}