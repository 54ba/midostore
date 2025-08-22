import { Suspense } from 'react'
import { ThemeProvider } from '@/app/contexts/ThemeContext'
import { SimpleAuthProvider } from '@/app/contexts/SimpleAuthContext'
import { LocalizationProvider } from '@/app/contexts/LocalizationContext'
import { CartProvider } from '@/app/contexts/CartContext'
import { NavigationProvider } from '@/app/contexts/NavigationContext'
import Header from '@/components/Header'
import LiveSalesTicker from '@/components/LiveSalesTicker'
import PageLoadingSpinner from '@/components/PageLoadingSpinner'
import PageTransitionLoader from '@/components/PageTransitionLoader'
import './globals.css'

export const metadata = {
  title: 'MidoHub - Your Trusted Dropshipping Partner in the Gulf Region',
  description: 'Discover amazing products from Alibaba and AliExpress with AI-powered recommendations, real-time analytics, and comprehensive business intelligence.',
  keywords: 'dropshipping, alibaba, aliexpress, gulf region, UAE, Saudi Arabia, Kuwait, Qatar, Bahrain, Oman, AI recommendations, business analytics',
  authors: [{ name: 'MidoHub Team' }],
  creator: 'MidoHub',
  publisher: 'MidoHub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://midohub.com'),
  openGraph: {
    title: 'MidoHub - Your Trusted Dropshipping Partner',
    description: 'AI-powered dropshipping platform for the Gulf region',
    url: 'https://midohub.com',
    siteName: 'MidoHub',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MidoHub Platform',
      },
    ],
    locale: 'en_AE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MidoHub - Your Trusted Dropshipping Partner',
    description: 'AI-powered dropshipping platform for the Gulf region',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'system';
                  var isDark = false;

                  if (theme === 'system') {
                    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  } else {
                    isDark = theme === 'dark';
                  }

                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="h-full font-sans bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <ThemeProvider>
          <SimpleAuthProvider>
            <LocalizationProvider>
              <CartProvider>
                <NavigationProvider>
                  {/* Page Loading Spinner */}
                  <PageLoadingSpinner />

                  {/* Page Transition Loader */}
                  <PageTransitionLoader />

                  {/* Header Navigation */}
                  <Header />

                  {/* Live Sales Ticker */}
                  <LiveSalesTicker />

                  {/* Main Content */}
                  {children}

                  {/* Analytics Tracker - Wrapped in Suspense */}
                  <Suspense fallback={null}>
                    {/* SimpleAnalyticsTracker */}
                  </Suspense>
                </NavigationProvider>
              </CartProvider>
            </LocalizationProvider>
          </SimpleAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}