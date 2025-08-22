'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthBridge } from '@/app/contexts/AuthContext'
import OrderConfirmationCard from '@/components/OrderConfirmationCard'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Order {
  order_id: string
  user_id: string
  product_id: string
  product_name: string
  quantity: string
  total_amount: string
}

interface Payment {
  id: string;
  order_id: string;
  amount: number;
  status: string;
  payment_method: string;
  currency: string;
  timestamp: string;
}

export default function OrderConfirmationPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuthBridge()
  const [order, setOrder] = useState<Order | null>(null)
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrderAndPaymentData = useCallback(async (orderId: string) => {
    try {
      setLoading(true)

      // Fetch order data - GET /api/orders with id query parameter
      const orderResponse = await fetch(`/api/orders?id=${orderId}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (orderResponse.status === 401) {
        router.push('/login')
        return
      }

      if (!orderResponse.ok) {
        throw new Error(`Failed to fetch order: ${orderResponse.status}`)
      }

      const orderData = await orderResponse.json()
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to fetch order data')
      }

      const orderInfo = Array.isArray(orderData.data) ? orderData.data[0] : orderData.data
      setOrder(orderInfo)

      // Fetch payment data - GET /api/payments with order_id query parameter
      const paymentResponse = await fetch(`/api/payments?order_id=${orderId}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (paymentResponse.status === 401) {
        router.push('/login')
        return
      }

      if (paymentResponse.ok) {
        const paymentData = await paymentResponse.json()
        if (paymentData.success) {
          const paymentInfo = Array.isArray(paymentData.data) ? paymentData.data[0] : paymentData.data
          setPayment(paymentInfo)
        }
      }

    } catch (err) {
      console.error('Error fetching order confirmation data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load order confirmation')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/login')
      return
    }

    const urlParams = new URLSearchParams(window.location.search)
    const orderId = urlParams.get('order_id')
    const sessionId = urlParams.get('session_id')

    if (!orderId) {
      setError('Order ID not found in URL parameters')
      setLoading(false)
      return
    }

    fetchOrderAndPaymentData(orderId)
  }, [user, authLoading, router, fetchOrderAndPaymentData])

  const handleContinueShopping = () => {
    router.push('/dashboard')
  }

  const handleViewOrders = () => {
    router.push('/orders')
  }

  if (authLoading || loading) {
    return (
      <div id="order-confirmation-loading" className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <div id="loading-container" className="text-center">
          <LoadingSpinner id="order-confirmation-spinner" size="lg" color="rgb(var(--primary))" />
          <p id="loading-text" className="mt-4 text-[rgb(var(--foreground))]">Loading order confirmation...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div id="order-confirmation-error" className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <div id="error-container" className="text-center max-w-md mx-auto px-6">
          <div id="error-icon" className="w-16 h-16 bg-[rgb(var(--error))] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg id="error-svg" className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 id="error-title" className="text-2xl font-bold text-[rgb(var(--foreground))] mb-2">Order Not Found</h2>
          <p id="error-message" className="text-gray-600 mb-6">{error}</p>
          <div id="error-actions" className="space-y-3">
            <button
              id="back-to-dashboard-btn"
              onClick={handleContinueShopping}
              className="w-full bg-[rgb(var(--primary))] text-white px-6 py-3 rounded-lg hover:bg-[rgb(var(--primary))]/90 transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              id="view-orders-btn"
              onClick={handleViewOrders}
              className="w-full bg-gray-100 text-[rgb(var(--foreground))] px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              View Order History
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div id="no-order-found" className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <div id="no-order-container" className="text-center max-w-md mx-auto px-6">
          <h2 id="no-order-title" className="text-2xl font-bold text-[rgb(var(--foreground))] mb-2">No Order Found</h2>
          <p id="no-order-message" className="text-gray-600 mb-6">We couldn&apos;t find the order you&apos;re looking for.</p>
          <button
            id="no-order-dashboard-btn"
            onClick={handleContinueShopping}
            className="bg-[rgb(var(--primary))] text-white px-6 py-3 rounded-lg hover:bg-[rgb(var(--primary))]/90 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const paymentStatus = payment?.status || 'pending'

  return (
    <div id="order-confirmation-page" className="min-h-screen bg-[rgb(var(--background))]">
      <div id="confirmation-container" className="max-w-4xl mx-auto px-4 py-8">

        {/* Success Header */}
        <div id="success-header" className="text-center mb-8">
          <div id="success-icon" className="w-20 h-20 bg-[rgb(var(--success))] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg id="success-svg" className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 id="success-title" className="text-3xl font-bold text-[rgb(var(--foreground))] mb-2">Order Confirmed!</h1>
          <p id="success-subtitle" className="text-lg text-gray-600">Thank you for your order. We&apos;ll process it shortly.</p>
        </div>

        {/* Order Confirmation Card */}
        <div id="order-card-section" className="mb-8">
          <OrderConfirmationCard
            id="main-order-card"
            order={{
              order_id: order.order_id,
              product_name: order.product_name,
              quantity: parseInt(order.quantity),
              total_amount: parseFloat(order.total_amount)
            }}
            paymentStatus={paymentStatus}
          />
        </div>

        {/* Order Details */}
        <div id="order-details-section" className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 id="order-details-title" className="text-xl font-bold text-[rgb(var(--foreground))] mb-4">Order Details</h2>
          <div id="order-details-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div id="order-id-section">
              <p id="order-id-label" className="text-sm text-gray-600">Order ID</p>
              <p id="order-id-value" className="font-semibold text-[rgb(var(--foreground))]">{order.order_id}</p>
            </div>
            <div id="product-name-section">
              <p id="product-name-label" className="text-sm text-gray-600">Product</p>
              <p id="product-name-value" className="font-semibold text-[rgb(var(--foreground))]">{order.product_name}</p>
            </div>
            <div id="quantity-section">
              <p id="quantity-label" className="text-sm text-gray-600">Quantity</p>
              <p id="quantity-value" className="font-semibold text-[rgb(var(--foreground))]">{order.quantity}</p>
            </div>
            <div id="total-amount-section">
              <p id="total-amount-label" className="text-sm text-gray-600">Total Amount</p>
              <p id="total-amount-value" className="font-semibold text-[rgb(var(--primary))] text-lg">${parseFloat(order.total_amount).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        {payment && (
          <div id="payment-info-section" className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 id="payment-info-title" className="text-xl font-bold text-[rgb(var(--foreground))] mb-4">Payment Information</h2>
            <div id="payment-info-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div id="payment-id-section">
                <p id="payment-id-label" className="text-sm text-gray-600">Payment ID</p>
                <p id="payment-id-value" className="font-semibold text-[rgb(var(--foreground))]">{payment.id}</p>
              </div>
              <div id="payment-amount-section">
                <p id="payment-amount-label" className="text-sm text-gray-600">Amount Paid</p>
                <p id="payment-amount-value" className="font-semibold text-[rgb(var(--success))] text-lg">${payment.amount.toFixed(2)}</p>
              </div>
              <div id="payment-status-section">
                <p id="payment-status-label" className="text-sm text-gray-600">Payment Status</p>
                <span
                  id="payment-status-badge"
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${paymentStatus === 'completed'
                    ? 'bg-[rgb(var(--success))]/10 text-[rgb(var(--success))]'
                    : paymentStatus === 'failed'
                      ? 'bg-[rgb(var(--error))]/10 text-[rgb(var(--error))]'
                      : 'bg-[rgb(var(--secondary))]/10 text-[rgb(var(--secondary))]'
                    }`}
                >
                  {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div id="next-steps-section" className="bg-[rgb(var(--primary))]/5 rounded-lg p-6 mb-8">
          <h2 id="next-steps-title" className="text-xl font-bold text-[rgb(var(--foreground))] mb-4">What&apos;s Next?</h2>
          <div id="next-steps-list" className="space-y-3">
            <div id="step-1" className="flex items-start">
              <div id="step-1-icon" className="w-6 h-6 bg-[rgb(var(--primary))] rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span id="step-1-number" className="text-white text-sm font-bold">1</span>
              </div>
              <p id="step-1-text" className="text-[rgb(var(--foreground))]">We&apos;ll process your order and contact our Alibaba suppliers</p>
            </div>
            <div id="step-2" className="flex items-start">
              <div id="step-2-icon" className="w-6 h-6 bg-[rgb(var(--primary))] rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span id="step-2-number" className="text-white text-sm font-bold">2</span>
              </div>
              <p id="step-2-text" className="text-[rgb(var(--foreground))]">You&apos;ll receive tracking information once your order ships</p>
            </div>
            <div id="step-3" className="flex items-start">
              <div id="step-3-icon" className="w-6 h-6 bg-[rgb(var(--primary))] rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span id="step-3-number" className="text-white text-sm font-bold">3</span>
              </div>
              <p id="step-3-text" className="text-[rgb(var(--foreground))]">Your order will be delivered to your specified address</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div id="action-buttons" className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            id="continue-shopping-btn"
            onClick={handleContinueShopping}
            className="bg-[rgb(var(--primary))] text-white px-8 py-3 rounded-lg hover:bg-[rgb(var(--primary))]/90 transition-colors font-semibold"
          >
            Continue Shopping
          </button>
          <button
            id="view-order-history-btn"
            onClick={handleViewOrders}
            className="bg-white text-[rgb(var(--primary))] px-8 py-3 rounded-lg border border-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/5 transition-colors font-semibold"
          >
            View Order History
          </button>
        </div>

        {/* Support Information */}
        <div id="support-info" className="text-center mt-8 pt-8 border-t border-gray-200">
          <p id="support-text" className="text-gray-600 mb-2">Need help with your order?</p>
          <button
            id="contact-support-btn"
            onClick={() => router.push('/contact')}
            className="text-[rgb(var(--primary))] hover:text-[rgb(var(--secondary))] underline underline-offset-4 transition-colors"
          >
            Contact our support team
          </button>
        </div>

      </div>
    </div>
  )
}