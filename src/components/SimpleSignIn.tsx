"use client";

import React, { useState } from 'react';
import { useSimpleAuth } from '@/app/contexts/SimpleAuthContext';
import { useThemeStyles } from '@/hooks/useThemeStyles';
import { User, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

interface SimpleSignInProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    mode?: 'signin' | 'signup';
    showPassword?: boolean;
}

export default function SimpleSignIn({
    onSuccess,
    onCancel,
    mode = 'signin',
    showPassword = false
}: SimpleSignInProps) {
    const { signIn, signUp, user, isGuest } = useSimpleAuth();
    const styles = useThemeStyles();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [showPasswordField, setShowPasswordField] = useState(showPassword);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const isSignUp = mode === 'signup';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isSignUp) {
                await signUp(username, showPasswordField ? password : undefined, email);
            } else {
                await signIn(username, showPasswordField ? password : undefined);
            }

            setSuccess(true);
            setTimeout(() => {
                onSuccess?.();
            }, 1000);
        } catch (error: any) {
            setError(error.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickSignIn = async () => {
        if (!username.trim()) {
            setError('Please enter a username');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await signIn(username);
            setSuccess(true);
            setTimeout(() => {
                onSuccess?.();
            }, 1000);
        } catch (error: any) {
            setError(error.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGuestMode = () => {
        // Just close the modal, user stays as guest
        onCancel?.();
    };

    if (success) {
        return (
            <div className={`${styles.bg.card} rounded-2xl p-8 shadow-xl border ${styles.border.primary} text-center`}>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-600 mb-2">
                    {isSignUp ? 'Account Created!' : 'Welcome Back!'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                    You are now signed in as <strong>{username}</strong>
                </p>
            </div>
        );
    }

    return (
        <div className={`${styles.bg.card} rounded-2xl p-8 shadow-xl border ${styles.border.primary} max-w-md w-full`}>
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isSignUp ? 'Create Account' : 'Quick Sign In'}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {isSignUp
                        ? 'Join MidoHub in seconds'
                        : 'Get personalized experience instantly'
                    }
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username Field */}
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Username
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${styles.border.primary
                                } ${styles.bg.input} ${styles.text.primary}`}
                            placeholder="Enter username or email"
                            required
                        />
                    </div>
                </div>

                {/* Email Field (Sign Up Only) */}
                {isSignUp && (
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email (Optional)
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${styles.border.primary
                                    } ${styles.bg.input} ${styles.text.primary}`}
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>
                )}

                {/* Password Toggle */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={showPasswordField}
                            onChange={(e) => setShowPasswordField(e.target.checked)}
                            className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            Add password protection
                        </span>
                    </label>
                </div>

                {/* Password Field (Conditional) */}
                {showPasswordField && (
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${styles.border.primary
                                    } ${styles.bg.input} ${styles.text.primary}`}
                                placeholder="Enter password"
                                required={showPasswordField}
                            />
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                    {/* Quick Sign In Button */}
                    <button
                        type="button"
                        onClick={handleQuickSignIn}
                        disabled={isLoading || !username.trim()}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${isLoading || !username.trim()
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                            }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                {isSignUp ? 'Creating Account...' : 'Signing In...'}
                            </div>
                        ) : (
                            <span className="flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                {isSignUp ? 'Create Account' : 'Quick Sign In'}
                            </span>
                        )}
                    </button>

                    {/* Guest Mode Button */}
                    <button
                        type="button"
                        onClick={handleGuestMode}
                        className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                        Continue as Guest
                    </button>
                </div>
            </form>

            {/* Info Text */}
            <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isSignUp
                        ? 'By creating an account, you agree to our terms and privacy policy'
                        : 'No password required for quick access. Your data is stored locally.'
                    }
                </p>
            </div>
        </div>
    );
}