"use client";

import { useEffect, useState } from 'react';

export default function UserProfilePage() {
    const [isClerkAvailable, setIsClerkAvailable] = useState(false);
    const [UserProfile, setUserProfile] = useState<any>(null);

    useEffect(() => {
        // Check if Clerk is available
        if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
            import('@clerk/nextjs').then(({ UserProfile: ClerkUserProfile }) => {
                setUserProfile(() => ClerkUserProfile);
                setIsClerkAvailable(true);
            }).catch(() => {
                setIsClerkAvailable(false);
            });
        } else {
            setIsClerkAvailable(false);
        }
    }, []);

    if (!isClerkAvailable || !UserProfile) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            User Profile
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Please sign in to view your profile
                        </p>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-8 text-center">
                        <p className="text-gray-600">Authentication is required to view this page.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        User Profile
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Manage your account settings and preferences
                    </p>
                </div>
                <div className="bg-white shadow-lg rounded-lg">
                    <UserProfile
                        appearance={{
                            elements: {
                                formButtonPrimary: 'bg-blue-500 hover:bg-blue-600 text-white',
                                card: 'shadow-none',
                                headerTitle: 'text-gray-900',
                                headerSubtitle: 'text-gray-600',
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}