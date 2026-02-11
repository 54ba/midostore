# 🚨 VPS BUILD FAILURE - SOLUTION

## 🔍 Issues Identified from Build Log

### 1. **MongoDB Connection Error** ✅ FIXED

```
Failed to initialize BuyerService: MongoServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**Root Cause**: `lib/mongodb.ts` was looking for `MONGODB_URI` but `.env` has `DATABASE_URL`
**Fix Applied**: Updated `lib/mongodb.ts` to check both `DATABASE_URL` and `MONGODB_URI`

### 2. **Out of Memory Error** ✅ SOLUTION READY

```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Root Cause**: Next.js build requires more memory than available (default 512MB)
**Solution**: Increase Node.js heap size to 4GB during build

## 🚀 DEPLOYMENT SOLUTION

### Step 1: Commit Fixes (Local Machine)

```bash
cd /home/mahmoud/Documents/GitHub/midostore
git add .
git commit -m "Fix: MongoDB connection and add memory-optimized build script"
git push origin main
```

### Step 2: Deploy on VPS with Memory Fix

```bash
# SSH to VPS
ssh ubuntu@musicbud

# Navigate to project
cd ~/midostore

# Pull latest changes
git pull origin main

# Make build script executable
chmod +x scripts/build-production.sh

# Build with increased memory
bash scripts/build-production.sh
```

The build script will:

1. ✅ Check environment configuration
2. ✅ Install dependencies
3. ✅ Generate Prisma client
4. ✅ **Build with 4GB memory** (prevents OOM error)
5. ✅ Clean up caches

### Step 3: Start Production Server

```bash
# Stop any existing processes
pm2 delete all

# Start in production mode
pm2 start npm --name "midostore" -- start

# Save PM2 configuration
pm2 save

# Monitor
pm2 logs midostore
```

## 📋 Alternative: Manual Build with Memory Fix

If the script doesn't work, run manually:

```bash
cd ~/midostore

# Set Node memory to 4GB
export NODE_OPTIONS="--max-old-space-size=4096"

# Build
npm run build

# Start
pm2 delete all
pm2 start npm --name "midostore" -- start
pm2 save
```

## 🔧 If Build Still Fails

### Option 1: Build Locally, Deploy Built Files

```bash
# On your LOCAL machine (more powerful)
cd /home/mahmoud/Documents/GitHub/midostore

# Build locally
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Commit the .next directory (normally gitignored)
git add -f .next
git commit -m "Add pre-built files for VPS"
git push origin main

# On VPS
ssh ubuntu@musicbud
cd ~/midostore
git pull origin main
pm2 restart midostore
```

### Option 2: Increase VPS Swap Space

```bash
# On VPS - Add 2GB swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify
free -h

# Now try building again
cd ~/midostore
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Option 3: Use Smaller Build

```bash
# On VPS - Disable some optimizations
cd ~/midostore

# Create next.config.js optimization
cat > next.config.mjs << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Reduce memory usage during build
    workerThreads: false,
    cpus: 1
  },
  // Disable source maps in production to save memory
  productionBrowserSourceMaps: false,
};

export default nextConfig;
EOF

# Try building again
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

## 📊 Expected Results

### Successful Build Output

```
✓ Compiled successfully in 2.7min
✓ Collecting page data
✓ Generating static pages (98/98)
✓ Collecting build traces
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         95.3 kB
├ ○ /api/products                        0 B                0 B
└ ○ /products                            3.1 kB         93.2 kB

✅ Production build ready!
```

### After PM2 Start

```
┌────┬────────────┬─────────────┬─────────┬─────────┬──────────┬────────┐
│ id │ name       │ mode        │ ↺       │ status  │ cpu      │ memory │
├────┼────────────┼─────────────┼─────────┼─────────┼──────────┼────────┤
│ 0  │ midostore  │ fork        │ 0       │ online  │ 0%       │ 120mb  │
└────┴────────────┴─────────────┴─────────┴─────────┴──────────┴────────┘
```

## 🐛 Troubleshooting

### Build still fails with OOM

- **Solution**: Use Option 1 (build locally) or Option 2 (add swap)
- VPS might have insufficient RAM (need at least 1GB free)

### MongoDB connection still fails during build

- **Check**: `grep DATABASE_URL ~/midostore/.env`
- **Should show**: `DATABASE_URL=mongodb+srv://...`
- **If missing**: Add it to `.env` file

### Build succeeds but app won't start

```bash
# Check logs
pm2 logs midostore --lines 50

# Common fix: Rebuild Prisma client
cd ~/midostore
npx prisma generate
pm2 restart midostore
```

## 📝 Files Modified

1. ✅ `lib/mongodb.ts` - Fixed to use DATABASE_URL or MONGODB_URI
2. ✅ `scripts/build-production.sh` - Build with memory optimization
3. ✅ `src/lib/mongodb-service.ts` - Already fixed (previous)
4. ✅ `scripts/start-dynamic-services.sh` - Already fixed (previous)

## 🎯 Quick Command Summary

```bash
# Complete deployment (run on VPS):
ssh ubuntu@musicbud << 'ENDSSH'
cd ~/midostore
git pull origin main
export NODE_OPTIONS="--max-old-space-size=4096"
npm install
npx prisma generate
npm run build
pm2 delete all
pm2 start npm --name "midostore" -- start
pm2 save
pm2 logs midostore
ENDSSH
```

## ✅ Success Criteria

1. ✅ Build completes without OOM error
2. ✅ No MongoDB connection errors during build
3. ✅ `.next/` directory created with all files
4. ✅ PM2 shows "online" status
5. ✅ `curl http://localhost:3000` returns HTML

---

**Status**: Ready to deploy with fixes
**Priority**: HIGH - MongoDB connection fix is critical
**Estimated Time**: 10-15 minutes (including build time)

---
**Last Updated**: 2026-02-11 19:37 UTC+2
