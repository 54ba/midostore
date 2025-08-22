#!/bin/bash

echo "🚀 Starting MidoStore Scraping and Seeding Process"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if tsx is installed
if ! command -v tsx &> /dev/null; then
    echo "📦 Installing tsx..."
    npm install -g tsx
fi

# Check if database is ready
echo "🔍 Checking database connection..."
if ! node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => {
    console.log('✅ Database connected successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  });
" 2>/dev/null; then
    echo "❌ Database connection failed. Please check your database configuration."
    exit 1
fi

echo ""
echo "🌱 Step 1: Seeding database with sample data..."
npx tsx scripts/seed-database.ts

if [ $? -eq 0 ]; then
    echo "✅ Database seeding completed successfully!"
else
    echo "❌ Database seeding failed!"
    exit 1
fi

echo ""
echo "🔍 Step 2: Testing scraping service..."
npx tsx scripts/test-scraping-simple.ts

if [ $? -eq 0 ]; then
    echo "✅ Scraping test completed successfully!"
else
    echo "❌ Scraping test failed!"
    exit 1
fi

echo ""
echo "🎯 Step 3: Running full scraping process..."
echo "This will scrape real products from Alibaba/AliExpress"
echo "Press Enter to continue or Ctrl+C to cancel..."
read

npx tsx scripts/scrape-products.ts alibaba electronics 1

echo ""
echo "🎉 All processes completed successfully!"
echo "Your MidoStore database is now populated with products!"