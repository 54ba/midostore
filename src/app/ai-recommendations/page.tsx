'use client';

import React from 'react';
import { Brain, TrendingUp, Star, ArrowRight } from 'lucide-react';
import AIRecommendations from '../../components/AIRecommendations';
import Link from 'next/link';

export default function PublicAIRecommendations() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Brain className="w-12 h-12 text-blue-600" />
                        <h1 className="text-4xl font-bold text-gray-900">AI Product Recommendations</h1>
                    </div>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                        <h2 className="text-3xl font-bold text-gray-900">Popular Products</h2>
                    </div>
                    <p className="text-gray-600 mb-8">
                        Discover trending products that customers love. These recommendations are based on sales data,
                        ratings, and customer interactions.
                    </p>
                    <AIRecommendations
                        type="popular"
                        nItems={12}
                        showTitle={false}
                        className="bg-white p-6 rounded-xl shadow-lg"
                    />
                </div>

                {/* Category-based Recommendations */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Star className="w-8 h-8 text-yellow-600" />
                        <h2 className="text-3xl font-bold text-gray-900">Explore by Category</h2>
                    </div>
                    <p className="text-gray-600 mb-8">
                        Browse recommendations by category to find exactly what you&apos;re looking for.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {['electronics', 'clothing', 'home', 'beauty', 'sports', 'books'].map((category) => (
                            <div key={category} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4 capitalize">
                                    {category}
                                </h3>
                                <AIRecommendations
                                    type="popular"
                                    category={category}
                                    nItems={4}
                                    showTitle={false}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Features Section */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                        How AI Recommendations Work
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Brain className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Machine Learning</h3>
                            <p className="text-gray-600">
                                Our AI analyzes millions of data points to understand product relationships and user preferences.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Updates</h3>
                            <p className="text-gray-600">
                                Recommendations improve continuously as we learn from user interactions and preferences.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Experience</h3>
                            <p className="text-gray-600">
                                Get recommendations tailored to your unique tastes, browsing history, and purchase patterns.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center bg-gray-100 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Ready for Personalized Recommendations?
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Join thousands of users who discover amazing products through AI-powered recommendations.
                    </p>
                    <Link
                        href="/sign-up"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
                    >
                        Get Started Now
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}