'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import EnhancedCheckoutForm from '@/components/EnhancedCheckoutForm'
import OrderSummary from '@/components/OrderSummary'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useAuth } from '@/app/contexts/AuthContext'

interface CartItem {
  product_id: string
  product_name: string
  price: number
  quantity: number
}

interface CheckoutFormData {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [SignIn, setSignIn] = useState<any>(null)
  const [SignUp, setSignUp] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  // Load Clerk components dynamically
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      import('@clerk/nextjs').then(({ SignIn: ClerkSignIn, SignUp: ClerkSignUp }) => {
        setSignIn(() => ClerkSignIn);
        setSignUp(() => ClerkSignUp);
      }).catch(() => {
        console.error('Failed to load Clerk components');
      });
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // Show auth prompt instead of redirecting
        setShowAuthPrompt(true)
        loadCartItems() // Still load cart items for display
      } else {
        setShowAuthPrompt(false)
        loadCartItems()
      }
    }
  }, [user, authLoading])

  const loadCartItems = () => {
    try {
      const savedCart = localStorage.getItem('midohub_cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          setCartItems(parsedCart)
        } else {
          router.push('/cart')
        }
      } else {
        router.push('/cart')
      }
    } catch (err) {
      console.error('Failed to load cart items:', err)
      setError('Failed to load cart items')
    } finally {
      setLoading(false)
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const calculateShipping = () => {
    return 15.00
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.08
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax()
  }

  const handleCheckout = async (formData: CheckoutFormData) => {
    if (!user) {
      setShowAuthPrompt(true)
      return
    }

    setCheckoutLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          customerInfo: formData,
          userId: user.user_id
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (err) {
      console.error('Checkout error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during checkout')
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (loading || authLoading) {
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
            onClick={() => router.push('/cart')}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Cart
          </button>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">Complete your order below</p>
        </div>

        {showAuthPrompt && !user ? (
          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Sign in to complete your order
              </h2>
              <p className="text-gray-600">
                You need to sign in or create an account to proceed with checkout
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('signin')}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${activeTab === 'signin'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab('signup')}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${activeTab === 'signup'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            <div className="max-w-md mx-auto">
              {activeTab === 'signin' && SignIn && (
                <SignIn
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-blue-500 hover:bg-blue-600 text-white',
                      card: 'shadow-none border-0',
                      headerTitle: 'text-gray-900',
                      headerSubtitle: 'text-gray-600',
                    }
                  }}
                />
              )}
              {activeTab === 'signup' && SignUp && (
                <SignUp
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-blue-500 hover:bg-blue-600 text-white',
                      card: 'shadow-none border-0',
                      headerTitle: 'text-gray-900',
                      headerSubtitle: 'text-gray-600',
                    }
                  }}
                />
              )}
              {(!SignIn || !SignUp) && (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading authentication...</p>
                </div>
              )}
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className={showAuthPrompt && !user ? 'opacity-50 pointer-events-none' : ''}>
            <EnhancedCheckoutForm
              onSubmit={handleCheckout}
              loading={checkoutLoading}
              user={user}
            />
          </div>

          {/* Order Summary */}
          <div>
            <OrderSummary
              items={cartItems}
              subtotal={calculateSubtotal()}
              shipping={calculateShipping()}
              tax={calculateTax()}
              total={calculateTotal()}
            />
          </div>
        </div>
      </div>
    </div>
  )
}