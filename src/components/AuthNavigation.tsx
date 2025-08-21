"use client";

import { useAuth } from '@/app/contexts/AuthContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AuthNavigation() {
    const { user, isClerkUser, logout } = useAuth();
    const [isClerkAvailable, setIsClerkAvailable] = useState(false);
    const [clerkComponents, setClerkComponents] = useState<any>({});

    // Check if Clerk is available and load components
    useEffect(() => {
        const checkClerk = async () => {
            // Check if Clerk is properly configured
            const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
            const frontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

            const isClerkConfigured = (publishableKey || frontendApi) &&
                publishableKey !== 'your_clerk_publishable_key_here' &&
                publishableKey !== 'pk_test_your_clerk_publishable_key_here' &&
                publishableKey !== 'pk_test_your_actual_publishable_key_here' &&
                frontendApi !== 'https://handy-cow-68.clerk.accounts.dev';

            if (isClerkConfigured) {
                try {
                    const { UserButton, SignInButton, SignUpButton } = await import('@clerk/nextjs');
                    setClerkComponents({ UserButton, SignInButton, SignUpButton });
                    setIsClerkAvailable(true);
                } catch (error) {
                    console.error('Failed to load Clerk components:', error);
                    setIsClerkAvailable(false);
                }
            } else {
                setIsClerkAvailable(false);
            }
        };

        checkClerk();
    }, []);

    const { UserButton, SignInButton, SignUpButton } = clerkComponents;

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div className="flex items-center space-x-4">
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
                            onClick={handleLogout}
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
                            href={isClerkUser ? "/sign-in" : "/dashboard"}
                            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            {isClerkUser ? "Sign In" : "Dashboard"}
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
                            href={isClerkUser ? "/sign-up" : "/dashboard"}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            {isClerkUser ? "Sign Up" : "Get Started"}
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}