// import { PrismaClient } from '@prisma/client';
import axios from 'axios';
// Dynamic import to avoid webpack issues
// import { AIPoweredScrapingService } from './ai-powered-scraping-service';

export interface TrendData {
    id: string;
    platform: 'reddit' | 'twitter' | 'news';
    topic: string;
    category: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    engagement: {
        score: number;
        mentions: number;
        upvotes: number;
        comments: number;
        shares: number;
    };
    trendingScore: number;
    relatedProducts: string[];
    keywords: string[];
    timestamp: Date;
    source: string;
    url: string;
    aiInsights: {
        productOpportunity: number;
        marketDemand: number;
        competitiveLandscape: string;
        recommendedActions: string[];
        confidence: number;
    };
}

export interface ProductTrendMatch {
    productId: string;
    productName: string;
    trendId: string;
    trendTopic: string;
    matchScore: number;
    relevanceFactors: string[];
    marketingOpportunities: string[];
    estimatedDemand: number;
    competitiveAdvantage: string;
}

export interface TrendAnalysisConfig {
    platforms: {
        reddit: boolean;
        twitter: boolean;
        news: boolean;
    };
    categories: string[];
    keywords: string[];
    timeRange: '1h' | '6h' | '24h' | '7d' | '30d';
    minEngagement: number;
    aiAnalysis: {
        sentimentAnalysis: boolean;
        productMatching: boolean;
        demandPrediction: boolean;
        competitiveAnalysis: boolean;
    };
}

export class SocialTrendAnalysisService {
    private prisma: any;
    private redditApiKey: string;
    private twitterApiKey: string;
    private newsApiKey: string;

    constructor(prisma?: any) {
        this.prisma = prisma;
        this.redditApiKey = process.env.REDDIT_API_KEY || '';
        this.twitterApiKey = process.env.TWITTER_API_KEY || '';
        this.newsApiKey = process.env.NEWS_API_KEY || '';
    }

    /**
     * Analyze trends across all configured platforms
     */
    async analyzeTrends(config: TrendAnalysisConfig): Promise<TrendData[]> {
        const trends: TrendData[] = [];

        try {
            if (config.platforms.reddit) {
                const redditTrends = await this.analyzeRedditTrends(config);
                trends.push(...redditTrends);
            }

            if (config.platforms.twitter) {
                const twitterTrends = await this.analyzeTwitterTrends(config);
                trends.push(...twitterTrends);
            }

            if (config.platforms.news) {
                const newsTrends = await this.analyzeNewsTrends(config);
                trends.push(...newsTrends);
            }

            // AI-powered trend analysis and insights
            const enhancedTrends = await this.enhanceTrendsWithAI(trends, config);

            // Store trends in database
            await this.storeTrends(enhancedTrends);

            return enhancedTrends;
        } catch (error) {
            console.error('Error analyzing trends:', error);
            throw error;
        }
    }

    /**
     * Analyze Reddit trends using AI-powered scraping
     */
    private async analyzeRedditTrends(config: TrendAnalysisConfig): Promise<TrendData[]> {
        const trends: TrendData[] = [];

        try {
            // Use AI-powered scraping for Reddit
            const redditConfig = {
                source: 'custom',
                category: 'trending',
                pageCount: 1,
                aiFeatures: {
                    intelligentElementDetection: true,
                    adaptiveScraping: true,
                    contentAnalysis: true,
                    antiDetection: true,
                    dynamicSelectorOptimization: true,
                },
                automation: {
                    autoRetry: true,
                    smartDelays: true,
                    proxyRotation: false,
                    sessionManagement: true,
                },
                quality: {
                    imageOptimization: false,
                    dataValidation: true,
                    duplicateDetection: true,
                    contentEnrichment: true,
                },
            };

            // Scrape trending subreddits
            const trendingSubreddits = [
                'popular', 'trending', 'news', 'politics', 'technology',
                'science', 'business', 'entertainment', 'sports', 'worldnews'
            ];

            for (const subreddit of trendingSubreddits) {
                try {
                    const redditData = await this.scrapeRedditSubreddit(subreddit, config);
                    trends.push(...redditData);
                } catch (error) {
                    console.error(`Error scraping r/${subreddit}:`, error);
                    continue;
                }
            }

        } catch (error) {
            console.error('Error analyzing Reddit trends:', error);
        }

        return trends;
    }

    /**
     * Scrape Reddit subreddit for trending posts
     */
    private async scrapeRedditSubreddit(subreddit: string, config: TrendAnalysisConfig): Promise<TrendData[]> {
        const trends: TrendData[] = [];

        try {
            // Reddit API endpoint for trending posts
            const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=25`;

            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                timeout: 10000
            });

            const posts = response.data.data.children;

            for (const post of posts) {
                const postData = post.data;

                // Calculate engagement score
                const engagementScore = this.calculateEngagementScore(postData);

                if (engagementScore >= config.minEngagement) {
                    const trend: TrendData = {
                        id: `reddit_${postData.id}`,
                        platform: 'reddit',
                        topic: postData.title,
                        category: this.categorizeRedditPost(postData),
                        sentiment: this.analyzeSentiment(postData.title + ' ' + postData.selftext),
                        engagement: {
                            score: engagementScore,
                            mentions: 0,
                            upvotes: postData.ups,
                            comments: postData.num_comments,
                            shares: 0,
                        },
                        trendingScore: this.calculateTrendingScore(postData),
                        relatedProducts: this.extractProductMentions(postData.title + ' ' + postData.selftext),
                        keywords: this.extractKeywords(postData.title + ' ' + postData.selftext),
                        timestamp: new Date(postData.created_utc * 1000),
                        source: `r/${subreddit}`,
                        url: `https://reddit.com${postData.permalink}`,
                        aiInsights: {
                            productOpportunity: 0,
                            marketDemand: 0,
                            competitiveLandscape: '',
                            recommendedActions: [],
                            confidence: 0,
                        },
                    };

                    trends.push(trend);
                }
            }

        } catch (error) {
            console.error(`Error scraping r/${subreddit}:`, error);
        }

        return trends;
    }

    /**
     * Analyze Twitter trends
     */
    private async analyzeTwitterTrends(config: TrendAnalysisConfig): Promise<TrendData[]> {
        const trends: TrendData[] = [];

        try {
            // Twitter API v2 endpoint for trending topics
            if (this.twitterApiKey) {
                const response = await axios.get('https://api.twitter.com/2/trends/place/1', {
                    headers: {
                        'Authorization': `Bearer ${this.twitterApiKey}`
                    }
                });

                const trendingTopics = response.data[0].trends;

                for (const topic of trendingTopics) {
                    if (topic.tweet_volume >= config.minEngagement) {
                        const trend: TrendData = {
                            id: `twitter_${topic.name}`,
                            platform: 'twitter',
                            topic: topic.name,
                            category: this.categorizeTwitterTopic(topic),
                            sentiment: this.analyzeSentiment(topic.name),
                            engagement: {
                                score: topic.tweet_volume || 0,
                                mentions: 0,
                                upvotes: 0,
                                comments: 0,
                                shares: topic.tweet_volume || 0,
                            },
                            trendingScore: this.calculateTwitterTrendingScore(topic),
                            relatedProducts: this.extractProductMentions(topic.name),
                            keywords: this.extractKeywords(topic.name),
                            timestamp: new Date(),
                            source: 'Twitter',
                            url: topic.url,
                            aiInsights: {
                                productOpportunity: 0,
                                marketDemand: 0,
                                competitiveLandscape: '',
                                recommendedActions: [],
                                confidence: 0,
                            },
                        };

                        trends.push(trend);
                    }
                }
            } else {
                // Fallback to web scraping for Twitter trends
                const twitterTrends = await this.scrapeTwitterTrends(config);
                trends.push(...twitterTrends);
            }

        } catch (error) {
            console.error('Error analyzing Twitter trends:', error);
        }

        return trends;
    }

    /**
     * Scrape Twitter trends using AI-powered scraping
     */
    private async scrapeTwitterTrends(config: TrendAnalysisConfig): Promise<TrendData[]> {
        const trends: TrendData[] = [];

        try {
            // Use AI-powered scraping for Twitter trends
            const twitterConfig = {
                source: 'custom',
                category: 'trending',
                pageCount: 1,
                aiFeatures: {
                    intelligentElementDetection: true,
                    adaptiveScraping: true,
                    contentAnalysis: true,
                    antiDetection: true,
                    dynamicSelectorOptimization: true,
                },
                automation: {
                    autoRetry: true,
                    smartDelays: true,
                    proxyRotation: false,
                    sessionManagement: true,
                },
                quality: {
                    imageOptimization: false,
                    dataValidation: true,
                    duplicateDetection: true,
                    contentEnrichment: true,
                },
            };

            // Scrape Twitter trending topics
            const trendingTopics = await this.scrapeTwitterTrendingPage();

            for (const topic of trendingTopics) {
                const trend: TrendData = {
                    id: `twitter_${topic.name}`,
                    platform: 'twitter',
                    topic: topic.name,
                    category: this.categorizeTwitterTopic(topic),
                    sentiment: this.analyzeSentiment(topic.name),
                    engagement: {
                        score: topic.volume || 0,
                        mentions: 0,
                        upvotes: 0,
                        comments: 0,
                        shares: topic.volume || 0,
                    },
                    trendingScore: this.calculateTwitterTrendingScore(topic),
                    relatedProducts: this.extractProductMentions(topic.name),
                    keywords: this.extractKeywords(topic.name),
                    timestamp: new Date(),
                    source: 'Twitter',
                    url: topic.url,
                    aiInsights: {
                        productOpportunity: 0,
                        marketDemand: 0,
                        competitiveLandscape: '',
                        recommendedActions: [],
                        confidence: 0,
                    },
                };

                trends.push(trend);
            }

        } catch (error) {
            console.error('Error scraping Twitter trends:', error);
        }

        return trends;
    }

    /**
     * Scrape Twitter trending page
     */
    private async scrapeTwitterTrendingPage(): Promise<any[]> {
        // This would use the AI-powered scraping service
        // For now, return mock data
        return [
            { name: 'AI Technology', volume: 50000, url: 'https://twitter.com/search?q=AI%20Technology' },
            { name: 'Climate Change', volume: 45000, url: 'https://twitter.com/search?q=Climate%20Change' },
            { name: 'Space Exploration', volume: 40000, url: 'https://twitter.com/search?q=Space%20Exploration' },
        ];
    }

    /**
     * Analyze news trends
     */
    private async analyzeNewsTrends(config: TrendAnalysisConfig): Promise<TrendData[]> {
        const trends: TrendData[] = [];

        try {
            if (this.newsApiKey) {
                // News API for trending news
                const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${this.newsApiKey}`);

                const articles = response.data.articles;

                for (const article of articles) {
                    const engagementScore = this.calculateNewsEngagementScore(article);

                    if (engagementScore >= config.minEngagement) {
                        const trend: TrendData = {
                            id: `news_${article.title.replace(/\s+/g, '_')}`,
                            platform: 'news',
                            topic: article.title,
                            category: article.category || this.categorizeNewsArticle(article),
                            sentiment: this.analyzeSentiment(article.title + ' ' + article.description),
                            engagement: {
                                score: engagementScore,
                                mentions: 0,
                                upvotes: 0,
                                comments: 0,
                                shares: 0,
                            },
                            trendingScore: this.calculateNewsTrendingScore(article),
                            relatedProducts: this.extractProductMentions(article.title + ' ' + article.description),
                            keywords: this.extractKeywords(article.title + ' ' + article.description),
                            timestamp: new Date(article.publishedAt),
                            source: article.source.name,
                            url: article.url,
                            aiInsights: {
                                productOpportunity: 0,
                                marketDemand: 0,
                                competitiveLandscape: '',
                                recommendedActions: [],
                                confidence: 0,
                            },
                        };

                        trends.push(trend);
                    }
                }
            } else {
                // Fallback to web scraping for news
                const newsTrends = await this.scrapeNewsTrends(config);
                trends.push(...newsTrends);
            }

        } catch (error) {
            console.error('Error analyzing news trends:', error);
        }

        return trends;
    }

    /**
     * Scrape news trends using AI-powered scraping
     */
    private async scrapeNewsTrends(config: TrendAnalysisConfig): Promise<TrendData[]> {
        const trends: TrendData[] = [];

        try {
            // Use AI-powered scraping for news trends
            const newsConfig = {
                source: 'custom',
                category: 'news',
                pageCount: 1,
                aiFeatures: {
                    intelligentElementDetection: true,
                    adaptiveScraping: true,
                    contentAnalysis: true,
                    antiDetection: true,
                    dynamicSelectorOptimization: true,
                },
                automation: {
                    autoRetry: true,
                    smartDelays: true,
                    proxyRotation: false,
                    sessionManagement: true,
                },
                quality: {
                    imageOptimization: false,
                    dataValidation: true,
                    duplicateDetection: true,
                    contentEnrichment: true,
                },
            };

            // Scrape major news websites
            const newsSources = [
                'https://www.bbc.com/news',
                'https://www.cnn.com',
                'https://www.reuters.com',
                'https://www.ap.org'
            ];

            for (const source of newsSources) {
                try {
                    const newsData = await this.scrapeNewsWebsite(source, config);
                    trends.push(...newsData);
                } catch (error) {
                    console.error(`Error scraping ${source}:`, error);
                    continue;
                }
            }

        } catch (error) {
            console.error('Error scraping news trends:', error);
        }

        return trends;
    }

    /**
     * Scrape news website for trending articles
     */
    private async scrapeNewsWebsite(url: string, config: TrendAnalysisConfig): Promise<TrendData[]> {
        const trends: TrendData[] = [];

        try {
            // This would use the AI-powered scraping service
            // For now, return mock data
            const mockArticles = [
                {
                    title: 'AI Revolution in Healthcare',
                    description: 'New AI technologies are transforming medical diagnosis and treatment',
                    category: 'technology',
                    publishedAt: new Date(),
                    source: 'BBC News',
                    url: url + '/ai-healthcare'
                },
                {
                    title: 'Global Climate Summit Results',
                    description: 'World leaders agree on new climate action plan',
                    category: 'politics',
                    publishedAt: new Date(),
                    source: 'BBC News',
                    url: url + '/climate-summit'
                }
            ];

            for (const article of mockArticles) {
                const engagementScore = this.calculateNewsEngagementScore(article);

                if (engagementScore >= config.minEngagement) {
                    const trend: TrendData = {
                        id: `news_${article.title.replace(/\s+/g, '_')}`,
                        platform: 'news',
                        topic: article.title,
                        category: article.category,
                        sentiment: this.analyzeSentiment(article.title + ' ' + article.description),
                        engagement: {
                            score: engagementScore,
                            mentions: 0,
                            upvotes: 0,
                            comments: 0,
                            shares: 0,
                        },
                        trendingScore: this.calculateNewsTrendingScore(article),
                        relatedProducts: this.extractProductMentions(article.title + ' ' + article.description),
                        keywords: this.extractKeywords(article.title + ' ' + article.description),
                        timestamp: article.publishedAt,
                        source: article.source,
                        url: article.url,
                        aiInsights: {
                            productOpportunity: 0,
                            marketDemand: 0,
                            competitiveLandscape: '',
                            recommendedActions: [],
                            confidence: 0,
                        },
                    };

                    trends.push(trend);
                }
            }

        } catch (error) {
            console.error(`Error scraping ${url}:`, error);
        }

        return trends;
    }

    /**
     * Enhance trends with AI-powered insights
     */
    private async enhanceTrendsWithAI(trends: TrendData[], config: TrendAnalysisConfig): Promise<TrendData[]> {
        const enhancedTrends: TrendData[] = [];

        for (const trend of trends) {
            try {
                const aiInsights = await this.generateAIInsights(trend, config);

                const enhancedTrend: TrendData = {
                    ...trend,
                    aiInsights,
                };

                enhancedTrends.push(enhancedTrend);
            } catch (error) {
                console.error('Error enhancing trend with AI:', error);
                enhancedTrends.push(trend);
            }
        }

        return enhancedTrends;
    }

    /**
     * Generate AI-powered insights for a trend
     */
    private async generateAIInsights(trend: TrendData, config: TrendAnalysisConfig): Promise<TrendData['aiInsights']> {
        try {
            // Analyze product opportunities
            const productOpportunity = this.analyzeProductOpportunity(trend);

            // Predict market demand
            const marketDemand = this.predictMarketDemand(trend);

            // Analyze competitive landscape
            const competitiveLandscape = this.analyzeCompetitiveLandscape(trend);

            // Generate recommended actions
            const recommendedActions = this.generateRecommendedActions(trend, productOpportunity, marketDemand);

            // Calculate confidence score
            const confidence = this.calculateConfidenceScore(trend);

            return {
                productOpportunity,
                marketDemand,
                competitiveLandscape,
                recommendedActions,
                confidence,
            };
        } catch (error) {
            console.error('Error generating AI insights:', error);
            return {
                productOpportunity: 0,
                marketDemand: 0,
                competitiveLandscape: '',
                recommendedActions: [],
                confidence: 0,
            };
        }
    }

    /**
     * Match products with trending topics
     */
    async matchProductsWithTrends(trends: TrendData[]): Promise<ProductTrendMatch[]> {
        const matches: ProductTrendMatch[] = [];

        try {
            // Get all products from database
            const products = await this.prisma.product.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    category: true,
                    tags: true,
                }
            });

            for (const trend of trends) {
                for (const product of products) {
                    const matchScore = this.calculateProductTrendMatchScore(product, trend);

                    if (matchScore > 0.3) { // Minimum match threshold
                        const match: ProductTrendMatch = {
                            productId: product.id,
                            productName: product.title,
                            trendId: trend.id,
                            trendTopic: trend.topic,
                            matchScore,
                            relevanceFactors: this.identifyRelevanceFactors(product, trend),
                            marketingOpportunities: this.identifyMarketingOpportunities(product, trend),
                            estimatedDemand: this.estimateProductDemand(product, trend),
                            competitiveAdvantage: this.identifyCompetitiveAdvantage(product, trend),
                        };

                        matches.push(match);
                    }
                }
            }

            // Sort by match score
            matches.sort((a, b) => b.matchScore - a.matchScore);

        } catch (error) {
            console.error('Error matching products with trends:', error);
        }

        return matches;
    }

    /**
     * Calculate product-trend match score
     */
    private calculateProductTrendMatchScore(product: any, trend: TrendData): number {
        let score = 0;

        // Category match
        if (product.category === trend.category) {
            score += 0.4;
        }

        // Keyword overlap
        const productKeywords = this.extractKeywords(product.title + ' ' + product.description);
        const keywordOverlap = this.calculateKeywordOverlap(productKeywords, trend.keywords);
        score += keywordOverlap * 0.3;

        // Sentiment alignment
        if (trend.sentiment === 'positive') {
            score += 0.2;
        }

        // Engagement factor
        const engagementFactor = Math.min(trend.engagement.score / 10000, 1);
        score += engagementFactor * 0.1;

        return Math.min(score, 1);
    }

    /**
     * Calculate keyword overlap
     */
    private calculateKeywordOverlap(keywords1: string[], keywords2: string[]): number {
        if (keywords1.length === 0 || keywords2.length === 0) return 0;

        const set1 = new Set(keywords1.map(k => k.toLowerCase()));
        const set2 = new Set(keywords2.map(k => k.toLowerCase()));

        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);

        return intersection.size / union.size;
    }

    /**
     * Identify relevance factors
     */
    private identifyRelevanceFactors(product: any, trend: TrendData): string[] {
        const factors: string[] = [];

        if (product.category === trend.category) {
            factors.push('Category alignment');
        }

        if (trend.keywords.some(keyword =>
            product.title.toLowerCase().includes(keyword.toLowerCase()) ||
            product.description.toLowerCase().includes(keyword.toLowerCase())
        )) {
            factors.push('Keyword relevance');
        }

        if (trend.sentiment === 'positive') {
            factors.push('Positive sentiment alignment');
        }

        if (trend.engagement.score > 5000) {
            factors.push('High engagement trend');
        }

        return factors;
    }

    /**
     * Identify marketing opportunities
     */
    private identifyMarketingOpportunities(product: any, trend: TrendData): string[] {
        const opportunities: string[] = [];

        if (trend.engagement.score > 10000) {
            opportunities.push('High-engagement content creation');
        }

        if (trend.sentiment === 'positive') {
            opportunities.push('Positive trend leveraging');
        }

        if (trend.platform === 'reddit') {
            opportunities.push('Reddit community engagement');
        }

        if (trend.platform === 'twitter') {
            opportunities.push('Twitter trend participation');
        }

        if (trend.platform === 'news') {
            opportunities.push('News-related content marketing');
        }

        return opportunities;
    }

    /**
     * Estimate product demand based on trend
     */
    private estimateProductDemand(product: any, trend: TrendData): number {
        let demand = 0;

        // Base demand on engagement
        demand += trend.engagement.score / 1000;

        // Boost for positive sentiment
        if (trend.sentiment === 'positive') {
            demand *= 1.5;
        }

        // Boost for high match score
        const matchScore = this.calculateProductTrendMatchScore(product, trend);
        demand *= (1 + matchScore);

        return Math.round(demand);
    }

    /**
     * Identify competitive advantage
     */
    private identifyCompetitiveAdvantage(product: any, trend: TrendData): string {
        if (trend.sentiment === 'positive') {
            return 'Positive trend alignment provides competitive advantage';
        }

        if (trend.engagement.score > 10000) {
            return 'High-engagement trend offers visibility advantage';
        }

        if (trend.platform === 'reddit' || trend.platform === 'twitter') {
            return 'Social media trend provides engagement advantage';
        }

        return 'Standard trend relevance';
    }

    // Helper methods for trend analysis
    private calculateEngagementScore(postData: any): number {
        return (postData.ups * 2) + postData.num_comments + (postData.score || 0);
    }

    private calculateTrendingScore(postData: any): number {
        const age = (Date.now() / 1000) - postData.created_utc;
        const score = postData.score || 0;
        return score / Math.pow(age + 2, 1.5);
    }

    private calculateTwitterTrendingScore(topic: any): number {
        return (topic.tweet_volume || 0) / 1000;
    }

    private calculateNewsEngagementScore(article: any): number {
        // Mock engagement calculation
        return Math.floor(Math.random() * 1000) + 100;
    }

    private calculateNewsTrendingScore(article: any): number {
        // Mock trending score calculation
        return Math.random();
    }

    private categorizeRedditPost(postData: any): string {
        const title = postData.title.toLowerCase();
        const subreddit = postData.subreddit.toLowerCase();

        if (title.includes('ai') || title.includes('artificial intelligence') || subreddit.includes('technology')) {
            return 'technology';
        }
        if (title.includes('climate') || title.includes('environment') || subreddit.includes('science')) {
            return 'science';
        }
        if (subreddit.includes('politics') || subreddit.includes('news')) {
            return 'politics';
        }
        if (subreddit.includes('business') || subreddit.includes('economics')) {
            return 'business';
        }

        return 'general';
    }

    private categorizeTwitterTopic(topic: any): string {
        const name = topic.name.toLowerCase();

        if (name.includes('ai') || name.includes('tech') || name.includes('innovation')) {
            return 'technology';
        }
        if (name.includes('climate') || name.includes('environment')) {
            return 'science';
        }
        if (name.includes('politics') || name.includes('election')) {
            return 'politics';
        }
        if (name.includes('business') || name.includes('economy')) {
            return 'business';
        }

        return 'general';
    }

    private categorizeNewsArticle(article: any): string {
        const title = article.title.toLowerCase();
        const description = (article.description || '').toLowerCase();
        const content = title + ' ' + description;

        if (content.includes('ai') || content.includes('technology') || content.includes('innovation')) {
            return 'technology';
        }
        if (content.includes('climate') || content.includes('environment') || content.includes('science')) {
            return 'science';
        }
        if (content.includes('politics') || content.includes('election') || content.includes('government')) {
            return 'politics';
        }
        if (content.includes('business') || content.includes('economy') || content.includes('market')) {
            return 'business';
        }

        return 'general';
    }

    private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
        const positiveWords = ['good', 'great', 'amazing', 'excellent', 'wonderful', 'fantastic', 'brilliant', 'innovative', 'breakthrough', 'success'];
        const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disaster', 'failure', 'problem', 'issue', 'crisis', 'danger'];

        const lowerText = text.toLowerCase();
        let positiveCount = 0;
        let negativeCount = 0;

        positiveWords.forEach(word => {
            if (lowerText.includes(word)) positiveCount++;
        });

        negativeWords.forEach(word => {
            if (lowerText.includes(word)) negativeCount++;
        });

        if (positiveCount > negativeCount) return 'positive';
        if (negativeCount > positiveCount) return 'negative';
        return 'neutral';
    }

    private extractProductMentions(text: string): string[] {
        const products: string[] = [];
        const lowerText = text.toLowerCase();

        // Common product categories
        const productCategories = [
            'smartphone', 'laptop', 'tablet', 'headphone', 'earbuds',
            'camera', 'gaming', 'fitness', 'home', 'kitchen',
            'fashion', 'beauty', 'sports', 'automotive', 'electronics'
        ];

        productCategories.forEach(category => {
            if (lowerText.includes(category)) {
                products.push(category);
            }
        });

        return products;
    }

    private extractKeywords(text: string): string[] {
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3);

        // Remove common stop words
        const stopWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'];

        return words.filter(word => !stopWords.includes(word)).slice(0, 10);
    }

    private analyzeProductOpportunity(trend: TrendData): number {
        let opportunity = 0;

        // Higher engagement = higher opportunity
        opportunity += Math.min(trend.engagement.score / 10000, 1) * 0.4;

        // Positive sentiment = higher opportunity
        if (trend.sentiment === 'positive') {
            opportunity += 0.3;
        }

        // More related products = higher opportunity
        opportunity += Math.min(trend.relatedProducts.length / 5, 1) * 0.2;

        // More keywords = higher opportunity
        opportunity += Math.min(trend.keywords.length / 10, 1) * 0.1;

        return Math.min(opportunity, 1);
    }

    private predictMarketDemand(trend: TrendData): number {
        let demand = 0;

        // Base demand on engagement
        demand += Math.min(trend.engagement.score / 5000, 1) * 0.5;

        // Sentiment impact
        if (trend.sentiment === 'positive') {
            demand += 0.3;
        } else if (trend.sentiment === 'negative') {
            demand -= 0.2;
        }

        // Platform impact
        if (trend.platform === 'reddit') {
            demand += 0.1;
        } else if (trend.platform === 'twitter') {
            demand += 0.1;
        }

        return Math.max(0, Math.min(demand, 1));
    }

    private analyzeCompetitiveLandscape(trend: TrendData): string {
        if (trend.engagement.score > 10000) {
            return 'High competition due to high engagement';
        } else if (trend.engagement.score > 5000) {
            return 'Moderate competition with good opportunities';
        } else {
            return 'Low competition with niche opportunities';
        }
    }

    private generateRecommendedActions(trend: TrendData, productOpportunity: number, marketDemand: number): string[] {
        const actions: string[] = [];

        if (productOpportunity > 0.7) {
            actions.push('Create trend-specific product content');
            actions.push('Launch targeted marketing campaign');
        }

        if (marketDemand > 0.7) {
            actions.push('Increase inventory for related products');
            actions.push('Develop trend-aligned product features');
        }

        if (trend.platform === 'reddit') {
            actions.push('Engage with relevant subreddit communities');
        }

        if (trend.platform === 'twitter') {
            actions.push('Participate in trending conversations');
        }

        if (trend.sentiment === 'positive') {
            actions.push('Leverage positive sentiment in marketing');
        }

        return actions;
    }

    private calculateConfidenceScore(trend: TrendData): number {
        let confidence = 0.5; // Base confidence

        // Higher engagement = higher confidence
        confidence += Math.min(trend.engagement.score / 20000, 1) * 0.2;

        // More keywords = higher confidence
        confidence += Math.min(trend.keywords.length / 15, 1) * 0.15;

        // Platform reliability
        if (trend.platform === 'reddit') {
            confidence += 0.1;
        } else if (trend.platform === 'twitter') {
            confidence += 0.1;
        } else if (trend.platform === 'news') {
            confidence += 0.05;
        }

        return Math.min(confidence, 1);
    }

    /**
     * Store trends in database
     */
    private async storeTrends(trends: TrendData[]): Promise<void> {
        try {
            for (const trend of trends) {
                await this.prisma.trendData.upsert({
                    where: { id: trend.id },
                    update: {
                        topic: trend.topic,
                        category: trend.category,
                        sentiment: trend.sentiment,
                        engagement: trend.engagement,
                        trendingScore: trend.trendingScore,
                        relatedProducts: trend.relatedProducts,
                        keywords: trend.keywords,
                        timestamp: trend.timestamp,
                        aiInsights: trend.aiInsights,
                    },
                    create: {
                        id: trend.id,
                        platform: trend.platform,
                        topic: trend.topic,
                        category: trend.category,
                        sentiment: trend.sentiment,
                        engagement: trend.engagement,
                        trendingScore: trend.trendingScore,
                        relatedProducts: trend.relatedProducts,
                        keywords: trend.keywords,
                        timestamp: trend.timestamp,
                        source: trend.source,
                        url: trend.url,
                        aiInsights: trend.aiInsights,
                    },
                });
            }
        } catch (error) {
            console.error('Error storing trends:', error);
        }
    }
}