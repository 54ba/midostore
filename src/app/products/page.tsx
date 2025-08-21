"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useLocationRecommendations } from '@/hooks/useLocationRecommendations';
import { Globe, DollarSign, Star, ShoppingCart, Eye } from 'lucide-react';
import envConfig from '../../../env.config';
import AIEnhancedSearch from '@/components/AIEnhancedSearch';
import ProductGrid from '@/components/ProductGrid';
import LocalizationPanel from '@/components/LocalizationPanel';
import { useLocalization } from '@/app/contexts/LocalizationContext';
import { useRouter } from 'next/navigation';

interface Product {
    id: string;
    title: string;
    description?: string;
    price: number;
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
}

interface ProductResponse {
    success: boolean;
    data: {
        products: Product[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    };
}

export default function ProductsPage() {
    const { currentLocale, currentCurrency, formatPrice, t } = useLocalization();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);
    const [showFilters, setShowFilters] = useState(false);

    const categories = envConfig.scrapingCategories;

    // AI Location Recommendations
    const {
        location,
        userContext,
        recommendations,
        loading: recommendationsLoading,
        error: recommendationsError,
        getRecommendations,
        trackUserBehavior
    } = useLocationRecommendations();

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            let url = '/api/products?';

            if (searchQuery) {
                url += `search=${encodeURIComponent(searchQuery)}&`;
            } else if (selectedCategory) {
                url += `category=${encodeURIComponent(selectedCategory)}&`;
            }

            url += `locale=${currentLocale}&page=${currentPage}&limit=20`;

            const response = await fetch(url);
            const data: ProductResponse = await response.json();

            if (data.success) {
                setProducts(data.data.products);
                setPagination(data.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedCategory, currentLocale, currentPage]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSearch = useCallback(async (query: string, filters: any) => {
        setSearchQuery(query);
        setSelectedCategory(filters.category || '');
        setCurrentPage(1);

        // Track search behavior for AI recommendations
        trackUserBehavior({
            previousSearches: [...(userContext?.behavior?.previousSearches || []), query].slice(-10)
        });

        // Get AI recommendations if location is available
        if (location && filters.aiBoost) {
            await getRecommendations(query, 20, true, true);
        }

        fetchProducts();
    }, [trackUserBehavior, userContext, location, getRecommendations, fetchProducts]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchProducts();
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const handleFilterChange = useCallback((filters: any) => {
        // Handle filter changes
        console.log('Filters changed:', filters);

        // Track filter preferences for AI recommendations
        if (filters.category && filters.category !== 'all') {
            // Note: preferences not supported in current behavior tracking
            // Could be added to the behavior interface in the future
        }

        // Get AI recommendations with new filters
        if (location && filters.aiBoost && searchQuery) {
            getRecommendations(searchQuery, 20, true, true);
        }

        // You can implement the actual filter logic here
    }, [location, getRecommendations, searchQuery]);

    const getCurrentCountry = () => {
        return envConfig.gulfCountries.find(c => c.locale === currentLocale);
    };

    const handleLocationChange = useCallback((newLocation: any) => {
        console.log('Location changed:', newLocation);
        // Get recommendations for new location
        if (newLocation && searchQuery) {
            getRecommendations(searchQuery, 20, true, true);
        }
    }, [getRecommendations, searchQuery]);

    const handleRecommendationSelect = useCallback((productId: string) => {
        console.log('Recommendation selected:', productId);
        // Navigate to product page or add to cart
        router.push(`/products/${productId}`);
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {getCurrentCountry()?.name || t('products')}
                            </h1>
                            <p className="mt-2 text-gray-600">
                                {t('discoverAmazingProducts')}
                            </p>
                        </div>

                        {/* Localization Panel */}
                        <div className="mt-4 lg:mt-0">
                            <LocalizationPanel variant="dropdown" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* AI-Enhanced Search and Filters */}
                <AIEnhancedSearch
                    onSearch={handleSearch}
                    onLocationChange={handleLocationChange}
                    onRecommendationSelect={handleRecommendationSelect}
                    className="mb-8"
                />

                {/* AI Location-Based Recommendations */}
                {location && (
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm border border-blue-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-600 text-lg">📍</span>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    AI Recommendations for {location.displayName}
                                </h2>
                            </div>

                            {recommendationsLoading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="text-gray-600 mt-2">Analyzing your location and preferences...</p>
                                </div>
                            ) : recommendationsError ? (
                                <div className="text-center py-8">
                                    <p className="text-red-600 mb-2">{recommendationsError}</p>
                                    <button
                                        onClick={() => getRecommendations(searchQuery, 20, true, true)}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : recommendations ? (
                                <div className="space-y-6">
                                    {/* Trending Products */}
                                    {recommendations.trendingProducts.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                                                <span className="text-orange-500">🔥</span>
                                                Trending in {location.city}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {recommendations.trendingProducts.slice(0, 3).map((product) => (
                                                    <div
                                                        key={product.id}
                                                        className="bg-white rounded-lg p-4 border border-orange-200 hover:border-orange-300 cursor-pointer transition-all duration-200 hover:shadow-md"
                                                        onClick={() => handleRecommendationSelect(product.id)}
                                                    >
                                                        <div className="flex items-start justify-between mb-2">
                                                            <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                                                                {product.title}
                                                            </h4>
                                                            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                                                                Trending
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-600 mb-2">{product.category}</p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium text-green-600">
                                                                ${product.price}
                                                            </span>
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-yellow-500 text-xs">★</span>
                                                                <span className="text-xs text-gray-600">{product.rating}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Seasonal Recommendations */}
                                    {recommendations.seasonalProducts.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                                                <span className="text-green-500">🌱</span>
                                                Perfect for this Season
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {recommendations.seasonalProducts.slice(0, 3).map((product) => (
                                                    <div
                                                        key={product.id}
                                                        className="bg-white rounded-lg p-4 border border-green-200 hover:border-green-300 cursor-pointer transition-all duration-200 hover:shadow-md"
                                                        onClick={() => handleRecommendationSelect(product.id)}
                                                    >
                                                        <div className="flex items-start justify-between mb-2">
                                                            <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                                                                {product.title}
                                                            </h4>
                                                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                                                Seasonal
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-600 mb-2">{product.category}</p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium text-green-600">
                                                                ${product.price}
                                                            </span>
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-yellow-500 text-xs">★</span>
                                                                <span className="text-xs text-gray-600">{product.rating}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Market Insights */}
                                    {recommendations.marketInsights && (
                                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                                            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                                                <span className="text-blue-500">📊</span>
                                                Market Insights for {location.city}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-2">Trending Categories</h4>
                                                    <div className="space-y-2">
                                                        {recommendations.marketInsights.trendingCategories.slice(0, 3).map((cat, index) => (
                                                            <div key={index} className="flex items-center justify-between text-sm">
                                                                <span className="text-gray-700">{cat.category}</span>
                                                                <span className="text-blue-600 font-medium">{cat.totalSales} sales</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-2">Market Opportunities</h4>
                                                    <div className="space-y-2">
                                                        {recommendations.marketInsights.marketOpportunities.slice(0, 2).map((opp, index) => (
                                                            <div key={index} className="flex items-center justify-between text-sm">
                                                                <span className="text-gray-700">{opp.category}</span>
                                                                <span className="text-green-600 font-medium">{opp.potential}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-600 mb-4">
                                        Enable AI Boost to get personalized recommendations based on your location and preferences
                                    </p>
                                    <button
                                        onClick={() => getRecommendations('', 20, true, true)}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Get AI Recommendations
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Enhanced Products Grid */}
                <ProductGrid
                    products={products.map(product => ({
                        id: product.id,
                        title: product.title,
                        description: product.description,
                        price: product.price,
                        originalPrice: product.price * 1.3, // Mock original price
                        currency: product.currency,
                        images: product.images,
                        rating: product.rating,
                        reviewCount: product.reviewCount,
                        soldCount: product.soldCount,
                        category: product.category,
                        supplier: product.supplier,
                        isFeatured: false,
                        isHot: false
                    }))}
                    loading={loading}
                />

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <nav className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                {t('previous')}
                            </button>

                            {[...Array(pagination.pages)].map((_, i) => {
                                const page = i + 1;
                                if (
                                    page === 1 ||
                                    page === pagination.pages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-2 border rounded-lg ${currentPage === page
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                } else if (
                                    page === currentPage - 2 ||
                                    page === currentPage + 2
                                ) {
                                    return <span key={page} className="px-3 py-2">...</span>;
                                }
                                return null;
                            })}

                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === pagination.pages}
                                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                {t('next')}
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
}