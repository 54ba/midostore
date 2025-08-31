"use client";

import React, { useState, useEffect } from 'react';
import {
    Brain,
    Zap,
    Settings,
    Play,
    Pause,
    RotateCcw,
    BarChart3,
    Activity,
    Cpu,
    Network,
    Database,
    Shield,
    Clock,
    TrendingUp,
    Users,
    Target
} from 'lucide-react';

interface AIAgent {
    id: string;
    name: string;
    type: string;
    status: 'active' | 'idle' | 'processing' | 'error';
    performance: number;
    lastActivity: string;
    tasksCompleted: number;
    currentTask?: string;
}

interface OrchestrationTask {
    id: string;
    name: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'running' | 'completed' | 'failed';
    assignedAgent?: string;
    progress: number;
    estimatedTime: string;
    createdAt: string;
}

export default function AIOrchestratorPage() {
    const [agents, setAgents] = useState<AIAgent[]>([
        {
            id: 'agent-1',
            name: 'Data Processor Alpha',
            type: 'Data Analysis',
            status: 'active',
            performance: 94,
            lastActivity: '2 minutes ago',
            tasksCompleted: 156,
            currentTask: 'Processing market trends'
        },
        {
            id: 'agent-2',
            name: 'Recommendation Engine Beta',
            type: 'AI Recommendations',
            status: 'processing',
            performance: 87,
            lastActivity: '1 minute ago',
            tasksCompleted: 89,
            currentTask: 'Generating user suggestions'
        },
        {
            id: 'agent-3',
            name: 'Scraping Bot Gamma',
            type: 'Data Collection',
            status: 'idle',
            performance: 92,
            lastActivity: '5 minutes ago',
            tasksCompleted: 234,
        },
        {
            id: 'agent-4',
            name: 'Analytics Master Delta',
            type: 'Business Intelligence',
            status: 'active',
            performance: 96,
            lastActivity: '30 seconds ago',
            tasksCompleted: 312,
            currentTask: 'Revenue analysis'
        }
    ]);

    const [tasks, setTasks] = useState<OrchestrationTask[]>([
        {
            id: 'task-1',
            name: 'Market Trend Analysis',
            priority: 'high',
            status: 'running',
            assignedAgent: 'Data Processor Alpha',
            progress: 75,
            estimatedTime: '5 minutes',
            createdAt: '10 minutes ago'
        },
        {
            id: 'task-2',
            name: 'User Preference Learning',
            priority: 'medium',
            status: 'pending',
            progress: 0,
            estimatedTime: '15 minutes',
            createdAt: '2 minutes ago'
        },
        {
            id: 'task-3',
            name: 'Competitor Price Monitoring',
            priority: 'critical',
            status: 'running',
            assignedAgent: 'Scraping Bot Gamma',
            progress: 45,
            estimatedTime: '8 minutes',
            createdAt: '5 minutes ago'
        }
    ]);

    const [systemStatus, setSystemStatus] = useState({
        overallHealth: 92,
        activeAgents: 2,
        totalTasks: 3,
        completedTasks: 156,
        systemLoad: 67,
        memoryUsage: 78,
        networkLatency: 12
    });

    const [isOrchestrating, setIsOrchestrating] = useState(true);

    useEffect(() => {
        // Simulate real-time updates
        const interval = setInterval(() => {
            setSystemStatus(prev => ({
                ...prev,
                systemLoad: Math.max(20, Math.min(95, prev.systemLoad + (Math.random() - 0.5) * 10)),
                memoryUsage: Math.max(60, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 5))
            }));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const toggleOrchestration = () => {
        setIsOrchestrating(!isOrchestrating);
    };

    const restartAgent = (agentId: string) => {
        setAgents(prev => prev.map(agent =>
            agent.id === agentId
                ? { ...agent, status: 'idle' as const, performance: Math.max(80, agent.performance - 5) }
                : agent
        ));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-green-500';
            case 'processing': return 'text-blue-500';
            case 'idle': return 'text-yellow-500';
            case 'error': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'low': return 'bg-gray-100 text-gray-800';
            case 'medium': return 'bg-blue-100 text-blue-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'critical': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <Brain className="w-8 h-8 text-purple-600" />
                                AI Orchestrator
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Intelligent coordination and management of AI agents and tasks
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${isOrchestrating ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {isOrchestrating ? 'Active' : 'Paused'}
                                </span>
                            </div>
                            <button
                                onClick={toggleOrchestration}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isOrchestrating
                                        ? 'bg-red-600 hover:bg-red-700 text-white'
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                            >
                                {isOrchestrating ? (
                                    <>
                                        <Pause className="w-4 h-4 inline mr-2" />
                                        Pause
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 inline mr-2" />
                                        Start
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* System Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Health</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{systemStatus.overallHealth}%</p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                <Activity className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${systemStatus.overallHealth}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Agents</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{systemStatus.activeAgents}</p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <Cpu className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {agents.length} total agents
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Load</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{systemStatus.systemLoad}%</p>
                            </div>
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Memory: {systemStatus.memoryUsage}%
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tasks Completed</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{systemStatus.completedTasks}</p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                <Target className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {tasks.length} pending
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* AI Agents */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Cpu className="w-5 h-5 text-blue-600" />
                                AI Agents
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {agents.map((agent) => (
                                    <div key={agent.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white">{agent.name}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{agent.type}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-sm font-medium ${getStatusColor(agent.status)}`}>
                                                    {agent.status}
                                                </span>
                                                <button
                                                    onClick={() => restartAgent(agent.id)}
                                                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                                    title="Restart Agent"
                                                >
                                                    <RotateCcw className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Performance</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{agent.performance}%</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Tasks Completed</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{agent.tasksCompleted}</p>
                                            </div>
                                        </div>

                                        {agent.currentTask && (
                                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Current Task</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{agent.currentTask}</p>
                                            </div>
                                        )}

                                        <div className="mt-3 text-xs text-gray-400">
                                            Last activity: {agent.lastActivity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Orchestration Tasks */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Settings className="w-5 h-5 text-green-600" />
                                Orchestration Tasks
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {tasks.map((task) => (
                                    <div key={task.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white">{task.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                        {task.priority}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            task.status === 'running' ? 'bg-blue-100 text-blue-800' :
                                                                task.status === 'failed' ? 'bg-red-100 text-red-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {task.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <span className="text-gray-500 dark:text-gray-400">Progress</span>
                                                <span className="text-gray-900 dark:text-white">{task.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${task.status === 'completed' ? 'bg-green-500' :
                                                            task.status === 'running' ? 'bg-blue-500' :
                                                                task.status === 'failed' ? 'bg-red-500' :
                                                                    'bg-gray-400'
                                                        }`}
                                                    style={{ width: `${task.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Estimated Time</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{task.estimatedTime}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Assigned To</p>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {task.assignedAgent || 'Unassigned'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-3 text-xs text-gray-400">
                                            Created: {task.createdAt}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Metrics */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-indigo-600" />
                            System Metrics
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {systemStatus.networkLatency}ms
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Network Latency</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {systemStatus.memoryUsage}%
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Memory Usage</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {systemStatus.systemLoad}%
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">CPU Load</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}