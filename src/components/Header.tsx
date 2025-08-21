"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSimpleAuth } from '@/app/contexts/SimpleAuthContext';
import { useCart } from '@/app/contexts/CartContext';
import {
  ShoppingBag,
  Search,
  Crown,
  Menu,
  X
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LocalizationSelector from './LocalizationSelector';
import SimpleUserProfile from './SimpleUserProfile';

export default function Header({ id }: { id?: string } = {}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading: authLoading } = useSimpleAuth();
  const { cartItems } = useCart();
  const router = useRouter();

  // Add loading state to prevent rendering before cart is initialized
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  useEffect(() => {
    // Set cart as loaded after a brief delay to ensure context is ready
    const timer = setTimeout(() => setIsCartLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const cartItemCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
          <nav className="hidden md:flex space-x-8">
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
              href="/dashboard/cart"
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
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
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