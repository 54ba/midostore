import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        // Fetch features from database or return default features
        const features = await prisma.feature.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                usageCount: 'desc'
            },
            take: 20
        });

        // If no features in database, return default features
        if (features.length === 0) {
            const defaultFeatures = [
                {
                    id: 'ai-recommendations',
                    title: 'AI-Powered Recommendations',
                    description: 'Intelligent product suggestions based on user behavior and preferences',
                    icon: 'Brain',
                    category: 'AI',
                    isActive: true,
                    usageCount: 15420,
                    rating: 4.8
                },
                {
                    id: 'real-time-analytics',
                    title: 'Real-Time Analytics',
                    description: 'Live business metrics and performance tracking',
                    icon: 'BarChart3',
                    category: 'Analytics',
                    isActive: true,
                    usageCount: 12890,
                    rating: 4.7
                },
                {
                    id: 'crypto-payments',
                    title: 'Crypto Payment Processing',
                    description: 'Accept Bitcoin, Ethereum, and other cryptocurrencies',
                    icon: 'Zap',
                    category: 'Payments',
                    isActive: true,
                    usageCount: 9870,
                    rating: 4.6
                },
                {
                    id: 'p2p-marketplace',
                    title: 'P2P Marketplace',
                    description: 'Decentralized peer-to-peer trading platform',
                    icon: 'Users',
                    category: 'Trading',
                    isActive: true,
                    usageCount: 7560,
                    rating: 4.5
                },
                {
                    id: 'order-batching',
                    title: 'Smart Order Batching',
                    description: 'Optimize shipping costs with intelligent order grouping',
                    icon: 'Package',
                    category: 'Logistics',
                    isActive: true,
                    usageCount: 6540,
                    rating: 4.4
                },
                {
                    id: 'live-updates',
                    title: 'Live Updates',
                    description: 'Real-time notifications and activity feeds',
                    icon: 'Clock',
                    category: 'Communication',
                    isActive: true,
                    usageCount: 5430,
                    rating: 4.3
                },
                {
                    id: 'multi-currency',
                    title: 'Multi-Currency Support',
                    description: 'Support for Gulf region and global currencies',
                    icon: 'Globe',
                    category: 'Localization',
                    isActive: true,
                    usageCount: 4320,
                    rating: 4.2
                },
                {
                    id: 'token-rewards',
                    title: 'Token Rewards System',
                    description: 'Loyalty tokens and reward programs',
                    icon: 'Award',
                    category: 'Loyalty',
                    isActive: true,
                    usageCount: 3980,
                    rating: 4.1
                }
            ];

            return NextResponse.json({
                success: true,
                data: defaultFeatures,
                message: 'Default features loaded successfully'
            });
        }

        // Transform database features to frontend format
        const transformedFeatures = features.map((feature: any) => ({
            id: feature.id,
            title: feature.title,
            description: feature.description,
            icon: feature.icon || 'Star',
            category: feature.category || 'General',
            isActive: feature.isActive,
            usageCount: feature.usageCount || 0,
            rating: feature.rating || 4.0
        }));

        return NextResponse.json({
            success: true,
            data: transformedFeatures,
            message: 'Features fetched successfully'
        });

    } catch (error) {
        console.error('Error fetching features:', error);

        // Return fallback features if database fails
        return NextResponse.json({
            success: true,
            data: [
                {
                    id: 'fallback-1',
                    title: 'AI-Powered Recommendations',
                    description: 'Intelligent product suggestions based on user behavior',
                    icon: 'Brain',
                    category: 'AI',
                    isActive: true,
                    usageCount: 15420,
                    rating: 4.8
                },
                {
                    id: 'fallback-2',
                    title: 'Real-Time Analytics',
                    description: 'Live business metrics and performance tracking',
                    icon: 'BarChart3',
                    category: 'Analytics',
                    isActive: true,
                    usageCount: 12890,
                    rating: 4.7
                }
            ],
            message: 'Using fallback features data'
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, icon, category, isActive = true } = body;

        if (!title || !description || !icon || !category) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create new feature
        const feature = await prisma.feature.create({
            data: {
                title,
                description,
                icon,
                category,
                isActive,
                usageCount: 0,
                rating: 4.0,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        return NextResponse.json({
            success: true,
            data: feature,
            message: 'Feature created successfully'
        });

    } catch (error) {
        console.error('Error creating feature:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create feature',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}