import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    LayoutDashboard,
    ArrowLeft,
    User,
    Settings,
    Bell,
    ShoppingCart,
    Package,
    Heart,
    CreditCard
} from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    const dashboardItems = [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, description: 'Main dashboard' },
        { name: 'Enhanced', href: '/enhanced-dashboard', icon: LayoutDashboard, description: 'Advanced dashboard' },
        { name: 'Manager', href: '/manager', icon: User, description: 'Management tools' },
        { name: 'Orders', href: '/orders', icon: Package, description: 'Order management' },
        { name: 'Cart', href: '/cart', icon: ShoppingCart, description: 'Shopping cart' },
        { name: 'Checkout', href: '/checkout', icon: CreditCard, description: 'Payment process' },
        { name: 'Profile', href: '/profile', icon: User, description: 'User profile' },
        { name: 'Register', href: '/register', icon: User, description: 'User registration' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Dashboard Header */}
            <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link href="/">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Home
                                </Button>
                            </Link>
                            <div className="flex items-center space-x-3">
                                <LayoutDashboard className="h-8 w-8 text-blue-600" />
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">User Dashboard</h1>
                                    <p className="text-sm text-gray-600">Manage your account and activities</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                Active User
                            </Badge>
                            <Button variant="outline" size="sm">
                                <Bell className="h-4 w-4 mr-2" />
                                Notifications
                            </Button>
                            <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4 mr-2" />
                                Settings
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Dashboard Navigation */}
                    <div className="lg:col-span-1 space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Access</h2>
                        <div className="space-y-3">
                            {dashboardItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link key={item.name} href={item.href}>
                                        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                                    <Icon className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">{item.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200 p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}