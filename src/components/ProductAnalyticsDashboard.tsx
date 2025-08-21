"use client";

import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingBag,
    Eye,
    Heart,
    Star,
    Clock,
    Fire,
    Zap,
    Crown,
    Target,
    BarChart3,
    PieChart,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Users,
    Package,
    Flame
} from 'lucide-react';

interface ProductAnalytics {
    totalProducts: number;
    activeProducts: number;
    totalSales: number;
    totalRevenue: number;
    averageRating: number;
    totalReviews: number;
    conversionRate: number;
    topCategories: Array<{
        name: string;
        count: number;
        revenue: number;
        growth: number;
    }>;
    trendingProducts: Array<{
        id: string;
        title: string;
        image: string;
        price: number;
        originalPrice: number;
        sales: number;
        revenue: number;
        rating: number;
        reviewCount: number;
        growth: number;
        isHotDeal: boolean;
        discount: number;
        timeRemaining?: string;
    }>;
    salesData: Array<{
        date: string;
        sales: number;
        revenue: number;
        orders: number;
    }>;
    priceChanges: Array<{
        productId: string;
        title: string;
        oldPrice: number;
        newPrice: number;
        changePercent: number;
        isDecrease: boolean;
        timestamp: Date;
    }>;
    inventoryAlerts: Array<{
        productId: string;
        title: string;
        currentStock: number;
        minStock: number;
        status: 'low' | 'out' | 'restocked';
        urgency: 'low' | 'medium' | 'high';
    }>;
}

interface ProductAnalyticsDashboardProps {
    className?: string;
}

export default function ProductAnalyticsDashboard({ className = "" }: ProductAnalyticsDashboardProps) {
    const [analytics, setAnalytics] = useState<ProductAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Mock data for demonstration
    useEffect(() => {
        const mockAnalytics: ProductAnalytics = {
            totalProducts: 1247,
            activeProducts: 1189,
            totalSales: 15678,
            totalRevenue: 2345678.90,
            averageRating: 4.6,
            totalReviews: 45678,
            conversionRate: 3.2,
            topCategories: [
                { name: 'Electronics', count: 324, revenue: 890456.78, growth: 12.5 },
                { name: 'Beauty & Health', count: 289, revenue: 567890.12, growth: 8.7 },
                { name: 'Toys & Games', count: 234, revenue: 345678.90, growth: 15.3 },
                { name: 'Home & Garden', count: 198, revenue: 234567.89, growth: 6.2 },
                { name: 'Fashion', count: 156, revenue: 123456.78, growth: 9.8 }
            ],
            trendingProducts: [
                {
                    id: 'prod-1',
                    title: 'Wireless Noise-Canceling Headphones Pro',
                    image: '/api/placeholder/80/80?text=Headphones',
                    price: 89.99,
                    originalPrice: 149.99,
                    sales: 234,
                    revenue: 21066.66,
                    rating: 4.8,
                    reviewCount: 1247,
                    growth: 23.4,
                    isHotDeal: true,
                    discount: 40
                },
                {
                    id: 'prod-2',
                    title: 'Smart Fitness Watch with Health Monitoring',
                    image: '/api/placeholder/80/80?text=SmartWatch',
                    price: 199.99,
                    originalPrice: 299.99,
                    sales: 189,
                    revenue: 37798.11,
                    rating: 4.6,
                    reviewCount: 892,
                    growth: 18.7,
                    isHotDeal: true,
                    discount: 33
                },
                {
                    id: 'prod-3',
                    title: 'Organic Anti-Aging Face Cream Set',
                    image: '/api/placeholder/80/80?text=FaceCream',
                    price: 29.99,
                    originalPrice: 59.99,
                    sales: 567,
                    revenue: 17006.33,
                    rating: 4.9,
                    reviewCount: 2156,
                    growth: 31.2,
                    isHotDeal: true,
                    discount: 50
                },
                {
                    id: 'prod-4',
                    title: 'Educational STEM Building Blocks Kit',
                    image: '/api/placeholder/80/80?text=BuildingBlocks',
                    price: 45.99,
                    originalPrice: 79.99,
                    sales: 234,
                    revenue: 10761.66,
                    rating: 4.7,
                    reviewCount: 678,
                    growth: 16.8,
                    isHotDeal: false,
                    discount: 42
                }
            ],
            salesData: [
                { date: '2024-01-01', sales: 234, revenue: 45678.90, orders: 189 },
                { date: '2024-01-02', sales: 289, revenue: 56789.12, orders: 234 },
                { date: '2024-01-03', sales: 345, revenue: 67890.23, orders: 289 },
                { date: '2024-01-04', sales: 298, revenue: 54321.45, orders: 245 },
                { date: '2024-01-05', sales: 456, revenue: 89012.67, orders: 378 },
                { date: '2024-01-06', sales: 523, revenue: 98765.43, orders: 456 },
                { date: '2024-01-07', sales: 478, revenue: 87654.32, orders: 412 }
            ],
            priceChanges: [
                {
                    productId: 'prod-1',
                    title: 'Wireless Headphones',
                    oldPrice: 149.99,
                    newPrice: 89.99,
                    changePercent: -40,
                    isDecrease: true,
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
                },
                {
                    productId: 'prod-2',
                    title: 'Smart Watch',
                    oldPrice: 299.99,
                    newPrice: 199.99,
                    changePercent: -33,
                    isDecrease: true,
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4)
                }
            ],
            inventoryAlerts: [
                {
                    productId: 'prod-3',
                    title: 'Face Cream',
                    currentStock: 5,
                    minStock: 10,
                    status: 'low',
                    urgency: 'high'
                },
                {
                    productId: 'prod-4',
                    title: 'Building Blocks',
                    currentStock: 0,
                    minStock: 15,
                    status: 'out',
                    urgency: 'high'
                }
            ]
        };

        setTimeout(() => {
            setAnalytics(mockAnalytics);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <div className={`animate-pulse ${className}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-200 rounded-2xl h-32"></div>
                    ))}
                </div>
                <div className="bg-gray-200 rounded-2xl h-96"></div>
            </div>
        );
    }

    if (!analytics) return null;

    return (
        <div className={`space-y-8 ${className}`}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Product Analytics Dashboard</h2>
                    <p className="text-gray-600 mt-2">Real-time insights into your product performance, sales, and deals</p>
                </div>

                <div className="flex items-center space-x-4">
                    <select
                        value={selectedTimeframe}
                        onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                    </select>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Categories</option>
                        {analytics.topCategories.map(cat => (
                            <option key={cat.name} value={cat.name.toLowerCase()}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Products</p>
                            <p className="text-3xl font-bold text-gray-900">{analytics.totalProducts.toLocaleString()}</p>
                            <p className="text-sm text-green-600 mt-1">
                                <ArrowUpRight className="inline w-4 h-4" />
                                +{analytics.activeProducts} active
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Sales</p>
                            <p className="text-3xl font-bold text-gray-900">{analytics.totalSales.toLocaleString()}</p>
                            <p className="text-sm text-green-600 mt-1">
                                <ArrowUpRight className="inline w-4 h-4" />
                                +{analytics.conversionRate}% conversion
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-3xl font-bold text-gray-900">${(analytics.totalRevenue / 1000000).toFixed(1)}M</p>
                            <p className="text-sm text-green-600 mt-1">
                                <ArrowUpRight className="inline w-4 h-4" />
                                +12.5% vs last period
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Average Rating</p>
                            <p className="text-3xl font-bold text-gray-900">{analytics.averageRating}</p>
                            <p className="text-sm text-gray-600 mt-1">
                                {analytics.totalReviews.toLocaleString()} reviews
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                            <Star className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Trending Products & Hot Deals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Trending Products */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Trending Products</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span>High Growth</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {analytics.trendingProducts.map((product) => (
                            <div key={product.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                                        {product.title}
                                    </h4>

                                    <div className="flex items-center space-x-4 text-sm">
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="text-gray-600">{product.rating}</span>
                                            <span className="text-gray-400">({product.reviewCount})</span>
                                        </div>

                                        <span className="text-gray-500">
                                            {product.sales} sold
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="text-lg font-bold text-gray-900">
                                            ${product.price}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-sm text-gray-500 line-through">
                                                ${product.originalPrice}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        {product.isHotDeal && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-red-500">
                                                <Flame className="w-3 h-3 mr-1" />
                                                Hot Deal
                                            </span>
                                        )}

                                        <span className="text-sm text-green-600 font-medium">
                                            +{product.growth}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Changes & Inventory Alerts */}
                <div className="space-y-6">
                    {/* Price Changes */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Recent Price Changes</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Zap className="w-4 h-4 text-yellow-500" />
                                <span>Dynamic Pricing</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {analytics.priceChanges.map((change) => (
                                <div key={change.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                                            {change.title}
                                        </h4>
                                        <div className="flex items-center space-x-3 text-sm">
                                            <span className="text-gray-500">
                                                {change.timestamp.toLocaleTimeString()}
                                            </span>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-gray-500">
                                                {change.timestamp.toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-500 line-through">
                                                ${change.oldPrice}
                                            </span>
                                            <span className="text-lg font-bold text-gray-900">
                                                ${change.newPrice}
                                            </span>
                                        </div>

                                        <div className={`flex items-center space-x-1 text-sm font-medium ${change.isDecrease ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {change.isDecrease ? (
                                                <ArrowDownRight className="w-4 h-4" />
                                            ) : (
                                                <ArrowUpRight className="w-4 h-4" />
                                            )}
                                            <span>{change.changePercent}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Inventory Alerts */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Inventory Alerts</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Target className="w-4 h-4 text-red-500" />
                                <span>Stock Management</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {analytics.inventoryAlerts.map((alert) => (
                                <div key={alert.productId} className={`p-4 rounded-lg border-l-4 ${alert.urgency === 'high'
                                    ? 'bg-red-50 border-red-500'
                                    : alert.urgency === 'medium'
                                        ? 'bg-yellow-50 border-yellow-500'
                                        : 'bg-blue-50 border-blue-500'
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 text-sm mb-1">
                                                {alert.title}
                                            </h4>
                                            <div className="flex items-center space-x-4 text-sm">
                                                <span className="text-gray-600">
                                                    Stock: {alert.currentStock}/{alert.minStock}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${alert.status === 'out'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {alert.status === 'out' ? 'Out of Stock' : 'Low Stock'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={`w-3 h-3 rounded-full ${alert.urgency === 'high'
                                            ? 'bg-red-500'
                                            : alert.urgency === 'medium'
                                                ? 'bg-yellow-500'
                                                : 'bg-blue-500'
                                            }`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Performance */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Category Performance</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <BarChart3 className="w-4 h-4 text-blue-500" />
                        <span>Revenue Analysis</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {analytics.topCategories.map((category) => (
                        <div key={category.name} className="text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                            <h4 className="font-semibold text-gray-900 mb-2">{category.name}</h4>
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                                {category.count}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">products</div>
                            <div className="text-lg font-bold text-green-600 mb-1">
                                ${(category.revenue / 1000).toFixed(0)}K
                            </div>
                            <div className="text-sm text-gray-500">revenue</div>
                            <div className={`text-sm font-medium mt-2 ${category.growth > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {category.growth > 0 ? '+' : ''}{category.growth}% growth
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}