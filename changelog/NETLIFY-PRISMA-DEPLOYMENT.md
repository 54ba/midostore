# Netlify + Prisma Deployment Guide

This guide will help you deploy your Alibaba/AliExpress scraping application to Netlify with Prisma database integration.

## 🚀 Prerequisites

- Netlify account
- PostgreSQL database (can be hosted on Supabase, Railway, or any PostgreSQL provider)
- Clerk account for authentication

## 📋 Step-by-Step Deployment

### 1. Database Setup

#### Option A: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your database connection string from Settings > Database
3. Copy the connection string for the next step

#### Option B: Railway
1. Go to [railway.app](https://railway.app) and create a new project
2. Add a PostgreSQL service
3. Get your connection string from the Connect tab

#### Option C: Local PostgreSQL
- Ensure your local PostgreSQL is accessible from the internet
- Use your public IP and port forwarding

### 2. Netlify Project Setup

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select the `midostore` repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18`
   - NPM version: `9`

### 3. Environment Variables

In your Netlify dashboard, go to **Site settings > Environment variables** and add:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database_name

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here

# Exchange Rate API
EXCHANGE_RATE_API_KEY=your_api_key_here

# Build Configuration
NODE_VERSION=18
NPM_VERSION=9
```

### 4. Install Netlify Prisma Plugin

1. Go to **Site settings > Build & deploy > Build plugins**
2. Click "Add build plugin"
3. Search for `@netlify/plugin-prisma`
4. Install the plugin

### 5. Plugin Configuration

The plugin will automatically detect your Prisma configuration. Ensure your `netlify.toml` has:

```toml
[[plugins]]
  package = "@netlify/plugin-prisma"
```

### 6. Deploy

1. **Trigger Deployment**
   - Push changes to your main branch, or
   - Click "Trigger deploy" in Netlify dashboard

2. **Monitor Build**
   - Watch the build logs for any Prisma-related errors
   - The plugin will automatically:
     - Generate Prisma client
     - Run migrations
     - Seed the database

## 🔧 Configuration Files

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = ".next"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[functions]
  node_bundler = "esbuild"
  external_node_modules = ["@prisma/client"]

[[plugins]]
  package = "@netlify/plugin-prisma"
```

### .netlify/plugins.json
```json
{
  "plugins": [
    {
      "package": "@netlify/plugin-prisma",
      "config": {
        "prismaVersion": "5.0.0",
        "generateCommand": "npm run db:generate",
        "migrateCommand": "npm run db:migrate",
        "seedCommand": "npm run db:seed"
      }
    }
  ]
}
```

## 🗄️ Database Management

### Running Migrations
```bash
# Local development
npm run db:migrate

# On Netlify (automatic via plugin)
# The plugin runs migrations during build
```

### Database Seeding
```bash
# Local development
npm run db:seed

# On Netlify (automatic via plugin)
# The plugin runs seeding after migrations
```

### Prisma Studio
```bash
# Local development only
npm run db:studio
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Prisma Client Generation Fails
```bash
# Check your DATABASE_URL
# Ensure the database is accessible
# Verify Prisma schema is valid
```

#### 2. Migration Errors
```bash
# Check database permissions
# Verify DATABASE_URL format
# Check for conflicting migrations
```

#### 3. Build Timeout
```bash
# Increase build timeout in Netlify
# Optimize Prisma queries
# Use connection pooling
```

### Debug Commands

```bash
# Check Prisma status
npx prisma status

# Validate schema
npx prisma validate

# Generate client
npx prisma generate

# Push schema changes
npx prisma db push
```

## 📊 Monitoring

### Build Logs
- Check Netlify build logs for Prisma operations
- Look for migration and seeding success messages
- Monitor for any database connection errors

### Database Health
- Use Prisma Studio to inspect data
- Monitor database connection pool
- Check for any failed queries

## 🔒 Security Considerations

### Environment Variables
- Never commit sensitive data to Git
- Use Netlify's environment variable encryption
- Rotate database credentials regularly

### Database Access
- Use connection pooling for production
- Implement proper database user permissions
- Consider using read replicas for scaling

### API Security
- Implement rate limiting on scraping endpoints
- Use authentication for admin functions
- Monitor for abuse patterns

## 🚀 Performance Optimization

### Database
- Use database indexes for common queries
- Implement connection pooling
- Consider read replicas for heavy queries

### Build Process
- Cache Prisma client generation
- Optimize migration scripts
- Use incremental seeding

### Functions
- Implement proper error handling
- Use connection pooling in functions
- Monitor function execution time

## 📈 Scaling

### Database Scaling
- Use connection pooling
- Implement read replicas
- Consider database sharding for large datasets

### Function Scaling
- Monitor function execution time
- Implement proper error handling
- Use background jobs for heavy operations

### CDN Optimization
- Leverage Netlify's edge network
- Implement proper caching headers
- Use image optimization

## 🔄 Continuous Deployment

### Automatic Deployments
- Connect to Git repository
- Set up branch deployments
- Configure preview deployments

### Environment Management
- Use different databases for different environments
- Implement proper environment variable management
- Test migrations in preview environments

## 📞 Support

### Netlify Support
- [Netlify Documentation](https://docs.netlify.com)
- [Netlify Community](https://community.netlify.com)
- [Netlify Support](https://www.netlify.com/support/)

### Prisma Support
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Community](https://community.prisma.io)
- [Prisma GitHub](https://github.com/prisma/prisma)

### Plugin Support
- [Netlify Prisma Plugin](https://github.com/netlify/plugin-prisma)
- [Plugin Issues](https://github.com/netlify/plugin-prisma/issues)

---

**Happy Deploying! 🎉**