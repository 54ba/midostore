import { NextRequest, NextResponse } from 'next/server';
import MongoDBService from '@/lib/mongodb-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const status = searchParams.get('status');

        const dbService = MongoDBService.getInstance();
        await dbService.initialize();

        let services;

        if (type && status) {
            services = await dbService.getAIServices(type);
            services = services.filter(service => service.status === status);
        } else if (type) {
            services = await dbService.getAIServices(type);
        } else if (status) {
            services = await dbService.getAIServices();
            services = services.filter(service => service.status === status);
        } else {
            services = await dbService.getAIServices();
        }

        return NextResponse.json({
            success: true,
            data: services
        });
    } catch (error) {
        console.error('Error fetching AI services:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch AI services' },
            { status: 500 }
        );
    }
}