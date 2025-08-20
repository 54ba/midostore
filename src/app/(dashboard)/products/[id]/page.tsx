'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Product {
  product_id: string
  alibaba_url: string
  product_name: string
  category: string
  price: number
  alibaba_price: number
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addToCartMessage, setAddToCartMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user && id) {
      fetchProduct()
    }
  }, [id, user, authLoading, router])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      // GET single product by ID - requires auth_token cookie, query param: id
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (response.status === 401) {
        router.push('/login')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }

      const result = await response.json()
      
      if (result.success && result.data) {
        setProduct(result.data)
      } else {
        setError('Product not found')
      }
    } catch (err) {
      setError('Failed to load product details')
      console.error('Error fetching product:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change))
  }

  const handleAddToCart = async () => {
    if (!product || !user) return

    try {
      setAddingToCart(true)
      setAddToCartMessage(null)

      const totalAmount = product.price * quantity

      // POST create new order - requires auth_token cookie, body: product_id, product_name, quantity, total_amount
      const response = await fetch('/api/orders', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_id: product.product_id,
          product_name: product.product_name,
          quantity: quantity,
          total_amount: totalAmount
        })
      })

      if (response.status === 401) {
        router.push('/login')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to add to cart')
      }

      const result = await response.json()
      
      if (result.success) {
        setAddToCartMessage('Product added to cart successfully!')
        setTimeout(() => setAddToCartMessage(null), 3000)
      } else {
        setError('Failed to add product to cart')
      }
    } catch (err) {
      setError('Failed to add product to cart')
      console.error('Error adding to cart:', err)
    } finally {
      setAddingToCart(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div id="product-detail-loading" className="min-h-screen flex items-center justify-center">
        <LoadingSpinner id="product-loading-spinner" size="lg" color="rgb(var(--primary))" />
      </div>
    )
  }

  if (error) {
    return (
      <div id="product-error-container" className="min-h-screen flex items-center justify-center">
        <div id="product-error-card" className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div id="product-error-icon" className="text-6xl text-[rgb(var(--error))] mb-4">⚠️</div>
          <h2 id="product-error-title" className="text-2xl font-bold text-[rgb(var(--foreground))] mb-4">
            Oops! Something went wrong
          </h2>
          <p id="product-error-message" className="text-gray-600 mb-6">{error}</p>
          <div id="product-error-actions" className="space-y-3">
            <button
              id="product-retry-button"
              onClick={fetchProduct}
              className="w-full bg-[rgb(var(--primary))] text-white px-6 py-3 rounded-lg hover:bg-[rgb(var(--primary))]/90 transition-colors"
            >
              Try Again
            </button>
            <button
              id="product-back-button"
              onClick={() => router.push('/dashboard')}
              className="w-full bg-gray-100 text-[rgb(var(--foreground))] px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div id="product-not-found" className="min-h-screen flex items-center justify-center">
        <div id="product-not-found-card" className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h2 id="product-not-found-title" className="text-2xl font-bold text-[rgb(var(--foreground))] mb-4">
            Product Not Found
          </h2>
          <p id="product-not-found-message" className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <button
            id="product-not-found-back-button"
            onClick={() => router.push('/dashboard')}
            className="bg-[rgb(var(--primary))] text-white px-6 py-3 rounded-lg hover:bg-[rgb(var(--primary))]/90 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const savings = product.alibaba_price - product.price

  return (
    <div id="product-detail-page" className="min-h-screen bg-[rgb(var(--background))] py-8">
      <div id="product-detail-container" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav id="product-breadcrumb" className="mb-8">
          <div id="product-breadcrumb-content" className="flex items-center space-x-2 text-sm">
            <button
              id="breadcrumb-dashboard-link"
              onClick={() => router.push('/dashboard')}
              className="text-[rgb(var(--secondary))] hover:text-[rgb(var(--primary))] transition-colors"
            >
              Dashboard
            </button>
            <span id="breadcrumb-separator" className="text-gray-400">/</span>
            <span id="breadcrumb-current" className="text-[rgb(var(--foreground))] font-medium">
              {product.product_name}
            </span>
          </div>
        </nav>

        {/* Success Message */}
        {addToCartMessage && (
          <div id="add-to-cart-success" className="mb-6 bg-[rgb(var(--success))]/10 border border-[rgb(var(--success))]/20 rounded-lg p-4">
            <div id="success-message-content" className="flex items-center">
              <div id="success-icon" className="text-[rgb(var(--success))] mr-3">✓</div>
              <p id="success-text" className="text-[rgb(var(--success))] font-medium">{addToCartMessage}</p>
            </div>
          </div>
        )}

        {/* Product Detail Layout */}
        <div id="product-detail-layout" className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Product Image Section */}
          <div id="product-image-section" className="space-y-4">
            <div id="product-main-image" className="aspect-square bg-white rounded-lg shadow-lg flex items-center justify-center border">
              <div id="product-placeholder-image" className="text-center text-gray-400">
                <div id="image-icon" className="text-8xl mb-4">📦</div>
                <p id="image-placeholder-text" className="text-lg font-medium">{product.category}</p>
                <p id="image-product-name" className="text-sm text-gray-500 mt-2">{product.product_name}</p>
              </div>
            </div>
            
            {/* Category Badge */}
            <div id="product-category-badge" className="flex justify-center">
              <span id="category-label" className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))]">
                {product.category}
              </span>
            </div>
          </div>

          {/* Product Information Section */}
          <div id="product-info-section" className="space-y-6">
            
            {/* Product Title */}
            <div id="product-title-section">
              <h1 id="product-title" className="text-3xl font-bold text-[rgb(var(--foreground))] mb-2">
                {product.product_name}
              </h1>
              <p id="product-id-display" className="text-sm text-gray-500">
                Product ID: {product.product_id}
              </p>
            </div>

            {/* Pricing Section */}
            <div id="product-pricing-section" className="bg-white rounded-lg p-6 shadow-lg border">
              <div id="pricing-content" className="space-y-4">
                <div id="selling-price-section">
                  <p id="selling-price-label" className="text-sm font-medium text-gray-600">Selling Price</p>
                  <p id="selling-price-value" className="text-4xl font-bold text-[rgb(var(--primary))]">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                
                <div id="alibaba-price-section" className="flex items-center justify-between py-3 border-t">
                  <div id="alibaba-price-info">
                    <p id="alibaba-price-label" className="text-sm text-gray-600">Alibaba Price</p>
                    <p id="alibaba-price-value" className="text-lg text-gray-500 line-through">
                      ${product.alibaba_price.toFixed(2)}
                    </p>
                  </div>
                  <div id="savings-info" className="text-right">
                    <p id="savings-label" className="text-sm text-[rgb(var(--success))]">You Save</p>
                    <p id="savings-value" className="text-lg font-bold text-[rgb(var(--success))]">
                      ${savings.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alibaba Link */}
            <div id="alibaba-link-section" className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <div id="alibaba-link-content" className="flex items-center justify-between">
                <div id="alibaba-link-info">
                  <p id="alibaba-link-label" className="text-sm font-medium text-amber-800">
                    View Original Product
                  </p>
                  <p id="alibaba-link-description" className="text-sm text-amber-600">
                    Check the source product on Alibaba
                  </p>
                </div>
                <a
                  id="alibaba-link-button"
                  href={product.alibaba_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[rgb(var(--secondary))] text-white px-4 py-2 rounded-lg hover:bg-[rgb(var(--secondary))]/90 transition-colors text-sm font-medium"
                >
                  View on Alibaba →
                </a>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div id="add-to-cart-section" className="bg-white rounded-lg p-6 shadow-lg border">
              <div id="quantity-section" className="mb-6">
                <label id="quantity-label" className="block text-sm font-medium text-[rgb(var(--foreground))] mb-3">
                  Quantity
                </label>
                <div id="quantity-controls" className="flex items-center space-x-3">
                  <button
                    id="quantity-decrease"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span id="decrease-icon" className="text-lg font-medium">−</span>
                  </button>
                  <span id="quantity-display" className="text-xl font-bold text-[rgb(var(--foreground))] min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    id="quantity-increase"
                    onClick={() => handleQuantityChange(1)}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <span id="increase-icon" className="text-lg font-medium">+</span>
                  </button>
                </div>
              </div>

              <div id="total-section" className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div id="total-content" className="flex items-center justify-between">
                  <span id="total-label" className="text-lg font-medium text-[rgb(var(--foreground))]">
                    Total Amount
                  </span>
                  <span id="total-amount" className="text-2xl font-bold text-[rgb(var(--primary))]">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                id="add-to-cart-button"
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full bg-[rgb(var(--primary))] text-white py-4 rounded-lg font-bold text-lg hover:bg-[rgb(var(--primary))]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {addingToCart ? (
                  <>
                    <LoadingSpinner id="add-to-cart-spinner" size="sm" color="white" />
                    <span id="adding-text">Adding to Cart...</span>
                  </>
                ) : (
                  <>
                    <span id="cart-icon">🛒</span>
                    <span id="add-to-cart-text">Add to Cart</span>
                  </>
                )}
              </button>
            </div>

            {/* Action Buttons */}
            <div id="action-buttons-section" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                id="view-cart-button"
                onClick={() => router.push('/cart')}
                className="bg-white border border-[rgb(var(--primary))] text-[rgb(var(--primary))] py-3 rounded-lg font-medium hover:bg-[rgb(var(--primary))]/5 transition-colors"
              >
                View Cart
              </button>
              <button
                id="continue-shopping-button"
                onClick={() => router.push('/dashboard')}
                className="bg-gray-100 text-[rgb(var(--foreground))] py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}