import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        // Enhanced analytics overview data with sophisticated metrics
        const overview = {
            // Core Metrics
            totalRevenue: 15499.95,
            totalOrders: 156,
            averageOrderValue: 99.36,
            conversionRate: 3.2,
            customerLifetimeValue: 245.67,
            repeatCustomerRate: 0.28,

            // Time Series Data for Charts
            revenueTrend: {
                daily: generateTimeSeriesData(30, 'daily', 100, 500),
                weekly: generateTimeSeriesData(12, 'weekly', 800, 3000),
                monthly: generateTimeSeriesData(12, 'monthly', 3000, 12000)
            },

            orderTrend: {
                daily: generateTimeSeriesData(30, 'daily', 5, 25),
                weekly: generateTimeSeriesData(12, 'weekly', 40, 120),
                monthly: generateTimeSeriesData(12, 'monthly', 150, 500)
            },

            // Performance Metrics
            performance: {
                pageLoadTime: 1.2,
                bounceRate: 0.34,
                sessionDuration: 245,
                pagesPerSession: 3.2
            },

            // Geographic Data
            geographicData: [
                { country: 'United States', revenue: 8540.25, orders: 89, percentage: 55.1 },
                { country: 'United Kingdom', revenue: 3240.50, orders: 32, percentage: 20.9 },
                { country: 'Canada', revenue: 1890.75, orders: 18, percentage: 12.2 },
                { country: 'Australia', revenue: 1828.45, orders: 17, percentage: 11.8 }
            ],

            // Device Analytics
            deviceAnalytics: [
                { device: 'Desktop', revenue: 10850.25, orders: 98, percentage: 70.0 },
                { device: 'Mobile', revenue: 3870.50, orders: 45, percentage: 25.0 },
                { device: 'Tablet', revenue: 779.20, orders: 13, percentage: 5.0 }
            ],

            // Traffic Sources
            trafficSources: [
                { source: 'Organic Search', revenue: 6970.25, orders: 67, percentage: 45.0 },
                { source: 'Direct', revenue: 4649.85, orders: 45, percentage: 30.0 },
                { source: 'Social Media', revenue: 2324.93, orders: 22, percentage: 15.0 },
                { source: 'Referral', revenue: 1554.92, orders: 22, percentage: 10.0 }
            ],

            // Top Products with Enhanced Data
            topProducts: [
                {
                    name: 'Wireless Headphones Pro',
                    sales: 45,
                    revenue: 4049.55,
                    profitMargin: 0.35,
                    category: 'Electronics',
                    rating: 4.8,
                    reviewCount: 156,
                    returnRate: 0.02,
                    avgOrderValue: 89.99
                },
                {
                    name: 'Smart Fitness Watch',
                    sales: 32,
                    revenue: 6399.68,
                    profitMargin: 0.42,
                    category: 'Electronics',
                    rating: 4.6,
                    reviewCount: 89,
                    returnRate: 0.03,
                    avgOrderValue: 199.99
                },
                {
                    name: 'Portable Bluetooth Speaker',
                    sales: 28,
                    revenue: 1399.72,
                    profitMargin: 0.38,
                    category: 'Electronics',
                    rating: 4.7,
                    reviewCount: 134,
                    returnRate: 0.01,
                    avgOrderValue: 49.99
                }
            ],

            // Customer Segmentation
            customerSegmentation: [
                { segment: 'High Value', count: 23, revenue: 7890.25, avgOrderValue: 343.05 },
                { segment: 'Medium Value', count: 67, revenue: 5230.50, avgOrderValue: 78.07 },
                { segment: 'Low Value', count: 66, revenue: 2379.20, avgOrderValue: 36.05 }
            ],

            // Inventory Analytics
            inventoryAnalytics: {
                totalProducts: 1247,
                lowStockItems: 23,
                outOfStockItems: 8,
                topSellingCategories: [
                    { category: 'Electronics', revenue: 8540.25, percentage: 55.1 },
                    { category: 'Fashion', revenue: 3870.50, percentage: 25.0 },
                    { category: 'Home & Garden', revenue: 3089.20, percentage: 19.9 }
                ]
            },

            // Recent Activity with Enhanced Details
            recentActivity: [
                {
                    type: 'order',
                    message: 'New order received for Wireless Headphones Pro',
                    timestamp: new Date().toISOString(),
                    metadata: {
                        orderId: 'ORD-2024-001',
                        customerId: 'CUST-001',
                        amount: 89.99,
                        status: 'confirmed'
                    }
                },
                {
                    type: 'payment',
                    message: 'Payment processed for Smart Fitness Watch',
                    timestamp: new Date(Date.now() - 300000).toISOString(),
                    metadata: {
                        orderId: 'ORD-2024-002',
                        paymentMethod: 'credit_card',
                        amount: 199.99,
                        status: 'completed'
                    }
                },
                {
                    type: 'customer',
                    message: 'New customer registered',
                    timestamp: new Date(Date.now() - 600000).toISOString(),
                    metadata: {
                        customerId: 'CUST-002',
                        source: 'organic_search',
                        location: 'United States'
                    }
                },
                {
                    type: 'inventory',
                    message: 'Low stock alert for Portable Bluetooth Speaker',
                    timestamp: new Date(Date.now() - 900000).toISOString(),
                    metadata: {
                        productId: 'PROD-003',
                        currentStock: 5,
                        reorderPoint: 10
                    }
                }
            ],

            // Predictive Analytics
            predictiveAnalytics: {
                nextMonthRevenue: 18250.00,
                growthRate: 0.18,
                seasonalTrend: 'increasing',
                recommendedActions: [
                    'Increase inventory for electronics category',
                    'Launch marketing campaign for fitness products',
                    'Optimize mobile checkout experience'
                ]
            }
        };

        return NextResponse.json({
            success: true,
            data: overview,
            message: 'Enhanced analytics overview retrieved successfully',
            timestamp: new Date().toISOString(),
            version: '2.0.0'
        });
    } catch (error) {
        console.error('Error fetching enhanced analytics overview:', error);
        return NextResponse.json(
            { error: 'Failed to fetch enhanced analytics overview' },
            { status: 500 }
        );
    }
}

// Helper function to generate realistic time series data
function generateTimeSeriesData(periods: number, type: 'daily' | 'weekly' | 'monthly', min: number, max: number) {
    const data = [];
    const now = new Date();

    for (let i = periods - 1; i >= 0; i--) {
        let date;
        if (type === 'daily') {
            date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        } else if (type === 'weekly') {
            date = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        } else {
            date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        }

        // Generate realistic data with some variation
        const baseValue = min + (max - min) * 0.5;
        const variation = (Math.random() - 0.5) * 0.4; // ±20% variation
        const value = Math.max(0, baseValue * (1 + variation));

        data.push({
            date: date.toISOString().split('T')[0],
            value: Math.round(value * 100) / 100,
            timestamp: date.toISOString()
        });
    }

    return data;
}