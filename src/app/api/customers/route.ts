import { NextRequest, NextResponse } from 'next/server';
import { CustomerService } from '@/lib/data-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'stats';

        let data;

        switch (type) {
            case 'stats':
                data = await CustomerService.getCustomerStats();
                break;
            case 'orders':
                data = await CustomerService.getOrderStats();
                break;
            default:
                return NextResponse.json(
                    { success: false, error: 'Invalid customer data type' },
                    { status: 400 }
                );
        }

        return NextResponse.json({
            success: true,
            data
        });

    } catch (error) {
        console.error('Error fetching customer data:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch customer data' },
            { status: 500 }
        );
    }
}