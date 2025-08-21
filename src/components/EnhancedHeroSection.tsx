'use client'

import { useState } from 'react'
import { Search, ShoppingBag, Star, Truck, Shield, Clock } from 'lucide-react'
import Link from 'next/link'
import Button from './Button'

interface EnhancedHeroSectionProps {
  className?: string
  title?: string
  subtitle?: string
  onGetStarted?: () => void
  onSignIn?: () => void
  onLearnMore?: () => void
  isClerkConfigured?: boolean
}

export default function EnhancedHeroSection({
  className = '',
  title = "Discover Amazing Products at Great Prices",
  subtitle = "Shop the latest trends with confidence. We offer quality products, competitive prices, and exceptional customer service.",
  onGetStarted,
  onSignIn,
  onLearnMore,
  isClerkConfigured = false
}: EnhancedHeroSectionProps) {
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
              {title}
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0">
              {subtitle}
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
              {onGetStarted ? (
                <Button
                  onClick={onGetStarted}
                  className="inline-flex items-center justify-center px-8 py-4 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-500/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {isClerkConfigured ? 'Get Started' : 'Explore Products'}
                </Button>
              ) : (
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-500/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Shop Now
                </Link>
              )}

              {onSignIn && isClerkConfigured && (
                <Button
                  onClick={onSignIn}
                  variant="outline"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200"
                >
                  Sign In
                </Button>
              )}

              {onLearnMore && (
                <Button
                  onClick={onLearnMore}
                  variant="outline"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200"
                >
                  Learn More
                </Button>
              )}
            </div>
          </div>

          {/* Right Content - Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-white/80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}