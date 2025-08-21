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
            ],
        });

        this.isInitialized = true;
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
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            await page.setViewport({ width: 1920, height: 1080 });

            await page.goto(url, { waitUntil: 'networkidle2', timeout: envConfig.scraping.timeoutMs });

            // Wait for products to load
            await page.waitForSelector('[data-product-id]', { timeout: 10000 });

            const productElements = await page.$$('[data-product-id]');

            for (const element of productElements) {
                try {
                    const product = await this.extractAlibabaProduct(element);
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

    private async scrapeAliExpressPage(url: string): Promise<ScrapedProduct[]> {
        const page = await this.browser.newPage();
        const products: ScrapedProduct[] = [];

        try {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            await page.setViewport({ width: 1920, height: 1080 });

            await page.goto(url, { waitUntil: 'networkidle2', timeout: envConfig.scraping.timeoutMs });

            // Wait for products to load
            await page.waitForSelector('[data-product-id]', { timeout: 10000 });

            const productElements = await page.$$('[data-product-id]');

            for (const element of productElements) {
                try {
                    const product = await this.extractAliExpressProduct(element);
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

    private async extractAlibabaProduct(element: any): Promise<ScrapedProduct | null> {
        try {
            const externalId = await element.$eval('[data-product-id]', (el: any) => el.getAttribute('data-product-id'));
            const title = await element.$eval('.product-title', (el: any) => el.textContent?.trim());
            const priceText = await element.$eval('.product-price', (el: any) => el.textContent?.trim());
            const imageUrl = await element.$eval('img', (el: any) => el.src);
            const rating = await element.$eval('.product-rating', (el: any) => {
                const ratingText = el.textContent?.trim();
                return ratingText ? parseFloat(ratingText) : undefined;
            });
            const reviewCount = await element.$eval('.product-reviews', (el: any) => {
                const reviewText = el.textContent?.trim();
                return reviewText ? parseInt(reviewText.replace(/\D/g, '')) : 0;
            });

            if (!externalId || !title || !priceText) return null;

            const price = this.extractPrice(priceText);
            const currency = this.extractCurrency(priceText);

            return {
                externalId,
                source: 'alibaba',
                title,
                price,
                currency,
                images: [imageUrl],
                tags: [],
                reviewCount,
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

    private async extractAliExpressProduct(element: any): Promise<ScrapedProduct | null> {
        try {
            const externalId = await element.$eval('[data-product-id]', (el: any) => el.getAttribute('data-product-id'));
            const title = await element.$eval('.product-title', (el: any) => el.textContent?.trim());
            const priceText = await element.$eval('.product-price', (el: any) => el.textContent?.trim());
            const imageUrl = await element.$eval('img', (el: any) => el.src);
            const rating = await element.$eval('.product-rating', (el: any) => {
                const ratingText = el.textContent?.trim();
                return ratingText ? parseFloat(ratingText) : undefined;
            });
            const reviewCount = await element.$eval('.product-reviews', (el: any) => {
                const reviewText = el.textContent?.trim();
                return reviewText ? parseInt(reviewText.replace(/\D/g, '')) : 0;
            });

            if (!externalId || !title || !priceText) return null;

            const price = this.extractPrice(priceText);
            const currency = this.extractCurrency(priceText);

            return {
                externalId,
                source: 'aliexpress',
                title,
                price,
                currency,
                images: [imageUrl],
                tags: [],
                reviewCount,
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

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default ScrapingService;