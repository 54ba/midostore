#!/usr/bin/env npx tsx

import { ScrapingService } from '../lib/scraping-service';
import { ProductService } from '../lib/product-service';
import config from '../env.config';

async function main() {
    console.log('🚀 Starting product scraping...');

    const scrapingService = new ScrapingService();
    const productService = new ProductService();

    try {
        // Get command line arguments
        const args = process.argv.slice(2);
        const source = args[0] || 'alibaba';
        const category = args[1] || 'electronics';
        const pageCount = parseInt(args[2]) || 1;

        if (!config.scrapingSources.includes(source)) {
            console.error(`❌ Invalid source: ${source}. Must be one of: ${config.scrapingSources.join(', ')}`);
            process.exit(1);
        }

        if (!config.scrapingCategories.includes(category)) {
            console.error(`❌ Invalid category: ${category}. Must be one of: ${config.scrapingCategories.join(', ')}`);
            process.exit(1);
        }

        console.log(`📊 Scraping ${source} for category: ${category} (${pageCount} pages)`);

        // Start scraping
        let products: any[] = [];

        if (source === 'alibaba') {
            products = await scrapingService.scrapeAlibaba(category, pageCount);
        } else if (source === 'aliexpress') {
            products = await scrapingService.scrapeAliExpress(category, pageCount);
        }

        console.log(`✅ Found ${products.length} products`);

        if (products.length === 0) {
            console.log('⚠️ No products found. Check the selectors or try a different category.');
            return;
        }

        // Process products
        console.log('🔄 Processing products...');
        let successCount = 0;
        let errorCount = 0;

        for (const product of products) {
            try {
                await productService.createProductFromScraped(product);
                successCount++;
                console.log(`✅ Processed: ${product.title}`);
            } catch (error) {
                errorCount++;
                console.error(`❌ Failed to process: ${product.title}`, error);
            }

            // Small delay between products
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log(`\n🎉 Scraping completed!`);
        console.log(`📊 Results:`);
        console.log(`   - Total found: ${products.length}`);
        console.log(`   - Successfully processed: ${successCount}`);
        console.log(`   - Errors: ${errorCount}`);

        // Update exchange rates
        console.log('💱 Updating exchange rates...');
        try {
            const response = await fetch('/api/exchange-rates', { method: 'POST' });
            if (response.ok) {
                console.log('✅ Exchange rates updated');
            }
        } catch (error) {
            console.log('⚠️ Could not update exchange rates (server may not be running)');
        }

    } catch (error) {
        console.error('❌ Scraping failed:', error);
        process.exit(1);
    } finally {
        await scrapingService.close();
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

main();