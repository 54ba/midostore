#!/usr/bin/env node

const http = require('http');
const https = require('https');

const BASE_URL = 'http://localhost:3000';

// All API endpoints to test
const API_ENDPOINTS = [
    // Core Product APIs
    '/api/products',
    '/api/recommendations',
    '/api/reviews',

    // User and Order APIs
    '/api/users',
    '/api/orders',
    '/api/payments',

    // Authentication and Payment
    '/api/stripe/create-checkout-session',

    // Analytics and AI
    '/api/analytics/overview',
    '/api/analytics/enhanced',
    '/api/analytics/live-sales',
    '/api/ai-orchestrator',
    '/api/ai-agent-supervisor',
    '/api/role-management',

    // Localization and Currency
    '/api/localization',
    '/api/exchange-rates',
    '/api/exchange-rates/update',

    // E-commerce Features
    '/api/bulk-pricing',
    '/api/advertising',
    '/api/sharing',

    // Crypto and Web3
    '/api/crypto',
    '/api/web3',
    '/api/p2p-marketplace',
    '/api/token-rewards',

    // Shipping and Logistics
    '/api/shipping',

    // Social and Marketing
    '/api/social-trends/analyze',

    // Utility APIs
    '/api/placeholder/40/40?text=Test',
    '/api/features'
];

// Test results storage
const testResults = {
    passed: [],
    failed: [],
    errors: []
};

// Helper function to make HTTP requests
function makeRequest(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url, BASE_URL);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || 3000,
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'API-Test-Script/1.0'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                try {
                    const responseData = body ? JSON.parse(body) : {};
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: responseData,
                        url: url
                    });
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: body,
                        url: url,
                        parseError: error.message
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject({
                error: error.message,
                url: url
            });
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

// Test a single endpoint
async function testEndpoint(endpoint) {
    console.log(`\n🔍 Testing: ${endpoint}`);

    try {
        const startTime = Date.now();
        const response = await makeRequest(endpoint);
        const responseTime = Date.now() - startTime;

        console.log(`   Status: ${response.statusCode}`);
        console.log(`   Time: ${responseTime}ms`);

        if (response.statusCode >= 200 && response.statusCode < 300) {
            console.log(`   ✅ PASSED`);
            testResults.passed.push({
                endpoint,
                statusCode: response.statusCode,
                responseTime,
                data: response.data
            });
        } else if (response.statusCode >= 400 && response.statusCode < 500) {
            console.log(`   ⚠️  CLIENT ERROR (${response.statusCode})`);
            testResults.failed.push({
                endpoint,
                statusCode: response.statusCode,
                responseTime,
                error: `HTTP ${response.statusCode}`,
                data: response.data
            });
        } else if (response.statusCode >= 500) {
            console.log(`   ❌ SERVER ERROR (${response.statusCode})`);
            testResults.failed.push({
                endpoint,
                statusCode: response.statusCode,
                responseTime,
                error: `HTTP ${response.statusCode}`,
                data: response.data
            });
        }

        // Check for runtime errors in response
        if (response.data && response.data.error) {
            console.log(`   🚨 Runtime Error: ${response.data.error}`);
            testResults.errors.push({
                endpoint,
                error: response.data.error,
                data: response.data
            });
        }

        // Check for unexpected data structure
        if (response.data && typeof response.data === 'object') {
            if (response.data.success === false && response.data.error) {
                console.log(`   ⚠️  API Error: ${response.data.error}`);
            }
        }

    } catch (error) {
        console.log(`   ❌ FAILED: ${error.error || error.message}`);
        testResults.failed.push({
            endpoint,
            error: error.error || error.message,
            data: null
        });
    }
}

// Test POST endpoints with sample data
async function testPostEndpoints() {
    console.log('\n📝 Testing POST endpoints with sample data...');

    const postTests = [
        {
            endpoint: '/api/orders',
            data: {
                product_id: 'test-product-123',
                product_name: 'Test Product',
                quantity: 1,
                total_amount: 29.99
            }
        },
        {
            endpoint: '/api/reviews',
            data: {
                userId: 'test-user-123',
                productId: 'test-product-123',
                rating: 5,
                comment: 'Test review from API test script'
            }
        },
        {
            endpoint: '/api/users',
            data: {
                email: 'test@example.com',
                full_name: 'Test User',
                role: 'customer'
            }
        }
    ];

    for (const test of postTests) {
        try {
            console.log(`\n🔍 Testing POST: ${test.endpoint}`);
            const response = await makeRequest(test.endpoint, 'POST', test.data);
            console.log(`   Status: ${response.statusCode}`);

            if (response.statusCode >= 200 && response.statusCode < 300) {
                console.log(`   ✅ POST PASSED`);
                testResults.passed.push({
                    endpoint: test.endpoint,
                    method: 'POST',
                    statusCode: response.statusCode,
                    data: response.data
                });
            } else {
                console.log(`   ❌ POST FAILED: ${response.statusCode}`);
                testResults.failed.push({
                    endpoint: test.endpoint,
                    method: 'POST',
                    statusCode: response.statusCode,
                    error: `HTTP ${response.statusCode}`,
                    data: response.data
                });
            }
        } catch (error) {
            console.log(`   ❌ POST ERROR: ${error.error || error.message}`);
            testResults.failed.push({
                endpoint: test.endpoint,
                method: 'POST',
                error: error.error || error.message
            });
        }
    }
}

// Main test execution
async function runAllTests() {
    console.log('🚀 Starting comprehensive API endpoint testing...');
    console.log(`📍 Base URL: ${BASE_URL}`);
    console.log(`📊 Total endpoints to test: ${API_ENDPOINTS.length}`);

    const startTime = Date.now();

    // Test all GET endpoints
    for (const endpoint of API_ENDPOINTS) {
        await testEndpoint(endpoint);
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Test POST endpoints
    await testPostEndpoints();

    const totalTime = Date.now() - startTime;

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${testResults.passed.length}`);
    console.log(`❌ Failed: ${testResults.failed.length}`);
    console.log(`🚨 Runtime Errors: ${testResults.errors.length}`);
    console.log(`⏱️  Total Time: ${totalTime}ms`);

    if (testResults.failed.length > 0) {
        console.log('\n❌ FAILED ENDPOINTS:');
        testResults.failed.forEach(fail => {
            console.log(`   ${fail.endpoint} - ${fail.error || `HTTP ${fail.statusCode}`}`);
        });
    }

    if (testResults.errors.length > 0) {
        console.log('\n🚨 RUNTIME ERRORS:');
        testResults.errors.forEach(error => {
            console.log(`   ${error.endpoint}: ${error.error}`);
        });
    }

    if (testResults.passed.length > 0) {
        console.log('\n✅ SUCCESSFUL ENDPOINTS:');
        testResults.passed.forEach(pass => {
            console.log(`   ${pass.endpoint} (${pass.responseTime}ms)`);
        });
    }

    console.log('\n' + '='.repeat(60));

    // Exit with appropriate code
    if (testResults.failed.length === 0 && testResults.errors.length === 0) {
        console.log('🎉 All tests passed!');
        process.exit(0);
    } else {
        console.log('⚠️  Some tests failed or had runtime errors');
        process.exit(1);
    }
}

// Check if server is running
async function checkServerHealth() {
    try {
        const response = await makeRequest('/');
        console.log('✅ Server is running and responding');
        return true;
    } catch (error) {
        console.log('❌ Server is not running or not accessible');
        console.log('Please start the development server with: npm run dev');
        return false;
    }
}

// Main execution
async function main() {
    try {
        const serverHealthy = await checkServerHealth();
        if (!serverHealthy) {
            process.exit(1);
        }

        await runAllTests();
    } catch (error) {
        console.error('💥 Test execution failed:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { testEndpoint, makeRequest, API_ENDPOINTS };