#!/bin/bash

# Netlify Deployment Script - Fixed for Size Limits
# This script ensures functions are properly sized before deployment

set -e

echo "🚀 Starting Netlify deployment with size limit fixes..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf netlify/functions/.next
rm -rf node_modules/.cache

# Check function sizes before deployment
echo "📏 Checking function sizes..."
if [ -d "netlify/functions" ]; then
    total_size=0
    for func in netlify/functions/*.js; do
        if [ -f "$func" ]; then
            size=$(stat -c%s "$func" 2>/dev/null || stat -f%z "$func" 2>/dev/null || echo "0")
            size_kb=$((size / 1024))
            total_size=$((total_size + size))
            echo "  ✅ $(basename "$func"): ${size_kb}KB"
        fi
    done

    total_size_kb=$((total_size / 1024))
    echo "  📊 Total functions size: ${total_size_kb}KB"

    if [ $total_size_kb -gt 250000 ]; then
        echo "❌ Functions are too large (${total_size_kb}KB > 250MB limit)"
        echo "💡 Consider using the standalone version or splitting functions"
        exit 1
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Build the project
echo "🏗️  Building project..."
npm run build

# Verify build output
if [ ! -d ".next" ]; then
    echo "❌ Build failed: .next directory not found"
    exit 1
fi

echo "✅ Build completed successfully!"

# Check final project size
echo "📏 Checking final project size..."
PROJECT_SIZE=$(du -sh . --exclude=node_modules --exclude=.git 2>/dev/null | cut -f1)
echo "  📁 Project size (excluding node_modules): $PROJECT_SIZE"

# Deploy to Netlify
echo "🚀 Deploying to Netlify..."
if command -v netlify &> /dev/null; then
    netlify deploy --prod
else
    echo "⚠️  Netlify CLI not found. Please install it first:"
    echo "   npm install -g netlify-cli"
    echo ""
    echo "📋 Manual deployment steps:"
    echo "   1. Push your changes to git"
    echo "   2. Deploy via Netlify dashboard or CLI"
    echo "   3. Monitor the deployment logs"
fi

echo "✅ Deployment script completed!"
echo ""
echo "💡 Next steps:"
echo "   1. Check Netlify deployment logs"
echo "   2. Test the scrape-products function"
echo "   3. Monitor function performance"
echo "   4. Gradually add back features if needed"