#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function getDirectorySize(dirPath) {
    let totalSize = 0;

    if (!fs.existsSync(dirPath)) {
        return 0;
    }

    const items = fs.readdirSync(dirPath);

    for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
            totalSize += getDirectorySize(itemPath);
        } else {
            totalSize += stats.size;
        }
    }

    return totalSize;
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function checkFunctions() {
    console.log('🔍 Checking Netlify function sizes...\n');

    const functionsDir = 'netlify/functions-lightweight';

    if (!fs.existsSync(functionsDir)) {
        console.log('❌ Functions directory not found:', functionsDir);
        return;
    }

    const functions = fs.readdirSync(functionsDir).filter(file => file.endsWith('.js'));

    console.log('📁 Functions found:');
    console.log('─'.repeat(50));

    let totalSize = 0;

    for (const func of functions) {
        const funcPath = path.join(functionsDir, func);
        const stats = fs.statSync(funcPath);
        const size = stats.size;
        totalSize += size;

        const status = size > 1024 * 1024 ? '⚠️  ' : '✅ ';
        console.log(`${status}${func.padEnd(25)} ${formatBytes(size)}`);
    }

    console.log('─'.repeat(50));
    console.log(`📊 Total functions size: ${formatBytes(totalSize)}`);

    if (totalSize > 50 * 1024 * 1024) { // 50MB limit
        console.log('❌ Functions are too large for Netlify!');
        console.log('💡 Consider splitting functions or removing heavy dependencies');
    } else if (totalSize > 10 * 1024 * 1024) { // 10MB warning
        console.log('⚠️  Functions are getting large, monitor closely');
    } else {
        console.log('✅ Functions size is within acceptable limits');
    }

    // Check for heavy dependencies
    console.log('\n🔍 Checking for heavy dependencies...');
    const nodeModules = 'node_modules';

    if (fs.existsSync(nodeModules)) {
        const heavyDeps = [
            'puppeteer',
            'electron',
            '@prisma/engines',
            'python-shell',
            'xlsx'
        ];

        for (const dep of heavyDeps) {
            const depPath = path.join(nodeModules, dep);
            if (fs.existsSync(depPath)) {
                const size = getDirectorySize(depPath);
                if (size > 1024 * 1024) { // > 1MB
                    console.log(`⚠️  Heavy dependency: ${dep} (${formatBytes(size)})`);
                }
            }
        }
    }
}

if (require.main === module) {
    checkFunctions();
}

module.exports = { checkFunctions };