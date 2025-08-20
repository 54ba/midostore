'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import CartItem from '@/components/CartItem'
import OrderSummary from '@/components/OrderSummary'
import Button from '@/components/Button'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useAuth } from '@/app/contexts/AuthContext'

interface CartItemData {
  product_id: string
  product_name: string
  price: number
  quantity: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      loadCartItems()
    }
  }, [user, authLoading, router])

  const loadCartItems = () => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart)
        }
      }
    } catch (err) {
      console.error('Failed to load cart items:', err)
      setError('Failed to load cart items')
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId)
      return
    }

    setUpdating(true)
    try {
      const updatedItems = cartItems.map(item =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
      setCartItems(updatedItems)
      localStorage.setItem('cart', JSON.stringify(updatedItems))
    } catch (err) {
      console.error('Failed to update quantity:', err)
      setError('Failed to update item quantity')
    } finally {
      setUpdating(false)
    }
  }

  const handleRemoveItem = (productId: string) => {
    setUpdating(true)
    try {
      const updatedItems = cartItems.filter(item => item.product_id !== productId)
      setCartItems(updatedItems)
      localStorage.setItem('cart', JSON.stringify(updatedItems))
    } catch (err) {
      console.error('Failed to remove item:', err)
      setError('Failed to remove item from cart')
    } finally {
      setUpdating(false)
    }
  }

  const handleClearCart = () => {
    setUpdating(true)
    try {
      setCartItems([])
      localStorage.removeItem('cart')
    } catch (err) {
      console.error('Failed to clear cart:', err)
      setError('Failed to clear cart')
    } finally {
      setUpdating(false)
    }
  }

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty')
      return
    }
    router.push('/checkout')
  }

  const handleContinueShopping = () => {
    router.push('/dashboard')
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const calculateShipping = () => {
    return cartItems.length > 0 ? 10.00 : 0
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping()
  }

  if (authLoading || loading) {
    return (
      <div id="cart-loading-container" className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <LoadingSpinner id="cart-loading-spinner" size="lg" color="rgb(var(--primary))" />
      </div>
    )
  }

  return (
    <div id="cart-page" className="min-h-screen bg-[rgb(var(--background))]">
      <div id="cart-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div id="cart-header" className="mb-8">
          <h1 id="cart-title" className="text-3xl font-bold text-[rgb(var(--foreground))]">
            Shopping Cart
          </h1>
          <p id="cart-subtitle" className="text-gray-600 mt-2">
            Review your items and proceed to checkout
          </p>
        </div>

        {error && (
          <div id="cart-error" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p id="cart-error-message" className="text-red-700">{error}</p>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div id="empty-cart" className="text-center py-16">
            <div id="empty-cart-icon" className="mx-auto mb-6 w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <svg id="empty-cart-svg" className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <h2 id="empty-cart-title" className="text-2xl font-bold text-[rgb(var(--foreground))] mb-4">
              Your cart is empty
            </h2>
            <p id="empty-cart-description" className="text-gray-600 mb-8">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Button
              id="continue-shopping-button"
              variant="primary"
              size="lg"
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div id="cart-with-items" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div id="cart-items-section" className="lg:col-span-2 space-y-4">
              <div id="cart-items-header" className="flex items-center justify-between mb-6">
                <h2 id="cart-items-title" className="text-xl font-semibold text-[rgb(var(--foreground))]">
                  Cart Items ({cartItems.length})
                </h2>
                <Button
                  id="clear-cart-button"
                  variant="outline"
                  size="sm"
                  onClick={handleClearCart}
                  disabled={updating}
                >
                  Clear Cart
                </Button>
              </div>

              <div id="cart-items-list" className="space-y-4">
                {cartItems.map((item, index) => (
                  <CartItem
                    key={item.product_id}
                    id={`cart-item-${index}`}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>

              <div id="cart-actions" className="pt-6 border-t border-gray-200">
                <Button
                  id="continue-shopping-link"
                  variant="outline"
                  size="md"
                  onClick={handleContinueShopping}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>

            <div id="order-summary-section" className="lg:col-span-1">
              <div id="order-summary-sticky" className="sticky top-24">
                <OrderSummary
                  id="cart-order-summary"
                  items={cartItems}
                  subtotal={calculateSubtotal()}
                  shipping={calculateShipping()}
                  total={calculateTotal()}
                />

                <div id="checkout-actions" className="mt-6 space-y-4">
                  <Button
                    id="proceed-checkout-button"
                    variant="primary"
                    size="lg"
                    onClick={handleProceedToCheckout}
                    disabled={updating || cartItems.length === 0}
                    loading={updating}
                  >
                    Proceed to Checkout
                  </Button>

                  <div id="secure-checkout-notice" className="text-center">
                    <div id="security-icons" className="flex items-center justify-center space-x-2 text-gray-500 mb-2">
                      <svg id="lock-icon" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span id="secure-text" className="text-sm">Secure Checkout</span>
                    </div>
                    <p id="security-description" className="text-xs text-gray-500">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}