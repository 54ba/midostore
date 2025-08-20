'use client'

import React, { useId } from 'react'

interface Order {
  order_id: string
  product_name: string
  quantity: number
  total_amount: number
}

interface OrderConfirmationCardProps {
  id?: string
  order: Order
  paymentStatus: string
}

export default function OrderConfirmationCard({ 
  id, 
  order, 
  paymentStatus 
}: OrderConfirmationCardProps) {
  const defaultId = useId()
  const componentId = id || defaultId

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800'
    
    const normalizedStatus = status.toLowerCase()
    switch (normalizedStatus) {
      case 'completed':
      case 'success':
      case 'paid':
        return 'bg-emerald-100 text-emerald-800'
      case 'pending':
      case 'processing':
        return 'bg-amber-100 text-amber-800'
      case 'failed':
      case 'error':
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    if (!status) return null
    
    const normalizedStatus = status.toLowerCase()
    switch (normalizedStatus) {
      case 'completed':
      case 'success':
      case 'paid':
        return (
          <svg 
            id="order-confirmation-card-success-icon"
            className="w-5 h-5 text-emerald-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'pending':
      case 'processing':
        return (
          <svg 
            id="order-confirmation-card-pending-icon"
            className="w-5 h-5 text-amber-600 animate-spin" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )
      case 'failed':
      case 'error':
      case 'cancelled':
        return (
          <svg 
            id="order-confirmation-card-error-icon"
            className="w-5 h-5 text-red-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      default:
        return null
    }
  }

  const formatCurrency = (amount: number) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (!order) {
    return (
      <div id="order-confirmation-card-error" className="bg-white rounded-lg shadow-lg border border-red-200 p-6 max-w-md mx-auto">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 id="order-confirmation-card-error-title" className="text-lg font-semibold text-gray-900 mb-2">
            Order Information Missing
          </h3>
          <p id="order-confirmation-card-error-message" className="text-gray-600">
            Unable to display order confirmation. Please contact support.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div id="order-confirmation-card-container" className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-md mx-auto transform transition-all duration-300 hover:shadow-xl">
      {/* Header with Status */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {getStatusIcon(paymentStatus)}
        </div>
        <h2 id="order-confirmation-card-title" className="text-2xl font-bold text-gray-900 mb-2">
          Order Confirmed
        </h2>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(paymentStatus)}`}>
          <span id="order-confirmation-card-status-text">
            {paymentStatus ? paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1) : 'Unknown'}
          </span>
        </div>
      </div>

      {/* Order Details */}
      <div className="space-y-4">
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-start mb-3">
            <span id="order-confirmation-card-order-id-label" className="text-sm font-medium text-gray-500">
              Order ID
            </span>
            <span id="order-confirmation-card-order-id-value" className="text-sm font-mono text-gray-900 break-all">
              {order.order_id || 'N/A'}
            </span>
          </div>
          
          <div className="flex justify-between items-start mb-3">
            <span id="order-confirmation-card-product-label" className="text-sm font-medium text-gray-500">
              Product
            </span>
            <span id="order-confirmation-card-product-value" className="text-sm text-gray-900 text-right max-w-48 break-words">
              {order.product_name || 'Unknown Product'}
            </span>
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <span id="order-confirmation-card-quantity-label" className="text-sm font-medium text-gray-500">
              Quantity
            </span>
            <span id="order-confirmation-card-quantity-value" className="text-sm text-gray-900">
              {order.quantity || 0}
            </span>
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <span id="order-confirmation-card-total-label" className="text-base font-semibold text-gray-900">
              Total Amount
            </span>
            <span id="order-confirmation-card-total-value" className="text-lg font-bold text-teal-600">
              {formatCurrency(order.total_amount)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-3">
        <button 
          id="order-confirmation-card-track-button"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Track Your Order
        </button>
        
        <button 
          id="order-confirmation-card-continue-button"
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Continue Shopping
        </button>
      </div>

      {/* Footer Message */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p id="order-confirmation-card-footer-message" className="text-xs text-gray-500 text-center">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  )
}