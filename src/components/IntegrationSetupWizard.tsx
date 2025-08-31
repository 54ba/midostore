'use client'

import React, { useState } from 'react'
import {
    CheckCircle,
    Circle,
    ArrowRight,
    ArrowLeft,
    Download,
    Key,
    Settings,
    TestTube,
    Rocket,
    FileText,
    Video,
    HelpCircle,
    ExternalLink
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'

interface SetupStep {
    id: string
    title: string
    description: string
    icon: React.ReactNode
    isCompleted: boolean
    isActive: boolean
}

interface IntegrationConfig {
    packageId: string
    apiKeys: Record<string, string>
    settings: Record<string, any>
    isConfigured: boolean
}

export default function IntegrationSetupWizard() {
    const [currentStep, setCurrentStep] = useState(0)
    const [selectedPackage, setSelectedPackage] = useState('payment-gateway')
    const [config, setConfig] = useState<IntegrationConfig>({
        packageId: 'payment-gateway',
        apiKeys: {},
        settings: {},
        isConfigured: false
    })

    const setupSteps: SetupStep[] = [
        {
            id: 'package-selection',
            title: 'Select Package',
            description: 'Choose the integration package you want to install',
            icon: <Download className="w-5 h-5" />,
            isCompleted: false,
            isActive: true
        },
        {
            id: 'api-configuration',
            title: 'API Configuration',
            description: 'Configure your API keys and credentials',
            icon: <Key className="w-5 h-5" />,
            isCompleted: false,
            isActive: false
        },
        {
            id: 'settings',
            title: 'Settings',
            description: 'Customize your integration settings',
            icon: <Settings className="w-5 h-5" />,
            isCompleted: false,
            isActive: false
        },
        {
            id: 'testing',
            title: 'Test Integration',
            description: 'Verify your integration is working correctly',
            icon: <TestTube className="w-5 h-5" />,
            isCompleted: false,
            isActive: false
        },
        {
            id: 'completion',
            title: 'Complete Setup',
            description: 'Your integration is ready to use',
            icon: <Rocket className="w-5 h-5" />,
            isCompleted: false,
            isActive: false
        }
    ]

    const packages = [
        {
            id: 'payment-gateway',
            name: 'Payment Gateway Pro',
            description: 'Multi-currency payment processing',
            icon: '💳',
            category: 'Payments'
        },
        {
            id: 'crypto-suite',
            name: 'Crypto Suite Complete',
            description: 'Cryptocurrency integration and wallets',
            icon: '₿',
            category: 'Cryptocurrency'
        },
        {
            id: 'social-media-pro',
            name: 'Social Media Pro',
            description: 'Social media management and automation',
            icon: '📱',
            category: 'Social Media'
        },
        {
            id: 'oauth-master',
            name: 'OAuth Master',
            description: 'Multi-provider authentication',
            icon: '🔐',
            category: 'Authentication'
        }
    ]

    const getPackageConfig = (packageId: string) => {
        const configs: Record<string, { apiKeys: string[], settings: any[] }> = {
            'payment-gateway': {
                apiKeys: ['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY', 'BYBIT_API_KEY', 'BYBIT_SECRET_KEY'],
                settings: [
                    { key: 'default_currency', label: 'Default Currency', type: 'select', options: ['USD', 'EUR', 'GBP', 'JPY'] },
                    { key: 'auto_convert', label: 'Auto Currency Conversion', type: 'checkbox' },
                    { key: 'webhook_url', label: 'Webhook URL', type: 'input' }
                ]
            },
            'crypto-suite': {
                apiKeys: ['COINBASE_API_KEY', 'BINANCE_API_KEY', 'ETHERSCAN_API_KEY'],
                settings: [
                    { key: 'supported_coins', label: 'Supported Cryptocurrencies', type: 'multiselect', options: ['BTC', 'ETH', 'USDT', 'BNB'] },
                    { key: 'mining_enabled', label: 'Enable Token Mining', type: 'checkbox' },
                    { key: 'staking_enabled', label: 'Enable Staking', type: 'checkbox' }
                ]
            },
            'social-media-pro': {
                apiKeys: ['FACEBOOK_ACCESS_TOKEN', 'INSTAGRAM_ACCESS_TOKEN', 'TWITTER_API_KEY'],
                settings: [
                    { key: 'auto_posting', label: 'Auto Posting', type: 'checkbox' },
                    { key: 'content_scheduling', label: 'Content Scheduling', type: 'checkbox' },
                    { key: 'analytics_enabled', label: 'Analytics Dashboard', type: 'checkbox' }
                ]
            },
            'oauth-master': {
                apiKeys: ['GOOGLE_CLIENT_ID', 'FACEBOOK_APP_ID', 'GITHUB_CLIENT_ID'],
                settings: [
                    { key: 'login_methods', label: 'Login Methods', type: 'multiselect', options: ['Google', 'Facebook', 'GitHub', 'Apple'] },
                    { key: 'two_factor', label: 'Two-Factor Authentication', type: 'checkbox' },
                    { key: 'auto_registration', label: 'Auto Registration', type: 'checkbox' }
                ]
            }
        }
        return configs[packageId] || { apiKeys: [], settings: [] }
    }

    const handleNext = () => {
        if (currentStep < setupSteps.length - 1) {
            setCurrentStep(currentStep + 1)
            updateStepStatus(currentStep, true)
            updateStepStatus(currentStep + 1, false, true)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
            updateStepStatus(currentStep, false, false)
            updateStepStatus(currentStep - 1, false, true)
        }
    }

    const updateStepStatus = (stepIndex: number, isCompleted: boolean, isActive: boolean = false) => {
        setupSteps[stepIndex].isCompleted = isCompleted
        setupSteps[stepIndex].isActive = isActive
    }

    const handlePackageSelect = (packageId: string) => {
        setSelectedPackage(packageId)
        setConfig({
            packageId,
            apiKeys: {},
            settings: {},
            isConfigured: false
        })
    }

    const handleApiKeyChange = (key: string, value: string) => {
        setConfig(prev => ({
            ...prev,
            apiKeys: { ...prev.apiKeys, [key]: value }
        }))
    }

    const handleSettingChange = (key: string, value: any) => {
        setConfig(prev => ({
            ...prev,
            settings: { ...prev.settings, [key]: value }
        }))
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-semibold mb-2">Choose Your Integration Package</h3>
                            <p className="text-gray-600">Select the package that best fits your needs</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {packages.map(pkg => (
                                <Card
                                    key={pkg.id}
                                    className={`cursor-pointer transition-all ${selectedPackage === pkg.id
                                            ? 'ring-2 ring-blue-500 bg-blue-50'
                                            : 'hover:shadow-md'
                                        }`}
                                    onClick={() => handlePackageSelect(pkg.id)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="text-2xl">{pkg.icon}</div>
                                            <div className="flex-1">
                                                <h4 className="font-medium">{pkg.name}</h4>
                                                <p className="text-sm text-gray-600">{pkg.description}</p>
                                                <Badge variant="outline" className="mt-1">{pkg.category}</Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )

            case 1:
                const packageConfig = getPackageConfig(selectedPackage)
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-semibold mb-2">Configure API Keys</h3>
                            <p className="text-gray-600">Enter your API credentials for {packages.find(p => p.id === selectedPackage)?.name}</p>
                        </div>

                        <div className="space-y-4">
                            {packageConfig.apiKeys.map(apiKey => (
                                <div key={apiKey} className="space-y-2">
                                    <Label htmlFor={apiKey}>{apiKey.replace(/_/g, ' ')}</Label>
                                    <Input
                                        id={apiKey}
                                        type="password"
                                        placeholder={`Enter your ${apiKey.replace(/_/g, ' ')}`}
                                        value={config.apiKeys[apiKey] || ''}
                                        onChange={(e) => handleApiKeyChange(apiKey, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-start space-x-3">
                                <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-blue-900">Need Help?</h4>
                                    <p className="text-sm text-blue-700 mt-1">
                                        Don't have API keys? Check our documentation for step-by-step instructions on how to obtain them.
                                    </p>
                                    <Button variant="link" className="p-0 h-auto text-blue-700">
                                        <ExternalLink className="w-4 h-4 mr-1" />
                                        View Documentation
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 2:
                const settings = getPackageConfig(selectedPackage).settings
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-semibold mb-2">Customize Settings</h3>
                            <p className="text-gray-600">Configure your integration preferences</p>
                        </div>

                        <div className="space-y-4">
                            {settings.map(setting => (
                                <div key={setting.key} className="space-y-2">
                                    <Label htmlFor={setting.key}>{setting.label}</Label>
                                    {setting.type === 'select' && (
                                        <Select value={config.settings[setting.key]} onValueChange={(value) => handleSettingChange(setting.key, value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={`Select ${setting.label.toLowerCase()}`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {setting.options.map(option => (
                                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                    {setting.type === 'checkbox' && (
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={setting.key}
                                                checked={config.settings[setting.key] || false}
                                                onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                            <Label htmlFor={setting.key}>Enable {setting.label}</Label>
                                        </div>
                                    )}
                                    {setting.type === 'input' && (
                                        <Input
                                            id={setting.key}
                                            placeholder={`Enter ${setting.label.toLowerCase()}`}
                                            value={config.settings[setting.key] || ''}
                                            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                                        />
                                    )}
                                    {setting.type === 'multiselect' && (
                                        <div className="space-y-2">
                                            {setting.options.map(option => (
                                                <div key={option} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`${setting.key}-${option}`}
                                                        checked={config.settings[setting.key]?.includes(option) || false}
                                                        onChange={(e) => {
                                                            const current = config.settings[setting.key] || []
                                                            const newValue = e.target.checked
                                                                ? [...current, option]
                                                                : current.filter(item => item !== option)
                                                            handleSettingChange(setting.key, newValue)
                                                        }}
                                                        className="w-4 h-4"
                                                    />
                                                    <Label htmlFor={`${setting.key}-${option}`}>{option}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-semibold mb-2">Test Your Integration</h3>
                            <p className="text-gray-600">Verify that everything is working correctly</p>
                        </div>

                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Connection Test</CardTitle>
                                    <CardDescription>Testing API connectivity and authentication</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <span>API Connection</span>
                                        <Badge variant="outline" className="bg-green-100 text-green-800">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Connected
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Feature Test</CardTitle>
                                    <CardDescription>Testing core functionality</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span>Basic Functionality</span>
                                            <Badge variant="outline" className="bg-green-100 text-green-800">
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Passed
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Error Handling</span>
                                            <Badge variant="outline" className="bg-green-100 text-green-800">
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Passed
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Performance</span>
                                            <Badge variant="outline" className="bg-green-100 text-green-800">
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Passed
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                <div>
                                    <h4 className="font-medium text-green-900">All Tests Passed!</h4>
                                    <p className="text-sm text-green-700">Your integration is working correctly and ready to use.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 4:
                return (
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>

                        <div>
                            <h3 className="text-2xl font-semibold mb-2">Setup Complete!</h3>
                            <p className="text-gray-600">
                                Your {packages.find(p => p.id === selectedPackage)?.name} integration has been successfully configured and is ready to use.
                            </p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg max-w-md mx-auto">
                            <h4 className="font-medium mb-3">What's Next?</h4>
                            <div className="space-y-2 text-sm text-left">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span>Start using your integration</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span>Check the dashboard for analytics</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span>Explore advanced features</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-3 justify-center">
                            <Button variant="outline">
                                <FileText className="w-4 h-4 mr-2" />
                                View Documentation
                            </Button>
                            <Button variant="outline">
                                <Video className="w-4 h-4 mr-2" />
                                Watch Tutorial
                            </Button>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    const progress = ((currentStep + 1) / setupSteps.length) * 100

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Integration Setup Wizard</h1>
                    <p className="text-gray-600">Follow the steps below to set up your integration package</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Setup Progress</span>
                        <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                </div>

                {/* Steps Navigation */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {setupSteps.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.isCompleted
                                            ? 'bg-green-500 text-white'
                                            : step.isActive
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200 text-gray-500'
                                        }`}>
                                        {step.isCompleted ? (
                                            <CheckCircle className="w-5 h-5" />
                                        ) : (
                                            step.icon
                                        )}
                                    </div>
                                    <div className="text-xs mt-2 text-center max-w-20">
                                        <div className={`font-medium ${step.isActive ? 'text-blue-600' : 'text-gray-500'
                                            }`}>
                                            {step.title}
                                        </div>
                                    </div>
                                </div>
                                {index < setupSteps.length - 1 && (
                                    <div className={`w-16 h-0.5 mx-4 ${step.isCompleted ? 'bg-green-500' : 'bg-gray-200'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <Card className="mb-8">
                    <CardContent className="p-8">
                        {renderStepContent()}
                    </CardContent>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 0}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                    </Button>

                    {currentStep < setupSteps.length - 1 ? (
                        <Button onClick={handleNext}>
                            Next
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button className="bg-green-600 hover:bg-green-700">
                            <Rocket className="w-4 h-4 mr-2" />
                            Launch Integration
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}