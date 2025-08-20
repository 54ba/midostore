'use client';

import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, BarChart3, Settings, Play, RefreshCw, Download, Activity } from 'lucide-react';
import AIRecommendations from '../../../components/AIRecommendations';

interface ModelStatus {
    isReady: boolean;
    lastTraining: string | null;
    modelPath: string;
}

interface Analytics {
    modelStatus: string;
    lastTraining: string | null;
    totalInteractions: number;
    activeUsers: number;
    recommendationAccuracy: number;
}

export default function AIRecommendationsDashboard() {
    const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [training, setTraining] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'analytics' | 'settings'>('overview');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statusResponse, analyticsResponse] = await Promise.all([
                fetch('/api/recommendations/analytics?action=status'),
                fetch('/api/recommendations/analytics?action=analytics')
            ]);

            if (statusResponse.ok) {
                const statusData = await statusResponse.json();
                setModelStatus(statusData.data);
            }

            if (analyticsResponse.ok) {
                const analyticsData = await analyticsResponse.json();
                setAnalytics(analyticsData.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTrainModel = async () => {
        try {
            setTraining(true);
            const response = await fetch('/api/recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'train' })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    alert('Model training started successfully! This may take several minutes.');
                    // Refresh data after a delay
                    setTimeout(fetchDashboardData, 5000);
                } else {
                    alert('Model training failed. Please check the logs.');
                }
            }
        } catch (error) {
            console.error('Error training model:', error);
            alert('Error training model. Please try again.');
        } finally {
            setTraining(false);
        }
    };

    const handleExportData = async () => {
        try {
            setExporting(true);
            const response = await fetch('/api/recommendations/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'export-data' })
            });

            if (response.ok) {
                alert('Training data exported successfully!');
            } else {
                alert('Failed to export training data.');
            }
        } catch (error) {
            console.error('Error exporting data:', error);
            alert('Error exporting data. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    const handleRetrainModel = async () => {
        try {
            setTraining(true);
            const response = await fetch('/api/recommendations/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'retrain' })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    alert('Model retraining started successfully! This may take several minutes.');
                    setTimeout(fetchDashboardData, 5000);
                } else {
                    alert('Model retraining failed. Please check the logs.');
                }
            }
        } catch (error) {
            console.error('Error retraining model:', error);
            alert('Error retraining model. Please try again.');
        } finally {
            setTraining(false);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleString();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Ready':
                return 'text-green-600 bg-green-100';
            case 'Not Ready':
                return 'text-red-600 bg-red-100';
            case 'Training':
                return 'text-yellow-600 bg-yellow-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="bg-white p-6 rounded-lg shadow">
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Brain className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">AI Recommendations Dashboard</h1>
                    </div>
                    <p className="text-gray-600">
                        Manage and monitor your AI-powered product recommendation system
                    </p>
                </div>

                {/* Navigation Tabs */}
                <div className="mb-6">
                    <nav className="flex space-x-8 border-b border-gray-200">
                        {[
                            { id: 'overview', label: 'Overview', icon: Activity },
                            { id: 'recommendations', label: 'Recommendations', icon: TrendingUp },
                            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                            { id: 'settings', label: 'Settings', icon: Settings }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Status Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Model Status</p>
                                        <p className={`text-2xl font-bold ${getStatusColor(analytics?.modelStatus || 'Unknown')}`}>
                                            {analytics?.modelStatus || 'Unknown'}
                                        </p>
                                    </div>
                                    <Brain className="w-8 h-8 text-blue-600" />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Interactions</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {analytics?.totalInteractions.toLocaleString() || 0}
                                        </p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-green-600" />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Recommendation Accuracy</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {analytics?.recommendationAccuracy ? `${(analytics.recommendationAccuracy * 100).toFixed(1)}%` : 'N/A'}
                                        </p>
                                    </div>
                                    <BarChart3 className="w-8 h-8 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={handleTrainModel}
                                    disabled={training}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {training ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                                    {training ? 'Training...' : 'Train Model'}
                                </button>

                                <button
                                    onClick={handleRetrainModel}
                                    disabled={training}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Retrain Model
                                </button>

                                <button
                                    onClick={handleExportData}
                                    disabled={exporting}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Download className="w-4 h-4" />
                                    {exporting ? 'Exporting...' : 'Export Data'}
                                </button>
                            </div>
                        </div>

                        {/* Model Information */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Last Training</p>
                                    <p className="text-gray-900">{formatDate(modelStatus?.lastTraining || null)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Model Path</p>
                                    <p className="text-sm text-gray-900 font-mono">{modelStatus?.modelPath}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                                    <p className="text-gray-900">{analytics?.activeUsers.toLocaleString() || 0}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Model Ready</p>
                                    <p className={`font-semibold ${modelStatus?.isReady ? 'text-green-600' : 'text-red-600'}`}>
                                        {modelStatus?.isReady ? 'Yes' : 'No'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recommendations Tab */}
                {activeTab === 'recommendations' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalized Recommendations</h3>
                            <AIRecommendations type="personalized" nItems={8} showTitle={false} />
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Products</h3>
                            <AIRecommendations type="popular" nItems={8} showTitle={false} />
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <p className="text-2xl font-bold text-blue-600">{analytics?.totalInteractions.toLocaleString() || 0}</p>
                                    <p className="text-sm text-gray-600">Total Interactions</p>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-600">{analytics?.activeUsers.toLocaleString() || 0}</p>
                                    <p className="text-sm text-gray-600">Active Users</p>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <p className="text-2xl font-bold text-purple-600">
                                        {analytics?.recommendationAccuracy ? `${(analytics.recommendationAccuracy * 100).toFixed(1)}%` : 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">Accuracy</p>
                                </div>
                                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {modelStatus?.isReady ? 'Active' : 'Inactive'}
                                    </p>
                                    <p className="text-sm text-gray-600">Model Status</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Training History</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium">Last Training</span>
                                    <span className="text-gray-600">{formatDate(analytics?.lastTraining || null)}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium">Model Path</span>
                                    <span className="text-sm text-gray-600 font-mono">{modelStatus?.modelPath}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium">Model Ready</span>
                                    <span className={`font-semibold ${modelStatus?.isReady ? 'text-green-600' : 'text-red-600'}`}>
                                        {modelStatus?.isReady ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Configuration</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Training Epochs
                                    </label>
                                    <input
                                        type="number"
                                        defaultValue={100}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Learning Rate
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        defaultValue={0.05}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Loss Function
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="warp">WARP (Recommended)</option>
                                        <option value="bpr">BPR</option>
                                        <option value="warp-kos">WARP-KOS</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
                            <div className="space-y-4">
                                <button
                                    onClick={handleExportData}
                                    disabled={exporting}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    <Download className="w-4 h-4" />
                                    {exporting ? 'Exporting Training Data...' : 'Export Training Data'}
                                </button>
                                <p className="text-sm text-gray-600">
                                    Export your current data for model training and analysis.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}