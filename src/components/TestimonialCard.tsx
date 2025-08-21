"use client";

import React, { useState } from 'react';
import { Star, Quote, TrendingUp, Award, Crown, Heart, ShoppingBag, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ProductReview {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
  productOriginalPrice?: number;
  productCategory: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  reviewDate: Date;
  isVerified: boolean;
  isPremium: boolean;
  helpfulCount: number;
  unhelpfulCount: number;
  purchaseDate?: Date;
  productRating: number;
  productReviewCount: number;
  productSoldCount: number;
  productDiscount?: number;
  isHotDeal?: boolean;
  isLimitedTime?: boolean;
  timeRemaining?: string;
}

interface ProductReviewCardProps {
  review: ProductReview;
  className?: string;
  showProductDetails?: boolean;
  onHelpful?: (reviewId: string, isHelpful: boolean) => void;
}

export default function ProductReviewCard({
  review,
  className = "",
  showProductDetails = true,
  onHelpful
}: ProductReviewCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isHelpfulClicked, setIsHelpfulClicked] = useState<'helpful' | 'unhelpful' | null>(null);

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-500';
    if (rating >= 4.0) return 'text-blue-500';
    if (rating >= 3.5) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const getRatingIcon = (rating: number) => {
    if (rating >= 4.8) return <Crown className="w-4 h-4 text-yellow-500" />;
    if (rating >= 4.5) return <Award className="w-4 h-4 text-blue-500" />;
    if (rating >= 4.0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    return <Heart className="w-4 h-4 text-red-500" />;
  };

  const handleHelpful = (isHelpful: boolean) => {
    if (isHelpfulClicked === (isHelpful ? 'helpful' : 'unhelpful')) {
      // Toggle off if already clicked
      setIsHelpfulClicked(null);
    } else {
      // Set new state
      setIsHelpfulClicked(isHelpful ? 'helpful' : 'unhelpful');
    }

    if (onHelpful) {
      onHelpful(review.id, isHelpful);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

      {/* Product Information Section */}
      {showProductDetails && (
        <div className="relative mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
          <div className="flex items-start space-x-4">
            {/* Product Image */}
            <div className="relative">
              <img
                src={review.productImage}
                alt={review.productTitle}
                className="w-20 h-20 rounded-lg object-cover border-2 border-white shadow-md"
              />

              {/* Product Badges */}
              {review.isHotDeal && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center border-2 border-white">
                  <TrendingUp className="w-3 h-3 text-white" />
                </div>
              )}

              {review.isLimitedTime && (
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Eye className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                {review.productTitle}
              </h4>

              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(review.productRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    ({review.productReviewCount.toLocaleString()})
                  </span>
                </div>

                <span className="text-sm text-gray-500">
                  {review.productSoldCount.toLocaleString()} sold
                </span>
              </div>

              {/* Price Information */}
              <div className="flex items-center space-x-3">
                <span className="text-xl font-bold text-gray-900">
                  ${review.productPrice}
                </span>
                {review.productOriginalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ${review.productOriginalPrice}
                  </span>
                )}
                {review.productDiscount && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                    -{review.productDiscount}%
                  </span>
                )}
              </div>

              {/* Category and Time Remaining */}
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-blue-600 font-medium capitalize">
                  {review.productCategory}
                </span>
                {review.timeRemaining && (
                  <span className="text-sm text-red-600 font-medium">
                    ⏰ {review.timeRemaining}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Content */}
      <div className="relative mb-6">
        {/* Quote Icon */}
        <div className="absolute -top-2 left-0">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Quote className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Rating */}
        <div className="ml-10 mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(review.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm font-medium text-gray-600">
              {review.rating}
            </span>
          </div>

          {/* Rating Badge */}
          <div className="flex items-center space-x-1">
            {getRatingIcon(review.rating)}
            <span className="text-xs font-medium text-gray-500">
              {review.rating >= 4.8 ? 'Premium' :
               review.rating >= 4.5 ? 'Excellent' :
               review.rating >= 4.0 ? 'Great' : 'Good'}
            </span>
          </div>
        </div>

        {/* Review Comment */}
        <div className="ml-10">
          <p className="text-gray-700 leading-relaxed text-sm italic">
            "{review.comment}"
          </p>
        </div>
      </div>

      {/* User Info and Actions */}
      <div className="relative flex items-center justify-between">
        {/* User Info */}
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="relative">
            <img
              src={review.userAvatar}
              alt={review.userName}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
            />

            {/* Verification Badge */}
            {review.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            {/* Premium Badge */}
            {review.isPremium && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white">
                <Crown className="w-2 h-2 text-white" />
              </div>
            )}
          </div>

          {/* User Details */}
          <div>
            <div className="flex items-center space-x-2">
              <h5 className="font-semibold text-gray-900 text-sm">
                {review.userName}
              </h5>
              {review.isVerified && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Verified
                </span>
              )}
              {review.isPremium && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800">
                  👑 Premium
                </span>
              )}
            </div>

            <div className="text-xs text-gray-500">
              {formatDate(review.reviewDate)}
              {review.purchaseDate && (
                <span className="ml-2">• Purchased {formatDate(review.purchaseDate)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Helpful/Unhelpful Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleHelpful(true)}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
              isHelpfulClicked === 'helpful'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{review.helpfulCount + (isHelpfulClicked === 'helpful' ? 1 : 0)}</span>
          </button>

          <button
            onClick={() => handleHelpful(false)}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
              isHelpfulClicked === 'unhelpful'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            <span>{review.unhelpfulCount + (isHelpfulClicked === 'unhelpful' ? 1 : 0)}</span>
          </button>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

      {/* Corner Decoration */}
      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-2xl transform rotate-45 origin-top-right transition-transform duration-500 ${
        isHovered ? 'scale-150' : 'scale-100'
      }`}></div>
    </div>
  );
}