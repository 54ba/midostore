"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Eye,
  MousePointer,
  Heart,
  Share2,
  MessageCircle,
  RefreshCw,
  Filter,
  Download,
  Hash,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Linkedin
} from 'lucide-react';

// Mock social trends data
const mockSocialData = {
  overview: {
    totalMentions: 12450,
    totalEngagement: 89200,
    sentimentScore: 78.5,
    trendingTopics: 12,
    topPlatform: 'Instagram',
    growthRate: 23.4
  },
  platformPerformance: [
    {
      name: 'Instagram',
      mentions: 4560,
      engagement: 34200,
      growth: 28.5,
      topHashtags: ['#midostore', '#dropshipping', '#entrepreneur'],
      sentiment: 82.3
    },
    {
      name: 'Twitter',
      mentions: 3240,
      engagement: 28900,
      growth: 18.7,
      topHashtags: ['#business', '#startup', '#success'],
      sentiment: 75.8
    },
    {
      name: 'Facebook',
      mentions: 2890,
      engagement: 18900,
      growth: 12.3,
      topHashtags: ['#marketing', '#sales', '#growth'],
      sentiment: 71.2
    },
    {
      name: 'YouTube',
      mentions: 1560,
      engagement: 7200,
      growth: 45.2,
      topHashtags: ['#tutorial', '#review', '#unboxing'],
      sentiment: 89.1
    }
  ],
  trendingTopics: [
    {
      topic: 'Dropshipping Success Stories',
      mentions: 2340,
      growth: 156.7,
      sentiment: 91.2,
      platforms: ['Instagram', 'Twitter', 'YouTube'],
      category: 'inspiration'
    },
    {
      topic: 'Product Launch Strategies',
      mentions: 1890,
      growth: 89.3,
      sentiment: 78.5,
      platforms: ['Twitter', 'LinkedIn', 'Facebook'],
      category: 'strategy'
    },
    {
      topic: 'Customer Service Tips',
      mentions: 1450,
      growth: 67.8,
      sentiment: 82.1,
      platforms: ['Facebook', 'Instagram', 'Twitter'],
      category: 'tips'
    },
    {
      topic: 'Marketing Automation',
      mentions: 1230,
      growth: 45.2,
      sentiment: 75.9,
      platforms: ['LinkedIn', 'Twitter', 'YouTube'],
      category: 'technology'
    }
  ],
  influencerInsights: [
    {
      name: 'Sarah Chen',
      platform: 'Instagram',
      followers: 125000,
      engagement: 4.8,
      mentions: 89,
      sentiment: 94.2,
      category: 'lifestyle'
    },
    {
      name: 'Mike Rodriguez',
      platform: 'YouTube',
      followers: 89000,
      engagement: 6.2,
      mentions: 67,
      sentiment: 88.7,
      category: 'business'
    },
    {
      name: 'Emma Thompson',
      platform: 'Twitter',
      followers: 67000,
      engagement: 3.9,
      mentions: 45,
      sentiment: 76.3,
      category: 'marketing'
    }
  ],
  sentimentAnalysis: {
    positive: 65.2,
    neutral: 22.8,
    negative: 12.0,
    topPositiveWords: ['amazing', 'love', 'great', 'excellent', 'perfect'],
    topNegativeWords: ['disappointed', 'slow', 'expensive', 'difficult', 'confusing']
  }
};

export default function SocialTrendsPage() {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      default:
        return <Hash className="h-4 w-4" />;
    }
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 80) return 'text-green-600';
    if (sentiment >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <a href="/">
                <Button variant="ghost" size="sm">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
                </Button>
              </a>
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Social Trends Analytics</h1>
                  <p className="text-sm text-gray-600">Social media insights and trend analysis</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Live Data
              </Badge>
              <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Tools</h2>
            <div className="space-y-3">
              <a href="/analytics/overview">
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Overview</h3>
                      <p className="text-sm text-gray-600">General analytics dashboard</p>
                    </div>
                  </div>
                </div>
              </a>
              <a href="/analytics/live-sales">
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <Activity className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Live Sales</h3>
                      <p className="text-sm text-gray-600">Real-time sales tracking</p>
                    </div>
                  </div>
                </div>
              </a>
              <a href="/analytics/enhanced">
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Enhanced</h3>
                      <p className="text-sm text-gray-600">Advanced analytics features</p>
                    </div>
                  </div>
                </div>
              </a>
              <a href="/analytics/recommendations">
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Recommendations</h3>
                      <p className="text-sm text-gray-600">AI-powered insights</p>
                    </div>
                  </div>
                </div>
              </a>
              <a href="/analytics/location-based">
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <PieChart className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Location-Based</h3>
                      <p className="text-sm text-gray-600">Geographic analytics</p>
                    </div>
                  </div>
                </div>
              </a>
              <a href="/analytics/social-trends">
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-green-300 shadow-md cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-200 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-700">Social Trends</h3>
                      <p className="text-sm text-green-600">Social media analysis</p>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Mentions</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockSocialData.overview.totalMentions.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Social mentions</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockSocialData.overview.totalEngagement.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Likes, shares, comments</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sentiment Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{mockSocialData.overview.sentimentScore}%</div>
                  <p className="text-xs text-muted-foreground">Positive sentiment</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">+{mockSocialData.overview.growthRate}%</div>
                  <p className="text-xs text-muted-foreground">vs last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input placeholder="Search topics, hashtags, or influencers..." />
              </div>
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                >
                  <option value="all">All Platforms</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="facebook">Facebook</option>
                  <option value="youtube">YouTube</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="inspiration">Inspiration</option>
                  <option value="strategy">Strategy</option>
                  <option value="tips">Tips</option>
                  <option value="technology">Technology</option>
                </select>
              </div>
            </div>

            {/* Platform Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Platform Performance
                </CardTitle>
                <CardDescription>Social media performance across different platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSocialData.platformPerformance.map((platform, index) => (
                    <div key={platform.name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {getPlatformIcon(platform.name)}
                          </div>
                          <h3 className="font-semibold text-lg">{platform.name}</h3>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            +{platform.growth}%
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {platform.mentions.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {platform.engagement.toLocaleString()} engagement
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Sentiment:</span>
                          <span className={`ml-2 font-semibold ${getSentimentColor(platform.sentiment)}`}>
                            {platform.sentiment}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Top Hashtags:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {platform.topHashtags.map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Trending Topics
                </CardTitle>
                <CardDescription>Most discussed topics and hashtags</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSocialData.trendingTopics.map((topic, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{topic.topic}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <span>{topic.mentions.toLocaleString()} mentions</span>
                            <span className="text-green-600">+{topic.growth}% growth</span>
                            <span>Sentiment: {topic.sentiment}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Platforms:</span>
                            {topic.platforms.map((platform, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {topic.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Influencer Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  Top Influencers
                </CardTitle>
                <CardDescription>Key influencers mentioning your brand</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSocialData.influencerInsights.map((influencer, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-bold text-lg">
                              {influencer.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{influencer.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              {getPlatformIcon(influencer.platform)}
                              <span>{influencer.platform}</span>
                              <span>•</span>
                              <span>{influencer.followers.toLocaleString()} followers</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">
                            {influencer.engagement}%
                          </div>
                          <div className="text-sm text-gray-500">
                            {influencer.mentions} mentions
                          </div>
                          <div className={`text-sm font-semibold ${getSentimentColor(influencer.sentiment)}`}>
                            {influencer.sentiment}% sentiment
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sentiment Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-orange-600" />
                  Sentiment Analysis
                </CardTitle>
                <CardDescription>Overall sentiment breakdown and key words</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Sentiment Distribution</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span>Positive</span>
                        </div>
                        <span className="font-semibold text-green-600">{mockSocialData.sentimentAnalysis.positive}%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                          <span>Neutral</span>
                        </div>
                        <span className="font-semibold text-gray-600">{mockSocialData.sentimentAnalysis.neutral}%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span>Negative</span>
                        </div>
                        <span className="font-semibold text-red-600">{mockSocialData.sentimentAnalysis.negative}%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Key Words</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">Top Positive Words</h4>
                        <div className="flex flex-wrap gap-2">
                          {mockSocialData.sentimentAnalysis.topPositiveWords.map((word, index) => (
                            <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                              {word}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-red-600 mb-2">Top Negative Words</h4>
                        <div className="flex flex-wrap gap-2">
                          {mockSocialData.sentimentAnalysis.topNegativeWords.map((word, index) => (
                            <Badge key={index} variant="secondary" className="bg-red-100 text-red-800">
                              {word}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}