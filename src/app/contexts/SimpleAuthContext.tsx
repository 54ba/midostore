"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface SimpleUser {
    id: string;
    username: string;
    email?: string;
    isGuest: boolean;
    createdAt: Date;
    lastSeen: Date;
    preferences: {
        language: string;
        currency: string;
        theme: 'light' | 'dark' | 'system';
        notifications: boolean;
    };
    sessionData: {
        cartItems: any[];
        wishlist: string[];
        recentlyViewed: string[];
        searchHistory: string[];
    };
}

interface SimpleAuthContextType {
    user: SimpleUser | null;
    loading: boolean;
    isGuest: boolean;
    isAuthenticated: boolean;
    signIn: (username: string, password?: string) => Promise<void>;
    signUp: (username: string, password?: string, email?: string) => Promise<void>;
    signOut: () => void;
    updatePreferences: (preferences: Partial<SimpleUser['preferences']>) => void;
    updateSessionData: (data: Partial<SimpleUser['sessionData']>) => void;
    getOrCreateGuest: () => SimpleUser;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

// Generate a unique visitor ID
const generateVisitorId = (): string => {
    return 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Generate a simple hash for password (in production, use proper hashing)
const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
};

// Local storage keys
const STORAGE_KEYS = {
    USER: 'midohub_user',
    GUEST_ID: 'midohub_guest_id',
    SESSION: 'midohub_session'
};

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<SimpleUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Initialize user from local storage
    useEffect(() => {
        const initializeUser = () => {
            try {
                // Try to load existing user
                const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    // Update last seen
                    parsedUser.lastSeen = new Date();
                    setUser(parsedUser);
                } else {
                    // Create or load guest user
                    const guestUser = getOrCreateGuest();
                    setUser(guestUser);
                }
            } catch (error) {
                console.error('Error initializing user:', error);
                // Fallback to guest user
                const guestUser = getOrCreateGuest();
                setUser(guestUser);
            } finally {
                setLoading(false);
            }
        };

        initializeUser();
    }, []);

    // Save user to local storage whenever it changes
    useEffect(() => {
        if (user) {
            try {
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
            } catch (error) {
                console.error('Error saving user to localStorage:', error);
            }
        }
    }, [user]);

    // Get or create a guest user
    const getOrCreateGuest = (): SimpleUser => {
        try {
            // Try to load existing guest ID
            let guestId = localStorage.getItem(STORAGE_KEYS.GUEST_ID);

            if (!guestId) {
                // Create new guest ID
                guestId = generateVisitorId();
                localStorage.setItem(STORAGE_KEYS.GUEST_ID, guestId);
            }

            const guestUser: SimpleUser = {
                id: guestId,
                username: `Guest_${guestId.slice(-6)}`,
                isGuest: true,
                createdAt: new Date(),
                lastSeen: new Date(),
                preferences: {
                    language: 'en-AE',
                    currency: 'AED',
                    theme: 'system',
                    notifications: false
                },
                sessionData: {
                    cartItems: [],
                    wishlist: [],
                    recentlyViewed: [],
                    searchHistory: []
                }
            };

            return guestUser;
        } catch (error) {
            console.error('Error creating guest user:', error);
            // Fallback guest user
            return {
                id: generateVisitorId(),
                username: 'Guest',
                isGuest: true,
                createdAt: new Date(),
                lastSeen: new Date(),
                preferences: {
                    language: 'en-AE',
                    currency: 'AED',
                    theme: 'system',
                    notifications: false
                },
                sessionData: {
                    cartItems: [],
                    wishlist: [],
                    recentlyViewed: [],
                    searchHistory: []
                }
            };
        }
    };

    // Simple sign in (no password required for demo)
    const signIn = async (username: string, password?: string): Promise<void> => {
        try {
            // Check if user exists in local storage
            const existingUsers = JSON.parse(localStorage.getItem('midohub_users') || '[]');
            let existingUser = existingUsers.find((u: any) => u.username === username);

            if (existingUser) {
                // Verify password if provided
                if (password && existingUser.passwordHash !== simpleHash(password)) {
                    throw new Error('Invalid password');
                }

                // Update existing user
                existingUser.lastSeen = new Date();
                existingUser.isGuest = false;
                setUser(existingUser);
            } else {
                // Create new user
                const newUser: SimpleUser = {
                    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                    username,
                    email: username.includes('@') ? username : undefined,
                    isGuest: false,
                    createdAt: new Date(),
                    lastSeen: new Date(),
                    preferences: {
                        language: 'en-AE',
                        currency: 'AED',
                        theme: 'system',
                        notifications: true
                    },
                    sessionData: {
                        cartItems: [],
                        wishlist: [],
                        recentlyViewed: [],
                        searchHistory: []
                    }
                };

                // Save to users list
                existingUsers.push({
                    ...newUser,
                    passwordHash: password ? simpleHash(password) : undefined
                });
                localStorage.setItem('midohub_users', JSON.stringify(existingUsers));

                setUser(newUser);
            }
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    };

    // Simple sign up
    const signUp = async (username: string, password?: string, email?: string): Promise<void> => {
        try {
            // Check if username already exists
            const existingUsers = JSON.parse(localStorage.getItem('midohub_users') || '[]');
            if (existingUsers.find((u: any) => u.username === username)) {
                throw new Error('Username already exists');
            }

            // Create new user
            const newUser: SimpleUser = {
                id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                username,
                email,
                isGuest: false,
                createdAt: new Date(),
                lastSeen: new Date(),
                preferences: {
                    language: 'en-AE',
                    currency: 'AED',
                    theme: 'system',
                    notifications: true
                },
                sessionData: {
                    cartItems: [],
                    wishlist: [],
                    recentlyViewed: [],
                    searchHistory: []
                }
            };

            // Save to users list
            existingUsers.push({
                ...newUser,
                passwordHash: password ? simpleHash(password) : undefined
            });
            localStorage.setItem('midohub_users', JSON.stringify(existingUsers));

            setUser(newUser);
        } catch (error) {
            console.error('Sign up error:', error);
            throw error;
        }
    };

    // Sign out
    const signOut = () => {
        // Convert to guest user instead of completely signing out
        const guestUser = getOrCreateGuest();
        setUser(guestUser);
    };

    // Update user preferences
    const updatePreferences = (preferences: Partial<SimpleUser['preferences']>) => {
        if (user) {
            const updatedUser = {
                ...user,
                preferences: { ...user.preferences, ...preferences }
            };
            setUser(updatedUser);
        }
    };

    // Update session data
    const updateSessionData = (data: Partial<SimpleUser['sessionData']>) => {
        if (user) {
            const updatedUser = {
                ...user,
                sessionData: { ...user.sessionData, ...data }
            };
            setUser(updatedUser);
        }
    };

    const value: SimpleAuthContextType = {
        user,
        loading,
        isGuest: user?.isGuest || true,
        isAuthenticated: !user?.isGuest,
        signIn,
        signUp,
        signOut,
        updatePreferences,
        updateSessionData,
        getOrCreateGuest
    };

    return (
        <SimpleAuthContext.Provider value={value}>
            {children}
        </SimpleAuthContext.Provider>
    );
}

export function useSimpleAuth() {
    const context = useContext(SimpleAuthContext);
    if (context === undefined) {
        throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
    }
    return context;
}