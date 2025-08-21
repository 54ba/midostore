#!/usr/bin/env node

console.log('🌱 Seeding sample reviews for dynamic home page...\n');

const sampleReviews = [
    {
        productId: 'prod-1',
        userId: 'user-1',
        rating: 5,
        comment: 'Amazing wireless headphones! The sound quality is incredible and battery life exceeds expectations. Highly recommend!',
        isVerified: true,
        isPremium: true,
        helpfulCount: 23,
        unhelpfulCount: 1,
        purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
    },
    {
        productId: 'prod-2',
        userId: 'user-2',
        rating: 5,
        comment: 'This smart fitness watch is a game-changer! Tracks everything accurately and the app is intuitive. Perfect for my workouts.',
        isVerified: true,
        isPremium: false,
        helpfulCount: 18,
        unhelpfulCount: 0,
        purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
    },
    {
        productId: 'prod-3',
        userId: 'user-3',
        rating: 4,
        comment: 'Great organic face cream! My skin feels much better after using it. Only giving 4 stars because the packaging could be better.',
        isVerified: true,
        isPremium: false,
        helpfulCount: 12,
        unhelpfulCount: 2,
        purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
    },
    {
        productId: 'prod-4',
        userId: 'user-4',
        rating: 5,
        comment: 'Educational building blocks are perfect for my kids! They spend hours building and learning. Great quality and educational value.',
        isVerified: true,
        isPremium: false,
        helpfulCount: 8,
        unhelpfulCount: 0,
        purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)
    },
    {
        productId: 'prod-5',
        userId: 'user-5',
        rating: 5,
        comment: 'Premium coffee maker delivers restaurant-quality coffee every time. Worth every penny! The programmable features are fantastic.',
        isVerified: true,
        isPremium: true,
        helpfulCount: 31,
        unhelpfulCount: 1,
        purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
    },
    {
        productId: 'prod-6',
        userId: 'user-6',
        rating: 4,
        comment: 'Good yoga mat with excellent grip. Perfect thickness for home practice. Only minor issue is the color fading slightly.',
        isVerified: true,
        isPremium: false,
        helpfulCount: 15,
        unhelpfulCount: 3,
        purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6)
    },
    {
        productId: 'prod-7',
        userId: 'user-7',
        rating: 5,
        comment: 'Bluetooth speaker has incredible sound for its size! Battery lasts forever and connects instantly. Perfect for outdoor activities.',
        isVerified: true,
        isPremium: true,
        helpfulCount: 27,
        unhelpfulCount: 0,
        purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)
    },
    {
        productId: 'prod-8',
        userId: 'user-8',
        rating: 4,
        comment: 'Smart home security camera works great! Clear video quality and easy setup. App notifications are reliable. Good value for money.',
        isVerified: true,
        isPremium: false,
        helpfulCount: 19,
        unhelpfulCount: 2,
        purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4)
    }
];

const sampleUsers = [
    { id: 'user-1', name: 'Ahmed Hassan', avatar: '/api/placeholder/40/40?text=AH' },
    { id: 'user-2', name: 'Fatima Kuwait', avatar: '/api/placeholder/40/40?text=FK' },
    { id: 'user-3', name: 'Layla Dubai', avatar: '/api/placeholder/40/40?text=LD' },
    { id: 'user-4', name: 'Omar Qatar', avatar: '/api/placeholder/40/40?text=OQ' },
    { id: 'user-5', name: 'Sara Riyadh', avatar: '/api/placeholder/40/40?text=SR' },
    { id: 'user-6', name: 'Khalid Muscat', avatar: '/api/placeholder/40/40?text=KM' },
    { id: 'user-7', name: 'Aisha Abu Dhabi', avatar: '/api/placeholder/40/40?text=AA' },
    { id: 'user-8', name: 'Youssef Manama', avatar: '/api/placeholder/40/40?text=YM' }
];

const sampleProducts = [
    { id: 'prod-1', title: 'Wireless Headphones Pro', image: '/api/placeholder/40/40?text=Headphones', price: 89.99, originalPrice: 149.99, category: 'electronics', rating: 4.8, reviewCount: 1247, soldCount: 8500 },
    { id: 'prod-2', title: 'Smart Fitness Watch', image: '/api/placeholder/40/40?text=SmartWatch', price: 199.99, originalPrice: 299.99, category: 'electronics', rating: 4.6, reviewCount: 892, soldCount: 4200 },
    { id: 'prod-3', title: 'Organic Face Cream', image: '/api/placeholder/40/40?text=FaceCream', price: 29.99, originalPrice: 59.99, category: 'beauty', rating: 4.3, reviewCount: 567, soldCount: 3200 },
    { id: 'prod-4', title: 'Educational Building Blocks', image: '/api/placeholder/40/40?text=Blocks', price: 24.99, originalPrice: 39.99, category: 'toys', rating: 4.7, reviewCount: 234, soldCount: 1800 },
    { id: 'prod-5', title: 'Premium Coffee Maker', image: '/api/placeholder/40/40?text=Coffee', price: 159.99, originalPrice: 249.99, category: 'home', rating: 4.9, reviewCount: 1890, soldCount: 5600 },
    { id: 'prod-6', title: 'Professional Yoga Mat', image: '/api/placeholder/40/40?text=Yoga', price: 34.99, originalPrice: 49.99, category: 'fitness', rating: 4.4, reviewCount: 445, soldCount: 2100 },
    { id: 'prod-7', title: 'Portable Bluetooth Speaker', image: '/api/placeholder/40/40?text=Speaker', price: 79.99, originalPrice: 119.99, category: 'electronics', rating: 4.7, reviewCount: 678, soldCount: 3800 },
    { id: 'prod-8', title: 'Smart Security Camera', image: '/api/placeholder/40/40?text=Camera', price: 89.99, originalPrice: 129.99, category: 'home', rating: 4.5, reviewCount: 523, soldCount: 2900 }
];

async function seedReviews() {
    try {
        console.log('📝 Creating sample reviews...');

        for (const review of sampleReviews) {
            const response = await fetch('http://localhost:3000/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(review)
            });

            if (response.ok) {
                const result = await response.json();
                console.log(`✅ Created review for product ${review.productId}: ${result.message}`);
            } else {
                console.error(`❌ Failed to create review for product ${review.productId}`);
            }
        }

        console.log('\n🎉 Sample reviews seeded successfully!');
        console.log('📊 You can now view real dynamic reviews on the home page.');

    } catch (error) {
        console.error('❌ Error seeding reviews:', error);
    }
}

// Check if we're running in Node.js environment
if (typeof fetch === 'undefined') {
    console.log('📦 Installing node-fetch for Node.js compatibility...');
    const { default: fetch } = await import('node-fetch');
    globalThis.fetch = fetch;
}

// Run the seeding
seedReviews();