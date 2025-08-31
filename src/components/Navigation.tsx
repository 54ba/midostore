"use client";

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import {
    Menu,
    X,
    Store,
    ShoppingCart,
    User,
    ChevronDown,
    Search,
    Bell,
    Brain,
    BarChart3,
    Megaphone
} from 'lucide-react';

export default function Navigation() {
    const { state } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSellerDropdownOpen, setIsSellerDropdownOpen] = useState(false);
    const [isBuyerDropdownOpen, setIsBuyerDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const sellerDropdownRef = useRef<HTMLDivElement>(null);
    const buyerDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sellerDropdownRef.current && !sellerDropdownRef.current.contains(event.target as Node)) {
                setIsSellerDropdownOpen(false);
            }
            if (buyerDropdownRef.current && !buyerDropdownRef.current.contains(event.target as Node)) {
                setIsBuyerDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleSellerDropdown = () => {
        setIsSellerDropdownOpen(!isSellerDropdownOpen);
        setIsBuyerDropdownOpen(false);
    };

    const toggleBuyerDropdown = () => {
        setIsBuyerDropdownOpen(!isBuyerDropdownOpen);
        setIsSellerDropdownOpen(false);
    };

    const closeAllDropdowns = () => {
        setIsSellerDropdownOpen(false);
        setIsBuyerDropdownOpen(false);
        setIsMenuOpen(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            closeAllDropdowns();
        }
    };

    const handleMobileSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            closeAllDropdowns();
        }
    };

    return (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2" onClick={closeAllDropdowns}>
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">M</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">MidoStore</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {/* Seller Dropdown */}
                        <div className="relative" ref={sellerDropdownRef}>
                            <button
                                onClick={toggleSellerDropdown}
                                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md"
                            >
                                <Store className="h-4 w-4" />
                                <span>Sellers</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${isSellerDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isSellerDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                                    <Link href="/seller/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={closeAllDropdowns}>
                                        Dashboard
                                    </Link>
                                    <Link href="/seller/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={closeAllDropdowns}>
                                        My Products
                                    </Link>
                                    <Link href="/seller/analytics" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={closeAllDropdowns}>
                                        Analytics
                                    </Link>
                                    <Link href="/seller/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={closeAllDropdowns}>
                                        Become a Seller
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Buyer Dropdown */}
                        <div className="relative" ref={buyerDropdownRef}>
                            <button
                                onClick={toggleBuyerDropdown}
                                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md"
                            >
                                <User className="h-4 w-4" />
                                <span>Buyers</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${isBuyerDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isBuyerDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                                    <Link href="/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={closeAllDropdowns}>
                                        Browse Products
                                    </Link>
                                    <Link href="/deals" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={closeAllDropdowns}>
                                        Deals & Offers
                                    </Link>
                                    <Link href="/categories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={closeAllDropdowns}>
                                        Categories
                                    </Link>
                                    <Link href="/cart" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={closeAllDropdowns}>
                                        Shopping Cart
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* AI Services */}
                        <Link href="/ai-agents" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md">
                            <Brain className="h-4 w-4" />
                            <span>AI Services</span>
                        </Link>

                        {/* Analytics */}
                        <Link href="/analytics/overview" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md">
                            <BarChart3 className="h-4 w-4" />
                            <span>Analytics</span>
                        </Link>

                        {/* Marketing */}
                        <Link href="/advertising" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md">
                            <Megaphone className="h-4 w-4" />
                            <span>Marketing</span>
                        </Link>
                    </div>

                    {/* Right Side */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </form>

                        {/* Notifications */}
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
                                3
                            </Badge>
                        </Button>

                        {/* Cart */}
                        <Button asChild variant="ghost" size="icon" className="relative">
                            <Link href="/cart">
                                <ShoppingCart className="h-5 w-5" />
                                {state.itemCount > 0 && (
                                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
                                        {state.itemCount > 99 ? '99+' : state.itemCount}
                                    </Badge>
                                )}
                            </Link>
                        </Button>

                        <Button asChild variant="outline">
                            <Link href="/auth/signin">
                                <User className="mr-2 h-4 w-4" />
                                Sign In
                            </Link>
                        </Button>

                        <Button asChild>
                            <Link href="/seller/register">
                                <Store className="mr-2 h-4 w-4" />
                                Start Selling
                            </Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
                            {/* Mobile Search */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <Button
                                    onClick={handleMobileSearch}
                                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-3 text-sm"
                                    disabled={!searchQuery.trim()}
                                >
                                    Search
                                </Button>
                            </div>

                            {/* Mobile Cart */}
                            <Link href="/cart" className="flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md" onClick={closeAllDropdowns}>
                                <div className="flex items-center space-x-2">
                                    <ShoppingCart className="h-5 w-5" />
                                    <span>Cart</span>
                                </div>
                                {state.itemCount > 0 && (
                                    <Badge className="bg-red-500 text-white">
                                        {state.itemCount > 99 ? '99+' : state.itemCount}
                                    </Badge>
                                )}
                            </Link>

                            {/* Mobile Navigation Links */}
                            <Link href="/products" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md" onClick={closeAllDropdowns}>
                                Browse Products
                            </Link>
                            <Link href="/seller/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md" onClick={closeAllDropdowns}>
                                Seller Dashboard
                            </Link>
                            <Link href="/ai-agents" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md" onClick={closeAllDropdowns}>
                                AI Services
                            </Link>
                            <Link href="/analytics/overview" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md" onClick={closeAllDropdowns}>
                                Analytics
                            </Link>
                            <Link href="/advertising" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md" onClick={closeAllDropdowns}>
                                Marketing
                            </Link>
                            <Link href="/about" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md" onClick={closeAllDropdowns}>
                                About
                            </Link>
                            <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md" onClick={closeAllDropdowns}>
                                Contact
                            </Link>

                            {/* Mobile Auth Buttons */}
                            <div className="pt-4 space-y-2">
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/auth/signin" onClick={closeAllDropdowns}>
                                        <User className="mr-2 h-4 w-4" />
                                        Sign In
                                    </Link>
                                </Button>
                                <Button asChild className="w-full">
                                    <Link href="/seller/register" onClick={closeAllDropdowns}>
                                        <Store className="mr-2 h-4 w-4" />
                                        Start Selling
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}