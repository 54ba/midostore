// @ts-nocheck
"use client";

import React, { useState } from 'react';
import { useSimpleAuth } from '@/app/contexts/SimpleAuthContext';
import { useThemeStyles } from '@/hooks/useThemeStyles';
import { User, Settings, LogOut, Crown, UserX, ChevronDown, UserCheck } from 'lucide-react';
import SimpleSignIn from './SimpleSignIn';

export default function SimpleUserProfile() {
    const { user, isGuest, signOut } = useSimpleAuth();
    const styles = useThemeStyles();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showSignIn, setShowSignIn] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleSignOut = () => {
        signOut();
        setIsDropdownOpen(false);
    };

    const handleSignInSuccess = () => {
        setShowSignIn(false);
        setIsDropdownOpen(false);
    };

    if (showSignIn) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="relative">
                    <button
                        onClick={() => setShowSignIn(false)}
                        className="absolute -top-4 -right-4 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                    >
                        ×
                    </button>
                    <SimpleSignIn onSuccess={handleSignInSuccess} onCancel={() => setShowSignIn(false)} />
                </div>
            </div>
        );
    }

    if (isGuest) {
        return (
            <div className="relative">
                <button
                    onClick={() => setShowSignIn(true)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-md ${styles.border.primary
                        } ${styles.bg.card} ${styles.text.primary} hover:bg-blue-50 dark:hover:bg-blue-900/20`}
                >
                    <UserX className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium">Sign In</span>
                </button>
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-md ${styles.border.primary
                    } ${styles.bg.card} ${styles.text.primary} hover:bg-blue-50 dark:hover:bg-blue-900/20`}
            >
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium max-w-24 truncate">
                    {user?.username}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                    }`} />
            </button>

            {isDropdownOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsDropdownOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className={`absolute right-0 top-full mt-2 w-64 ${styles.bg.card} border rounded-lg shadow-lg z-20 py-2 ${styles.border.primary
                        }`}>

                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {user?.username}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {user?.email || 'No email provided'}
                                    </p>
                                    <div className="flex items-center mt-1">
                                        <UserCheck className="w-3 h-3 text-green-500 mr-1" />
                                        <span className="text-xs text-green-600 dark:text-green-400">
                                            Authenticated User
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                        {user?.sessionData.cartItems.length || 0}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Cart Items</p>
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                        {user?.sessionData.wishlist.length || 0}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Wishlist</p>
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                        {user?.sessionData.recentlyViewed.length || 0}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Viewed</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="py-2">
                            <button
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    // Add settings functionality here
                                }}
                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                            >
                                <Settings className="w-4 h-4 mr-3" />
                                Settings & Preferences
                            </button>

                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                            >
                                <LogOut className="w-4 h-4 mr-3" />
                                Sign Out
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}