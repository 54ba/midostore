// @ts-nocheck
import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { BaseMessage, HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { Tool } from '@langchain/core/tools';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { DynamicTool } from '@langchain/core/tools';
import AIOrchestrator from './ai-orchestrator-service';
import envConfig from '../env.config';

export interface AgentTask {
    id: string;
    type: 'analysis' | 'supervision' | 'optimization' | 'decision' | 'crisis';
    priority: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    context: any;
    assignedAgent: string;
    status: 'pending' | 'executing' | 'completed' | 'failed';
    result?: any;
    createdAt: Date;
    completedAt?: Date;
}

export interface AgentConversation {
    id: string;
    agentId: string;
    messages: BaseMessage[];
    context: any;
    startedAt: Date;
    lastActivity: Date;
}

export interface SupervisorDecision {
    id: string;
    type: string;
    reasoning: string;
    confidence: number;
    actions: any[];
    impact: string;
    timestamp: Date;
}

export class AIAgentSupervisor {
    private orchestrator: AIOrchestrator;
    private openaiModel?: ChatOpenAI;
    private anthropicModel?: ChatAnthropic;
    private agents: Map<string, AgentExecutor> = new Map();
    private tasks: Map<string, AgentTask> = new Map();
    private conversations: Map<string, AgentConversation> = new Map();
    private isActive: boolean = false;

    constructor() {
        this.orchestrator = new AIOrchestrator();
        this.initializeModels();
        // Initialize agents asynchronously to avoid blocking constructor
        this.initializeAgents().catch(error => {
            console.warn('Failed to initialize AI agents:', error.message);
        });
    }

    // Initialize AI models
    private initializeModels(): void {
        if (envConfig.OPENAI_API_KEY) {
            this.openaiModel = new ChatOpenAI({
                openAIApiKey: envConfig.OPENAI_API_KEY,
                modelName: 'gpt-4-turbo-preview',
                temperature: 0.1,
                maxTokens: 4000,
            });
        }

        if (envConfig.ANTHROPIC_API_KEY) {
            this.anthropicModel = new ChatAnthropic({
                anthropicApiKey: envConfig.ANTHROPIC_API_KEY,
                modelName: 'claude-3-sonnet-20240229',
                temperature: 0.1,
                maxTokens: 4000,
            });
        }
    }

    // Initialize specialized AI agents
    private async initializeAgents(): Promise<void> {
        const tools = this.createOrchestratorTools();

        // System Analysis Agent
        const systemAnalysisAgent = await this.createAgent(
            'system-analyst',
            `You are a senior system analyst AI agent specializing in monitoring and analyzing distributed microservice architectures.

      Your responsibilities:
      - Analyze system performance metrics and identify bottlenecks
      - Monitor service health and predict potential failures
      - Evaluate resource utilization and recommend optimizations
      - Assess system scalability and capacity planning
      - Generate detailed technical reports and insights

      You have access to orchestrator tools to gather real-time system data.
      Always provide data-driven analysis with specific metrics and actionable recommendations.`,
            tools
        );

        // Business Intelligence Agent
        const businessAgent = await this.createAgent(
            'business-intelligence',
            `You are a business intelligence AI agent focused on strategic decision-making and market analysis.

      Your responsibilities:
      - Analyze market trends and competitive positioning
      - Evaluate business performance metrics and KPIs
      - Recommend strategic marketing and pricing decisions
      - Assess customer behavior and engagement patterns
      - Generate business insights and growth opportunities

      You communicate with the orchestrator to gather business data and implement strategic decisions.
      Focus on ROI, growth metrics, and competitive advantages.`,
            tools
        );

        // Crisis Management Agent
        const crisisAgent = await this.createAgent(
            'crisis-manager',
            `You are a crisis management AI agent specialized in emergency response and system recovery.

      Your responsibilities:
      - Detect and respond to system emergencies and failures
      - Coordinate rapid response and recovery procedures
      - Minimize service disruption and customer impact
      - Implement emergency scaling and failover procedures
      - Manage crisis communication and stakeholder updates

      You have priority access to orchestrator emergency functions.
      Act quickly and decisively during critical situations.`,
            tools
        );

        // Optimization Agent
        const optimizationAgent = await this.createAgent(
            'optimizer',
            `You are an optimization AI agent focused on continuous system improvement and efficiency.

      Your responsibilities:
      - Identify optimization opportunities across all services
      - Implement performance improvements and cost reductions
      - Optimize resource allocation and utilization
      - Fine-tune automation rules and decision algorithms
      - Monitor optimization results and adjust strategies

      You work closely with the orchestrator to implement optimizations.
      Always measure and validate optimization results.`,
            tools
        );

        // Decision Supervisor Agent
        const supervisorAgent = await this.createAgent(
            'decision-supervisor',
            `You are a senior decision supervisor AI agent that oversees and validates orchestrator decisions.

      Your responsibilities:
      - Review and validate orchestrator decisions before execution
      - Override poor decisions and provide better alternatives
      - Ensure decisions align with business objectives and constraints
      - Monitor decision outcomes and learn from results
      - Escalate critical decisions that require human approval

      You have the authority to approve, modify, or reject orchestrator decisions.
      Always consider risk, impact, and strategic alignment.`,
            tools
        );

        // Only add agents that were successfully created
        const successfulAgents = [];

        if (systemAnalysisAgent) {
            this.agents.set('system-analyst', systemAnalysisAgent);
            successfulAgents.push('system-analyst');
        }
        if (businessAgent) {
            this.agents.set('business-intelligence', businessAgent);
            successfulAgents.push('business-intelligence');
        }
        if (crisisAgent) {
            this.agents.set('crisis-manager', crisisAgent);
            successfulAgents.push('crisis-manager');
        }
        if (optimizationAgent) {
            this.agents.set('optimizer', optimizationAgent);
            successfulAgents.push('optimizer');
        }
        if (supervisorAgent) {
            this.agents.set('decision-supervisor', supervisorAgent);
            successfulAgents.push('decision-supervisor');
        }

        if (successfulAgents.length > 0) {
            console.log(`✅ AI Agent Supervisor initialized with ${successfulAgents.length} specialized agents: ${successfulAgents.join(', ')}`);
        } else {
            console.warn('⚠️ No AI agents were initialized due to missing API keys');
        }
    }

    // Create an AI agent with specific tools and prompt
    private async createAgent(
        agentId: string,
        systemPrompt: string,
        tools: Tool[]
    ): Promise<AgentExecutor | null> {
        const model = this.openaiModel || this.anthropicModel;
        if (!model) {
            console.warn(`Skipping agent creation for ${agentId}: No AI model available. Please configure OPENAI_API_KEY or ANTHROPIC_API_KEY`);
            return null;
        }

        const prompt = PromptTemplate.fromTemplate(`
      ${systemPrompt}

      Current Context:
      - System Status: {systemStatus}
      - Active Services: {activeServices}
      - Recent Decisions: {recentDecisions}
      - Performance Metrics: {performanceMetrics}

      User Request: {input}

      Available Tools: {tools}
      Tool Names: {tool_names}

      Agent Scratchpad: {agent_scratchpad}

      Provide detailed analysis and actionable recommendations based on the current system state.
    `);

        const agent = await createOpenAIFunctionsAgent({
            llm: model,
            tools,
            prompt,
        });

        return new AgentExecutor({
            agent,
            tools,
            maxIterations: 10,
            verbose: true,
        });
    }

    // Create tools for agents to interact with orchestrator
    private createOrchestratorTools(): Tool[] {
        return [
            new DynamicTool({
                name: 'get_orchestrator_status',
                description: 'Get current status of the AI orchestrator including services, trends, and decisions',
                func: async () => {
                    const status = this.orchestrator.getStatus();
                    return JSON.stringify(status, null, 2);
                },
            }),

            new DynamicTool({
                name: 'get_orchestrator_analytics',
                description: 'Get detailed analytics from the orchestrator including performance metrics and insights',
                func: async () => {
                    const analytics = this.orchestrator.getAnalytics();
                    return JSON.stringify(analytics, null, 2);
                },
            }),

            new DynamicTool({
                name: 'start_orchestrator',
                description: 'Start the AI orchestrator if it is not running',
                func: async () => {
                    await this.orchestrator.start();
                    return 'AI Orchestrator started successfully';
                },
            }),

            new DynamicTool({
                name: 'stop_orchestrator',
                description: 'Stop the AI orchestrator if it is running',
                func: async () => {
                    await this.orchestrator.stop();
                    return 'AI Orchestrator stopped successfully';
                },
            }),

            new DynamicTool({
                name: 'restart_orchestrator',
                description: 'Restart the AI orchestrator for maintenance or recovery',
                func: async () => {
                    await this.orchestrator.stop();
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    await this.orchestrator.start();
                    return 'AI Orchestrator restarted successfully';
                },
            }),

            new DynamicTool({
                name: 'analyze_system_performance',
                description: 'Analyze current system performance metrics and identify issues',
                func: async () => {
                    const status = this.orchestrator.getStatus();
                    const metrics = status.systemMetrics;

                    const analysis = {
                        performance: metrics,
                        issues: [],
                        recommendations: []
                    };

                    if (metrics.averageResponseTime > 1000) {
                        (analysis.issues as string[]).push('High average response time detected');
                        (analysis.recommendations as string[]).push('Consider scaling services or optimizing queries');
                    }

                    if (metrics.totalErrorRate > 3) {
                        (analysis.issues as string[]).push('Elevated error rate detected');
                        (analysis.recommendations as string[]).push('Investigate error sources and implement fixes');
                    }

                    return JSON.stringify(analysis, null, 2);
                },
            }),

            new DynamicTool({
                name: 'get_trending_insights',
                description: 'Get current market trends and business insights',
                func: async () => {
                    const status = this.orchestrator.getStatus();
                    const trends = status.trends;

                    const insights = {
                        trends: trends,
                        opportunities: [],
                        risks: []
                    };

                    Object.values(trends).forEach((trend: any) => {
                        if (trend.momentum > 80) {
                            insights.opportunities.push(`High momentum in ${trend.category}: ${trend.recommendation}`);
                        }
                        if (trend.momentum < 30) {
                            insights.risks.push(`Declining trend in ${trend.category}: requires attention`);
                        }
                    });

                    return JSON.stringify(insights, null, 2);
                },
            }),

            new DynamicTool({
                name: 'execute_emergency_action',
                description: 'Execute emergency actions during crisis situations',
                func: async (input: string) => {
                    const action = JSON.parse(input);

                    // Simulate emergency action execution
                    const result = {
                        action: action.type,
                        executed: true,
                        timestamp: new Date().toISOString(),
                        impact: action.impact || 'System stabilized'
                    };

                    console.log(`🚨 Emergency action executed: ${action.type}`);
                    return JSON.stringify(result, null, 2);
                },
            }),

            new DynamicTool({
                name: 'optimize_system_resources',
                description: 'Optimize system resources and performance',
                func: async (input: string) => {
                    const optimization = JSON.parse(input);

                    const result = {
                        optimization: optimization.type,
                        applied: true,
                        expectedImprovement: optimization.expectedImprovement || '15-25%',
                        timestamp: new Date().toISOString()
                    };

                    console.log(`⚡ Optimization applied: ${optimization.type}`);
                    return JSON.stringify(result, null, 2);
                },
            }),

            new DynamicTool({
                name: 'validate_orchestrator_decision',
                description: 'Validate and potentially override orchestrator decisions',
                func: async (input: string) => {
                    const decision = JSON.parse(input);

                    const validation = {
                        decision: decision,
                        approved: decision.confidence > 75,
                        reasoning: decision.confidence > 75
                            ? 'Decision approved based on high confidence score'
                            : 'Decision requires review due to low confidence',
                        alternatives: decision.confidence < 75 ? ['Manual review required', 'Gather more data'] : [],
                        timestamp: new Date().toISOString()
                    };

                    return JSON.stringify(validation, null, 2);
                },
            }),
        ];
    }

    // Start the agent supervisor
    async start(): Promise<void> {
        if (this.isActive) return;

        this.isActive = true;
        await this.orchestrator.start();

        console.log('🤖 AI Agent Supervisor started');
        console.log('📋 Available Agents:');
        console.log('  - System Analyst: Performance monitoring and analysis');
        console.log('  - Business Intelligence: Market trends and strategic decisions');
        console.log('  - Crisis Manager: Emergency response and recovery');
        console.log('  - Optimizer: Continuous improvement and efficiency');
        console.log('  - Decision Supervisor: Orchestrator decision validation');
    }

    // Stop the agent supervisor
    async stop(): Promise<void> {
        if (!this.isActive) return;

        this.isActive = false;
        await this.orchestrator.stop();

        console.log('🛑 AI Agent Supervisor stopped');
    }

    // Communicate with a specific agent
    async communicateWithAgent(
        agentId: string,
        message: string,
        context?: any
    ): Promise<string> {
        const agent = this.agents.get(agentId);
        if (!agent) {
            throw new Error(`Agent ${agentId} not found or not initialized. Please check if AI models are configured.`);
        }

        try {
            // Get current orchestrator context
            const orchestratorStatus = this.orchestrator.getStatus();
            const orchestratorAnalytics = this.orchestrator.getAnalytics();

            // Prepare context for the agent
            const agentContext = {
                systemStatus: orchestratorStatus.isRunning ? 'running' : 'stopped',
                activeServices: Object.keys(orchestratorStatus.services || {}),
                recentDecisions: orchestratorStatus.recentDecisions || [],
                performanceMetrics: orchestratorStatus.systemMetrics || {},
                ...context
            };

            // Execute agent with context
            const result = await agent.invoke({
                input: message,
                ...agentContext
            });

            // Store conversation
            const conversationId = `${agentId}-${Date.now()}`;
            this.conversations.set(conversationId, {
                id: conversationId,
                agentId,
                messages: [
                    new HumanMessage(message),
                    new AIMessage(result.output)
                ],
                context: agentContext,
                startedAt: new Date(),
                lastActivity: new Date()
            });

            return result.output;
        } catch (error) {
            console.error(`Error communicating with agent ${agentId}:`, error);
            throw error;
        }
    }

    // Create and assign a task to an agent
    async createTask(
        type: AgentTask['type'],
        description: string,
        priority: AgentTask['priority'] = 'medium',
        context?: any
    ): Promise<string> {
        const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Assign agent based on task type
        let assignedAgent: string;
        switch (type) {
            case 'analysis':
                assignedAgent = 'system-analyst';
                break;
            case 'supervision':
                assignedAgent = 'decision-supervisor';
                break;
            case 'optimization':
                assignedAgent = 'optimizer';
                break;
            case 'decision':
                assignedAgent = 'decision-supervisor';
                break;
            case 'crisis':
                assignedAgent = 'crisis-manager';
                break;
            default:
                assignedAgent = 'system-analyst';
        }

        const task: AgentTask = {
            id: taskId,
            type,
            priority,
            description,
            context: context || {},
            assignedAgent,
            status: 'pending',
            createdAt: new Date()
        };

        this.tasks.set(taskId, task);

        // Execute task immediately if high priority
        if (priority === 'high' || priority === 'critical') {
            await this.executeTask(taskId);
        }

        return taskId;
    }

    // Execute a specific task
    async executeTask(taskId: string): Promise<void> {
        const task = this.tasks.get(taskId);
        if (!task) {
            throw new Error(`Task ${taskId} not found`);
        }

        task.status = 'executing';

        try {
            const result = await this.communicateWithAgent(
                task.assignedAgent,
                task.description,
                task.context
            );

            task.result = result;
            task.status = 'completed';
            task.completedAt = new Date();

            console.log(`✅ Task ${taskId} completed by ${task.assignedAgent}`);
        } catch (error) {
            task.status = 'failed';
            task.result = { error: (error as Error).message };
            console.error(`❌ Task ${taskId} failed:`, error);
        }
    }

    // Supervise orchestrator with intelligent prompts
    async superviseOrchestrator(
        supervision: {
            focus: 'performance' | 'business' | 'crisis' | 'optimization' | 'decisions';
            instructions: string;
            urgency: 'low' | 'medium' | 'high' | 'critical';
        }
    ): Promise<SupervisorDecision> {
        const agentMap = {
            performance: 'system-analyst',
            business: 'business-intelligence',
            crisis: 'crisis-manager',
            optimization: 'optimizer',
            decisions: 'decision-supervisor'
        };

        const agentId = agentMap[supervision.focus];

        const prompt = `
    SUPERVISION REQUEST - Priority: ${supervision.urgency.toUpperCase()}

    Focus Area: ${supervision.focus}
    Instructions: ${supervision.instructions}

    Current Orchestrator Status:
    - Analyze the current state of the AI orchestrator
    - Identify any issues or opportunities
    - Provide specific recommendations and actions
    - Consider the urgency level and respond appropriately

    Please provide:
    1. Current situation assessment
    2. Identified issues or opportunities
    3. Recommended actions with reasoning
    4. Expected impact and outcomes
    5. Implementation timeline
    `;

        const response = await this.communicateWithAgent(agentId, prompt);

        const decision: SupervisorDecision = {
            id: `decision-${Date.now()}`,
            type: supervision.focus,
            reasoning: response,
            confidence: supervision.urgency === 'critical' ? 95 : 85,
            actions: [], // Would be parsed from response in real implementation
            impact: `Supervision of ${supervision.focus} with ${supervision.urgency} priority`,
            timestamp: new Date()
        };

        return decision;
    }

    // Get agent conversation history
    getAgentConversations(agentId?: string): AgentConversation[] {
        const conversations = Array.from(this.conversations.values());
        return agentId
            ? conversations.filter(conv => conv.agentId === agentId)
            : conversations;
    }

    // Get task status and results
    getTasks(status?: AgentTask['status']): AgentTask[] {
        const tasks = Array.from(this.tasks.values());
        return status
            ? tasks.filter(task => task.status === status)
            : tasks;
    }

    // Get supervisor status
    getStatus(): any {
        return {
            isActive: this.isActive,
            orchestratorRunning: this.orchestrator.getStatus().isRunning,
            availableAgents: Array.from(this.agents.keys()),
            activeTasks: this.getTasks('executing').length,
            completedTasks: this.getTasks('completed').length,
            failedTasks: this.getTasks('failed').length,
            totalConversations: this.conversations.size,
            lastActivity: new Date()
        };
    }

    // Advanced agent coordination
    async coordinateAgents(
        scenario: {
            type: 'multi-agent-analysis' | 'crisis-response' | 'optimization-review';
            description: string;
            involvedAgents: string[];
            coordination: string;
        }
    ): Promise<any> {
        const results = {};

        for (const agentId of scenario.involvedAgents) {
            const agentPrompt = `
      MULTI-AGENT COORDINATION SCENARIO

      Scenario Type: ${scenario.type}
      Description: ${scenario.description}
      Coordination Instructions: ${scenario.coordination}

      Your Role: As the ${agentId} agent, provide your specialized perspective on this scenario.
      Consider how your analysis complements the work of other agents: ${scenario.involvedAgents.join(', ')}

      Provide detailed analysis from your domain expertise.
      `;

            try {
                const response = await this.communicateWithAgent(agentId, agentPrompt);
                (results as any)[agentId] = response;
            } catch (error) {
                (results as any)[agentId] = { error: (error as Error).message };
            }
        }

        return {
            scenario,
            agentResponses: results,
            timestamp: new Date(),
            coordinationSummary: 'Multi-agent analysis completed'
        };
    }
}

export default AIAgentSupervisor;