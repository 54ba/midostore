'use client'

import React, { useState } from 'react'
import {
    CreditCard,
    Bitcoin,
    DollarSign,
    Globe,
    Shield,
    Zap,
    Users,
    BarChart3,
    Camera,
    MessageCircle,
    Share2,
    Lock,
    CheckCircle,
    Star,
    Download,
    ExternalLink,
    Settings,
    Key,
    Wallet,
    TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface IntegrationPackage {
    id: string
    name: string
    description: string
    category: string
    features: string[]
    price: number
    currency: string
    isPopular?: boolean
    isRecommended?: boolean
    setupTime: string
    difficulty: 'EASY' | 'MEDIUM' | 'HARD'
    icon: React.ReactNode
    status: 'ACTIVE' | 'COMING_SOON' | 'BETA'
}

const integrationPackages: IntegrationPackage[] = [
    {
        id: 'payment-gateway',
        name: 'Payment Gateway Pro',
        description: 'Complete payment processing with multi-currency support',
        category: 'Payments',
        features: [
            'Credit/Debit Cards',
            'Cryptocurrency Payments',
            'Multi-Currency Support',
            'Bybit Integration',
            'Stripe Integration',
            'PayPal Support',
            'Apple Pay & Google Pay',
            'Fraud Protection',
            'Real-time Exchange Rates',
            'Automated Refunds'
        ],
        price: 29.99,
        currency: 'USD',
        isPopular: true,
        setupTime: '5 minutes',
        difficulty: 'EASY',
        icon: <CreditCard className="w-8 h-8" />,
        status: 'ACTIVE'
    },
    {
        id: 'crypto-suite',
        name: 'Crypto Suite Complete',
        description: 'Full cryptocurrency integration and wallet management',
        category: 'Cryptocurrency',
        features: [
            'Multi-Crypto Support',
            'Wallet Integration',
            'Token Mining',
            'DeFi Features',
            'NFT Support',
            'Staking Rewards',
            'Liquidity Mining',
            'Cross-Chain Swaps',
            'Crypto Analytics',
            'Tax Reporting'
        ],
        price: 49.99,
        currency: 'USD',
        isRecommended: true,
        setupTime: '10 minutes',
        difficulty: 'MEDIUM',
        icon: <Bitcoin className="w-8 h-8" />,
        status: 'ACTIVE'
    },
    {
        id: 'social-media-pro',
        name: 'Social Media Pro',
        description: 'Complete social media management and automation',
        category: 'Social Media',
        features: [
            'Multi-Platform Management',
            'Content Scheduling',
            'Analytics Dashboard',
            'P2P Trading',
            'Role Management',
            'Campaign Automation',
            'Influencer Tools',
            'Content Creation',
            'Engagement Tracking',
            'ROI Analytics'
        ],
        price: 39.99,
        currency: 'USD',
        isPopular: true,
        setupTime: '15 minutes',
        difficulty: 'MEDIUM',
        icon: <Share2 className="w-8 h-8" />,
        status: 'ACTIVE'
    },
    {
        id: 'oauth-master',
        name: 'OAuth Master',
        description: 'Secure authentication with multiple providers',
        category: 'Authentication',
        features: [
            'Google OAuth',
            'Facebook Login',
            'Apple Sign-In',
            'Twitter OAuth',
            'LinkedIn OAuth',
            'GitHub OAuth',
            'Discord OAuth',
            'Two-Factor Auth',
            'SSO Integration',
            'Role-Based Access'
        ],
        price: 19.99,
        currency: 'USD',
        setupTime: '8 minutes',
        difficulty: 'EASY',
        icon: <Lock className="w-8 h-8" />,
        status: 'ACTIVE'
    },
    {
        id: 'currency-exchange',
        name: 'Currency Exchange Pro',
        description: 'Real-time currency conversion and exchange',
        category: 'Finance',
        features: [
            'Real-time Rates',
            '170+ Currencies',
            'Historical Data',
            'Rate Alerts',
            'Auto-Conversion',
            'Multi-API Support',
            'Offline Rates',
            'Bulk Conversion',
            'Exchange Calculator',
            'Market Trends'
        ],
        price: 24.99,
        currency: 'USD',
        setupTime: '3 minutes',
        difficulty: 'EASY',
        icon: <DollarSign className="w-8 h-8" />,
        status: 'ACTIVE'
    },
    {
        id: 'token-rewards',
        name: 'Token Rewards System',
        description: 'Complete token mining and rewards platform',
        category: 'Rewards',
        features: [
            'Token Mining',
            'Reward Distribution',
            'Cashback System',
            'Loyalty Programs',
            'Referral Rewards',
            'Achievement System',
            'Token Economy',
            'Mining Dashboard',
            'Reward Analytics',
            'Automated Payouts'
        ],
        price: 34.99,
        currency: 'USD',
        setupTime: '12 minutes',
        difficulty: 'MEDIUM',
        icon: <TrendingUp className="w-8 h-8" />,
        status: 'ACTIVE'
    },
    {
        id: 'p2p-marketplace',
        name: 'P2P Marketplace',
        description: 'Peer-to-peer trading for social media accounts',
        category: 'Trading',
        features: [
            'Account Listings',
            'Role Trading',
            'Escrow Protection',
            'Verification System',
            'Dispute Resolution',
            'Rating System',
            'Secure Transfers',
            'Market Analytics',
            'Trading History',
            'Automated Matching'
        ],
        price: 44.99,
        currency: 'USD',
        setupTime: '20 minutes',
        difficulty: 'HARD',
        icon: <Users className="w-8 h-8" />,
        status: 'ACTIVE'
    },
    {
        id: 'campaign-manager',
        name: 'Campaign Manager Pro',
        description: 'Advanced advertising campaign management',
        category: 'Advertising',
        features: [
            'Facebook Ads',
            'Google Ads',
            'Instagram Ads',
            'TikTok Ads',
            'Campaign Analytics',
            'A/B Testing',
            'Budget Optimization',
            'Targeting Tools',
            'Creative Management',
            'ROI Tracking'
        ],
        price: 54.99,
        currency: 'USD',
        setupTime: '25 minutes',
        difficulty: 'HARD',
        icon: <BarChart3 className="w-8 h-8" />,
        status: 'ACTIVE'
    }
]

export default function IntegrationPackages() {
    const [selectedPackage, setSelectedPackage] = useState<IntegrationPackage | null>(null)
    const [selectedCategory, setSelectedCategory] = useState('all')

    const categories = [
        { id: 'all', name: 'All Packages', count: integrationPackages.length },
        { id: 'Payments', name: 'Payments', count: integrationPackages.filter(p => p.category === 'Payments').length },
        { id: 'Cryptocurrency', name: 'Cryptocurrency', count: integrationPackages.filter(p => p.category === 'Cryptocurrency').length },
        { id: 'Social Media', name: 'Social Media', count: integrationPackages.filter(p => p.category === 'Social Media').length },
        { id: 'Authentication', name: 'Authentication', count: integrationPackages.filter(p => p.category === 'Authentication').length },
        { id: 'Finance', name: 'Finance', count: integrationPackages.filter(p => p.category === 'Finance').length },
        { id: 'Rewards', name: 'Rewards', count: integrationPackages.filter(p => p.category === 'Rewards').length },
        { id: 'Trading', name: 'Trading', count: integrationPackages.filter(p => p.category === 'Trading').length },
        { id: 'Advertising', name: 'Advertising', count: integrationPackages.filter(p => p.category === 'Advertising').length }
    ]

    const filteredPackages = selectedCategory === 'all'
        ? integrationPackages
        : integrationPackages.filter(p => p.category === selectedCategory)

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'EASY': return 'bg-green-100 text-green-800'
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
            case 'HARD': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-800'
            case 'BETA': return 'bg-blue-100 text-blue-800'
            case 'COMING_SOON': return 'bg-purple-100 text-purple-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Integration Packages
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Choose from our comprehensive suite of integrations to power your business with
                        payments, crypto, social media, and more. All packages include setup support and documentation.
                    </p>
                </div>

                {/* Category Filter */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {category.name} ({category.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Packages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {filteredPackages.map(pkg => (
                        <Card key={pkg.id} className="relative hover:shadow-lg transition-shadow">
                            {pkg.isPopular && (
                                <div className="absolute -top-3 left-4">
                                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                                        Most Popular
                                    </Badge>
                                </div>
                            )}
                            {pkg.isRecommended && (
                                <div className="absolute -top-3 left-4">
                                    <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                                        Recommended
                                    </Badge>
                                </div>
                            )}

                            <CardHeader className="text-center pb-4">
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                                        {pkg.icon}
                                    </div>
                                </div>
                                <CardTitle className="text-xl">{pkg.name}</CardTitle>
                                <CardDescription className="text-sm">
                                    {pkg.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Features */}
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm text-gray-700">Key Features:</h4>
                                    <ul className="space-y-1">
                                        {pkg.features.slice(0, 5).map((feature, index) => (
                                            <li key={index} className="flex items-center text-xs text-gray-600">
                                                <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                        {pkg.features.length > 5 && (
                                            <li className="text-xs text-blue-600 font-medium">
                                                +{pkg.features.length - 5} more features
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                {/* Package Info */}
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="outline" className={getDifficultyColor(pkg.difficulty)}>
                                            {pkg.difficulty}
                                        </Badge>
                                        <Badge variant="outline" className={getStatusColor(pkg.status)}>
                                            {pkg.status}
                                        </Badge>
                                    </div>
                                    <span className="text-gray-500">{pkg.setupTime} setup</span>
                                </div>

                                {/* Price and Action */}
                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <span className="text-2xl font-bold text-gray-900">
                                                ${pkg.price}
                                            </span>
                                            <span className="text-sm text-gray-500">/{pkg.currency}/month</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="text-sm text-gray-600 ml-1">4.9</span>
                                        </div>
                                    </div>

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                className="w-full"
                                                onClick={() => setSelectedPackage(pkg)}
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Get Package
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle>Install {pkg.name}</DialogTitle>
                                                <DialogDescription>
                                                    Complete setup for {pkg.name} integration
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="space-y-6">
                                                {/* Package Details */}
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <h4 className="font-medium mb-2">Package Details</h4>
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <span className="text-gray-500">Category:</span>
                                                            <span className="ml-2 font-medium">{pkg.category}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Setup Time:</span>
                                                            <span className="ml-2 font-medium">{pkg.setupTime}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Difficulty:</span>
                                                            <span className="ml-2 font-medium">{pkg.difficulty}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Status:</span>
                                                            <span className="ml-2 font-medium">{pkg.status}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Setup Steps */}
                                                <div>
                                                    <h4 className="font-medium mb-3">Setup Steps</h4>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                                                1
                                                            </div>
                                                            <span className="text-sm">Download package files</span>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                                                2
                                                            </div>
                                                            <span className="text-sm">Configure API keys and settings</span>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                                                3
                                                            </div>
                                                            <span className="text-sm">Test integration and verify setup</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex space-x-3">
                                                    <Button className="flex-1">
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Download Package
                                                    </Button>
                                                    <Button variant="outline" className="flex-1">
                                                        <ExternalLink className="w-4 h-4 mr-2" />
                                                        View Documentation
                                                    </Button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Integration Benefits */}
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold text-center mb-8">
                        Why Choose Our Integration Packages?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Quick Setup</h3>
                            <p className="text-gray-600">
                                All packages include automated setup wizards and comprehensive documentation
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Secure & Reliable</h3>
                            <p className="text-gray-600">
                                Enterprise-grade security with 99.9% uptime guarantee and 24/7 support
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Scalable Solutions</h3>
                            <p className="text-gray-600">
                                Grow with confidence - all packages scale with your business needs
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}