'use client'

import React, { useState } from 'react';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/app/contexts/CartContext';

interface Product {
    product_id: string;
    product_name: string;
    price: number;
    alibaba_price?: number;
    category?: string;
    image_url?: string;
    rating?: number;
    review_count?: number;
}

interface ProductGridProps {
    products: Product[];
    onAddToCart?: (productId: string, quantity: number) => void; // Keep for backward compatibility
    onProductClick?: (product: Product) => void;
    className?: string;
    loading?: boolean;
}

export default function ProductGrid({
    products,
    onAddToCart: legacyOnAddToCart,
    onProductClick,
    className = '',
    loading = false
}: ProductGridProps) {
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const { addToCart, isInCart } = useCart();

    const toggleFavorite = (productId: string) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(productId)) {
                newFavorites.delete(productId);
            } else {
                newFavorites.add(productId);
            }
            return newFavorites;
        });
    };

    const handleAddToCart = (product: Product, quantity: number = 1) => {
        // Use the new cart context
        addToCart({
            product_id: product.product_id,
            product_name: product.product_name,
            price: product.price,
            image_url: product.image_url,
            category: product.category,
            currency: 'USD'
        }, quantity);

        // Also call legacy callback if provided (for backward compatibility)
        if (legacyOnAddToCart) {
            legacyOnAddToCart(product.product_id, quantity);
        }
    };

    if (loading) {
        return (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                        <div className="aspect-square bg-gray-200"></div>
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-8 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
            {products.map((product) => (
                <div
                    key={product.product_id}
                    className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200 overflow-hidden"
                >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                        {product.image_url ? (
                            <Image
                                src={product.image_url}
                                alt={product.product_name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                width={300}
                                height={300}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ShoppingCart className="w-16 h-16" />
                            </div>
                        )}

                        {/* Quick Actions Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                                <button
                                    onClick={() => onProductClick?.(product)}
                                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                                    title="View Details"
                                >
                                    <Eye className="w-4 h-4 text-gray-700" />
                                </button>
                                <button
                                    onClick={() => toggleFavorite(product.product_id)}
                                    className={`p-2 rounded-full shadow-lg transition-colors ${favorites.has(product.product_id)
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    title="Add to Favorites"
                                >
                                    <Heart className={`w-4 h-4 ${favorites.has(product.product_id) ? 'fill-current' : ''}`} />
                                </button>
                            </div>
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 text-xs font-medium bg-blue-500 text-white rounded-full">
                                {product.category}
                            </span>
                        </div>

                        {/* Rating Badge */}
                        {product.rating && (
                            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white bg-opacity-90 rounded-full">
                                <Star className="w-3 h-3 text-amber-400 fill-current" />
                                <span className="text-xs font-medium text-gray-700">{product.rating}</span>
                            </div>
                        )}

                        {/* In Cart Badge */}
                        {isInCart(product.product_id) && (
                            <div className="absolute bottom-3 right-3">
                                <span className="px-2 py-1 text-xs font-medium bg-green-500 text-white rounded-full">
                                    In Cart
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors">
                            {product.product_name}
                        </h3>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg font-bold text-gray-900">${product.price}</span>
                            {product.alibaba_price && product.alibaba_price < product.price && (
                                <span className="text-sm text-gray-500 line-through">${product.alibaba_price}</span>
                            )}
                        </div>

                        {/* Savings */}
                        {product.alibaba_price && product.alibaba_price < product.price && (
                            <div className="mb-3">
                                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full animate-slide-up">
                                    Save ${((product.price - product.alibaba_price) / product.price * 100).toFixed(0)}%
                                </span>
                            </div>
                        )}

                        {/* Add to Cart Button */}
                        <button
                            onClick={() => handleAddToCart(product, 1)}
                            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${isInCart(product.product_id)
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                        >
                            <ShoppingCart className="w-4 h-4" />
                            {isInCart(product.product_id) ? 'Added to Cart' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}