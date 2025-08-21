'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import ProfileForm from '@/components/ProfileForm'
import LoadingSpinner from '@/components/LoadingSpinner'
import Button from '@/components/Button'

interface User {
  user_id: string
  email: string
  full_name: string
  phone: string
  created_at?: string
}

interface UpdateUserData {
  full_name: string
  phone: string
  email: string
}

export default function ProfilePage() {
  const { user: authUser, loading: authLoading } = useAuth()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const fetchUserProfile = useCallback(async () => {
    if (!authUser?.user_id) return

    try {
      setLoading(true)
      setError(null)

      // GET /api/users - Fetch user profile data
      const response = await fetch('/api/users', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 401) {
        router.push('/login')
        return
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`)
      }

      const result = await response.json()

      if (result.success && result.data) {
        setUser(result.data)
      } else {
        throw new Error(result.error || 'Failed to load profile data')
      }
    } catch (err) {
      console.error('Profile fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load profile data. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [authUser?.user_id, router])

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push('/login')
      return
    }

    if (authUser) {
      fetchUserProfile()
    }
  }, [authUser, authLoading, router, fetchUserProfile])

  const handleProfileUpdate = async (userData: UpdateUserData) => {
    if (!authUser?.user_id) return

    try {
      setUpdateLoading(true)
      setError(null)
      setSuccessMessage(null)

      // PUT /api/users - Update user profile with full_name, phone, email
      const response = await fetch('/api/users', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      if (response.status === 401) {
        router.push('/login')
        return
      }

      if (!response.ok) {
        const errorResult = await response.json()
        throw new Error(errorResult.error || `Update failed: ${response.status}`)
      }

      const result = await response.json()

      if (result.success && result.data) {
        setUser(result.data)
        setSuccessMessage('Profile updated successfully!')

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null)
        }, 3000)
      } else {
        throw new Error(result.error || 'Failed to update profile')
      }
    } catch (err) {
      console.error('Profile update error:', err)
      setError(err instanceof Error ? err.message : 'Failed to update profile. Please try again.')
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      // Clear local auth state and redirect to login
      router.push('/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  if (authLoading || loading) {
    return (
      <div id="profile-loading-container" className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <LoadingSpinner id="profile-loading-spinner" size="lg" color="rgb(var(--primary))" />
      </div>
    )
  }

  if (!user) {
    return (
      <div id="profile-error-container" className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <div id="profile-error-card" className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h2 id="profile-error-title" className="text-2xl font-bold text-[rgb(var(--foreground))] mb-4">
            Profile Not Found
          </h2>
          <p id="profile-error-message" className="text-gray-600 mb-6">
            Unable to load your profile information.
          </p>
          <div id="profile-error-actions" className="space-y-3">
            <Button
              id="profile-retry-button"
              variant="default"
              onClick={fetchUserProfile}
              disabled={loading}
            >
              Try Again
            </Button>
            <Button
              id="profile-dashboard-button"
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id="profile-page-container" className="min-h-screen bg-[rgb(var(--background))]">
      <div id="profile-content-wrapper" className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div id="profile-header" className="mb-8">
          <h1 id="profile-page-title" className="text-3xl font-bold text-[rgb(var(--foreground))] mb-2">
            My Profile
          </h1>
          <p id="profile-page-subtitle" className="text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div id="profile-success-message" className="mb-6 p-4 bg-[rgb(var(--success))]/10 border border-[rgb(var(--success))]/20 rounded-lg">
            <p id="profile-success-text" className="text-[rgb(var(--success))] font-medium">
              {successMessage}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div id="profile-error-message" className="mb-6 p-4 bg-[rgb(var(--error))]/10 border border-[rgb(var(--error))]/20 rounded-lg">
            <p id="profile-error-text" className="text-[rgb(var(--error))] font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Profile Form */}
        <div id="profile-form-section" className="mb-8">
          <ProfileForm
            id="user-profile-form"
            user={user}
            onSubmit={handleProfileUpdate}
            loading={updateLoading}
          />
        </div>

        {/* Account Actions */}
        <div id="profile-actions-section" className="max-w-2xl mx-auto">
          <div id="profile-actions-card" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 id="profile-actions-title" className="text-lg font-semibold text-[rgb(var(--foreground))] mb-4">
              Account Actions
            </h3>

            <div id="profile-actions-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                id="profile-orders-button"
                variant="outline"
                onClick={() => router.push('/orders')}
              >
                View Order History
              </Button>

              <Button
                id="profile-dashboard-link-button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Go to Dashboard
              </Button>

              <Button
                id="profile-cart-button"
                variant="outline"
                onClick={() => router.push('/cart')}
              >
                View Cart
              </Button>

              <Button
                id="profile-contact-button"
                variant="outline"
                onClick={() => router.push('/contact')}
              >
                Contact Support
              </Button>
            </div>

            <div id="profile-logout-section" className="mt-6 pt-6 border-t border-gray-200">
              <Button
                id="profile-logout-button"
                variant="danger"
                onClick={handleLogout}
                className="w-full"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div id="profile-info-section" className="max-w-2xl mx-auto mt-8">
          <div id="profile-info-card" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 id="profile-info-title" className="text-lg font-semibold text-[rgb(var(--foreground))] mb-4">
              Account Information
            </h3>

            <div id="profile-info-grid" className="space-y-3">
              <div id="profile-info-user-id" className="flex justify-between items-center py-2 border-b border-gray-100">
                <span id="profile-info-user-id-label" className="text-sm font-medium text-gray-500">
                  User ID
                </span>
                <span id="profile-info-user-id-value" className="text-sm text-[rgb(var(--foreground))] font-mono">
                  {user.user_id}
                </span>
              </div>

              {user.created_at && (
                <div id="profile-info-created-at" className="flex justify-between items-center py-2">
                  <span id="profile-info-created-at-label" className="text-sm font-medium text-gray-500">
                    Member Since
                  </span>
                  <span id="profile-info-created-at-value" className="text-sm text-[rgb(var(--foreground))]">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}