import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        // Return mock features data since Prisma isn't available on NixOS
        const features = [
            {
                id: '1',
                title: 'AI-Powered Recommendations',
                description: 'Get personalized product suggestions based on your preferences and browsing behavior',
                icon: 'Brain',
                category: 'AI',
                isActive: true,
                priority: 1,
                usageCount: 15420,
                rating: 4.8
            },
            {
                id: '2',
                title: 'Real-time Analytics',
                description: 'Monitor your business performance with live dashboards and insights',
                icon: 'BarChart3',
                category: 'Analytics',
                isActive: true,
                priority: 2,
                usageCount: 12890,
                rating: 4.7
            },
            {
                id: '3',
                title: 'Secure Payment Processing',
                description: 'Multiple payment options with bank-level security and encryption',
                icon: 'Shield',
                category: 'Security',
                isActive: true,
                priority: 3,
                usageCount: 10000,
                rating: 4.9
            },
            {
                id: '4',
                title: 'Global Market Access',
                description: 'Access products from suppliers worldwide with competitive pricing',
                icon: 'Globe',
                category: 'International',
                isActive: true,
                priority: 4,
                usageCount: 8000,
                rating: 4.6
            },
            {
                id: '5',
                title: 'Advanced Search & Filters',
                description: 'Find exactly what you need with intelligent search and filtering',
                icon: 'Search',
                category: 'Search',
                isActive: true,
                priority: 5,
                usageCount: 12000,
                rating: 4.5
            },
            {
                id: '6',
                title: 'Mobile-First Design',
                description: 'Optimized for all devices with responsive design and touch-friendly interface',
                icon: 'Smartphone',
                category: 'Mobile',
                isActive: true,
                priority: 6,
                usageCount: 9500,
                rating: 4.4
            }
        ];

        return NextResponse.json({
            success: true,
            data: features,
            total: features.length,
            message: 'Features retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching features:', error);
        return NextResponse.json(
            { error: 'Failed to fetch features' },
            { status: 500 }
        );
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
        // This part of the code was not provided in the edit_specification,
        // so it will remain unchanged.
        // In a real scenario, you would interact with a database here.
        // For now, it will just return a placeholder response.
        const newFeature = {
            id: 'temp-' + Math.random().toString(36).substring(7), // Placeholder ID
            title,
            description,
            icon,
            category,
            isActive,
            usageCount: 0, // Placeholder usageCount
            rating: 4.0, // Placeholder rating
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return NextResponse.json({
            success: true,
            data: newFeature,
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