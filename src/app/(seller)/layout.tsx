import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Store,
  BarChart3,
  Package,
  Settings,
  User,
  Home,
  TrendingUp,
  Users,
  ShoppingCart
} from 'lucide-react';

export default function SellerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const navigation = [
    { name: 'Dashboard', href: '/seller/dashboard', icon: Home },
    { name: 'Products', href: '/seller/products', icon: Package },
    { name: 'Analytics', href: '/seller/analytics', icon: BarChart3 },
    { name: 'Orders', href: '/seller/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/seller/customers', icon: Users },
    { name: 'Marketing', href: '/seller/marketing', icon: TrendingUp },
    { name: 'Settings', href: '/seller/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Seller Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Store className="h-5 w-5 mr-2" />
                  MidoStore
                </Button>
              </Link>
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-gray-900">Seller Portal</h1>
                <p className="text-sm text-gray-600">Manage your dropshipping business</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Active Seller
              </Badge>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                      <Icon className="h-5 w-5 mr-3 text-gray-400" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}