#!/bin/bash

# VPS Production Deployment Script
# Run this on your VPS to properly deploy the application

set -e

echo "🚀 MidoStore Production Deployment"
echo "===================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Navigate to project directory
cd ~/midostore || { echo -e "${RED}❌ Project directory not found${NC}"; exit 1; }

echo -e "${YELLOW}📥 Step 1: Pulling latest changes...${NC}"
git pull origin main

echo -e "${YELLOW}📦 Step 2: Installing dependencies...${NC}"
npm install

echo -e "${YELLOW}🔨 Step 3: Building application...${NC}"
# This is critical - builds the .next directory
npm run build

echo -e "${YELLOW}🗄️ Step 4: Setting up database...${NC}"
# Generate Prisma client
npx prisma generate

# Push schema to database (safe, won't drop data)
npx prisma db push --skip-generate

echo -e "${YELLOW}🌱 Step 5: Seeding database (if needed)...${NC}"
# Only seed if no products exist
PRODUCT_COUNT=$(npx tsx -e "import { prisma } from './lib/db'; prisma.product.count().then(c => console.log(c)).catch(() => console.log('0'))" 2>/dev/null || echo "0")
if [ "$PRODUCT_COUNT" -lt "2" ]; then
    echo "Seeding database..."
    npm run db:seed
else
    echo "Database already seeded (${PRODUCT_COUNT} products found)"
fi

echo -e "${YELLOW}🔄 Step 6: Managing PM2 processes...${NC}"
# Stop all existing processes
pm2 delete all 2>/dev/null || true

# Start the application in production mode
pm2 start npm --name "midostore" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup systemd -u ubuntu --hp /home/ubuntu 2>/dev/null || true

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📊 Service Status:"
pm2 list

echo ""
echo -e "${GREEN}🌐 Your application is now running!${NC}"
echo "   Local: http://localhost:3000"
echo "   Network: http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo "📝 Useful commands:"
echo "   View logs: pm2 logs midostore"
echo "   Restart: pm2 restart midostore"
echo "   Stop: pm2 stop midostore"
echo "   Monitor: pm2 monit"
echo ""
echo "⚠️  Note: Background services (AI, scraping, etc.) are managed by the AI Orchestrator"
echo "   They will auto-start when needed through the Next.js API routes"
