import { EventEmitter } from 'events';

export interface WebSocketMessage {
    type: string;
    data: any;
    timestamp: string;
    id?: string;
}

export interface WebSocketConnection {
    id: string;
    userId?: string;
    subscriptions: string[];
    lastPing: number;
    isAlive: boolean;
}

export class WebSocketService extends EventEmitter {
    private static instance: WebSocketService;
    private connections: Map<string, WebSocketConnection> = new Map();
    private subscriptions: Map<string, Set<string>> = new Map();
    private heartbeatInterval: NodeJS.Timeout | null = null;
    private dataUpdateInterval: NodeJS.Timeout | null = null;

    private constructor() {
        super();
        this.startHeartbeat();
        this.startDataUpdates();
    }

    public static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    // Connect a new client
    public connect(connectionId: string, userId?: string): void {
        const connection: WebSocketConnection = {
            id: connectionId,
            userId,
            subscriptions: [],
            lastPing: Date.now(),
            isAlive: true
        };

        this.connections.set(connectionId, connection);
        this.emit('connection', connection);

        // Send welcome message
        this.sendToConnection(connectionId, {
            type: 'welcome',
            data: { message: 'Connected to MidoStore real-time service', connectionId },
            timestamp: new Date().toISOString()
        });
    }

    // Disconnect a client
    public disconnect(connectionId: string): void {
        const connection = this.connections.get(connectionId);
        if (connection) {
            // Remove from all subscriptions
            connection.subscriptions.forEach(subscription => {
                this.unsubscribe(connectionId, subscription);
            });

            this.connections.delete(connectionId);
            this.emit('disconnection', connection);
        }
    }

    // Subscribe to a channel
    public subscribe(connectionId: string, channel: string): boolean {
        const connection = this.connections.get(connectionId);
        if (!connection) return false;

        if (!this.subscriptions.has(channel)) {
            this.subscriptions.set(channel, new Set());
        }

        this.subscriptions.get(channel)!.add(connectionId);
        connection.subscriptions.push(channel);

        this.sendToConnection(connectionId, {
            type: 'subscribed',
            data: { channel, message: `Subscribed to ${channel}` },
            timestamp: new Date().toISOString()
        });

        return true;
    }

    // Unsubscribe from a channel
    public unsubscribe(connectionId: string, channel: string): boolean {
        const connection = this.connections.get(connectionId);
        if (!connection) return false;

        const channelSubs = this.subscriptions.get(channel);
        if (channelSubs) {
            channelSubs.delete(connectionId);
            if (channelSubs.size === 0) {
                this.subscriptions.delete(channel);
            }
        }

        connection.subscriptions = connection.subscriptions.filter(sub => sub !== channel);

        this.sendToConnection(connectionId, {
            type: 'unsubscribed',
            data: { channel, message: `Unsubscribed from ${channel}` },
            timestamp: new Date().toISOString()
        });

        return true;
    }

    // Broadcast message to all subscribers of a channel
    public broadcast(channel: string, message: Omit<WebSocketMessage, 'timestamp'>): void {
        const subscribers = this.subscriptions.get(channel);
        if (!subscribers) return;

        const fullMessage: WebSocketMessage = {
            ...message,
            timestamp: new Date().toISOString()
        };

        subscribers.forEach(connectionId => {
            this.sendToConnection(connectionId, fullMessage);
        });
    }

    // Send message to specific connection
    public sendToConnection(connectionId: string, message: WebSocketMessage): void {
        const connection = this.connections.get(connectionId);
        if (!connection || !connection.isAlive) return;

        // In a real implementation, this would send via WebSocket
        // For now, we'll emit an event that can be handled by the client
        this.emit('message', { connectionId, message });
    }

    // Send message to specific user
    public sendToUser(userId: string, message: WebSocketMessage): void {
        this.connections.forEach((connection, connectionId) => {
            if (connection.userId === userId && connection.isAlive) {
                this.sendToConnection(connectionId, message);
            }
        });
    }

    // Update connection ping
    public ping(connectionId: string): void {
        const connection = this.connections.get(connectionId);
        if (connection) {
            connection.lastPing = Date.now();
            connection.isAlive = true;
        }
    }

    // Get connection status
    public getConnectionStatus(connectionId: string): WebSocketConnection | null {
        return this.connections.get(connectionId) || null;
    }

    // Get all connections
    public getAllConnections(): WebSocketConnection[] {
        return Array.from(this.connections.values());
    }

    // Get subscription count for a channel
    public getSubscriptionCount(channel: string): number {
        return this.subscriptions.get(channel)?.size || 0;
    }

    // Start heartbeat to check connection health
    private startHeartbeat(): void {
        this.heartbeatInterval = setInterval(() => {
            const now = Date.now();
            this.connections.forEach((connection, connectionId) => {
                if (now - connection.lastPing > 30000) { // 30 seconds timeout
                    connection.isAlive = false;
                    this.disconnect(connectionId);
                }
            });
        }, 10000); // Check every 10 seconds
    }

    // Start periodic data updates
    private startDataUpdates(): void {
        this.dataUpdateInterval = setInterval(() => {
            this.updateAnalytics();
            this.updateOrders();
            this.updateInventory();
        }, 5000); // Update every 5 seconds
    }

    // Update analytics data
    private updateAnalytics(): void {
        const analyticsData = {
            currentVisitors: Math.floor(Math.random() * 100) + 50,
            activeSessions: Math.floor(Math.random() * 30) + 10,
            revenueToday: Math.floor(Math.random() * 1000) + 500,
            conversionRate: (Math.random() * 2 + 1).toFixed(2)
        };

        this.broadcast('analytics', {
            type: 'analytics_update',
            data: analyticsData
        });
    }

    // Update orders data
    private updateOrders(): void {
        const ordersData = {
            newOrders: Math.floor(Math.random() * 5) + 1,
            pendingOrders: Math.floor(Math.random() * 10) + 5,
            completedOrders: Math.floor(Math.random() * 8) + 3
        };

        this.broadcast('orders', {
            type: 'orders_update',
            data: ordersData
        });
    }

    // Update inventory data
    private updateInventory(): void {
        const inventoryData = {
            lowStockItems: Math.floor(Math.random() * 10) + 5,
            outOfStockItems: Math.floor(Math.random() * 5) + 1,
            restockedItems: Math.floor(Math.random() * 3) + 1
        };

        this.broadcast('inventory', {
            type: 'inventory_update',
            data: inventoryData
        });
    }

    // Cleanup
    public destroy(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        if (this.dataUpdateInterval) {
            clearInterval(this.dataUpdateInterval);
        }
        this.connections.clear();
        this.subscriptions.clear();
        this.removeAllListeners();
    }
}

// Export singleton instance
export const webSocketService = WebSocketService.getInstance();