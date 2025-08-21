"use client";

import React from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import AIAgentDashboard from '@/components/AIAgentDashboard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AIAgentsPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900">🤖 AI Agent Supervisor</h1>
                    <p className="mt-2 text-gray-600">
                        LangChain-powered AI agents that communicate with and supervise the orchestrator through intelligent prompts.
                    </p>
                </div>

                {/* Hero Section */}
                <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white rounded-lg p-8 mb-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">
                            Advanced AI Agent Communication
                        </h2>
                        <p className="text-xl mb-6 text-purple-100">
                            Our sophisticated AI agents use LangChain to communicate with the orchestrator through natural language,
                            providing intelligent supervision, analysis, and decision-making capabilities.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold mb-2">System Analyst</h3>
                                <p className="text-purple-100 text-sm">
                                    Performance monitoring and system optimization
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold mb-2">Business Intelligence</h3>
                                <p className="text-purple-100 text-sm">
                                    Market analysis and strategic decision-making
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold mb-2">Crisis Manager</h3>
                                <p className="text-purple-100 text-sm">
                                    Emergency response and system recovery
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold mb-2">Optimizer</h3>
                                <p className="text-purple-100 text-sm">
                                    Continuous improvement and efficiency
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold mb-2">Decision Supervisor</h3>
                                <p className="text-purple-100 text-sm">
                                    Orchestrator decision validation and oversight
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Agent Dashboard */}
                <AIAgentDashboard />

                {/* Features Grid */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LangChain Integration */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">🔗 LangChain Integration</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Advanced Language Models</p>
                                    <p className="text-sm text-gray-600">GPT-4 and Claude-3 integration for sophisticated reasoning</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Tool Integration</p>
                                    <p className="text-sm text-gray-600">Direct access to orchestrator functions and system data</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Agent Coordination</p>
                                    <p className="text-sm text-gray-600">Multi-agent workflows for complex analysis scenarios</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Intelligent Prompting</p>
                                    <p className="text-sm text-gray-600">Context-aware prompts with system state integration</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Agent Capabilities */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">🧠 Agent Capabilities</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Real-time System Analysis</p>
                                    <p className="text-sm text-gray-600">Continuous monitoring and performance evaluation</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Strategic Decision Making</p>
                                    <p className="text-sm text-gray-600">Business intelligence and market trend analysis</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Crisis Management</p>
                                    <p className="text-sm text-gray-600">Emergency detection and automated response protocols</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Orchestrator Supervision</p>
                                    <p className="text-sm text-gray-600">Decision validation and intelligent oversight</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical Architecture */}
                <div className="mt-8 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg p-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold mb-4">Advanced AI Agent Architecture</h3>
                        <p className="text-gray-300 mb-6">
                            Built with cutting-edge LangChain technology, our AI agents provide sophisticated reasoning,
                            tool integration, and multi-modal communication capabilities for comprehensive system supervision.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="font-semibold mb-2">🔧 Tool Integration</h4>
                                <p className="text-gray-300 text-sm">
                                    Direct access to orchestrator APIs, system metrics, and business intelligence data
                                </p>
                            </div>

                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="font-semibold mb-2">💬 Natural Language Interface</h4>
                                <p className="text-gray-300 text-sm">
                                    Communicate with agents using natural language prompts and receive detailed analysis
                                </p>
                            </div>

                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="font-semibold mb-2">🤝 Multi-Agent Coordination</h4>
                                <p className="text-gray-300 text-sm">
                                    Agents collaborate on complex scenarios requiring multiple perspectives and expertise
                                </p>
                            </div>

                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="font-semibold mb-2">📊 Context-Aware Analysis</h4>
                                <p className="text-gray-300 text-sm">
                                    Real-time system context integration for accurate and relevant recommendations
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Getting Started */}
                <div className="mt-8 bg-blue-50 rounded-lg p-6">
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">🚀 Getting Started with AI Agents</h3>
                        <p className="text-gray-600 mb-6">
                            Experience the power of AI-driven orchestrator supervision through intelligent agent communication.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg p-4">
                                <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
                                <h4 className="font-medium text-gray-900 mb-1">Start Supervisor</h4>
                                <p className="text-sm text-gray-600">Initialize the AI agent supervisor system</p>
                            </div>

                            <div className="bg-white rounded-lg p-4">
                                <div className="text-2xl font-bold text-green-600 mb-2">2</div>
                                <h4 className="font-medium text-gray-900 mb-1">Select Agent</h4>
                                <p className="text-sm text-gray-600">Choose the specialized agent for your task</p>
                            </div>

                            <div className="bg-white rounded-lg p-4">
                                <div className="text-2xl font-bold text-purple-600 mb-2">3</div>
                                <h4 className="font-medium text-gray-900 mb-1">Communicate</h4>
                                <p className="text-sm text-gray-600">Send natural language prompts and instructions</p>
                            </div>

                            <div className="bg-white rounded-lg p-4">
                                <div className="text-2xl font-bold text-orange-600 mb-2">4</div>
                                <h4 className="font-medium text-gray-900 mb-1">Supervise</h4>
                                <p className="text-sm text-gray-600">Monitor orchestrator decisions and actions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}