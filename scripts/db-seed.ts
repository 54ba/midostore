#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { config } from '../env.config';
import { ExchangeRateService } from '../lib/exchange-rate-service';

const prisma = new PrismaClient();
const exchangeRateService = new ExchangeRateService();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Seed Gulf countries
    console.log('🏳️ Seeding Gulf countries...');
    for (const country of config.gulfCountries) {
      await prisma.gulfCountry.upsert({
        where: { code: country.code },
        update: country,
        create: country,
      });
    }

    // Seed exchange rates dynamically from APIs
    console.log('💱 Fetching exchange rates from APIs...');
    try {
      await exchangeRateService.updateAllRates();
      console.log('✅ Exchange rates updated successfully');
    } catch (error) {
      console.error('⚠️ Warning: Could not fetch exchange rates from APIs:', error);
      console.log('📝 You can manually update rates later using the API endpoint');
    }

    // Create sample suppliers
    console.log('🏢 Seeding sample suppliers...');
    const sampleSuppliers = [
      {
        externalId: 'supplier_001',
        source: 'alibaba',
        name: 'Premium Electronics Co.',
        companyName: 'Premium Electronics Co. Ltd.',
        country: 'China',
        city: 'Shenzhen',
        rating: 4.8,
        responseRate: 98.5,
        responseTime: '2 hours',
        verified: true,
        goldMember: true,
      },
      {
        externalId: 'supplier_002',
        source: 'aliexpress',
        name: 'Global Fashion Store',
        companyName: 'Global Fashion Store',
        country: 'China',
        city: 'Guangzhou',
        rating: 4.6,
        responseRate: 95.2,
        responseTime: '4 hours',
        verified: true,
        goldMember: false,
      },
    ];

    for (const supplier of sampleSuppliers) {
      await prisma.supplier.upsert({
        where: { externalId: supplier.externalId },
        update: supplier,
        create: supplier,
      });
    }

    // Create sample products
    console.log('📦 Seeding sample products...');
    const sampleProducts = [
      {
        externalId: 'product_001',
        source: 'alibaba',
        title: 'Wireless Bluetooth Earbuds',
        description: 'High-quality wireless earbuds with noise cancellation',
        price: 25.99,
        currency: 'USD',
        images: ['https://example.com/earbuds1.jpg', 'https://example.com/earbuds2.jpg'],
        category: 'electronics',
        subcategory: 'audio',
        tags: ['wireless', 'bluetooth', 'earbuds', 'noise-cancellation'],
        rating: 4.7,
        reviewCount: 1250,
        soldCount: 8500,
        minOrderQuantity: 1,
        maxOrderQuantity: 1000,
        shippingWeight: 0.1,
        shippingDimensions: '10x5x3 cm',
        supplierId: 'supplier_001',
        profitMargin: 20,
      },
      {
        externalId: 'product_002',
        source: 'aliexpress',
        title: 'Casual Summer Dress',
        description: 'Comfortable and stylish summer dress for women',
        price: 18.50,
        currency: 'USD',
        images: ['https://example.com/dress1.jpg', 'https://example.com/dress2.jpg'],
        category: 'clothing',
        subcategory: 'women',
        tags: ['dress', 'summer', 'casual', 'women', 'fashion'],
        rating: 4.5,
        reviewCount: 890,
        soldCount: 3200,
        minOrderQuantity: 1,
        maxOrderQuantity: 500,
        shippingWeight: 0.3,
        shippingDimensions: '30x20x2 cm',
        supplierId: 'supplier_002',
        profitMargin: 30,
      },
    ];

    for (const productData of sampleProducts) {
      const supplier = await prisma.supplier.findFirst({
        where: { externalId: productData.supplierId },
      });

      if (supplier) {
        const product = await prisma.product.upsert({
          where: { externalId: productData.externalId },
          update: productData,
          create: {
            ...productData,
            supplierId: supplier.id,
          },
        });

        // Create localizations for Gulf countries with dynamic rates
        console.log(`🌍 Creating localizations for product: ${product.title}`);
        for (const gulfCountry of config.gulfCountries) {
          try {
            // Get dynamic exchange rate
            const localPrice = await exchangeRateService.convertPrice(
              productData.price,
              productData.currency,
              gulfCountry.currency
            );

            const profitMargin = productData.profitMargin;
            const finalPrice = localPrice * (1 + profitMargin / 100);

            await prisma.productLocalization.upsert({
              where: {
                productId_locale: {
                  productId: product.id,
                  locale: gulfCountry.locale,
                },
              },
              update: {
                price: finalPrice,
                currency: gulfCountry.currency,
              },
              create: {
                productId: product.id,
                locale: gulfCountry.locale,
                title: productData.title,
                description: productData.description,
                price: finalPrice,
                currency: gulfCountry.currency,
              },
            });

            console.log(`  ✅ ${gulfCountry.name}: ${finalPrice.toFixed(2)} ${gulfCountry.currency}`);
          } catch (error) {
            console.error(`  ❌ Failed to create localization for ${gulfCountry.name}:`, error);
          }
        }

        // Update main product with Gulf price (using UAE as default)
        try {
          const uaePrice = await exchangeRateService.convertPrice(
            productData.price,
            productData.currency,
            'AED'
          );
          const profitMargin = productData.profitMargin;
          const gulfPrice = uaePrice * (1 + profitMargin / 100);

          await prisma.product.update({
            where: { id: product.id },
            data: {
              gulfPrice,
              gulfCurrency: 'AED',
            },
          });

          console.log(`  ✅ Gulf price updated: ${gulfPrice.toFixed(2)} AED`);
        } catch (error) {
          console.error(`  ❌ Failed to update Gulf price:`, error);
        }
      }
    }

    console.log('✅ Database seeding completed successfully!');

    // Display cache statistics
    const cacheStats = exchangeRateService.getCacheStats();
    console.log('📊 Cache Statistics:', cacheStats);

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();