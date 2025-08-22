"use client";

import React from 'react';
import { useRouteLoader } from '@/hooks/useRouteLoader';

export default function PageTransitionLoader() {
    const { isLoading, progress, loadingMessage } = useRouteLoader();

    if (!isLoading) return null;

    return (
        <>
            {/* Top Progress Bar */}
            <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gray-200 dark:bg-gray-800">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Full Screen Overlay with Spinner */}
            <div className={`fixed inset-0 z-[9998] flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0'
                }`}>
                <div className="flex flex-col items-center space-y-4">
                    {/* Modern Spinner */}
                    <div className="relative">
                        {/* Outer Ring */}
                        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-pulse"></div>

                        {/* Inner Spinning Ring */}
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>

                        {/* Center Dot */}
                        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                    </div>

                    {/* Loading Text */}
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 animate-pulse">
                            {loadingMessage}
                        </p>
                        <div className="flex space-x-1 mt-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>

                        {/* Progress Percentage */}
                        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                            {Math.round(progress)}%
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}