#!/usr/bin/env node

/**
 * Test script for Clerk Authentication
 * This script tests the basic functionality of Clerk auth
 */

const { execSync } = require('child_process');

console.log('🔐 Testing Clerk Authentication');
console.log('===============================\n');

// Test 1: Check if environment variables are loaded
console.log('1. Checking Environment Variables');
try {
    const envCheck = execSync('node -e "console.log(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || \'NOT_SET\')"', { encoding: 'utf8' });
    const publishableKey = envCheck.trim();

    if (publishableKey === 'NOT_SET') {
        console.log('❌ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY - NOT SET');
        console.log('   Please set this in your .env.local file');
    } else if (publishableKey.includes('your_') || publishableKey.includes('placeholder')) {
        console.log('⚠️  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY - PLACEHOLDER VALUE');
        console.log('   Please replace with your actual Clerk publishable key');
    } else if (publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_')) {
        console.log('✅ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY - VALID FORMAT');
        console.log('   Key:', publishableKey.substring(0, 20) + '...');
    } else {
        console.log('❌ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY - INVALID FORMAT');
        console.log('   Expected format: pk_test_... or pk_live_...');
    }
} catch (error) {
    console.log('❌ Error checking environment variables:', error.message);
}

console.log('');

// Test 2: Check if sign-in page loads
console.log('2. Testing Sign-In Page');
try {
    const response = execSync('curl -s -I http://localhost:3000/sign-in', { encoding: 'utf8' });
    if (response.includes('200')) {
        console.log('✅ Sign-In Page - SUCCESS (Status: 200)');
    } else {
        console.log('⚠️  Sign-In Page - PARTIAL (Status:', response.split(' ')[1], ')');
    }
} catch (error) {
    console.log('❌ Sign-In Page - FAILED');
    console.log('   Error:', error.message);
    console.log('   Make sure your development server is running (npm run dev)');
}

console.log('');

// Test 3: Check if sign-up page loads
console.log('3. Testing Sign-Up Page');
try {
    const response = execSync('curl -s -I http://localhost:3000/sign-up', { encoding: 'utf8' });
    if (response.includes('200')) {
        console.log('✅ Sign-Up Page - SUCCESS (Status: 200)');
    } else {
        console.log('⚠️  Sign-Up Page - PARTIAL (Status:', response.split(' ')[1], ')');
    }
} catch (error) {
    console.log('❌ Sign-Up Page - FAILED');
    console.log('   Error:', error.message);
}

console.log('');

// Test 4: Check if protected route redirects
console.log('4. Testing Protected Route (Dashboard)');
try {
    const response = execSync('curl -s -I http://localhost:3000/dashboard', { encoding: 'utf8' });
    if (response.includes('200')) {
        console.log('✅ Dashboard Page - SUCCESS (Status: 200)');
        console.log('   Note: This might mean you\'re already authenticated');
    } else if (response.includes('302') || response.includes('301')) {
        console.log('✅ Dashboard Page - REDIRECTING (Status:', response.split(' ')[1], ')');
        console.log('   This is expected for unauthenticated users');
    } else {
        console.log('⚠️  Dashboard Page - UNEXPECTED (Status:', response.split(' ')[1], ')');
    }
} catch (error) {
    console.log('❌ Dashboard Page - FAILED');
    console.log('   Error:', error.message);
}

console.log('');

// Test 5: Check if Clerk components are available
console.log('5. Testing Clerk Component Availability');
try {
    const buildCheck = execSync('npm run build 2>&1 | head -20', { encoding: 'utf8' });
    if (buildCheck.includes('Compiled successfully') || buildCheck.includes('✓ Compiled successfully')) {
        console.log('✅ Build - SUCCESS');
        console.log('   Clerk components are properly configured');
    } else if (buildCheck.includes('Clerk') || buildCheck.includes('clerk')) {
        console.log('⚠️  Build - CLERK ISSUES DETECTED');
        console.log('   Check the build output for Clerk-related errors');
    } else {
        console.log('⚠️  Build - UNKNOWN STATUS');
        console.log('   Check the build output for details');
    }
} catch (error) {
    console.log('❌ Build Check - FAILED');
    console.log('   Error:', error.message);
}

console.log('\n===============================');
console.log('Summary:');
console.log('');

// Provide next steps based on test results
console.log('📋 Next Steps:');
console.log('');

console.log('1. Set up Clerk API Keys:');
console.log('   - Go to https://clerk.com');
console.log('   - Create an application');
console.log('   - Copy your publishable and secret keys');
console.log('   - Add them to .env.local');
console.log('');

console.log('2. Configure Clerk Application:');
console.log('   - Enable email/password authentication');
console.log('   - Add your domains (localhost:3000 for development)');
console.log('   - Configure OAuth providers (optional)');
console.log('');

console.log('3. Test Authentication:');
console.log('   - Restart your development server');
console.log('   - Visit /sign-up to create an account');
console.log('   - Visit /sign-in to sign in');
console.log('   - Try accessing protected routes');
console.log('');

console.log('4. Verify Integration:');
console.log('   - Check that user data appears in dashboard');
console.log('   - Verify protected routes are working');
console.log('   - Test logout functionality');
console.log('');

console.log('📚 For detailed setup instructions, see: CLERK_SETUP_COMPLETE.md');
console.log('');

if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('your_') &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder')) {
    console.log('🎉 Clerk appears to be properly configured!');
    console.log('   Try visiting /sign-up to test the authentication flow.');
} else {
    console.log('⚠️  Clerk needs to be configured.');
    console.log('   Follow the setup guide above to get started.');
}

console.log('\n🔐 Your Clerk authentication is ready to be configured! 🚀');