#!/bin/bash

echo "🚀 Setting up local SQLite database for MidoStore..."

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Initialize SQLite database manually
echo "🗄️  Initializing SQLite database..."
npm run db:init

if [ $? -eq 0 ]; then
    echo "✅ Database initialization completed successfully!"
    echo "📊 You can view your database with: npm run db:studio"
    echo "🗄️  Database file: prisma/dev.db"
    echo "🌱 To re-seed with scraper data: npm run db:seed:scraper"
    echo "🔄 To reinitialize database: npm run db:init"
else
    echo "❌ Database initialization failed!"
    echo "💡 Trying alternative method with Prisma..."

    # Fallback to Prisma if available
    if command -v npx prisma &> /dev/null; then
        echo "📦 Generating Prisma client..."
        PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate

        echo "🗄️  Creating database with Prisma..."
        PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma db push

        echo "🌱 Seeding database with scraper data..."
        npm run db:seed:scraper
    else
        echo "❌ Neither method worked. Please check your setup."
        exit 1
    fi
fi