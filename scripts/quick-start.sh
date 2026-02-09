#!/bin/bash

echo "⚡ MidoHub Quick Start for Development"
echo "======================================"

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

# Function to start development server
start_dev_server() {
    echo -e "${BLUE}🚀 Starting development server...${NC}"

    if port_in_use 3000; then
        echo -e "${YELLOW}⚠️ Port 3000 is already in use${NC}"
        echo -e "${BLUE}🔍 Checking what's running on port 3000...${NC}"
        lsof -i :3000
        echo ""
        read -p "Do you want to kill the process on port 3000? (y/N): " -n 1 -r
        echo

        if [[ $REPLY =~ ^[Yy]$ ]]; then
            lsof -ti :3000 | xargs kill -9
            echo -e "${GREEN}✅ Process killed${NC}"
        else
            echo -e "${YELLOW}⚠️ Please free up port 3000 and try again${NC}"
            return 1
        fi
    fi

    echo -e "${CYAN}Starting Next.js development server...${NC}"
    npm run dev &
    DEV_PID=$!
    echo $DEV_PID > .dev-server.pid

    # Wait for server to be ready
    wait_for_service "http://localhost:3000" "Next.js Dev Server"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Development server started successfully!${NC}"
        echo -e "${BLUE}🌐 Open http://localhost:3000 in your browser${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to start development server${NC}"
        return 1
    fi
}

# Function to detect package manager
get_pkg_manager() {
    if [ -f "pnpm-lock.yaml" ]; then
        echo "pnpm"
    elif [ -f "yarn.lock" ]; then
        echo "yarn"
    else
        echo "npm"
    fi
}

PKG_MANAGER=$(get_pkg_manager)

# Function to start development server
start_dev_server() {
    echo -e "${BLUE}🚀 Starting development server...${NC}"

    if port_in_use 3000; then
        echo -e "${YELLOW}⚠️ Port 3000 is already in use${NC}"
        echo -e "${BLUE}🔍 Checking what's running on port 3000...${NC}"
        lsof -i :3000
        echo ""
        # In non-interactive environments (VPS/CI), we might want to kill it automatically or skip
        if [ -n "$AUTO_KILL_PORT" ] || [[ "$-" == *i* ]]; then
            read -p "Do you want to kill the process on port 3000? (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                lsof -ti :3000 | xargs kill -9
                echo -e "${GREEN}✅ Process killed${NC}"
            else
                echo -e "${YELLOW}⚠️ Please free up port 3000 and try again${NC}"
                return 1
            fi
        else
            echo -e "${YELLOW}⚠️ Skipping port kill in non-interactive shell${NC}"
        fi
    fi

    echo -e "${CYAN}Starting Next.js development server with memory optimizations...${NC}"
    
    # Set memory limits for stable compilation on VPS
    export NODE_OPTIONS="--max-old-space-size=4096"
    
    $PKG_MANAGER run dev &
    DEV_PID=$!
    echo $DEV_PID > .dev-server.pid
    
    # Wait for server to be ready
    wait_for_service "http://localhost:3000" "Next.js Dev Server"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Development server started successfully!${NC}"
        echo -e "${BLUE}🌐 Open http://localhost:3000 in your browser${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to start development server${NC}"
        return 1
    fi
}

# Function to setup environment
setup_environment() {
    echo -e "${BLUE}🔧 Setting up environment...${NC}"

    # Clean stale build cache to avoid ENOENT errors
    if [ -d ".next" ]; then
        echo -e "${CYAN}🧹 Cleaning previous build cache...${NC}"
        rm -rf .next
    fi

    # Check if .env file exists
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠️ .env file not found${NC}"
        if [ -f "env.example" ]; then
            echo -e "${BLUE}📝 Copying from env.example...${NC}"
            cp env.example .env
            echo -e "${GREEN}✅ .env file created from template${NC}"
            echo -e "${YELLOW}⚠️ Please update .env with your configuration${NC}"
        else
            echo -e "${RED}❌ No environment template found${NC}"
            return 1
        fi
    else
        echo -e "${GREEN}✅ .env file found${NC}"
    fi

    # Check environment variables
    echo -e "${BLUE}🔍 Checking environment configuration...${NC}"
    $PKG_MANAGER run env:check

    return 0
}

# Function to setup database
setup_database() {
    echo -e "${BLUE}🗄️ Setting up database...${NC}"

    # Generate Prisma client
    echo -e "${CYAN}Generating Prisma client...${NC}"
    $PKG_MANAGER run db:generate

    # Push database schema
    echo -e "${CYAN}Pushing database schema...${NC}"
    $PKG_MANAGER run db:push

    # Seed database
    echo -e "${CYAN}Seeding database...${NC}"
    $PKG_MANAGER run db:seed

    echo -e "${GREEN}✅ Database setup completed${NC}"
}

# Function to start background services
start_background_services() {
    echo -e "${BLUE}🚀 Starting background services...${NC}"

    # Create logs and pids directories
    mkdir -p logs pids

    # Start AI services if available
    if [ -d "ai" ] && [ -f "ai/requirements.txt" ]; then
        echo -e "${CYAN}Starting AI services...${NC}"
        $PKG_MANAGER run ai:start &
        AI_PID=$!
        echo $AI_PID > pids/ai-service.pid
        echo -e "${GREEN}✅ AI services started (PID: $AI_PID)${NC}"
    fi

    # Start dynamic services
    echo -e "${CYAN}Starting dynamic services...${NC}"
    $PKG_MANAGER run services:start &
    DYNAMIC_PID=$!
    echo $DYNAMIC_PID > pids/dynamic-services.pid
    echo -e "${GREEN}✅ Dynamic services started (PID: $DYNAMIC_PID)${NC}"

    # Start Web3 services
    echo -e "${CYAN}Starting Web3 services...${NC}"
    $PKG_MANAGER run services:web3 &
    WEB3_PID=$!
    echo $WEB3_PID > pids/web3-services.pid
    echo -e "${GREEN}✅ Web3 services started (PID: $WEB3_PID)${NC}"
}

# Function to show status
show_status() {
    echo ""
    echo -e "${BLUE}📊 Quick Start Status${NC}"
    echo "========================"
    echo -e "${GREEN}✅ Development environment is ready!${NC}"
    echo ""
    echo -e "${BLUE}🌐 Services:${NC}"
    echo "  - Next.js Dev Server: http://localhost:3000"
    echo "  - API Endpoints: http://localhost:3000/api/*"
    echo ""
    echo -e "${BLUE}📁 Process IDs:${NC}"
    if [ -f ".dev-server.pid" ]; then
        echo "  - Dev Server: $(cat .dev-server.pid)"
    fi
    if [ -f "pids/ai-service.pid" ]; then
        echo "  - AI Services: $(cat pids/ai-service.pid)"
    fi
    if [ -f "pids/dynamic-services.pid" ]; then
        echo "  - Dynamic Services: $(cat pids/dynamic-services.pid)"
    fi
    if [ -f "pids/web3-services.pid" ]; then
        echo "  - Web3 Services: $(cat pids/web3-services.pid)"
    fi
    echo ""
    echo -e "${BLUE}🔧 Useful commands:${NC}"
    echo "  - Monitor services: npm run monitor"
    echo "  - Check health: npm run health"
    echo "  - Run tests: npm run test:all"
    echo "  - Database studio: npm run db:studio"
    echo ""
    echo -e "${BLUE}🛑 To stop all services:${NC}"
    echo "  - Kill dev server: kill \$(cat .dev-server.pid)"
    echo "  - Kill background services: pkill -f 'start-dynamic-services\|start-web3-crypto-services'"
}

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Cleaning up...${NC}"

    # Kill development server
    if [ -f ".dev-server.pid" ]; then
        kill $(cat .dev-server.pid) 2>/dev/null
        rm -f .dev-server.pid
    fi

    # Kill background services
    pkill -f "start-dynamic-services" 2>/dev/null
    pkill -f "start-web3-crypto-services" 2>/dev/null

    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Set trap for cleanup
trap cleanup EXIT

# Main execution
main() {
    echo -e "${PURPLE}Starting quick setup...${NC}"
    echo ""

    # Check prerequisites
    if ! command_exists node; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        exit 1
    fi

    if ! command_exists npm; then
        echo -e "${RED}❌ npm is not installed${NC}"
        exit 1
    fi

    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo -e "${BLUE}📦 Installing dependencies with $PKG_MANAGER...${NC}"
        if [ "$PKG_MANAGER" = "pnpm" ]; then
            pnpm install --no-frozen-lockfile
        else
            $PKG_MANAGER install
        fi
    fi

    # Setup environment
    setup_environment

    # Setup database
    setup_database

    # Start development server
    start_dev_server

    # Start background services
    start_background_services

    # Show status
    show_status

    echo ""
    echo -e "${GREEN}🎉 Quick start completed! Press Ctrl+C to stop all services${NC}"

    # Keep script running
    wait
}

# Run main function
main "$@"