"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { TrendingUp, Target, Users, DollarSign, BarChart3, Megaphone, Gift, Zap } from 'lucide-react';

// Mock marketing data for demonstration
const mockCampaigns = [
    {
        id: 1,
        name: "Summer Sale Campaign",
        type: "discount",
        status: "active",
        budget: 5000,
        spent: 3200,
        impressions: 45000,
        clicks: 2200,
        conversions: 180,
        revenue: 18000,
        startDate: "2024-06-01",
        endDate: "2024-08-31"
    },
    {
        id: 2,
        name: "New Product Launch",
        type: "awareness",
        status: "active",
        budget: 3000,
        spent: 1800,
        impressions: 28000,
        clicks: 1500,
        conversions: 95,
        revenue: 9500,
        startDate: "2024-07-01",
        endDate: "2024-09-30"
    },
    {
        id: 3,
        name: "Holiday Special",
        type: "promotion",
        status: "scheduled",
        budget: 8000,
        spent: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        startDate: "2024-11-01",
        endDate: "2024-12-31"
    }
];

const mockPromotions = [
    {
        id: 1,
        name: "Buy 2 Get 1 Free",
        type: "bundle",
        discount: "33%",
        status: "active",
        usage: 45,
        revenue: 2700
    },
    {
        id: 2,
        name: "First Time Buyer",
        type: "coupon",
        discount: "20%",
        status: "active",
        usage: 120,
        revenue: 4800
    },
    {
        id: 3,
        name: "VIP Customer",
        type: "loyalty",
        discount: "15%",
        status: "active",
        usage: 78,
        revenue: 3900
    }
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'active':
            return <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>;
        case 'scheduled':
            return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Scheduled</Badge>;
        case 'paused':
            return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Paused</Badge>;
        case 'completed':
            return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Completed</Badge>;
        default:
            return <Badge variant="secondary">Unknown</Badge>;
    }
};

const getTypeBadge = (type: string) => {
    switch (type) {
        case 'discount':
            return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Discount</Badge>;
        case 'awareness':
            return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Awareness</Badge>;
        case 'promotion':
            return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Promotion</Badge>;
        case 'bundle':
            return <Badge variant="secondary" className="bg-green-100 text-green-800">Bundle</Badge>;
        case 'coupon':
            return <Badge variant="secondary" className="bg-pink-100 text-pink-800">Coupon</Badge>;
        case 'loyalty':
            return <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">Loyalty</Badge>;
        default:
            return <Badge variant="secondary">Unknown</Badge>;
    }
};

export default function SellerMarketingPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    const filteredCampaigns = mockCampaigns.filter(campaign => {
        const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || campaign.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const totalBudget = mockCampaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
    const totalSpent = mockCampaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
    const totalRevenue = mockCampaigns.reduce((sum, campaign) => sum + campaign.revenue, 0);
    const totalConversions = mockCampaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Marketing & Promotions</h1>
                    <p className="text-gray-600">Manage your marketing campaigns and promotional strategies</p>
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Megaphone className="h-4 w-4 mr-2" />
                    Create Campaign
                </Button>
            </div>

            {/* Marketing Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">All campaigns</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Current spending</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Generated from campaigns</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
                        <Target className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalConversions}</div>
                        <p className="text-xs text-muted-foreground">Successful conversions</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Input
                        placeholder="Search campaigns..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                    <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant={selectedStatus === 'all' ? 'default' : 'outline'}
                        onClick={() => setSelectedStatus('all')}
                    >
                        All
                    </Button>
                    <Button
                        variant={selectedStatus === 'active' ? 'default' : 'outline'}
                        onClick={() => setSelectedStatus('active')}
                    >
                        Active
                    </Button>
                    <Button
                        variant={selectedStatus === 'scheduled' ? 'default' : 'outline'}
                        onClick={() => setSelectedStatus('scheduled')}
                    >
                        Scheduled
                    </Button>
                </div>
            </div>

            {/* Marketing Campaigns */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Marketing Campaigns</h2>
                {filteredCampaigns.map((campaign) => (
                    <Card key={campaign.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                                    <CardDescription>
                                        {campaign.startDate} - {campaign.endDate}
                                    </CardDescription>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {getTypeBadge(campaign.type)}
                                    {getStatusBadge(campaign.status)}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">${campaign.budget.toLocaleString()}</div>
                                    <div className="text-sm text-gray-600">Budget</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">${campaign.spent.toLocaleString()}</div>
                                    <div className="text-sm text-gray-600">Spent</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">{campaign.conversions}</div>
                                    <div className="text-sm text-gray-600">Conversions</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">${campaign.revenue.toLocaleString()}</div>
                                    <div className="text-sm text-gray-600">Revenue</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">{campaign.impressions.toLocaleString()}</span> impressions •
                                    <span className="font-medium"> {campaign.clicks.toLocaleString()}</span> clicks
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm">
                                        <BarChart3 className="h-4 w-4 mr-2" />
                                        View Analytics
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Target className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Zap className="h-4 w-4 mr-2" />
                                        Pause
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Promotions */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Active Promotions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockPromotions.map((promotion) => (
                        <Card key={promotion.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{promotion.name}</CardTitle>
                                    {getTypeBadge(promotion.type)}
                                </div>
                                <CardDescription>
                                    {promotion.discount} discount • {promotion.usage} uses
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center mb-4">
                                    <div className="text-3xl font-bold text-green-600">{promotion.discount}</div>
                                    <div className="text-sm text-gray-600">Discount</div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>Revenue Generated:</span>
                                    <span className="font-semibold">${promotion.revenue.toLocaleString()}</span>
                                </div>
                                <div className="mt-4 flex items-center space-x-2">
                                    <Button variant="outline" size="sm" className="flex-1">
                                        <Gift className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1">
                                        <Users className="h-4 w-4 mr-2" />
                                        Analytics
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}