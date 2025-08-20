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
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_ME_ENDPOINT = "/api/auth/login";
const AUTH_LOGIN_ENDPOINT = "/api/auth/login";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  // Restore session on first mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
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
      } catch {
        // swallow network errors
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(AUTH_LOGIN_ENDPOINT, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const body = (await res.json()) as ApiResponse<{ user: User }>;
        if (body?.success && body.data?.user && isValidUser(body.data.user)) {
          setUser(body.data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // No logout endpoint available, just clear local state
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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