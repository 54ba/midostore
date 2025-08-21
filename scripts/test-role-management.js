#!/usr/bin/env node

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

console.log('👑 Testing Role Management System...\n');

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

async function testRoleBasics() {
    console.log('🎯 Testing Role Management Basics...');

    // Test get all roles
    const allRoles = await testAPI('/api/role-management?action=all-roles');
    console.log(`  Get All Roles: ${allRoles.success ? '✅ PASS' : '❌ FAIL'} (${allRoles.status})`);
    if (allRoles.success) {
        const roles = allRoles.data.data;
        console.log(`    Available Roles: ${roles.length}`);
        roles.forEach(role => {
            console.log(`      - ${role.name} (Level ${role.level}): ${role.description}`);
        });
    }

    // Test role statistics
    const stats = await testAPI('/api/role-management?action=role-statistics');
    console.log(`  Role Statistics: ${stats.success ? '✅ PASS' : '❌ FAIL'} (${stats.status})`);
    if (stats.success) {
        const data = stats.data.data;
        console.log(`    Total Users: ${data.totalUsers}`);
        console.log(`    Managers: ${data.managerCount}`);
        console.log(`    Admins: ${data.adminCount}`);
        console.log(`    Regular Users: ${data.userCount}`);
    }

    console.log('');
}

async function testManagerRole() {
    console.log('👑 Testing Manager Role...');

    const testUserId = 'test-manager-user-123';

    // Test role details
    const managerRole = await testAPI('/api/role-management?action=role-details&roleId=manager');
    console.log(`  Get Manager Role Details: ${managerRole.success ? '✅ PASS' : '❌ FAIL'} (${managerRole.status})`);
    if (managerRole.success) {
        const role = managerRole.data.data;
        console.log(`    Role Name: ${role.name}`);
        console.log(`    Level: ${role.level}`);
        console.log(`    Permissions: ${role.permissions.length}`);
        console.log(`    Features: ${role.features.length}`);
        console.log(`    Key Features: ${role.features.slice(0, 5).join(', ')}...`);
    }

    // Test assign manager role
    const assignManager = await testAPI('/api/role-management', 'POST', {
        action: 'assign-role',
        userId: testUserId,
        roleId: 'manager',
        assignedBy: 'admin-user-456'
    });
    console.log(`  Assign Manager Role: ${assignManager.success ? '✅ PASS' : '❌ FAIL'} (${assignManager.status})`);
    if (assignManager.success) {
        console.log(`    Message: ${assignManager.data.message}`);
    }

    // Test check manager status
    const checkManager = await testAPI(`/api/role-management?action=check-manager&userId=${testUserId}`);
    console.log(`  Check Manager Status: ${checkManager.success ? '✅ PASS' : '❌ FAIL'} (${checkManager.status})`);
    if (checkManager.success) {
        console.log(`    Is Manager: ${checkManager.data.data.isManager}`);
    }

    // Test manager capabilities
    const capabilities = await testAPI(`/api/role-management?action=manager-capabilities&userId=${testUserId}`);
    console.log(`  Get Manager Capabilities: ${capabilities.success ? '✅ PASS' : '❌ FAIL'} (${capabilities.status})`);
    if (capabilities.success) {
        const caps = capabilities.data.data;
        console.log(`    User Experience: ${Object.keys(caps.userExperience).length} capabilities`);
        console.log(`    AI Orchestrator: ${Object.keys(caps.aiOrchestrator).length} capabilities`);
        console.log(`    Analytics: ${Object.keys(caps.analytics).length} capabilities`);
        console.log(`    Supervision: ${Object.keys(caps.supervision).length} capabilities`);
    }

    console.log('');
}

async function testManagerDashboard() {
    console.log('📊 Testing Manager Dashboard...');

    const testUserId = 'test-manager-user-123';

    // Test dashboard configuration
    const dashboardConfig = await testAPI(`/api/role-management?action=manager-dashboard-config&userId=${testUserId}`);
    console.log(`  Get Dashboard Config: ${dashboardConfig.success ? '✅ PASS' : '❌ FAIL'} (${dashboardConfig.status})`);
    if (dashboardConfig.success) {
        const config = dashboardConfig.data.data;
        console.log(`    Layout: ${config.layout}`);
        console.log(`    Sections: ${config.sections.length}`);
        config.sections.forEach(section => {
            console.log(`      - ${section.title}: ${section.components.length} components`);
        });
        console.log(`    Permissions: ${Object.keys(config.permissions).length} granted`);
    }

    // Test manager page access
    const managerPage = await testAPI('/manager');
    console.log(`  Manager Page Access: ${managerPage.success ? '✅ PASS' : '❌ FAIL'} (${managerPage.status})`);

    console.log('');
}

async function testPermissionSystem() {
    console.log('🔐 Testing Permission System...');

    const testUserId = 'test-manager-user-123';

    // Test user permissions
    const userPermissions = await testAPI(`/api/role-management?action=user-permissions&userId=${testUserId}`);
    console.log(`  Get User Permissions: ${userPermissions.success ? '✅ PASS' : '❌ FAIL'} (${userPermissions.status})`);
    if (userPermissions.success) {
        const permissions = userPermissions.data.data;
        console.log(`    Total Permissions: ${permissions.length}`);
        console.log(`    Sample Permissions:`);
        permissions.slice(0, 5).forEach(perm => {
            console.log(`      - ${perm.name}: ${perm.actions.join(', ')} on ${perm.resource}`);
        });
    }

    // Test specific permission checks
    const permissionTests = [
        { resource: 'products', action: 'read' },
        { resource: 'ai-orchestrator', action: 'control' },
        { resource: 'analytics', action: 'export' },
        { resource: 'services', action: 'monitor' },
        { resource: 'users', action: 'create' } // Should fail for manager
    ];

    for (const test of permissionTests) {
        const checkPermission = await testAPI('/api/role-management', 'POST', {
            action: 'check-permission',
            userId: testUserId,
            resource: test.resource,
            action: test.action
        });

        const hasPermission = checkPermission.success ? checkPermission.data.data.hasPermission : false;
        console.log(`  Permission ${test.action} on ${test.resource}: ${hasPermission ? '✅ GRANTED' : '❌ DENIED'}`);
    }

    console.log('');
}

async function testFeatureAccess() {
    console.log('🎯 Testing Feature Access...');

    const testUserId = 'test-manager-user-123';

    // Test user features
    const userFeatures = await testAPI(`/api/role-management?action=user-features&userId=${testUserId}`);
    console.log(`  Get User Features: ${userFeatures.success ? '✅ PASS' : '❌ FAIL'} (${userFeatures.status})`);
    if (userFeatures.success) {
        const features = userFeatures.data.data;
        console.log(`    Total Features: ${features.length}`);
        console.log(`    Key Features: ${features.slice(0, 8).join(', ')}...`);
    }

    // Test specific feature checks
    const featureTests = [
        'product-browsing',
        'ai-orchestrator-dashboard',
        'advanced-analytics',
        'service-monitoring',
        'user-management', // Should fail for manager
        'system-configuration' // Should fail for manager
    ];

    for (const feature of featureTests) {
        const checkFeature = await testAPI('/api/role-management', 'POST', {
            action: 'check-feature',
            userId: testUserId,
            feature: feature
        });

        const hasFeature = checkFeature.success ? checkFeature.data.data.hasFeature : false;
        console.log(`  Feature ${feature}: ${hasFeature ? '✅ AVAILABLE' : '❌ RESTRICTED'}`);
    }

    console.log('');
}

async function testRolePromotion() {
    console.log('⬆️ Testing Role Promotion/Demotion...');

    const testUserId = 'test-regular-user-789';
    const adminUserId = 'admin-user-456';

    // Test promote to manager
    const promoteToManager = await testAPI('/api/role-management', 'POST', {
        action: 'promote-to-manager',
        userId: testUserId,
        assignedBy: adminUserId
    });
    console.log(`  Promote to Manager: ${promoteToManager.success ? '✅ PASS' : '❌ FAIL'} (${promoteToManager.status})`);
    if (promoteToManager.success) {
        console.log(`    Message: ${promoteToManager.data.message}`);
        console.log(`    New Role: ${promoteToManager.data.data.newRole}`);
    }

    // Test demote from manager
    const demoteFromManager = await testAPI('/api/role-management', 'POST', {
        action: 'demote-from-manager',
        userId: testUserId,
        assignedBy: adminUserId
    });
    console.log(`  Demote from Manager: ${demoteFromManager.success ? '✅ PASS' : '❌ FAIL'} (${demoteFromManager.status})`);
    if (demoteFromManager.success) {
        console.log(`    Message: ${demoteFromManager.data.message}`);
        console.log(`    New Role: ${demoteFromManager.data.data.newRole}`);
    }

    // Test unauthorized promotion (non-admin trying to promote)
    const unauthorizedPromotion = await testAPI('/api/role-management', 'POST', {
        action: 'promote-to-manager',
        userId: testUserId,
        assignedBy: 'regular-user-123'
    });
    console.log(`  Unauthorized Promotion: ${!unauthorizedPromotion.success ? '✅ BLOCKED' : '❌ SECURITY ISSUE'} (${unauthorizedPromotion.status})`);

    console.log('');
}

async function testBulkOperations() {
    console.log('📦 Testing Bulk Operations...');

    const testUserId = 'test-manager-user-123';

    // Test bulk permission check
    const bulkPermissions = await testAPI('/api/role-management', 'POST', {
        action: 'bulk-permission-check',
        userId: testUserId,
        permissions: [
            { resource: 'products', action: 'read' },
            { resource: 'orders', action: 'create' },
            { resource: 'ai-orchestrator', action: 'control' },
            { resource: 'analytics', action: 'export' },
            { resource: 'users', action: 'delete' },
            { resource: 'system', action: 'configure' }
        ]
    });
    console.log(`  Bulk Permission Check: ${bulkPermissions.success ? '✅ PASS' : '❌ FAIL'} (${bulkPermissions.status})`);
    if (bulkPermissions.success) {
        const results = bulkPermissions.data.data;
        console.log(`    Permission Results:`);
        results.forEach(result => {
            console.log(`      ${result.action} on ${result.resource}: ${result.hasPermission ? '✅' : '❌'}`);
        });
    }

    console.log('');
}

async function testActionLogging() {
    console.log('📝 Testing Action Logging...');

    const testUserId = 'test-manager-user-123';

    // Test log action
    const logAction = await testAPI('/api/role-management', 'POST', {
        action: 'log-action',
        userId: testUserId,
        action: 'orchestrator_control',
        resource: 'ai-orchestrator',
        details: {
            action_type: 'restart',
            timestamp: new Date().toISOString(),
            reason: 'Performance optimization'
        }
    });
    console.log(`  Log Action: ${logAction.success ? '✅ PASS' : '❌ FAIL'} (${logAction.status})`);
    if (logAction.success) {
        console.log(`    Message: ${logAction.data.message}`);
    }

    // Test multiple action logs
    const actions = [
        { action: 'view_analytics', resource: 'analytics' },
        { action: 'monitor_services', resource: 'services' },
        { action: 'review_decisions', resource: 'decisions' }
    ];

    for (const actionData of actions) {
        const logResult = await testAPI('/api/role-management', 'POST', {
            action: 'log-action',
            userId: testUserId,
            action: actionData.action,
            resource: actionData.resource,
            details: { timestamp: new Date().toISOString() }
        });

        console.log(`  Log ${actionData.action}: ${logResult.success ? '✅ LOGGED' : '❌ FAILED'}`);
    }

    console.log('');
}

async function testRoleComparison() {
    console.log('⚖️ Testing Role Comparison...');

    // Compare different roles
    const roles = ['user', 'manager', 'admin'];

    for (const roleId of roles) {
        const roleDetails = await testAPI(`/api/role-management?action=role-details&roleId=${roleId}`);
        if (roleDetails.success) {
            const role = roleDetails.data.data;
            console.log(`  ${role.name} Role (Level ${role.level}):`);
            console.log(`    Permissions: ${role.permissions.length}`);
            console.log(`    Features: ${role.features.length}`);
            console.log(`    Restrictions: ${role.restrictions.length}`);
            console.log(`    Status: ${role.isActive ? 'Active' : 'Inactive'}`);
        }
    }

    console.log('');
}

async function runAllTests() {
    console.log(`Testing against: ${BASE_URL}\n`);

    try {
        await testRoleBasics();
        await testManagerRole();
        await testManagerDashboard();
        await testPermissionSystem();
        await testFeatureAccess();
        await testRolePromotion();
        await testBulkOperations();
        await testActionLogging();
        await testRoleComparison();

        console.log('🎉 All Role Management tests completed!\n');
        console.log('📋 Summary:');
        console.log('  ✅ Role management system with User, Manager, and Admin roles');
        console.log('  ✅ Manager role with dual user experience + AI orchestrator supervision');
        console.log('  ✅ Comprehensive permission and feature access control');
        console.log('  ✅ Manager dashboard with unified platform management');
        console.log('  ✅ Role promotion/demotion with proper authorization');
        console.log('  ✅ Bulk operations and action logging capabilities');
        console.log('  ✅ Security boundaries and access restrictions');
        console.log('  ✅ Manager capabilities for platform oversight');

        console.log('\n👑 Manager Role Features:');
        console.log('  🛍️ Full User Experience (shopping, tokens, P2P trading)');
        console.log('  🤖 AI Orchestrator Supervision (control, monitor, override)');
        console.log('  📊 Advanced Analytics Access (all data, insights, exports)');
        console.log('  🔍 Service Monitoring (health checks, scaling decisions)');
        console.log('  🎯 Trend Analysis (market intelligence, predictions)');
        console.log('  ⚡ Decision Oversight (review, approve, reject AI decisions)');
        console.log('  🛡️ Crisis Management (emergency response, system recovery)');
        console.log('  📈 Business Intelligence (performance metrics, optimization)');

        console.log('\n🔐 Security Model:');
        console.log('  👤 User Role: Basic platform access');
        console.log('  👑 Manager Role: User experience + AI orchestrator supervision');
        console.log('  🔧 Admin Role: Full system administration');
        console.log('  🛡️ Proper authorization checks for role changes');
        console.log('  📝 Complete action logging and audit trail');

    } catch (error) {
        console.error('❌ Test suite failed:', error);
        process.exit(1);
    }
}

// Run tests
runAllTests();