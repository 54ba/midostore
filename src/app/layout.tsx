import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MidoStore - Multi-Seller Dropshipping Platform',
  description: 'Build your dropshipping empire with our advanced multi-seller platform. Source products, set margins, and scale your business.',
  keywords: 'dropshipping, multi-seller, ecommerce, marketplace, business, entrepreneurship',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <WishlistProvider>
            <Navigation />
            <main>
              {children}
            </main>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}