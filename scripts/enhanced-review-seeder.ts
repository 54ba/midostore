#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { ReviewSeedingService } from '../lib/review-seeding-service';
import { AlibabaReviewService } from '../lib/alibaba-review-service';

const prisma = new PrismaClient();
const reviewService = new ReviewSeedingService(prisma);
const alibabaService = new AlibabaReviewService(prisma);

async function main() {
    console.log('🚀 Enhanced Review Seeder - Choose your review source!');

    try {
        const args = process.argv.slice(2);
        const command = args[0];
        const source = (args[1] as 'faker' | 'alibaba' | 'aliexpress' | 'mixed') || 'mixed';
        const category = args[2];
        const reviewsPerProduct = parseInt(args[3]) || 15;

        console.log(`📋 Command: ${command}`);
        console.log(`🏷️ Source: ${source}`);
        console.log(`📊 Reviews per product: ${reviewsPerProduct}`);

        switch (command) {
            case 'all':
                await handleAllProducts(source, reviewsPerProduct);
                break;

            case 'category':
                if (!category) {
                    console.error('❌ Category is required for category command');
                    showUsage();
                    process.exit(1);
                }
                await handleCategory(category, source, reviewsPerProduct);
                break;

            case 'product':
                const productId = args[1];
                if (!productId) {
                    console.error('❌ Product ID is required for product command');
                    showUsage();
                    process.exit(1);
                }
                await handleSingleProduct(productId, source, reviewsPerProduct);
                break;

            case 'import':
                await handleImport(source, reviewsPerProduct);
                break;

            default:
                showUsage();
                process.exit(1);
        }

        console.log('✅ Enhanced review seeding completed successfully!');

    } catch (error) {
        console.error('❌ Enhanced review seeding failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

async function handleAllProducts(source: string, reviewsPerProduct: number) {
    console.log('🚀 Generating reviews for all products...');

    const products = await prisma.product.findMany({
        select: {
            id: true,
            title: true,
            category: true,
            reviewCount: true,
            source: true,
        },
    });

    console.log(`📦 Found ${products.length} products to generate reviews for`);

    for (const product of products) {
        if (product.reviewCount > 0) {
            console.log(`⏭️ Skipping ${product.title} - already has ${product.reviewCount} reviews`);
            continue;
        }

        try {
            await generateReviewsForProduct(product, source, reviewsPerProduct);
        } catch (error) {
            console.error(`❌ Failed to generate reviews for ${product.title}:`, error);
        }
    }
}

async function handleCategory(category: string, source: string, reviewsPerProduct: number) {
    console.log(`🎯 Generating reviews for category: ${category}`);

    const products = await prisma.product.findMany({
        where: { category },
        select: {
            id: true,
            title: true,
            category: true,
            reviewCount: true,
            source: true,
        },
    });

    console.log(`📦 Found ${products.length} products in category: ${category}`);

    for (const product of products) {
        if (product.reviewCount > 0) {
            console.log(`⏭️ Skipping ${product.title} - already has reviews`);
            continue;
        }

        try {
            await generateReviewsForProduct(product, source, reviewsPerProduct);
        } catch (error) {
            console.error(`❌ Failed to generate reviews for ${product.title}:`, error);
        }
    }
}

async function handleSingleProduct(productId: string, source: string, reviewsPerProduct: number) {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { id: true, title: true, category: true, reviewCount: true, source: true }
    });

    if (!product) {
        console.error(`❌ Product with ID ${productId} not found`);
        process.exit(1);
    }

    if (product.reviewCount > 0) {
        console.log(`⚠️ Product already has ${product.reviewCount} reviews. Do you want to continue? (y/n)`);
        // In a real implementation, you might want to add user input handling
        console.log('📝 Proceeding with review generation...');
    }

    console.log(`📝 Generating reviews for product: ${product.title}`);
    await generateReviewsForProduct(product, source, reviewsPerProduct);
}

async function handleImport(source: string, reviewsPerProduct: number) {
    console.log(`📥 Importing reviews from ${source}...`);

    const products = await prisma.product.findMany({
        where: { source: source === 'alibaba' ? 'alibaba' : 'aliexpress' },
        select: {
            id: true,
            title: true,
            category: true,
            reviewCount: true,
            source: true,
        },
    });

    console.log(`📦 Found ${products.length} products from ${source} to import reviews for`);

    for (const product of products) {
        try {
            if (source === 'alibaba') {
                await alibabaService.importReviewsToDatabase(product.id, 'alibaba', reviewsPerProduct);
            } else if (source === 'aliexpress') {
                await alibabaService.importReviewsToDatabase(product.id, 'aliexpress', reviewsPerProduct);
            }
        } catch (error) {
            console.error(`❌ Failed to import reviews for ${product.title}:`, error);
        }
    }
}

async function generateReviewsForProduct(
    product: { id: string; title: string; category: string | null; source: string },
    source: string,
    reviewsPerProduct: number
) {
    if (source === 'faker') {
        await reviewService.generateReviewsForProduct(
            product.id,
            product.title,
            product.category || 'general',
            reviewsPerProduct,
            'generated'
        );
    } else if (source === 'alibaba') {
        await alibabaService.importReviewsToDatabase(product.id, 'alibaba', reviewsPerProduct);
    } else if (source === 'aliexpress') {
        await alibabaService.importReviewsToDatabase(product.id, 'aliexpress', reviewsPerProduct);
    } else if (source === 'mixed') {
        // Use mixed approach: some from API, some generated
        const apiReviews = Math.floor(reviewsPerProduct * 0.7); // 70% from API
        const generatedReviews = reviewsPerProduct - apiReviews; // 30% generated

        if (product.source === 'alibaba' && apiReviews > 0) {
            await alibabaService.importReviewsToDatabase(product.id, 'alibaba', apiReviews);
        } else if (product.source === 'aliexpress' && apiReviews > 0) {
            await alibabaService.importReviewsToDatabase(product.id, 'aliexpress', apiReviews);
        }

        if (generatedReviews > 0) {
            await reviewService.generateReviewsForProduct(
                product.id,
                product.title,
                product.category || 'general',
                generatedReviews,
                'generated'
            );
        }
    }
}

function showUsage() {
    console.log('❌ Invalid command. Available commands:');
    console.log('  all - Generate reviews for all products');
    console.log('  category <category> - Generate reviews for specific category');
    console.log('  product <productId> - Generate reviews for specific product');
    console.log('  import - Import reviews from Alibaba/AliExpress APIs');
    console.log('');
    console.log('Available sources:');
    console.log('  faker - Generate realistic fake reviews');
    console.log('  alibaba - Import from Alibaba API (with fallback to mock data)');
    console.log('  aliexpress - Import from AliExpress API (with fallback to mock data)');
    console.log('  mixed - Combine API and generated reviews (default)');
    console.log('');
    console.log('Usage examples:');
    console.log('  npm run enhanced:reviews all');
    console.log('  npm run enhanced:reviews all mixed 20');
    console.log('  npm run enhanced:reviews category electronics alibaba 25');
    console.log('  npm run enhanced:reviews category clothing faker 15');
    console.log('  npm run enhanced:reviews product <productId> aliexpress 30');
    console.log('  npm run enhanced:reviews import alibaba 20');
}

main();