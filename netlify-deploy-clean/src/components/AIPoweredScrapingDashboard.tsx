'use client';

import React, { useState, useEffect } from 'react';
import {
    Play,
    Pause,
    Square,
    Settings,
    Brain,
    Zap,
    Shield,
    TrendingUp,
    BarChart3,
    Activity,
    Target,
    CheckCircle,
    AlertCircle,
    Clock,
    Database,
    Globe,
    Smartphone,
    Monitor,
    Tablet
} from 'lucide-react';

interface AIScrapingConfig {
    source: 'alibaba' | 'aliexpress' | 'amazon' | 'ebay' | 'custom';
    category: string;
    pageCount: number;
    aiFeatures: {
        intelligentElementDetection: boolean;
        adaptiveScraping: boolean;
        contentAnalysis: boolean;
        antiDetection: boolean;
        dynamicSelectorOptimization: boolean;
    };
    automation: {
        autoRetry: boolean;
        smartDelays: boolean;
        proxyRotation: boolean;
        sessionManagement: boolean;
    };
    quality: {
        imageOptimization: boolean;
        dataValidation: boolean;
        duplicateDetection: boolean;
        contentEnrichment: boolean;
    };
}

interface ScrapingSession {
    id: string;
    config: AIScrapingConfig;
    status: 'initializing' | 'running' | 'paused' | 'completed' | 'failed';
    progress: {
        currentPage: number;
        totalPages: number;
        productsFound: number;
        productsProcessed: number;
        errors: number;
        startTime: Date;
        estimatedCompletion?: Date;
    };
    aiMetrics: {
        elementDetectionAccuracy: number;
        contentExtractionSuccess: number;
        antiDetectionScore: number;
        dataQualityScore: number;
    };
}

interface AIScrapingDashboardProps {
    className?: string;
}

export default function AIPoweredScrapingDashboard({ className = '' }: AIScrapingDashboardProps) {
    const [sessions, setSessions] = useState<ScrapingSession[]>([]);
    const [activeConfig, setActiveConfig] = useState<AIScrapingConfig>({
        source: 'alibaba',
        category: 'electronics',
        pageCount: 5,
        aiFeatures: {
            intelligentElementDetection: true,
            adaptiveScraping: true,
            contentAnalysis: true,
            antiDetection: true,
            dynamicSelectorOptimization: true,
        },
        automation: {
            autoRetry: true,
            smartDelays: true,
            proxyRotation: false,
            sessionManagement: true,
        },
        quality: {
            imageOptimization: true,
            dataValidation: true,
            duplicateDetection: true,
            contentEnrichment: true,
        },
    });

    const [isStarting, setIsStarting] = useState(false);
    const [selectedSession, setSelectedSession] = useState<string | null>(null);

    // Mock data for demonstration
    useEffect(() => {
        const mockSessions: ScrapingSession[] = [
            {
                id: 'session_1',
                config: activeConfig,
                status: 'running',
                progress: {
                    currentPage: 3,
                    totalPages: 5,
                    productsFound: 45,
                    productsProcessed: 38,
                    errors: 2,
                    startTime: new Date(Date.now() - 1800000), // 30 minutes ago
                    estimatedCompletion: new Date(Date.now() + 1200000), // 20 minutes from now
                },
                aiMetrics: {
                    elementDetectionAccuracy: 0.92,
                    contentExtractionSuccess: 0.89,
                    antiDetectionScore: 0.95,
                    dataQualityScore: 0.87,
                },
            },
            {
                id: 'session_2',
                config: activeConfig,
                status: 'completed',
                progress: {
                    currentPage: 5,
                    totalPages: 5,
                    productsFound: 78,
                    productsProcessed: 78,
                    errors: 0,
                    startTime: new Date(Date.now() - 3600000), // 1 hour ago
                    estimatedCompletion: new Date(Date.now() - 3000000), // 50 minutes ago
                },
                aiMetrics: {
                    elementDetectionAccuracy: 0.94,
                    contentExtractionSuccess: 0.91,
                    antiDetectionScore: 0.97,
                    dataQualityScore: 0.89,
                },
            },
        ];
        setSessions(mockSessions);
    }, [activeConfig]);

    const startNewSession = async () => {
        setIsStarting(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            const newSession: ScrapingSession = {
                id: `session_${Date.now()}`,
                config: activeConfig,
                status: 'initializing',
                progress: {
                    currentPage: 0,
                    totalPages: activeConfig.pageCount,
                    productsFound: 0,
                    productsProcessed: 0,
                    errors: 0,
                    startTime: new Date(),
                },
                aiMetrics: {
                    elementDetectionAccuracy: 0,
                    contentExtractionSuccess: 0,
                    antiDetectionScore: 0,
                    dataQualityScore: 0,
                },
            };

            setSessions(prev => [newSession, ...prev]);
            setSelectedSession(newSession.id);
        } catch (error) {
            console.error('Failed to start session:', error);
        } finally {
            setIsStarting(false);
        }
    };

    const controlSession = (sessionId: string, action: 'pause' | 'resume' | 'stop') => {
        setSessions(prev => prev.map(session => {
            if (session.id === sessionId) {
                switch (action) {
                    case 'pause':
                        return { ...session, status: 'paused' as const };
                    case 'resume':
                        return { ...session, status: 'running' as const };
                    case 'stop':
                        return { ...session, status: 'failed' as const };
                    default:
                        return session;
                }
            }
            return session;
        }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'running': return 'text-green-600 bg-green-100';
            case 'paused': return 'text-yellow-600 bg-yellow-100';
            case 'completed': return 'text-blue-600 bg-blue-100';
            case 'failed': return 'text-red-600 bg-red-100';
            case 'initializing': return 'text-purple-600 bg-purple-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'running': return <Activity className="w-4 h-4" />;
            case 'paused': return <Pause className="w-4 h-4" />;
            case 'completed': return <CheckCircle className="w-4 h-4" />;
            case 'failed': return <AlertCircle className="w-4 h-4" />;
            case 'initializing': return <Clock className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const formatDuration = (startTime: Date, endTime?: Date) => {
        const duration = endTime ? endTime.getTime() - startTime.getTime() : Date.now() - startTime.getTime();
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    };

    const getProgressPercentage = (current: number, total: number) => {
        return total > 0 ? (current / total) * 100 : 0;
    };

    return (
        <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">AI-Powered Scraping Dashboard</h2>
                        <p className="text-gray-600">Intelligent web scraping with machine learning</p>
                    </div>
                </div>
                <button
                    onClick={startNewSession}
                    disabled={isStarting}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                    {isStarting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Play className="w-5 h-5" />
                    )}
                    <span>{isStarting ? 'Starting...' : 'Start New Session'}</span>
                </button>
            </div>

            {/* AI Features Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                        <Target className="w-8 h-8 text-blue-600" />
                        <div>
                            <p className="text-sm font-medium text-blue-800">Element Detection</p>
                            <p className="text-2xl font-bold text-blue-900">92%</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                        <Zap className="w-8 h-8 text-green-600" />
                        <div>
                            <p className="text-sm font-medium text-green-800">Content Extraction</p>
                            <p className="text-2xl font-bold text-green-900">89%</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-3">
                        <Shield className="w-8 h-8 text-purple-600" />
                        <div>
                            <p className="text-sm font-medium text-purple-800">Anti-Detection</p>
                            <p className="text-2xl font-bold text-purple-900">95%</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center space-x-3">
                        <TrendingUp className="w-8 h-8 text-orange-600" />
                        <div>
                            <p className="text-sm font-medium text-orange-800">Data Quality</p>
                            <p className="text-2xl font-bold text-orange-900">87%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Configuration Panel */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">AI Configuration</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Source Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Data Source</label>
                        <select
                            value={activeConfig.source}
                            onChange={(e) => setActiveConfig(prev => ({ ...prev, source: e.target.value as any }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="alibaba">Alibaba</option>
                            <option value="aliexpress">AliExpress</option>
                            <option value="amazon">Amazon</option>
                            <option value="ebay">eBay</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <input
                            type="text"
                            value={activeConfig.category}
                            onChange={(e) => setActiveConfig(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., electronics, clothing"
                        />
                    </div>

                    {/* Page Count */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pages to Scrape</label>
                        <input
                            type="number"
                            value={activeConfig.pageCount}
                            onChange={(e) => setActiveConfig(prev => ({ ...prev, pageCount: parseInt(e.target.value) }))}
                            min="1"
                            max="100"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* AI Features Toggles */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(activeConfig.aiFeatures).map(([key, value]) => (
                        <label key={key} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => setActiveConfig(prev => ({
                                    ...prev,
                                    aiFeatures: { ...prev.aiFeatures, [key]: e.target.checked }
                                }))}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Active Sessions */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>

                {sessions.map((session) => (
                    <div
                        key={session.id}
                        className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer ${selectedSession === session.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        onClick={() => setSelectedSession(session.id)}
                    >
                        {/* Session Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-full ${getStatusColor(session.status)}`}>
                                    {getStatusIcon(session.status)}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">
                                        Session {session.id.slice(-8)}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {session.config.source} • {session.config.category}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                {session.status === 'running' && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); controlSession(session.id, 'pause'); }}
                                        className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                                    >
                                        <Pause className="w-4 h-4" />
                                    </button>
                                )}

                                {session.status === 'paused' && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); controlSession(session.id, 'resume'); }}
                                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                    >
                                        <Play className="w-4 h-4" />
                                    </button>
                                )}

                                <button
                                    onClick={(e) => { e.stopPropagation(); controlSession(session.id, 'stop'); }}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                    <Square className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Page {session.progress.currentPage} of {session.progress.totalPages}</span>
                                <span>{Math.round(getProgressPercentage(session.progress.currentPage, session.progress.totalPages))}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${getProgressPercentage(session.progress.currentPage, session.progress.totalPages)}%` }}
                                />
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">{session.progress.productsFound}</p>
                                <p className="text-xs text-gray-600">Products Found</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">{session.progress.productsProcessed}</p>
                                <p className="text-xs text-gray-600">Processed</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-red-600">{session.progress.errors}</p>
                                <p className="text-xs text-gray-600">Errors</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-600">
                                    {formatDuration(session.progress.startTime, session.progress.estimatedCompletion)}
                                </p>
                                <p className="text-xs text-gray-600">Duration</p>
                            </div>
                        </div>

                        {/* AI Metrics */}
                        {session.aiMetrics.elementDetectionAccuracy > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <h5 className="text-sm font-medium text-gray-700 mb-2">AI Performance Metrics</h5>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="text-center">
                                        <div className="w-12 h-12 mx-auto mb-1 rounded-full bg-blue-100 flex items-center justify-center">
                                            <span className="text-xs font-bold text-blue-700">
                                                {Math.round(session.aiMetrics.elementDetectionAccuracy * 100)}%
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600">Detection</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 mx-auto mb-1 rounded-full bg-green-100 flex items-center justify-center">
                                            <span className="text-xs font-bold text-green-700">
                                                {Math.round(session.aiMetrics.contentExtractionSuccess * 100)}%
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600">Extraction</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 mx-auto mb-1 rounded-full bg-purple-100 flex items-center justify-center">
                                            <span className="text-xs font-bold text-purple-700">
                                                {Math.round(session.aiMetrics.antiDetectionScore * 100)}%
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600">Stealth</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 mx-auto mb-1 rounded-full bg-orange-100 flex items-center justify-center">
                                            <span className="text-xs font-bold text-orange-700">
                                                {Math.round(session.aiMetrics.dataQualityScore * 100)}%
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600">Quality</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {sessions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <Database className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No active scraping sessions</p>
                        <p className="text-sm">Start a new session to begin AI-powered scraping</p>
                    </div>
                )}
            </div>

            {/* Real-time Insights */}
            <div className="mt-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Current Performance</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {sessions.filter(s => s.status === 'running').length > 0
                                ? 'Optimal scraping performance detected'
                                : 'Ready to start scraping'
                            }
                        </p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">AI Recommendations</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {activeConfig.aiFeatures.antiDetection
                                ? 'Stealth mode active - low detection risk'
                                : 'Consider enabling anti-detection features'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}