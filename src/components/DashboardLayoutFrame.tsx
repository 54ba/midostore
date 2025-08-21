"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useAuth, RequireAuth } from '@/app/contexts/AuthContext'
import Header from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function DashboardLayoutFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Check if Clerk is available
  const isClerkAvailable = typeof window !== 'undefined' &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'your_clerk_publishable_key_here';

  // Only use Clerk hooks if available
  const clerkUser = isClerkAvailable ? useUser() : { user: null, isLoaded: true };
  const { user, loading } = useAuth()

  // Show loading while Clerk is initializing or AuthContext is loading
  if (!clerkUser.isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <LoadingSpinner id="dashboard-loading" size="lg" color="rgb(var(--primary))" />
      </div>
    )
  }

  // TEMPORARY: Allow access without authentication for development
  // TODO: Re-enable authentication check when Clerk is properly configured
  const allowAccess = true; // Set to false to re-enable authentication

  // If Clerk is not available, show configuration error
  if (!isClerkAvailable && !allowAccess) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-4">Configuration Required</h2>
          <p className="text-gray-600 mb-4">
            Clerk authentication is not configured. Please set the following environment variables:
          </p>
          <div className="bg-gray-100 p-4 rounded-lg text-left text-sm font-mono">
            <p>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</p>
            <p>CLERK_SECRET_KEY</p>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Check your .env.local file or Netlify environment variables.
          </p>
        </div>
      </div>
    )
  }

  // If Clerk user is not authenticated, show sign-in prompt
  if (!clerkUser.user && !allowAccess) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please log in to access the dashboard.</p>
          <a href="/sign-in" className="text-[rgb(var(--primary))] hover:text-[rgb(var(--secondary))] underline">
            Go to Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] flex flex-col">
      <Header id="dashboard-header" />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}