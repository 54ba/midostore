"use client";

import React, { useState, useEffect } from 'react';
import {
    ArrowRight,
    CheckCircle,
    Clock,
    Flame, // Changed from Fire to Flame
    ShoppingCart,
    Timer,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';

interface BulkPricingDealsProps {
    className?: string;
}

interface ProductBulkPricing {
    productId: string;
    productTitle: string;
    basePrice: number;
    currency: string;
    currentTier: any;
    nextTier: any;
    totalOrders: number;
    totalQuantity: number;
    timeToNextTier: number;
    isHotDeal: boolean;
    dealProgress: number;
}

export default function BulkPricingDeals({ className = '' }: BulkPricingDealsProps) {
    const [deals, setDeals] = useState<ProductBulkPricing[]>([]);
    const [hotDeals, setHotDeals] = useState<ProductBulkPricing[]>([]);
    const [expiringDeals, setExpiringDeals] = useState<ProductBulkPricing[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        fetchDeals();
        const interval = setInterval(fetchDeals, 180000); // Update every 3 minutes
        return () => clearInterval(interval);
    }, []);

    const fetchDeals = async () => {
        try {
            setLoading(true);

            const [allDealsRes, hotDealsRes, expiringDealsRes] = await Promise.all([
                fetch('/api/bulk-pricing?action=active-pricing'),
                fetch('/api/bulk-pricing?action=hot-deals'),
                fetch('/api/bulk-pricing?action=expiring-deals'),
            ]);

            if (allDealsRes.ok) {
                const data = await allDealsRes.json();
                if (data.success) setDeals(data.data);
            }

            if (hotDealsRes.ok) {
                const data = await hotDealsRes.json();
                if (data.success) setHotDeals(data.data);
            }

            if (expiringDealsRes.ok) {
                const data = await expiringDealsRes.json();
                if (data.success) setExpiringDeals(data.data);
            }

        } catch (error) {
            console.error('Error fetching deals:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds: number): string => {
        if (seconds <= 0) return 'Expired';

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const getProgressColor = (progress: number): string => {
        if (progress >= 90) return 'bg-red-500';
        if (progress >= 75) return 'bg-orange-500';
        if (progress >= 50) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const renderDealCard = (deal: ProductBulkPricing) => (
        <div key={deal.productId} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            {/* Deal Header */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
                        {deal.productTitle}
                    </h3>
                    <div className="flex items-center gap-2">
                        {deal.isHotDeal && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                <Flame className="w-3 h-3" />
                                Hot Deal
                            </div>
                        )}
                        {deal.timeToNextTier > 0 && deal.timeToNextTier < 3600 && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                                <Timer className="w-3 h-3" />
                                Expiring
                            </div>
                        )}
                    </div>
                </div>

                {/* Price Comparison */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl font-bold text-green-600">
                        {deal.currentTier ? formatCurrency(deal.currentTier.price, deal.currency) : formatCurrency(deal.basePrice, deal.currency)}
                    </div>
                    {deal.currentTier && (
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 line-through">
                                {formatCurrency(deal.basePrice, deal.currency)}
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                                -{deal.currentTier.discount}%
                            </span>
                        </div>
                    )}
                </div>

                {/* Current Tier Info */}
                {deal.currentTier && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-blue-700 font-medium">
                                Current Tier: {deal.currentTier.minQuantity}+ units
                            </span>
                            <span className="text-blue-600">
                                {deal.currentTier.currentOrders}/{deal.currentTier.maxOrders} orders
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                            <div
                                className={`h-2 rounded-full ${getProgressColor(deal.dealProgress)} transition-all duration-300`}
                                style={{ width: `${deal.dealProgress}%` }}
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs text-blue-600 mt-1">
                            <span>{deal.totalQuantity} units ordered</span>
                            <span>{deal.dealProgress.toFixed(0)}% filled</span>
                        </div>
                    </div>
                )}

                {/* Next Tier Info */}
                {deal.nextTier && (
                    <div className="bg-orange-50 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-orange-700 font-medium">
                                Next Tier: {deal.nextTier.minQuantity}+ units
                            </span>
                            <span className="text-orange-600">
                                {formatCurrency(deal.nextTier.price, deal.currency)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-orange-600 mt-1">
                            <span>
                                Need {deal.nextTier.minQuantity - deal.totalQuantity} more units
                            </span>
                            {deal.timeToNextTier > 0 && (
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatTime(deal.timeToNextTier)}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Deal Footer */}
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {deal.totalOrders} orders
                        </div>
                        <div className="flex items-center gap-1">
                            <ShoppingCart className="w-4 h-4" />
                            {deal.totalQuantity} units
                        </div>
                    </div>

                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
                        <TrendingUp className="w-4 h-4" />
                        Join Deal
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
            {/* Header */}
            <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                            Bulk Pricing Deals
                        </h2>
                        <p className="text-gray-600 mt-1">
                            The more people buy, the lower the price gets! Join the collective buying power.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                                {deals.length}
                            </div>
                            <div className="text-sm text-gray-600">Active Deals</div>
                        </div>

                        <button
                            onClick={fetchDeals}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                        >
                            <Zap className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-1 mt-6">
                    {[
                        { id: 'all', label: 'All Deals', count: deals.length, icon: TrendingUp },
                        { id: 'hot', label: 'Hot Deals', count: hotDeals.length, icon: Flame },
                        { id: 'expiring', label: 'Expiring Soon', count: expiringDeals.length, icon: Clock },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-green-100 text-green-700'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeTab === 'all' && (
                    <div className="space-y-6">
                        {deals.length === 0 ? (
                            <div className="text-center py-12">
                                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Deals</h3>
                                <p className="text-gray-600">Check back later for new bulk pricing opportunities!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {deals.map(renderDealCard)}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'hot' && (
                    <div className="space-y-6">
                        {hotDeals.length === 0 ? (
                            <div className="text-center py-12">
                                <Flame className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Hot Deals Right Now</h3>
                                <p className="text-gray-600">Hot deals appear when tiers are 80%+ filled!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {hotDeals.map(renderDealCard)}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'expiring' && (
                    <div className="space-y-6">
                        {expiringDeals.length === 0 ? (
                            <div className="text-center py-12">
                                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Expiring Deals</h3>
                                <p className="text-gray-600">All current deals have plenty of time remaining!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {expiringDeals.map(renderDealCard)}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* How It Works */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">How Bulk Pricing Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">1. Join the Deal</h4>
                        <p className="text-sm text-gray-600">
                            Place your order to contribute to the collective quantity
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">2. Price Drops</h4>
                        <p className="text-sm text-gray-600">
                            As more people join, prices automatically decrease
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <CheckCircle className="w-6 h-6 text-purple-600" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">3. Everyone Wins</h4>
                        <p className="text-sm text-gray-600">
                            All participants get the lowest price when threshold is reached
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}