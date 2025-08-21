"use client";

import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';

interface ClerkProviderWrapperProps {
    children: ReactNode;
}

export default function ClerkProviderWrapper({ children }: ClerkProviderWrapperProps) {
    // Check if Clerk environment variables are available
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const frontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

    // Use either publishable key or frontend API
    const clerkConfig = publishableKey || frontendApi;

    if (!clerkConfig ||
        clerkConfig === 'your_clerk_publishable_key_here' ||
        clerkConfig === 'pk_test_your_clerk_publishable_key_here' ||
        clerkConfig === 'pk_test_your_actual_publishable_key_here') {
        // During build time or when Clerk is not configured, render children without Clerk
        console.warn('Clerk is not configured. Please set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in your environment variables.');
        console.warn('See CLERK_SETUP_GUIDE.md for setup instructions.');
        return <>{children}</>;
    }

    // If using frontend API (older Clerk version)
    if (frontendApi && !publishableKey) {
        return (
            <ClerkProvider
                frontendApi={frontendApi}
                signInUrl="/sign-in"
                signUpUrl="/sign-up"
                afterSignInUrl="/dashboard"
                afterSignUpUrl="/dashboard"
            >
                {children}
            </ClerkProvider>
        );
    }

    // If using publishable key (newer Clerk version)
    return (
        <ClerkProvider
            publishableKey={publishableKey}
            signInUrl="/sign-in"
            signUpUrl="/sign-up"
            afterSignInUrl="/dashboard"
            afterSignUpUrl="/dashboard"
        >
            {children}
        </ClerkProvider>
    );
}