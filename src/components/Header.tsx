'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import { useCart } from '@/app/contexts/CartContext'
import { UserButton, SignInButton, SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'
import { useState } from 'react'
import { useId } from 'react'
import { ShoppingCart } from 'lucide-react'
import LocalizationPanel from './LocalizationPanel'

interface HeaderProps {
  id?: string
}

export default function Header({ id }: HeaderProps) {
  const defaultId = useId()
  const componentId = id || defaultId
  const { user, loading: authLoading } = useAuth()
  const { cartCount } = useCart()
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
              href="/products"
              id="header-nav-products"
              className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              Products
            </Link>
            <Link
              href="/ai-recommendations"
              id="header-nav-ai-recommendations"
              className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              AI Recommendations
            </Link>
            <Link
              href="/scraping"
              id="header-nav-scraping"
              className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              Scraping
            </Link>
          </nav>

          {/* Right side - Cart, Localization, and Auth */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-teal-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Localization Panel */}
            <LocalizationPanel />

            {/* Authentication */}
            {!authLoading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700 hidden sm:block">
                      {user.full_name}
                    </span>
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox: 'w-8 h-8'
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <SignInButton mode="modal">
                      <button className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              id="header-mobile-menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-teal-600 focus:outline-none focus:text-teal-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link
                href="/dashboard"
                id="header-mobile-nav-dashboard"
                className="block px-3 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/products"
                id="header-mobile-nav-products"
                className="block px-3 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/ai-recommendations"
                id="header-mobile-nav-ai-recommendations"
                className="block px-3 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                AI Recommendations
              </Link>
              <Link
                href="/scraping"
                id="header-mobile-nav-scraping"
                className="block px-3 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Scraping
              </Link>
              <Link
                href="/cart"
                className="block px-3 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}