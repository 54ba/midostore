"use client";

import { useSimpleAuth } from '@/app/contexts/SimpleAuthContext';
import Link from 'next/link';

export default function AuthNavigation() {
    const { user, signOut } = useSimpleAuth();

    const handleSignOut = async () => {
        try {
            signOut();
        } catch (error) {
            console.error('Error during sign out:', error);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            {/* Authentication */}
            {user ? (
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-700 hidden sm:block">
                        Welcome, {user.username}
                    </span>
                    <Link
                        href="/dashboard/user-profile"
                        className="text-gray-700 hover:text-gray-900 px-2 py-1 rounded-md text-xs font-medium"
                    >
                        Profile
                    </Link>
                    <button
                        onClick={handleSignOut}
                        className="text-gray-700 hover:text-gray-900 px-2 py-1 rounded-md text-xs font-medium"
                    >
                        Sign Out
                    </button>
                </div>
            ) : (
                <div className="flex items-center space-x-1">
                    <Link
                        href="/dashboard"
                        className="text-gray-700 hover:text-gray-900 px-2 py-1 rounded-md text-xs font-medium"
                    >
                        Dashboard
                    </Link>
                    <span className="text-xs text-gray-500">
                        (Guest Mode)
                    </span>
                </div>
            )}
        </div>
    );
}