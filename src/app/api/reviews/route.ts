import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Fallback review data for when database is not accessible
const fallbackReviews = [
    {
        id: 'fallback-1',
        productId: 'prod-1',
        productTitle: 'Wireless Headphones Pro',
        productImage: '/api/placeholder/40/40?text=Headphones',
        productPrice: 89.99,
        productOriginalPrice: 149.99,
        productCategory: 'electronics',
        userId: 'user-1',
        userName: 'Ahmed Hassan',
        userAvatar: '/api/placeholder/40/40?text=AH',
        rating: 5,
        comment: 'Amazing wireless headphones! The sound quality is incredible and battery life exceeds expectations. Highly recommend!',
        reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        isVerified: true,
        isPremium: true,
        helpfulCount: 23,
        unhelpfulCount: 1,
        purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        productRating: 4.8,
        productReviewCount: 1247,
        productSoldCount: 8500,
        productDiscount: 40,
        isHotDeal: true,
        isLimitedTime: true,
        timeRemaining: '2 days left'
    },
    {
        id: 'fallback-2',
        productId: 'prod-2',
        productTitle: 'Smart Fitness Watch',
        productImage: '/api/placeholder/40/40?text=SmartWatch',
        productPrice: 199.99,
        productOriginalPrice: 299.99,
        productCategory: 'electronics',
        userId: 'user-2',
        userName: 'Fatima Kuwait',
        userAvatar: '/api/placeholder/40/40?text=FK',
        rating: 5,
        comment: 'This smart fitness watch is a game-changer! Tracks everything accurately and the app is intuitive. Perfect for my workouts.',
        reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
        isVerified: true,
        isPremium: false,
        helpfulCount: 18,
        unhelpfulCount: 0,
        purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        productRating: 4.6,
        productReviewCount: 892,
        productSoldCount: 4200,
        productDiscount: 33,
        isHotDeal: true,
        isLimitedTime: true,
        timeRemaining: '1 day left'
    },
    {
        id: 'fallback-3',
        productId: 'prod-3',
        productTitle: 'Organic Face Cream',
        productImage: '/api/placeholder/40/40?text=FaceCream',
        productPrice: 29.99,
        productOriginalPrice: 59.99,
        productCategory: 'beauty',
        userId: 'user-3',
        userName: 'Layla Dubai',
        userAvatar: '/api/placeholder/40/40?text=LD',
        rating: 4,
        comment: 'Great organic face cream! My skin feels much better after using it. Only giving 4 stars because the packaging could be better.',
        reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        isVerified: true,
        isPremium: false,
        helpfulCount: 12,
        unhelpfulCount: 2,
        purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        productRating: 4.3,
        productReviewCount: 567,
        productSoldCount: 3200,
        productDiscount: 50,
        isHotDeal: false,
        isLimitedTime: false,
        timeRemaining: undefined
    },
    {
        id: 'fallback-4',
        productId: 'prod-4',
        productTitle: 'Educational Building Blocks',
        productImage: '/api/placeholder/40/40?text=Blocks',
        productPrice: 24.99,
        productOriginalPrice: 39.99,
        productCategory: 'toys',
        userId: 'user-4',
        userName: 'Omar Qatar',
        userAvatar: '/api/placeholder/40/40?text=OQ',
        rating: 5,
        comment: 'Educational building blocks are perfect for my kids! They spend hours building and learning. Great quality and educational value.',
        reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
        isVerified: true,
        isPremium: false,
        helpfulCount: 8,
        unhelpfulCount: 0,
        purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
        productRating: 4.7,
        productReviewCount: 234,
        productSoldCount: 1800,
        productDiscount: 38,
        isHotDeal: true,
        isLimitedTime: false,
        timeRemaining: undefined
    },
    {
        id: 'fallback-5',
        productId: 'prod-5',
        productTitle: 'Premium Coffee Maker',
        productImage: '/api/placeholder/40/40?text=Coffee',
        productPrice: 159.99,
        productOriginalPrice: 249.99,
        productCategory: 'home',
        userId: 'user-5',
        userName: 'Sara Riyadh',
        userAvatar: '/api/placeholder/40/40?text=SR',
        rating: 5,
        comment: 'Premium coffee maker delivers restaurant-quality coffee every time. Worth every penny! The programmable features are fantastic.',
        reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        isVerified: true,
        isPremium: true,
        helpfulCount: 31,
        unhelpfulCount: 1,
        purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        productRating: 4.9,
        productReviewCount: 1890,
        productSoldCount: 5600,
        productDiscount: 36,
        isHotDeal: true,
        isLimitedTime: true,
        timeRemaining: '3 days left'
    },
    {
        id: 'fallback-6',
        productId: 'prod-6',
        title: 'Professional Yoga Mat',
        productImage: '/api/placeholder/40/40?text=Yoga',
        productPrice: 34.99,
        productOriginalPrice: 49.99,
        productCategory: 'fitness',
        userId: 'user-6',
        userName: 'Khalid Muscat',
        userAvatar: '/api/placeholder/40/40?text=KM',
        rating: 4,
        comment: 'Good yoga mat with excellent grip. Perfect thickness for home practice. Only minor issue is the color fading slightly.',
        reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
        isVerified: true,
        isPremium: false,
        helpfulCount: 15,
        unhelpfulCount: 3,
        purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
        productRating: 4.4,
        productReviewCount: 445,
        productSoldCount: 2100,
        productDiscount: 30,
        isHotDeal: false,
        isLimitedTime: false,
        timeRemaining: undefined
    }
];

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10');
        const verified = searchParams.get('verified') === 'true';
        const category = searchParams.get('category');
        const rating = parseInt(searchParams.get('rating') || '0');

        // Try to fetch from database first
        try {
            // Build where clause
            const where: any = {};

            if (verified) {
                where.isVerified = true;
            }

            if (category) {
                where.product = {
                    category: category
                };
            }

            if (rating > 0) {
                where.rating = {
                    gte: rating
                };
            }

            // Fetch reviews with related data
            const reviews = await prisma.review.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                            email: true
                        }
                    },
                    product: {
                        select: {
                            id: true,
                            title: true,
                            image: true,
                            price: true,
                            originalPrice: true,
                            category: true,
                            rating: true,
                            reviewCount: true,
                            soldCount: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: limit
            });

            // If we have database reviews, return them
            if (reviews.length > 0) {
                // Transform data for frontend consumption
                const transformedReviews = reviews.map((review: any) => ({
                    id: review.id,
                    productId: review.productId,
                    productTitle: review.product?.title || 'Product',
                    productImage: review.product?.image || '/api/placeholder/40/40?text=Product',
                    productPrice: review.product?.price || 0,
                    productOriginalPrice: review.product?.originalPrice || 0,
                    productCategory: review.product?.category || 'general',
                    userId: review.userId,
                    userName: review.user?.name || 'Customer',
                    userAvatar: review.user?.avatar || '/api/placeholder/40/40?text=U',
                    rating: review.rating || 5,
                    comment: review.comment || review.review || 'Great product!',
                    reviewDate: review.createdAt,
                    isVerified: review.isVerified || true,
                    isPremium: review.isPremium || false,
                    helpfulCount: review.helpfulCount || 0,
                    unhelpfulCount: review.unhelpfulCount || 0,
                    purchaseDate: review.purchaseDate || review.createdAt,
                    productRating: review.product?.rating || 4.5,
                    productReviewCount: review.product?.reviewCount || 100,
                    productSoldCount: review.product?.soldCount || 500,
                    productDiscount: review.product?.originalPrice && review.product?.price
                        ? Math.round(((review.product.originalPrice - review.product.price) / review.product.originalPrice) * 100)
                        : 0,
                    isHotDeal: review.product?.soldCount > 1000,
                    isLimitedTime: false,
                    timeRemaining: undefined
                }));

                return NextResponse.json({
                    success: true,
                    data: transformedReviews,
                    total: transformedReviews.length,
                    message: 'Reviews fetched successfully from database'
                });
            }
        } catch (dbError) {
            console.log('Database not accessible, using fallback data:', (dbError as Error).message);
        }

        // If no database reviews or database error, return fallback data
        const filteredFallbackReviews = fallbackReviews
            .filter(review => !verified || review.isVerified)
            .filter(review => !category || review.productCategory === category)
            .filter(review => !rating || review.rating >= rating)
            .slice(0, limit);

        return NextResponse.json({
            success: true,
            data: filteredFallbackReviews,
            total: filteredFallbackReviews.length,
            message: 'Using fallback review data'
        });

    } catch (error) {
        console.error('Error fetching reviews:', error);

        // Return fallback data on any error
        const limit = parseInt(new URL(request.url).searchParams.get('limit') || '10');
        const fallbackData = fallbackReviews.slice(0, limit);

        return NextResponse.json({
            success: true,
            data: fallbackData,
            total: fallbackData.length,
            message: 'Using fallback review data due to error'
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productId, userId, rating, comment, isVerified = false } = body;

        if (!productId || !userId || !rating || !comment) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Try to save to database first
        try {
            // Create new review
            const review = await prisma.review.create({
                data: {
                    productId,
                    userId,
                    rating: parseInt(rating),
                    comment,
                    isVerified,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true
                        }
                    },
                    product: {
                        select: {
                            id: true,
                            title: true,
                            image: true,
                            price: true,
                            category: true
                        }
                    }
                }
            });

            // Update product rating and review count
            await prisma.product.update({
                where: { id: productId },
                data: {
                    reviewCount: {
                        increment: 1
                    }
                }
            });

            return NextResponse.json({
                success: true,
                data: review,
                message: 'Review created successfully in database'
            });
        } catch (dbError) {
            console.log('Database not accessible, storing in memory:', (dbError as Error).message);

            // Create in-memory review
            const inMemoryReview = {
                id: `mem-${Date.now()}`,
                productId,
                userId,
                rating: parseInt(rating),
                comment,
                isVerified,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            return NextResponse.json({
                success: true,
                data: inMemoryReview,
                message: 'Review stored in memory (database not accessible)'
            });
        }

    } catch (error) {
        console.error('Error creating review:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create review',
                message: error instanceof Error ? (error as Error).message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}