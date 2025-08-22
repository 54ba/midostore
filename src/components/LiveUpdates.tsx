"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, Package, DollarSign, Users, Clock, Zap } from 'lucide-react';
import { dynamicDataService, DynamicAnalytics } from '@/lib/dynamic-data-service';

interface LiveUpdate {
    id: string;
    type: 'sale' | 'inventory' | 'price' | 'user' | 'product' | 'review';
    message: string;
    value: string | number;
    icon: React.ComponentType<any>;
    color: string;
    timestamp: Date;
}

export default function LiveUpdates() {
    const [updates, setUpdates] = useState<LiveUpdate[]>([]);
    const [analytics, setAnalytics] = useState<DynamicAnalytics | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Load initial data
        loadInitialData();

        // Set up real-time updates
        const updateInterval = setInterval(() => {
            loadLiveUpdates();
            loadAnalytics();
        }, 120000); // Update every 2 minutes

        return () => clearInterval(updateInterval);
    }, []);

    const loadInitialData = async () => {
        try {
            const [liveUpdates, liveAnalytics] = await Promise.all([
                dynamicDataService.getLiveUpdates(10),
                dynamicDataService.getLiveAnalytics()
            ]);

            setUpdates(liveUpdates);
            setAnalytics(liveAnalytics);
            setIsVisible(true);
        } catch (error) {
            console.error('Error loading initial data:', error);
            // Fallback to simulated data
            generateSimulatedUpdates();
        }
    };

    const loadLiveUpdates = async () => {
        try {
            const liveUpdates = await dynamicDataService.getLiveUpdates(10);
            setUpdates(liveUpdates);
        } catch (error) {
            console.error('Error loading live updates:', error);
        }
    };

    const loadAnalytics = async () => {
        try {
            const liveAnalytics = await dynamicDataService.getLiveAnalytics();
            setAnalytics(liveAnalytics);
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    };

    const generateSimulatedUpdates = () => {
        const updateTypes = [
            {
                type: 'sale' as const,
                messages: [
                    'New order placed for',
                    'Product sold:',
                    'Purchase completed:',
                    'Sale recorded:'
                ],
                products: [
                    'Wireless Headphones Pro',
                    'Smart Fitness Watch',
                    'Organic Face Cream',
                    'Educational Building Blocks',
                    'Premium Coffee Maker',
                    'Wireless Charger'
                ],
                icon: TrendingUp,
                color: 'text-green-500'
            },
            {
                type: 'inventory' as const,
                messages: [
                    'Stock updated for',
                    'Inventory refreshed:',
                    'Quantity changed for',
                    'Stock level updated:'
                ],
                products: [
                    'Smart Watch Series',
                    'Bluetooth Speaker',
                    'Kitchen Appliances',
                    'Home Decor Items',
                    'Fitness Equipment',
                    'Tech Accessories'
                ],
                icon: Package,
                color: 'text-blue-500'
            },
            {
                type: 'price' as const,
                messages: [
                    'Price updated for',
                    'New pricing for',
                    'Cost adjusted for',
                    'Price change:'
                ],
                products: [
                    'Premium Electronics',
                    'Fashion Collection',
                    'Home & Garden',
                    'Sports Equipment',
                    'Beauty Products',
                    'Automotive Parts'
                ],
                icon: DollarSign,
                color: 'text-yellow-500'
            },
            {
                type: 'user' as const,
                messages: [
                    'New user registered:',
                    'User logged in:',
                    'Profile updated:',
                    'Account created:'
                ],
                users: [
                    'Ahmed from Dubai',
                    'Fatima from Kuwait',
                    'Omar from Qatar',
                    'Layla from Bahrain',
                    'Khalid from Oman',
                    'Aisha from UAE'
                ],
                icon: Users,
                color: 'text-purple-500'
            }
        ];

        const generateUpdate = (): LiveUpdate => {
            const updateType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
            const message = updateType.messages[Math.floor(Math.random() * updateType.messages.length)];

            let value: string;
            if (updateType.type === 'user') {
                value = updateType.users[Math.floor(Math.random() * updateType.users.length)];
            } else {
                value = updateType.products[Math.floor(Math.random() * updateType.products.length)];
            }

            return {
                id: Date.now().toString(),
                type: updateType.type,
                message,
                value,
                icon: updateType.icon,
                color: updateType.color,
                timestamp: new Date()
            };
        };

        // Initial updates
        const initialUpdates = Array.from({ length: 5 }, () => generateUpdate());
        setUpdates(initialUpdates);
        setIsVisible(true);

        // Generate new updates every 3-8 seconds
        const interval = setInterval(() => {
            const newUpdate = generateUpdate();
            setUpdates(prev => {
                const newUpdates = [newUpdate, ...prev.slice(0, 9)]; // Keep max 10 updates
                return newUpdates;
            });
        }, Math.random() * 5000 + 3000);

        return () => clearInterval(interval);
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);

        if (seconds < 60) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        return `${Math.floor(minutes / 60)}h ago`;
    };

    const getIconComponent = (iconName: string) => {
        const iconMap: Record<string, React.ComponentType<any>> = {
            'Package': Package,
            'Star': TrendingUp,
            'TrendingUp': TrendingUp,
            'Users': Users,
            'DollarSign': DollarSign,
        };
        return iconMap[iconName] || Package;
    };

    return (
        <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 text-emerald-800 dark:text-emerald-400 mb-4">
                        <Zap className="w-4 h-4 mr-2 animate-pulse" />
                        <span className="font-semibold">Live Updates</span>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Real-Time Activity Feed
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Watch as our platform comes alive with real-time updates, live sales, inventory changes,
                        and user activities happening right now.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Live Updates Feed */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-emerald-500" />
                                Live Activity Feed
                            </h3>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Live</span>
                            </div>
                        </div>

                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {updates.map((update, index) => {
                                const IconComponent = typeof update.icon === 'string'
                                    ? getIconComponent(update.icon)
                                    : update.icon;
                                return (
                                    <div
                                        key={update.id}
                                        className={`p-4 rounded-lg border border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 transition-all duration-500 transform ${index === 0 ? 'scale-105 shadow-lg' : 'scale-100'
                                            }`}
                                        style={{
                                            animationDelay: `${index * 100}ms`,
                                            animation: index === 0 ? 'slideInFromTop 0.5s ease-out' : 'none'
                                        }}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-600 ${update.color}`}>
                                                <IconComponent className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {update.message} <span className="font-semibold text-gray-900 dark:text-white">{update.value}</span>
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {formatTime(update.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Live Statistics */}
                    <div className="space-y-6">
                        {/* Sales Counter */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">Total Sales Today</p>
                                    <p className="text-3xl font-bold">
                                        ${analytics ? analytics.totalSales.toLocaleString() : '24,847'}
                                    </p>
                                    <p className="text-green-100 text-sm">
                                        {analytics ? `+${((Math.random() * 20) + 5).toFixed(1)}% from yesterday` : '+12.5% from yesterday'}
                                    </p>
                                </div>
                                <TrendingUp className="w-12 h-12 text-green-200" />
                            </div>
                            <div className="mt-4 w-full bg-green-400/30 rounded-full h-2">
                                <div
                                    className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${analytics ? (analytics.conversionRate / 5) * 100 : 75}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Active Users */}
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">Active Users</p>
                                    <p className="text-3xl font-bold">
                                        {analytics ? analytics.activeUsers.toLocaleString() : '1,247'}
                                    </p>
                                    <p className="text-blue-100 text-sm">
                                        {analytics ? `+${((Math.random() * 15) + 3).toFixed(1)}% from last hour` : '+8.2% from last hour'}
                                    </p>
                                </div>
                                <Users className="w-12 h-12 text-blue-200" />
                            </div>
                            <div className="mt-4 w-full bg-blue-400/30 rounded-full h-2">
                                <div
                                    className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${analytics ? (analytics.activeUsers / 3000) * 100 : 68}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Inventory Status */}
                        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">Products in Stock</p>
                                    <p className="text-3xl font-bold">
                                        {analytics ? analytics.productsInStock.toLocaleString() : '8,492'}
                                    </p>
                                    <p className="text-purple-100 text-sm">
                                        Updated {analytics ? 'just now' : '2 minutes ago'}
                                    </p>
                                </div>
                                <Package className="w-12 h-12 text-purple-200" />
                            </div>
                            <div className="mt-4 w-full bg-purple-400/30 rounded-full h-2">
                                <div
                                    className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${analytics ? (analytics.productsInStock / 10000) * 100 : 92}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes slideInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
        </section>
    );
}