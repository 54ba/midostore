'use client'

import { useId } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthContext'

interface HeroSectionProps {
  id?: string
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
}

export default function HeroSection({
  id,
  title = "Connect Gulf Consumers to Alibaba's Best Toys & Cosmetics",
  subtitle = "MidoHub bridges the gap between Gulf consumers and affordable, quality products from Alibaba. Discover toys and cosmetics at unbeatable prices with seamless dropshipping.",
  ctaText = "Start Shopping",
  ctaLink = "/dashboard"
}: HeroSectionProps) {
  const defaultId = useId()
  const componentId = id || defaultId
  const { user, loading: authLoading } = useAuth()

  return (
    <section className="relative bg-teal-700 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
              <svg 
                id="hero-section-logo-icon" 
                className="w-10 h-10 text-white" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 id="hero-section-main-title" className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              {title}
            </h1>
          </div>
          
          <p id="hero-section-subtitle" className="text-xl md:text-2xl text-teal-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            {!authLoading && !user ? (
              <>
                <Link 
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-amber-500 text-teal-900 font-semibold rounded-lg hover:bg-amber-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span id="hero-section-register-text">Get Started Free</span>
                  <svg id="hero-section-register-arrow" className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link 
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40"
                >
                  <span id="hero-section-login-text">Sign In</span>
                </Link>
              </>
            ) : (
              <Link 
                href={ctaLink}
                className="inline-flex items-center justify-center px-8 py-4 bg-amber-500 text-teal-900 font-semibold rounded-lg hover:bg-amber-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span id="hero-section-cta-text">{ctaText}</span>
                <svg id="hero-section-cta-arrow" className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                <svg id="hero-section-feature-toys-icon" className="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 id="hero-section-feature-toys-title" className="text-xl font-semibold mb-2">Quality Toys</h3>
              <p id="hero-section-feature-toys-description" className="text-teal-100">Curated selection of safe, fun toys from trusted Alibaba suppliers</p>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                <svg id="hero-section-feature-cosmetics-icon" className="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 id="hero-section-feature-cosmetics-title" className="text-xl font-semibold mb-2">Premium Cosmetics</h3>
              <p id="hero-section-feature-cosmetics-description" className="text-teal-100">Beauty products that meet Gulf standards at affordable prices</p>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                <svg id="hero-section-feature-shipping-icon" className="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
              </div>
              <h3 id="hero-section-feature-shipping-title" className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p id="hero-section-feature-shipping-description" className="text-teal-100">Reliable shipping directly from Alibaba to your doorstep</p>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/20">
            <p id="hero-section-stats-text" className="text-teal-100 text-lg">
              Trusted by <span id="hero-section-stats-customers" className="text-amber-400 font-semibold">10,000+</span> customers across the Gulf region
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}