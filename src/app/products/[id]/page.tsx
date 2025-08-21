'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Star, ShoppingCart, Heart, ArrowLeft } from 'lucide-react'

interface Product {
  product_id: string
  alibaba_url: string
  product_name: string
  category: string
  price: number
  alibaba_price: number
  image_url?: string
  description?: string
  rating?: number
  reviewCount?: number
  soldCount?: number
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addToCartMessage, setAddToCartMessage] = useState<string | null>(null)

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (response.status === 401) {
        // For demo purposes, create a mock product
        setProduct({
          product_id: id as string,
          alibaba_url: 'https://example.com',
          product_name: 'Demo Product',
          category: 'Electronics',
          price: 29.99,
          alibaba_price: 25.99,
          image_url: '/api/placeholder/400/400?text=Product',
          description: 'This is a demo product for testing purposes.',
          rating: 4.5,
          reviewCount: 123,
          soldCount: 456
        })
        setLoading(false)
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }

      const result = await response.json()
      if (result.success && result.data) {
        setProduct(result.data)
      } else {
        throw new Error('Product not found')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      setError(error instanceof Error ? error.message : 'Failed to load product')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id, fetchProduct])

  const handleAddToCart = async () => {
    if (!product) return

    setAddingToCart(true)
    setAddToCartMessage(null)

    try {
      // Simulate add to cart for demo
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAddToCartMessage('Product added to cart successfully!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      setAddToCartMessage('Failed to add product to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading product...</span>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </button>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="aspect-w-1 aspect-h-1">
              <img
                src={product.image_url || '/api/placeholder/500/500?text=Product'}
                alt={product.product_name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.product_name}
              </h1>

              <div className="flex items-center mb-4">
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating!)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-green-600">
                    ${product.price}
                  </span>
                  {product.alibaba_price !== product.price && (
                    <span className="text-lg text-gray-500 line-through">
                      ${product.alibaba_price}
                    </span>
                  )}
                </div>
                {product.soldCount && (
                  <p className="text-sm text-gray-600 mt-2">
                    {product.soldCount} sold
                  </p>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Add to Cart Message */}
              {addToCartMessage && (
                <div className={`p-3 rounded-lg mb-4 ${
                  addToCartMessage.includes('success')
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {addToCartMessage}
                </div>
              )}

              {/* Additional Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product ID:</span>
                    <span className="font-medium">{product.product_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  {product.rating && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-medium">{product.rating}/5</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}