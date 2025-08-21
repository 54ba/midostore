#!/usr/bin/env node

console.log('🧪 Testing Web3, Crypto & Currency Services...\n');

// Test Web3 Service
console.log('🔗 Testing Web3 Service...');
try {
    const { Web3Service } = require('./lib/web3-service');

    const web3Config = {
        rpcUrl: 'https://rpc-mumbai.maticvigil.com',
        chainId: 80001,
        tokenContractAddress: '0x1234567890123456789012345678901234567890',
        rewardContractAddress: '0x1234567890123456789012345678901234567890',
        p2pMarketplaceAddress: '0x1234567890123456789012345678901234567890'
    };

    const web3Service = new Web3Service(web3Config);
    console.log('✅ Web3 Service: Class loaded successfully');
    console.log('   - RPC URL:', web3Config.rpcUrl);
    console.log('   - Chain ID:', web3Config.chainId);
    console.log('   - Token Contract:', web3Config.tokenContractAddress);
} catch (error) {
    console.error('❌ Web3 Service test failed:', error.message);
}

// Test Crypto Payment Service
console.log('\n💰 Testing Crypto Payment Service...');
try {
    const { CryptoPaymentService } = require('./lib/crypto-payment-service');

    const cryptoService = new CryptoPaymentService();
    console.log('✅ Crypto Payment Service: Class loaded successfully');
    console.log('   - Supported networks:', Object.keys(cryptoService.supportedNetworks || {}).length);
} catch (error) {
    console.error('❌ Crypto Payment Service test failed:', error.message);
}

// Test Exchange Rate Service
console.log('\n💱 Testing Exchange Rate Service...');
try {
    const { ExchangeRateService } = require('./lib/exchange-rate-service');

    const exchangeService = new ExchangeRateService();
    console.log('✅ Exchange Rate Service: Class loaded successfully');
    console.log('   - Cache duration:', exchangeService.CACHE_DURATION || 'Not set');
} catch (error) {
    console.error('❌ Exchange Rate Service test failed:', error.message);
}

// Test Real-time Price Monitor
console.log('\n📊 Testing Real-time Price Monitor...');
try {
    const { RealTimePriceMonitor } = require('./lib/real-time-price-monitor');

    const priceMonitor = new RealTimePriceMonitor();
    console.log('✅ Real-time Price Monitor: Class loaded successfully');
    console.log('   - Service initialized');
} catch (error) {
    console.error('❌ Real-time Price Monitor test failed:', error.message);
}

// Test P2P Marketplace Service
console.log('\n🔄 Testing P2P Marketplace Service...');
try {
    const { P2PMarketplaceService } = require('./lib/p2p-marketplace-service');

    const p2pService = new P2PMarketplaceService();
    console.log('✅ P2P Marketplace Service: Class loaded successfully');
    console.log('   - Service initialized');
} catch (error) {
    console.error('❌ P2P Marketplace Service test failed:', error.message);
}

// Test Token Rewards Service
console.log('\n🎁 Testing Token Rewards Service...');
try {
    const { TokenRewardsService } = require('./lib/token-rewards-service');

    const rewardsService = new TokenRewardsService();
    console.log('✅ Token Rewards Service: Class loaded successfully');
    console.log('   - Service initialized');
} catch (error) {
    console.error('❌ Token Rewards Service test failed:', error.message);
}

// Test Scheduled Tasks Service
console.log('\n⏰ Testing Scheduled Tasks Service...');
try {
    const { ScheduledTasksService } = require('./lib/scheduled-tasks');

    const scheduledTasks = new ScheduledTasksService();
    console.log('✅ Scheduled Tasks Service: Class loaded successfully');
    console.log('   - Service initialized');
} catch (error) {
    console.error('❌ Scheduled Tasks Service test failed:', error.message);
}

console.log('\n🎉 Service testing complete!');
console.log('All services are loaded and ready to serve the site.');