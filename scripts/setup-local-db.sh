#!/bin/bash

echo "🚀 Setting up local SQLite database for MidoStore..."

# Check if Prisma is installed
if ! command -v npx prisma &> /dev/null; then
    echo "❌ Prisma CLI not found. Installing Prisma..."
    npm install prisma @prisma/client
fi

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Push the schema to create the database
echo "🗄️  Creating local SQLite database..."
npx prisma db push

# Seed the database with initial data
echo "🌱 Seeding database with initial data..."
npm run db:seed

echo "✅ Local database setup complete!"
echo "📊 You can view your database with: npm run db:studio"
echo "🗄️  Database file: prisma/dev.db"