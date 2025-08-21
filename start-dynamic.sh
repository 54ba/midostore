#!/bin/bash

echo "🚀 Starting Dynamic Dropshipping Store"
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if database is seeded
echo -e "${BLUE}🔍 Checking database status...${NC}"

# Check if products exist
PRODUCT_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) as count FROM \"Product\"" 2>/dev/null | grep -o '[0-9]*' | head -1 || echo "0")

if [ "$PRODUCT_COUNT" -eq "0" ] || [ -z "$PRODUCT_COUNT" ]; then
    echo -e "${YELLOW}⚠️ Database is empty. Seeding with initial data...${NC}"

    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install
    fi

    # Run comprehensive seeding
    echo "Running comprehensive database seeding..."
    npx tsx scripts/comprehensive-seed.ts

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database seeded successfully!${NC}"
    else
        echo -e "${YELLOW}⚠️ Database seeding had issues, but continuing...${NC}"
    fi
else
    echo -e "${GREEN}✅ Database already has ${PRODUCT_COUNT} products${NC}"
fi

# Start the dynamic services
echo -e "${BLUE}🚀 Starting dynamic services...${NC}"
./scripts/start-dynamic-services.sh