import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';

export interface LocationData {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    displayName: string;
    timezone?: string;
}

export interface UserContext {
    preferences?: {
        categories: string[];
        priceRange: { min: number; max: number };
        brandPreferences: string[];
    };
    behavior?: {
        previousSearches: string[];
        viewedProducts: string[];
        purchaseHistory: string[];
        sessionDuration: number;
        pageViews: number;
        lastVisit: Date;
    };
    device?: {
        os: string;
        browser: string;
        deviceType: 'mobile' | 'desktop' | 'tablet';
        screenResolution: string;
        language: string;
    };
}

export interface AIRecommendation {
    productId: string;
    title: string;
    category: string | null;
    price: number;
    rating: number | null;
    relevanceScore: number;
    reasoning: any;
    matchFactors: string[];
    estimatedDemand: number;
    competitiveAdvantage: string;
    image?: string | null;
}

export interface TrendingProduct {
    id: string;
    title: string;
    category: string | null;
    price: number;
    rating: number | null;
    soldCount: number;
    trendReason: string;
    image?: string | null;
}

export interface SeasonalProduct {
    id: string;
    title: string;
    category: string | null;
    price: number;
    rating: number | null;
    soldCount: number;
    seasonalReason: string;
    image?: string | null;
}

export interface MarketInsights {
    trendingCategories: Array<{
        category: string;
        productCount: number;
        avgPrice: number;
        avgRating: number;
        totalSales: number;
    }>;
    marketOpportunities: Array<{
        category: string;
        opportunity: string;
        potential: string;
    }>;
    location: {
        city: string;
        country: string;
        marketSize: string;
        competitionLevel: string;
    };
}

export interface LocationRecommendationsData {
    recommendations: AIRecommendation[];
    trendingProducts: TrendingProduct[];
    seasonalProducts: SeasonalProduct[];
    marketInsights: MarketInsights;
    userContext: UserContext;
}

export function useLocationRecommendations() {
    const { user } = useAuth();
    const [location, setLocation] = useState<LocationData | null>(null);
    const [userContext, setUserContext] = useState<UserContext | null>(null);
    const [recommendations, setRecommendations] = useState<LocationRecommendationsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [locationLoading, setLocationLoading] = useState(false);

    // Get user's current location
    const getUserLocation = useCallback(async () => {
        setLocationLoading(true);
        setError(null);

        try {
            if (navigator.geolocation) {
                return new Promise<LocationData>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            try {
                                const { latitude, longitude } = position.coords;
                                const locationData = await getLocationFromCoords(latitude, longitude);
                                setLocation(locationData);
                                resolve(locationData);
                            } catch (err) {
                                reject(err);
                            }
                        },
                        (error) => {
                            console.log('Geolocation error:', error);
                            // Fallback to IP-based location
                            getLocationFromIP().then(resolve).catch(reject);
                        },
                        {
                            enableHighAccuracy: false,
                            timeout: 10000,
                            maximumAge: 600000 // 10 minutes
                        }
                    );
                });
            } else {
                // Fallback to IP-based location
                return await getLocationFromIP();
            }
        } catch (err) {
            console.error('Error getting location:', err);
            // Final fallback to IP-based location
            return await getLocationFromIP();
        } finally {
            setLocationLoading(false);
        }
    }, []);

    // Get location from coordinates using reverse geocoding
    const getLocationFromCoords = async (lat: number, lon: number): Promise<LocationData> => {
        try {
            // Try OpenWeatherMap reverse geocoding first
            const weatherApiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
            if (weatherApiKey && weatherApiKey !== 'demo') {
                const response = await fetch(
                    `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${weatherApiKey}`
                );
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
            }

            // Fallback to basic coordinates
            return {
                city: 'Unknown',
                country: 'Unknown',
                latitude: lat,
                longitude: lon,
                displayName: `${lat.toFixed(2)}, ${lon.toFixed(2)}`
            };
        } catch (error) {
            console.error('Error getting location from coordinates:', error);
            return {
                city: 'Unknown',
                country: 'Unknown',
                latitude: lat,
                longitude: lon,
                displayName: `${lat.toFixed(2)}, ${lon.toFixed(2)}`
            };
        }
    };

    // Get location from IP address
    const getLocationFromIP = async (): Promise<LocationData> => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();

            const locationData: LocationData = {
                city: data.city || 'Unknown',
                country: data.country_name || 'Unknown',
                latitude: data.latitude || 0,
                longitude: data.longitude || 0,
                displayName: `${data.city || 'Unknown'}, ${data.country_name || 'Unknown'}`,
                timezone: data.timezone
            };

            setLocation(locationData);
            return locationData;
        } catch (error) {
            console.error('Error getting location from IP:', error);
            // Return default location
            const defaultLocation: LocationData = {
                city: 'Unknown',
                country: 'Unknown',
                latitude: 0,
                longitude: 0,
                displayName: 'Location unavailable'
            };
            setLocation(defaultLocation);
            return defaultLocation;
        }
    };

    // Build user context from available data
    const buildUserContext = useCallback((): UserContext => {
        const context: UserContext = {
            preferences: {
                categories: [],
                priceRange: { min: 0, max: 1000 },
                brandPreferences: []
            },
            behavior: {
                previousSearches: [],
                viewedProducts: [],
                purchaseHistory: [],
                sessionDuration: 0,
                pageViews: 0,
                lastVisit: new Date()
            },
            device: {
                os: getOperatingSystem(),
                browser: getBrowser(),
                deviceType: getDeviceType(),
                screenResolution: getScreenResolution(),
                language: navigator.language || 'en-US'
            }
        };

        // If user is authenticated, try to get preferences from localStorage or user profile
        if (user) {
            try {
                const storedPreferences = localStorage.getItem('userPreferences');
                if (storedPreferences) {
                    const parsed = JSON.parse(storedPreferences);
                    context.preferences = { ...context.preferences, ...parsed };
                }

                const storedBehavior = localStorage.getItem('userBehavior');
                if (storedBehavior) {
                    const parsed = JSON.parse(storedBehavior);
                    context.behavior = { ...context.behavior, ...parsed };
                }
            } catch (error) {
                console.error('Error parsing stored user data:', error);
            }
        }

        return context;
    }, [user]);

    // Get location-based recommendations
    const getRecommendations = useCallback(async (
        searchQuery: string = '',
        limit: number = 20,
        includeTrending: boolean = true,
        includeSeasonal: boolean = true
    ) => {
        if (!location) {
            setError('Location not available');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const context = buildUserContext();
            setUserContext(context);

            const response = await fetch('/api/recommendations/location-based', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    location,
                    userContext: context,
                    searchQuery,
                    limit,
                    includeTrending,
                    includeSeasonal
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setRecommendations(data.data);

                // Store recommendations in localStorage for offline access
                localStorage.setItem('lastRecommendations', JSON.stringify({
                    data: data.data,
                    timestamp: Date.now(),
                    location: location.displayName
                }));
            } else {
                throw new Error(data.error || 'Failed to get recommendations');
            }
        } catch (err) {
            console.error('Error getting recommendations:', err);
            setError(err instanceof Error ? err.message : 'Failed to get recommendations');

            // Try to load cached recommendations
            try {
                const cached = localStorage.getItem('lastRecommendations');
                if (cached) {
                    const parsed = JSON.parse(cached);
                    const cacheAge = Date.now() - parsed.timestamp;

                    // Use cache if it's less than 1 hour old
                    if (cacheAge < 3600000) {
                        setRecommendations(parsed.data);
                        setError('Using cached recommendations (offline mode)');
                    }
                }
            } catch (cacheError) {
                console.error('Error loading cached recommendations:', cacheError);
            }
        } finally {
            setLoading(false);
        }
    }, [location, buildUserContext]);

    // Update user preferences
    const updateUserPreferences = useCallback((preferences: Partial<UserContext['preferences']>) => {
        if (userContext?.preferences) {
            const updatedPreferences = { ...userContext.preferences, ...preferences };
            setUserContext(prev => prev ? { ...prev, preferences: updatedPreferences } : null);

            // Store in localStorage
            try {
                localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
            } catch (error) {
                console.error('Error storing user preferences:', error);
            }
        }
    }, [userContext]);

    // Track user behavior
    const trackUserBehavior = useCallback((behavior: Partial<UserContext['behavior']>) => {
        if (userContext?.behavior) {
            const updatedBehavior = { ...userContext.behavior, ...behavior };
            setUserContext(prev => prev ? { ...prev, behavior: updatedBehavior } : null);

            // Store in localStorage
            try {
                localStorage.setItem('userBehavior', JSON.stringify(updatedBehavior));
            } catch (error) {
                console.error('Error storing user behavior:', error);
            }
        }
    }, [userContext]);

    // Initialize location and context on mount
    useEffect(() => {
        getUserLocation();
        const context = buildUserContext();
        setUserContext(context);
    }, [getUserLocation, buildUserContext]);

    // Helper functions for device detection
    const getOperatingSystem = (): string => {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Windows')) return 'Windows';
        if (userAgent.includes('Mac')) return 'macOS';
        if (userAgent.includes('Linux')) return 'Linux';
        if (userAgent.includes('Android')) return 'Android';
        if (userAgent.includes('iOS')) return 'iOS';
        return 'Unknown';
    };

    const getBrowser = (): string => {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        return 'Unknown';
    };

    const getDeviceType = (): 'mobile' | 'desktop' | 'tablet' => {
        const userAgent = navigator.userAgent;
        if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
            if (/iPad/.test(userAgent)) return 'tablet';
            return 'mobile';
        }
        return 'desktop';
    };

    const getScreenResolution = (): string => {
        return `${screen.width}x${screen.height}`;
    };

    return {
        // State
        location,
        userContext,
        recommendations,
        loading,
        error,
        locationLoading,

        // Actions
        getUserLocation,
        getRecommendations,
        updateUserPreferences,
        trackUserBehavior,

        // Computed
        hasLocation: !!location,
        hasRecommendations: !!recommendations,
        isReady: !!location && !!userContext
    };
}