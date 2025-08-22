"use client";

import React from 'react';
import ManagerDashboard from '@/components/ManagerDashboard';

export default function ManagerPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900">👨‍💼 Manager Dashboard</h1>
                    <p className="mt-2 text-gray-600">
                        Comprehensive management tools for overseeing operations, monitoring performance, and making strategic decisions.
                    </p>
                </div>

                {/* Hero Section */}
                <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">
                            Executive Management Suite
                        </h2>
                        <p className="text-xl mb-6 text-indigo-100">
                            Access advanced management tools, analytics, and oversight capabilities designed for business leaders
                            and decision-makers to drive organizational success.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold mb-2">Performance Analytics</h3>
                                <p className="text-indigo-100 text-sm">
                                    Real-time business metrics and KPI monitoring
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold mb-2">Team Management</h3>
                                <p className="text-indigo-100 text-sm">
                                    User roles, permissions, and team oversight
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold mb-2">Strategic Planning</h3>
                                <p className="text-indigo-100 text-sm">
                                    Long-term planning and goal setting tools
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold mb-2">Risk Management</h3>
                                <p className="text-indigo-100 text-sm">
                                    Risk assessment and mitigation strategies
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Manager Dashboard Component */}
                <ManagerDashboard />

                {/* Management Features */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Executive Tools */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Executive Tools</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Strategic Dashboard</p>
                                    <p className="text-sm text-gray-600">High-level overview of business performance and key metrics</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Resource Allocation</p>
                                    <p className="text-sm text-gray-600">Optimize resource distribution and budget management</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Performance Reviews</p>
                                    <p className="text-sm text-gray-600">Team performance evaluation and feedback systems</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Decision Support</p>
                                    <p className="text-sm text-gray-600">AI-powered insights and recommendations for strategic decisions</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Operational Control */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">⚙️ Operational Control</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">System Monitoring</p>
                                    <p className="text-sm text-gray-600">Real-time system health and performance monitoring</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Process Automation</p>
                                    <p className="text-sm text-gray-600">Automated workflow management and optimization</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Quality Assurance</p>
                                    <p className="text-sm text-gray-600">Quality control processes and compliance monitoring</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Incident Management</p>
                                    <p className="text-sm text-gray-600">Issue tracking, resolution, and post-incident analysis</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Getting Started */}
                <div className="mt-8 bg-indigo-50 rounded-lg p-6">
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">🚀 Management Excellence</h3>
                        <p className="text-gray-600 mb-6">
                            Leverage advanced management tools and insights to drive organizational success and achieve strategic objectives.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg p-4">
                                <div className="text-2xl font-bold text-indigo-600 mb-2">1</div>
                                <h4 className="font-medium text-gray-900 mb-1">Assess Current State</h4>
                                <p className="text-sm text-gray-600">Review current performance and identify opportunities</p>
                            </div>

                            <div className="bg-white rounded-lg p-4">
                                <div className="text-2xl font-bold text-green-600 mb-2">2</div>
                                <h4 className="font-medium text-gray-900 mb-1">Set Strategic Goals</h4>
                                <p className="text-sm text-gray-600">Define clear objectives and success metrics</p>
                            </div>

                            <div className="bg-white rounded-lg p-4">
                                <div className="text-2xl font-bold text-purple-600 mb-2">3</div>
                                <h4 className="font-medium text-gray-900 mb-1">Execute Plans</h4>
                                <p className="text-sm text-gray-600">Implement strategies and monitor progress</p>
                            </div>

                            <div className="bg-white rounded-lg p-4">
                                <div className="text-2xl font-bold text-orange-600 mb-2">4</div>
                                <h4 className="font-medium text-gray-900 mb-1">Optimize Results</h4>
                                <p className="text-sm text-gray-600">Continuously improve and adapt strategies</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}