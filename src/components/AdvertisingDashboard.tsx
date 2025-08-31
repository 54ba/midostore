'use client'

import React, { useState, useEffect } from 'react'
import {
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    Youtube,
    TrendingUp,
    Users,
    DollarSign,
    BarChart3,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    Play,
    Pause,
    Settings,
    Target,
    Calendar,
    Globe,
    Zap
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
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

interface FacebookAd {
    id: string
    name: string
    status: string
    objective: string
    budget: number
    spent: number
    impressions: number
    clicks: number
    conversions: number
    ctr: number
    cpc: number
    cpm: number
}

interface SocialMediaAccount {
    id: string
    platform: string
    accountName: string
    followers: number
    engagement: number
    niche: string
    isVerified: boolean
    isMonetized: boolean
    averageViews: number
    averageLikes: number
}

interface P2PListing {
    id: string
    accountName: string
    platform: string
    role: string
    price: number
    currency: string
    status: string
    sellerName: string
    followers: number
    engagement: number
}

export default function AdvertisingDashboard() {
    const [selectedTab, setSelectedTab] = useState('facebook-ads')
    const [facebookAds, setFacebookAds] = useState<FacebookAd[]>([])
    const [socialAccounts, setSocialAccounts] = useState<SocialMediaAccount[]>([])
    const [p2PListings, setP2PListings] = useState<P2PListing[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        try {
            setIsLoading(true)
            await Promise.all([
                loadFacebookAds(),
                loadSocialAccounts(),
                loadP2PListings()
            ])
        } catch (error) {
            console.error('Failed to load dashboard data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const loadFacebookAds = async () => {
        // Mock data - replace with real API calls
        setFacebookAds([
            {
                id: '1',
                name: 'Summer Sale Campaign',
                status: 'ACTIVE',
                objective: 'CONVERSIONS',
                budget: 1000,
                spent: 450,
                impressions: 25000,
                clicks: 1200,
                conversions: 45,
                ctr: 4.8,
                cpc: 0.38,
                cpm: 18.0
            },
            {
                id: '2',
                name: 'Brand Awareness',
                status: 'PAUSED',
                objective: 'AWARENESS',
                budget: 500,
                spent: 200,
                impressions: 15000,
                clicks: 300,
                conversions: 0,
                ctr: 2.0,
                cpc: 0.67,
                cpm: 13.3
            }
        ])
    }

    const loadSocialAccounts = async () => {
        setSocialAccounts([
            {
                id: '1',
                platform: 'INSTAGRAM',
                accountName: 'fashion_lifestyle',
                followers: 125000,
                engagement: 4.2,
                niche: 'Fashion & Lifestyle',
                isVerified: true,
                isMonetized: true,
                averageViews: 8500,
                averageLikes: 1200
            },
            {
                id: '2',
                platform: 'YOUTUBE',
                accountName: 'TechReviews',
                followers: 89000,
                engagement: 6.8,
                niche: 'Technology',
                isVerified: false,
                isMonetized: true,
                averageViews: 25000,
                averageLikes: 1800
            }
        ])
    }

    const loadP2PListings = async () => {
        setP2PListings([
            {
                id: '1',
                accountName: 'fashion_lifestyle',
                platform: 'INSTAGRAM',
                role: 'EDITOR',
                price: 500,
                currency: 'USD',
                status: 'LISTED',
                sellerName: 'John Doe',
                followers: 125000,
                engagement: 4.2
            },
            {
                id: '2',
                accountName: 'TechReviews',
                platform: 'YOUTUBE',
                role: 'MODERATOR',
                price: 300,
                currency: 'USD',
                status: 'LISTED',
                sellerName: 'Jane Smith',
                followers: 89000,
                engagement: 6.8
            }
        ])
    }

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'FACEBOOK': return <Facebook className="w-4 h-4" />
            case 'INSTAGRAM': return <Instagram className="w-4 h-4" />
            case 'TWITTER': return <Twitter className="w-4 h-4" />
            case 'LINKEDIN': return <Linkedin className="w-4 h-4" />
            case 'YOUTUBE': return <Youtube className="w-4 h-4" />
            default: return <Globe className="w-4 h-4" />
        }
    }

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            'ACTIVE': 'default',
            'PAUSED': 'secondary',
            'LISTED': 'default',
            'RESERVED': 'outline',
            'SOLD': 'destructive'
        }
        return <Badge variant={variants[status] || 'outline'}>{status}</Badge>
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Advertising Dashboard</h1>
                    <p className="text-gray-600">Manage Facebook ads and social media account trading</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {facebookAds.filter(ad => ad.status === 'ACTIVE').length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total budget: ${facebookAds.reduce((sum, ad) => sum + ad.budget, 0).toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${facebookAds.reduce((sum, ad) => sum + ad.spent, 0).toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {facebookAds.length} campaigns
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Social Accounts</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{socialAccounts.length}</div>
                            <p className="text-xs text-muted-foreground">
                                {socialAccounts.reduce((sum, acc) => sum + acc.followers, 0).toLocaleString()} total followers
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">P2P Listings</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {p2PListings.filter(l => l.status === 'LISTED').length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                ${p2PListings.filter(l => l.status === 'LISTED')
                                    .reduce((sum, l) => sum + l.price, 0).toLocaleString()} total value
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="facebook-ads">Facebook Ads</TabsTrigger>
                        <TabsTrigger value="social-accounts">Social Accounts</TabsTrigger>
                        <TabsTrigger value="p2p-trading">P2P Trading</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    {/* Facebook Ads Tab */}
                    <TabsContent value="facebook-ads" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Facebook Ad Campaigns</CardTitle>
                                        <CardDescription>Manage your Facebook advertising campaigns</CardDescription>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Create Campaign
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle>Create Facebook Ad Campaign</DialogTitle>
                                                <DialogDescription>
                                                    Set up a new Facebook advertising campaign
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-sm font-medium">Campaign Name</label>
                                                    <Input placeholder="Enter campaign name" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium">Objective</label>
                                                        <Select>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select objective" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="AWARENESS">Awareness</SelectItem>
                                                                <SelectItem value="CONSIDERATION">Consideration</SelectItem>
                                                                <SelectItem value="CONVERSIONS">Conversions</SelectItem>
                                                                <SelectItem value="LEADS">Leads</SelectItem>
                                                                <SelectItem value="SALES">Sales</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium">Budget (USD)</label>
                                                        <Input type="number" placeholder="1000" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">Target Audience</label>
                                                    <Input placeholder="e.g., Age 25-45, Tech enthusiasts" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium">Start Date</label>
                                                        <Input type="date" />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium">End Date</label>
                                                        <Input type="date" />
                                                    </div>
                                                </div>
                                                <Button className="w-full">Create Campaign</Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Campaign</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Objective</TableHead>
                                            <TableHead>Budget</TableHead>
                                            <TableHead>Spent</TableHead>
                                            <TableHead>Impressions</TableHead>
                                            <TableHead>CTR</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {facebookAds.map(ad => (
                                            <TableRow key={ad.id}>
                                                <TableCell className="font-medium">{ad.name}</TableCell>
                                                <TableCell>{getStatusBadge(ad.status)}</TableCell>
                                                <TableCell>{ad.objective}</TableCell>
                                                <TableCell>${ad.budget.toLocaleString()}</TableCell>
                                                <TableCell>${ad.spent.toLocaleString()}</TableCell>
                                                <TableCell>{ad.impressions.toLocaleString()}</TableCell>
                                                <TableCell>{ad.ctr}%</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <Button variant="outline" size="sm">
                                                            {ad.status === 'ACTIVE' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                        </Button>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="w-4 h-4" />
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

                    {/* Social Accounts Tab */}
                    <TabsContent value="social-accounts" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Social Media Accounts</CardTitle>
                                        <CardDescription>Manage your social media accounts and roles</CardDescription>
                                    </div>
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Account
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {socialAccounts.map(account => (
                                        <Card key={account.id}>
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center space-x-3">
                                                    {getPlatformIcon(account.platform)}
                                                    <div>
                                                        <CardTitle className="text-lg">{account.accountName}</CardTitle>
                                                        <CardDescription className="text-sm">
                                                            {account.platform} • {account.niche}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span>Followers:</span>
                                                    <span className="font-medium">{account.followers.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Engagement:</span>
                                                    <span className="font-medium">{account.engagement}%</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Avg Views:</span>
                                                    <span className="font-medium">{account.averageViews.toLocaleString()}</span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Badge variant={account.isVerified ? 'default' : 'outline'}>
                                                        {account.isVerified ? 'Verified' : 'Unverified'}
                                                    </Badge>
                                                    <Badge variant={account.isMonetized ? 'default' : 'outline'}>
                                                        {account.isMonetized ? 'Monetized' : 'Not Monetized'}
                                                    </Badge>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Button variant="outline" size="sm" className="flex-1">
                                                        <Edit className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="flex-1">
                                                        <Users className="w-4 h-4 mr-1" />
                                                        Roles
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* P2P Trading Tab */}
                    <TabsContent value="p2p-trading" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>P2P Social Media Trading</CardTitle>
                                        <CardDescription>Buy and sell social media account roles</CardDescription>
                                    </div>
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        List Role
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Account</TableHead>
                                            <TableHead>Platform</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Followers</TableHead>
                                            <TableHead>Engagement</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {p2PListings.map(listing => (
                                            <TableRow key={listing.id}>
                                                <TableCell className="font-medium">{listing.accountName}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        {getPlatformIcon(listing.platform)}
                                                        <span>{listing.platform}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{listing.role}</Badge>
                                                </TableCell>
                                                <TableCell>{listing.followers.toLocaleString()}</TableCell>
                                                <TableCell>{listing.engagement}%</TableCell>
                                                <TableCell>${listing.price.toLocaleString()}</TableCell>
                                                <TableCell>{getStatusBadge(listing.status)}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="default" size="sm">
                                                            Buy Now
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

                    {/* Analytics Tab */}
                    <TabsContent value="analytics" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Campaign Performance</CardTitle>
                                    <CardDescription>Facebook ad campaign metrics</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span>Total Impressions</span>
                                            <span className="font-bold">
                                                {facebookAds.reduce((sum, ad) => sum + ad.impressions, 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Total Clicks</span>
                                            <span className="font-bold">
                                                {facebookAds.reduce((sum, ad) => sum + ad.clicks, 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Total Conversions</span>
                                            <span className="font-bold">
                                                {facebookAds.reduce((sum, ad) => sum + ad.conversions, 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Average CTR</span>
                                            <span className="font-bold">
                                                {(facebookAds.reduce((sum, ad) => sum + ad.ctr, 0) / facebookAds.length).toFixed(2)}%
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Social Media Insights</CardTitle>
                                    <CardDescription>Account performance overview</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span>Total Followers</span>
                                            <span className="font-bold">
                                                {socialAccounts.reduce((sum, acc) => sum + acc.followers, 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Average Engagement</span>
                                            <span className="font-bold">
                                                {(socialAccounts.reduce((sum, acc) => sum + acc.engagement, 0) / socialAccounts.length).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Total Views</span>
                                            <span className="font-bold">
                                                {socialAccounts.reduce((sum, acc) => sum + acc.averageViews, 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Monetized Accounts</span>
                                            <span className="font-bold">
                                                {socialAccounts.filter(acc => acc.isMonetized).length}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}