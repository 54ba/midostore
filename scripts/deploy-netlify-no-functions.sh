#!/bin/bash

echo "🚀 Starting Netlify deployment (no functions)..."

# Clean up any previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf .netlify

# Build the Next.js application
echo "🔨 Building Next.js application..."
npm run build:simple

# Verify the build output
if [ ! -d ".next" ]; then
    echo "❌ Build failed - .next directory not found"
    exit 1
fi

echo "✅ Build completed successfully"

# Deploy to Netlify (static site only, no functions)
echo "🚀 Deploying to Netlify (static site only)..."
npx netlify deploy --prod --dir=.next --no-build

echo "✅ Deployment completed!"
echo "🌐 Your site should be live in a few minutes"
echo ""
echo "💡 This deployment has no functions - it's a pure static site deployment."
echo "   No function bundling issues, no size limits, no dependencies to worry about."