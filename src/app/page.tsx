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
  console.log('HomePage: Component rendering');

  const router = useRouter();

  // Temporarily bypass contexts to isolate the issue
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('en-AE');
  const [isRTL, setIsRTL] = useState(false);

  // Simple fallback functions
  const t = (key: string) => key;
  const formatPrice = (price: number) => `$${price}`;

  // State for dynamic data
  const [productReviews, setProductReviews] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>({
    conversionRate: 3.2,
    avgOrderValue: 89.45,
    customerLifetime: 1247,
    totalOrders: 15420,
    totalRevenue: 1378945,
    activeUsers: 8920,
    topProducts: []
  });
  const [featureData, setFeatureData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('HomePage: Component rendering - loading:', loading, 'authLoading:', authLoading);

  // Data fetching with proper error handling
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch reviews
        const reviewsResponse = await fetch('/api/reviews?limit=8&verified=true');
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          if (reviewsData.success && reviewsData.data) {
            setProductReviews(reviewsData.data);
          }
        }

        // Fetch analytics
        const analyticsResponse = await fetch('/api/analytics/overview');
        if (analyticsResponse.ok) {
          const analyticsData = await analyticsResponse.json();
          if (analyticsData.success && analyticsData.data) {
            setAnalyticsData(analyticsData.data);
          }
        }

        // Fetch features
        const featuresResponse = await fetch('/api/features');
        if (featuresResponse.ok) {
          const featuresData = await featuresResponse.json();
          if (featuresData.success && featuresData.data) {
            setFeatureData(featuresData.data);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    console.log('HomePage: Still loading - loading:', loading, 'authLoading:', authLoading);
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Dropshipping Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Join thousands of successful entrepreneurs who trust MidoHub for their business growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/register')}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold"
            >
              Get Started Free
            </Button>
            <Button
              onClick={() => router.push('/contact')}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}