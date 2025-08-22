"use client";

import React, { useState } from 'react';
import { useSimpleAuth } from '@/app/contexts/SimpleAuthContext';
import { User, Settings, Crown, Mail, Phone, Calendar, Edit3, Save, X } from 'lucide-react';

export default function UserProfilePage() {
    const { user, signOut, isAuthenticated, isGuest } = useSimpleAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || 'Guest User',
        email: user?.email || '',
        bio: (user as any)?.bio || 'Welcome to MidoHub! This is a demo profile page.',
        phone: (user as any)?.phone || '',
        fullName: (user as any)?.fullName || user?.username || 'Guest User'
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

    const handleCancel = () => {
        setFormData({
            username: user?.username || 'Guest User',
            email: user?.email || '',
            bio: (user as any)?.bio || 'Welcome to MidoHub! This is a demo profile page.',
            phone: (user as any)?.phone || '',
            fullName: (user as any)?.fullName || user?.username || 'Guest User'
        });
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">👤 User Profile</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        {isAuthenticated ? 'Manage your account settings and preferences' : 'Profile preview - Sign in to manage your account'}
                    </p>
                </div>

                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-12">
                        <div className="flex items-center space-x-6">
                            {/* Avatar */}
                            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-white" />
                                )}
                            </div>

                            {/* Basic Info */}
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h2 className="text-3xl font-bold text-white">{formData.fullName}</h2>
                                    {(user as any)?.isPremium && (
                                        <Crown className="w-6 h-6 text-yellow-300" />
                                    )}
                                </div>
                                <p className="text-blue-100 text-lg">@{formData.username}</p>
                                {isGuest && (
                                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-blue-500/30 text-blue-100 text-sm">
                                        👋 Guest Mode
                                    </div>
                                )}
                            </div>

                            {/* Action Button */}
                            <div>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        <span>Edit Profile</span>
                                    </button>
                                ) : (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handleSubmit}
                                            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                                        >
                                            <Save className="w-4 h-4" />
                                            <span>Save</span>
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                            <span>Cancel</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="p-8">
                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        rows={4}
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                {/* Contact Information */}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center space-x-3">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="text-gray-900">{formData.email || 'Not provided'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Phone className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Phone</p>
                                                <p className="text-gray-900">{formData.phone || 'Not provided'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Calendar className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Member Since</p>
                                                <p className="text-gray-900">
                                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Settings className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Account Type</p>
                                                <p className="text-gray-900">
                                                    {isGuest ? 'Guest' : (user as any)?.isPremium ? 'Premium' : 'Standard'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bio Section */}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">About</h3>
                                    <p className="text-gray-600 leading-relaxed">{formData.bio}</p>
                                </div>

                                {/* Account Statistics */}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Statistics</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {(user as any)?.sessionData?.cartItems?.length || 0}
                                            </div>
                                            <div className="text-sm text-blue-800">Cart Items</div>
                                        </div>

                                        <div className="bg-green-50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {(user as any)?.sessionData?.wishlist?.length || 0}
                                            </div>
                                            <div className="text-sm text-green-800">Wishlist</div>
                                        </div>

                                        <div className="bg-purple-50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {(user as any)?.sessionData?.recentlyViewed?.length || 0}
                                            </div>
                                            <div className="text-sm text-purple-800">Recently Viewed</div>
                                        </div>

                                        <div className="bg-orange-50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-orange-600">
                                                {(user as any)?.sessionData?.searchHistory?.length || 0}
                                            </div>
                                            <div className="text-sm text-orange-800">Searches</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    {isAuthenticated && !isGuest && (
                        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    Last updated: {user?.lastSeen ? new Date(user.lastSeen).toLocaleDateString() : 'Today'}
                                </div>
                                <button
                                    onClick={signOut}
                                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                                >
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Guest Mode Info */}
                    {isGuest && (
                        <div className="px-8 py-4 bg-blue-50 border-t border-blue-200">
                            <div className="text-center">
                                <p className="text-blue-800 mb-2">
                                    👋 You're browsing as a guest. Sign in to save your preferences and access more features!
                                </p>
                                <div className="space-x-4">
                                    <a
                                        href="/sign-in"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Sign In
                                    </a>
                                    <a
                                        href="/register"
                                        className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                    >
                                        Create Account
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}