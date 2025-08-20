"use client";

import React, { useState, useEffect } from 'react';
import { Globe, DollarSign, Star, ShoppingCart, Eye } from 'lucide-react';
import { config } from '../../../../env.config';
import SearchAndFilter from '@/components/SearchAndFilter';
import ProductGrid from '@/components/ProductGrid';

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
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedLocale, setSelectedLocale] = useState('en-AE');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);
    const [showFilters, setShowFilters] = useState(false);

    const categories = config.scrapingCategories;
    const locales = config.localization.supportedLocales;

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, selectedLocale, currentPage]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            let url = '/api/products?';

            if (searchQuery) {
                url += `search=${encodeURIComponent(searchQuery)}&`;
            } else if (selectedCategory) {
                url += `category=${encodeURIComponent(selectedCategory)}&`;
            }

            url += `locale=${selectedLocale}&page=${currentPage}&limit=20`;

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
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
        fetchProducts();
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchProducts();
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const handleLocaleChange = (locale: string) => {
        setSelectedLocale(locale);
        setCurrentPage(1);
    };

    const handleFilterChange = (filters: any) => {
        // Handle filter changes
        console.log('Filters changed:', filters);
        // You can implement the actual filter logic here
    };

    const getLocaleDisplayName = (locale: string) => {
        const country = config.gulfCountries.find(c => c.locale === locale);
        return country ? `${country.name} (${country.currency})` : locale;
    };

    const formatPrice = (price: number, currency: string) => {
        const formatter = new Intl.NumberFormat(selectedLocale, {
            style: 'currency',
            currency: currency,
        });
        return formatter.format(price);
    };

    const getCurrentCountry = () => {
        return config.gulfCountries.find(c => c.locale === selectedLocale);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {getCurrentCountry()?.nameAr || 'Products'}
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Discover amazing products from Alibaba and AliExpress
                            </p>
                        </div>

                        {/* Locale Selector */}
                        <div className="mt-4 lg:mt-0">
                            <div className="flex items-center space-x-2">
                                <Globe className="h-5 w-5 text-gray-400" />
                                <select
                                    value={selectedLocale}
                                    onChange={(e) => handleLocaleChange(e.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {locales.map((locale: string) => (
                                        <option key={locale} value={locale}>
                                            {getLocaleDisplayName(locale)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Enhanced Search and Filters */}
                <SearchAndFilter
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                    categories={categories}
                    priceRange={{ min: 0, max: 10000 }}
                    className="mb-8"
                />

                {/* Enhanced Products Grid */}
                <ProductGrid
                    products={products.map(product => ({
                        product_id: product.id,
                        product_name: product.title,
                        price: product.price,
                        alibaba_price: product.price * 0.7, // Mock alibaba price
                        category: product.category || 'General',
                        image_url: product.images[0],
                        rating: product.rating,
                        review_count: product.reviewCount
                    }))}
                    onAddToCart={async (productId: string, quantity: number) => {
                        // Handle add to cart
                        console.log('Adding to cart:', productId, quantity);
                    }}
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
                                Previous
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
                                Next
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
}