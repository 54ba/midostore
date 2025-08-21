#!/usr/bin/env node

/**
 * Dynamic Configuration Manager for Dropshipping Store
 * Automatically detects and configures environment for Node.js and Python services
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DynamicConfig {
    constructor() {
        this.config = {
            node: {},
            python: {},
            services: {},
            environment: process.env.NODE_ENV || 'development'
        };

        this.loadConfiguration();
    }

    /**
     * Load configuration from various sources
     */
    loadConfiguration() {
        this.loadEnvironmentVariables();
        this.loadPackageJson();
        this.detectPythonEnvironment();
        this.detectServices();
        this.validateConfiguration();
    }

    /**
     * Load environment variables
     */
    loadEnvironmentVariables() {
        // Load from .env file if it exists
        const envPath = path.join(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            require('dotenv').config({ path: envPath });
        }

        // Set default values
        this.config.services = {
            nextjs: {
                port: process.env.NEXT_PORT || 3000,
                host: process.env.NEXT_HOST || 'localhost',
                environment: this.config.environment
            },
            ai: {
                port: process.env.API_PORT || 8000,
                host: process.env.API_HOST || '0.0.0.0',
                pythonPath: process.env.PYTHON_PATH || 'python3',
                venvPath: process.env.VENV_PATH || path.join(process.cwd(), 'ai', 'venv')
            },
            database: {
                url: process.env.DATABASE_URL,
                type: process.env.DATABASE_TYPE || 'postgresql'
            }
        };
    }

    /**
     * Load package.json configuration
     */
    loadPackageJson() {
        try {
            const packagePath = path.join(process.cwd(), 'package.json');
            if (fs.existsSync(packagePath)) {
                const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
                this.config.node = {
                    name: packageJson.name,
                    version: packageJson.version,
                    scripts: packageJson.scripts,
                    dependencies: packageJson.dependencies,
                    devDependencies: packageJson.devDependencies
                };
            }
        } catch (error) {
            console.warn('Warning: Could not load package.json:', error.message);
        }
    }

    /**
     * Detect Python environment and capabilities
     */
    detectPythonEnvironment() {
        try {
            // Check if Python is available
            const pythonVersion = execSync('python3 --version', { encoding: 'utf8' }).trim();
            this.config.python.version = pythonVersion;
            this.config.python.available = true;

            // Check if virtual environment exists
            const venvPath = this.config.services.ai.venvPath;
            if (fs.existsSync(venvPath)) {
                this.config.python.venv = {
                    exists: true,
                    path: venvPath,
                    activated: process.env.VIRTUAL_ENV === venvPath
                };
            } else {
                this.config.python.venv = {
                    exists: false,
                    path: venvPath,
                    activated: false
                };
            }

            // Check if AI requirements are available
            const requirementsPath = path.join(process.cwd(), 'ai', 'requirements.txt');
            if (fs.existsSync(requirementsPath)) {
                this.config.python.requirements = {
                    exists: true,
                    path: requirementsPath
                };
            } else {
                this.config.python.requirements = {
                    exists: false,
                    path: requirementsPath
                };
            }

        } catch (error) {
            this.config.python.available = false;
            this.config.python.error = error.message;
        }
    }

    /**
     * Detect available services
     */
    detectServices() {
        // Check if Next.js app exists
        const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
        this.config.services.nextjs.available = fs.existsSync(nextConfigPath);

        // Check if AI service exists
        const aiServerPath = path.join(process.cwd(), 'ai', 'api_server.py');
        this.config.services.ai.available = fs.existsSync(aiServerPath);

        // Check if database is configured
        this.config.services.database.available = !!this.config.services.database.url;

        // Check if Prisma is configured
        const prismaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
        this.config.services.prisma = {
            available: fs.existsSync(prismaPath),
            path: prismaPath
        };
    }

    /**
     * Validate configuration
     */
    validateConfiguration() {
        const errors = [];
        const warnings = [];

        // Check required services
        if (!this.config.services.nextjs.available) {
            errors.push('Next.js application not found');
        }

        if (!this.config.services.ai.available) {
            warnings.push('AI service not found - some features may not work');
        }

        if (!this.config.python.available) {
            warnings.push('Python not available - AI service will not work');
        }

        if (!this.config.services.database.available) {
            warnings.push('Database not configured - some features may not work');
        }

        this.config.validation = {
            errors,
            warnings,
            isValid: errors.length === 0
        };
    }

    /**
     * Get configuration for a specific service
     */
    getServiceConfig(serviceName) {
        return this.config.services[serviceName] || null;
    }

    /**
     * Get Python configuration
     */
    getPythonConfig() {
        return this.config.python;
    }

    /**
     * Get Node.js configuration
     */
    getNodeConfig() {
        return this.config.node;
    }

    /**
     * Check if a service is available
     */
    isServiceAvailable(serviceName) {
        return this.config.services[serviceName]?.available || false;
    }

    /**
     * Get all available services
     */
    getAvailableServices() {
        return Object.keys(this.config.services).filter(
            service => this.config.services[service].available
        );
    }

    /**
     * Generate startup commands
     */
    generateStartupCommands() {
        const commands = {};

        // Next.js commands
        if (this.isServiceAvailable('nextjs')) {
            commands.nextjs = {
                dev: 'npm run dev',
                build: 'npm run build',
                start: 'npm start'
            };
        }

        // AI service commands
        if (this.isServiceAvailable('ai') && this.config.python.available) {
            commands.ai = {
                start: `cd ai && source venv/bin/activate && python3 api_server.py`,
                setup: './scripts/setup-ai-analytics.sh'
            };
        }

        // Database commands
        if (this.isServiceAvailable('prisma')) {
            commands.database = {
                generate: 'npx prisma generate',
                push: 'npx prisma db push',
                studio: 'npx prisma studio'
            };
        }

        return commands;
    }

    /**
     * Generate environment file template
     */
    generateEnvTemplate() {
        const template = `# Dynamic Configuration for Dropshipping Store
# Generated on ${new Date().toISOString()}

# Node.js Configuration
NODE_ENV=${this.config.environment}
NEXT_PORT=${this.config.services.nextjs.port}
NEXT_HOST=${this.config.services.nextjs.host}

# AI Service Configuration
API_PORT=${this.config.services.ai.port}
API_HOST=${this.config.services.ai.host}
PYTHON_PATH=${this.config.services.ai.pythonPath}
VENV_PATH=${this.config.services.ai.venvPath}

# Database Configuration
DATABASE_URL=${this.config.services.database.url || 'your_database_url_here'}
DATABASE_TYPE=${this.config.services.database.type}

# Additional Configuration
LOG_LEVEL=INFO
ENABLE_AI_TRAINING=true
`;

        return template;
    }

    /**
     * Display configuration summary
     */
    displaySummary() {
        console.log('\n🚀 Dynamic Configuration Summary');
        console.log('================================');

        console.log(`\n📊 Environment: ${this.config.environment}`);
        console.log(`🌐 Next.js: ${this.isServiceAvailable('nextjs') ? '✅ Available' : '❌ Not Found'}`);
        console.log(`🤖 AI Service: ${this.isServiceAvailable('ai') ? '✅ Available' : '❌ Not Found'}`);
        console.log(`🐍 Python: ${this.config.python.available ? '✅ Available' : '❌ Not Available'}`);
        console.log(`🗄️ Database: ${this.isServiceAvailable('database') ? '✅ Configured' : '❌ Not Configured'}`);
        console.log(`🔧 Prisma: ${this.isServiceAvailable('prisma') ? '✅ Available' : '❌ Not Found'}`);

        if (this.config.validation.errors.length > 0) {
            console.log('\n❌ Configuration Errors:');
            this.config.validation.errors.forEach(error => console.log(`   - ${error}`));
        }

        if (this.config.validation.warnings.length > 0) {
            console.log('\n⚠️ Configuration Warnings:');
            this.config.validation.warnings.forEach(warning => console.log(`   - ${warning}`));
        }

        console.log('\n🎯 Available Services:');
        this.getAvailableServices().forEach(service => {
            const config = this.config.services[service];
            console.log(`   - ${service}: ${config.port ? `Port ${config.port}` : 'Configured'}`);
        });

        console.log('\n📋 Startup Commands:');
        const commands = this.generateStartupCommands();
        Object.entries(commands).forEach(([service, serviceCommands]) => {
            console.log(`\n   ${service.toUpperCase()}:`);
            Object.entries(serviceCommands).forEach(([cmd, command]) => {
                console.log(`     ${cmd}: ${command}`);
            });
        });
    }

    /**
     * Save configuration to file
     */
    saveConfiguration(outputPath = 'dynamic-config.json') {
        try {
            const configData = {
                ...this.config,
                generatedAt: new Date().toISOString(),
                nodeVersion: process.version,
                platform: process.platform
            };

            fs.writeFileSync(outputPath, JSON.stringify(configData, null, 2));
            console.log(`✅ Configuration saved to ${outputPath}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to save configuration:', error.message);
            return false;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DynamicConfig;
}

// Run if called directly
if (require.main === module) {
    const config = new DynamicConfig();
    config.displaySummary();

    // Save configuration if requested
    if (process.argv.includes('--save')) {
        config.saveConfiguration();
    }

    // Generate env template if requested
    if (process.argv.includes('--env-template')) {
        const template = config.generateEnvTemplate();
        fs.writeFileSync('.env.template', template);
        console.log('✅ Environment template saved to .env.template');
    }
}