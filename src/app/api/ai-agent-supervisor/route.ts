// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import AIAgentSupervisor from '@/lib/ai-agent-supervisor';

// Global agent supervisor instance
let agentSupervisor: AIAgentSupervisor | null = null;

// Initialize agent supervisor if not already created
function getAgentSupervisor(): AIAgentSupervisor {
    if (!agentSupervisor) {
        agentSupervisor = new AIAgentSupervisor();
    }
    return agentSupervisor;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action') || 'agents';

        const supervisor = getAgentSupervisor();

        switch (action) {
            case 'status':
                const status = supervisor.getStatus();
                return NextResponse.json({
                    success: true,
                    data: status,
                });

            case 'agents':
                const agents = [
                    {
                        id: 'system-analyst',
                        name: 'System Analyst',
                        description: 'Monitors and analyzes system performance, identifies bottlenecks and optimization opportunities',
                        specialization: 'Performance Analysis & System Monitoring',
                        capabilities: [
                            'System performance analysis',
                            'Service health monitoring',
                            'Resource utilization assessment',
                            'Scalability evaluation',
                            'Technical report generation'
                        ]
                    },
                    {
                        id: 'business-intelligence',
                        name: 'Business Intelligence Agent',
                        description: 'Focuses on strategic decision-making, market analysis, and business optimization',
                        specialization: 'Strategic Analysis & Market Intelligence',
                        capabilities: [
                            'Market trend analysis',
                            'Business performance evaluation',
                            'Strategic recommendations',
                            'Customer behavior analysis',
                            'Growth opportunity identification'
                        ]
                    },
                    {
                        id: 'crisis-manager',
                        name: 'Crisis Management Agent',
                        description: 'Specialized in emergency response, system recovery, and crisis coordination',
                        specialization: 'Emergency Response & Crisis Management',
                        capabilities: [
                            'Crisis detection and response',
                            'Emergency recovery procedures',
                            'Service disruption minimization',
                            'Failover coordination',
                            'Crisis communication'
                        ]
                    },
                    {
                        id: 'optimizer',
                        name: 'Optimization Agent',
                        description: 'Focused on continuous system improvement, efficiency, and cost optimization',
                        specialization: 'System Optimization & Efficiency',
                        capabilities: [
                            'Performance optimization',
                            'Cost reduction strategies',
                            'Resource allocation optimization',
                            'Automation rule tuning',
                            'Efficiency measurement'
                        ]
                    },
                    {
                        id: 'decision-supervisor',
                        name: 'Decision Supervisor Agent',
                        description: 'Oversees and validates orchestrator decisions, provides governance and oversight',
                        specialization: 'Decision Validation & Governance',
                        capabilities: [
                            'Decision validation',
                            'Risk assessment',
                            'Strategic alignment check',
                            'Alternative recommendations',
                            'Approval workflow management'
                        ]
                    }
                ];

                return NextResponse.json({
                    success: true,
                    data: agents,
                });

            case 'conversations':
                const agentId = searchParams.get('agentId');
                const conversations = supervisor.getAgentConversations(agentId || undefined);

                return NextResponse.json({
                    success: true,
                    data: conversations.map(conv => ({
                        ...conv,
                        messages: conv.messages.map(msg => ({
                            type: msg.constructor.name,
                            content: msg.content,
                            timestamp: new Date().toISOString()
                        }))
                    })),
                });

            case 'tasks':
                const taskStatus = searchParams.get('status');
                const tasks = supervisor.getTasks(taskStatus as any);

                return NextResponse.json({
                    success: true,
                    data: tasks,
                });

            case 'health-check':
                const healthStatus = supervisor.getStatus();
                return NextResponse.json({
                    success: true,
                    data: {
                        supervisor: healthStatus.isActive ? 'active' : 'inactive',
                        orchestrator: healthStatus.orchestratorRunning ? 'running' : 'stopped',
                        agents: healthStatus.availableAgents.length,
                        activeTasks: healthStatus.activeTasks,
                        uptime: new Date().toISOString(),
                        version: '1.0.0'
                    },
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in AI Agent Supervisor GET:', error);
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

        const supervisor = getAgentSupervisor();

        switch (action) {
            case 'start':
                if (!supervisor.getStatus().isActive) {
                    await supervisor.start();
                    return NextResponse.json({
                        success: true,
                        message: 'AI Agent Supervisor started successfully',
                        data: { status: 'active' }
                    });
                } else {
                    return NextResponse.json({
                        success: true,
                        message: 'AI Agent Supervisor is already active',
                        data: { status: 'active' }
                    });
                }

            case 'stop':
                if (supervisor.getStatus().isActive) {
                    await supervisor.stop();
                    return NextResponse.json({
                        success: true,
                        message: 'AI Agent Supervisor stopped successfully',
                        data: { status: 'inactive' }
                    });
                } else {
                    return NextResponse.json({
                        success: true,
                        message: 'AI Agent Supervisor is already inactive',
                        data: { status: 'inactive' }
                    });
                }

            case 'communicate':
                const { agentId, message, context } = data;

                if (!agentId || !message) {
                    return NextResponse.json(
                        { error: 'Agent ID and message are required' },
                        { status: 400 }
                    );
                }

                const response = await supervisor.communicateWithAgent(agentId, message, context);

                return NextResponse.json({
                    success: true,
                    data: {
                        agentId,
                        request: message,
                        response,
                        timestamp: new Date().toISOString()
                    }
                });

            case 'create-task':
                const { type, description, priority, taskContext } = data;

                if (!type || !description) {
                    return NextResponse.json(
                        { error: 'Task type and description are required' },
                        { status: 400 }
                    );
                }

                const taskId = await supervisor.createTask(type, description, priority, taskContext);

                return NextResponse.json({
                    success: true,
                    message: 'Task created successfully',
                    data: { taskId, type, priority }
                });

            case 'execute-task':
                const { taskId: execTaskId } = data;

                if (!execTaskId) {
                    return NextResponse.json(
                        { error: 'Task ID is required' },
                        { status: 400 }
                    );
                }

                await supervisor.executeTask(execTaskId);

                return NextResponse.json({
                    success: true,
                    message: 'Task executed successfully',
                    data: { taskId: execTaskId }
                });

            case 'supervise-orchestrator':
                const { focus, instructions, urgency } = data;

                if (!focus || !instructions) {
                    return NextResponse.json(
                        { error: 'Focus area and instructions are required' },
                        { status: 400 }
                    );
                }

                const decision = await supervisor.superviseOrchestrator({
                    focus,
                    instructions,
                    urgency: urgency || 'medium'
                });

                return NextResponse.json({
                    success: true,
                    message: 'Orchestrator supervision completed',
                    data: decision
                });

            case 'coordinate-agents':
                const { scenario } = data;

                if (!scenario || !scenario.type || !scenario.involvedAgents) {
                    return NextResponse.json(
                        { error: 'Scenario with type and involved agents is required' },
                        { status: 400 }
                    );
                }

                const coordinationResult = await supervisor.coordinateAgents(scenario);

                return NextResponse.json({
                    success: true,
                    message: 'Agent coordination completed',
                    data: coordinationResult
                });

            case 'analyze-system':
                const analysisResult = await supervisor.communicateWithAgent(
                    'system-analyst',
                    'Perform comprehensive system analysis. Evaluate current performance, identify issues, and provide optimization recommendations.',
                    { priority: 'high', requestType: 'system-analysis' }
                );

                return NextResponse.json({
                    success: true,
                    message: 'System analysis completed',
                    data: {
                        agent: 'system-analyst',
                        analysis: analysisResult,
                        timestamp: new Date().toISOString()
                    }
                });

            case 'business-intelligence':
                const businessResult = await supervisor.communicateWithAgent(
                    'business-intelligence',
                    'Analyze current business performance, market trends, and provide strategic recommendations for growth and optimization.',
                    { priority: 'high', requestType: 'business-analysis' }
                );

                return NextResponse.json({
                    success: true,
                    message: 'Business intelligence analysis completed',
                    data: {
                        agent: 'business-intelligence',
                        analysis: businessResult,
                        timestamp: new Date().toISOString()
                    }
                });

            case 'crisis-assessment':
                const crisisResult = await supervisor.communicateWithAgent(
                    'crisis-manager',
                    'Assess current system state for potential crisis situations. Identify risks, vulnerabilities, and prepare emergency response plans.',
                    { priority: 'critical', requestType: 'crisis-assessment' }
                );

                return NextResponse.json({
                    success: true,
                    message: 'Crisis assessment completed',
                    data: {
                        agent: 'crisis-manager',
                        assessment: crisisResult,
                        timestamp: new Date().toISOString()
                    }
                });

            case 'optimization-review':
                const optimizationResult = await supervisor.communicateWithAgent(
                    'optimizer',
                    'Review current system optimization opportunities. Identify areas for improvement, cost reduction, and performance enhancement.',
                    { priority: 'high', requestType: 'optimization-review' }
                );

                return NextResponse.json({
                    success: true,
                    message: 'Optimization review completed',
                    data: {
                        agent: 'optimizer',
                        review: optimizationResult,
                        timestamp: new Date().toISOString()
                    }
                });

            case 'decision-validation':
                const { decisions } = data;

                if (!decisions) {
                    return NextResponse.json(
                        { error: 'Decisions array is required' },
                        { status: 400 }
                    );
                }

                const validationResult = await supervisor.communicateWithAgent(
                    'decision-supervisor',
                    `Validate the following orchestrator decisions: ${JSON.stringify(decisions)}. Provide approval, rejection, or modification recommendations for each decision.`,
                    { priority: 'high', requestType: 'decision-validation', decisions }
                );

                return NextResponse.json({
                    success: true,
                    message: 'Decision validation completed',
                    data: {
                        agent: 'decision-supervisor',
                        validation: validationResult,
                        timestamp: new Date().toISOString()
                    }
                });

            case 'multi-agent-consultation':
                const { consultation } = data;

                if (!consultation || !consultation.query) {
                    return NextResponse.json(
                        { error: 'Consultation query is required' },
                        { status: 400 }
                    );
                }

                // Consult multiple agents for comprehensive analysis
                const consultationAgents = consultation.agents || [
                    'system-analyst',
                    'business-intelligence',
                    'optimizer',
                    'decision-supervisor'
                ];

                const consultationResults = {};
                for (const agentId of consultationAgents) {
                    try {
                        const agentResponse = await supervisor.communicateWithAgent(
                            agentId,
                            `Multi-agent consultation: ${consultation.query}. Provide your specialized perspective and recommendations.`,
                            { priority: 'high', requestType: 'consultation' }
                        );
                        consultationResults[agentId] = agentResponse;
                    } catch (error) {
                        consultationResults[agentId] = { error: (error as Error).message };
                    }
                }

                return NextResponse.json({
                    success: true,
                    message: 'Multi-agent consultation completed',
                    data: {
                        query: consultation.query,
                        agents: consultationAgents,
                        responses: consultationResults,
                        timestamp: new Date().toISOString()
                    }
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in AI Agent Supervisor POST:', error);
        return NextResponse.json(
            { error: (error as Error).message || 'Failed to process request' },
            { status: 500 }
        );
    }
}