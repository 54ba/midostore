'use client'

import React, { useState, useId } from 'react'

interface ProductInfoProps {
  id?: string
  product: {
    product_id: string
    product_name: string
    category: string
    price: number
    alibaba_price: number
    alibaba_url: string
  }
  onAddToCart: (productId: string, quantity: number) => void
}

export default function ProductInfo({ id, product, onAddToCart }: ProductInfoProps) {
  const defaultId = useId()
  const componentId = id || defaultId
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  if (!product) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        <p id="product-info-error" className="text-gray-500 dark:text-gray-400">Product information not available</p>
      </div>
    )
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change)
    setQuantity(newQuantity)
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await onAddToCart(product.product_id, quantity)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const savings = product.price - product.alibaba_price
  const savingsPercentage = Math.round((savings / product.price) * 100)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Product Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 id="product-info-title" className="text-2xl font-bold text-gray-900 mb-2">
              {product.product_name}
            </h1>
            <div className="flex items-center gap-3 mb-3">
              <span id="product-info-category" className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                {product.category}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p id="product-info-price-label" className="text-sm text-gray-600 mb-1">Your Price</p>
              <p id="product-info-price" className="text-3xl font-bold text-teal-600">
                ${product.price.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p id="product-info-alibaba-label" className="text-sm text-gray-600 mb-1">Alibaba Price</p>
              <p id="product-info-alibaba-price" className="text-xl text-gray-500 line-through">
                ${product.alibaba_price.toFixed(2)}
              </p>
            </div>
          </div>

          {savings > 0 && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <p id="product-info-savings-label" className="text-sm font-medium text-gray-700">
                You save:
              </p>
              <div className="text-right">
                <p id="product-info-savings-amount" className="text-lg font-bold text-emerald-600">
                  ${savings.toFixed(2)}
                </p>
                <p id="product-info-savings-percentage" className="text-sm text-emerald-600">
                  ({savingsPercentage}% off)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quantity Selector */}
        <div className="mb-6">
          <label id="product-info-quantity-label" className="block text-sm font-medium text-gray-700 mb-3">
            Quantity
          </label>
          <div className="flex items-center gap-3">
            <button
              id="product-info-quantity-decrease"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>

            <div className="flex-1 max-w-20">
              <input
                id="product-info-quantity-input"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-center border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <button
              id="product-info-quantity-increase"
              onClick={() => handleQuantityChange(1)}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Total Price */}
        <div className="bg-teal-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <p id="product-info-total-label" className="text-sm font-medium text-teal-700">
              Total Price ({quantity} {quantity === 1 ? 'item' : 'items'})
            </p>
            <p id="product-info-total-price" className="text-2xl font-bold text-teal-600">
              ${(product.price * quantity).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          id="product-info-add-to-cart"
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isAdding ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span id="product-info-adding-text">Adding to Cart...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
              </svg>
              <span id="product-info-add-text">Add to Cart</span>
            </>
          )}
        </button>
      </div>

      {/* Alibaba Source Link */}
      <div className="p-6 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <p id="product-info-source-label" className="text-sm font-medium text-gray-700 mb-1">
              Source Product
            </p>
            <p id="product-info-source-description" className="text-sm text-gray-600">
              View original listing on Alibaba
            </p>
          </div>
          <a
            id="product-info-alibaba-link"
            href={product.alibaba_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <span id="product-info-view-source-text">View Source</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}