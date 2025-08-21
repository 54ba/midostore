// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { isClerkConfigured } from '../../../../env.config';
import OrderBatchingService from '../../../../lib/order-batching-service';
import { prisma } from '../../../../lib/db';

const orderBatchingService = new OrderBatchingService();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId') as string | null;
        const userId = searchParams.get('userId') as string | null;
        const action = searchParams.get('action') || 'info';

        // If no productId provided, return general info about the service
        if (!productId && action === 'info') {
            return NextResponse.json({
                success: true,
                data: {
                    service: 'Order Batching Service',
                    description: 'Enables bulk ordering and batch management',
                    endpoints: {
                        batches: 'GET ?productId=<id>&action=batches',
                        userOrders: 'GET ?userId=<id>&action=user-orders',
                        analytics: 'GET ?productId=<id>&action=analytics'
                    },
                    supportedActions: ['batches', 'user-orders', 'analytics', 'info']
                },
                message: 'Order Batching Service is available'
            });
        }

        if (!productId && action !== 'info') {
            return NextResponse.json(
                { success: false, error: 'Product ID is required for this action' },
                { status: 400 }
            );
        }

        switch (action) {
            case 'batches':
                // Get all batches for a product
                const batches = await orderBatchingService.getProductBatches(productId);
                return NextResponse.json({
                    success: true,
                    data: batches
                });

            case 'user-orders':
                // Get user's batch orders
                if (!userId) {
                    return NextResponse.json(
                        { success: false, error: 'User ID is required' },
                        { status: 400 }
                    );
                }
                const userOrders = await orderBatchingService.getUserBatchOrders(userId);
                return NextResponse.json({
                    success: true,
                    data: userOrders
                });

            case 'analytics':
                // Get batch analytics for a product
                const analytics = await orderBatchingService.getBatchAnalytics(productId);
                return NextResponse.json({
                    success: true,
                    data: analytics
                });

            default:
                return NextResponse.json(
                    { success: false, error: 'Invalid action' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in order batching GET:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch order batching data' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, ...data } = body;

        switch (action) {
            case 'join-batch':
                // Join a user to a batch
                const { batchId, userId, quantity, shippingAddress } = data;

                if (!batchId || !userId || !quantity || !shippingAddress) {
                    return NextResponse.json(
                        { success: false, error: 'Missing required fields' },
                        { status: 400 }
                    );
                }

                const order = await orderBatchingService.joinBatch(batchId, userId, quantity, shippingAddress);
                return NextResponse.json({
                    success: true,
                    data: order,
                    message: 'Successfully joined batch'
                });

            case 'create-batch':
                // Create a new batch (admin only)
                const { productId, batchType, price, buyersRequired } = data;

                if (!productId || !batchType || !price || !buyersRequired) {
                    return NextResponse.json(
                        { success: false, error: 'Missing required fields' },
                        { status: 400 }
                    );
                }

                const batch = await orderBatchingService.createBatch(productId, batchType, price, buyersRequired);
                return NextResponse.json({
                    success: true,
                    data: batch,
                    message: 'Batch created successfully'
                });

            case 'process-batch':
                // Process a ready batch (admin only)
                const { batchId: processBatchId } = data;

                if (!processBatchId) {
                    return NextResponse.json(
                        { success: false, error: 'Batch ID is required' },
                        { status: 400 }
                    );
                }

                await orderBatchingService.processBatch(processBatchId);
                return NextResponse.json({
                    success: true,
                    message: 'Batch processing started'
                });

            case 'mark-shipped':
                // Mark batch as shipped (admin only)
                const { batchId: shipBatchId, trackingNumbers } = data;

                if (!shipBatchId || !trackingNumbers) {
                    return NextResponse.json(
                        { success: false, error: 'Batch ID and tracking numbers are required' },
                        { status: 400 }
                    );
                }

                await orderBatchingService.markBatchShipped(shipBatchId, trackingNumbers);
                return NextResponse.json({
                    success: true,
                    message: 'Batch marked as shipped'
                });

            case 'cancel-order':
                // Cancel a user's batch order
                const { orderId, userId: cancelUserId } = data;

                if (!orderId || !cancelUserId) {
                    return NextResponse.json(
                        { success: false, error: 'Order ID and User ID are required' },
                        { status: 400 }
                    );
                }

                await orderBatchingService.cancelBatchOrder(orderId, cancelUserId);
                return NextResponse.json({
                    success: true,
                    message: 'Order cancelled successfully'
                });

            case 'auto-create-batches':
                // Auto-create batches based on demand (admin only)
                const { productId: autoProductId } = data;

                if (!autoProductId) {
                    return NextResponse.json(
                        { success: false, error: 'Product ID is required' },
                        { status: 400 }
                    );
                }

                await orderBatchingService.autoCreateBatches(autoProductId);
                return NextResponse.json({
                    success: true,
                    message: 'Auto-batch creation completed'
                });

            default:
                return NextResponse.json(
                    { success: false, error: 'Invalid action' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in order batching POST:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process order batching request' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { batchId, updates } = body;

        if (!batchId || !updates) {
            return NextResponse.json(
                { success: false, error: 'Batch ID and updates are required' },
                { status: 400 }
            );
        }

        // Update batch information
        const updatedBatch = await prisma.orderBatch.update({
            where: { id: batchId },
            data: {
                ...updates,
                updatedAt: new Date()
            }
        });

        return NextResponse.json({
            success: true,
            data: updatedBatch,
            message: 'Batch updated successfully'
        });
    } catch (error) {
        console.error('Error in order batching PUT:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update batch' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const batchId = searchParams.get('batchId') as string | null;

        if (!batchId) {
            return NextResponse.json(
                { success: false, error: 'Batch ID is required' },
                { status: 400 }
            );
        }

        // Deactivate batch (soft delete)
        await prisma.orderBatch.update({
            where: { id: batchId },
            data: {
                isActive: false,
                updatedAt: new Date()
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Batch deactivated successfully'
        });
    } catch (error) {
        console.error('Error in order batching DELETE:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to deactivate batch' },
            { status: 500 }
        );
    }
}