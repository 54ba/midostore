import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import envConfig from '../env.config';
import { prisma } from './db';
import { format } from 'date-fns';


// Add plugins to puppeteer
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin());

export interface ScrapedProduct {
    externalId: string;
    source: 'alibaba' | 'aliexpress';
    title: string;
    description?: string;
    price: number;
    originalPrice?: number;
    currency: string;
    images: string[];
    category?: string;
    subcategory?: string;
    tags: string[];
    rating?: number;
    reviewCount: number;
    soldCount: number;
    minOrderQuantity: number;
    maxOrderQuantity?: number;
    shippingWeight?: number;
    shippingDimensions?: string;
    variants?: Array<{
        name: string;
        value: string;
        price: number;
        stock: number;
        sku: string;
    }>;
    supplier: {
        externalId: string;
        name: string;
        companyName?: string;
        country?: string;
        city?: string;
        rating?: number;
        responseRate?: number;
        responseTime?: string;
        verified: boolean;
        goldMember: boolean;
    };
}

export class ScrapingService {
    private browser: any;
    private isInitialized = false;

    async initialize() {
        if (this.isInitialized) return;

        try {
            this.browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-renderer-backgrounding',
                    '--disable-features=TranslateUI',
                    '--disable-ipc-flooding-protection',
                    '--disable-extensions',
                    '--disable-plugins',
                    '--disable-web-security',
                    '--disable-features=VizDisplayCompositor',
                ],
                executablePath: process.env.CHROME_BIN || undefined,
            });

            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to launch browser with puppeteer:', error);

            // Fallback: try to use system Chrome
            try {
                this.browser = await puppeteer.launch({
                    headless: true,
                    executablePath: '/usr/bin/google-chrome-stable',
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                });
                this.isInitialized = true;
            } catch (fallbackError) {
                console.error('Failed to launch browser with fallback:', fallbackError);
                throw new Error('Could not launch browser. Please ensure Chrome is installed or set CHROME_BIN environment variable.');
            }
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.isInitialized = false;
        }
    }

    async scrapeAlibaba(category: string, pageCount: number = 1): Promise<ScrapedProduct[]> {
        await this.initialize();
        const products: ScrapedProduct[] = [];

        try {
            for (let page = 1; page <= pageCount; page++) {
                const pageUrl = `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(category)}&page=${page}`;

                const pageProducts = await this.scrapeAlibabaPage(pageUrl);
                products.push(...pageProducts);

                // Delay between pages to avoid being blocked
                if (page < pageCount) {
                    await this.delay(envConfig.scraping.delayMs);
                }
            }
        } catch (error) {
            console.error('Error scraping Alibaba:', error);
        }

        return products;
    }

    async scrapeAliExpress(category: string, pageCount: number = 1): Promise<ScrapedProduct[]> {
        await this.initialize();
        const products: ScrapedProduct[] = [];

        try {
            for (let page = 1; page <= pageCount; page++) {
                const pageUrl = `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(category)}&page=${page}`;

                const pageProducts = await this.scrapeAliExpressPage(pageUrl);
                products.push(...pageProducts);

                // Delay between pages to avoid being blocked
                if (page < pageCount) {
                    await this.delay(envConfig.scraping.delayMs);
                }
            }
        } catch (error) {
            console.error('Error scraping AliExpress:', error);
        }

        return products;
    }

    private async scrapeAlibabaPage(url: string): Promise<ScrapedProduct[]> {
        const page = await this.browser.newPage();
        const products: ScrapedProduct[] = [];

        try {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            await page.setViewport({ width: 1920, height: 1080 });

            console.log(`🌐 Navigating to: ${url}`);
            await page.goto(url, { waitUntil: 'networkidle2', timeout: envConfig.scraping.timeoutMs });

            // Wait for products to load - try multiple selectors
            let productElements: any[] = [];
            try {
                // Wait for any of these selectors to appear
                await page.waitForSelector('.list-item, .product-item, [data-product-id], .J_MouserOverProduct', { timeout: 15000 });

                // Try different selectors for product containers
                productElements = await page.$$('.list-item, .product-item, [data-product-id], .J_MouserOverProduct');

                if (productElements.length === 0) {
                    // Fallback: look for any div that might contain product info
                    productElements = await page.$$('div[class*="product"], div[class*="item"]');
                }

                console.log(`🔍 Found ${productElements.length} potential product elements`);
            } catch (error) {
                console.log('⚠️ No product elements found with standard selectors, trying fallback...');
                // Take a screenshot for debugging
                await page.screenshot({ path: 'alibaba-debug.png', fullPage: true });
            }

            for (let i = 0; i < Math.min(productElements.length, 20); i++) {
                try {
                    const product = await this.extractAlibabaProduct(productElements[i], page);
                    if (product) {
                        products.push(product);
                        console.log(`✅ Extracted: ${product.title.substring(0, 50)}...`);
                    }
                } catch (error) {
                    console.error(`❌ Error extracting product ${i + 1}:`, error);
                }
            }
        } catch (error) {
            console.error('Error scraping Alibaba page:', error);
            // Take a screenshot for debugging
            try {
                await page.screenshot({ path: 'alibaba-error.png', fullPage: true });
            } catch (screenshotError) {
                console.error('Could not take error screenshot:', screenshotError);
            }
        } finally {
            await page.close();
        }

        return products;
    }

    private async scrapeAliExpressPage(url: string): Promise<ScrapedProduct[]> {
        const page = await this.browser.newPage();
        const products: ScrapedProduct[] = [];

        try {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            await page.setViewport({ width: 1920, height: 1080 });

            console.log(`🌐 Navigating to: ${url}`);
            await page.goto(url, { waitUntil: 'networkidle2', timeout: envConfig.scraping.timeoutMs });

            // Wait for products to load - try multiple selectors
            let productElements: any[] = [];
            try {
                // Wait for any of these selectors to appear
                await page.waitForSelector('.list-item, .product-item, [data-product-id], .J_MouserOverProduct', { timeout: 15000 });

                // Try different selectors for product containers
                productElements = await page.$$('.list-item, .product-item, [data-product-id], .J_MouserOverProduct');

                if (productElements.length === 0) {
                    // Fallback: look for any div that might contain product info
                    productElements = await page.$$('div[class*="product"], div[class*="item"]');
                }

                console.log(`🔍 Found ${productElements.length} potential product elements`);
            } catch (error) {
                console.log('⚠️ No product elements found with standard selectors, trying fallback...');
                // Take a screenshot for debugging
                await page.screenshot({ path: 'aliexpress-debug.png', fullPage: true });
            }

            for (let i = 0; i < Math.min(productElements.length, 20); i++) {
                try {
                    const product = await this.extractAliExpressProduct(productElements[i], page);
                    if (product) {
                        products.push(product);
                        console.log(`✅ Extracted: ${product.title.substring(0, 50)}...`);
                    }
                } catch (error) {
                    console.error(`❌ Error extracting product ${i + 1}:`, error);
                }
            }
        } catch (error) {
            console.error('Error scraping AliExpress page:', error);
            // Take a screenshot for debugging
            try {
                await page.screenshot({ path: 'aliexpress-error.png', fullPage: true });
            } catch (screenshotError) {
                console.error('Could not take error screenshot:', screenshotError);
            }
        } finally {
            await page.close();
        }

        return products;
    }

    private async extractAlibabaProduct(element: any, page: any): Promise<ScrapedProduct | null> {
        try {
            // Try multiple selectors for each field
            const externalId = await this.extractField(element, [
                '[data-product-id]',
                '[data-product-id]',
                '.product-id',
                'a[href*="product"]'
            ], 'getAttribute', 'data-product-id') || `ali_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const title = await this.extractField(element, [
                '.product-title',
                '.title',
                'h3',
                'h4',
                'a[title]',
                '[class*="title"]'
            ], 'textContent') || 'Unknown Product';

            const priceText = await this.extractField(element, [
                '.product-price',
                '.price',
                '[class*="price"]',
                'span[class*="price"]'
            ], 'textContent') || '$0.00';

            const imageUrl = await this.extractField(element, [
                'img',
                'img[src*="http"]',
                '[class*="image"] img'
            ], 'src') || 'https://via.placeholder.com/300x300?text=No+Image';

            const rating = await this.extractField(element, [
                '.product-rating',
                '.rating',
                '[class*="rating"]',
                'span[class*="star"]'
            ], 'textContent', null, (text: string) => {
                const ratingText = text?.trim();
                return ratingText ? parseFloat(ratingText.replace(/[^\d.]/g, '')) : undefined;
            });

            const reviewCount = await this.extractField(element, [
                '.product-reviews',
                '.reviews',
                '[class*="review"]',
                'span[class*="review"]'
            ], 'textContent', null, (text: string) => {
                const reviewText = text?.trim();
                return reviewText ? parseInt(reviewText.replace(/\D/g, '')) : 0;
            });

            if (!title || !priceText) return null;

            const price = this.extractPrice(priceText);
            const currency = this.extractCurrency(priceText);

            // Generate a unique external ID if none found
            const finalExternalId = externalId === `ali_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` ?
                `ali_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : externalId;

            return {
                externalId: finalExternalId,
                source: 'alibaba',
                title: title.trim(),
                price,
                currency,
                images: [imageUrl],
                tags: [],
                reviewCount: reviewCount || 0,
                soldCount: 0,
                minOrderQuantity: 1,
                rating,
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

    private async extractAliExpressProduct(element: any, page: any): Promise<ScrapedProduct | null> {
        try {
            // Try multiple selectors for each field
            const externalId = await this.extractField(element, [
                '[data-product-id]',
                '.product-id',
                'a[href*="product"]'
            ], 'getAttribute', 'data-product-id') || `ae_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const title = await this.extractField(element, [
                '.product-title',
                '.title',
                'h3',
                'h4',
                'a[title]',
                '[class*="title"]'
            ], 'textContent') || 'Unknown Product';

            const priceText = await this.extractField(element, [
                '.product-price',
                '.price',
                '[class*="price"]',
                'span[class*="price"]'
            ], 'textContent') || '$0.00';

            const imageUrl = await this.extractField(element, [
                'img',
                'img[src*="http"]',
                '[class*="image"] img'
            ], 'src') || 'https://via.placeholder.com/300x300?text=No+Image';

            const rating = await this.extractField(element, [
                '.product-rating',
                '.rating',
                '[class*="rating"]',
                'span[class*="star"]'
            ], 'textContent', null, (text: string) => {
                const ratingText = text?.trim();
                return ratingText ? parseFloat(ratingText.replace(/[^\d.]/g, '')) : undefined;
            });

            const reviewCount = await this.extractField(element, [
                '.product-reviews',
                '.reviews',
                '[class*="review"]',
                'span[class*="review"]'
            ], 'textContent', null, (text: string) => {
                const reviewText = text?.trim();
                return reviewText ? parseInt(reviewText.replace(/\D/g, '')) : 0;
            });

            if (!title || !priceText) return null;

            const price = this.extractPrice(priceText);
            const currency = this.extractCurrency(priceText);

            // Generate a unique external ID if none found
            const finalExternalId = externalId === `ae_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` ?
                `ae_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : externalId;

            return {
                externalId: finalExternalId,
                source: 'aliexpress',
                title: title.trim(),
                price,
                currency,
                images: [imageUrl],
                tags: [],
                reviewCount: reviewCount || 0,
                soldCount: 0,
                minOrderQuantity: 1,
                rating,
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

    private extractPrice(priceText: string): number {
        const priceMatch = priceText.match(/[\d,]+\.?\d*/);
        if (priceMatch) {
            return parseFloat(priceMatch[0].replace(/,/g, ''));
        }
        return 0;
    }

    private extractCurrency(priceText: string): string {
        if (priceText.includes('$')) return 'USD';
        if (priceText.includes('€')) return 'EUR';
        if (priceText.includes('£')) return 'GBP';
        if (priceText.includes('¥')) return 'CNY';
        return 'USD';
    }

    private async extractField(element: any, selectors: string[], method: string, attribute?: string, transform?: (value: any) => any): Promise<any> {
        for (const selector of selectors) {
            try {
                const found = await element.$(selector);
                if (found) {
                    let value;
                    if (method === 'getAttribute' && attribute) {
                        value = await found.evaluate((el: any) => el.getAttribute(attribute));
                    } else if (method === 'textContent') {
                        value = await found.evaluate((el: any) => el.textContent);
                    } else if (method === 'src') {
                        value = await found.evaluate((el: any) => el.src);
                    }

                    if (value && transform) {
                        return transform(value);
                    }
                    return value;
                }
            } catch (error) {
                // Continue to next selector
                continue;
            }
        }
        return null;
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default ScrapingService;