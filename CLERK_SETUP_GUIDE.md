# Clerk Authentication Setup Guide for MidoStore

## Overview
This guide will help you set up Clerk authentication for your MidoStore application to resolve the "Access Denied" and authentication issues.

## Prerequisites
1. A Clerk account at [https://clerk.com/](https://clerk.com/)
2. A Netlify account for deployment
3. Access to your MidoStore project

## Step 1: Create a Clerk Application

1. Go to [https://clerk.com/](https://clerk.com/) and sign up/sign in
2. Click "Add Application"
3. Choose "Web Application"
4. Name your application (e.g., "MidoStore")
5. Select your preferred authentication methods (Email, Google, etc.)

## Step 2: Get Your Clerk Keys

1. In your Clerk dashboard, go to "API Keys"
2. Copy the following keys:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

## Step 3: Configure Environment Variables

### Option A: Local Development (.env.local)
Create a `.env.local` file in your project root with:

```bash
# Clerk Authentication Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
CLERK_SECRET_KEY=sk_test_your_actual_key_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Netlify Configuration
NEXT_PUBLIC_NETLIFY_SITE_URL=https://midostore.netlify.app
NEXT_PUBLIC_APP_URL=https://midostore.netlify.app
```

### Option B: Netlify Environment Variables
1. Go to your Netlify dashboard
2. Navigate to Site settings > Environment variables
3. Add the same variables as above

## Step 4: Configure Clerk Application Settings

1. In your Clerk dashboard, go to "User & Authentication"
2. Set the following URLs:
   - **Sign-in URL**: `https://midostore.netlify.app/sign-in`
   - **Sign-up URL**: `https://midostore.netlify.app/sign-up`
   - **After sign-in URL**: `https://midostore.netlify.app/dashboard`
   - **After sign-up URL**: `https://midostore.netlify.app/dashboard`

## Step 5: Test the Setup

1. Restart your development server
2. Navigate to `/sign-in` - you should see the Clerk sign-in form
3. Create a test account
4. Try accessing `/dashboard` - you should be redirected to sign-in if not authenticated
5. After signing in, you should be able to access the dashboard

## Troubleshooting

### Common Issues

1. **"Clerk is not configured" error**
   - Check that your environment variables are set correctly
   - Ensure the `.env.local` file is in the project root
   - Restart your development server

2. **"Access Denied" when trying to access dashboard**
   - Verify that Clerk is properly configured
   - Check that the user is authenticated
   - Ensure the Clerk keys are valid

3. **404 errors on sign-in/sign-up routes**
   - Verify that the Clerk component is properly imported
   - Check that the routes are correctly configured in your Next.js app

4. **Clerk development keys warning**
   - This is normal in development
   - For production, use live keys from Clerk

### Environment Variable Checklist

- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
- [ ] `CLERK_SECRET_KEY` is set
- [ ] Clerk URLs are configured correctly
- [ ] Netlify environment variables are set (if deploying)

## Security Notes

1. **Never commit `.env.local` to version control**
2. **Use test keys for development, live keys for production**
3. **Keep your secret key secure and private**
4. **Regularly rotate your API keys**

## Next Steps

After setting up Clerk:
1. Test the authentication flow
2. Customize the Clerk appearance if needed
3. Set up additional authentication methods
4. Configure user roles and permissions
5. Deploy to production with live keys

## Support

If you encounter issues:
1. Check the [Clerk documentation](https://clerk.com/docs)
2. Verify your environment variables
3. Check the browser console for errors
4. Ensure your Clerk application is properly configured