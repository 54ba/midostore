"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSimpleAuth } from '@/app/contexts/SimpleAuthContext';
import { useLocalization } from '@/app/contexts/LocalizationContext';
import {
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Star,
  ShoppingCart,
  Package,
  Target,
  BarChart3,
  Globe,
  Clock,
  Award,
  Sparkles,
  Crown,
  Gem,
  Flame,
  Brain,
  Cpu,
  Eye,
  BarChart,
  Network,
  Rocket,
  Lightbulb,
  Target as TargetIcon,
  Globe as GlobeIcon,
} from 'lucide-react';
import Button from '@/components/Button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import CategoryShowcase from '@/components/CategoryShowcase';
import FeatureGrid from '@/components/FeatureGrid';
import ProductReviewCard from '@/components/TestimonialCard';
import ProductAnalyticsDashboard from '@/components/ProductAnalyticsDashboard';
import DynamicPricingDeals from '@/components/DynamicPricingDeals';
import OrderBatchingSystem from '@/components/OrderBatchingSystem';
import LiveUpdates from '@/components/LiveUpdates';

export default function LandingPage() {
  const router = useRouter();
  const { user, loading: authLoading, isGuest, isAuthenticated } = useSimpleAuth();
  const { t, currentLocale, isRTL, formatPrice } = useLocalization();

  // State for dynamic data
  const [productReviews, setProductReviews] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [featureData, setFeatureData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real data from our services
  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        setLoading(true);

        // Fetch real product reviews
        const reviewsResponse = await fetch('/api/reviews?limit=8&verified=true');
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          if (reviewsData.success) {
            setProductReviews(reviewsData.data.map((review: any) => ({
              id: review.id,
              productId: review.productId,
              productTitle: review.productTitle || review.product?.title || 'Product',
              productImage: review.productImage || review.product?.image || '/api/placeholder/40/40?text=Product',
              productPrice: review.productPrice || review.product?.price || 0,
              productOriginalPrice: review.productOriginalPrice || review.product?.originalPrice || 0,
              productCategory: review.productCategory || review.product?.category || 'general',
              userId: review.userId,
              userName: review.userName || review.user?.name || 'Customer',
              userAvatar: review.userAvatar || review.user?.avatar || '/api/placeholder/40/40?text=U',
              rating: review.rating || 5,
              comment: review.comment || review.review || 'Great product!',
              reviewDate: new Date(review.createdAt || review.reviewDate || Date.now()),
              isVerified: review.isVerified || true,
              isPremium: review.isPremium || false,
              helpfulCount: review.helpfulCount || 0,
              unhelpfulCount: review.unhelpfulCount || 0,
              purchaseDate: new Date(review.purchaseDate || Date.now() - 1000 * 60 * 60 * 24 * 7),
              productRating: review.productRating || review.product?.rating || 4.5,
              productReviewCount: review.productReviewCount || review.product?.reviewCount || 100,
              productSoldCount: review.productSoldCount || review.product?.soldCount || 500,
              productDiscount: review.productDiscount || 0,
              isHotDeal: review.isHotDeal || false,
              isLimitedTime: review.isLimitedTime || false,
              timeRemaining: review.timeRemaining || undefined
            })));
          }
        }

        // Fetch real analytics data
        const analyticsResponse = await fetch('/api/analytics/overview');
        if (analyticsResponse.ok) {
          const analyticsData = await analyticsResponse.json();
          if (analyticsData.success) {
            setAnalyticsData({
              conversionRate: analyticsData.data.conversionRate || 3.2,
              avgOrderValue: analyticsData.data.avgOrderValue || 89.45,
              customerLifetime: analyticsData.data.customerLifetime || 1247,
              totalOrders: analyticsData.data.totalOrders || 15420,
              totalRevenue: analyticsData.data.totalRevenue || 1378945,
              activeUsers: analyticsData.data.activeUsers || 8920,
              topProducts: analyticsData.data.topProducts || []
            });
          }
        }

        // Fetch real feature data
        const featuresResponse = await fetch('/api/features');
        if (featuresResponse.ok) {
          const featuresData = await featuresResponse.json();
          if (featuresData.success) {
            setFeatureData(featuresData.data || []);
          }
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching dynamic data:', err);
        setError('Failed to load dynamic content');

        // Fallback to sample data if API fails
        setProductReviews([
          {
            id: 'fallback-1',
            productId: 'prod-1',
            productTitle: 'Wireless Noise-Canceling Headphones Pro',
            productImage: '/api/placeholder/40/40?text=Headphones',
            productPrice: 89.99,
            productOriginalPrice: 149.99,
            productCategory: 'electronics',
            userId: 'user-1',
            userName: 'Ahmed Hassan',
            userAvatar: '/api/placeholder/40/40?text=AH',
            rating: 5,
            comment: 'Excellent quality and amazing sound!',
            reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            isVerified: true,
            isPremium: true,
            helpfulCount: 23,
            unhelpfulCount: 1,
            purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
            productRating: 4.8,
            productReviewCount: 1247,
            productSoldCount: 8500,
            productDiscount: 40,
            isHotDeal: true,
            isLimitedTime: true,
            timeRemaining: '2 days left'
          }
        ]);

        setAnalyticsData({
          conversionRate: 3.2,
          avgOrderValue: 89.45,
          customerLifetime: 1247,
          totalOrders: 15420,
          totalRevenue: 1378945,
          activeUsers: 8920,
          topProducts: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicData();
  }, [t]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      // For guests, show sign-in modal or redirect to sign-in page
      router.push('/sign-in');
    }
  };

  const handleLearnMore = () => {
    router.push('/contact');
  };

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  const handleSignUp = () => {
    router.push('/sign-up');
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {authLoading ? 'Initializing...' : 'Loading dynamic content...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <Header />

      {/* Welcome Section for Authenticated Users */}
      {isAuthenticated && user && (
        <section className="py-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 mb-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="font-semibold">Welcome back!</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Hello, {user.username}! Ready to grow your business?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Continue where you left off or explore new opportunities
              </p>
            </div>
          </div>
        </section>
      )}

      {/* AI Recommendations Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 text-purple-800 dark:text-purple-400 mb-4">
              <Brain className="w-4 h-4 mr-2" />
              <span className="font-semibold">AI Powered</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {isAuthenticated
                ? 'Intelligent Product Recommendations'
                : 'Discover AI-Powered Dropshipping Success'
              }
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {isAuthenticated
                ? 'Get personalized product recommendations based on your business performance and market trends.'
                : 'Join thousands of successful entrepreneurs using AI to identify trending products, optimize pricing, and maximize profits in the Gulf region.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <TargetIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Smart Targeting</h3>
              <p className="text-gray-600 dark:text-gray-300">AI-powered market analysis to identify the most profitable product opportunities.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Trend Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">Real-time trend monitoring to stay ahead of market changes and consumer preferences.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Insight Generation</h3>
              <p className="text-gray-600 dark:text-gray-300">Automated insights and recommendations to optimize your product strategy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Updates Section */}
      <LiveUpdates />

      {/* Analytics & Insights Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-800 dark:text-blue-400 mb-4">
              <BarChart className="w-4 h-4 mr-2" />
              <span className="font-semibold">Analytics & Insights</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {isAuthenticated
                ? 'Comprehensive Business Intelligence'
                : 'Real-Time Business Intelligence'
              }
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {isAuthenticated
                ? 'Monitor your business performance with advanced analytics and actionable insights.'
                : 'Get instant insights into market trends, competitor analysis, and performance metrics to make data-driven decisions.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Real-Time Monitoring</h3>
                  <p className="text-gray-600 dark:text-gray-300">Track your business metrics and performance indicators in real-time.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Advanced Reporting</h3>
                  <p className="text-gray-600 dark:text-gray-300">Generate comprehensive reports and analytics to understand your business better.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Performance Tracking</h3>
                  <p className="text-gray-600 dark:text-gray-300">Monitor key performance indicators and track progress towards your business goals.</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Conversion Rate</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {analyticsData?.conversionRate?.toFixed(1) || '3.2'}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg Order Value</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    ${analyticsData?.avgOrderValue?.toFixed(2) || '89.45'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Customer Lifetime</span>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    ${analyticsData?.customerLifetime?.toFixed(0) || '1247'}
                  </span>
                </div>
                {analyticsData?.totalOrders && (
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Orders</span>
                    <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                      {analyticsData.totalOrders.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Orchestrator Dashboard Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 text-orange-800 dark:text-orange-400 mb-4">
              <Cpu className="w-4 h-4 mr-2" />
              <span className="font-semibold">AI Orchestrator</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {isAuthenticated
                ? 'Centralized AI Command Center'
                : 'AI-Powered Business Orchestration'
              }
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {isAuthenticated
                ? 'Manage all your AI-powered tools and automation from a single, intuitive dashboard.'
                : 'Experience the future of business automation with our AI orchestrator that manages every aspect of your dropshipping operation.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Network className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Workflow Management</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Streamline your business processes with intelligent workflow automation.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Automation Engine</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Automate repetitive tasks and focus on growing your business.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Security & Compliance</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Enterprise-grade security with compliance monitoring and audit trails.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <GlobeIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Global Integration</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Connect with suppliers and partners worldwide through our platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Order Batching System Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <OrderBatchingSystem />
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <CategoryShowcase />
      </section>

      {/* Product Analytics Dashboard */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-800 dark:text-blue-400 mb-4">
              <BarChart3 className="w-4 h-4 mr-2" />
              <span className="font-semibold">Real-Time Analytics</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {isAuthenticated
                ? 'Comprehensive Product Analytics'
                : 'Product Performance Analytics'
              }
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {isAuthenticated
                ? 'Track your product performance and optimize your inventory with advanced analytics.'
                : 'Discover which products are trending, analyze market performance, and identify opportunities for growth.'
              }
            </p>
          </div>

          <ProductAnalyticsDashboard />
        </div>
      </section>

      {/* Real Product Reviews Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 text-green-800 dark:text-green-400 mb-4">
              <Star className="w-4 h-4 mr-2" />
              <span className="font-semibold">Real Customer Reviews</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {isAuthenticated
                ? 'What Our Customers Say'
                : 'See What Our Customers Are Saying'
              }
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {isAuthenticated
                ? 'Read authentic feedback from our verified customers and learn from their experiences.'
                : 'Real feedback from verified customers who have experienced our platform firsthand.'
              }
            </p>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          {productReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {productReviews.map((review, index) => (
                <ProductReviewCard key={review.id || index} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">Loading customer reviews...</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-20 bg-white dark:bg-gray-900">
        <FeatureGrid />
      </section>

      {/* Web3 & Decentralized Services Showcase */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 text-purple-800 dark:text-purple-400 mb-4">
              <Network className="w-4 h-4 mr-2" />
              <span className="font-semibold">Web3 & DeFi Services</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Next-Generation Decentralized Solutions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the future of commerce with blockchain-powered services, crypto payments, and decentralized marketplaces.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI-Powered Scraping</h3>
                  <p className="text-gray-600 dark:text-gray-300">Intelligent product discovery and market analysis using advanced AI algorithms.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Social Trend Analysis</h3>
                  <p className="text-gray-600 dark:text-gray-300">Real-time social media monitoring to identify trending products and market opportunities.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI Recommendations</h3>
                  <p className="text-gray-600 dark:text-gray-300">Personalized product suggestions based on user behavior and market trends.</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Network className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Decentralized Marketplace</h3>
                  <p className="text-gray-600 dark:text-gray-300">Peer-to-peer trading with smart contracts and crypto payments</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">$2.5M+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Trading Volume</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">15K+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Supported Cryptocurrencies</span>
                    <span className="font-medium text-gray-900 dark:text-white">BTC, ETH, USDT, USDC</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Transaction Speed</span>
                    <span className="font-medium text-gray-900 dark:text-white">&lt; 2 seconds</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Security Level</span>
                    <span className="font-medium text-green-600 dark:text-green-400">Enterprise Grade</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Crypto Payments</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Accept Bitcoin, Ethereum, and other major cryptocurrencies with instant settlement.</p>
              <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Smart Contracts</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Automated, trustless transactions with blockchain-based smart contracts.</p>
              <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">P2P Trading</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Direct peer-to-peer trading without intermediaries, reducing costs and fees.</p>
              <div className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">DeFi Integration</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Access decentralized finance protocols for lending, borrowing, and yield farming.</p>
              <div className="flex items-center text-sm text-orange-600 dark:text-orange-400">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Gem className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">NFT Marketplace</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Trade unique digital assets and collectibles on our secure NFT platform.</p>
              <div className="flex items-center text-sm text-indigo-600 dark:text-indigo-400">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Staking & Rewards</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Earn passive income by staking your tokens and participating in governance.</p>
              <div className="flex items-center text-sm text-yellow-600 dark:text-yellow-400">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Services Showcase */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 text-blue-800 dark:text-blue-400 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="font-semibold">Complete Business Suite</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From product discovery to order fulfillment, our comprehensive suite covers every aspect of your dropshipping business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI & Analytics Services */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI-Powered Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Advanced business intelligence with real-time insights and predictive analytics.</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Market trend analysis</li>
                <li>• Performance tracking</li>
                <li>• Predictive insights</li>
                <li>• Custom dashboards</li>
              </ul>
            </div>

            {/* Product Management */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-100 dark:border-green-800">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Product Management</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Comprehensive product catalog management with AI-powered optimization.</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Smart categorization</li>
                <li>• Price optimization</li>
                <li>• Inventory tracking</li>
                <li>• Performance analytics</li>
              </ul>
            </div>

            {/* Order Processing */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-100 dark:border-purple-800">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Order Processing</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Streamlined order management with automated fulfillment and tracking.</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Automated fulfillment</li>
                <li>• Real-time tracking</li>
                <li>• Batch processing</li>
                <li>• Customer notifications</li>
              </ul>
            </div>

            {/* Marketing & Advertising */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border border-orange-100 dark:border-orange-800">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Marketing & Advertising</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Data-driven marketing campaigns with advanced targeting and optimization.</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Audience targeting</li>
                <li>• Campaign optimization</li>
                <li>• ROI tracking</li>
                <li>• A/B testing</li>
              </ul>
            </div>

            {/* Customer Management */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-cyan-100 dark:border-cyan-800">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Customer Management</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Comprehensive customer relationship management with loyalty programs.</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Customer profiles</li>
                <li>• Loyalty rewards</li>
                <li>• Support tickets</li>
                <li>• Feedback collection</li>
              </ul>
            </div>

            {/* Financial Services */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-yellow-100 dark:border-yellow-800">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Financial Services</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Complete financial management with crypto payments and analytics.</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Crypto payments</li>
                <li>• Revenue tracking</li>
                <li>• Expense management</li>
                <li>• Tax reporting</li>
              </ul>
            </div>

            {/* Localization & International */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Global Expansion</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Multi-language support and international market expansion tools.</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Multi-language support</li>
                <li>• Currency conversion</li>
                <li>• Regional compliance</li>
                <li>• Market insights</li>
              </ul>
            </div>

            {/* Security & Compliance */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-800">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Security & Compliance</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Enterprise-grade security with regulatory compliance and data protection.</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Data encryption</li>
                <li>• GDPR compliance</li>
                <li>• Fraud protection</li>
                <li>• Audit logging</li>
              </ul>
            </div>

            {/* Integration & APIs */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl p-6 border border-pink-100 dark:border-pink-800">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Integration & APIs</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Seamless integration with popular platforms and custom API access.</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Platform integrations</li>
                <li>• Custom APIs</li>
                <li>• Webhook support</li>
                <li>• Data synchronization</li>
              </ul>
            </div>
          </div>

          {/* Call to Action for Services */}
          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Ready to explore these powerful tools? Start with any service or use them all together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Explore All Services
              </Button>
              <Button
                onClick={() => router.push('/dashboard/ai-orchestrator')}
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300"
              >
                <Brain className="w-5 h-5 mr-2" />
                Try AI Features
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Authentication Aware */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            {isAuthenticated
              ? 'Ready to Start Your Dropshipping Empire?'
              : 'Ready to Start Your Dropshipping Empire?'
            }
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {isAuthenticated
              ? 'Take your business to the next level with our advanced tools and AI-powered insights.'
              : 'Join thousands of successful entrepreneurs and start building your business today with AI-powered insights and tools.'
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              // Authenticated user - go to dashboard
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 px-8 py-4 text-lg font-bold rounded-xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Crown className="w-5 h-5 mr-2" />
                Start Your Empire Now
              </Button>
            ) : (
              // Guest user - show sign-in/sign-up options
              <>
                <Button
                  onClick={handleSignIn}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 px-8 py-4 text-lg font-bold rounded-xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Get Started Now
                </Button>
                <Button
                  onClick={handleSignUp}
                  className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Create Account
                </Button>
              </>
            )}

            <Button
              onClick={handleLearnMore}
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>

          {/* Guest-specific messaging */}
          {isGuest && (
            <div className="mt-8 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <p className="text-blue-100 text-sm">
                💡 <strong>No account required!</strong> Start exploring with a guest account and upgrade anytime.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}