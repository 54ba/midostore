"use client";

import React from 'react';
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
  Rocket
} from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon: string;
  gradient: string;
  isHighlighted?: boolean;
  stats?: {
    value: string;
    label: string;
  };
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
  const features: Feature[] = [
    {
      title: 'Direct Alibaba Connection',
      description: 'Access thousands of verified suppliers offering premium toys and cosmetics at wholesale prices with transparent markup.',
      icon: '🔗',
      gradient: 'from-blue-500 to-cyan-500',
      isHighlighted: true,
      stats: {
        value: '50K+',
        label: 'Suppliers'
      }
    },
    {
      title: 'Gulf Region Focused',
      description: 'Tailored specifically for Middle Eastern markets with local payment methods, currency support, and regional shipping.',
      icon: '🌍',
      gradient: 'from-emerald-500 to-teal-500',
      stats: {
        value: '7',
        label: 'Countries'
      }
    },
    {
      title: 'Quality Assurance',
      description: 'Every product is pre-vetted for quality standards with detailed supplier ratings and customer review integration.',
      icon: '✅',
      gradient: 'from-purple-500 to-pink-500',
      stats: {
        value: '98%',
        label: 'Quality Score'
      }
    },
    {
      title: 'Automated Order Processing',
      description: 'Streamlined workflow from customer order to Alibaba supplier fulfillment with real-time tracking and notifications.',
      icon: '⚡',
      gradient: 'from-orange-500 to-red-500',
      stats: {
        value: '< 5min',
        label: 'Processing'
      }
    },
    {
      title: 'Competitive Pricing',
      description: 'Smart pricing algorithms ensure maximum profit margins while staying competitive in your local market.',
      icon: '💰',
      gradient: 'from-yellow-500 to-orange-500',
      stats: {
        value: '40%',
        label: 'Avg. Margin'
      }
    },
    {
      title: '24/7 Support',
      description: 'Dedicated Arabic and English support team available around the clock to help grow your dropshipping business.',
      icon: '🎧',
      gradient: 'from-indigo-500 to-purple-500',
      stats: {
        value: '24/7',
        label: 'Available'
      }
    },
    {
      title: 'AI-Powered Insights',
      description: 'Advanced analytics and AI recommendations help you identify trending products and optimize your inventory.',
      icon: '🤖',
      gradient: 'from-violet-500 to-purple-500',
      isHighlighted: true,
      stats: {
        value: 'AI',
        label: 'Powered'
      }
    },
    {
      title: 'Fast Shipping',
      description: 'Optimized shipping routes and partnerships with major carriers ensure quick delivery to your customers.',
      icon: '🚀',
      gradient: 'from-rose-500 to-pink-500',
      stats: {
        value: '3-7',
        label: 'Days'
      }
    }
  ];

  const getIconComponent = (icon: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      '🔗': Globe,
      '🌍': Globe,
      '✅': CheckCircle,
      '⚡': Zap,
      '💰': TrendingUp,
      '🎧': Users,
      '🤖': Star,
      '🚀': Rocket
    };

    return iconMap[icon] || Globe;
  };

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
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = getIconComponent(feature.icon);

            return (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl transition-all duration-500 transform hover:scale-105 ${feature.isHighlighted
                    ? 'bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-blue-200 shadow-xl'
                    : 'bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-gray-200'
                  } hover:shadow-2xl`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                {/* Icon Background */}
                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className={`font-bold text-xl text-gray-900 mb-4 ${feature.isHighlighted ? 'text-blue-900' : ''
                    }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-gray-600 leading-relaxed mb-6 ${feature.isHighlighted ? 'text-blue-800' : ''
                    }`}>
                    {feature.description}
                  </p>

                  {/* Stats */}
                  {feature.stats && (
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${feature.isHighlighted ? 'text-blue-600' : 'text-gray-900'
                          }`}>
                          {feature.stats.value}
                        </div>
                        <div className={`text-sm ${feature.isHighlighted ? 'text-blue-700' : 'text-gray-600'
                          }`}>
                          {feature.stats.label}
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center transform group-hover:translate-x-2 transition-transform duration-300`}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${feature.isHighlighted
                    ? 'bg-gradient-to-br from-blue-500/5 to-purple-500/5'
                    : 'bg-gradient-to-br from-gray-500/5 to-gray-600/5'
                  }`}></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 mb-6">
            <Heart className="w-4 h-4 mr-2" />
            <span className="font-semibold">Trusted by 50,000+ Entrepreneurs</span>
          </div>
          <p className="text-lg text-gray-600 mb-8">
            Join the growing community of successful dropshippers who trust MidoHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Start Your Journey
            </button>
            <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 font-semibold rounded-xl transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}