'use client'

import React, { useId } from 'react'

interface Order {
  order_id: string
  product_name: string
  quantity: number
  total_amount: number
  created_at?: string
}

interface Payment {
  order_id: string
  status: string
  created_at: string
}

interface OrderHistoryTableProps {
  id?: string
  orders: Order[]
  payments: Payment[]
}

export default function OrderHistoryTable({ id, orders = [], payments = [] }: OrderHistoryTableProps) {
  const defaultId = useId()
  const componentId = id || defaultId

  // Create a map of order_id to payment status for quick lookup
  const paymentStatusMap = React.useMemo(() => {
    const map = new Map<string, string>()
    if (payments && Array.isArray(payments)) {
      payments.forEach(payment => {
        if (payment?.order_id && payment?.status) {
          map.set(payment.order_id, payment.status)
        }
      })
    }
    return map
  }, [payments])

  const getStatusBadgeColor = (status: string) => {
    if (!status) {
      return 'bg-gray-100 text-gray-600'
    }
    
    const normalizedStatus = status.toLowerCase()
    switch (normalizedStatus) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800'
      case 'pending':
        return 'bg-amber-100 text-amber-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const formatCurrency = (amount: number) => {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '$0.00'
    }
    return `$${amount.toFixed(2)}`
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return '-'
    }
  }

  if (!orders || !Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg 
            id="order-history-table-empty-icon" 
            className="w-8 h-8 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 id="order-history-table-empty-title" className="text-lg font-semibold text-gray-900 mb-2">
          No Orders Yet
        </h3>
        <p id="order-history-table-empty-description" className="text-gray-600">
          Your order history will appear here once you make your first purchase.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 id="order-history-table-title" className="text-xl font-semibold text-gray-900">
          Order History
        </h2>
        <p id="order-history-table-subtitle" className="text-sm text-gray-600 mt-1">
          View and track all your orders
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th id="order-history-table-header-order" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th id="order-history-table-header-product" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th id="order-history-table-header-quantity" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th id="order-history-table-header-amount" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th id="order-history-table-header-status" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th id="order-history-table-header-date" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order, index) => {
              const paymentStatus = paymentStatusMap.get(order.order_id) || 'pending'
              const isEvenRow = index % 2 === 0
              
              return (
                <tr 
                  key={order.order_id} 
                  className={`hover:bg-gray-50 transition-colors duration-150 ${isEvenRow ? 'bg-white' : 'bg-gray-50/30'}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span id={`order-history-table-order-id-${index}`} className="text-sm font-medium text-gray-900">
                      #{order.order_id?.slice(-8) || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-medium" id={`order-history-table-product-name-${index}`}>
                      {order.product_name || 'Unknown Product'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span id={`order-history-table-quantity-${index}`} className="text-sm text-gray-900">
                      {order.quantity || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span id={`order-history-table-amount-${index}`} className="text-sm font-semibold text-teal-600">
                      {formatCurrency(order.total_amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      id={`order-history-table-status-${index}`}
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(paymentStatus)}`}
                    >
                      {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span id={`order-history-table-date-${index}`} className="text-sm text-gray-600">
                      {formatDate(order.created_at)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p id="order-history-table-total-count" className="text-sm text-gray-600">
            Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-100 rounded-full border border-emerald-200"></div>
              <span id="order-history-table-legend-completed" className="text-xs text-gray-600">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-100 rounded-full border border-amber-200"></div>
              <span id="order-history-table-legend-pending" className="text-xs text-gray-600">Pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-100 rounded-full border border-red-200"></div>
              <span id="order-history-table-legend-failed" className="text-xs text-gray-600">Failed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}