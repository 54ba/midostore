import { NextRequest, NextResponse } from 'next/server';
import MongoDBService from '@/lib/mongodb-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const status = searchParams.get('status');

        const dbService = MongoDBService.getInstance();
        await dbService.initialize();

        let packages;

        if (category && status) {
            packages = await dbService.getIntegrationPackages(category);
            packages = packages.filter(pkg => pkg.status === status);
        } else if (category) {
            packages = await dbService.getIntegrationPackages(category);
        } else if (status) {
            packages = await dbService.getIntegrationPackages();
            packages = packages.filter(pkg => pkg.status === status);
        } else {
            packages = await dbService.getIntegrationPackages();
        }

        return NextResponse.json({
            success: true,
            data: packages
        });
    } catch (error) {
        console.error('Error fetching integration packages:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch integration packages' },
            { status: 500 }
        );
    }
}