'use client'

import { useState, useId } from 'react'
import Image from 'next/image'

interface Product {
  product_id: string
  product_name: string
  category: string
  price: number
  alibaba_price: number
  alibaba_url: string
}

interface ProductCardProps {
  id?: string
  product: Product
  onAddToCart: (productId: string, quantity: number) => void
}

export default function ProductCard({ id, product, onAddToCart }: ProductCardProps) {
  const defaultId = useId()
  const componentId = id || defaultId
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    if (!product?.product_id) return
    
    setIsLoading(true)
    try {
      await onAddToCart(product.product_id, quantity)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta))
  }

  const savings = product?.alibaba_price && product?.price 
    ? ((product.price - product.alibaba_price) / product.price * 100).toFixed(0)
    : 0

  if (!product) {
    return (
      <div id="product-card-empty" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
        <div id="product-card-empty-image" className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
        <div id="product-card-empty-title" className="h-4 bg-gray-200 rounded mb-2"></div>
        <div id="product-card-empty-price" className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
    )
  }

  return (
    <div id="product-card-container" className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group overflow-hidden">
      {/* Product Image */}
      <div id="product-card-image-container" className="relative w-full h-48 bg-gray-100 overflow-hidden">
        <div id="product-card-image-placeholder" className="w-full h-full bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center">
          <div id="product-card-image-text" className="text-center p-4">
            <div id="product-card-category-badge" className="inline-block px-2 py-1 bg-teal-600 text-white text-xs rounded-full mb-2 capitalize">
              {product.category || 'Product'}
            </div>
            <div id="product-card-image-title" className="text-teal-700 font-medium text-sm line-clamp-2">
              {product.product_name || 'Product Image'}
            </div>
          </div>
        </div>
        
        {/* Savings Badge */}
        {savings > 0 && (
          <div id="product-card-savings-badge" className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {savings}% OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div id="product-card-content" className="p-4">
        <h3 id="product-card-title" className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-teal-700 transition-colors">
          {product.product_name}
        </h3>

        <div id="product-card-category" className="text-xs text-gray-500 mb-3 capitalize">
          {product.category}
        </div>

        {/* Pricing */}
        <div id="product-card-pricing" className="mb-4">
          <div id="product-card-price" className="text-lg font-bold text-teal-600 mb-1">
            ${product.price?.toFixed(2) || '0.00'}
          </div>
          {product.alibaba_price && (
            <div id="product-card-original-price" className="flex items-center gap-2 text-xs text-gray-500">
              <span id="product-card-alibaba-label">Alibaba:</span>
              <span id="product-card-alibaba-price" className="line-through">
                ${product.alibaba_price.toFixed(2)}
              </span>
              <span id="product-card-savings-text" className="text-emerald-600 font-medium">
                Save ${(product.price - product.alibaba_price).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Quantity Selector */}
        <div id="product-card-quantity-section" className="mb-4">
          <label id="product-card-quantity-label" className="block text-xs font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <div id="product-card-quantity-controls" className="flex items-center gap-2">
            <button
              id="product-card-quantity-decrease"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              −
            </button>
            <span id="product-card-quantity-display" className="w-8 text-center text-sm font-medium">
              {quantity}
            </span>
            <button
              id="product-card-quantity-increase"
              onClick={() => handleQuantityChange(1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div id="product-card-actions" className="space-y-2">
          <button
            id="product-card-add-to-cart-button"
            onClick={handleAddToCart}
            disabled={isLoading}
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div id="product-card-loading-spinner" className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span id="product-card-loading-text">Adding...</span>
              </>
            ) : (
              <>
                <svg id="product-card-cart-icon" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <span id="product-card-add-text">Add to Cart</span>
              </>
            )}
          </button>

          {product.alibaba_url && (
            <a
              id="product-card-alibaba-link"
              href={product.alibaba_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border border-amber-500 text-amber-600 py-2 px-4 rounded-lg font-medium text-sm hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg id="product-card-external-icon" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span id="product-card-alibaba-text">View on Alibaba</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}