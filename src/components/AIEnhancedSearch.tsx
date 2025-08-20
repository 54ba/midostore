"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, MapPin, TrendingUp, Sparkles, Filter, X, ChevronDown, Globe, Clock, Star } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';

interface AIEnhancedSearchProps {
    onSearch: (query: string, filters: SearchFilters) => void;
    onLocationChange: (location: any) => void;
    onRecommendationSelect: (productId: string) => void;
    className?: string;
}

interface SearchFilters {
    query: string;
    category: string;
    priceRange: { min: number; max: number };
    location: any;
    sortBy: string;
    aiBoost: boolean;
}

interface SearchSuggestion {
    type: 'product' | 'category' | 'trend' | 'location';
    text: string;
    relevance: number;
    metadata?: any;
}

interface AIRecommendation {
    productId: string;
    title: string;
    category: string;
    price: number;
    rating: number;
    relevanceScore: number;
    reasoning: any;
    matchFactors: string[];
    estimatedDemand: number;
    competitiveAdvantage: string;
}

export default function AIEnhancedSearch({
    onSearch,
    onLocationChange,
    onRecommendationSelect,
    className = ''
}: AIEnhancedSearchProps) {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<SearchFilters>({
        query: '',
        category: 'all',
        priceRange: { min: 0, max: 1000 },
        location: null,
        sortBy: 'relevance',
        aiBoost: true
    });

    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [userLocation, setUserLocation] = useState<any>(null);
    const [locationLoading, setLocationLoading] = useState(false);

    const searchTimeoutRef = useRef<NodeJS.Timeout>();
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Get user location on component mount
    useEffect(() => {
        getUserLocation();
    }, []);

    // Get user's current location
    const getUserLocation = async () => {
        setLocationLoading(true);
        try {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        const locationData = await getLocationFromCoords(latitude, longitude);
                        setUserLocation(locationData);
                        setFilters(prev => ({ ...prev, location: locationData }));
                        onLocationChange(locationData);
                    },
                    (error) => {
                        console.log('Geolocation error:', error);
                        // Fallback to IP-based location
                        getLocationFromIP();
                    }
                );
            } else {
                // Fallback to IP-based location
                getLocationFromIP();
            }
        } catch (error) {
            console.error('Error getting location:', error);
            getLocationFromIP();
        } finally {
            setLocationLoading(false);
        }
    };

    // Get location from coordinates using reverse geocoding
    const getLocationFromCoords = async (lat: number, lon: number): Promise<any> => {
        try {
            const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY || 'demo'}`);
            const data = await response.json();

            if (data && data[0]) {
                return {
                    city: data[0].name,
                    country: data[0].country,
                    latitude: lat,
                    longitude: lon,
                    displayName: `${data[0].name}, ${data[0].country}`
                };
            }
        } catch (error) {
            console.error('Error getting location from coordinates:', error);
        }

        return {
            latitude: lat,
            longitude: lon,
            displayName: `${lat.toFixed(2)}, ${lon.toFixed(2)}`
        };
    };

    // Get location from IP address
    const getLocationFromIP = async () => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();

            const locationData = {
                city: data.city,
                country: data.country_name,
                latitude: data.latitude,
                longitude: data.longitude,
                displayName: `${data.city}, ${data.country_name}`
            };

            setUserLocation(locationData);
            setFilters(prev => ({ ...prev, location: locationData }));
            onLocationChange(locationData);
        } catch (error) {
            console.error('Error getting location from IP:', error);
        }
    };

    // Handle search input changes
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setFilters(prev => ({ ...prev, query }));

        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Debounce search suggestions
        if (query.length > 2) {
            searchTimeoutRef.current = setTimeout(() => {
                generateSearchSuggestions(query);
            }, 300);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Generate AI-powered search suggestions
    const generateSearchSuggestions = async (query: string) => {
        setIsSearching(true);
        try {
            // Generate intelligent suggestions based on query
            const newSuggestions: SearchSuggestion[] = [];

            // Product suggestions
            newSuggestions.push({
                type: 'product',
                text: query,
                relevance: 0.9,
                metadata: { category: 'exact_match' }
            });

            // Category suggestions
            if (query.toLowerCase().includes('phone') || query.toLowerCase().includes('tech')) {
                newSuggestions.push({
                    type: 'category',
                    text: 'Electronics & Technology',
                    relevance: 0.8,
                    metadata: { category: 'electronics' }
                });
            }

            if (query.toLowerCase().includes('shirt') || query.toLowerCase().includes('fashion')) {
                newSuggestions.push({
                    type: 'category',
                    text: 'Fashion & Clothing',
                    relevance: 0.8,
                    metadata: { category: 'fashion' }
                });
            }

            // Trend suggestions
            if (userLocation) {
                newSuggestions.push({
                    type: 'trend',
                    text: `Trending in ${userLocation.city}`,
                    relevance: 0.7,
                    metadata: { location: userLocation.city }
                });
            }

            // Location-based suggestions
            if (userLocation && query.toLowerCase().includes('local')) {
                newSuggestions.push({
                    type: 'location',
                    text: `Products popular in ${userLocation.city}`,
                    relevance: 0.6,
                    metadata: { location: userLocation.city }
                });
            }

            setSuggestions(newSuggestions);
            setShowSuggestions(true);

            // Generate AI recommendations if user is authenticated
            if (user) {
                await generateAIRecommendations(query);
            }

        } catch (error) {
            console.error('Error generating suggestions:', error);
        } finally {
            setIsSearching(false);
        }
    };

    // Generate AI recommendations based on search and user context
    const generateAIRecommendations = async (query: string) => {
        try {
            // This would call your AI recommendation service
            // For now, using mock data
            const mockRecommendations: AIRecommendation[] = [
                {
                    productId: '1',
                    title: 'Smart Wireless Earbuds',
                    category: 'Electronics',
                    price: 89.99,
                    rating: 4.8,
                    relevanceScore: 0.95,
                    reasoning: {
                        locationFactor: 0.9,
                        behaviorFactor: 0.8,
                        trendFactor: 0.9,
                        seasonalFactor: 0.7,
                        personalizationFactor: 0.8
                    },
                    matchFactors: ['Trending in your area', 'Matches your interests', 'High demand'],
                    estimatedDemand: 85,
                    competitiveAdvantage: 'High demand, low competition'
                },
                {
                    productId: '2',
                    title: 'Premium Fitness Tracker',
                    category: 'Electronics',
                    price: 149.99,
                    rating: 4.6,
                    relevanceScore: 0.88,
                    reasoning: {
                        locationFactor: 0.8,
                        behaviorFactor: 0.9,
                        trendFactor: 0.8,
                        seasonalFactor: 0.8,
                        personalizationFactor: 0.7
                    },
                    matchFactors: ['Popular in your area', 'Seasonally relevant', 'Good opportunity'],
                    estimatedDemand: 72,
                    competitiveAdvantage: 'Good opportunity'
                }
            ];

            setAiRecommendations(mockRecommendations);
        } catch (error) {
            console.error('Error generating AI recommendations:', error);
        }
    };

    // Handle search submission
    const handleSearch = () => {
        const searchFilters = { ...filters, query: searchQuery };
        onSearch(searchQuery, searchFilters);
        setShowSuggestions(false);
    };

    // Handle suggestion selection
    const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
        if (suggestion.type === 'product' || suggestion.type === 'category') {
            setSearchQuery(suggestion.text);
            setFilters(prev => ({ ...prev, query: suggestion.text }));
        } else if (suggestion.type === 'trend') {
            // Handle trend-based search
            setSearchQuery('trending products');
            setFilters(prev => ({ ...prev, query: 'trending products' }));
        } else if (suggestion.type === 'location') {
            // Handle location-based search
            setSearchQuery('local favorites');
            setFilters(prev => ({ ...prev, query: 'local favorites' }));
        }

        setShowSuggestions(false);
        handleSearch();
    };

    // Handle AI recommendation selection
    const handleRecommendationSelect = (recommendation: AIRecommendation) => {
        onRecommendationSelect(recommendation.productId);
    };

    // Handle filter changes
    const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
    };

    // Clear all filters
    const clearFilters = () => {
        const defaultFilters: SearchFilters = {
            query: searchQuery,
            category: 'all',
            priceRange: { min: 0, max: 1000 },
            location: userLocation,
            sortBy: 'relevance',
            aiBoost: true
        };
        setFilters(defaultFilters);
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Enhanced Search Bar */}
            <div className="relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search with AI-powered suggestions..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full pl-10 pr-20 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />

                    {/* Location Indicator */}
                    {userLocation && (
                        <div className="absolute right-20 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-20">{userLocation.displayName}</span>
                        </div>
                    )}

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {isSearching ? 'Searching...' : 'Search'}
                    </button>
                </div>

                {/* AI Boost Toggle */}
                <div className="absolute -bottom-8 left-0 flex items-center gap-2">
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.aiBoost}
                            onChange={(e) => handleFilterChange({ aiBoost: e.target.checked })}
                            className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <Sparkles className="h-4 w-4 text-blue-500" />
                        AI Boost
                    </label>
                </div>
            </div>

            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto">
                    <div className="p-2">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => handleSuggestionSelect(suggestion)}
                                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                            >
                                {suggestion.type === 'product' && <Search className="h-4 w-4 text-blue-500" />}
                                {suggestion.type === 'category' && <Globe className="h-4 w-4 text-green-500" />}
                                {suggestion.type === 'trend' && <TrendingUp className="h-4 w-4 text-orange-500" />}
                                {suggestion.type === 'location' && <MapPin className="h-4 w-4 text-purple-500" />}

                                <div className="flex-1">
                                    <div className="font-medium text-gray-900">{suggestion.text}</div>
                                    <div className="text-sm text-gray-500">
                                        {suggestion.type === 'product' && 'Product search'}
                                        {suggestion.type === 'category' && 'Browse category'}
                                        {suggestion.type === 'trend' && 'Trending now'}
                                        {suggestion.type === 'location' && 'Location-based'}
                                    </div>
                                </div>

                                <div className="text-xs text-gray-400">
                                    {Math.round(suggestion.relevance * 100)}%
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* AI Recommendations */}
            {aiRecommendations.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">AI-Powered Recommendations</h3>
                    </div>

                    <div className="space-y-3">
                        {aiRecommendations.map((recommendation) => (
                            <div
                                key={recommendation.productId}
                                onClick={() => handleRecommendationSelect(recommendation)}
                                className="bg-white rounded-lg p-3 border border-blue-200 hover:border-blue-300 cursor-pointer transition-all duration-200 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{recommendation.title}</h4>
                                        <p className="text-sm text-gray-600">{recommendation.category}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                                <span className="text-xs text-gray-600">{recommendation.rating}</span>
                                            </div>
                                            <span className="text-sm font-medium text-green-600">
                                                ${recommendation.price}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-xs text-blue-600 font-medium">
                                            {Math.round(recommendation.relevanceScore * 100)}% Match
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {recommendation.estimatedDemand}% Demand
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2 flex flex-wrap gap-1">
                                    {recommendation.matchFactors.slice(0, 2).map((factor, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                        >
                                            {factor}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Enhanced Filters */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                >
                    <Filter className="h-4 w-4" />
                    <span>Advanced Filters</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                {filters.category !== 'all' || filters.priceRange.min !== 0 || filters.priceRange.max !== 1000 ? (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                        Clear all
                    </button>
                ) : null}
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg space-y-6 animate-in slide-in-from-top-2 duration-200">
                    {/* Category Filter */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => handleFilterChange({ category: 'all' })}
                                className={`px-3 py-2 text-sm rounded-lg transition-colors ${filters.category === 'all'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                All Categories
                            </button>
                            {['Electronics', 'Fashion', 'Home & Garden', 'Beauty', 'Sports', 'Books'].map((category) => (
                                <button
                                    key={category}
                                    onClick={() => handleFilterChange({ category })}
                                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${filters.category === category
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range Filter */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs text-gray-600 mb-1">Min Price</label>
                                    <input
                                        type="number"
                                        value={filters.priceRange.min}
                                        onChange={(e) => handleFilterChange({
                                            priceRange: { ...filters.priceRange, min: Number(e.target.value) }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        min={0}
                                        max={filters.priceRange.max}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs text-gray-600 mb-1">Max Price</label>
                                    <input
                                        type="number"
                                        value={filters.priceRange.max}
                                        onChange={(e) => handleFilterChange({
                                            priceRange: { ...filters.priceRange, max: Number(e.target.value) }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        min={filters.priceRange.min}
                                        max={10000}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>${filters.priceRange.min}</span>
                                <div className="flex-1 h-px bg-gray-200"></div>
                                <span>${filters.priceRange.max}</span>
                            </div>
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Sort By</h3>
                        <select
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        >
                            <option value="relevance">AI Relevance</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="rating">Highest Rated</option>
                            <option value="trending">Trending</option>
                            <option value="local">Local Favorites</option>
                        </select>
                    </div>

                    {/* Location-Based Options */}
                    {userLocation && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Location-Based</h3>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.aiBoost}
                                        onChange={(e) => handleFilterChange({ aiBoost: e.target.checked })}
                                        className="rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <MapPin className="h-4 w-4 text-blue-500" />
                                    Show local favorites
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                    Include trending products
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}