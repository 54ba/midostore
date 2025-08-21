"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import { useAuth, RequireAuth } from '@/app/contexts/AuthContext'
import Header from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function DashboardLayoutFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <LoadingSpinner id="dashboard-loading" size="lg" color="rgb(var(--primary))" />
      </div>
    )
  }

  return (
    <RequireAuth fallback={
      <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please log in to access the dashboard.</p>
          <a href="/login" className="text-[rgb(var(--primary))] hover:text-[rgb(var(--secondary))] underline">
            Go to Login
          </a>
        </div>
      </div>
    }>
      <div className="min-h-screen bg-[rgb(var(--background))] flex flex-col">
        <Header id="dashboard-header" />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </RequireAuth>
  )
}