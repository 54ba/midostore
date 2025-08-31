"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Store,
    Star,
    Package,
    Users,
    TrendingUp,
    Search,
    Filter,
    MapPin
} from 'lucide-react';

interface StoreData {
    id: string;
    name: string;
    description: string;
    owner: string;
    rating: number;
    reviewCount: number;
    productCount: number;
    followerCount: number;
    location: string;
    categories: string[];
    verified: boolean;
    featured: boolean;
    image: string;
}

export default function StoresPage() {
    const [stores, setStores] = useState<StoreData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = ['all', 'electronics', 'fashion', 'home', 'beauty', 'sports', 'books', 'toys'];

    useEffect(() => {
        // Simulate loading stores
        setTimeout(() => {
            setStores([
                {
                    id: '1',
                    name: 'TechPro Store',
                    description: 'Premium electronics and gadgets for tech enthusiasts. Quality products at competitive prices.',
                    owner: 'Ahmed Hassan',
                    rating: 4.8,
                    reviewCount: 1247,
                    productCount: 156,
                    followerCount: 8920,
                    location: 'Dubai, UAE',
                    categories: ['electronics', 'gadgets'],
                    verified: true,
                    featured: true,
                    image: '/store1.jpg'
                },
                {
                    id: '2',
                    name: 'Fashion Forward',
                    description: 'Trendy fashion items for men and women. Stay ahead of the style curve with our latest collections.',
                    owner: 'Sarah Johnson',
                    rating: 4.6,
                    reviewCount: 892,
                    productCount: 234,
                    followerCount: 6540,
                    location: 'Abu Dhabi, UAE',
                    categories: ['fashion', 'accessories'],
                    verified: true,
                    featured: false,
                    image: '/store2.jpg'
                },
                {
                    id: '3',
                    name: 'Home & Garden Plus',
                    description: 'Everything you need to make your home beautiful. From furniture to decor, we have it all.',
                    owner: 'Mohammed Al-Rashid',
                    rating: 4.7,
                    reviewCount: 567,
                    productCount: 89,
                    followerCount: 4320,
                    location: 'Sharjah, UAE',
                    categories: ['home', 'garden'],
                    verified: true,
                    featured: false,
                    image: '/store3.jpg'
                },
                {
                    id: '4',
                    name: 'Sports Gear Hub',
                    description: 'Professional sports equipment and athletic wear. Train like a champion with our premium gear.',
                    owner: 'Ali Al-Mansouri',
                    rating: 4.5,
                    reviewCount: 445,
                    productCount: 123,
                    followerCount: 3780,
                    location: 'Riyadh, KSA',
                    categories: ['sports', 'fitness'],
                    verified: true,
                    featured: false,
                    image: '/store4.jpg'
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const filteredStores = stores.filter(store => {
        const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            store.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' ||
            store.categories.some(cat => cat === selectedCategory);
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600">Loading stores...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">Explore Stores</h1>
                    <p className="text-gray-600 mt-1">Discover amazing stores from verified sellers</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search stores by name or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex-shrink-0">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        Showing {filteredStores.length} of {stores.length} stores
                    </p>
                </div>

                {/* Stores Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStores.map((store) => (
                        <Card key={store.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <CardHeader className="p-6 pb-4">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                            <Store className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900">{store.name}</h3>
                                            <div className="flex items-center space-x-2">
                                                {store.verified && (
                                                    <Badge variant="secondary" className="text-xs">Verified</Badge>
                                                )}
                                                {store.featured && (
                                                    <Badge className="text-xs">Featured</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <CardDescription className="text-gray-600 mb-4">
                                    {store.description}
                                </CardDescription>

                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <MapPin className="h-4 w-4" />
                                    <span>{store.location}</span>
                                </div>
                            </CardHeader>

                            <CardContent className="p-6 pt-0">
                                {/* Store Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="text-lg font-semibold text-gray-900">{store.productCount}</div>
                                        <div className="text-xs text-gray-500">Products</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="text-lg font-semibold text-gray-900">{store.followerCount.toLocaleString()}</div>
                                        <div className="text-xs text-gray-500">Followers</div>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center">
                                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                            <span className="ml-1 font-medium">{store.rating}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">({store.reviewCount.toLocaleString()} reviews)</span>
                                    </div>
                                </div>

                                {/* Categories */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {store.categories.map(category => (
                                        <Badge key={category} variant="outline" className="text-xs">
                                            {category}
                                        </Badge>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-2">
                                    <Button className="flex-1">
                                        <Store className="mr-2 h-4 w-4" />
                                        Visit Store
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <TrendingUp className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* No Results */}
                {filteredStores.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Store className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No stores found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
}