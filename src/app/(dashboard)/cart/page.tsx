"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthBridge } from '@/app/contexts/AuthContext';
import { useCart } from '@/app/contexts/CartContext';
import Header from '@/components/Header';
import CartItem from '@/components/CartItem';
import LoadingSpinner from '@/components/LoadingSpinner';
import Button from '@/components/Button';
import { ShoppingCart, ArrowLeft, CreditCard } from 'lucide-react';

export default function CartPage() {
  const { user } = useAuthBridge();
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  // Ensure cartItems is always an array
  const safeCartItems = cartItems || [];

  const calculateSubtotal = () => {
    return safeCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    return safeCartItems.length > 0 ? 15.00 : 0;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const handleCheckout = () => {
    if (safeCartItems.length === 0) {
      return;
    }
    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    router.push('/products');
  };

  if (safeCartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to find great products!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleContinueShopping}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Start Shopping
              </Button>
              {user && (
                <Button
                  onClick={() => router.push('/dashboard')}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3"
                >
                  Go to Dashboard
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">
              {safeCartItems.length} {safeCartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Button
            onClick={handleContinueShopping}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {safeCartItems.map((item) => (
              <CartItem
                key={item.product_id}
                item={item}
                onUpdateQuantity={(newQuantity) => updateQuantity(item.product_id, newQuantity)}
                onRemove={() => removeFromCart(item.product_id)}
              />
            ))}

            {/* Clear Cart Button */}
            {safeCartItems.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <Button
                  onClick={clearCart}
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Clear Cart
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({safeCartItems.length} items)</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>${calculateShipping().toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Proceed to Checkout
              </Button>

              {/* Security Notice */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  🔒 Secure checkout with SSL encryption
                </p>
              </div>

              {/* Shipping Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <ShoppingCart className="w-5 h-5 text-blue-500 mt-0.5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-900">Free shipping available</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Add ${(50 - calculateSubtotal()).toFixed(2)} more to qualify for free shipping
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}