"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    TrendingUp,
    Fire,
    Star,
    DollarSign,
    Clock,
    Eye,
    ShoppingCart,
    Zap,
    ArrowUp,
    ArrowDown,
    Bitcoin,
    Package
} from 'lucide-react';

interface LiveSale {
    id: string;
    productId: string;
    productTitle: string;
    customer: string;
    amount: number;
    currency: string;
    paymentMethod: 'crypto' | 'traditional' | 'mixed';
    location: string;
    timestamp: Date;
    isNew: boolean;
    priceChange?: number;
    cryptoAmount?: number;
    cryptoType?: string;
}

interface LivePriceUpdate {
    id: string;
    productId: string;
    productTitle: string;
    oldPrice: number;
    newPrice: number;
    currency: string;
    changePercent: number;
    isVolatile: boolean;
    timestamp: Date;
}

interface LiveInventoryUpdate {
    id: string;
    productId: string;
    productTitle: string;
    action: 'added' | 'restocked' | 'low_stock' | 'out_of_stock';
    quantity: number;
    timestamp: Date;
}

export default function LiveSalesTicker() {
    const [sales, setSales] = useState<LiveSale[]>([]);
    const [priceUpdates, setPriceUpdates] = useState<LivePriceUpdate[]>([]);
    const [inventoryUpdates, setInventoryUpdates] = useState<LiveInventoryUpdate[]>([]);
    const [isPaused, setIsPaused] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const tickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fetch initial data
        fetchLiveData();

        // Set up real-time updates
        const salesInterval = setInterval(fetchLiveSales, 3000); // Every 3 seconds
        const priceInterval = setInterval(fetchPriceUpdates, 5000); // Every 5 seconds
        const inventoryInterval = setInterval(fetchInventoryUpdates, 10000); // Every 10 seconds

        // Auto-scroll ticker
        const scrollInterval = setInterval(() => {
            if (!isPaused) {
                setCurrentIndex(prev => prev + 1);
            }
        }, 4000); // Change every 4 seconds

        return () => {
            clearInterval(salesInterval);
            clearInterval(priceInterval);
            clearInterval(inventoryInterval);
            clearInterval(scrollInterval);
        };
    }, [isPaused]);

    const fetchLiveData = async () => {
        try {
            await Promise.all([
                fetchLiveSales(),
                fetchPriceUpdates(),
                fetchInventoryUpdates(),
            ]);
        } catch (error) {
            console.error('Error fetching live data:', error);
        }
    };

    const fetchLiveSales = async () => {
        try {
            const response = await fetch('/api/analytics?action=live-sales&limit=10');
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setSales(data.data);
                }
            }
        } catch (error) {
            console.error('Error fetching live sales:', error);
        }
    };

    const fetchPriceUpdates = async () => {
        try {
            const response = await fetch('/api/localization?action=price-updates&limit=5');
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setPriceUpdates(data.data);
                }
            }
        } catch (error) {
            console.error('Error fetching price updates:', error);
        }
        // Fallback to mock data if API not available
        if (priceUpdates.length === 0) {
            setPriceUpdates(generateMockPriceUpdates());
        }
    };

    const fetchInventoryUpdates = async () => {
        try {
            const response = await fetch('/api/products?action=inventory-updates&limit=5');
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setInventoryUpdates(data.data);
                }
            }
        } catch (error) {
            console.error('Error fetching inventory updates:', error);
        }
        // Fallback to mock data if API not available
        if (inventoryUpdates.length === 0) {
            setInventoryUpdates(generateMockInventoryUpdates());
        }
    };

    // Generate mock data for demonstration
    const generateMockPriceUpdates = (): LivePriceUpdate[] => [
        {
            id: '1',
            productId: 'prod-1',
            productTitle: 'Wireless Headphones',
            oldPrice: 99.99,
            newPrice: 89.99,
            currency: 'USD',
            changePercent: -10,
            isVolatile: false,
            timestamp: new Date(),
        },
        {
            id: '2',
            productId: 'prod-2',
            productTitle: 'Smart Watch',
            oldPrice: 299.99,
            newPrice: 349.99,
            currency: 'USD',
            changePercent: 16.7,
            isVolatile: true,
            timestamp: new Date(),
        },
    ];

    const generateMockInventoryUpdates = (): LiveInventoryUpdate[] => [
        {
            id: '1',
            productId: 'prod-1',
            productTitle: 'Wireless Headphones',
            action: 'restocked',
            quantity: 50,
            timestamp: new Date(),
        },
        {
            id: '2',
            productId: 'prod-3',
            productTitle: 'Gaming Mouse',
            action: 'low_stock',
            quantity: 5,
            timestamp: new Date(),
        },
    ];

    // Combine all updates for ticker
    const allUpdates = [
        ...sales.map(sale => ({
            type: 'sale' as const,
            data: sale,
            priority: 3,
        })),
        ...priceUpdates.map(update => ({
            type: 'price' as const,
            data: update,
            priority: update.isVolatile ? 2 : 1,
        })),
        ...inventoryUpdates.map(update => ({
            type: 'inventory' as const,
            data: update,
            priority: 1,
        })),
    ].sort((a, b) => b.priority - a.priority);

    const currentUpdate = allUpdates[currentIndex % allUpdates.length];

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const formatTimeAgo = (timestamp: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - timestamp.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${Math.floor(diffHours / 24)}d ago`;
    };

    const renderSaleUpdate = (sale: LiveSale) => (
        <div className="flex items-center gap-3 text-green-600">
            <Fire className="w-4 h-4 animate-pulse" />
            <span className="font-medium">{sale.customer}</span>
            <span>just bought</span>
            <span className="font-semibold">{sale.productTitle}</span>
            <span>for</span>
            <span className="font-bold">{formatCurrency(sale.amount, sale.currency)}</span>
            {sale.paymentMethod === 'crypto' && sale.cryptoAmount && (
                <span className="flex items-center gap-1">
                    <Bitcoin className="w-3 h-3" />
                    {sale.cryptoAmount.toFixed(4)} {sale.cryptoType}
                </span>
            )}
            <span className="text-gray-500 text-sm">• {sale.location}</span>
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-gray-500 text-sm">{formatTimeAgo(sale.timestamp)}</span>
        </div>
    );

    const renderPriceUpdate = (update: LivePriceUpdate) => (
        <div className="flex items-center gap-3 text-blue-600">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">{update.productTitle}</span>
            <span>price</span>
            {update.changePercent > 0 ? (
                <ArrowUp className="w-4 h-4 text-red-500" />
            ) : (
                <ArrowDown className="w-4 h-4 text-green-500" />
            )}
            <span className="font-semibold">
                {update.changePercent > 0 ? 'increased' : 'decreased'}
            </span>
            <span>by</span>
            <span className={`font-bold ${update.changePercent > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {Math.abs(update.changePercent).toFixed(1)}%
            </span>
            <span>to</span>
            <span className="font-bold">{formatCurrency(update.newPrice, update.currency)}</span>
            {update.isVolatile && <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />}
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-gray-500 text-sm">{formatTimeAgo(update.timestamp)}</span>
        </div>
    );

    const renderInventoryUpdate = (update: LiveInventoryUpdate) => (
        <div className="flex items-center gap-3 text-purple-600">
            <Package className="w-4 h-4" />
            <span className="font-medium">{update.productTitle}</span>
            <span>
                {update.action === 'restocked' && 'restocked with'}
                {update.action === 'low_stock' && 'running low on stock'}
                {update.action === 'out_of_stock' && 'is now out of stock'}
                {update.action === 'added' && 'added to inventory'}
            </span>
            {update.action !== 'out_of_stock' && (
                <span className="font-bold">{update.quantity} units</span>
            )}
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-gray-500 text-sm">{formatTimeAgo(update.timestamp)}</span>
        </div>
    );

    const renderUpdate = () => {
        if (!currentUpdate) return null;

        switch (currentUpdate.type) {
            case 'sale':
                return renderSaleUpdate(currentUpdate.data as LiveSale);
            case 'price':
                return renderPriceUpdate(currentUpdate.data as LivePriceUpdate);
            case 'inventory':
                return renderInventoryUpdate(currentUpdate.data as LiveInventoryUpdate);
            default:
                return null;
        }
    };

    return (
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-black bg-opacity-20">
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
                    <span className="font-bold text-sm uppercase tracking-wider">Live Updates</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Live</span>
                    </div>

                    <button
                        onClick={() => setIsPaused(!isPaused)}
                        className="text-xs hover:text-yellow-300 transition-colors"
                    >
                        {isPaused ? '▶️ Resume' : '⏸️ Pause'}
                    </button>
                </div>
            </div>

            {/* Ticker Content */}
            <div className="relative overflow-hidden">
                <div
                    ref={tickerRef}
                    className="flex items-center py-3 px-4 whitespace-nowrap transition-transform duration-1000 ease-in-out"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {renderUpdate()}
                </div>

                {/* Progress indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-20">
                    <div
                        className="h-full bg-yellow-400 transition-all duration-4000 ease-linear"
                        style={{
                            width: `${((currentIndex % allUpdates.length) / allUpdates.length) * 100}%`,
                        }}
                    />
                </div>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-black bg-opacity-10 text-xs">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <ShoppingCart className="w-3 h-3" />
                        <span>{sales.length} sales today</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{priceUpdates.length} price updates</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        <span>{inventoryUpdates.length} inventory changes</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-gray-300">Last updated:</span>
                    <span>{new Date().toLocaleTimeString()}</span>
                </div>
            </div>
        </div>
    );
}