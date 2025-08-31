import { useState, useEffect } from 'react';
import { Product, Category, Supplier, Review, Analytics } from '@/lib/mongodb-service';

interface UseProductsOptions {
    limit?: number;
    offset?: number;
    category?: string;
    search?: string;
    featured?: boolean;
}

interface UseProductsReturn {
    products: Product[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

interface UseCategoriesReturn {
    categories: Category[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

interface UseAnalyticsReturn {
    analytics: Analytics | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (options.limit) params.append('limit', options.limit.toString());
            if (options.offset) params.append('offset', options.offset.toString());
            if (options.category) params.append('category', options.category);
            if (options.search) params.append('search', options.search);
            if (options.featured) params.append('featured', 'true');

            const response = await fetch(`/api/products?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            if (data.success) {
                setProducts(data.data);
            } else {
                throw new Error(data.error || 'Failed to fetch products');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [options.limit, options.offset, options.category, options.search, options.featured]);

    return {
        products,
        loading,
        error,
        refetch: fetchProducts
    };
}

export function useCategories(): UseCategoriesReturn {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/categories');
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            const data = await response.json();
            if (data.success) {
                setCategories(data.data);
            } else {
                throw new Error(data.error || 'Failed to fetch categories');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return {
        categories,
        loading,
        error,
        refetch: fetchCategories
    };
}

export function useAnalytics(): UseAnalyticsReturn {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/analytics');
            if (!response.ok) {
                throw new Error('Failed to fetch analytics');
            }

            const data = await response.json();
            if (data.success) {
                setAnalytics(data.data);
            } else {
                throw new Error(data.error || 'Failed to fetch analytics');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    return {
        analytics,
        loading,
        error,
        refetch: fetchAnalytics
    };
}

export function useProductById(id: string) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/products/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }

                const data = await response.json();
                if (data.success) {
                    setProduct(data.data);
                } else {
                    throw new Error(data.error || 'Failed to fetch product');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    return { product, loading, error };
}

export function useProductSearch(query: string, limit: number = 20) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query.trim()) {
            setProducts([]);
            return;
        }

        const searchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=${limit}`);
                if (!response.ok) {
                    throw new Error('Failed to search products');
                }

                const data = await response.json();
                if (data.success) {
                    setProducts(data.data);
                } else {
                    throw new Error(data.error || 'Failed to search products');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(searchProducts, 300);
        return () => clearTimeout(debounceTimer);
    }, [query, limit]);

    return { products, loading, error };
}