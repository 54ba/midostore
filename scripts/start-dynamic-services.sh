#!/bin/bash

echo "🚀 Starting Dynamic Dropshipping Store Services"
echo "=============================================="

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

# Function to run database migrations
run_migrations() {
    echo -e "${BLUE}🗄️ Running database migrations...${NC}"

    if command_exists npx; then
        npx prisma migrate deploy
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Database migrations completed${NC}"
        else
            echo -e "${RED}❌ Database migrations failed${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️ npx not found, skipping migrations${NC}"
    fi
}

# Function to seed database with initial data
seed_database() {
    echo -e "${BLUE}🌱 Seeding database with initial data...${NC}"

    if command_exists npx; then
        echo "Seeding Gulf countries..."
        npx tsx scripts/db-seed.ts

        echo "Seeding initial products..."
        npx tsx scripts/scrape-products.ts --initial

        echo "Seeding reviews..."
        npx tsx scripts/enhanced-review-seeder.ts

        echo -e "${GREEN}✅ Database seeding completed${NC}"
    else
        echo -e "${YELLOW}⚠️ npx not found, skipping database seeding${NC}"
    fi
}

# Function to start AI services
start_ai_services() {
    echo -e "${PURPLE}🤖 Starting AI services...${NC}"

    # Start AI Agent Supervisor
    echo "Starting AI Agent Supervisor..."
    node scripts/test-ai-agent-supervisor.js > logs/ai-agent-supervisor.log 2>&1 &
    AI_AGENT_PID=$!
    echo $AI_AGENT_PID > pids/ai-agent-supervisor.pid

    # Start AI Orchestrator
    echo "Starting AI Orchestrator..."
    node scripts/test-ai-orchestrator.js > logs/ai-orchestrator.log 2>&1 &
    AI_ORCHESTRATOR_PID=$!
    echo $AI_ORCHESTRATOR_PID > pids/ai-orchestrator.pid

    # Start AI Location Recommendations
    echo "Starting AI Location Recommendations..."
    node -e "
    const { AILocationRecommendationService } = require('./lib/ai-location-recommendation-service');
    const service = new AILocationRecommendationService();
    service.startService();
    " > logs/ai-location.log 2>&1 &
    AI_LOCATION_PID=$!
    echo $AI_LOCATION_PID > pids/ai-location.pid

    echo -e "${GREEN}✅ AI services started${NC}"
}

# Function to start scraping services
start_scraping_services() {
    echo -e "${CYAN}🕷️ Starting scraping services...${NC}"

    # Start AI-Powered Scraping Service
    echo "Starting AI-Powered Scraping Service..."
    node -e "
    const { AIPoweredScrapingService } = require('./lib/ai-powered-scraping-service');
    const service = new AIPoweredScrapingService();
    service.startService();
    " > logs/ai-scraping.log 2>&1 &
    AI_SCRAPING_PID=$!
    echo $AI_SCRAPING_PID > pids/ai-scraping.pid

    # Start Product Service
    echo "Starting Product Service..."
    node -e "
    const { ProductService } = require('./lib/product-service');
    const service = new ProductService();
    service.startService();
    " > logs/product-service.log 2>&1 &
    PRODUCT_SERVICE_PID=$!
    echo $PRODUCT_SERVICE_PID > pids/product-service.pid

    # Start Scraping Service
    echo "Starting Scraping Service..."
    node -e "
    const { ScrapingService } = require('./lib/scraping-service');
    const service = new ScrapingService();
    service.startService();
    " > logs/scraping-service.log 2>&1 &
    SCRAPING_SERVICE_PID=$!
    echo $SCRAPING_SERVICE_PID > pids/scraping-service.pid

    echo -e "${GREEN}✅ Scraping services started${NC}"
}

# Function to start analytics and recommendation services
start_analytics_services() {
    echo -e "${YELLOW}📊 Starting analytics and recommendation services...${NC}"

    # Start Analytics Service
    echo "Starting Analytics Service..."
    node -e "
    const { AnalyticsService } = require('./lib/analytics-service');
    const service = new AnalyticsService();
    service.startService();
    " > logs/analytics.log 2>&1 &
    ANALYTICS_PID=$!
    echo $ANALYTICS_PID > pids/analytics.pid

    # Start Enhanced Analytics Service
    echo "Starting Enhanced Analytics Service..."
    node -e "
    const { EnhancedAnalyticsService } = require('./lib/enhanced-analytics-service');
    const service = new EnhancedAnalyticsService();
    service.startService();
    " > logs/enhanced-analytics.log 2>&1 &
    ENHANCED_ANALYTICS_PID=$!
    echo $ENHANCED_ANALYTICS_PID > pids/enhanced-analytics.pid

    # Start Recommendation Service
    echo "Starting Recommendation Service..."
    node -e "
    const { RecommendationService } = require('./lib/recommendation-service');
    const service = new RecommendationService();
    service.startService();
    " > logs/recommendations.log 2>&1 &
    RECOMMENDATIONS_PID=$!
    echo $RECOMMENDATIONS_PID > pids/recommendations.pid

    # Start AI Recommendations
    echo "Starting AI Recommendations..."
    node -e "
    const { AIRecommendationService } = require('./lib/ai-recommendation-service');
    const service = new AIRecommendationService();
    service.startService();
    " > logs/ai-recommendations.log 2>&1 &
    AI_RECOMMENDATIONS_PID=$!
    echo $AI_RECOMMENDATIONS_PID > pids/ai-recommendations.pid

    echo -e "${GREEN}✅ Analytics services started${NC}"
}

# Function to start business logic services
start_business_services() {
    echo -e "${GREEN}💼 Starting business logic services...${NC}"

    # Start Order Batching Service
    echo "Starting Order Batching Service..."
    node -e "
    const { OrderBatchingService } = require('./lib/order-batching-service');
    const service = new OrderBatchingService();
    service.startService();
    " > logs/order-batching.log 2>&1 &
    ORDER_BATCHING_PID=$!
    echo $ORDER_BATCHING_PID > pids/order-batching.pid

    # Start Bulk Pricing Service
    echo "Starting Bulk Pricing Service..."
    node -e "
    const { BulkPricingService } = require('./lib/bulk-pricing-service');
    const service = new BulkPricingService();
    service.startService();
    " > logs/bulk-pricing.log 2>&1 &
    BULK_PRICING_PID=$!
    echo $BULK_PRICING_PID > pids/bulk-pricing.pid

    # Start Pricing Service
    echo "Starting Pricing Service..."
    node -e "
    const { PricingService } = require('./lib/pricing-service');
    const service = new PricingService();
    service.startService();
    " > logs/pricing.log 2>&1 &
    PRICING_PID=$!
    echo $PRICING_PID > pids/pricing.pid

    # Start Exchange Rate Service
    echo "Starting Exchange Rate Service..."
    node -e "
    const { ExchangeRateService } = require('./lib/exchange-rate-service');
    const service = new ExchangeRateService();
    service.startService();
    " > logs/exchange-rates.log 2>&1 &
    EXCHANGE_RATES_PID=$!
    echo $EXCHANGE_RATES_PID > pids/exchange-rates.pid

    echo -e "${GREEN}✅ Business services started${NC}"
}

# Function to start scheduled tasks
start_scheduled_tasks() {
    echo -e "${BLUE}⏰ Starting scheduled tasks...${NC}"

    # Start Scheduled Tasks Service
    echo "Starting Scheduled Tasks Service..."
    node -e "
    const { ScheduledTasksService } = require('./lib/scheduled-tasks');
    const service = new ScheduledTasksService();
    service.startService();
    " > logs/scheduled-tasks.log 2>&1 &
    SCHEDULED_TASKS_PID=$!
    echo $SCHEDULED_TASKS_PID > pids/scheduled-tasks.pid

    echo -e "${GREEN}✅ Scheduled tasks started${NC}"
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

# Run database setup
echo -e "${BLUE}🗄️ Setting up database...${NC}"
run_migrations
seed_database

# Start all services
echo -e "${BLUE}🚀 Starting all services...${NC}"

start_ai_services
start_scraping_services
start_analytics_services
start_business_services
start_scheduled_tasks

# Wait for services to initialize
echo -e "${BLUE}⏳ Waiting for services to initialize...${NC}"
sleep 5

# Start Next.js development server
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

# Display service status
echo ""
echo -e "${GREEN}🎉 All services are running!${NC}"
echo "=============================================="
echo -e "${BLUE}🌐 Next.js App:${NC} http://localhost:$NEXT_PORT"
echo ""
echo -e "${PURPLE}🤖 AI Services:${NC}"
echo "   - AI Agent Supervisor: logs/ai-agent-supervisor.log"
echo "   - AI Orchestrator: logs/ai-orchestrator.log"
echo "   - AI Location: logs/ai-location.log"
echo ""
echo -e "${CYAN}🕷️ Scraping Services:${NC}"
echo "   - AI Scraping: logs/ai-scraping.log"
echo "   - Product Service: logs/product-service.log"
echo "   - Scraping Service: logs/scraping-service.log"
echo ""
echo -e "${YELLOW}📊 Analytics Services:${NC}"
echo "   - Analytics: logs/analytics.log"
echo "   - Enhanced Analytics: logs/enhanced-analytics.log"
echo "   - Recommendations: logs/recommendations.log"
echo "   - AI Recommendations: logs/ai-recommendations.log"
echo ""
echo -e "${GREEN}💼 Business Services:${NC}"
echo "   - Order Batching: logs/order-batching.log"
echo "   - Bulk Pricing: logs/bulk-pricing.log"
echo "   - Pricing: logs/pricing.log"
echo "   - Exchange Rates: logs/exchange-rates.log"
echo ""
echo -e "${BLUE}⏰ Scheduled Tasks:${NC}"
echo "   - Scheduled Tasks: logs/scheduled-tasks.log"
echo ""
echo -e "${YELLOW}📋 Log files:${NC}"
echo "   Next.js: logs/next-service.log"
echo "   All services: logs/*.log"
echo ""
echo -e "${YELLOW}🛑 Press Ctrl+C to stop all services${NC}"

# Keep script running and monitor services
while true; do
    # Check if Next.js is still running
    if ! kill -0 $NEXT_PID 2>/dev/null; then
        echo -e "${RED}❌ Next.js service stopped unexpectedly${NC}"
        break
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