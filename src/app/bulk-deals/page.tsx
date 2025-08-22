"use client";

import React from 'react';
import { useAuthBridge } from '@/app/contexts/AuthContext';
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">🚀 Bulk Pricing Deals</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
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

                {/* Bulk Pricing Component will be added back later */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Available Bulk Deals</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Bulk pricing deals will be displayed here. The BulkPricingDeals component will be integrated once the routing issue is resolved.
                    </p>
                </div>
            </div>
        </div>
    );
}