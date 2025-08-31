import { useState, useEffect, useCallback, useRef } from 'react';

export interface WebSocketMessage {
    type: string;
    data: any;
    timestamp: string;
    id?: string;
}

export interface WebSocketState {
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;
    lastMessage: WebSocketMessage | null;
    connectionId: string | null;
}

export interface UseWebSocketOptions {
    url?: string;
    autoConnect?: boolean;
    autoReconnect?: boolean;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
    const {
        url = 'ws://localhost:3001',
        autoConnect = true,
        autoReconnect = true,
        reconnectInterval = 5000,
        maxReconnectAttempts = 5
    } = options;

    const [state, setState] = useState<WebSocketState>({
        isConnected: false,
        isConnecting: false,
        error: null,
        lastMessage: null,
        connectionId: null
    });

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const subscriptionsRef = useRef<Set<string>>(new Set());

    // Generate unique connection ID
    const connectionId = useRef(`conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

    const connect = useCallback(() => {
        if (state.isConnected || state.isConnecting) return;

        setState(prev => ({ ...prev, isConnecting: true, error: null }));

        try {
            // For demo purposes, we'll simulate WebSocket connection
            // In a real implementation, you would create an actual WebSocket
            const mockWebSocket = {
                readyState: 1, // OPEN
                send: (data: string) => {
                    // Simulate sending data
                    console.log('WebSocket send:', data);
                },
                close: () => {
                    // Simulate closing connection
                    setState(prev => ({
                        ...prev,
                        isConnected: false,
                        isConnecting: false,
                        connectionId: null
                    }));
                }
            } as any;

            wsRef.current = mockWebSocket;

            // Simulate successful connection
            setTimeout(() => {
                setState(prev => ({
                    ...prev,
                    isConnected: true,
                    isConnecting: false,
                    connectionId: connectionId.current
                }));
                reconnectAttemptsRef.current = 0;
            }, 1000);

        } catch (error) {
            setState(prev => ({
                ...prev,
                isConnecting: false,
                error: error instanceof Error ? error.message : 'Failed to connect'
            }));
        }
    }, [state.isConnected, state.isConnecting]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        setState(prev => ({
            ...prev,
            isConnected: false,
            isConnecting: false,
            connectionId: null
        }));

        reconnectAttemptsRef.current = 0;
    }, []);

    const send = useCallback((message: any) => {
        if (wsRef.current && state.isConnected) {
            try {
                const data = typeof message === 'string' ? message : JSON.stringify(message);
                wsRef.current.send(data);
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        }
    }, [state.isConnected]);

    const subscribe = useCallback((channel: string) => {
        if (subscriptionsRef.current.has(channel)) return;

        subscriptionsRef.current.add(channel);
        send({
            action: 'subscribe',
            channel,
            connectionId: connectionId.current
        });
    }, [send]);

    const unsubscribe = useCallback((channel: string) => {
        if (!subscriptionsRef.current.has(channel)) return;

        subscriptionsRef.current.delete(channel);
        send({
            action: 'unsubscribe',
            channel,
            connectionId: connectionId.current
        });
    }, [send]);

    const reconnect = useCallback(() => {
        if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
            setState(prev => ({
                ...prev,
                error: 'Max reconnection attempts reached'
            }));
            return;
        }

        reconnectAttemptsRef.current++;
        setState(prev => ({ ...prev, error: 'Reconnecting...' }));

        reconnectTimeoutRef.current = setTimeout(() => {
            connect();
        }, reconnectInterval);
    }, [connect, reconnectInterval, maxReconnectAttempts]);

    // Auto-connect effect
    useEffect(() => {
        if (autoConnect) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [autoConnect, connect, disconnect]);

    // Auto-reconnect effect
    useEffect(() => {
        if (autoReconnect && !state.isConnected && !state.isConnecting && reconnectAttemptsRef.current < maxReconnectAttempts) {
            reconnect();
        }
    }, [autoReconnect, state.isConnected, state.isConnecting, reconnect, maxReconnectAttempts]);

    // Simulate receiving messages for demo purposes
    useEffect(() => {
        if (!state.isConnected) return;

        const messageInterval = setInterval(() => {
            // Simulate different types of messages
            const messageTypes = ['analytics_update', 'orders_update', 'inventory_update', 'user_activity'];
            const randomType = messageTypes[Math.floor(Math.random() * messageTypes.length)];

            const mockMessage: WebSocketMessage = {
                type: randomType,
                data: generateMockData(randomType),
                timestamp: new Date().toISOString(),
                id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            };

            setState(prev => ({ ...prev, lastMessage: mockMessage }));
        }, 3000); // Simulate message every 3 seconds

        return () => clearInterval(messageInterval);
    }, [state.isConnected]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        ...state,
        connect,
        disconnect,
        send,
        subscribe,
        unsubscribe,
        reconnect
    };
};

// Helper function to generate mock data for different message types
function generateMockData(type: string): any {
    switch (type) {
        case 'analytics_update':
            return {
                currentVisitors: Math.floor(Math.random() * 100) + 50,
                activeSessions: Math.floor(Math.random() * 30) + 10,
                revenueToday: Math.floor(Math.random() * 1000) + 500,
                conversionRate: (Math.random() * 2 + 1).toFixed(2)
            };

        case 'orders_update':
            return {
                newOrders: Math.floor(Math.random() * 5) + 1,
                pendingOrders: Math.floor(Math.random() * 10) + 5,
                completedOrders: Math.floor(Math.random() * 8) + 3
            };

        case 'inventory_update':
            return {
                lowStockItems: Math.floor(Math.random() * 10) + 5,
                outOfStockItems: Math.floor(Math.random() * 5) + 1,
                restockedItems: Math.floor(Math.random() * 3) + 1
            };

        case 'user_activity':
            return {
                userId: `user-${Math.floor(Math.random() * 1000)}`,
                action: ['page_view', 'add_to_cart', 'search', 'checkout'][Math.floor(Math.random() * 4)],
                page: ['/products', '/cart', '/checkout', '/dashboard'][Math.floor(Math.random() * 4)],
                timestamp: new Date().toISOString()
            };

        default:
            return { message: 'Unknown message type' };
    }
}