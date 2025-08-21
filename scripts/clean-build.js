#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🧹 Cleaning build artifacts...');

// Clean build artifacts
const cleanTargets = [
    '.next',
    'out',
    '.vercel',
    '.netlify/cache'
];

cleanTargets.forEach(target => {
    if (fs.existsSync(target)) {
        try {
            fs.rmSync(target, { recursive: true, force: true });
            console.log(`✅ Removed ${target}`);
        } catch (error) {
            console.warn(`⚠️  Could not remove ${target}: ${error.message}`);
        }
    }
});

console.log('🔨 Starting Next.js build...');

try {
    // Set environment variables
    const env = {
        ...process.env,
        NEXT_TELEMETRY_DISABLED: '1',
        NODE_ENV: 'production'
    };

    // Run the build
    execSync('next build', {
        stdio: 'inherit',
        env: env
    });

    console.log('✅ Build completed successfully!');

} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}