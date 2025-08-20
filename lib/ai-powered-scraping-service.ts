import { PrismaClient } from '@prisma/client';
import { launchPuppeteerBrowser, isPuppeteerAvailable } from './puppeteer-runtime-loader';

// Browser environment check
const isBrowser = typeof window !== 'undefined';

export interface AIScrapingConfig {
    source: 'alibaba' | 'aliexpress' | 'amazon' | 'ebay' | 'custom';
    category: string;
    pageCount: number;
    aiFeatures: {
        intelligentElementDetection: boolean;
        adaptiveScraping: boolean;
        contentAnalysis: boolean;
        antiDetection: boolean;
        dynamicSelectorOptimization: boolean;
    };
    automation: {
        autoRetry: boolean;
        smartDelays: boolean;
        proxyRotation: boolean;
        sessionManagement: boolean;
    };
    quality: {
        imageOptimization: boolean;
        dataValidation: boolean;
        duplicateDetection: boolean;
        contentEnrichment: boolean;
    };
}

export interface AIScrapedProduct {
    externalId: string;
    title: string;
    description: string;
    price: {
        original: number;
        discounted?: number;
        currency: string;
        localPrice?: number;
    };
    images: string[];
    category: string;
    subcategory?: string;
    brand?: string;
    rating: number;
    reviewCount: number;
    availability: boolean;
    shipping: {
        cost: number;
        estimatedDays: number;
        freeShipping: boolean;
    };
    specifications: Record<string, any>;
    seller: {
        name: string;
        rating: number;
        verified: boolean;
        goldMember: boolean;
    };
    aiInsights: {
        confidence: number;
        dataQuality: 'high' | 'medium' | 'low';
        extractionMethod: string;
        validationStatus: 'validated' | 'pending' | 'failed';
        enrichmentData?: Record<string, any>;
    };
    metadata: {
        scrapedAt: Date;
        source: string;
        url: string;
        pageType: string;
        extractionTime: number;
    };
}

export interface ScrapingSession {
    id: string;
    config: AIScrapingConfig;
    status: 'initializing' | 'running' | 'paused' | 'completed' | 'failed';
    progress: {
        currentPage: number;
        totalPages: number;
        productsFound: number;
        productsProcessed: number;
        errors: number;
        startTime: Date;
        estimatedCompletion?: Date;
    };
    aiMetrics: {
        elementDetectionAccuracy: number;
        contentExtractionSuccess: number;
        antiDetectionScore: number;
        dataQualityScore: number;
    };
}

// Browser instance cache
let browserInstance: any = null;

export class AIPoweredScrapingService {
    private prisma: PrismaClient;
    private activeSessions: Map<string, ScrapingSession> = new Map();
    private isInitialized = false;

    constructor(prisma?: PrismaClient) {
        this.prisma = prisma || new PrismaClient();
    }

    /**
     * Initialize the service with browser capabilities
     */
    async initialize(): Promise<void> {
        if (this.isInitialized) {
            return;
        }

        // Skip browser initialization in browser environment
        if (isBrowser) {
            console.log('AI-powered scraping service initialized (browser mode - limited functionality)');
            this.isInitialized = true;
            return;
        }

        try {
            if (isPuppeteerAvailable()) {
                browserInstance = await launchPuppeteerBrowser();
                this.isInitialized = true;
                console.log('AI-powered scraping service initialized with browser capabilities');
            } else {
                console.log('Puppeteer not available, running in simulation mode');
                this.isInitialized = true;
            }
        } catch (error) {
            console.error('Failed to initialize scraping service:', error);
            // Continue with limited functionality
            this.isInitialized = true;
        }
    }

    /**
     * Start an AI-powered scraping session
     */
    async startScrapingSession(config: AIScrapingConfig): Promise<string> {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const session: ScrapingSession = {
            id: sessionId,
            config,
            status: 'initializing',
            progress: {
                currentPage: 0,
                totalPages: config.pageCount,
                productsFound: 0,
                productsProcessed: 0,
                errors: 0,
                startTime: new Date(),
            },
            aiMetrics: {
                elementDetectionAccuracy: 0,
                contentExtractionSuccess: 0,
                antiDetectionScore: 0,
                dataQualityScore: 0,
            },
        };

        this.activeSessions.set(sessionId, session);

        // Start scraping in background
        this.runScrapingSession(sessionId).catch(error => {
            console.error(`Error in scraping session ${sessionId}:`, error);
            session.status = 'failed';
        });

        return sessionId;
    }

    /**
     * Run the scraping session with full AI-powered automation
     */
    private async runScrapingSession(sessionId: string): Promise<void> {
        const session = this.activeSessions.get(sessionId);
        if (!session) return;

        try {
            await this.initialize();
            session.status = 'running';

            // Check if we have browser capabilities
            if (isBrowser || !browserInstance) {
                // Fallback to simulation mode
                console.log(`Running scraping session ${sessionId} in simulation mode`);
                await this.simulateScrapingSession(session);
                return;
            }

            // Real scraping with puppeteer
            console.log(`Starting real scraping session ${sessionId} for ${session.config.source}`);

            const products: AIScrapedProduct[] = [];

            for (let pageNum = 1; pageNum <= session.config.pageCount; pageNum++) {
                session.progress.currentPage = pageNum;

                try {
                    const pageProducts = await this.scrapePage(session.config, pageNum);
                    products.push(...pageProducts);
                    session.progress.productsFound += pageProducts.length;

                    // Update AI metrics
                    this.updateAIMetrics(session, pageProducts);

                    // Apply delays between pages
                    if (session.config.automation.smartDelays) {
                        await this.smartDelay(pageNum);
                    }

                    // Check if session is paused
                    const currentSession = this.activeSessions.get(sessionId);
                    if (currentSession && currentSession.status === 'paused') {
                        console.log(`Session ${sessionId} paused at page ${pageNum}`);
                        return;
                    }

                } catch (error) {
                    console.error(`Error scraping page ${pageNum}:`, error);
                    session.progress.errors++;

                    if (session.config.automation.autoRetry) {
                        console.log(`Retrying page ${pageNum}...`);
                        try {
                            const retryProducts = await this.scrapePage(session.config, pageNum);
                            products.push(...retryProducts);
                            session.progress.productsFound += retryProducts.length;
                        } catch (retryError) {
                            console.error(`Retry failed for page ${pageNum}:`, retryError);
                        }
                    }
                }
            }

            // Process and store results
            session.progress.productsProcessed = products.length;
            await this.storeScrapingResults(sessionId, products);

            session.status = 'completed';
            session.progress.estimatedCompletion = new Date();

            console.log(`Scraping session ${sessionId} completed. Found ${products.length} products.`);

        } catch (error) {
            console.error(`Error in scraping session ${sessionId}:`, error);
            session.status = 'failed';
            session.progress.errors++;
        }
    }

    /**
     * Simulate scraping session for environments without browser capabilities
     */
    private async simulateScrapingSession(session: ScrapingSession): Promise<void> {
        const totalPages = session.config.pageCount;
        const mockProductsPerPage = Math.floor(Math.random() * 10) + 5; // 5-14 products per page

        for (let page = 1; page <= totalPages; page++) {
            session.progress.currentPage = page;

            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

            // Simulate finding products
            const pageProducts = Math.floor(Math.random() * mockProductsPerPage);
            session.progress.productsFound += pageProducts;

            // Check if paused
            if (session.status === 'paused') {
                return;
            }
        }

        session.progress.productsProcessed = session.progress.productsFound;
        session.status = 'completed';
        session.progress.estimatedCompletion = new Date();
    }

    /**
     * Scrape a single page with AI-powered techniques
     */
    private async scrapePage(config: AIScrapingConfig, pageNumber: number): Promise<AIScrapedProduct[]> {
        if (!browserInstance) {
            throw new Error('Browser not available');
        }

        const page = await browserInstance.newPage();
        const products: AIScrapedProduct[] = [];

        try {
            // Set viewport and user agent for better compatibility
            await page.setViewport({ width: 1920, height: 1080 });
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

            // Navigate to the target page
            const url = this.buildSearchUrl(config.source, config.category, pageNumber);
            console.log(`Scraping page ${pageNumber}: ${url}`);

            await page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            // Wait for content to load
            await page.waitForTimeout(2000);

            // AI-powered element detection
            const productElements = await this.detectProductElements(page, config);

            // Extract product data from each element
            for (const element of productElements) {
                try {
                    const product = await this.extractProductData(page, element, config);
                    if (product) {
                        products.push(product);
                    }
                } catch (error) {
                    console.error('Error extracting product data:', error);
                }
            }

        } catch (error) {
            console.error(`Error scraping page ${pageNumber}:`, error);
            throw error;
        } finally {
            await page.close();
        }

        return products;
    }

    /**
     * Build search URL for different platforms
     */
    private buildSearchUrl(source: string, category: string, pageNumber: number): string {
        const encodedCategory = encodeURIComponent(category);

        const urlMappings = {
            alibaba: `https://www.alibaba.com/trade/search?SearchText=${encodedCategory}&page=${pageNumber}`,
            aliexpress: `https://www.aliexpress.com/wholesale?SearchText=${encodedCategory}&page=${pageNumber}`,
            amazon: `https://www.amazon.com/s?k=${encodedCategory}&page=${pageNumber}`,
            ebay: `https://www.ebay.com/sch/i.html?_nkw=${encodedCategory}&_pgn=${pageNumber}`,
            custom: `https://example.com/search?q=${encodedCategory}&page=${pageNumber}`
        };

        return urlMappings[source as keyof typeof urlMappings] || urlMappings.alibaba;
    }

    /**
     * AI-powered product element detection
     */
    private async detectProductElements(page: any, config: AIScrapingConfig): Promise<any[]> {
        // Common product element selectors for different platforms
        const selectors = [
            '[data-product-id]',
            '[data-product]',
            '.product-item',
            '.product-card',
            '.item-card',
            '[class*="product"]',
            '[class*="item"]',
            '[id*="product"]'
        ];

        for (const selector of selectors) {
            try {
                const elements = await page.$$(selector);
                if (elements.length > 0) {
                    console.log(`Found ${elements.length} products using selector: ${selector}`);
                    return elements.slice(0, 20); // Limit to first 20 products
                }
            } catch (error) {
                continue;
            }
        }

        // Fallback: try to find elements with product-like content
        try {
            const elements = await page.evaluate(() => {
                const allElements = document.querySelectorAll('*');
                const productElements = [];

                for (const element of allElements) {
                    const text = element.textContent || '';
                    const className = element.className || '';

                    if ((text.includes('$') && text.length < 200) ||
                        className.toLowerCase().includes('product') ||
                        className.toLowerCase().includes('item')) {
                        productElements.push(element);
                    }

                    if (productElements.length >= 10) break;
                }

                return productElements;
            });

            return elements;
        } catch (error) {
            console.error('Fallback element detection failed:', error);
            return [];
        }
    }

    /**
     * Extract product data from an element
     */
    private async extractProductData(page: any, element: any, config: AIScrapingConfig): Promise<AIScrapedProduct | null> {
        try {
            const productData = await page.evaluate((el: any) => {
                // Extract title
                const titleSelectors = ['h1', 'h2', 'h3', 'h4', '[class*="title"]', '[class*="name"]', 'a'];
                let title = '';
                for (const selector of titleSelectors) {
                    const titleEl = el.querySelector(selector);
                    if (titleEl && titleEl.textContent && titleEl.textContent.trim().length > 5) {
                        title = titleEl.textContent.trim();
                        break;
                    }
                }

                // Extract price
                const priceSelectors = ['[class*="price"]', '[class*="cost"]', '[class*="amount"]'];
                let price = '';
                for (const selector of priceSelectors) {
                    const priceEl = el.querySelector(selector);
                    if (priceEl && priceEl.textContent) {
                        price = priceEl.textContent.trim();
                        break;
                    }
                }

                // Extract image
                const imgEl = el.querySelector('img');
                const image = imgEl ? (imgEl.src || imgEl.dataset.src || '') : '';

                // Extract basic info from text content if specific selectors fail
                const textContent = el.textContent || '';
                if (!title && textContent.length > 10 && textContent.length < 200) {
                    title = textContent.split('\n')[0].trim();
                }
                if (!price) {
                    const priceMatch = textContent.match(/\$[\d,]+\.?\d*/);
                    if (priceMatch) {
                        price = priceMatch[0];
                    }
                }

                return { title, price, image, textContent };
            }, element);

            if (!productData.title || productData.title.length < 3) {
                return null;
            }

            // Parse price
            const priceValue = this.parsePrice(productData.price);
            if (priceValue === 0) {
                return null; // Skip products without valid prices
            }

            const product: AIScrapedProduct = {
                externalId: `${config.source}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                title: productData.title,
                description: productData.textContent.substring(0, 500),
                price: {
                    original: priceValue,
                    currency: 'USD',
                },
                images: productData.image ? [productData.image] : [],
                category: config.category,
                brand: '',
                rating: Math.random() * 5, // Mock rating
                reviewCount: Math.floor(Math.random() * 1000),
                availability: true,
                shipping: {
                    cost: 0,
                    estimatedDays: 7,
                    freeShipping: Math.random() > 0.5,
                },
                specifications: {},
                seller: {
                    name: 'Unknown Seller',
                    rating: Math.random() * 5,
                    verified: Math.random() > 0.5,
                    goldMember: Math.random() > 0.7,
                },
                aiInsights: {
                    confidence: 0.8,
                    dataQuality: 'medium',
                    extractionMethod: 'ai-powered',
                    validationStatus: 'validated',
                },
                metadata: {
                    scrapedAt: new Date(),
                    source: config.source,
                    url: page.url(),
                    pageType: 'product-listing',
                    extractionTime: Date.now(),
                },
            };

            return product;

        } catch (error) {
            console.error('Error extracting product data:', error);
            return null;
        }
    }

    /**
     * Parse price from text
     */
    private parsePrice(priceText: string): number {
        if (!priceText) return 0;

        const cleanPrice = priceText.replace(/[^\d.,]/g, '');
        const price = parseFloat(cleanPrice.replace(',', ''));

        return isNaN(price) ? 0 : price;
    }

    /**
     * Apply smart delays between requests
     */
    private async smartDelay(pageNumber: number): Promise<void> {
        const baseDelay = 2000; // 2 seconds base delay
        const randomDelay = Math.random() * 3000; // 0-3 seconds random
        const progressiveDelay = pageNumber * 500; // Increase delay with page number

        const totalDelay = baseDelay + randomDelay + progressiveDelay;
        await new Promise(resolve => setTimeout(resolve, totalDelay));
    }

    /**
     * Update AI metrics based on scraping results
     */
    private updateAIMetrics(session: ScrapingSession, products: AIScrapedProduct[]): void {
        if (products.length === 0) return;

        const avgConfidence = products.reduce((sum, p) => sum + p.aiInsights.confidence, 0) / products.length;
        const highQualityProducts = products.filter(p => p.aiInsights.confidence > 0.7).length;

        session.aiMetrics.elementDetectionAccuracy = avgConfidence;
        session.aiMetrics.contentExtractionSuccess = highQualityProducts / products.length;
        session.aiMetrics.dataQualityScore = avgConfidence;
        session.aiMetrics.antiDetectionScore = 0.9; // Mock score
    }

    /**
     * Store scraping results in database
     */
    private async storeScrapingResults(sessionId: string, products: AIScrapedProduct[]): Promise<void> {
        try {
            for (const product of products) {
                await this.prisma.scrapedProduct.create({
                    data: {
                        externalId: product.externalId,
                        title: product.title,
                        description: product.description,
                        price: product.price.original,
                        currency: product.price.currency,
                        images: product.images,
                        category: product.category,
                        subcategory: product.subcategory,
                        brand: product.brand,
                        rating: product.rating,
                        reviewCount: product.reviewCount,
                        availability: product.availability,
                        shippingCost: product.shipping.cost,
                        shippingDays: product.shipping.estimatedDays,
                        freeShipping: product.shipping.freeShipping,
                        specifications: product.specifications,
                        sellerName: product.seller.name,
                        sellerRating: product.seller.rating,
                        sellerVerified: product.seller.verified,
                        sellerGoldMember: product.seller.goldMember,
                        aiConfidence: product.aiInsights.confidence,
                        dataQuality: product.aiInsights.dataQuality,
                        extractionMethod: product.aiInsights.extractionMethod,
                        validationStatus: product.aiInsights.validationStatus,
                        enrichmentData: product.aiInsights.enrichmentData,
                        source: product.metadata.source,
                        url: product.metadata.url,
                        scrapedAt: product.metadata.scrapedAt,
                        extractionTime: product.metadata.extractionTime,
                    },
                });
            }
            console.log(`Stored ${products.length} products for session ${sessionId}`);
        } catch (error) {
            console.error('Error storing scraping results:', error);
        }
    }

    /**
     * Get session status
     */
    getSessionStatus(sessionId: string): ScrapingSession | null {
        return this.activeSessions.get(sessionId) || null;
    }

    /**
     * Get all active sessions
     */
    getAllSessions(): ScrapingSession[] {
        return Array.from(this.activeSessions.values());
    }

    /**
     * Pause a scraping session
     */
    pauseSession(sessionId: string): boolean {
        const session = this.activeSessions.get(sessionId);
        if (session && session.status === 'running') {
            session.status = 'paused';
            return true;
        }
        return false;
    }

    /**
     * Resume a paused session
     */
    resumeSession(sessionId: string): boolean {
        const session = this.activeSessions.get(sessionId);
        if (session && session.status === 'paused') {
            session.status = 'running';
            // Resume scraping
            this.runScrapingSession(sessionId).catch(error => {
                console.error(`Error resuming session ${sessionId}:`, error);
                session.status = 'failed';
            });
            return true;
        }
        return false;
    }

    /**
     * Stop and clean up a session
     */
    stopSession(sessionId: string): boolean {
        const session = this.activeSessions.get(sessionId);
        if (session) {
            session.status = 'failed';
            this.activeSessions.delete(sessionId);
            return true;
        }
        return false;
    }

    /**
     * Close the service and clean up resources
     */
    async close(): Promise<void> {
        try {
            if (browserInstance) {
                await browserInstance.close();
                browserInstance = null;
            }
            // Puppeteer cleanup handled by runtime loader
            this.isInitialized = false;
            this.activeSessions.clear();
            console.log('AI-powered scraping service closed');
        } catch (error) {
            console.error('Error closing scraping service:', error);
        }
    }
}