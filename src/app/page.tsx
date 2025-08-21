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
      timeRemaining: null
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
      timeRemaining: null
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

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Welcome to MidoHub
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your trusted dropshipping partner in the Gulf region
          </p>
          <Button
            onClick={handleGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-bold rounded-xl"
          >
            Get Started
          </Button>
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 mb-4">
              <BarChart3 className="w-4 h-4 mr-2" />
              <span className="font-semibold">Real-Time Analytics</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Product Analytics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track product performance, sales trends, and customer behavior in real-time.
              Make data-driven decisions to maximize your profits.
            </p>
          </div>

          <ProductAnalyticsDashboard />
        </div>
      </section>

      {/* Real Product Reviews Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 text-green-800 mb-4">
              <Star className="w-4 h-4 mr-2" />
              <span className="font-semibold">Real Customer Reviews</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say About Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
      <section id="features-section" className="py-20 bg-white">
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