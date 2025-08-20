"use client";

import React, { useState } from 'react';
import {
  ShoppingBag,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  Star,
  BarChart3,
  Globe,
  Zap
} from 'lucide-react';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import EnhancedAnalyticsDashboard from '@/components/EnhancedAnalyticsDashboard';

export default function DashboardPage() {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsType, setAnalyticsType] = useState<'basic' | 'enhanced'>('enhanced');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Toggle */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {showAnalytics ? 'Analytics Dashboard' : 'Welcome to Your Dashboard'}
            </h1>
            <p className="text-gray-600 mt-2">
              {showAnalytics
                ? analyticsType === 'enhanced'
                  ? 'SimpleAnalytics + AI-powered insights for your dropshipping store'
                  : 'AI-powered insights and trends for your dropshipping store'
                : 'Manage your dropshipping business'
              }
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {showAnalytics && (
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border">
                <button
                  onClick={() => setAnalyticsType('basic')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${analyticsType === 'basic'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <BarChart3 className="h-4 w-4 inline mr-2" />
                  Basic AI
                </button>
                <button
                  onClick={() => setAnalyticsType('enhanced')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${analyticsType === 'enhanced'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <Globe className="h-4 w-4 inline mr-2" />
                  SimpleAnalytics + AI
                </button>
              </div>
            )}

            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              {showAnalytics ? (
                <>
                  <BarChart3 className="h-5 w-5" />
                  <span>Basic Dashboard</span>
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  <span>Analytics Dashboard</span>
                </>
              )}
            </button>
          </div>
        </div>

        {showAnalytics ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {analyticsType === 'enhanced' ? (
              <EnhancedAnalyticsDashboard />
            ) : (
              <AnalyticsDashboard />
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Dashboard Overview
            </h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Products</p>
                    <p className="text-3xl font-bold">1,247</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-200" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+12.5%</span>
                  <span className="ml-1 opacity-75">from last month</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Orders</p>
                    <p className="text-3xl font-bold">892</p>
                  </div>
                  <ShoppingBag className="h-8 w-8 text-green-200" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+8.3%</span>
                  <span className="ml-1 opacity-75">from last month</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
                    <p className="text-3xl font-bold">$45,678</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-200" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+15.2%</span>
                  <span className="ml-1 opacity-75">from last month</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Total Customers</p>
                    <p className="text-3xl font-bold">456</p>
                  </div>
                  <Users className="h-8 w-8 text-orange-200" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+6.7%</span>
                  <span className="ml-1 opacity-75">from last month</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Manage Products</h3>
                    <p className="text-sm text-gray-600">Add, edit, or remove products</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <ShoppingBag className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">View Orders</h3>
                    <p className="text-sm text-gray-600">Check order status and details</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Reviews</h3>
                    <p className="text-sm text-gray-600">Manage product reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}