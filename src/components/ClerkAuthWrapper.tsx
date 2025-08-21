"use client";

import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import { ReactNode } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';

interface ClerkAuthWrapperProps {
    children: ReactNode;
}

export default function ClerkAuthWrapper({ children }: ClerkAuthWrapperProps) {
    // Check if Clerk is available and properly configured
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const frontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

    const isClerkAvailable = typeof window !== 'undefined' &&
        (publishableKey || frontendApi) &&
        publishableKey !== 'your_clerk_publishable_key_here' &&
        publishableKey !== 'pk_test_your_clerk_publishable_key_here' &&
        publishableKey !== 'pk_test_your_actual_publishable_key_here' &&
        frontendApi !== 'https://handy-cow-68.clerk.accounts.dev';

    // Only use Clerk hooks if available
    const clerkUser = isClerkAvailable ? useUser() : { user: null, isLoaded: true };
    const clerkAuth = isClerkAvailable ? useClerkAuth() : { signOut: () => Promise.resolve() };

    const { setUser } = useAuth();

    // Convert Clerk user to our User format
    const convertClerkUser = (clerkUser: any) => {
        if (!clerkUser) return null;

        return {
            user_id: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            full_name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
            phone: clerkUser.primaryPhoneNumber?.phoneNumber || '',
            created_at: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : undefined,
        };
    };

    // Sync Clerk user state with our AuthContext
    useEffect(() => {
        if (isClerkAvailable && clerkUser.isLoaded) {
            if (clerkUser.user) {
                const convertedUser = convertClerkUser(clerkUser.user);
                setUser(convertedUser);
            } else {
                setUser(null);
            }
        }
    }, [clerkUser.user, clerkUser.isLoaded, isClerkAvailable, setUser]);

    // Handle logout
    const handleLogout = async () => {
        try {
            if (isClerkAvailable) {
                await clerkAuth.signOut();
            }
            setUser(null);
        } catch (error) {
            console.error('Error during logout:', error);
            setUser(null);
        }
    };

    // Update the logout function in AuthContext
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Expose logout function globally for the AuthContext
            (window as any).clerkLogout = handleLogout;
        }
    }, [handleLogout]);

    return <>{children}</>;
}