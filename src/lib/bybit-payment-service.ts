import { RestClientV5 } from 'bybit-api';

export interface BybitPaymentOrder {
    id: string;
    orderId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    bybitOrderId?: string;
    paymentUrl?: string;
    qrCode?: string;
    createdAt: Date;
    updatedAt: Date;
    metadata: Record<string, any>;
}

export interface BybitPaymentMethod {
    id: string;
    name: string;
    type: 'crypto' | 'fiat' | 'p2p';
    currencies: string[];
    minAmount: number;
    maxAmount: number;
    fees: {
        percentage: number;
        fixed: number;
    };
    processingTime: string;
    enabled: boolean;
}

export interface BybitWebhookData {
    event: string;
    timestamp: number;
    data: {
        orderId: string;
        status: string;
        amount: number;
        currency: string;
        txHash?: string;
        [key: string]: any;
    };
}

export default class BybitPaymentService {
    private bybitApi: RestClientV5;
    private orderStore: Map<string, BybitPaymentOrder>;
    private supportedMethods: BybitPaymentMethod[];

    constructor() {
        const apiKey = process.env.BYBIT_API_KEY;
        const secretKey = process.env.BYBIT_SECRET_KEY;
        const testnet = process.env.BYBIT_TESTNET === 'true';

        if (!apiKey || !secretKey) {
            console.warn('Bybit API credentials not found. Running in demo mode.');
        }

        this.bybitApi = new RestClientV5({
            key: apiKey || 'demo',
            secret: secretKey || 'demo',
            testnet: testnet || false,
        });

        this.orderStore = new Map();
        this.initializeSupportedMethods();
    }

    private initializeSupportedMethods() {
        this.supportedMethods = [
            {
                id: 'crypto_btc',
                name: 'Bitcoin Payment',
                type: 'crypto',
                currencies: ['BTC'],
                minAmount: 0.001,
                maxAmount: 10,
                fees: { percentage: 0.5, fixed: 0 },
                processingTime: '10-30 minutes',
                enabled: true,
            },
            {
                id: 'crypto_eth',
                name: 'Ethereum Payment',
                type: 'crypto',
                currencies: ['ETH'],
                minAmount: 0.01,
                maxAmount: 100,
                fees: { percentage: 0.5, fixed: 0 },
                processingTime: '2-5 minutes',
                enabled: true,
            },
            {
                id: 'crypto_usdt',
                name: 'USDT Payment',
                type: 'crypto',
                currencies: ['USDT'],
                minAmount: 10,
                maxAmount: 10000,
                fees: { percentage: 0.1, fixed: 1 },
                processingTime: '1-3 minutes',
                enabled: true,
            },
            {
                id: 'p2p_escrow',
                name: 'P2P Escrow',
                type: 'p2p',
                currencies: ['BTC', 'ETH', 'USDT', 'BNB', 'SOL'],
                minAmount: 1,
                maxAmount: 50000,
                fees: { percentage: 0.2, fixed: 5 },
                processingTime: '5-15 minutes',
                enabled: true,
            },
            {
                id: 'fiat_bank',
                name: 'Bank Transfer',
                type: 'fiat',
                currencies: ['USD', 'EUR', 'GBP'],
                minAmount: 50,
                maxAmount: 100000,
                fees: { percentage: 1.5, fixed: 10 },
                processingTime: '1-3 business days',
                enabled: true,
            },
        ];
    }

    async createPaymentOrder(
        orderId: string,
        amount: number,
        currency: string,
        methodId: string,
        metadata: Record<string, any> = {}
    ): Promise<BybitPaymentOrder> {
        // Validate payment method
        const method = this.supportedMethods.find(m => m.id === methodId && m.enabled);
        if (!method) {
            throw new Error(`Unsupported or disabled payment method: ${methodId}`);
        }

        // Validate currency
        if (!method.currencies.includes(currency)) {
            throw new Error(`Currency ${currency} not supported for method ${methodId}`);
        }

        // Validate amount
        if (amount < method.minAmount || amount > method.maxAmount) {
            throw new Error(`Amount must be between ${method.minAmount} and ${method.maxAmount} ${currency}`);
        }

        // Generate unique payment ID
        const paymentId = `bybit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Create payment order
        const paymentOrder: BybitPaymentOrder = {
            id: paymentId,
            orderId,
            amount,
            currency,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
            metadata: {
                methodId,
                methodName: method.name,
                fees: method.fees,
                processingTime: method.processingTime,
                ...metadata,
            },
        };

        // Store order locally
        this.orderStore.set(paymentId, paymentOrder);

        try {
            if (process.env.BYBIT_API_KEY && process.env.BYBIT_SECRET_KEY) {
                // Create actual Bybit order
                await this.createBybitOrder(paymentOrder, method);
            } else {
                // Demo mode - simulate order creation
                await this.simulateBybitOrder(paymentOrder, method);
            }
        } catch (error) {
            console.error('Failed to create Bybit order:', error);
            paymentOrder.status = 'failed';
            this.orderStore.set(paymentId, paymentOrder);
            throw error;
        }

        return paymentOrder;
    }

    async getPaymentOrder(paymentId: string): Promise<BybitPaymentOrder | null> {
        return this.orderStore.get(paymentId) || null;
    }

    async updatePaymentStatus(
        paymentId: string,
        status: BybitPaymentOrder['status'],
        bybitOrderId?: string,
        additionalData?: Record<string, any>
    ): Promise<boolean> {
        const order = this.orderStore.get(paymentId);
        if (!order) {
            return false;
        }

        order.status = status;
        order.updatedAt = new Date();

        if (bybitOrderId) {
            order.bybitOrderId = bybitOrderId;
        }

        if (additionalData) {
            order.metadata = { ...order.metadata, ...additionalData };
        }

        this.orderStore.set(paymentId, order);
        return true;
    }

    async getSupportedPaymentMethods(): Promise<BybitPaymentMethod[]> {
        return this.supportedMethods.filter(method => method.enabled);
    }

    async getPaymentMethodsByType(type: 'crypto' | 'fiat' | 'p2p'): Promise<BybitPaymentMethod[]> {
        return this.supportedMethods.filter(method => method.type === type && method.enabled);
    }

    async calculateFees(
        amount: number,
        methodId: string
    ): Promise<{ totalFees: number; breakdown: { percentage: number; fixed: number } }> {
        const method = this.supportedMethods.find(m => m.id === methodId);
        if (!method) {
            throw new Error(`Payment method not found: ${methodId}`);
        }

        const percentageFee = (amount * method.fees.percentage) / 100;
        const totalFees = percentageFee + method.fees.fixed;

        return {
            totalFees,
            breakdown: method.fees,
        };
    }

    async processWebhook(webhookData: BybitWebhookData): Promise<boolean> {
        try {
            const { event, data } = webhookData;

            // Find the payment order by Bybit order ID
            let paymentOrder: BybitPaymentOrder | undefined;

            if (data.orderId) {
                // Try to find by Bybit order ID first
                for (const order of this.orderStore.values()) {
                    if (order.bybitOrderId === data.orderId) {
                        paymentOrder = order;
                        break;
                    }
                }
            }

            if (!paymentOrder) {
                console.warn('Payment order not found for webhook:', webhookData);
                return false;
            }

            // Update payment status based on webhook event
            switch (event) {
                case 'payment.completed':
                    await this.updatePaymentStatus(paymentOrder.id, 'completed', data.orderId, {
                        txHash: data.txHash,
                        webhookReceived: new Date().toISOString(),
                    });
                    break;

                case 'payment.failed':
                    await this.updatePaymentStatus(paymentOrder.id, 'failed', data.orderId, {
                        webhookReceived: new Date().toISOString(),
                    });
                    break;

                case 'payment.processing':
                    await this.updatePaymentStatus(paymentOrder.id, 'processing', data.orderId, {
                        webhookReceived: new Date().toISOString(),
                    });
                    break;

                default:
                    console.log('Unhandled webhook event:', event);
                    return false;
            }

            return true;
        } catch (error) {
            console.error('Error processing webhook:', error);
            return false;
        }
    }

    async cancelPaymentOrder(paymentId: string): Promise<boolean> {
        const order = this.orderStore.get(paymentId);
        if (!order || order.status !== 'pending') {
            return false;
        }

        try {
            if (process.env.BYBIT_API_KEY && process.env.BYBIT_SECRET_KEY) {
                // Cancel actual Bybit order
                await this.cancelBybitOrder(order);
            }

            await this.updatePaymentStatus(paymentId, 'cancelled');
            return true;
        } catch (error) {
            console.error('Failed to cancel payment order:', error);
            return false;
        }
    }

    async refundPaymentOrder(
        paymentId: string,
        refundAmount: number,
        reason: string
    ): Promise<boolean> {
        const order = this.orderStore.get(paymentId);
        if (!order || order.status !== 'completed') {
            return false;
        }

        if (refundAmount > order.amount) {
            throw new Error('Refund amount cannot exceed original payment amount');
        }

        try {
            if (process.env.BYBIT_API_KEY && process.env.BYBIT_SECRET_KEY) {
                // Process actual refund through Bybit
                await this.processBybitRefund(order, refundAmount, reason);
            }

            // Update order with refund information
            await this.updatePaymentStatus(paymentId, 'completed', undefined, {
                refunded: true,
                refundAmount,
                refundReason: reason,
                refundedAt: new Date().toISOString(),
            });

            return true;
        } catch (error) {
            console.error('Failed to process refund:', error);
            return false;
        }
    }

    // Private methods for Bybit integration
    private async createBybitOrder(
        paymentOrder: BybitPaymentOrder,
        method: BybitPaymentMethod
    ): Promise<void> {
        try {
            if (method.type === 'crypto') {
                // For crypto payments, we don't create actual trading orders
                // Instead, we simulate the payment process
                console.log('Creating crypto payment order for:', paymentOrder.id);
                paymentOrder.status = 'processing';
                this.orderStore.set(paymentOrder.id, paymentOrder);
            } else if (method.type === 'p2p') {
                // Create P2P escrow order
                // This would integrate with Bybit's P2P API
                console.log('Creating P2P escrow order for:', paymentOrder.id);
                paymentOrder.status = 'processing';
                this.orderStore.set(paymentOrder.id, paymentOrder);
            } else {
                // Fiat payment - would integrate with Bybit's fiat payment API
                console.log('Creating fiat payment order for:', paymentOrder.id);
                paymentOrder.status = 'processing';
                this.orderStore.set(paymentOrder.id, paymentOrder);
            }
        } catch (error) {
            console.error('Error creating Bybit order:', error);
            throw error;
        }
    }

    private async simulateBybitOrder(
        paymentOrder: BybitPaymentOrder,
        method: BybitPaymentMethod
    ): Promise<void> {
        // Simulate order creation delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Generate demo Bybit order ID
        paymentOrder.bybitOrderId = `demo_${Date.now()}`;
        paymentOrder.status = 'processing';

        // Simulate payment URL and QR code for crypto payments
        if (method.type === 'crypto') {
            paymentOrder.paymentUrl = `https://demo.bybit.com/pay/${paymentOrder.bybitOrderId}`;
            paymentOrder.qrCode = `data:image/png;base64,${Buffer.from('demo-qr-code').toString('base64')}`;
        }

        this.orderStore.set(paymentOrder.id, paymentOrder);
    }

    private async cancelBybitOrder(paymentOrder: BybitPaymentOrder): Promise<void> {
        if (!paymentOrder.bybitOrderId) {
            return;
        }

        try {
            const response = await this.bybitApi.cancelOrder({
                category: 'linear',
                symbol: `${paymentOrder.currency}USDT`,
                orderId: paymentOrder.bybitOrderId,
            });

            if (response.retCode !== 0) {
                throw new Error(`Failed to cancel Bybit order: ${response.retMsg}`);
            }
        } catch (error) {
            console.error('Error cancelling Bybit order:', error);
            throw error;
        }
    }

    private async processBybitRefund(
        paymentOrder: BybitPaymentOrder,
        refundAmount: number,
        reason: string
    ): Promise<void> {
        // This would integrate with Bybit's refund API
        console.log(`Processing refund for order ${paymentOrder.id}: ${refundAmount} ${paymentOrder.currency}`);

        // Simulate refund processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Utility methods
    async getPaymentStatistics(): Promise<{
        totalOrders: number;
        totalAmount: number;
        statusBreakdown: Record<string, number>;
        methodBreakdown: Record<string, number>;
    }> {
        const orders = Array.from(this.orderStore.values());

        const statusBreakdown: Record<string, number> = {};
        const methodBreakdown: Record<string, number> = {};

        let totalAmount = 0;

        orders.forEach(order => {
            // Status breakdown
            statusBreakdown[order.status] = (statusBreakdown[order.status] || 0) + 1;

            // Method breakdown
            const methodName = order.metadata.methodName || 'unknown';
            methodBreakdown[methodName] = (methodBreakdown[methodName] || 0) + 1;

            // Total amount
            if (order.status === 'completed') {
                totalAmount += order.amount;
            }
        });

        return {
            totalOrders: orders.length,
            totalAmount,
            statusBreakdown,
            methodBreakdown,
        };
    }
}