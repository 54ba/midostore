// @ts-nocheck
"use client";

import React, { useState, useEffect } from 'react';
import {
    Crown,
    User,
    Brain,
    BarChart3,
    Settings,
    ShoppingCart,
    Package,
    TrendingUp,
    Users,
    Activity,
    Zap,
    Shield,
    Eye,
    Target,
    Layers,
    Workflow,
    AlertTriangle,
    CheckCircle,
    Clock,
    DollarSign,
    Coins,
    Gift,
    Network,
    Database,
    Cpu,
    Database,
    Gauge,
    LineChart,
    PieChart,
    BarChart,
    RefreshCw,
    Play,
    Pause,
    RotateCcw
, Flame, AlertCircle} from 'lucide-react';

interface ManagerDashboardProps {
    className?: string;
}

interface ManagerData {
    userExperience: {
        cart: any;
        orders: any[];
        tokens: number;
        p2pListings: any[];
    };
    orchestrator: {
        status: any;
        services: any[];
        trends: any[];
        decisions: any[];
    };
    analytics: {
        users: any;
        revenue: any;
        performance: any;
        market: any;
    };
}

export default function ManagerDashboard({ className = '' }: ManagerDashboardProps) {
    const [managerData, setManagerData] = useState<ManagerData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState('overview');
    const [orchestratorRunning, setOrchestratorRunning] = useState(false);

    useEffect(() => {
        fetchManagerData();
        const interval = setInterval(fetchManagerData, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchManagerData = async () => {
        try {
            setLoading(true);

            // Simulate fetching comprehensive manager data
            const [userExp, orchestrator, analytics] = await Promise.all([
                fetchUserExperience(),
                fetchOrchestratorData(),
                fetchAnalyticsData(),
            ]);

            setManagerData({
                userExperience: userExp,
                orchestrator: orchestrator,
                analytics: analytics
            });

            setOrchestratorRunning(orchestrator.status?.isRunning || false);

        } catch (error) {
            console.error('Error fetching manager data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserExperience = async () => {
        // Simulate user experience data
        return {
            cart: { items: 3, total: 299.99 },
            orders: [
                { id: '1', total: 149.99, status: 'delivered', date: '2024-01-15' },
                { id: '2', total: 89.99, status: 'shipped', date: '2024-01-20' }
            ],
            tokens: 1250,
            p2pListings: [
                { id: '1', title: 'Wireless Headphones', price: 79.99, status: 'active' },
                { id: '2', title: 'Smart Watch', price: 199.99, status: 'sold' }
            ]
        };
    };

    const fetchOrchestratorData = async () => {
        // Fetch real orchestrator data
        try {
            const response = await fetch('/api/ai-orchestrator?action=status');
            if (response.ok) {
                const data = await response.json();
                return data.success ? data.data : {};
            }
        } catch (error) {
            console.error('Error fetching orchestrator data:', error);
        }
        return { status: { isRunning: false }, services: [], trends: [], decisions: [] };
    };

    const fetchAnalyticsData = async () => {
        // Simulate comprehensive analytics
        return {
            users: {
                total: 15420,
                active: 8930,
                new: 245,
                retention: 78.5
            },
            revenue: {
                total: 245780,
                monthly: 45230,
                growth: 12.5,
                conversion: 3.2
            },
            performance: {
                responseTime: 245,
                uptime: 99.8,
                errorRate: 0.2,
                throughput: 1250
            },
            market: {
                trending: ['electronics', 'fashion', 'home'],
                sentiment: 0.75,
                competition: 'moderate'
            }
        };
    };

    const handleOrchestratorAction = async (action: string) => {
        try {
            const response = await fetch('/api/ai-orchestrator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setOrchestratorRunning(action === 'start' || action === 'restart');
                    await fetchManagerData();
                }
            }
        } catch (error) {
            console.error(`Error executing ${action}:`, error);
        }
    };

    if (loading && !managerData) {
        return (
            <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-8 ${className}`}>
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
                            <Crown className="w-6 h-6 text-purple-600" />
                            Manager Dashboard
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Unified platform management with user experience and AI orchestrator supervision
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Manager Badge */}
                        <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <Crown className="w-4 h-4" />
                                Manager Access
                            </div>
                        </div>

                        {/* Orchestrator Status */}
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${orchestratorRunning ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${orchestratorRunning ? 'bg-green-500' : 'bg-red-500'
                                    }`}></div>
                                AI {orchestratorRunning ? 'Active' : 'Inactive'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* View Navigation */}
                <div className="flex space-x-1 mt-6">
                    {[
                        { id: 'overview', label: 'Overview', icon: BarChart3 },
                        { id: 'user-experience', label: 'User Experience', icon: User },
                        { id: 'ai-orchestrator', label: 'AI Orchestrator', icon: Brain },
                        { id: 'analytics', label: 'Analytics', icon: LineChart },
                        { id: 'supervision', label: 'Supervision', icon: Eye },
                    ].map((view: any) => (
                        <button
                            key={view.id}
                            onClick={() => setActiveView(view.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeView === view.id
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                        >
                            <view.icon className="w-4 h-4" />
                            {view.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeView === 'overview' && (
                    <div className="space-y-6">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm">Total Users</p>
                                        <p className="text-2xl font-bold">
                                            {managerData?.analytics.users.total.toLocaleString() || '0'}
                                        </p>
                                    </div>
                                    <Users className="w-8 h-8 text-blue-200" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm">Revenue</p>
                                        <p className="text-2xl font-bold">
                                            ${managerData?.analytics.revenue.total.toLocaleString() || '0'}
                                        </p>
                                    </div>
                                    <DollarSign className="w-8 h-8 text-green-200" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100 text-sm">My Tokens</p>
                                        <p className="text-2xl font-bold">
                                            {managerData?.userExperience.tokens.toLocaleString() || '0'}
                                        </p>
                                    </div>
                                    <Coins className="w-8 h-8 text-purple-200" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-orange-100 text-sm">System Health</p>
                                        <p className="text-2xl font-bold">
                                            {managerData?.analytics.performance.uptime || '0'}%
                                        </p>
                                    </div>
                                    <Activity className="w-8 h-8 text-orange-200" />
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Experience Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
                                        <ShoppingCart className="w-5 h-5 text-blue-600" />
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900">View My Cart</p>
                                            <p className="text-sm text-gray-600">{managerData?.userExperience.cart.items || 0} items</p>
                                        </div>
                                    </button>

                                    <button className="w-full flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all">
                                        <Package className="w-5 h-5 text-green-600" />
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900">My Orders</p>
                                            <p className="text-sm text-gray-600">{managerData?.userExperience.orders.length || 0} orders</p>
                                        </div>
                                    </button>

                                    <button className="w-full flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all">
                                        <Gift className="w-5 h-5 text-purple-600" />
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900">Token Rewards</p>
                                            <p className="text-sm text-gray-600">Earn & manage tokens</p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Orchestrator Control</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 mb-3">
                                        <button
                                            onClick={() => handleOrchestratorAction('start')}
                                            disabled={orchestratorRunning}
                                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            <Play className="w-4 h-4" />
                                            Start
                                        </button>

                                        <button
                                            onClick={() => handleOrchestratorAction('stop')}
                                            disabled={!orchestratorRunning}
                                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            <Pause className="w-4 h-4" />
                                            Stop
                                        </button>

                                        <button
                                            onClick={() => handleOrchestratorAction('restart')}
                                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            Restart
                                        </button>
                                    </div>

                                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Services Monitored</span>
                                            <span className="font-medium">{managerData?.orchestrator.services?.length || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Active Decisions</span>
                                            <span className="font-medium">{managerData?.orchestrator.decisions?.length || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Market trend analysis completed</p>
                                            <p className="text-sm text-gray-600">Electronics category showing high momentum</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">2 min ago</span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Service scaling decision executed</p>
                                            <p className="text-sm text-gray-600">Web3 service scaled up by 50%</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">5 min ago</span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                            <Coins className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Token rewards distributed</p>
                                            <p className="text-sm text-gray-600">Daily login reward earned: +5 tokens</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">1 hour ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 'user-experience' && (
                    <div className="space-y-6">
                        {/* User Experience Dashboard */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Shopping Cart */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5" />
                                    My Shopping Cart
                                </h3>
                                <div className="bg-white rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-gray-600">Items in cart</span>
                                        <span className="font-medium">{managerData?.userExperience.cart.items || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-gray-600">Total value</span>
                                        <span className="font-medium">${managerData?.userExperience.cart.total || 0}</span>
                                    </div>
                                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                        View Cart
                                    </button>
                                </div>
                            </div>

                            {/* Token Balance */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Coins className="w-5 h-5" />
                                    Token Rewards
                                </h3>
                                <div className="bg-white rounded-lg p-4">
                                    <div className="text-center mb-4">
                                        <div className="text-3xl font-bold text-purple-600">
                                            {managerData?.userExperience.tokens.toLocaleString() || 0}
                                        </div>
                                        <div className="text-gray-600">Total Tokens</div>
                                    </div>
                                    <div className="space-y-2">
                                        <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                            Claim Rewards
                                        </button>
                                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                                            Transfer Tokens
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                            <div className="space-y-3">
                                {managerData?.userExperience.orders.map((order, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Package className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Order #{order.id}</p>
                                                <p className="text-sm text-gray-600">{order.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">${order.total}</p>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* P2P Listings */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">My P2P Listings</h3>
                            <div className="space-y-3">
                                {managerData?.userExperience.p2pListings.map((listing, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{listing.title}</p>
                                            <p className="text-sm text-gray-600">${listing.price}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${listing.status === 'active' ? 'bg-green-100 text-green-700' :
                                                listing.status === 'sold' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {listing.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 'ai-orchestrator' && (
                    <div className="space-y-6">
                        {/* Orchestrator Status */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm">Services Monitored</p>
                                        <p className="text-2xl font-bold">
                                            {managerData?.orchestrator.services?.length || 0}
                                        </p>
                                    </div>
                                    <Layers className="w-8 h-8 text-blue-200" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm">Active Decisions</p>
                                        <p className="text-2xl font-bold">
                                            {managerData?.orchestrator.decisions?.length || 0}
                                        </p>
                                    </div>
                                    <Brain className="w-8 h-8 text-green-200" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100 text-sm">Trend Categories</p>
                                        <p className="text-2xl font-bold">
                                            {managerData?.orchestrator.trends?.length || 0}
                                        </p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-purple-200" />
                                </div>
                            </div>
                        </div>

                        {/* AI Control Panel */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Orchestrator Control</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-3">System Control</h4>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => handleOrchestratorAction('start')}
                                            disabled={orchestratorRunning}
                                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <Play className="w-4 h-4" />
                                            Start AI Orchestrator
                                        </button>

                                        <button
                                            onClick={() => handleOrchestratorAction('restart')}
                                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            Restart System
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                                    <div className="space-y-2">
                                        <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2">
                                            <RefreshCw className="w-4 h-4" />
                                            Force Analysis
                                        </button>

                                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2">
                                            <Settings className="w-4 h-4" />
                                            Configure Rules
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Service Health Monitor */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Health Monitor</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {['web3-service', 'p2p-marketplace', 'token-rewards', 'bulk-pricing', 'analytics', 'scraping'].map((service, index) => (
                                    <div key={index} className="bg-white rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-gray-900">{service}</span>
                                            <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                                                Healthy
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <div className="flex justify-between">
                                                <span>Response Time:</span>
                                                <span>{Math.floor(Math.random() * 500 + 100)}ms</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>CPU Usage:</span>
                                                <span>{Math.floor(Math.random() * 50 + 20)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 'analytics' && (
                    <div className="space-y-6">
                        {/* Analytics Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-600 text-sm font-medium">Active Users</p>
                                        <p className="text-2xl font-bold text-blue-900">
                                            {managerData?.analytics.users.active?.toLocaleString() || '0'}
                                        </p>
                                    </div>
                                    <Users className="w-8 h-8 text-blue-500" />
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-600 text-sm font-medium">Monthly Revenue</p>
                                        <p className="text-2xl font-bold text-green-900">
                                            ${managerData?.analytics.revenue.monthly?.toLocaleString() || '0'}
                                        </p>
                                    </div>
                                    <DollarSign className="w-8 h-8 text-green-500" />
                                </div>
                            </div>

                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-600 text-sm font-medium">Conversion Rate</p>
                                        <p className="text-2xl font-bold text-purple-900">
                                            {managerData?.analytics.revenue.conversion || 0}%
                                        </p>
                                    </div>
                                    <Target className="w-8 h-8 text-purple-500" />
                                </div>
                            </div>

                            <div className="bg-orange-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-orange-600 text-sm font-medium">Response Time</p>
                                        <p className="text-2xl font-bold text-orange-900">
                                            {managerData?.analytics.performance.responseTime || 0}ms
                                        </p>
                                    </div>
                                    <Gauge className="w-8 h-8 text-orange-500" />
                                </div>
                            </div>
                        </div>

                        {/* Performance Charts Placeholder */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                                <div className="h-64 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                                    <div className="text-center">
                                        <LineChart className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500">Revenue chart visualization</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                                <div className="h-64 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                                    <div className="text-center">
                                        <BarChart className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500">User growth visualization</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Market Intelligence */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Intelligence</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Trending Categories</h4>
                                    <div className="space-y-2">
                                        {managerData?.analytics.market.trending?.map((category: any, index: number) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <span className="text-gray-600 capitalize">{category}</span>
                                                <span className="text-green-600 font-medium">+{Math.floor(Math.random() * 20 + 10)}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Market Sentiment</h4>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-600">
                                            {((managerData?.analytics.market.sentiment || 0) * 100).toFixed(0)}%
                                        </div>
                                        <div className="text-gray-600">Positive</div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Competition Level</h4>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-orange-600 capitalize">
                                            {managerData?.analytics.market.competition || 'N/A'}
                                        </div>
                                        <div className="text-gray-600">Intensity</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 'supervision' && (
                    <div className="space-y-6">
                        {/* Supervision Overview */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Platform Supervision</h3>
                            <p className="text-indigo-100 mb-4">
                                Comprehensive oversight of all platform operations, user activities, and AI decisions
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{managerData?.analytics.users.total || 0}</div>
                                    <div className="text-indigo-100 text-sm">Total Users Supervised</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{managerData?.orchestrator.services?.length || 0}</div>
                                    <div className="text-indigo-100 text-sm">Services Monitored</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{managerData?.orchestrator.decisions?.length || 0}</div>
                                    <div className="text-indigo-100 text-sm">AI Decisions Reviewed</div>
                                </div>
                            </div>
                        </div>

                        {/* System Health Dashboard */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Overall Uptime</span>
                                        <span className="font-medium text-green-600">{managerData?.analytics.performance.uptime || 0}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Error Rate</span>
                                        <span className="font-medium text-green-600">{managerData?.analytics.performance.errorRate || 0}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Avg Response Time</span>
                                        <span className="font-medium text-blue-600">{managerData?.analytics.performance.responseTime || 0}ms</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Throughput</span>
                                        <span className="font-medium text-purple-600">{managerData?.analytics.performance.throughput || 0} req/s</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Alerts</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <div>
                                            <p className="font-medium text-green-900">All Systems Operational</p>
                                            <p className="text-sm text-green-700">No critical issues detected</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                        <div>
                                            <p className="font-medium text-yellow-900">High Traffic Alert</p>
                                            <p className="text-sm text-yellow-700">Traffic increased by 25% in last hour</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="font-medium text-blue-900">Scheduled Maintenance</p>
                                            <p className="text-sm text-blue-700">System update planned for tonight</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Manager Privileges */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manager Privileges & Capabilities</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="bg-white rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        User Experience
                                    </h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• Full shopping capabilities</li>
                                        <li>• Token earning & management</li>
                                        <li>• P2P marketplace access</li>
                                        <li>• Social sharing features</li>
                                    </ul>
                                </div>

                                <div className="bg-white rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                        <Brain className="w-4 h-4" />
                                        AI Supervision
                                    </h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• Orchestrator control</li>
                                        <li>• Decision oversight</li>
                                        <li>• Automation management</li>
                                        <li>• Crisis intervention</li>
                                    </ul>
                                </div>

                                <div className="bg-white rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4" />
                                        Analytics Access
                                    </h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• Full data visibility</li>
                                        <li>• Performance metrics</li>
                                        <li>• Business intelligence</li>
                                        <li>• Export capabilities</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}