#!/usr/bin/env node

console.log('🔍 Checking Web3, Crypto & Currency Services Status...\n');

// Check if services are running
const { exec } = require('child_process');

exec('ps aux | grep "ts-node" | grep -v grep', (error, stdout, stderr) => {
    if (error) {
        console.error('❌ Error checking services:', error);
        return;
    }

    if (stdout.trim()) {
        console.log('✅ Services are running:');
        console.log(stdout);

        // Check Next.js server
        exec('curl -s http://localhost:3000 > /dev/null && echo "✅ Next.js server is responding" || echo "❌ Next.js server not responding"', (error, stdout, stderr) => {
            console.log(stdout);
        });

        // Check if we can access the services
        console.log('\n🔗 Testing service endpoints...');

        // Test Web3 service (if it has an API endpoint)
        exec('curl -s http://localhost:3000/api/web3 > /dev/null && echo "✅ Web3 API endpoint accessible" || echo "❌ Web3 API endpoint not accessible"', (error, stdout, stderr) => {
            console.log(stdout);
        });

        // Test crypto service (if it has an API endpoint)
        exec('curl -s http://localhost:3000/api/crypto > /dev/null && echo "✅ Crypto API endpoint accessible" || echo "❌ Crypto API endpoint not accessible"', (error, stdout, stderr) => {
            console.log(stdout);
        });

        // Test exchange rate service (if it has an API endpoint)
        exec('curl -s http://localhost:3000/api/exchange-rates > /dev/null && echo "✅ Exchange Rate API endpoint accessible" || echo "❌ Exchange Rate API endpoint not accessible"', (error, stdout, stderr) => {
            console.log(stdout);
        });

    } else {
        console.log('❌ No services are currently running');
    }
});

console.log('\n📊 Service Status Summary:');
console.log('   - Web3 Service: Checking...');
console.log('   - Crypto Payment Service: Checking...');
console.log('   - Exchange Rate Service: Checking...');
console.log('   - Real-time Price Monitor: Checking...');
console.log('   - P2P Marketplace Service: Checking...');
console.log('   - Token Rewards Service: Checking...');
console.log('   - Scheduled Tasks Service: Checking...');
console.log('   - Next.js Server: Checking...');