"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Target,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Eye,
  MousePointer,
  Heart,
  Share2,
  MessageCircle,
  RefreshCw,
  Filter,
  Download,
  Calculator,
  Percent,
  ArrowUpDown
} from 'lucide-react';

// Mock bulk pricing data
const mockBulkPricingData = {
  overview: {
    totalProducts: 1240,
    activePricingRules: 156,
    totalRevenue: 89200.50,
    avgDiscount: 23.5
  },
  pricingTiers: [
    {
      id: 1,
      name: 'Bronze Tier',
      minQuantity: 1,
      maxQuantity: 9,
      discount: 0,
      color: 'bg-orange-100 text-orange-800'
    },
    {
      id: 2,
      name: 'Silver Tier',
      minQuantity: 10,
      maxQuantity: 49,
      discount: 15,
      color: 'bg-gray-100 text-gray-800'
    },
    {
      id: 3,
      name: 'Gold Tier',
      minQuantity: 50,
      maxQuantity: 99,
      discount: 25,
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 4,
      name: 'Platinum Tier',
      minQuantity: 100,
      maxQuantity: 999,
      discount: 35,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 5,
      name: 'Diamond Tier',
      minQuantity: 1000,
      maxQuantity: null,
      discount: 50,
      color: 'bg-purple-100 text-purple-800'
    }
  ],
  products: [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      basePrice: 89.99,
      category: 'Electronics',
      stock: 450,
      sales: 120
    },
    {
      id: 2,
      name: 'Organic Cotton T-Shirt',
      basePrice: 24.99,
      category: 'Clothing',
      stock: 1200,
      sales: 340
    },
    {
      id: 3,
      name: 'Smart Fitness Watch',
      basePrice: 199.99,
      category: 'Electronics',
      stock: 280,
      sales: 85
    },
    {
      id: 4,
      name: 'Natural Face Cream',
      basePrice: 34.99,
      category: 'Beauty',
      stock: 890,
      sales: 210
    }
  ]
};

export default function BulkPricingPage() {
  const [selectedProduct, setSelectedProduct] = useState(mockBulkPricingData.products[0]);
  const [quantity, setQuantity] = useState(1);
  const [pricingRule, setPricingRule] = useState(null);

  useEffect(() => {
    // Calculate pricing rule based on quantity
    const rule = mockBulkPricingData.pricingTiers.find(tier =>
      quantity >= tier.minQuantity && (tier.maxQuantity === null || quantity <= tier.maxQuantity)
    );
    setPricingRule(rule);
  }, [quantity]);

  const calculatePrice = () => {
    if (!pricingRule) return selectedProduct.basePrice;
    const discount = (selectedProduct.basePrice * pricingRule.discount) / 100;
    return selectedProduct.basePrice - discount;
  };

  const calculateTotal = () => {
    return calculatePrice() * quantity;
  };

  const calculateSavings = () => {
    const originalTotal = selectedProduct.basePrice * quantity;
    const discountedTotal = calculateTotal();
    return originalTotal - discountedTotal;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Dynamic Bulk Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Optimize your pricing strategy with intelligent volume-based discounts. Our AI-powered system automatically adjusts prices based on quantity, customer segments, and market conditions.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{mockBulkPricingData.overview.totalProducts.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Rules</p>
                  <p className="text-2xl font-bold text-gray-900">{mockBulkPricingData.overview.activePricingRules}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${mockBulkPricingData.overview.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Percent className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Discount</p>
                  <p className="text-2xl font-bold text-gray-900">{mockBulkPricingData.overview.avgDiscount}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Selection */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-5 h-5" />
                <span>Product Selection</span>
              </CardTitle>
              <CardDescription>Choose a product to see bulk pricing options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedProduct.id}
                  onChange={(e) => {
                    const product = mockBulkPricingData.products.find(p => p.id === parseInt(e.target.value));
                    setSelectedProduct(product);
                  }}
                >
                  {mockBulkPricingData.products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ${product.basePrice}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Base Price</p>
                  <p className="text-lg font-semibold text-gray-900">${selectedProduct.basePrice}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Stock Available</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedProduct.stock}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Results */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Pricing Results</span>
              </CardTitle>
              <CardDescription>See how quantity affects your pricing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pricingRule && (
                <div className={`p-4 rounded-lg ${pricingRule.color}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{pricingRule.name}</span>
                    <Badge variant="secondary">{pricingRule.discount}% OFF</Badge>
                  </div>
                  <p className="text-sm mt-1">
                    Quantity: {pricingRule.minQuantity}+
                    {pricingRule.maxQuantity && ` (up to ${pricingRule.maxQuantity})`}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Unit Price</span>
                  <span className="font-semibold">${calculatePrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-semibold">{quantity}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Total Price</span>
                  <span className="font-semibold text-lg">${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 bg-green-50 p-3 rounded-lg">
                  <span className="text-green-700 font-medium">Total Savings</span>
                  <span className="font-semibold text-lg text-green-700">${calculateSavings().toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Tiers */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Pricing Tiers</span>
            </CardTitle>
            <CardDescription>Our volume-based pricing structure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {mockBulkPricingData.pricingTiers.map(tier => (
                <div key={tier.id} className={`p-4 rounded-lg ${tier.color} text-center`}>
                  <h3 className="font-semibold mb-2">{tier.name}</h3>
                  <p className="text-sm mb-2">
                    {tier.minQuantity}+ items
                    {tier.maxQuantity && ` - ${tier.maxQuantity}`}
                  </p>
                  <p className="text-2xl font-bold">{tier.discount}% OFF</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Updates</h3>
              <p className="text-gray-600 text-sm">
                Pricing automatically adjusts based on inventory levels, demand, and competitor analysis.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Segmentation</h3>
              <p className="text-gray-600 text-sm">
                Different pricing rules for different customer segments and order volumes.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Analytics</h3>
              <p className="text-gray-600 text-sm">
                Track how pricing changes impact sales volume and revenue growth.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600">
          <p className="mb-2">Optimize your pricing strategy with intelligent bulk pricing tools</p>
          <p className="text-sm">© 2024 MidoStore. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}