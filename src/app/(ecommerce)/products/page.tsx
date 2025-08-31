"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  Store,
  TrendingUp,
  ArrowRight,
  Package,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  currency: string;
  supplierId?: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stockQuantity: number;
  category: string;
  subcategory: string;
  tags: string[];
  brand?: string;
  isActive: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  productCount: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    inStock: false,
    verifiedSeller: false
  });
  const { addItem, isInCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/products?limit=100');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProducts(data.data || []);
        } else {
          throw new Error(data.error || 'Failed to fetch products');
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCategories(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0] || '',
      supplierId: product.supplierId
    });
  };

  const handleToggleWishlist = (product: Product) => {
    toggleItem({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0] || '',
      supplierId: product.supplierId
    });
  };

  const handleViewDetails = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const filteredProducts = products.filter(product => {
    if (!product.isActive) return false;

    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' ||
      product.category.toLowerCase() === selectedCategory.toLowerCase() ||
      product.subcategory.toLowerCase() === selectedCategory.toLowerCase();

    const matchesPrice = (!filters.minPrice || product.price >= parseFloat(filters.minPrice)) &&
      (!filters.maxPrice || product.price <= parseFloat(filters.maxPrice));

    const matchesStock = !filters.inStock || product.stockQuantity > 0;

    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popularity':
      default:
        return b.reviewCount - a.reviewCount;
    }
  });

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      inStock: false,
      verifiedSeller: false
    });
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('popularity');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Products</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchProducts} className="bg-blue-600 hover:bg-blue-700">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Products</h1>
          <p className="text-gray-600">Discover amazing products from trusted sellers</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products, tags, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Advanced Filters */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Filters</h3>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category._id} value={category.slug}>
                      {category.name} ({category.productCount})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Sort and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-wrap gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid/List */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {sortedProducts.map(product => (
              viewMode === 'grid' ? (
                <ProductGridItem key={product._id} product={product} />
              ) : (
                <ProductListItem key={product._id} product={product} />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductGridItem({ product }: { product: Product }) {
  const { addItem, isInCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const router = useRouter();
  const discount = product.originalPrice > product.price ?
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0] || '',
      supplierId: product.supplierId
    });
  };

  const handleToggleWishlist = () => {
    toggleItem({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0] || '',
      supplierId: product.supplierId
    });
  };

  const handleViewDetails = () => {
    router.push(`/products/${product._id}`);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4">
        {/* Image */}
        <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <Package className={`h-16 w-16 text-gray-400 ${product.images[0] ? 'hidden' : ''}`} />
        </div>

        {/* Badges */}
        <div className="flex items-center space-x-2 mb-3">
          {discount > 0 && (
            <Badge className="bg-red-500">-{discount}%</Badge>
          )}
          <Badge variant="outline">{product.category}</Badge>
          {product.stockQuantity === 0 && (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        {/* Brand */}
        {product.brand && (
          <div className="text-sm text-gray-500 mb-3">
            Brand: {product.brand}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
          <span className="text-sm text-gray-500">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {discount > 0 && (
            <span className="text-sm text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Info */}
        <div className="text-sm text-gray-600 mb-4">
          <span className="font-medium">Stock:</span> {product.stockQuantity} available
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            className="flex-1"
            onClick={handleAddToCart}
            disabled={isInCart(product._id) || product.stockQuantity === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isInCart(product._id) ? 'In Cart' : 'Add to Cart'}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggleWishlist}
          >
            <Heart className={`h-4 w-4 ${isInWishlist(product._id) ? 'fill-current text-red-600' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleViewDetails}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductListItem({ product }: { product: Product }) {
  const { addItem, isInCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const router = useRouter();
  const discount = product.originalPrice > product.price ?
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0] || '',
      supplierId: product.supplierId
    });
  };

  const handleToggleWishlist = () => {
    toggleItem({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0] || '',
      supplierId: product.supplierId
    });
  };

  const handleViewDetails = () => {
    router.push(`/products/${product._id}`);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <div className="flex">
        <div className="w-48 h-32 bg-gray-100 rounded-l-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <Package className={`h-12 w-12 text-gray-400 ${product.images[0] ? 'hidden' : ''}`} />
        </div>
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {discount > 0 && (
                  <Badge className="bg-red-500">-{discount}%</Badge>
                )}
                <Badge variant="outline">{product.category}</Badge>
                {product.stockQuantity === 0 && (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
              <p className="text-gray-600 mb-3 line-clamp-2">{product.description}</p>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                {product.brand && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Brand:</span>
                    <span>{product.brand}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span>({product.reviewCount})</span>
                </div>
                <div>
                  <span className="font-medium">Stock:</span> {product.stockQuantity} available
                </div>
              </div>
            </div>

            <div className="text-right ml-6">
              <div className="mb-3">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {discount > 0 && (
                  <div className="text-sm text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleAddToCart}
                  disabled={isInCart(product._id) || product.stockQuantity === 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isInCart(product._id) ? 'In Cart' : 'Add to Cart'}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleWishlist}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist(product._id) ? 'fill-current text-red-600' : ''}`} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleViewDetails}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}