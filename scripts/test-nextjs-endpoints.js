#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

// Test results storage
const testResults = {
    passed: [],
    failed: [],
    errors: [],
    warnings: []
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
                'User-Agent': 'NextJS-Test-Script/1.0'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                try {
                    const responseData = body ? (body.startsWith('{') || body.startsWith('[') ? JSON.parse(body) : body) : {};
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: responseData,
                        rawBody: body,
                        url: url
                    });
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: body,
                        rawBody: body,
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

// Get all API routes by scanning the filesystem
function getAllApiRoutes() {
    const apiRoutes = [];
    const apiDir = path.join(process.cwd(), 'src/app/api');

    function scanDirectory(dir, basePath = '/api') {
        try {
            const items = fs.readdirSync(dir);

            for (const item of items) {
                const itemPath = path.join(dir, item);
                const stat = fs.statSync(itemPath);

                if (stat.isDirectory()) {
                    // Recurse into subdirectory
                    scanDirectory(itemPath, `${basePath}/${item}`);
                } else if (item === 'route.ts' || item === 'route.js') {
                    // Found an API route
                    apiRoutes.push(basePath);
                }
            }
        } catch (error) {
            console.warn(`Warning: Could not scan directory ${dir}: ${error.message}`);
        }
    }

    if (fs.existsSync(apiDir)) {
        scanDirectory(apiDir);
    }

    return apiRoutes;
}

// Get all page routes by scanning the filesystem
function getAllPageRoutes() {
    const pageRoutes = [];
    const appDir = path.join(process.cwd(), 'src/app');

    function scanDirectory(dir, basePath = '') {
        try {
            const items = fs.readdirSync(dir);

            for (const item of items) {
                const itemPath = path.join(dir, item);
                const stat = fs.statSync(itemPath);

                if (stat.isDirectory()) {
                    // Skip API directory and special Next.js directories
                    if (item === 'api' || item.startsWith('_')) {
                        continue;
                    }

                    // Handle route groups (folders in parentheses)
                    if (item.startsWith('(') && item.endsWith(')')) {
                        // Route group - scan contents but don't add to path
                        scanDirectory(itemPath, basePath);
                    } else {
                        // Regular directory - add to path
                        scanDirectory(itemPath, `${basePath}/${item}`);
                    }
                } else if (item === 'page.tsx' || item === 'page.js') {
                    // Found a page route
                    const route = basePath || '/';
                    pageRoutes.push(route);
                }
            }
        } catch (error) {
            console.warn(`Warning: Could not scan directory ${dir}: ${error.message}`);
        }
    }

    if (fs.existsSync(appDir)) {
        scanDirectory(appDir);
    }

    return pageRoutes;
}

// Test a single endpoint
async function testEndpoint(endpoint, type = 'API') {
    console.log(`\n🔍 Testing ${type}: ${endpoint}`);

    try {
        const startTime = Date.now();
        const response = await makeRequest(endpoint);
        const responseTime = Date.now() - startTime;

        console.log(`   Status: ${response.statusCode}`);
        console.log(`   Time: ${responseTime}ms`);

        // Check for various types of errors
        let hasRuntimeError = false;
        let errorDetails = [];

        // Check for server errors (5xx)
        if (response.statusCode >= 500) {
            hasRuntimeError = true;
            errorDetails.push(`Server Error: HTTP ${response.statusCode}`);
        }

        // Check for Next.js specific errors in response body
        if (typeof response.data === 'string') {
            if (response.data.includes('Application error') ||
                response.data.includes('Internal Server Error') ||
                response.data.includes('TypeError') ||
                response.data.includes('ReferenceError') ||
                response.data.includes('SyntaxError') ||
                response.data.includes('Cannot read property') ||
                response.data.includes('Cannot read properties') ||
                response.data.includes('is not defined') ||
                response.data.includes('Module not found')) {
                hasRuntimeError = true;
                errorDetails.push('Runtime error detected in response body');
            }
        }

        // Check for JSON API errors
        if (typeof response.data === 'object' && response.data.error) {
            if (response.data.error.includes('Internal server error') ||
                response.data.error.includes('Failed to process request')) {
                hasRuntimeError = true;
                errorDetails.push(`API Error: ${response.data.error}`);
            }
        }

        // Check response headers for errors
        if (response.headers['x-nextjs-cache'] === 'ERROR') {
            hasRuntimeError = true;
            errorDetails.push('Next.js cache error detected');
        }

        if (hasRuntimeError) {
            console.log(`   ❌ RUNTIME ERROR`);
            testResults.errors.push({
                endpoint,
                type,
                statusCode: response.statusCode,
                responseTime,
                errors: errorDetails,
                data: response.data
            });
        } else if (response.statusCode >= 200 && response.statusCode < 300) {
            console.log(`   ✅ PASSED`);
            testResults.passed.push({
                endpoint,
                type,
                statusCode: response.statusCode,
                responseTime,
                data: response.data
            });
        } else if (response.statusCode >= 400 && response.statusCode < 500) {
            console.log(`   ⚠️  CLIENT ERROR (${response.statusCode})`);
            testResults.warnings.push({
                endpoint,
                type,
                statusCode: response.statusCode,
                responseTime,
                warning: `HTTP ${response.statusCode}`,
                data: response.data
            });
        }

    } catch (error) {
        console.log(`   ❌ FAILED: ${error.error || error.message}`);
        testResults.failed.push({
            endpoint,
            type,
            error: error.error || error.message,
            data: null
        });
    }
}

// Test dynamic routes with sample parameters
async function testDynamicRoutes() {
    console.log('\n📝 Testing dynamic routes with sample parameters...');

    const dynamicRoutes = [
        // Product detail pages
        { route: '/products/demo-product-123', description: 'Product detail page' },
        { route: '/products/test-product-456', description: 'Product detail page (alt)' },

        // Dashboard routes with potential dynamic segments
        { route: '/products', description: 'Products page' },
        { route: '/cart', description: 'Cart page' },
        { route: '/checkout', description: 'Checkout page' },
        { route: '/orders', description: 'Orders page' },
        { route: '/account', description: 'Account page' },

        // API routes with parameters
        { route: '/api/products?category=electronics', description: 'Products API with category filter' },
        { route: '/api/products?search=headphones', description: 'Products API with search' },
        { route: '/api/recommendations?type=popular&category=electronics&nItems=4', description: 'Recommendations API' },
        { route: '/api/analytics/overview?timeRange=7d', description: 'Analytics API with time range' },
        { route: '/api/placeholder/400/300?text=Test', description: 'Placeholder image API' },
    ];

    for (const { route, description } of dynamicRoutes) {
        await testEndpoint(route, 'DYNAMIC');
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
    }
}

// Test POST endpoints with various payloads
async function testPostEndpoints() {
    console.log('\n📝 Testing POST endpoints for runtime errors...');

    const postTests = [
        {
            endpoint: '/api/users',
            data: { email: 'test@example.com', full_name: 'Test User', role: 'customer' },
            description: 'Create user'
        },
        {
            endpoint: '/api/orders',
            data: { product_id: 'test-123', product_name: 'Test Product', quantity: 1, total_amount: 29.99 },
            description: 'Create order'
        },
        {
            endpoint: '/api/reviews',
            data: { userId: 'test-123', productId: 'product-123', rating: 5, comment: 'Great product!' },
            description: 'Create review'
        },
        {
            endpoint: '/api/ai-orchestrator',
            data: { action: 'analyze', data: { test: true } },
            description: 'AI Orchestrator POST'
        },
        {
            endpoint: '/api/bulk-pricing',
            data: { action: 'setup-pricing', productId: 'test-123', customTiers: [] },
            description: 'Bulk pricing setup'
        }
    ];

    for (const test of postTests) {
        try {
            console.log(`\n🔍 Testing POST: ${test.endpoint} (${test.description})`);
            const response = await makeRequest(test.endpoint, 'POST', test.data);

            // Check for runtime errors in POST responses
            let hasRuntimeError = false;
            if (response.statusCode >= 500) {
                hasRuntimeError = true;
                testResults.errors.push({
                    endpoint: test.endpoint,
                    type: 'POST',
                    method: 'POST',
                    statusCode: response.statusCode,
                    error: `Server Error: HTTP ${response.statusCode}`,
                    data: response.data
                });
                console.log(`   ❌ RUNTIME ERROR: HTTP ${response.statusCode}`);
            } else {
                console.log(`   Status: ${response.statusCode}`);
                if (response.statusCode >= 200 && response.statusCode < 300) {
                    console.log(`   ✅ POST PASSED`);
                    testResults.passed.push({
                        endpoint: test.endpoint,
                        type: 'POST',
                        method: 'POST',
                        statusCode: response.statusCode,
                        data: response.data
                    });
                } else {
                    console.log(`   ⚠️  CLIENT ERROR (${response.statusCode})`);
                    testResults.warnings.push({
                        endpoint: test.endpoint,
                        type: 'POST',
                        method: 'POST',
                        statusCode: response.statusCode,
                        warning: `HTTP ${response.statusCode}`,
                        data: response.data
                    });
                }
            }
        } catch (error) {
            console.log(`   ❌ POST ERROR: ${error.error || error.message}`);
            testResults.failed.push({
                endpoint: test.endpoint,
                type: 'POST',
                method: 'POST',
                error: error.error || error.message
            });
        }

        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
    }
}

// Main test execution
async function runAllTests() {
    console.log('🚀 Starting comprehensive Next.js endpoint testing...');
    console.log(`📍 Base URL: ${BASE_URL}`);

    const startTime = Date.now();

    // Discover all routes
    console.log('\n📂 Discovering routes...');
    const apiRoutes = getAllApiRoutes();
    const pageRoutes = getAllPageRoutes();

    console.log(`📊 Found ${apiRoutes.length} API routes and ${pageRoutes.length} page routes`);

    // Test API routes
    console.log('\n🔧 Testing API Routes...');
    for (const route of apiRoutes) {
        await testEndpoint(route, 'API');
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Test page routes
    console.log('\n📄 Testing Page Routes...');
    for (const route of pageRoutes) {
        await testEndpoint(route, 'PAGE');
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Test dynamic routes
    await testDynamicRoutes();

    // Test POST endpoints
    await testPostEndpoints();

    const totalTime = Date.now() - startTime;

    // Print comprehensive summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 COMPREHENSIVE NEXT.JS ENDPOINT TEST SUMMARY');
    console.log('='.repeat(80));
    console.log(`✅ Passed: ${testResults.passed.length}`);
    console.log(`⚠️  Warnings: ${testResults.warnings.length}`);
    console.log(`❌ Failed: ${testResults.failed.length}`);
    console.log(`🚨 Runtime Errors: ${testResults.errors.length}`);
    console.log(`⏱️  Total Time: ${totalTime}ms`);
    console.log(`📊 Total Endpoints Tested: ${testResults.passed.length + testResults.warnings.length + testResults.failed.length + testResults.errors.length}`);

    if (testResults.errors.length > 0) {
        console.log('\n🚨 RUNTIME ERRORS DETECTED:');
        testResults.errors.forEach(error => {
            console.log(`   ${error.endpoint} (${error.type}): ${error.errors ? error.errors.join(', ') : error.error}`);
        });
    }

    if (testResults.failed.length > 0) {
        console.log('\n❌ FAILED ENDPOINTS:');
        testResults.failed.forEach(fail => {
            console.log(`   ${fail.endpoint} (${fail.type}): ${fail.error}`);
        });
    }

    if (testResults.warnings.length > 0) {
        console.log('\n⚠️  WARNING ENDPOINTS (Client Errors):');
        testResults.warnings.forEach(warn => {
            console.log(`   ${warn.endpoint} (${warn.type}): ${warn.warning}`);
        });
    }

    if (testResults.passed.length > 0) {
        console.log('\n✅ SUCCESSFUL ENDPOINTS:');
        const groupedByType = {};
        testResults.passed.forEach(pass => {
            if (!groupedByType[pass.type]) groupedByType[pass.type] = [];
            groupedByType[pass.type].push(pass);
        });

        Object.keys(groupedByType).forEach(type => {
            console.log(`\n   ${type} Routes (${groupedByType[type].length}):`);
            groupedByType[type].forEach(pass => {
                console.log(`     ${pass.endpoint} (${pass.responseTime}ms)`);
            });
        });
    }

    console.log('\n' + '='.repeat(80));

    // Performance analysis
    if (testResults.passed.length > 0) {
        const responseTimes = testResults.passed.map(p => p.responseTime).filter(t => t);
        if (responseTimes.length > 0) {
            const avgTime = Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length);
            const maxTime = Math.max(...responseTimes);
            const minTime = Math.min(...responseTimes);

            console.log('⚡ PERFORMANCE ANALYSIS:');
            console.log(`   Average Response Time: ${avgTime}ms`);
            console.log(`   Fastest Response: ${minTime}ms`);
            console.log(`   Slowest Response: ${maxTime}ms`);

            if (maxTime > 5000) {
                console.log(`   ⚠️  Warning: Some endpoints are slow (>${maxTime}ms)`);
            }
        }
    }

    console.log('\n' + '='.repeat(80));

    // Exit with appropriate code
    if (testResults.errors.length === 0 && testResults.failed.length === 0) {
        console.log('🎉 All Next.js endpoints are working without runtime errors!');
        process.exit(0);
    } else {
        console.log('⚠️  Some endpoints have runtime errors or failures that need attention');
        process.exit(1);
    }
}

// Check if server is running
async function checkServerHealth() {
    try {
        const response = await makeRequest('/');
        console.log('✅ Next.js server is running and responding');
        return true;
    } catch (error) {
        console.log('❌ Next.js server is not running or not accessible');
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

module.exports = { testEndpoint, makeRequest, getAllApiRoutes, getAllPageRoutes };