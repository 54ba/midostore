'use client'

import { useState } from 'react'
import { Search, ShoppingBag, Star, Truck, Shield, Clock } from 'lucide-react'
import Link from 'next/link'

interface EnhancedHeroSectionProps {
  className?: string
}

export default function EnhancedHeroSection({ className = '' }: EnhancedHeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search functionality
    console.log('Searching for:', searchQuery)
  }

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over $50'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure checkout'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Get help anytime'
    },
    {
      icon: Star,
      title: 'Quality Guarantee',
      description: '30-day return policy'
    }
  ]

  return (
    <section className={`relative overflow-hidden ${className}`} style={{
      background: 'linear-gradient(to bottom right, rgb(59, 130, 246), rgba(59, 130, 246, 0.9), rgba(59, 130, 246, 0.8))'
    }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Star className="w-4 h-4 fill-current" />
              <span>Trusted by 10,000+ customers</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Discover Amazing
              <span className="block text-secondary">Products</span>
              at Great Prices
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0">
              Shop the latest trends with confidence. We offer quality products, competitive prices, and exceptional customer service.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto lg:mx-0 mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-xl shadow-lg focus:ring-2 focus:ring-secondary focus:outline-none text-gray-900 placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-500/90 transition-colors font-medium"
                >
                  Search
                </button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-500/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Shop Now
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Content - Product Showcase */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main Product Card */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-64 mb-4 flex items-center justify-center">
                  <ShoppingBag className="w-20 h-20 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Premium Product</h3>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(128 reviews)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">$99.99</span>
                  <span className="text-sm text-gray-500 line-through">$149.99</span>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                Save 33%
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white px-4 py-2 rounded-full text-sm font-medium shadow-lg text-gray-900">
                Free Shipping
              </div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-white/95 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}