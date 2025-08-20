'use client';

import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, Heart, Eye, Truck, TrendingUp, DollarSign } from 'lucide-react';
import Image from 'next/image';
import { useLocalization } from '../app/contexts/LocalizationContext';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    currency?: string;
    image?: string;
    rating?: number;
    reviewCount?: number;
    category?: string;
    tags?: string[];
    discount?: number;
    isNew?: boolean;
    isHot?: boolean;
    isBestSeller?: boolean;
    // New fields for win margins and shipping
    alibabaPrice?: number;
    alibabaCurrency?: string;
    shippingWeight?: number;
    shippingDimensions?: string;
    profitMargin?: number;
    shippingCost?: number;
    totalPrice?: number;
    savings?: number;
    savingsPercentage?: number;
    isSale?: boolean;
    isLimited?: boolean;
    winMargin?: number;
  };
  variant?: 'default' | 'compact' | 'featured';
  onAddToCart?: (productId: string) => void;
  onViewDetails?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  className?: string;
  showPricingBreakdown?: boolean;
}

export default function ProductCard({
  product,
  variant = 'default',
  onAddToCart,
  onViewDetails,
  onAddToWishlist,
  className = '',
  showPricingBreakdown = false
}: ProductCardProps) {
  const { formatPrice, currentCurrency } = useLocalization();
  const [showBreakdown, setShowBreakdown] = useState(false);

  const getBadgeColor = () => {
    if (product.isNew) return 'bg-blue-500';
    if (product.isHot) return 'bg-red-500';
    if (product.isSale) return 'bg-purple-500';
    if (product.isLimited) return 'bg-amber-500';
    return null;
  }

  const getBadgeText = () => {
    if (product.isNew) return 'New';
    if (product.isHot) return 'Hot';
    if (product.isBestSeller) return 'Best';
    if (product.discount) return `-${product.discount}%`;
    return '';
  };

  const getCategoryColor = () => {
    switch (product.category?.toLowerCase()) {
      case 'electronics':
        return 'from-blue-500 to-purple-600';
      case 'toys':
        return 'from-purple-500 to-pink-600';
      case 'cosmetics':
        return 'from-pink-500 to-rose-600';
      case 'clothing':
        return 'from-indigo-500 to-blue-600';
      case 'home':
        return 'from-emerald-500 to-teal-600';
      case 'sports':
        return 'from-orange-500 to-red-600';
      default:
        return 'from-blue-500 to-purple-600';
    }
  }

  const getWinMarginColor = () => {
    const margin = product.winMargin || 0;
    if (margin >= 30) return 'text-blue-600';
    if (margin >= 20) return 'text-purple-600';
    if (margin >= 10) return 'text-amber-600';
    return 'text-gray-600';
  }

  const getWinMarginBgColor = () => {
    const margin = product.winMargin || 0;
    if (margin >= 30) return 'bg-blue-100 text-blue-800';
    if (margin >= 20) return 'bg-purple-100 text-purple-800';
    if (margin >= 10) return 'bg-amber-100 text-amber-800';
    return 'bg-gray-100 text-gray-800';
  }

  const renderPricingBreakdown = () => {
    if (!showPricingBreakdown || !product.alibabaPrice) return null;

    return (
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Pricing Breakdown</span>
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {showBreakdown ? 'Hide' : 'Show'} Details
          </button>
        </div>

        {showBreakdown && (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Alibaba Price:</span>
              <span className="font-medium">
                {formatPrice(product.alibabaPrice, product.alibabaCurrency || 'USD')}
              </span>
            </div>

            {product.profitMargin && (
              <div className="flex justify-between">
                <span className="text-gray-600">Win Margin:</span>
                <span className={`font-medium ${getWinMarginColor()}`}>
                  +{product.profitMargin}%
                </span>
              </div>
            )}

            {product.shippingCost && (
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">
                  {formatPrice(product.shippingCost, product.currency)}
                </span>
              </div>
            )}

            {product.savings && product.savings > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">You Save:</span>
                <span className="font-medium text-green-600">
                  {formatPrice(product.savings, product.currency)} ({product.savingsPercentage}%)
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderWinMarginBadge = () => {
    if (!product.profitMargin) return null;

    return (
      <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold ${getWinMarginBgColor()}`}>
        <TrendingUp className="w-3 h-3 inline mr-1" />
        +{product.profitMargin}%
      </div>
    );
  };

  const renderShippingInfo = () => {
    if (!product.shippingCost) return null;

    return (
      <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
        <Truck className="w-3 h-3" />
        <span>Shipping: {formatPrice(product.shippingCost, product.currency)}</span>
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div className={`group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${className}`}>
        <div className="relative">
          <div className={`w-full h-32 bg-gradient-to-br ${getCategoryColor()} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
            {product.image ? (
              <Image src={product.image} alt={product.name} className="w-full h-full object-cover" width={200} height={128} />
            ) : (
              <span className="text-2xl">📦</span>
            )}
          </div>
          {getBadgeColor() && (
            <div className={`absolute top-2 right-2 ${getBadgeColor()} text-white px-2 py-1 rounded-full text-xs font-bold`}>
              {getBadgeText()}
            </div>
          )}
          {/* Win Margin Badge */}
          {product.profitMargin && (
            <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold ${getWinMarginBgColor()} animate-slide-up`}>
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +{product.profitMargin}%
            </div>
          )}

          {/* Pricing Breakdown */}
          {renderPricingBreakdown() && (
            <div className="mb-4 p-2 bg-blue-50 rounded-lg hover-scale">
              <div className="flex items-center gap-2 text-blue-700">
                <span>💰</span>
                <span className="text-sm font-medium">
                  Win Margin: +{product.profitMargin}%
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="p-4">
          <h4 className="font-medium text-gray-900 mb-2 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h4>
          {renderShippingInfo()}
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(product.totalPrice || product.price, product.currency)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice, product.currency)}
              </span>
            )}
          </div>
          <button
            onClick={() => onAddToCart?.(product.id)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Add to Cart
          </button>
          {renderPricingBreakdown()}
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden ${className}`}>
        <div className="relative">
          <div className={`w-full h-48 bg-gradient-to-br ${getCategoryColor()} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
            {product.image ? (
              <Image src={product.image} alt={product.name} className="w-full h-full object-cover" width={300} height={192} />
            ) : (
              <span className="text-4xl">📦</span>
            )}
          </div>
          {getBadgeColor() && (
            <div className={`absolute top-3 right-3 ${getBadgeColor()} text-white px-2 py-1 rounded-full text-xs font-bold`}>
              {getBadgeText()}
            </div>
          )}
          {renderWinMarginBadge()}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
            {product.category}
          </div>
        </div>
        <div className="p-6">
          <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
            {product.name}
          </h4>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {product.description}
          </p>

          {renderShippingInfo()}

          {product.rating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating!) ? 'fill-current' : ''}`} />
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-bold text-blue-600">
              {formatPrice(product.totalPrice || product.price, product.currency)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice, product.currency)}
              </span>
            )}
          </div>

          {product.savings && product.savings > 0 && (
            <div className="mb-4 p-2 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Save {formatPrice(product.savings, product.currency)} ({product.savingsPercentage}%)
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => onAddToCart?.(product.id)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Add to Cart
            </button>
            <button
              onClick={() => onViewDetails?.(product.id)}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onAddToWishlist?.(product.id)}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              title="Add to Wishlist"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>

          {renderPricingBreakdown()}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${className}`}>
      <div className="relative">
        <div className={`w-full h-40 bg-gradient-to-br ${getCategoryColor()} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
          {product.image ? (
            <Image src={product.image} alt={product.name} className="w-full h-full object-cover" width={250} height={160} />
          ) : (
            <span className="text-3xl">📦</span>
          )}
        </div>
        {getBadgeColor() && (
          <div className={`absolute top-2 right-2 ${getBadgeColor()} text-white px-2 py-1 rounded-full text-xs font-bold`}>
            {getBadgeText()}
          </div>
        )}
        {renderWinMarginBadge()}
      </div>
      <div className="p-4">
        <h4 className="font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
          {product.name}
        </h4>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {renderShippingInfo()}

        {product.rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating!) ? 'fill-current' : ''}`} />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(product.totalPrice || product.price, product.currency)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice, product.currency)}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onAddToCart?.(product.id)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            <ShoppingCart className="w-4 h-4 inline mr-1" />
            Add to Cart
          </button>
          <button
            onClick={() => onViewDetails?.(product.id)}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {renderPricingBreakdown()}
      </div>
    </div>
  );
}