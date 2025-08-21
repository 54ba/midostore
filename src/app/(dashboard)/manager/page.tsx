// @ts-nocheck
"use client";

import React, { useEffect, useState } from 'react';
import { useAuthBridge } from '@/app/contexts/AuthContext';
import ManagerDashboard from '@/components/ManagerDashboard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from 'next/navigation';

export default function ManagerPage() {
    const { user, loading } = useAuthBridge();
    const router = useRouter();
    const [isManager, setIsManager] = useState(false);
    const [checkingRole, setCheckingRole] = useState(true);

    useEffect(() => {
        if (!loading && user) {
            checkManagerRole();
        } else if (!loading && !user) {
            router.replace('/sign-in?redirect=/manager');
        }
    }, [user, loading, router]);

    const checkManagerRole = async () => {
        try {
            setCheckingRole(true);

            const response = await fetch(`/api/role-management?action=check-manager&userId=${user.id}`);
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setIsManager(data.data.isManager);

                    if (!data.data.isManager) {
                        // User is not a manager, redirect to dashboard
                        router.replace('/dashboard');
                    }
                }
            }
        } catch (error) {
            console.error('Error checking manager role:', error);
            router.replace('/dashboard');
        } finally {
            setCheckingRole(false);
        }
    };

    if (loading || checkingRole) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect to sign-in
    }

    if (!isManager) {
        return null; // Will redirect to dashboard
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900">👑 Manager Portal</h1>
                    <p className="mt-2 text-gray-600">
                        Unified platform management combining user experience with AI orchestrator supervision.
                    </p>
                </div>

                {/* Hero Section */}
                <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white rounded-lg p-8 mb-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">
                            Manager Access Granted
                        </h2>
                        <p className="text-xl mb-6 text-purple-100">
                            Welcome to your comprehensive management dashboard. You have full access to user experience features
                            plus advanced AI orchestrator supervision, analytics, and platform oversight capabilities.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold mb-2">User Experience</h3>
                                <p className="text-purple-100 text-sm">
                                    Full access to shopping, orders, tokens, and P2P trading
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold mb-2">AI Orchestrator</h3>
                                <p className="text-purple-100 text-sm">
                                    Supervise and control the AI that manages all platform services
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold mb-2">Advanced Analytics</h3>
                                <p className="text-purple-100 text-sm">
                                    Deep insights into users, revenue, performance, and market trends
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold mb-2">Platform Supervision</h3>
                                <p className="text-purple-100 text-sm">
                                    Monitor system health, manage crises, and optimize operations
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Manager Dashboard */}
                <ManagerDashboard />

                {/* Manager Capabilities */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Experience Capabilities */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">🛍️ User Experience Capabilities</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Complete Shopping Experience</p>
                                    <p className="text-sm text-gray-600">Browse products, manage cart, place orders, and track deliveries</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Token Rewards Management</p>
                                    <p className="text-sm text-gray-600">Earn, transfer, and manage tokens through all platform activities</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">P2P Marketplace Trading</p>
                                    <p className="text-sm text-gray-600">Create listings, buy from others, and manage P2P transactions</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Social Features</p>
                                    <p className="text-sm text-gray-600">Share products, write reviews, and engage with the community</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Management Capabilities */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">⚡ Management Capabilities</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">AI Orchestrator Supervision</p>
                                    <p className="text-sm text-gray-600">Control, monitor, and override AI decisions across all services</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Advanced Analytics Access</p>
                                    <p className="text-sm text-gray-600">View all user data, business metrics, and performance insights</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Service Monitoring</p>
                                    <p className="text-sm text-gray-600">Monitor health of all microservices and trigger scaling actions</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Crisis Management</p>
                                    <p className="text-sm text-gray-600">Handle emergencies, system failures, and business disruptions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Manager Role Information */}
                <div className="mt-8 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg p-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold mb-4">Manager Role Overview</h3>
                        <p className="text-gray-300 mb-6">
                            The Manager role is designed for platform supervisors who need both user-level access for testing
                            and administrative oversight for managing the AI orchestrator and monitoring system performance.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="font-semibold mb-2">🎯 Dual Perspective</h4>
                                <p className="text-gray-300 text-sm">
                                    Experience the platform as both a user and a supervisor to ensure optimal user experience
                                </p>
                            </div>

                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="font-semibold mb-2">🤖 AI Oversight</h4>
                                <p className="text-gray-300 text-sm">
                                    Full control over the AI orchestrator that manages all platform operations and decisions
                                </p>
                            </div>

                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="font-semibold mb-2">📊 Data Access</h4>
                                <p className="text-gray-300 text-sm">
                                    Complete visibility into all analytics, user behavior, and business performance metrics
                                </p>
                            </div>

                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="font-semibold mb-2">🛡️ Security Boundaries</h4>
                                <p className="text-gray-300 text-sm">
                                    Read-only access to system configuration with no user management or role assignment capabilities
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}