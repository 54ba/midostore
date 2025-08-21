'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import EnhancedHeroSection from '@/components/EnhancedHeroSection'
import CategoryShowcase from '@/components/CategoryShowcase'
import FeatureGrid from '@/components/FeatureGrid'
import TestimonialCard from '@/components/TestimonialCard'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import AuthNavigation from '@/components/AuthNavigation'
import { TrendingUp } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [testimonials] = useState([
    {
      name: 'Sarah Al-Mansouri',
      avatar: '/api/placeholder/40/40',
      rating: 5,
      comment: 'MidoHub transformed my small business. The quality toys from Alibaba at unbeatable prices helped me triple my revenue in just 6 months!'
    },
    {
      name: 'Ahmed Hassan',
      avatar: '/api/placeholder/40/40',
      rating: 5,
      comment: 'The cosmetics selection is incredible. My customers love the premium quality at affordable prices. MidoHub makes dropshipping so easy!'
    },
    {
      name: 'Fatima Kuwait',
      avatar: '/api/placeholder/40/40',
      rating: 5,
      comment: 'Customer support is outstanding and the platform is so user-friendly. I started with zero experience and now run a successful online store.'
    },
    {
      name: 'Omar Dubai',
      avatar: '/api/placeholder/40/40',
      rating: 5,
      comment: 'Fast shipping and reliable suppliers. MidoHub connects me directly to trusted Alibaba vendors with transparent pricing.'
    }
  ])

  const [features] = useState([
    {
      title: 'Direct Alibaba Connection',
      description: 'Access thousands of verified suppliers offering premium toys and cosmetics at wholesale prices with transparent markup.',
      icon: '🔗'
    },
    {
      title: 'Gulf Region Focused',
      description: 'Tailored specifically for Middle Eastern markets with local payment methods, currency support, and regional shipping.',
      icon: '🌍'
    },
    {
      title: 'Quality Assurance',
      description: 'Every product is pre-vetted for quality standards with detailed supplier ratings and customer review integration.',
      icon: '✅'
    },
    {
      title: 'Automated Order Processing',
      description: 'Streamlined workflow from customer order to Alibaba supplier fulfillment with real-time tracking and notifications.',
      icon: '⚡'
    },
    {
      title: 'Competitive Pricing',
      description: 'Smart pricing algorithms ensure maximum profit margins while staying competitive in your local market.',
      icon: '💰'
    },
    {
      title: '24/7 Support',
      description: 'Dedicated Arabic and English support team available around the clock to help grow your dropshipping business.',
      icon: '🎧'
    }
  ])

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      // Redirect to Clerk sign-up
      router.push('/sign-up')
    }
  }

  const handleSignIn = () => {
    // Redirect to Clerk sign-in
    router.push('/sign-in')
  }

  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features-section')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleCategoryExplore = (category: string) => {
    router.push(`/products?category=${category}`)
  }

  const handleViewAllProducts = () => {
    router.push('/products')
  }

  const handleAddToCart = (productId: string) => {
    if (user) {
      // Add to cart logic for authenticated users
      console.log('Adding to cart:', productId)
      // You can implement actual cart functionality here
    } else {
      // Redirect to sign-in for visitors
      router.push('/sign-in')
    }
  }

  const handleBrowseAllProducts = () => {
    router.push('/products')
  }

  const handleLearnMoreCTA = () => {
    const featuresSection = document.getElementById('features-section')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div id="landing-page" className="min-h-screen bg-[rgb(var(--background))] flex flex-col">
      <AuthNavigation />

      <EnhancedHeroSection />

      <CategoryShowcase />

      {/* Featured Products Showcase */}
      <section id="featured-products-section" className="py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div id="featured-products-container" className="max-w-7xl mx-auto">
          <div id="featured-products-header" className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Featured Collection
            </div>
            <h2 id="featured-products-title" className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Discover Our
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Premium Products
              </span>
            </h2>
            <p id="featured-products-description" className="text-xl text-gray-600 max-w-3xl mx-auto">
              Curated selection of trending products from trusted Alibaba suppliers. Quality guaranteed with competitive pricing.
            </p>
          </div>

          {/* Product Categories Grid */}
          <div id="product-categories-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Electronics Category */}
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 animate-float">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Electronics</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Latest smartphones, laptops, and smart devices with cutting-edge technology and competitive prices.
                </p>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="text-lg">⭐</span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">(2.4k reviews)</span>
                  </div>
                  <span className="text-sm font-medium text-blue-600">Starting from $29</span>
                </div>
                <button
                  onClick={() => handleCategoryExplore('electronics')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover-lift"
                >
                  Explore Electronics
                </button>
              </div>
              <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse-glow">
                Hot
              </div>
            </div>

            {/* Toys & Games Category */}
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 animate-float">
                  <span className="text-2xl">🎮</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Toys & Games</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Educational toys, board games, and entertainment products that spark creativity and learning.
                </p>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="text-lg">⭐</span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">(1.8k reviews)</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">Starting from $15</span>
                </div>
                <button
                  onClick={() => handleCategoryExplore('toys')}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover-lift"
                >
                  Explore Toys
                </button>
              </div>
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse-glow">
                New
              </div>
            </div>

            {/* Beauty & Cosmetics Category */}
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 animate-float">
                  <span className="text-2xl">💄</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Beauty & Cosmetics</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Premium skincare, makeup, and beauty products from trusted brands with natural ingredients.
                </p>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="text-lg">⭐</span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">(3.1k reviews)</span>
                  </div>
                  <span className="text-sm font-medium text-pink-600">Starting from $12</span>
                </div>
                <button
                  onClick={() => handleCategoryExplore('beauty')}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover-lift"
                >
                  Explore Beauty
                </button>
              </div>
              <div className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse-glow">
                Popular
              </div>
            </div>
          </div>

          {/* Featured Products Carousel */}
          <div id="featured-products-carousel" className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Trending Now</h3>
              <div className="flex items-center gap-4">
                <button className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <span className="text-gray-600">←</span>
                </button>
                <button className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <span className="text-gray-600">→</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Product Card 1 */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <span className="text-4xl">📱</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    -25%
                  </div>
                  <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    Hot
                  </div>
                  {/* Win Margin Badge */}
                  <div className="absolute top-3 left-16 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold animate-slide-up">
                    Save 25%
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    Premium Smartphone
                  </h4>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    Latest model with advanced features and premium design
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-blue-600">$299</span>
                    <span className="text-sm text-gray-500 line-through">$399</span>
                  </div>
                  <div className="mb-4 p-2 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700">
                      <span>💰</span>
                      <span className="text-sm">Win Margin: $50 (20%)</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart('premium-smartphone')}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover-lift"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Product Card 2 */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <span className="text-4xl">🎮</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    New
                  </div>
                  {/* Win Margin Badge */}
                  <div className="absolute top-3 left-3 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
                    <span className="mr-1">📈</span>
                    +32%
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    Gaming Console Set
                  </h4>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    Complete gaming setup with controllers and popular games
                  </p>

                  {/* Shipping Info */}
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-4">
                    <span className="mr-1">🚚</span>
                    <span>Shipping: $18.75</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="text-sm">⭐</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">(89)</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-green-600">$199</span>
                    <span className="text-sm text-gray-500 line-through">$249</span>
                  </div>

                  {/* Savings Badge */}
                  <div className="mb-4 p-2 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <span className="text-sm font-medium">
                        💰 Save $50 (20%)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart('gaming-console-set')}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Add to Cart
                  </button>

                  {/* Pricing Breakdown */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Pricing Breakdown</span>
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        Show Details
                      </button>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Alibaba Price:</span>
                        <span className="font-medium">$149.99</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Win Margin:</span>
                        <span className="font-medium text-blue-600">+32%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-medium">$18.75</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">You Save:</span>
                        <span className="font-medium text-green-600">$50 (20%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Card 3 */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <span className="text-4xl">💄</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    Best
                  </div>
                  {/* Win Margin Badge */}
                  <div className="absolute top-3 left-3 bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs font-bold">
                    <span className="mr-1">📈</span>
                    +35%
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                    Luxury Makeup Kit
                  </h4>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    Professional makeup collection with premium brushes and palettes
                  </p>

                  {/* Shipping Info */}
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-4">
                    <span className="mr-1">🚚</span>
                    <span>Shipping: $8.25</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="text-sm">⭐</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">(156)</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-pink-600">$89</span>
                    <span className="text-sm text-gray-500 line-through">$129</span>
                  </div>

                  {/* Savings Badge */}
                  <div className="mb-4 p-2 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <span className="text-sm font-medium">
                        💰 Save $40 (31%)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart('luxury-makeup-kit')}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Add to Cart
                  </button>

                  {/* Pricing Breakdown */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Pricing Breakdown</span>
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        Show Details
                      </button>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Alibaba Price:</span>
                        <span className="font-medium">$65.99</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Win Margin:</span>
                        <span className="font-medium text-pink-600">+35%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-medium">$8.25</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">You Save:</span>
                        <span className="font-medium text-green-600">$40 (31%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Card 4 */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <span className="text-4xl">🏠</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    Sale
                  </div>
                  {/* Win Margin Badge */}
                  <div className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                    <span className="mr-1">📈</span>
                    +25%
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    Smart Home Hub
                  </h4>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    Control your home with voice commands and mobile app
                  </p>

                  {/* Shipping Info */}
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-4">
                    <span className="mr-1">🚚</span>
                    <span>Shipping: $15.50</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="text-sm">⭐</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">(203)</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-orange-600">$149</span>
                    <span className="text-sm text-gray-500 line-through">$199</span>
                  </div>

                  {/* Savings Badge */}
                  <div className="mb-4 p-2 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <span className="text-sm font-medium">
                        💰 Save $50 (25%)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart('smart-home-hub')}
                    className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 text-white py-2 px-4 rounded-lg font-medium hover:from-orange-700 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Add to Cart
                  </button>

                  {/* Pricing Breakdown */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Pricing Breakdown</span>
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        Show Details
                      </button>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Alibaba Price:</span>
                        <span className="font-medium">$119.99</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Win Margin:</span>
                        <span className="font-medium text-yellow-600">+25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-medium">$15.50</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">You Save:</span>
                        <span className="font-medium text-green-600">$50 (25%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div id="featured-products-cta" className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Shopping?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust MidoHub for quality products and exceptional service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleBrowseAllProducts}
                  className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors transform hover:scale-105"
                >
                  Browse All Products
                </button>
                <button
                  onClick={handleLearnMoreCTA}
                  className="px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-colors transform hover:scale-105"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features-section" className="py-16 px-4 bg-gray-50">
        <div id="features-container" className="max-w-7xl mx-auto">
          <div id="features-header" className="text-center mb-12">
            <h2 id="features-title" className="text-3xl font-bold text-[rgb(var(--foreground))] mb-4">
              Why Choose MidoHub?
            </h2>
            <p id="features-description" className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform combines the power of Alibaba&apos;s marketplace with Gulf region expertise to create the ultimate dropshipping experience.
            </p>
          </div>

          <FeatureGrid
            id="features-grid"
            features={features}
          />

          <div id="features-cta" className="text-center mt-12">
            <Button
              id="features-cta-button"
              variant="primary"
              size="lg"
              onClick={handleGetStarted}
            >
              {user ? 'Access Dashboard' : 'Start Your Journey Today'}
            </Button>
          </div>
        </div>
      </section>

      {/* AI Recommendations Section */}
      <section id="ai-recommendations-section" className="py-16 px-4 bg-white">
        <div id="ai-recommendations-container" className="max-w-7xl mx-auto">
          <div id="ai-recommendations-header" className="text-center mb-12">
            <h2 id="ai-recommendations-title" className="text-3xl font-bold text-[rgb(var(--foreground))] mb-4">
              AI-Powered Product Discovery
            </h2>
            <p id="ai-recommendations-description" className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience the future of shopping with our intelligent recommendation system that learns your preferences and suggests the perfect products.
            </p>
          </div>

          <div id="ai-recommendations-grid" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div id="ai-feature-1" className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Learning</h3>
              <p className="text-gray-600">
                Our AI analyzes your browsing patterns and preferences to deliver increasingly accurate recommendations.
              </p>
            </div>

            <div id="ai-feature-2" className="text-center p-6 bg-blue-50 rounded-lg hover-lift animate-slide-up">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Recommendations</h3>
              <p className="text-gray-600">AI-powered product suggestions based on your preferences and market trends</p>
            </div>

            <div id="ai-feature-3" className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Updates</h3>
              <p className="text-gray-600">
                Recommendations improve continuously as you interact with products and discover new preferences.
              </p>
            </div>
          </div>

          <div id="ai-recommendations-cta" className="text-center">
            <Button
              id="ai-recommendations-cta-button"
              variant="outline"
              size="lg"
              onClick={() => router.push('/ai-recommendations')}
            >
              Explore AI Recommendations
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              No account required - start discovering amazing products now!
            </p>
          </div>
        </div>
      </section>

      <section id="testimonials-section" className="py-16 px-4 bg-white">
        <div id="testimonials-container" className="max-w-7xl mx-auto">
          <div id="testimonials-header" className="text-center mb-12">
            <h2 id="testimonials-title" className="text-3xl font-bold text-[rgb(var(--foreground))] mb-4">
              Success Stories from the Gulf
            </h2>
            <p id="testimonials-description" className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of successful entrepreneurs who have built thriving businesses with MidoHub&apos;s dropshipping platform.
            </p>
          </div>

          <div id="testimonials-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`testimonial-${index}`}
                id={`testimonial-card-${index}`}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="cta-section" className="py-16 px-4 bg-[rgb(var(--primary))] text-white">
        <div id="cta-container" className="max-w-4xl mx-auto text-center">
          <h2 id="cta-title" className="text-3xl font-bold mb-4">
            Ready to Start Your Dropshipping Empire?
          </h2>
          <p id="cta-description" className="text-xl mb-8 text-white/90">
            Join MidoHub today and get instant access to premium Alibaba suppliers, automated order processing, and 24/7 support.
          </p>

          <div id="cta-buttons" className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!user ? (
              <>
                <Button
                  id="cta-get-started"
                  variant="secondary"
                  size="lg"
                  onClick={handleGetStarted}
                >
                  Get Started Free
                </Button>
                <Button
                  id="cta-sign-in"
                  variant="outline"
                  size="lg"
                  onClick={handleSignIn}
                >
                  Sign In
                </Button>
              </>
            ) : (
              <Button
                id="cta-dashboard"
                variant="secondary"
                size="lg"
                onClick={() => router.push('/dashboard')}
              >
                Go to Dashboard
              </Button>
            )}
          </div>
        </div>
      </section>

      <section id="stats-section" className="py-12 px-4 bg-gray-50">
        <div id="stats-container" className="max-w-6xl mx-auto">
          <div id="stats-grid" className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div id="stat-suppliers" className="bg-white rounded-lg p-6 shadow-sm">
              <div id="stat-suppliers-number" className="text-3xl font-bold text-[rgb(var(--primary))] mb-2">
                10,000+
              </div>
              <p id="stat-suppliers-text" className="text-gray-600">
                Verified Alibaba Suppliers
              </p>
            </div>

            <div id="stat-products" className="bg-white rounded-lg p-6 shadow-sm">
              <div id="stat-products-number" className="text-3xl font-bold text-[rgb(var(--primary))] mb-2">
                50,000+
              </div>
              <p id="stat-products-text" className="text-gray-600">
                Premium Products Available
              </p>
            </div>

            <div id="stat-customers" className="bg-white rounded-lg p-6 shadow-sm">
              <div id="stat-customers-number" className="text-3xl font-bold text-[rgb(var(--primary))] mb-2">
                5,000+
              </div>
              <p id="stat-customers-text" className="text-gray-600">
                Successful Entrepreneurs
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer id="landing-footer" />
    </div>
  )
}