'use client'

import { useId } from 'react'
import Link from 'next/link'

interface FooterProps {
  id?: string
}

export default function Footer({ id }: FooterProps) {
  const defaultId = useId()
  const footerId = id || defaultId

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center mr-3">
                <span id="footer-logo-text" className="text-white font-bold text-lg">M</span>
              </div>
              <span id="footer-brand-name" className="text-xl font-bold text-gray-900">MidoHub</span>
            </div>
            <p id="footer-company-description" className="text-gray-600 text-sm leading-relaxed mb-4">
              Your trusted dropshipping platform connecting Gulf consumers to affordable toys and cosmetics from Alibaba.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                id="footer-social-facebook"
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-teal-100 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="#" 
                id="footer-social-twitter"
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-teal-100 transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href="#" 
                id="footer-social-instagram"
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-teal-100 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323C6.001 8.198 7.152 7.708 8.449 7.708s2.448.49 3.323 1.416c.875.875 1.365 2.026 1.365 3.323s-.49 2.448-1.365 3.323c-.875.807-2.026 1.218-3.323 1.218zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.875-.875-1.365-2.026-1.365-3.323s.49-2.448 1.365-3.323c.875-.926 2.026-1.416 3.323-1.416s2.448.49 3.323 1.416c.875.875 1.365 2.026 1.365 3.323s-.49 2.448-1.365 3.323z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Products */}
          <div className="col-span-1">
            <h3 id="footer-products-heading" className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Products
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/dashboard" 
                  id="footer-link-toys"
                  className="text-gray-600 hover:text-teal-600 text-sm transition-colors"
                >
                  Toys & Games
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard" 
                  id="footer-link-cosmetics"
                  className="text-gray-600 hover:text-teal-600 text-sm transition-colors"
                >
                  Cosmetics & Beauty
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard" 
                  id="footer-link-featured"
                  className="text-gray-600 hover:text-teal-600 text-sm transition-colors"
                >
                  Featured Products
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard" 
                  id="footer-link-new-arrivals"
                  className="text-gray-600 hover:text-teal-600 text-sm transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="col-span-1">
            <h3 id="footer-account-heading" className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Account
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/profile" 
                  id="footer-link-profile"
                  className="text-gray-600 hover:text-teal-600 text-sm transition-colors"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link 
                  href="/orders" 
                  id="footer-link-orders"
                  className="text-gray-600 hover:text-teal-600 text-sm transition-colors"
                >
                  Order History
                </Link>
              </li>
              <li>
                <Link 
                  href="/cart" 
                  id="footer-link-cart"
                  className="text-gray-600 hover:text-teal-600 text-sm transition-colors"
                >
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link 
                  href="/checkout" 
                  id="footer-link-checkout"
                  className="text-gray-600 hover:text-teal-600 text-sm transition-colors"
                >
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1">
            <h3 id="footer-support-heading" className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/contact" 
                  id="footer-link-contact"
                  className="text-gray-600 hover:text-teal-600 text-sm transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  id="footer-link-help"
                  className="text-gray-600 hover:text-teal-600 text-sm transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  id="footer-link-shipping"
                  className="text-gray-600 hover:text-teal-600 text-sm transition-colors"
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  id="footer-link-returns"
                  className="text-gray-600 hover:text-teal-600 text-sm transition-colors"
                >
                  Returns & Refunds
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p id="footer-copyright" className="text-gray-500 text-sm">
                © 2024 MidoHub. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a 
                  href="#" 
                  id="footer-link-privacy"
                  className="text-gray-500 hover:text-teal-600 text-sm transition-colors"
                >
                  Privacy Policy
                </a>
                <a 
                  href="#" 
                  id="footer-link-terms"
                  className="text-gray-500 hover:text-teal-600 text-sm transition-colors"
                >
                  Terms of Service
                </a>
                <a 
                  href="#" 
                  id="footer-link-cookies"
                  className="text-gray-500 hover:text-teal-600 text-sm transition-colors"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <p id="footer-powered-by" className="text-gray-500 text-sm">
                Powered by Alibaba Integration
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}