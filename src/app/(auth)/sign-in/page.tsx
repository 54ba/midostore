"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SignInPage() {
    const [SignInComponent, setSignInComponent] = useState<any>(null);
    const [isClerkAvailable, setIsClerkAvailable] = useState(false);

    useEffect(() => {
        const loadClerkComponent = async () => {
            if (process.env.NEXT_PUBLIC_CLERK_FRONTEND_API && process.env.CLERK_SECRET_KEY) {
                try {
                    const { SignIn } = await import('@clerk/nextjs');
                    setSignInComponent(() => SignIn);
                    setIsClerkAvailable(true);
                } catch (error) {
                    console.error('Failed to load Clerk SignIn component:', error);
                    setIsClerkAvailable(false);
                }
            }
        };

        loadClerkComponent();
    }, []);

    if (!isClerkAvailable) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Sign in to MidoHub
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Clerk authentication is not configured
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-500 mb-4">
                            Please configure Clerk environment variables to enable authentication.
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to MidoHub
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Access your dropshipping dashboard
                    </p>
                </div>
                {SignInComponent && (
                    <SignInComponent
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