'use client'

import { useState, useCallback } from 'react'
import { Search, Filter, X, ChevronDown } from 'lucide-react'

interface SearchAndFilterProps {
    onSearch: (query: string) => void
    onFilterChange: (filters: FilterOptions) => void
    categories: string[]
    priceRange?: { min: number; max: number }
    className?: string
}

interface FilterOptions {
    category: string
    priceMin: number
    priceMax: number
    sortBy: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest'
}

export default function SearchAndFilter({
    onSearch,
    onFilterChange,
    categories,
    priceRange = { min: 0, max: 1000 },
    className = ''
}: SearchAndFilterProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filters, setFilters] = useState<FilterOptions>({
        category: 'all',
        priceMin: priceRange.min,
        priceMax: priceRange.max,
        sortBy: 'newest'
    })

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query)
        onSearch(query)
    }, [onSearch])

    const handleFilterChange = useCallback((newFilters: Partial<FilterOptions>) => {
        const updatedFilters = { ...filters, ...newFilters }
        setFilters(updatedFilters)
        onFilterChange(updatedFilters)
    }, [filters, onFilterChange])

    const clearFilters = useCallback(() => {
        const defaultFilters = {
            category: 'all',
            priceMin: priceRange.min,
            priceMax: priceRange.max,
            sortBy: 'newest' as const
        }
        setFilters(defaultFilters)
        onFilterChange(defaultFilters)
    }, [priceRange, onFilterChange])

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
                {searchQuery && (
                    <button
                        onClick={() => handleSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-4 w-4 text-gray-400" />
                    </button>
                )}
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                >
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                {filters.category !== 'all' || filters.priceMin !== priceRange.min || filters.priceMax !== priceRange.max ? (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                        Clear all
                    </button>
                ) : null}
            </div>

            {/* Filter Panel */}
            {isFilterOpen && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg space-y-6 animate-in slide-in-from-top-2 duration-200">
                    {/* Category Filter */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => handleFilterChange({ category: 'all' })}
                                className={`px-3 py-2 text-sm rounded-lg transition-colors ${filters.category === 'all'
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                All Categories
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => handleFilterChange({ category })}
                                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${filters.category === category
                                            ? 'bg-primary text-white'
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
                                        value={filters.priceMin}
                                        onChange={(e) => handleFilterChange({ priceMin: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        min={priceRange.min}
                                        max={filters.priceMax}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs text-gray-600 mb-1">Max Price</label>
                                    <input
                                        type="number"
                                        value={filters.priceMax}
                                        onChange={(e) => handleFilterChange({ priceMax: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        min={filters.priceMin}
                                        max={priceRange.max}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>${filters.priceMin}</span>
                                <div className="flex-1 h-px bg-gray-200"></div>
                                <span>${filters.priceMax}</span>
                            </div>
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Sort By</h3>
                        <select
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange({ sortBy: e.target.value as FilterOptions['sortBy'] })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name-asc">Name: A to Z</option>
                            <option value="name-desc">Name: Z to A</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    )
}