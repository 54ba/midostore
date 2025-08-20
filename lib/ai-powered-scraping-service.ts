import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import { PrismaClient } from '@prisma/client';
import { config } from '../env.config';
import { format } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

// Add plugins to puppeteer
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin());

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

export class AIPoweredScrapingService {
    private browser: any;
    private isInitialized = false;
    private prisma: PrismaClient;
    private activeSessions: Map<string, ScrapingSession> = new Map();
    private aiModels: Map<string, any> = new Map();

    constructor(prisma?: PrismaClient) {
        this.prisma = prisma || new PrismaClient();
        this.initializeAIModels();
    }

    /**
     * Initialize AI models for intelligent scraping
     */
    private async initializeAIModels() {
        // Initialize different AI models for various tasks
        this.aiModels.set('elementDetection', this.createElementDetectionModel());
        this.aiModels.set('contentAnalysis', this.createContentAnalysisModel());
        this.aiModels.set('antiDetection', this.createAntiDetectionModel());
        this.aiModels.set('dataValidation', this.createDataValidationModel());
    }

    /**
     * Create AI model for intelligent element detection
     */
    private createElementDetectionModel() {
        return {
            // Heuristic-based element detection
            detectProductElements: async (page: any) => {
                const selectors = [
                    // Common product selectors
                    '[data-product-id]',
                    '[data-product]',
                    '.product-item',
                    '.product-card',
                    '.item',
                    '[class*="product"]',
                    '[class*="item"]',
                    '[class*="card"]',
                ];

                // Try each selector with intelligent fallback
                for (const selector of selectors) {
                    try {
                        const elements = await page.$$(selector);
                        if (elements.length > 0) {
                            return { selector, elements, confidence: 0.9 };
                        }
                    } catch (error) {
                        continue;
                    }
                }

                // Fallback to AI-powered element detection
                return await this.aiPoweredElementDetection(page);
            },

            // AI-powered element detection using page analysis
            aiPoweredElementDetection: async (page: any) => {
                const pageContent = await page.content();
                const productPatterns = [
                    /class="[^"]*product[^"]*"/gi,
                    /class="[^"]*item[^"]*"/gi,
                    /class="[^"]*card[^"]*"/gi,
                    /data-[^=]*="[^"]*product[^"]*"/gi,
                ];

                let bestSelector = '';
                let maxConfidence = 0;

                for (const pattern of productPatterns) {
                    const matches = pageContent.match(pattern);
                    if (matches && matches.length > 0) {
                        const confidence = Math.min(matches.length / 10, 0.8);
                        if (confidence > maxConfidence) {
                            maxConfidence = confidence;
                            bestSelector = this.extractSelectorFromPattern(matches[0]);
                        }
                    }
                }

                if (bestSelector) {
                    try {
                        const elements = await page.$$(bestSelector);
                        return { selector: bestSelector, elements, confidence: maxConfidence };
                    } catch (error) {
                        return { selector: '', elements: [], confidence: 0 };
                    }
                }

                return { selector: '', elements: [], confidence: 0 };
            },

            extractSelectorFromPattern: (pattern: string) => {
                // Extract CSS selector from class pattern
                const classMatch = pattern.match(/class="([^"]*)"/);
                if (classMatch) {
                    const classes = classMatch[1].split(' ').filter(c => c.includes('product') || c.includes('item') || c.includes('card'));
                    if (classes.length > 0) {
                        return `.${classes[0]}`;
                    }
                }
                return '';
            }
        };
    }

    /**
     * Create AI model for content analysis
     */
    private createContentAnalysisModel() {
        return {
            analyzeProductContent: async (element: any, page: any) => {
                const analysis = {
                    title: { value: '', confidence: 0, method: '' },
                    price: { value: 0, confidence: 0, method: '' },
                    image: { value: '', confidence: 0, method: '' },
                    rating: { value: 0, confidence: 0, method: '' },
                };

                // Analyze title with multiple strategies
                analysis.title = await this.extractTitleWithAI(element, page);

                // Analyze price with intelligent parsing
                analysis.price = await this.extractPriceWithAI(element, page);

                // Analyze images with quality assessment
                analysis.image = await this.extractImageWithAI(element, page);

                // Analyze rating with validation
                analysis.rating = await this.extractRatingWithAI(element, page);

                return analysis;
            },

            extractTitleWithAI: async (element: any, page: any) => {
                const titleSelectors = [
                    'h1', 'h2', 'h3', 'h4',
                    '[class*="title"]',
                    '[class*="name"]',
                    '[class*="product-title"]',
                    '[class*="product-name"]',
                    'a[title]',
                    'img[alt]'
                ];

                for (const selector of titleSelectors) {
                    try {
                        const titleElement = await element.$(selector);
                        if (titleElement) {
                            const text = await page.evaluate(el => el.textContent?.trim() || el.title || el.alt || '', titleElement);
                            if (text && text.length > 5 && text.length < 200) {
                                return { value: text, confidence: 0.9, method: selector };
                            }
                        }
                    } catch (error) {
                        continue;
                    }
                }

                // Fallback to text content analysis
                try {
                    const textContent = await page.evaluate(el => el.textContent?.trim() || '', element);
                    const lines = textContent.split('\n').filter(line => line.trim().length > 5);
                    const title = lines.find(line =>
                        line.length > 10 &&
                        line.length < 100 &&
                        !line.match(/^\d+$/) &&
                        !line.match(/^\$[\d,]+$/)
                    );

                    if (title) {
                        return { value: title.trim(), confidence: 0.6, method: 'text-analysis' };
                    }
                } catch (error) {
                    // Continue to next method
                }

                return { value: '', confidence: 0, method: 'failed' };
            },

            extractPriceWithAI: async (element: any, page: any) => {
                const priceSelectors = [
                    '[class*="price"]',
                    '[class*="cost"]',
                    '[class*="amount"]',
                    '.price',
                    '.cost',
                    '.amount',
                    'span[class*="price"]',
                    'div[class*="price"]'
                ];

                for (const selector of priceSelectors) {
                    try {
                        const priceElement = await element.$(selector);
                        if (priceElement) {
                            const priceText = await page.evaluate(el => el.textContent?.trim() || '', priceElement);
                            const price = this.parsePriceWithAI(priceText);
                            if (price > 0) {
                                return { value: price, confidence: 0.9, method: selector };
                            }
                        }
                    } catch (error) {
                        continue;
                    }
                }

                // Fallback to regex-based price extraction
                try {
                    const textContent = await page.evaluate(el => el.textContent?.trim() || '', element);
                    const price = this.parsePriceWithAI(textContent);
                    if (price > 0) {
                        return { value: price, confidence: 0.7, method: 'regex-extraction' };
                    }
                } catch (error) {
                    // Continue to next method
                }

                return { value: 0, confidence: 0, method: 'failed' };
            },

            parsePriceWithAI: (text: string): number => {
                // Advanced price parsing with AI-like pattern recognition
                const pricePatterns = [
                    /\$[\d,]+\.?\d*/g,           // $123.45 or $1,234
                    /[\d,]+\.?\d*\s*USD/g,       // 123.45 USD
                    /[\d,]+\.?\d*\s*SAR/g,       // 123.45 SAR
                    /[\d,]+\.?\d*\s*AED/g,       // 123.45 AED
                    /[\d,]+\.?\d*\s*KWD/g,       // 123.45 KWD
                    /[\d,]+\.?\d*\s*QAR/g,       // 123.45 QAR
                    /[\d,]+\.?\d*\s*BHD/g,       // 123.45 BHD
                    /[\d,]+\.?\d*\s*OMR/g,       // 123.45 OMR
                    /[\d,]+\.?\d*\s*د\.ك/g,      // Kuwaiti Dinar in Arabic
                    /[\d,]+\.?\d*\s*ر\.س/g,      // Saudi Riyal in Arabic
                    /[\d,]+\.?\d*\s*د\.إ/g,      // UAE Dirham in Arabic
                ];

                for (const pattern of pricePatterns) {
                    const matches = text.match(pattern);
                    if (matches && matches.length > 0) {
                        const priceText = matches[0].replace(/[^\d.,]/g, '');
                        const price = parseFloat(priceText.replace(',', ''));
                        if (!isNaN(price) && price > 0) {
                            return price;
                        }
                    }
                }

                return 0;
            },

            extractImageWithAI: async (element: any, page: any) => {
                const imageSelectors = [
                    'img[src]',
                    '[class*="image"] img',
                    '[class*="photo"] img',
                    '[class*="picture"] img',
                    'a[href*=".jpg"] img',
                    'a[href*=".png"] img',
                    'a[href*=".webp"] img'
                ];

                for (const selector of imageSelectors) {
                    try {
                        const imgElement = await element.$(selector);
                        if (imgElement) {
                            const src = await page.evaluate(el => el.src || el.dataset.src || '', imgElement);
                            if (src && this.isValidImageUrl(src)) {
                                return { value: src, confidence: 0.9, method: selector };
                            }
                        }
                    } catch (error) {
                        continue;
                    }
                }

                return { value: '', confidence: 0, method: 'failed' };
            },

            isValidImageUrl: (url: string): boolean => {
                const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
                const validDomains = ['alibaba.com', 'aliexpress.com', 'amazon.com', 'ebay.com'];

                return imageExtensions.some(ext => url.toLowerCase().includes(ext)) &&
                       validDomains.some(domain => url.toLowerCase().includes(domain));
            },

            extractRatingWithAI: async (element: any, page: any) => {
                const ratingSelectors = [
                    '[class*="rating"]',
                    '[class*="star"]',
                    '[class*="score"]',
                    '.rating',
                    '.stars',
                    '.score',
                    '[data-rating]',
                    '[data-score]'
                ];

                for (const selector of ratingSelectors) {
                    try {
                        const ratingElement = await element.$(selector);
                        if (ratingElement) {
                            const ratingText = await page.evaluate(el => {
                                const text = el.textContent?.trim() || '';
                                const dataRating = el.getAttribute('data-rating') || el.getAttribute('data-score') || '';
                                return text || dataRating;
                            }, ratingElement);

                            const rating = this.parseRatingWithAI(ratingText);
                            if (rating > 0) {
                                return { value: rating, confidence: 0.9, method: selector };
                            }
                        }
                    } catch (error) {
                        continue;
                    }
                }

                return { value: 0, confidence: 0, method: 'failed' };
            },

            parseRatingWithAI: (text: string): number => {
                // Parse various rating formats
                const ratingPatterns = [
                    /(\d+\.?\d*)\s*\/\s*5/,     // 4.5 / 5
                    /(\d+\.?\d*)\s*out\s*of\s*5/, // 4.5 out of 5
                    /(\d+\.?\d*)\s*stars?/,      // 4.5 stars
                    /(\d+\.?\d*)/,               // 4.5
                    /★\s*(\d+\.?\d*)/,          // ★ 4.5
                ];

                for (const pattern of ratingPatterns) {
                    const match = text.match(pattern);
                    if (match && match[1]) {
                        const rating = parseFloat(match[1]);
                        if (!isNaN(rating) && rating >= 0 && rating <= 5) {
                            return rating;
                        }
                    }
                }

                return 0;
            }
        };
    }

    /**
     * Create AI model for anti-detection
     */
    private createAntiDetectionModel() {
        return {
            generateHumanLikeBehavior: async (page: any) => {
                // Random mouse movements
                await this.simulateHumanMouseMovement(page);

                // Random scrolling
                await this.simulateHumanScrolling(page);

                // Random delays
                await this.simulateHumanDelays();

                // Random viewport changes
                await this.simulateHumanViewportChanges(page);
            },

            simulateHumanMouseMovement: async (page: any) => {
                const viewport = await page.viewport();
                const x = Math.random() * viewport.width;
                const y = Math.random() * viewport.height;

                await page.mouse.move(x, y, { steps: Math.floor(Math.random() * 10) + 5 });
            },

            simulateHumanScrolling: async (page: any) => {
                const scrollAmount = Math.floor(Math.random() * 500) + 100;
                const scrollDirection = Math.random() > 0.5 ? 1 : -1;

                await page.evaluate((amount, direction) => {
                    window.scrollBy(0, amount * direction);
                }, scrollAmount, scrollDirection);
            },

            simulateHumanDelays: async () => {
                const delay = Math.random() * 2000 + 500; // 500ms to 2.5s
                await new Promise(resolve => setTimeout(resolve, delay));
            },

            simulateHumanViewportChanges: async (page: any) => {
                const viewports = [
                    { width: 1920, height: 1080 },
                    { width: 1366, height: 768 },
                    { width: 1440, height: 900 },
                    { width: 1536, height: 864 },
                    { width: 1280, height: 720 }
                ];

                const randomViewport = viewports[Math.floor(Math.random() * viewports.length)];
                await page.setViewport(randomViewport);
            },

            rotateUserAgents: async (page: any) => {
                const userAgents = [
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0'
                ];

                const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
                await page.setUserAgent(randomUserAgent);
            }
        };
    }

    /**
     * Create AI model for data validation
     */
    private createDataValidationModel() {
        return {
            validateProductData: (product: Partial<AIScrapedProduct>): { isValid: boolean; issues: string[] } => {
                const issues: string[] = [];

                // Validate required fields
                if (!product.title || product.title.length < 3) {
                    issues.push('Title is too short or missing');
                }

                if (!product.price || product.price.original <= 0) {
                    issues.push('Invalid or missing price');
                }

                if (!product.images || product.images.length === 0) {
                    issues.push('No images found');
                }

                // Validate data quality
                if (product.title && product.title.length > 200) {
                    issues.push('Title is too long');
                }

                if (product.description && product.description.length > 2000) {
                    issues.push('Description is too long');
                }

                // Validate price ranges
                if (product.price && product.price.original > 100000) {
                    issues.push('Price seems unrealistic');
                }

                return {
                    isValid: issues.length === 0,
                    issues
                };
            },

            enrichProductData: async (product: Partial<AIScrapedProduct>): Promise<Partial<AIScrapedProduct>> => {
                const enriched = { ...product };

                // Enrich category information
                if (enriched.title) {
                    enriched.category = enriched.category || this.inferCategoryFromTitle(enriched.title);
                    enriched.subcategory = enriched.subcategory || this.inferSubcategoryFromTitle(enriched.title);
                }

                // Enrich brand information
                if (enriched.title && !enriched.brand) {
                    enriched.brand = this.extractBrandFromTitle(enriched.title);
                }

                // Enrich specifications
                if (enriched.description && !enriched.specifications) {
                    enriched.specifications = this.extractSpecificationsFromDescription(enriched.description);
                }

                return enriched;
            },

            inferCategoryFromTitle: (title: string): string => {
                const titleLower = title.toLowerCase();

                const categoryKeywords = {
                    'electronics': ['phone', 'laptop', 'computer', 'tablet', 'smartphone', 'headphone', 'earbud', 'camera'],
                    'clothing': ['shirt', 'dress', 'pants', 'jeans', 'jacket', 'coat', 'shoes', 'boots'],
                    'home': ['furniture', 'chair', 'table', 'bed', 'sofa', 'lamp', 'decor', 'kitchen'],
                    'beauty': ['makeup', 'cosmetic', 'skincare', 'perfume', 'lotion', 'cream'],
                    'sports': ['fitness', 'gym', 'exercise', 'sport', 'athletic', 'training']
                };

                for (const [category, keywords] of Object.entries(categoryKeywords)) {
                    if (keywords.some(keyword => titleLower.includes(keyword))) {
                        return category;
                    }
                }

                return 'general';
            },

            inferSubcategoryFromTitle: (title: string): string => {
                const titleLower = title.toLowerCase();

                if (titleLower.includes('phone') || titleLower.includes('smartphone')) return 'mobile-phones';
                if (titleLower.includes('laptop') || titleLower.includes('notebook')) return 'laptops';
                if (titleLower.includes('headphone') || titleLower.includes('earbud')) return 'audio';
                if (titleLower.includes('shirt') || titleLower.includes('t-shirt')) return 'tops';
                if (titleLower.includes('dress')) return 'dresses';
                if (titleLower.includes('jeans') || titleLower.includes('pants')) return 'bottoms';

                return 'general';
            },

            extractBrandFromTitle: (title: string): string => {
                const titleLower = title.toLowerCase();

                const commonBrands = [
                    'apple', 'samsung', 'sony', 'lg', 'nike', 'adidas', 'puma', 'reebok',
                    'gucci', 'prada', 'louis vuitton', 'chanel', 'hermes', 'rolex', 'omega'
                ];

                for (const brand of commonBrands) {
                    if (titleLower.includes(brand)) {
                        return brand.charAt(0).toUpperCase() + brand.slice(1);
                    }
                }

                return '';
            },

            extractSpecificationsFromDescription: (description: string): Record<string, any> => {
                const specs: Record<string, any> = {};
                const descLower = description.toLowerCase();

                // Extract common specifications
                const specPatterns = [
                    { key: 'color', pattern: /(?:color|colour):\s*([^,\n]+)/i },
                    { key: 'size', pattern: /(?:size|dimension):\s*([^,\n]+)/i },
                    { key: 'weight', pattern: /(?:weight):\s*([^,\n]+)/i },
                    { key: 'material', pattern: /(?:material|fabric):\s*([^,\n]+)/i },
                    { key: 'brand', pattern: /(?:brand):\s*([^,\n]+)/i }
                ];

                for (const spec of specPatterns) {
                    const match = description.match(spec.pattern);
                    if (match && match[1]) {
                        specs[spec.key] = match[1].trim();
                    }
                }

                return specs;
            }
        };
    }

    /**
     * Initialize the browser with AI-powered configuration
     */
    async initialize() {
        if (this.isInitialized) return;

        this.browser = await puppeteer.launch({
            headless: 'new',
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
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--disable-extensions',
                '--disable-plugins',
                '--disable-images', // Disable images for faster scraping
                '--disable-javascript', // Disable JS for faster scraping
            ],
        });

        this.isInitialized = true;
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
        this.runScrapingSession(sessionId);

        return sessionId;
    }

    /**
     * Run the scraping session with AI-powered automation
     */
    private async runScrapingSession(sessionId: string) {
        const session = this.activeSessions.get(sessionId);
        if (!session) return;

        try {
            await this.initialize();
            session.status = 'running';

            const products: AIScrapedProduct[] = [];

            for (let page = 1; page <= session.config.pageCount; page++) {
                session.progress.currentPage = page;

                try {
                    const pageProducts = await this.scrapePageWithAI(session.config, page);
                    products.push(...pageProducts);
                    session.progress.productsFound += pageProducts.length;

                    // Update AI metrics
                    this.updateAIMetrics(session, pageProducts);

                    // Apply anti-detection measures
                    if (session.config.aiFeatures.antiDetection) {
                        await this.aiModels.get('antiDetection')?.generateHumanLikeBehavior(this.browser);
                    }

                    // Smart delays between pages
                    if (session.config.automation.smartDelays) {
                        await this.applySmartDelays(page, session.config);
                    }

                } catch (error) {
                    console.error(`Error scraping page ${page}:`, error);
                    session.progress.errors++;

                    // Auto-retry logic
                    if (session.config.automation.autoRetry) {
                        const retryProducts = await this.retryPageScraping(session.config, page);
                        if (retryProducts.length > 0) {
                            products.push(...retryProducts);
                            session.progress.productsFound += retryProducts.length;
                        }
                    }
                }
            }

            // Process and validate products
            const processedProducts = await this.processProductsWithAI(products, session.config);
            session.progress.productsProcessed = processedProducts.length;

            session.status = 'completed';
            session.progress.estimatedCompletion = new Date();

            // Store results
            await this.storeScrapingResults(sessionId, processedProducts);

        } catch (error) {
            console.error(`Error in scraping session ${sessionId}:`, error);
            session.status = 'failed';
            session.progress.errors++;
        }
    }

    /**
     * Scrape a single page using AI-powered techniques
     */
    private async scrapePageWithAI(config: AIScrapingConfig, pageNumber: number): Promise<AIScrapedProduct[]> {
        const page = await this.browser.newPage();
        const products: AIScrapedProduct[] = [];

        try {
            // Apply anti-detection measures
            if (config.aiFeatures.antiDetection) {
                await this.aiModels.get('antiDetection')?.rotateUserAgents(page);
                await this.aiModels.get('antiDetection')?.simulateHumanViewportChanges(page);
            }

            // Navigate to page
            const url = this.buildPageUrl(config.source, config.category, pageNumber);
            await page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            // Wait for content to load
            await page.waitForTimeout(2000);

            // Use AI-powered element detection
            const elementDetection = this.aiModels.get('elementDetection');
            const { selector, elements, confidence } = await elementDetection.detectProductElements(page);

            if (elements.length === 0) {
                throw new Error('No product elements detected');
            }

            // Extract products using AI-powered content analysis
            const contentAnalysis = this.aiModels.get('contentAnalysis');

            for (const element of elements) {
                try {
                    const contentAnalysis = await contentAnalysis.analyzeProductContent(element, page);

                    if (contentAnalysis.title.confidence > 0.5) {
                        const product: Partial<AIScrapedProduct> = {
                            title: contentAnalysis.title.value,
                            price: {
                                original: contentAnalysis.price.value,
                                currency: 'USD', // Default, can be enhanced
                            },
                            images: contentAnalysis.image.value ? [contentAnalysis.image.value] : [],
                            rating: contentAnalysis.rating.value,
                            availability: true,
                            shipping: {
                                cost: 0,
                                estimatedDays: 7,
                                freeShipping: false,
                            },
                            specifications: {},
                            seller: {
                                name: '',
                                rating: 0,
                                verified: false,
                                goldMember: false,
                            },
                            aiInsights: {
                                confidence: Math.min(
                                    contentAnalysis.title.confidence,
                                    contentAnalysis.price.confidence,
                                    contentAnalysis.image.confidence,
                                    contentAnalysis.rating.confidence
                                ),
                                dataQuality: this.assessDataQuality(contentAnalysis),
                                extractionMethod: 'ai-powered',
                                validationStatus: 'pending',
                            },
                            metadata: {
                                scrapedAt: new Date(),
                                source: config.source,
                                url: page.url(),
                                pageType: 'product-listing',
                                extractionTime: Date.now(),
                            },
                        };

                        // Validate and enrich product data
                        const validation = this.aiModels.get('dataValidation').validateProductData(product);
                        if (validation.isValid) {
                            const enrichedProduct = await this.aiModels.get('dataValidation').enrichProductData(product);
                            products.push(enrichedProduct as AIScrapedProduct);
                        }
                    }
                } catch (error) {
                    console.error('Error extracting product:', error);
                    continue;
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
     * Build page URL based on source and category
     */
    private buildPageUrl(source: string, category: string, pageNumber: number): string {
        const baseUrls = {
            alibaba: `https://www.alibaba.com/trade/search?SearchText=${category}&page=${pageNumber}`,
            aliexpress: `https://www.aliexpress.com/wholesale?SearchText=${category}&page=${pageNumber}`,
            amazon: `https://www.amazon.com/s?k=${category}&page=${pageNumber}`,
            ebay: `https://www.ebay.com/sch/i.html?_nkw=${category}&_pgn=${pageNumber}`,
        };

        return baseUrls[source] || baseUrls.alibaba;
    }

    /**
     * Update AI metrics based on scraping results
     */
    private updateAIMetrics(session: ScrapingSession, products: AIScrapedProduct[]) {
        if (products.length === 0) return;

        const totalConfidence = products.reduce((sum, p) => sum + p.aiInsights.confidence, 0);
        const avgConfidence = totalConfidence / products.length;

        session.aiMetrics.elementDetectionAccuracy = avgConfidence;
        session.aiMetrics.contentExtractionSuccess = products.filter(p => p.aiInsights.confidence > 0.7).length / products.length;
        session.aiMetrics.dataQualityScore = avgConfidence;
    }

    /**
     * Assess data quality based on content analysis
     */
    private assessDataQuality(contentAnalysis: any): 'high' | 'medium' | 'low' {
        const scores = [
            contentAnalysis.title.confidence,
            contentAnalysis.price.confidence,
            contentAnalysis.image.confidence,
            contentAnalysis.rating.confidence,
        ];

        const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

        if (avgScore >= 0.8) return 'high';
        if (avgScore >= 0.6) return 'medium';
        return 'low';
    }

    /**
     * Apply smart delays between pages
     */
    private async applySmartDelays(currentPage: number, config: AIScrapingConfig) {
        // Progressive delays: longer delays for later pages
        const baseDelay = 2000; // 2 seconds
        const progressiveDelay = currentPage * 1000; // 1 second per page
        const randomDelay = Math.random() * 3000; // 0-3 seconds random

        const totalDelay = baseDelay + progressiveDelay + randomDelay;
        await new Promise(resolve => setTimeout(resolve, totalDelay));
    }

    /**
     * Retry page scraping with different strategies
     */
    private async retryPageScraping(config: AIScrapingConfig, pageNumber: number): Promise<AIScrapedProduct[]> {
        console.log(`Retrying page ${pageNumber} with alternative strategy...`);

        // Try with different viewport
        const page = await this.browser.newPage();
        try {
            await page.setViewport({ width: 1366, height: 768 });
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

            const url = this.buildPageUrl(config.source, config.category, pageNumber);
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });

            await page.waitForTimeout(5000);

            // Try alternative element detection
            const elements = await page.$$('*');
            const products: AIScrapedProduct[] = [];

            // Simple fallback extraction
            for (let i = 0; i < Math.min(elements.length, 20); i++) {
                try {
                    const element = elements[i];
                    const text = await page.evaluate(el => el.textContent?.trim() || '', element);

                    if (text.length > 20 && text.length < 200) {
                        const product: Partial<AIScrapedProduct> = {
                            title: text,
                            price: { original: 0, currency: 'USD' },
                            images: [],
                            rating: 0,
                            availability: true,
                            shipping: { cost: 0, estimatedDays: 7, freeShipping: false },
                            specifications: {},
                            seller: { name: '', rating: 0, verified: false, goldMember: false },
                            aiInsights: {
                                confidence: 0.3,
                                dataQuality: 'low',
                                extractionMethod: 'fallback',
                                validationStatus: 'failed',
                            },
                            metadata: {
                                scrapedAt: new Date(),
                                source: config.source,
                                url: page.url(),
                                pageType: 'product-listing',
                                extractionTime: Date.now(),
                            },
                        };

                        products.push(product as AIScrapedProduct);
                    }
                } catch (error) {
                    continue;
                }
            }

            return products;
        } finally {
            await page.close();
        }
    }

    /**
     * Process products with AI-powered validation and enrichment
     */
    private async processProductsWithAI(products: AIScrapedProduct[], config: AIScrapingConfig): Promise<AIScrapedProduct[]> {
        const processedProducts: AIScrapedProduct[] = [];

        for (const product of products) {
            try {
                // Validate product data
                const validation = this.aiModels.get('dataValidation').validateProductData(product);

                if (validation.isValid) {
                    // Enrich product data
                    const enrichedProduct = await this.aiModels.get('dataValidation').enrichProductData(product);

                    // Update validation status
                    enrichedProduct.aiInsights.validationStatus = 'validated';

                    processedProducts.push(enrichedProduct as AIScrapedProduct);
                } else {
                    // Log validation issues
                    console.log(`Product validation failed for "${product.title}":`, validation.issues);

                    // Still add to results but mark as failed validation
                    product.aiInsights.validationStatus = 'failed';
                    processedProducts.push(product);
                }
            } catch (error) {
                console.error('Error processing product:', error);
                product.aiInsights.validationStatus = 'failed';
                processedProducts.push(product);
            }
        }

        return processedProducts;
    }

    /**
     * Store scraping results
     */
    private async storeScrapingResults(sessionId: string, products: AIScrapedProduct[]) {
        try {
            // Store in database
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
            this.runScrapingSession(sessionId);
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
     * Close the browser and clean up resources
     */
    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
        this.isInitialized = false;

        // Clean up all sessions
        this.activeSessions.clear();
    }
}