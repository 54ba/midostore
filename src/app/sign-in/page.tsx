"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { ArrowLeft, User, Lock } from 'lucide-react';

export default function SignInPage() {
    const router = useRouter();
    const [isClerkAvailable, setIsClerkAvailable] = useState(false);
    const [SignIn, setSignIn] = useState<any>(null);

    useEffect(() => {
        // Check if Clerk is available
        if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
            process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'your_clerk_publishable_key_here' &&
            process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'pk_test_your_clerk_publishable_key_here' &&
            process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'pk_test_your_actual_publishable_key_here') {
            import('@clerk/nextjs').then(({ SignIn: ClerkSignIn }) => {
                setSignIn(() => ClerkSignIn);
                setIsClerkAvailable(true);
            }).catch(() => {
                setIsClerkAvailable(false);
            });
        } else {
            setIsClerkAvailable(false);
        }
    }, []);

    const handleBackToHome = () => {
        router.push('/');
    };

    // Show Clerk SignIn component if available
    if (isClerkAvailable && SignIn) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In to MidoHub</h2>
                        <p className="text-gray-600">
                            Access your dropshipping dashboard
                        </p>
                    </div>

                    <SignIn
                        appearance={{
                            elements: {
                                formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
                                card: 'shadow-lg',
                                headerTitle: 'text-gray-900',
                                headerSubtitle: 'text-gray-600',
                            }
                        }}
                    />

                    <div className="text-center mt-6">
                        <Button
                            onClick={handleBackToHome}
                            variant="outline"
                            className="w-full"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Fallback when Clerk is not configured
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In to MidoHub</h2>
                    <p className="text-gray-600">
                        Access your dropshipping dashboard
                    </p>
                </div>

                {/* Sign In Form */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="space-y-6">
                        {/* Clerk Configuration Notice */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <Lock className="h-5 w-5 text-amber-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-amber-800">
                                        Authentication Setup Required
                                    </h3>
                                    <div className="mt-2 text-sm text-amber-700">
                                        <p>
                                            To enable sign-in functionality, you need to configure Clerk authentication:
                                        </p>
                                        <ul className="mt-2 list-disc list-inside space-y-1">
                                            <li>Set up a Clerk account at <a href="https://clerk.com" target="_blank" rel="noopener noreferrer" className="underline">clerk.com</a></li>
                                            <li>Add your Clerk publishable key to <code className="bg-amber-100 px-1 rounded">.env.local</code></li>
                                            <li>Update <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Demo Sign In */}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your email"
                                    disabled
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your password"
                                    disabled
                                />
                            </div>

                            <Button
                                variant="primary"
                                className="w-full"
                                disabled
                            >
                                Sign In
                            </Button>
                        </div>

                        {/* Alternative Actions */}
                        <div className="text-center space-y-3">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <button
                                    onClick={() => router.push('/sign-up')}
                                    className="text-blue-600 hover:text-blue-500 font-medium"
                                >
                                    Sign up
                                </button>
                            </p>

                            <Button
                                onClick={handleBackToHome}
                                variant="outline"
                                className="w-full"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-gray-500">
                    <p>
                        Need help? Contact our support team
                    </p>
                </div>
            </div>
        </div>
    );
}