'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import { UserButton, SignInButton, SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'
import { useState } from 'react'
import { useId } from 'react'
import LocalizationPanel from './LocalizationPanel'

interface HeaderProps {
  id?: string
}

export default function Header({ id }: HeaderProps) {
  const defaultId = useId()
  const componentId = id || defaultId
  const { user, loading: authLoading } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div
                id="header-logo-icon"
                className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center"
              >
                <span id="header-logo-text" className="text-white font-bold text-lg">M</span>
              </div>
              <span id="header-brand-name" className="text-xl font-bold text-gray-900">
                MidoHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/dashboard"
              id="header-nav-dashboard"
              className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/ai-recommendations"
              id="header-nav-ai-recommendations"
              className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              AI Recommendations
            </Link>
            <Link
              href="/ai-powered-scraping"
              id="header-nav-ai-scraping"
              className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              AI Scraping
            </Link>
            <Link
              href="/social-trend-analysis"
              id="header-nav-social-trends"
              className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              Social Trends
            </Link>
            <Link
              href="/localization-demo"
              id="header-nav-localization-demo"
              className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              Localization Demo
            </Link>
            <Link
              href="/orders"
              id="header-nav-orders"
              className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              Orders
            </Link>
            <Link
              href="/cart"
              id="header-nav-cart"
              className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              Cart
            </Link>
            <Link
              href="/contact"
              id="header-nav-contact"
              className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* User Menu and Localization */}
          <div className="flex items-center space-x-4">
            {/* Localization Panel */}
            <LocalizationPanel variant="header" />

            {!authLoading && user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  id="header-dropdown-profile"
                  className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
                >
                  Profile
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8",
                      userButtonTrigger: "focus:shadow-none"
                    }
                  }}
                />
              </div>
            ) : !authLoading ? (
              <div className="flex items-center space-x-3">
                <SignInButton mode="modal">
                  <button
                    id="header-login-link"
                    className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
                  >
                    Login
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    id="header-register-link"
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium"
                  >
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            ) : (
              <div id="header-auth-loading" className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            )}

            {/* Mobile Menu Button */}
            <button
              id="header-mobile-menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-teal-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div id="header-mobile-menu" className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              <Link
                href="/dashboard"
                id="header-mobile-dashboard"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/ai-recommendations"
                id="header-mobile-ai-recommendations"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                AI Recommendations
              </Link>
              <Link
                href="/localization-demo"
                id="header-mobile-localization-demo"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Localization Demo
              </Link>
              <Link
                href="/orders"
                id="header-mobile-orders"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Orders
              </Link>
              <Link
                href="/cart"
                id="header-mobile-cart"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Cart
              </Link>
              <Link
                href="/contact"
                id="header-mobile-contact"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {user && (
                <>
                  <Link
                    href="/profile"
                    id="header-mobile-profile"
                    className="text-gray-700 hover:text-teal-600 font-medium transition-colors px-2 py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <hr className="border-gray-200" />
                </>
              )}

              {/* Mobile Localization Panel */}
              <div className="px-2 py-1">
                <LocalizationPanel variant="dropdown" />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}