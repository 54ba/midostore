"use client";

import React, { useState, useEffect } from 'react';
import {
  Share2,
  TrendingUp,
  BarChart3,
  Users,
  Eye,
  MousePointer,
  DollarSign,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Copy,
  Download,
  Sparkles,
  Target,
  Calendar,
  Globe,
  Code,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface MarketingDashboardProps {
  userId: string;
  className?: string;
}

interface ShareMetrics {
  totalShares: number;
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  conversionRate: number;
  topPlatform: string;
}

interface PlatformPerformance {
  platform: string;
  clicks: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  icon: React.ReactNode;
  color: string;
}

export default function MarketingDashboard({ userId, className = '' }: MarketingDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState<ShareMetrics>({
    totalShares: 0,
    totalClicks: 0,
    totalConversions: 0,
    totalRevenue: 0,
    conversionRate: 0,
    topPlatform: 'Facebook',
  });
  const [platformData, setPlatformData] = useState<PlatformPerformance[]>([]);
  const [trendData, setTrendData] = useState([]);
  const [insights, setInsights] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchAnalytics();
    fetchProducts();
  }, [userId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch sharing analytics
      const analyticsResponse = await fetch(`/api/sharing?action=analytics&userId=${userId}`);
      const analyticsData = await analyticsResponse.json();

      // Fetch insights
      const insightsResponse = await fetch(`/api/sharing?action=insights&userId=${userId}`);
      const insightsData = await insightsResponse.json();

      if (analyticsData.success) {
        processAnalyticsData(analyticsData.data);
      }

      if (insightsData.success) {
        setInsights(insightsData.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const processAnalyticsData = (data: any[]) => {
    const totalClicks = data.reduce((sum, item) => sum + item.clicks, 0);
    const totalConversions = data.reduce((sum, item) => sum + item.conversions, 0);
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

    setMetrics({
      totalShares: data.length,
      totalClicks,
      totalConversions,
      totalRevenue,
      conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
      topPlatform: 'Facebook', // This would be calculated from data
    });

    // Process platform performance
    const platforms = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn'];
    const platformPerformance = platforms.map(platform => {
      const platformData = data.filter(item => item.platform.toLowerCase() === platform.toLowerCase());
      const clicks = platformData.reduce((sum, item) => sum + item.clicks, 0);
      const conversions = platformData.reduce((sum, item) => sum + item.conversions, 0);
      const revenue = platformData.reduce((sum, item) => sum + item.revenue, 0);

      return {
        platform,
        clicks,
        conversions,
        revenue,
        conversionRate: clicks > 0 ? (conversions / clicks) * 100 : 0,
        icon: getPlatformIcon(platform),
        color: getPlatformColor(platform),
      };
    });

    setPlatformData(platformPerformance);

    // Generate trend data (mock data for demo)
    const trendData = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      clicks: Math.floor(Math.random() * 100) + 20,
      conversions: Math.floor(Math.random() * 20) + 2,
      revenue: Math.floor(Math.random() * 500) + 50,
    }));

    setTrendData(trendData as any);
  };

  const generateSocialPost = async (productId: string, platform: string) => {
    try {
      const response = await fetch('/api/sharing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-social-post',
          productId,
          platform,
          userId,
          tone: 'professional',
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Open a modal or navigate to social posting interface
        console.log('Generated post:', data.data);
        alert(`Generated ${platform} post:\n\n${data.data.content}`);
      }
    } catch (error) {
      console.error('Error generating social post:', error);
    }
  };

  const generateEmbedCode = async (productId: string) => {
    try {
      const response = await fetch('/api/sharing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-embed',
          productId,
          options: {
            type: 'product-card',
            theme: 'light',
            size: 'medium',
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        navigator.clipboard.writeText(data.data.embedCode);
        alert('Embed code copied to clipboard!');
      }
    } catch (error) {
      console.error('Error generating embed code:', error);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const icons = {
      Facebook: <Facebook className="w-5 h-5" />,
      Instagram: <Instagram className="w-5 h-5" />,
      Twitter: <Twitter className="w-5 h-5" />,
      LinkedIn: <Linkedin className="w-5 h-5" />,
    };
    return (icons as any)[platform] || <Share2 className="w-5 h-5" />;
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      Facebook: '#1877F2',
      Instagram: '#E4405F',
      Twitter: '#1DA1F2',
      LinkedIn: '#0A66C2',
    };
    return (colors as any)[platform] || '#6B7280';
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              Marketing Dashboard
            </h2>
            <p className="text-gray-600 mt-1">Track your product sharing and social media performance</p>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Products</option>
              {products.map((product: any) => (
                <option key={product.id} value={product.id}>
                  {product.title}
                </option>
              ))}
            </select>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mt-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'social', label: 'Social Media', icon: Share2 },
            { id: 'embed', label: 'Embed Widgets', icon: Code },
            { id: 'insights', label: 'AI Insights', icon: Zap },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Shares</p>
                    <p className="text-2xl font-bold text-blue-900">{metrics.totalShares}</p>
                  </div>
                  <Share2 className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Total Clicks</p>
                    <p className="text-2xl font-bold text-green-900">{metrics.totalClicks}</p>
                  </div>
                  <MousePointer className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Conversions</p>
                    <p className="text-2xl font-bold text-purple-900">{metrics.totalConversions}</p>
                  </div>
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">Revenue</p>
                    <p className="text-2xl font-bold text-orange-900">${metrics.totalRevenue.toFixed(2)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="clicks" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Platform Performance */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {platformData.map((platform) => (
                  <div key={platform.platform} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div style={{ color: platform.color }}>
                        {platform.icon}
                      </div>
                      <span className="font-medium text-gray-900">{platform.platform}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Clicks:</span>
                        <span className="font-medium">{platform.clicks}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Conversions:</span>
                        <span className="font-medium">{platform.conversions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Revenue:</span>
                        <span className="font-medium">${platform.revenue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Conv. Rate:</span>
                        <span className="font-medium">{platform.conversionRate.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Share2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Social Media Tools</h3>
              <p className="text-gray-600 mb-6">Generate and schedule social media posts for your products</p>

              {selectedProduct ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  {['facebook', 'instagram', 'twitter', 'linkedin'].map((platform) => (
                    <button
                      key={platform}
                      onClick={() => generateSocialPost(selectedProduct, platform)}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      {getPlatformIcon(platform)}
                      <span className="block mt-2 text-sm font-medium capitalize">{platform}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Select a product above to generate social media posts</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'embed' && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Embed Widgets</h3>
              <p className="text-gray-600 mb-6">Create embeddable product widgets for your website</p>

              {selectedProduct ? (
                <div className="max-w-md mx-auto">
                  <button
                    onClick={() => generateEmbedCode(selectedProduct)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
                  >
                    <Copy className="w-4 h-4" />
                    Generate Embed Code
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">Select a product above to generate embed code</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  AI Recommendations
                </h3>
                <ul className="space-y-2">
                  {insights.recommendations?.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  )) || <li className="text-gray-500">No recommendations available</li>}
                </ul>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Best Posting Times
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Best Days:</span>
                    <div className="flex gap-2 mt-1">
                      {insights.bestPostingTimes?.bestDays?.map((day: string) => (
                        <span key={day} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          {day}
                        </span>
                      )) || <span className="text-gray-500">No data available</span>}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Best Hours:</span>
                    <div className="flex gap-2 mt-1">
                      {insights.bestPostingTimes?.bestHours?.map((hour: string) => (
                        <span key={hour} className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs">
                          {hour}
                        </span>
                      )) || <span className="text-gray-500">No data available</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}