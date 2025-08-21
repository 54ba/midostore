"use client";

import React from 'react';
import { useAuthBridge } from '@/app/contexts/AuthContext';
import BulkPricingDeals from '@/components/BulkPricingDeals';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function BulkDealsPage() {
    const { user, loading } = useAuthBridge();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900">🚀 Bulk Pricing Deals</h1>
                    <p className="mt-2 text-gray-600">
                        Join the collective buying power! The more people buy, the lower the price gets.
                    </p>
                </div>

                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white rounded-lg p-8 mb-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">
                            Factory Direct Pricing Through Collective Buying
                        </h2>
                        <p className="text-xl mb-6 text-blue-100">
                            Similar to Alibaba's factory pricing model, we unlock massive discounts when enough people join together to buy in bulk.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-2">3</div>
                                <div className="text-blue-100">Products at $2 each</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-2">10</div>
                                <div className="text-blue-100">Products at $1 each</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-2">100+</div>
                                <div className="text-blue-100">Products at $0.50 each</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bulk Pricing Deals */}
                <BulkPricingDeals />

                {/* How It Works */}
                <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How Our Bulk Pricing System Works</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Process */}
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                    1
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Product Selection</h3>
                                    <p className="text-gray-600 text-sm">
                                        We identify high-demand products that can benefit from bulk pricing and factory direct sourcing.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                    2
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Tier Setup</h3>
                                    <p className="text-gray-600 text-sm">
                                        Create pricing tiers based on quantity thresholds. Each tier unlocks deeper discounts.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                    3
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Collective Buying</h3>
                                    <p className="text-gray-600 text-sm">
                                        Users join deals by placing orders. As more people join, we get closer to the next pricing tier.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                    4
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Price Unlocking</h3>
                                    <p className="text-gray-600 text-sm">
                                        When a tier threshold is reached, all participants get the lower price automatically.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                    5
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Factory Order</h3>
                                    <p className="text-gray-600 text-sm">
                                        We place the bulk order with the factory and ship directly to all participants.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Example */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Example: Wireless Headphones</h3>

                            <div className="space-y-4">
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-900">Tier 1: 1-9 units</span>
                                        <span className="text-gray-500 text-sm">Base Price</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-gray-900">$29.99</span>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">0% off</span>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-4 border border-green-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-900">Tier 2: 10-49 units</span>
                                        <span className="text-green-600 text-sm">Active Now!</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-green-600">$25.49</span>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">15% off</span>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        Progress: 32/50 orders (64% filled)
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-4 border border-blue-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-900">Tier 3: 50-99 units</span>
                                        <span className="text-blue-600 text-sm">Next Tier</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-blue-600">$22.49</span>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">25% off</span>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        Need 18 more units to unlock
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-4 border border-purple-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-900">Tier 4: 100+ units</span>
                                        <span className="text-purple-600 text-sm">Maximum Savings</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-purple-600">$19.49</span>
                                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">35% off</span>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        Factory direct pricing unlocked
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Massive Savings</h3>
                        <p className="text-gray-600 text-sm">
                            Save up to 60% or more when buying in bulk compared to individual retail prices.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Collective Power</h3>
                        <p className="text-gray-600 text-sm">
                            Join forces with other buyers to unlock factory direct pricing that's impossible alone.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Risk-Free</h3>
                        <p className="text-gray-600 text-sm">
                            Only pay when the deal threshold is reached. No commitment until the price is unlocked.
                        </p>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>

                    <div className="space-y-6 max-w-3xl mx-auto">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">How does the pricing work?</h3>
                            <p className="text-gray-600 text-sm">
                                We set up quantity-based pricing tiers. As more people join a deal, we get closer to unlocking the next tier with even lower prices. All participants get the lowest unlocked price.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">What happens if a tier isn't reached?</h3>
                            <p className="text-gray-600 text-sm">
                                If a deal doesn't reach the next tier threshold, all participants still get the current tier price. You can choose to wait for more people to join or proceed with the current price.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">How long do deals last?</h3>
                            <p className="text-gray-600 text-sm">
                                Each pricing tier has a time limit. Hot deals (80%+ filled) may have shorter time limits to create urgency. You'll see countdown timers for expiring deals.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Can I cancel my order?</h3>
                            <p className="text-gray-600 text-sm">
                                You can cancel your order before the deal threshold is reached. Once a tier is unlocked, orders are confirmed and cannot be cancelled as we place the factory order.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">When will I receive my order?</h3>
                            <p className="text-gray-600 text-sm">
                                After a deal threshold is reached, we place the factory order. Delivery typically takes 2-4 weeks for factory direct orders, but you get the best possible price.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Import icons
import { TrendingUp, Users, CheckCircle } from 'lucide-react';