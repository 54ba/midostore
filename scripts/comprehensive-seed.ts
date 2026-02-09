import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Gulf countries data
const gulfCountries = [
    { code: 'AE', name: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة', currency: 'AED', currencyAr: 'درهم إماراتي', timezone: 'Asia/Dubai', locale: 'ar-AE' },
    { code: 'SA', name: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', currency: 'SAR', currencyAr: 'ريال سعودي', timezone: 'Asia/Riyadh', locale: 'ar-SA' },
    { code: 'KW', name: 'Kuwait', nameAr: 'الكويت', currency: 'KWD', currencyAr: 'دينار كويتي', timezone: 'Asia/Kuwait', locale: 'ar-KW' },
    { code: 'QA', name: 'Qatar', nameAr: 'قطر', currency: 'QAR', currencyAr: 'ريال قطري', timezone: 'Asia/Qatar', locale: 'ar-QA' },
    { code: 'BH', name: 'Bahrain', nameAr: 'البحرين', currency: 'BHD', currencyAr: 'دينار بحريني', timezone: 'Asia/Bahrain', locale: 'ar-BH' },
    { code: 'OM', name: 'Oman', nameAr: 'عُمان', currency: 'OMR', currencyAr: 'ريال عماني', timezone: 'Asia/Muscat', locale: 'ar-OM' },
];

// Product categories with realistic data
const productCategories = [
    {
        name: 'Electronics',
        subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Accessories', 'Audio', 'Cameras'],
        tags: ['tech', 'digital', 'modern', 'wireless', 'smart'],
        profitMargin: 25,
    },
    {
        name: 'Fashion',
        subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Kids\' Clothing', 'Shoes', 'Bags', 'Jewelry'],
        tags: ['style', 'trendy', 'comfortable', 'elegant', 'casual'],
        profitMargin: 30,
    },
    {
        name: 'Home & Garden',
        subcategories: ['Furniture', 'Decor', 'Kitchen', 'Bathroom', 'Outdoor', 'Lighting'],
        tags: ['home', 'comfort', 'style', 'practical', 'beautiful'],
        profitMargin: 20,
    },
    {
        name: 'Beauty & Health',
        subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Wellness', 'Personal Care'],
        tags: ['beauty', 'health', 'natural', 'organic', 'luxury'],
        profitMargin: 35,
    },
    {
        name: 'Sports & Outdoors',
        subcategories: ['Fitness', 'Team Sports', 'Outdoor Activities', 'Exercise Equipment', 'Athletic Wear'],
        tags: ['sports', 'fitness', 'outdoor', 'active', 'healthy'],
        profitMargin: 22,
    },
    {
        name: 'Toys & Games',
        subcategories: ['Educational', 'Action Figures', 'Board Games', 'Puzzles', 'Building Sets', 'Arts & Crafts'],
        tags: ['fun', 'educational', 'creative', 'entertaining', 'learning'],
        profitMargin: 28,
    },
    {
        name: 'Automotive',
        subcategories: ['Car Accessories', 'Motorcycle', 'Tools', 'Maintenance', 'Interior', 'Exterior'],
        tags: ['automotive', 'quality', 'durable', 'practical', 'reliable'],
        profitMargin: 18,
    },
    {
        name: 'Books & Media',
        subcategories: ['Fiction', 'Non-Fiction', 'Children\'s Books', 'Educational', 'Audio Books', 'E-books'],
        tags: ['knowledge', 'entertainment', 'learning', 'inspiration', 'education'],
        profitMargin: 15,
    },
];

// Supplier data
const supplierData = [
    { name: 'TechPro Solutions', companyName: 'TechPro Solutions Ltd.', country: 'China', city: 'Shenzhen', rating: 4.8, responseRate: 98, responseTime: '2-4 hours', isVerified: true, goldMember: true },
    { name: 'Fashion Forward', companyName: 'Fashion Forward International', country: 'Turkey', city: 'Istanbul', rating: 4.6, responseRate: 95, responseTime: '4-6 hours', isVerified: true, goldMember: true },
    { name: 'Home Essentials', companyName: 'Home Essentials Co.', country: 'India', city: 'Mumbai', rating: 4.5, responseRate: 92, responseTime: '6-8 hours', isVerified: true, goldMember: false },
    { name: 'Beauty World', companyName: 'Beauty World Ltd.', country: 'South Korea', city: 'Seoul', rating: 4.7, responseRate: 96, responseTime: '3-5 hours', isVerified: true, goldMember: true },
    { name: 'Sports Elite', companyName: 'Sports Elite Manufacturing', country: 'Vietnam', city: 'Ho Chi Minh City', rating: 4.4, responseRate: 90, responseTime: '8-12 hours', isVerified: true, goldMember: false },
    { name: 'Toy Kingdom', companyName: 'Toy Kingdom International', country: 'Thailand', city: 'Bangkok', rating: 4.6, responseRate: 94, responseTime: '4-6 hours', isVerified: true, goldMember: true },
];

// Product templates for each category
const productTemplates = {
    Electronics: [
        { title: 'Wireless Bluetooth Headphones', description: 'High-quality wireless headphones with noise cancellation and long battery life', price: 89.99, originalPrice: 149.99 },
        { title: 'Smart Fitness Watch', description: 'Advanced fitness tracker with heart rate monitoring and GPS', price: 199.99, originalPrice: 299.99 },
        { title: 'Portable Power Bank', description: '20000mAh fast charging power bank for all devices', price: 29.99, originalPrice: 49.99 },
        { title: 'Wireless Charging Pad', description: 'Fast wireless charging pad compatible with all Qi devices', price: 19.99, originalPrice: 39.99 },
        { title: 'Bluetooth Speaker', description: 'Portable waterproof Bluetooth speaker with 360° sound', price: 59.99, originalPrice: 99.99 },
    ],
    Fashion: [
        { title: 'Premium Cotton T-Shirt', description: 'Soft, breathable cotton t-shirt in various colors', price: 24.99, originalPrice: 39.99 },
        { title: 'Designer Jeans', description: 'High-quality denim jeans with perfect fit', price: 79.99, originalPrice: 129.99 },
        { title: 'Leather Handbag', description: 'Genuine leather handbag with multiple compartments', price: 89.99, originalPrice: 159.99 },
        { title: 'Running Shoes', description: 'Comfortable running shoes with excellent cushioning', price: 69.99, originalPrice: 119.99 },
        { title: 'Silver Necklace', description: 'Elegant silver necklace with pendant', price: 39.99, originalPrice: 69.99 },
    ],
    'Home & Garden': [
        { title: 'LED Desk Lamp', description: 'Adjustable LED desk lamp with touch control', price: 34.99, originalPrice: 59.99 },
        { title: 'Garden Tool Set', description: 'Complete garden tool set for all gardening needs', price: 49.99, originalPrice: 89.99 },
        { title: 'Kitchen Mixer', description: 'Professional kitchen mixer with multiple attachments', price: 129.99, originalPrice: 199.99 },
        { title: 'Wall Clock', description: 'Elegant wall clock with silent movement', price: 19.99, originalPrice: 34.99 },
        { title: 'Plant Pots Set', description: 'Beautiful ceramic plant pots in various sizes', price: 29.99, originalPrice: 49.99 },
    ],
    'Beauty & Health': [
        { title: 'Anti-Aging Face Cream', description: 'Natural anti-aging face cream with organic ingredients', price: 29.99, originalPrice: 59.99 },
        { title: 'Hair Dryer', description: 'Professional hair dryer with ionic technology', price: 79.99, originalPrice: 129.99 },
        { title: 'Makeup Brush Set', description: 'Complete makeup brush set with case', price: 24.99, originalPrice: 44.99 },
        { title: 'Essential Oil Set', description: 'Pure essential oils for aromatherapy', price: 34.99, originalPrice: 64.99 },
        { title: 'Facial Cleanser', description: 'Gentle facial cleanser for all skin types', price: 19.99, originalPrice: 34.99 },
    ],
    'Sports & Outdoors': [
        {
            title: 'Yoga Mat', description: 'Non-slip yoga mat with carrying strap', price: 24.99, originalPrice: 39. Mat with carrying strap', price: 24.99, originalPrice: 39.99 },
        { title: 'Dumbbell Set', description: 'Adjustable dumbbell set for home workouts', price: 89.99, originalPrice: 149.99 },
        { title: 'Tent', description: '4-person camping tent with rain fly', price: 149.99, originalPrice: 249.99 },
        { title: 'Bicycle Helmet', description: 'Safety-certified bicycle helmet with ventilation', price: 39.99, originalPrice: 69.99 },
        { title: 'Hiking Boots', description: 'Waterproof hiking boots with ankle support', price: 99.99, originalPrice: 169.99 },
    ],
    'Toys & Games': [
        { title: 'Educational Building Blocks', description: 'STEM educational building blocks for kids', price: 24.99, originalPrice: 39.99 },
        { title: 'Board Game Collection', description: 'Family board game collection with 6 games', price: 34.99, originalPrice: 59.99 },
        { title: 'Art Supplies Kit', description: 'Complete art supplies kit for creative kids', price: 19.99, originalPrice: 34.99 },
        { title: 'Remote Control Car', description: 'Fast remote control car with rechargeable battery', price: 29.99, originalPrice: 49.99 },
        { title: 'Puzzle Set', description: '1000-piece jigsaw puzzle with beautiful artwork', price: 14.99, originalPrice: 24.99 },
    ],
};

// Review templates
const reviewTemplates = [
    { rating: 5, title: 'Excellent Product!', content: 'This product exceeded my expectations. High quality and great value for money. Highly recommended!' },
    { rating: 5, title: 'Perfect!', content: 'Exactly what I was looking for. Fast delivery and excellent customer service. Will buy again!' },
    { rating: 4, title: 'Very Good', content: 'Great product with good quality. Minor issues but overall satisfied with the purchase.' },
    { rating: 4, title: 'Good Value', content: 'Good quality for the price. Meets my needs and I would recommend it to others.' },
    { rating: 5, title: 'Amazing Quality', content: 'The quality is outstanding! Better than expected and worth every penny. Love it!' },
    { rating: 4, title: 'Satisfied Customer', content: 'Good product, good service. Would buy from this seller again.' },
    { rating: 5, title: 'Exceeds Expectations', content: 'This product is even better than described. Excellent quality and fast shipping!' },
    { rating: 4, title: 'Great Purchase', content: 'Happy with my purchase. Good quality and reasonable price. Recommended!' },
];

async function seedGulfCountries() {
    console.log('🌍 Seeding Gulf countries...');

    for (const country of gulfCountries) {
        await prisma.gulfCountry.upsert({
            where: { code: country.code },
            update: country,
            create: country,
        });
    }

    console.log('✅ Gulf countries seeded successfully');
}

async function seedSuppliers() {
    console.log('🏢 Seeding suppliers...');

    const suppliers = [];
    for (const supplier of supplierData) {
        const created = await prisma.supplier.upsert({
            where: { externalId: supplier.name.toLowerCase().replace(/\s+/g, '-') },
            update: { ...supplier, email: `contact@${supplier.name.toLowerCase().replace(/\s+/g, '')}.com` },
            create: {
                ...supplier,
                externalId: supplier.name.toLowerCase().replace(/\s+/g, '-'),
                source: 'alibaba',
                email: `contact@${supplier.name.toLowerCase().replace(/\s+/g, '')}.com`,
            },
        });
        suppliers.push(created);
    }

    console.log('✅ Suppliers seeded successfully');
    return suppliers;
}

async function seedProducts(suppliers: any[]) {
    console.log('📦 Seeding products...');

    let productCount = 0;

    for (const category of productCategories) {
        const templates = productTemplates[category.name as keyof typeof productTemplates] || [];

        for (const template of templates) {
            // Create multiple variations of each product
            for (let i = 0; i < 3; i++) {
                const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
                const variation = i === 0 ? '' : ` - ${faker.commerce.productAdjective()}`;

                const product = await prisma.product.create({
                    data: {
                        externalId: `${category.name.toLowerCase()}-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
                        source: 'alibaba',
                        name: `${template.title}${variation}`,
                        title: `${template.title}${variation}`,
                        description: template.description,
                        basePrice: template.price + (Math.random() * 20 - 10),
                        costPrice: template.price * 0.7,
                        currency: 'USD',
                        images: JSON.stringify(Array.from({ length: 3 }, () => faker.image.urlLoremFlickr({ category: category.name.toLowerCase() }))),
                        category: { create: { name: category.name, slug: category.name.toLowerCase() } },
                        tags: [...category.tags, faker.commerce.productAdjective()].join(','),
                        sku: `SKU-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
                        slug: `product-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
                        averageRating: 4 + Math.random(),
                        reviewCount: Math.floor(Math.random() * 100) + 10,
                        supplierId: supplier.id,
                        profitMargin: category.profitMargin + (Math.random() * 10 - 5),
                        gulfPrice: (template.price + (Math.random() * 20 - 10)) * 3.67, // Convert to AED
                        gulfCurrency: 'AED',
                        isActive: true,
                    },
                });

                // Create product variants
                if (category.name === 'Fashion') {
                    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
                    const colors = ['Red', 'Blue', 'Black', 'White', 'Green'];

                    for (const size of sizes.slice(0, 3)) {
                        await prisma.productVariant.create({
                            data: {
                                productId: product.id,
                                name: 'Size',
                                sku: `${product.sku}-${size}`,
                                stockQuantity: Math.floor(Math.random() * 100) + 20,
                                isActive: true,
                            },
                        });
                    }
                }

                productCount++;
            }
        }
    }

    console.log(`✅ ${productCount} products seeded successfully`);
}

async function main() {
    console.log('🚀 Starting comprehensive database seeding...');

    try {
        // Seed in order due to dependencies
        await seedGulfCountries();
        const suppliers = await seedSuppliers();
        await seedProducts(suppliers);

        console.log('🎉 All seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error during seeding:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();