#!/bin/bash

echo "🚀 Starting simple Netlify deployment (no Next.js plugin)..."

# Clean up any previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf .netlify

# Build the Next.js application
echo "🔨 Building Next.js application..."
npm run build

# Verify the build output
if [ ! -d ".next" ]; then
    echo "❌ Build failed - .next directory not found"
    exit 1
fi

echo "✅ Build completed successfully"

# Verify functions directory
if [ ! -d "netlify/functions-lightweight" ]; then
    echo "❌ Functions directory not found"
    exit 1
fi

echo "✅ Functions directory verified"

# Check function sizes
echo "📊 Checking function sizes..."
npm run netlify:check

# Deploy to Netlify using basic deployment (no plugin)
echo "🚀 Deploying to Netlify (basic deployment)..."
netlify deploy --prod --dir=.next --functions=netlify/functions-lightweight --no-functions-cache --no-build

echo "✅ Deployment completed!"
echo "🌐 Your site should be live in a few minutes"
echo ""
echo "💡 Note: This deployment bypasses the Next.js plugin to avoid Blobs issues."
echo "   If you need advanced Next.js features, consider setting up Blobs environment variables."