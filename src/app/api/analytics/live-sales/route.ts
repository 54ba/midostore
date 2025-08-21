import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10');
        const timeRange = searchParams.get('timeRange') || '24h';

        // Calculate time range
        const now = new Date();
        let startTime: Date;

        switch (timeRange) {
            case '1h':
                startTime = new Date(now.getTime() - 60 * 60 * 1000);
                break;
            case '6h':
                startTime = new Date(now.getTime() - 6 * 60 * 60 * 1000);
                break;
            case '24h':
                startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case '7d':
                startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            default:
                startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        }

        // Get recent orders
        const recentOrders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: startTime,
                },
                status: {
                    in: ['completed', 'processing', 'shipped'],
                },
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                title: true,
                                category: true,
                            },
                        },
                    },
                },
                user: {
                    select: {
                        full_name: true,
                        email: true,
                    },
                },
                payment: {
                    select: {
                        method: true,
                        amount: true,
                        currency: true,
                        cryptoAmount: true,
                        cryptoType: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });

        // Transform data for ticker
        const liveSales = recentOrders.map((order: any) => {
            const totalAmount = order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
            const paymentMethod = order.payment?.method || 'traditional';

            return {
                id: order.id,
                productId: order.items[0]?.productId || 'unknown',
                productTitle: order.items[0]?.product?.title || 'Product',
                customer: order.user?.full_name || order.user?.email || 'Anonymous',
                amount: totalAmount,
                currency: order.payment?.currency || 'USD',
                paymentMethod: paymentMethod === 'crypto' ? 'crypto' : 'traditional',
                location: order.shippingAddress?.country || 'Unknown',
                timestamp: order.createdAt,
                isNew: order.createdAt > new Date(now.getTime() - 5 * 60 * 1000), // New if within 5 minutes
                cryptoAmount: order.payment?.cryptoAmount,
                cryptoType: order.payment?.cryptoType,
            };
        });

        // If no real orders, generate mock data for demonstration
        if (liveSales.length === 0) {
            const mockSales = generateMockSales(limit);
            return NextResponse.json({
                success: true,
                data: mockSales,
                message: 'Using mock data for demonstration',
            });
        }

        return NextResponse.json({
            success: true,
            data: liveSales,
        });

    } catch (error) {
        console.error('Error fetching live sales:', error);
        return NextResponse.json(
            { error: 'Failed to fetch live sales' },
            { status: 500 }
        );
    }
}

// Generate mock sales data for demonstration
function generateMockSales(limit: number) {
    const mockProducts = [
        'Wireless Bluetooth Headphones',
        'Smart Fitness Watch',
        'Gaming Mechanical Keyboard',
        '4K Ultra HD Camera',
        'Portable Power Bank',
        'Wireless Charging Pad',
        'Bluetooth Speaker',
        'Smart Home Hub',
        'USB-C Hub',
        'Wireless Mouse',
    ];

    const mockCustomers = [
        'Sarah M.',
        'John D.',
        'Maria L.',
        'Alex K.',
        'Emma R.',
        'David S.',
        'Lisa T.',
        'Mike W.',
        'Anna B.',
        'Tom H.',
    ];

    const mockLocations = [
        'New York, US',
        'London, UK',
        'Dubai, UAE',
        'Toronto, CA',
        'Sydney, AU',
        'Berlin, DE',
        'Paris, FR',
        'Tokyo, JP',
        'Singapore, SG',
        'Mumbai, IN',
    ];

    const mockSales = [];
    const now = new Date();

    for (let i = 0; i < limit; i++) {
        const randomTime = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
        const randomAmount = Math.floor(Math.random() * 500) + 50;
        const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
        const randomCustomer = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
        const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
        const isCrypto = Math.random() > 0.7; // 30% chance of crypto payment

        mockSales.push({
            id: `mock-${i + 1}`,
            productId: `prod-${i + 1}`,
            productTitle: randomProduct,
            customer: randomCustomer,
            amount: randomAmount,
            currency: 'USD',
            paymentMethod: isCrypto ? 'crypto' : 'traditional',
            location: randomLocation,
            timestamp: randomTime,
            isNew: randomTime > new Date(now.getTime() - 5 * 60 * 1000),
            cryptoAmount: isCrypto ? (randomAmount / 43000) : undefined, // BTC equivalent
            cryptoType: isCrypto ? 'BTC' : undefined,
        });
    }

    // Sort by timestamp (newest first)
    return mockSales.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}