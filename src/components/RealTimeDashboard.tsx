"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    TrendingUp,
    Users,
    DollarSign,
    ShoppingCart,
    Activity,
    Wifi,
    WifiOff,
    RefreshCw,
    BarChart3,
    PieChart,
    LineChart
} from 'lucide-react';
import SimpleChart from './SimpleChart';

interface RealTimeMetrics {
    currentVisitors: number;
    activeSessions: number;
    currentOrders: number;
    revenueToday: number;
    conversionRate: number;
    avgSessionDuration: number;
}

interface TimeSeriesData {
    date: string;
    value: number;
    timestamp: string;
}

export default function RealTimeDashboard() {
    const [isConnected, setIsConnected] = useState(false);
    const [metrics, setMetrics] = useState<RealTimeMetrics>({
        currentVisitors: 0,
        activeSessions: 0,
        currentOrders: 0,
        revenueToday: 0,
        conversionRate: 0,
        avgSessionDuration: 0
    });
    const [revenueData, setRevenueData] = useState<TimeSeriesData[]>([]);
    const [ordersData, setOrdersData] = useState<TimeSeriesData[]>([]);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [autoRefresh, setAutoRefresh] = useState(true);

    // Chart data state
    const [revenueChartData, setRevenueChartData] = useState<Array<{ label: string; value: number }>>([]);
    const [ordersChartData, setOrdersChartData] = useState<Array<{ label: string; value: number }>>([]);
    const [visitorsChartData, setVisitorsChartData] = useState<Array<{ label: string; value: number }>>([]);

    useEffect(() => {
        startRealTimeUpdates();
        initializeChartData();
    }, []);

    const initializeChartData = () => {
        // Initialize revenue chart data
        const now = new Date();
        const revenueLabels = Array.from({ length: 24 }, (_, i) => {
            const time = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
            return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        });

        const revenueValues = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100) + 50);
        setRevenueChartData(revenueLabels.map((label, i) => ({ label, value: revenueValues[i] })));

        // Initialize orders chart data
        const orderValues = Array.from({ length: 24 }, () => Math.floor(Math.random() * 10) + 1);
        setOrdersChartData(revenueLabels.map((label, i) => ({ label, value: orderValues[i] })));

        // Initialize visitors chart data
        setVisitorsChartData([
            { label: 'Active Visitors', value: metrics.currentVisitors },
            { label: 'Inactive', value: 200 - metrics.currentVisitors }
        ]);
    };

    const startRealTimeUpdates = () => {
        setIsConnected(true);

        // Simulate real-time updates
        const interval = setInterval(() => {
            if (autoRefresh) {
                updateMetrics();
                updateCharts();
                setLastUpdate(new Date());
            }
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    };

    const updateMetrics = () => {
        setMetrics(prev => ({
            currentVisitors: Math.floor(Math.random() * 100) + 50,
            activeSessions: Math.floor(Math.random() * 30) + 10,
            currentOrders: Math.floor(Math.random() * 5) + 1,
            revenueToday: Math.floor(Math.random() * 1000) + 500,
            conversionRate: (Math.random() * 2 + 1),
            avgSessionDuration: Math.floor(Math.random() * 300) + 120
        }));
    };

    const updateCharts = () => {
        // Update Revenue Chart
        const now = new Date();
        const labels = Array.from({ length: 24 }, (_, i) => {
            const time = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
            return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        });

        const revenueValues = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100) + 50);
        setRevenueChartData(labels.map((label, i) => ({ label, value: revenueValues[i] })));

        // Update Orders Chart
        const orderValues = Array.from({ length: 24 }, () => Math.floor(Math.random() * 10) + 1);
        setOrdersChartData(labels.map((label, i) => ({ label, value: orderValues[i] })));

        // Update Visitors Chart
        setVisitorsChartData([
            { label: 'Active Visitors', value: metrics.currentVisitors },
            { label: 'Inactive', value: 200 - metrics.currentVisitors }
        ]);
    };

    const refreshData = () => {
        updateMetrics();
        updateCharts();
        setLastUpdate(new Date());
    };

    const toggleAutoRefresh = () => {
        setAutoRefresh(!autoRefresh);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Real-Time Dashboard</h1>
                    <p className="text-gray-600">Live analytics and performance monitoring</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-2">
                        {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                        {isConnected ? 'Live' : 'Offline'}
                    </Badge>
                    <Button
                        onClick={refreshData}
                        variant="outline"
                        size="sm"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                    <Button
                        onClick={toggleAutoRefresh}
                        variant={autoRefresh ? "default" : "outline"}
                        size="sm"
                    >
                        <Activity className="h-4 w-4 mr-2" />
                        Auto
                    </Button>
                </div>
            </div>

            {/* Last Update */}
            <div className="text-sm text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
            </div>

            {/* Real-Time Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Visitors</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{metrics.currentVisitors}</div>
                        <p className="text-xs text-green-600">+12% from last hour</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                        <Activity className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{metrics.activeSessions}</div>
                        <p className="text-xs text-green-600">+8% from last hour</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{metrics.currentOrders}</div>
                        <p className="text-xs text-green-600">+15% from last hour</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
                        <DollarSign className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">${metrics.revenueToday}</div>
                        <p className="text-xs text-green-600">+22% from yesterday</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend Chart */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LineChart className="h-5 w-5" />
                            Revenue Trend
                        </CardTitle>
                        <CardDescription>
                            Real-time revenue tracking over the last 24 hours
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <SimpleChart
                                data={revenueChartData}
                                type="line"
                                width={400}
                                height={300}
                                title="Revenue Trend (Last 24 Hours)"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Chart */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Orders
                        </CardTitle>
                        <CardDescription>
                            Order volume throughout the day
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <SimpleChart
                                data={ordersChartData}
                                type="bar"
                                width={400}
                                height={300}
                                title="Orders (Last 24 Hours)"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visitors Activity */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5" />
                            Visitor Activity
                        </CardTitle>
                        <CardDescription>
                            Current visitor distribution
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <SimpleChart
                                data={visitorsChartData}
                                type="pie"
                                width={300}
                                height={250}
                                title="Visitor Activity"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Performance Metrics</CardTitle>
                        <CardDescription>
                            System and user performance indicators
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Conversion Rate</span>
                            <span className="font-semibold">{metrics.conversionRate.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Avg Session Duration</span>
                            <span className="font-semibold">{Math.floor(metrics.avgSessionDuration / 60)}m {metrics.avgSessionDuration % 60}s</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Page Load Time</span>
                            <span className="font-semibold">1.2s</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Bounce Rate</span>
                            <span className="font-semibold">34%</span>
                        </div>
                    </CardContent>
                </Card>

                {/* System Status */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>System Status</CardTitle>
                        <CardDescription>
                            Real-time system health monitoring
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Server Status</span>
                            <Badge variant="default" className="bg-green-100 text-green-800">Healthy</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Database</span>
                            <Badge variant="default" className="bg-green-100 text-green-800">Online</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Cache</span>
                            <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Uptime</span>
                            <span className="font-semibold">99.9%</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}