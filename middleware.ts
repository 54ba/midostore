import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/',
    '/products(.*)',
    '/contact',
    '/cart',
    '/api/webhooks/(.*)',
    '/api/products',
    '/api/exchange-rates',
    '/api/recommendations',
    '/api/scraping/(.*)',
    '/ai-recommendations(.*)',
])

// Define routes that require authentication
const isProtectedRoute = createRouteMatcher([
    '/checkout',
    '/orders(.*)',
    '/dashboard(.*)',
    '/profile(.*)',
    '/user-profile(.*)',
    '/scraping(.*)',
])

export default clerkMiddleware(async (auth, req) => {
    // Only protect specific routes that require authentication
    if (isProtectedRoute(req)) {
        await auth.protect()
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}