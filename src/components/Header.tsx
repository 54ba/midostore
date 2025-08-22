"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Crown, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/app/contexts/CartContext';
import LocalizationSelector from './LocalizationSelector';
import ThemeToggle from './ThemeToggle';
import ThemeStatusIndicator from './ThemeStatusIndicator';
import ServicesSelector from './ServicesSelector';
import SimpleUserProfile from './SimpleUserProfile';

export default function Header({ id }: { id?: string } = {}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAllServicesDropdownOpen, setIsAllServicesDropdownOpen] = useState(false);
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

  // Enhanced focus management for dropdowns
  useEffect(() => {
    const handleGlobalFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      const isInDropdown = target.closest('.dropdown-container') || target.closest('[data-dropdown]');

      if (!isInDropdown) {
        // Close all dropdowns if focus moves outside any dropdown
        setTimeout(() => {
          if (!document.activeElement?.closest('.dropdown-container')) {
            closeAllDropdowns();
          }
        }, 100);
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInDropdown = target.closest('.dropdown-container') || target.closest('[data-dropdown]');

      if (!isInDropdown) {
        // Close all dropdowns if clicking outside
        setTimeout(() => {
          if (!document.activeElement?.closest('.dropdown-container')) {
            closeAllDropdowns();
          }
        }, 100);
      }
    };

    document.addEventListener('focusin', handleGlobalFocus);
    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('focusin', handleGlobalFocus);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleAllServicesDropdown = () => {
    setIsAllServicesDropdownOpen(!isAllServicesDropdownOpen);
  };

  const closeAllDropdowns = () => {
    setIsAllServicesDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 backdrop-blur-md bg-white/95 dark:bg-gray-900/95">
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

          <div className="flex items-center space-x-4">

            {/* Services Selector */}
            <ServicesSelector />

            {/* Localization Selector */}
            <LocalizationSelector />

            {/* Theme Status Indicator */}
            {/* <ThemeStatusIndicator /> */}

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
      </div>
    </header>
  );
}