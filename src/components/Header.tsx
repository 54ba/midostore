'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import Link from 'next/link'
import { useState } from 'react'
import { useId } from 'react'

interface HeaderProps {
  id?: string
}

export default function Header({ id }: HeaderProps) {
  const defaultId = useId()
  const componentId = id || defaultId
  const { user, loading: authLoading, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setIsUserMenuOpen(false)
  }

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

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {!authLoading && user ? (
              <div className="relative">
                <button
                  id="header-user-menu-button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 transition-colors"
                >
                  <div 
                    id="header-user-avatar"
                    className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center"
                  >
                    <span id="header-user-initial" className="text-white text-sm font-medium">
                      {user.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span id="header-user-name" className="hidden sm:block font-medium">
                    {user.full_name}
                  </span>
                  <svg 
                    id="header-dropdown-arrow"
                    className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <div 
                    id="header-user-dropdown"
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                  >
                    <Link
                      href="/profile"
                      id="header-dropdown-profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      id="header-dropdown-orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <hr className="my-1 border-gray-200" />
                    <button
                      id="header-dropdown-logout"
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : !authLoading ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  id="header-login-link"
                  className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  id="header-register-link"
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium"
                >
                  Sign Up
                </Link>
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
              
              {!authLoading && !user && (
                <div className="flex flex-col space-y-2 pt-3 border-t border-gray-200">
                  <Link
                    href="/login"
                    id="header-mobile-login"
                    className="text-gray-700 hover:text-teal-600 font-medium transition-colors px-2 py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    id="header-mobile-register"
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}