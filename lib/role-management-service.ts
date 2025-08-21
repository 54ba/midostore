import { prisma } from './db';

export interface UserRole {
    id: string;
    name: string;
    description: string;
    level: number;
    permissions: Permission[];
    features: string[];
    restrictions: string[];
    isActive: boolean;
}

export interface Permission {
    id: string;
    name: string;
    resource: string;
    actions: string[];
    conditions?: any;
}

export interface UserRoleAssignment {
    userId: string;
    roleId: string;
    assignedBy: string;
    assignedAt: Date;
    expiresAt?: Date;
    isActive: boolean;
}

export class RoleManagementService {
    private roles: Map<string, UserRole> = new Map();

    constructor() {
        this.initializeDefaultRoles();
    }

    // Initialize default roles
    private initializeDefaultRoles(): void {
        const defaultRoles: UserRole[] = [
            {
                id: 'user',
                name: 'User',
                description: 'Standard user with basic platform access',
                level: 1,
                permissions: [
                    {
                        id: 'products-read',
                        name: 'Read Products',
                        resource: 'products',
                        actions: ['read', 'search', 'filter']
                    },
                    {
                        id: 'cart-manage',
                        name: 'Manage Cart',
                        resource: 'cart',
                        actions: ['create', 'read', 'update', 'delete']
                    },
                    {
                        id: 'orders-own',
                        name: 'Manage Own Orders',
                        resource: 'orders',
                        actions: ['create', 'read', 'update'],
                        conditions: { owner: true }
                    },
                    {
                        id: 'profile-manage',
                        name: 'Manage Profile',
                        resource: 'profile',
                        actions: ['read', 'update']
                    },
                    {
                        id: 'tokens-earn',
                        name: 'Earn Tokens',
                        resource: 'tokens',
                        actions: ['earn', 'view', 'transfer']
                    },
                    {
                        id: 'p2p-trade',
                        name: 'P2P Trading',
                        resource: 'p2p-marketplace',
                        actions: ['create', 'read', 'buy', 'sell']
                    }
                ],
                features: [
                    'product-browsing',
                    'shopping-cart',
                    'order-management',
                    'token-rewards',
                    'p2p-trading',
                    'basic-analytics',
                    'social-sharing'
                ],
                restrictions: [
                    'no-admin-access',
                    'no-system-management',
                    'limited-analytics'
                ],
                isActive: true
            },
            {
                id: 'manager',
                name: 'Manager',
                description: 'Platform manager with user experience + AI orchestrator supervision',
                level: 5,
                permissions: [
                    // All user permissions
                    {
                        id: 'products-full',
                        name: 'Full Product Access',
                        resource: 'products',
                        actions: ['create', 'read', 'update', 'delete', 'search', 'filter', 'analyze']
                    },
                    {
                        id: 'cart-full',
                        name: 'Full Cart Management',
                        resource: 'cart',
                        actions: ['create', 'read', 'update', 'delete', 'analyze']
                    },
                    {
                        id: 'orders-full',
                        name: 'Full Order Management',
                        resource: 'orders',
                        actions: ['create', 'read', 'update', 'delete', 'analyze', 'export']
                    },
                    {
                        id: 'users-read',
                        name: 'Read User Data',
                        resource: 'users',
                        actions: ['read', 'search', 'analyze']
                    },
                    {
                        id: 'analytics-full',
                        name: 'Full Analytics Access',
                        resource: 'analytics',
                        actions: ['read', 'analyze', 'export', 'dashboard']
                    },
                    {
                        id: 'ai-orchestrator-supervise',
                        name: 'AI Orchestrator Supervision',
                        resource: 'ai-orchestrator',
                        actions: ['read', 'monitor', 'control', 'configure', 'override']
                    },
                    {
                        id: 'services-monitor',
                        name: 'Service Monitoring',
                        resource: 'services',
                        actions: ['read', 'monitor', 'analyze', 'scale']
                    },
                    {
                        id: 'trends-analyze',
                        name: 'Trend Analysis',
                        resource: 'trends',
                        actions: ['read', 'analyze', 'predict', 'export']
                    },
                    {
                        id: 'decisions-review',
                        name: 'Review AI Decisions',
                        resource: 'decisions',
                        actions: ['read', 'approve', 'reject', 'override']
                    },
                    {
                        id: 'automation-manage',
                        name: 'Automation Management',
                        resource: 'automation',
                        actions: ['read', 'create', 'update', 'enable', 'disable']
                    },
                    {
                        id: 'tokens-admin',
                        name: 'Token Administration',
                        resource: 'tokens',
                        actions: ['mint', 'burn', 'transfer', 'analyze', 'reward']
                    }
                ],
                features: [
                    // All user features
                    'product-browsing',
                    'shopping-cart',
                    'order-management',
                    'token-rewards',
                    'p2p-trading',
                    'social-sharing',
                    // Manager-specific features
                    'ai-orchestrator-dashboard',
                    'advanced-analytics',
                    'service-monitoring',
                    'trend-analysis',
                    'decision-oversight',
                    'automation-control',
                    'user-analytics',
                    'performance-metrics',
                    'business-intelligence',
                    'crisis-management',
                    'system-optimization',
                    'predictive-insights',
                    'market-intelligence',
                    'competitive-analysis'
                ],
                restrictions: [
                    'no-system-admin',
                    'no-user-management',
                    'no-role-assignment',
                    'read-only-system-config'
                ],
                isActive: true
            },
            {
                id: 'admin',
                name: 'Administrator',
                description: 'Full system administrator with complete platform control',
                level: 10,
                permissions: [
                    {
                        id: 'system-full',
                        name: 'Full System Access',
                        resource: '*',
                        actions: ['*']
                    }
                ],
                features: [
                    'full-system-access',
                    'user-management',
                    'role-management',
                    'system-configuration',
                    'database-access',
                    'security-management'
                ],
                restrictions: [],
                isActive: true
            }
        ];

        defaultRoles.forEach(role => {
            this.roles.set(role.id, role);
        });
    }

    // Get user role
    async getUserRole(userId: string): Promise<UserRole | null> {
        try {
            const assignment = await prisma.userRoleAssignment.findFirst({
                where: {
                    userId,
                    isActive: true,
                    OR: [
                        { expiresAt: null },
                        { expiresAt: { gt: new Date() } }
                    ]
                },
                include: {
                    role: true
                }
            });

            if (!assignment) {
                // Return default user role
                return this.roles.get('user') || null;
            }

            return this.roles.get(assignment.roleId) || null;
        } catch (error) {
            console.error('Error getting user role:', error);
            return this.roles.get('user') || null;
        }
    }

    // Assign role to user
    async assignRole(userId: string, roleId: string, assignedBy: string, expiresAt?: Date): Promise<boolean> {
        try {
            // Verify role exists
            const role = this.roles.get(roleId);
            if (!role) {
                throw new Error('Role does not exist');
            }

            // Deactivate existing role assignments
            await prisma.userRoleAssignment.updateMany({
                where: { userId, isActive: true },
                data: { isActive: false }
            });

            // Create new role assignment
            await prisma.userRoleAssignment.create({
                data: {
                    userId,
                    roleId,
                    assignedBy,
                    assignedAt: new Date(),
                    expiresAt,
                    isActive: true
                }
            });

            console.log(`Role ${roleId} assigned to user ${userId}`);
            return true;
        } catch (error) {
            console.error('Error assigning role:', error);
            return false;
        }
    }

    // Check if user has permission
    async hasPermission(userId: string, resource: string, action: string): Promise<boolean> {
        try {
            const role = await this.getUserRole(userId);
            if (!role) return false;

            // Check if role has the specific permission
            return role.permissions.some(permission => {
                // Check for wildcard permissions
                if (permission.resource === '*' && permission.actions.includes('*')) {
                    return true;
                }

                // Check for specific resource and action
                if (permission.resource === resource) {
                    return permission.actions.includes(action) || permission.actions.includes('*');
                }

                return false;
            });
        } catch (error) {
            console.error('Error checking permission:', error);
            return false;
        }
    }

    // Check if user has feature access
    async hasFeature(userId: string, feature: string): Promise<boolean> {
        try {
            const role = await this.getUserRole(userId);
            if (!role) return false;

            return role.features.includes(feature);
        } catch (error) {
            console.error('Error checking feature access:', error);
            return false;
        }
    }

    // Get all roles
    getAllRoles(): UserRole[] {
        return Array.from(this.roles.values());
    }

    // Get role by ID
    getRole(roleId: string): UserRole | null {
        return this.roles.get(roleId) || null;
    }

    // Check if user is manager
    async isManager(userId: string): Promise<boolean> {
        try {
            const role = await this.getUserRole(userId);
            return role?.id === 'manager';
        } catch (error) {
            console.error('Error checking manager status:', error);
            return false;
        }
    }

    // Check if user is admin
    async isAdmin(userId: string): Promise<boolean> {
        try {
            const role = await this.getUserRole(userId);
            return role?.id === 'admin';
        } catch (error) {
            console.error('Error checking admin status:', error);
            return false;
        }
    }

    // Get user's effective permissions
    async getUserPermissions(userId: string): Promise<Permission[]> {
        try {
            const role = await this.getUserRole(userId);
            return role?.permissions || [];
        } catch (error) {
            console.error('Error getting user permissions:', error);
            return [];
        }
    }

    // Get user's available features
    async getUserFeatures(userId: string): Promise<string[]> {
        try {
            const role = await this.getUserRole(userId);
            return role?.features || [];
        } catch (error) {
            console.error('Error getting user features:', error);
            return [];
        }
    }

    // Get manager-specific capabilities
    async getManagerCapabilities(userId: string): Promise<any> {
        try {
            const isManager = await this.isManager(userId);
            if (!isManager) {
                return null;
            }

            return {
                userExperience: {
                    canBrowseProducts: true,
                    canManageCart: true,
                    canPlaceOrders: true,
                    canEarnTokens: true,
                    canTradeP2P: true,
                    canShareSocially: true
                },
                aiOrchestrator: {
                    canViewDashboard: true,
                    canMonitorServices: true,
                    canAnalyzeTrends: true,
                    canReviewDecisions: true,
                    canControlAutomation: true,
                    canOverrideDecisions: true,
                    canScaleServices: true,
                    canManageCrises: true
                },
                analytics: {
                    canViewAllData: true,
                    canExportReports: true,
                    canAnalyzeUsers: true,
                    canTrackPerformance: true,
                    canPredictTrends: true,
                    canViewCompetitorData: true
                },
                supervision: {
                    canMonitorAllServices: true,
                    canViewSystemHealth: true,
                    canAccessBusinessIntelligence: true,
                    canManageTokenEconomy: true,
                    canOptimizePerformance: true
                }
            };
        } catch (error) {
            console.error('Error getting manager capabilities:', error);
            return null;
        }
    }

    // Create manager dashboard configuration
    async getManagerDashboardConfig(userId: string): Promise<any> {
        try {
            const isManager = await this.isManager(userId);
            if (!isManager) {
                return null;
            }

            return {
                layout: 'manager',
                sections: [
                    {
                        id: 'user-experience',
                        title: 'User Experience',
                        components: [
                            'product-browser',
                            'shopping-cart',
                            'order-history',
                            'token-balance',
                            'p2p-listings'
                        ],
                        position: { row: 1, col: 1 }
                    },
                    {
                        id: 'ai-orchestrator',
                        title: 'AI Orchestrator',
                        components: [
                            'orchestrator-status',
                            'service-health',
                            'trend-analysis',
                            'decision-queue',
                            'automation-rules'
                        ],
                        position: { row: 1, col: 2 }
                    },
                    {
                        id: 'analytics',
                        title: 'Analytics & Insights',
                        components: [
                            'performance-metrics',
                            'user-analytics',
                            'revenue-tracking',
                            'conversion-rates',
                            'market-intelligence'
                        ],
                        position: { row: 2, col: 1 }
                    },
                    {
                        id: 'system-monitoring',
                        title: 'System Monitoring',
                        components: [
                            'service-status',
                            'resource-usage',
                            'error-tracking',
                            'scaling-decisions',
                            'crisis-alerts'
                        ],
                        position: { row: 2, col: 2 }
                    }
                ],
                permissions: {
                    canModifyLayout: true,
                    canExportData: true,
                    canControlServices: true,
                    canOverrideAI: true
                }
            };
        } catch (error) {
            console.error('Error getting manager dashboard config:', error);
            return null;
        }
    }

    // Log role action
    async logRoleAction(userId: string, action: string, resource: string, details?: any): Promise<void> {
        try {
            const role = await this.getUserRole(userId);

            await prisma.roleActionLog.create({
                data: {
                    userId,
                    roleId: role?.id || 'unknown',
                    action,
                    resource,
                    details: details || {},
                    timestamp: new Date()
                }
            });
        } catch (error) {
            console.error('Error logging role action:', error);
        }
    }

    // Get role statistics
    async getRoleStatistics(): Promise<any> {
        try {
            const stats = await prisma.userRoleAssignment.groupBy({
                by: ['roleId'],
                where: { isActive: true },
                _count: { userId: true }
            });

            const roleStats = stats.map(stat => ({
                roleId: stat.roleId,
                roleName: this.roles.get(stat.roleId)?.name || 'Unknown',
                userCount: stat._count.userId
            }));

            return {
                totalUsers: stats.reduce((sum, stat) => sum + stat._count.userId, 0),
                roleDistribution: roleStats,
                managerCount: roleStats.find(r => r.roleId === 'manager')?.userCount || 0,
                adminCount: roleStats.find(r => r.roleId === 'admin')?.userCount || 0,
                userCount: roleStats.find(r => r.roleId === 'user')?.userCount || 0
            };
        } catch (error) {
            console.error('Error getting role statistics:', error);
            return {
                totalUsers: 0,
                roleDistribution: [],
                managerCount: 0,
                adminCount: 0,
                userCount: 0
            };
        }
    }
}

export default RoleManagementService;