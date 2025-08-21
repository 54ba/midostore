import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const source = searchParams.get('source');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        const skip = (page - 1) * limit;

        const where: any = {};
        if (status) where.status = status;
        if (source) where.source = source;

        const jobs = await prisma.scrapingJob.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        });

        const total = await prisma.scrapingJob.count({ where });

        return NextResponse.json({
            success: true,
            data: jobs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error getting scraping jobs:', error);
        return NextResponse.json(
            { error: 'Failed to get scraping jobs' },
            { status: 500 }
        );
    }
}