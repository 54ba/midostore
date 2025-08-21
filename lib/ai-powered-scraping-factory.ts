// Use any type to accept both real PrismaClient and MockPrismaClient
type PrismaClientType = any;

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

export interface IAIScrapingService {
    initialize(): Promise<void>;
    startScrapingSession(config: AIScrapingConfig): Promise<string>;
    getSessionStatus(sessionId: string): ScrapingSession | null;
    getAllSessions(): ScrapingSession[];
    pauseSession(sessionId: string): boolean;
    resumeSession(sessionId: string): boolean;
    stopSession(sessionId: string): boolean;
    close(): Promise<void>;
}

/**
 * Factory function to create AI-powered scraping service
 * This avoids importing problematic modules during build time
 */
export async function createAIScrapingService(prisma?: PrismaClient): Promise<IAIScrapingService> {
    // Dynamic import to avoid webpack issues
    const { AIPoweredScrapingService } = await import('./ai-powered-scraping-service');
    return new AIPoweredScrapingService(prisma);
}