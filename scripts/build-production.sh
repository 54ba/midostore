#!/bin/bash

# VPS Production Build Script with Memory Management
# Fixes: MongoDB connection and memory issues

set -e

echo "🚀 Building MidoStore for Production"
echo "====================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Run this from the project root.${NC}"
    exit 1
fi

echo -e "${YELLOW}🔍 Step 1: Checking environment...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    exit 1
fi

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL=mongodb" .env; then
    echo -e "${RED}❌ Error: DATABASE_URL not configured in .env${NC}"
    echo "Please add: DATABASE_URL=mongodb+srv://..."
    exit 1
fi

echo -e "${GREEN}✅ Environment configured${NC}"

echo -e "${YELLOW}📦 Step 2: Installing dependencies...${NC}"
npm install

echo -e "${YELLOW}🗄️ Step 3: Generating Prisma client...${NC}"
npx prisma generate

echo -e "${YELLOW}🔨 Step 4: Building with increased memory...${NC}"
# Increase Node.js heap size to 4GB to prevent OOM errors
export NODE_OPTIONS="--max-old-space-size=4096"

# Build with memory optimization
echo "Building Next.js application..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build completed successfully!${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${YELLOW}🧹 Step 5: Cleaning up...${NC}"
# Clear any build caches to free memory
npm cache clean --force 2>/dev/null || true

echo -e "${GREEN}✅ Production build ready!${NC}"
echo ""
echo "📁 Build output: .next/"
echo "🚀 Next step: Start with PM2"
echo "   pm2 start npm --name midostore -- start"
