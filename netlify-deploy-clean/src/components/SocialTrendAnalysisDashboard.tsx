'use client';

import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    MessageSquare,
    Twitter,
    Globe,
    Brain,
    Target,
    BarChart3,
    Activity,
    Zap,
    Users,
    Share2,
    ArrowUp,
    ArrowDown,
    Minus,
    Filter,
    Search,
    Calendar,
    TrendingDown,
    Eye,
    Heart,
    MessageCircle,
    Repeat,
    Settings
} from 'lucide-react';

interface TrendData {
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

interface ProductTrendMatch {
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

interface TrendAnalysisConfig {
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

export default function SocialTrendAnalysisDashboard() {
    const [trends, setTrends] = useState<TrendData[]>([]);
    const [productMatches, setProductMatches] = useState<ProductTrendMatch[]>([]);
    const [config, setConfig] = useState<TrendAnalysisConfig>({
        platforms: {
            reddit: true,
            twitter: true,
            news: true,
        },
        categories: ['technology', 'politics', 'business', 'science', 'entertainment'],
        keywords: ['ai', 'technology', 'innovation', 'climate', 'politics'],
        timeRange: '24h',
        minEngagement: 1000,
        aiAnalysis: {
            sentimentAnalysis: true,
            productMatching: true,
            demandPrediction: true,
            competitiveAnalysis: true,
        },
    });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'reddit' | 'twitter' | 'news'>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data for demonstration
    useEffect(() => {
        const mockTrends: TrendData[] = [
            {
                id: 'reddit_1',
                platform: 'reddit',
                topic: 'AI Revolution in Healthcare: New Breakthroughs in Medical Diagnosis',
                category: 'technology',
                sentiment: 'positive',
                engagement: {
                    score: 15420,
                    mentions: 0,
                    upvotes: 12500,
                    comments: 2920,
                    shares: 0,
                },
                trendingScore: 8.7,
                relatedProducts: ['healthcare', 'ai', 'medical', 'diagnosis'],
                keywords: ['ai', 'healthcare', 'medical', 'diagnosis', 'breakthrough', 'technology'],
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                source: 'r/technology',
                url: 'https://reddit.com/r/technology/comments/ai-healthcare',
                aiInsights: {
                    productOpportunity: 0.85,
                    marketDemand: 0.78,
                    competitiveLandscape: 'High opportunity with moderate competition',
                    recommendedActions: [
                        'Create AI healthcare product content',
                        'Launch targeted marketing campaign',
                        'Engage with medical technology communities'
                    ],
                    confidence: 0.92,
                },
            },
            {
                id: 'twitter_1',
                platform: 'twitter',
                topic: 'Climate Change Solutions: Renewable Energy Breakthroughs',
                category: 'science',
                sentiment: 'positive',
                engagement: {
                    score: 23450,
                    mentions: 0,
                    upvotes: 0,
                    comments: 0,
                    shares: 23450,
                },
                trendingScore: 9.2,
                relatedProducts: ['renewable', 'energy', 'solar', 'wind', 'green'],
                keywords: ['climate', 'renewable', 'energy', 'breakthrough', 'solar', 'wind'],
                timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
                source: 'Twitter',
                url: 'https://twitter.com/search?q=climate+renewable+energy',
                aiInsights: {
                    productOpportunity: 0.92,
                    marketDemand: 0.89,
                    competitiveLandscape: 'High opportunity with growing market demand',
                    recommendedActions: [
                        'Develop renewable energy product line',
                        'Create sustainability-focused marketing',
                        'Partner with environmental organizations'
                    ],
                    confidence: 0.88,
                },
            },
            {
                id: 'news_1',
                platform: 'news',
                topic: 'Space Exploration: Mars Mission Success and Future Plans',
                category: 'science',
                sentiment: 'positive',
                engagement: {
                    score: 8900,
                    mentions: 0,
                    upvotes: 0,
                    comments: 0,
                    shares: 0,
                },
                trendingScore: 7.5,
                relatedProducts: ['space', 'technology', 'innovation', 'science'],
                keywords: ['space', 'mars', 'mission', 'exploration', 'nasa', 'technology'],
                timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
                source: 'BBC News',
                url: 'https://bbc.com/news/space-mars-mission',
                aiInsights: {
                    productOpportunity: 0.76,
                    marketDemand: 0.68,
                    competitiveLandscape: 'Moderate opportunity with niche market',
                    recommendedActions: [
                        'Create space-themed product content',
                        'Develop educational space products',
                        'Engage with space enthusiast communities'
                    ],
                    confidence: 0.85,
                },
            },
            {
                id: 'reddit_2',
                platform: 'reddit',
                topic: 'Political Debate: Economic Policy Changes and Market Impact',
                category: 'politics',
                sentiment: 'neutral',
                engagement: {
                    score: 12340,
                    mentions: 0,
                    upvotes: 8900,
                    comments: 3440,
                    shares: 0,
                },
                trendingScore: 6.8,
                relatedProducts: ['finance', 'investment', 'economics', 'business'],
                keywords: ['politics', 'economy', 'policy', 'market', 'investment', 'finance'],
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
                source: 'r/politics',
                url: 'https://reddit.com/r/politics/comments/economy-policy',
                aiInsights: {
                    productOpportunity: 0.65,
                    marketDemand: 0.72,
                    competitiveLandscape: 'Moderate opportunity with stable market',
                    recommendedActions: [
                        'Monitor market trends closely',
                        'Create financial education content',
                        'Develop investment-related products'
                    ],
                    confidence: 0.78,
                },
            },
        ];

        setTrends(mockTrends);

        // Mock product matches
        const mockMatches: ProductTrendMatch[] = [
            {
                productId: 'prod_1',
                productName: 'AI-Powered Medical Scanner',
                trendId: 'reddit_1',
                trendTopic: 'AI Revolution in Healthcare: New Breakthroughs in Medical Diagnosis',
                matchScore: 0.89,
                relevanceFactors: ['Category alignment', 'Keyword relevance', 'High engagement trend'],
                marketingOpportunities: ['High-engagement content creation', 'Positive trend leveraging', 'Reddit community engagement'],
                estimatedDemand: 1250,
                competitiveAdvantage: 'Positive trend alignment provides competitive advantage',
            },
            {
                productId: 'prod_2',
                productName: 'Solar Panel Home Kit',
                trendId: 'twitter_1',
                trendTopic: 'Climate Change Solutions: Renewable Energy Breakthroughs',
                matchScore: 0.94,
                relevanceFactors: ['Category alignment', 'Keyword relevance', 'Positive sentiment alignment'],
                marketingOpportunities: ['High-engagement content creation', 'Positive trend leveraging', 'Twitter trend participation'],
                estimatedDemand: 2100,
                competitiveAdvantage: 'High-engagement trend offers visibility advantage',
            },
        ];

        setProductMatches(mockMatches);
    }, []);

    const startTrendAnalysis = async () => {
        setIsAnalyzing(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 3000));
            console.log('Trend analysis completed');
        } catch (error) {
            console.error('Error analyzing trends:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getSentimentIcon = (sentiment: string) => {
        switch (sentiment) {
            case 'positive':
                return <ArrowUp className="w-4 h-4 text-green-600" />;
            case 'negative':
                return <ArrowDown className="w-4 h-4 text-red-600" />;
            default:
                return <Minus className="w-4 h-4 text-gray-600" />;
        }
    };

    const getSentimentColor = (sentiment: string) => {
        switch (sentiment) {
            case 'positive':
                return 'text-green-600 bg-green-100';
            case 'negative':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'reddit':
                return <MessageSquare className="w-5 h-5 text-orange-500" />;
            case 'twitter':
                return <Twitter className="w-5 h-5 text-blue-400" />;
            case 'news':
                return <Globe className="w-5 h-5 text-green-500" />;
            default:
                return <Globe className="w-5 h-5 text-gray-500" />;
        }
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            technology: 'bg-blue-100 text-blue-800',
            science: 'bg-green-100 text-green-800',
            politics: 'bg-purple-100 text-purple-800',
            business: 'bg-yellow-100 text-yellow-800',
            entertainment: 'bg-pink-100 text-pink-800',
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    const filteredTrends = trends.filter(trend => {
        if (selectedPlatform !== 'all' && trend.platform !== selectedPlatform) return false;
        if (selectedCategory !== 'all' && trend.category !== selectedCategory) return false;
        if (searchQuery && !trend.topic.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const getEngagementIcon = (type: string) => {
        switch (type) {
            case 'upvotes':
                return <ArrowUp className="w-4 h-4" />;
            case 'comments':
                return <MessageCircle className="w-4 h-4" />;
            case 'shares':
                return <Share2 className="w-4 h-4" />;
            default:
                return <Activity className="w-4 h-4" />;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Social Trend Analysis</h2>
                        <p className="text-gray-600">AI-powered analysis of trending topics across social media</p>
                    </div>
                </div>
                <button
                    onClick={startTrendAnalysis}
                    disabled={isAnalyzing}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                    {isAnalyzing ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Brain className="w-5 h-5" />
                    )}
                    <span>{isAnalyzing ? 'Analyzing...' : 'Start Analysis'}</span>
                </button>
            </div>

            {/* Configuration Panel */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Analysis Configuration</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Platform Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
                        <div className="space-y-2">
                            {Object.entries(config.platforms).map(([platform, enabled]) => (
                                <label key={platform} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={enabled}
                                        onChange={(e) => setConfig(prev => ({
                                            ...prev,
                                            platforms: { ...prev.platforms, [platform]: e.target.checked }
                                        }))}
                                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                    />
                                    <span className="text-sm text-gray-700 capitalize">{platform}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Time Range */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
                        <select
                            value={config.timeRange}
                            onChange={(e) => setConfig(prev => ({ ...prev, timeRange: e.target.value as any }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="1h">Last Hour</option>
                            <option value="6h">Last 6 Hours</option>
                            <option value="24h">Last 24 Hours</option>
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                        </select>
                    </div>

                    {/* Minimum Engagement */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Min Engagement</label>
                        <input
                            type="number"
                            value={config.minEngagement}
                            onChange={(e) => setConfig(prev => ({ ...prev, minEngagement: parseInt(e.target.value) }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search trending topics..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <select
                        value={selectedPlatform}
                        onChange={(e) => setSelectedPlatform(e.target.value as any)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="all">All Platforms</option>
                        <option value="reddit">Reddit</option>
                        <option value="twitter">Twitter</option>
                        <option value="news">News</option>
                    </select>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="all">All Categories</option>
                        <option value="technology">Technology</option>
                        <option value="science">Science</option>
                        <option value="politics">Politics</option>
                        <option value="business">Business</option>
                        <option value="entertainment">Entertainment</option>
                    </select>
                </div>
            </div>

            {/* Trends Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-3">
                        <MessageSquare className="w-8 h-8 text-red-500" />
                        <div>
                            <p className="text-sm font-medium text-red-800">Reddit Trends</p>
                            <p className="text-2xl font-bold text-red-900">
                                {trends.filter(t => t.platform === 'reddit').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                        <Twitter className="w-8 h-8 text-blue-500" />
                        <div>
                            <p className="text-sm font-medium text-blue-800">Twitter Trends</p>
                            <p className="text-2xl font-bold text-blue-900">
                                {trends.filter(t => t.platform === 'twitter').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                        <Globe className="w-8 h-8 text-green-500" />
                        <div>
                            <p className="text-sm font-medium text-green-800">News Trends</p>
                            <p className="text-2xl font-bold text-green-900">
                                {trends.filter(t => t.platform === 'news').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-3">
                        <Target className="w-8 h-8 text-purple-500" />
                        <div>
                            <p className="text-sm font-medium text-purple-800">Product Matches</p>
                            <p className="text-2xl font-bold text-purple-900">
                                {productMatches.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trends List */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Trending Topics</h3>

                {filteredTrends.map((trend) => (
                    <div key={trend.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        {/* Trend Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                {getPlatformIcon(trend.platform)}
                                <div>
                                    <h4 className="font-medium text-gray-900 line-clamp-2">{trend.topic}</h4>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(trend.category)}`}>
                                            {trend.category}
                                        </span>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSentimentColor(trend.sentiment)}`}>
                                            {getSentimentIcon(trend.sentiment)}
                                            <span className="ml-1 capitalize">{trend.sentiment}</span>
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {trend.source}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-2xl font-bold text-purple-600">
                                    {trend.trendingScore.toFixed(1)}
                                </div>
                                <div className="text-xs text-gray-500">Trend Score</div>
                            </div>
                        </div>

                        {/* Engagement Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div className="text-center">
                                <div className="flex items-center justify-center space-x-1 text-blue-600 mb-1">
                                    {getEngagementIcon('upvotes')}
                                    <span className="text-lg font-semibold">{trend.engagement.upvotes.toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-gray-600">Upvotes</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
                                    {getEngagementIcon('comments')}
                                    <span className="text-lg font-semibold">{trend.engagement.comments.toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-gray-600">Comments</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center space-x-1 text-purple-600 mb-1">
                                    {getEngagementIcon('shares')}
                                    <span className="text-lg font-semibold">{trend.engagement.shares.toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-gray-600">Shares</p>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-semibold text-orange-600 mb-1">
                                    {trend.engagement.score.toLocaleString()}
                                </div>
                                <p className="text-xs text-gray-600">Total Score</p>
                            </div>
                        </div>

                        {/* Keywords and Related Products */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {trend.keywords.slice(0, 5).map((keyword, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                    #{keyword}
                                </span>
                            ))}
                        </div>

                        {/* AI Insights */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200">
                            <div className="flex items-center space-x-2 mb-2">
                                <Brain className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-800">AI Insights</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-purple-600">
                                        {Math.round(trend.aiInsights.productOpportunity * 100)}%
                                    </div>
                                    <p className="text-xs text-purple-700">Product Opportunity</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-green-600">
                                        {Math.round(trend.aiInsights.marketDemand * 100)}%
                                    </div>
                                    <p className="text-xs text-green-700">Market Demand</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-blue-600">
                                        {Math.round(trend.aiInsights.confidence * 100)}%
                                    </div>
                                    <p className="text-xs text-blue-700">Confidence</p>
                                </div>
                            </div>

                            <div className="text-sm text-purple-700 mb-2">
                                <strong>Competitive Landscape:</strong> {trend.aiInsights.competitiveLandscape}
                            </div>

                            <div className="text-sm text-purple-700">
                                <strong>Recommended Actions:</strong>
                                <ul className="list-disc list-inside mt-1 space-y-1">
                                    {trend.aiInsights.recommendedActions.map((action, index) => (
                                        <li key={index}>{action}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                            <div className="text-xs text-gray-500">
                                {new Date(trend.timestamp).toLocaleString()}
                            </div>
                            <div className="flex space-x-2">
                                <a
                                    href={trend.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    View Source
                                </a>
                                <button className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
                                    Analyze Products
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredTrends.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No trends found matching your criteria</p>
                        <p className="text-sm">Try adjusting your filters or start a new analysis</p>
                    </div>
                )}
            </div>

            {/* Product Matches Section */}
            {productMatches.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Trend Matches</h3>

                    <div className="space-y-4">
                        {productMatches.map((match) => (
                            <div key={match.productId} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-green-50 to-blue-50">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{match.productName}</h4>
                                        <p className="text-sm text-gray-600">Matches: {match.trendTopic}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-green-600">
                                            {Math.round(match.matchScore * 100)}%
                                        </div>
                                        <div className="text-xs text-gray-500">Match Score</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-700 mb-2">Relevance Factors</h5>
                                        <ul className="space-y-1">
                                            {match.relevanceFactors.map((factor, index) => (
                                                <li key={index} className="text-xs text-gray-600 flex items-center space-x-1">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span>{factor}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h5 className="text-sm font-medium text-gray-700 mb-2">Marketing Opportunities</h5>
                                        <ul className="space-y-1">
                                            {match.marketingOpportunities.map((opportunity, index) => (
                                                <li key={index} className="text-xs text-gray-600 flex items-center space-x-1">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    <span>{opportunity}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            <strong>Estimated Demand:</strong> {match.estimatedDemand.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            <strong>Competitive Advantage:</strong> {match.competitiveAdvantage}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}