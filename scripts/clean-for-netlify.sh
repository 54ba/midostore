#!/usr/bin/env bash

# Clean for Netlify Deployment Script
# This script removes heavy files that could cause the 250MB limit issue

set -e

echo "🧹 Cleaning project for Netlify deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Remove heavy binary files that shouldn't be deployed
echo "🗑️  Removing heavy binary files..."

# Remove large node_modules files that cause size issues
if [ -d "node_modules" ]; then
    echo "  📦 Cleaning heavy node_modules files..."

    # Remove heavy binary files
    find node_modules -name "*.so*" -type f -delete 2>/dev/null || true
    find node_modules -name "*.node" -type f -delete 2>/dev/null || true
    find node_modules -name "*.dll" -type f -delete 2>/dev/null || true
    find node_modules -name "*.exe" -type f -delete 2>/dev/null || true
    find node_modules -name "*.bin" -type f -delete 2>/dev/null || true

    # Remove specific heavy packages
    rm -rf node_modules/puppeteer 2>/dev/null || true
    rm -rf node_modules/puppeteer-extra 2>/dev/null || true
    rm -rf node_modules/python-shell 2>/dev/null || true
    rm -rf node_modules/electron 2>/dev/null || true
    rm -rf node_modules/electron-builder 2>/dev/null || true
    rm -rf node_modules/dmg-builder 2>/dev/null || true

    echo "  ✅ Heavy node_modules files removed"
fi

# Remove environment files
echo "  🔐 Removing environment files..."
rm -f .env .env.local .env.production .env.development .env.test 2>/dev/null || true

# Remove build artifacts
echo "  🏗️  Removing build artifacts..."
rm -rf .next 2>/dev/null || true
rm -rf out 2>/dev/null || true
rm -rf build 2>/dev/null || true
rm -rf dist 2>/dev/null || true

# Remove AI and Python files
echo "  🤖 Removing AI and Python files..."
rm -rf ai 2>/dev/null || true
find . -name "*.py" -delete 2>/dev/null || true
find . -name "*.pyc" -delete 2>/dev/null || true
find . -name "*.pkl" -delete 2>/dev/null || true
find . -name "*.h5" -delete 2>/dev/null || true
find . -name "*.model" -delete 2>/dev/null || true

# Remove large data files
echo "  📊 Removing large data files..."
find . -name "*.csv" -size +1M -delete 2>/dev/null || true
find . -name "*.xlsx" -size +1M -delete 2>/dev/null || true
find . -name "*.json" -size +1M -delete 2>/dev/null || true

# Check final project size
echo "📏 Checking project size..."
PROJECT_SIZE=$(du -sh . --exclude=node_modules --exclude=.git 2>/dev/null | cut -f1)
echo "  📁 Project size (excluding node_modules): $PROJECT_SIZE"

# Check function sizes
echo "📏 Checking function sizes..."
if [ -d "netlify/functions" ]; then
    for func in netlify/functions/*.js; do
        if [ -f "$func" ]; then
            func_size=$(stat -c%s "$func" 2>/dev/null || stat -f%z "$func" 2>/dev/null || echo "0")
            func_size_kb=$((func_size / 1024))
            echo "  ✅ $(basename "$func"): ${func_size_kb}KB"
        fi
    done
fi

echo "✅ Cleaning completed!"
echo "🚀 Project is now ready for Netlify deployment"
echo ""
echo "💡 Next steps:"
echo "  1. npm run build"
echo "  2. netlify deploy --prod"