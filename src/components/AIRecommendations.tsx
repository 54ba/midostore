'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../app/contexts/AuthContext';
import { useLocalization } from '../app/contexts/LocalizationContext';
import { Heart, ShoppingCart, Eye, Star, TrendingUp } from 'lucide-react';
import Image from 'next/image';

interface RecommendationResult {
    item_id: string;
    score: number;
    rank: number;
    type?: 'personalized' | 'popular' | 'similar';
    confidence?: number;
}

interface Product {
    id: string;
    externalId: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    images: string[];
    rating: number;
    reviewCount: number;
    soldCount: number;
    category: string;
    tags: string[];
}

interface AIRecommendationsProps {
    type?: 'personalized' | 'popular' | 'similar';
    category?: string;
    nItems?: number;
    sourceProductId?: string;
    showTitle?: boolean;
    className?: string;
}

export default function AIRecommendations({
    type = 'personalized',
    category = 'all',
    nItems = 8,
    sourceProductId,
    showTitle = true,
    className = ''
}: AIRecommendationsProps) {
    const { user } = useAuth();
    const { formatPrice, t } = useLocalization();
    const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [interactionLoading, setInteractionLoading] = useState<string | null>(null);

    const fetchProductDetails = useCallback(async () => {
        try {
            const productIds = recommendations.map(r => r.item_id);
            const response = await fetch(`/api/products?ids=${productIds.join(',')}`);

            if (!response.ok) throw new Error('Failed to fetch product details');

            const data = await response.json();
            setProducts(data.data || []);
        } catch (err) {
            console.error('Error fetching product details:', err);
        }
    }, [recommendations]);

    const fetchRecommendations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            let url = `/api/recommendations?type=${type}&nItems=${nItems}&category=${category}`;

            if (type === 'personalized' && user?.user_id) {
                url += `&userId=${user.user_id}`;
            }

            if (type === 'similar' && sourceProductId) {
                // For similar items, we'll use the POST endpoint
                const response = await fetch('/api/recommendations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'similar',
                        productId: sourceProductId,
                        nItems
                    })
                });

                if (!response.ok) throw new Error('Failed to fetch similar items');

                const data = await response.json();
                setRecommendations(data.data.recommendations);
            } else {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Failed to fetch recommendations');

                const data = await response.json();
                setRecommendations(data.data.recommendations);
            }

            // Fetch product details for recommendations
            if (recommendations.length > 0) {
                await fetchProductDetails();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
            console.error('Error fetching recommendations:', err);
        } finally {
            setLoading(false);
        }
    }, [type, category, nItems, sourceProductId, user?.user_id, recommendations.length, fetchProductDetails]);

    useEffect(() => {
        fetchRecommendations();
    }, [fetchRecommendations]);

    // Initialize guest session for tracking
    useEffect(() => {
        if (!user?.user_id && !localStorage.getItem('guestSessionId')) {
            localStorage.setItem('guestSessionId', `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
        }
    }, [user?.user_id]);

    const recordInteraction = async (productId: string, interactionType: 'view' | 'like' | 'cart') => {
        // For guest users, we can't record interactions, but we can still show the UI
        if (!user?.user_id) {
            console.log('👤 Guest user interaction:', { productId, interactionType });

            // Store guest interactions in localStorage for potential future use
            try {
                const guestInteractions = JSON.parse(localStorage.getItem('guestInteractions') || '[]');
                guestInteractions.push({
                    productId,
                    type: interactionType,
                    timestamp: new Date().toISOString(),
                    sessionId: localStorage.getItem('guestSessionId') || `guest_${Date.now()}`
                });
                localStorage.setItem('guestInteractions', JSON.stringify(guestInteractions));

                // Show a subtle notification for guest interactions
                if (interactionType === 'like') {
                    alert(t('productAddedToFavorites'));
                } else if (interactionType === 'cart') {
                    alert(t('productAddedToCart'));
                }
            } catch (error) {
                console.error('Error storing guest interaction:', error);
            }
            return;
        }

        try {
            setInteractionLoading(productId);

            await fetch('/api/recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'interaction',
                    user_id: user.user_id,
                    product_id: productId,
                    type: interactionType,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: 'recommendations',
                        recommendation_type: type
                    }
                })
            });
        } catch (err) {
            console.error('Error recording interaction:', err);
        } finally {
            setInteractionLoading(null);
        }
    };

    const getTitle = () => {
        switch (type) {
            case 'personalized':
                return user?.user_id ? t('recommendedForYou') : t('popularProductsForYou');
            case 'popular':
                return t('popularProducts');
            case 'similar':
                return t('similarProducts');
            default:
                return t('productRecommendations');
        }
    };

    const getRecommendationTypeIcon = (recType?: string) => {
        switch (recType) {
            case 'personalized':
                return <TrendingUp className="w-4 h-4 text-blue-500" />;
            case 'popular':
                return <Star className="w-4 h-4 text-yellow-500" />;
            case 'similar':
                return <Eye className="w-4 h-4 text-green-500" />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className={`${className} space-y-4`}>
                {showTitle && (
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: nItems }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 h-48 rounded-lg mb-2"></div>
                            <div className="bg-gray-200 h-4 rounded mb-1"></div>
                            <div className="bg-gray-200 h-3 rounded w-2/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${className} text-center py-8`}>
                <div className="text-red-500 mb-4">
                    <p className="text-lg font-semibold">Failed to load recommendations</p>
                    <p className="text-sm">{error}</p>
                </div>
                <button
                    onClick={fetchRecommendations}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (recommendations.length === 0) {
        return (
            <div className={`${className} text-center py-8`}>
                <p className="text-gray-500">No recommendations available at the moment.</p>
            </div>
        );
    }

    return (
        <div className={className}>
            {showTitle && (
                <div className="flex items-center gap-2 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
                    {getRecommendationTypeIcon(type)}
                </div>
            )}

            {/* Guest User Notice */}
            {!user?.user_id && type === 'personalized' && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 text-sm font-semibold">ℹ️</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-blue-900 mb-1">
                                {t('signInForPersonalizedRecommendations')}
                            </h3>
                            <p className="text-sm text-blue-700">
                                {t('currentlyShowingPopular')}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendations.map((recommendation) => {
                    const product = products.find(p => p.externalId === recommendation.item_id);

                    if (!product) return null;

                    return (
                        <div
                            key={recommendation.item_id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* Product Image */}
                            <div className="relative h-48 bg-gray-100">
                                {product.images && product.images[0] ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                        width={300}
                                        height={192}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/placeholder-product.jpg';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <span>No Image</span>
                                    </div>
                                )}

                                {/* Recommendation Score Badge */}
                                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                    {recommendation.score.toFixed(2)}
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                    {product.title}
                                </h3>

                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-sm text-gray-600 ml-1">
                                            {product.rating.toFixed(1)}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        ({product.reviewCount})
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-lg font-bold text-gray-900">
                                        {formatPrice(product.price)}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {product.currency}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => recordInteraction(product.externalId, 'view')}
                                        disabled={interactionLoading === product.externalId}
                                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        <Eye className="w-4 h-4 inline mr-1" />
                                        View
                                    </button>

                                    {user?.user_id ? (
                                        <>
                                            <button
                                                onClick={() => recordInteraction(product.externalId, 'like')}
                                                disabled={interactionLoading === product.externalId}
                                                className="p-2 text-gray-600 hover:text-red-500 transition-colors disabled:opacity-50"
                                                title="Add to favorites"
                                            >
                                                <Heart className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => recordInteraction(product.externalId, 'cart')}
                                                disabled={interactionLoading === product.externalId}
                                                className="p-2 text-gray-600 hover:text-green-500 transition-colors disabled:opacity-50"
                                                title="Add to cart"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex gap-1">
                                            <button
                                                className="p-2 text-gray-400 cursor-not-allowed"
                                                title={t('signInToLikeProducts')}
                                            >
                                                <Heart className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-2 text-gray-400 cursor-not-allowed"
                                                title={t('signInToAddToCart')}
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Recommendation Metadata */}
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>Rank #{recommendation.rank}</span>
                                        <span className="capitalize">{recommendation.type || 'recommended'}</span>
                                    </div>
                                    {recommendation.confidence && (
                                        <div className="text-xs text-gray-400 mt-1">
                                            Confidence: {(recommendation.confidence * 100).toFixed(1)}%
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}