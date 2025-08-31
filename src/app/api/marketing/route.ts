import { NextRequest, NextResponse } from 'next/server';
import { MarketingService } from '@/lib/data-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'campaigns';
        const userId = searchParams.get('userId');

        let data;

        switch (type) {
            case 'campaigns':
                data = await MarketingService.getAdCampaigns(userId);
                break;
            case 'social-accounts':
                data = await MarketingService.getSocialMediaAccounts(userId);
                break;
            case 'p2p-listings':
                const status = searchParams.get('status') || 'ACTIVE';
                data = await MarketingService.getP2PListings(status);
                break;
            default:
                return NextResponse.json(
                    { success: false, error: 'Invalid marketing type' },
                    { status: 400 }
                );
        }

        return NextResponse.json({
            success: true,
            data
        });

    } catch (error) {
        console.error('Error fetching marketing data:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch marketing data' },
            { status: 500 }
        );
    }
}