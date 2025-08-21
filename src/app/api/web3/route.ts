// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import Web3Service from '@/lib/web3-service';
import envConfig from '@/env.config';

// Initialize Web3 service with configuration
const web3Config = {
    rpcUrl: envConfig.ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/your-project-id',
    chainId: envConfig.ETHEREUM_CHAIN_ID || 1,
    tokenContractAddress: envConfig.TOKEN_CONTRACT_ADDRESS || '',
    rewardContractAddress: envConfig.REWARD_CONTRACT_ADDRESS || '',
    p2pMarketplaceAddress: envConfig.P2P_MARKETPLACE_ADDRESS || '',
    gaslessRelayerUrl: envConfig.GASLESS_RELAYER_URL,
};

const web3Service = new Web3Service(web3Config);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action') || 'status';
        const address = searchParams.get('address') as string | null;

        switch (action) {
            case 'status':
                const isConnected = await web3Service.getAddress() !== null;
                return NextResponse.json({
                    success: true,
                    data: {
                        connected: isConnected,
                        network: web3Config.chainId,
                        rpcUrl: web3Config.rpcUrl,
                    },
                });

            case 'token-info':
                if (!address) {
                    return NextResponse.json(
                        { error: 'Address parameter is required' },
                        { status: 400 }
                    );
                }

                const tokenInfo = await web3Service.getTokenInfo();
                return NextResponse.json({
                    success: true,
                    data: tokenInfo,
                });

            case 'reward-info':
                if (!address) {
                    return NextResponse.json(
                        { error: 'Address parameter is required' },
                        { status: 400 }
                    );
                }

                const rewardInfo = await web3Service.getRewardInfo();
                return NextResponse.json({
                    success: true,
                    data: rewardInfo,
                });

            case 'p2p-listings':
                const listings = await web3Service.getP2PListings();
                return NextResponse.json({
                    success: true,
                    data: listings,
                });

            case 'transaction-status':
                const txHash = searchParams.get('txHash') as string | null;
                if (!txHash) {
                    return NextResponse.json(
                        { error: 'Transaction hash is required' },
                        { status: 400 }
                    );
                }

                const txStatus = await web3Service.getTransactionStatus(txHash);
                return NextResponse.json({
                    success: true,
                    data: txStatus,
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in Web3 GET:', error);
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
            case 'connect-wallet':
                const connected = await web3Service.initialize();
                if (connected) {
                    const address = await web3Service.getAddress();
                    return NextResponse.json({
                        success: true,
                        data: { address, connected: true },
                        message: 'Wallet connected successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to connect wallet' },
                        { status: 400 }
                    );
                }

            case 'transfer-tokens':
                const { to, amount } = data;
                if (!to || !amount) {
                    return NextResponse.json(
                        { error: 'Recipient address and amount are required' },
                        { status: 400 }
                    );
                }

                const transferSuccess = await web3Service.transferTokens(to, amount);
                if (transferSuccess) {
                    return NextResponse.json({
                        success: true,
                        message: 'Tokens transferred successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Token transfer failed' },
                        { status: 500 }
                    );
                }

            case 'claim-rewards':
                const claimSuccess = await web3Service.claimRewards();
                if (claimSuccess) {
                    return NextResponse.json({
                        success: true,
                        message: 'Rewards claimed successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to claim rewards' },
                        { status: 500 }
                    );
                }

            case 'create-p2p-listing':
                const { productId, price, quantity } = data;
                if (!productId || !price || !quantity) {
                    return NextResponse.json(
                        { error: 'Product ID, price, and quantity are required' },
                        { status: 400 }
                    );
                }

                const listingSuccess = await web3Service.createP2PListing(
                    parseInt(productId),
                    price.toString(),
                    quantity
                );
                if (listingSuccess) {
                    return NextResponse.json({
                        success: true,
                        message: 'P2P listing created successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to create P2P listing' },
                        { status: 500 }
                    );
                }

            case 'buy-p2p-listing':
                const { listingId, buyQuantity } = data;
                if (!listingId || !buyQuantity) {
                    return NextResponse.json(
                        { error: 'Listing ID and quantity are required' },
                        { status: 400 }
                    );
                }

                const buySuccess = await web3Service.buyFromP2PListing(
                    parseInt(listingId),
                    buyQuantity
                );
                if (buySuccess) {
                    return NextResponse.json({
                        success: true,
                        message: 'P2P purchase successful',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'P2P purchase failed' },
                        { status: 500 }
                    );
                }

            case 'sign-message':
                const { message } = data;
                if (!message) {
                    return NextResponse.json(
                        { error: 'Message is required' },
                        { status: 400 }
                    );
                }

                const signature = await web3Service.signMessage(message);
                if (signature) {
                    return NextResponse.json({
                        success: true,
                        data: { signature },
                        message: 'Message signed successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to sign message' },
                        { status: 500 }
                    );
                }

            case 'verify-message':
                const { message: verifyMessage, signature: verifySignature, address: verifyAddress } = data;
                if (!verifyMessage || !verifySignature || !verifyAddress) {
                    return NextResponse.json(
                        { error: 'Message, signature, and address are required' },
                        { status: 400 }
                    );
                }

                const isValid = web3Service.verifyMessage(verifyMessage, verifySignature, verifyAddress);
                return NextResponse.json({
                    success: true,
                    data: { isValid },
                    message: isValid ? 'Message verified successfully' : 'Message verification failed',
                });

            case 'gasless-transaction':
                const { to: recipient, data: txData, value, nonce, deadline, signature: txSignature } = data;
                if (!recipient || !txData || !nonce || !deadline || !txSignature) {
                    return NextResponse.json(
                        { error: 'All transaction parameters are required' },
                        { status: 400 }
                    );
                }

                const gaslessSuccess = await web3Service.executeGaslessTransaction({
                    to,
                    data: txData,
                    value: value || '0',
                    nonce,
                    deadline,
                    signature,
                });

                if (gaslessSuccess) {
                    return NextResponse.json({
                        success: true,
                        message: 'Gasless transaction executed successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Gasless transaction failed' },
                        { status: 500 }
                    );
                }

            case 'disconnect':
                await web3Service.disconnect();
                return NextResponse.json({
                    success: true,
                    message: 'Wallet disconnected successfully',
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in Web3 POST:', error);
        return NextResponse.json(
            { error: (error as Error).message || 'Failed to process request' },
            { status: 500 }
        );
    }
}