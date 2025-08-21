"use client";

import React, { useState, useEffect } from 'react';
import {
    Brain,
    Activity,
    TrendingUp,
    Settings,
    Zap,
    Shield,
    BarChart3,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Clock,
    Cpu,
    Memory,
    Network,
    Database,
    Cloud,
    Gauge,
    Target,
    Lightbulb,
    PlayCircle,
    PauseCircle,
    RotateCcw,
    AlertCircle,
    Info,
    Sparkles,
    Layers,
    GitBranch,
    Workflow
} from 'lucide-react';

interface OrchestratorDashboardProps {
    className?: string;
}

interface ServiceMetrics {
    serviceName: string;
    status: 'healthy' | 'degraded' | 'critical' | 'offline';
    responseTime: number;
    errorRate: number;
    throughput: number;
    memoryUsage: number;
    cpuUsage: number;
    lastCheck: Date;
    uptime: number;
}

interface TrendAnalysis {
    category: string;
    trend: 'rising' | 'stable' | 'declining';
    momentum: number;
    confidence: number;
    keywords: string[];
    socialMentions: number;
    searchVolume: number;
    recommendation: string;
}

interface MarketingDecision {
    id: string;
    type: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    decision: string;
    reasoning: string;
    expectedImpact: number;
    confidence: number;
    timeline: string;
    status: 'pending' | 'approved' | 'executing' | 'completed' | 'failed';
    created_at: Date;
}

export default function AIOrchestrator Dashboard({ className = '' }: OrchestratorDashboardProps) {
    const [orchestratorStatus, setOrchestratorStatus] = useState<any>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [services, setServices] = useState<ServiceMetrics[]>([]);
    const [trends, setTrends] = useState<TrendAnalysis[]>([]);
    const [decisions, setDecisions] = useState<MarketingDecision[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        fetchOrchestratorData();
        const interval = setInterval(fetchOrchestratorData, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchOrchestratorData = async () => {
        try {
            setLoading(true);

            const [statusRes, analyticsRes] = await Promise.all([
                fetch('/api/ai-orchestrator?action=status'),
                fetch('/api/ai-orchestrator?action=analytics'),
            ]);

            if (statusRes.ok) {
                const statusData = await statusRes.json();
                if (statusData.success) {
                    setOrchestratorStatus(statusData.data);
                    setIsRunning(statusData.data.isRunning);
                    setServices(Object.values(statusData.data.services || {}));
                    setTrends(Object.values(statusData.data.trends || {}));
                    setDecisions(statusData.data.recentDecisions || []);
                }
            }

            if (analyticsRes.ok) {
                const analyticsData = await analyticsRes.json();
                if (analyticsData.success) {
                    setAnalytics(analyticsData.data);
                }
            }

        } catch (error) {
            console.error('Error fetching orchestrator data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOrchestratorAction = async (action: string) => {
        try {
            const response = await fetch('/api/ai-orchestrator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setIsRunning(action === 'start' || (action === 'restart'));
                    await fetchOrchestratorData();
                }
            }
        } catch (error) {
            console.error(`Error executing ${action}:`, error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy': return 'text-green-600 bg-green-100';
            case 'degraded': return 'text-yellow-600 bg-yellow-100';
            case 'critical': return 'text-red-600 bg-red-100';
            case 'offline': return 'text-gray-600 bg-gray-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getTrendColor = (trend: string) => {
        switch (trend) {
            case 'rising': return 'text-green-600 bg-green-100';
            case 'stable': return 'text-blue-600 bg-blue-100';
            case 'declining': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'text-red-600 bg-red-100';
            case 'high': return 'text-orange-600 bg-orange-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'low': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    if (loading && !orchestratorStatus) {
        return (
            <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-8 ${className}`}>
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                    <div className="space-y-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded"></div>
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
                            <Brain className="w-6 h-6 text-purple-600" />
                            AI Orchestrator Dashboard
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Central command center for intelligent service management and decision making
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Status Indicator */}
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${isRunning ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500' : 'bg-red-500'
                                    }`}></div>
                                {isRunning ? 'Running' : 'Stopped'}
                            </div>
                        </div>

                        {/* Control Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleOrchestratorAction('start')}
                                disabled={isRunning}
                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <PlayCircle className="w-4 h-4" />
                                Start
                            </button>

                            <button
                                onClick={() => handleOrchestratorAction('stop')}
                                disabled={!isRunning}
                                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <PauseCircle className="w-4 h-4" />
                                Stop
                            </button>

                            <button
                                onClick={() => handleOrchestratorAction('restart')}
                                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Restart
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-1 mt-6">
                    {[
                        { id: 'overview', label: 'Overview', icon: Activity },
                        { id: 'services', label: 'Services', icon: Layers },
                        { id: 'trends', label: 'Trends', icon: TrendingUp },
                        { id: 'decisions', label: 'Decisions', icon: Lightbulb },
                        { id: 'automation', label: 'Automation', icon: Workflow },
                        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === tab.id
                                    ? 'bg-purple-100 text-purple-700'
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
                        {/* System Status Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm">Healthy Services</p>
                                        <p className="text-2xl font-bold">
                                            {analytics?.serviceHealth?.healthy || 0}
                                        </p>
                                    </div>
                                    <CheckCircle className="w-8 h-8 text-green-200" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-yellow-100 text-sm">Degraded Services</p>
                                        <p className="text-2xl font-bold">
                                            {analytics?.serviceHealth?.degraded || 0}
                                        </p>
                                    </div>
                                    <AlertTriangle className="w-8 h-8 text-yellow-200" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-red-100 text-sm">Critical Issues</p>
                                        <p className="text-2xl font-bold">
                                            {analytics?.serviceHealth?.critical || 0}
                                        </p>
                                    </div>
                                    <XCircle className="w-8 h-8 text-red-200" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100 text-sm">Active Decisions</p>
                                        <p className="text-2xl font-bold">
                                            {analytics?.decisionMetrics?.executing || 0}
                                        </p>
                                    </div>
                                    <Brain className="w-8 h-8 text-purple-200" />
                                </div>
                            </div>
                        </div>

                        {/* System Metrics */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Average Response Time</span>
                                        <span className="font-medium">
                                            {orchestratorStatus?.systemMetrics?.averageResponseTime?.toFixed(0) || 0}ms
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Error Rate</span>
                                        <span className="font-medium">
                                            {orchestratorStatus?.systemMetrics?.totalErrorRate?.toFixed(1) || 0}%
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Resource Usage</span>
                                        <span className="font-medium">
                                            {orchestratorStatus?.systemMetrics?.averageResourceUsage?.toFixed(1) || 0}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Analysis</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Rising Trends</span>
                                        <span className="font-medium text-green-600">
                                            {analytics?.trendAnalysis?.rising || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Stable Trends</span>
                                        <span className="font-medium text-blue-600">
                                            {analytics?.trendAnalysis?.stable || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Declining Trends</span>
                                        <span className="font-medium text-red-600">
                                            {analytics?.trendAnalysis?.declining || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Decisions */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent AI Decisions</h3>
                            <div className="space-y-3">
                                {decisions.slice(0, 5).map((decision) => (
                                    <div key={decision.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(decision.priority).split(' ')[1]}`}></div>
                                            <div>
                                                <p className="font-medium text-gray-900">{decision.decision}</p>
                                                <p className="text-sm text-gray-600">{decision.reasoning}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(decision.priority)}`}>
                                                {decision.priority}
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1">{decision.timeline}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'services' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <div key={service.serviceName} className="bg-gray-50 rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-gray-900">{service.serviceName}</h3>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(service.status)}`}>
                                            {service.status}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 text-sm">Response Time</span>
                                            <span className="font-medium">{service.responseTime?.toFixed(0) || 0}ms</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 text-sm">Error Rate</span>
                                            <span className="font-medium">{service.errorRate?.toFixed(1) || 0}%</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 text-sm">CPU Usage</span>
                                            <span className="font-medium">{service.cpuUsage?.toFixed(1) || 0}%</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 text-sm">Memory Usage</span>
                                            <span className="font-medium">{service.memoryUsage?.toFixed(1) || 0}%</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 text-sm">Uptime</span>
                                            <span className="font-medium">{service.uptime?.toFixed(1) || 0}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'trends' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {trends.map((trend) => (
                                <div key={trend.category} className="bg-gray-50 rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-gray-900 capitalize">{trend.category}</h3>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getTrendColor(trend.trend)}`}>
                                            {trend.trend}
                                        </span>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 text-sm">Momentum</span>
                                            <span className="font-medium">{trend.momentum?.toFixed(0) || 0}%</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 text-sm">Confidence</span>
                                            <span className="font-medium">{trend.confidence?.toFixed(0) || 0}%</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 text-sm">Social Mentions</span>
                                            <span className="font-medium">{trend.socialMentions?.toLocaleString() || 0}</span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-gray-600 text-sm mb-2">Keywords</p>
                                        <div className="flex flex-wrap gap-1">
                                            {trend.keywords?.map((keyword, index) => (
                                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg p-3">
                                        <p className="text-sm text-gray-700">{trend.recommendation}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'decisions' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            {decisions.map((decision) => (
                                <div key={decision.id} className="bg-gray-50 rounded-lg p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(decision.priority)}`}>
                                                    {decision.priority}
                                                </span>
                                                <span className="text-gray-500 text-sm">{decision.type}</span>
                                            </div>
                                            <h3 className="font-semibold text-gray-900 mb-2">{decision.decision}</h3>
                                            <p className="text-gray-600 text-sm mb-3">{decision.reasoning}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${decision.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    decision.status === 'executing' ? 'bg-blue-100 text-blue-700' :
                                                        decision.status === 'failed' ? 'bg-red-100 text-red-700' :
                                                            'bg-gray-100 text-gray-700'
                                                }`}>
                                                {decision.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="text-center">
                                            <p className="text-gray-600 text-xs">Expected Impact</p>
                                            <p className="font-semibold text-lg">{decision.expectedImpact}%</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-600 text-xs">Confidence</p>
                                            <p className="font-semibold text-lg">{decision.confidence}%</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-600 text-xs">Timeline</p>
                                            <p className="font-semibold text-lg">{decision.timeline}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'automation' && (
                    <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Automation Overview</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">
                                        {analytics?.automationMetrics?.totalRules || 0}
                                    </p>
                                    <p className="text-gray-600 text-sm">Total Rules</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">
                                        {analytics?.automationMetrics?.activeRules || 0}
                                    </p>
                                    <p className="text-gray-600 text-sm">Active Rules</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-purple-600">
                                        {analytics?.automationMetrics?.averageSuccessRate?.toFixed(1) || 0}%
                                    </p>
                                    <p className="text-gray-600 text-sm">Success Rate</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-orange-600">
                                        {analytics?.automationMetrics?.totalExecutions || 0}
                                    </p>
                                    <p className="text-gray-600 text-sm">Total Executions</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Automation Rules</h3>
                            <p className="text-blue-100 mb-4">
                                The AI orchestrator uses intelligent automation rules to respond to system events and market changes automatically.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white/10 rounded-lg p-4">
                                    <h4 className="font-medium mb-2">Performance Rules</h4>
                                    <p className="text-blue-100 text-sm">Automatically scale services based on performance metrics</p>
                                </div>
                                <div className="bg-white/10 rounded-lg p-4">
                                    <h4 className="font-medium mb-2">Marketing Rules</h4>
                                    <p className="text-blue-100 text-sm">Adjust marketing spend based on trend analysis</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-600 text-sm font-medium">Total Decisions</p>
                                        <p className="text-2xl font-bold text-blue-900">
                                            {analytics?.decisionMetrics?.totalDecisions || 0}
                                        </p>
                                    </div>
                                    <Lightbulb className="w-8 h-8 text-blue-500" />
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-600 text-sm font-medium">Completed</p>
                                        <p className="text-2xl font-bold text-green-900">
                                            {analytics?.decisionMetrics?.completed || 0}
                                        </p>
                                    </div>
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                </div>
                            </div>

                            <div className="bg-yellow-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-yellow-600 text-sm font-medium">Executing</p>
                                        <p className="text-2xl font-bold text-yellow-900">
                                            {analytics?.decisionMetrics?.executing || 0}
                                        </p>
                                    </div>
                                    <Clock className="w-8 h-8 text-yellow-500" />
                                </div>
                            </div>

                            <div className="bg-red-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-red-600 text-sm font-medium">Failed</p>
                                        <p className="text-2xl font-bold text-red-900">
                                            {analytics?.decisionMetrics?.failed || 0}
                                        </p>
                                    </div>
                                    <XCircle className="w-8 h-8 text-red-500" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">AI Intelligence Overview</h3>
                            <p className="text-purple-100 mb-4">
                                The orchestrator continuously learns and adapts, making intelligent decisions based on real-time data analysis.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-200" />
                                    <p className="font-medium">Smart Automation</p>
                                    <p className="text-purple-100 text-sm">Self-optimizing rules</p>
                                </div>
                                <div className="text-center">
                                    <Target className="w-8 h-8 mx-auto mb-2 text-purple-200" />
                                    <p className="font-medium">Predictive Analysis</p>
                                    <p className="text-purple-100 text-sm">Future trend prediction</p>
                                </div>
                                <div className="text-center">
                                    <Gauge className="w-8 h-8 mx-auto mb-2 text-purple-200" />
                                    <p className="font-medium">Performance Optimization</p>
                                    <p className="text-purple-100 text-sm">Continuous improvement</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}