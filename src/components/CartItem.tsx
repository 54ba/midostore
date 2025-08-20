'use client'

import { useId } from 'react'
import Image from 'next/image'

interface CartItemProps {
  id?: string
  item: {
    product_id: string
    product_name: string
    price: number
    quantity: number
  }
  onQuantityChange: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

export default function CartItem({ id, item, onQuantityChange, onRemove }: CartItemProps) {
  const defaultId = useId()
  const componentId = id || defaultId

  const handleQuantityDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.product_id, item.quantity - 1)
    }
  }

  const handleQuantityIncrease = () => {
    onQuantityChange(item.product_id, item.quantity + 1)
  }

  const handleRemove = () => {
    onRemove(item.product_id)
  }

  const totalPrice = item.price * item.quantity

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-4">
        {/* Product Image Placeholder */}
        <div className="relative w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
          <div 
            id="cart-item-product-image"
            className="w-full h-full bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center"
          >
            <div className="text-teal-600 font-semibold text-xs text-center px-2">
              <span id="cart-item-image-text">Product Image</span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 
            id="cart-item-product-name"
            className="text-lg font-semibold text-gray-900 truncate mb-1"
          >
            {item.product_name}
          </h3>
          <p 
            id="cart-item-product-price"
            className="text-teal-600 font-bold text-lg"
          >
            ${item.price.toFixed(2)}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              id="cart-item-decrease-button"
              onClick={handleQuantityDecrease}
              disabled={item.quantity <= 1}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-teal-600 hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-l-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <div 
              id="cart-item-quantity-display"
              className="w-12 h-10 flex items-center justify-center text-gray-900 font-semibold border-x border-gray-300 bg-gray-50"
            >
              {item.quantity}
            </div>
            
            <button
              id="cart-item-increase-button"
              onClick={handleQuantityIncrease}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-teal-600 hover:bg-teal-50 transition-colors duration-200 rounded-r-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Total Price */}
        <div className="text-right min-w-0">
          <p 
            id="cart-item-total-label"
            className="text-sm text-gray-500 mb-1"
          >
            Total
          </p>
          <p 
            id="cart-item-total-price"
            className="text-xl font-bold text-gray-900"
          >
            ${totalPrice.toFixed(2)}
          </p>
        </div>

        {/* Remove Button */}
        <button
          id="cart-item-remove-button"
          onClick={handleRemove}
          className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 flex-shrink-0"
          title="Remove item"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Layout Adjustments */}
      <div className="sm:hidden mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span 
              id="cart-item-mobile-quantity-label"
              className="text-sm text-gray-600"
            >
              Quantity:
            </span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                id="cart-item-mobile-decrease-button"
                onClick={handleQuantityDecrease}
                disabled={item.quantity <= 1}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-teal-600 hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-l-lg"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              
              <div 
                id="cart-item-mobile-quantity-display"
                className="w-10 h-8 flex items-center justify-center text-gray-900 font-semibold border-x border-gray-300 bg-gray-50 text-sm"
              >
                {item.quantity}
              </div>
              
              <button
                id="cart-item-mobile-increase-button"
                onClick={handleQuantityIncrease}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-teal-600 hover:bg-teal-50 transition-colors duration-200 rounded-r-lg"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="text-right">
            <p 
              id="cart-item-mobile-total-price"
              className="text-lg font-bold text-gray-900"
            >
              ${totalPrice.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}