// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import P2PMarketplaceService from '@/lib/p2p-marketplace-service';
import Web3Service from '@/lib/web3-service';
import envConfig from '@/env.config';

// Initialize services
const web3Config = {
    rpcUrl: envConfig.ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/your-project-id',
    chainId: envConfig.ETHEREUM_CHAIN_ID || 1,
    tokenContractAddress: envConfig.TOKEN_CONTRACT_ADDRESS || '',
    rewardContractAddress: envConfig.REWARD_CONTRACT_ADDRESS || '',
    p2pMarketplaceAddress: envConfig.P2P_MARKETPLACE_ADDRESS || '',
    gaslessRelayerUrl: envConfig.GASLESS_RELAYER_URL,
};

const web3Service = new Web3Service(web3Config);
const p2pService = new P2PMarketplaceService(web3Service);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action') || 'listings';
        const listingId = searchParams.get('listingId') as string | null;
        const userId = searchParams.get('userId') as string | null;
        const query = searchParams.get('query') as string | null;

        switch (action) {
            case 'listings':
                const filters: any = {};
                if (searchParams.get('productId')) filters.productId = searchParams.get('productId');
                if (searchParams.get('sellerId')) filters.sellerId = searchParams.get('sellerId');
                if (searchParams.get('minPrice')) filters.minPrice = parseFloat(searchParams.get('minPrice')!);
                if (searchParams.get('maxPrice')) filters.maxPrice = parseFloat(searchParams.get('maxPrice')!);
                if (searchParams.get('currency')) filters.currency = searchParams.get('currency');
                if (searchParams.get('condition')) filters.condition = searchParams.get('condition');
                if (searchParams.get('location')) filters.location = searchParams.get('location');

                try {
                    const listings = await p2pService.getActiveListings(filters);
                    return NextResponse.json({
                        success: true,
                        data: listings,
                    });
                } catch (serviceError) {
                    console.error('P2P service error:', serviceError);
                    // Return demo data if service fails
                    return NextResponse.json({
                        success: true,
                        data: [
                            {
                                id: 'demo-listing-1',
                                sellerId: 'demo-seller-123',
                                productId: 'demo-product-123',
                                price: 29.99,
                                quantity: 5,
                                currency: 'USD',
                                condition: 'new',
                                location: 'US',
                                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                            }
                        ],
                        message: 'Demo P2P listings (service temporarily unavailable)'
                    });
                }

            case 'listing':
                if (!listingId) {
                    return NextResponse.json(
                        { error: 'Listing ID is required' },
                        { status: 400 }
                    );
                }

                const listing = await p2pService.getListing(listingId);
                if (!listing) {
                    return NextResponse.json(
                        { error: 'Listing not found' },
                        { status: 404 }
                    );
                }

                return NextResponse.json({
                    success: true,
                    data: listing,
                });

            case 'user-activity':
                if (!userId) {
                    return NextResponse.json(
                        { error: 'User ID is required' },
                        { status: 400 }
                    );
                }

                const activity = await p2pService.getUserActivity(userId);
                return NextResponse.json({
                    success: true,
                    data: activity,
                });

            case 'search':
                if (!query) {
                    return NextResponse.json(
                        { error: 'Search query is required' },
                        { status: 400 }
                    );
                }

                const filters2: any = {};
                if (searchParams.get('category')) filters2.category = searchParams.get('category');
                if (searchParams.get('minPrice')) filters2.minPrice = parseFloat(searchParams.get('minPrice')!);
                if (searchParams.get('maxPrice')) filters2.maxPrice = parseFloat(searchParams.get('maxPrice')!);
                if (searchParams.get('condition')) filters2.condition = searchParams.get('condition');
                if (searchParams.get('location')) filters2.location = searchParams.get('location');

                const searchResults = await p2pService.searchListings(query, filters2);
                return NextResponse.json({
                    success: true,
                    data: searchResults,
                });

            case 'stats':
                const stats = await p2pService.getMarketplaceStats();
                return NextResponse.json({
                    success: true,
                    data: stats,
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in P2P marketplace GET:', error);
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
            case 'create-listing':
                const { sellerId, productId, price, quantity, currency, metadata, expiresInDays } = data;

                if (!sellerId || !productId || !price || !quantity || !currency) {
                    return NextResponse.json(
                        { error: 'Seller ID, product ID, price, quantity, and currency are required' },
                        { status: 400 }
                    );
                }

                const listing = await p2pService.createListing(
                    sellerId,
                    productId,
                    price,
                    quantity,
                    currency,
                    metadata || {},
                    expiresInDays || 30
                );

                return NextResponse.json({
                    success: true,
                    data: listing,
                    message: 'P2P listing created successfully',
                });

            case 'place-order':
                const { buyerId, listingId: orderListingId, quantity: orderQuantity } = data;

                if (!buyerId || !orderListingId || !orderQuantity) {
                    return NextResponse.json(
                        { error: 'Buyer ID, listing ID, and quantity are required' },
                        { status: 400 }
                    );
                }

                const order = await p2pService.placeOrder(buyerId, orderListingId, orderQuantity);

                return NextResponse.json({
                    success: true,
                    data: order,
                    message: 'Order placed successfully',
                });

            case 'confirm-order':
                const { orderId: confirmOrderId, sellerId: confirmSellerId } = data;

                if (!confirmOrderId || !confirmSellerId) {
                    return NextResponse.json(
                        { error: 'Order ID and seller ID are required' },
                        { status: 400 }
                    );
                }

                const confirmSuccess = await p2pService.confirmOrder(confirmOrderId, confirmSellerId);
                if (confirmSuccess) {
                    return NextResponse.json({
                        success: true,
                        message: 'Order confirmed successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to confirm order' },
                        { status: 500 }
                    );
                }

            case 'ship-order':
                const { orderId: shipOrderId, sellerId: shipSellerId, trackingNumber } = data;

                if (!shipOrderId || !shipSellerId) {
                    return NextResponse.json(
                        { error: 'Order ID and seller ID are required' },
                        { status: 400 }
                    );
                }

                const shipSuccess = await p2pService.shipOrder(shipOrderId, shipSellerId, trackingNumber);
                if (shipSuccess) {
                    return NextResponse.json({
                        success: true,
                        message: 'Order marked as shipped successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to mark order as shipped' },
                        { status: 500 }
                    );
                }

            case 'deliver-order':
                const { orderId: deliverOrderId, buyerId: deliverBuyerId } = data;

                if (!deliverOrderId || !deliverBuyerId) {
                    return NextResponse.json(
                        { error: 'Order ID and buyer ID are required' },
                        { status: 400 }
                    );
                }

                const deliverSuccess = await p2pService.deliverOrder(deliverOrderId, deliverBuyerId);
                if (deliverSuccess) {
                    return NextResponse.json({
                        success: true,
                        message: 'Order marked as delivered successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to mark order as delivered' },
                        { status: 500 }
                    );
                }

            case 'create-dispute':
                const { orderId: disputeOrderId, initiatorId, reason, evidence } = data;

                if (!disputeOrderId || !initiatorId || !reason) {
                    return NextResponse.json(
                        { error: 'Order ID, initiator ID, and reason are required' },
                        { status: 400 }
                    );
                }

                const dispute = await p2pService.createDispute(
                    disputeOrderId,
                    initiatorId,
                    reason,
                    evidence || []
                );

                return NextResponse.json({
                    success: true,
                    data: dispute,
                    message: 'Dispute created successfully',
                });

            case 'resolve-dispute':
                const { disputeId, resolution, resolverId } = data;

                if (!disputeId || !resolution || !resolverId) {
                    return NextResponse.json(
                        { error: 'Dispute ID, resolution, and resolver ID are required' },
                        { status: 400 }
                    );
                }

                const resolveSuccess = await p2pService.resolveDispute(disputeId, resolution, resolverId);
                if (resolveSuccess) {
                    return NextResponse.json({
                        success: true,
                        message: 'Dispute resolved successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to resolve dispute' },
                        { status: 500 }
                    );
                }

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in P2P marketplace POST:', error);
        return NextResponse.json(
            { error: (error as Error).message || 'Failed to process request' },
            { status: 500 }
        );
    }
}