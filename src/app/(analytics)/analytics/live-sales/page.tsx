"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, DollarSign, ShoppingCart, Users, Clock, MapPin, Package } from 'lucide-react';

// Mock live sales data
const mockLiveSales = [
  {
    id: 1,
    customer: "John Smith",
    product: "Wireless Headphones",
    amount: 89.99,
    location: "New York, NY",
    time: "2 minutes ago",
    status: "completed",
    seller: "TechStore Pro"
  },
  {
    id: 2,
    customer: "Sarah Johnson",
    product: "Smart Watch",
    amount: 199.99,
    location: "Los Angeles, CA",
    time: "5 minutes ago",
    status: "processing",
    seller: "GadgetWorld"
  },
  {
    id: 3,
    customer: "Mike Davis",
    product: "Laptop Stand",
    amount: 45.50,
    location: "Chicago, IL",
    time: "8 minutes ago",
    status: "completed",
    seller: "Office Essentials"
  },
  {
    id: 4,
    customer: "Emily Wilson",
    product: "Bluetooth Speaker",
    amount: 129.99,
    location: "Miami, FL",
    time: "12 minutes ago",
    status: "shipped",
    seller: "AudioTech"
  },
  {
    id: 5,
    customer: "David Brown",
    product: "Phone Case",
    amount: 24.99,
    location: "Seattle, WA",
    time: "15 minutes ago",
    status: "completed",
    seller: "Mobile Accessories"
  }
];

// Mock real-time metrics
const mockMetrics = {
  totalSales: 12450.75,
  todayOrders: 156,
  activeUsers: 89,
  conversionRate: 3.2,
  avgOrderValue: 79.81,
  topProduct: "Wireless Headphones",
  topSeller: "TechStore Pro"
};

export default function LiveSalesPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Sales Dashboard</h1>
          <p className="text-gray-600">Real-time sales tracking and analytics</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-lg font-semibold text-gray-900">
              {currentTime.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <Activity className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales Today</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockMetrics.totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.todayOrders}</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Currently browsing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              +0.3% from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Live Sales Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-600" />
                <span>Live Sales Feed</span>
              </CardTitle>
              <CardDescription>
                Real-time updates of recent sales and orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLiveSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{sale.customer}</p>
                        <p className="text-sm text-gray-600">{sale.product}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{sale.location}</span>
                          <Clock className="h-3 w-3 text-gray-400 ml-2" />
                          <span className="text-xs text-gray-500">{sale.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-green-600">${sale.amount}</p>
                      <Badge className={getStatusColor(sale.status)}>
                        {sale.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{sale.seller}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Insights */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Best performing products and sellers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Product</p>
                <p className="text-lg font-semibold text-gray-900">{mockMetrics.topProduct}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Top Seller</p>
                <p className="text-lg font-semibold text-gray-900">{mockMetrics.topSeller}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-lg font-semibold text-gray-900">${mockMetrics.avgOrderValue}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales Trends</CardTitle>
              <CardDescription>Hourly performance today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {i === 0 ? 'Now' : `${i * 2}:00`}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${Math.random() * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        ${Math.floor(Math.random() * 2000 + 500)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Geographic Sales Distribution</CardTitle>
          <CardDescription>Sales by location in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['New York', 'Los Angeles', 'Chicago', 'Miami'].map((city) => (
              <div key={city} className="text-center p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900">{city}</h3>
                <p className="text-2xl font-bold text-blue-600">
                  ${Math.floor(Math.random() * 3000 + 1000)}
                </p>
                <p className="text-sm text-gray-500">
                  {Math.floor(Math.random() * 50 + 10)} orders
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}