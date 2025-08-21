# Clerk Authentication Setup Guide for MidoHub

This guide will help you set up Clerk authentication for your MidoHub application.

## Step 1: Create a Clerk Account

1. Go to [clerk.com](https://clerk.com) and sign up for a free account
2. Create a new application
3. Choose "Next.js" as your framework
4. Select "App Router" as your Next.js version

## Step 2: Get Your API Keys

1. In your Clerk dashboard, go to "API Keys"
2. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)
3. Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`)

## Step 3: Update Environment Variables

Create or update your `.env.local` file with the following:

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

## Step 4: Install Clerk Dependencies

Make sure you have the Clerk Next.js package installed:

```bash
npm install @clerk/nextjs
```

## Step 5: Configure Clerk in Your App

The application is already configured to use Clerk. The key components are:

- `ClerkProviderWrapper` - Wraps your app with Clerk context
- `ClerkAuthWrapper` - Handles authentication state
- `AuthContext` - Provides authentication context throughout the app

## Step 6: Test Authentication

1. Restart your development server
2. Navigate to `/sign-in` or `/sign-up`
3. You should see the Clerk authentication forms
4. Test creating an account and signing in

## Step 7: Customize Authentication (Optional)

You can customize the Clerk appearance and behavior in the `ClerkProviderWrapper` component:

```tsx
<ClerkProvider
  publishableKey={publishableKey}
  signInUrl="/sign-in"
  signUpUrl="/sign-up"
  afterSignInUrl="/dashboard"
  afterSignUpUrl="/dashboard"
  appearance={{
    elements: {
      formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
      card: 'shadow-lg',
      headerTitle: 'text-gray-900',
      headerSubtitle: 'text-gray-600',
    }
  }}
>
  {children}
</ClerkProvider>
```

## Troubleshooting

### Common Issues:

1. **"Clerk is not configured" warning**
   - Check that your environment variables are set correctly
   - Make sure you're using the correct publishable key format

2. **Authentication forms not showing**
   - Verify your Clerk application is active
   - Check browser console for errors
   - Ensure environment variables are loaded

3. **Redirect issues**
   - Verify the sign-in/sign-up URLs are correct
   - Check that the after-sign-in/after-sign-up URLs exist

### Environment Variable Check:

You can verify your environment variables are loaded by checking the browser console. Look for:
- Clerk configuration warnings
- Environment variable values (in development)

## Security Notes

- Never commit your `.env.local` file to version control
- Use environment variables for all sensitive configuration
- Clerk handles password hashing and security automatically
- The secret key should only be used on the server side

## Next Steps

Once Clerk is configured:

1. Users can sign up and sign in
2. Authentication state is managed automatically
3. Protected routes will work properly
4. User data is available throughout the application

## Support

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Community](https://community.clerk.com)
- [Clerk Support](https://clerk.com/support)