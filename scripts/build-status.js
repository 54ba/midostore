#!/usr/bin/env node

/**
 * Build Status Check Script for MidoStore
 * Verifies all components are properly configured and working
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 MidoStore Build Status Check\n');

// Check functions
function checkFileExists(filePath, description) {
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${description}: ${filePath}`);
        return true;
    } else {
        console.log(`❌ ${description}: ${filePath} (MISSING)`);
        return false;
    }
}

function checkDirectoryExists(dirPath, description) {
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        console.log(`✅ ${description}: ${dirPath}`);
        return true;
    } else {
        console.log(`❌ ${description}: ${dirPath} (MISSING)`);
        return false;
    }
}

function checkPackageScripts() {
    const packagePath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packagePath)) {
        console.log('❌ package.json not found');
        return false;
    }

    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const requiredScripts = [
        'netlify:build',
        'db:generate',
        'db:push',
        'db:seed'
    ];

    let allScriptsPresent = true;
    requiredScripts.forEach(script => {
        if (packageJson.scripts[script]) {
            console.log(`✅ Script: ${script}`);
        } else {
            console.log(`❌ Script: ${script} (MISSING)`);
            allScriptsPresent = false;
        }
    });

    return allScriptsPresent;
}

function checkEnvironmentVariables() {
    const requiredVars = [
        'DATABASE_URL',
        'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
        'CLERK_SECRET_KEY'
    ];

    let allVarsPresent = true;
    requiredVars.forEach(varName => {
        if (process.env[varName]) {
            console.log(`✅ Environment Variable: ${varName}`);
        } else {
            console.log(`❌ Environment Variable: ${varName} (NOT SET)`);
            allVarsPresent = false;
        }
    });

    return allVarsPresent;
}

function checkNetlifyConfiguration() {
    const netlifyToml = path.join(process.cwd(), 'netlify.toml');
    if (!fs.existsSync(netlifyToml)) {
        console.log('❌ netlify.toml not found');
        return false;
    }

    const content = fs.readFileSync(netlifyToml, 'utf8');

    let configOk = true;

    // Check build command
    if (content.includes('npm run netlify:build')) {
        console.log('✅ Build command configured correctly');
    } else {
        console.log('❌ Build command not configured correctly');
        configOk = false;
    }

    // Check Prisma plugin
    if (content.includes('@netlify/plugin-prisma')) {
        console.log('✅ Prisma plugin configured');
    } else {
        console.log('❌ Prisma plugin not configured');
        configOk = false;
    }

    // Check Python version
    if (content.includes('PYTHON_VERSION = "3.9"')) {
        console.log('✅ Python version configured');
    } else {
        console.log('❌ Python version not configured');
        configOk = false;
    }

    return configOk;
}

function checkAISetup() {
    const aiDir = path.join(process.cwd(), 'ai');
    if (!fs.existsSync(aiDir)) {
        console.log('❌ AI directory not found');
        return false;
    }

    let aiSetupOk = true;

    // Check Python files
    const pythonFiles = [
        'recommendation_engine.py',
        'requirements.txt',
        'setup.sh'
    ];

    pythonFiles.forEach(file => {
        const filePath = path.join(aiDir, file);
        if (fs.existsSync(filePath)) {
            console.log(`✅ AI File: ${file}`);
        } else {
            console.log(`❌ AI File: ${file} (MISSING)`);
            aiSetupOk = false;
        }
    });

    // Check if setup script is executable
    const setupPath = path.join(aiDir, 'setup.sh');
    if (fs.existsSync(setupPath)) {
        try {
            fs.accessSync(setupPath, fs.constants.X_OK);
            console.log('✅ AI setup script is executable');
        } catch {
            console.log('⚠️  AI setup script is not executable (run: chmod +x ai/setup.sh)');
        }
    }

    return aiSetupOk;
}

function checkDatabaseSetup() {
    const prismaDir = path.join(process.cwd(), 'prisma');
    if (!fs.existsSync(prismaDir)) {
        console.log('❌ Prisma directory not found');
        return false;
    }

    let dbSetupOk = true;

    // Check schema file
    const schemaFile = path.join(prismaDir, 'schema.prisma');
    if (fs.existsSync(schemaFile)) {
        console.log('✅ Prisma schema file found');

        // Check if schema includes required models
        const schemaContent = fs.readFileSync(schemaFile, 'utf8');
        const requiredModels = ['Product', 'User', 'ExchangeRate', 'UserInteraction'];

        requiredModels.forEach(model => {
            if (schemaContent.includes(`model ${model}`)) {
                console.log(`✅ Schema model: ${model}`);
            } else {
                console.log(`❌ Schema model: ${model} (MISSING)`);
                dbSetupOk = false;
            }
        });
    } else {
        console.log('❌ Prisma schema file not found');
        dbSetupOk = false;
    }

    return dbSetupOk;
}

function checkScripts() {
    const scriptsDir = path.join(process.cwd(), 'scripts');
    if (!fs.existsSync(scriptsDir)) {
        console.log('❌ Scripts directory not found');
        return false;
    }

    let scriptsOk = true;

    // Check required scripts
    const requiredScripts = [
        'netlify-build.sh',
        'db-migrate.ts',
        'db-seed.ts',
        'check-env.js'
    ];

    requiredScripts.forEach(script => {
        const scriptPath = path.join(scriptsDir, script);
        if (fs.existsSync(scriptPath)) {
            console.log(`✅ Script: ${script}`);
        } else {
            console.log(`❌ Script: ${script} (MISSING)`);
            scriptsOk = false;
        }
    });

    return scriptsOk;
}

// Main check function
function runChecks() {
    console.log('📁 File Structure Check:');
    console.log('========================');

    let allChecksPassed = true;

    // Check core files
    allChecksPassed &= checkFileExists('package.json', 'Package.json');
    allChecksPassed &= checkFileExists('netlify.toml', 'Netlify configuration');
    allChecksPassed &= checkFileExists('next.config.js', 'Next.js configuration');
    allChecksPassed &= checkFileExists('tailwind.config.js', 'Tailwind configuration');

    console.log('\n📦 Package Scripts Check:');
    console.log('==========================');
    allChecksPassed &= checkPackageScripts();

    console.log('\n🏗️  Netlify Configuration Check:');
    console.log('==================================');
    allChecksPassed &= checkNetlifyConfiguration();

    console.log('\n🤖 AI Setup Check:');
    console.log('==================');
    allChecksPassed &= checkAISetup();

    console.log('\n🗄️  Database Setup Check:');
    console.log('==========================');
    allChecksPassed &= checkDatabaseSetup();

    console.log('\n📜 Scripts Check:');
    console.log('==================');
    allChecksPassed &= checkScripts();

    console.log('\n🔧 Environment Variables Check:');
    console.log('=================================');
    allChecksPassed &= checkEnvironmentVariables();

    console.log('\n📊 Summary:');
    console.log('============');

    if (allChecksPassed) {
        console.log('🎉 All checks passed! Your MidoStore is ready for deployment.');
        console.log('\n📋 Next steps:');
        console.log('1. Set up your database (Supabase/Railway)');
        console.log('2. Configure environment variables in Netlify');
        console.log('3. Connect your repository to Netlify');
        console.log('4. Deploy with: npm run netlify:build');
    } else {
        console.log('❌ Some checks failed. Please fix the issues above before deploying.');
        console.log('\n🔧 To fix issues:');
        console.log('1. Run: npm install');
        console.log('2. Run: chmod +x ai/setup.sh');
        console.log('3. Check your environment variables');
        console.log('4. Verify all required files are present');
    }

    return allChecksPassed;
}

// Run the checks
if (require.main === module) {
    const success = runChecks();
    process.exit(success ? 0 : 1);
}

module.exports = { runChecks };