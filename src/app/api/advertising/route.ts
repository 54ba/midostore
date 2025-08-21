import { NextRequest, NextResponse } from 'next/server';
import AdvertisingService from '@/lib/advertising-service';

const advertisingService = new AdvertisingService();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');
        const userId = searchParams.get('userId');
        const campaignId = searchParams.get('campaignId');
        const status = searchParams.get('status');

        if (!userId) {
            // Provide demo data if no user ID is provided
            return NextResponse.json({
                success: true,
                data: {
                    campaigns: [
                        {
                            id: 'demo-campaign-1',
                            name: 'Demo Campaign',
                            status: 'active',
                            budget: 1000,
                            impressions: 5000,
                            clicks: 250,
                            conversions: 25
                        }
                    ],
                    credits: 1000,
                    platforms: ['google', 'facebook', 'instagram']
                },
                message: 'Demo advertising data (provide userId for real data)'
            });
        }

        switch (action) {
            case 'campaigns':
                const campaigns = await advertisingService.getUserCampaigns(userId, status);
                return NextResponse.json({
                    success: true,
                    data: campaigns,
                });

            case 'campaign':
                if (!campaignId) {
                    return NextResponse.json(
                        { error: 'Campaign ID is required' },
                        { status: 400 }
                    );
                }

                const campaign = await advertisingService.getUserCampaigns(userId);
                const targetCampaign = campaign.find(c => c.id === campaignId);

                if (!targetCampaign) {
                    return NextResponse.json(
                        { error: 'Campaign not found' },
                        { status: 404 }
                    );
                }

                return NextResponse.json({
                    success: true,
                    data: targetCampaign,
                });

            case 'performance':
                if (!campaignId) {
                    return NextResponse.json(
                        { error: 'Campaign ID is required' },
                        { status: 400 }
                    );
                }

                const performance = await advertisingService.getCampaignPerformance(campaignId, userId);
                return NextResponse.json({
                    success: true,
                    data: performance,
                });

            case 'credits':
                const credits = await advertisingService.getUserCredits(userId);
                return NextResponse.json({
                    success: true,
                    data: credits,
                });

            case 'platforms':
                const platforms = await advertisingService.getPlatformIntegrations(userId);
                return NextResponse.json({
                    success: true,
                    data: platforms,
                });

            case 'targeting-suggestions':
                const productId = searchParams.get('productId');
                const platform = searchParams.get('platform');

                if (!productId || !platform) {
                    return NextResponse.json(
                        { error: 'Product ID and platform are required' },
                        { status: 400 }
                    );
                }

                const targeting = await advertisingService.getTargetingSuggestions(productId, platform);
                return NextResponse.json({
                    success: true,
                    data: targeting,
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in advertising GET:', error);
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
            case 'create-campaign':
                const { userId, productId, ...campaignData } = data;

                if (!userId || !productId) {
                    return NextResponse.json(
                        { error: 'User ID and product ID are required' },
                        { status: 400 }
                    );
                }

                const campaign = await advertisingService.createAdCampaign(
                    userId,
                    productId,
                    campaignData
                );

                return NextResponse.json({
                    success: true,
                    data: campaign,
                    message: 'Campaign created successfully',
                });

            case 'update-campaign':
                const { campaignId, userId: updateUserId, ...updates } = data;

                if (!campaignId || !updateUserId) {
                    return NextResponse.json(
                        { error: 'Campaign ID and user ID are required' },
                        { status: 400 }
                    );
                }

                const updatedCampaign = await advertisingService.updateAdCampaign(
                    campaignId,
                    updateUserId,
                    updates
                );

                return NextResponse.json({
                    success: true,
                    data: updatedCampaign,
                    message: 'Campaign updated successfully',
                });

            case 'launch-campaign':
                const { campaignId: launchCampaignId, userId: launchUserId } = data;

                if (!launchCampaignId || !launchUserId) {
                    return NextResponse.json(
                        { error: 'Campaign ID and user ID are required' },
                        { status: 400 }
                    );
                }

                const launchSuccess = await advertisingService.launchCampaign(
                    launchCampaignId,
                    launchUserId
                );

                if (launchSuccess) {
                    return NextResponse.json({
                        success: true,
                        message: 'Campaign launched successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to launch campaign' },
                        { status: 500 }
                    );
                }

            case 'pause-campaign':
                const { campaignId: pauseCampaignId, userId: pauseUserId } = data;

                if (!pauseCampaignId || !pauseUserId) {
                    return NextResponse.json(
                        { error: 'Campaign ID and user ID are required' },
                        { status: 400 }
                    );
                }

                const pauseSuccess = await advertisingService.pauseCampaign(
                    pauseCampaignId,
                    pauseUserId
                );

                if (pauseSuccess) {
                    return NextResponse.json({
                        success: true,
                        message: 'Campaign paused successfully',
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to pause campaign' },
                        { status: 500 }
                    );
                }

            case 'create-creative':
                const { campaignId: creativeCampaignId, userId: creativeUserId, ...creativeData } = data;

                if (!creativeCampaignId || !creativeUserId) {
                    return NextResponse.json(
                        { error: 'Campaign ID and user ID are required' },
                        { status: 400 }
                    );
                }

                const creative = await advertisingService.createAdCreative(
                    creativeCampaignId,
                    creativeUserId,
                    creativeData
                );

                return NextResponse.json({
                    success: true,
                    data: creative,
                    message: 'Creative created successfully',
                });

            case 'purchase-credits':
                const { userId: creditUserId, amount, paymentMethod } = data;

                if (!creditUserId || !amount || !paymentMethod) {
                    return NextResponse.json(
                        { error: 'User ID, amount, and payment method are required' },
                        { status: 400 }
                    );
                }

                const updatedCredits = await advertisingService.purchaseCredits(
                    creditUserId,
                    amount,
                    paymentMethod
                );

                return NextResponse.json({
                    success: true,
                    data: updatedCredits,
                    message: 'Credits purchased successfully',
                });

            case 'connect-platform':
                const { userId: platformUserId, platformCode, credentials } = data;

                if (!platformUserId || !platformCode || !credentials) {
                    return NextResponse.json(
                        { error: 'User ID, platform code, and credentials are required' },
                        { status: 400 }
                    );
                }

                const platform = await advertisingService.connectPlatform(
                    platformUserId,
                    platformCode,
                    credentials
                );

                return NextResponse.json({
                    success: true,
                    data: platform,
                    message: 'Platform connected successfully',
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in advertising POST:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process request' },
            { status: 500 }
        );
    }
}