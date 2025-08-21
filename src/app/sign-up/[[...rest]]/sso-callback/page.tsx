'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function SSOCallbackPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const handleSSOCallback = async () => {
            try {
                // Get search params from window.location since we can't use useSearchParams in SSR
                const urlParams = new URLSearchParams(window.location.search)
                const afterSignInUrl = urlParams.get('after_sign_in_url')
                const afterSignUpUrl = urlParams.get('after_sign_up_url')
                const error = urlParams.get('error')
                const errorDescription = urlParams.get('error_description')

                // Check for SSO errors
                if (error) {
                    console.error('SSO Error:', error, errorDescription)
                    setError(errorDescription || 'Authentication failed. Please try again.')
                    // Redirect to sign-in after showing error
                    setTimeout(() => {
                        router.push('/sign-in')
                    }, 3000)
                    return
                }

                // Determine which URL to redirect to based on the callback type
                const redirectUrl = afterSignUpUrl || afterSignInUrl || '/dashboard'

                // Small delay to ensure Clerk has processed the SSO callback
                const timer = setTimeout(() => {
                    router.push(redirectUrl)
                }, 1500)

                return () => clearTimeout(timer)
            } catch (err) {
                console.error('SSO Callback Error:', err)
                setError('An unexpected error occurred. Please try again.')
                setTimeout(() => {
                    router.push('/sign-in')
                }, 3000)
            }
        }

        handleSSOCallback()
    }, [router])

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto px-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <p className="text-sm text-gray-500">Redirecting to sign-in page...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                    Completing Authentication...
                </h2>
                <p className="text-sm text-gray-600">
                    Please wait while we complete your SSO sign-in.
                </p>
                <div className="mt-4 text-sm text-gray-500">
                    This may take a few moments...
                </div>
            </div>
        </div>
    )
}