#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔨 Starting simple Next.js build...');

try {
    // Set basic environment variables
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