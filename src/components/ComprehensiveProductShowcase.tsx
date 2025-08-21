"use client";

import React, { useState, useEffect } from 'react';
import {
    ShoppingCart,
    Heart,
    Star,
    Eye,
    Zap,
    Crown,
    TrendingUp,
    Filter,
    Search,
    Grid3X3,
    List,
    ChevronDown,
    ChevronUp,
    Package,
    Truck,
    Clock,
    Target,
    BarChart3,
    Flame
} from 'lucide-react';

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    currency: string;
    images: string[];
    rating: number;
    reviewCount: number;
    soldCount: number;
    category: string;
    subcategory?: string;
    tags: string[];
    supplier: {
        name: string;
        verified: boolean;
        goldMember: boolean;
        rating: number;
        location: string;
    };
    stock: number;
    minOrderQuantity: number;
    maxOrderQuantity: number;
    shippingWeight?: number;
    shippingDimensions?: string;
    isFeatured: boolean;
    isHotDeal: boolean;
    isNew: boolean;
    isLimitedTime: boolean;
    discount?: number;
    timeRemaining?: string;
    variants?: Array<{
        id: string;
        name: string;
        value: string;
        price: number;
        stock: number;
    }>;
    specifications?: Record<string, string>;
    warranty?: string;
    returnPolicy?: string;
}

interface ComprehensiveProductShowcaseProps {
    className?: string;
    title?: string;
    subtitle?: string;
    showFilters?: boolean;
    showAnalytics?: boolean;
}

export default function ComprehensiveProductShowcase({
    className = "",
    title = "Comprehensive Product Catalog",
    subtitle = "Explore our complete collection of premium products from verified Alibaba suppliers",
    showFilters = true,
    showAnalytics = true
}: ComprehensiveProductShowcaseProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<string>('featured');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([0, 1000]);
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);

    // Mock data for demonstration
    useEffect(() => {
        const mockProducts: Product[] = [
            {
                id: 'prod-1',
                title: 'Wireless Noise-Canceling Headphones Pro',
                description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for professionals and audiophiles.',
                price: 89.99,
                originalPrice: 149.99,
                currency: 'USD',
                images: [
                    '/api/placeholder/400/400?text=Headphones+1',
                    '/api/placeholder/400/400?text=Headphones+2',
                    '/api/placeholder/400/400?text=Headphones+3'
                ],
                rating: 4.8,
                reviewCount: 1247,
                soldCount: 8500,
                category: 'Electronics',
                subcategory: 'Audio',
                tags: ['wireless', 'noise-canceling', 'bluetooth', 'premium', 'professional'],
                supplier: {
                    name: 'TechSupplier Co.',
                    verified: true,
                    goldMember: true,
                    rating: 4.9,
                    location: 'Shenzhen, China'
                },
                stock: 150,
                minOrderQuantity: 1,
                maxOrderQuantity: 100,
                shippingWeight: 0.5,
                shippingDimensions: '20x15x8 cm',
                isFeatured: true,
                isHotDeal: true,
                isNew: false,
                isLimitedTime: true,
                discount: 40,
                timeRemaining: '2 days 14 hours',
                variants: [
                    { id: 'var-1', name: 'Color', value: 'Black', price: 89.99, stock: 80 },
                    { id: 'var-2', name: 'Color', value: 'White', price: 89.99, stock: 45 },
                    { id: 'var-3', name: 'Color', value: 'Blue', price: 94.99, stock: 25 }
                ],
                specifications: {
                    'Battery Life': '30 hours',
                    'Bluetooth Version': '5.0',
                    'Noise Cancellation': 'Active',
                    'Driver Size': '40mm',
                    'Frequency Response': '20Hz-20kHz'
                },
                warranty: '2 years',
                returnPolicy: '30 days money back guarantee'
            },
            {
                id: 'prod-2',
                title: 'Smart Fitness Watch with Health Monitoring',
                description: 'Advanced fitness tracking with heart rate monitor, GPS, sleep tracking, and 7-day battery life. Comprehensive health insights and workout analysis.',
                price: 199.99,
                originalPrice: 299.99,
                currency: 'USD',
                images: [
                    '/api/placeholder/400/400?text=SmartWatch+1',
                    '/api/placeholder/400/400?text=SmartWatch+2'
                ],
                rating: 4.6,
                reviewCount: 892,
                soldCount: 4200,
                category: 'Electronics',
                subcategory: 'Wearables',
                tags: ['fitness', 'health', 'smartwatch', 'gps', 'heart-rate'],
                supplier: {
                    name: 'FitnessGear Ltd.',
                    verified: true,
                    goldMember: true,
                    rating: 4.7,
                    location: 'Guangzhou, China'
                },
                stock: 75,
                minOrderQuantity: 1,
                maxOrderQuantity: 50,
                shippingWeight: 0.3,
                shippingDimensions: '15x12x2 cm',
                isFeatured: true,
                isHotDeal: true,
                isNew: false,
                isLimitedTime: true,
                discount: 33,
                timeRemaining: '1 day 8 hours',
                variants: [
                    { id: 'var-4', name: 'Size', value: '42mm', price: 199.99, stock: 40 },
                    { id: 'var-5', name: 'Size', value: '46mm', price: 209.99, stock: 35 }
                ],
                specifications: {
                    'Display': 'AMOLED 1.4"',
                    'Battery Life': '7 days',
                    'Water Resistance': '5ATM',
                    'GPS': 'Built-in',
                    'Heart Rate Monitor': '24/7'
                },
                warranty: '1 year',
                returnPolicy: '14 days return policy'
            },
            {
                id: 'prod-3',
                title: 'Organic Anti-Aging Face Cream Set',
                description: 'Natural anti-aging face cream with organic ingredients, vitamin C, and hyaluronic acid for youthful, radiant skin. Dermatologist tested and cruelty-free.',
                price: 29.99,
                originalPrice: 59.99,
                currency: 'USD',
                images: [
                    '/api/placeholder/400/400?text=FaceCream+1',
                    '/api/placeholder/400/400?text=FaceCream+2'
                ],
                rating: 4.9,
                reviewCount: 2156,
                soldCount: 12800,
                category: 'Beauty & Health',
                subcategory: 'Skincare',
                tags: ['organic', 'anti-aging', 'vitamin-c', 'hyaluronic-acid', 'natural'],
                supplier: {
                    name: 'BeautyNatural Inc.',
                    verified: true,
                    goldMember: true,
                    rating: 4.8,
                    location: 'Shanghai, China'
                },
                stock: 300,
                minOrderQuantity: 1,
                maxOrderQuantity: 200,
                shippingWeight: 0.2,
                shippingDimensions: '8x6x4 cm',
                isFeatured: true,
                isHotDeal: true,
                isNew: false,
                isLimitedTime: false,
                discount: 50,
                variants: [
                    { id: 'var-6', name: 'Size', value: '30ml', price: 29.99, stock: 150 },
                    { id: 'var-7', name: 'Size', value: '50ml', price: 44.99, stock: 100 },
                    { id: 'var-8', name: 'Size', value: '100ml', price: 79.99, stock: 50 }
                ],
                specifications: {
                    'Volume': '30ml/50ml/100ml',
                    'Ingredients': 'Organic, Natural',
                    'Skin Type': 'All types',
                    'Fragrance': 'Unscented',
                    'Cruelty-Free': 'Yes'
                },
                warranty: '1 year',
                returnPolicy: '60 days satisfaction guarantee'
            },
            {
                id: 'prod-4',
                title: 'Educational STEM Building Blocks Kit',
                description: 'STEM learning blocks for children aged 6-12, promoting creativity, problem-solving, and engineering skills. Educational and fun for the whole family.',
                price: 45.99,
                originalPrice: 79.99,
                currency: 'USD',
                images: [
                    '/api/placeholder/400/400?text=BuildingBlocks+1',
                    '/api/placeholder/400/400?text=BuildingBlocks+2'
                ],
                rating: 4.7,
                reviewCount: 678,
                soldCount: 3200,
                category: 'Toys & Games',
                subcategory: 'Educational',
                tags: ['stem', 'educational', 'building', 'creative', 'learning'],
                supplier: {
                    name: 'EduToys Corp.',
                    verified: true,
                    goldMember: false,
                    rating: 4.5,
                    location: 'Dongguan, China'
                },
                stock: 200,
                minOrderQuantity: 1,
                maxOrderQuantity: 100,
                shippingWeight: 1.2,
                shippingDimensions: '25x20x15 cm',
                isFeatured: true,
                isHotDeal: false,
                isNew: true,
                isLimitedTime: false,
                discount: 42,
                variants: [
                    { id: 'var-9', name: 'Age Group', value: '6-8 years', price: 39.99, stock: 80 },
                    { id: 'var-10', name: 'Age Group', value: '8-10 years', price: 45.99, stock: 70 },
                    { id: 'var-11', name: 'Age Group', value: '10-12 years', price: 49.99, stock: 50 }
                ],
                specifications: {
                    'Age Range': '6-12 years',
                    'Pieces': '150+',
                    'Material': 'ABS Plastic',
                    'Safety': 'CE Certified',
                    'Instructions': 'Included'
                },
                warranty: '1 year',
                returnPolicy: '30 days return policy'
            }
        ];

        setTimeout(() => {
            setProducts(mockProducts);
            setLoading(false);
        }, 1000);
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesPrice = product.price >= selectedPriceRange[0] && product.price <= selectedPriceRange[1];
        const matchesRating = product.rating >= selectedRating;
        const matchesSearch = searchQuery === '' ||
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesPrice && matchesRating && matchesSearch;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            case 'popular':
                return b.soldCount - a.soldCount;
            case 'newest':
                return b.isNew ? 1 : -1;
            default:
                return b.isFeatured ? 1 : -1;
        }
    });

    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const currentProducts = sortedProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) {
        return (
            <div className={`animate-pulse ${className}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-gray-200 rounded-2xl h-80"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-8 ${className}`}>
            {/* Header */}
            <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
            </div>

            {/* Filters and Controls */}
            {showFilters && (
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <Grid3X3 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex items-center space-x-4">
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
                                <option value="newest">Newest</option>
                            </select>

                            <button
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                <span>Filters</span>
                                {showAdvancedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products, categories, or tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Advanced Filters */}
                    {showAdvancedFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="beauty & health">Beauty & Health</option>
                                    <option value="toys & games">Toys & Games</option>
                                    <option value="home & garden">Home & Garden</option>
                                    <option value="fashion">Fashion</option>
                                    <option value="sports & outdoor">Sports & Outdoor</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={selectedPriceRange[0]}
                                        onChange={(e) => setSelectedPriceRange([parseInt(e.target.value) || 0, selectedPriceRange[1]])}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <span className="text-gray-500">-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={selectedPriceRange[1]}
                                        onChange={(e) => setSelectedPriceRange([selectedPriceRange[0], parseInt(e.target.value) || 1000])}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                                <select
                                    value={selectedRating}
                                    onChange={(e) => setSelectedRating(parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value={0}>Any Rating</option>
                                    <option value={4}>4+ Stars</option>
                                    <option value={4.5}>4.5+ Stars</option>
                                    <option value={5}>5 Stars</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        <span className="text-sm">In Stock</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        <span className="text-sm">Hot Deals</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        <span className="text-sm">New Arrivals</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Products Grid/List */}
            <div className={`grid gap-8 ${viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
                }`}>
                {currentProducts.map((product) => (
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
                                {product.isHotDeal && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-red-500">
                                        <Flame className="w-3 h-3 mr-1" />
                                        Hot Deal
                                    </span>
                                )}
                                {product.isNew && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500">
                                        <Zap className="w-3 h-3 mr-1" />
                                        New
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

                            {/* Stock Status */}
                            <div className="absolute bottom-4 left-4 z-10">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white ${product.stock > 50 ? 'bg-green-500' :
                                    product.stock > 10 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}>
                                    <Package className="w-3 h-3 mr-1" />
                                    {product.stock > 50 ? 'In Stock' :
                                        product.stock > 10 ? 'Low Stock' : 'Limited Stock'}
                                </span>
                            </div>
                        </div>

                        {/* Product Content */}
                        <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                            {/* Category and Supplier */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-sm text-blue-600 font-medium capitalize">
                                    {product.category}
                                </span>
                                {product.subcategory && (
                                    <span className="text-sm text-gray-500">
                                        • {product.subcategory}
                                    </span>
                                )}
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
                                            className={`w-4 h-4 ${i < Math.floor(product.rating)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600 ml-2">
                                    ({product.reviewCount.toLocaleString()})
                                </span>
                                <span className="text-sm text-gray-500 ml-2">
                                    {product.soldCount.toLocaleString()} sold
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

                                {product.isLimitedTime && product.timeRemaining && (
                                    <div className="text-right">
                                        <div className="flex items-center space-x-1 text-sm text-red-600">
                                            <Clock className="w-4 h-4" />
                                            <span>{product.timeRemaining}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Supplier Info */}
                            <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700">{product.supplier.name}</span>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <div className="flex items-center space-x-1">
                                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                <span className="text-gray-600">{product.supplier.rating}</span>
                                            </div>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-gray-600">{product.supplier.location}</span>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-xs text-gray-500">Min Order</div>
                                        <div className="font-medium text-gray-700">{product.minOrderQuantity}</div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105">
                                <ShoppingCart className="w-4 h-4 mr-2 inline" />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                        Previous
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-4 py-2 rounded-lg transition-colors ${currentPage === i + 1
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Results Summary */}
            <div className="text-center text-gray-600">
                Showing {currentProducts.length} of {filteredProducts.length} products
                {searchQuery && ` matching "${searchQuery}"`}
                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            </div>
        </div>
    );
}