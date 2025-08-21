#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Cleaning build artifacts...');

// Remove .next directory
if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
    console.log('✅ Removed .next directory');
}

// Remove any cached files
if (fs.existsSync('node_modules/.cache')) {
    fs.rmSync('node_modules/.cache', { recursive: true, force: true });
    console.log('✅ Removed node_modules/.cache');
}

console.log('🔨 Starting Next.js build...');

try {
    execSync('next build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');

    // Check if Pages Router files were generated and remove them
    const pagesDir = path.join('.next', 'server', 'pages');
    if (fs.existsSync(pagesDir)) {
        console.log('⚠️  Pages Router files detected, removing...');

        // Remove specific Pages Router files that cause the <Html> import error
        const filesToRemove = ['_document.js', '_app.js', '_error.js'];
        let removedCount = 0;

        filesToRemove.forEach(file => {
            const filePath = path.join(pagesDir, file);
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                    console.log(`✅ Removed ${file}`);
                    removedCount++;
                } catch (error) {
                    console.warn(`⚠️  Could not remove ${file}: ${error.message}`);
                }
            }
        });

        // Remove corresponding .nft.json files
        const nftFiles = fs.readdirSync(pagesDir).filter(file =>
            file.endsWith('.nft.json') &&
            filesToRemove.some(f => file.startsWith(f.replace('.js', '')))
        );

        nftFiles.forEach(file => {
            const filePath = path.join(pagesDir, file);
            try {
                fs.unlinkSync(filePath);
                console.log(`✅ Removed ${file}`);
                removedCount++;
            } catch (error) {
                console.warn(`⚠️  Could not remove ${file}: ${error.message}`);
            }
        });

        if (removedCount > 0) {
            console.log(`🎉 Successfully removed ${removedCount} Pages Router files that could cause <Html> import errors`);
        } else {
            console.log('ℹ️  No problematic Pages Router files found to remove');
        }
    } else {
        console.log('✅ No Pages Router directory found - App Router only build successful');
    }

    console.log('🚀 Build process completed successfully!');

} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}