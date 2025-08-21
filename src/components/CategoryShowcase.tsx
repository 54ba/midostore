"use client";

import React, { useState } from 'react';
import { ArrowRight, TrendingUp, Star, Zap, Crown, Gift, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  productCount: number;
  featuredCount: number;
  gradient: string;
  isFeatured: boolean;
  isTrending?: boolean;
  isNew?: boolean;
}

interface CategoryShowcaseProps {
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  className?: string;
}

export default function CategoryShowcase({
  title = "Shop by Category",
  subtitle = "Discover products across all categories with exclusive deals",
  showViewAll = true,
  className = ""
}: CategoryShowcaseProps) {
  const router = useRouter();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const categories: Category[] = [
    {
      id: 'electronics',
      name: 'Electronics',
      icon: '📱',
      description: 'Latest gadgets, smartphones, laptops, and smart home devices',
      productCount: 1247,
      featuredCount: 89,
      gradient: 'from-blue-500 via-blue-600 to-cyan-500',
      isFeatured: true,
      isTrending: true
    },
    {
      id: 'toys-games',
      name: 'Toys & Games',
      icon: '🎮',
      description: 'Educational toys, board games, and entertainment for all ages',
      productCount: 892,
      featuredCount: 67,
      gradient: 'from-purple-500 via-purple-600 to-pink-500',
      isFeatured: true,
      isNew: true
    },
    {
      id: 'beauty-health',
      name: 'Beauty & Health',
      icon: '💄',
      description: 'Skincare, makeup, wellness products, and personal care',
      productCount: 1567,
      featuredCount: 123,
      gradient: 'from-rose-500 via-pink-500 to-red-500',
      isFeatured: true,
      isTrending: true
    },
    {
      id: 'home-garden',
      name: 'Home & Garden',
      icon: '🏠',
      description: 'Furniture, decor, gardening tools, and home improvement',
      productCount: 743,
      featuredCount: 45,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      isFeatured: false
    },
    {
      id: 'fashion-accessories',
      name: 'Fashion & Accessories',
      icon: '👗',
      description: 'Clothing, shoes, bags, jewelry, and fashion accessories',
      productCount: 2341,
      featuredCount: 156,
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      isFeatured: false,
      isTrending: true
    },
    {
      id: 'sports-outdoor',
      name: 'Sports & Outdoor',
      icon: '⚽',
      description: 'Sports equipment, outdoor gear, fitness, and adventure',
      productCount: 567,
      featuredCount: 34,
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      isFeatured: false
    },
    {
      id: 'automotive',
      name: 'Automotive',
      icon: '🚗',
      description: 'Car accessories, tools, maintenance, and automotive care',
      productCount: 423,
      featuredCount: 28,
      gradient: 'from-gray-500 via-gray-600 to-gray-700',
      isFeatured: false
    },
    {
      id: 'books-media',
      name: 'Books & Media',
      icon: '📚',
      description: 'Books, magazines, digital content, and educational materials',
      productCount: 678,
      featuredCount: 52,
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      isFeatured: false
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/products?category=${categoryId}`);
  };

  const getCategoryBadge = (category: Category) => {
    if (category.isNew) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500">
          <Sparkles className="w-3 h-3 mr-1" />
          New
        </span>
      );
    }
    if (category.isTrending) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-red-500">
          <TrendingUp className="w-3 h-3 mr-1" />
          Trending
        </span>
      );
    }
    if (category.isFeatured) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500">
          <Crown className="w-3 h-3 mr-1" />
          Featured
        </span>
      );
    }
    return null;
  };

  return (
    <section className={`py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 mb-4">
            <Gift className="w-4 h-4 mr-2" />
            <span className="font-semibold">Shop by Category</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 transform hover:scale-105 hover:rotate-1 ${category.isFeatured ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              onClick={() => handleCategoryClick(category.id)}
            >
              {/* Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-90 group-hover:opacity-100 transition-all duration-500`} />

              {/* Pattern Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Content */}
              <div className="relative p-6 text-white h-full flex flex-col justify-between">
                {/* Top Section */}
                <div>
                  {/* Badge */}
                  {getCategoryBadge(category) && (
                    <div className="mb-4">
                      {getCategoryBadge(category)}
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`text-6xl mb-4 transform transition-transform duration-500 ${hoveredCategory === category.id ? 'scale-110 rotate-12' : ''}`}>
                    {category.icon}
                  </div>

                  {/* Title */}
                  <h3 className={`font-bold mb-3 transition-all duration-300 ${category.isFeatured ? 'text-3xl' : 'text-2xl'}`}>
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className={`text-white/90 leading-relaxed transition-all duration-300 ${category.isFeatured ? 'text-lg' : 'text-sm'}`}>
                    {category.description}
                  </p>
                </div>

                {/* Bottom Section */}
                <div className="mt-6">
                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                      <div className={`font-bold ${category.isFeatured ? 'text-2xl' : 'text-lg'}`}>
                        {category.productCount.toLocaleString()}
                      </div>
                      <div className="text-white/80 text-sm">Products</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-bold ${category.isFeatured ? 'text-2xl' : 'text-lg'}`}>
                        {category.featuredCount}
                      </div>
                      <div className="text-white/80 text-sm">Featured</div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white/90">
                      Explore Category
                    </span>
                    <div className={`transform transition-transform duration-300 ${hoveredCategory === category.id ? 'translate-x-2' : ''}`}>
                      <ArrowRight className="w-5 h-5 text-white/90" />
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className={`absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Categories Button */}
        {showViewAll && (
          <div className="text-center">
            <button
                              onClick={() => router.push('/products')}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}

        {/* Category Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {categories.reduce((sum, cat) => sum + cat.productCount, 0).toLocaleString()}+
            </div>
            <div className="text-gray-600">Total Products Available</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {categories.filter(cat => cat.isFeatured).length}
            </div>
            <div className="text-gray-600">Featured Categories</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {categories.filter(cat => cat.isTrending).length}
            </div>
            <div className="text-gray-600">Trending Categories</div>
          </div>
        </div>
      </div>
    </section>
  );
}