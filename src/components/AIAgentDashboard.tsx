"use client";

import React, { useState, useEffect } from 'react';
import {
  Bot,
  Brain,
  MessageSquare,
  Activity,
  TrendingUp,
  Shield,
  Zap,
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Send,
  Lightbulb,
  BarChart3,
  Target,
  Workflow,
  Command,
  Cpu,
  Database,
  Network,
  AlertCircle,
  ArrowRight,
  MessageCircle
} from 'lucide-react';

interface AIAgentDashboardProps {
  className?: string;
}

interface Agent {
  id: string;
  name: string;
  description: string;
  specialization: string;
  capabilities: string[];
  status?: 'active' | 'idle' | 'busy';
}

interface Task {
  id: string;
  type: string;
  description: string;
  assignedAgent: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  result?: any;
}

interface Conversation {
  id: string;
  agentId: string;
  messages: any[];
  timestamp: string;
}

export default function AIAgentDashboard({ className = '' }: AIAgentDashboardProps) {
  const [supervisorStatus, setSupervisorStatus] = useState<any>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [chatMessage, setChatMessage] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    fetchAgentData();
    const interval = setInterval(fetchAgentData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAgentData = async () => {
    try {
      setLoading(true);

      const [statusRes, agentsRes, tasksRes, conversationsRes] = await Promise.all([
        fetch('/api/ai-agent-supervisor?action=status'),
        fetch('/api/ai-agent-supervisor?action=agents'),
        fetch('/api/ai-agent-supervisor?action=tasks'),
        fetch('/api/ai-agent-supervisor?action=conversations'),
      ]);

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        if (statusData.success) {
          setSupervisorStatus(statusData.data);
          setIsActive(statusData.data.isActive);
        }
      }

      if (agentsRes.ok) {
        const agentsData = await agentsRes.json();
        if (agentsData.success) {
          setAgents(agentsData.data);
        }
      }

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        if (tasksData.success) {
          setTasks(tasksData.data);
        }
      }

      if (conversationsRes.ok) {
        const conversationsData = await conversationsRes.json();
        if (conversationsData.success) {
          setConversations(conversationsData.data);
        }
      }

    } catch (error) {
      console.error('Error fetching agent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSupervisorAction = async (action: string) => {
    try {
      const response = await fetch('/api/ai-agent-supervisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsActive(action === 'start');
          await fetchAgentData();
        }
      }
    } catch (error) {
      console.error(`Error executing ${action}:`, error);
    }
  };

  const sendMessageToAgent = async () => {
    if (!selectedAgent || !chatMessage.trim()) return;

    try {
      const response = await fetch('/api/ai-agent-supervisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'communicate',
          agentId: selectedAgent,
          message: chatMessage,
          context: { priority: 'high', source: 'dashboard' }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setChatMessage('');
          await fetchAgentData(); // Refresh to get new conversations
        }
      }
    } catch (error) {
      console.error('Error sending message to agent:', error);
    }
  };

  const executeQuickAction = async (actionType: string) => {
    try {
      const response = await fetch('/api/ai-agent-supervisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionType }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          await fetchAgentData();
        }
      }
    } catch (error) {
      console.error(`Error executing ${actionType}:`, error);
    }
  };

  const getAgentIcon = (agentId: string) => {
    switch (agentId) {
      case 'system-analyst': return <Activity className="w-5 h-5" />;
      case 'business-intelligence': return <TrendingUp className="w-5 h-5" />;
      case 'crisis-manager': return <Shield className="w-5 h-5" />;
      case 'optimizer': return <Zap className="w-5 h-5" />;
      case 'decision-supervisor': return <Eye className="w-5 h-5" />;
      default: return <Bot className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'completed': return 'text-green-600 bg-green-100';
      case 'executing': case 'busy': return 'text-blue-600 bg-blue-100';
      case 'pending': case 'idle': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
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

  if (loading && !supervisorStatus) {
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
              AI Agent Supervisor
            </h2>
            <p className="text-gray-600 mt-1">
              LangChain-powered AI agents that communicate with and supervise the orchestrator
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Status Indicator */}
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  isActive ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                {isActive ? 'Active' : 'Inactive'}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSupervisorAction('start')}
                disabled={isActive}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start
              </button>

              <button
                onClick={() => handleSupervisorAction('stop')}
                disabled={!isActive}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Pause className="w-4 h-4" />
                Stop
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mt-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'agents', label: 'AI Agents', icon: Bot },
            { id: 'communication', label: 'Communication', icon: MessageSquare },
            { id: 'tasks', label: 'Tasks', icon: CheckCircle },
            { id: 'supervision', label: 'Supervision', icon: Eye },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id
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
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Available Agents</p>
                    <p className="text-2xl font-bold">{agents.length}</p>
                  </div>
                  <Bot className="w-8 h-8 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Active Tasks</p>
                    <p className="text-2xl font-bold">
                      {supervisorStatus?.activeTasks || 0}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Conversations</p>
                    <p className="text-2xl font-bold">
                      {supervisorStatus?.totalConversations || 0}
                    </p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-purple-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Completed Tasks</p>
                    <p className="text-2xl font-bold">
                      {supervisorStatus?.completedTasks || 0}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-orange-200" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Analysis</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => executeQuickAction('analyze-system')}
                    className="w-full flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <Cpu className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">System Analysis</p>
                      <p className="text-sm text-gray-600">Comprehensive system performance review</p>
                    </div>
                  </button>

                  <button
                    onClick={() => executeQuickAction('business-intelligence')}
                    className="w-full flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all"
                  >
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Business Intelligence</p>
                      <p className="text-sm text-gray-600">Market trends and strategic insights</p>
                    </div>
                  </button>

                  <button
                    onClick={() => executeQuickAction('crisis-assessment')}
                    className="w-full flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-sm transition-all"
                  >
                    <Shield className="w-5 h-5 text-red-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Crisis Assessment</p>
                      <p className="text-sm text-gray-600">Risk evaluation and emergency planning</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Orchestrator Supervision</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => executeQuickAction('optimization-review')}
                    className="w-full flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all"
                  >
                    <Zap className="w-5 h-5 text-purple-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Optimization Review</p>
                      <p className="text-sm text-gray-600">Performance and cost optimization</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-yellow-300 hover:shadow-sm transition-all">
                    <Eye className="w-5 h-5 text-yellow-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Decision Validation</p>
                      <p className="text-sm text-gray-600">Review orchestrator decisions</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all">
                    <Workflow className="w-5 h-5 text-indigo-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Multi-Agent Coordination</p>
                      <p className="text-sm text-gray-600">Coordinate multiple agents</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Agent Activity</h3>
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-3">
                      {getAgentIcon(task.assignedAgent)}
                      <div>
                        <p className="font-medium text-gray-900">{task.description}</p>
                        <p className="text-sm text-gray-600">Assigned to {task.assignedAgent}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{task.createdAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {agents.map((agent) => (
                <div key={agent.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getAgentIcon(agent.id)}
                      <div>
                        <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                        <p className="text-sm text-gray-600">{agent.specialization}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor('active')}`}>
                      Active
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{agent.description}</p>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Capabilities:</h4>
                    <div className="space-y-1">
                      {agent.capabilities.map((capability, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">{capability}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedAgent(agent.id);
                      setActiveTab('communication');
                    }}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Communicate
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'communication' && (
          <div className="space-y-6">
            {/* Agent Selection */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Communication</h3>
              <div className="flex items-center gap-4 mb-4">
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select an agent...</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>

                {selectedAgent && (
                  <div className="flex items-center gap-2">
                    {getAgentIcon(selectedAgent)}
                    <span className="font-medium text-gray-900">
                      {agents.find(a => a.id === selectedAgent)?.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your message to the agent..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessageToAgent()}
                />
                <button
                  onClick={sendMessageToAgent}
                  disabled={!selectedAgent || !chatMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>

            {/* Conversation History */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Conversations</h3>
              <div className="space-y-4">
                {conversations.slice(0, 10).map((conversation, index) => (
                  <div key={index} className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {getAgentIcon(conversation.agentId)}
                      <span className="font-medium text-gray-900">
                        {agents.find(a => a.id === conversation.agentId)?.name || conversation.agentId}
                      </span>
                      <span className="text-sm text-gray-500">{conversation.timestamp}</span>
                    </div>
                    <div className="space-y-2">
                      {conversation.messages.map((message, msgIndex) => (
                        <div key={msgIndex} className={`p-2 rounded ${
                          message.type === 'HumanMessage'
                            ? 'bg-blue-50 text-blue-900'
                            : 'bg-gray-50 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {/* Task Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Tasks</p>
                    <p className="text-2xl font-bold text-blue-900">{tasks.length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-medium">Pending</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {tasks.filter(t => t.status === 'pending').length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Completed</p>
                    <p className="text-2xl font-bold text-green-900">
                      {tasks.filter(t => t.status === 'completed').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 text-sm font-medium">Failed</p>
                    <p className="text-2xl font-bold text-red-900">
                      {tasks.filter(t => t.status === 'failed').length}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Management</h3>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="bg-white rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getAgentIcon(task.assignedAgent)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className="text-sm text-gray-600">{task.type}</span>
                          </div>
                          <p className="font-medium text-gray-900 mb-1">{task.description}</p>
                          <p className="text-sm text-gray-600">Assigned to {task.assignedAgent}</p>
                          <p className="text-xs text-gray-500">Created: {task.createdAt}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>

                    {task.result && task.status === 'completed' && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          {typeof task.result === 'string'
                            ? task.result.substring(0, 200) + '...'
                            : JSON.stringify(task.result).substring(0, 200) + '...'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'supervision' && (
          <div className="space-y-6">
            {/* Supervision Overview */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Orchestrator Supervision</h3>
              <p className="text-purple-100 mb-4">
                AI agents continuously monitor and supervise the orchestrator, providing intelligent oversight
                and intervention when needed.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{agents.length}</div>
                  <div className="text-purple-100 text-sm">Active Supervisors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{supervisorStatus?.activeTasks || 0}</div>
                  <div className="text-purple-100 text-sm">Supervision Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-purple-100 text-sm">Monitoring</div>
                </div>
              </div>
            </div>

            {/* Supervision Capabilities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Supervision Capabilities</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Continuous orchestrator monitoring</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Intelligent decision validation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Automated crisis response</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Performance optimization recommendations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Strategic business guidance</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Coordination</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-700">System Analyst</span>
                    </div>
                    <span className="text-green-600 text-sm">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">Business Intelligence</span>
                    </div>
                    <span className="text-green-600 text-sm">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-red-500" />
                      <span className="text-gray-700">Crisis Manager</span>
                    </div>
                    <span className="text-green-600 text-sm">Monitoring</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-700">Decision Supervisor</span>
                    </div>
                    <span className="text-green-600 text-sm">Validating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}