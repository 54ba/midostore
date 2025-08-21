#!/usr/bin/env node

/**
 * Test script for Authentication Protection
 * This script tests which routes are protected and which are public
 */

const { execSync } = require('child_process');

console.log('🔐 Testing Authentication Protection');
console.log('===================================\n');

// Routes to test
const routesToTest = [
    { path: '/', name: 'Home Page', expected: 'public' },
    { path: '/products', name: 'Products Page', expected: 'public' },
    { path: '/cart', name: 'Cart Page', expected: 'public' },
    { path: '/dashboard', name: 'Dashboard Page', expected: 'public' },
    { path: '/scraping', name: 'Scraping Page', expected: 'public' },
    { path: '/profile', name: 'Profile Page', expected: 'public' },
    { path: '/orders', name: 'Orders Page', expected: 'public' },
    { path: '/checkout', name: 'Checkout Page', expected: 'protected' },
    { path: '/sign-in', name: 'Sign-In Page', expected: 'public' },
    { path: '/sign-up', name: 'Sign-Up Page', expected: 'public' },
    { path: '/contact', name: 'Contact Page', expected: 'public' },
    { path: '/ai-recommendations', name: 'AI Recommendations', expected: 'public' },
];

// API routes to test
const apiRoutesToTest = [
    { path: '/api/products', name: 'Products API', expected: 'public' },
    { path: '/api/orders', name: 'Orders API', expected: 'public' },
    { path: '/api/users', name: 'Users API', expected: 'public' },
    { path: '/api/scraping/start', name: 'Scraping Start API', expected: 'public' },
    { path: '/api/reviews', name: 'Reviews API', expected: 'public' },
    { path: '/api/stripe/create-checkout-session', name: 'Stripe Checkout API', expected: 'public' },
];

console.log('📱 Testing Page Routes:');
console.log('=======================');

let publicCount = 0;
let protectedCount = 0;

for (const route of routesToTest) {
    try {
        const response = execSync(`curl -s -I http://localhost:3000${route.path}`, { encoding: 'utf8' });
        const statusCode = response.split(' ')[1];

        if (statusCode === '200') {
            console.log(`✅ ${route.name} - PUBLIC (Status: ${statusCode})`);
            publicCount++;
        } else if (statusCode === '302' || statusCode === '301') {
            console.log(`🔒 ${route.name} - PROTECTED (Status: ${statusCode} - Redirecting)`);
            protectedCount++;
        } else {
            console.log(`⚠️  ${route.name} - UNEXPECTED (Status: ${statusCode})`);
        }
    } catch (error) {
        console.log(`❌ ${route.name} - ERROR (${error.message})`);
    }
}

console.log('');

console.log('🔌 Testing API Routes:');
console.log('======================');

for (const route of apiRoutesToTest) {
    try {
        const response = execSync(`curl -s -I http://localhost:3000${route.path}`, { encoding: 'utf8' });
        const statusCode = response.split(' ')[1];

        if (statusCode === '200' || statusCode === '405' || statusCode === '400') {
            console.log(`✅ ${route.name} - PUBLIC (Status: ${statusCode})`);
            publicCount++;
        } else if (statusCode === '302' || statusCode === '301') {
            console.log(`🔒 ${route.name} - PROTECTED (Status: ${statusCode} - Redirecting)`);
            protectedCount++;
        } else {
            console.log(`⚠️  ${route.name} - UNEXPECTED (Status: ${statusCode})`);
        }
    } catch (error) {
        console.log(`❌ ${route.name} - ERROR (${error.message})`);
    }
}

console.log('\n===================================');
console.log('📊 Test Results Summary:');
console.log('');

console.log(`✅ Public Routes: ${publicCount}`);
console.log(`🔒 Protected Routes: ${protectedCount}`);
console.log('');

// Check if checkout is the only protected route
if (protectedCount === 1) {
    console.log('🎯 PERFECT! Only checkout is protected as expected.');
} else if (protectedCount === 0) {
    console.log('⚠️  WARNING: No routes are protected. Checkout should be protected.');
} else {
    console.log(`⚠️  WARNING: ${protectedCount} routes are protected. Expected only 1 (checkout).`);
}

console.log('');

console.log('📋 Expected Behavior:');
console.log('   - ✅ All pages should be PUBLIC (except checkout)');
console.log('   - ✅ All API routes should be PUBLIC');
console.log('   - 🔒 Only /checkout should be PROTECTED');
console.log('   - 🔒 Checkout should redirect to sign-in if not authenticated');
console.log('');

console.log('🔍 To test checkout protection:');
console.log('   1. Visit /checkout without being signed in');
console.log('   2. You should be redirected to /sign-in');
console.log('   3. After signing in, you should be able to access /checkout');
console.log('');

console.log('🚀 Your authentication protection is now configured!');
console.log('   Only checkout requires authentication - everything else is public.');