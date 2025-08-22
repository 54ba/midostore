// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    TrendingDown,
    Users,
    ShoppingCart,
    Eye,
    Heart,
    Star,
    Flame,
    BarChart3,
    PieChart,
    Activity,
    Calendar,
    Filter,
    Download
} from 'lucide-react';

interface ProductAnalyticsData {
    totalViews: number;
    totalSales: number;
    conversionRate: number;
    revenue: number;
    topProducts: Array<{
        id: string;
        name: string;
        sales: number;
        revenue: number;
    }>;
}

export default function ProductAnalyticsDashboard() {
    const [analyticsData, setAnalyticsData] = useState<ProductAnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            const response = await fetch('/api/analytics/overview');
            const data = await response.json();
            setAnalyticsData(data.data);
        } catch (error) {
            console.error('Failed to fetch analytics data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Product Analytics Dashboard
                </h2>
                <div className="flex space-x-2">
                    <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </button>
                    <button className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Views
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {analyticsData?.totalViews?.toLocaleString() || '0'}
                            </p>
                        </div>
                        <Eye className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-500">+12.5%</span>
                        <span className="text-gray-600 dark:text-gray-400 ml-1">vs last month</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Sales
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {analyticsData?.totalSales?.toLocaleString() || '0'}
                            </p>
                        </div>
                        <ShoppingCart className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-500">+8.2%</span>
                        <span className="text-gray-600 dark:text-gray-400 ml-1">vs last month</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Conversion Rate
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {analyticsData?.conversionRate?.toFixed(1) || '0'}%
                            </p>
                        </div>
                        <Activity className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        <span className="text-red-500">-2.1%</span>
                        <span className="text-gray-600 dark:text-gray-400 ml-1">vs last month</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Revenue
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                ${analyticsData?.revenue?.toLocaleString() || '0'}
                            </p>
                        </div>
                        <Flame className="w-8 h-8 text-orange-600" />
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-500">+15.3%</span>
                        <span className="text-gray-600 dark:text-gray-400 ml-1">vs last month</span>
                    </div>
                </div>
            </div>

            {/* Top Products */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Top Performing Products
                </h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                                    Product
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                                    Sales
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                                    Revenue
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {analyticsData?.topProducts && Array.isArray(analyticsData.topProducts) ? analyticsData.topProducts.map((product, index) => (
                                <tr key={product.id || `product-${index}`} className="border-b border-gray-100 dark:border-gray-700">
                                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                                        {product.name || 'Unknown Product'}
                                    </td>
                                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                        {(product.sales || 0).toLocaleString()}
                                    </td>
                                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                        ${(product.revenue || 0).toLocaleString()}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-gray-500">
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}