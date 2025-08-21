// Core Product Types
export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  images: string[];
  rating?: number;
  reviewCount: number;
  soldCount: number;
  category?: string;
  supplier: {
    name: string;
    verified: boolean;
    goldMember: boolean;
  };
  variants?: ProductVariant[];
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price: number;
  stock: number;
  sku: string;
}

export interface ScrapedProduct {
  externalId: string;
  source: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  currency: string;
  images: string[];
  category: string;
  subcategory?: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  soldCount: number;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  shippingWeight?: number;
  shippingDimensions?: string;
  supplier: string;
  variants?: ProductVariant[];
}

// Live Data Types
export interface LiveSale {
  id: string;
  customer: string;
  productTitle: string;
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'crypto' | 'bank';
  cryptoAmount?: number;
  cryptoType?: string;
  location: string;
  timestamp: Date;
}

export interface LivePriceUpdate {
  id: string;
  productId: string;
  productTitle: string;
  oldPrice: number;
  newPrice: number;
  currency: string;
  changePercent: number;
  isVolatile: boolean;
  timestamp: Date;
}

export interface LiveInventoryUpdate {
  id: string;
  productId: string;
  productTitle: string;
  action: 'restocked' | 'low_stock' | 'out_of_stock' | 'added';
  quantity: number;
  timestamp: Date;
}

// User and Authentication Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'manager' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Order and Payment Types
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: 'stripe' | 'crypto' | 'bank';
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  createdAt: Date;
}

// Review and Recommendation Types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface Recommendation {
  id: string;
  userId: string;
  productId: string;
  score: number;
  reason: string;
  category: string;
  createdAt: Date;
}

// Analytics Types
export interface AnalyticsData {
  id: string;
  type: 'page_view' | 'product_view' | 'cart_add' | 'purchase' | 'search';
  userId?: string;
  sessionId: string;
  data: Record<string, any>;
  timestamp: Date;
}

export interface LocalizationData {
  locale: string;
  currency: string;
  exchangeRate: number;
  lastUpdated: Date;
}

// Crypto and Web3 Types
export interface CryptoTransaction {
  id: string;
  userId: string;
  type: 'purchase' | 'refund' | 'transfer';
  amount: number;
  cryptoType: string;
  cryptoAmount: number;
  walletAddress: string;
  transactionHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
}

export interface Web3Wallet {
  address: string;
  chainId: number;
  balance: string;
  isConnected: boolean;
}

export interface P2PListing {
  id: string;
  sellerId: string;
  productId: string;
  price: number;
  currency: string;
  quantity: number;
  description: string;
  isActive: boolean;
  createdAt: Date;
}

export interface TokenReward {
  id: string;
  userId: string;
  type: 'purchase' | 'review' | 'referral' | 'daily_login';
  amount: number;
  description: string;
  timestamp: Date;
}

// Shipping Types
export interface ShippingTracking {
  id: string;
  orderId: string;
  carrier: string;
  trackingNumber: string;
  status: string;
  location: string;
  estimatedDelivery: Date;
  lastUpdated: Date;
}

// Social and Marketing Types
export interface SocialTrend {
  id: string;
  keyword: string;
  category: string;
  score: number;
  volume: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  timestamp: Date;
}

// AI Orchestrator Types
export interface AIOrchestratorDecision {
  id: string;
  type: 'scaling' | 'pricing' | 'inventory' | 'marketing' | 'optimization';
  priority: number;
  description: string;
  action: string;
  parameters: Record<string, any>;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  createdAt: Date;
  executedAt?: Date;
}

export interface AIAgentTask {
  id: string;
  agentId: string;
  type: 'analysis' | 'optimization' | 'monitoring' | 'decision';
  description: string;
  parameters: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  createdAt: Date;
  completedAt?: Date;
}