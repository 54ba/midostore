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

  return (
    <div id="landing-page" className="min-h-screen bg-[rgb(var(--background))] flex flex-col">
      <AuthNavigation />

      <EnhancedHeroSection />

      <CategoryShowcase />

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

            <div id="ai-feature-2" className="text-center p-6 bg-green-50 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Results</h3>
              <p className="text-gray-600">
                Get product suggestions tailored specifically to your interests, budget, and shopping behavior.
              </p>
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