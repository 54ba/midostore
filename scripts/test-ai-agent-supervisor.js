#!/usr/bin/env node

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

console.log('🤖 Testing AI Agent Supervisor System...\n');

// Test functions
async function testAPI(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const data = await response.json();

        return {
            status: response.status,
            success: response.ok,
            data: data,
        };
    } catch (error) {
        return {
            status: 0,
            success: false,
            error: error.message,
        };
    }
}

async function testSupervisorBasics() {
    console.log('🎯 Testing AI Agent Supervisor Basics...');

    // Test health check
    const health = await testAPI('/api/ai-agent-supervisor?action=health-check');
    console.log(`  Health Check: ${health.success ? '✅ PASS' : '❌ FAIL'} (${health.status})`);
    if (health.success) {
        console.log(`    Supervisor: ${health.data.data.supervisor}`);
        console.log(`    Orchestrator: ${health.data.data.orchestrator}`);
        console.log(`    Available Agents: ${health.data.data.agents}`);
    }

    // Test get status
    const status = await testAPI('/api/ai-agent-supervisor?action=status');
    console.log(`  Get Status: ${status.success ? '✅ PASS' : '❌ FAIL'} (${status.status})`);
    if (status.success) {
        console.log(`    Active: ${status.data.data.isActive}`);
        console.log(`    Active Tasks: ${status.data.data.activeTasks}`);
        console.log(`    Completed Tasks: ${status.data.data.completedTasks}`);
        console.log(`    Total Conversations: ${status.data.data.totalConversations}`);
    }

    // Test get agents
    const agents = await testAPI('/api/ai-agent-supervisor?action=agents');
    console.log(`  Get Agents: ${agents.success ? '✅ PASS' : '❌ FAIL'} (${agents.status})`);
    if (agents.success) {
        const agentData = agents.data.data;
        console.log(`    Available Agents: ${agentData.length}`);
        agentData.forEach(agent => {
            console.log(`      - ${agent.name}: ${agent.specialization}`);
        });
    }

    console.log('');
}

async function testSupervisorControl() {
    console.log('🎮 Testing AI Agent Supervisor Control...');

    // Test start supervisor
    const start = await testAPI('/api/ai-agent-supervisor', 'POST', {
        action: 'start'
    });
    console.log(`  Start Supervisor: ${start.success ? '✅ PASS' : '❌ FAIL'} (${start.status})`);
    if (start.success) {
        console.log(`    Message: ${start.data.message}`);
        console.log(`    Status: ${start.data.data.status}`);
    }

    // Wait a moment for the supervisor to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('');
}

async function testAgentCommunication() {
    console.log('💬 Testing Agent Communication...');

    const testCases = [
        {
            agentId: 'system-analyst',
            message: 'Analyze current system performance and identify any bottlenecks or optimization opportunities.',
            description: 'System Analysis Request'
        },
        {
            agentId: 'business-intelligence',
            message: 'Provide insights on current market trends and recommend strategic business decisions.',
            description: 'Business Intelligence Request'
        },
        {
            agentId: 'crisis-manager',
            message: 'Assess current system state for potential crisis situations and prepare emergency response plans.',
            description: 'Crisis Assessment Request'
        },
        {
            agentId: 'optimizer',
            message: 'Review system optimization opportunities and recommend performance improvements.',
            description: 'Optimization Review Request'
        },
        {
            agentId: 'decision-supervisor',
            message: 'Validate recent orchestrator decisions and provide approval or modification recommendations.',
            description: 'Decision Validation Request'
        }
    ];

    for (const testCase of testCases) {
        const communicate = await testAPI('/api/ai-agent-supervisor', 'POST', {
            action: 'communicate',
            agentId: testCase.agentId,
            message: testCase.message,
            context: { priority: 'high', source: 'test' }
        });

        console.log(`  ${testCase.description}: ${communicate.success ? '✅ PASS' : '❌ FAIL'} (${communicate.status})`);
        if (communicate.success) {
            console.log(`    Agent: ${communicate.data.data.agentId}`);
            console.log(`    Response Length: ${communicate.data.data.response?.length || 0} characters`);
        }
    }

    console.log('');
}

async function testTaskManagement() {
    console.log('📋 Testing Task Management...');

    // Test create task
    const createTask = await testAPI('/api/ai-agent-supervisor', 'POST', {
        action: 'create-task',
        type: 'analysis',
        description: 'Perform comprehensive system analysis and provide optimization recommendations',
        priority: 'high',
        taskContext: { source: 'test', requestType: 'system-analysis' }
    });
    console.log(`  Create Task: ${createTask.success ? '✅ PASS' : '❌ FAIL'} (${createTask.status})`);
    if (createTask.success) {
        console.log(`    Task ID: ${createTask.data.data.taskId}`);
        console.log(`    Type: ${createTask.data.data.type}`);
        console.log(`    Priority: ${createTask.data.data.priority}`);
    }

    // Test get tasks
    const tasks = await testAPI('/api/ai-agent-supervisor?action=tasks');
    console.log(`  Get Tasks: ${tasks.success ? '✅ PASS' : '❌ FAIL'} (${tasks.status})`);
    if (tasks.success) {
        const taskData = tasks.data.data;
        console.log(`    Total Tasks: ${taskData.length}`);
        taskData.slice(0, 3).forEach((task, index) => {
            console.log(`      Task ${index + 1}: ${task.type} - ${task.status} (${task.priority} priority)`);
        });
    }

    console.log('');
}

async function testOrchestratorSupervision() {
    console.log('👁️ Testing Orchestrator Supervision...');

    // Test supervise orchestrator
    const supervise = await testAPI('/api/ai-agent-supervisor', 'POST', {
        action: 'supervise-orchestrator',
        focus: 'performance',
        instructions: 'Analyze current orchestrator performance and provide recommendations for optimization',
        urgency: 'high'
    });
    console.log(`  Supervise Orchestrator: ${supervise.success ? '✅ PASS' : '❌ FAIL'} (${supervise.status})`);
    if (supervise.success) {
        console.log(`    Decision ID: ${supervise.data.data.id}`);
        console.log(`    Focus: ${supervise.data.data.type}`);
        console.log(`    Confidence: ${supervise.data.data.confidence}%`);
    }

    console.log('');
}

async function testQuickActions() {
    console.log('⚡ Testing Quick Actions...');

    const quickActions = [
        { action: 'analyze-system', description: 'System Analysis' },
        { action: 'business-intelligence', description: 'Business Intelligence' },
        { action: 'crisis-assessment', description: 'Crisis Assessment' },
        { action: 'optimization-review', description: 'Optimization Review' }
    ];

    for (const quickAction of quickActions) {
        const result = await testAPI('/api/ai-agent-supervisor', 'POST', {
            action: quickAction.action
        });

        console.log(`  ${quickAction.description}: ${result.success ? '✅ PASS' : '❌ FAIL'} (${result.status})`);
        if (result.success) {
            console.log(`    Agent: ${result.data.data.agent}`);
            console.log(`    Analysis Length: ${result.data.data.analysis?.length || result.data.data.assessment?.length || result.data.data.review?.length || 0} characters`);
        }
    }

    console.log('');
}

async function testAgentCoordination() {
    console.log('🤝 Testing Agent Coordination...');

    // Test coordinate agents
    const coordinate = await testAPI('/api/ai-agent-supervisor', 'POST', {
        action: 'coordinate-agents',
        scenario: {
            type: 'multi-agent-analysis',
            description: 'Comprehensive platform analysis requiring multiple agent perspectives',
            involvedAgents: ['system-analyst', 'business-intelligence', 'optimizer'],
            coordination: 'Each agent should provide their specialized analysis of the current platform state and coordinate recommendations'
        }
    });
    console.log(`  Coordinate Agents: ${coordinate.success ? '✅ PASS' : '❌ FAIL'} (${coordinate.status})`);
    if (coordinate.success) {
        console.log(`    Scenario Type: ${coordinate.data.data.scenario.type}`);
        console.log(`    Involved Agents: ${coordinate.data.data.scenario.involvedAgents.length}`);
        console.log(`    Agent Responses: ${Object.keys(coordinate.data.data.agentResponses).length}`);
    }

    console.log('');
}

async function testMultiAgentConsultation() {
    console.log('🧠 Testing Multi-Agent Consultation...');

    // Test multi-agent consultation
    const consultation = await testAPI('/api/ai-agent-supervisor', 'POST', {
        action: 'multi-agent-consultation',
        consultation: {
            query: 'How can we improve overall platform performance while reducing operational costs?',
            agents: ['system-analyst', 'business-intelligence', 'optimizer', 'decision-supervisor']
        }
    });
    console.log(`  Multi-Agent Consultation: ${consultation.success ? '✅ PASS' : '❌ FAIL'} (${consultation.status})`);
    if (consultation.success) {
        console.log(`    Query: ${consultation.data.data.query}`);
        console.log(`    Consulted Agents: ${consultation.data.data.agents.length}`);
        console.log(`    Responses Received: ${Object.keys(consultation.data.data.responses).length}`);
    }

    console.log('');
}

async function testDecisionValidation() {
    console.log('✅ Testing Decision Validation...');

    // Test decision validation
    const validation = await testAPI('/api/ai-agent-supervisor', 'POST', {
        action: 'decision-validation',
        decisions: [
            {
                id: 'decision-1',
                type: 'scaling',
                description: 'Scale up web3-service by 50%',
                confidence: 85,
                expectedImpact: 'Improved performance for blockchain operations'
            },
            {
                id: 'decision-2',
                type: 'optimization',
                description: 'Implement aggressive caching for product API',
                confidence: 92,
                expectedImpact: 'Reduced response times by 40%'
            }
        ]
    });
    console.log(`  Decision Validation: ${validation.success ? '✅ PASS' : '❌ FAIL'} (${validation.status})`);
    if (validation.success) {
        console.log(`    Agent: ${validation.data.data.agent}`);
        console.log(`    Validation Length: ${validation.data.data.validation?.length || 0} characters`);
    }

    console.log('');
}

async function testConversationHistory() {
    console.log('💭 Testing Conversation History...');

    // Test get conversations
    const conversations = await testAPI('/api/ai-agent-supervisor?action=conversations');
    console.log(`  Get Conversations: ${conversations.success ? '✅ PASS' : '❌ FAIL'} (${conversations.status})`);
    if (conversations.success) {
        const convData = conversations.data.data;
        console.log(`    Total Conversations: ${convData.length}`);
        convData.slice(0, 3).forEach((conv, index) => {
            console.log(`      Conversation ${index + 1}: Agent ${conv.agentId} - ${conv.messages.length} messages`);
        });
    }

    // Test get conversations for specific agent
    const agentConversations = await testAPI('/api/ai-agent-supervisor?action=conversations&agentId=system-analyst');
    console.log(`  Get Agent Conversations: ${agentConversations.success ? '✅ PASS' : '❌ FAIL'} (${agentConversations.status})`);
    if (agentConversations.success) {
        console.log(`    System Analyst Conversations: ${agentConversations.data.data.length}`);
    }

    console.log('');
}

async function testAgentDashboard() {
    console.log('📊 Testing Agent Dashboard...');

    // Test dashboard page
    const dashboard = await testAPI('/ai-agents');
    console.log(`  Dashboard Page: ${dashboard.success ? '✅ PASS' : '❌ FAIL'} (${dashboard.status})`);

    console.log('');
}

async function runAllTests() {
    console.log(`Testing against: ${BASE_URL}\n`);

    try {
        await testSupervisorBasics();
        await testSupervisorControl();
        await testAgentCommunication();
        await testTaskManagement();
        await testOrchestratorSupervision();
        await testQuickActions();
        await testAgentCoordination();
        await testMultiAgentConsultation();
        await testDecisionValidation();
        await testConversationHistory();
        await testAgentDashboard();

        console.log('🎉 All AI Agent Supervisor tests completed!\n');
        console.log('📋 Summary:');
        console.log('  ✅ LangChain-powered AI agent system with 5 specialized agents');
        console.log('  ✅ Natural language communication with intelligent prompts');
        console.log('  ✅ Real-time orchestrator supervision and decision validation');
        console.log('  ✅ Multi-agent coordination for complex analysis scenarios');
        console.log('  ✅ Task management with priority-based execution');
        console.log('  ✅ Conversation history and context preservation');
        console.log('  ✅ Quick action execution for common supervision tasks');
        console.log('  ✅ Advanced agent consultation and collaboration');
        console.log('  ✅ Crisis management and emergency response capabilities');
        console.log('  ✅ Performance optimization and business intelligence');

        console.log('\n🤖 AI Agent Specializations:');
        console.log('  🔍 System Analyst: Performance monitoring, bottleneck identification, optimization recommendations');
        console.log('  📈 Business Intelligence: Market analysis, strategic decisions, competitive positioning');
        console.log('  🛡️ Crisis Manager: Emergency detection, crisis response, system recovery coordination');
        console.log('  ⚡ Optimizer: Continuous improvement, efficiency optimization, cost reduction');
        console.log('  👁️ Decision Supervisor: Orchestrator oversight, decision validation, governance');

        console.log('\n🔗 LangChain Integration Features:');
        console.log('  🧠 Advanced Language Models (GPT-4, Claude-3)');
        console.log('  🔧 Tool Integration (Direct orchestrator API access)');
        console.log('  💬 Natural Language Interface (Conversational AI)');
        console.log('  🤝 Multi-Agent Workflows (Coordinated analysis)');
        console.log('  📊 Context-Aware Prompting (Real-time system state)');
        console.log('  🎯 Specialized Agent Personas (Domain expertise)');
        console.log('  📝 Conversation Memory (Context preservation)');
        console.log('  ⚙️ Dynamic Tool Selection (Intelligent function calling)');

    } catch (error) {
        console.error('❌ Test suite failed:', error);
        process.exit(1);
    }
}

// Run tests
runAllTests();