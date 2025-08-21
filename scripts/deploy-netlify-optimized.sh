#!/bin/bash

echo "🚀 Starting optimized Netlify deployment..."

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

# Deploy to Netlify with simplified approach
echo "🚀 Deploying to Netlify..."
npx netlify deploy --prod --dir=.next --functions=netlify/functions-lightweight

echo "✅ Deployment completed!"
echo "🌐 Your site should be live in a few minutes"