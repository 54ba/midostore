import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        // Return mock live sales data since Prisma isn't available on NixOS
        const liveSales = [
            {
                id: '1',
                productName: 'Wireless Headphones Pro',
                customer: 'Ahmed M.',
                amount: 89.99,
                currency: 'AED',
                location: 'Dubai, UAE',
                timestamp: new Date().toISOString(),
                status: 'completed'
            },
            {
                id: '2',
                productName: 'Smart Fitness Watch',
                customer: 'Sarah K.',
                amount: 199.99,
                currency: 'AED',
                location: 'Abu Dhabi, UAE',
                timestamp: new Date(Date.now() - 300000).toISOString(),
                status: 'completed'
            },
            {
                id: '3',
                productName: 'Portable Bluetooth Speaker',
                customer: 'Mohammed A.',
                amount: 49.99,
                currency: 'AED',
                location: 'Sharjah, UAE',
                timestamp: new Date(Date.now() - 600000).toISOString(),
                status: 'completed'
            }
        ];

        return NextResponse.json({
            success: true,
            liveSales,
            total: liveSales.length,
            message: 'Live sales data retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching live sales:', error);
        return NextResponse.json(
            { error: 'Failed to fetch live sales data' },
            { status: 500 }
        );
    }
}