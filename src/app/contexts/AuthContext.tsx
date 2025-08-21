"use client";

import React, { createContext, useContext, useState } from "react";

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
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    // This function is kept for backward compatibility
    // Authentication is now handled by SimpleAuthContext
    console.log("Login function called - use SimpleAuthContext instead");
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
      loading,
      login,
      logout,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Authentication required</div>;
  }

  return <>{children}</>;
}