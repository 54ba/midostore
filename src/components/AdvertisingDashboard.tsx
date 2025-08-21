"use client";

import React, { useState, useEffect } from 'react';
import {
    Megaphone,
    Plus,
    Play,
    Pause,
    Edit,
    Trash2,
    Eye,
    TrendingUp,
    DollarSign,
    Users,
    Target,
    BarChart3,
    Settings,
    CreditCard,
    Zap,
    Globe,
    Smartphone,
    Monitor,
    Calendar,
    Filter,
    Download,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Clock,
    Star
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface AdvertisingDashboardProps {
    userId: string;
    className?: string;
}

interface CampaignFormData {
    name: string;
    description: string;
    platform: string;
    budget: number;
    dailyBudget: number;
    startDate: string;
    endDate: string;
    targeting: {
        locations: string[];
        ageGroups: string[];
        interests: string[];
        behaviors: string[];
    };
}

export default function AdvertisingDashboard({ userId, className = '' }: AdvertisingDashboardProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const [campaigns, setCampaigns] = useState([]);
    const [credits, setCredits] = useState(null);
    const [platforms, setPlatforms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState<CampaignFormData>({
        name: '',
        description: '',
        platform: 'facebook',
        budget: 100,
        dailyBudget: 10,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        targeting: {
            locations: ['United States'],
            ageGroups: ['25-34', '35-44'],
            interests: ['Online shopping'],
            behaviors: ['Online shoppers'],
        },
    });

    useEffect(() => {
        fetchData();
    }, [userId]);

    const fetchData = async () => {
        try {
            setLoading(true);

            const [campaignsRes, creditsRes, platformsRes, productsRes] = await Promise.all([
                fetch(`/api/advertising?action=campaigns&userId=${userId}`),
                fetch(`/api/advertising?action=credits&userId=${userId}`),
                fetch(`/api/advertising?action=platforms&userId=${userId}`),
                fetch('/api/products'),
            ]);

            if (campaignsRes.ok) {
                const data = await campaignsRes.json();
                if (data.success) setCampaigns(data.data);
            }

            if (creditsRes.ok) {
                const data = await creditsRes.json();
                if (data.success) setCredits(data.data);
            }

            if (platformsRes.ok) {
                const data = await platformsRes.json();
                if (data.success) setPlatforms(data.data);
            }

            if (productsRes.ok) {
                const data = await productsRes.json();
                if (data.success) setProducts(data.data);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCampaign = async () => {
        try {
            if (!selectedProduct) {
                alert('Please select a product');
                return;
            }

            const response = await fetch('/api/advertising', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create-campaign',
                    userId,
                    productId: selectedProduct,
                    ...formData,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    alert('Campaign created successfully!');
                    setShowCreateForm(false);
                    fetchData();
                    resetForm();
                }
            }
        } catch (error) {
            console.error('Error creating campaign:', error);
            alert('Failed to create campaign');
        }
    };

    const handleLaunchCampaign = async (campaignId: string) => {
        try {
            const response = await fetch('/api/advertising', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'launch-campaign',
                    campaignId,
                    userId,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    alert('Campaign launched successfully!');
                    fetchData();
                }
            }
        } catch (error) {
            console.error('Error launching campaign:', error);
            alert('Failed to launch campaign');
        }
    };

    const handlePauseCampaign = async (campaignId: string) => {
        try {
            const response = await fetch('/api/advertising', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'pause-campaign',
                    campaignId,
                    userId,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    alert('Campaign paused successfully!');
                    fetchData();
                }
            }
        } catch (error) {
            console.error('Error pausing campaign:', error);
            alert('Failed to pause campaign');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            platform: 'facebook',
            budget: 100,
            dailyBudget: 10,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            targeting: {
                locations: ['United States'],
                ageGroups: ['25-34', '35-44'],
                interests: ['Online shopping'],
                behaviors: ['Online shoppers'],
            },
        });
        setSelectedProduct('');
    };

    const getStatusColor = (status: string) => {
        const colors = {
            draft: 'bg-gray-100 text-gray-800',
            pending: 'bg-yellow-100 text-yellow-800',
            active: 'bg-green-100 text-green-800',
            paused: 'bg-orange-100 text-orange-800',
            completed: 'bg-blue-100 text-blue-800',
            rejected: 'bg-red-100 text-red-800',
        };
        return colors[status] || colors.draft;
    };

    const getStatusIcon = (status: string) => {
        const icons = {
            draft: <Edit className="w-4 h-4" />,
            pending: <Clock className="w-4 h-4" />,
            active: <Play className="w-4 h-4" />,
            paused: <Pause className="w-4 h-4" />,
            completed: <CheckCircle className="w-4 h-4" />,
            rejected: <AlertCircle className="w-4 h-4" />,
        };
        return icons[status] || icons.draft;
    };

    if (loading) {
        return (
            <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
            {/* Header */}
            <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Megaphone className="w-6 h-6 text-blue-600" />
                            Advertising Dashboard
                        </h2>
                        <p className="text-gray-600 mt-1">Create and manage your ad campaigns</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create Campaign
                        </button>

                        <button
                            onClick={fetchData}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-1 mt-6">
                    {[
                        { id: 'overview', label: 'Overview', icon: BarChart3 },
                        { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
                        { id: 'credits', label: 'Credits', icon: CreditCard },
                        { id: 'platforms', label: 'Platforms', icon: Globe },
                        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === tab.id
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-600 text-sm font-medium">Active Campaigns</p>
                                        <p className="text-2xl font-bold text-blue-900">
                                            {campaigns.filter(c => c.status === 'active').length}
                                        </p>
                                    </div>
                                    <Play className="w-8 h-8 text-blue-600" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-600 text-sm font-medium">Total Spend</p>
                                        <p className="text-2xl font-bold text-green-900">
                                            ${campaigns.reduce((sum, c) => sum + (c.totalSpent || 0), 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <DollarSign className="w-8 h-8 text-green-600" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-600 text-sm font-medium">Available Credits</p>
                                        <p className="text-2xl font-bold text-purple-900">
                                            {credits?.availableCredits || 0}
                                        </p>
                                    </div>
                                    <Zap className="w-8 h-8 text-purple-600" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-orange-600 text-sm font-medium">Connected Platforms</p>
                                        <p className="text-2xl font-bold text-orange-900">
                                            {platforms.filter(p => p.isConnected).length}
                                        </p>
                                    </div>
                                    <Globe className="w-8 h-8 text-orange-600" />
                                </div>
                            </div>
                        </div>

                        {/* Recent Campaigns */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Campaigns</h3>
                            <div className="space-y-3">
                                {campaigns.slice(0, 5).map((campaign: any) => (
                                    <div key={campaign.id} className="flex items-center justify-between p-3 bg-white rounded border">
                                        <div className="flex items-center gap-3">
                                            {getStatusIcon(campaign.status)}
                                            <div>
                                                <p className="font-medium text-gray-900">{campaign.name}</p>
                                                <p className="text-sm text-gray-600">{campaign.platform} • ${campaign.budget}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                                                {campaign.status}
                                            </span>
                                            {campaign.status === 'active' ? (
                                                <button
                                                    onClick={() => handlePauseCampaign(campaign.id)}
                                                    className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                                                >
                                                    <Pause className="w-4 h-4" />
                                                </button>
                                            ) : campaign.status === 'paused' ? (
                                                <button
                                                    onClick={() => handleLaunchCampaign(campaign.id)}
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                >
                                                    <Play className="w-4 h-4" />
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'campaigns' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">All Campaigns</h3>
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                New Campaign
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {campaigns.map((campaign: any) => (
                                <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(campaign.status)}
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                                                {campaign.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <h4 className="font-semibold text-gray-900 mb-2">{campaign.name}</h4>
                                    <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Platform:</span>
                                            <span className="font-medium capitalize">{campaign.platform}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Budget:</span>
                                            <span className="font-medium">${campaign.budget}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Spent:</span>
                                            <span className="font-medium">${campaign.totalSpent || 0}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        {campaign.status === 'active' ? (
                                            <button
                                                onClick={() => handlePauseCampaign(campaign.id)}
                                                className="flex-1 px-3 py-2 bg-orange-100 text-orange-700 rounded text-sm hover:bg-orange-200"
                                            >
                                                <Pause className="w-3 h-3 inline mr-1" />
                                                Pause
                                            </button>
                                        ) : campaign.status === 'paused' ? (
                                            <button
                                                onClick={() => handleLaunchCampaign(campaign.id)}
                                                className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                                            >
                                                <Play className="w-3 h-3 inline mr-1" />
                                                Resume
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'credits' && (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Balance</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-900">{credits?.availableCredits || 0}</p>
                                    <p className="text-blue-600 text-sm">Available Credits</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-900">{credits?.usedCredits || 0}</p>
                                    <p className="text-green-600 text-sm">Used Credits</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-purple-900">${credits?.creditValue || 0.01}</p>
                                    <p className="text-purple-600 text-sm">Credit Value</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h4 className="font-semibold text-gray-900 mb-4">Purchase Credits</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount (USD)</label>
                                        <input
                                            type="number"
                                            min="10"
                                            step="10"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="100"
                                        />
                                    </div>
                                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                        Purchase Credits
                                    </button>
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-6">
                                <h4 className="font-semibold text-gray-900 mb-4">Credit History</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Last Recharge:</span>
                                        <span>{credits?.lastRecharge ? new Date(credits.lastRecharge).toLocaleDateString() : 'Never'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Next Recharge:</span>
                                        <span>{credits?.nextRecharge ? new Date(credits.nextRecharge).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'platforms' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { name: 'Facebook Ads', code: 'facebook', icon: '📘', minBudget: 5 },
                                { name: 'Google Ads', code: 'google', icon: '🔍', minBudget: 10 },
                                { name: 'Instagram Ads', code: 'instagram', icon: '📷', minBudget: 5 },
                                { name: 'TikTok Ads', code: 'tiktok', icon: '🎵', minBudget: 20 },
                                { name: 'Twitter Ads', code: 'twitter', icon: '🐦', minBudget: 5 },
                                { name: 'LinkedIn Ads', code: 'linkedin', icon: '💼', minBudget: 10 },
                            ].map((platform) => {
                                const isConnected = platforms.some(p => p.platformCode === platform.code && p.isConnected);

                                return (
                                    <div key={platform.code} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="text-center mb-4">
                                            <div className="text-4xl mb-2">{platform.icon}</div>
                                            <h4 className="font-semibold text-gray-900">{platform.name}</h4>
                                            <p className="text-sm text-gray-600">Min budget: ${platform.minBudget}</p>
                                        </div>

                                        <div className="space-y-3">
                                            {isConnected ? (
                                                <div className="flex items-center gap-2 text-green-600">
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span className="text-sm">Connected</span>
                                                </div>
                                            ) : (
                                                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                                    Connect Platform
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={[
                                        { date: 'Mon', impressions: 1200, clicks: 45, conversions: 8 },
                                        { date: 'Tue', impressions: 1350, clicks: 52, conversions: 12 },
                                        { date: 'Wed', impressions: 1100, clicks: 38, conversions: 6 },
                                        { date: 'Thu', impressions: 1600, clicks: 68, conversions: 15 },
                                        { date: 'Fri', impressions: 1400, clicks: 55, conversions: 10 },
                                        { date: 'Sat', impressions: 1800, clicks: 72, conversions: 18 },
                                        { date: 'Sun', impressions: 2000, clicks: 85, conversions: 22 },
                                    ]}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="impressions" stroke="#3B82F6" strokeWidth={2} />
                                        <Line type="monotone" dataKey="clicks" stroke="#10B981" strokeWidth={2} />
                                        <Line type="monotone" dataKey="conversions" stroke="#8B5CF6" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Campaign Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Create New Campaign</h3>
                            <button
                                onClick={() => setShowCreateForm(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                                <select
                                    value={selectedProduct}
                                    onChange={(e) => setSelectedProduct(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a product</option>
                                    {products.map((product: any) => (
                                        <option key={product.id} value={product.id}>
                                            {product.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter campaign name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="Enter campaign description"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                                    <select
                                        value={formData.platform}
                                        onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="facebook">Facebook Ads</option>
                                        <option value="google">Google Ads</option>
                                        <option value="instagram">Instagram Ads</option>
                                        <option value="tiktok">TikTok Ads</option>
                                        <option value="twitter">Twitter Ads</option>
                                        <option value="linkedin">LinkedIn Ads</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget (USD)</label>
                                    <input
                                        type="number"
                                        min="5"
                                        value={formData.budget}
                                        onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={handleCreateCampaign}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Create Campaign
                                </button>
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}