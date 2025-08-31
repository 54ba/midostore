import { NextRequest, NextResponse } from 'next/server';
import MongoDBService from '@/lib/mongodb-service';

export async function GET(request: NextRequest) {
  try {
    const dbService = MongoDBService.getInstance();
    await dbService.initialize();

    const analytics = await dbService.getAnalytics();

    return NextResponse.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}