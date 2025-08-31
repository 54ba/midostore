import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Store,
    ArrowLeft,
    Grid,
    Users,
    Star,
    MapPin,
    TrendingUp
} from 'lucide-react';

export default function StoresLayout({
    children,
}: {
    children: ReactNode;
}) {
    const storeCategories = [
        { name: 'All Stores', href: '/stores', icon: Store, description: 'Browse all sellers' },
        { name: 'Categories', href: '/categories', icon: Grid, description: 'Product categories' },
        { name: 'Deals', href: '/deals', icon: TrendingUp, description: 'Special offers' },
        { name: 'Top Sellers', href: '/stores/top', icon: Star, description: 'Highest rated' },
        { name: 'Nearby', href: '/stores/nearby', icon: MapPin, description: 'Local sellers' },
        { name: 'New Stores', href: '/stores/new', icon: Users, description: 'Recently joined' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
            {/* Stores Header */}
            <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link href="/">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Home
                                </Button>
                            </Link>
                            <div className="flex items-center space-x-3">
                                <Store className="h-8 w-8 text-emerald-600" />
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Stores</h1>
                                    <p className="text-sm text-gray-600">Discover amazing sellers and products</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                                {storeCategories.length} Categories
                            </Badge>
                            <Button variant="outline" size="sm">
                                <Grid className="h-4 w-4 mr-2" />
                                View All
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Stores Navigation */}
                    <div className="lg:col-span-1 space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Store Categories</h2>
                        <div className="space-y-3">
                            {storeCategories.map((category) => {
                                const Icon = category.icon;
                                return (
                                    <Link key={category.name} href={category.href}>
                                        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                                                    <Icon className="h-5 w-5 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                                                        {category.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">{category.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200 p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}