const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.handler = async (event, context) => {
    const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

    try {
        const { source, category } = JSON.parse(event.body);
        if (!source || !category) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing params' }) };

        const job = await prisma.scrapingJob.create({
            data: { source, category, status: 'pending', totalProducts: 0, scrapedProducts: 0, failedProducts: 0 }
        });

        const products = Array.from({ length: 20 }, (_, i) => ({
            externalId: `${source}_${category}_${i + 1}`,
            title: `${category} Product ${i + 1}`,
            price: (Math.random() * 100 + 10).toFixed(2),
            category,
            source
        }));

        await prisma.scrapingJob.update({
            where: { id: job.id },
            data: { status: 'completed', totalProducts: products.length, scrapedProducts: products.length, failedProducts: 0 }
        });

        for (const product of products) {
            await prisma.product.upsert({
                where: { externalId: product.externalId },
                update: { title: product.title, price: product.price, category, source, lastUpdated: new Date() },
                create: { externalId: product.externalId, title: product.title, price: product.price, category, source, isActive: true }
            });
        }

        return { statusCode: 200, headers, body: JSON.stringify({ success: true, jobId: job.id, totalProducts: products.length }) };
    } catch (error) {
        console.error('Error:', error);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal error' }) };
    } finally {
        await prisma.$disconnect();
    }
};