"use client";

import React, { useState, useEffect } from 'react';
import {
  Zap,
  Shield,
  Truck,
  Globe,
  TrendingUp,
  Users,
  Clock,
  Award,
  CheckCircle,
  Star,
  Heart,
  Rocket,
  Brain,
  BarChart3,
  Cpu,
  Package,
  Target,
  Lightbulb,
  Network,
  Eye
} from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  isActive: boolean;
  usageCount: number;
  rating: number;
}

interface FeatureGridProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function FeatureGrid({
  title = "Why Choose MidoHub?",
  subtitle = "Our platform is designed specifically for the Gulf region, offering seamless integration with Alibaba's vast supplier network and AI-powered insights.",
  className = ""
}: FeatureGridProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real features from API
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/features');
        const data = await response.json();

        if (data.success) {
          setFeatures(data.data);
        } else {
          throw new Error(data.error || 'Failed to fetch features');
        }
      } catch (err) {
        console.error('Error fetching features:', err);
        setError('Failed to load features');

        // Fallback to default features
        setFeatures([
          {
            id: 'fallback-1',
            title: 'AI-Powered Recommendations',
            description: 'Intelligent product suggestions based on user behavior and preferences',
            icon: 'Brain',
            category: 'AI',
            isActive: true,
            usageCount: 15420,
            rating: 4.8
          },
          {
            id: 'fallback-2',
            title: 'Real-Time Analytics',
            description: 'Live business metrics and performance tracking',
            icon: 'BarChart3',
            category: 'Analytics',
            isActive: true,
            usageCount: 12890,
            rating: 4.7
          },
          {
            id: 'fallback-3',
            title: 'Crypto Payment Processing',
            description: 'Accept Bitcoin, Ethereum, and other cryptocurrencies',
            icon: 'Zap',
            category: 'Payments',
            isActive: true,
            usageCount: 9870,
            rating: 4.6
          },
          {
            id: 'fallback-4',
            title: 'P2P Marketplace',
            description: 'Decentralized peer-to-peer trading platform',
            icon: 'Users',
            category: 'Trading',
            isActive: true,
            usageCount: 7560,
            rating: 4.5
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  const getIconComponent = (icon: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      'Brain': Brain,
      'BarChart3': BarChart3,
      'Zap': Zap,
      'Users': Users,
      'Package': Package,
      'Target': Target,
      'Lightbulb': Lightbulb,
      'Network': Network,
      'Eye': Eye,
      'Cpu': Cpu,
      'Shield': Shield,
      'Globe': Globe,
      'TrendingUp': TrendingUp,
      'Clock': Clock,
      'Award': Award,
      'CheckCircle': CheckCircle,
      'Star': Star,
      'Heart': Heart,
      'Rocket': Rocket,
      'Truck': Truck
    };

    return iconMap[icon] || Globe;
  };

  const getGradientForCategory = (category: string) => {
    const gradients: { [key: string]: string } = {
      'AI': 'from-purple-500 to-indigo-500',
      'Analytics': 'from-blue-500 to-cyan-500',
      'Payments': 'from-green-500 to-emerald-500',
      'Trading': 'from-orange-500 to-red-500',
      'Logistics': 'from-yellow-500 to-orange-500',
      'Communication': 'from-pink-500 to-rose-500',
      'Localization': 'from-indigo-500 to-purple-500',
      'Loyalty': 'from-teal-500 to-cyan-500',
      'Security': 'from-red-500 to-pink-500',
      'Performance': 'from-blue-500 to-purple-500'
    };

    return gradients[category] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <section className={`py-20 bg-white ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 mb-4">
              <Award className="w-4 h-4 mr-2" />
              <span className="font-semibold">Platform Features</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
          </div>

          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-20 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 mb-4">
            <Award className="w-4 h-4 mr-2" />
            <span className="font-semibold">Platform Features</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = getIconComponent(feature.icon);
            const gradient = getGradientForCategory(feature.category);
            const isHighlighted = feature.usageCount > 10000 || feature.rating > 4.5;

            return (
              <div
                key={feature.id}
                className={`group relative p-8 rounded-2xl transition-all duration-500 transform hover:scale-105 ${isHighlighted
                    ? 'bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-blue-200 shadow-xl'
                    : 'bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-gray-200'
                  } hover:shadow-2xl`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                {/* Icon Background */}
                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className={`font-bold text-xl text-gray-900 mb-4 ${isHighlighted ? 'text-blue-900' : ''
                    }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-gray-600 leading-relaxed mb-6 ${isHighlighted ? 'text-blue-800' : ''
                    }`}>
                    {feature.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${isHighlighted ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                        {feature.usageCount.toLocaleString()}
                      </div>
                      <div className={`text-sm ${isHighlighted ? 'text-blue-700' : 'text-gray-600'
                        }`}>
                        Users
                      </div>
                    </div>

                    <div className="text-center">
                      <div className={`text-2xl font-bold ${isHighlighted ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                        {feature.rating.toFixed(1)}
                      </div>
                      <div className={`text-sm ${isHighlighted ? 'text-blue-700' : 'text-gray-600'
                        }`}>
                        Rating
                      </div>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="mt-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${isHighlighted
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                      }`}>
                      {feature.category}
                    </span>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        {features.length > 0 && (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl px-8 py-6">
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {features.length}
                </div>
                <div className="text-sm text-blue-800">Active Features</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round(features.reduce((sum, f) => sum + f.rating, 0) / features.length * 10) / 10}
                </div>
                <div className="text-sm text-purple-800">Avg Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {features.reduce((sum, f) => sum + f.usageCount, 0).toLocaleString()}
                </div>
                <div className="text-sm text-green-800">Total Users</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}