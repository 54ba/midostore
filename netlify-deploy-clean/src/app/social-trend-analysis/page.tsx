import React from 'react';
import SocialTrendAnalysisDashboard from '@/components/SocialTrendAnalysisDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Social Trend Analysis | MidoStore',
    description: 'AI-powered analysis of trending topics from Reddit, Twitter, and news sources to identify product opportunities and market trends.',
    keywords: 'social media trends, trend analysis, Reddit trends, Twitter trends, news analysis, AI analysis, product opportunities',
};

export default function SocialTrendAnalysisPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
            <div className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Social Trend Analysis
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Discover trending topics across social media platforms and identify product opportunities
                        using our AI-powered trend analysis system. Monitor Reddit, Twitter, and news sources
                        in real-time to stay ahead of market trends.
                    </p>
                </div>

                {/* Platform Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Reddit Trends</h3>
                        <p className="text-gray-600">
                            Monitor trending posts across popular subreddits including technology, science,
                            politics, and business. Identify viral content and community discussions that
                            could impact product demand.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Twitter Trends</h3>
                        <p className="text-gray-600">
                            Track trending hashtags and conversations on Twitter in real-time.
                            Analyze viral tweets, engagement metrics, and sentiment to understand
                            what&apos;s capturing public attention.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">News Analysis</h3>
                        <p className="text-gray-600">
                            Monitor breaking news and trending stories from major news sources.
                            Identify emerging topics, political developments, and business trends
                            that could create product opportunities.
                        </p>
                    </div>
                </div>

                {/* AI Capabilities Section */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            AI-Powered Trend Intelligence
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Our advanced AI system analyzes social media trends to provide actionable insights
                            for product development and marketing strategies.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Sentiment Analysis</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-700">Real-time sentiment classification (positive/negative/neutral)</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-700">Emotion detection and mood analysis</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-700">Brand sentiment tracking and monitoring</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-700">Trend sentiment correlation analysis</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Opportunity Detection</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-700">Automatic product-trend matching</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-700">Market demand prediction algorithms</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-700">Competitive landscape analysis</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-700">Marketing opportunity identification</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Use Cases Section */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 mb-12">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Strategic Use Cases
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Discover how social trend analysis can transform your business strategy
                            and product development process.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Research</h3>
                            <p className="text-gray-600 text-sm">
                                Identify emerging market trends and consumer interests before they become mainstream.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Development</h3>
                            <p className="text-gray-600 text-sm">
                                Align product features and development priorities with trending consumer demands.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.08A10 10 0 1020 12a10 10 0 00-9-6.92zM14 12a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Marketing</h3>
                            <p className="text-gray-600 text-sm">
                                Create timely, relevant content that aligns with trending topics and conversations.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Engagement</h3>
                            <p className="text-gray-600 text-sm">
                                Engage with relevant communities and conversations to build brand awareness.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Tracking</h3>
                            <p className="text-gray-600 text-sm">
                                Monitor how trending topics impact your product performance and sales.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Management</h3>
                            <p className="text-gray-600 text-sm">
                                Identify potential risks and negative trends that could impact your business.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dashboard */}
                <SocialTrendAnalysisDashboard />

                {/* Footer Section */}
                <div className="text-center mt-16 text-gray-600">
                    <p className="mb-2">
                        Stay ahead of the curve with AI-powered social media trend analysis
                    </p>
                    <p className="text-sm">
                        © 2024 MidoStore. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}