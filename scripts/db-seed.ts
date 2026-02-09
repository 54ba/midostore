import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import config from '../env.config';
import { ExchangeRateService } from '../lib/exchange-rate-service';
import { ReviewSeedingService } from '../lib/review-seeding-service';

const prisma = new PrismaClient();
const exchangeRateService = new ExchangeRateService();
const reviewService = new ReviewSeedingService(prisma);

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
        isVerified: true,
        goldMember: true,
        email: 'electronics@premium.com',
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
        isVerified: true,
        goldMember: false,
        email: 'fashion@global.com',
      },
    ];

    for (const supplier of sampleSuppliers) {
      await prisma.supplier.upsert({
        where: { externalId: supplier.externalId },
        update: supplier,
        create: supplier,
      });
    }

    // Handle Categories
    const categories: Record<string, string> = {};
    const categoryNames = ['Electronics', 'Clothing'];
    for (const name of categoryNames) {
      const cat = await prisma.category.upsert({
        where: { slug: name.toLowerCase() },
        update: {},
        create: { name, slug: name.toLowerCase() },
      });
      categories[name.toLowerCase()] = cat.id;
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
        images: JSON.stringify(['https://example.com/earbuds1.jpg', 'https://example.com/earbuds2.jpg']),
        categoryName: 'electronics',
        subcategoryName: 'audio',
        tags: 'wireless, bluetooth, earbuds, noise-cancellation',
        rating: 4.7,
        reviewCount: 1250,
        soldCount: 8500,
        minOrderQuantity: 1,
        maxOrderQuantity: 1000,
        shippingWeight: 0.1,
        shippingDimensions: '10x5x3 cm',
        sku: 'EARBUDS-001',
        supplierExternalId: 'supplier_001',
        profitMargin: 20,
      },
      {
        externalId: 'product_002',
        source: 'aliexpress',
        title: 'Casual Summer Dress',
        description: 'Comfortable and stylish summer dress for women',
        price: 18.50,
        currency: 'USD',
        images: JSON.stringify(['https://example.com/dress1.jpg', 'https://example.com/dress2.jpg']),
        categoryName: 'clothing',
        subcategoryName: 'women',
        tags: 'dress, summer, casual, women, fashion',
        rating: 4.5,
        reviewCount: 890,
        soldCount: 3200,
        minOrderQuantity: 1,
        maxOrderQuantity: 500,
        shippingWeight: 0.3,
        shippingDimensions: '30x20x2 cm',
        sku: 'DRESS-001',
        supplierExternalId: 'supplier_002',
        profitMargin: 30,
      },
    ];

    for (const pData of sampleProducts) {
      const supplier = await prisma.supplier.findUnique({
        where: { externalId: pData.supplierExternalId },
      });

      if (supplier) {
        const { categoryName, subcategoryName, supplierExternalId, title, price, ...rest } = pData;

        const product = await prisma.product.upsert({
          where: { externalId: pData.externalId },
          update: {
            ...rest,
            name: title,
            title: title,
            basePrice: price,
            costPrice: price * 0.7,
            categoryId: categories[categoryName],
            supplierId: supplier.id,
            sku: pData.sku,
            slug: `${pData.externalId}-${Date.now()}`,
          },
          create: {
            ...rest,
            name: title,
            title: title,
            basePrice: price,
            costPrice: price * 0.7,
            categoryId: categories[categoryName],
            supplierId: supplier.id,
            sku: pData.sku,
            slug: `${pData.externalId}-${Date.now()}`,
          },
        });

        // Create localizations for Gulf countries with dynamic rates
        console.log(`🌍 Creating localizations for product: ${product.name}`);
        for (const gulfCountry of config.gulfCountries) {
          try {
            // Get dynamic exchange rate
            const localPrice = await exchangeRateService.convertPrice(
              price,
              pData.currency,
              gulfCountry.currency
            );

            const pm = pData.profitMargin;
            const finalPrice = localPrice * (1 + pm / 100);

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
                title: title,
                name: title,
              },
              create: {
                productId: product.id,
                locale: gulfCountry.locale,
                title: title,
                name: title,
                description: pData.description,
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
            price,
            pData.currency,
            'AED'
          );
          const pm = pData.profitMargin;
          const gulfPrice = uaePrice * (1 + pm / 100);

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

    // Generate reviews for all products
    console.log('🌟 Generating reviews for all products...');
    try {
      await reviewService.generateReviewsForAllProducts(5, 'generated');
      console.log('✅ Reviews generated successfully!');
    } catch (error) {
      console.error('⚠️ Warning: Could not generate reviews:', error);
    }

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();