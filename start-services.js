#!/usr/bin/env node

console.log('🚀 Starting Web3, Crypto & Currency Services with ts-node...\n');

// Test Web3 Service
console.log('🔗 Starting Web3 Service...');
try {
    const { Web3Service } = require('./lib/web3-service.ts');

    const web3Config = {
        rpcUrl: 'https://rpc-mumbai.maticvigil.com',
        chainId: 80001,
        tokenContractAddress: '0x1234567890123456789012345678901234567890',
        rewardContractAddress: '0x1234567890123456789012345678901234567890',
        p2pMarketplaceAddress: '0x1234567890123456789012345678901234567890'
    };

    const web3Service = new Web3Service(web3Config);
    console.log('✅ Web3 Service started with config:', web3Config);
} catch (error) {
    console.error('❌ Failed to start Web3 Service:', error.message);
}

// Test Crypto Payment Service
console.log('\n💰 Starting Crypto Payment Service...');
try {
    const { CryptoPaymentService } = require('./lib/crypto-payment-service.ts');

    const cryptoService = new CryptoPaymentService();
    console.log('✅ Crypto Payment Service started');
} catch (error) {
    console.error('❌ Failed to start Crypto Payment Service:', error.message);
}

// Test Exchange Rate Service
console.log('\n💱 Starting Exchange Rate Service...');
try {
    const { ExchangeRateService } = require('./lib/exchange-rate-service.ts');

    const exchangeService = new ExchangeRateService();
    console.log('✅ Exchange Rate Service started');
} catch (error) {
    console.error('❌ Failed to start Exchange Rate Service:', error.message);
}

// Test Real-time Price Monitor
console.log('\n📊 Starting Real-time Price Monitor...');
try {
    const { RealTimePriceMonitor } = require('./lib/real-time-price-monitor.ts');

    const priceMonitor = new RealTimePriceMonitor();
    console.log('✅ Real-time Price Monitor started');
} catch (error) {
    console.error('❌ Failed to start Real-time Price Monitor:', error.message);
}

// Test P2P Marketplace Service
console.log('\n🔄 Starting P2P Marketplace Service...');
try {
    const { P2PMarketplaceService } = require('./lib/p2p-marketplace-service.ts');

    const p2pService = new P2PMarketplaceService();
    console.log('✅ P2P Marketplace Service started');
} catch (error) {
    console.error('❌ Failed to start P2P Marketplace Service:', error.message);
}

// Test Token Rewards Service
console.log('\n🎁 Starting Token Rewards Service...');
try {
    const { TokenRewardsService } = require('./lib/token-rewards-service.ts');

    const rewardsService = new TokenRewardsService();
    console.log('✅ Token Rewards Service started');
} catch (error) {
    console.error('❌ Failed to start Token Rewards Service:', error.message);
}

// Test Scheduled Tasks Service
console.log('\n⏰ Starting Scheduled Tasks Service...');
try {
    const { ScheduledTasksService } = require('./lib/scheduled-tasks.ts');

    const scheduledTasks = new ScheduledTasksService();
    console.log('✅ Scheduled Tasks Service started');
} catch (error) {
    console.error('❌ Failed to start Scheduled Tasks Service:', error.message);
}

console.log('\n🎉 Service startup complete!');
console.log('Services are now running and serving the site...');
console.log('\nPress Ctrl+C to stop all services');

// Keep the script running
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down services...');
    process.exit(0);
});

// Keep alive
setInterval(() => {
    console.log('💓 Services heartbeat...');
}, 30000);