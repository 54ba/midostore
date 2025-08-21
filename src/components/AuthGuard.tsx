"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface AuthGuardProps {
    children: React.ReactNode;
    redirectTo?: string;
    fallback?: React.ReactNode;
}

export default function AuthGuard({
    children,
    redirectTo = '/sign-in',
    fallback = <LoadingSpinner />
}: AuthGuardProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            // Add current path as redirect parameter
            const currentPath = window.location.pathname;
            const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
            router.push(redirectUrl);
        }
    }, [user, loading, router, redirectTo]);

    // Show loading while checking authentication
    if (loading) {
        return <>{fallback}</>;
    }

    // Show loading while redirecting
    if (!user) {
        return <>{fallback}</>;
    }

    // User is authenticated, show protected content
    return <>{children}</>;
}