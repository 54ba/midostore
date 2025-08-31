"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Smartphone,
    Shirt,
    Home,
    Heart,
    Dumbbell,
    BookOpen,
    Gamepad2,
    Car,
    Palette,
    Camera,
    Music,
    Utensils
} from 'lucide-react';

interface Category {
    id: string;
    name: string;
    description: string;
    productCount: number;
    sellerCount: number;
    icon: React.ComponentType<any>;
    color: string;
    featured: boolean;
    subcategories: string[];
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        // Simulate loading categories
        setTimeout(() => {
            setCategories([
                {
                    id: 'electronics',
                    name: 'Electronics',
                    description: 'Latest gadgets, smartphones, laptops, and tech accessories',
                    productCount: 15420,
                    sellerCount: 234,
                    icon: Smartphone,
                    color: 'from-blue-500 to-cyan-500',
                    featured: true,
                    subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Accessories', 'Audio', 'Cameras']
                },
                {
                    id: 'fashion',
                    name: 'Fashion',
                    description: 'Trendy clothing, shoes, accessories, and jewelry',
                    productCount: 28950,
                    sellerCount: 456,
                    icon: Shirt,
                    color: 'from-pink-500 to-rose-500',
                    featured: true,
                    subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Accessories', 'Jewelry', 'Watches']
                },
                {
                    id: 'home',
                    name: 'Home & Garden',
                    description: 'Furniture, decor, kitchen items, and garden supplies',
                    productCount: 12340,
                    sellerCount: 189,
                    icon: Home,
                    color: 'from-green-500 to-emerald-500',
                    featured: true,
                    subcategories: ['Furniture', 'Decor', 'Kitchen', 'Bathroom', 'Garden', 'Lighting']
                },
                {
                    id: 'beauty',
                    name: 'Beauty & Health',
                    description: 'Cosmetics, skincare, fragrances, and wellness products',
                    productCount: 9870,
                    sellerCount: 145,
                    icon: Heart,
                    color: 'from-purple-500 to-pink-500',
                    featured: false,
                    subcategories: ['Skincare', 'Makeup', 'Fragrances', 'Hair Care', 'Personal Care', 'Health']
                },
                {
                    id: 'sports',
                    name: 'Sports & Fitness',
                    description: 'Athletic gear, exercise equipment, and outdoor sports',
                    productCount: 8760,
                    sellerCount: 123,
                    icon: Dumbbell,
                    color: 'from-orange-500 to-red-500',
                    featured: false,
                    subcategories: ['Fitness', 'Team Sports', 'Outdoor', 'Swimming', 'Yoga', 'Running']
                },
                {
                    id: 'books',
                    name: 'Books & Media',
                    description: 'Books, magazines, movies, music, and educational materials',
                    productCount: 6540,
                    sellerCount: 89,
                    icon: BookOpen,
                    color: 'from-yellow-500 to-orange-500',
                    featured: false,
                    subcategories: ['Fiction', 'Non-Fiction', 'Educational', 'Children\'s', 'Magazines', 'Digital']
                },
                {
                    id: 'toys',
                    name: 'Toys & Games',
                    description: 'Children\'s toys, board games, puzzles, and collectibles',
                    productCount: 5430,
                    sellerCount: 67,
                    icon: Gamepad2,
                    color: 'from-indigo-500 to-purple-500',
                    featured: false,
                    subcategories: ['Educational', 'Board Games', 'Action Figures', 'Puzzles', 'Collectibles', 'Outdoor']
                },
                {
                    id: 'automotive',
                    name: 'Automotive',
                    description: 'Car parts, accessories, tools, and maintenance supplies',
                    productCount: 4320,
                    sellerCount: 45,
                    icon: Car,
                    color: 'from-gray-600 to-gray-800',
                    featured: false,
                    subcategories: ['Parts', 'Accessories', 'Tools', 'Maintenance', 'Interior', 'Exterior']
                },
                {
                    id: 'art',
                    name: 'Arts & Crafts',
                    description: 'Art supplies, craft materials, and creative tools',
                    productCount: 3210,
                    sellerCount: 34,
                    icon: Palette,
                    color: 'from-teal-500 to-cyan-500',
                    featured: false,
                    subcategories: ['Painting', 'Drawing', 'Sculpting', 'Crafts', 'DIY', 'Supplies']
                },
                {
                    id: 'photography',
                    name: 'Photography',
                    description: 'Cameras, lenses, lighting, and photography accessories',
                    productCount: 2980,
                    sellerCount: 28,
                    icon: Camera,
                    color: 'from-slate-600 to-slate-800',
                    featured: false,
                    subcategories: ['Cameras', 'Lenses', 'Lighting', 'Accessories', 'Studio', 'Editing']
                },
                {
                    id: 'music',
                    name: 'Musical Instruments',
                    description: 'Instruments, audio equipment, and music accessories',
                    productCount: 1870,
                    sellerCount: 23,
                    icon: Music,
                    color: 'from-amber-500 to-yellow-500',
                    featured: false,
                    subcategories: ['String', 'Wind', 'Percussion', 'Electronic', 'Accessories', 'Recording']
                },
                {
                    id: 'food',
                    name: 'Food & Beverages',
                    description: 'Gourmet foods, beverages, snacks, and cooking ingredients',
                    productCount: 5430,
                    sellerCount: 78,
                    icon: Utensils,
                    color: 'from-red-500 to-pink-500',
                    featured: false,
                    subcategories: ['Gourmet', 'Organic', 'International', 'Beverages', 'Snacks', 'Ingredients']
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600">Loading categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">Product Categories</h1>
                    <p className="text-gray-600 mt-1">Explore our wide range of product categories</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Featured Categories */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Categories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.filter(cat => cat.featured).map((category) => (
                            <Card
                                key={category.id}
                                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                            >
                                <CardHeader className="p-6 pb-4">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center`}>
                                            <category.icon className="h-8 w-8 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-xl text-gray-900">{category.name}</CardTitle>
                                            <CardDescription className="text-gray-600 mt-1">
                                                {category.description}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6 pt-0">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                                            <div className="text-lg font-semibold text-gray-900">{category.productCount.toLocaleString()}</div>
                                            <div className="text-xs text-gray-500">Products</div>
                                        </div>
                                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                                            <div className="text-lg font-semibold text-gray-900">{category.sellerCount}</div>
                                            <div className="text-xs text-gray-500">Sellers</div>
                                        </div>
                                    </div>

                                    {/* Subcategories */}
                                    {selectedCategory === category.id && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                            <h4 className="font-medium text-gray-900 mb-3">Subcategories</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {category.subcategories.map(subcat => (
                                                    <Badge key={subcat} variant="secondary" className="text-xs">
                                                        {subcat}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <Button className="w-full mt-4">
                                        Browse {category.name}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* All Categories */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">All Categories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {categories.map((category) => (
                            <Card
                                key={category.id}
                                className="hover:shadow-md transition-all duration-300 cursor-pointer"
                                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                            >
                                <CardHeader className="p-4 pb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center`}>
                                            <category.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-base text-gray-900">{category.name}</CardTitle>
                                            <CardDescription className="text-xs text-gray-600 mt-1">
                                                {category.productCount.toLocaleString()} products
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-4 pt-0">
                                    {/* Subcategories */}
                                    {selectedCategory === category.id && (
                                        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="flex flex-wrap gap-1">
                                                {category.subcategories.slice(0, 4).map(subcat => (
                                                    <Badge key={subcat} variant="outline" className="text-xs">
                                                        {subcat}
                                                    </Badge>
                                                ))}
                                                {category.subcategories.length > 4 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{category.subcategories.length - 4} more
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <Button variant="outline" size="sm" className="w-full">
                                        Explore
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}