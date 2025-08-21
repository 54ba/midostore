'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ShoppingBag, Home, Zap, Heart, BookOpen, Dumbbell, Sparkles } from 'lucide-react'
import ImageGallery from './ImageGallery'

interface Category {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  productCount: number
  images: string[]
  featuredImage: string
}

interface CategoryShowcaseProps {
  className?: string
}

export default function CategoryShowcase({ className = '' }: CategoryShowcaseProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  const categories: Category[] = [
    {
      id: 'electronics',
      name: 'Electronics',
      description: 'Latest gadgets and electronics',
      icon: Zap,
      color: 'from-blue-500 to-purple-600',
      productCount: 156,
      featuredImage: '/api/placeholder/400/300',
      images: [
        '/api/placeholder/400/300?text=Smartphones',
        '/api/placeholder/400/300?text=Laptops',
        '/api/placeholder/400/300?text=Headphones',
        '/api/placeholder/400/300?text=Smartwatches',
        '/api/placeholder/400/300?text=Tablets'
      ]
    },
    {
      id: 'home',
      name: 'Home & Garden',
      description: 'Everything for your perfect home',
      icon: Home,
      color: 'from-emerald-500 to-teal-600',
      productCount: 89,
      featuredImage: '/api/placeholder/400/300',
      images: [
        '/api/placeholder/400/300?text=Furniture',
        '/api/placeholder/400/300?text=Decor',
        '/api/placeholder/400/300?text=Kitchen',
        '/api/placeholder/400/300?text=Garden',
        '/api/placeholder/400/300?text=Lighting'
      ]
    },
    {
      id: 'fashion',
      name: 'Fashion & Style',
      description: 'Trendy clothing and accessories',
      icon: Heart,
      color: 'from-pink-500 to-rose-600',
      productCount: 234,
      featuredImage: '/api/placeholder/400/300',
      images: [
        '/api/placeholder/400/300?text=Clothing',
        '/api/placeholder/400/300?text=Shoes',
        '/api/placeholder/400/300?text=Bags',
        '/api/placeholder/400/300?text=Jewelry',
        '/api/placeholder/400/300?text=Accessories'
      ]
    },
    {
      id: 'sports',
      name: 'Sports & Outdoors',
      description: 'Equipment for active lifestyles',
      icon: Dumbbell,
      color: 'from-orange-500 to-red-600',
      productCount: 67,
      featuredImage: '/api/placeholder/400/300',
      images: [
        '/api/placeholder/400/300?text=Fitness',
        '/api/placeholder/400/300?text=Outdoor',
        '/api/placeholder/400/300?text=Team Sports',
        '/api/placeholder/400/300?text=Yoga',
        '/api/placeholder/400/300?text=Swimming'
      ]
    },
    {
      id: 'beauty',
      name: 'Beauty & Health',
      description: 'Personal care and wellness',
      icon: Sparkles,
      color: 'from-purple-500 to-indigo-600',
      productCount: 123,
      featuredImage: '/api/placeholder/400/300',
      images: [
        '/api/placeholder/400/300?text=Skincare',
        '/api/placeholder/400/300?text=Makeup',
        '/api/placeholder/400/300?text=Haircare',
        '/api/placeholder/400/300?text=Fragrances',
        '/api/placeholder/400/300?text=Wellness'
      ]
    },
    {
      id: 'books',
      name: 'Books & Media',
      description: 'Knowledge and entertainment',
      icon: BookOpen,
      color: 'from-amber-500 to-yellow-600',
      productCount: 45,
      featuredImage: '/api/placeholder/400/300',
      images: [
        '/api/placeholder/400/300?text=Books',
        '/api/placeholder/400/300?text=Magazines',
        '/api/placeholder/400/300?text=Digital Media',
        '/api/placeholder/400/300?text=Educational',
        '/api/placeholder/400/300?text=Entertainment'
      ]
    }
  ]

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover products organized by your interests. Each category is carefully curated to bring you the best selection.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {/* Image Gallery */}
              <div className="relative">
                <ImageGallery
                  images={category.images}
                  alt={category.name}
                  height="h-64"
                  showThumbnails={false}
                  showCounter={true}
                  showNavigation={true}
                  className="group-hover:scale-105 transition-transform duration-300"
                />

                {/* Category Icon */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Product Count Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                    {category.productCount} products
                  </span>
                </div>
              </div>

              {/* Category Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-500 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {category.description}
                </p>

                {/* CTA Button */}
                <Link
                  href={`/products?category=${category.id}`}
                  className="flex items-center justify-between w-full p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group-hover:bg-blue-50 group-hover:hover:bg-blue-100"
                >
                  <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                    Explore category
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200`}>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </Link>
              </div>

              {/* Hover Effect Border */}
              <div className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude' }} />
            </div>
          ))}
        </div>

        {/* View All Categories CTA */}
        <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}