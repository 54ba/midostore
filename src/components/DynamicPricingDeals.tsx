"use client";

import React, { useState, useEffect } from 'react';
import {
    Flame,
    Clock,
    Users,
    TrendingDown,
    ShoppingCart,
    Zap,
    Crown,
    ArrowDown,
    Timer,
    Target,
    BarChart3,
    TrendingUp
} from 'lucide-react';

interface DynamicPricingDeal {
    id: string;
    productId: string;
    title: string;
    image: string;
    category: string;
    basePrice: number;
    currentPrice: number;
    originalPrice: number;
    minPrice: number;
    maxPrice: number;
    currentTier: number;
    totalTiers: number;
    currentBuyers: number;
    targetBuyers: number;
    timeRemaining: string;
    discount: number;
    maxDiscount: number;
    isHotDeal: boolean;
    isLimitedTime: boolean;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    features: string[];
    tierProgress: Array<{
        tier: number;
        buyersRequired: number;
        price: number;
        discount: number;
        isReached: boolean;
        isCurrent: boolean;
    }>;
}

interface DynamicPricingDealsProps {
    className?: string;
    title?: string;
    subtitle?: string;
}

export default function DynamicPricingDeals({
    className = "",
    title = "Dynamic Pricing Deals",
    subtitle = "Products get cheaper as more people buy! Join the collective buying power."
}: DynamicPricingDealsProps) {
    const [deals, setDeals] = useState<DynamicPricingDeal[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDeal, setSelectedDeal] = useState<string | null>(null);

    // Mock data for demonstration
    useEffect(() => {
        const mockDeals: DynamicPricingDeal[] = [
            {
                id: 'deal-1',
                productId: 'prod-1',
                title: 'Wireless Noise-Canceling Headphones Pro',
                image: '/api/placeholder/120/120?text=Headphones',
                category: 'Electronics',
                basePrice: 149.99,
                currentPrice: 89.99,
                originalPrice: 199.99,
                minPrice: 69.99,
                maxPrice: 149.99,
                currentTier: 3,
                totalTiers: 5,
                currentBuyers: 234,
                targetBuyers: 500,
                timeRemaining: '2 days 14 hours',
                discount: 40,
                maxDiscount: 65,
                isHotDeal: true,
                isLimitedTime: true,
                urgency: 'high',
                description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
                features: [
                    'Active Noise Cancellation',
                    '30-hour battery life',
                    'Bluetooth 5.0',
                    'Touch controls',
                    'Premium sound quality'
                ],
                tierProgress: [
                    { tier: 1, buyersRequired: 50, price: 149.99, discount: 25, isReached: true, isCurrent: false },
                    { tier: 2, buyersRequired: 100, price: 129.99, discount: 35, isReached: true, isCurrent: false },
                    { tier: 3, buyersRequired: 200, price: 89.99, discount: 40, isReached: true, isCurrent: true },
                    { tier: 4, buyersRequired: 350, price: 79.99, discount: 50, isReached: false, isCurrent: false },
                    { tier: 5, buyersRequired: 500, price: 69.99, discount: 65, isReached: false, isCurrent: false }
                ]
            },
            {
                id: 'deal-2',
                productId: 'prod-2',
                title: 'Smart Fitness Watch with Health Monitoring',
                image: '/api/placeholder/120/120?text=SmartWatch',
                category: 'Electronics',
                basePrice: 299.99,
                currentPrice: 199.99,
                originalPrice: 349.99,
                minPrice: 149.99,
                maxPrice: 299.99,
                currentTier: 2,
                totalTiers: 4,
                currentBuyers: 156,
                targetBuyers: 300,
                timeRemaining: '1 day 8 hours',
                discount: 33,
                maxDiscount: 57,
                isHotDeal: true,
                isLimitedTime: true,
                urgency: 'critical',
                description: 'Advanced fitness tracking with heart rate monitor, GPS, and sleep tracking.',
                features: [
                    'Heart rate monitoring',
                    'GPS tracking',
                    'Sleep analysis',
                    '7-day battery life',
                    'Water resistant'
                ],
                tierProgress: [
                    { tier: 1, buyersRequired: 75, price: 299.99, discount: 14, isReached: true, isCurrent: false },
                    { tier: 2, buyersRequired: 150, price: 199.99, discount: 33, isReached: true, isCurrent: true },
                    { tier: 3, buyersRequired: 225, price: 179.99, discount: 49, isReached: false, isCurrent: false },
                    { tier: 4, buyersRequired: 300, price: 149.99, discount: 57, isReached: false, isCurrent: false }
                ]
            },
            {
                id: 'deal-3',
                productId: 'prod-3',
                title: 'Organic Anti-Aging Face Cream Set',
                image: '/api/placeholder/120/120?text=FaceCream',
                category: 'Beauty & Health',
                basePrice: 59.99,
                currentPrice: 29.99,
                originalPrice: 79.99,
                minPrice: 19.99,
                maxPrice: 59.99,
                currentTier: 4,
                totalTiers: 5,
                currentBuyers: 456,
                targetBuyers: 600,
                timeRemaining: '3 days 6 hours',
                discount: 50,
                maxDiscount: 75,
                isHotDeal: true,
                isLimitedTime: true,
                urgency: 'medium',
                description: 'Natural anti-aging face cream with organic ingredients and vitamin C.',
                features: [
                    'Organic ingredients',
                    'Vitamin C enriched',
                    'Hyaluronic acid',
                    'Anti-aging formula',
                    'Suitable for all skin types'
                ],
                tierProgress: [
                    { tier: 1, buyersRequired: 100, price: 59.99, discount: 25, isReached: true, isCurrent: false },
                    { tier: 2, buyersRequired: 200, price: 49.99, discount: 38, isReached: true, isCurrent: false },
                    { tier: 3, buyersRequired: 300, price: 39.99, discount: 50, isReached: true, isCurrent: false },
                    { tier: 4, buyersRequired: 450, price: 29.99, discount: 62, isReached: true, isCurrent: true },
                    { tier: 5, buyersRequired: 600, price: 19.99, discount: 75, isReached: false, isCurrent: false }
                ]
            }
        ];

        setTimeout(() => {
            setDeals(mockDeals);
            setLoading(false);
        }, 1000);
    }, []);

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'critical': return 'from-red-500 to-pink-500';
            case 'high': return 'from-orange-500 to-red-500';
            case 'medium': return 'from-yellow-500 to-orange-500';
            case 'low': return 'from-blue-500 to-cyan-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getUrgencyIcon = (urgency: string) => {
        switch (urgency) {
            case 'critical': return <Flame className="w-5 h-5" />;
            case 'high': return <Zap className="w-5 h-5" />;
            case 'medium': return <Clock className="w-5 h-5" />;
            case 'low': return <Target className="w-5 h-5" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    const calculateProgress = (deal: DynamicPricingDeal) => {
        return Math.min((deal.currentBuyers / deal.targetBuyers) * 100, 100);
    };

    if (loading) {
        return (
            <div className={`animate-pulse ${className}`}>
                <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-gray-200 rounded-2xl h-48"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-8 ${className}`}>
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 mb-4">
                    <Flame className="w-4 h-4 mr-2" />
                    <span className="font-semibold">Dynamic Pricing</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
            </div>

            {/* Deals Grid */}
            <div className="space-y-6">
                {deals.map((deal) => (
                    <div
                        key={deal.id}
                        className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 ${selectedDeal === deal.id ? 'ring-2 ring-blue-500' : ''
                            }`}
                    >
                        {/* Deal Header */}
                        <div className={`bg-gradient-to-r ${getUrgencyColor(deal.urgency)} text-white p-6`}>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-3">
                                        {getUrgencyIcon(deal.urgency)}
                                        <span className="text-sm font-medium">
                                            {deal.urgency === 'critical' ? 'Critical Deal' :
                                                deal.urgency === 'high' ? 'Hot Deal' :
                                                    deal.urgency === 'medium' ? 'Good Deal' : 'Regular Deal'}
                                        </span>
                                        {deal.isLimitedTime && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm">
                                                <Clock className="w-3 h-3 mr-1" />
                                                Limited Time
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-bold mb-2">{deal.title}</h3>
                                    <p className="text-white/90 text-sm">{deal.description}</p>
                                </div>

                                <div className="text-right">
                                    <div className="text-4xl font-bold mb-1">
                                        ${deal.currentPrice}
                                    </div>
                                    <div className="text-sm text-white/80">
                                        <span className="line-through">${deal.originalPrice}</span>
                                        <span className="ml-2">-{deal.discount}%</span>
                                    </div>
                                    <div className="text-xs text-white/70 mt-1">
                                        Min: ${deal.minPrice} | Max: ${deal.maxPrice}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Deal Content */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Column - Product Info */}
                                <div className="lg:col-span-1">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <img
                                            src={deal.image}
                                            alt={deal.title}
                                            className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                                        />

                                        <div>
                                            <div className="text-sm text-gray-600 mb-1">{deal.category}</div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-500">Tier {deal.currentTier}/{deal.totalTiers}</span>
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-gray-900 text-sm">Key Features:</h4>
                                        <ul className="space-y-1">
                                            {deal.features.map((feature, index) => (
                                                <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Middle Column - Progress & Tiers */}
                                <div className="lg:col-span-1">
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">Progress to Next Tier</span>
                                            <span className="text-sm text-gray-500">
                                                {deal.currentBuyers}/{deal.targetBuyers} buyers
                                            </span>
                                        </div>

                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                                                style={{ width: `${calculateProgress(deal)}%` }}
                                            ></div>
                                        </div>

                                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                            <span>Current: ${deal.currentPrice}</span>
                                            <span>Next: ${deal.tierProgress.find(t => !t.isReached)?.price || deal.minPrice}</span>
                                        </div>
                                    </div>

                                    {/* Time Remaining */}
                                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Timer className="w-5 h-5 text-orange-600" />
                                            <span className="font-semibold text-orange-800">Time Remaining</span>
                                        </div>
                                        <div className="text-2xl font-bold text-orange-900 mb-1">
                                            {deal.timeRemaining}
                                        </div>
                                        <div className="text-sm text-orange-700">
                                            Don't miss out on this amazing deal!
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Pricing Tiers */}
                                <div className="lg:col-span-1">
                                    <h4 className="font-semibold text-gray-900 mb-4">Pricing Tiers</h4>

                                    <div className="space-y-3">
                                        {deal.tierProgress.map((tier) => (
                                            <div
                                                key={tier.tier}
                                                className={`p-3 rounded-lg border-2 transition-all duration-200 ${tier.isCurrent
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : tier.isReached
                                                        ? 'border-green-300 bg-green-50'
                                                        : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${tier.isCurrent
                                                            ? 'bg-blue-500 text-white'
                                                            : tier.isReached
                                                                ? 'bg-green-500 text-white'
                                                                : 'bg-gray-300 text-gray-600'
                                                            }`}>
                                                            {tier.tier}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {tier.buyersRequired} buyers
                                                        </span>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className={`font-bold ${tier.isCurrent ? 'text-blue-600' : 'text-gray-900'
                                                            }`}>
                                                            ${tier.price}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            -{tier.discount}%
                                                        </div>
                                                    </div>
                                                </div>

                                                {tier.isCurrent && (
                                                    <div className="mt-2 text-xs text-blue-600 font-medium">
                                                        ← Current Tier
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA Button */}
                                    <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                        <div className="flex items-center justify-center space-x-2">
                                            <ShoppingCart className="w-5 h-5" />
                                            <span>Join Deal Now</span>
                                        </div>
                                        <div className="text-sm font-normal mt-1">
                                            Lock in current price: ${deal.currentPrice}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* How It Works */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">How Dynamic Pricing Works</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">1. Join the Deal</h4>
                        <p className="text-gray-600 text-sm">
                            When you join a deal, you're added to the collective buying pool. The more people join, the lower the price gets!
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <TrendingDown className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">2. Price Drops</h4>
                        <p className="text-gray-600 text-sm">
                            As more buyers join, the price automatically decreases through multiple tiers. You lock in the best price available!
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Crown className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">3. Best Deal Wins</h4>
                        <p className="text-gray-600 text-sm">
                            Everyone gets the same final price - the lowest tier reached. It's fair, transparent, and saves everyone money!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}