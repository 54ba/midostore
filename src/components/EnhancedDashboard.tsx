"use client";

import React, { useState, useEffect } from 'react';
import {
  Globe,
  DollarSign,
  TrendingUp,
  Package,
  Truck,
  Bitcoin,
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
  Settings
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import LiveSalesTicker from './LiveSalesTicker';

interface EnhancedDashboardProps {
  userId: string;
  className?: string;
}

interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  cryptoRevenue: number;
  volatileProductsCount: number;
  activeShipments: number;
  conversionRate: number;
  averageOrderValue: number;
  supportedCurrencies: number;
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

export default function EnhancedDashboard({ userId, className = '' }: EnhancedDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRevenue: 0,
    totalOrders: 0,
    cryptoRevenue: 0,
    volatileProductsCount: 0,
    activeShipments: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    supportedCurrencies: 0,
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
    const interval = setInterval(fetchDashboardData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [userId, selectedCurrency, timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch multiple data sources in parallel
      const [
        metricsResponse,
        alertsResponse,
        shippingResponse,
        revenueResponse,
        cryptoResponse,
      ] = await Promise.all([
        fetch(`/api/analytics?action=dashboard-metrics&userId=${userId}&currency=${selectedCurrency}&timeRange=${timeRange}`),
        fetch(`/api/localization?action=price-alerts&currency=${selectedCurrency}`),
        fetch(`/api/shipping?action=active-shipments&userId=${userId}`),
        fetch(`/api/analytics?action=revenue-chart&userId=${userId}&currency=${selectedCurrency}&timeRange=${timeRange}`),
        fetch(`/api/crypto?action=portfolio-summary&userId=${userId}`),
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

      if (cryptoResponse.ok) {
        const data = await cryptoResponse.json();
        if (data.success) {
          setCryptoData(data.data);
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
            <p className="text-gray-600 mt-2">
              Real-time insights with crypto, localization, and shipping analytics
            </p>
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
              <option value="BTC">₿ BTC</option>
              <option value="ETH">Ξ ETH</option>
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
            { id: 'crypto', label: 'Crypto Analytics', icon: Bitcoin },
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {formatCurrency(metrics.totalRevenue)}
                    </p>
                    <p className="text-blue-600 text-xs mt-1">+12.5% from last period</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Crypto Revenue</p>
                    <p className="text-2xl font-bold text-green-900">
                      {formatCurrency(metrics.cryptoRevenue)}
                    </p>
                    <p className="text-green-600 text-xs mt-1">₿ {(metrics.cryptoRevenue / 43000).toFixed(4)} BTC</p>
                  </div>
                  <Bitcoin className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Active Shipments</p>
                    <p className="text-2xl font-bold text-purple-900">{metrics.activeShipments}</p>
                    <p className="text-purple-600 text-xs mt-1">Across {currencyData.length} countries</p>
                  </div>
                  <Package className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">Volatile Products</p>
                    <p className="text-2xl font-bold text-orange-900">{metrics.volatileProductsCount}</p>
                    <p className="text-orange-600 text-xs mt-1">Require monitoring</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="traditional" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="crypto" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
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

        {activeTab === 'crypto' && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Bitcoin className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cryptocurrency Analytics</h3>
              <p className="text-gray-600 mb-6">Monitor crypto payments, portfolio performance, and market trends</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg">
                  <Bitcoin className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Bitcoin Payments</h4>
                  <p className="text-2xl font-bold text-orange-900">₿ 2.45</p>
                  <p className="text-orange-600 text-sm">$105,420</p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">Ξ</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Ethereum Payments</h4>
                  <p className="text-2xl font-bold text-blue-900">Ξ 45.2</p>
                  <p className="text-blue-600 text-sm">$89,340</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg">
                  <Coins className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Stablecoin Payments</h4>
                  <p className="text-2xl font-bold text-green-900">₮ 25,680</p>
                  <p className="text-green-600 text-sm">USDT</p>
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
                  <p className="text-green-600 text-sm">Including 8 cryptocurrencies</p>
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
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg text-left">
                  <h4 className="font-semibold text-gray-900 mb-3">📈 Revenue Predictions</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Expected 23% growth in crypto payments next month</li>
                    <li>• Gulf region showing 18% increase in orders</li>
                    <li>• Electronics category performing above average</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg text-left">
                  <h4 className="font-semibold text-gray-900 mb-3">💡 Optimization Tips</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Consider adding more crypto payment options</li>
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