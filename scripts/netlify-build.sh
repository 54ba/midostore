#!/bin/bash

# Netlify Build Script - Optimized for Size Limits
# This script ensures the build stays under the 250MB function size limit

set -e

echo "🚀 Starting optimized Netlify build..."

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

# Install dependencies (production only for functions)
echo "📦 Installing dependencies..."
npm ci --production=false

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Build Next.js application
echo "🔨 Building Next.js application..."
npm run build

# Check function sizes
echo "📏 Checking function sizes..."
FUNCTIONS_DIR="netlify/functions"
MAX_SIZE=250000000  # 250MB in bytes

for func in "$FUNCTIONS_DIR"/*.js; do
    if [ -f "$func" ]; then
        func_name=$(basename "$func")
        func_size=$(stat -c%s "$func" 2>/dev/null || stat -f%z "$func" 2>/dev/null || echo "0")

        echo "  📁 $func_name: $((func_size / 1024))KB"

        if [ "$func_size" -gt "$MAX_SIZE" ]; then
            echo "  ⚠️  WARNING: $func_name exceeds size limit!"
            echo "  💡 Consider splitting or optimizing this function"
        fi
    fi
done

# Check for heavy dependencies in node_modules
echo "🔍 Checking for heavy dependencies..."
HEAVY_DEPS=("puppeteer" "puppeteer-extra" "python-shell" "xlsx" "json2csv")

for dep in "${HEAVY_DEPS[@]}"; do
    if [ -d "node_modules/$dep" ]; then
        dep_size=$(du -sb "node_modules/$dep" | cut -f1)
        dep_size_mb=$((dep_size / 1024 / 1024))
        echo "  ⚠️  Heavy dependency found: $dep (${dep_size_mb}MB)"
        echo "  💡 This dependency should be excluded from Netlify functions"
    fi
done

# Create optimized function bundle
echo "📦 Creating optimized function bundle..."
cd netlify/functions

# Remove any heavy dependencies that might have been copied
echo "  🗑️  Removing heavy dependencies from function bundle..."
rm -rf node_modules 2>/dev/null || true

# Check final function sizes
echo "📏 Final function size check..."
for func in *.js; do
    if [ -f "$func" ]; then
        func_size=$(stat -c%s "$func" 2>/dev/null || stat -f%z "$func" 2>/dev/null || echo "0")
        func_size_kb=$((func_size / 1024))
        echo "  ✅ $func: ${func_size_kb}KB"

        if [ "$func_size" -gt "$MAX_SIZE" ]; then
            echo "  ❌ ERROR: $func still exceeds 250MB limit!"
            echo "  🚨 Build will fail. Please optimize this function."
            exit 1
        fi
    fi
done

cd ../..

echo "✅ Build completed successfully!"
echo "📊 Function sizes are within limits"
echo "🚀 Ready for Netlify deployment"

# Optional: Show deployment commands
echo ""
echo "💡 To deploy:"
echo "  netlify deploy --prod"
echo "  # or"
echo "  netlify deploy --dir=.next --functions=netlify/functions"