import { prisma } from './db';

export interface OrderBatch {
    id: string;
    productId: string;
    batchType: 'fast' | 'standard' | 'economy' | 'ultimate';
    price: number;
    discount: number;
    deliveryTime: string;
    deliverySpeed: 'fast' | 'medium' | 'slow';
    buyersRequired: number;
    currentBuyers: number;
    status: 'forming' | 'ready' | 'processing' | 'shipped' | 'delivered';
    estimatedShipDate: Date;
    estimatedDeliveryDate: Date;
    actualShipDate?: Date;
    actualDeliveryDate?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface BatchOrder {
    id: string;
    batchId: string;
    userId: string;
    productId: string;
    quantity: number;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    shippingAddress: string;
    trackingNumber?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface BatchFormationRule {
    id: string;
    productId: string;
    batchType: 'fast' | 'standard' | 'economy' | 'ultimate';
    minBuyers: number;
    maxBuyers: number;
    priceMultiplier: number;
    deliveryTimeDays: number;
    priority: number;
    isActive: boolean;
}

export class OrderBatchingService {
    /**
     * Create a new order batch for a product
     */
    async createBatch(productId: string, batchType: string, price: number, buyersRequired: number): Promise<OrderBatch> {
        const now = new Date();
        const deliveryTimeDays = this.getDeliveryTimeForBatchType(batchType);

        const batch = await prisma.orderBatch.create({
            data: {
                productId,
                batchType,
                price,
                discount: 0, // Will be calculated based on original price
                deliveryTime: `${deliveryTimeDays} days`,
                deliverySpeed: this.getDeliverySpeedForBatchType(batchType),
                buyersRequired,
                currentBuyers: 0,
                status: 'forming',
                estimatedShipDate: new Date(now.getTime() + deliveryTimeDays * 24 * 60 * 60 * 1000),
                estimatedDeliveryDate: new Date(now.getTime() + (deliveryTimeDays + 7) * 24 * 60 * 60 * 1000),
                isActive: true,
                createdAt: now,
                updatedAt: now
            }
        });

        return batch;
    }

    /**
     * Join a user to an order batch
     */
    async joinBatch(batchId: string, userId: string, quantity: number, shippingAddress: string): Promise<BatchOrder> {
        // Check if batch is available
        const batch = await prisma.orderBatch.findUnique({
            where: { id: batchId }
        });

        if (!batch || !batch.isActive) {
            throw new Error('Batch not available');
        }

        if (batch.status !== 'forming' && batch.status !== 'ready') {
            throw new Error('Batch is not accepting new orders');
        }

        // Check if user already in this batch
        const existingOrder = await prisma.batchOrder.findFirst({
            where: {
                batchId,
                userId,
                status: { not: 'cancelled' }
            }
        });

        if (existingOrder) {
            throw new Error('User already in this batch');
        }

        // Create batch order
        const order = await prisma.batchOrder.create({
            data: {
                batchId,
                userId,
                productId: batch.productId,
                quantity,
                totalPrice: batch.price * quantity,
                status: 'pending',
                paymentStatus: 'pending',
                shippingAddress,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        // Update batch buyer count
        await prisma.orderBatch.update({
            where: { id: batchId },
            data: {
                currentBuyers: { increment: 1 },
                updatedAt: new Date()
            }
        });

        // Check if batch is ready to process
        await this.checkBatchReadiness(batchId);

        return order;
    }

    /**
     * Check if a batch is ready to process and update status
     */
    async checkBatchReadiness(batchId: string): Promise<void> {
        const batch = await prisma.orderBatch.findUnique({
            where: { id: batchId },
            include: {
                orders: {
                    where: { status: { not: 'cancelled' } }
                }
            }
        });

        if (!batch) return;

        const activeOrders = batch.orders.length;
        const isReady = activeOrders >= batch.buyersRequired;

        if (isReady && batch.status === 'forming') {
            await prisma.orderBatch.update({
                where: { id: batchId },
                data: {
                    status: 'ready',
                    updatedAt: new Date()
                }
            });

            // Notify all users in the batch
            await this.notifyBatchReady(batchId);
        }
    }

    /**
     * Process a ready batch and start shipping
     */
    async processBatch(batchId: string): Promise<void> {
        const batch = await prisma.orderBatch.findUnique({
            where: { id: batchId },
            include: {
                orders: {
                    where: { status: { not: 'cancelled' } }
                }
            }
        });

        if (!batch || batch.status !== 'ready') {
            throw new Error('Batch is not ready for processing');
        }

        // Update batch status
        await prisma.orderBatch.update({
            where: { id: batchId },
            data: {
                status: 'processing',
                actualShipDate: new Date(),
                updatedAt: new Date()
            }
        });

        // Update all orders in the batch
        await prisma.batchOrder.updateMany({
            where: { batchId, status: 'pending' },
            data: {
                status: 'confirmed',
                updatedAt: new Date()
            }
        });

        // Start shipping process
        await this.initiateShipping(batchId);
    }

    /**
     * Mark batch as shipped
     */
    async markBatchShipped(batchId: string, trackingNumbers: Record<string, string>): Promise<void> {
        const batch = await prisma.orderBatch.findUnique({
            where: { id: batchId },
            include: {
                orders: {
                    where: { status: { not: 'cancelled' } }
                }
            }
        });

        if (!batch) return;

        // Update batch status
        await prisma.orderBatch.update({
            where: { id: batchId },
            data: {
                status: 'shipped',
                updatedAt: new Date()
            }
        });

        // Update individual orders with tracking numbers
        for (const order of batch.orders) {
            if (trackingNumbers[order.id]) {
                await prisma.batchOrder.update({
                    where: { id: order.id },
                    data: {
                        status: 'shipped',
                        trackingNumber: trackingNumbers[order.id],
                        updatedAt: new Date()
                    }
                });
            }
        }
    }

    /**
     * Get all active batches for a product
     */
    async getProductBatches(productId: string): Promise<OrderBatch[]> {
        return await prisma.orderBatch.findMany({
            where: {
                productId,
                isActive: true
            },
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'asc' }
            ]
        });
    }

    /**
     * Get user's active batch orders
     */
    async getUserBatchOrders(userId: string): Promise<BatchOrder[]> {
        return await prisma.batchOrder.findMany({
            where: {
                userId,
                status: { not: 'cancelled' }
            },
            include: {
                batch: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Cancel a user's batch order
     */
    async cancelBatchOrder(orderId: string, userId: string): Promise<void> {
        const order = await prisma.batchOrder.findFirst({
            where: {
                id: orderId,
                userId
            },
            include: {
                batch: true
            }
        });

        if (!order) {
            throw new Error('Order not found');
        }

        if (order.status !== 'pending') {
            throw new Error('Order cannot be cancelled');
        }

        // Cancel the order
        await prisma.batchOrder.update({
            where: { id: orderId },
            data: {
                status: 'cancelled',
                updatedAt: new Date()
            }
        });

        // Update batch buyer count
        await prisma.orderBatch.update({
            where: { id: order.batchId },
            data: {
                currentBuyers: { decrement: 1 },
                updatedAt: new Date()
            }
        });

        // Check if batch needs to go back to forming status
        await this.checkBatchStatus(order.batchId);
    }

    /**
     * Get batch analytics and statistics
     */
    async getBatchAnalytics(productId: string): Promise<any> {
        const batches = await prisma.orderBatch.findMany({
            where: { productId },
            include: {
                orders: {
                    where: { status: { not: 'cancelled' } }
                }
            }
        });

        const analytics = {
            totalBatches: batches.length,
            activeBatches: batches.filter(b => b.isActive).length,
            totalOrders: batches.reduce((sum, b) => sum + b.orders.length, 0),
            averageBatchSize: batches.length > 0 ? batches.reduce((sum, b) => sum + b.buyersRequired, 0) / batches.length : 0,
            completionRate: batches.length > 0 ? batches.filter(b => b.status === 'shipped' || b.status === 'delivered').length / batches.length : 0,
            averageDeliveryTime: 0,
            revenueGenerated: 0
        };

        // Calculate additional metrics
        let totalDeliveryTime = 0;
        let completedBatches = 0;

        for (const batch of batches) {
            if (batch.status === 'shipped' || batch.status === 'delivered') {
                if (batch.actualShipDate && batch.createdAt) {
                    const deliveryTime = batch.actualShipDate.getTime() - batch.createdAt.getTime();
                    totalDeliveryTime += deliveryTime;
                    completedBatches++;
                }
            }

            // Calculate revenue
            analytics.revenueGenerated += batch.orders.reduce((sum, order) => sum + order.totalPrice, 0);
        }

        if (completedBatches > 0) {
            analytics.averageDeliveryTime = totalDeliveryTime / completedBatches / (1000 * 60 * 60 * 24); // Convert to days
        }

        return analytics;
    }

    /**
     * Auto-create batches based on demand
     */
    async autoCreateBatches(productId: string): Promise<void> {
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) return;

        // Check if we need to create new batches
        const activeBatches = await this.getProductBatches(productId);
        const totalCapacity = activeBatches.reduce((sum, b) => sum + b.buyersRequired, 0);
        const totalDemand = activeBatches.reduce((sum, b) => sum + b.currentBuyers, 0);

        // If demand is high, create fast delivery batches
        if (totalDemand > totalCapacity * 0.8) {
            await this.createBatch(productId, 'fast', product.price * 1.2, 25);
        }

        // If demand is low, create economy batches
        if (totalDemand < totalCapacity * 0.3) {
            await this.createBatch(productId, 'economy', product.price * 0.8, 100);
        }
    }

    /**
     * Get delivery time for batch type
     */
    private getDeliveryTimeForBatchType(batchType: string): number {
        switch (batchType) {
            case 'fast': return 3;
            case 'standard': return 7;
            case 'economy': return 14;
            case 'ultimate': return 21;
            default: return 7;
        }
    }

    /**
     * Get delivery speed for batch type
     */
    private getDeliverySpeedForBatchType(batchType: string): 'fast' | 'medium' | 'slow' {
        switch (batchType) {
            case 'fast': return 'fast';
            case 'standard': return 'medium';
            case 'economy': return 'slow';
            case 'ultimate': return 'slow';
            default: return 'medium';
        }
    }

    /**
     * Notify users when batch is ready
     */
    private async notifyBatchReady(batchId: string): Promise<void> {
        // In a real implementation, this would send notifications
        // via email, SMS, or push notifications
        console.log(`Batch ${batchId} is ready for processing`);
    }

    /**
     * Check and update batch status
     */
    private async checkBatchStatus(batchId: string): Promise<void> {
        const batch = await prisma.orderBatch.findUnique({
            where: { id: batchId },
            include: {
                orders: {
                    where: { status: { not: 'cancelled' } }
                }
            }
        });

        if (!batch) return;

        const activeOrders = batch.orders.length;

        if (batch.status === 'ready' && activeOrders < batch.buyersRequired) {
            await prisma.orderBatch.update({
                where: { id: batchId },
                data: {
                    status: 'forming',
                    updatedAt: new Date()
                }
            });
        }
    }

    /**
     * Initiate shipping process
     */
    private async initiateShipping(batchId: string): Promise<void> {
        // In a real implementation, this would integrate with shipping providers
        // and create shipping labels
        console.log(`Initiating shipping for batch ${batchId}`);
    }
}

export default OrderBatchingService;