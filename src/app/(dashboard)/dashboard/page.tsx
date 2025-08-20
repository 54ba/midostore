'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import ProductCard from '@/components/ProductCard'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Product {
  product_id: string
  alibaba_url: string
  product_name: string
  category: string
  price: number
  alibaba_price: number
}

interface CartItem {
  product_id: string
  quantity: number
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
    
    if (user) {
      fetchProducts()
      loadCartFromStorage()
    }
  }, [user, authLoading, router])

  const fetchProducts = async () => {
    try {
      // GET: Fetch all products - no query parameters needed
      const response = await fetch('/api/products', {
        method: 'GET',
        credentials: 'include'
      })

      if (response.status === 401) {
        router.push('/login')
        return
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success && Array.isArray(result.data)) {
        setProducts(result.data)
      } else {
        setError('Failed to load products data')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('midohub_cart')
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    } catch (err) {
      console.error('Failed to load cart from storage:', err)
    }
  }

  const saveCartToStorage = (items: CartItem[]) => {
    try {
      localStorage.setItem('midohub_cart', JSON.stringify(items))
    } catch (err) {
      console.error('Failed to save cart to storage:', err)
    }
  }

  const handleAddToCart = async (productId: string, quantity: number) => {
    if (!user) {
      router.push('/login')
      return
    }

    setAddingToCart(productId)

    try {
      const existingItemIndex = cartItems.findIndex(item => item.product_id === productId)
      let updatedCart: CartItem[]

      if (existingItemIndex >= 0) {
        updatedCart = [...cartItems]
        updatedCart[existingItemIndex].quantity += quantity
      } else {
        updatedCart = [...cartItems, { product_id: productId, quantity }]
      }

      setCartItems(updatedCart)
      saveCartToStorage(updatedCart)

      // Show success feedback
      setTimeout(() => {
        setAddingToCart(null)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item to cart')
      setAddingToCart(null)
    }
  }

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const filteredProducts = categoryFilter === 'all' 
    ? products 
    : products.filter(product => product.category === categoryFilter)

  const toyProducts = filteredProducts.filter(p => p.category === 'toys')
  const cosmeticProducts = filteredProducts.filter(p => p.category === 'cosmetics')

  if (authLoading || loading) {
    return (
      <div id="dashboard-loading-container" className="min-h-screen flex items-center justify-center">
        <div id="dashboard-loading-content" className="text-center">
          <LoadingSpinner id="dashboard-spinner" size="lg" color="rgb(var(--primary))" />
          <p id="dashboard-loading-text" className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div id="dashboard-error-container" className="min-h-screen flex items-center justify-center">
        <div id="dashboard-error-content" className="text-center max-w-md mx-auto px-6">
          <div id="dashboard-error-icon" className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 id="dashboard-error-title" className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Products</h2>
          <p id="dashboard-error-message" className="text-gray-600 mb-6">{error}</p>
          <button
            id="dashboard-retry-button"
            onClick={() => {
              setError(null)
              setLoading(true)
              fetchProducts()
            }}
            className="bg-[rgb(var(--primary))] text-white px-6 py-2 rounded-lg hover:bg-[rgb(var(--primary))]/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div id="dashboard-page" className="min-h-screen bg-[rgb(var(--background))]">
      {/* Hero Section */}
      <section id="dashboard-hero" className="bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--primary))]/80 text-white">
        <div id="dashboard-hero-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div id="dashboard-hero-content" className="text-center">
            <h1 id="dashboard-hero-title" className="text-4xl md:text-5xl font-bold mb-6">
              Welcome to MidoHub Dashboard
            </h1>
            <p id="dashboard-hero-subtitle" className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Discover premium toys and cosmetics sourced directly from Alibaba at unbeatable prices
            </p>
            <div id="dashboard-hero-stats" className="flex flex-wrap justify-center gap-8 text-center">
              <div id="dashboard-stat-products" className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
                <div id="dashboard-stat-products-number" className="text-3xl font-bold">{products.length}</div>
                <div id="dashboard-stat-products-label" className="text-white/80">Products Available</div>
              </div>
              <div id="dashboard-stat-cart" className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
                <div id="dashboard-stat-cart-number" className="text-3xl font-bold">{getCartItemCount()}</div>
                <div id="dashboard-stat-cart-label" className="text-white/80">Items in Cart</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section id="dashboard-filters" className="bg-white border-b border-gray-200">
        <div id="dashboard-filters-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div id="dashboard-filters-content" className="flex flex-wrap gap-4 justify-center">
            <button
              id="dashboard-filter-all"
              onClick={() => setCategoryFilter('all')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                categoryFilter === 'all'
                  ? 'bg-[rgb(var(--primary))] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Products ({products.length})
            </button>
            <button
              id="dashboard-filter-toys"
              onClick={() => setCategoryFilter('toys')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                categoryFilter === 'toys'
                  ? 'bg-[rgb(var(--primary))] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toys ({toyProducts.length})
            </button>
            <button
              id="dashboard-filter-cosmetics"
              onClick={() => setCategoryFilter('cosmetics')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                categoryFilter === 'cosmetics'
                  ? 'bg-[rgb(var(--primary))] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cosmetics ({cosmeticProducts.length})
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="dashboard-products" className="py-12">
        <div id="dashboard-products-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div id="dashboard-no-products" className="text-center py-16">
              <div id="dashboard-no-products-icon" className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 id="dashboard-no-products-title" className="text-2xl font-semibold text-gray-900 mb-2">
                No Products Found
              </h3>
              <p id="dashboard-no-products-text" className="text-gray-600 mb-6">
                {categoryFilter === 'all' 
                  ? 'No products are available at the moment. Please check back later.'
                  : `No ${categoryFilter} products are available at the moment.`
                }
              </p>
              {categoryFilter !== 'all' && (
                <button
                  id="dashboard-show-all-button"
                  onClick={() => setCategoryFilter('all')}
                  className="text-[rgb(var(--primary))] hover:text-[rgb(var(--secondary))] font-medium"
                >
                  Show All Products
                </button>
              )}
            </div>
          ) : (
            <div id="dashboard-products-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.product_id}
                  id={`product-card-${product.product_id}`}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section id="dashboard-actions" className="bg-gray-50 border-t border-gray-200 py-12">
        <div id="dashboard-actions-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="dashboard-actions-content" className="text-center">
            <h2 id="dashboard-actions-title" className="text-3xl font-bold text-gray-900 mb-8">
              Quick Actions
            </h2>
            <div id="dashboard-actions-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                id="dashboard-action-cart"
                onClick={() => router.push('/cart')}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div id="dashboard-action-cart-icon" className="w-12 h-12 bg-[rgb(var(--primary))]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[rgb(var(--primary))]/20 transition-colors">
                  <svg className="w-6 h-6 text-[rgb(var(--primary))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9" />
                  </svg>
                </div>
                <h3 id="dashboard-action-cart-title" className="text-lg font-semibold text-gray-900 mb-2">View Cart</h3>
                <p id="dashboard-action-cart-text" className="text-gray-600">
                  {getCartItemCount()} items ready for checkout
                </p>
              </div>

              <div
                id="dashboard-action-orders"
                onClick={() => router.push('/orders')}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div id="dashboard-action-orders-icon" className="w-12 h-12 bg-[rgb(var(--secondary))]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[rgb(var(--secondary))]/20 transition-colors">
                  <svg className="w-6 h-6 text-[rgb(var(--secondary))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 id="dashboard-action-orders-title" className="text-lg font-semibold text-gray-900 mb-2">Order History</h3>
                <p id="dashboard-action-orders-text" className="text-gray-600">
                  Track your past orders and deliveries
                </p>
              </div>

              <div
                id="dashboard-action-profile"
                onClick={() => router.push('/profile')}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div id="dashboard-action-profile-icon" className="w-12 h-12 bg-[rgb(var(--success))]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[rgb(var(--success))]/20 transition-colors">
                  <svg className="w-6 h-6 text-[rgb(var(--success))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 id="dashboard-action-profile-title" className="text-lg font-semibold text-gray-900 mb-2">My Profile</h3>
                <p id="dashboard-action-profile-text" className="text-gray-600">
                  Update your account information
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Message for Add to Cart */}
      {addingToCart && (
        <div id="dashboard-cart-success" className="fixed bottom-4 right-4 bg-[rgb(var(--success))] text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span id="dashboard-cart-success-text">Added to cart successfully!</span>
        </div>
      )}
    </div>
  )
}