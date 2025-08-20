// Temporarily commented out to fix build issues
/*
import { NextRequest, NextResponse } from 'next/server';
import { ScrapingService } from '@/lib/scraping-service';
import { ProductService } from '@/lib/product-service';
import { prisma } from '@/lib/db';
import { config } from '@/env.config';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { source, category, pageCount = 1 } = body;

        if (!source || !category) {
            return NextResponse.json(
                { error: 'Source and category are required' },
                { status: 400 }
            );
        }

        if (!config.scrapingSources.includes(source)) {
            return NextResponse.json(
                { error: 'Invalid source. Must be one of: ' + config.scrapingSources.join(', ') },
                { status: 400 }
            );
        }

        // Create scraping job
        const job = await prisma.scrapingJob.create({
            data: {
                source,
                category,
                status: 'pending',
                totalProducts: 0,
                scrapedProducts: 0,
                failedProducts: 0,
            },
        });

        // Start scraping in background
        startScrapingJob(job.id, source, category, pageCount);

        return NextResponse.json({
            success: true,
            jobId: job.id,
            message: 'Scraping job started successfully',
        });
    } catch (error) {
        console.error('Error starting scraping job:', error);
        return NextResponse.json(
            { error: 'Failed to start scraping job' },
            { status: 500 }
        );
    }
}

async function startScrapingJob(jobId: string, source: string, category: string, pageCount: number) {
    const scrapingService = new ScrapingService();
    const productService = new ProductService();

    try {
        // Update job status to running
        await prisma.scrapingJob.update({
            where: { id: jobId },
            data: { status: 'running', startedAt: new Date() },
        });

        let products: any[] = [];

        // Scrape products based on source
        if (source === 'alibaba') {
            products = await scrapingService.scrapeAlibaba(category, pageCount);
        } else if (source === 'aliexpress') {
            products = await scrapingService.scrapeAliExpress(category, pageCount);
        }

        // Update job with total products found
        await prisma.scrapingJob.update({
            where: { id: jobId },
            data: { totalProducts: products.length },
        });

        let scrapedCount = 0;
        let failedCount = 0;

        // Process each product
        for (const product of products) {
            try {
                await productService.createProductFromScraped(product);
                scrapedCount++;
            } catch (error) {
                console.error('Error processing product:', error);
                failedCount++;
            }

            // Update progress
            await prisma.scrapingJob.update({
                where: { id: jobId },
                data: {
                    scrapedProducts: scrapedCount,
                    failedProducts: failedCount,
                },
            });

            // Small delay between products
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Update job status to completed
        await prisma.scrapingJob.update({
            where: { id: jobId },
            data: {
                status: 'completed',
                completedAt: new Date(),
                scrapedProducts: scrapedCount,
                failedProducts: failedCount,
            },
        });

        console.log(`Scraping job ${jobId} completed. Scraped: ${scrapedCount}, Failed: ${failedCount}`);
    } catch (error) {
        console.error('Error in scraping job:', error);

        // Update job status to failed
        await prisma.scrapingJob.update({
            where: { id: jobId },
            data: {
                status: 'failed',
                error: error instanceof Error ? error.message : 'Unknown error',
                completedAt: new Date(),
            },
        });
    } finally {
        await scrapingService.close();
    }
}
*/

export async function POST() {
    return new Response('Scraping temporarily disabled', { status: 503 });
}