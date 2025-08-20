const { PrismaClient } = require('@prisma/client');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

// Add plugins to puppeteer
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin());

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

        // Start scraping in background (Netlify functions have a timeout, so we'll do it synchronously)
        const result = await scrapeProducts(job.id, source, category, pageCount);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                jobId: job.id,
                result,
                message: 'Scraping completed successfully',
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

async function scrapeProducts(jobId, source, category, pageCount) {
    let browser;
    try {
        // Update job status to running
        await prisma.scrapingJob.update({
            where: { id: jobId },
            data: { status: 'running', startedAt: new Date() },
        });

        // Launch browser
        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
            ],
        });

        let products = [];

        // Scrape products based on source
        if (source === 'alibaba') {
            products = await scrapeAlibaba(browser, category, pageCount);
        } else if (source === 'aliexpress') {
            products = await scrapeAliExpress(browser, category, pageCount);
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
                await createProductFromScraped(product);
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

        return {
            scraped: scrapedCount,
            failed: failedCount,
            total: products.length,
        };
    } catch (error) {
        console.error('Error in scraping job:', error);

        // Update job status to failed
        await prisma.scrapingJob.update({
            where: { id: jobId },
            data: {
                status: 'failed',
                error: error.message || 'Unknown error',
                completedAt: new Date(),
            },
        });

        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

async function scrapeAlibaba(browser, category, pageCount) {
    const products = [];

    for (let page = 1; page <= pageCount; page++) {
        const pageUrl = `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(category)}&page=${page}`;

        const pageProducts = await scrapeAlibabaPage(browser, pageUrl);
        products.push(...pageProducts);

        // Delay between pages
        if (page < pageCount) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    return products;
}

async function scrapeAliExpress(browser, category, pageCount) {
    const products = [];

    for (let page = 1; page <= pageCount; page++) {
        const pageUrl = `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(category)}&page=${page}`;

        const pageProducts = await scrapeAliExpressPage(browser, pageUrl);
        products.push(...pageProducts);

        // Delay between pages
        if (page < pageCount) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    return products;
}

async function scrapeAlibabaPage(browser, url) {
    const page = await browser.newPage();
    const products = [];

    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.setViewport({ width: 1920, height: 1080 });

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Wait for products to load
        await page.waitForSelector('[data-product-id]', { timeout: 10000 });

        const productElements = await page.$$('[data-product-id]');

        for (const element of productElements) {
            try {
                const product = await extractAlibabaProduct(element);
                if (product) {
                    products.push(product);
                }
            } catch (error) {
                console.error('Error extracting product:', error);
            }
        }
    } catch (error) {
        console.error('Error scraping Alibaba page:', error);
    } finally {
        await page.close();
    }

    return products;
}

async function scrapeAliExpressPage(browser, url) {
    const page = await browser.newPage();
    const products = [];

    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.setViewport({ width: 1920, height: 1080 });

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Wait for products to load
        await page.waitForSelector('[data-product-id]', { timeout: 10000 });

        const productElements = await page.$$('[data-product-id]');

        for (const element of productElements) {
            try {
                const product = await extractAliExpressProduct(element);
                if (product) {
                    products.push(product);
                }
            } catch (error) {
                console.error('Error extracting product:', error);
            }
        }
    } catch (error) {
        console.error('Error scraping AliExpress page:', error);
    } finally {
        await page.close();
    }

    return products;
}

async function extractAlibabaProduct(element) {
    try {
        const externalId = await element.$eval('[data-product-id]', el => el.getAttribute('data-product-id'));
        const title = await element.$eval('.product-title', el => el.textContent?.trim());
        const priceText = await element.$eval('.product-price', el => el.textContent?.trim());
        const imageUrl = await element.$eval('img', el => el.src);

        if (!externalId || !title || !priceText) return null;

        const price = extractPrice(priceText);
        const currency = extractCurrency(priceText);

        return {
            externalId,
            source: 'alibaba',
            title,
            price,
            currency,
            images: [imageUrl],
            tags: [],
            reviewCount: 0,
            soldCount: 0,
            minOrderQuantity: 1,
            supplier: {
                externalId: 'unknown',
                name: 'Unknown Supplier',
                verified: false,
                goldMember: false,
            },
        };
    } catch (error) {
        console.error('Error extracting Alibaba product:', error);
        return null;
    }
}

async function extractAliExpressProduct(element) {
    try {
        const externalId = await element.$eval('[data-product-id]', el => el.getAttribute('data-product-id'));
        const title = await element.$eval('.product-title', el => el.textContent?.trim());
        const priceText = await element.$eval('.product-price', el => el.textContent?.trim());
        const imageUrl = await element.$eval('img', el => el.src);

        if (!externalId || !title || !priceText) return null;

        const price = extractPrice(priceText);
        const currency = extractCurrency(priceText);

        return {
            externalId,
            source: 'aliexpress',
            title,
            price,
            currency,
            images: [imageUrl],
            tags: [],
            reviewCount: 0,
            soldCount: 0,
            minOrderQuantity: 1,
            supplier: {
                externalId: 'unknown',
                name: 'Unknown Supplier',
                verified: false,
                goldMember: false,
            },
        };
    } catch (error) {
        console.error('Error extracting AliExpress product:', error);
        return null;
    }
}

function extractPrice(priceText) {
    const priceMatch = priceText.match(/[\d,]+\.?\d*/);
    if (priceMatch) {
        return parseFloat(priceMatch[0].replace(/,/g, ''));
    }
    return 0;
}

function extractCurrency(priceText) {
    if (priceText.includes('$')) return 'USD';
    if (priceText.includes('€')) return 'EUR';
    if (priceText.includes('£')) return 'GBP';
    if (priceText.includes('¥')) return 'CNY';
    return 'USD';
}

async function createProductFromScraped(scrapedProduct) {
    // Create or update supplier
    const supplier = await prisma.supplier.upsert({
        where: { externalId: scrapedProduct.supplier.externalId },
        update: {
            name: scrapedProduct.supplier.name,
            verified: scrapedProduct.supplier.verified,
            goldMember: scrapedProduct.supplier.goldMember,
        },
        create: {
            externalId: scrapedProduct.supplier.externalId,
            source: scrapedProduct.source,
            name: scrapedProduct.supplier.name,
            verified: scrapedProduct.supplier.verified,
            goldMember: scrapedProduct.supplier.goldMember,
        },
    });

    // Create product
    const product = await prisma.product.create({
        data: {
            externalId: scrapedProduct.externalId,
            source: scrapedProduct.source,
            title: scrapedProduct.title,
            price: scrapedProduct.price,
            currency: scrapedProduct.currency,
            images: scrapedProduct.images,
            tags: scrapedProduct.tags,
            reviewCount: scrapedProduct.reviewCount,
            soldCount: scrapedProduct.soldCount,
            minOrderQuantity: scrapedProduct.minOrderQuantity,
            supplierId: supplier.id,
            profitMargin: 25, // Default profit margin
            lastScraped: new Date(),
        },
    });

    return product;
}