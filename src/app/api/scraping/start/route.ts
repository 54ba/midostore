import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { source, category, pageCount } = body;

        if (!source || !category) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: source and category are required' },
                { status: 400 }
            );
        }

        // Generate targetUrl based on source
        const targetUrl = source === 'alibaba'
            ? `https://www.alibaba.com/trade/search?fsb=y&IndexArea=product_en&CatId=&SearchText=${category}`
            : `https://www.aliexpress.com/wholesale?catId=0&initiative_id=SB_20231201&SearchText=${category}`;

        // Mock job start
        const newJob = {
            id: Date.now().toString(),
            source,
            status: 'running',
            progress: 0,
            startTime: new Date().toISOString(),
            endTime: null,
            productsFound: 0,
            errors: 0,
            targetUrl,
            category: category || 'general',
            pageCount: pageCount || 1,
            totalProducts: 0,
            scrapedProducts: 0,
            failedProducts: 0,
            createdAt: new Date().toISOString()
        };

        // Simulate some processing time
        await new Promise(resolve => setTimeout(resolve, 100));

        return NextResponse.json({
            success: true,
            data: newJob,
            message: 'Scraping job started successfully'
        });
    } catch (error) {
        console.error('Error starting scraping job:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to start scraping job' },
            { status: 500 }
        );
    }
}