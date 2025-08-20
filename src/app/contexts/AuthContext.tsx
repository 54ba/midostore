"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ApiResponse<T> = { success: boolean; data?: T };

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

const AUTH_ME_ENDPOINT = "/api/auth/login";
const AUTH_LOGIN_ENDPOINT = "/api/auth/login";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if Clerk is available
  const isClerkAvailable = typeof window !== 'undefined' &&
    process.env.NEXT_PUBLIC_CLERK_FRONTEND_API &&
    process.env.CLERK_SECRET_KEY;

  // Conditionally import Clerk hooks
  const [clerkUser, setClerkUser] = useState<any>(null);
  const [isClerkLoaded, setIsClerkLoaded] = useState(false);

  // Load Clerk user if available
  useEffect(() => {
    if (isClerkAvailable) {
      // Dynamically import Clerk hooks
      import('@clerk/nextjs').then(({ useUser, useAuth }) => {
        // This will be handled by the ClerkProvider when it's available
        setIsClerkLoaded(true);
      }).catch(() => {
        setIsClerkLoaded(true);
      });
    } else {
      setIsClerkLoaded(true);
    }
  }, [isClerkAvailable]);

  // Validates only absolutely required User fields (as per DB schema).
  // Do NOT check optional fields like created_at — their absence should not fail validation.
  const isValidUser = (u: any): u is User => {
    return (
      typeof u?.user_id === "string" &&
      typeof u?.email === "string" &&
      typeof u?.full_name === "string" &&
      typeof u?.phone === "string"
    );
  };

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

  // Restore session on first mount
  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        // If Clerk user is available, use it
        if (clerkUser && isClerkLoaded) {
          const convertedUser = convertClerkUser(clerkUser);
          if (convertedUser && !cancelled) {
            setUser(convertedUser);
            setLoading(false);
            return;
          }
        }

        // Fallback to legacy auth if no Clerk user
        if (!clerkUser && isClerkLoaded) {
          const res = await fetch(AUTH_ME_ENDPOINT, {
            method: "GET",
            credentials: "include"
          });

          if (res.status === 204 || res.status === 401) {
            if (!cancelled) setUser(null);
          } else if (res.ok) {
            const body = (await res.json()) as ApiResponse<{ user: User }>;
            if (body?.success && body.data?.user && isValidUser(body.data.user)) {
              if (!cancelled) setUser(body.data.user);
            } else {
              if (!cancelled) setUser(null);
            }
          } else {
            // Unexpected error status — don't overwrite user with bad data
            console.error("Unexpected session restore status:", res.status);
          }
        }
      } catch {
        // swallow network errors
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [clerkUser, isClerkLoaded]);

  // Update user when Clerk user changes
  useEffect(() => {
    if (clerkUser && isClerkLoaded) {
      const convertedUser = convertClerkUser(clerkUser);
      setUser(convertedUser);
    } else if (!clerkUser && isClerkLoaded) {
      setUser(null);
    }
  }, [clerkUser, isClerkLoaded]);

  const login = async (email: string, password: string) => {
    // This function is kept for backward compatibility
    // In Clerk, authentication is handled by the SignIn component
    console.log("Login function called - use Clerk SignIn component instead");
  };

  const logout = async () => {
    if (clerkUser && isClerkAvailable) {
      try {
        // Use Clerk signOut
        const { useAuth } = await import('@clerk/nextjs');
        const { signOut } = useAuth();
        await signOut();
      } catch (error) {
        console.error('Error signing out with Clerk:', error);
        // Fallback to clearing local state
        setUser(null);
      }
    } else {
      // Fallback to legacy logout
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading: loading || !isClerkLoaded,
      login,
      logout,
      isClerkUser: !!clerkUser
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