"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSimpleAuth } from '@/app/contexts/SimpleAuthContext';
import { useCart } from '@/app/contexts/CartContext';
import Header from '@/components/Header';
import CheckoutForm from '@/components/CheckoutForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useSimpleAuth();
  const { cartItems } = useCart();
  const [loading, setLoading] = useState(false);

  // Ensure cartItems is always an array
  const safeCartItems = cartItems || [];

  // Redirect if cart is empty
  useEffect(() => {
    if (!authLoading && safeCartItems.length === 0) {
      router.replace('/cart');
    }
  }, [safeCartItems, authLoading, router]);

  const handleBackToCart = () => {
    router.push('/cart');
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect if cart is empty
  if (safeCartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Redirecting to cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleBackToCart}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Cart
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">Complete your order below</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <CheckoutForm />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items ({safeCartItems.length})</span>
                  <span className="font-medium">
                    ${safeCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">$15.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    ${(safeCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.08).toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>
                      ${(safeCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 15 + (safeCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.08)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Guest User Notice */}
              {user && user.isGuest && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Guest user?</strong> Create an account to save your information and track orders!
                  </p>
                </div>
              )}

              {/* Security Notice */}
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  🔒 <strong>Secure Checkout</strong> Your payment information is protected with bank-level security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}