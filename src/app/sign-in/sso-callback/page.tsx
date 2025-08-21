'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'

export default function SSOCallbackPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user, loading } = useAuth()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const handleSSOCallback = async () => {
            try {
                // Get redirect URLs from query parameters
                const afterSignInUrl = searchParams.get('after_sign_in_url') || '/dashboard'
                const afterSignUpUrl = searchParams.get('after_sign_up_url') || '/dashboard'
                const redirectUrl = searchParams.get('redirect_url') || '/dashboard'

                // Wait for authentication to complete
                if (loading) {
                    return
                }

                if (user) {
                    // User is authenticated, redirect to appropriate URL
                    const targetUrl = afterSignInUrl || afterSignUpUrl || redirectUrl
                    router.push(targetUrl)
                } else {
                    // No user found, redirect to sign-in
                    router.push('/sign-in')
                }
            } catch (err) {
                console.error('SSO callback error:', err)
                setError('Authentication failed. Please try again.')
                setTimeout(() => {
                    router.push('/sign-in')
                }, 3000)
            }
        }

        handleSSOCallback()
    }, [user, loading, router, searchParams])

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <p className="text-sm text-gray-500">Redirecting to sign-in page...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Completing Authentication</h2>
                <p className="text-gray-600">Please wait while we complete your sign-in...</p>
            </div>
        </div>
    )
}