"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    BarChart3,
    TrendingUp,
    Users,
    DollarSign,
    ShoppingCart,
    Loader2,
    RefreshCw,
    AlertCircle,
    Package,
    Star,
    Calendar
} from 'lucide-react';

interface AnalyticsData {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    conversionRate: number;
    topProducts: Array<{
        name: string;
        sales: number;
        revenue: number;
    }>;
    recentActivity: Array<{
        type: string;
        message: string;
        timestamp: string;
    }>;
}

export default function AnalyticsOverviewPage() {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/analytics/overview');
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setAnalyticsData(data.data);
                } else {
                    throw new Error(data.error || 'Failed to fetch analytics data');
                }
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching analytics data:', error);
            setError('Failed to load analytics data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const refreshData = async () => {
        setRefreshing(true);
        await fetchAnalyticsData();
        setRefreshing(false);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'order':
                return <ShoppingCart className="h-4 w-4 text-blue-600" />;
            case 'payment':
                return <DollarSign className="h-4 w-4 text-green-600" />;
            case 'customer':
                return <Users className="h-4 w-4 text-purple-600" />;
            default:
                return <Calendar className="h-4 w-4 text-gray-600" />;
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="text-center py-12">
                    <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading analytics data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Analytics</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={fetchAnalyticsData} className="bg-blue-600 hover:bg-blue-700">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    if (!analyticsData) {
        return (
            <div className="space-y-6">
                <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
                    <p className="text-gray-600">No analytics data available at the moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analytics Overview</h1>
                    <p className="text-gray-600">Comprehensive business intelligence dashboard</p>
                </div>
                <Button
                    onClick={refreshData}
                    disabled={refreshing}
                    variant="outline"
                    size="sm"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(analyticsData.totalRevenue)}</div>
                        <p className="text-xs text-green-600">+20.1% from last month</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatNumber(analyticsData.totalOrders)}</div>
                        <p className="text-xs text-blue-600">+180.1% from last month</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                        <BarChart3 className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(analyticsData.averageOrderValue)}</div>
                        <p className="text-xs text-purple-600">+19% from last month</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analyticsData.conversionRate}%</div>
                        <p className="text-xs text-orange-600">+2.1% from last month</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Top Performing Products
                        </CardTitle>
                        <CardDescription>
                            Best selling products by revenue
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analyticsData.topProducts.map((product, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{product.name}</p>
                                            <p className="text-sm text-gray-600">{product.sales} sales</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">{formatCurrency(product.revenue)}</p>
                                        <p className="text-xs text-gray-500">
                                            {((product.revenue / analyticsData.totalRevenue) * 100).toFixed(1)}% of total
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Recent Activity
                        </CardTitle>
                        <CardDescription>
                            Latest business activities and events
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {analyticsData.recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="mt-1">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900">{activity.message}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(activity.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Summary */}
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                    <CardDescription>
                        Key insights and recommendations for business growth
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <TrendingUp className="h-6 w-6 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Revenue Growth</h4>
                            <p className="text-sm text-gray-600">
                                Your revenue is growing steadily. Consider expanding your product catalog to accelerate growth.
                            </p>
                        </div>

                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <ShoppingCart className="h-6 w-6 text-green-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Order Volume</h4>
                            <p className="text-sm text-gray-600">
                                High order volume indicates strong customer demand. Focus on customer retention strategies.
                            </p>
                        </div>

                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Customer Engagement</h4>
                            <p className="text-sm text-gray-600">
                                Active customer base shows good engagement. Implement loyalty programs to boost retention.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                        Common analytics tasks and reports
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" size="sm">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Generate Report
                        </Button>
                        <Button variant="outline" size="sm">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            View Trends
                        </Button>
                        <Button variant="outline" size="sm">
                            <Package className="mr-2 h-4 w-4" />
                            Product Analysis
                        </Button>
                        <Button variant="outline" size="sm">
                            <Users className="mr-2 h-4 w-4" />
                            Customer Insights
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}