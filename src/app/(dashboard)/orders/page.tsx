'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthBridge } from '@/app/contexts/AuthContext'
import OrderHistoryTable from '@/components/OrderHistoryTable'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  estimatedDelivery: string;
  shippingAddress: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
}

interface Payment {
  payment_id: string
  order_id: string
  amount: string
  status: string
  created_at: string
}

interface OrderWithPayment {
  order_id: string
  product_name: string
  quantity: number
  total_amount: number
  created_at?: string
}

interface PaymentStatus {
  order_id: string
  status: string
  created_at: string
}

export default function OrderHistoryPage() {
  const { user, loading: authLoading } = useAuthBridge()
  const router = useRouter()
  const [orders, setOrders] = useState<OrderWithPayment[]>([])
  const [payments, setPayments] = useState<PaymentStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrderHistory = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Fetch user orders - GET /api/orders?user_id=user_id
      const ordersResponse = await fetch(`/api/orders?user_id=${user.user_id}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (ordersResponse.status === 401) {
        router.push('/login')
        return
      }

      if (!ordersResponse.ok) {
        throw new Error('Failed to fetch orders')
      }

      const ordersData = await ordersResponse.json()

      if (!ordersData.success) {
        throw new Error(ordersData.error || 'Failed to fetch orders')
      }

      const fetchedOrders = Array.isArray(ordersData.data) ? ordersData.data : [ordersData.data]

      // Transform orders data
      const transformedOrders: OrderWithPayment[] = fetchedOrders.map((order: Order) => ({
        order_id: order.order_id,
        product_name: order.product_name,
        quantity: parseInt(order.quantity) || 0,
        total_amount: parseFloat(order.total_amount) || 0,
        created_at: undefined
      }))

      setOrders(transformedOrders)

      // Fetch payment status for each order
      const paymentPromises = transformedOrders.map(async (order) => {
        try {
          // GET /api/payments?order_id=order_id
          const paymentResponse = await fetch(`/api/payments?order_id=${order.order_id}`, {
            method: 'GET',
            credentials: 'include'
          })

          if (paymentResponse.ok) {
            const paymentData = await paymentResponse.json()
            if (paymentData.success && paymentData.data) {
              const paymentArray = Array.isArray(paymentData.data) ? paymentData.data : [paymentData.data]
              return paymentArray.map((payment: Payment) => ({
                order_id: payment.order_id,
                status: payment.status,
                created_at: payment.created_at
              }))
            }
          }

          // Return default status if no payment found
          return [{
            order_id: order.order_id,
            status: 'pending',
            created_at: new Date().toISOString()
          }]
        } catch {
          // Return default status on error
          return [{
            order_id: order.order_id,
            status: 'pending',
            created_at: new Date().toISOString()
          }]
        }
      })

      const paymentResults = await Promise.all(paymentPromises)
      const allPayments = paymentResults.flat()
      setPayments(allPayments)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order history')
    } finally {
      setLoading(false)
    }
  }, [user, router])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      fetchOrderHistory()
    }
  }, [user, authLoading, router, fetchOrderHistory])

  if (authLoading) {
    return (
      <div id="auth-loading-container" className="min-h-screen flex items-center justify-center">
        <LoadingSpinner id="auth-loading-spinner" size="lg" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div id="orders-loading-container" className="min-h-screen flex items-center justify-center">
        <LoadingSpinner id="orders-loading-spinner" size="lg" />
      </div>
    )
  }

  return (
    <div id="order-history-page" className="min-h-screen bg-[rgb(var(--background))]">
      <div id="order-history-container" className="max-w-6xl mx-auto px-4 py-8">
        <div id="order-history-header" className="mb-8">
          <h1 id="order-history-title" className="text-3xl font-bold text-[rgb(var(--foreground))] mb-2">
            Order History
          </h1>
          <p id="order-history-subtitle" className="text-gray-600">
            View and track all your past orders and their payment status
          </p>
        </div>

        {error && (
          <div id="error-message" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p id="error-text" className="text-red-700 font-medium">
              Error loading order history: {error}
            </p>
            <button
              id="retry-button"
              onClick={fetchOrderHistory}
              className="mt-2 px-4 py-2 bg-[rgb(var(--primary))] text-white rounded-lg hover:bg-[rgb(var(--primary))]/90 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!error && orders.length === 0 && (
          <div id="no-orders-container" className="text-center py-12">
            <div id="no-orders-icon" className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg id="no-orders-svg" className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 id="no-orders-title" className="text-xl font-semibold text-[rgb(var(--foreground))] mb-2">
              No Orders Yet
            </h3>
            <p id="no-orders-description" className="text-gray-600 mb-6">
              You haven&apos;t placed any orders yet. Start shopping to see your order history here.
            </p>
            <button
              id="browse-products-button"
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-[rgb(var(--primary))] text-white rounded-lg hover:bg-[rgb(var(--primary))]/90 transition-colors font-medium"
            >
              Browse Products
            </button>
          </div>
        )}

        {!error && orders.length > 0 && (
          <div id="orders-table-container">
            <OrderHistoryTable
              id="order-history-table"
              orders={orders}
              payments={payments}
            />
          </div>
        )}

        <div id="order-actions" className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            id="continue-shopping-button"
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-[rgb(var(--primary))] text-white rounded-lg hover:bg-[rgb(var(--primary))]/90 transition-colors font-medium"
          >
            Continue Shopping
          </button>
          <button
            id="contact-support-button"
            onClick={() => router.push('/contact')}
            className="px-6 py-3 bg-white text-[rgb(var(--primary))] border border-[rgb(var(--primary))] rounded-lg hover:bg-[rgb(var(--primary))]/5 transition-colors font-medium"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}