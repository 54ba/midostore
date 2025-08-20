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
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isClerkLoaded, setIsClerkLoaded] = useState(false);

  // Check if Clerk is available
  const isClerkAvailable = typeof window !== 'undefined' &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // Load Clerk hooks if available
  useEffect(() => {
    if (isClerkAvailable) {
      import('@clerk/nextjs').then(({ useUser, useAuth }) => {
        // Clerk is available, mark as loaded
        setIsClerkLoaded(true);
      }).catch(() => {
        setIsClerkLoaded(true);
      });
    } else {
      setIsClerkLoaded(true);
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
      setUser(null);
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
      isClerkUser: false // Will be updated when Clerk is properly integrated
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
  if (loading) return <>{fallback}</>;
  if (!user) return <>{fallback}</>;
  return <>{children}</>;
}