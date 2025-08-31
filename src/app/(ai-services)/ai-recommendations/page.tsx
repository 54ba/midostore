'use client';

import React from 'react';
import { Brain, TrendingUp, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PublicAIRecommendations() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Brain className="w-12 h-12 text-blue-600" />
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">AI Product Recommendations</h1>
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Discover amazing products powered by artificial intelligence. Get personalized recommendations
                        based on your preferences and browsing behavior.
                    </p>
                </div>

                {/* Sign In CTA for Guests */}
                <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold mb-4">
                            Get Personalized Recommendations
                        </h2>
                        <p className="text-blue-100 mb-6 text-lg">
                            Sign in to unlock AI-powered personalized product suggestions based on your unique preferences,
                            browsing history, and purchase patterns.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/sign-in"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Sign In
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/sign-up"
                                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Popular Products Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="w-8 h-8 text-green-600" />
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Popular Products</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        Discover trending products that customers love. These recommendations are based on sales data,
                        ratings, and customer interactions.
                    </p>

                    {/* Demo Product Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { id: 1, name: 'Wireless Headphones Pro', price: '$89.99', rating: 4.8, category: 'Electronics' },
                            { id: 2, name: 'Smart Fitness Watch', price: '$199.99', rating: 4.6, category: 'Electronics' },
                            { id: 3, name: 'Portable Bluetooth Speaker', price: '$49.99', rating: 4.7, category: 'Electronics' },
                            { id: 4, name: 'Premium Coffee Maker', price: '$129.99', rating: 4.9, category: 'Home' },
                            { id: 5, name: 'Yoga Mat Premium', price: '$39.99', rating: 4.5, category: 'Sports' },
                            { id: 6, name: 'LED Desk Lamp', price: '$24.99', rating: 4.4, category: 'Home' },
                            { id: 7, name: 'Wireless Mouse', price: '$19.99', rating: 4.3, category: 'Electronics' },
                            { id: 8, name: 'Water Bottle Insulated', price: '$14.99', rating: 4.6, category: 'Sports' }
                        ].map((product) => (
                            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                                <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                                    <img
                                        src={`/api/placeholder/200/200?text=${encodeURIComponent(product.name)}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm line-clamp-2">
                                    {product.name}
                                </h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{product.category}</p>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-bold text-green-600">{product.price}</span>
                                    <div className="flex items-center">
                                        <Star className="w-3 h-3 fill-current text-yellow-400" />
                                        <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">{product.rating}</span>
                                    </div>
                                </div>
                                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Features Section */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
                        How AI Recommendations Work
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Brain className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Smart Analysis
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Our AI analyzes your browsing patterns, purchase history, and preferences to understand what you love.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Real-time Updates
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Recommendations update in real-time based on trending products, seasonal changes, and market dynamics.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="w-8 h-8 text-yellow-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Quality Assured
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Only high-rated products with verified reviews make it to your personalized recommendations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Join thousands of satisfied customers who trust our AI recommendations to find their perfect products.
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Explore Products
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}