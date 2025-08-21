"use client";

import React, { useState, useEffect } from 'react';
import { useThemeStyles } from '@/hooks/useThemeStyles';
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Brain,
  Shield,
  Target,
  BarChart3,
  Cpu,
  Memory,
  Clock,
  Users,
  DollarSign,
  Globe,
  Database,
  Server,
  Network,
  Monitor,
  Gauge,
  TrendingDown,
  Minus,
  Plus
} from 'lucide-react';

interface ServiceStatus {
  serviceName: string;
  status: 'healthy' | 'degraded' | 'critical' | 'offline';
  responseTime: number;
  errorRate: number;
  throughput: number;
  memoryUsage: number;
  cpuUsage: number;
  lastCheck: string;
  uptime: number;
}

interface TrendData {
  category: string;
  trend: 'rising' | 'stable' | 'declining';
  momentum: number;
  confidence: number;
  keywords: string[];
  socialMentions: number;
  searchVolume: number;
  competitorActivity: number;
  predictedGrowth: number;
  recommendation: string;
}

interface Decision {
  id: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  decision: string;
  reasoning: string;
  expectedImpact: number;
  confidence: number;
  resources_required: any;
  timeline: string;
  success_metrics: string[];
  created_at: string;
  status: string;
}

interface OrchestratorStatus {
  isRunning: boolean;
  services: Record<string, ServiceStatus>;
  trends: Record<string, TrendData>;
  recentDecisions: Decision[];
  systemMetrics: {
    averageResponseTime: number;
    totalErrorRate: number;
    averageResourceUsage: number;
    healthyServices: number;
    totalServices: number;
  };
  automationRules: number;
  lastCycleTime: string;
}

export default function AIOrchestratorDashboard() {
  const styles = useThemeStyles();
  const [status, setStatus] = useState<OrchestratorStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Fetch orchestrator status
  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/ai-orchestrator?action=status');
      const data = await response.json();
      if (data.success) {
        setStatus(data.data);
        setError(null);
      } else {
        setError('Failed to fetch status');
      }
    } catch (err) {
      setError('Error connecting to orchestrator');
    } finally {
      setLoading(false);
    }
  };

  // Control orchestrator
  const controlOrchestrator = async (action: string) => {
    try {
      const response = await fetch('/api/ai-orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await response.json();
      if (data.success) {
        await fetchStatus(); // Refresh status
      }
    } catch (err) {
      setError(`Failed to ${action} orchestrator`);
    }
  };

  // Force analysis
  const forceAnalysis = async () => {
    try {
      const response = await fetch('/api/ai-orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'force-analysis' })
      });
      const data = await response.json();
      if (data.success) {
        await fetchStatus(); // Refresh status
      }
    } catch (err) {
      setError('Failed to force analysis');
    }
  };

  // Emergency override
  const emergencyOverride = async (serviceName: string, action: string) => {
    try {
      const response = await fetch('/api/ai-orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'emergency-override',
          serviceName,
          action
        })
      });
      const data = await response.json();
      if (data.success) {
        await fetchStatus(); // Refresh status
      }
    } catch (err) {
      setError('Failed to execute emergency override');
    }
  };

  // Optimize system
  const optimizeSystem = async (type: string) => {
    try {
      const response = await fetch('/api/ai-orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'optimize-system',
          optimizationType: type
        })
      });
      const data = await response.json();
      if (data.success) {
        await fetchStatus(); // Refresh status
      }
    } catch (err) {
      setError('Failed to optimize system');
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    fetchStatus();

    if (autoRefresh) {
      const interval = setInterval(fetchStatus, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  if (loading) {
    return (
      <div className={`min-h-screen ${styles.bg.primary} ${styles.text.primary} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Initializing AI Orchestrator...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${styles.bg.primary} ${styles.text.primary} flex items-center justify-center`}>
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchStatus}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className={`min-h-screen ${styles.bg.primary} ${styles.text.primary} flex items-center justify-center`}>
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl">No orchestrator status available</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      case 'offline': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5" />;
      case 'degraded': return <AlertTriangle className="w-5 h-5" />;
      case 'critical': return <XCircle className="w-5 h-5" />;
      case 'offline': return <XCircle className="w-5 h-5" />;
      default: return <XCircle className="w-5 h-5" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'stable': return <Minus className="w-5 h-5 text-yellow-500" />;
      case 'declining': return <TrendingDown className="w-5 h-5 text-red-500" />;
      default: return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className={`min-h-screen ${styles.bg.primary} ${styles.text.primary}`}>
      {/* Header */}
      <header className={`${styles.bg.card} ${styles.border.primary} border-b sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold">AI Orchestrator Dashboard</h1>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                status.isRunning
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {status.isRunning ? 'RUNNING' : 'STOPPED'}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Auto-refresh toggle */}
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Auto-refresh</span>
              </label>

              {/* Control buttons */}
              <div className="flex space-x-2">
                {status.isRunning ? (
                  <button
                    onClick={() => controlOrchestrator('stop')}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Stop</span>
                  </button>
                ) : (
                  <button
                    onClick={() => controlOrchestrator('start')}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start</span>
                  </button>
                )}

                <button
                  onClick={() => controlOrchestrator('restart')}
                  className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restart</span>
                </button>

                <button
                  onClick={forceAnalysis}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Force Analysis</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`${styles.bg.card} ${styles.border.primary} border rounded-xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Health</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((status.systemMetrics.healthyServices / status.systemMetrics.totalServices) * 100)}%
                </p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {status.systemMetrics.healthyServices} of {status.systemMetrics.totalServices} services healthy
            </p>
          </div>

          <div className={`${styles.bg.card} ${styles.border.primary} border rounded-xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response Time</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(status.systemMetrics.averageResponseTime)}ms
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {status.systemMetrics.averageResponseTime > 1000 ? 'High latency detected' : 'Normal performance'}
            </p>
          </div>

          <div className={`${styles.bg.card} ${styles.border.primary} border rounded-xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Error Rate</p>
                <p className="text-2xl font-bold text-red-600">
                  {status.systemMetrics.totalErrorRate.toFixed(1)}%
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {status.systemMetrics.totalErrorRate > 5 ? 'Critical error rate' : 'Acceptable error rate'}
            </p>
          </div>

          <div className={`${styles.bg.card} ${styles.border.primary} border rounded-xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resource Usage</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(status.systemMetrics.averageResourceUsage)}%
                </p>
              </div>
              <Cpu className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {status.systemMetrics.averageResourceUsage > 80 ? 'High resource usage' : 'Normal resource usage'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Monitoring */}
          <div className={`${styles.bg.card} ${styles.border.primary} border rounded-xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <Server className="w-6 h-6 text-blue-500" />
                <span>Service Monitoring</span>
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => optimizeSystem('performance')}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  Optimize
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Object.entries(status.services).map(([name, service]) => (
                <div
                  key={name}
                  className={`p-4 rounded-lg border ${
                    service.status === 'critical' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20' :
                    service.status === 'degraded' ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20' :
                    'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(service.status)}
                      <span className="font-medium">{name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                        {service.status}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => emergencyOverride(name, 'restart')}
                        className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                      >
                        Restart
                      </button>
                      <button
                        onClick={() => setSelectedService(selectedService === name ? null : name)}
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                      >
                        {selectedService === name ? 'Hide' : 'Details'}
                      </button>
                    </div>
                  </div>

                  {selectedService === name && (
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Response Time:</span>
                          <span className="ml-2 font-medium">{Math.round(service.responseTime)}ms</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Error Rate:</span>
                          <span className="ml-2 font-medium">{service.errorRate.toFixed(2)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">CPU:</span>
                          <span className="ml-2 font-medium">{Math.round(service.cpuUsage)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Memory:</span>
                          <span className="ml-2 font-medium">{Math.round(service.memoryUsage)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Trend Analysis */}
          <div className={`${styles.bg.card} ${styles.border.primary} border rounded-xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-green-500" />
                <span>Market Trends</span>
              </h2>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(status.trends).map(([category, trend]) => (
                <div key={category} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(trend.trend)}
                      <span className="font-medium capitalize">{category}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trend.trend === 'rising' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      trend.trend === 'stable' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {trend.trend}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Momentum:</span>
                      <span className="ml-2 font-medium">{Math.round(trend.momentum)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
                      <span className="ml-2 font-medium">{Math.round(trend.confidence)}%</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400">{trend.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Decisions */}
        <div className="mt-8">
          <div className={`${styles.bg.card} ${styles.border.primary} border rounded-xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <Brain className="w-6 h-6 text-purple-500" />
                <span>AI Decisions & Actions</span>
              </h2>
              <span className="text-sm text-gray-500">
                Last updated: {new Date(status.lastCycleTime).toLocaleString()}
              </span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {status.recentDecisions.map((decision) => (
                <div key={decision.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(decision.priority)}`}>
                        {decision.priority.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">{decision.type}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(decision.created_at).toLocaleTimeString()}
                    </span>
                  </div>

                  <h4 className="font-medium mb-2">{decision.decision}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{decision.reasoning}</p>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Impact:</span>
                      <span className="ml-2 font-medium">{decision.expectedImpact}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
                      <span className="ml-2 font-medium">{decision.confidence}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Timeline:</span>
                      <span className="ml-2 font-medium">{decision.timeline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className={`${styles.bg.card} ${styles.border.primary} border rounded-xl p-6 shadow-lg`}>
            <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              <span>Quick Actions</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => optimizeSystem('performance')}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <Gauge className="w-8 h-8 text-blue-500 mb-2" />
                <h3 className="font-medium">Performance Optimization</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Optimize system performance and response times</p>
              </button>

              <button
                onClick={() => optimizeSystem('reliability')}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <Shield className="w-8 h-8 text-green-500 mb-2" />
                <h3 className="font-medium">Reliability Boost</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Improve system reliability and error handling</p>
              </button>

              <button
                onClick={() => optimizeSystem('cost')}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <DollarSign className="w-8 h-8 text-purple-500 mb-2" />
                <h3 className="font-medium">Cost Optimization</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Optimize resource usage and costs</p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}