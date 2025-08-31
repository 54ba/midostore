"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  Loader2,
  RefreshCw,
  AlertCircle,
  Package,
  Star,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  Search,
  Share2,
  Target,
  Zap
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useWebSocket } from '@/hooks/useWebSocket';

// Dynamically import Chart.js components
const Chart = dynamic(() => import('chart.js/auto'), { ssr: false });

interface EnhancedAnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  customerLifetimeValue: number;
  repeatCustomerRate: number;
  revenueTrend: {
    daily: Array<{ date: string; value: number; timestamp: string }>;
    weekly: Array<{ date: string; value: number; timestamp: string }>;
    monthly: Array<{ date: string; value: number; timestamp: string }>;
  };
  orderTrend: {
    daily: Array<{ date: string; value: number; timestamp: string }>;
    weekly: Array<{ date: string; value: number; timestamp: string }>;
    monthly: Array<{ date: string; value: number; timestamp: string }>;
  };
  geographicData: Array<{
    country: string;
    revenue: number;
    orders: number;
    percentage: number;
  }>;
  deviceAnalytics: Array<{
    device: string;
    revenue: number;
    orders: number;
    percentage: number;
  }>;
  trafficSources: Array<{
    source: string;
    revenue: number;
    orders: number;
    percentage: number;
  }>;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
    profitMargin: number;
    category: string;
    rating: number;
    reviewCount: number;
    returnRate: number;
    avgOrderValue: number;
  }>;
  customerSegmentation: Array<{
    segment: string;
    count: number;
    revenue: number;
    avgOrderValue: number;
  }>;
  inventoryAnalytics: {
    totalProducts: number;
    lowStockItems: number;
    outOfStockItems: number;
    topSellingCategories: Array<{
      category: string;
      revenue: number;
      percentage: number;
    }>;
  };
  predictiveAnalytics: {
    nextMonthRevenue: number;
    growthRate: number;
    seasonalTrend: string;
    recommendedActions: string[];
  };
}

export default function EnhancedAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<EnhancedAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [activeTab, setActiveTab] = useState('overview');

  // WebSocket for real-time updates
  const { isConnected, lastMessage, subscribe, unsubscribe } = useWebSocket({
    autoConnect: true,
    autoReconnect: true
  });

  useEffect(() => {
    fetchEnhancedAnalyticsData();

    // Subscribe to real-time updates
    if (isConnected) {
      subscribe('analytics');
      subscribe('orders');
      subscribe('inventory');
    }

    return () => {
      unsubscribe('analytics');
      unsubscribe('orders');
      unsubscribe('inventory');
    };
  }, [isConnected, subscribe, unsubscribe]);

  // Handle real-time messages
  useEffect(() => {
    if (lastMessage && analyticsData) {
      handleRealTimeUpdate(lastMessage);
    }
  }, [lastMessage, analyticsData]);

  const fetchEnhancedAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/analytics/overview');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAnalyticsData(data.data);
        } else {
          throw new Error(data.error || 'Failed to fetch enhanced analytics data');
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching enhanced analytics data:', error);
      setError('Failed to load enhanced analytics data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRealTimeUpdate = (message: any) => {
    if (!analyticsData) return;

    switch (message.type) {
      case 'analytics_update':
        // Update live metrics
        setAnalyticsData(prev => prev ? {
          ...prev,
          totalRevenue: message.data.revenueToday || prev.totalRevenue,
          totalOrders: (prev.totalOrders + (message.data.newOrders || 0)),
          conversionRate: message.data.conversionRate || prev.conversionRate
        } : null);
        break;

      case 'orders_update':
        // Update order metrics
        setAnalyticsData(prev => prev ? {
          ...prev,
          totalOrders: (prev.totalOrders + (message.data.newOrders || 0))
        } : null);
        break;

      case 'inventory_update':
        // Update inventory metrics
        setAnalyticsData(prev => prev ? {
          ...prev,
          inventoryAnalytics: {
            ...prev.inventoryAnalytics,
            lowStockItems: message.data.lowStockItems || prev.inventoryAnalytics.lowStockItems,
            outOfStockItems: message.data.outOfStockItems || prev.inventoryAnalytics.outOfStockItems
          }
        } : null);
        break;
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchEnhancedAnalyticsData();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${(num * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading enhanced analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Analytics</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchEnhancedAnalyticsData} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
          <p className="text-gray-600">No enhanced analytics data available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Analytics</h1>
          <p className="text-gray-600">Advanced business intelligence with real-time insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            {isConnected ? 'Live' : 'Offline'}
          </Badge>
          <Button
            onClick={refreshData}
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Timeframe:</span>
        <div className="flex space-x-2">
          {(['daily', 'weekly', 'monthly'] as const).map((timeframe) => (
            <Button
              key={timeframe}
              variant={selectedTimeframe === timeframe ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe(timeframe)}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analyticsData.totalRevenue)}</div>
                <p className="text-xs text-green-600">+{analyticsData.predictiveAnalytics.growthRate * 100}% growth</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analyticsData.totalOrders)}</div>
                <p className="text-xs text-blue-600">+15.2% from last period</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer LTV</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analyticsData.customerLifetimeValue)}</div>
                <p className="text-xs text-purple-600">+8.5% from last period</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <Target className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.conversionRate}%</div>
                <p className="text-xs text-orange-600">+2.1% from last period</p>
              </CardContent>
            </Card>
          </div>

          {/* Geographic and Device Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Geographic Performance
                </CardTitle>
                <CardDescription>
                  Revenue by country
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.geographicData.map((geo, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium">{geo.country}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(geo.revenue)}</div>
                        <div className="text-xs text-gray-500">{geo.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Device Analytics
                </CardTitle>
                <CardDescription>
                  Performance by device type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.deviceAnalytics.map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium">{device.device}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(device.revenue)}</div>
                        <div className="text-xs text-gray-500">{device.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Traffic Sources Performance</CardTitle>
              <CardDescription>
                Revenue and orders by traffic source
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.trafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Search className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{source.source}</p>
                        <p className="text-sm text-gray-600">{source.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(source.revenue)}</p>
                      <p className="text-sm text-gray-500">{source.percentage}% of total</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Customer Segmentation</CardTitle>
              <CardDescription>
                Customer value analysis and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.customerSegmentation.map((segment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{segment.segment}</p>
                        <p className="text-sm text-gray-600">{segment.count} customers</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(segment.revenue)}</p>
                      <p className="text-sm text-gray-500">Avg: {formatCurrency(segment.avgOrderValue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>
                Best sellers with detailed metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{product.category}</span>
                          <span>•</span>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                            {product.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(product.revenue)}</p>
                      <p className="text-sm text-gray-500">
                        {product.sales} sales • {formatPercentage(product.profitMargin)} margin
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Predictive Analytics</CardTitle>
              <CardDescription>
                AI-powered insights and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Next Month Revenue</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(analyticsData.predictiveAnalytics.nextMonthRevenue)}
                    </p>
                    <p className="text-sm text-blue-700">
                      {analyticsData.predictiveAnalytics.growthRate * 100}% growth expected
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Seasonal Trend</h4>
                    <p className="text-lg font-medium text-green-600 capitalize">
                      {analyticsData.predictiveAnalytics.seasonalTrend}
                    </p>
                    <p className="text-sm text-green-700">
                      Market conditions favorable
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 mb-3">Recommended Actions</h4>
                  {analyticsData.predictiveAnalytics.recommendedActions.map((action, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}