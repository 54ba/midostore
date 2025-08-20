'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ShoppingBag, Home, Zap, Heart, BookOpen, Dumbbell, Sparkles } from 'lucide-react'

interface Category {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  productCount: number
  image?: string
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
      image: '/api/placeholder/300/200'
    },
    {
      id: 'home',
      name: 'Home & Garden',
      description: 'Everything for your perfect home',
      icon: Home,
      color: 'from-green-500 to-emerald-600',
      productCount: 89,
      image: '/api/placeholder/300/200'
    },
    {
      id: 'fashion',
      name: 'Fashion & Style',
      description: 'Trendy clothing and accessories',
      icon: Heart,
      color: 'from-pink-500 to-rose-600',
      productCount: 234,
      image: '/api/placeholder/300/200'
    },
    {
      id: 'sports',
      name: 'Sports & Outdoors',
      description: 'Equipment for active lifestyles',
      icon: Dumbbell,
      color: 'from-orange-500 to-red-600',
      productCount: 67,
      image: '/api/placeholder/300/200'
    },
    {
      id: 'beauty',
      name: 'Beauty & Health',
      description: 'Personal care and wellness',
      icon: Sparkles,
      color: 'from-purple-500 to-indigo-600',
      productCount: 123,
      image: '/api/placeholder/300/200'
    },
    {
      id: 'books',
      name: 'Books & Media',
      description: 'Knowledge and entertainment',
      icon: BookOpen,
      color: 'from-yellow-500 to-amber-600',
      productCount: 45,
      image: '/api/placeholder/300/200'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {/* Background Image */}
              <div className="relative h-48 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90`} />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

                {/* Category Icon */}
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Product Count Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                    {category.productCount} products
                  </span>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Explore category
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200`}>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude' }} />
            </Link>
          ))}
        </div>

        {/* View All Categories CTA */}
        <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-500/90 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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