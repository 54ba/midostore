// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import MongoDBService from '@/lib/mongodb-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const type = searchParams.get('type');

        const dbService = MongoDBService.getInstance();
        await dbService.initialize();

        let campaigns;

        if (status && type) {
            campaigns = await dbService.getAdvertisingCampaigns(status);
            campaigns = campaigns.filter(campaign => campaign.type === type);
        } else if (status) {
            campaigns = await dbService.getAdvertisingCampaigns(status);
        } else if (type) {
            campaigns = await dbService.getAdvertisingCampaigns();
            campaigns = campaigns.filter(campaign => campaign.type === type);
        } else {
            campaigns = await dbService.getAdvertisingCampaigns();
        }

        return NextResponse.json({
            success: true,
            data: campaigns
        });
    } catch (error) {
        console.error('Error fetching advertising campaigns:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch advertising campaigns' },
            { status: 500 }
        );
    }
}