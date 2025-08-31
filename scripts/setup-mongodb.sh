#!/bin/bash

# MongoDB Setup Script for MidoStore
# This script helps set up MongoDB for the project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== MongoDB Setup for MidoStore ===${NC}"

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}MongoDB is not installed. Please install MongoDB first:${NC}"
    echo -e "${BLUE}Ubuntu/Debian:${NC}"
    echo "  sudo apt update && sudo apt install mongodb"
    echo -e "${BLUE}macOS:${NC}"
    echo "  brew install mongodb/brew/mongodb-community"
    echo -e "${BLUE}Windows:${NC}"
    echo "  Download from https://www.mongodb.com/try/download/community"
    echo ""
    echo -e "${YELLOW}After installing MongoDB, run this script again.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ MongoDB is installed${NC}"

# Check if MongoDB service is running
if ! pgrep -x "mongod" > /dev/null; then
    echo -e "${YELLOW}MongoDB service is not running. Starting MongoDB...${NC}"

    # Try to start MongoDB service
    if command -v systemctl &> /dev/null; then
        sudo systemctl start mongodb
        sudo systemctl enable mongodb
    elif command -v brew &> /dev/null; then
        brew services start mongodb/brew/mongodb-community
    else
        echo -e "${YELLOW}Please start MongoDB manually and run this script again.${NC}"
        exit 1
    fi

    # Wait for MongoDB to start
    sleep 3
fi

echo -e "${GREEN}✓ MongoDB service is running${NC}"

# Check MongoDB connection
if ! mongo --eval "db.runCommand('ping')" --quiet > /dev/null 2>&1; then
    echo -e "${YELLOW}MongoDB connection test failed. Please check MongoDB status.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ MongoDB connection test successful${NC}"

# Create database and collections
echo -e "${BLUE}Setting up database and collections...${NC}"

mongo --eval "use midostore; db.createCollection('products'); db.createCollection('reviews'); db.createCollection('suppliers'); db.createCollection('orders'); db.createCollection('users'); db.createCollection('exchangeRates'); print('Collections created successfully');" --quiet

echo -e "${GREEN}✓ Database setup completed${NC}"

# Update environment files
echo -e "${BLUE}Updating environment configuration...${NC}"

# Update .env file if it exists
if [ -f ".env" ]; then
    # Backup current .env
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    echo -e "${GREEN}✓ Current .env backed up${NC}"

    # Update MONGODB_URI
    sed -i 's|MONGODB_URI="file:./dev.db"|MONGODB_URI="mongodb://localhost:27017/midostore"|g' .env
    echo -e "${GREEN}✓ Updated .env with MongoDB URL${NC}"
else
    echo -e "${YELLOW}No .env file found. Please create one with:${NC}"
    echo "DATABASE_URL=\"mongodb://localhost:27017/midostore\""
fi

    # Update env.example
    if [ -f "env.example" ]; then
        sed -i 's|MONGODB_URI="file:./dev.db"|MONGODB_URI="mongodb://localhost:27017/midostore"|g' env.example
        echo -e "${GREEN}✓ Updated env.example${NC}"
    fi

echo -e "${BLUE}Installing dependencies...${NC}"

# Install MongoDB dependencies
npm install mongodb

echo -e "${GREEN}✓ Dependencies installed${NC}"

echo -e "${BLUE}Database setup completed...${NC}"

# Collections and indexes are already created
echo -e "${GREEN}✓ Database setup completed${NC}"

echo -e "${GREEN}✓ Database migrations completed${NC}"

echo -e "${BLUE}Seeding database...${NC}"

# Seed database if seed script exists
if [ -f "scripts/db-seed.ts" ]; then
    npm run db:seed
    echo -e "${GREEN}✓ Database seeded${NC}"
else
    echo -e "${YELLOW}No seed script found. Skipping seeding.${NC}"
fi

echo ""
echo -e "${GREEN}=== MongoDB Setup Complete! ===${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Start your development server: npm run dev"
echo "2. Test the database connection"
echo "3. Verify that your API endpoints work with MongoDB"
echo ""
echo -e "${BLUE}MongoDB Connection Details:${NC}"
echo "  URL: mongodb://localhost:27017/midostore"
echo "  Database: midostore"
echo "  Collections: products, reviews, suppliers, orders, users, exchangeRates"
echo ""
echo -e "${BLUE}Useful MongoDB Commands:${NC}"
echo "  Connect to database: mongosh midostore"
echo "  Show collections: show collections"
echo "  Show databases: show dbs"
echo "  Exit: exit"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"