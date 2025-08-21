'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useAuthBridge } from '@/app/contexts/AuthContext'
import CheckoutForm from '@/components/CheckoutForm';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function CheckoutPage() {
  const router = useRouter()
  const { user, loading } = useAuthBridge()

  // Immediately redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/sign-in?redirect=/checkout')
    }
  }, [user, loading, router])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // Show loading while redirecting
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Redirecting to sign-in...</p>
        </div>
      </div>
    )
  }

  // User is authenticated, show checkout content
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">Complete your order below</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Checkout Protected Successfully!
            </h2>
            <p className="text-gray-600">
              You are now authenticated and can access the checkout page.
            </p>
            <p className="text-gray-500 mt-2">
              User: {user.full_name} ({user.email})
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}