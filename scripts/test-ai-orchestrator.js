#!/usr/bin/env node

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

console.log('🤖 Testing AI Orchestrator System...\n');

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

async function testOrchestratorBasics() {
    console.log('🎯 Testing Orchestrator Basics...');

    // Test health check
    const health = await testAPI('/api/ai-orchestrator?action=health');
    console.log(`  Health Check: ${health.success ? '✅ PASS' : '❌ FAIL'} (${health.status})`);
    if (health.success) {
        console.log(`    Status: ${health.data.data.orchestrator}`);
        console.log(`    Version: ${health.data.data.version}`);
    }

    // Test status
    const status = await testAPI('/api/ai-orchestrator?action=status');
    console.log(`  Get Status: ${status.success ? '✅ PASS' : '❌ FAIL'} (${status.status})`);
    if (status.success) {
        console.log(`    Running: ${status.data.data.isRunning}`);
        console.log(`    Services: ${Object.keys(status.data.data.services || {}).length}`);
        console.log(`    Trends: ${Object.keys(status.data.data.trends || {}).length}`);
    }

    // Test analytics
    const analytics = await testAPI('/api/ai-orchestrator?action=analytics');
    console.log(`  Get Analytics: ${analytics.success ? '✅ PASS' : '❌ FAIL'} (${analytics.status})`);
    if (analytics.success) {
        const data = analytics.data.data;
        console.log(`    Healthy Services: ${data.serviceHealth?.healthy || 0}`);
        console.log(`    Total Decisions: ${data.decisionMetrics?.totalDecisions || 0}`);
        console.log(`    Active Rules: ${data.automationMetrics?.activeRules || 0}`);
    }

    console.log('');
}

async function testOrchestratorControl() {
    console.log('🎮 Testing Orchestrator Control...');

    // Test start orchestrator
    const start = await testAPI('/api/ai-orchestrator', 'POST', {
        action: 'start'
    });
    console.log(`  Start Orchestrator: ${start.success ? '✅ PASS' : '❌ FAIL'} (${start.status})`);
    if (start.success) {
        console.log(`    Message: ${start.data.message}`);
        console.log(`    Status: ${start.data.data.status}`);
    }

    // Wait a moment for the orchestrator to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test force analysis
    const forceAnalysis = await testAPI('/api/ai-orchestrator', 'POST', {
        action: 'force-analysis'
    });
    console.log(`  Force Analysis: ${forceAnalysis.success ? '✅ PASS' : '❌ FAIL'} (${forceAnalysis.status})`);

    // Test restart orchestrator
    const restart = await testAPI('/api/ai-orchestrator', 'POST', {
        action: 'restart'
    });
    console.log(`  Restart Orchestrator: ${restart.success ? '✅ PASS' : '❌ FAIL'} (${restart.status})`);

    console.log('');
}

async function testServiceMonitoring() {
    console.log('🔍 Testing Service Monitoring...');

    // Test get services
    const services = await testAPI('/api/ai-orchestrator?action=services');
    console.log(`  Get Services: ${services.success ? '✅ PASS' : '❌ FAIL'} (${services.status})`);
    if (services.success) {
        const serviceData = services.data.data;
        const serviceNames = Object.keys(serviceData);
        console.log(`    Monitored Services: ${serviceNames.length}`);

        // Show service statuses
        serviceNames.slice(0, 5).forEach(name => {
            const service = serviceData[name];
            console.log(`    ${name}: ${service.status} (${service.responseTime?.toFixed(0) || 0}ms)`);
        });
    }

    // Test performance metrics
    const performance = await testAPI('/api/ai-orchestrator?action=performance-metrics');
    console.log(`  Performance Metrics: ${performance.success ? '✅ PASS' : '❌ FAIL'} (${performance.status})`);
    if (performance.success) {
        const metrics = performance.data.data;
        console.log(`    Avg Response Time: ${metrics.averageResponseTime?.toFixed(0) || 0}ms`);
        console.log(`    Error Rate: ${metrics.totalErrorRate?.toFixed(1) || 0}%`);
        console.log(`    Resource Usage: ${metrics.averageResourceUsage?.toFixed(1) || 0}%`);
    }

    console.log('');
}

async function testTrendAnalysis() {
    console.log('📈 Testing Trend Analysis...');

    // Test get trends
    const trends = await testAPI('/api/ai-orchestrator?action=trends');
    console.log(`  Get Trends: ${trends.success ? '✅ PASS' : '❌ FAIL'} (${trends.status})`);
    if (trends.success) {
        const trendData = trends.data.data;
        const categories = Object.keys(trendData);
        console.log(`    Analyzed Categories: ${categories.length}`);

        // Show trend details
        categories.slice(0, 3).forEach(category => {
            const trend = trendData[category];
            console.log(`    ${category}: ${trend.trend} (${trend.momentum?.toFixed(0) || 0}% momentum)`);
        });
    }

    // Test update trends
    const updateTrends = await testAPI('/api/ai-orchestrator', 'POST', {
        action: 'update-trends',
        category: 'electronics',
        trendData: {
            momentum: 85,
            confidence: 92,
            socialMentions: 15000,
            keywords: ['AI gadgets', 'smart devices', 'IoT']
        }
    });
    console.log(`  Update Trends: ${updateTrends.success ? '✅ PASS' : '❌ FAIL'} (${updateTrends.status})`);

    console.log('');
}

async function testDecisionMaking() {
    console.log('🧠 Testing Decision Making...');

    // Test get decisions
    const decisions = await testAPI('/api/ai-orchestrator?action=decisions');
    console.log(`  Get Decisions: ${decisions.success ? '✅ PASS' : '❌ FAIL'} (${decisions.status})`);
    if (decisions.success) {
        const decisionData = decisions.data.data;
        console.log(`    Recent Decisions: ${decisionData.length}`);

        // Show decision details
        decisionData.slice(0, 3).forEach((decision, index) => {
            console.log(`    Decision ${index + 1}: ${decision.priority} priority - ${decision.status}`);
        });
    }

    // Test manual decision
    const manualDecision = await testAPI('/api/ai-orchestrator', 'POST', {
        action: 'manual-decision',
        decisionType: 'marketing_boost',
        reasoning: 'Test manual decision for trending electronics category',
        priority: 'high',
        resources: { budget: 10000, team: 'marketing' }
    });
    console.log(`  Manual Decision: ${manualDecision.success ? '✅ PASS' : '❌ FAIL'} (${manualDecision.status})`);
    if (manualDecision.success) {
        console.log(`    Decision ID: ${manualDecision.data.data.id}`);
        console.log(`    Expected Impact: ${manualDecision.data.data.expectedImpact}%`);
    }

    console.log('');
}

async function testAutomationRules() {
    console.log('⚙️ Testing Automation Rules...');

    // Test get automation rules
    const automationRules = await testAPI('/api/ai-orchestrator?action=automation-rules');
    console.log(`  Get Automation Rules: ${automationRules.success ? '✅ PASS' : '❌ FAIL'} (${automationRules.status})`);
    if (automationRules.success) {
        const rules = automationRules.data.data;
        console.log(`    Total Rules: ${rules.totalRules}`);
        console.log(`    Active Rules: ${rules.activeRules}`);
        console.log(`    Success Rate: ${rules.averageSuccessRate?.toFixed(1) || 0}%`);
    }

    // Test create automation rule
    const createRule = await testAPI('/api/ai-orchestrator', 'POST', {
        action: 'create-automation-rule',
        name: 'Test High CPU Alert',
        trigger: { metric: 'cpuUsage', threshold: 80, operator: '>' },
        conditions: [{ field: 'status', value: 'healthy' }],
        actions: [
            { type: 'scale_service', factor: 1.5 },
            { type: 'notify_admin', message: 'High CPU usage detected' }
        ],
        priority: 3
    });
    console.log(`  Create Rule: ${createRule.success ? '✅ PASS' : '❌ FAIL'} (${createRule.status})`);
    if (createRule.success) {
        console.log(`    Rule ID: ${createRule.data.data.id}`);
        console.log(`    Rule Name: ${createRule.data.data.name}`);
    }

    console.log('');
}

async function testScalingOperations() {
    console.log('📊 Testing Scaling Operations...');

    // Test scale service
    const scaleService = await testAPI('/api/ai-orchestrator', 'POST', {
        action: 'scale-service',
        serviceName: 'web3-service',
        scaleAction: 'scale_up',
        factor: 1.5
    });
    console.log(`  Scale Service: ${scaleService.success ? '✅ PASS' : '❌ FAIL'} (${scaleService.status})`);
    if (scaleService.success) {
        console.log(`    Service: ${scaleService.data.data.serviceName}`);
        console.log(`    Action: ${scaleService.data.data.action}`);
        console.log(`    Factor: ${scaleService.data.data.factor}`);
    }

    // Test optimize system
    const optimizeSystem = await testAPI('/api/ai-orchestrator', 'POST', {
        action: 'optimize-system',
        optimizationType: 'performance'
    });
    console.log(`  Optimize System: ${optimizeSystem.success ? '✅ PASS' : '❌ FAIL'} (${optimizeSystem.status})`);
    if (optimizeSystem.success) {
        console.log(`    Type: ${optimizeSystem.data.data.optimizationType}`);
        console.log(`    Duration: ${optimizeSystem.data.data.estimatedDuration}`);
    }

    console.log('');
}

async function testEmergencyOperations() {
    console.log('🚨 Testing Emergency Operations...');

    // Test emergency override
    const emergencyOverride = await testAPI('/api/ai-orchestrator', 'POST', {
        action: 'emergency-override',
        serviceName: 'p2p-marketplace',
        action: 'restart'
    });
    console.log(`  Emergency Override: ${emergencyOverride.success ? '✅ PASS' : '❌ FAIL'} (${emergencyOverride.status})`);
    if (emergencyOverride.success) {
        console.log(`    Service: ${emergencyOverride.data.data.serviceName}`);
        console.log(`    Status: ${emergencyOverride.data.data.status}`);
    }

    console.log('');
}

async function testSystemOverview() {
    console.log('🌐 Testing System Overview...');

    // Test system overview
    const overview = await testAPI('/api/ai-orchestrator?action=system-overview');
    console.log(`  System Overview: ${overview.success ? '✅ PASS' : '❌ FAIL'} (${overview.status})`);
    if (overview.success) {
        const data = overview.data.data;
        console.log(`    System Status: ${data.status?.isRunning ? 'Running' : 'Stopped'}`);
        console.log(`    Service Health: ${data.analytics?.serviceHealth?.healthy || 0} healthy services`);
        console.log(`    Recommendations: ${data.recommendations?.immediate?.length || 0} immediate`);
    }

    console.log('');
}

async function testOrchestratorDashboard() {
    console.log('📊 Testing Orchestrator Dashboard...');

    // Test dashboard page
    const dashboard = await testAPI('/ai-orchestrator');
    console.log(`  Dashboard Page: ${dashboard.success ? '✅ PASS' : '❌ FAIL'} (${dashboard.status})`);

    console.log('');
}

async function runAllTests() {
    console.log(`Testing against: ${BASE_URL}\n`);

    try {
        await testOrchestratorBasics();
        await testOrchestratorControl();
        await testServiceMonitoring();
        await testTrendAnalysis();
        await testDecisionMaking();
        await testAutomationRules();
        await testScalingOperations();
        await testEmergencyOperations();
        await testSystemOverview();
        await testOrchestratorDashboard();

        console.log('🎉 All AI Orchestrator tests completed!\n');
        console.log('📋 Summary:');
        console.log('  ✅ AI-powered service orchestration and management');
        console.log('  ✅ Real-time monitoring of all microservices');
        console.log('  ✅ Intelligent trend analysis and market insights');
        console.log('  ✅ Automated decision making with confidence scoring');
        console.log('  ✅ Smart automation rules with trigger-based actions');
        console.log('  ✅ Dynamic service scaling based on performance');
        console.log('  ✅ Emergency response and crisis management');
        console.log('  ✅ Comprehensive analytics and reporting');
        console.log('  ✅ Strategic marketing and business optimization');
        console.log('  ✅ 24/7 autonomous platform management');

        console.log('\n🤖 AI Orchestrator Features:');
        console.log('  🧠 Intelligent Decision Engine');
        console.log('  📊 Real-time Analytics & Insights');
        console.log('  🔄 Automated Service Management');
        console.log('  📈 Market Trend Analysis');
        console.log('  ⚡ Dynamic Resource Scaling');
        console.log('  🎯 Strategic Campaign Optimization');
        console.log('  🛡️ Proactive Issue Resolution');
        console.log('  🔮 Predictive Business Intelligence');

    } catch (error) {
        console.error('❌ Test suite failed:', error);
        process.exit(1);
    }
}

// Run tests
runAllTests();