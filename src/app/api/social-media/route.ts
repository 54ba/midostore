import { NextRequest, NextResponse } from 'next/server';
import MongoDBService from '@/lib/mongodb-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const platform = searchParams.get('platform');
        const type = searchParams.get('type'); // 'accounts' or 'trends'

        const dbService = MongoDBService.getInstance();
        await dbService.initialize();

        if (type === 'trends') {
            const trends = await dbService.getSocialTrends(platform);
            return NextResponse.json({
                success: true,
                data: trends
            });
        } else {
            // Default to accounts
            const accounts = await dbService.getSocialMediaAccounts(platform);
            return NextResponse.json({
                success: true,
                data: accounts
            });
        }
    } catch (error) {
        console.error('Error fetching social media data:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch social media data' },
            { status: 500 }
        );
    }
}