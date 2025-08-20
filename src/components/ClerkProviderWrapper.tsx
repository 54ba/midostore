"use client";

import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';

interface ClerkProviderWrapperProps {
    children: ReactNode;
}

export default function ClerkProviderWrapper({ children }: ClerkProviderWrapperProps) {
    // Check if Clerk environment variables are available
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

    if (!publishableKey) {
        // During build time or when Clerk is not configured, render children without Clerk
        return <>{children}</>;
    }

    return (
        <ClerkProvider
            publishableKey={publishableKey}
            signInUrl="/sign-in"
            signUpUrl="/sign-up"
            afterSignInUrl="/dashboard"
            afterSignUpUrl="/dashboard"
            signInFallbackRedirectUrl="/"
            signUpFallbackRedirectUrl="/"
        >
            {children}
        </ClerkProvider>
    );
}