"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MapPin,
  Globe,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Eye,
  MousePointer,
  Heart,
  Share2,
  MessageCircle,
  RefreshCw,
  Filter,
  Download
} from 'lucide-react';

// Mock location-based analytics data
const mockLocationData = {
  overview: {
    totalCountries: 24,
    totalCities: 156,
    activeRegions: 8,
    topPerformingRegion: 'North America',
    revenueGrowth: 18.5,
    orderGrowth: 12.3,
    userGrowth: 22.1
  },
  topRegions: [
    {
      name: 'North America',
      revenue: 45600.50,
      orders: 342,
      users: 189,
      growth: 18.5,
      topCities: ['New York', 'Los Angeles', 'Toronto', 'Chicago']
    },
    {
      name: 'Europe',
      revenue: 32400.75,
      orders: 267,
      users: 156,
      growth: 15.2,
      topCities: ['London', 'Berlin', 'Paris', 'Amsterdam']
    },
    {
      name: 'Asia Pacific',
      revenue: 28900.25,
      orders: 234,
      users: 134,
      growth: 25.7,
      topCities: ['Tokyo', 'Singapore', 'Sydney', 'Seoul']
    },
    {
      name: 'Latin America',
      revenue: 18700.00,
      orders: 145,
      users: 89,
      growth: 31.2,
      topCities: ['São Paulo', 'Mexico City', 'Buenos Aires', 'Lima']
    }
  ],
  cityPerformance: [
    { name: 'New York', revenue: 8900.50, orders: 67, users: 34, growth: 22.3 },
    { name: 'London', revenue: 7200.75, orders: 54, users: 28, growth: 18.7 },
    { name: 'Tokyo', revenue: 6800.25, orders: 51, users: 26, growth: 28.9 },
    { name: 'Los Angeles', revenue: 6500.00, orders: 49, users: 25, growth: 19.4 },
    { name: 'Berlin', revenue: 5800.50, orders: 43, users: 22, growth: 16.2 },
    { name: 'Singapore', revenue: 5400.75, orders: 41, users: 21, growth: 24.6 }
  ],
  geographicInsights: [
    {
      insight: 'High mobile usage in Asia Pacific',
      impact: 'high',
      description: 'Mobile conversion rates 35% higher than desktop in APAC region',
      recommendation: 'Optimize mobile experience for Asian markets'
    },
    {
      insight: 'Seasonal patterns in Europe',
      impact: 'medium',
      description: 'Q4 revenue spikes 40% higher in European markets',
      recommendation: 'Plan seasonal campaigns for European customers'
    },
    {
      insight: 'Urban concentration in North America',
      impact: 'medium',
      description: '80% of revenue comes from top 10 metropolitan areas',
      recommendation: 'Focus marketing efforts on major urban centers'
    }
  ]
};

export default function LocationBasedAnalyticsPage() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const getMetricValue = (item: any, metric: string) => {
    switch (metric) {
      case 'revenue':
        return `$${item.revenue.toLocaleString()}`;
      case 'orders':
        return item.orders.toLocaleString();
      case 'users':
        return item.users.toLocaleString();
      default:
        return `$${item.revenue.toLocaleString()}`;
    }
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'revenue':
        return <DollarSign className="h-4 w-4" />;
      case 'orders':
        return <ShoppingCart className="h-4 w-4" />;
      case 'users':
        return <Users className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <a href="/">
                <Button variant="ghost" size="sm">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
                </Button>
              </a>
              <div className="flex items-center space-x-3">
                <Globe className="h-8 w-8 text-green-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Location-Based Analytics</h1>
                  <p className="text-sm text-gray-600">Geographic insights and regional performance</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Live Data
              </Badge>
              <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Tools</h2>
            <div className="space-y-3">
              <a href="/analytics/overview">
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Overview</h3>
                      <p className="text-sm text-gray-600">General analytics dashboard</p>
                    </div>
                  </div>
                </div>
              </a>
              <a href="/analytics/live-sales">
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <Activity className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Live Sales</h3>
                      <p className="text-sm text-gray-600">Real-time sales tracking</p>
                    </div>
                  </div>
                </div>
              </a>
              <a href="/analytics/enhanced">
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Enhanced</h3>
                      <p className="text-sm text-gray-600">Advanced analytics features</p>
                    </div>
                  </div>
                </div>
              </a>
              <a href="/analytics/recommendations">
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Recommendations</h3>
                      <p className="text-sm text-gray-600">AI-powered insights</p>
                    </div>
                  </div>
                </div>
              </a>
              <a href="/analytics/location-based">
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-green-300 shadow-md cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-200 rounded-lg">
                      <PieChart className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-700">Location-Based</h3>
                      <p className="text-sm text-green-600">Geographic analytics</p>
                    </div>
                  </div>
                </div>
              </a>
              <a href="/analytics/social-trends">
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Social Trends</h3>
                      <p className="text-sm text-gray-600">Social media analysis</p>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Countries</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockLocationData.overview.totalCountries}</div>
                  <p className="text-xs text-muted-foreground">Active markets</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cities</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockLocationData.overview.totalCities}</div>
                  <p className="text-xs text-muted-foreground">Urban centers</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">+{mockLocationData.overview.revenueGrowth}%</div>
                  <p className="text-xs text-muted-foreground">vs last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Region</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockLocationData.overview.topPerformingRegion}</div>
                  <p className="text-xs text-muted-foreground">Best performer</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input placeholder="Search locations..." />
              </div>
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <option value="all">All Regions</option>
                  <option value="north-america">North America</option>
                  <option value="europe">Europe</option>
                  <option value="asia-pacific">Asia Pacific</option>
                  <option value="latin-america">Latin America</option>
                </select>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                >
                  <option value="revenue">Revenue</option>
                  <option value="orders">Orders</option>
                  <option value="users">Users</option>
                </select>
              </div>
            </div>

            {/* Regional Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-green-600" />
                  Regional Performance
                </CardTitle>
                <CardDescription>Performance metrics by geographic region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLocationData.topRegions.map((region, index) => (
                    <div key={region.name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <h3 className="font-semibold text-lg">{region.name}</h3>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            +{region.growth}%
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            ${region.revenue.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {region.orders} orders • {region.users} users
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Top cities: {region.topCities.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* City Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Top Performing Cities
                </CardTitle>
                <CardDescription>Revenue and performance by city</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockLocationData.cityPerformance.map((city, index) => (
                    <div key={city.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{city.name}</div>
                          <div className="text-sm text-gray-500">
                            {city.orders} orders • {city.users} users
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          ${city.revenue.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          +{city.growth}% growth
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Geographic Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-purple-600" />
                  Geographic Insights
                </CardTitle>
                <CardDescription>Key insights and recommendations by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLocationData.geographicInsights.map((insight, index) => (
                    <div key={index} className={`p-4 border rounded-lg ${
                      insight.impact === 'high' ? 'border-red-200 bg-red-50' :
                      insight.impact === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                      'border-blue-200 bg-blue-50'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={insight.impact === 'high' ? 'destructive' : 'secondary'}>
                              {insight.impact.toUpperCase()} IMPACT
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{insight.insight}</h3>
                          <p className="text-gray-600 mb-3">{insight.description}</p>
                          <div className="text-sm text-gray-500">
                            Recommendation: {insight.recommendation}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}