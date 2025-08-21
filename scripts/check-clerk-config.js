#!/usr/bin/env node

/**
 * Script to check Clerk configuration
 * Run this to verify your Clerk environment variables are set correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Clerk Configuration...\n');

// Check for .env.local file
const envLocalPath = path.join(process.cwd(), '.env.local');
const envLocalExists = fs.existsSync(envLocalPath);

console.log(`📁 .env.local file: ${envLocalExists ? '✅ Found' : '❌ Not found'}`);

if (envLocalExists) {
    const envContent = fs.readFileSync(envLocalPath, 'utf8');

    // Check for required Clerk variables
    const requiredVars = [
        'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
        'CLERK_SECRET_KEY'
    ];

    console.log('\n🔑 Checking required environment variables:');

    requiredVars.forEach(varName => {
        const hasVar = envContent.includes(varName);
        const isPlaceholder = envContent.includes(varName + '=your_') ||
            envContent.includes(varName + '=pk_test_your_') ||
            envContent.includes(varName + '=sk_test_your_');

        if (hasVar && !isPlaceholder) {
            console.log(`  ${varName}: ✅ Set`);
        } else if (hasVar && isPlaceholder) {
            console.log(`  ${varName}: ⚠️  Set but contains placeholder value`);
        } else {
            console.log(`  ${varName}: ❌ Not set`);
        }
    });

    // Check for optional Clerk variables
    const optionalVars = [
        'NEXT_PUBLIC_CLERK_SIGN_IN_URL',
        'NEXT_PUBLIC_CLERK_SIGN_UP_URL',
        'NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL',
        'NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL'
    ];

    console.log('\n🔧 Checking optional environment variables:');

    optionalVars.forEach(varName => {
        const hasVar = envContent.includes(varName);
        if (hasVar) {
            console.log(`  ${varName}: ✅ Set`);
        } else {
            console.log(`  ${varName}: ℹ️  Not set (will use defaults)`);
        }
    });

} else {
    console.log('\n📝 To create .env.local file, run:');
    console.log('   cp env.example .env.local');
    console.log('   # Then edit .env.local with your actual Clerk keys');
}

// Check for Netlify environment variables
console.log('\n🌐 Netlify Environment Variables:');
console.log('   Note: These need to be set in your Netlify dashboard');
console.log('   Go to: Site settings > Environment variables');

// Check package.json for Clerk dependency
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const hasClerk = packageJson.dependencies && packageJson.dependencies['@clerk/nextjs'];

    console.log('\n📦 Clerk dependency:');
    console.log(`   @clerk/nextjs: ${hasClerk ? '✅ Installed' : '❌ Not installed'}`);

    if (!hasClerk) {
        console.log('   To install: npm install @clerk/nextjs');
    }
}

console.log('\n📚 For more information, see: CLERK_SETUP_GUIDE.md');
console.log('\n🚀 Next steps:');
console.log('   1. Create a Clerk account at https://clerk.com/');
console.log('   2. Create a new application');
console.log('   3. Copy your API keys to .env.local');
console.log('   4. Restart your development server');
console.log('   5. Test the authentication flow');