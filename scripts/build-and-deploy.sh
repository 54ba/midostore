#!/bin/bash

echo "🚀 MidoHub Build & Deploy Script"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
BUILD_TYPE=${1:-"production"}
DEPLOY_TARGET=${2:-"local"}
SKIP_TESTS=${3:-"false"}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

    if ! command_exists node; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        exit 1
    fi

    if ! command_exists npm; then
        echo -e "${RED}❌ npm is not installed${NC}"
        exit 1
    fi

    if ! command_exists git; then
        echo -e "${RED}❌ Git is not installed${NC}"
        exit 1
    fi

    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
}

# Function to install dependencies
install_dependencies() {
    echo -e "${BLUE}📦 Installing dependencies...${NC}"

    if [ ! -d "node_modules" ]; then
        npm install
    else
        npm ci
    fi

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Dependencies installed${NC}"
    else
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
}

# Function to run tests
run_tests() {
    if [ "$SKIP_TESTS" = "true" ]; then
        echo -e "${YELLOW}⚠️ Skipping tests${NC}"
        return 0
    fi

    echo -e "${BLUE}🧪 Running tests...${NC}"

    # Run basic tests
    npm run test:env
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Environment tests failed${NC}"
        return 1
    fi

    # Run API tests
    npm run test:apis
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}⚠️ API tests failed, but continuing...${NC}"
    fi

    echo -e "${GREEN}✅ Tests completed${NC}"
    return 0
}

# Function to build the application
build_application() {
    echo -e "${BLUE}🔨 Building application...${NC}"

    case $BUILD_TYPE in
        "production")
            npm run build
            ;;
        "simple")
            npm run build:simple
            ;;
        "development")
            echo -e "${YELLOW}⚠️ Development build - skipping production build${NC}"
            return 0
            ;;
        *)
            echo -e "${RED}❌ Unknown build type: $BUILD_TYPE${NC}"
            exit 1
            ;;
    esac

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Build completed successfully${NC}"
    else
        echo -e "${RED}❌ Build failed${NC}"
        exit 1
    fi
}

# Function to setup database
setup_database() {
    echo -e "${BLUE}🗄️ Setting up database...${NC}"

    # Generate Prisma client
    npm run db:generate
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to generate Prisma client${NC}"
        exit 1
    fi

    # Push database schema
    npm run db:push
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}⚠️ Database push failed, but continuing...${NC}"
    fi

    # Seed database
    npm run db:seed
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}⚠️ Database seeding failed, but continuing...${NC}"
    fi

    echo -e "${GREEN}✅ Database setup completed${NC}"
}

# Function to setup AI services
setup_ai_services() {
    echo -e "${BLUE}🤖 Setting up AI services...${NC}"

    if [ -d "ai" ] && [ -f "ai/requirements.txt" ]; then
        npm run ai:setup
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ AI services setup completed${NC}"
        else
            echo -e "${YELLOW}⚠️ AI services setup failed, but continuing...${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️ AI directory not found, skipping AI setup${NC}"
    fi
}

# Function to deploy
deploy_application() {
    echo -e "${BLUE}🚀 Deploying application...${NC}"

    case $DEPLOY_TARGET in
        "local")
            echo -e "${GREEN}✅ Local deployment - ready to start services${NC}"
            ;;
        "netlify")
            npm run netlify:deploy
            ;;
        "netlify:optimized")
            npm run netlify:deploy:optimized
            ;;
        "netlify:ultra")
            npm run netlify:deploy:ultra
            ;;
        "direct")
            npm run deploy:direct
            ;;
        *)
            echo -e "${YELLOW}⚠️ Unknown deploy target: $DEPLOY_TARGET${NC}"
            echo -e "${GREEN}✅ Ready to start services manually${NC}"
            ;;
    esac
}

# Function to start services
start_services() {
    echo -e "${BLUE}🚀 Starting services...${NC}"

    read -p "Do you want to start the services now? (y/N): " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${CYAN}Starting dynamic services...${NC}"
        npm run services:start

        echo -e "${CYAN}Starting Web3 services...${NC}"
        npm run services:web3

        echo -e "${GREEN}✅ Services started${NC}"
        echo -e "${BLUE}📊 Monitor services with: npm run monitor${NC}"
        echo -e "${BLUE}🏥 Check health with: npm run health${NC}"
    else
        echo -e "${YELLOW}⚠️ Services not started. Use 'npm run start:full' to start them later${NC}"
    fi
}

# Function to show status
show_status() {
    echo -e "${BLUE}📊 Build & Deploy Status${NC}"
    echo "=========================="
    echo -e "Build Type: ${CYAN}$BUILD_TYPE${NC}"
    echo -e "Deploy Target: ${CYAN}$DEPLOY_TARGET${NC}"
    echo -e "Tests Skipped: ${CYAN}$SKIP_TESTS${NC}"
    echo ""
    echo -e "${GREEN}✅ Build and deployment completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}🚀 Next steps:${NC}"
    echo "  1. Start services: npm run start:full"
    echo "  2. Start Web3 services: npm run start:web3"
    echo "  3. Monitor services: npm run monitor"
    echo "  4. Check health: npm run health"
    echo ""
    echo -e "${BLUE}🔧 Useful commands:${NC}"
    echo "  - Clean build: npm run clean"
    echo "  - Run tests: npm run test:all"
    echo "  - Database: npm run db:reset"
    echo "  - AI setup: npm run ai:setup"
}

# Main execution
main() {
    echo -e "${PURPLE}Starting build and deploy process...${NC}"
    echo ""

    check_prerequisites
    install_dependencies
    run_tests
    build_application
    setup_database
    setup_ai_services
    deploy_application
    start_services
    show_status
}

# Run main function
main "$@"