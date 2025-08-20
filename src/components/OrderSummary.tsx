'use client'

import { useId } from 'react'

interface OrderSummaryItem {
  product_id: string
  product_name: string
  price: number
  quantity: number
}

interface OrderSummaryProps {
  id?: string
  items: OrderSummaryItem[]
  subtotal: number
  shipping: number
  total: number
}

export default function OrderSummary({
  id,
  items = [],
  subtotal = 0,
  shipping = 0,
  total = 0
}: OrderSummaryProps) {
  const defaultId = useId()
  const componentId = id || defaultId

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 id="order-summary-title" className="text-xl font-bold text-gray-900">
          Order Summary
        </h2>
        <p id="order-summary-subtitle" className="text-sm text-gray-600 mt-1">
          Review your items before checkout
        </p>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={`order-summary-item-${item.product_id || index}`}
              id={`order-summary-item-${item.product_id || index}`}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex-1 min-w-0">
                <h3
                  id={`order-summary-product-name-${item.product_id || index}`}
                  className="text-sm font-medium text-gray-900 truncate"
                >
                  {item.product_name || 'Unknown Product'}
                </h3>
                <div className="flex items-center mt-1 space-x-4">
                  <span
                    id={`order-summary-quantity-${item.product_id || index}`}
                    className="text-sm text-gray-600"
                  >
                    Qty: {item.quantity || 0}
                  </span>
                  <span
                    id={`order-summary-unit-price-${item.product_id || index}`}
                    className="text-sm text-gray-600"
                  >
                    {formatPrice(item.price || 0)} each
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <span
                  id={`order-summary-item-total-${item.product_id || index}`}
                  className="text-sm font-semibold text-gray-900"
                >
                  {formatPrice((item.price || 0) * (item.quantity || 0))}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p id="order-summary-empty-message" className="text-gray-500 text-sm">
              No items in your order
            </p>
          </div>
        )}
      </div>

      {/* Order Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span id="order-summary-subtotal-label" className="text-sm text-gray-600">
            Subtotal
          </span>
          <span id="order-summary-subtotal-amount" className="text-sm font-medium text-gray-900">
            {formatPrice(subtotal)}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between">
          <span id="order-summary-shipping-label" className="text-sm text-gray-600">
            Shipping
          </span>
          <span id="order-summary-shipping-amount" className="text-sm font-medium text-gray-900">
            {shipping === 0 ? 'Free' : formatPrice(shipping)}
          </span>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <span id="order-summary-total-label" className="text-base font-semibold text-gray-900">
            Total
          </span>
          <span id="order-summary-total-amount" className="text-lg font-bold text-teal-700">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span id="order-summary-item-count-label" className="text-gray-600">
              Items:
            </span>
            <span id="order-summary-item-count" className="ml-2 font-medium text-gray-900">
              {items?.length || 0}
            </span>
          </div>
          <div>
            <span id="order-summary-total-quantity-label" className="text-gray-600">
              Total Qty:
            </span>
            <span id="order-summary-total-quantity" className="ml-2 font-medium text-gray-900">
              {items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Savings Badge */}
      {subtotal > 0 && shipping === 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                id="order-summary-savings-icon"
                className="h-5 w-5 text-emerald-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p id="order-summary-savings-message" className="text-sm font-medium text-emerald-800">
                You&apos;re saving on shipping!
              </p>
              <p id="order-summary-savings-description" className="text-xs text-emerald-600">
                Free shipping on all orders
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}