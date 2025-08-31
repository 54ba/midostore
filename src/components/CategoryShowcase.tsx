"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCategories } from '@/hooks/useDatabaseData';
import { Category } from '@/lib/mongodb-service';

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

  // Use real data from database
  const { categories, loading, error } = useCategories();

  const handleCategoryClick = (categorySlug: string) => {
    router.push(`/products?category=${categorySlug}`);
  };

  if (loading) {
      return (
      <section className={`py-16 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
            <p className="text-lg text-gray-600">{subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      );
    }

  if (error) {
      return (
      <section className={`py-16 ${className}`}>
        <div className="container mx-auto px-4 text-center">
          <div className="text-red-600 mb-4">Error loading categories: {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </section>
      );
    }

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category._id?.toString()}
              className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                hoveredCategory === category._id?.toString() ? 'z-10' : ''
                }`}
              onMouseEnter={() => setHoveredCategory(category._id?.toString() || null)}
              onMouseLeave={() => setHoveredCategory(null)}
              onClick={() => handleCategoryClick(category.slug)}
            >
              {/* Category Card */}
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300">
                {/* Background Image */}
                <div className="relative h-48 w-full">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />

                  {/* Category Icon */}
                  <div className="absolute top-4 right-4 text-4xl opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    {getCategoryIcon(category.name)}
                  </div>
                </div>

              {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="mb-2">
                    <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                    {category.nameAr && (
                      <p className="text-sm opacity-90 font-arabic">{category.nameAr}</p>
                    )}
                  </div>

                  <p className="text-sm opacity-90 mb-3 line-clamp-2">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-75">
                      {category.productCount} products
                    </span>

                    {/* Badges */}
                    <div className="flex gap-2">
                      {category.isFeatured && (
                        <span className="px-2 py-1 bg-yellow-500 text-black text-xs rounded-full font-medium">
                          Featured
                        </span>
                      )}
                      {category.isTrending && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium">
                          Trending
                        </span>
                      )}
                      {category.isNew && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </div>

              {/* Subcategories on Hover */}
              {hoveredCategory === category._id?.toString() && category.subcategories.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-20">
                  <h4 className="font-semibold text-gray-900 mb-3">Subcategories</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {category.subcategories.slice(0, 6).map((subcategory, index) => (
                      <div
                        key={index}
                        className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200"
                      >
                        {subcategory}
                      </div>
                    ))}
                  </div>
                  {category.subcategories.length > 6 && (
                    <div className="text-xs text-gray-500 mt-2">
                      +{category.subcategories.length - 6} more
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {showViewAll && (
          <div className="text-center mt-12">
            <button
                              onClick={() => router.push('/products')}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View All Categories
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// Helper function to get category icons
function getCategoryIcon(categoryName: string): string {
  const iconMap: { [key: string]: string } = {
    'Electronics': '📱',
    'Fashion & Accessories': '👗',
    'Home & Garden': '🏠',
    'Beauty & Health': '💄',
    'Sports & Outdoor': '⚽',
    'Toys & Games': '🎮',
    'Automotive': '🚗',
    'Books & Media': '📚'
  };

  return iconMap[categoryName] || '🛍️';
}