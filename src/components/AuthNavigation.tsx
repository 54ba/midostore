"use client";

import { useAuth } from '@/app/contexts/AuthContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AuthNavigation() {
    const { user, isClerkUser } = useAuth();
    const [isClerkAvailable, setIsClerkAvailable] = useState(false);
    const [clerkComponents, setClerkComponents] = useState<any>({});

    // Check if Clerk is available and load components
    useEffect(() => {
        const checkClerk = async () => {
            if (process.env.NEXT_PUBLIC_CLERK_FRONTEND_API && process.env.CLERK_SECRET_KEY) {
                try {
                    const { UserButton, SignInButton, SignUpButton } = await import('@clerk/nextjs');
                    setClerkComponents({ UserButton, SignInButton, SignUpButton });
                    setIsClerkAvailable(true);
                } catch (error) {
                    console.error('Failed to load Clerk components:', error);
                    setIsClerkAvailable(false);
                }
            }
        };

        checkClerk();
    }, []);

    const { UserButton, SignInButton, SignUpButton } = clerkComponents;

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0">
                            <h1 className="text-xl font-bold text-gray-900">MidoHub</h1>
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:ml-6 md:flex md:space-x-8">
                            <Link
                                href="/"
                                className="text-gray-900 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Home
                            </Link>
                            <Link
                                href="/products"
                                className="text-gray-900 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Products
                            </Link>
                            <Link
                                href="/dashboard"
                                className="text-gray-900 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Dashboard
                            </Link>
                        </div>
                    </div>

                    {/* Right side - Auth & Project Links */}
                    <div className="flex items-center space-x-4">
                        {/* Link to Clerk Template Project */}
                        <Link
                            href="https://clerk-netlify-template.netlify.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium border border-blue-300 hover:border-blue-500"
                        >
                            Auth Template
                        </Link>

                        {/* Authentication */}
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-700">
                                    Welcome, {user.full_name}
                                </span>
                                {isClerkUser && isClerkAvailable && UserButton ? (
                                    <UserButton
                                        appearance={{
                                            elements: {
                                                userButtonAvatarBox: 'w-8 h-8',
                                            }
                                        }}
                                    />
                                ) : (
                                    <button
                                        onClick={() => {/* Handle legacy logout */ }}
                                        className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Logout
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                {isClerkAvailable && SignInButton ? (
                                    <SignInButton mode="modal">
                                        <button className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                                            Sign In
                                        </button>
                                    </SignInButton>
                                ) : (
                                    <Link
                                        href="/sign-in"
                                        className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Sign In
                                    </Link>
                                )}

                                {isClerkAvailable && SignUpButton ? (
                                    <SignUpButton mode="modal">
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                                            Sign Up
                                        </button>
                                    </SignUpButton>
                                ) : (
                                    <Link
                                        href="/sign-up"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        Sign Up
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}