"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, ShoppingBag, ArrowLeft, CreditCard, Truck, Minus, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CheckoutResult {
    success: boolean;
    orderId?: string;
    message: string;
}

export default function CartPage() {
    const { state, removeItem, updateQuantity, clearCart } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [checkoutResult, setCheckoutResult] = useState<CheckoutResult | null>(null);
    const [shippingCost, setShippingCost] = useState(0);
    const [taxRate, setTaxRate] = useState(0.08);
    const router = useRouter();

    // Calculate shipping cost based on order value
    useEffect(() => {
        if (state.total >= 50) {
            setShippingCost(0); // Free shipping over $50
        } else {
            setShippingCost(5.99); // Standard shipping
        }
    }, [state.total]);

    const handleCheckout = async () => {
        if (state.items.length === 0) return;

        setIsCheckingOut(true);
        setCheckoutResult(null);

        try {
            // Create orders for each cart item
            const orderPromises = state.items.map(async (item) => {
                const orderData = {
                    product_id: item.id,
                    product_name: item.title,
                    quantity: item.quantity,
                    total_amount: (item.price * item.quantity).toFixed(2)
                };

                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                });

                if (!response.ok) {
                    throw new Error(`Failed to create order for ${item.title}`);
                }

                return response.json();
            });

            const orderResults = await Promise.all(orderPromises);
            const successfulOrders = orderResults.filter(result => result.success);

            if (successfulOrders.length === successfulOrders.length) {
                setCheckoutResult({
                    success: true,
                    orderId: `ORD-${Date.now()}`,
                    message: `Successfully created ${successfulOrders.length} order(s)!`
                });

                // Clear cart after successful checkout
                setTimeout(() => {
                    clearCart();
                    router.push('/order-confirmation');
                }, 2000);
            } else {
                throw new Error('Some orders failed to create');
            }

        } catch (error) {
            console.error('Checkout failed:', error);
            setCheckoutResult({
                success: false,
                message: 'Checkout failed. Please try again or contact support.'
            });
        } finally {
            setIsCheckingOut(false);
        }
    };

    const handleClearCart = async () => {
        if (state.items.length === 0) return;

        setIsClearing(true);
        try {
            // Simulate clearing process
            await new Promise(resolve => setTimeout(resolve, 1000));
            clearCart();
        } catch (error) {
            console.error('Failed to clear cart:', error);
            alert('Failed to clear cart. Please try again.');
        } finally {
            setIsClearing(false);
        }
    };

    const handleQuantityChange = (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        updateQuantity(itemId, newQuantity);
    };

    const handleRemoveItem = (itemId: string) => {
        removeItem(itemId);
    };

    const calculateTax = () => {
        return state.total * taxRate;
    };

    const calculateTotal = () => {
        return state.total + shippingCost + calculateTax();
    };

    if (state.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-12 h-12 text-gray-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Looks like you haven't added any products to your cart yet.
                        </p>
                        <div className="space-x-4">
                            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                                <Link href="/products">
                                    <ArrowLeft className="mr-2 h-5 w-5" />
                                    Continue Shopping
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                    <p className="text-gray-600 mt-2">
                        {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>

                {/* Checkout Result Message */}
                {checkoutResult && (
                    <div className={`mb-6 p-4 rounded-lg border ${checkoutResult.success
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                        <div className="flex items-center gap-2">
                            {checkoutResult.success ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                                <AlertCircle className="h-5 w-5 text-red-600" />
                            )}
                            <span className="font-medium">{checkoutResult.message}</span>
                        </div>
                        {checkoutResult.success && checkoutResult.orderId && (
                            <p className="text-sm mt-1">Order ID: {checkoutResult.orderId}</p>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingBag className="h-5 w-5" />
                                    Cart Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {state.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                        {/* Product Image */}
                                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover rounded-lg"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        target.nextElementSibling?.classList.remove('hidden');
                                                    }}
                                                />
                                            ) : null}
                                            <span className={`text-gray-400 text-sm ${item.image ? 'hidden' : ''}`}>No Image</span>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                                            <p className="text-sm text-gray-600">SKU: {item.id}</p>
                                            {item.supplierId && (
                                                <p className="text-xs text-gray-500">Supplier: {item.supplierId}</p>
                                            )}
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-lg font-bold text-blue-600">
                                                    ${item.price.toFixed(2)}
                                                </span>
                                                <Badge variant="secondary">
                                                    {item.quantity} {item.quantity === 1 ? 'item' : 'items'}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Remove Button */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="text-red-600 border-red-200 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}

                                {/* Clear Cart Button */}
                                <div className="pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={handleClearCart}
                                        disabled={isClearing}
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                        {isClearing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                                                Clearing...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Clear Cart
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="border-0 shadow-lg sticky top-8">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Summary Items */}
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal ({state.itemCount} items)</span>
                                        <span className="font-medium">${state.total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                                            {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax ({(taxRate * 100).toFixed(0)}%)</span>
                                        <span className="font-medium">${calculateTax().toFixed(2)}</span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-blue-600">
                                                ${calculateTotal().toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <Button
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut || state.items.length === 0}
                                    className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg font-semibold"
                                >
                                    {isCheckingOut ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="mr-2 h-5 w-5" />
                                            Proceed to Checkout
                                        </>
                                    )}
                                </Button>

                                {/* Continue Shopping */}
                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full"
                                >
                                    <Link href="/products">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Continue Shopping
                                    </Link>
                                </Button>

                                {/* Shipping Info */}
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-2 text-blue-700 mb-2">
                                        <Truck className="h-4 w-4" />
                                        <span className="font-medium text-sm">
                                            {shippingCost === 0 ? 'Free Shipping' : 'Standard Shipping'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-blue-600">
                                        {shippingCost === 0
                                            ? 'Your order qualifies for free standard shipping!'
                                            : 'Orders over $50 qualify for free standard shipping'
                                        }
                                    </p>
                                </div>

                                {/* Estimated Delivery */}
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-2 text-green-700 mb-2">
                                        <Truck className="h-4 w-4" />
                                        <span className="font-medium text-sm">Estimated Delivery</span>
                                    </div>
                                    <p className="text-xs text-green-600">
                                        3-5 business days for standard shipping
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}