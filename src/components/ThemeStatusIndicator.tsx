"use client";

import React from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeStatusIndicator() {
    const { theme, isDark } = useTheme();

    const getThemeInfo = () => {
        switch (theme) {
            case 'light':
                return {
                    icon: Sun,
                    label: 'Light Mode',
                    color: 'text-yellow-500',
                    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
                };
            case 'dark':
                return {
                    icon: Moon,
                    label: 'Dark Mode',
                    color: 'text-blue-500',
                    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
                };
            case 'system':
                return {
                    icon: Monitor,
                    label: `System (${isDark ? 'Dark' : 'Light'})`,
                    color: 'text-gray-500',
                    bgColor: 'bg-gray-50 dark:bg-gray-900/20'
                };
            default:
                return {
                    icon: Monitor,
                    label: 'System',
                    color: 'text-gray-500',
                    bgColor: 'bg-gray-50 dark:bg-gray-900/20'
                };
        }
    };

    const themeInfo = getThemeInfo();
    const IconComponent = themeInfo.icon;

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${themeInfo.bgColor} border border-gray-200 dark:border-gray-700`}>
            <IconComponent className={`w-4 h-4 ${themeInfo.color}`} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {themeInfo.label}
            </span>
        </div>
    );
}