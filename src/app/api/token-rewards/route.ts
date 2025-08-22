// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import TokenRewardsService from '@/lib/token-rewards-service';

// Initialize token rewards service
const tokenRewardsService = new TokenRewardsService();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');
        const userId = searchParams.get('userId');

        if (!action) {
            return NextResponse.json({
                success: false,
                error: 'Action parameter is required'
            }, { status: 400 });
        }

        let result;
        switch (action) {
            case 'user-rewards':
                if (!userId) {
                    return NextResponse.json({
                        success: false,
                        error: 'User ID is required for user-rewards action'
                    }, { status: 400 });
                }
                result = await tokenRewardsService.getUserRewards(userId);
                break;
            case 'leaderboard':
                result = await tokenRewardsService.getLeaderboard();
                break;
            case 'available-rewards':
                result = await tokenRewardsService.getAvailableRewards();
                break;
            default:
                return NextResponse.json({
                    success: false,
                    error: 'Invalid action'
                }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error in token-rewards GET:', error);
        return NextResponse.json({
            success: false,
            error: 'Internal server error'
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, ...data } = body;

        switch (action) {
            case 'award-tokens':
                const { userId: awardUserId, activityType, metadata } = data;

                if (!awardUserId || !activityType) {
                    return NextResponse.json(
                        { error: 'User ID and activity type are required' },
                        { status: 400 }
                    );
                }

                const rewardActivity = await tokenRewardsService.awardTokens(
                    awardUserId,
                    activityType,
                    metadata || {}
                );

                if (rewardActivity) {
                    return NextResponse.json({
                        success: true,
                        data: rewardActivity,
                        message: 'Tokens awarded successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to award tokens' },
                        { status: 500 }
                    );
                }

            case 'transfer-tokens':
                const { fromUserId, toUserId, amount } = data;

                if (!fromUserId || !toUserId || !amount) {
                    return NextResponse.json(
                        { error: 'From user ID, to user ID, and amount are required' },
                        { status: 400 }
                    );
                }

                const transferSuccess = await tokenRewardsService.transferTokens(
                    fromUserId,
                    toUserId,
                    amount
                );

                if (transferSuccess) {
                    return NextResponse.json({
                        success: true,
                        message: 'Tokens transferred successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to transfer tokens' },
                        { status: 500 }
                    );
                }

            case 'daily-login':
                const { userId: loginUserId } = data;
                if (!loginUserId) {
                    return NextResponse.json(
                        { error: 'User ID is required' },
                        { status: 400 }
                    );
                }

                const loginReward = await tokenRewardsService.awardTokens(
                    loginUserId,
                    'daily_login',
                    { timestamp: new Date().toISOString() }
                );

                if (loginReward) {
                    return NextResponse.json({
                        success: true,
                        data: loginReward,
                        message: 'Daily login reward claimed successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Daily login reward already claimed or failed' },
                        { status: 400 }
                    );
                }

            case 'product-purchase':
                const { userId: purchaseUserId, productId, amount: purchaseAmount, quantity } = data;

                if (!purchaseUserId || !productId || !purchaseAmount) {
                    return NextResponse.json(
                        { error: 'User ID, product ID, and amount are required' },
                        { status: 400 }
                    );
                }

                const purchaseReward = await tokenRewardsService.awardTokens(
                    purchaseUserId,
                    'product_purchase',
                    { productId, amount, quantity: quantity || 1 }
                );

                if (purchaseReward) {
                    return NextResponse.json({
                        success: true,
                        data: purchaseReward,
                        message: 'Purchase reward awarded successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to award purchase reward' },
                        { status: 500 }
                    );
                }

            case 'product-review':
                const { userId: reviewUserId, productId: reviewProductId, reviewLength, helpfulVotes } = data;

                if (!reviewUserId || !reviewProductId) {
                    return NextResponse.json(
                        { error: 'User ID and product ID are required' },
                        { status: 400 }
                    );
                }

                const reviewReward = await tokenRewardsService.awardTokens(
                    reviewUserId,
                    'product_review',
                    { productId: reviewProductId, length: reviewLength || 0, helpfulVotes: helpfulVotes || 0 }
                );

                if (reviewReward) {
                    return NextResponse.json({
                        success: true,
                        data: reviewReward,
                        message: 'Review reward awarded successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to award review reward' },
                        { status: 500 }
                    );
                }

            case 'referral':
                const { userId: referralUserId, referredUserId, referralSignup, firstPurchase } = data;

                if (!referralUserId || !referredUserId) {
                    return NextResponse.json(
                        { error: 'Referrer user ID and referred user ID are required' },
                        { status: 400 }
                    );
                }

                const referralReward = await tokenRewardsService.awardTokens(
                    referralUserId,
                    'referral',
                    { referredUserId, referralSignup: referralSignup || false, firstPurchase: firstPurchase || false }
                );

                if (referralReward) {
                    return NextResponse.json({
                        success: true,
                        data: referralReward,
                        message: 'Referral reward awarded successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to award referral reward' },
                        { status: 500 }
                    );
                }

            case 'social-sharing':
                const { userId: sharingUserId, platform, productId: sharingProductId } = data;

                if (!sharingUserId || !platform) {
                    return NextResponse.json(
                        { error: 'User ID and platform are required' },
                        { status: 400 }
                    );
                }

                const sharingReward = await tokenRewardsService.awardTokens(
                    sharingUserId,
                    'social_sharing',
                    { platform, productId: sharingProductId }
                );

                if (sharingReward) {
                    return NextResponse.json({
                        success: true,
                        data: sharingReward,
                        message: 'Social sharing reward awarded successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to award social sharing reward' },
                        { status: 500 }
                    );
                }

            case 'bulk-purchase':
                const { userId: bulkUserId, productId: bulkProductId, amount: bulkAmount, quantity: bulkQuantity } = data;

                if (!bulkUserId || !bulkProductId || !bulkAmount || !bulkQuantity) {
                    return NextResponse.json(
                        { error: 'User ID, product ID, amount, and quantity are required' },
                        { status: 400 }
                    );
                }

                const bulkReward = await tokenRewardsService.awardTokens(
                    bulkUserId,
                    'bulk_purchase',
                    { productId: bulkProductId, amount: bulkAmount, quantity: bulkQuantity }
                );

                if (bulkReward) {
                    return NextResponse.json({
                        success: true,
                        data: bulkReward,
                        message: 'Bulk purchase reward awarded successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to award bulk purchase reward' },
                        { status: 500 }
                    );
                }

            case 'early-adopter':
                const { userId: earlyUserId, featureName } = data;

                if (!earlyUserId || !featureName) {
                    return NextResponse.json(
                        { error: 'User ID and feature name are required' },
                        { status: 400 }
                    );
                }

                const earlyAdopterReward = await tokenRewardsService.awardTokens(
                    earlyUserId,
                    'early_adopter',
                    { featureName, withinDays: 7 }
                );

                if (earlyAdopterReward) {
                    return NextResponse.json({
                        success: true,
                        data: earlyAdopterReward,
                        message: 'Early adopter reward awarded successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to award early adopter reward' },
                        { status: 500 }
                    );
                }

            case 'community-contribution':
                const { userId: contributionUserId, contributionType, description } = data;

                if (!contributionUserId || !contributionType) {
                    return NextResponse.json(
                        { error: 'User ID and contribution type are required' },
                        { status: 400 }
                    );
                }

                const contributionReward = await tokenRewardsService.awardTokens(
                    contributionUserId,
                    'community_contribution',
                    { contributionType, description }
                );

                if (contributionReward) {
                    return NextResponse.json({
                        success: true,
                        data: contributionReward,
                        message: 'Community contribution reward awarded successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to award community contribution reward' },
                        { status: 500 }
                    );
                }

            case 'loyalty-streak':
                const { userId: streakUserId, consecutiveDays } = data;

                if (!streakUserId || !consecutiveDays) {
                    return NextResponse.json(
                        { error: 'User ID and consecutive days are required' },
                        { status: 400 }
                    );
                }

                const loyaltyReward = await tokenRewardsService.awardTokens(
                    streakUserId,
                    'loyalty_streak',
                    { consecutiveDays }
                );

                if (loyaltyReward) {
                    return NextResponse.json({
                        success: true,
                        data: loyaltyReward,
                        message: 'Loyalty streak reward awarded successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to award loyalty streak reward' },
                        { status: 500 }
                    );
                }

            case 'p2p-trading':
                const { userId: tradingUserId, orderId, amount: tradingAmount } = data;

                if (!tradingUserId || !orderId || !tradingAmount) {
                    return NextResponse.json(
                        { error: 'User ID, order ID, and amount are required' },
                        { status: 400 }
                    );
                }

                const tradingReward = await tokenRewardsService.awardTokens(
                    tradingUserId,
                    'p2p_trading',
                    { orderId, amount: tradingAmount, successfulTrade: true }
                );

                if (tradingReward) {
                    return NextResponse.json({
                        success: true,
                        data: tradingReward,
                        message: 'P2P trading reward awarded successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to award P2P trading reward' },
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
        console.error('Error in token rewards POST:', error);
        return NextResponse.json(
            { error: (error as Error).message || 'Failed to process request' },
            { status: 500 }
        );
    }
}