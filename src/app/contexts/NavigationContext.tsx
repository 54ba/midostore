"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface NavigationContextType {
    isNavigating: boolean;
    startNavigation: () => void;
    stopNavigation: () => void;
    navigateWithLoading: (href: string) => Promise<void>;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
    const [isNavigating, setIsNavigating] = useState(false);

    const startNavigation = useCallback(() => {
        setIsNavigating(true);
    }, []);

    const stopNavigation = useCallback(() => {
        setIsNavigating(false);
    }, []);

    const navigateWithLoading = useCallback(async (href: string) => {
        startNavigation();

        try {
            // Use Next.js router for navigation
            const { useRouter } = await import('next/navigation');
            window.location.href = href;
        } catch (error) {
            console.error('Navigation error:', error);
        } finally {
            // Stop navigation after a delay to ensure smooth transition
            setTimeout(stopNavigation, 500);
        }
    }, [startNavigation, stopNavigation]);

    return (
        <NavigationContext.Provider value={{
            isNavigating,
            startNavigation,
            stopNavigation,
            navigateWithLoading
        }}>
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigation() {
    const context = useContext(NavigationContext);
    if (context === undefined) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
}