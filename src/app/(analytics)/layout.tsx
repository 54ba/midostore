import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  ArrowLeft,
  TrendingUp,
  Activity,
  PieChart,
  LineChart,
  Target,
  Zap
} from 'lucide-react';

export default function AnalyticsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const analyticsServices = [
    { name: 'Overview', href: '/analytics/overview', icon: BarChart3, description: 'General analytics dashboard' },
    { name: 'Live Sales', href: '/analytics/live-sales', icon: Activity, description: 'Real-time sales tracking' },
    { name: 'Enhanced', href: '/analytics/enhanced', icon: TrendingUp, description: 'Advanced analytics features' },
    { name: 'Recommendations', href: '/analytics/recommendations', icon: Target, description: 'AI-powered insights' },
    { name: 'Location-Based', href: '/analytics/location-based', icon: PieChart, description: 'Geographic analytics' },
    { name: 'Social Trends', href: '/analytics/social-trends', icon: LineChart, description: 'Social media analysis' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {/* Analytics Header */}
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
                <BarChart3 className="h-8 w-8 text-green-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
                  <p className="text-sm text-gray-600">Data-driven insights and business intelligence</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Live Data
              </Badge>
              <Button variant="outline" size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analytics Navigation */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Tools</h2>
            <div className="space-y-3">
              {analyticsServices.map((service) => {
                const Icon = service.icon;
                return (
                  <Link key={service.name} href={service.href}>
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                          <Icon className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
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