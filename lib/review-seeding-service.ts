import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

export interface ReviewTemplate {
    rating: number;
    title: string;
    content: string;
    helpful: number;
    verified: boolean;
}

export class ReviewSeedingService {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    // Generate realistic review content based on product category and rating
    private generateReviewContent(
        category: string,
        rating: number,
        productTitle: string
    ): { title: string; content: string } {
        const positivePhrases = [
            'Great quality for the price',
            'Exactly as described',
            'Fast shipping',
            'Very satisfied with purchase',
            'Highly recommend',
            'Excellent product',
            'Better than expected',
            'Good value for money',
            'Well made',
            'Perfect for my needs'
        ];

        const neutralPhrases = [
            'Product is okay',
            'Decent quality',
            'As expected',
            'Satisfactory',
            'Meets basic requirements',
            'Average quality',
            'Could be better',
            'Not bad for the price',
            'Acceptable',
            'Standard quality'
        ];

        const negativePhrases = [
            'Not as described',
            'Poor quality',
            'Disappointed',
            'Would not recommend',
            'Cheap materials',
            'Slow shipping',
            'Not worth the price',
            'Below expectations',
            'Defective item',
            'Waste of money'
        ];

        const categorySpecificPhrases: Record<string, string[]> = {
            electronics: [
                'Good battery life',
                'Fast performance',
                'Easy to use',
                'Compact design',
                'Good sound quality',
                'Reliable connection',
                'Modern features',
                'User-friendly interface'
            ],
            clothing: [
                'Comfortable fit',
                'Good material',
                'True to size',
                'Nice design',
                'Good stitching',
                'Breathable fabric',
                'Stylish look',
                'Durable construction'
            ],
            home: [
                'Good craftsmanship',
                'Easy to assemble',
                'Sturdy construction',
                'Nice finish',
                'Good functionality',
                'Space efficient',
                'Modern design',
                'Easy to clean'
            ]
        };

        let phrases: string[];
        if (rating >= 4) {
            phrases = [...positivePhrases, ...(categorySpecificPhrases[category] || [])];
        } else if (rating >= 3) {
            phrases = [...neutralPhrases, ...(categorySpecificPhrases[category] || [])];
        } else {
            phrases = negativePhrases;
        }

        // Generate title
        const title = faker.helpers.arrayElement(phrases);

        // Generate content with multiple sentences
        const contentParts: string[] = [];

        // Add main review
        contentParts.push(title);

        // Add additional context
        if (rating >= 4) {
            contentParts.push(
                `I bought this ${productTitle.toLowerCase()} and I'm really happy with it.`,
                `The quality is excellent and it works perfectly.`,
                `Shipping was fast and the packaging was secure.`,
                `I would definitely buy from this seller again.`
            );
        } else if (rating >= 3) {
            contentParts.push(
                `This ${productTitle.toLowerCase()} is okay for the price.`,
                `Quality is decent but could be better.`,
                `Shipping took a bit longer than expected.`,
                `Overall satisfied but not amazing.`
            );
        } else {
            contentParts.push(
                `I'm disappointed with this ${productTitle.toLowerCase()}.`,
                `The quality is poor and not as described.`,
                `Shipping was slow and the item arrived damaged.`,
                `I would not recommend this product.`
            );
        }

        // Add some variety with random phrases
        const randomPhrase = faker.helpers.arrayElement(phrases);
        if (!contentParts.includes(randomPhrase)) {
            contentParts.push(randomPhrase);
        }

        return {
            title: title.length > 50 ? title.substring(0, 50) + '...' : title,
            content: contentParts.join(' ')
        };
    }

    // Generate realistic reviewer names
    private generateReviewerName(): string {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();

        // Sometimes use just first name, sometimes full name, sometimes initials
        const nameStyle = faker.helpers.arrayElement(['first', 'full', 'initials']);

        switch (nameStyle) {
            case 'first':
                return firstName;
            case 'full':
                return `${firstName} ${lastName}`;
            case 'initials':
                return `${firstName[0]}. ${lastName[0]}.`;
            default:
                return firstName;
        }
    }

    // Generate reviews for a specific product
    async generateReviewsForProduct(
        productId: string,
        productTitle: string,
        category: string,
        reviewCount: number,
        source: 'alibaba' | 'aliexpress' | 'generated' = 'generated'
    ): Promise<void> {
        console.log(`📝 Generating ${reviewCount} reviews for product: ${productTitle}`);

        const reviews: any[] = [];

        // Generate rating distribution (more positive reviews, fewer negative ones)
        const ratingDistribution = {
            5: Math.floor(reviewCount * 0.6), // 60% 5-star
            4: Math.floor(reviewCount * 0.25), // 25% 4-star
            3: Math.floor(reviewCount * 0.1), // 10% 3-star
            2: Math.floor(reviewCount * 0.03), // 3% 2-star
            1: Math.floor(reviewCount * 0.02), // 2% 1-star
        };

        let currentCount = 0;

        for (const [rating, count] of Object.entries(ratingDistribution)) {
            const ratingNum = parseInt(rating);
            const actualCount = Math.min(count, reviewCount - currentCount);

            for (let i = 0; i < actualCount; i++) {
                const { title, content } = this.generateReviewContent(
                    category,
                    ratingNum,
                    productTitle
                );

                const review = {
                    productId,
                    reviewerName: this.generateReviewerName(),
                    rating: ratingNum,
                    title,
                    content,
                    helpful: faker.number.int({ min: 0, max: 15 }),
                    verified: faker.datatype.boolean({ probability: 0.7 }),
                    source,
                    externalId: source === 'generated' ? null : faker.string.uuid(),
                };

                reviews.push(review);
                currentCount++;
            }
        }

        // Shuffle reviews to make them appear more natural
        const shuffledReviews = faker.helpers.shuffle(reviews);

        // Create reviews in batches
        const batchSize = 50;
        for (let i = 0; i < shuffledReviews.length; i += batchSize) {
            const batch = shuffledReviews.slice(i, i + batchSize);
            await this.prisma.review.createMany({
                data: batch,
                skipDuplicates: true,
            });
        }

        // Update product review count and rating
        const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

        await this.prisma.product.update({
            where: { id: productId },
            data: {
                reviewCount: reviews.length,
                rating: parseFloat(avgRating.toFixed(1)),
            },
        });

        console.log(`✅ Generated ${reviews.length} reviews with average rating: ${avgRating.toFixed(1)}`);
    }

    // Generate reviews for all products in the database
    async generateReviewsForAllProducts(
        reviewsPerProduct: number = 15,
        source: 'alibaba' | 'aliexpress' | 'generated' = 'generated'
    ): Promise<void> {
        console.log('🚀 Starting review generation for all products...');

        const products = await this.prisma.product.findMany({
            select: {
                id: true,
                title: true,
                category: true,
                reviewCount: true,
            },
        });

        console.log(`📦 Found ${products.length} products to generate reviews for`);

        for (const product of products) {
            // Skip products that already have reviews
            if (product.reviewCount > 0) {
                console.log(`⏭️ Skipping ${product.title} - already has ${product.reviewCount} reviews`);
                continue;
            }

            try {
                await this.generateReviewsForProduct(
                    product.id,
                    product.title,
                    product.category || 'general',
                    reviewsPerProduct,
                    source
                );
            } catch (error) {
                console.error(`❌ Failed to generate reviews for ${product.title}:`, error);
            }
        }

        console.log('🎉 Review generation completed for all products!');
    }

    // Generate reviews for specific categories
    async generateReviewsForCategory(
        category: string,
        reviewsPerProduct: number = 15,
        source: 'alibaba' | 'aliexpress' | 'generated' = 'generated'
    ): Promise<void> {
        console.log(`🎯 Generating reviews for category: ${category}`);

        const products = await this.prisma.product.findMany({
            where: { category },
            select: {
                id: true,
                title: true,
                category: true,
                reviewCount: true,
            },
        });

        console.log(`📦 Found ${products.length} products in category: ${category}`);

        for (const product of products) {
            if (product.reviewCount > 0) {
                console.log(`⏭️ Skipping ${product.title} - already has reviews`);
                continue;
            }

            try {
                await this.generateReviewsForProduct(
                    product.id,
                    product.title,
                    product.category || 'general',
                    reviewsPerProduct,
                    source
                );
            } catch (error) {
                console.error(`❌ Failed to generate reviews for ${product.title}:`, error);
            }
        }

        console.log(`✅ Review generation completed for category: ${category}`);
    }
}