import { NextRequest, NextResponse } from 'next/server';
import MongoDBService from '@/lib/mongodb-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const status = searchParams.get('status');

        const dbService = MongoDBService.getInstance();
        await dbService.initialize();

        let operations;

        if (type && status) {
            operations = await dbService.getMiningOperations(type);
            operations = operations.filter(op => op.status === status);
        } else if (type) {
            operations = await dbService.getMiningOperations(type);
        } else if (status) {
            operations = await dbService.getMiningOperations();
            operations = operations.filter(op => op.status === status);
        } else {
            operations = await dbService.getMiningOperations();
        }

        return NextResponse.json({
            success: true,
            data: operations
        });
    } catch (error) {
        console.error('Error fetching mining operations:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch mining operations' },
            { status: 500 }
        );
    }
}