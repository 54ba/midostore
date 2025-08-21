# 🚀 Netlify Deployment Guide for MidoStore

Complete guide to deploy your AI-powered e-commerce platform on Netlify with automated database setup, AI model training, and package installation.

## 📋 **Prerequisites**

- [Netlify Account](https://netlify.com)
- [GitHub Repository](https://github.com) with your MidoStore code
- [Supabase](https://supabase.com) or [Railway](https://railway.app) for PostgreSQL database
- [Clerk](https://clerk.com) account for authentication

## 🔧 **Step 1: Database Setup**

### **Option A: Supabase (Recommended)**

1. **Create Supabase Project**
   ```bash
   # Go to https://supabase.com
   # Create new project
   # Note down your database URL
   ```

2. **Get Database URL**
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

### **Option B: Railway**

1. **Create Railway Project**
   ```bash
   # Go to https://railway.app
   # Create new project
   # Add PostgreSQL service
   ```

2. **Get Database URL**
   ```
   postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/railway
   ```

## 🚀 **Step 2: Netlify Project Setup**

### **1. Connect Repository**

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **"New site from Git"**
3. Choose **GitHub** and select your MidoStore repository
4. Configure build settings:

   ```toml
   Build command: npm run netlify:build
   Publish directory: .next
   Base directory: (leave empty)
   ```

### **2. Environment Variables**

Go to **Site settings > Environment variables** and add:

#### **Required Variables:**
```env
DATABASE_URL=postgresql://username:password@host:port/database_name
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
CLERK_SECRET_KEY=sk_test_your_key
```

#### **Optional Variables (Recommended):**
```env
# Exchange Rate APIs
EXCHANGE_RATE_API_KEY=your_key
FIXER_API_KEY=your_key
CURRENCY_API_KEY=your_key

# AI Configuration
ENABLE_AI_TRAINING=true
AI_MODEL_PATH=ai/models/recommendation_model.pkl

# Build Configuration
NODE_VERSION=18
NPM_VERSION=9
PYTHON_VERSION=3.9
```

## 🏗️ **Step 3: Build Configuration**

### **Netlify Configuration File**

Your `netlify.toml` is already configured with:

```toml
[build]
  command = "npm run netlify:build"
  publish = ".next"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"
  PYTHON_VERSION = "3.9"
  PIP_VERSION = "21.3.1"

[[plugins]]
  package = "@netlify/plugin-prisma"
```

### **Build Scripts**

The build process automatically runs:

1. **Pre-build** (`netlify:prebuild`):
   - Install Node.js dependencies
   - Check environment variables
   - Setup Python environment
   - Install AI dependencies

2. **Build** (`next build`):
   - Build Next.js application
   - Generate Prisma client
   - Setup database schema

3. **Post-build** (`netlify:postbuild`):
   - Seed database with initial data
   - Train AI recommendation model
   - Cleanup build artifacts

## 📦 **Step 4: Package Installation & Dependencies**

### **Automatic Installation**

The build script automatically handles:

```bash
# Node.js dependencies
npm ci --production=false

# Python dependencies
cd ai
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Prisma client generation
npm run db:generate

# Database setup
npm run db:push
npm run db:seed
```

### **Dependencies Included**

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Prisma, Node.js, Python 3.9
- **AI/ML**: LightFM, Scikit-learn, NumPy, Pandas
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk integration
- **Deployment**: Netlify functions and build hooks

## 🔄 **Step 5: Database Migration & Seeding**

### **Automatic Database Setup**

The build process automatically:

1. **Generates Prisma Client**
   ```bash
   npm run db:generate
   ```

2. **Pushes Database Schema**
   ```bash
   npm run db:push
   ```

3. **Seeds Initial Data**
   ```bash
   npm run db:seed
   ```

### **Database Schema Includes**

- **Products**: Scraped from Alibaba/AliExpress
- **Users**: Authentication and preferences
- **Exchange Rates**: Multi-currency support
- **User Interactions**: AI training data
- **Orders**: E-commerce functionality
- **Gulf Countries**: Localization support

## 🤖 **Step 6: AI Model Training**

### **Automatic AI Setup**

The build process automatically:

1. **Creates Python Environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Trains Recommendation Model**
   ```bash
   python recommendation_engine.py --train
   ```

3. **Saves Trained Model**
   ```
   ai/models/recommendation_model.pkl
   ```

### **AI Features Enabled**

- **Personalized Recommendations**: User-specific suggestions
- **Similar Item Detection**: Related product finding
- **Popular Item Ranking**: Trending products
- **Real-time Learning**: Continuous model updates

## 🚀 **Step 7: Deploy**

### **Trigger Deployment**

1. **Push to Main Branch** (Automatic)
   ```bash
   git push origin main
   ```

2. **Manual Deploy**
   ```bash
   # In Netlify dashboard
   # Click "Trigger deploy" > "Deploy site"
   ```

3. **Preview Deployments**
   ```bash
   # Create pull request
   # Netlify automatically creates preview
   ```

### **Deployment Contexts**

- **Production**: Main branch with full AI training
- **Preview**: Pull requests with limited AI features
- **Branch**: Feature branches with basic functionality

## 📊 **Step 8: Monitor & Verify**

### **Build Logs**

Check build logs in Netlify dashboard:

1. Go to **Deploys** tab
2. Click on latest deployment
3. View **Build log** for any errors

### **Expected Build Output**

```
🚀 Starting Netlify build process...
[INFO] Checking environment variables...
[SUCCESS] Environment check passed
[INFO] Installing Node.js dependencies...
[SUCCESS] Node.js dependencies installed
[INFO] Setting up Python environment...
[SUCCESS] Python environment setup completed
[INFO] Setting up database...
[SUCCESS] Database setup completed
[INFO] Seeding database...
[SUCCESS] Database seeded successfully
[INFO] Setting up AI model...
[SUCCESS] AI model setup completed
[INFO] Building Next.js application...
[SUCCESS] Next.js build completed
[INFO] Cleaning up build artifacts...
[SUCCESS] Cleanup completed
🎉 Build process completed successfully!
```

### **Verification Steps**

1. **Check Site URL**: Your site should be live
2. **Test Authentication**: Clerk login should work
3. **Verify Database**: Products should be loaded
4. **Check AI Features**: Recommendations should work
5. **Test Exchange Rates**: Currency conversion should function

## 🔧 **Troubleshooting**

### **Common Build Issues**

#### **1. Python Not Available**
```bash
# Error: python3: command not found
# Solution: Ensure PYTHON_VERSION=3.9 in environment
```

#### **2. Database Connection Failed**
```bash
# Error: P1001: Can't reach database server
# Solution: Check DATABASE_URL and firewall settings
```

#### **3. Prisma Generation Failed**
```bash
# Error: Prisma client generation failed
# Solution: Check database schema and Prisma configuration
```

#### **4. AI Model Training Failed**
```bash
# Error: LightFM import failed
# Solution: Check Python dependencies and requirements.txt
```

### **Debug Commands**

```bash
# Check environment variables
curl -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/sites/$SITE_ID/env"

# View build logs
netlify logs --site $SITE_ID

# Check function status
netlify functions:list --site $SITE_ID
```

### **Manual Debugging**

1. **SSH into Netlify** (if available)
   ```bash
   netlify ssh --site $SITE_ID
   ```

2. **Check File Structure**
   ```bash
   ls -la
   ls -la ai/
   ls -la prisma/
   ```

3. **Test Commands Manually**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

## 📈 **Performance Optimization**

### **Build Time Optimization**

1. **Cache Dependencies**
   ```toml
   # netlify.toml
   [build.processing]
     skip_processing = false
   ```

2. **Parallel Processing**
   ```bash
   # package.json scripts run in parallel where possible
   npm run netlify:prebuild & npm run build & wait
   ```

3. **Selective AI Training**
   ```env
   # Only train AI in production
   ENABLE_AI_TRAINING=true  # production
   ENABLE_AI_TRAINING=false # preview/branch
   ```

### **Runtime Optimization**

1. **Edge Functions**: Use Netlify functions for API routes
2. **CDN**: Automatic global content delivery
3. **Caching**: Intelligent caching strategies
4. **Compression**: Automatic asset optimization

## 🔒 **Security Considerations**

### **Environment Variables**

- **Never commit** `.env` files to Git
- **Use Netlify** environment variable management
- **Rotate keys** regularly
- **Limit access** to sensitive variables

### **Database Security**

- **Use SSL** connections
- **Restrict IP access** to database
- **Regular backups** of production data
- **Monitor access** logs

### **API Security**

- **Rate limiting** on all endpoints
- **Input validation** for all user data
- **CORS configuration** for cross-origin requests
- **Authentication** required for sensitive operations

## 📚 **Additional Resources**

### **Documentation**

- [Netlify Docs](https://docs.netlify.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [LightFM Documentation](https://making.lyst.com/lightfm/docs/)

### **Support**

- [Netlify Support](https://www.netlify.com/support/)
- [GitHub Issues](https://github.com/your-repo/issues)
- [Community Forums](https://community.netlify.com/)

### **Monitoring Tools**

- [Netlify Analytics](https://www.netlify.com/products/analytics/)
- [Build Hooks](https://docs.netlify.com/configure-builds/build-hooks/)
- [Deploy Notifications](https://docs.netlify.com/site-deploys/notifications/)

---

## 🎯 **Quick Deploy Checklist**

- [ ] Database URL configured
- [ ] Clerk keys set
- [ ] Repository connected to Netlify
- [ ] Build command: `npm run netlify:build`
- [ ] Publish directory: `.next`
- [ ] Environment variables configured
- [ ] Prisma plugin installed
- [ ] First deployment triggered
- [ ] Site verified and tested
- [ ] AI recommendations working
- [ ] Exchange rates updating
- [ ] Products loading correctly

**🚀 Your AI-powered e-commerce platform is now ready for production on Netlify!**

For any issues, check the build logs and refer to the troubleshooting section above.