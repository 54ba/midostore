"use client";

import React, { useState, useEffect } from 'react';
import {
    Clock,
    Zap,
    Users,
    TrendingDown,
    ShoppingCart,
    Flame,
    Crown,
    Target,
    BarChart3,
    Timer,
    Package,
    Truck,
    ArrowUp,
    ArrowDown,
    CheckCircle,
    AlertCircle,
    Info,
    Play,
    Pause,
    FastForward
} from 'lucide-react';

interface OrderBatch {
    id: string;
    productId: string;
    productTitle: string;
    productImage: string;
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
        estimatedTime: string;
        deliverySpeed: 'fast' | 'medium' | 'slow';
    }>;
    orderBatches: Array<{
        id: string;
        name: string;
        description: string;
        price: number;
        discount: number;
        deliveryTime: string;
        deliverySpeed: 'fast' | 'medium' | 'slow';
        buyersRequired: number;
        currentBuyers: number;
        status: 'forming' | 'ready' | 'processing' | 'shipped';
        estimatedShipDate: Date;
        estimatedDeliveryDate: Date;
        isRecommended: boolean;
        savings: number;
        urgency: 'low' | 'medium' | 'high';
    }>;
}

interface OrderBatchingSystemProps {
    className?: string;
    title?: string;
    subtitle?: string;
}

export default function OrderBatchingSystem({
    className = "",
    title = "Smart Order Batching System",
    subtitle = "Choose your delivery speed and price: Fast delivery at higher cost or wait for better prices with collective buying power"
}: OrderBatchingSystemProps) {
    const [batches, setBatches] = useState<OrderBatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
    const [userOrders, setUserOrders] = useState<Record<string, string>>({});

    // Mock data for demonstration
    useEffect(() => {
        const mockBatches: OrderBatch[] = [
            {
                id: 'batch-1',
                productId: 'prod-1',
                productTitle: 'Wireless Noise-Canceling Headphones Pro',
                productImage: '/api/placeholder/120/120?text=Headphones',
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
                    { tier: 1, buyersRequired: 50, price: 149.99, discount: 25, isReached: true, isCurrent: false, estimatedTime: '1-2 days', deliverySpeed: 'fast' },
                    { tier: 2, buyersRequired: 100, price: 129.99, discount: 35, isReached: true, isCurrent: false, estimatedTime: '3-5 days', deliverySpeed: 'medium' },
                    { tier: 3, buyersRequired: 200, price: 89.99, discount: 40, isReached: true, isCurrent: true, estimatedTime: '1-2 weeks', deliverySpeed: 'medium' },
                    { tier: 4, buyersRequired: 350, price: 79.99, discount: 50, isReached: false, isCurrent: false, estimatedTime: '2-3 weeks', deliverySpeed: 'slow' },
                    { tier: 5, buyersRequired: 500, price: 69.99, discount: 65, isReached: false, isCurrent: false, estimatedTime: '3-4 weeks', deliverySpeed: 'slow' }
                ],
                orderBatches: [
                    {
                        id: 'fast-batch-1',
                        name: 'Express Delivery Batch',
                        description: 'Get your headphones in 3-5 business days. Limited spots available for immediate processing.',
                        price: 119.99,
                        discount: 20,
                        deliveryTime: '3-5 business days',
                        deliverySpeed: 'fast',
                        buyersRequired: 25,
                        currentBuyers: 18,
                        status: 'forming',
                        estimatedShipDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
                        estimatedDeliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                        isRecommended: false,
                        savings: 30,
                        urgency: 'high'
                    },
                    {
                        id: 'standard-batch-1',
                        name: 'Standard Delivery Batch',
                        description: 'Current tier pricing with moderate delivery time. Best value for most customers.',
                        price: 89.99,
                        discount: 40,
                        deliveryTime: '1-2 weeks',
                        deliverySpeed: 'medium',
                        buyersRequired: 200,
                        currentBuyers: 234,
                        status: 'ready',
                        estimatedShipDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
                        estimatedDeliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 17),
                        isRecommended: true,
                        savings: 60,
                        urgency: 'medium'
                    },
                    {
                        id: 'economy-batch-1',
                        name: 'Economy Delivery Batch',
                        description: 'Wait for the next tier to unlock maximum savings. Longer delivery but best price.',
                        price: 79.99,
                        discount: 50,
                        deliverySpeed: 'slow',
                        deliveryTime: '2-3 weeks',
                        buyersRequired: 350,
                        currentBuyers: 0,
                        status: 'forming',
                        estimatedShipDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
                        estimatedDeliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 35),
                        isRecommended: false,
                        savings: 70,
                        urgency: 'low'
                    },
                    {
                        id: 'ultimate-batch-1',
                        name: 'Ultimate Savings Batch',
                        description: 'Maximum discount tier. Longest wait but unbeatable price for patient customers.',
                        price: 69.99,
                        discount: 65,
                        deliveryTime: '3-4 weeks',
                        deliverySpeed: 'slow',
                        buyersRequired: 500,
                        currentBuyers: 0,
                        status: 'forming',
                        estimatedShipDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
                        estimatedDeliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 49),
                        isRecommended: false,
                        savings: 80,
                        urgency: 'low'
                    }
                ]
            },
            {
                id: 'batch-2',
                productId: 'prod-2',
                productTitle: 'Smart Fitness Watch with Health Monitoring',
                productImage: '/api/placeholder/120/120?text=SmartWatch',
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
                    { tier: 1, buyersRequired: 75, price: 299.99, discount: 14, isReached: true, isCurrent: false, estimatedTime: '1-2 days', deliverySpeed: 'fast' },
                    { tier: 2, buyersRequired: 150, price: 199.99, discount: 33, isReached: true, isCurrent: true, estimatedTime: '1-2 weeks', deliverySpeed: 'medium' },
                    { tier: 3, buyersRequired: 225, price: 179.99, discount: 49, isReached: false, isCurrent: false, estimatedTime: '2-3 weeks', deliverySpeed: 'slow' },
                    { tier: 4, buyersRequired: 300, price: 149.99, discount: 57, isReached: false, isCurrent: false, estimatedTime: '3-4 weeks', deliverySpeed: 'slow' }
                ],
                orderBatches: [
                    {
                        id: 'fast-batch-2',
                        name: 'Priority Delivery Batch',
                        description: 'Fastest delivery option. Limited availability for immediate shipping.',
                        price: 249.99,
                        discount: 29,
                        deliveryTime: '2-3 business days',
                        deliverySpeed: 'fast',
                        buyersRequired: 20,
                        currentBuyers: 15,
                        status: 'forming',
                        estimatedShipDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
                        estimatedDeliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
                        isRecommended: false,
                        savings: 50,
                        urgency: 'high'
                    },
                    {
                        id: 'standard-batch-2',
                        name: 'Standard Delivery Batch',
                        description: 'Current tier pricing. Good balance of price and delivery speed.',
                        price: 199.99,
                        discount: 33,
                        deliveryTime: '1-2 weeks',
                        deliverySpeed: 'medium',
                        buyersRequired: 150,
                        currentBuyers: 156,
                        status: 'ready',
                        estimatedShipDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
                        estimatedDeliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 16),
                        isRecommended: true,
                        savings: 100,
                        urgency: 'medium'
                    },
                    {
                        id: 'economy-batch-2',
                        name: 'Economy Delivery Batch',
                        description: 'Next tier pricing. Better savings for patient customers.',
                        price: 179.99,
                        discount: 49,
                        deliveryTime: '2-3 weeks',
                        deliverySpeed: 'slow',
                        buyersRequired: 225,
                        currentBuyers: 0,
                        status: 'forming',
                        estimatedShipDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
                        estimatedDeliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 35),
                        isRecommended: false,
                        savings: 120,
                        urgency: 'low'
                    }
                ]
            }
        ];

        setTimeout(() => {
            setBatches(mockBatches);
            setLoading(false);
        }, 1000);
    }, []);

    const handleJoinBatch = (batchId: string, orderBatchId: string) => {
        setUserOrders(prev => ({
            ...prev,
            [batchId]: orderBatchId
        }));

        // In a real app, this would make an API call to join the batch
        console.log(`User joined batch ${orderBatchId} for product ${batchId}`);
    };

    const getDeliverySpeedIcon = (speed: string) => {
        switch (speed) {
            case 'fast': return <Zap className="w-4 h-4 text-yellow-500" />;
            case 'medium': return <Clock className="w-4 h-4 text-blue-500" />;
            case 'slow': return <Package className="w-4 h-4 text-green-500" />;
            default: return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getDeliverySpeedColor = (speed: string) => {
        switch (speed) {
            case 'fast': return 'from-yellow-500 to-orange-500';
            case 'medium': return 'from-blue-500 to-cyan-500';
            case 'slow': return 'from-green-500 to-emerald-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'critical': return 'from-red-500 to-pink-500';
            case 'high': return 'from-orange-500 to-red-500';
            case 'medium': return 'from-yellow-500 to-orange-500';
            case 'low': return 'from-blue-500 to-cyan-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ready': return 'bg-green-100 text-green-800';
            case 'forming': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className={`animate-pulse ${className}`}>
                <div className="space-y-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-gray-200 rounded-2xl h-96"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-8 ${className}`}>
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 mb-4">
                    <Package className="w-4 h-4 mr-2" />
                    <span className="font-semibold">Smart Order Batching</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
            </div>

            {/* How It Works */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">How Order Batching Works</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Zap className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">1. Choose Your Speed</h4>
                        <p className="text-gray-600 text-sm">
                            Select between fast delivery (higher price) or wait for collective buying power (lower price but slower).
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">2. Join the Right Batch</h4>
                        <p className="text-gray-600 text-sm">
                            Join a batch that matches your delivery preference and budget. Fast batches fill quickly!
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Truck className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">3. Get Your Product</h4>
                        <p className="text-gray-600 text-sm">
                            Fast batches ship immediately, while economy batches wait for more buyers to unlock better prices.
                        </p>
                    </div>
                </div>
            </div>

            {/* Order Batches */}
            <div className="space-y-8">
                {batches.map((batch) => (
                    <div
                        key={batch.id}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                    >
                        {/* Product Header */}
                        <div className={`bg-gradient-to-r ${getUrgencyColor(batch.urgency)} text-white p-6`}>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <Flame className="w-5 h-5" />
                                        <span className="text-sm font-medium">
                                            {batch.urgency === 'critical' ? 'Critical Deal' :
                                                batch.urgency === 'high' ? 'Hot Deal' :
                                                    batch.urgency === 'medium' ? 'Good Deal' : 'Regular Deal'}
                                        </span>
                                        {batch.isLimitedTime && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm">
                                                <Timer className="w-3 h-3 mr-1" />
                                                {batch.timeRemaining}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-bold mb-2">{batch.productTitle}</h3>
                                    <p className="text-white/90 text-sm">{batch.description}</p>
                                </div>

                                <div className="text-right">
                                    <div className="text-4xl font-bold mb-1">
                                        ${batch.currentPrice}
                                    </div>
                                    <div className="text-sm text-white/80">
                                        <span className="line-through">${batch.originalPrice}</span>
                                        <span className="ml-2">-{batch.discount}%</span>
                                    </div>
                                    <div className="text-xs text-white/70 mt-1">
                                        Min: ${batch.minPrice} | Max: ${batch.maxPrice}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Batch Options */}
                        <div className="p-6">
                            <h4 className="text-xl font-bold text-gray-900 mb-6">Choose Your Delivery Option</h4>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {batch.orderBatches.map((orderBatch) => (
                                    <div
                                        key={orderBatch.id}
                                        className={`relative p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${userOrders[batch.id] === orderBatch.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {/* Recommended Badge */}
                                        {orderBatch.isRecommended && (
                                            <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full">
                                                ⭐ Recommended
                                            </div>
                                        )}

                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h5 className="text-lg font-bold text-gray-900 mb-2">{orderBatch.name}</h5>
                                                <p className="text-gray-600 text-sm mb-3">{orderBatch.description}</p>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-gray-900">
                                                    ${orderBatch.price}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    <span className="line-through">${batch.originalPrice}</span>
                                                    <span className="ml-2 text-green-600">-{orderBatch.discount}%</span>
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    Save ${orderBatch.savings}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Delivery Info */}
                                        <div className="flex items-center space-x-4 mb-4">
                                            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r ${getDeliverySpeedColor(orderBatch.deliverySpeed)} text-white text-sm font-medium`}>
                                                {getDeliverySpeedIcon(orderBatch.deliverySpeed)}
                                                <span>{orderBatch.deliveryTime}</span>
                                            </div>

                                            <div className="text-sm text-gray-600">
                                                <div>Ship: {orderBatch.estimatedShipDate.toLocaleDateString()}</div>
                                                <div>Delivery: {orderBatch.estimatedDeliveryDate.toLocaleDateString()}</div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between text-sm mb-2">
                                                <span className="text-gray-600">Batch Progress</span>
                                                <span className="text-gray-900 font-medium">
                                                    {orderBatch.currentBuyers}/{orderBatch.buyersRequired} buyers
                                                </span>
                                            </div>

                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div
                                                    className={`h-3 rounded-full transition-all duration-500 ${orderBatch.status === 'ready'
                                                        ? 'bg-green-500'
                                                        : orderBatch.status === 'forming'
                                                            ? 'bg-yellow-500'
                                                            : 'bg-blue-500'
                                                        }`}
                                                    style={{ width: `${Math.min((orderBatch.currentBuyers / orderBatch.buyersRequired) * 100, 100)}%` }}
                                                ></div>
                                            </div>

                                            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                                <span>Forming</span>
                                                <span>Ready</span>
                                                <span>Processing</span>
                                            </div>
                                        </div>

                                        {/* Status and Action */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(orderBatch.status)}`}>
                                                    {orderBatch.status === 'ready' ? 'Ready to Ship' :
                                                        orderBatch.status === 'forming' ? 'Forming Batch' :
                                                            orderBatch.status === 'processing' ? 'Processing' : 'Shipped'}
                                                </span>

                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${orderBatch.urgency === 'high' ? 'bg-red-100 text-red-800' :
                                                    orderBatch.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {orderBatch.urgency === 'high' ? 'High Urgency' :
                                                        orderBatch.urgency === 'medium' ? 'Medium Urgency' : 'Low Urgency'}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => handleJoinBatch(batch.id, orderBatch.id)}
                                                disabled={orderBatch.status === 'ready' && orderBatch.currentBuyers >= orderBatch.buyersRequired}
                                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${userOrders[batch.id] === orderBatch.id
                                                    ? 'bg-green-600 text-white cursor-default'
                                                    : orderBatch.status === 'ready' && orderBatch.currentBuyers >= orderBatch.buyersRequired
                                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                                                    }`}
                                            >
                                                {userOrders[batch.id] === orderBatch.id ? (
                                                    <div className="flex items-center space-x-2">
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span>Joined Batch</span>
                                                    </div>
                                                ) : orderBatch.status === 'ready' && orderBatch.currentBuyers >= orderBatch.buyersRequired ? (
                                                    <div className="flex items-center space-x-2">
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span>Batch Full</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center space-x-2">
                                                        <ShoppingCart className="w-4 h-4" />
                                                        <span>Join Batch</span>
                                                    </div>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Benefits Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Why Choose Order Batching?</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                            Fast Delivery Option
                        </h4>
                        <ul className="space-y-2 text-gray-600">
                            <li>• Get products in 3-5 business days</li>
                            <li>• Limited spots for immediate processing</li>
                            <li>• Perfect for urgent needs</li>
                            <li>• Higher price but instant gratification</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Users className="w-5 h-5 text-blue-500 mr-2" />
                            Collective Buying Power
                        </h4>
                        <ul className="space-y-2 text-gray-600">
                            <li>• Lower prices through bulk purchasing</li>
                            <li>• Wait for better deals to unlock</li>
                            <li>• Sustainable and cost-effective</li>
                            <li>• Community-driven pricing</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl">
                        <Target className="w-5 h-5 mr-2" />
                        <span>Smart Choice for Every Customer</span>
                    </div>
                </div>
            </div>
        </div>
    );
}