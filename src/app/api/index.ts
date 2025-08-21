// API Endpoints Index
// This file provides a central reference for all available API endpoints

export const API_ENDPOINTS = {
    // Core Product APIs
    products: '/api/products',
    recommendations: '/api/recommendations',
    reviews: '/api/reviews',

    // User and Order APIs
    users: '/api/users',
    orders: '/api/orders',
    payments: '/api/payments',

    // Authentication and Payment
    stripe: '/api/stripe',

    // Analytics and AI
    analytics: '/api/analytics',
    aiOrchestrator: '/api/ai-orchestrator',
    aiAgentSupervisor: '/api/ai-agent-supervisor',
    roleManagement: '/api/role-management',

    // Localization and Currency
    localization: '/api/localization',
    exchangeRates: '/api/exchange-rates',

    // E-commerce Features
    bulkPricing: '/api/bulk-pricing',
    advertising: '/api/advertising',
    sharing: '/api/sharing',

    // Crypto and Web3
    crypto: '/api/crypto',
    web3: '/api/web3',
    p2pMarketplace: '/api/p2p-marketplace',
    tokenRewards: '/api/token-rewards',

    // Shipping and Logistics
    shipping: '/api/shipping',

    // Social and Marketing
    socialTrends: '/api/social-trends',

    // Scraping and Data
    scraping: '/api/scraping',

    // Utility APIs
    placeholder: '/api/placeholder',
} as const;

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