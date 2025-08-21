#!/run/current-system/sw/bin/bash

# Ultra-Minimal Netlify Deployment Script
# This script creates a completely isolated deployment to avoid size issues

set -e

echo "🚀 Starting ultra-minimal Netlify deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Create a clean deployment directory
echo "🧹 Creating clean deployment directory..."
DEPLOY_DIR="netlify-deploy-clean"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# Copy only essential files
echo "📁 Copying essential files..."
cp -r src/ "$DEPLOY_DIR/"
cp -r public/ "$DEPLOY_DIR/"
cp -r prisma/ "$DEPLOY_DIR/"
cp -r scripts/ "$DEPLOY_DIR/"
cp package.json "$DEPLOY_DIR/"
cp next.config.ts "$DEPLOY_DIR/"
cp tailwind.config.js "$DEPLOY_DIR/"
cp tsconfig.json "$DEPLOY_DIR/"
cp netlify.toml "$DEPLOY_DIR/"
cp .netlifyignore "$DEPLOY_DIR/"

# Create minimal functions directory
echo "🔧 Creating minimal functions..."
mkdir -p "$DEPLOY_DIR/netlify/functions"

# Copy only the minimal functions
cp netlify/functions/*.js "$DEPLOY_DIR/netlify/functions/"

# Remove README from functions (not needed for deployment)
rm -f "$DEPLOY_DIR/netlify/functions/README.md"

# Check function sizes in deployment directory
echo "📏 Checking function sizes in deployment directory..."
if [ -d "$DEPLOY_DIR/netlify/functions" ]; then
    total_size=0
    for func in "$DEPLOY_DIR/netlify/functions"/*.js; do
        if [ -f "$func" ]; then
            size=$(stat -c%s "$func" 2>/dev/null || stat -f%z "$func" 2>/dev/null || echo "0")
            size_kb=$((size / 1024))
            total_size=$((total_size + size))
            echo "  ✅ $(basename "$func"): ${size_kb}KB"
        fi
    done

    total_size_kb=$((total_size / 1024))
    echo "  📊 Total functions size: ${total_size_kb}KB"

    if [ $total_size_kb -gt 1000 ]; then
        echo "❌ Functions are still too large (${total_size_kb}KB > 1MB limit)"
        exit 1
    fi
fi

# Check total deployment size
echo "📏 Checking total deployment size..."
DEPLOY_SIZE=$(du -sh "$DEPLOY_DIR" --exclude=node_modules 2>/dev/null | cut -f1)
echo "  📁 Deployment size: $DEPLOY_SIZE"

# Create a minimal package.json for deployment
echo "📦 Creating minimal package.json..."
cat > "$DEPLOY_DIR/package-deploy.json" << 'EOF'
{
  "name": "midostore-deploy",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^15.5.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  }
}
EOF

echo "✅ Clean deployment directory created!"
echo ""
echo "💡 Next steps:"
echo "   1. cd $DEPLOY_DIR"
echo "   2. npm install"
echo "   3. npm run build"
echo "   4. netlify deploy --prod"
echo ""
echo "🚀 This approach completely isolates your functions from heavy dependencies!"
echo ""
echo "⚠️  Note: If netlify CLI is not installed, you can:"
echo "   1. Install it: npm install -g netlify-cli"
echo "   2. Or deploy via Netlify dashboard by pushing to git"