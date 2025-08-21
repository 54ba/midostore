#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Comprehensive cleaning of build artifacts...');

// Function to safely remove directory/file
function safeRemove(targetPath, description) {
    if (fs.existsSync(targetPath)) {
        try {
            const stats = fs.statSync(targetPath);
            if (stats.isDirectory()) {
                fs.rmSync(targetPath, { recursive: true, force: true });
            } else {
                fs.unlinkSync(targetPath);
            }
            console.log(`✅ Removed ${description}`);
            return true;
        } catch (error) {
            console.warn(`⚠️  Could not remove ${description}: ${error.message}`);
            return false;
        }
    }
    return false;
}

// Clean all build artifacts
const cleanTargets = [
    { path: '.next', description: '.next directory' },
    { path: 'node_modules/.cache', description: 'node_modules/.cache' },
    { path: '.next/cache', description: '.next/cache' },
    { path: '.next/server/pages', description: 'Pages Router directory' },
    { path: '.next/server/chunks', description: 'server chunks' },
    { path: 'out', description: 'static export directory' },
    { path: '.vercel', description: '.vercel directory' },
    { path: '.netlify/cache', description: 'Netlify cache' },
];

cleanTargets.forEach(({ path: targetPath, description }) => {
    safeRemove(targetPath, description);
});

// Clean TypeScript cache
safeRemove('tsconfig.tsbuildinfo', 'TypeScript build info');

console.log('🔨 Starting fresh Next.js build with App Router only...');

try {
    // Set comprehensive environment variables to force App Router only
    const env = {
        ...process.env,
        // Disable telemetry
        NEXT_TELEMETRY_DISABLED: '1',
        // Force production mode
        NODE_ENV: 'production',
        // Force App Router only (custom env vars)
        NEXT_APP_DIR: '1',
        NEXT_PAGES_DIR: '0',
        // Disable Pages Router features
        NEXT_DISABLE_PAGES_ROUTER: '1',
        // Force App Router mode
        NEXT_FORCE_APP_ROUTER: '1',
        // Disable static optimization that might cause issues
        NEXT_DISABLE_STATIC_OPTIMIZATION: '1',
    };

    console.log('🔧 Environment variables set for App Router only build');

    // Run the build with forced environment
    execSync('next build', {
        stdio: 'inherit',
        env: env
    });

    console.log('✅ Build completed successfully');

    // Post-build cleanup - remove any Pages Router files that might have been generated
    const postBuildCleanup = () => {
        console.log('🧽 Post-build cleanup...');

        const pagesDir = path.join('.next', 'server', 'pages');
        if (fs.existsSync(pagesDir)) {
            console.log('⚠️  Pages Router files detected after build, removing...');

            // More comprehensive list of Pages Router files to remove
            const filesToRemove = [
                '_document.js', '_document.js.nft.json',
                '_app.js', '_app.js.nft.json',
                '_error.js', '_error.js.nft.json',
                '404.js', '404.js.nft.json',
                '_404.js', '_404.js.nft.json',
                '500.js', '500.js.nft.json',
                'index.js', 'index.js.nft.json'
            ];

            let removedCount = 0;

            filesToRemove.forEach(file => {
                const filePath = path.join(pagesDir, file);
                if (safeRemove(filePath, `Pages Router file: ${file}`)) {
                    removedCount++;
                }
            });

            // Remove any remaining .nft.json files
            try {
                const allFiles = fs.readdirSync(pagesDir);
                const nftFiles = allFiles.filter(file => file.endsWith('.nft.json'));

                nftFiles.forEach(file => {
                    const filePath = path.join(pagesDir, file);
                    if (safeRemove(filePath, `NFT file: ${file}`)) {
                        removedCount++;
                    }
                });
            } catch (error) {
                console.warn('⚠️  Could not read pages directory for NFT cleanup');
            }

            if (removedCount > 0) {
                console.log(`🎉 Successfully removed ${removedCount} Pages Router files`);
            }

            // Try to remove the entire pages directory if it's empty
            try {
                const remainingFiles = fs.readdirSync(pagesDir);
                if (remainingFiles.length === 0) {
                    fs.rmdirSync(pagesDir);
                    console.log('✅ Removed empty Pages Router directory');
                }
            } catch (error) {
                console.log('ℹ️  Pages Router directory not empty or could not be removed');
            }
        } else {
            console.log('✅ No Pages Router directory found - pure App Router build');
        }
    };

    postBuildCleanup();

    console.log('🚀 Build process completed successfully!');
    console.log('📦 Build artifacts ready for deployment');

} catch (error) {
    console.error('❌ Build failed:', error.message);

    // Additional debugging information
    console.error('🔍 Build failure debugging info:');
    console.error('- Node version:', process.version);
    console.error('- Current directory:', process.cwd());
    console.error('- Environment variables related to Next.js:');

    Object.entries(process.env)
        .filter(([key]) => key.startsWith('NEXT_'))
        .forEach(([key, value]) => {
            console.error(`  ${key}=${value}`);
        });

    process.exit(1);
}