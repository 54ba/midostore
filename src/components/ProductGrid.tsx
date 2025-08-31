"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Star,
    ShoppingCart,
    Grid3X3,
    List,
    Filter,
    TrendingUp,
    Search
} from 'lucide-react';
import ProductCard from './ProductCard';

interface Product {
    id: string;
    title: string;
    name?: string;
    description: string;
    price: number;
    originalPrice?: number;
    currency?: string;
    images?: string[];
    image?: string;
    rating?: number;
    reviewCount?: number;
    soldCount?: number;
    category?: string;
    supplier?: {
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
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock products if none provided
    const mockProducts: Product[] = [
        {
            id: 'prod-1',
            title: 'Wireless Noise-Canceling Headphones Pro',
            name: 'Wireless Noise-Canceling Headphones Pro',
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
            name: 'Smart Fitness Watch with Health Monitoring',
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
            name: 'Organic Anti-Aging Face Cream Set',
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
            name: 'Educational STEM Building Blocks Kit',
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
            name: 'Premium Wireless Earbuds with Case',
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
            isFeatured: true,
            discount: 42
        }
    ];

    // Use provided products or fall back to mock products
    const displayProducts = products.length > 0 ? products : mockProducts;

    // Filter products by category
    const filteredProducts = selectedCategory === 'all'
        ? displayProducts
        : displayProducts.filter(product => product.category === selectedCategory);

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return (b.rating || 0) - (a.rating || 0);
            case 'newest':
                return 0; // Mock data doesn't have dates
            default:
                return 0;
        }
    });

    // Search filter
    const searchFilteredProducts = searchQuery
        ? sortedProducts.filter(product =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : sortedProducts;

    const handleViewDetails = (productId: string) => {
        // Navigate to product details page
        window.location.href = `/products/${productId}`;
    };

    if (loading) {
        return (
            <div className={`py-12 ${className}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading products...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`py-12 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
                </div>

                {/* Filters and Controls */}
                {showFilters && (
                    <div className="mb-8 space-y-4">
                        {/* Search Bar */}
                        <div className="relative max-w-md mx-auto">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap justify-center gap-2">
                            <Button
                                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedCategory('all')}
                            >
                                All Categories
                            </Button>
                            {Array.from(new Set(displayProducts.map(p => p.category).filter(Boolean))).map(category => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category!)}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>

                        {/* Sort and View Controls */}
                        <div className="flex items-center justify-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="featured">Featured</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="newest">Newest</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">View:</span>
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                <div className={`grid gap-6 ${
                    viewMode === 'grid'
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        : 'grid-cols-1'
                }`}>
                    {searchFilteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={{
                                id: product.id,
                                name: product.name || product.title,
                                description: product.description,
                                price: product.price,
                                originalPrice: product.originalPrice,
                                currency: product.currency,
                                image: product.image,
                                images: product.images,
                                rating: product.rating,
                                reviewCount: product.reviewCount,
                                category: product.category,
                                tags: [],
                                discount: product.discount,
                                isNew: false,
                                isHot: product.isHot,
                                isBestSeller: false,
                                isSale: product.discount ? true : false,
                                isLimited: false
                            }}
                            variant={viewMode === 'list' ? 'featured' : 'default'}
                            onViewDetails={handleViewDetails}
                            className={viewMode === 'list' ? 'flex-row' : ''}
                        />
                    ))}
                </div>

                {/* Load More Button */}
                {searchFilteredProducts.length > 0 && (
                    <div className="text-center mt-12">
                        <Button
                            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
                        >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Load More Products
                        </Button>
                    </div>
                )}

                {/* No Results */}
                {searchFilteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600 mb-4">
                            Try adjusting your search criteria or browse all categories
                        </p>
                        <Button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('all');
                            }}
                            variant="outline"
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}