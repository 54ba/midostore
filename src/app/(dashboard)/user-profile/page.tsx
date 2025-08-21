"use client";

import { useSimpleAuth } from '@/app/contexts/SimpleAuthContext';
import { useState } from 'react';
import { User, Settings, LogOut, Crown } from 'lucide-react';

export default function UserProfilePage() {
    const { user, signOut } = useSimpleAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        bio: (user as any)?.bio || ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically update the user profile
        console.log('Profile updated:', formData);
        setIsEditing(false);
    };

    const handleSignOut = () => {
        signOut();
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            User Profile
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Please sign in to view your profile
                        </p>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-8 text-center">
                        <p className="text-gray-600">Authentication is required to view this page.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        User Profile
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Manage your account settings and preferences
                    </p>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-8">
                    {/* Profile Header */}
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
                            <p className="text-gray-600">{user.email}</p>
                            {(user as any)?.isPremium && (
                                <div className="flex items-center mt-2">
                                    <Crown className="w-5 h-5 text-yellow-500 mr-2" />
                                    <span className="text-sm text-yellow-600 font-medium">Premium User</span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Sign Out</span>
                        </button>
                    </div>

                    {/* Profile Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        <div className="flex justify-end space-x-4">
                            {isEditing ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    <Settings className="w-5 h-5" />
                                    <span>Edit Profile</span>
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Account Stats */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Statistics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">0</div>
                                <div className="text-sm text-gray-600">Orders Placed</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">0</div>
                                <div className="text-sm text-gray-600">Reviews Written</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">0</div>
                                <div className="text-sm text-gray-600">Wishlist Items</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}