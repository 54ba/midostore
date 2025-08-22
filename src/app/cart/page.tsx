"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/app/contexts/CartContext';
import { useSimpleAuth } from '@/app/contexts/SimpleAuthContext';
import Button from '@/components/Button';
import CartItem from '@/components/CartItem';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ShoppingCart, CreditCard } from 'lucide-react';

export default function CartPage() {
    const { user } = useSimpleAuth();
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
        if (user && !user.isGuest) {
            router.push('/dashboard/checkout');
        } else {
            router.push('/checkout');
        }
    };

    const handleContinueShopping = () => {
        router.push('/products');
    };

    if (safeCartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-4xl mx-auto px-4 py-16">
                    <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <ShoppingCart className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
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
                            {user && !user.isGuest && (
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                            {safeCartItems.length} {safeCartItems.length === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </div>
                    <Button
                        onClick={handleContinueShopping}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Continue Shopping
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Cart Items</h2>
                                <div className="space-y-4">
                                    {safeCartItems.map((item) => (
                                        <CartItem
                                            key={item.product_id}
                                            item={item}
                                            onUpdateQuantity={updateQuantity}
                                            onRemove={removeFromCart}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">${calculateShipping().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium">${calculateTax().toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span>${calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    onClick={handleCheckout}
                                    disabled={safeCartItems.length === 0}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                                >
                                    <CreditCard className="w-5 h-5 mr-2" />
                                    Proceed to Checkout
                                </Button>

                                <Button
                                    onClick={clearCart}
                                    variant="outline"
                                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
                                >
                                    Clear Cart
                                </Button>
                            </div>

                            {user && user.isGuest && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        💡 <strong>Guest user?</strong> Create an account to save your cart and get exclusive deals!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}