"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import { useSimpleAuth } from '@/app/contexts/SimpleAuthContext'
import Header from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function DashboardLayoutFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, loading } = useSimpleAuth()

  // Show loading while AuthContext is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <LoadingSpinner id="dashboard-loading" size="lg" color="rgb(var(--primary))" />
      </div>
    )
  }

  // If user is not authenticated, show sign-in prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please log in to access the dashboard.</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-2 bg-[rgb(var(--primary))] text-white rounded-lg hover:bg-[rgb(var(--secondary))] transition-colors"
            >
              Go to Home
            </button>
            <p className="text-sm text-gray-500">
              Use the sign-in form on the home page to access your account.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] flex flex-col">
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}