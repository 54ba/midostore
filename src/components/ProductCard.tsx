'use client';

import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, Heart, Eye, Truck, TrendingUp, DollarSign } from 'lucide-react';
import Image from 'next/image';
import ImageGallery from './ImageGallery';
import { useLocalization } from '../app/contexts/LocalizationContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    currency?: string;
    image?: string;
    images?: string[]; // Array of product images
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
  onViewDetails?: (productId: string) => void;
  className?: string;
  showPricingBreakdown?: boolean;
}

export default function ProductCard({
  product,
  variant = 'default',
  onViewDetails,
  className = '',
  showPricingBreakdown = false
}: ProductCardProps) {
  const { formatPrice, currentCurrency } = useLocalization();
  const { addItem, isInCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const [showBreakdown, setShowBreakdown] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.name,
      price: product.totalPrice || product.price,
      image: product.image || product.images?.[0] || '',
      supplierId: undefined
    });
  };

  const handleToggleWishlist = () => {
    toggleItem({
      id: product.id,
      title: product.name,
      price: product.totalPrice || product.price,
      image: product.image || product.images?.[0] || '',
      supplierId: undefined
    });
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product.id);
    } else {
      // Default navigation to product details page
      window.location.href = `/products/${product.id}`;
    }
  };

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
  };

  const renderProductImage = () => {
    if (product.images && product.images.length > 0) {
      return (
        <ImageGallery
          images={product.images}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      );
    } else if (product.image) {
      return (
        <Image
          src={product.image}
          alt={product.name}
          width={160}
          height={160}
          className="w-full h-full object-cover"
        />
      );
    } else {
      return (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-sm">No Image</span>
        </div>
      );
    }
  };

  const renderWinMarginBadge = () => {
    if (product.winMargin && product.winMargin > 0) {
      return (
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-bold">
          <span className={getWinMarginColor()}>
            Win: {product.winMargin}%
          </span>
        </div>
      );
    }
    return null;
  };

  const renderShippingInfo = () => {
    if (product.shippingWeight || product.shippingDimensions) {
      return (
        <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
          <Truck className="w-3 h-3" />
          {product.shippingWeight && (
            <span>{product.shippingWeight}g</span>
          )}
          {product.shippingDimensions && (
            <span>• {product.shippingDimensions}</span>
          )}
        </div>
      );
    }
    return null;
  };

  const renderPricingBreakdown = () => {
    if (!showPricingBreakdown || !product.alibabaPrice) return null;

    return (
      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-gray-600">Alibaba Price:</span>
          <span className="font-medium">
            {formatPrice(product.alibabaPrice, product.alibabaCurrency)}
          </span>
        </div>
        {product.shippingCost && (
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-gray-600">Shipping:</span>
            <span className="font-medium">
              {formatPrice(product.shippingCost, product.currency)}
            </span>
          </div>
        )}
        {product.profitMargin && (
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-gray-600">Profit Margin:</span>
            <span className="font-medium text-green-600">
              {product.profitMargin}%
            </span>
          </div>
        )}
        {product.savings && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">You Save:</span>
            <span className="font-medium text-green-600">
              {formatPrice(product.savings, product.currency)} ({product.savingsPercentage}%)
            </span>
          </div>
        )}
      </div>
    );
  };

  // Featured variant
  if (variant === 'featured') {
    return (
      <div className={`group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden ${className}`}>
        <div className="relative">
          <div className={`w-full h-48 bg-gradient-to-br ${getCategoryColor()} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
            {renderProductImage()}
          </div>
          {getBadgeColor() && (
            <div className={`absolute top-3 right-3 ${getBadgeColor()} text-white px-3 py-1 rounded-full text-sm font-bold`}>
              {getBadgeText()}
            </div>
          )}
          {renderWinMarginBadge()}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">
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
              <span className="text-sm text-gray-500">({product.reviewCount || 0})</span>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-blue-600">
              {formatPrice(product.totalPrice || product.price, product.currency)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(product.originalPrice, product.currency)}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${isInCart(product.id)
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                }`}
            >
              {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
            </button>
            <button
              onClick={handleViewDetails}
              className="p-3 text-gray-600 hover:text-blue-600 transition-colors"
              title="View Details"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={handleToggleWishlist}
              className={`p-3 transition-colors ${isInWishlist(product.id)
                  ? 'text-red-600 hover:text-red-700'
                  : 'text-gray-600 hover:text-red-600'
                }`}
              title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
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
          {renderProductImage()}
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
            onClick={handleAddToCart}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${isInCart(product.id)
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              }`}
          >
            {isInCart(product.id) ? 'In Cart' : (
              <>
                <ShoppingCart className="w-4 h-4 inline mr-1" />
                Add to Cart
              </>
            )}
          </button>
          <button
            onClick={handleViewDetails}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleToggleWishlist}
            className={`p-2 transition-colors ${isInWishlist(product.id)
                ? 'text-red-600 hover:text-red-700'
                : 'text-gray-600 hover:text-red-600'
              }`}
            title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
          </button>
        </div>

        {renderPricingBreakdown()}
      </div>
    </div>
  );
}