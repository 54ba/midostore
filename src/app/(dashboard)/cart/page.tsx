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
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Load cart items regardless of authentication status
    loadCartItems()
  }, [])

  const loadCartItems = () => {
    try {
      const savedCart = localStorage.getItem('midohub_cart')
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

  const updateCartItem = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeCartItem(productId)
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
      localStorage.setItem('midohub_cart', JSON.stringify(updatedItems))
    } catch (err) {
      console.error('Failed to update cart item:', err)
      setError('Failed to update cart item')
    } finally {
      setUpdating(false)
    }
  }

  const removeCartItem = async (productId: string) => {
    setUpdating(true)
    try {
      const updatedItems = cartItems.filter(item => item.product_id !== productId)
      setCartItems(updatedItems)
      localStorage.setItem('midohub_cart', JSON.stringify(updatedItems))
    } catch (err) {
      console.error('Failed to remove cart item:', err)
      setError('Failed to remove cart item')
    } finally {
      setUpdating(false)
    }
  }

  const clearCart = async () => {
    setUpdating(true)
    try {
      setCartItems([])
      localStorage.removeItem('midohub_cart')
    } catch (err) {
      console.error('Failed to clear cart:', err)
      setError('Failed to clear cart')
    } finally {
      setUpdating(false)
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const calculateShipping = () => {
    return cartItems.length > 0 ? 15.00 : 0
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.08
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax()
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty')
      return
    }

    // Save cart to localStorage with a specific key for checkout
    localStorage.setItem('midohub_cart', JSON.stringify(cartItems))
    router.push('/checkout')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="mt-2 text-gray-600">
            {cartItems.length > 0
              ? `${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart`
              : 'Your cart is empty'
            }
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-24 w-24 text-gray-400 mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">
                Discover amazing products and add them to your cart.
              </p>
              <Button
                onClick={() => router.push('/products')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                    {cartItems.length > 0 && (
                      <button
                        onClick={clearCart}
                        disabled={updating}
                        className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                      >
                        Clear Cart
                      </button>
                    )}
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.product_id}
                      item={item}
                      onUpdateQuantity={(quantity) => updateCartItem(item.product_id, quantity)}
                      onRemove={() => removeCartItem(item.product_id)}
                      updating={updating}
                    />
                  ))}
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="flex justify-start">
                <Button
                  onClick={() => router.push('/products')}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  ← Continue Shopping
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <OrderSummary
                  items={cartItems}
                  subtotal={calculateSubtotal()}
                  shipping={calculateShipping()}
                  tax={calculateTax()}
                  total={calculateTotal()}
                />

                <div className="mt-6">
                  <Button
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0 || updating}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? 'Updating...' : 'Proceed to Checkout'}
                  </Button>
                </div>

                {!user && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2">
                      <strong>Sign in for a better experience:</strong>
                    </p>
                    <p className="text-sm text-blue-700">
                      Save your cart, track orders, and manage your account.
                    </p>
                  </div>
                )}

                {/* Security badges */}
                <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>Free Returns</span>
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