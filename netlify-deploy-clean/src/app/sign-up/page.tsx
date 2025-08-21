"use client";

import { useEffect, useState } from 'react';

export default function SignUpPage() {
    const [isClerkAvailable, setIsClerkAvailable] = useState(false);
    const [SignUp, setSignUp] = useState<any>(null);

    useEffect(() => {
        // Check if Clerk is available
        if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
            import('@clerk/nextjs').then(({ SignUp: ClerkSignUp }) => {
                setSignUp(() => ClerkSignUp);
                setIsClerkAvailable(true);
            }).catch(() => {
                setIsClerkAvailable(false);
            });
        } else {
            setIsClerkAvailable(false);
        }
    }, []);

    if (!isClerkAvailable || !SignUp) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Create your account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Authentication service is not available
                        </p>
                    </div>
                    <div className="mt-8">
                        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
                            <p className="text-gray-600">Please check your configuration.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Join MidoHub today
                    </p>
                </div>
                <div className="mt-8">
                    <SignUp
                        appearance={{
                            elements: {
                                formButtonPrimary: 'bg-blue-500 hover:bg-blue-600 text-white',
                                card: 'shadow-lg',
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