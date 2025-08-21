#!/usr/bin/env node

/**
 * Test All API Endpoints
 * This script tests all available API endpoints to ensure they're working correctly
 */

const BASE_URL = 'http://localhost:3000';

const API_ENDPOINTS = [
    // Core Product APIs
    { path: '/api/products', method: 'GET', description: 'Get products' },
    { path: '/api/products?category=electronics', method: 'GET', description: 'Get products by category' },
    { path: '/api/products?search=headphones', method: 'GET', description: 'Search products' },

    // Analytics APIs
    { path: '/api/analytics?action=live-sales&limit=5', method: 'GET', description: 'Live sales data' },
    { path: '/api/analytics?action=price-updates&limit=5', method: 'GET', description: 'Price updates' },
    { path: '/api/analytics?action=inventory-updates&limit=5', method: 'GET', description: 'Inventory updates' },

    // Localization APIs
    { path: '/api/localization?action=price-updates&limit=5', method: 'GET', description: 'Localization price updates' },
    { path: '/api/exchange-rates', method: 'GET', description: 'Exchange rates' },

    // Recommendation APIs
    { path: '/api/recommendations?type=popular&category=electronics&nItems=4', method: 'GET', description: 'Product recommendations' },

    // User and Order APIs
    { path: '/api/users', method: 'GET', description: 'Users endpoint' },
    { path: '/api/orders', method: 'GET', description: 'Orders endpoint' },

    // Utility APIs
    { path: '/api/placeholder/400/300?text=Test', method: 'GET', description: 'Placeholder image' },

    // Dashboard Routes
    { path: '/dashboard', method: 'GET', description: 'Dashboard page' },
    { path: '/dashboard/products', method: 'GET', description: 'Products page' },
    { path: '/dashboard/cart', method: 'GET', description: 'Cart page' },
    { path: '/dashboard/checkout', method: 'GET', description: 'Checkout page' },

    // Authentication Routes
    { path: '/sign-in', method: 'GET', description: 'Sign-in page' },
    { path: '/sign-up', method: 'GET', description: 'Sign-up page' }
];

async function testEndpoint(endpoint) {
    try {
        const startTime = Date.now();
        const response = await fetch(`${BASE_URL}${endpoint.path}`, {
            method: endpoint.method,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        const status = response.status;
        const statusText = response.statusText;

        let result = {
            success: status >= 200 && status < 300,
            status,
            statusText,
            responseTime: `${responseTime}ms`,
            description: endpoint.description
        };

        // Try to get response body for successful requests
        if (status >= 200 && status < 300) {
            try {
                const text = await response.text();
                if (text.length > 100) {
                    result.body = `${text.substring(0, 100)}... (truncated)`;
                } else {
                    result.body = text;
                }
            } catch (e) {
                result.body = 'Could not read response body';
            }
        }

        return result;
    } catch (error) {
        return {
            success: false,
            error: error.message,
            description: endpoint.description
        };
    }
}

async function testAllEndpoints() {
    console.log('🚀 Testing All API Endpoints...\n');
    console.log(`Base URL: ${BASE_URL}\n`);

    const results = [];

    for (const endpoint of API_ENDPOINTS) {
        console.log(`Testing: ${endpoint.description}`);
        const result = await testEndpoint(endpoint);
        results.push(result);

        if (result.success) {
            console.log(`✅ ${result.status} (${result.responseTime})`);
        } else {
            console.log(`❌ ${result.status || 'ERROR'}: ${result.error || result.statusText}`);
        }
        console.log('');

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Summary
    console.log('📊 Test Results Summary:');
    console.log('='.repeat(50));

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const total = results.length;

    console.log(`Total Endpoints: ${total}`);
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`Success Rate: ${((successful / total) * 100).toFixed(1)}%`);

    if (failed > 0) {
        console.log('\n❌ Failed Endpoints:');
        results.filter(r => !r.success).forEach(result => {
            console.log(`  - ${result.description}: ${result.error || result.statusText}`);
        });
    }

    console.log('\n✅ Successful Endpoints:');
    results.filter(r => r.success).forEach(result => {
        console.log(`  - ${result.description}: ${result.status} (${result.responseTime})`);
    });
}

// Run the tests
if (require.main === module) {
    testAllEndpoints().catch(console.error);
}

module.exports = { testAllEndpoints, API_ENDPOINTS };