'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CheckoutForm from '@/components/CheckoutForm'
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
  fullName: string
  phone: string
  address: string
  city: string
  country: string
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

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

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping()
  }

  const handleCheckoutSubmit = async (formData: CheckoutFormData) => {
    if (!user) {
      setError('User authentication required')
      return
    }

    setCheckoutLoading(true)
    setError(null)

    try {
      // Create orders for each cart item
      const orderPromises = cartItems.map(async (item) => {
        // POST to /api/orders - Create new order with product_id, product_name, quantity, total_amount
        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            total_amount: item.price * item.quantity,
          }),
        })

        if (orderResponse.status === 401) {
          router.push('/login')
          throw new Error('Authentication required')
        }

        if (!orderResponse.ok) {
          const errorData = await orderResponse.json()
          throw new Error(errorData.error || 'Failed to create order')
        }

        const orderData = await orderResponse.json()
        if (!orderData.success) {
          throw new Error(orderData.error || 'Failed to create order')
        }

        return orderData.data
      })

      const orders = await Promise.all(orderPromises)

      // Create Stripe checkout session for subscription
      // POST to /api/stripe/create-checkout-session with priceId, successUrl, cancelUrl
      const checkoutResponse = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_1QVGgqKaGlKUvS4tQVmJKLZx',
          successUrl: `${window.location.origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/checkout`,
        }),
      })

      if (checkoutResponse.status === 401) {
        router.push('/login')
        return
      }

      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json()
        if (errorData.error === 'No stripe keys provided') {
          setError('Payment processing is not available. Please contact support or add Stripe keys in the Keys tab.')
          return
        }
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const checkoutData = await checkoutResponse.json()
      if (!checkoutData.success) {
        if (checkoutData.error === 'No stripe keys provided') {
          setError('Payment processing is not available. Please contact support or add Stripe keys in the Keys tab.')
          return
        }
        throw new Error(checkoutData.error || 'Failed to create checkout session')
      }

      // Create payment records for each order
      const paymentPromises = orders.map(async (order) => {
        // POST to /api/payments with order_id, stripe_payment_id, amount, status
        const paymentResponse = await fetch('/api/payments', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order_id: order.order_id,
            stripe_payment_id: checkoutData.data.sessionId,
            amount: parseFloat(order.total_amount),
            status: 'pending',
          }),
        })

        if (!paymentResponse.ok) {
          console.error('Failed to create payment record for order:', order.order_id)
        }

        return paymentResponse.ok
      })

      await Promise.all(paymentPromises)

      // Clear cart and redirect to Stripe
      localStorage.removeItem('midohub_cart')
      window.location.href = checkoutData.data.url

    } catch (err) {
      console.error('Checkout error:', err)
      setError(err instanceof Error ? err.message : 'Failed to process checkout. Please try again.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div id="checkout-loading-container" className="min-h-screen flex items-center justify-center">
        <LoadingSpinner id="checkout-loading-spinner" size="lg" color="rgb(var(--primary))" />
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div id="empty-checkout-container" className="min-h-screen flex items-center justify-center">
        <div id="empty-checkout-content" className="text-center">
          <h2 id="empty-checkout-title" className="text-2xl font-bold text-[rgb(var(--foreground))] mb-4">
            Your cart is empty
          </h2>
          <p id="empty-checkout-description" className="text-gray-600 mb-6">
            Add some products to your cart before checking out.
          </p>
          <button
            id="continue-shopping-button"
            onClick={() => router.push('/dashboard')}
            className="bg-[rgb(var(--primary))] text-white px-6 py-3 rounded-lg hover:bg-[rgb(var(--primary))]/90 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div id="checkout-page-container" className="min-h-screen py-8">
      <div id="checkout-content-wrapper" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="checkout-header" className="text-center mb-8">
          <h1 id="checkout-page-title" className="text-3xl font-bold text-[rgb(var(--foreground))]">
            Checkout
          </h1>
          <p id="checkout-page-subtitle" className="text-gray-600 mt-2">
            Complete your order and subscription
          </p>
        </div>

        {error && (
          <div id="checkout-error-container" className="mb-6 max-w-2xl mx-auto">
            <div id="checkout-error-alert" className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div id="checkout-error-content" className="flex">
                <div id="checkout-error-icon" className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div id="checkout-error-message" className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div id="checkout-main-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div id="checkout-form-section" className="lg:col-span-2">
            <CheckoutForm
              id="main-checkout-form"
              onSubmit={handleCheckoutSubmit}
              loading={checkoutLoading}
            />
          </div>

          <div id="checkout-summary-section" className="lg:col-span-1">
            <div id="checkout-summary-sticky" className="sticky top-8">
              <OrderSummary
                id="checkout-order-summary"
                items={cartItems}
                subtotal={calculateSubtotal()}
                shipping={calculateShipping()}
                total={calculateTotal()}
              />

              <div id="subscription-info-card" className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div id="subscription-info-header" className="flex items-start">
                  <div id="subscription-info-icon" className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div id="subscription-info-content" className="ml-3">
                    <h3 id="subscription-info-title" className="text-sm font-medium text-blue-800">
                      Subscription Required
                    </h3>
                    <div id="subscription-info-description" className="mt-2 text-sm text-blue-700">
                      <p>
                        Your order requires an active MidoHub subscription to access our premium dropshipping services and Alibaba integration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div id="security-badges" className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div id="ssl-badge" className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>SSL Secured</span>
                </div>
                <div id="stripe-badge" className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Powered by Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}