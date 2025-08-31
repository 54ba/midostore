import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Megaphone,
    ArrowLeft,
    TrendingUp,
    Target,
    Users,
    BarChart3,
    Zap,
    Gift
} from 'lucide-react';

export default function MarketingLayout({
    children,
}: {
    children: ReactNode;
}) {
    const marketingServices = [
        { name: 'Advertising', href: '/advertising', icon: Megaphone, description: 'Campaign management' },
        { name: 'Bulk Deals', href: '/bulk-deals', icon: Gift, description: 'Volume pricing strategies' },
        { name: 'Social Trends', href: '/social-trends', icon: TrendingUp, description: 'Social media analysis' },
        { name: 'Bulk Pricing', href: '/bulk-pricing', icon: Target, description: 'Dynamic pricing tools' },
        { name: 'Order Batching', href: '/order-batching', icon: BarChart3, description: 'Batch processing' },
        { name: 'Token Rewards', href: '/token-rewards', icon: Zap, description: 'Loyalty programs' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
            {/* Marketing Header */}
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
                                <Megaphone className="h-8 w-8 text-orange-600" />
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Marketing</h1>
                                    <p className="text-sm text-gray-600">Promote, engage, and grow your business</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                Active Campaigns
                            </Badge>
                            <Button variant="outline" size="sm">
                                <Users className="h-4 w-4 mr-2" />
                                Audience
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Marketing Navigation */}
                    <div className="lg:col-span-1 space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Marketing Tools</h2>
                        <div className="space-y-3">
                            {marketingServices.map((service) => {
                                const Icon = service.icon;
                                return (
                                    <Link key={service.name} href={service.href}>
                                        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                                                    <Icon className="h-5 w-5 text-orange-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors">
                                                        {service.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">{service.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200 p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}