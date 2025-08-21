"use client";

import React, { useState, useEffect } from 'react';
import {
    Package,
    Truck,
    Clock,
    CheckCircle,
    AlertCircle,
    Info,
    Eye,
    MapPin,
    Calendar,
    TrendingUp,
    Users,
    DollarSign,
    BarChart3,
    RefreshCw,
    Play,
    Pause,
    FastForward
} from 'lucide-react';

interface BatchOrder {
    id: string;
    batchId: string;
    userId: string;
    productId: string;
    quantity: number;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    shippingAddress: string;
    trackingNumber?: string;
    createdAt: Date;
    updatedAt: Date;
    batch: {
        id: string;
        productId: string;
        batchType: 'fast' | 'standard' | 'economy' | 'ultimate';
        price: number;
        deliveryTime: string;
        deliverySpeed: 'fast' | 'medium' | 'slow';
        status: 'forming' | 'ready' | 'processing' | 'shipped' | 'delivered';
        estimatedShipDate: Date;
        estimatedDeliveryDate: Date;
        actualShipDate?: Date;
        actualDeliveryDate?: Date;
    };
    product: {
        id: string;
        title: string;
        image: string;
        category: string;
    };
}

interface BatchManagementDashboardProps {
    userId: string;
    className?: string;
}

export default function BatchManagementDashboard({
    userId,
    className = ""
}: BatchManagementDashboardProps) {
    const [batchOrders, setBatchOrders] = useState<BatchOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedBatchType, setSelectedBatchType] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<string>('created');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Mock data for demonstration
    useEffect(() => {
        const mockBatchOrders: BatchOrder[] = [
            {
                id: 'order-1',
                batchId: 'batch-1',
                userId: 'user-1',
                productId: 'prod-1',
                quantity: 2,
                totalPrice: 179.98,
                status: 'confirmed',
                paymentStatus: 'paid',
                shippingAddress: '123 Main St, Dubai, UAE',
                trackingNumber: 'TRK123456789',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
                updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
                batch: {
                    id: 'batch-1',
                    productId: 'prod-1',
                    batchType: 'standard',
                    price: 89.99,
                    deliveryTime: '1-2 weeks',
                    deliverySpeed: 'medium',
                    status: 'processing',
                    estimatedShipDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
                    estimatedDeliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
                    actualShipDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)
                },
                product: {
                    id: 'prod-1',
                    title: 'Wireless Noise-Canceling Headphones Pro',
                    image: '/api/placeholder/80/80?text=Headphones',
                    category: 'Electronics'
                }
            },
            {
                id: 'order-2',
                batchId: 'batch-2',
                userId: 'user-1',
                productId: 'prod-2',
                quantity: 1,
                totalPrice: 199.99,
                status: 'shipped',
                paymentStatus: 'paid',
                shippingAddress: '123 Main St, Dubai, UAE',
                trackingNumber: 'TRK987654321',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
                updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
                batch: {
                    id: 'batch-2',
                    productId: 'prod-2',
                    batchType: 'fast',
                    price: 199.99,
                    deliveryTime: '3-5 business days',
                    deliverySpeed: 'fast',
                    status: 'shipped',
                    estimatedShipDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
                    estimatedDeliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
                    actualShipDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
                },
                product: {
                    id: 'prod-2',
                    title: 'Smart Fitness Watch with Health Monitoring',
                    image: '/api/placeholder/80/80?text=SmartWatch',
                    category: 'Electronics'
                }
            },
            {
                id: 'order-3',
                batchId: 'batch-3',
                userId: 'user-1',
                productId: 'prod-3',
                quantity: 3,
                totalPrice: 89.97,
                status: 'pending',
                paymentStatus: 'pending',
                shippingAddress: '123 Main St, Dubai, UAE',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
                updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
                batch: {
                    id: 'batch-3',
                    productId: 'prod-3',
                    batchType: 'economy',
                    price: 29.99,
                    deliveryTime: '2-3 weeks',
                    deliverySpeed: 'slow',
                    status: 'forming',
                    estimatedShipDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
                    estimatedDeliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 35)
                },
                product: {
                    id: 'prod-3',
                    title: 'Organic Anti-Aging Face Cream Set',
                    image: '/api/placeholder/80/80?text=FaceCream',
                    category: 'Beauty & Health'
                }
            }
        ];

        setTimeout(() => {
            setBatchOrders(mockBatchOrders);
            setLoading(false);
        }, 1000);
    }, [userId]);

    const filteredOrders = batchOrders.filter(order => {
        const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
        const matchesBatchType = selectedBatchType === 'all' || order.batch.batchType === selectedBatchType;
        const matchesSearch = searchQuery === '' ||
            order.product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.product.category.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesBatchType && matchesSearch;
    });

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        switch (sortBy) {
            case 'created':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'status':
                return a.status.localeCompare(b.status);
            case 'price':
                return b.totalPrice - a.totalPrice;
            case 'delivery':
                return new Date(a.batch.estimatedDeliveryDate).getTime() - new Date(b.batch.estimatedDeliveryDate).getTime();
            default:
                return 0;
        }
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'shipped': return 'bg-blue-100 text-blue-800';
            case 'confirmed': return 'bg-yellow-100 text-yellow-800';
            case 'pending': return 'bg-gray-100 text-gray-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getBatchTypeColor = (batchType: string) => {
        switch (batchType) {
            case 'fast': return 'from-yellow-500 to-orange-500';
            case 'standard': return 'from-blue-500 to-cyan-500';
            case 'economy': return 'from-green-500 to-emerald-500';
            case 'ultimate': return 'from-purple-500 to-pink-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getDeliverySpeedIcon = (speed: string) => {
        switch (speed) {
            case 'fast': return <FastForward className="w-4 h-4 text-yellow-500" />;
            case 'medium': return <Play className="w-4 h-4 text-blue-500" />;
            case 'slow': return <Pause className="w-4 h-4 text-green-500" />;
            default: return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getProgressPercentage = (order: BatchOrder) => {
        const now = new Date();
        const start = new Date(order.createdAt);
        const end = new Date(order.batch.estimatedDeliveryDate);

        if (order.status === 'delivered') return 100;
        if (order.status === 'shipped') return 75;
        if (order.status === 'confirmed') return 50;
        if (order.status === 'pending') return 25;

        const total = end.getTime() - start.getTime();
        const elapsed = now.getTime() - start.getTime();

        return Math.min(Math.max((elapsed / total) * 100, 0), 100);
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
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Batch Order Management</h2>
                    <p className="text-gray-600 mt-2">Track your batch orders, manage deliveries, and monitor progress</p>
                </div>

                <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Orders</p>
                            <p className="text-3xl font-bold text-gray-900">{batchOrders.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Orders</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {batchOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <Truck className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Spent</p>
                            <p className="text-3xl font-bold text-gray-900">
                                ${batchOrders.reduce((sum, o) => sum + o.totalPrice, 0).toFixed(2)}
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
                            <p className="text-sm font-medium text-gray-600">Avg. Savings</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {Math.round(batchOrders.reduce((sum, o) => sum + (o.batch.price / 150 * 100 - 100), 0) / batchOrders.length)}%
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Controls */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <BarChart3 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <Package className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center space-x-4">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="created">Date Created</option>
                            <option value="status">Status</option>
                            <option value="price">Price</option>
                            <option value="delivery">Delivery Date</option>
                        </select>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products or categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <select
                        value={selectedBatchType}
                        onChange={(e) => setSelectedBatchType(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Batch Types</option>
                        <option value="fast">Fast Delivery</option>
                        <option value="standard">Standard</option>
                        <option value="economy">Economy</option>
                        <option value="ultimate">Ultimate Savings</option>
                    </select>
                </div>
            </div>

            {/* Orders Grid/List */}
            <div className={`grid gap-6 ${viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}>
                {sortedOrders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                        {/* Order Header */}
                        <div className={`bg-gradient-to-r ${getBatchTypeColor(order.batch.batchType)} text-white p-4`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    {getDeliverySpeedIcon(order.batch.deliverySpeed)}
                                    <span className="text-sm font-medium capitalize">
                                        {order.batch.batchType} Delivery
                                    </span>
                                </div>

                                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                                    {order.batch.deliveryTime}
                                </span>
                            </div>
                        </div>

                        {/* Order Content */}
                        <div className="p-6">
                            {/* Product Info */}
                            <div className="flex items-start space-x-4 mb-4">
                                <img
                                    src={order.product.image}
                                    alt={order.product.title}
                                    className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                />

                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                                        {order.product.title}
                                    </h3>
                                    <div className="text-xs text-gray-500 mb-2">
                                        {order.product.category} • Qty: {order.quantity}
                                    </div>

                                    <div className="text-lg font-bold text-gray-900">
                                        ${order.totalPrice}
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-600">Order Progress</span>
                                    <span className="text-gray-900 font-medium">
                                        {Math.round(getProgressPercentage(order))}%
                                    </span>
                                </div>

                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${order.status === 'delivered'
                                                ? 'bg-green-500'
                                                : order.status === 'shipped'
                                                    ? 'bg-blue-500'
                                                    : order.status === 'confirmed'
                                                        ? 'bg-yellow-500'
                                                        : 'bg-gray-500'
                                            }`}
                                        style={{ width: `${getProgressPercentage(order)}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Status and Dates */}
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Status</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Payment</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                    </span>
                                </div>

                                {order.trackingNumber && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Tracking</span>
                                        <span className="text-sm font-medium text-blue-600">
                                            {order.trackingNumber}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Delivery Info */}
                            <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">Shipping Address</span>
                                </div>
                                <p className="text-xs text-gray-600">{order.shippingAddress}</p>
                            </div>

                            {/* Dates */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">Order Date</span>
                                    <span className="text-gray-700">
                                        {order.createdAt.toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">Est. Ship</span>
                                    <span className="text-gray-700">
                                        {order.batch.estimatedShipDate.toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">Est. Delivery</span>
                                    <span className="text-gray-700">
                                        {order.batch.estimatedDeliveryDate.toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-2">
                                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                    <Eye className="w-4 h-4 mr-2 inline" />
                                    View Details
                                </button>

                                {order.trackingNumber && (
                                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                                        <Truck className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {sortedOrders.length === 0 && (
                <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No batch orders found</h3>
                    <p className="text-gray-600">
                        {searchQuery || selectedStatus !== 'all' || selectedBatchType !== 'all'
                            ? 'Try adjusting your filters or search terms'
                            : 'Start joining batch orders to see them here'}
                    </p>
                </div>
            )}
        </div>
    );
}