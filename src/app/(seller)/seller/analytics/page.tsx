"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    Eye,
    Star,
    Calendar,
    BarChart3
} from 'lucide-react';

interface AnalyticsData {
    period: string;
    revenue: number;
    orders: number;
    customers: number;
    conversionRate: number;
    averageOrderValue: number;
    topProducts: Array<{
        name: string;
        sales: number;
        revenue: number;
        growth: number;
    }>;
    trafficSources: Array<{
        source: string;
        visitors: number;
        conversionRate: number;
    }>;
}

export default function SellerAnalyticsPage() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('30d');

    useEffect(() => {
        // Simulate loading analytics data
        setTimeout(() => {
            setAnalytics({
                period: 'Last 30 Days',
                revenue: 15420,
                orders: 892,
                customers: 567,
                conversionRate: 3.2,
                averageOrderValue: 89.45,
                topProducts: [
                    { name: 'Wireless Bluetooth Headphones', sales: 234, revenue: 18720, growth: 12.5 },
                    { name: 'Smart Fitness Watch', sales: 189, revenue: 15120, growth: 8.2 },
                    { name: 'Portable Power Bank', sales: 156, revenue: 12480, growth: 15.7 }
                ],
                trafficSources: [
                    { source: 'Direct', visitors: 2450, conversionRate: 4.2 },
                    { source: 'Organic Search', visitors: 1890, conversionRate: 2.8 },
                    { source: 'Social Media', visitors: 1230, conversionRate: 3.1 },
                    { source: 'Referral', visitors: 890, conversionRate: 3.8 }
                ]
            });
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (!analytics) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                            <p className="text-gray-600 mt-1">Detailed insights into your business performance</p>
                        </div>
                        <div className="flex space-x-2">
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                                <option value="90d">Last 90 Days</option>
                                <option value="1y">Last Year</option>
                            </select>
                            <Button variant="outline">
                                <Calendar className="mr-2 h-4 w-4" />
                                Export Report
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${analytics.revenue.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                                +12.5% from last period
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.orders.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                                +8.2% from last period
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                            <Users className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.customers.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                                +15.3% from last period
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                            <BarChart3 className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                                +0.5% from last period
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Analytics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Performing Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Performing Products</CardTitle>
                            <CardDescription>Your best-selling products this period</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analytics.topProducts.map((product, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm font-bold text-blue-600">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{product.name}</h4>
                                                <p className="text-sm text-gray-500">{product.sales} sales</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium text-gray-900">${product.revenue.toLocaleString()}</div>
                                            <div className="text-sm text-green-600 flex items-center">
                                                <TrendingUp className="h-3 w-3 mr-1" />
                                                +{product.growth}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Traffic Sources */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Traffic Sources</CardTitle>
                            <CardDescription>Where your visitors come from</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analytics.trafficSources.map((source, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Eye className="h-4 w-4 text-gray-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{source.source}</h4>
                                                <p className="text-sm text-gray-500">{source.visitors.toLocaleString()} visitors</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium text-gray-900">{source.conversionRate}%</div>
                                            <div className="text-sm text-gray-500">conversion</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Performance Chart Placeholder */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Revenue Trend</CardTitle>
                        <CardDescription>Revenue performance over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">Chart visualization would go here</p>
                                <p className="text-sm text-gray-400">Revenue trends, order volume, customer growth</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}