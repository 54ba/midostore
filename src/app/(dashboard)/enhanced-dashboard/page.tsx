"use client";

import React from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import EnhancedDashboard from '@/components/EnhancedDashboard';
import MarketingDashboard from '@/components/MarketingDashboard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function EnhancedDashboardPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    const userId = (user as any)?.id || (user as any)?.userId || (user as any)?.user_id || (user as any)?.userId || (user as any)?.user_id || "anonymous" || 'anonymous';

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900">Enhanced Analytics Hub</h1>
                    <p className="mt-2 text-gray-600">
                        Comprehensive dashboard with crypto payments, real-time pricing, shipping tracking, and AI insights
                    </p>
                </div>

                {/* Enhanced Dashboard */}
                <div className="mb-8">
                    <EnhancedDashboard userId={userId} />
                </div>

                {/* Marketing Dashboard */}
                <div className="mb-8">
                    <MarketingDashboard userId={userId} />
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <a
                            href="/scraping"
                            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-600 font-semibold">🔍</span>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Scrape Products</h3>
                                    <p className="text-sm text-gray-600">Add new crypto and traditional products</p>
                                </div>
                            </div>
                        </a>

                        <button className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <span className="text-green-600 font-semibold">💰</span>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Update Crypto Rates</h3>
                                    <p className="text-sm text-gray-600">Refresh cryptocurrency exchange rates</p>
                                </div>
                            </div>
                        </button>

                        <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <span className="text-purple-600 font-semibold">🚚</span>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Update Shipments</h3>
                                    <p className="text-sm text-gray-600">Refresh tracking information</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Feature Highlights */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                        <h3 className="font-semibold mb-2">🌍 Global Localization</h3>
                        <p className="text-blue-100 text-sm">
                            Support for 15+ languages and 25+ currencies including cryptocurrencies
                        </p>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                        <h3 className="font-semibold mb-2">₿ Crypto Integration</h3>
                        <p className="text-green-100 text-sm">
                            Accept Bitcoin, Ethereum, and other cryptocurrencies with real-time tracking
                        </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                        <h3 className="font-semibold mb-2">📊 Real-time Pricing</h3>
                        <p className="text-purple-100 text-sm">
                            Monitor price changes and volatility with AI-powered alerts
                        </p>
                    </div>

                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
                        <h3 className="font-semibold mb-2">🚚 Smart Shipping</h3>
                        <p className="text-orange-100 text-sm">
                            Multi-carrier tracking with real-time updates and cost optimization
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}