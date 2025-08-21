# 🔧 Environment Setup Guide

This guide helps you set up your environment variables using `netlify.env` as the base configuration.

## 📋 Quick Start

### 1. **Setup Environment Variables**
```bash
# Run the automated setup script
npm run env:setup

# Or manually:
./scripts/setup-env-from-netlify.sh
```

### 2. **Test Your Configuration**
```bash
# Test environment variable setup
npm run env:test
```

### 3. **Configure Critical API Keys**
Edit `.env.local` and add your actual API keys:

```bash
# Open .env.local in your editor
nano .env.local
# or
code .env.local
```

## 🔑 Critical Variables to Configure

### **Authentication (Required for user management)**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_clerk_key
CLERK_SECRET_KEY=sk_test_your_actual_clerk_secret
```

### **AI Functionality (Required for AI agents and orchestrator)**
```env
OPENAI_API_KEY=sk-your_actual_openai_api_key
# OR
ANTHROPIC_API_KEY=your_actual_anthropic_api_key
```

### **Database (Required for data persistence)**
```env
DATABASE_URL=postgresql://username:password@host:port/database_name
```

## 📊 Environment Status

After running `npm run env:test`, you'll see:

- **Configuration Rate**: Percentage of variables configured
- **Critical Missing**: Variables required for core functionality
- **JSON Validation**: Ensures complex variables are properly formatted

## 🎯 Configuration Levels

### **Level 1: Basic Functionality (48% configured)**
- ✅ Authentication (Clerk)
- ✅ Database connection
- ✅ Basic scraping configuration
- ✅ Web3 settings
- ❌ AI functionality (missing API keys)

### **Level 2: Enhanced Features (60-80% configured)**
Add these for enhanced functionality:
- Exchange rate APIs
- Cryptocurrency integration
- Shipping tracking
- Social media advertising

### **Level 3: Full Platform (90%+ configured)**
Complete setup with all integrations:
- All API keys configured
- Production-ready settings
- Full feature access

## 🔧 Environment Files Overview

### **Current Setup:**
- ✅ `.env.local` - Main environment file (created from netlify.env)
- ✅ `netlify.env` - Original Netlify configuration
- ✅ `env.config.ts` - TypeScript environment validation
- ✅ `.env.local.backup` - Backup of previous configuration

### **File Priority:**
1. `.env.local` (highest priority - used by Next.js)
2. `.env.development` (development-specific)
3. `.env` (general fallback)

## 🚀 Available Scripts

### **Environment Management:**
```bash
npm run env:setup      # Setup environment from netlify.env
npm run env:test       # Test environment configuration
```

### **Testing Scripts:**
```bash
npm run test:orchestrator  # Test AI orchestrator
npm run test:agents       # Test AI agent supervisor
npm run test:roles        # Test role management
npm run test:all          # Run all tests
```

### **Development:**
```bash
npm run dev            # Start development server
npm run build          # Build for production
```

## 📚 Configuration Categories

### **🔐 Authentication & Security**
- Clerk authentication keys
- Stripe payment keys
- API security tokens

### **🤖 AI & Analytics**
- OpenAI/Anthropic API keys
- AI model configuration
- Analytics endpoints

### **💱 Currency & Localization**
- Exchange rate API keys
- Supported locales
- Default currency settings

### **🚚 E-commerce Integration**
- Shipping carrier APIs
- Payment processing
- Order tracking

### **📱 Social & Marketing**
- Social media advertising APIs
- Marketing automation
- Campaign management

### **🌐 Web3 & Blockchain**
- Smart contract addresses
- Blockchain API keys
- Wallet configurations

## ⚠️ Security Best Practices

### **🔒 API Key Security:**
- Never commit `.env.local` to version control
- Use different keys for development and production
- Rotate API keys regularly
- Use environment-specific configurations

### **🛡️ Production Setup:**
```bash
# For production deployment
NODE_ENV=production
DATABASE_URL=your_production_database_url
OPENAI_API_KEY=your_production_openai_key
```

## 🔄 Migration from netlify.env

The setup script automatically:
1. ✅ Copies netlify.env to .env.local
2. ✅ Adds enhanced variables for new features
3. ✅ Removes Netlify-specific sections
4. ✅ Creates backup of existing .env.local
5. ✅ Validates JSON variables

## 🎛️ Environment Validation

The `env.config.ts` file provides:
- **Type Safety**: TypeScript validation for all environment variables
- **Default Values**: Sensible defaults for optional variables
- **Schema Validation**: Zod schema validation
- **Development Helpers**: Better error messages and debugging

## 📈 Monitoring & Testing

### **Real-time Monitoring:**
```bash
# Check environment status
npm run env:test

# Monitor configuration changes
watch npm run env:test
```

### **Integration Testing:**
```bash
# Test all systems
npm run test:all

# Individual system tests
npm run test:orchestrator
npm run test:agents
npm run test:roles
```

## 🚨 Troubleshooting

### **Common Issues:**

#### **1. Missing Critical Variables**
```bash
⚠️  Critical Variables Missing:
   - OPENAI_API_KEY
   - ANTHROPIC_API_KEY
```
**Solution:** Add your AI API keys to `.env.local`

#### **2. JSON Parse Errors**
```bash
❌ SCRAPING_SOURCES: Invalid JSON
```
**Solution:** Ensure JSON variables use proper formatting:
```env
SCRAPING_SOURCES=["alibaba", "aliexpress"]
```

#### **3. Database Connection Issues**
```bash
❌ DATABASE_URL: Not configured
```
**Solution:** Add your PostgreSQL connection string

### **Getting Help:**
- Check `CLERK_SETUP_GUIDE.md` for authentication setup
- Review `DYNAMIC_SETUP_README.md` for advanced configuration
- See `CLERK_KEYLESS_MODE_README.md` for keyless development

## ✅ Verification Checklist

Before running your application:

- [ ] Environment variables configured (`npm run env:test`)
- [ ] Critical API keys added (OpenAI/Anthropic, Clerk, Database)
- [ ] JSON variables properly formatted
- [ ] Development server starts (`npm run dev`)
- [ ] AI systems functional (`npm run test:agents`)
- [ ] Authentication working (if Clerk configured)

## 🎉 Success!

When properly configured, you'll have:
- ✅ **48%+ configuration rate** (basic functionality)
- ✅ **AI Agent Supervisor** with LangChain integration
- ✅ **AI Orchestrator** for platform management
- ✅ **Role Management** with Manager and Admin roles
- ✅ **Enhanced Features** (crypto, shipping, advertising, Web3)
- ✅ **Development Tools** for testing and monitoring

---

**Next Steps:** Configure your missing API keys and run `npm run dev` to start developing! 🚀