"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tag,
  Clock,
  TrendingUp,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  Flame,
  Zap,
  Gift,
  Percent
} from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  image: string;
  category: string;
  seller: string;
  rating: number;
  reviewCount: number;
  timeLeft: string;
  dealType: 'flash' | 'daily' | 'weekly' | 'clearance';
  soldCount: number;
  stockCount: number;
  featured: boolean;
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDealType, setSelectedDealType] = useState('all');
  const [sortBy, setSortBy] = useState('discount');

  const categories = ['all', 'electronics', 'fashion', 'home', 'beauty', 'sports', 'books', 'toys'];
  const dealTypes = ['all', 'flash', 'daily', 'weekly', 'clearance'];

  useEffect(() => {
    const loadDeals = async () => {
      try {
        setLoading(true);
        // Fetch real deals from the database
        console.log('Fetching deals from API...');
        const response = await fetch('/api/deals');
        console.log('API response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('API response data:', data);
          // The API returns { success: true, deals: [...] }
          setDeals(data.deals || []);
        } else {
          // Fallback to mock data if API fails
          setDeals([
            {
              id: '1',
              title: 'iPhone 15 Pro Max - 256GB',
              description: 'Latest iPhone with A17 Pro chip, titanium design, and pro camera system',
              originalPrice: 1199,
              discountedPrice: 899,
              discountPercentage: 25,
              image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
              category: 'electronics',
              seller: 'TechPro Store',
              rating: 4.8,
              reviewCount: 1247,
              timeLeft: '2h 34m',
              dealType: 'flash',
              soldCount: 89,
              stockCount: 15,
              featured: true
            },
            {
              id: '2',
              title: 'Nike Air Max 270 Sneakers',
              description: 'Comfortable running shoes with Air Max technology and stylish design',
              originalPrice: 150,
              discountedPrice: 89,
              discountPercentage: 41,
              image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
              category: 'sports',
              seller: 'Sports Gear Hub',
              rating: 4.6,
              reviewCount: 892,
              timeLeft: '1d 12h',
              dealType: 'daily',
              soldCount: 156,
              stockCount: 42,
              featured: true
            },
            {
              id: '3',
              title: 'Samsung 65" QLED 4K Smart TV',
              description: 'Crystal clear picture quality with Quantum Dot technology and smart features',
              originalPrice: 1299,
              discountedPrice: 899,
              discountPercentage: 31,
              image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
              category: 'electronics',
              seller: 'Electronics Plus',
              rating: 4.7,
              reviewCount: 567,
              timeLeft: '3d 8h',
              dealType: 'weekly',
              soldCount: 34,
              stockCount: 8,
              featured: false
            },
            {
              id: '4',
              title: 'Levi\'s 501 Original Jeans',
              description: 'Classic straight leg jeans in various washes and sizes',
              originalPrice: 89,
              discountedPrice: 49,
              discountPercentage: 45,
              image: '/levis-jeans.jpg',
              category: 'fashion',
              seller: 'Fashion Forward',
              rating: 4.5,
              reviewCount: 445,
              timeLeft: '5d 16h',
              dealType: 'weekly',
              soldCount: 234,
              stockCount: 67,
              featured: false
            },
            {
              id: '5',
              title: 'KitchenAid Stand Mixer',
              description: 'Professional stand mixer with 5-quart bowl and 10-speed settings',
              originalPrice: 399,
              discountedPrice: 249,
              discountPercentage: 38,
              image: '/kitchenaid-mixer.jpg',
              category: 'home',
              seller: 'Home & Garden Plus',
              rating: 4.9,
              reviewCount: 1234,
              timeLeft: '1d 4h',
              dealType: 'daily',
              soldCount: 78,
              stockCount: 23,
              featured: true
            },
            {
              id: '6',
              title: 'MacBook Air M2 - 13" 256GB',
              description: 'Lightweight laptop with M2 chip, all-day battery life, and Retina display',
              originalPrice: 1199,
              discountedPrice: 999,
              discountPercentage: 17,
              image: '/macbook-air.jpg',
              category: 'electronics',
              seller: 'Apple Store Official',
              rating: 4.8,
              reviewCount: 2156,
              timeLeft: '4h 12m',
              dealType: 'flash',
              soldCount: 45,
              stockCount: 12,
              featured: true
            },
            {
              id: '7',
              title: 'Adidas Ultraboost 22 Running Shoes',
              description: 'Premium running shoes with Boost midsole and Primeknit upper',
              originalPrice: 180,
              discountedPrice: 108,
              discountPercentage: 40,
              image: '/adidas-shoes.jpg',
              category: 'sports',
              seller: 'Athletic Gear',
              rating: 4.7,
              reviewCount: 678,
              timeLeft: '2d 6h',
              dealType: 'daily',
              soldCount: 123,
              stockCount: 38,
              featured: false
            },
            {
              id: '8',
              title: 'Dyson V15 Detect Vacuum',
              description: 'Cordless vacuum with laser technology and 60-minute runtime',
              originalPrice: 699,
              discountedPrice: 499,
              discountPercentage: 29,
              image: '/dyson-vacuum.jpg',
              category: 'home',
              seller: 'Premium Home',
              rating: 4.6,
              reviewCount: 456,
              timeLeft: '6d 10h',
              dealType: 'weekly',
              soldCount: 67,
              stockCount: 19,
              featured: false
            }
          ]);
        }
        console.log('Setting loading to false, deals count:', deals.length);
        setLoading(false);
      } catch (error) {
        console.error('Error loading deals:', error);
        setLoading(false);
      }
    };

    loadDeals();
  }, []);

  // Debug: Monitor deals state changes
  useEffect(() => {
    console.log('Deals state updated:', deals.length, 'deals');
  }, [deals]);

  const filteredDeals = deals.filter(deal => {
    const matchesCategory = selectedCategory === 'all' || deal.category === selectedCategory;
    const matchesDealType = selectedDealType === 'all' || deal.dealType === selectedDealType;
    return matchesCategory && matchesDealType;
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    switch (sortBy) {
      case 'discount':
        return b.discountPercentage - a.discountPercentage;
      case 'price':
        return a.discountedPrice - b.discountedPrice;
      case 'rating':
        return b.rating - a.rating;
      case 'time':
        return a.timeLeft.localeCompare(b.timeLeft);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading amazing deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-3 mb-4">
            <Flame className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Hot Deals</h1>
          </div>
          <p className="text-xl opacity-90">Don't miss out on these incredible offers!</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Sort */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Deal Type</label>
              <select
                value={selectedDealType}
                onChange={(e) => setSelectedDealType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {dealTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="discount">Highest Discount</option>
                <option value="price">Lowest Price</option>
                <option value="rating">Highest Rating</option>
                <option value="time">Time Left</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredDeals.length} of {deals.length} deals
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDeals.map((deal) => (
            <Card key={deal.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {deal.dealType === 'flash' && (
                      <Badge className="bg-red-500 text-white">
                        <Zap className="mr-1 h-3 w-3" />
                        Flash Sale
                      </Badge>
                    )}
                    {deal.dealType === 'daily' && (
                      <Badge className="bg-blue-500 text-white">
                        <Clock className="mr-1 h-3 w-3" />
                        Daily Deal
                      </Badge>
                    )}
                    {deal.dealType === 'weekly' && (
                      <Badge className="bg-green-500 text-white">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        Weekly Deal
                      </Badge>
                    )}
                    {deal.dealType === 'clearance' && (
                      <Badge className="bg-purple-500 text-white">
                        <Gift className="mr-1 h-3 w-3" />
                        Clearance
                      </Badge>
                    )}
                  </div>
                  {deal.featured && (
                    <Badge variant="secondary">
                      <Star className="mr-1 h-3 w-3" />
                      Featured
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-lg text-gray-900 mb-2">{deal.title}</CardTitle>
                <CardDescription className="text-gray-600 mb-4">
                  {deal.description}
                </CardDescription>

                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Seller: {deal.seller}</span>
                  <span>•</span>
                  <span className="capitalize">{deal.category}</span>
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-0">
                {/* Pricing */}
                <div className="mb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                      ${deal.discountedPrice}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ${deal.originalPrice}
                    </span>
                    <Badge className="bg-green-500 text-white text-sm">
                      <Percent className="mr-1 h-3 w-3" />
                      {deal.discountPercentage}% OFF
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    You save ${deal.originalPrice - deal.discountedPrice}
                  </p>
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="ml-1 font-medium">{deal.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({deal.reviewCount.toLocaleString()} reviews)</span>
                </div>

                {/* Time Left */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium text-orange-700">
                      Deal ends in: {deal.timeLeft}
                    </span>
                  </div>
                </div>

                {/* Stock Info */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">{deal.soldCount}</div>
                    <div className="text-xs text-gray-500">Sold</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">{deal.stockCount}</div>
                    <div className="text-xs text-gray-500">In Stock</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Buy Now
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredDeals.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later for new offers</p>
          </div>
        )}
      </div>
    </div>
  );
}