"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Star, Eye, Zap, Crown, TrendingUp } from 'lucide-react';
import { useCart } from '@/app/contexts/CartContext';
import Button from './Button';

interface Product {
    id: string;
    title: string;
    description?: string;
    price: number;
    originalPrice?: number;
    currency: string;
    images: string[];
    rating?: number;
    reviewCount: number;
    soldCount: number;
    category?: string;
    supplier: {
        name: string;
        verified: boolean;
        goldMember: boolean;
    };
    isFeatured?: boolean;
    isHot?: boolean;
    discount?: number;
}

interface ProductGridProps {
    products?: Product[];
    loading?: boolean;
    title?: string;
    subtitle?: string;
    showFilters?: boolean;
    className?: string;
}

export default function ProductGrid({
    products = [],
    loading = false,
    title = "Featured Products",
    subtitle = "Discover amazing products at unbeatable prices",
    showFilters = true,
    className = ""
}: ProductGridProps) {
    const { addToCart, cartItems } = useCart();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Mock products if none provided
    const mockProducts: Product[] = [
        {
            id: 'prod-1',
            title: 'Wireless Noise-Canceling Headphones Pro',
            description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.',
            price: 89.99,
            originalPrice: 149.99,
            currency: 'USD',
            images: ['/api/placeholder/400/400?text=Headphones'],
            rating: 4.8,
            reviewCount: 1247,
            soldCount: 8500,
            category: 'electronics',
            supplier: { name: 'TechSupplier Co.', verified: true, goldMember: true },
            isFeatured: true,
            isHot: true,
            discount: 40
        },
        {
            id: 'prod-2',
            title: 'Smart Fitness Watch with Health Monitoring',
            description: 'Advanced fitness tracking with heart rate monitor, GPS, sleep tracking, and 7-day battery life.',
            price: 199.99,
            originalPrice: 299.99,
            currency: 'USD',
            images: ['/api/placeholder/400/400?text=SmartWatch'],
            rating: 4.6,
            reviewCount: 892,
            soldCount: 4200,
            category: 'electronics',
            supplier: { name: 'FitnessGear Ltd.', verified: true, goldMember: true },
            isFeatured: true,
            discount: 33
        },
        {
            id: 'prod-3',
            title: 'Organic Anti-Aging Face Cream Set',
            description: 'Natural anti-aging face cream with organic ingredients, vitamin C, and hyaluronic acid for youthful skin.',
            price: 29.99,
            originalPrice: 59.99,
            currency: 'USD',
            images: ['/api/placeholder/400/400?text=FaceCream'],
            rating: 4.9,
            reviewCount: 2156,
            soldCount: 12800,
            category: 'beauty',
            supplier: { name: 'BeautyNatural Inc.', verified: true, goldMember: true },
            isFeatured: true,
            isHot: true,
            discount: 50
        },
        {
            id: 'prod-4',
            title: 'Educational STEM Building Blocks Kit',
            description: 'STEM learning blocks for children aged 6-12, promoting creativity, problem-solving, and engineering skills.',
            price: 45.99,
            originalPrice: 79.99,
            currency: 'USD',
            images: ['/api/placeholder/400/400?text=BuildingBlocks'],
            rating: 4.7,
            reviewCount: 678,
            soldCount: 3200,
            category: 'toys',
            supplier: { name: 'EduToys Corp.', verified: true, goldMember: true },
            isFeatured: true,
            discount: 42
        },
        {
            id: 'prod-5',
            title: 'Premium Wireless Earbuds with Case',
            description: 'High-quality wireless earbuds with charging case, touch controls, and premium sound quality.',
            price: 69.99,
            originalPrice: 119.99,
            currency: 'USD',
            images: ['/api/placeholder/400/400?text=Earbuds'],
            rating: 4.5,
            reviewCount: 945,
            soldCount: 5600,
            category: 'electronics',
            supplier: { name: 'AudioTech Solutions', verified: true, goldMember: false },
            discount: 42
        },
        {
            id: 'prod-6',
            title: 'Natural Hair Care Bundle',
            description: 'Complete hair care set with shampoo, conditioner, and hair mask made from natural ingredients.',
            price: 34.99,
            originalPrice: 69.99,
            currency: 'USD',
            images: ['/api/placeholder/400/400?text=HairCare'],
            rating: 4.8,
            reviewCount: 1234,
            soldCount: 7800,
            category: 'beauty',
            supplier: { name: 'NaturalBeauty Co.', verified: true, goldMember: true },
            isFeatured: true,
            discount: 50
        }
    ];

    const displayProducts = products.length > 0 ? products : mockProducts;

    const handleAddToCart = (product: Product) => {
        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            currency: product.currency,
            image: product.images[0],
            quantity: 1
        });
    };

    const isInCart = (productId: string) => {
        return cartItems.some(item => item.id === productId);
    };

    if (loading) {
        return (
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 rounded-2xl h-64 mb-4"></div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`py-20 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
                </div>

                {/* Filters and Controls */}
                {showFilters && (
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
                        {/* Category Filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-gray-700 font-medium">Category:</span>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Categories</option>
                                <option value="electronics">Electronics</option>
                                <option value="beauty">Beauty & Health</option>
                                <option value="toys">Toys & Games</option>
                                <option value="home">Home & Garden</option>
                                <option value="fashion">Fashion</option>
                                <option value="sports">Sports & Outdoor</option>
                            </select>
                        </div>

                        {/* Sort Options */}
                        <div className="flex items-center gap-2">
                            <span className="text-gray-700 font-medium">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                                <option value="popular">Most Popular</option>
                            </select>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                <div className={`grid gap-8 ${viewMode === 'grid'
                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        : 'grid-cols-1'
                    }`}>
                    {displayProducts.map((product) => (
                        <div
                            key={product.id}
                            className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${viewMode === 'list' ? 'flex gap-6' : ''
                                }`}
                        >
                            {/* Product Image */}
                            <div className={`relative overflow-hidden rounded-t-2xl ${viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : ''
                                }`}>
                                <img
                                    src={product.images[0]}
                                    alt={product.title}
                                    className={`w-full object-cover transition-transform duration-300 group-hover:scale-110 ${viewMode === 'list' ? 'h-48' : 'h-64'
                                        }`}
                                />

                                {/* Badges */}
                                <div className="absolute top-4 left-4 z-10 space-y-2">
                                    {product.isHot && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-red-500">
                                            <Zap className="w-3 h-3 mr-1" />
                                            Hot Deal
                                        </span>
                                    )}
                                    {product.isFeatured && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500">
                                            <Crown className="w-3 h-3 mr-1" />
                                            Featured
                                        </span>
                                    )}
                                </div>

                                {/* Discount Badge */}
                                {product.discount && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-green-500">
                                            -{product.discount}%
                                        </span>
                                    </div>
                                )}

                                {/* Quick Actions */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="flex gap-2">
                                        <button className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                                            <Eye className="w-5 h-5 text-gray-700" />
                                        </button>
                                        <button className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                                            <Heart className="w-5 h-5 text-gray-700" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Product Content */}
                            <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                                {/* Category */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-sm text-blue-600 font-medium capitalize">
                                        {product.category}
                                    </span>
                                    {product.supplier.verified && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            ✓ Verified
                                        </span>
                                    )}
                                    {product.supplier.goldMember && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            👑 Gold
                                        </span>
                                    )}
                                </div>

                                {/* Title */}
                                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                                    {product.title}
                                </h3>

                                {/* Description */}
                                {viewMode === 'list' && (
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {product.description}
                                    </p>
                                )}

                                {/* Rating */}
                                <div className="flex items-center mb-3">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(product.rating || 0)
                                                        ? 'text-yellow-400 fill-current'
                                                        : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600 ml-2">
                                        ({product.reviewCount.toLocaleString()})
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-gray-900">
                                            ${product.price}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-lg text-gray-500 line-through">
                                                ${product.originalPrice}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {product.soldCount.toLocaleString()} sold
                                    </span>
                                </div>

                                {/* CTA Button */}
                                <Button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={isInCart(product.id)}
                                    className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${isInCart(product.id)
                                            ? 'bg-green-600 text-white cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                                        }`}
                                >
                                    {isInCart(product.id) ? (
                                        <>
                                            <span>✓ In Cart</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            Add to Cart
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                <div className="text-center mt-12">
                    <Button
                        className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
                    >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Load More Products
                    </Button>
                </div>
            </div>
        </div>
    );
}