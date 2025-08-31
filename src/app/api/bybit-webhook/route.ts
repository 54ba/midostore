import { NextRequest, NextResponse } from 'next/server';
import BybitPaymentService from '@/lib/bybit-payment-service';
import crypto from 'crypto';

const bybitService = new BybitPaymentService();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const signature = request.headers.get('bybit-signature');
        const timestamp = request.headers.get('bybit-timestamp');

        // Verify webhook signature (in production, implement proper signature verification)
        if (process.env.BYBIT_WEBHOOK_SECRET && signature && timestamp) {
            const isValid = verifyWebhookSignature(
                body,
                signature,
                timestamp,
                process.env.BYBIT_WEBHOOK_SECRET
            );

            if (!isValid) {
                console.error('Invalid webhook signature');
                return NextResponse.json(
                    { error: 'Invalid signature' },
                    { status: 401 }
                );
            }
        }

        console.log('Received Bybit webhook:', {
            body,
            signature,
            timestamp,
            headers: Object.fromEntries(request.headers.entries()),
        });

        // Process the webhook
        const success = await bybitService.processWebhook(body);

        if (success) {
            return NextResponse.json({ success: true, message: 'Webhook processed successfully' });
        } else {
            return NextResponse.json(
                { error: 'Failed to process webhook' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error processing Bybit webhook:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    // Health check endpoint
    return NextResponse.json({
        success: true,
        message: 'Bybit webhook endpoint is active',
        timestamp: new Date().toISOString(),
    });
}

function verifyWebhookSignature(
    body: any,
    signature: string,
    timestamp: string,
    secret: string
): boolean {
    try {
        const payload = JSON.stringify(body);
        const message = timestamp + payload;
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(message)
            .digest('hex');

        return crypto.timingSafeEqual(
            Buffer.from(signature, 'hex'),
            Buffer.from(expectedSignature, 'hex')
        );
    } catch (error) {
        console.error('Error verifying webhook signature:', error);
        return false;
    }
}