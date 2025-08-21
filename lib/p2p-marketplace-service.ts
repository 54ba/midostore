import { ethers } from 'ethers';
import { prisma } from './db';
import Web3Service from './web3-service';

export interface P2PListing {
    id: string;
    productId: string;
    sellerId: string;
    sellerAddress: string;
    price: number;
    quantity: number;
    currency: string;
    status: 'active' | 'sold' | 'cancelled' | 'expired';
    createdAt: Date;
    expiresAt: Date;
    metadata: {
        condition: 'new' | 'used' | 'refurbished';
        location: string;
        shipping: 'free' | 'paid' | 'local';
        description: string;
        images: string[];
    };
}

export interface P2POrder {
    id: string;
    listingId: string;
    buyerId: string;
    buyerAddress: string;
    quantity: number;
    totalAmount: number;
    currency: string;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'disputed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
    escrowAddress?: string;
    transactionHash?: string;
}

export interface P2PEscrow {
    id: string;
    orderId: string;
    buyerAddress: string;
    sellerAddress: string;
    amount: number;
    currency: string;
    status: 'locked' | 'released' | 'refunded' | 'disputed';
    createdAt: Date;
    expiresAt: Date;
    smartContractAddress: string;
    transactionHash: string;
}

export interface P2PDispute {
    id: string;
    orderId: string;
    initiatorId: string;
    reason: string;
    evidence: string[];
    status: 'open' | 'under_review' | 'resolved' | 'closed';
    resolution?: string;
    createdAt: Date;
    resolvedAt?: Date;
}

export class P2PMarketplaceService {
    private web3Service: Web3Service;

    constructor(web3Service: Web3Service) {
        this.web3Service = web3Service;
    }

    // Create a new P2P listing
    async createListing(
        sellerId: string,
        productId: string,
        price: number,
        quantity: number,
        currency: string,
        metadata: any,
        expiresInDays: number = 30
    ): Promise<P2PListing> {
        try {
            // Verify seller has sufficient tokens/balance
            const sellerAddress = await this.web3Service.getAddress();
            if (!sellerAddress) {
                throw new Error('Seller wallet not connected');
            }

            // Create listing in database
            const listing = await prisma.p2PListing.create({
                data: {
                    productId,
                    sellerId,
                    sellerAddress,
                    price,
                    quantity,
                    currency,
                    status: 'active',
                    expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
                    metadata: metadata,
                },
            });

            // Create listing on blockchain
            await this.web3Service.createP2PListing(
                parseInt(productId),
                price.toString(),
                quantity
            );

            return listing;
        } catch (error) {
            console.error('Error creating P2P listing:', error);
            throw error;
        }
    }

    // Get all active listings
    async getActiveListings(
        filters?: {
            productId?: string;
            sellerId?: string;
            minPrice?: number;
            maxPrice?: number;
            currency?: string;
            condition?: string;
            location?: string;
        }
    ): Promise<P2PListing[]> {
        try {
            const where: any = { status: 'active' };

            if (filters?.productId) where.productId = filters.productId;
            if (filters?.sellerId) where.sellerId = filters.sellerId;
            if (filters?.currency) where.currency = filters.currency;
            if (filters?.minPrice || filters?.maxPrice) {
                where.price = {};
                if (filters.minPrice) where.price.gte = filters.minPrice;
                if (filters.maxPrice) where.price.lte = filters.maxPrice;
            }
            if (filters?.condition) where.metadata = { path: ['condition'], equals: filters.condition };
            if (filters?.location) where.metadata = { path: ['location'], contains: filters.location };

            const listings = await prisma.p2PListing.findMany({
                where,
                include: {
                    seller: {
                        select: {
                            id: true,
                            full_name: true,
                            rating: true,
                            totalSales: true,
                        },
                    },
                    product: {
                        select: {
                            id: true,
                            title: true,
                            images: true,
                            category: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });

            return listings;
        } catch (error) {
            console.error('Error getting active listings:', error);
            throw error;
        }
    }

    // Get listing by ID
    async getListing(listingId: string): Promise<P2PListing | null> {
        try {
            const listing = await prisma.p2PListing.findUnique({
                where: { id: listingId },
                include: {
                    seller: {
                        select: {
                            id: true,
                            full_name: true,
                            rating: true,
                            totalSales: true,
                            email: true,
                        },
                    },
                    product: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            images: true,
                            category: true,
                            brand: true,
                        },
                    },
                },
            });

            return listing;
        } catch (error) {
            console.error('Error getting listing:', error);
            throw error;
        }
    }

    // Place order for a listing
    async placeOrder(
        buyerId: string,
        listingId: string,
        quantity: number
    ): Promise<P2POrder> {
        try {
            const listing = await this.getListing(listingId);
            if (!listing) {
                throw new Error('Listing not found');
            }

            if (listing.status !== 'active') {
                throw new Error('Listing is not active');
            }

            if (quantity > listing.quantity) {
                throw new Error('Insufficient quantity available');
            }

            const buyerAddress = await this.web3Service.getAddress();
            if (!buyerAddress) {
                throw new Error('Buyer wallet not connected');
            }

            const totalAmount = listing.price * quantity;

            // Create order in database
            const order = await prisma.p2POrder.create({
                data: {
                    listingId,
                    buyerId,
                    buyerAddress,
                    quantity,
                    totalAmount,
                    currency: listing.currency,
                    status: 'pending',
                },
            });

            // Create escrow on blockchain
            const escrow = await this.createEscrow(order, listing);

            // Update order with escrow information
            await prisma.p2POrder.update({
                where: { id: order.id },
                data: { escrowAddress: escrow.smartContractAddress },
            });

            return order;
        } catch (error) {
            console.error('Error placing order:', error);
            throw error;
        }
    }

    // Create escrow for order
    private async createEscrow(order: P2POrder, listing: P2PListing): Promise<P2PEscrow> {
        try {
            // In a real implementation, this would deploy or interact with a smart contract
            const escrowAddress = ethers.Wallet.createRandom().address; // Mock address
            const transactionHash = ethers.randomBytes(32).toString('hex'); // Mock hash

            const escrow = await prisma.p2PEscrow.create({
                data: {
                    orderId: order.id,
                    buyerAddress: order.buyerAddress,
                    sellerAddress: listing.sellerAddress,
                    amount: order.totalAmount,
                    currency: order.currency,
                    status: 'locked',
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                    smartContractAddress: escrowAddress,
                    transactionHash,
                },
            });

            return escrow;
        } catch (error) {
            console.error('Error creating escrow:', error);
            throw error;
        }
    }

    // Confirm order (seller confirms they have the product)
    async confirmOrder(orderId: string, sellerId: string): Promise<boolean> {
        try {
            const order = await prisma.p2POrder.findUnique({
                where: { id: orderId },
                include: { listing: true },
            });

            if (!order) {
                throw new Error('Order not found');
            }

            if (order.listing.sellerId !== sellerId) {
                throw new Error('Only the seller can confirm this order');
            }

            if (order.status !== 'pending') {
                throw new Error('Order cannot be confirmed in current status');
            }

            // Update order status
            await prisma.p2POrder.update({
                where: { id: orderId },
                data: { status: 'confirmed' },
            });

            return true;
        } catch (error) {
            console.error('Error confirming order:', error);
            throw error;
        }
    }

    // Mark order as shipped
    async shipOrder(orderId: string, sellerId: string, trackingNumber?: string): Promise<boolean> {
        try {
            const order = await prisma.p2POrder.findUnique({
                where: { id: orderId },
                include: { listing: true },
            });

            if (!order) {
                throw new Error('Order not found');
            }

            if (order.listing.sellerId !== sellerId) {
                throw new Error('Only the seller can ship this order');
            }

            if (order.status !== 'confirmed') {
                throw new Error('Order must be confirmed before shipping');
            }

            // Update order status
            await prisma.p2POrder.update({
                where: { id: orderId },
                data: {
                    status: 'shipped',
                    metadata: { trackingNumber },
                },
            });

            return true;
        } catch (error) {
            console.error('Error shipping order:', error);
            throw error;
        }
    }

    // Mark order as delivered
    async deliverOrder(orderId: string, buyerId: string): Promise<boolean> {
        try {
            const order = await prisma.p2POrder.findUnique({
                where: { id: orderId },
            });

            if (!order) {
                throw new Error('Order not found');
            }

            if (order.buyerId !== buyerId) {
                throw new Error('Only the buyer can mark order as delivered');
            }

            if (order.status !== 'shipped') {
                throw new Error('Order must be shipped before delivery');
            }

            // Update order status
            await prisma.p2POrder.update({
                where: { id: orderId },
                data: { status: 'delivered' },
            });

            // Release escrow to seller
            await this.releaseEscrow(orderId);

            return true;
        } catch (error) {
            console.error('Error delivering order:', error);
            throw error;
        }
    }

    // Release escrow to seller
    private async releaseEscrow(orderId: string): Promise<boolean> {
        try {
            const escrow = await prisma.p2PEscrow.findUnique({
                where: { orderId },
            });

            if (!escrow) {
                throw new Error('Escrow not found');
            }

            // Update escrow status
            await prisma.p2PEscrow.update({
                where: { id: escrow.id },
                data: { status: 'released' },
            });

            // In a real implementation, this would call the smart contract to release funds
            console.log(`Escrow released for order ${orderId}`);

            return true;
        } catch (error) {
            console.error('Error releasing escrow:', error);
            throw error;
        }
    }

    // Create dispute for order
    async createDispute(
        orderId: string,
        initiatorId: string,
        reason: string,
        evidence: string[]
    ): Promise<P2PDispute> {
        try {
            const order = await prisma.p2POrder.findUnique({
                where: { id: orderId },
            });

            if (!order) {
                throw new Error('Order not found');
            }

            if (order.buyerId !== initiatorId && order.listing?.sellerId !== initiatorId) {
                throw new Error('Only order participants can create disputes');
            }

            // Create dispute
            const dispute = await prisma.p2PDispute.create({
                data: {
                    orderId,
                    initiatorId,
                    reason,
                    evidence,
                    status: 'open',
                },
            });

            // Update order status
            await prisma.p2POrder.update({
                where: { id: orderId },
                data: { status: 'disputed' },
            });

            return dispute;
        } catch (error) {
            console.error('Error creating dispute:', error);
            throw error;
        }
    }

    // Resolve dispute
    async resolveDispute(
        disputeId: string,
        resolution: string,
        resolverId: string
    ): Promise<boolean> {
        try {
            const dispute = await prisma.p2PDispute.findUnique({
                where: { id: disputeId },
                include: { order: true },
            });

            if (!dispute) {
                throw new Error('Dispute not found');
            }

            // Update dispute status
            await prisma.p2PDispute.update({
                where: { id: disputeId },
                data: {
                    status: 'resolved',
                    resolution,
                    resolvedAt: new Date(),
                },
            });

            // Handle order based on resolution
            if (resolution.includes('refund')) {
                await this.refundOrder(dispute.orderId);
            } else if (resolution.includes('release')) {
                await this.releaseEscrow(dispute.orderId);
            }

            return true;
        } catch (error) {
            console.error('Error resolving dispute:', error);
            throw error;
        }
    }

    // Refund order
    private async refundOrder(orderId: string): Promise<boolean> {
        try {
            const order = await prisma.p2POrder.findUnique({
                where: { id: orderId },
                include: { escrow: true },
            });

            if (!order) {
                throw new Error('Order not found');
            }

            // Update order status
            await prisma.p2POrder.update({
                where: { id: orderId },
                data: { status: 'cancelled' },
            });

            // Update escrow status
            if (order.escrow) {
                await prisma.p2PEscrow.update({
                    where: { id: order.escrow.id },
                    data: { status: 'refunded' },
                });
            }

            // In a real implementation, this would call the smart contract to refund buyer
            console.log(`Order ${orderId} refunded`);

            return true;
        } catch (error) {
            console.error('Error refunding order:', error);
            throw error;
        }
    }

    // Get user's P2P activity
    async getUserActivity(userId: string): Promise<{
        listings: P2PListing[];
        orders: P2POrder[];
        disputes: P2PDispute[];
    }> {
        try {
            const [listings, orders, disputes] = await Promise.all([
                prisma.p2PListing.findMany({
                    where: { sellerId: userId },
                    orderBy: { createdAt: 'desc' },
                }),
                prisma.p2POrder.findMany({
                    where: { buyerId: userId },
                    orderBy: { createdAt: 'desc' },
                }),
                prisma.p2PDispute.findMany({
                    where: { initiatorId: userId },
                    orderBy: { createdAt: 'desc' },
                }),
            ]);

            return { listings, orders, disputes };
        } catch (error) {
            console.error('Error getting user activity:', error);
            throw error;
        }
    }

    // Search P2P listings
    async searchListings(
        query: string,
        filters?: {
            category?: string;
            minPrice?: number;
            maxPrice?: number;
            condition?: string;
            location?: string;
        }
    ): Promise<P2PListing[]> {
        try {
            const where: any = {
                status: 'active',
                OR: [
                    { product: { title: { contains: query, mode: 'insensitive' } } },
                    { product: { description: { contains: query, mode: 'insensitive' } } },
                    { metadata: { path: ['description'], contains: query } },
                ],
            };

            if (filters?.category) {
                where.product = { ...where.product, category: filters.category };
            }
            if (filters?.minPrice || filters?.maxPrice) {
                where.price = {};
                if (filters.minPrice) where.price.gte = filters.minPrice;
                if (filters.maxPrice) where.price.lte = filters.maxPrice;
            }
            if (filters?.condition) {
                where.metadata = { ...where.metadata, path: ['condition'], equals: filters.condition };
            }
            if (filters?.location) {
                where.metadata = { ...where.metadata, path: ['location'], contains: filters.location };
            }

            const listings = await prisma.p2PListing.findMany({
                where,
                include: {
                    seller: {
                        select: {
                            id: true,
                            full_name: true,
                            rating: true,
                        },
                    },
                    product: {
                        select: {
                            id: true,
                            title: true,
                            images: true,
                            category: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });

            return listings;
        } catch (error) {
            console.error('Error searching listings:', error);
            throw error;
        }
    }

    // Get P2P marketplace statistics
    async getMarketplaceStats(): Promise<{
        totalListings: number;
        activeListings: number;
        totalOrders: number;
        totalVolume: number;
        averagePrice: number;
    }> {
        try {
            const [totalListings, activeListings, totalOrders, totalVolume, averagePrice] = await Promise.all([
                prisma.p2PListing.count(),
                prisma.p2PListing.count({ where: { status: 'active' } }),
                prisma.p2POrder.count({ where: { status: { in: ['delivered', 'shipped'] } } }),
                prisma.p2POrder.aggregate({
                    where: { status: { in: ['delivered', 'shipped'] } },
                    _sum: { totalAmount: true },
                }),
                prisma.p2PListing.aggregate({
                    where: { status: 'active' },
                    _avg: { price: true },
                }),
            ]);

            return {
                totalListings,
                activeListings,
                totalOrders,
                totalVolume: totalVolume._sum.totalAmount || 0,
                averagePrice: averagePrice._avg.price || 0,
            };
        } catch (error) {
            console.error('Error getting marketplace stats:', error);
            throw error;
        }
    }
}

export default P2PMarketplaceService;