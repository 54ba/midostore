"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  user_id: string;
  email: string;
  full_name: string;
  phone: string;
  created_at?: string;
}

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isClerkUser: boolean;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isClerkLoaded, setIsClerkLoaded] = useState(false);

  // Check if Clerk is available and properly configured
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const frontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

  const isClerkAvailable = typeof window !== 'undefined' &&
    (publishableKey || frontendApi) &&
    publishableKey !== 'your_clerk_publishable_key_here' &&
    publishableKey !== 'pk_test_your_clerk_publishable_key_here' &&
    publishableKey !== 'pk_test_your_actual_publishable_key_here' &&
    frontendApi !== 'https://handy-cow-68.clerk.accounts.dev';

  // Load Clerk hooks if available
  useEffect(() => {
    if (isClerkAvailable) {
      import('@clerk/nextjs').then(({ useUser, useAuth }) => {
        // Clerk is available, mark as loaded
        setIsClerkLoaded(true);
        setLoading(false);
      }).catch(() => {
        setIsClerkLoaded(true);
        setLoading(false);
      });
    } else {
      // Clerk is in keyless mode
      setIsClerkLoaded(true);
      setLoading(false);
    }
  }, [isClerkAvailable]);

  // Convert Clerk user to our User format
  const convertClerkUser = (clerkUser: any): User | null => {
    if (!clerkUser) return null;

    return {
      user_id: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress || '',
      full_name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
      phone: clerkUser.primaryPhoneNumber?.phoneNumber || '',
      created_at: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : undefined,
    };
  };

  const login = async (email: string, password: string) => {
    // This function is kept for backward compatibility
    // In Clerk, authentication is handled by the SignIn component
    console.log("Login function called - use Clerk SignIn component instead");
  };

  const logout = async () => {
    try {
      // Try to use Clerk logout if available
      if (typeof window !== 'undefined' && (window as any).clerkLogout) {
        await (window as any).clerkLogout();
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error during logout:', error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading: loading || !isClerkLoaded,
      login,
      logout,
      isClerkUser: isClerkAvailable,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function RequireAuth({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--primary))] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return fallback || (
      <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please log in to access the dashboard.</p>
          <a href="/sign-in" className="text-[rgb(var(--primary))] hover:text-[rgb(var(--secondary))] underline">
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}