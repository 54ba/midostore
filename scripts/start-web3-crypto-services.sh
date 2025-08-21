#!/bin/bash

echo "🚀 Starting Web3, Crypto & Currency Conversion Services"
echo "========================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to wait for a service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1

    echo -e "${BLUE}⏳ Waiting for $service_name to be ready...${NC}"

    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ $service_name is ready!${NC}"
            return 0
        fi

        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done

    echo -e "${RED}❌ $service_name failed to start within expected time${NC}"
    return 1
}

# Check prerequisites
echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18+ is required. Current version: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node -v)${NC}"

# Create necessary directories
mkdir -p logs pids .next

# Install dependencies if needed
echo -e "${BLUE}📦 Installing/updating dependencies...${NC}"

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
else
    echo "Node.js dependencies already installed"
fi

# Set environment variables
export NODE_ENV=${NODE_ENV:-"development"}
export NEXT_PORT=${NEXT_PORT:-3000}

echo -e "${BLUE}🔧 Environment configuration:${NC}"
echo "   NODE_ENV: $NODE_ENV"
echo "   NEXT_PORT: $NEXT_PORT"

# Function to cleanup background processes
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down services...${NC}"

    # Kill all background processes
    for pid_file in pids/*.pid; do
        if [ -f "$pid_file" ]; then
            pid=$(cat "$pid_file")
            echo "Stopping service with PID: $pid"
            kill $pid 2>/dev/null
            rm "$pid_file"
        fi
    done

    # Wait for processes to finish
    wait 2>/dev/null

    echo -e "${GREEN}✅ All services stopped${NC}"
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Start Web3 Service
echo -e "${PURPLE}🔗 Starting Web3 Service...${NC}"
node -e "
const { Web3Service } = require('./lib/web3-service');

const web3Config = {
    rpcUrl: process.env.RPC_URL || 'https://rpc-mumbai.maticvigil.com',
    chainId: parseInt(process.env.CHAIN_ID) || 80001,
    tokenContractAddress: process.env.TOKEN_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890',
    rewardContractAddress: process.env.REWARD_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890',
    p2pMarketplaceAddress: process.env.P2P_MARKETPLACE_ADDRESS || '0x1234567890123456789012345678901234567890'
};

const web3Service = new Web3Service(web3Config);
web3Service.startService();
console.log('Web3 Service started with config:', web3Config);
" > logs/web3-service.log 2>&1 &
WEB3_PID=$!
echo $WEB3_PID > pids/web3-service.pid

# Start Crypto Payment Service
echo -e "${CYAN}💰 Starting Crypto Payment Service...${NC}"
node -e "
const { CryptoPaymentService } = require('./lib/crypto-payment-service');

const cryptoService = new CryptoPaymentService();
cryptoService.startService();
console.log('Crypto Payment Service started');
" > logs/crypto-payment.log 2>&1 &
CRYPTO_PID=$!
echo $CRYPTO_PID > pids/crypto-payment.pid

# Start Exchange Rate Service
echo -e "${YELLOW}💱 Starting Exchange Rate Service...${NC}"
node -e "
const { ExchangeRateService } = require('./lib/exchange-rate-service');

const exchangeService = new ExchangeRateService();
exchangeService.startService();
console.log('Exchange Rate Service started');
" > logs/exchange-rate.log 2>&1 &
EXCHANGE_PID=$!
echo $EXCHANGE_PID > pids/exchange-rate.pid

# Start Real-time Price Monitor
echo -e "${GREEN}📊 Starting Real-time Price Monitor...${NC}"
node -e "
const { RealTimePriceMonitor } = require('./lib/real-time-price-monitor');

const priceMonitor = new RealTimePriceMonitor();
priceMonitor.startService();
console.log('Real-time Price Monitor started');
" > logs/price-monitor.log 2>&1 &
PRICE_MONITOR_PID=$!
echo $PRICE_MONITOR_PID > pids/price-monitor.pid

# Start P2P Marketplace Service
echo -e "${BLUE}🔄 Starting P2P Marketplace Service...${NC}"
node -e "
const { P2PMarketplaceService } = require('./lib/p2p-marketplace-service');

const p2pService = new P2PMarketplaceService();
p2pService.startService();
console.log('P2P Marketplace Service started');
" > logs/p2p-marketplace.log 2>&1 &
P2P_PID=$!
echo $P2P_PID > pids/p2p-marketplace.pid

# Start Token Rewards Service
echo -e "${PURPLE}🎁 Starting Token Rewards Service...${NC}"
node -e "
const { TokenRewardsService } = require('./lib/token-rewards-service');

const rewardsService = new TokenRewardsService();
rewardsService.startService();
console.log('Token Rewards Service started');
" > logs/token-rewards.log 2>&1 &
REWARDS_PID=$!
echo $REWARDS_PID > pids/token-rewards.pid

# Start Scheduled Tasks (includes exchange rate updates)
echo -e "${YELLOW}⏰ Starting Scheduled Tasks Service...${NC}"
node -e "
const { ScheduledTasksService } = require('./lib/scheduled-tasks');

const scheduledTasks = new ScheduledTasksService();
scheduledTasks.startService();
console.log('Scheduled Tasks Service started');
" > logs/scheduled-tasks.log 2>&1 &
SCHEDULED_TASKS_PID=$!
echo $SCHEDULED_TASKS_PID > pids/scheduled-tasks.pid

# Wait for services to initialize
echo -e "${BLUE}⏳ Waiting for services to initialize...${NC}"
sleep 5

# Start Next.js development server if not already running
if ! port_in_use $NEXT_PORT; then
    echo -e "${BLUE}🌐 Starting Next.js development server...${NC}"

    if [ "$NODE_ENV" = "production" ]; then
        echo "Building for production..."
        npm run build
        echo "Starting production server..."
        npm start > logs/next-service.log 2>&1 &
    else
        echo "Starting development server..."
        npm run dev > logs/next-service.log 2>&1 &
    fi

    NEXT_PID=$!
    echo $NEXT_PID > pids/next.pid

    # Wait a moment for Next.js to start
    sleep 5

    # Check if Next.js started successfully
    if ! kill -0 $NEXT_PID 2>/dev/null; then
        echo -e "${RED}❌ Failed to start Next.js service${NC}"
        echo "Check logs/next-service.log for details"
        cleanup
        exit 1
    fi

    echo -e "${GREEN}✅ Next.js service started (PID: $NEXT_PID)${NC}"

    # Wait for Next.js to be ready
    if wait_for_service "http://localhost:$NEXT_PORT" "Next.js App"; then
        echo -e "${GREEN}✅ Next.js app is responding${NC}"
    else
        echo -e "${YELLOW}⚠️ Next.js app may not be fully ready yet${NC}"
    fi
else
    echo -e "${GREEN}✅ Next.js server already running on port $NEXT_PORT${NC}"
fi

# Display service status
echo ""
echo -e "${GREEN}🎉 All Web3, Crypto & Currency services are running!${NC}"
echo "========================================================"
echo -e "${BLUE}🌐 Next.js App:${NC} http://localhost:$NEXT_PORT"
echo ""
echo -e "${PURPLE}🔗 Web3 Services:${NC}"
echo "   - Web3 Service: logs/web3-service.log"
echo "   - P2P Marketplace: logs/p2p-marketplace.log"
echo "   - Token Rewards: logs/token-rewards.log"
echo ""
echo -e "${CYAN}💰 Crypto Services:${NC}"
echo "   - Crypto Payment: logs/crypto-payment.log"
echo "   - Real-time Price Monitor: logs/price-monitor.log"
echo ""
echo -e "${YELLOW}💱 Currency Services:${NC}"
echo "   - Exchange Rate: logs/exchange-rate.log"
echo "   - Scheduled Tasks: logs/scheduled-tasks.log"
echo ""
echo -e "${GREEN}📋 Log files:${NC}"
echo "   Next.js: logs/next-service.log"
echo "   All services: logs/*.log"
echo ""
echo -e "${YELLOW}🛑 Press Ctrl+C to stop all services${NC}"

# Keep script running and monitor services
while true; do
    # Check if Next.js is still running
    if [ -f "pids/next.pid" ]; then
        NEXT_PID=$(cat pids/next.pid)
        if ! kill -0 $NEXT_PID 2>/dev/null; then
            echo -e "${RED}❌ Next.js service stopped unexpectedly${NC}"
            break
        fi
    fi

    # Check other services
    for pid_file in pids/*.pid; do
        if [ -f "$pid_file" ]; then
            pid=$(cat "$pid_file")
            if ! kill -0 $pid 2>/dev/null; then
                service_name=$(basename "$pid_file" .pid)
                echo -e "${RED}❌ $service_name service stopped unexpectedly${NC}"
            fi
        fi
    done

    sleep 10
done

# Cleanup on exit
cleanup