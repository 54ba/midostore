"use client";

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function PageLoadingSpinner() {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Loading...');

    useEffect(() => {
        let progressInterval: NodeJS.Timeout;
        let completeTimeout: NodeJS.Timeout;

        const startLoading = () => {
            setIsLoading(true);
            setLoadingProgress(0);
            setLoadingText('Loading...');

            // Simulate progress with realistic loading states
            progressInterval = setInterval(() => {
                setLoadingProgress(prev => {
                    if (prev >= 85) {
                        clearInterval(progressInterval);
                        return 85;
                    }
                    return prev + Math.random() * 12;
                });
            }, 150);

            // Update loading text based on progress
            const textInterval = setInterval(() => {
                setLoadingText(prev => {
                    if (loadingProgress < 30) return 'Initializing...';
                    if (loadingProgress < 60) return 'Loading content...';
                    if (loadingProgress < 85) return 'Almost ready...';
                    return 'Finalizing...';
                });
            }, 200);

            return () => clearInterval(textInterval);
        };

        const completeLoading = () => {
            setLoadingProgress(100);
            setLoadingText('Complete!');
            clearInterval(progressInterval);

            // Complete the loading after a short delay
            completeTimeout = setTimeout(() => {
                setIsLoading(false);
                setLoadingProgress(0);
                setLoadingText('Loading...');
            }, 300);
        };

        // Start loading when pathname changes
        startLoading();

        // Complete loading after a short delay to simulate page load
        const loadTimeout = setTimeout(completeLoading, 400);

        return () => {
            clearTimeout(loadTimeout);
            clearTimeout(completeTimeout);
            clearInterval(progressInterval);
        };
    }, [pathname]);

    if (!isLoading) return null;

    return (
        <>
            {/* Top loading bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-[999999]">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 transition-all duration-300 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                />
            </div>

            {/* Loading overlay for longer loads */}
            {loadingProgress > 50 && (
                <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-[999999] min-w-[200px]">
                    <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{loadingText}</div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${loadingProgress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}