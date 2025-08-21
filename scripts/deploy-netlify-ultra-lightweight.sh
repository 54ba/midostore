#!/bin/bash

echo "🚀 Starting ultra-lightweight Netlify deployment..."

# Clean up any previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf .netlify

# Build the Next.js application using simple build
echo "🔨 Building Next.js application (simple build)..."
npm run build:simple

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

# Create a temporary functions directory with only essential files
echo "📦 Preparing ultra-lightweight functions..."
TEMP_FUNCTIONS_DIR=".temp-functions"
rm -rf "$TEMP_FUNCTIONS_DIR"
mkdir -p "$TEMP_FUNCTIONS_DIR"

# Copy only the function files (no node_modules)
cp netlify/functions-lightweight/*.js "$TEMP_FUNCTIONS_DIR/"

# Verify the temporary functions
echo "📁 Temporary functions prepared:"
ls -la "$TEMP_FUNCTIONS_DIR/"

# Deploy to Netlify using the temporary functions
echo "🚀 Deploying to Netlify (ultra-lightweight)..."
npx netlify deploy --prod --dir=.next --functions="$TEMP_FUNCTIONS_DIR" --no-build

# Clean up temporary directory
rm -rf "$TEMP_FUNCTIONS_DIR"

echo "✅ Deployment completed!"
echo "🌐 Your site should be live in a few minutes"
echo ""
echo "💡 This deployment uses ultra-lightweight functions with no heavy dependencies."
echo "   Functions are copied without bundling to prevent size issues."