"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Globe, DollarSign, Star, ShoppingCart, Eye } from 'lucide-react';
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
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);

    const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Beauty', 'Sports'];

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            let url = '/api/products?';

            if (searchQuery) {
                url += `search=${encodeURIComponent(searchQuery)}&`;
            } else if (selectedCategory) {
                url += `category=${encodeURIComponent(selectedCategory)}&`;
            }

            url += `page=${currentPage}&limit=20`;

            const response = await fetch(url);
            const data: ProductResponse = await response.json();

            if (data.success) {
                setProducts(data.data.products || []);
                setPagination(data.data.pagination);
            } else {
                setProducts([]);
                setPagination(null);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedCategory, currentPage]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchProducts();
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Products
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Discover amazing products from around the world
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filters */}
                <div className="mb-8">
                    <form onSubmit={handleSearchSubmit} className="mb-4">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleCategoryChange('')}
                            className={`px-4 py-2 rounded-lg transition-colors ${selectedCategory === ''
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            All
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryChange(category)}
                                className={`px-4 py-2 rounded-lg transition-colors ${selectedCategory === category
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Loading products...</span>
                    </div>
                ) : (products || []).length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <ShoppingCart className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600">Try adjusting your search or category filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {(products || []).map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => router.push(`/products/${product.id}`)}
                            >
                                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                                    <img
                                        src={product.images[0] || '/api/placeholder/300/300?text=Product'}
                                        alt={product.title}
                                        className="w-full h-48 object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                                        {product.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xl font-bold text-green-600">
                                            ${product.price}
                                        </span>
                                        {product.rating && (
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 fill-current text-yellow-400" />
                                                <span className="ml-1 text-sm text-gray-600">
                                                    {product.rating} ({product.reviewCount})
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>{product.soldCount} sold</span>
                                        <span className="flex items-center">
                                            {product.supplier.verified && (
                                                <span className="text-green-600 mr-1">✓</span>
                                            )}
                                            {product.supplier.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

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