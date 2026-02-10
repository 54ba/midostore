#!/bin/bash

# Quick deployment script for VPS
# Run this on your VPS: bash deploy-fixes.sh

set -e

echo "🚀 Deploying Scraping Service Fixes to VPS..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Navigate to project directory
cd ~/midostore || { echo "❌ Project directory not found"; exit 1; }

echo -e "${YELLOW}📥 Pulling latest changes...${NC}"
git pull origin main

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

echo -e "${YELLOW}🔄 Restarting services...${NC}"
pm2 restart all || pm2 start npm --name "midostore" -- start

echo -e "${YELLOW}💾 Saving PM2 configuration...${NC}"
pm2 save

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📊 Service Status:"
pm2 list

echo ""
echo "📝 View logs with:"
echo "  pm2 logs midostore"
echo ""
echo "🧪 Test scraping with:"
echo "  cd ~/midostore && npx tsx scripts/scrape-products.ts alibaba electronics 1"
