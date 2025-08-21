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

    // Check if Clerk is properly configured (not placeholder values)
    const isClerkConfigured = clerkConfig &&
        clerkConfig !== 'your_clerk_publishable_key_here' &&
        clerkConfig !== 'pk_test_your_clerk_publishable_key_here' &&
        clerkConfig !== 'pk_test_your_actual_publishable_key_here' &&
        clerkConfig !== 'https://handy-cow-68.clerk.accounts.dev';

    if (!isClerkConfigured) {
        // Clerk is in keyless mode - render children without Clerk
        console.warn('Clerk is in keyless mode. Please set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in your environment variables.');
        console.warn('See CLERK_SETUP_GUIDE.md for setup instructions.');
        return <>{children}</>;
    }

    // If using frontend API (older Clerk version)
    if (frontendApi && !publishableKey && isClerkConfigured) {
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