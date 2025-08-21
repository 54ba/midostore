# MidoHub Clerk Keyless Mode Setup

This guide explains how to use MidoHub without Clerk authentication (keyless mode) and how to enable Clerk authentication when you're ready.

## 🚀 Quick Start - Keyless Mode

MidoHub is now configured to work **without Clerk authentication** by default. This means:

- ✅ All pages load without authentication errors
- ✅ Products API works without requiring login
- ✅ Dashboard and other features are accessible
- ✅ No authentication popups or redirects
- ✅ Perfect for development and testing

### What Works in Keyless Mode

1. **Main Landing Page** (`/`) - Fully functional
2. **Products Page** (`/products`) - Browse and search products
3. **Dashboard** (`/dashboard`) - Access dashboard features
4. **API Endpoints** - All product APIs work without auth
5. **Navigation** - Smooth navigation between pages
6. **Responsive Design** - Works on all devices

### Testing Keyless Mode

Run the test script to verify everything works:

```bash
# Make sure you're in the project directory
cd /path/to/midostore

# Run the test script
./scripts/test-keyless-mode.sh
```

This will test all major endpoints and confirm they return 200 status codes.

## 🔐 Enabling Clerk Authentication

When you're ready to add user authentication, follow these steps:

### Step 1: Get Clerk API Keys

1. Go to [clerk.com](https://clerk.com) and sign up
2. Create a new application
3. Choose "Next.js" as your framework
4. Select "App Router" as your Next.js version
5. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)
6. Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`)

### Step 2: Update Environment Variables

Create or update your `.env.local` file:

```bash
# Clerk Authentication Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Other configurations...
NEXT_PUBLIC_NETLIFY_SITE_URL=https://midostore.netlify.app
```

### Step 3: Restart Development Server

```bash
# Stop your current server (Ctrl+C)
# Then restart
npm run dev
```

### Step 4: Verify Authentication

1. Navigate to `/sign-up` to create an account
2. Navigate to `/sign-in` to sign in
3. Check that protected routes now require authentication
4. Verify user data is available in the dashboard

## 🔄 Switching Between Modes

### From Keyless to Clerk Mode

1. Set the environment variables as shown above
2. Restart your development server
3. Clerk components will automatically activate
4. Authentication will be required for protected routes

### From Clerk to Keyless Mode

1. Remove or comment out Clerk environment variables
2. Restart your development server
3. All pages will work without authentication
4. No login required for any features

## 🧪 Testing Both Modes

### Test Keyless Mode

```bash
# Ensure no Clerk keys are set
unset NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
unset CLERK_SECRET_KEY

# Run tests
./scripts/test-keyless-mode.sh
```

### Test Clerk Mode

```bash
# Set Clerk keys
export NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_key"
export CLERK_SECRET_KEY="sk_test_your_key"

# Run tests
./scripts/test-keyless-mode.sh
```

## 🏗️ Architecture

### Keyless Mode Components

- **Layout**: Conditionally renders Clerk components
- **AuthContext**: Provides fallback authentication state
- **API Routes**: Work without authentication checks
- **Pages**: All accessible without login

### Clerk Mode Components

- **ClerkProvider**: Wraps the entire application
- **ClerkAuthWrapper**: Handles authentication state
- **Protected Routes**: Require user authentication
- **User Management**: Full user profile and session handling

## 🚨 Troubleshooting

### Common Issues

1. **"Clerk is not configured" warning**
   - This is normal in keyless mode
   - Ignore this warning when not using Clerk

2. **Authentication errors in API**
   - Check if Clerk is properly configured
   - Verify environment variables are set correctly

3. **Pages not loading**
   - Ensure development server is running
   - Check browser console for errors
   - Verify all dependencies are installed

### Environment Variable Issues

```bash
# Check if environment variables are loaded
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
echo $CLERK_SECRET_KEY

# If empty, they're not set properly
```

### Development Server Issues

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

## 📱 Features Available in Both Modes

### Core Features
- ✅ Product browsing and search
- ✅ Category filtering
- ✅ Responsive design
- ✅ Navigation between pages
- ✅ API endpoints

### Keyless Mode Only
- ✅ No authentication required
- ✅ Instant access to all features
- ✅ Perfect for demos and testing
- ✅ No user management overhead

### Clerk Mode Only
- ✅ User registration and login
- ✅ Protected routes
- ✅ User profiles and settings
- ✅ Session management
- ✅ User-specific data

## 🔧 Configuration Files

### Key Files Modified

1. **`src/app/layout.tsx`** - Conditional Clerk rendering
2. **`src/components/ClerkProviderWrapper.tsx`** - Keyless mode support
3. **`src/components/ClerkAuthWrapper.tsx`** - Fallback authentication
4. **`src/app/contexts/AuthContext.tsx`** - Dual mode support
5. **`src/app/api/products/route.ts`** - Conditional authentication
6. **`env.config.ts`** - Environment validation

### Environment Files

- **`.env.local`** - Local development (not in git)
- **`env.example`** - Example configuration
- **`netlify.env`** - Netlify deployment
- **`env.config.ts`** - TypeScript configuration

## 🚀 Deployment

### Netlify Deployment

1. Set environment variables in Netlify dashboard
2. Deploy using the provided scripts
3. Clerk will work automatically if keys are set

### Local Development

```bash
# Keyless mode (default)
npm run dev

# With Clerk (if keys are set)
npm run dev
```

## 📚 Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [MidoHub Setup Guide](CLERK_SETUP_GUIDE.md)
- [Netlify Deployment](NETLIFY_DEPLOYMENT.md)

## 🤝 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify environment variables are set correctly
3. Check browser console for error messages
4. Run the test script to identify specific problems
5. Review the component files for configuration issues

---

**MidoHub is now fully functional in both keyless and Clerk authentication modes! 🎉**