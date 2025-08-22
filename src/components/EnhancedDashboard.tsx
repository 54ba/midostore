"use client";

import React, { useState, useEffect } from 'react';
import {
  Globe,
  DollarSign,
  TrendingUp,
  Package,
  Truck,
  Eye,
  AlertTriangle,
  Clock,
  MapPin,
  BarChart3,
  Zap,
  Coins,
  Languages,
  Ship,
  CreditCard,
  Activity,
  Target,
  Users,
  ShoppingBag,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Settings,
  ShoppingCart
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import LiveSalesTicker from './LiveSalesTicker';

interface EnhancedDashboardProps {
  className?: string;
}

interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  customerSatisfaction: number;
  inventoryTurnover: number;
  shippingEfficiency: number;
  localizationCoverage: number;
}

interface WebAnalyticsData {
  pageviews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgTimeOnSite: number;
  referrers: Array<{ source: string; count: number }>;
  devices: Array<{ device: string; count: number }>;
  topPages: Array<{ page: string; views: number }>;
}

interface DashboardData {
  metrics: DashboardMetrics;
  webAnalytics: {
    googleAnalytics: WebAnalyticsData;
    simpleAnalytics: WebAnalyticsData;
  };
  recentOrders: Array<any>;
  topProducts: Array<any>;
  salesTrends: Array<any>;
}

interface PriceAlert {
  productId: string;
  productTitle: string;
  oldPrice: number;
  newPrice: number;
  currency: string;
  changePercent: number;
  isVolatile: boolean;
  timestamp: Date;
}

interface ShippingUpdate {
  trackingNumber: string;
  orderId: string;
  status: string;
  location: string;
  estimatedDelivery: Date;
  carrier: string;
}

export default function EnhancedDashboard({ className = '' }: EnhancedDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    customerSatisfaction: 0,
    inventoryTurnover: 0,
    shippingEfficiency: 0,
    localizationCoverage: 0,
  });

  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [shippingUpdates, setShippingUpdates] = useState<ShippingUpdate[]>([]);
  const [revenueData, setRevenueData] = useState([]);
  const [currencyData, setCurrencyData] = useState([]);
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, [selectedCurrency, timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch multiple data sources in parallel
      const [
        metricsResponse,
        alertsResponse,
        shippingResponse,
        revenueResponse,
      ] = await Promise.all([
        fetch(`/api/analytics?action=dashboard-metrics&currency=${selectedCurrency}&timeRange=${timeRange}`),
        fetch(`/api/localization?action=price-alerts&currency=${selectedCurrency}`),
        fetch(`/api/shipping?action=active-shipments&currency=${selectedCurrency}`),
        fetch(`/api/analytics?action=revenue-chart&currency=${selectedCurrency}&timeRange=${timeRange}`),
      ]);

      // Process responses
      if (metricsResponse.ok) {
        const data = await metricsResponse.json();
        if (data.success) {
          setMetrics(data.data);
        }
      }

      if (alertsResponse.ok) {
        const data = await alertsResponse.json();
        if (data.success) {
          setPriceAlerts(data.data);
        }
      }

      if (shippingResponse.ok) {
        const data = await shippingResponse.json();
        if (data.success) {
          setShippingUpdates(data.data);
        }
      }

      if (revenueResponse.ok) {
        const data = await revenueResponse.json();
        if (data.success) {
          setRevenueData(data.data);
        }
      }

      // Fetch currency data
      const currencyResponse = await fetch('/api/localization?action=currencies');
      if (currencyResponse.ok) {
        const data = await currencyResponse.json();
        if (data.success) {
          setCurrencyData(data.data);
        }
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  const formatCurrency = (amount: number, currency: string = selectedCurrency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      delivered: 'text-green-600',
      in_transit: 'text-blue-600',
      pending: 'text-yellow-600',
      exception: 'text-red-600',
    };
    return (colors as any)[status] || 'text-gray-600';
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-600" />
              Enhanced Analytics Dashboard
            </h1>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Real-time insights with localization, shipping, and analytics
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Currency Selector */}
            <select
              value={selectedCurrency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">🇺🇸 USD</option>
              <option value="EUR">🇪🇺 EUR</option>
              <option value="AED">🇦🇪 AED</option>
              <option value="SAR">🇸🇦 SAR</option>
            </select>

            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>

            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mt-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'localization', label: 'Localization', icon: Globe },
            { id: 'shipping', label: 'Shipping & Tracking', icon: Truck },
            { id: 'pricing', label: 'Price Intelligence', icon: TrendingUp },
            { id: 'ai-insights', label: 'AI Insights', icon: Zap },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === tab.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Sales Ticker - Enhanced Version */}
      <div className="border-b border-gray-200">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Live Sales & Updates
          </h3>
          <LiveSalesTicker />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(metrics.totalRevenue)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metrics.totalOrders.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Average Order Value</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(metrics.averageOrderValue)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metrics.conversionRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Price Alerts */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Recent Price Alerts
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {priceAlerts.slice(0, 5).map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{alert.productTitle}</p>
                        <p className="text-gray-600 text-xs">
                          {formatCurrency(alert.oldPrice)} → {formatCurrency(alert.newPrice)}
                        </p>
                      </div>
                      <div className={`text-right ${alert.changePercent > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        <p className="font-bold text-sm">
                          {alert.changePercent > 0 ? '+' : ''}{alert.changePercent.toFixed(1)}%
                        </p>
                        {alert.isVolatile && (
                          <AlertTriangle className="w-4 h-4 text-orange-500 ml-auto" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Updates */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  Shipping Updates
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {shippingUpdates.slice(0, 5).map((update, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">#{update.orderId}</p>
                        <p className="text-gray-600 text-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {update.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium text-sm ${getStatusColor(update.status)}`}>
                          {update.status.replace('_', ' ').toUpperCase()}
                        </p>
                        <p className="text-gray-500 text-xs">{update.carrier}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'localization' && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Globe className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Localization Dashboard</h3>
              <p className="text-gray-600 mb-6">Manage currencies, languages, and regional settings</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                  <Languages className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Supported Languages</h4>
                  <p className="text-2xl font-bold text-purple-900">15</p>
                  <p className="text-purple-600 text-sm">Active translations</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                  <Coins className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Supported Currencies</h4>
                  <p className="text-2xl font-bold text-green-900">{metrics.supportedCurrencies}</p>
                  <p className="text-green-600 text-sm">Including 25+ traditional currencies</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Ship className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Shipping & Tracking</h3>
              <p className="text-gray-600 mb-6">Monitor shipments and track deliveries worldwide</p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 text-sm">In Transit</h4>
                  <p className="text-xl font-bold text-blue-900">24</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                  <Truck className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 text-sm">Out for Delivery</h4>
                  <p className="text-xl font-bold text-green-900">8</p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                  <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 text-sm">Delivered</h4>
                  <p className="text-xl font-bold text-purple-900">156</p>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 text-sm">Exceptions</h4>
                  <p className="text-xl font-bold text-orange-900">3</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <TrendingUp className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Price Intelligence</h3>
              <p className="text-gray-600 mb-6">Real-time price monitoring and volatility analysis</p>

              <div className="bg-gradient-to-r from-yellow-50 to-red-50 p-6 rounded-lg max-w-2xl mx-auto">
                <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Volatile Products Alert</h4>
                <p className="text-2xl font-bold text-red-900">{metrics.volatileProductsCount}</p>
                <p className="text-red-600 text-sm">Products with unstable pricing</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai-insights' && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Zap className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
              <p className="text-gray-600 mb-6">Intelligent analysis of your business performance</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Insights</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Revenue increased by 23% compared to last month</li>
                    <li>• Top performing category: Electronics (34% of sales)</li>
                    <li>• Average order value trending upward</li>
                    <li>• Customer satisfaction score: 4.8/5</li>
                    <li>• Mobile conversion rate improved by 15%</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg text-left">
                  <h4 className="font-semibold text-gray-900 mb-3">💡 Optimization Tips</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Consider adding more payment options</li>
                    <li>• Optimize shipping rates for European customers</li>
                    <li>• Monitor volatile products more frequently</li>
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