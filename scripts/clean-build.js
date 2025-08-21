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
        NODE_ENV: 'production',
        // Add these to help with build stability
        NEXT_SHARP_PATH: 'false',
        NEXT_DISABLE_OPTIMIZATION: '1'
    };

    // Run the build with retry logic
    let buildSuccess = false;
    let attempts = 0;
    const maxAttempts = 3;

    while (!buildSuccess && attempts < maxAttempts) {
        attempts++;
        console.log(`🔄 Build attempt ${attempts}/${maxAttempts}...`);

        try {
            execSync('next build', {
                stdio: 'inherit',
                env: env
            });
            buildSuccess = true;
            console.log('✅ Build completed successfully!');
        } catch (error) {
            console.warn(`⚠️  Build attempt ${attempts} failed: ${error.message}`);

            if (attempts < maxAttempts) {
                console.log('🔄 Retrying build...');
                // Wait a bit before retrying
                setTimeout(() => { }, 2000);
            } else {
                console.error('❌ All build attempts failed');
                throw error;
            }
        }
    }

} catch (error) {
    console.error('❌ Build failed after all attempts:', error.message);

    // Try to provide helpful debugging info
    if (fs.existsSync('.next')) {
        console.log('🔍 Checking build output...');
        try {
            const buildFiles = fs.readdirSync('.next');
            console.log('📁 Build directory contents:', buildFiles);
        } catch (e) {
            console.log('⚠️  Could not read build directory');
        }
    }

    process.exit(1);
}