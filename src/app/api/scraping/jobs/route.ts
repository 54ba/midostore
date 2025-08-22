import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        // Return mock scraping jobs data that matches the ScrapingDashboard interface
        const jobs = [
            {
                id: '1',
                source: 'alibaba',
                category: 'electronics',
                status: 'completed',
                totalProducts: 1250,
                scrapedProducts: 1250,
                failedProducts: 0,
                startedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
                completedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
            },
            {
                id: '2',
                source: 'alibaba',
                category: 'home-garden',
                status: 'running',
                totalProducts: 1000,
                scrapedProducts: 650,
                failedProducts: 2,
                startedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
                completedAt: null,
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString()
            },
            {
                id: '3',
                source: 'alibaba',
                category: 'fashion',
                status: 'pending',
                totalProducts: 800,
                scrapedProducts: 0,
                failedProducts: 0,
                startedAt: null,
                completedAt: null,
                createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
            }
        ];

        return NextResponse.json({
            success: true,
            data: jobs,
            total: jobs.length,
            message: 'Scraping jobs retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching scraping jobs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch scraping jobs' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { source, category, pageCount } = body;

        if (!source || !category) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Mock job creation that matches the expected interface
        const newJob = {
            id: Date.now().toString(),
            source: source || 'alibaba',
            category: category || 'electronics',
            status: 'pending',
            totalProducts: 0,
            scrapedProducts: 0,
            failedProducts: 0,
            startedAt: null,
            completedAt: null,
            createdAt: new Date().toISOString()
        };

        return NextResponse.json({
            success: true,
            data: newJob,
            message: 'Scraping job created successfully'
        });
    } catch (error) {
        console.error('Error creating scraping job:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create scraping job' },
            { status: 500 }
        );
    }
}