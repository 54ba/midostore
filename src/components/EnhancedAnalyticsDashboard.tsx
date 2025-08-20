"use client";

import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
} from 'recharts';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    Star,
    Target,
    AlertTriangle,
    CheckCircle,
    Zap,
    BarChart3,
    PieChart as PieChartIcon,
    Activity,
    Lightbulb,
    Globe,
    Monitor,
    Smartphone,
    Eye,
    Clock,
    ArrowUpRight,
    Download,
    RefreshCw,
} from 'lucide-react';

interface SimpleAnalyticsData {
    pageviews: number;
    uniqueVisitors: number;
    bounceRate: number;
    avgTimeOnSite: number;
    topPages: Array<{ page: string; views: number; uniqueVisitors: number }>;
    referrers: Array<{ source: string; visits: number; percentage: number }>;
    devices: Array<{ device: string; visits: number; percentage: number }>;
    countries: Array<{ country: string; visits: number; percentage: number }>;
    browsers: Array<{ browser: string; visits: number; percentage: number }>;
    os: Array<{ os: string; visits: number; percentage: number }>;
    timeSeries: Array<{ date: string; pageviews: number; uniqueVisitors: number }>;
}

interface AIInsights {
    userBehaviorPatterns: Array<{ pattern: string; insight: string; confidence: number }>;
    conversionOptimization: Array<{ page: string; recommendation: string; potential: number }>;
    trafficQuality: { score: number; factors: Array<{ factor: string; impact: 'positive' | 'negative' | 'neutral'; weight: number }> };
    seoOpportunities: Array<{ keyword: string; difficulty: number; potential: number; currentRanking: number }>;
}

interface CrossPlatformInsight {
    type: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    recommendations: string[];
}

interface EnhancedAnalyticsData {
    overview: {
        totalProducts: number;
        totalOrders: number;
        totalRevenue: number;
        totalCustomers: number;
        averageRating: number;
        totalReviews: number;
    };
    webAnalytics: {
        simpleAnalytics: SimpleAnalyticsData;
        aiInsights: AIInsights;
    };
    insights: {
        crossPlatformInsights: CrossPlatformInsight[];
    };
    realTime?: {
        currentVisitors: number;
        activePages: Array<{ page: string; visitors: number }>;
        recentEvents: Array<{ time: string; event: string; page?: string; product?: string }>;
    };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4'];

const EnhancedAnalyticsDashboard: React.FC = () => {
    const [analyticsData, setAnalyticsData] = useState<EnhancedAnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [timeRange, setTimeRange] = useState('30d');
    const [includeRealTime, setIncludeRealTime] = useState(false);

    useEffect(() => {
        fetchEnhancedAnalytics();
    }, [timeRange, includeRealTime]);

    const fetchEnhancedAnalytics = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `/api/analytics/enhanced?timeRange=${timeRange}&realTime=${includeRealTime}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch analytics data');
            }

            const result = await response.json();
            setAnalyticsData(result.data);
        } catch (error) {
            console.error('Error fetching enhanced analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportData = async (format: 'json' | 'csv') => {
        try {
            const response = await fetch(
                `/api/analytics/enhanced?timeRange=${timeRange}&export=${format}`
            );

            if (format === 'csv') {
                const blob = new Blob([await response.text()], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `analytics-${timeRange}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                const data = await response.json();
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `analytics-${timeRange}.json`;
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error exporting data:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <RefreshCw className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading enhanced analytics...</p>
                </div>
            </div>
        );
    }

    if (!analyticsData) {
        return (
            <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600">Failed to load enhanced analytics data</p>
            </div>
        );
    }

    const { webAnalytics, insights } = analyticsData;

    return (
        <div className="space-y-6">
            {/* Header with Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Enhanced Analytics Dashboard</h1>
                    <p className="text-gray-600">SimpleAnalytics + AI-powered insights for your dropshipping store</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="realTime"
                            checked={includeRealTime}
                            onChange={(e) => setIncludeRealTime(e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <label htmlFor="realTime" className="text-sm text-gray-700">Real-time</label>
                    </div>

                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="1y">Last year</option>
                    </select>

                    <button
                        onClick={() => fetchEnhancedAnalytics()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <RefreshCw className="h-4 w-4 inline mr-2" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Export Controls */}
            <div className="flex gap-2">
                <button
                    onClick={() => exportData('csv')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                    <Download className="h-4 w-4" />
                    Export CSV
                </button>
                <button
                    onClick={() => exportData('json')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                    <Download className="h-4 w-4" />
                    Export JSON
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {['overview', 'web-analytics', 'ai-insights', 'cross-platform', 'real-time'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Web Analytics Metrics */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Page Views</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {webAnalytics.simpleAnalytics.pageviews.toLocaleString()}
                                </p>
                            </div>
                            <Eye className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-600">+12.5%</span>
                            <span className="text-gray-500 ml-1">from last period</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {webAnalytics.simpleAnalytics.uniqueVisitors.toLocaleString()}
                                </p>
                            </div>
                            <Users className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-600">+8.3%</span>
                            <span className="text-gray-500 ml-1">from last period</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {webAnalytics.simpleAnalytics.bounceRate.toFixed(1)}%
                                </p>
                            </div>
                            <ArrowUpRight className="h-8 w-8 text-orange-600" />
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-600">-2.1%</span>
                            <span className="text-gray-500 ml-1">from last period</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Avg. Time on Site</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {Math.round(webAnalytics.simpleAnalytics.avgTimeOnSite)}s
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-purple-600" />
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-600">+15.2%</span>
                            <span className="text-gray-500 ml-1">from last period</span>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'web-analytics' && (
                <div className="space-y-6">
                    {/* Traffic Sources */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={webAnalytics.simpleAnalytics.referrers}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ source, percentage }) => `${source} (${percentage}%)`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="visits"
                                    >
                                        {webAnalytics.simpleAnalytics.referrers.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Distribution</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={webAnalytics.simpleAnalytics.devices}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="device" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="visits" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Pages */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Pages</h3>
                        <div className="space-y-3">
                            {webAnalytics.simpleAnalytics.topPages.map((page, index) => (
                                <div key={page.page} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                                        <span className="font-medium text-gray-900">{page.page}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span>{page.views.toLocaleString()} views</span>
                                        <span>{page.uniqueVisitors.toLocaleString()} unique</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'ai-insights' && (
                <div className="space-y-6">
                    {/* Traffic Quality Score */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Quality Score</h3>
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <div className="relative w-24 h-24">
                                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            className="text-gray-200"
                                        />
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            strokeDasharray={`${(webAnalytics.aiInsights.trafficQuality.score / 100) * 251.2} 251.2`}
                                            className="text-blue-600"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xl font-bold text-gray-900">
                                            {webAnalytics.aiInsights.trafficQuality.score}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">Quality Score</p>
                            </div>

                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-3">Quality Factors:</h4>
                                <div className="space-y-2">
                                    {webAnalytics.aiInsights.trafficQuality.factors.map((factor, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-700">{factor.factor}</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs px-2 py-1 rounded-full ${factor.impact === 'positive' ? 'bg-green-100 text-green-800' :
                                                        factor.impact === 'negative' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {factor.impact}
                                                </span>
                                                <span className="text-xs text-gray-500">({factor.weight}%)</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Behavior Patterns */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI User Behavior Analysis</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {webAnalytics.aiInsights.userBehaviorPatterns.map((pattern, index) => (
                                <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h4 className="font-medium text-blue-900 mb-2">{pattern.pattern}</h4>
                                    <p className="text-sm text-blue-800 mb-2">{pattern.insight}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-blue-600">Confidence:</span>
                                        <div className="flex-1 bg-blue-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${pattern.confidence * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-blue-600">{Math.round(pattern.confidence * 100)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SEO Opportunities */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Opportunities</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Potential</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Rank</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {webAnalytics.aiInsights.seoOpportunities.map((opportunity, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {opportunity.keyword}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${opportunity.difficulty < 30 ? 'bg-green-500' :
                                                                    opportunity.difficulty < 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${opportunity.difficulty}%` }}
                                                        />
                                                    </div>
                                                    <span>{opportunity.difficulty}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{ width: `${opportunity.potential}%` }}
                                                        />
                                                    </div>
                                                    <span>{opportunity.potential}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                #{opportunity.currentRanking}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'cross-platform' && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cross-Platform Insights</h3>
                        <div className="space-y-4">
                            {insights.crossPlatformInsights.map((insight, index) => (
                                <div key={index} className={`p-4 rounded-lg border ${insight.priority === 'high' ? 'bg-red-50 border-red-200' :
                                        insight.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                                            'bg-green-50 border-green-200'
                                    }`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 mb-2">{insight.title}</h4>
                                            <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
                                            <div className="space-y-2">
                                                <h5 className="text-sm font-medium text-gray-800">Recommendations:</h5>
                                                <ul className="list-disc list-inside space-y-1">
                                                    {insight.recommendations.map((rec, recIndex) => (
                                                        <li key={recIndex} className="text-sm text-gray-700">{rec}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${insight.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                            }`}>
                                            {insight.priority.toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'real-time' && analyticsData.realTime && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Visitors</h3>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-blue-600 mb-2">
                                    {analyticsData.realTime.currentVisitors}
                                </div>
                                <p className="text-sm text-gray-600">Active right now</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Pages</h3>
                            <div className="space-y-2">
                                {analyticsData.realTime.activePages.map((page, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700">{page.page}</span>
                                        <span className="text-sm font-medium text-gray-900">{page.visitors}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
                            <div className="space-y-2">
                                {analyticsData.realTime.recentEvents.map((event, index) => (
                                    <div key={index} className="text-sm">
                                        <span className="text-gray-600">{event.event}</span>
                                        {event.page && <span className="text-gray-900 ml-2">on {event.page}</span>}
                                        {event.product && <span className="text-gray-900 ml-2">- {event.product}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnhancedAnalyticsDashboard;