'use client'

import React, { useState, useEffect } from 'react'
import {
    Package,
    Download,
    Trash2,
    Settings,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    Clock,
    Play,
    Pause,
    Edit,
    Eye,
    Plus,
    Search,
    Filter,
    BarChart3,
    Activity,
    Zap,
    Shield,
    Globe,
    CreditCard
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Users } from 'lucide-react'

interface InstalledPackage {
    id: string
    packageId: string
    userId: string
    version: string
    status: string
    config: Record<string, any>
    apiKeys: Record<string, string>
    settings: Record<string, any>
    installedAt: string
    updatedAt: string
    lastUsed?: string
    usageStats?: Record<string, any>
}

interface PackageStats {
    totalInstalled: number
    activePackages: number
    categories: Record<string, number>
    recentActivity: Array<{
        packageId: string
        action: string
        timestamp: Date
    }>
}

export default function PackageManagerDashboard() {
    const [selectedTab, setSelectedTab] = useState('overview')
    const [installedPackages, setInstalledPackages] = useState<InstalledPackage[]>([])
    const [packageStats, setPackageStats] = useState<PackageStats>({
        totalInstalled: 0,
        activePackages: 0,
        categories: {},
        recentActivity: []
    })
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    useEffect(() => {
        loadPackageData()
    }, [])

    const loadPackageData = async () => {
        try {
            setIsLoading(true)
            // In a real implementation, these would be API calls
            await Promise.all([
                loadInstalledPackages(),
                loadPackageStats()
            ])
        } catch (error) {
            console.error('Failed to load package data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const loadInstalledPackages = async () => {
        // Mock data - replace with real API calls
        setInstalledPackages([
            {
                id: '1',
                packageId: 'payment-gateway',
                userId: 'user123',
                version: '2.1.0',
                status: 'ACTIVE',
                config: { default_currency: 'USD', auto_convert: true },
                apiKeys: { STRIPE_SECRET_KEY: 'sk_***', STRIPE_PUBLISHABLE_KEY: 'pk_***' },
                settings: { webhook_url: 'https://example.com/webhook' },
                installedAt: '2024-01-15T10:00:00Z',
                updatedAt: '2024-01-20T15:30:00Z',
                lastUsed: '2024-01-20T14:00:00Z',
                usageStats: { transactions: 150, revenue: 5000 }
            },
            {
                id: '2',
                packageId: 'crypto-suite',
                userId: 'user123',
                version: '1.5.0',
                status: 'ACTIVE',
                config: { supported_coins: ['BTC', 'ETH'], mining_enabled: true },
                apiKeys: { COINBASE_API_KEY: 'cb_***', BINANCE_API_KEY: 'bn_***' },
                settings: { staking_enabled: false },
                installedAt: '2024-01-10T09:00:00Z',
                updatedAt: '2024-01-18T12:00:00Z',
                lastUsed: '2024-01-19T16:00:00Z',
                usageStats: { trades: 25, mining_rewards: 150 }
            },
            {
                id: '3',
                packageId: 'social-media-pro',
                userId: 'user123',
                version: '3.0.0',
                status: 'ERROR',
                config: { auto_posting: false, content_scheduling: true },
                apiKeys: { FACEBOOK_ACCESS_TOKEN: 'fb_***' },
                settings: { analytics_enabled: true },
                installedAt: '2024-01-05T11:00:00Z',
                updatedAt: '2024-01-17T13:00:00Z',
                lastUsed: '2024-01-16T10:00:00Z',
                usageStats: { posts: 45, engagement: 1200 }
            }
        ])
    }

    const loadPackageStats = async () => {
        setPackageStats({
            totalInstalled: 3,
            activePackages: 2,
            categories: {
                'Payments': 1,
                'Cryptocurrency': 1,
                'Social Media': 1
            },
            recentActivity: [
                { packageId: 'payment-gateway', action: 'Updated', timestamp: new Date() },
                { packageId: 'crypto-suite', action: 'Used', timestamp: new Date() },
                { packageId: 'social-media-pro', action: 'Error', timestamp: new Date() }
            ]
        })
    }

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            'ACTIVE': 'default',
            'INSTALLING': 'secondary',
            'UPDATING': 'outline',
            'ERROR': 'destructive',
            'UNINSTALLING': 'secondary'
        }
        return <Badge variant={variants[status] || 'outline'}>{status}</Badge>
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ACTIVE': return <CheckCircle className="w-4 h-4 text-green-600" />
            case 'ERROR': return <AlertCircle className="w-4 h-4 text-red-600" />
            case 'INSTALLING': return <Download className="w-4 h-4 text-blue-600" />
            case 'UPDATING': return <RefreshCw className="w-4 h-4 text-yellow-600" />
            default: return <Clock className="w-4 h-4 text-gray-600" />
        }
    }

    const getPackageIcon = (packageId: string) => {
        const icons: Record<string, React.ReactNode> = {
            'payment-gateway': <CreditCard className="w-5 h-5" />,
            'crypto-suite': <Zap className="w-5 h-5" />,
            'social-media-pro': <Globe className="w-5 h-5" />,
            'oauth-master': <Shield className="w-5 h-5" />,
            'currency-exchange': <BarChart3 className="w-5 h-5" />,
            'token-rewards': <Activity className="w-5 h-5" />,
            'p2p-marketplace': <Users className="w-5 h-5" />,
            'campaign-manager': <BarChart3 className="w-5 h-5" />
        }
        return icons[packageId] || <Package className="w-5 h-5" />
    }

    const getPackageName = (packageId: string) => {
        const names: Record<string, string> = {
            'payment-gateway': 'Payment Gateway Pro',
            'crypto-suite': 'Crypto Suite Complete',
            'social-media-pro': 'Social Media Pro',
            'oauth-master': 'OAuth Master',
            'currency-exchange': 'Currency Exchange Pro',
            'token-rewards': 'Token Rewards System',
            'p2p-marketplace': 'P2P Marketplace',
            'campaign-manager': 'Campaign Manager Pro'
        }
        return names[packageId] || packageId
    }

    const filteredPackages = installedPackages.filter(pkg => {
        const matchesSearch = getPackageName(pkg.packageId)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || pkg.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const handlePackageAction = async (action: string, packageId: string) => {
        try {
            console.log(`${action} package: ${packageId}`)
            // In a real implementation, this would call the API
            await new Promise(resolve => setTimeout(resolve, 1000))
            loadPackageData() // Refresh data
        } catch (error) {
            console.error(`Failed to ${action} package:`, error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Package Manager</h1>
                    <p className="text-gray-600">Manage your installed integration packages</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{packageStats.totalInstalled}</div>
                            <p className="text-xs text-muted-foreground">
                                {packageStats.activePackages} active
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Packages</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{packageStats.activePackages}</div>
                            <p className="text-xs text-muted-foreground">
                                Running smoothly
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Categories</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{Object.keys(packageStats.categories).length}</div>
                            <p className="text-xs text-muted-foreground">
                                Different types
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{packageStats.recentActivity.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Updates today
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="packages">Packages</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Package Categories */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Package Categories</CardTitle>
                                    <CardDescription>Distribution of installed packages by category</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {Object.entries(packageStats.categories).map(([category, count]) => (
                                            <div key={category} className="flex items-center justify-between">
                                                <span className="font-medium">{category}</span>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{ width: `${(count / packageStats.totalInstalled) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm text-gray-600">{count}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>Latest package updates and activities</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {packageStats.recentActivity.map((activity, index) => (
                                            <div key={index} className="flex items-center space-x-3">
                                                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">
                                                        {getPackageName(activity.packageId)}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        {activity.action} • {activity.timestamp.toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Packages Tab */}
                    <TabsContent value="packages" className="space-y-6">
                        {/* Filters and Search */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Installed Packages</CardTitle>
                                        <CardDescription>Manage and configure your integration packages</CardDescription>
                                    </div>
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Install New Package
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex space-x-4 mb-4">
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Search packages..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="max-w-sm"
                                        />
                                    </div>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="ACTIVE">Active</SelectItem>
                                            <SelectItem value="ERROR">Error</SelectItem>
                                            <SelectItem value="UPDATING">Updating</SelectItem>
                                            <SelectItem value="INSTALLING">Installing</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Package</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Version</TableHead>
                                            <TableHead>Last Used</TableHead>
                                            <TableHead>Usage Stats</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPackages.map(pkg => (
                                            <TableRow key={pkg.id}>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 bg-blue-50 rounded-lg">
                                                            {getPackageIcon(pkg.packageId)}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{getPackageName(pkg.packageId)}</div>
                                                            <div className="text-sm text-gray-500">ID: {pkg.packageId}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        {getStatusIcon(pkg.status)}
                                                        {getStatusBadge(pkg.status)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{pkg.version}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {pkg.lastUsed ? new Date(pkg.lastUsed).toLocaleDateString() : 'Never'}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        {pkg.usageStats && Object.entries(pkg.usageStats).map(([key, value]) => (
                                                            <div key={key} className="flex justify-between">
                                                                <span className="text-gray-500">{key}:</span>
                                                                <span className="font-medium">{value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="outline" size="sm">
                                                            <Settings className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handlePackageAction('update', pkg.packageId)}
                                                        >
                                                            <RefreshCw className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handlePackageAction('uninstall', pkg.packageId)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Package Activity Log</CardTitle>
                                <CardDescription>Detailed history of package operations and events</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {packageStats.recentActivity.map((activity, index) => (
                                        <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                {getPackageIcon(activity.packageId)}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium">{getPackageName(activity.packageId)}</h4>
                                                <p className="text-sm text-gray-600">
                                                    {activity.action} at {activity.timestamp.toLocaleString()}
                                                </p>
                                            </div>
                                            <Badge variant="outline">{activity.action}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Package Manager Settings</CardTitle>
                                <CardDescription>Configure global package management preferences</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Auto Updates</Label>
                                        <Select defaultValue="manual">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="manual">Manual</SelectItem>
                                                <SelectItem value="auto">Automatic</SelectItem>
                                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Backup Frequency</Label>
                                        <Select defaultValue="weekly">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="daily">Daily</SelectItem>
                                                <SelectItem value="weekly">Weekly</SelectItem>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Error Notifications</Label>
                                        <Select defaultValue="enabled">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="enabled">Enabled</SelectItem>
                                                <SelectItem value="disabled">Disabled</SelectItem>
                                                <SelectItem value="critical">Critical Only</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Log Retention</Label>
                                        <Select defaultValue="30">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="7">7 days</SelectItem>
                                                <SelectItem value="30">30 days</SelectItem>
                                                <SelectItem value="90">90 days</SelectItem>
                                                <SelectItem value="365">1 year</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <Button>
                                        <Settings className="w-4 h-4 mr-2" />
                                        Save Settings
                                    </Button>
                                    <Button variant="outline">
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Reset to Defaults
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}