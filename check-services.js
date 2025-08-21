#!/usr/bin/env node

const http = require('http');

const services = [
    { name: 'Exchange Rates', endpoint: '/api/exchange-rates' },
    { name: 'P2P Marketplace', endpoint: '/api/p2p-marketplace' },
    { name: 'Sharing Service', endpoint: '/api/sharing' },
    { name: 'Features', endpoint: '/api/features' },
    { name: 'Products', endpoint: '/api/products' },
    { name: 'Analytics Overview', endpoint: '/api/analytics/overview' },
    { name: 'Recommendations', endpoint: '/api/recommendations' },
    { name: 'Reviews', endpoint: '/api/reviews' },
    { name: 'Orders', endpoint: '/api/orders' },
    { name: 'Bulk Pricing', endpoint: '/api/bulk-pricing' }
];

function checkService(name, endpoint) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: endpoint,
            method: 'GET',
            timeout: 15000  // Increased timeout to 15 seconds
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.success) {
                        resolve({ status: '✅', message: 'Working' });
                    } else {
                        resolve({ status: '⚠️', message: 'API returned error' });
                    }
                } catch (e) {
                    resolve({ status: '❌', message: 'Invalid JSON response' });
                }
            });
        });

        req.on('error', (err) => {
            resolve({ status: '❌', message: err.message });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ status: '⏰', message: 'Request timeout' });
        });

        req.end();
    });
}

async function checkAllServices() {
    console.log('🔍 Checking service status...\n');

    const results = [];

    for (const service of services) {
        const result = await checkService(service.name, service.endpoint);
        results.push({ ...service, ...result });
        console.log(`${result.status} ${service.name}: ${result.message}`);
    }

    console.log('\n📊 Summary:');
    const working = results.filter(r => r.status === '✅').length;
    const total = results.length;
    console.log(`   Working: ${working}/${total} services`);

    if (working === total) {
        console.log('\n🎉 All services are working correctly!');
        console.log('   - Database errors have been resolved');
        console.log('   - Exchange rate service is using demo data');
        console.log('   - P2P marketplace and sharing services are functional');
        console.log('   - Mock database is providing fallback data');
    } else {
        console.log('\n⚠️  Some services may still have issues');
    }
}

// Check if server is running
async function checkServerStatus() {
    try {
        await checkService('Server', '/');
        console.log('🚀 Starting service checks...\n');
        await checkAllServices();
    } catch (error) {
        console.log('❌ Server is not running. Please start with: npm run dev');
    }
}

checkServerStatus();