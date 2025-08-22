// API Endpoints Index
// This file provides a central reference for all available API endpoints

export const API_ENDPOINTS = {
    analytics: '/api/analytics',
    products: '/api/products',
    orders: '/api/orders',
    reviews: '/api/reviews',
    users: '/api/users',
    features: '/api/features',
    localization: '/api/localization',
    recommendations: '/api/recommendations',
    bulkPricing: '/api/bulk-pricing',
    orderBatching: '/api/order-batching',
    p2pMarketplace: '/api/p2p-marketplace',
    tokenRewards: '/api/token-rewards',
    advertising: '/api/advertising',
    aiOrchestrator: '/api/ai-orchestrator',
    aiAgentSupervisor: '/api/ai-agent-supervisor',
    roleManagement: '/api/role-management',
    sharing: '/api/sharing',
    shipping: '/api/shipping',
    socialTrends: '/api/social-trends',
    exchangeRates: '/api/exchange-rates',
    payments: '/api/payments'
};

export type APIEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];

// API Response Types
export interface APIResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Common API Error Responses
export const API_ERRORS = {
    UNAUTHORIZED: { success: false, error: 'Authentication required' },
    NOT_FOUND: { success: false, error: 'Resource not found' },
    VALIDATION_ERROR: { success: false, error: 'Validation failed' },
    INTERNAL_ERROR: { success: false, error: 'Internal server error' },
    RATE_LIMITED: { success: false, error: 'Rate limit exceeded' },
} as const;