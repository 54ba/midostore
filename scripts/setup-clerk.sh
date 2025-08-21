#!/usr/bin/env bash

echo "🔐 Clerk Authentication Setup for MidoHub"
echo "========================================="
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ .env.local file found"
else
    echo "📝 Creating .env.local file..."
    cp env.clerk.example .env.local
    echo "✅ .env.local file created from template"
fi

echo ""
echo "📋 Next Steps to Complete Clerk Setup:"
echo ""

echo "1. 🌐 Get Your Clerk API Keys:"
echo "   - Go to https://clerk.com"
echo "   - Sign up or log in to your account"
echo "   - Create a new application (or use existing)"
echo "   - Go to 'API Keys' in your dashboard"
echo "   - Copy your Publishable Key (starts with pk_test_)"
echo "   - Copy your Secret Key (starts with sk_test_)"
echo ""

echo "2. 🔧 Update Environment Variables:"
echo "   - Edit .env.local file"
echo "   - Replace 'your_clerk_publishable_key_here' with your actual key"
echo "   - Replace 'your_clerk_secret_key_here' with your actual key"
echo ""

echo "3. ⚙️  Configure Clerk Application:"
echo "   - In Clerk dashboard, go to 'User & Authentication'"
echo "   - Enable 'Email address' and 'Password'"
echo "   - Go to 'Domains' and add 'localhost:3000' for development"
echo ""

echo "4. 🚀 Test the Setup:"
echo "   - Restart your development server: npm run dev"
echo "   - Run the test script: node scripts/test-clerk-auth.js"
echo "   - Visit /sign-up to test authentication"
echo ""

echo "5. 📚 For detailed instructions, see: CLERK_SETUP_COMPLETE.md"
echo ""

# Check if .env.local has placeholder values
if [ -f ".env.local" ]; then
    if grep -q "your_clerk_publishable_key_here" .env.local; then
        echo "⚠️  .env.local still contains placeholder values"
        echo "   Please update with your actual Clerk API keys"
    else
        echo "✅ .env.local appears to be configured"
        echo "   Run 'node scripts/test-clerk-auth.js' to verify"
    fi
fi

echo ""
echo "🎯 Quick Commands:"
echo "   Edit .env.local: nano .env.local"
echo "   Test setup: node scripts/test-clerk-auth.js"
echo "   Start dev server: npm run dev"
echo ""

echo "🔐 Your Clerk authentication will be ready once you add your API keys! 🚀"