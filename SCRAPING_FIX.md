# Scraping Service Fix - Complete Guide

## Issues Identified and Fixed

### 1. ✅ Configuration Error (FIXED)

**Problem**: `TypeError: Cannot read properties of undefined (reading 'includes')`

- `config.scrapingSources` and `config.scrapingCategories` were missing from `env.config.ts`

**Solution**: Added to `env.config.ts`:

```typescript
scrapingSources: ['alibaba', 'aliexpress'],
scrapingCategories: ['electronics', 'clothing', 'home', 'beauty', 'sports'],
```

### 2. ✅ Module Resolution Error (FIXED)

**Problem**: `Error: Cannot find module './lib/product-service'`

- Node.js cannot natively require TypeScript files
- Services were being started with `node -e "require('./lib/...')"` which fails

**Solution**: Updated `start-dynamic-services.sh` to use `npx tsx`:

```bash
npx tsx -e "import { ProductService } from './lib/product-service'; ..."
```

### 3. ⚠️ AI Services Offline (NEEDS API KEYS)

**Problem**: AI agents cannot initialize without API keys

- Missing `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`

**Solution**: Add to `.env`:

```bash
OPENAI_API_KEY=your_openai_key_here
# OR
ANTHROPIC_API_KEY=your_anthropic_key_here
```

## How to Test the Scraping Service

### Option 1: Run Scraping Script Directly

```bash
cd /home/mahmoud/Documents/GitHub/midostore
npx tsx scripts/scrape-products.ts alibaba electronics 1
```

### Option 2: Test via API (if Next.js is running)

```bash
curl http://localhost:3000/api/scraping/start \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"source":"alibaba","category":"electronics","pageCount":1}'
```

### Option 3: Full System Restart

```bash
# Stop all services
pkill -f "node.*midostore"
pkill -f "tsx.*midostore"

# Clean logs
rm -f logs/*.log

# Restart
cd /home/mahmoud/Documents/GitHub/midostore
npm run dev
```

## Expected Output

### Successful Scraping

```
🚀 Starting product scraping...
📊 Scraping alibaba for category: electronics (1 pages)
🌐 Navigating to: https://www.alibaba.com/trade/search?SearchText=electronics&page=1
🔍 Found 20 potential product elements
✅ Extracted: Wireless Bluetooth Headphones...
✅ Extracted: Smart Watch Fitness Tracker...
...
✅ Scraping completed! Found 15 products
```

### If Configuration Missing

```
❌ Invalid source: xyz. Must be one of: alibaba, aliexpress
```

## Deployment to VPS

### On Your OCI VPS (ubuntu@musicbud)

1. **Pull Latest Changes**:

```bash
cd ~/midostore
git pull origin main
```

1. **Install Dependencies** (if needed):

```bash
npm install
```

1. **Update Environment**:

```bash
nano .env
# Add/verify:
# - DATABASE_URL (MongoDB connection)
# - OPENAI_API_KEY or ANTHROPIC_API_KEY (for AI services)
```

1. **Restart Services**:

```bash
# Stop existing
pm2 stop all
pm2 delete all

# Start fresh
npm run build
pm2 start npm --name "midostore" -- start
pm2 save
```

1. **Monitor Logs**:

```bash
pm2 logs midostore
# OR
tail -f logs/scraping-service.log
tail -f logs/product-service.log
```

## Service Architecture

### Current Service Stack

- **Next.js Server** (Port 3000): Main application
- **AI Orchestrator**: Monitors all services, makes decisions
- **Product Service**: Handles product CRUD operations
- **Scraping Service**: Scrapes Alibaba/AliExpress
- **AI Agents**: Recommendations, location, scraping assistance

### Service Dependencies

```
Next.js (3000)
  ├── AI Orchestrator (monitors all)
  ├── Product Service (lib/product-service.ts)
  ├── Scraping Service (lib/scraping-service.ts)
  └── AI Agents (requires API keys)
```

## Troubleshooting

### Issue: "Cannot find module"

**Cause**: TypeScript files being required by Node.js
**Fix**: Use `npx tsx` instead of `node`

### Issue: "config.scrapingSources is undefined"

**Cause**: Missing configuration in env.config.ts
**Fix**: Already added - restart services

### Issue: "AI model not available"

**Cause**: Missing API keys
**Fix**: Add OPENAI_API_KEY or ANTHROPIC_API_KEY to .env

### Issue: Services keep restarting

**Cause**: AI Orchestrator detecting failures and triggering recovery
**Fix**:

1. Check logs: `tail -f logs/*.log`
2. Ensure MongoDB is accessible
3. Verify all environment variables

## Next Steps

1. ✅ Configuration fixed
2. ✅ Module resolution fixed
3. ⏳ Test scraping locally
4. ⏳ Add AI API keys (optional but recommended)
5. ⏳ Deploy to VPS
6. ⏳ Verify products appear in database

## Quick Commands Reference

```bash
# Test scraping
npx tsx scripts/scrape-products.ts alibaba electronics 1

# Check database
npx tsx -e "import { prisma } from './lib/db'; prisma.product.count().then(c => console.log('Products:', c))"

# View logs
tail -f logs/scraping-service.log

# Restart Next.js
npm run dev
```

---
**Status**: Ready for testing
**Last Updated**: 2026-02-10
