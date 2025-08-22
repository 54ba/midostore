"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Crown, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/app/contexts/CartContext';
import LocalizationSelector from './LocalizationSelector';
import ThemeToggle from './ThemeToggle';
import SimpleUserProfile from './SimpleUserProfile';

export default function Header({ id }: { id?: string } = {}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAIDropdownOpen, setIsAIDropdownOpen] = useState(false);
  const { cartItems } = useCart();
  const router = useRouter();

  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    if (cartItems) {
      setIsCartLoaded(true);
      setCartItemCount(cartItems && Array.isArray(cartItems) ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0);
    }
  }, [cartItems]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleAIDropdown = () => {
    setIsAIDropdownOpen(!isAIDropdownOpen);
  };

  const closeAIDropdown = () => {
    setIsAIDropdownOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <Crown className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">MidoHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link
              href="/products"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Products
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Dashboard
            </Link>

            {/* AI Services Dropdown */}
            <div className="relative">
              <button
                onClick={toggleAIDropdown}
                onBlur={() => setTimeout(closeAIDropdown, 150)}
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                <span>AI Services</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isAIDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isAIDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">AI-Powered Services</h3>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/ai-recommendations"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      onClick={closeAIDropdown}
                    >
                      🎯 AI Recommendations
                    </Link>
                    <Link
                      href="/ai-powered-scraping"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      onClick={closeAIDropdown}
                    >
                      🤖 AI Scraping Tools
                    </Link>
                    <Link
                      href="/social-trend-analysis"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      onClick={closeAIDropdown}
                    >
                      📊 Social Trend Analysis
                    </Link>
                    <Link
                      href="/dashboard/ai-orchestrator"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      onClick={closeAIDropdown}
                    >
                      🎼 AI Orchestrator
                    </Link>
                    <Link
                      href="/dashboard/ai-agents"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      onClick={closeAIDropdown}
                    >
                      🤖 AI Agents
                    </Link>
                  </div>

                  <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Powered by advanced AI algorithms</p>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/localization-demo"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Localization
            </Link>
            <Link
              href="/dashboard/bulk-deals"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Bulk Pricing
            </Link>
            <Link
              href="/dashboard/advertising"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Advertising
            </Link>
            <Link
              href="/dashboard/scraping"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Scraping Tools
            </Link>
            <Link
              href="/dashboard/enhanced-dashboard"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Analytics
            </Link>
            <Link
              href="/dashboard/manager"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Manager
            </Link>
            <Link
              href="/dashboard/orders"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Orders
            </Link>
            <Link
              href="/dashboard/user-profile"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Profile
            </Link>
            <Link
              href="/cart"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Cart
            </Link>
            <Link
              href="/checkout"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Checkout
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Contact
            </Link>
          </nav>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Localization Selector */}
            <LocalizationSelector />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <ShoppingBag className="w-6 h-6" />
              {isCartLoaded && cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Simple User Profile */}
            <SimpleUserProfile />

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/products"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>

              {/* AI Services Section Header */}
              <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">AI Services</h3>
              </div>

              <Link
                href="/ai-recommendations"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-colors duration-200 ml-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🎯 AI Recommendations
              </Link>
              <Link
                href="/ai-powered-scraping"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-colors duration-200 ml-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🤖 AI Scraping Tools
              </Link>
              <Link
                href="/social-trend-analysis"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-colors duration-200 ml-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                📊 Social Trend Analysis
              </Link>
              <Link
                href="/dashboard/ai-orchestrator"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-colors duration-200 ml-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🎼 AI Orchestrator
              </Link>
              <Link
                href="/dashboard/ai-agents"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-colors duration-200 ml-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🤖 AI Agents
              </Link>

              {/* Other Services Section Header */}
              <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Other Services</h3>
              </div>

              <Link
                href="/localization-demo"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Localization
              </Link>
              <Link
                href="/dashboard/bulk-deals"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Bulk Pricing
              </Link>
              <Link
                href="/dashboard/advertising"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Advertising
              </Link>
              <Link
                href="/dashboard/scraping"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Scraping Tools
              </Link>
              <Link
                href="/dashboard/enhanced-dashboard"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Analytics
              </Link>
              <Link
                href="/dashboard/manager"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Manager
              </Link>
              <Link
                href="/dashboard/orders"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Orders
              </Link>
              <Link
                href="/dashboard/user-profile"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/cart"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cart
              </Link>
              <Link
                href="/checkout"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Checkout
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {/* Mobile Localization */}
              <div className="px-3 py-2">
                <LocalizationSelector />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}