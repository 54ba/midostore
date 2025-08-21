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
  const { user, loading: authLoading, isClerkUser } = useAuth()
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
    } else if (isClerkUser) {
      // Redirect to Clerk sign-up if Clerk is configured
      router.push('/sign-up')
    } else {
      // Keyless mode - redirect to dashboard directly or show message
      router.push('/dashboard')
    }
  }

  const handleSignIn = () => {
    if (isClerkUser) {
      // Redirect to Clerk sign-in if Clerk is configured
      router.push('/sign-in')
    } else {
      // Keyless mode - redirect to dashboard directly or show message
      router.push('/dashboard')
    }
  }

  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features-section')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading MidoHub...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header with Navigation */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MidoHub
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </a>
              <a href="#categories" className="text-gray-600 hover:text-blue-600 transition-colors">
                Categories
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">
                Testimonials
              </a>
            </nav>

            {/* Auth Navigation */}
            <AuthNavigation />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <EnhancedHeroSection
        title="Transform Your Business with Premium Dropshipping"
        subtitle="Connect directly to Alibaba's verified suppliers for toys and cosmetics. Start your dropshipping journey in the Gulf region with MidoHub."
        onGetStarted={handleGetStarted}
        onSignIn={handleSignIn}
        onLearnMore={handleLearnMore}
        isClerkConfigured={isClerkUser}
      />

      {/* Features Section */}
      <section id="features-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose MidoHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform is designed specifically for the Gulf region, offering seamless integration with Alibaba's vast supplier network.
            </p>
          </div>
          <FeatureGrid features={features} />
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories-section" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover trending products in toys and cosmetics that are perfect for the Middle Eastern market.
            </p>
          </div>
          <CategoryShowcase />
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories from Our Users
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how MidoHub has helped entrepreneurs across the Gulf region build successful dropshipping businesses.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Dropshipping Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of successful entrepreneurs who trust MidoHub for their Alibaba product sourcing needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGetStarted}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Get Started Now
            </Button>
            <Button
              onClick={handleLearnMore}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}