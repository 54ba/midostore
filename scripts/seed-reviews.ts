#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { ReviewSeedingService } from '../lib/review-seeding-service';

const prisma = new PrismaClient();
const reviewService = new ReviewSeedingService(prisma);

async function main() {
    console.log('🌟 Starting review seeding process...');

    try {
        // Parse command line arguments
        const args = process.argv.slice(2);
        const command = args[0];
        const category = args[1];
        const reviewsPerProduct = parseInt(args[2]) || 15;
        const source = (args[3] as 'alibaba' | 'aliexpress' | 'generated') || 'generated';

        console.log(`📋 Command: ${command}`);
        console.log(`📊 Reviews per product: ${reviewsPerProduct}`);
        console.log(`🏷️ Source: ${source}`);

        switch (command) {
            case 'all':
                console.log('🚀 Generating reviews for all products...');
                await reviewService.generateReviewsForAllProducts(reviewsPerProduct, source);
                break;

            case 'category':
                if (!category) {
                    console.error('❌ Category is required for category command');
                    console.log('Usage: npm run seed:reviews category <category> [reviewsPerProduct] [source]');
                    process.exit(1);
                }
                console.log(`🎯 Generating reviews for category: ${category}`);
                await reviewService.generateReviewsForCategory(category, reviewsPerProduct, source);
                break;

            case 'product':
                const productId = args[1];
                if (!productId) {
                    console.error('❌ Product ID is required for product command');
                    console.log('Usage: npm run seed:reviews product <productId> [reviewsPerProduct] [source]');
                    process.exit(1);
                }

                const product = await prisma.product.findUnique({
                    where: { id: productId },
                    select: { id: true, title: true, category: true }
                });

                if (!product) {
                    console.error(`❌ Product with ID ${productId} not found`);
                    process.exit(1);
                }

                console.log(`📝 Generating reviews for product: ${product.title}`);
                await reviewService.generateReviewsForProduct(
                    product.id,
                    product.title,
                    product.category || 'general',
                    reviewsPerProduct,
                    source
                );
                break;

            default:
                console.log('❌ Invalid command. Available commands:');
                console.log('  all - Generate reviews for all products');
                console.log('  category <category> - Generate reviews for specific category');
                console.log('  product <productId> - Generate reviews for specific product');
                console.log('');
                console.log('Usage examples:');
                console.log('  npm run seed:reviews all');
                console.log('  npm run seed:reviews category electronics');
                console.log('  npm run seed:reviews category clothing 20 aliexpress');
                console.log('  npm run seed:reviews product <productId> 15 alibaba');
                process.exit(1);
        }

        console.log('✅ Review seeding completed successfully!');

    } catch (error) {
        console.error('❌ Review seeding failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main();