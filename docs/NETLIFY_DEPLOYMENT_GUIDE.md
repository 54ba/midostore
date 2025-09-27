# 🚀 Netlify Deployment Guide for MidoStore

This guide explains how to deploy MidoStore to Netlify as a standalone application.

## ✅ Prerequisites

- ✅ Web3, crypto, and Stripe integrations removed
- ✅ Local SQLite database configured
- ✅ Live data refresh intervals slowed down
- ✅ Mock database fallback implemented

## 🔧 Netlify Configuration

The `netlify.toml` file has been configured for standalone deployment:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "22"
  NPM_VERSION = "10"
  NEXT_TELEMETRY_DISABLED = "1"
  DATABASE_URL = "file:./dev.db"
  PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING = "1"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 📦 Package.json Scripts

Added deployment scripts:
- `npm run build` - Standard Next.js build
- `npm run build:simple` - Alias for standard build
- `npm run build:standalone` - Standalone build option

## 🌍 Environment Variables

### Required for Netlify:
```bash
# Database (SQLite)
DATABASE_URL="file:./dev.db"

# Prisma compatibility
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# Next.js settings
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=production
```

### Optional Configuration:
```bash
# Site URL
NEXT_PUBLIC_NETLIFY_SITE_URL=https://your-site.netlify.app

# Localization
DEFAULT_LOCALE=en-AE
DEFAULT_CURRENCY=AED

# Performance (already optimized)
REFRESH_INTERVAL_DASHBOARD=300000
REFRESH_INTERVAL_LIVE_SALES=30000
```

## 🚀 Deployment Steps

### Method 1: Git-based Deployment (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Select the `midostore` repository

3. **Configure Build Settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Node version:** `22`

4. **Set Environment Variables:**
   ```
   DATABASE_URL = file:./dev.db
   PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING = 1
   NEXT_TELEMETRY_DISABLED = 1
   NODE_ENV = production
   ```

5. **Deploy:**
   - Click "Deploy site"
   - Wait for build to complete

### Method 2: CLI Deployment

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Initialize site:**
   ```bash
   netlify init
   ```

4. **Deploy:**
   ```bash
   # Build the project
   npm run build

   # Deploy to Netlify
   netlify deploy --prod --dir=.next
   ```

## 🔍 Troubleshooting

### Common Issues:

1. **Build Command Not Found:**
   ```
   Error: Missing script: "build:simple"
   ```
   **Solution:** Use `npm run build` instead

2. **Prisma Engine Issues:**
   ```
   Error: Prisma engines not found
   ```
   **Solution:** Environment variable already set: `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1`

3. **Database Connection:**
   ```
   Error: Database connection failed
   ```
   **Solution:** App uses mock database fallback automatically

4. **404 on Dynamic Routes:**
   ```
   Error: Page not found
   ```
   **Solution:** Netlify redirects configured in `netlify.toml`

### Build Logs:
- Check Netlify build logs for specific errors
- Ensure all dependencies are installed
- Verify environment variables are set

## 📊 Performance Optimizations

### Already Implemented:
- ✅ Slowed down live data refresh intervals
- ✅ Removed external API dependencies
- ✅ Lightweight mock database
- ✅ Standalone application (no cloud services)

### Build Optimizations:
- Next.js automatic optimizations
- Static generation where possible
- Image optimization
- Bundle size optimization

## 🧪 Testing Deployment

### Local Testing:
```bash
# Test production build locally
npm run build
npm run start
```

### Deployment Testing:
1. Check all pages load correctly
2. Verify API endpoints work
3. Test authentication flow
4. Confirm database operations
5. Check mobile responsiveness

## 📈 Post-Deployment

### Monitoring:
- Monitor Netlify analytics
- Check build logs regularly
- Watch for any runtime errors

### Scaling:
- Current setup handles moderate traffic
- Can upgrade to PostgreSQL later if needed
- Consider CDN for global distribution

## 🔄 Updates and Maintenance

### Code Updates:
```bash
git push origin main  # Triggers automatic deployment
```

### Database Updates:
- Local SQLite database is rebuilt on each deployment
- Consider data persistence strategy for production

### Environment Changes:
- Update via Netlify dashboard
- Or use `netlify env:set KEY=value`

## ⚡ Quick Deploy Commands

```bash
# Complete deployment workflow
git add .
git commit -m "Deploy to Netlify"
git push origin main

# Or manual deploy
npm run build
netlify deploy --prod --dir=.next
```

## 🎯 Success Criteria

✅ Build completes without errors
✅ All pages are accessible
✅ Authentication works
✅ Database operations function
✅ Mock data displays correctly
✅ Mobile-responsive design
✅ Fast loading times

Your MidoStore application is now ready for Netlify deployment! 🚀