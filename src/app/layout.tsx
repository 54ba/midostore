import type { Metadata, Viewport } from 'next'
import './globals.css'
import Script from 'next/script'
import { Suspense } from 'react'
import NavigationLogger from '@/components/NavigationLogger'
import { AuthProvider } from '@/app/contexts/AuthContext'
import { CartProvider } from '@/app/contexts/CartContext'
import LiveSalesTicker from '@/components/LiveSalesTicker'
import { LocalizationProvider } from '@/app/contexts/LocalizationContext'
import ClerkProviderWrapper from '@/components/ClerkProviderWrapper'
import ClerkAuthWrapper from '@/components/ClerkAuthWrapper'
import SimpleAnalyticsTracker from '@/components/SimpleAnalyticsTracker'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'MidoHub - Premium Dropshipping Platform',
  description: 'Connect to affordable toys and cosmetics from Alibaba with MidoHub. Your trusted dropshipping partner in the Gulf region.',
  keywords: 'dropshipping, toys, cosmetics, alibaba, gulf, middleeast, affordable products',
  authors: [{ name: 'MidoHub' }],
  robots: 'index, follow',
  openGraph: {
    title: 'MidoHub - Premium Dropshipping Platform',
    description: 'Connect to affordable toys and cosmetics from Alibaba with MidoHub',
    type: 'website',
    locale: 'en_US',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  // Check if Clerk is properly configured
  const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'your_clerk_publishable_key_here' &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'pk_test_your_clerk_publishable_key_here' &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'pk_test_your_actual_publishable_key_here';

  const content = (
    <>
      <Suspense fallback={null}>
        <NavigationLogger />
      </Suspense>

      {/* Live Sales Ticker */}
      <Suspense fallback={null}>
        <LiveSalesTicker />
      </Suspense>

      <LocalizationProvider>
        <AuthProvider>
          <CartProvider>
            {isClerkConfigured ? (
              <ClerkAuthWrapper>
                {children}
              </ClerkAuthWrapper>
            ) : (
              // Keyless mode - render children directly
              children
            )}
          </CartProvider>
        </AuthProvider>
      </LocalizationProvider>

      {/* SimpleAnalytics Tracker */}
      <Suspense fallback={null}>
        <SimpleAnalyticsTracker
          domain={process.env.NEXT_PUBLIC_SIMPLEANALYTICS_DOMAIN}
          autoTrack={true}
          respectDnt={true}
          customEvents={true}
        />
      </Suspense>

      {/* Removed Edit Elements Service scripts */}
      {/*
      <Script id="edit-config" strategy="beforeInteractive" dangerouslySetInnerHTML={{
        __html: `
        window.APP_ID = "f0d77951-6589-4855-889a-e574b12631d5";
        window.EDIT_CALLBACK_URL = "/api/edit-webhook";
        window.EDIT_TOKEN = "4bd1e072-750b-43b6-a116-3f94dc658e65:1755685474917";
        window.TASK_UUID = "f0d77951-6589-4855-889a-e574b12631d5";
        window.EDIT_BASE_URL = "https://api.internal.tasker.ai";
      `,
      }} />
      <Script src="https://cdn.tasker.ai/EditModeLoader.js" strategy="afterInteractive" />
      */}
    </>
  )

  return (
    <html lang="en" className="h-full">
      <body className="h-full font-sans">
        {isClerkConfigured ? (
          <ClerkProviderWrapper>
            {content}
          </ClerkProviderWrapper>
        ) : (
          // Keyless mode - render content directly
          content
        )}
      </body>
    </html>
  )
}