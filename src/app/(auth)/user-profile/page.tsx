"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function UserProfilePage() {
    const [UserProfileComponent, setUserProfileComponent] = useState<any>(null);
    const [isClerkAvailable, setIsClerkAvailable] = useState(false);

    useEffect(() => {
        const loadClerkComponent = async () => {
            if (process.env.NEXT_PUBLIC_CLERK_FRONTEND_API && process.env.CLERK_SECRET_KEY) {
                try {
                    const { UserProfile } = await import('@clerk/nextjs');
                    setUserProfileComponent(() => UserProfile);
                    setIsClerkAvailable(true);
                } catch (error) {
                    console.error('Failed to load Clerk UserProfile component:', error);
                    setIsClerkAvailable(false);
                }
            }
        };

        loadClerkComponent();
    }, []);

    if (!isClerkAvailable) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            User Profile
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Clerk authentication is not configured
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-500 mb-4">
                            Please configure Clerk environment variables to enable user profile management.
                        </p>
                        <Link
                            href="/"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        User Profile
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Manage your account settings and preferences
                    </p>
                </div>
                {UserProfileComponent && (
                    <UserProfileComponent
                        appearance={{
                            elements: {
                                formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
                                card: 'shadow-lg',
                            }
                        }}
                    />
                )}
            </div>
        </div>
    );
}