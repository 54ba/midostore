"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  MapPin,
  Package,
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
  Brain,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp as TrendingUpIcon
} from 'lucide-react';

// Mock AI recommendations data
const mockRecommendations = {
  highPriority: [
    {
      id: 1,
      type: 'revenue',
      title: 'Optimize Product Pricing Strategy',
      description: 'Analysis shows 15% of products are priced below market average, potentially losing $2,400 monthly revenue.',
      impact: 'high',
      confidence: 94,
      estimatedValue: 2400,
      category: 'pricing',
      tags: ['revenue', 'pricing', 'optimization']
    },
    {
      id: 2,
      type: 'conversion',
      title: 'Improve Checkout Flow',
      description: 'Cart abandonment rate increased by 8% this month. A/B testing suggests simplified checkout could improve conversion by 12%.',
      impact: 'high',
      confidence: 89,
      estimatedValue: 1800,
      category: 'user-experience',
      tags: ['conversion', 'checkout', 'abandonment']
    },
    {
      id: 3,
      type: 'inventory',
      title: 'Restock High-Demand Products',
      description: '5 products showing high demand signals are running low on inventory. Restocking could prevent $1,200 in lost sales.',
      impact: 'high',
      confidence: 92,
      estimatedValue: 1200,
      category: 'inventory',
      tags: ['inventory', 'demand', 'restocking']
    }
  ],
  mediumPriority: [
    {
      id: 4,
      type: 'marketing',
      title: 'Target High-Value Customer Segments',
      description: 'Customer lifetime value analysis reveals untapped potential in the 25-34 age group. Targeted campaigns could increase LTV by 18%.',
      impact: 'medium',
      confidence: 76,
      estimatedValue: 900,
      category: 'marketing',
      tags: ['marketing', 'segmentation', 'lifetime-value']
    },
    {
      id: 5,
      type: 'performance',
      title: 'Optimize Page Load Speed',
      description: 'Mobile page load time is 2.8s, above the recommended 2s. Optimization could improve bounce rate by 6%.',
      impact: 'medium',
      confidence: 82,
      estimatedValue: 600,
      category: 'performance',
      tags: ['performance', 'mobile', 'speed']
    }
  ],
  lowPriority: [
    {
      id: 6,
      type: 'content',
      title: 'Enhance Product Descriptions',
      description: 'Product pages with detailed descriptions show 23% higher engagement. Consider expanding descriptions for top 20 products.',
      impact: 'low',
      confidence: 68,
      estimatedValue: 300,
      category: 'content',
      tags: ['content', 'engagement', 'descriptions']
    }
  ]
};

const mockInsights = {
  trends: [
    { metric: 'Revenue Growth', value: '+12.5%', trend: 'up', period: 'vs last month' },
    { metric: 'Customer Acquisition', value: '+8.3%', trend: 'up', period: 'vs last month' },
    { metric: 'Conversion Rate', value: '-2.1%', trend: 'down', period: 'vs last month' },
    { metric: 'Average Order Value', value: '+5.7%', trend: 'up', period: 'vs last month' }
  ],
  anomalies: [
    { type: 'spike', metric: 'Mobile Traffic', value: '+45%', date: '2024-01-15', description: 'Unusual spike in mobile traffic' },
    { type: 'drop', metric: 'Conversion Rate', value: '-15%', date: '2024-01-18', description: 'Significant drop in conversions' }
  ]
};

const mockPredictions = {
  nextWeek: [
    { metric: 'Revenue', prediction: '$8,200', confidence: '85%', trend: 'up' },
    { metric: 'Orders', prediction: '124', confidence: '78%', trend: 'up' },
    { metric: 'New Customers', prediction: '23', confidence: '82%', trend: 'up' }
  ],
  nextMonth: [
    { metric: 'Revenue', prediction: '$32,800', confidence: '72%', trend: 'up' },
    { metric: 'Orders', prediction: '498', confidence: '68%', trend: 'up' },
    { metric: 'Customer Growth', prediction: '+12%', confidence: '75%', trend: 'up' }
  ]
};

export default function AnalyticsRecommendationsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImpact, setSelectedImpact] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshRecommendations = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Lightbulb className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ?
      <TrendingUpIcon className="h-4 w-4 text-green-600" /> :
      <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const filteredRecommendations = [
    ...mockRecommendations.highPriority,
    ...mockRecommendations.mediumPriority,
    ...mockRecommendations.lowPriority
  ].filter(rec => {
    const matchesCategory = selectedCategory === 'all' || rec.category === selectedCategory;
    const matchesImpact = selectedImpact === 'all' || rec.impact === selectedImpact;
    const matchesSearch = rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rec.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rec.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesImpact && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI-Powered Recommendations</h1>
          <p className="text-muted-foreground">
            Intelligent insights and actionable recommendations to optimize your business
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={refreshRecommendations} disabled={isRefreshing}>
            <Brain className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh AI Analysis
          </Button>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recommendations</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredRecommendations.length}</div>
            <p className="text-xs text-muted-foreground">
              AI-generated insights
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockRecommendations.highPriority.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Immediate action required
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${filteredRecommendations.reduce((sum, rec) => sum + rec.estimatedValue, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly opportunity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(filteredRecommendations.reduce((sum, rec) => sum + rec.confidence, 0) / filteredRecommendations.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              AI prediction accuracy
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search recommendations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Categories</option>
            <option value="pricing">Pricing</option>
            <option value="user-experience">User Experience</option>
            <option value="inventory">Inventory</option>
            <option value="marketing">Marketing</option>
            <option value="performance">Performance</option>
            <option value="content">Content</option>
          </select>
          <select
            value={selectedImpact}
            onChange={(e) => setSelectedImpact(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Impact Levels</option>
            <option value="high">High Impact</option>
            <option value="medium">Medium Impact</option>
            <option value="low">Low Impact</option>
          </select>
        </div>
      </div>

      {/* High Priority Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            High Priority Recommendations
          </CardTitle>
          <CardDescription>
            Immediate action required - these recommendations have the highest potential impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecommendations.highPriority.map((rec) => (
              <div key={rec.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getImpactColor(rec.impact)}>
                        {getImpactIcon(rec.impact)}
                        <span className="ml-1">{rec.impact.toUpperCase()} PRIORITY</span>
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {rec.confidence}% confidence
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{rec.title}</h3>
                    <p className="text-gray-600 mb-3">{rec.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Category: {rec.category}</span>
                      <span>Estimated Value: ${rec.estimatedValue.toLocaleString()}/month</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Implement
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medium Priority Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-yellow-600">
            <Lightbulb className="h-5 w-5 mr-2" />
            Medium Priority Recommendations
          </CardTitle>
          <CardDescription>
            Important optimizations that can improve performance over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecommendations.mediumPriority.map((rec) => (
              <div key={rec.id} className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getImpactColor(rec.impact)}>
                        {getImpactIcon(rec.impact)}
                        <span className="ml-1">{rec.impact.toUpperCase()} PRIORITY</span>
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {rec.confidence}% confidence
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{rec.title}</h3>
                    <p className="text-gray-600 mb-3">{rec.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Category: {rec.category}</span>
                      <span>Estimated Value: ${rec.estimatedValue.toLocaleString()}/month</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Low Priority Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-blue-600">
            <CheckCircle className="h-5 w-5 mr-2" />
            Low Priority Recommendations
          </CardTitle>
          <CardDescription>
            Nice-to-have improvements for long-term optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecommendations.lowPriority.map((rec) => (
              <div key={rec.id} className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getImpactColor(rec.impact)}>
                        {getImpactIcon(rec.impact)}
                        <span className="ml-1">{rec.impact.toUpperCase()} PRIORITY</span>
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {rec.confidence}% confidence
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{rec.title}</h3>
                    <p className="text-gray-600 mb-3">{rec.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Category: {rec.category}</span>
                      <span>Estimated Value: ${rec.estimatedValue.toLocaleString()}/month</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Consider
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights and Trends */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Key Trends & Insights
            </CardTitle>
            <CardDescription>AI-detected patterns and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockInsights.trends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{trend.metric}</div>
                    <div className="text-sm text-muted-foreground">{trend.period}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(trend.trend)}
                    <span className={`font-semibold ${trend.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {trend.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-orange-600" />
              Anomaly Detection
            </CardTitle>
            <CardDescription>Unusual patterns requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockInsights.anomalies.map((anomaly, index) => (
                <div key={index} className={`p-3 border rounded-lg ${
                  anomaly.type === 'spike' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={anomaly.type === 'spike' ? 'default' : 'destructive'}>
                      {anomaly.type.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{anomaly.date}</span>
                  </div>
                  <div className="font-medium">{anomaly.metric}</div>
                  <div className="text-sm text-muted-foreground">{anomaly.description}</div>
                  <div className={`font-semibold mt-1 ${
                    anomaly.type === 'spike' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {anomaly.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-600" />
            AI Predictions
          </CardTitle>
          <CardDescription>Forecasted performance based on current trends and patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-600">Next Week Forecast</h3>
              <div className="space-y-3">
                {mockPredictions.nextWeek.map((pred, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{pred.metric}</div>
                      <div className="text-sm text-muted-foreground">{pred.confidence} confidence</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(pred.trend)}
                      <span className="font-semibold text-green-600">{pred.prediction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Next Month Forecast</h3>
              <div className="space-y-3">
                {mockPredictions.nextMonth.map((pred, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{pred.metric}</div>
                      <div className="text-sm text-muted-foreground">{pred.confidence} confidence</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(pred.trend)}
                      <span className="font-semibold text-blue-600">{pred.prediction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}