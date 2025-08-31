import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Brain,
    ArrowLeft,
    Zap,
    BarChart3,
    Bot,
    TrendingUp,
    Sparkles
} from 'lucide-react';

export default function AIServicesLayout({
    children,
}: {
    children: ReactNode;
}) {
    const aiServices = [
        { name: 'AI Agents', href: '/ai-agents', icon: Bot, description: 'Intelligent automation' },
        { name: 'AI Orchestrator', href: '/ai-orchestrator', icon: Brain, description: 'Central AI management' },
        { name: 'AI Scraping', href: '/ai-powered-scraping', icon: Zap, description: 'Smart data extraction' },
        { name: 'AI Recommendations', href: '/ai-recommendations', icon: TrendingUp, description: 'Personalized suggestions' },
        { name: 'AI Integration Test', href: '/ai-integration-test', icon: Sparkles, description: 'Testing & validation' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
            {/* AI Services Header */}
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
                                <Brain className="h-8 w-8 text-purple-600" />
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">AI Services</h1>
                                    <p className="text-sm text-gray-600">Powered by advanced artificial intelligence</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                AI-Powered
                            </Badge>
                            <Button variant="outline" size="sm">
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Analytics
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* AI Services Navigation */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available AI Services</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {aiServices.map((service) => {
                                const Icon = service.icon;
                                return (
                                    <Link key={service.name} href={service.href}>
                                        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                                    <Icon className="h-5 w-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
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
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200 p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}