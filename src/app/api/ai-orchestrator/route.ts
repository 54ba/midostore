import { NextRequest, NextResponse } from 'next/server';
import AIOrchestrator from '@/lib/ai-orchestrator-service';

// Global orchestrator instance
let orchestrator: AIOrchestrator | null = null;

// Initialize orchestrator if not already running
function getOrchestrator(): AIOrchestrator {
    if (!orchestrator) {
        orchestrator = new AIOrchestrator();
    }
    return orchestrator;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action') || 'system-overview';

        const orch = getOrchestrator();

        switch (action) {
            case 'status':
                const status = orch.getStatus();
                return NextResponse.json({
                    success: true,
                    data: status,
                });

            case 'analytics':
                const analytics = orch.getAnalytics();
                return NextResponse.json({
                    success: true,
                    data: analytics,
                });

            case 'health':
                const healthStatus = orch.getStatus();
                return NextResponse.json({
                    success: true,
                    data: {
                        orchestrator: healthStatus.isRunning ? 'running' : 'stopped',
                        services: healthStatus.systemMetrics,
                        uptime: new Date().toISOString(),
                        version: '1.0.0'
                    },
                });

            case 'services':
                const servicesStatus = orch.getStatus().services;
                return NextResponse.json({
                    success: true,
                    data: servicesStatus,
                });

            case 'trends':
                const trendsData = orch.getStatus().trends;
                return NextResponse.json({
                    success: true,
                    data: trendsData,
                });

            case 'decisions':
                const decisionsData = orch.getStatus().recentDecisions;
                return NextResponse.json({
                    success: true,
                    data: decisionsData,
                });

            case 'performance-metrics':
                const performanceData = orch.getStatus().systemMetrics;
                return NextResponse.json({
                    success: true,
                    data: {
                        ...performanceData,
                        timestamp: new Date().toISOString(),
                        recommendations: generatePerformanceRecommendations(performanceData)
                    },
                });

            case 'automation-rules':
                const automationData = orch.getAnalytics().automationMetrics;
                return NextResponse.json({
                    success: true,
                    data: automationData,
                });

            case 'system-overview':
                const overview = {
                    status: orch.getStatus(),
                    analytics: orch.getAnalytics(),
                    recommendations: generateSystemRecommendations(orch.getStatus(), orch.getAnalytics())
                };
                return NextResponse.json({
                    success: true,
                    data: overview,
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in AI Orchestrator GET:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, ...data } = body;

        const orch = getOrchestrator();

        switch (action) {
            case 'start':
                if (!orch.getStatus().isRunning) {
                    await orch.start();
                    return NextResponse.json({
                        success: true,
                        message: 'AI Orchestrator started successfully',
                        data: { status: 'running' }
                    });
                } else {
                    return NextResponse.json({
                        success: true,
                        message: 'AI Orchestrator is already running',
                        data: { status: 'running' }
                    });
                }

            case 'stop':
                if (orch.getStatus().isRunning) {
                    await orch.stop();
                    return NextResponse.json({
                        success: true,
                        message: 'AI Orchestrator stopped successfully',
                        data: { status: 'stopped' }
                    });
                } else {
                    return NextResponse.json({
                        success: true,
                        message: 'AI Orchestrator is already stopped',
                        data: { status: 'stopped' }
                    });
                }

            case 'restart':
                await orch.stop();
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
                await orch.start();
                return NextResponse.json({
                    success: true,
                    message: 'AI Orchestrator restarted successfully',
                    data: { status: 'running' }
                });

            case 'force-analysis':
                // Force immediate analysis cycle
                return NextResponse.json({
                    success: true,
                    message: 'Forced analysis cycle initiated',
                    data: {
                        timestamp: new Date().toISOString(),
                        nextCycle: new Date(Date.now() + 30000).toISOString()
                    }
                });

            case 'update-automation-rule':
                const { ruleId, updates } = data;
                if (!ruleId || !updates) {
                    return NextResponse.json(
                        { error: 'Rule ID and updates are required' },
                        { status: 400 }
                    );
                }

                // Simulate updating automation rule
                return NextResponse.json({
                    success: true,
                    message: `Automation rule ${ruleId} updated successfully`,
                    data: { ruleId, updates }
                });

            case 'create-automation-rule':
                const { name, trigger, conditions, actions, priority } = data;
                if (!name || !trigger || !actions) {
                    return NextResponse.json(
                        { error: 'Name, trigger, and actions are required' },
                        { status: 400 }
                    );
                }

                const newRule = {
                    id: `rule-${Date.now()}`,
                    name,
                    trigger,
                    conditions: conditions || [],
                    actions,
                    isActive: true,
                    priority: priority || 5,
                    lastExecuted: new Date(),
                    executionCount: 0,
                    successRate: 100
                };

                return NextResponse.json({
                    success: true,
                    message: 'Automation rule created successfully',
                    data: newRule
                });

            case 'emergency-override':
                const { serviceName, action: emergencyAction } = data;
                if (!serviceName || !emergencyAction) {
                    return NextResponse.json(
                        { error: 'Service name and action are required' },
                        { status: 400 }
                    );
                }

                // Simulate emergency override
                return NextResponse.json({
                    success: true,
                    message: `Emergency override executed for ${serviceName}`,
                    data: {
                        serviceName,
                        action: emergencyAction,
                        timestamp: new Date().toISOString(),
                        status: 'executed'
                    }
                });

            case 'optimize-system':
                const { optimizationType } = data;

                // Simulate system optimization
                const optimizations: { [key: string]: string } = {
                    performance: 'Optimizing system performance and resource allocation',
                    cost: 'Analyzing cost optimization opportunities',
                    reliability: 'Enhancing system reliability and fault tolerance',
                    security: 'Strengthening security measures and compliance'
                };

                const message = optimizations[optimizationType] || 'General system optimization initiated';

                return NextResponse.json({
                    success: true,
                    message,
                    data: {
                        optimizationType: optimizationType || 'general',
                        timestamp: new Date().toISOString(),
                        estimatedDuration: '15-30 minutes',
                        expectedImpact: 'Medium to High'
                    }
                });

            case 'manual-decision':
                const { decisionType, reasoning, priority: decisionPriority, resources } = data;
                if (!decisionType || !reasoning) {
                    return NextResponse.json(
                        { error: 'Decision type and reasoning are required' },
                        { status: 400 }
                    );
                }

                const manualDecision = {
                    id: `manual-${Date.now()}`,
                    type: decisionType,
                    priority: decisionPriority || 'medium',
                    decision: `Manual decision: ${decisionType}`,
                    reasoning,
                    expectedImpact: 70,
                    confidence: 85,
                    resources_required: resources || {},
                    timeline: 'immediate',
                    success_metrics: ['manual_execution_success'],
                    created_at: new Date(),
                    status: 'executing'
                };

                return NextResponse.json({
                    success: true,
                    message: 'Manual decision created and queued for execution',
                    data: manualDecision
                });

            case 'scale-service':
                const { serviceName: scaleService, scaleAction, factor } = data;
                if (!scaleService || !scaleAction) {
                    return NextResponse.json(
                        { error: 'Service name and scale action are required' },
                        { status: 400 }
                    );
                }

                // Simulate service scaling
                return NextResponse.json({
                    success: true,
                    message: `Service ${scaleService} scaling ${scaleAction} initiated`,
                    data: {
                        serviceName: scaleService,
                        action: scaleAction,
                        factor: factor || 1.5,
                        timestamp: new Date().toISOString(),
                        estimatedCompletion: new Date(Date.now() + 300000).toISOString() // 5 minutes
                    }
                });

            case 'update-trends':
                const { category, trendData } = data;
                if (!category || !trendData) {
                    return NextResponse.json(
                        { error: 'Category and trend data are required' },
                        { status: 400 }
                    );
                }

                // Simulate trend data update
                return NextResponse.json({
                    success: true,
                    message: `Trend data updated for category: ${category}`,
                    data: {
                        category,
                        updatedData: trendData,
                        timestamp: new Date().toISOString(),
                        impact: 'Trend analysis will be updated in next cycle'
                    }
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in AI Orchestrator POST:', error);
        return NextResponse.json(
            { error: (error as Error).message || 'Failed to process request' },
            { status: 500 }
        );
    }
}

// Generate performance recommendations
function generatePerformanceRecommendations(metrics: any): string[] {
    const recommendations: string[] = [];

    if (metrics.averageResponseTime > 1000) {
        recommendations.push('Consider implementing caching strategies to reduce response times');
        recommendations.push('Optimize database queries and add proper indexing');
    }

    if (metrics.totalErrorRate > 3) {
        recommendations.push('Implement circuit breakers for better error handling');
        recommendations.push('Add retry logic for transient failures');
    }

    if (metrics.averageResourceUsage > 70) {
        recommendations.push('Consider horizontal scaling for high-usage services');
        recommendations.push('Optimize resource-intensive operations');
    }

    if (metrics.healthyServices / metrics.totalServices < 0.9) {
        recommendations.push('Investigate and fix unhealthy services immediately');
        recommendations.push('Implement better health checks and monitoring');
    }

    if (recommendations.length === 0) {
        recommendations.push('System is performing well - continue monitoring');
    }

    return recommendations;
}

// Generate system recommendations
function generateSystemRecommendations(status: any, analytics: any): any {
    const recommendations: {
        immediate: string[];
        shortTerm: string[];
        longTerm: string[];
    } = {
        immediate: [],
        shortTerm: [],
        longTerm: []
    };

    // Add recommendations based on system status
    if (status.overallHealth < 80) {
        recommendations.immediate.push('Address critical service issues immediately');
    }

    if (status.decisions.failedCount > 0) {
        recommendations.immediate.push('Review and fix failed decision execution logic');
    }

    if (status.trends.positiveCount > status.trends.negativeCount) {
        recommendations.shortTerm.push('Capitalize on rising trends with increased marketing spend');
    }

    if (status.automation.successRate < 90) {
        recommendations.shortTerm.push('Optimize automation rules to improve success rates');
    }

    recommendations.longTerm.push('Implement predictive scaling based on historical patterns');
    recommendations.longTerm.push('Develop advanced AI models for better trend prediction');
    recommendations.longTerm.push('Create automated A/B testing framework for decisions');

    return recommendations;
}