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
    Package,
    Eye,
    Star,
    Plus,
    ArrowRight,
    BarChart3,
    Target,
    Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DashboardStats {
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    conversionRate: number;
    averageOrderValue: number;
    monthlyGrowth: number;
}

interface ProductPerformance {
    id: string;
    name: string;
    sales: number;
    revenue: number;
    views: number;
    rating: number;
    status: 'active' | 'inactive' | 'trending';
}

export default function SellerDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCustomers: 0,
        conversionRate: 0,
        averageOrderValue: 0,
        monthlyGrowth: 0
    });

    const [topProducts, setTopProducts] = useState<ProductPerformance[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Simulate loading data
        setTimeout(() => {
            setStats({
                totalSales: 15420,
                totalOrders: 892,
                totalProducts: 45,
                totalCustomers: 567,
                conversionRate: 3.2,
                averageOrderValue: 89.45,
                monthlyGrowth: 12.5
            });

            setTopProducts([
                {
                    id: '1',
                    name: 'Wireless Bluetooth Headphones',
                    sales: 234,
                    revenue: 18720,
                    views: 1540,
                    rating: 4.8,
                    status: 'trending'
                },
                {
                    id: '2',
                    name: 'Smart Fitness Watch',
                    sales: 189,
                    revenue: 15120,
                    views: 1230,
                    rating: 4.6,
                    status: 'active'
                },
                {
                    id: '3',
                    name: 'Portable Power Bank',
                    sales: 156,
                    revenue: 12480,
                    views: 980,
                    rating: 4.7,
                    status: 'active'
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const handleAddProduct = () => {
        router.push('/seller/products/add');
    };

    const handleViewAnalytics = () => {
        router.push('/seller/analytics');
    };

    const handleManageInventory = () => {
        router.push('/seller/products');
    };

    const handleCustomerSupport = () => {
        router.push('/seller/customers');
    };

    const handleViewProductDetails = (productId: string) => {
        router.push(`/seller/products/${productId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading your dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
                    <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your business today.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Sales</p>
                                            <p className="text-2xl font-bold text-gray-900">${stats.totalSales.toLocaleString()}</p>
                                        </div>
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <DollarSign className="h-5 w-5 text-green-600" />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm">
                                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                        <span className="text-green-600">+{stats.monthlyGrowth}%</span>
                                        <span className="text-gray-500 ml-1">from last month</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                                        </div>
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <ShoppingCart className="h-5 w-5 text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm">
                                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                        <span className="text-green-600">+8.2%</span>
                                        <span className="text-gray-500 ml-1">from last month</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Products</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                                        </div>
                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                            <Package className="h-5 w-5 text-purple-600" />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm">
                                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                        <span className="text-green-600">+3</span>
                                        <span className="text-gray-500 ml-1">new this month</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Customers</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                                        </div>
                                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                            <Users className="h-5 w-5 text-orange-600" />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm">
                                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                        <span className="text-green-600">+12.5%</span>
                                        <span className="text-gray-500 ml-1">from last month</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Top Performing Products */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Performing Products</CardTitle>
                                <CardDescription>Your best-selling products this month</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topProducts.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    <Package className="h-6 w-6 text-gray-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                        <span>{product.views} views</span>
                                                        <div className="flex items-center space-x-1">
                                                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                            <span>{product.rating}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium text-gray-900">${product.revenue.toLocaleString()}</div>
                                                <div className="text-sm text-gray-500">{product.sales} sales</div>
                                                <Badge
                                                    variant={product.status === 'trending' ? 'default' : 'secondary'}
                                                    className="mt-1"
                                                >
                                                    {product.status}
                                                </Badge>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewProductDetails(product.id)}
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                View
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions & Insights */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>Common tasks and shortcuts</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={handleAddProduct}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Product
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={handleViewAnalytics}
                                >
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    View Analytics
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={handleManageInventory}
                                >
                                    <Package className="mr-2 h-4 w-4" />
                                    Manage Inventory
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={handleCustomerSupport}
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    Customer Support
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Performance Insights */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Performance Insights</CardTitle>
                                <CardDescription>Key metrics and trends</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Avg Order Value</span>
                                    <span className="font-medium">${stats.averageOrderValue}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Total Customers</span>
                                    <span className="font-medium">{stats.totalCustomers}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Monthly Growth</span>
                                    <span className="font-medium text-green-600">+{stats.monthlyGrowth}%</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tips & Recommendations */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Tips & Recommendations</CardTitle>
                                <CardDescription>AI-powered insights</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-start space-x-2">
                                        <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
                                        <div className="text-sm">
                                            <p className="font-medium text-blue-900">Optimize Pricing</p>
                                            <p className="text-blue-700">Consider reducing prices for products with low conversion rates</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-start space-x-2">
                                        <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                                        <div className="text-sm">
                                            <p className="font-medium text-green-900">Trending Category</p>
                                            <p className="text-green-700">Electronics category is showing 25% growth this month</p>
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