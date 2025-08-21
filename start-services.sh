#!/bin/bash

echo "🚀 Starting Dynamic Dropshipping Store Services"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

if ! command_exists python3; then
    echo -e "${RED}❌ Python 3 is not installed. Please install Python 3.8+ first.${NC}"
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

# Check Python version
PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
echo -e "${GREEN}✅ Python version: $PYTHON_VERSION${NC}"

# Install dependencies if needed
echo -e "${BLUE}📦 Installing/updating dependencies...${NC}"

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
else
    echo "Node.js dependencies already installed"
fi

# Setup AI service if needed
if [ ! -d "ai/venv" ]; then
    echo -e "${YELLOW}🤖 Setting up AI service...${NC}"
    chmod +x scripts/setup-ai-analytics.sh
    ./scripts/setup-ai-analytics.sh
else
    echo -e "${GREEN}✅ AI service already set up${NC}"
fi

# Create necessary directories
mkdir -p .next
mkdir -p ai/models

# Set environment variables
export NODE_ENV=${NODE_ENV:-"development"}
export API_HOST=${API_HOST:-"0.0.0.0"}
export API_PORT=${API_PORT:-8000}
export NEXT_PORT=${NEXT_PORT:-3000}

echo -e "${BLUE}🔧 Environment configuration:${NC}"
echo "   NODE_ENV: $NODE_ENV"
echo "   API_HOST: $API_HOST"
echo "   API_PORT: $API_PORT"
echo "   NEXT_PORT: $NEXT_PORT"

# Function to cleanup background processes
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down services...${NC}"

    # Kill background processes
    if [ ! -z "$NEXT_PID" ]; then
        echo "Stopping Next.js service..."
        kill $NEXT_PID 2>/dev/null
    fi

    if [ ! -z "$AI_PID" ]; then
        echo "Stopping AI service..."
        kill $AI_PID 2>/dev/null
    fi

    # Wait for processes to finish
    wait 2>/dev/null

    echo -e "${GREEN}✅ All services stopped${NC}"
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Start AI service in background
echo -e "${BLUE}🤖 Starting AI Analytics service...${NC}"
cd ai
chmod +x start_ai_service.sh
bash start_ai_service.sh > ../ai-service.log 2>&1 &
AI_PID=$!
cd ..

# Wait a moment for AI service to start
sleep 3

# Check if AI service started successfully
if ! kill -0 $AI_PID 2>/dev/null; then
    echo -e "${RED}❌ Failed to start AI service${NC}"
    echo "Check ai-service.log for details"
    exit 1
fi

echo -e "${GREEN}✅ AI service started (PID: $AI_PID)${NC}"

# Wait for AI service to be ready
if wait_for_service "http://localhost:$API_PORT/health" "AI Analytics API"; then
    echo -e "${GREEN}✅ AI service is responding${NC}"
else
    echo -e "${YELLOW}⚠️ AI service may not be fully ready yet${NC}"
fi

# Start Next.js development server
echo -e "${BLUE}🌐 Starting Next.js development server...${NC}"

if [ "$NODE_ENV" = "production" ]; then
    echo "Building for production..."
    npm run build
    echo "Starting production server..."
    npm start > next-service.log 2>&1 &
else
    echo "Starting development server..."
    npm run dev > next-service.log 2>&1 &
fi

NEXT_PID=$!

# Wait a moment for Next.js to start
sleep 5

# Check if Next.js started successfully
if ! kill -0 $NEXT_PID 2>/dev/null; then
    echo -e "${RED}❌ Failed to start Next.js service${NC}"
    echo "Check next-service.log for details"
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
echo -e "${BLUE}🤖 AI Analytics API:${NC} http://localhost:$API_PORT"
echo -e "${BLUE}📚 AI API Docs:${NC} http://localhost:$API_PORT/docs"
echo -e "${BLUE}💚 AI Health:${NC} http://localhost:$API_PORT/health"
echo ""
echo -e "${YELLOW}📋 Log files:${NC}"
echo "   Next.js: next-service.log"
echo "   AI Service: ai-service.log"
echo ""
echo -e "${YELLOW}🛑 Press Ctrl+C to stop all services${NC}"

# Keep script running and monitor services
while true; do
    # Check if services are still running
    if ! kill -0 $NEXT_PID 2>/dev/null; then
        echo -e "${RED}❌ Next.js service stopped unexpectedly${NC}"
        break
    fi

    if ! kill -0 $AI_PID 2>/dev/null; then
        echo -e "${RED}❌ AI service stopped unexpectedly${NC}"
        break
    fi

    sleep 10
done

# Cleanup on exit
cleanup