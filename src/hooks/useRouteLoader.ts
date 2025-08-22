"use client";

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function useRouteLoader() {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('Loading...');
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get loading message based on route
    const getLoadingMessage = (path: string) => {
        if (path.includes('/products')) return 'Loading products...';
        if (path.includes('/cart')) return 'Loading cart...';
        if (path.includes('/checkout')) return 'Preparing checkout...';
        if (path.includes('/orders')) return 'Loading orders...';
        if (path.includes('/dashboard')) return 'Loading dashboard...';
        if (path.includes('/scraping')) return 'Loading scraping tools...';
        if (path.includes('/ai-')) return 'Initializing AI features...';
        if (path.includes('/analytics')) return 'Loading analytics...';
        return 'Loading...';
    };

    useEffect(() => {
        let progressInterval: NodeJS.Timeout;
        let hideTimeout: NodeJS.Timeout;

        const startLoading = () => {
            setIsLoading(true);
            setProgress(0);
            setLoadingMessage(getLoadingMessage(pathname));

            // Simulate realistic loading progress
            progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 95) return prev;

                    // Faster progress at the beginning, slower towards the end
                    const increment = prev < 30 ? Math.random() * 20 :
                                     prev < 60 ? Math.random() * 10 :
                                     Math.random() * 5;

                    return Math.min(prev + increment, 95);
                });
            }, 80);
        };

        const completeLoading = () => {
            setProgress(100);
            hideTimeout = setTimeout(() => {
                setIsLoading(false);
                setProgress(0);
            }, 300);

            if (progressInterval) {
                clearInterval(progressInterval);
            }
        };

        // Start loading
        startLoading();

        // Complete loading with a realistic delay
        const loadingDuration = pathname.includes('/dashboard') ? 800 :
                               pathname.includes('/scraping') ? 600 :
                               pathname.includes('/ai-') ? 700 : 400;

        const completeTimeout = setTimeout(completeLoading, loadingDuration);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(hideTimeout);
            clearTimeout(completeTimeout);
        };
    }, [pathname, searchParams]);

    return {
        isLoading,
        progress,
        loadingMessage
    };
}