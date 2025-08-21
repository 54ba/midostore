"use client";

import React from 'react';
import { useAuthBridge } from '@/app/contexts/AuthContext';
import AdvertisingDashboard from '@/components/AdvertisingDashboard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdvertisingPage() {
  const { user, loading } = useAuthBridge();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const userId = (user as any)?.id || (user as any)?.userId || (user as any)?.user_id || (user as any)?.userId || (user as any)?.user_id || "anonymous" || 'anonymous';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Advertising Center</h1>
          <p className="mt-2 text-gray-600">
            Create, manage, and optimize your ad campaigns across multiple platforms
          </p>
        </div>

        {/* Advertising Dashboard */}
        <AdvertisingDashboard userId={userId} />

        {/* Quick Tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Smart Targeting</h3>
            </div>
            <p className="text-blue-700 text-sm">
              Use AI-powered targeting suggestions to reach your ideal customers based on product category and behavior patterns.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">Performance Tracking</h3>
            </div>
            <p className="text-green-700 text-sm">
              Monitor real-time performance metrics including impressions, clicks, conversions, and ROI across all platforms.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Credit System</h3>
            </div>
            <p className="text-purple-700 text-sm">
              Manage your advertising budget with our flexible credit system. Purchase credits and track usage in real-time.
            </p>
          </div>
        </div>

        {/* Platform Benefits */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Supported Advertising Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Facebook Ads',
                description: 'Reach billions of users with targeted social media advertising',
                features: ['Advanced targeting', 'Multiple ad formats', 'Real-time optimization'],
                minBudget: '$5',
              },
              {
                name: 'Google Ads',
                description: 'Capture high-intent customers through search and display advertising',
                features: ['Search network', 'Display network', 'Shopping ads'],
                minBudget: '$10',
              },
              {
                name: 'Instagram Ads',
                description: 'Engage visual audiences with stunning image and video ads',
                features: ['Story ads', 'Feed ads', 'Reels ads'],
                minBudget: '$5',
              },
              {
                name: 'TikTok Ads',
                description: 'Connect with Gen Z through creative short-form video content',
                features: ['In-feed ads', 'TopView ads', 'Branded effects'],
                minBudget: '$20',
              },
              {
                name: 'Twitter Ads',
                description: 'Engage in real-time conversations with promoted content',
                features: ['Promoted tweets', 'Promoted accounts', 'Promoted trends'],
                minBudget: '$5',
              },
              {
                name: 'LinkedIn Ads',
                description: 'Target B2B audiences with professional advertising solutions',
                features: ['Sponsored content', 'Message ads', 'Dynamic ads'],
                minBudget: '$10',
              },
            ].map((platform, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2">{platform.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{platform.description}</p>
                <div className="space-y-1 mb-3">
                  {platform.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  Min budget: <span className="font-medium">{platform.minBudget}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Import CheckCircle icon
import { CheckCircle, Database, Flame, Target, TrendingUp, Zap, AlertCircle } from 'lucide-react';