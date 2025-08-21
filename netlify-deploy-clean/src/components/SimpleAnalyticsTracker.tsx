"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface SimpleAnalyticsTrackerProps {
    domain?: string;
    autoTrack?: boolean;
    respectDnt?: boolean;
    customEvents?: boolean;
}

declare global {
    interface Window {
        sa: (event: string, data?: any) => void;
        sa_event: (event: string, data?: any) => void;
    }
}

const SimpleAnalyticsTracker: React.FC<SimpleAnalyticsTrackerProps> = ({
    domain,
    autoTrack = true,
    respectDnt = true,
    customEvents = true,
}) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Load SimpleAnalytics script
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://scripts.simpleanalyticscdn.com/latest.js';

        if (domain) {
            script.setAttribute('data-domain', domain);
        }

        if (respectDnt) {
            script.setAttribute('data-respect-dnt', 'true');
        }

        if (customEvents) {
            script.setAttribute('data-custom-events', 'true');
        }

        document.head.appendChild(script);

        // Initialize SimpleAnalytics
        script.onload = () => {
            if (typeof window !== 'undefined') {
                // Set up global tracking functions
                window.sa = window.sa || function (...args: any[]) {
                    if (window.sa_event) {
                        (window.sa_event as any)(...args);
                    }
                };

                window.sa_event = window.sa_event || function (event: string, data?: any) {
                    if (window.sa) {
                        window.sa(event, data);
                    }
                };
            }
        };

        return () => {
            // Cleanup script when component unmounts
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, [domain, respectDnt, customEvents]);

    useEffect(() => {
        // Auto-track page views
        if (autoTrack && typeof window !== 'undefined' && window.sa) {
            const fullPath = searchParams.toString()
                ? `${pathname}?${searchParams.toString()}`
                : pathname;

            window.sa('page_view', { page: fullPath });
        }
    }, [pathname, searchParams, autoTrack]);

    // This component doesn't render anything
    return null;
};

export default SimpleAnalyticsTracker;

// Hook for manual event tracking
export const useSimpleAnalytics = () => {
    const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
        if (typeof window !== 'undefined' && window.sa) {
            window.sa(eventName, eventData);
        }
    };

    const trackPageView = (page: string) => {
        trackEvent('page_view', { page });
    };

    const trackProductView = (productId: string, productName: string, category: string, price?: number) => {
        trackEvent('product_view', { productId, productName, category, price });
    };

    const trackAddToCart = (productId: string, productName: string, price: number, quantity: number = 1) => {
        trackEvent('add_to_cart', { productId, productName, price, quantity });
    };

    const trackPurchase = (orderId: string, total: number, products: Array<{ id: string; name: string; price: number; quantity: number }>) => {
        trackEvent('purchase', { orderId, total, products });
    };

    const trackSearch = (query: string, resultsCount: number) => {
        trackEvent('search', { query, resultsCount });
    };

    const trackFilter = (filterType: string, filterValue: string) => {
        trackEvent('filter', { filterType, filterValue });
    };

    const trackUserAction = (action: string, details?: Record<string, any>) => {
        trackEvent('user_action', { action, ...details });
    };

    return {
        trackEvent,
        trackPageView,
        trackProductView,
        trackAddToCart,
        trackPurchase,
        trackSearch,
        trackFilter,
        trackUserAction,
    };
};