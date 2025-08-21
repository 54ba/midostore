"use client";

import React from 'react';
import Link from 'next/link';
import {
  Crown,
  Mail,
  Phone,
  MapPin,
  Globe,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
  Heart,
  Shield,
  Truck,
  Zap,
  Star
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Electronics', href: '/products?category=electronics' },
      { name: 'Toys & Games', href: '/products?category=toys' },
      { name: 'Beauty & Health', href: '/products?category=beauty' },
      { name: 'Home & Garden', href: '/products?category=home' },
      { name: 'Fashion', href: '/products?category=fashion' },
      { name: 'Sports & Outdoor', href: '/products?category=sports' }
    ],
    platform: [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'AI Recommendations', href: '/ai-recommendations' },
      { name: 'Bulk Pricing', href: '/bulk-deals' },
      { name: 'Advertising', href: '/advertising' },
      { name: 'Scraping Tools', href: '/scraping' },
      { name: 'Analytics', href: '/enhanced-dashboard' }
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Support', href: '/contact' },
      { name: 'API Documentation', href: '/api-docs' },
      { name: 'Community Forum', href: '/community' },
      { name: 'Video Tutorials', href: '/tutorials' },
      { name: 'Live Chat', href: '/chat' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Mission', href: '/mission' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press Kit', href: '/press' },
      { name: 'Partnerships', href: '/partnerships' },
      { name: 'Legal', href: '/legal' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: Twitter, color: 'hover:text-blue-400' },
    { name: 'Facebook', href: '#', icon: Facebook, color: 'hover:text-blue-600' },
    { name: 'Instagram', href: '#', icon: Instagram, color: 'hover:text-pink-500' },
    { name: 'LinkedIn', href: '#', icon: Linkedin, color: 'hover:text-blue-700' },
    { name: 'YouTube', href: '#', icon: Youtube, color: 'hover:text-red-500' }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Bank-level security with SSL encryption and secure payment processing'
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Optimized shipping routes with major carriers for quick delivery'
    },
    {
      icon: Zap,
      title: '24/7 Support',
      description: 'Round-the-clock customer support in Arabic and English'
    },
    {
      icon: Star,
      title: 'Quality Assured',
      description: 'Every product pre-vetted for quality standards and authenticity'
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  MidoHub
                </h3>
                <p className="text-gray-400 text-sm">Premium Dropshipping Platform</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Transform your business with MidoHub's AI-powered dropshipping platform.
              Connect directly to Alibaba's verified suppliers and build your empire in the Gulf region.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">{feature.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Products</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              Stay Updated with MidoHub
            </h3>
            <p className="text-gray-400 mb-6">
              Get the latest dropshipping tips, product updates, and exclusive deals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} MidoHub. All rights reserved. Made with{' '}
              <Heart className="inline w-4 h-4 text-red-500" /> in the Gulf Region
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={`text-gray-400 ${social.color} transition-colors duration-200 p-2 hover:bg-gray-800 rounded-lg`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info Bar */}
      <div className="bg-black/50 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>support@midohub.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+971 4 123 4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Dubai, UAE</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span>🌍 Available in 7 countries</span>
              <span>🔒 SSL Secured</span>
              <span>⚡ Fast & Reliable</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}