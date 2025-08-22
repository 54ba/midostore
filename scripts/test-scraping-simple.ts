#!/usr/bin/env npx tsx

import { ScrapingService } from '../lib/scraping-service';

async function main() {
    console.log('🧪 Testing scraping service...');

    const scrapingService = new ScrapingService();

    try {
        await scrapingService.initialize();
        console.log('✅ Scraping service initialized');

        // Test with a simple category
        console.log('🔍 Testing Alibaba scraping...');
        const products = await scrapingService.scrapeAlibaba('electronics', 1);

        console.log(`📊 Found ${products.length} products`);

        if (products.length > 0) {
            console.log('\n📋 Sample products:');
            products.slice(0, 3).forEach((product, index) => {
                console.log(`\n${index + 1}. ${product.title}`);
                console.log(`   Price: ${product.price} ${product.currency}`);
                console.log(`   Rating: ${product.rating || 'N/A'}`);
                console.log(`   Reviews: ${product.reviewCount}`);
            });
        }

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await scrapingService.close();
    }
}

main().catch(console.error);