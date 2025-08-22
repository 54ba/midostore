"use client";

import React from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react';

export default function ThemeToggle() {
    const { theme, isDark, toggleTheme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = React.useState(false);

    const themeOptions = [
        { value: 'light' as const, label: 'Light', icon: Sun, color: 'text-yellow-500' },
        { value: 'dark' as const, label: 'Dark', icon: Moon, color: 'text-blue-500' },
        { value: 'system' as const, label: 'System', icon: Monitor, color: 'text-gray-500' },
    ];

    const currentTheme = themeOptions.find(option => option.value === theme);
    const IconComponent = currentTheme?.icon || Monitor;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
                aria-label="Toggle theme"
            >
                <IconComponent className={`w-4 h-4 ${currentTheme?.color}`} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentTheme?.label}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 py-2">
                        {themeOptions.map((option) => {
                            const OptionIcon = option.icon;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setTheme(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${theme === option.value
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                        : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    <OptionIcon className={`w-4 h-4 ${option.color}`} />
                                    <span className="text-sm font-medium">{option.label}</span>
                                    {theme === option.value && (
                                        <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

// Simple toggle button variant
export function SimpleThemeToggle() {
    const { toggleTheme, isDark } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle dark mode"
        >
            {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
                <Moon className="w-5 h-5 text-blue-500" />
            )}
        </button>
    );
}