# 🚀 MidoHub Scripts Directory

This directory contains all the scripts needed to build, deploy, and manage the MidoHub dropshipping platform.

## 📋 Quick Start

### 🚀 For Development
```bash
# Quick start with all services
npm run quick:start

# Or use the script directly
./scripts/quick-start.sh
```

### 🔨 For Production Build & Deploy
```bash
# Full build and deploy process
npm run build:deploy

# Or use the script directly
./scripts/build-and-deploy.sh production local
```

### 🔧 For Service Management
```bash
# Manage running services
npm run services:manage

# Or use the script directly
./scripts/service-manager.sh
```

## 📁 Script Categories

### 🚀 **Build & Deploy Scripts**

#### `build-and-deploy.sh`
Comprehensive build and deploy script that handles the entire process.

**Usage:**
```bash
./scripts/build-and-deploy.sh [BUILD_TYPE] [DEPLOY_TARGET] [SKIP_TESTS]
```

**Parameters:**
- `BUILD_TYPE`: `production`, `simple`, or `development` (default: `production`)
- `DEPLOY_TARGET`: `local`, `netlify`, `netlify:optimized`, `netlify:ultra`, or `direct` (default: `local`)
- `SKIP_TESTS`: `true` or `false` (default: `false`)

**Examples:**
```bash
# Production build for local deployment
./scripts/build-and-deploy.sh production local

# Simple build for Netlify deployment
./scripts/build-and-deploy.sh simple netlify

# Development build skipping tests
./scripts/build-and-deploy.sh development local true
```

**Features:**
- ✅ Prerequisites checking
- ✅ Dependency installation
- ✅ Test execution
- ✅ Application building
- ✅ Database setup
- ✅ AI services setup
- ✅ Deployment
- ✅ Service startup

#### `clean-build.js`
Enhanced build script with retry logic and cleanup.

**Usage:**
```bash
npm run build
```

**Features:**
- 🧹 Automatic cleanup of build artifacts
- 🔄 Retry logic for failed builds
- 📊 Build status monitoring
- 🚫 Telemetry disabled

#### `simple-build.js`
Basic build script for quick builds.

**Usage:**
```bash
npm run build:simple
```

### ⚡ **Development Scripts**

#### `quick-start.sh`
Quick development environment setup and service startup.

**Usage:**
```bash
./scripts/quick-start.sh
```

**Features:**
- 🔧 Environment setup
- 🗄️ Database initialization
- 🚀 Development server startup
- 🤖 Background services startup
- 📊 Status monitoring
- 🧹 Automatic cleanup on exit

### 🔧 **Service Management Scripts**

#### `service-manager.sh`
Comprehensive service management tool.

**Usage:**
```bash
./scripts/service-manager.sh [COMMAND] [SERVICE] [OPTIONS]
```

**Commands:**
- `status` - Show service status
- `start <service>` - Start a service
- `stop <service>` - Stop a service
- `restart <service>` - Restart a service
- `logs <service> [lines]` - Show service logs
- `monitor` - Monitor services continuously
- `help` - Show help information

**Services:**
- `dev` / `development` - Next.js development server
- `dynamic` / `services` - Dynamic services
- `web3` / `crypto` - Web3 and crypto services
- `ai` - AI services
- `all` - All services

**Examples:**
```bash
# Show status of all services
./scripts/service-manager.sh status

# Start all services
./scripts/service-manager.sh start all

# Stop dynamic services
./scripts/service-manager.sh stop dynamic

# Restart Web3 services
./scripts/service-manager.sh restart web3

# Show last 100 lines of AI logs
./scripts/service-manager.sh logs ai 100

# Monitor all services
./scripts/service-manager.sh monitor
```

### 🗄️ **Database Scripts**

#### `db-seed.ts`
Database seeding with sample data.

**Usage:**
```bash
npm run db:seed
```

#### `enhanced-review-seeder.ts`
Advanced review seeding with realistic data.

**Usage:**
```bash
npm run enhanced:reviews
```

#### `db-migrate.ts`
Database migration runner.

**Usage:**
```bash
npm run db:migrate
```

### 🤖 **AI & Analytics Scripts**

#### `setup-ai-analytics.sh`
AI services setup and configuration.

**Usage:**
```bash
npm run ai:setup
```

**Features:**
- 🐍 Python virtual environment setup
- 📦 AI package installation
- 🔧 Systemd service creation
- 📝 Environment configuration

### 🌐 **Web3 & Crypto Scripts**

#### `start-web3-crypto-services.sh`
Web3 and cryptocurrency services startup.

**Usage:**
```bash
npm run start:web3
```

**Features:**
- 🔐 Blockchain service initialization
- 💰 Cryptocurrency integration
- 🔄 Real-time price monitoring
- 📊 DeFi analytics

### 🧪 **Testing Scripts**

#### `test-all-apis.js`
Comprehensive API testing suite.

**Usage:**
```bash
npm run test:apis
```

#### `test-ai-orchestrator.js`
AI orchestrator service testing.

**Usage:**
```bash
npm run test:orchestrator
```

#### `test-ai-agent-supervisor.js`
AI agent supervisor testing.

**Usage:**
```bash
npm run test:agents
```

#### `test-role-management.js`
Role management system testing.

**Usage:**
```bash
npm run test:roles
```

### 🚀 **Deployment Scripts**

#### `deploy-netlify-*.sh`
Various Netlify deployment strategies.

**Usage:**
```bash
# Optimized deployment
npm run netlify:deploy:optimized

# Ultra lightweight deployment
npm run netlify:deploy:ultra

# Simple deployment
npm run netlify:deploy:simple

# Static deployment
npm run netlify:deploy:static
```

#### `deploy-direct.sh`
Direct deployment script.

**Usage:**
```bash
npm run deploy:direct
```

### 🔍 **Utility Scripts**

#### `check-services.js`
Service health checking.

**Usage:**
```bash
npm run health
```

#### `build-status.js`
Build status monitoring.

**Usage:**
```bash
npm run monitor
```

#### `check-env.js`
Environment configuration validation.

**Usage:**
```bash
npm run env:check
```

## 🎯 **Common Workflows**

### 🚀 **New Development Setup**
```bash
# 1. Install dependencies
npm install

# 2. Setup environment
npm run env:setup

# 3. Setup AI services
npm run ai:setup

# 4. Setup database
npm run db:reset

# 5. Quick start development
npm run quick:start
```

### 🔨 **Production Deployment**
```bash
# 1. Full build and deploy
npm run build:deploy

# 2. Start production services
npm run start:full

# 3. Monitor services
npm run monitor
```

### 🔧 **Service Management**
```bash
# 1. Check service status
npm run services:manage status

# 2. Start specific services
npm run services:manage start dynamic

# 3. Monitor services
npm run services:manage monitor
```

## 📊 **Script Dependencies**

### **Required Tools**
- Node.js 18+
- npm
- Git
- Python 3.8+ (for AI services)
- Bash shell

### **Environment Files**
- `.env` - Main environment configuration
- `env.example` - Environment template
- `netlify.env` - Netlify-specific environment

### **Configuration Files**
- `dynamic-config.json` - Dynamic services configuration
- `next.config.ts` - Next.js configuration
- `prisma/schema.prisma` - Database schema

## 🚨 **Troubleshooting**

### **Common Issues**

#### Build Failures
```bash
# Clean build artifacts
npm run clean

# Retry build
npm run build
```

#### Service Startup Issues
```bash
# Check service status
npm run services:manage status

# View service logs
npm run services:manage logs <service>

# Restart services
npm run services:manage restart all
```

#### Database Issues
```bash
# Reset database
npm run db:reset

# Check database connection
npm run env:check
```

### **Log Locations**
- Service logs: `logs/` directory
- Process IDs: `pids/` directory
- Build artifacts: `.next/` directory

## 📚 **Additional Resources**

- **Main README**: `../README.md`
- **API Documentation**: `../README-API-ENDPOINTS.md`
- **Deployment Guide**: `../changelog/DEPLOYMENT_SUCCESS_SUMMARY.md`
- **Environment Setup**: `../ENV_SETUP_GUIDE.md`

## 🤝 **Contributing**

When adding new scripts:
1. Follow the naming convention
2. Add proper error handling
3. Include usage documentation
4. Make scripts executable (`chmod +x`)
5. Add to package.json scripts section
6. Update this README

## 📄 **License**

All scripts are part of the MidoHub project and follow the same license terms.