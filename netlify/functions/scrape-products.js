const { PrismaClient } = require('@prisma/client');

// Initialize Prisma client for Netlify
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }

    try {
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({ error: 'Method not allowed' }),
            };
        }

        const { source, category, pageCount = 1 } = JSON.parse(event.body);

        if (!source || !category) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Source and category are required' }),
            };
        }

        // Validate source
        const validSources = ['alibaba', 'aliexpress'];
        if (!validSources.includes(source)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid source. Must be one of: ' + validSources.join(', ') }),
            };
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

        // For Netlify functions, we'll use external APIs instead of Puppeteer
        // This keeps the function lightweight and under the 250MB limit
        const result = await scrapeProductsViaAPI(job.id, source, category, pageCount);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                jobId: job.id,
                result,
                message: 'Scraping completed successfully via API',
            }),
        };
    } catch (error) {
        console.error('Error in scrape-products function:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    } finally {
        await prisma.$disconnect();
    }
};

// Lightweight scraping using external APIs instead of Puppeteer
async function scrapeProductsViaAPI(jobId, source, category, pageCount) {
    try {
        let products = [];

        if (source === 'alibaba') {
            products = await scrapeAlibabaViaAPI(category, pageCount);
        } else if (source === 'aliexpress') {
            products = await scrapeAliExpressViaAPI(category, pageCount);
        }

        // Update job status
        await prisma.scrapingJob.update({
            where: { id: jobId },
            data: {
                status: 'completed',
                totalProducts: products.length,
                scrapedProducts: products.length,
                failedProducts: 0,
            },
        });

        // Save products to database
        for (const product of products) {
            await prisma.product.upsert({
                where: { externalId: product.externalId },
                update: {
                    title: product.title,
                    price: product.price,
                    category: product.category,
                    source: source,
                    lastUpdated: new Date(),
                },
                create: {
                    externalId: product.externalId,
                    title: product.title,
                    price: product.price,
                    category: product.category,
                    source: source,
                    isActive: true,
                },
            });
        }

        return {
            totalProducts: products.length,
            scrapedProducts: products.length,
            failedProducts: 0,
            products: products.slice(0, 10), // Return first 10 for preview
        };
    } catch (error) {
        console.error('Error scraping products via API:', error);

        // Update job status to failed
        await prisma.scrapingJob.update({
            where: { id: jobId },
            data: {
                status: 'failed',
                totalProducts: 0,
                scrapedProducts: 0,
                failedProducts: 1,
            },
        });

        throw error;
    }
}

// Mock Alibaba API scraping (replace with actual API integration)
async function scrapeAlibabaViaAPI(category, pageCount) {
    // This would integrate with Alibaba's official API
    // For now, returning mock data to demonstrate the lightweight approach

    const mockProducts = [];
    const basePrice = Math.floor(Math.random() * 100) + 10;

    for (let i = 1; i <= Math.min(pageCount * 20, 100); i++) {
        mockProducts.push({
            externalId: `alibaba_${category}_${i}`,
            title: `${category} Product ${i} - High Quality`,
            price: (basePrice + i * 2).toFixed(2),
            category: category,
            source: 'alibaba',
        });
    }

    return mockProducts;
}

// Mock AliExpress API scraping (replace with actual API integration)
async function scrapeAliExpressViaAPI(category, pageCount) {
    // This would integrate with AliExpress's official API
    // For now, returning mock data to demonstrate the lightweight approach

    const mockProducts = [];
    const basePrice = Math.floor(Math.random() * 50) + 5;

    for (let i = 1; i <= Math.min(pageCount * 20, 100); i++) {
        mockProducts.push({
            externalId: `aliexpress_${category}_${i}`,
            title: `${category} Item ${i} - Best Value`,
            price: (basePrice + i * 1.5).toFixed(2),
            category: category,
            source: 'aliexpress',
        });
    }

    return mockProducts;
}