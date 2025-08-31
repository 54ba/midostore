import React from 'react'
import IntegrationPackages from '@/components/IntegrationPackages'
import IntegrationSetupWizard from '@/components/IntegrationSetupWizard'
import PackageManagerDashboard from '@/components/PackageManagerDashboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function IntegrationsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        MidoStore Integrations Hub
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Transform your business with our comprehensive suite of integrations.
                        From payments to social media, crypto to analytics - everything you need in one place.
                    </p>
                </div>

                {/* Main Tabs */}
                <Tabs defaultValue="packages" className="space-y-8">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="packages">Browse Packages</TabsTrigger>
                        <TabsTrigger value="setup">Setup Wizard</TabsTrigger>
                        <TabsTrigger value="manage">Manage Packages</TabsTrigger>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                    </TabsList>

                    {/* Browse Packages Tab */}
                    <TabsContent value="packages">
                        <IntegrationPackages />
                    </TabsContent>

                    {/* Setup Wizard Tab */}
                    <TabsContent value="setup">
                        <IntegrationSetupWizard />
                    </TabsContent>

                    {/* Manage Packages Tab */}
                    <TabsContent value="manage">
                        <PackageManagerDashboard />
                    </TabsContent>

                    {/* Overview Tab */}
                    <TabsContent value="overview">
                        <div className="space-y-8">
                            {/* Integration Categories */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl">💳</span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">Payments & Finance</h3>
                                        <p className="text-gray-600 mb-4">
                                            Multi-currency payment processing, crypto payments, and financial tools
                                        </p>
                                        <div className="text-sm text-gray-500">
                                            <div>• Payment Gateway Pro</div>
                                            <div>• Currency Exchange Pro</div>
                                            <div>• Crypto Suite Complete</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl">📱</span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">Social Media & Marketing</h3>
                                        <p className="text-gray-600 mb-4">
                                            Social media management, advertising campaigns, and content automation
                                        </p>
                                        <div className="text-sm text-gray-500">
                                            <div>• Social Media Pro</div>
                                            <div>• Campaign Manager Pro</div>
                                            <div>• P2P Marketplace</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl">🔐</span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">Security & Authentication</h3>
                                        <p className="text-gray-600 mb-4">
                                            Multi-provider OAuth, two-factor authentication, and security tools
                                        </p>
                                        <div className="text-sm text-gray-500">
                                            <div>• OAuth Master</div>
                                            <div>• Security Suite</div>
                                            <div>• Access Control</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl">🎁</span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">Rewards & Loyalty</h3>
                                        <p className="text-gray-600 mb-4">
                                            Token mining, loyalty programs, and customer engagement tools
                                        </p>
                                        <div className="text-sm text-gray-500">
                                            <div>• Token Rewards System</div>
                                            <div>• Loyalty Pro</div>
                                            <div>• Engagement Suite</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl">📊</span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">Analytics & Insights</h3>
                                        <p className="text-gray-600 mb-4">
                                            Business intelligence, performance tracking, and data visualization
                                        </p>
                                        <div className="text-sm text-gray-500">
                                            <div>• Analytics Pro</div>
                                            <div>• Business Intelligence</div>
                                            <div>• Performance Tracker</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl">🚀</span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">Automation & Workflows</h3>
                                        <p className="text-gray-600 mb-4">
                                            Process automation, workflow management, and business process tools
                                        </p>
                                        <div className="text-sm text-gray-500">
                                            <div>• Workflow Pro</div>
                                            <div>• Automation Suite</div>
                                            <div>• Process Manager</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Key Benefits */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8">
                                <h2 className="text-2xl font-bold text-center mb-8">
                                    Why Choose MidoStore Integrations?
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-xl">⚡</span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">Lightning Fast Setup</h3>
                                        <p className="text-blue-100">
                                            Most integrations install and configure in under 15 minutes
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-xl">🛡️</span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">Enterprise Security</h3>
                                        <p className="text-blue-100">
                                            Bank-level security with 99.9% uptime guarantee
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-xl">📈</span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">Scalable Growth</h3>
                                        <p className="text-blue-100">
                                            All packages scale with your business needs
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Getting Started */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                                <h2 className="text-2xl font-bold text-center mb-8">
                                    Getting Started with Integrations
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl font-bold text-blue-600">1</span>
                                        </div>
                                        <h3 className="font-semibold mb-2">Browse Packages</h3>
                                        <p className="text-sm text-gray-600">
                                            Explore our comprehensive collection of integration packages
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl font-bold text-green-600">2</span>
                                        </div>
                                        <h3 className="font-semibold mb-2">Choose & Install</h3>
                                        <p className="text-sm text-gray-600">
                                            Select the packages you need and install with one click
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl font-bold text-yellow-600">3</span>
                                        </div>
                                        <h3 className="font-semibold mb-2">Configure</h3>
                                        <p className="text-sm text-gray-600">
                                            Use our setup wizard to configure your integrations
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl font-bold text-purple-600">4</span>
                                        </div>
                                        <h3 className="font-semibold mb-2">Start Using</h3>
                                        <p className="text-sm text-gray-600">
                                            Your integrations are ready to use immediately
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}