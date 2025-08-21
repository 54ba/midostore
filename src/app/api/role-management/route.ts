import { NextRequest, NextResponse } from 'next/server';
import RoleManagementService from '@/lib/role-management-service';

// Global role management instance
let roleManager: RoleManagementService | null = null;

// Initialize role manager if not already created
function getRoleManager(): RoleManagementService {
    if (!roleManager) {
        roleManager = new RoleManagementService();
    }
    return roleManager;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action') || 'all-roles';
        const userId = searchParams.get('userId');

        const roleManager = getRoleManager();

        switch (action) {
            case 'user-role':
                if (!userId) {
                    return NextResponse.json(
                        { error: 'User ID is required' },
                        { status: 400 }
                    );
                }

                const userRole = await roleManager.getUserRole(userId);
                return NextResponse.json({
                    success: true,
                    data: userRole,
                });

            case 'user-permissions':
                if (!userId) {
                    return NextResponse.json(
                        { error: 'User ID is required' },
                        { status: 400 }
                    );
                }

                const permissions = await roleManager.getUserPermissions(userId);
                return NextResponse.json({
                    success: true,
                    data: permissions,
                });

            case 'user-features':
                if (!userId) {
                    return NextResponse.json(
                        { error: 'User ID is required' },
                        { status: 400 }
                    );
                }

                const features = await roleManager.getUserFeatures(userId);
                return NextResponse.json({
                    success: true,
                    data: features,
                });

            case 'all-roles':
                const allRoles = roleManager.getAllRoles();
                return NextResponse.json({
                    success: true,
                    data: allRoles,
                });

            case 'role-details':
                const roleId = searchParams.get('roleId');
                if (!roleId) {
                    return NextResponse.json(
                        { error: 'Role ID is required' },
                        { status: 400 }
                    );
                }

                const role = roleManager.getRole(roleId);
                if (!role) {
                    return NextResponse.json(
                        { error: 'Role not found' },
                        { status: 404 }
                    );
                }

                return NextResponse.json({
                    success: true,
                    data: role,
                });

            case 'manager-capabilities':
                if (!userId) {
                    return NextResponse.json(
                        { error: 'User ID is required' },
                        { status: 400 }
                    );
                }

                const capabilities = await roleManager.getManagerCapabilities(userId);
                if (!capabilities) {
                    return NextResponse.json(
                        { error: 'User is not a manager or capabilities not found' },
                        { status: 403 }
                    );
                }

                return NextResponse.json({
                    success: true,
                    data: capabilities,
                });

            case 'manager-dashboard-config':
                if (!userId) {
                    return NextResponse.json(
                        { error: 'User ID is required' },
                        { status: 400 }
                    );
                }

                const dashboardConfig = await roleManager.getManagerDashboardConfig(userId);
                if (!dashboardConfig) {
                    return NextResponse.json(
                        { error: 'User is not a manager or config not available' },
                        { status: 403 }
                    );
                }

                return NextResponse.json({
                    success: true,
                    data: dashboardConfig,
                });

            case 'role-statistics':
                const stats = await roleManager.getRoleStatistics();
                return NextResponse.json({
                    success: true,
                    data: stats,
                });

            case 'check-manager':
                if (!userId) {
                    return NextResponse.json(
                        { error: 'User ID is required' },
                        { status: 400 }
                    );
                }

                const isManager = await roleManager.isManager(userId);
                return NextResponse.json({
                    success: true,
                    data: { isManager },
                });

            case 'check-admin':
                if (!userId) {
                    return NextResponse.json(
                        { error: 'User ID is required' },
                        { status: 400 }
                    );
                }

                const isAdmin = await roleManager.isAdmin(userId);
                return NextResponse.json({
                    success: true,
                    data: { isAdmin },
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in role management GET:', error);
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

        const roleManager = getRoleManager();

        switch (action) {
            case 'assign-role':
                const { userId: assignUserId, roleId, assignedBy, expiresAt } = data;

                if (!assignUserId || !roleId || !assignedBy) {
                    return NextResponse.json(
                        { error: 'User ID, role ID, and assigned by are required' },
                        { status: 400 }
                    );
                }

                const assignSuccess = await roleManager.assignRole(
                    assignUserId,
                    roleId,
                    assignedBy,
                    expiresAt ? new Date(expiresAt) : undefined
                );

                if (assignSuccess) {
                    return NextResponse.json({
                        success: true,
                        message: `Role ${roleId} assigned to user ${assignUserId}`,
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to assign role' },
                        { status: 500 }
                    );
                }

            case 'check-permission':
                const { userId: checkUserId, resource, action: permissionAction } = data;

                if (!checkUserId || !resource || !permissionAction) {
                    return NextResponse.json(
                        { error: 'User ID, resource, and action are required' },
                        { status: 400 }
                    );
                }

                const hasPermission = await roleManager.hasPermission(
                    checkUserId,
                    resource,
                    permissionAction
                );

                return NextResponse.json({
                    success: true,
                    data: { hasPermission },
                });

            case 'check-feature':
                const { userId: featureUserId, feature } = data;

                if (!featureUserId || !feature) {
                    return NextResponse.json(
                        { error: 'User ID and feature are required' },
                        { status: 400 }
                    );
                }

                const hasFeature = await roleManager.hasFeature(featureUserId, feature);

                return NextResponse.json({
                    success: true,
                    data: { hasFeature },
                });

            case 'log-action':
                const { userId: logUserId, action: logAction, resource: logResource, details } = data;

                if (!logUserId || !logAction || !logResource) {
                    return NextResponse.json(
                        { error: 'User ID, action, and resource are required' },
                        { status: 400 }
                    );
                }

                await roleManager.logRoleAction(logUserId, logAction, logResource, details);

                return NextResponse.json({
                    success: true,
                    message: 'Action logged successfully',
                });

            case 'promote-to-manager':
                const { userId: promoteUserId, assignedBy: promoteAssignedBy } = data;

                if (!promoteUserId || !promoteAssignedBy) {
                    return NextResponse.json(
                        { error: 'User ID and assigned by are required' },
                        { status: 400 }
                    );
                }

                // Check if the assigner has admin privileges
                const isAssignerAdmin = await roleManager.isAdmin(promoteAssignedBy);
                if (!isAssignerAdmin) {
                    return NextResponse.json(
                        { error: 'Only administrators can promote users to manager' },
                        { status: 403 }
                    );
                }

                const promoteSuccess = await roleManager.assignRole(
                    promoteUserId,
                    'manager',
                    promoteAssignedBy
                );

                if (promoteSuccess) {
                    return NextResponse.json({
                        success: true,
                        message: `User ${promoteUserId} promoted to Manager`,
                        data: {
                            userId: promoteUserId,
                            newRole: 'manager',
                            assignedBy: promoteAssignedBy,
                            assignedAt: new Date().toISOString()
                        }
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to promote user to manager' },
                        { status: 500 }
                    );
                }

            case 'demote-from-manager':
                const { userId: demoteUserId, assignedBy: demoteAssignedBy } = data;

                if (!demoteUserId || !demoteAssignedBy) {
                    return NextResponse.json(
                        { error: 'User ID and assigned by are required' },
                        { status: 400 }
                    );
                }

                // Check if the assigner has admin privileges
                const isDemoterAdmin = await roleManager.isAdmin(demoteAssignedBy);
                if (!isDemoterAdmin) {
                    return NextResponse.json(
                        { error: 'Only administrators can demote managers' },
                        { status: 403 }
                    );
                }

                const demoteSuccess = await roleManager.assignRole(
                    demoteUserId,
                    'user',
                    demoteAssignedBy
                );

                if (demoteSuccess) {
                    return NextResponse.json({
                        success: true,
                        message: `User ${demoteUserId} demoted to User`,
                        data: {
                            userId: demoteUserId,
                            newRole: 'user',
                            assignedBy: demoteAssignedBy,
                            assignedAt: new Date().toISOString()
                        }
                    });
                } else {
                    return NextResponse.json(
                        { error: 'Failed to demote user from manager' },
                        { status: 500 }
                    );
                }

            case 'bulk-permission-check':
                const { userId: bulkUserId, permissions } = data;

                if (!bulkUserId || !Array.isArray(permissions)) {
                    return NextResponse.json(
                        { error: 'User ID and permissions array are required' },
                        { status: 400 }
                    );
                }

                const permissionResults = await Promise.all(
                    permissions.map(async (perm: any) => ({
                        resource: perm.resource,
                        action: perm.action,
                        hasPermission: await roleManager.hasPermission(
                            bulkUserId,
                            perm.resource,
                            perm.action
                        )
                    }))
                );

                return NextResponse.json({
                    success: true,
                    data: permissionResults,
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in role management POST:', error);
        return NextResponse.json(
            { error: (error as Error).message || 'Failed to process request' },
            { status: 500 }
        );
    }
}