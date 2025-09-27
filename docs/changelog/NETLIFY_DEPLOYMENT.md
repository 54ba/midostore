# Netlify Deployment Guide

## Overview
This guide will help you deploy your Next.js application to Netlify and resolve the 404 errors you're experiencing.

## Issues Fixed
1. ✅ Removed `output: "standalone"` from `next.config.ts` (Electron-specific)
2. ✅ Added `netlify.toml` for proper routing configuration
3. ✅ Added environment variables configuration guide

## Step-by-Step Deployment

### 1. Commit and Push Changes
```bash
git add .
git commit -m "Configure for Netlify deployment"
git push origin main
```

### 2. Connect to Netlify
1. Go to [Netlify](https://netlify.com) and sign in
2. Click "New site from Git"
3. Connect your GitHub/GitLab repository
4. Select the repository containing this project

### 3. Configure Build Settings
Use these exact settings:
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 18 (or higher)

### 4. Set Environment Variables
In your Netlify dashboard, go to Site settings > Environment variables and add:

#### Required Variables:
```
STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key
NEXT_PUBLIC_BASE_URL=https://your-app-name.netlify.app
```

#### Optional Variables:
```
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 5. Deploy
1. Click "Deploy site"
2. Wait for the build to complete
3. Your site will be available at the provided Netlify URL

## Troubleshooting

### If you still get 404 errors:

1. **Check build logs** in Netlify dashboard
2. **Verify environment variables** are set correctly
3. **Clear Netlify cache** and redeploy
4. **Check that the build completed successfully**

### Common Issues:

- **Build fails**: Check Node.js version compatibility
- **Environment variables not working**: Ensure they're set in Netlify dashboard
- **Routing issues**: Verify `netlify.toml` is in your repository root

## File Structure After Deployment
```
your-project/
├── netlify.toml          # Netlify configuration
├── next.config.ts        # Next.js config (standalone removed)
├── package.json          # Build scripts updated
├── env.example           # Environment variables template
└── src/                  # Your application code
```

## Testing Your Deployment
1. Visit your Netlify URL
2. Test navigation between pages
3. Verify API endpoints work
4. Check that Stripe integration functions properly

## Support
If you continue to experience issues:
1. Check Netlify build logs
2. Verify all environment variables are set
3. Ensure your repository is properly connected
4. Check that the build completes without errors

## Notes
- This configuration is specifically for web deployment on Netlify
- For Electron desktop app builds, use `npm run electron:build`
- The `output: "standalone"` setting is only needed for Electron builds