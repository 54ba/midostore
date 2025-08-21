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
    Area
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
    Lightbulb
} from 'lucide-react';

interface AnalyticsData {
    overview: {
        totalProducts: number;
        totalOrders: number;
        totalRevenue: number;
        totalCustomers: number;
        averageRating: number;
        totalReviews: number;
    };
    trends: {
        topCategories: Array<{ category: string; count: number; revenue: number }>;
        topProducts: Array<{ id: string; title: string; sales: number; revenue: number; rating: number }>;
        monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>;
        categoryPerformance: Array<{ category: string; conversionRate: number; avgOrderValue: number }>;
    };
    insights: {
        bestPerformingProducts: Array<{ id: string; title: string; metrics: any }>;
        categoryOpportunities: Array<{ category: string; opportunity: string; potential: number }>;
        seasonalTrends: Array<{ season: string; trend: string; impact: number }>;
        profitAnalysis: {
            totalProfit: number;
            profitMargin: number;
            topProfitCategories: Array<{ category: string; profit: number; margin: number }>;
        };
    };
    recommendations: Array<{
        type: 'product' | 'category' | 'pricing' | 'marketing';
        title: string;
        description: string;
        impact: 'high' | 'medium' | 'low';
        action: string;
    }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AnalyticsDashboard: React.FC = () => {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [timeRange, setTimeRange] = useState('30d');

    // Mock data for demonstration - replace with real API call
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock data - replace with actual API call
                const mockData: AnalyticsData = {
                    overview: {
                        totalProducts: 1247,
                        totalOrders: 892,
                        totalRevenue: 45678.90,
                        totalCustomers: 456,
                        averageRating: 4.6,
                        totalReviews: 3421
                    },
                    trends: {
                        topCategories: [
                            { category: 'Electronics', count: 156, revenue: 18900 },
                            { category: 'Clothing', count: 234, revenue: 15600 },
                            { category: 'Home & Garden', count: 89, revenue: 8900 },
                            { category: 'Sports', count: 67, revenue: 6700 },
                            { category: 'Beauty', count: 123, revenue: 12300 }
                        ],
                        topProducts: [
                            { id: '1', title: 'Wireless Earbuds', sales: 89, revenue: 2670, rating: 4.8 },
                            { id: '2', title: 'Smart Watch', sales: 67, revenue: 2010, rating: 4.6 },
                            { id: '3', title: 'Summer Dress', sales: 123, revenue: 1230, rating: 4.5 },
                            { id: '4', title: 'Garden Tools', sales: 45, revenue: 450, rating: 4.7 },
                            { id: '5', title: 'Fitness Tracker', sales: 78, revenue: 1560, rating: 4.4 }
                        ],
                        monthlyRevenue: [
                            { month: 'Jan', revenue: 12000, orders: 156 },
                            { month: 'Feb', revenue: 13500, orders: 178 },
                            { month: 'Mar', revenue: 14200, orders: 189 },
                            { month: 'Apr', revenue: 15800, orders: 201 },
                            { month: 'May', revenue: 16700, orders: 223 },
                            { month: 'Jun', revenue: 18900, orders: 245 }
                        ],
                        categoryPerformance: [
                            { category: 'Electronics', conversionRate: 3.2, avgOrderValue: 89.50 },
                            { category: 'Clothing', conversionRate: 2.8, avgOrderValue: 67.30 },
                            { category: 'Home & Garden', conversionRate: 2.1, avgOrderValue: 45.20 },
                            { category: 'Sports', conversionRate: 1.9, avgOrderValue: 78.90 },
                            { category: 'Beauty', conversionRate: 2.5, avgOrderValue: 56.40 }
                        ]
                    },
                    insights: {
                        bestPerformingProducts: [
                            { id: '1', title: 'Wireless Earbuds', metrics: { sales: 89, revenue: 2670, rating: 4.8, reviews: 156, profitMargin: 35, category: 'Electronics' } },
                            { id: '2', title: 'Smart Watch', metrics: { sales: 67, revenue: 2010, rating: 4.6, reviews: 134, profitMargin: 42, category: 'Electronics' } },
                            { id: '3', title: 'Summer Dress', metrics: { sales: 123, revenue: 1230, rating: 4.5, reviews: 89, profitMargin: 28, category: 'Clothing' } }
                        ],
                        categoryOpportunities: [
                            { category: 'Electronics', opportunity: 'High demand, expand product range', potential: 0.9 },
                            { category: 'Clothing', opportunity: 'Good performance, optimize pricing', potential: 0.7 },
                            { category: 'Home & Garden', opportunity: 'Under-represented, add more products', potential: 0.8 }
                        ],
                        seasonalTrends: [
                            { season: 'Summer', trend: 'Strong seasonal demand for outdoor products', impact: 0.8 }
                        ],
                        profitAnalysis: {
                            totalProfit: 13703.67,
                            profitMargin: 30.0,
                            topProfitCategories: [
                                { category: 'Electronics', profit: 5670, margin: 35 },
                                { category: 'Clothing', profit: 4368, margin: 28 },
                                { category: 'Beauty', profit: 3696, margin: 30 }
                            ]
                        }
                    },
                    recommendations: [
                        {
                            type: 'product',
                            title: 'Expand Electronics Category',
                            description: 'Electronics shows highest conversion rates. Consider adding more products in this category.',
                            impact: 'high',
                            action: 'Add 20+ new electronics products'
                        },
                        {
                            type: 'pricing',
                            title: 'Optimize Clothing Pricing',
                            description: 'Clothing category has room for price optimization to improve profit margins.',
                            impact: 'medium',
                            action: 'Review and adjust clothing prices'
                        },
                        {
                            type: 'marketing',
                            title: 'Boost Home & Garden Visibility',
                            description: 'Home & Garden products have good ratings but low visibility.',
                            impact: 'medium',
                            action: 'Implement targeted marketing campaigns'
                        }
                    ]
                };

                setAnalyticsData(mockData);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [timeRange]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (!analyticsData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center text-red-600">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                    <p>Failed to load analytics data</p>
                </div>
            </div>
        );
    }

    const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }: any) => (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <div className="flex items-center mt-2">
                            {trend === 'up' ? (
                                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                            )}
                            <span className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {trendValue}
                            </span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </div>
    );

    const RecommendationCard = ({ recommendation }: { recommendation: any }) => {
        const impactColors = {
            high: 'border-l-red-500 bg-red-50',
            medium: 'border-l-yellow-500 bg-yellow-50',
            low: 'border-l-green-500 bg-green-50'
        };

        const impactIcons = {
            high: <AlertTriangle className="h-5 w-5 text-red-500" />,
            medium: <Target className="h-5 w-5 text-yellow-500" />,
            low: <CheckCircle className="h-5 w-5 text-green-500" />
        };

        return (
            <div className={`border-l-4 p-4 rounded-r-lg ${impactColors[recommendation.impact as keyof typeof impactColors] || impactColors.medium}`}>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center mb-2">
                            {impactIcons[recommendation.impact as keyof typeof impactIcons] || impactIcons.medium}
                            <h4 className="font-semibold text-gray-900 ml-2">{recommendation.title}</h4>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{recommendation.description}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                {recommendation.type}
                            </span>
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                {recommendation.action}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                    <p className="text-gray-600">AI-powered insights and trends for your dropshipping store</p>
                </div>

                {/* Time Range Selector */}
                <div className="mb-6">
                    <div className="flex space-x-2">
                        {['7d', '30d', '90d', '1y'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${timeRange === range
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Revenue"
                        value={`$${analyticsData.overview.totalRevenue.toLocaleString()}`}
                        icon={DollarSign}
                        trend="up"
                        trendValue="+12.5%"
                        color="bg-green-500"
                    />
                    <StatCard
                        title="Total Orders"
                        value={analyticsData.overview.totalOrders.toLocaleString()}
                        icon={ShoppingCart}
                        trend="up"
                        trendValue="+8.2%"
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Total Customers"
                        value={analyticsData.overview.totalCustomers.toLocaleString()}
                        icon={Users}
                        trend="up"
                        trendValue="+15.3%"
                        color="bg-purple-500"
                    />
                    <StatCard
                        title="Average Rating"
                        value={analyticsData.overview.averageRating.toFixed(1)}
                        icon={Star}
                        trend="up"
                        trendValue="+0.2"
                        color="bg-yellow-500"
                    />
                </div>

                {/* Navigation Tabs */}
                <div className="mb-6">
                    <nav className="flex space-x-8">
                        {[
                            { id: 'overview', label: 'Overview', icon: BarChart3 },
                            { id: 'trends', label: 'Trends', icon: TrendingUp },
                            { id: 'insights', label: 'AI Insights', icon: Lightbulb },
                            { id: 'recommendations', label: 'Recommendations', icon: Target }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Revenue Chart */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={analyticsData.trends.monthlyRevenue}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                                    <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Top Categories */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories by Revenue</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={analyticsData.trends.topCategories}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="category" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                                    <Bar dataKey="revenue" fill="#10B981" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {activeTab === 'trends' && (
                    <div className="space-y-8">
                        {/* Category Performance */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance Metrics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-3">Conversion Rates</h4>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={analyticsData.trends.categoryPerformance}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="category" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
                                            <Bar dataKey="conversionRate" fill="#8B5CF6" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-3">Average Order Value</h4>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={analyticsData.trends.categoryPerformance}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="category" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => [`$${value}`, 'Order Value']} />
                                            <Bar dataKey="avgOrderValue" fill="#F59E0B" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Top Products */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {analyticsData.trends.topProducts.map((product) => (
                                            <tr key={product.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sales}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.revenue}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.rating} ⭐</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'insights' && (
                    <div className="space-y-8">
                        {/* Profit Analysis */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Analysis</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">${analyticsData.insights.profitAnalysis.totalProfit.toLocaleString()}</p>
                                    <p className="text-sm text-gray-600">Total Profit</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">{analyticsData.insights.profitAnalysis.profitMargin}%</p>
                                    <p className="text-sm text-gray-600">Average Margin</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-purple-600">{analyticsData.insights.profitAnalysis.topProfitCategories.length}</p>
                                    <p className="text-sm text-gray-600">Profitable Categories</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h4 className="font-medium text-gray-700 mb-3">Top Profit Categories</h4>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={analyticsData.insights.profitAnalysis.topProfitCategories}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="category" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => [`$${value}`, 'Profit']} />
                                        <Bar dataKey="profit" fill="#10B981" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Seasonal Trends */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Seasonal Trends</h3>
                            {analyticsData.insights.seasonalTrends.map((trend, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-blue-900">{trend.season}</h4>
                                        <p className="text-sm text-blue-700">{trend.trend}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-blue-900">{Math.round(trend.impact * 100)}%</p>
                                        <p className="text-xs text-blue-600">Impact</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'recommendations' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Recommendations</h3>
                            <div className="space-y-4">
                                {analyticsData.recommendations.map((recommendation, index) => (
                                    <RecommendationCard key={index} recommendation={recommendation} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;