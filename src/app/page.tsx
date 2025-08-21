"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
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
import AuthNavigation from '@/components/AuthNavigation';
import LiveUpdates from '@/components/LiveUpdates';

export default function LandingPage() {
  const router = useRouter();
  const { user, loading: authLoading, isClerkUser } = useAuth();

  const [productReviews] = React.useState([
    {
      id: 'review-1',
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
      comment: 'These headphones are absolutely incredible! The noise cancellation is top-notch and the sound quality is premium. Perfect for my daily commute and work calls.',
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
    },
    {
      id: 'review-2',
      productId: 'prod-2',
      productTitle: 'Smart Fitness Watch with Health Monitoring',
      productImage: '/api/placeholder/40/40?text=SmartWatch',
      productPrice: 199.99,
      productOriginalPrice: 299.99,
      productCategory: 'electronics',
      userId: 'user-2',
      userName: 'Fatima Kuwait',
      userAvatar: '/api/placeholder/40/40?text=FK',
      rating: 5,
      comment: 'This watch has transformed my fitness journey! The heart rate monitoring is accurate and the sleep tracking gives me insights I never had before. Battery life is amazing!',
      reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      isVerified: true,
      isPremium: false,
      helpfulCount: 18,
      unhelpfulCount: 0,
      purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      productRating: 4.6,
      productReviewCount: 892,
      productSoldCount: 4200,
      productDiscount: 33,
      isHotDeal: true,
      isLimitedTime: true,
      timeRemaining: '1 day left'
    },
    {
      id: 'review-3',
      productId: 'prod-3',
      productTitle: 'Organic Anti-Aging Face Cream Set',
      productImage: '/api/placeholder/40/40?text=FaceCream',
      productPrice: 29.99,
      productOriginalPrice: 59.99,
      productCategory: 'beauty',
      userId: 'user-3',
      userName: 'Layla Dubai',
      userAvatar: '/api/placeholder/40/40?text=LD',
      rating: 4,
      comment: 'Great value for money! The cream is lightweight and absorbs quickly. I noticed improvement in my skin texture after just a week of use. Will definitely repurchase!',
      reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      isVerified: true,
      isPremium: false,
      helpfulCount: 12,
      unhelpfulCount: 2,
      purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      productRating: 4.3,
      productReviewCount: 567,
      productSoldCount: 3200,
      productDiscount: 50,
      isHotDeal: false,
      isLimitedTime: false,
      timeRemaining: undefined
    },
    {
      id: 'review-4',
      productId: 'prod-4',
      productTitle: 'Educational Building Blocks Set',
      productImage: '/api/placeholder/40/40?text=Blocks',
      productPrice: 24.99,
      productOriginalPrice: 39.99,
      productCategory: 'toys',
      userId: 'user-4',
      userName: 'Omar Qatar',
      userAvatar: '/api/placeholder/40/40?text=OQ',
      rating: 5,
      comment: 'Perfect for my 6-year-old! The blocks are high quality and the educational aspect is fantastic. He learns while having fun. Highly recommend for parents!',
      reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
      isVerified: true,
      isPremium: false,
      helpfulCount: 8,
      unhelpfulCount: 0,
      purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      productRating: 4.7,
      productReviewCount: 234,
      productSoldCount: 1800,
      productDiscount: 38,
      isHotDeal: true,
      isLimitedTime: false,
      timeRemaining: undefined
    }
  ]);

  const handleGetStarted = () => {
    router.push('/dashboard');
  };

  const handleLearnMore = () => {
    router.push('/contact');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* AI Recommendations Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 text-purple-800 dark:text-purple-400 mb-4">
              <Brain className="w-4 h-4 mr-2" />
              <span className="font-semibold">AI-Powered</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Intelligent Product Recommendations
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our advanced AI analyzes customer behavior, market trends, and product performance
              to deliver personalized recommendations that boost your sales and customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <TargetIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Smart Targeting</h3>
              <p className="text-gray-600 dark:text-gray-300">AI-driven customer segmentation and personalized product suggestions based on browsing patterns and purchase history.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Trend Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">Real-time market trend detection and predictive analytics to stay ahead of customer demands and market shifts.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Insight Generation</h3>
              <p className="text-gray-600 dark:text-gray-300">Deep insights into product performance, customer preferences, and optimization opportunities for your business.</p>
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
              Comprehensive Business Intelligence
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get deep insights into your business performance with real-time analytics,
              customizable dashboards, and actionable intelligence to drive growth.
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
                  <p className="text-gray-600 dark:text-gray-300">Track sales, inventory, and customer behavior in real-time with live dashboards and instant notifications.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Advanced Reporting</h3>
                  <p className="text-gray-600 dark:text-gray-300">Generate comprehensive reports with customizable metrics, visualizations, and export capabilities.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Performance Tracking</h3>
                  <p className="text-gray-600 dark:text-gray-300">Monitor KPIs, set goals, and track progress with automated alerts and performance insights.</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Conversion Rate</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">3.2%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg. Order Value</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">$89.45</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Customer Lifetime</span>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">$1,247</span>
                </div>
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
              Centralized AI Command Center
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Manage all your AI-powered tools from one unified dashboard. Coordinate scraping,
              recommendations, analytics, and automation workflows seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Network className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Workflow Management</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Create and manage complex AI workflows with drag-and-drop interface</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Automation Engine</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Set up automated tasks and triggers for seamless operation</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Security & Compliance</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Enterprise-grade security with role-based access control</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <GlobeIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Global Integration</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Connect with 100+ platforms and services worldwide</p>
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
              Comprehensive Product Analytics
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Track product performance, sales trends, and customer behavior in real-time.
              Make data-driven decisions to maximize your profits.
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
              What Our Customers Say About Products
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Read authentic reviews from verified customers who have purchased and used our products.
              Real feedback, real experiences, real insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {productReviews.map((review, index) => (
              <ProductReviewCard key={index} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-20 bg-white dark:bg-gray-900">
        <FeatureGrid />
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Your Dropshipping Empire?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of successful entrepreneurs who trust MidoHub for their
            Alibaba product sourcing needs. Start today and transform your business!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 px-8 py-4 text-lg font-bold rounded-xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <Crown className="w-5 h-5 mr-2" />
              Start Your Empire Now
            </Button>
            <Button
              onClick={handleLearnMore}
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}