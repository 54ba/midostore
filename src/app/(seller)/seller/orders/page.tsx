"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, CheckCircle, XCircle, Eye, Truck, DollarSign } from 'lucide-react';

// Mock orders data for demonstration
const mockOrders = [
    {
        id: "ORD-001",
        customer: "John Doe",
        product: "Premium Wireless Headphones",
        amount: 199.99,
        status: "pending",
        date: "2024-01-15",
        shippingAddress: "123 Main St, City, State 12345"
    },
    {
        id: "ORD-002",
        customer: "Jane Smith",
        product: "Smart Fitness Watch",
        amount: 299.99,
        status: "shipped",
        date: "2024-01-14",
        shippingAddress: "456 Oak Ave, Town, State 67890"
    },
    {
        id: "ORD-003",
        customer: "Mike Johnson",
        product: "Wireless Earbuds",
        amount: 89.99,
        status: "delivered",
        date: "2024-01-13",
        shippingAddress: "789 Pine Rd, Village, State 11111"
    },
    {
        id: "ORD-004",
        customer: "Sarah Wilson",
        product: "Bluetooth Speaker",
        amount: 149.99,
        status: "cancelled",
        date: "2024-01-12",
        shippingAddress: "321 Elm St, Borough, State 22222"
    }
];

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'pending':
            return <Clock className="h-4 w-4 text-yellow-500" />;
        case 'shipped':
            return <Truck className="h-4 w-4 text-blue-500" />;
        case 'delivered':
            return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'cancelled':
            return <XCircle className="h-4 w-4 text-red-500" />;
        default:
            return <Clock className="h-4 w-4 text-gray-500" />;
    }
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'pending':
            return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
        case 'shipped':
            return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Shipped</Badge>;
        case 'delivered':
            return <Badge variant="secondary" className="bg-green-100 text-green-800">Delivered</Badge>;
        case 'cancelled':
            return <Badge variant="secondary" className="bg-red-100 text-red-800">Cancelled</Badge>;
        default:
            return <Badge variant="secondary">Unknown</Badge>;
    }
};

export default function SellerOrdersPage() {
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    const filteredOrders = selectedStatus === 'all'
        ? mockOrders
        : mockOrders.filter(order => order.status === selectedStatus);

    const totalRevenue = mockOrders
        .filter(order => order.status !== 'cancelled')
        .reduce((sum, order) => sum + order.amount, 0);

    const pendingOrders = mockOrders.filter(order => order.status === 'pending').length;
    const shippedOrders = mockOrders.filter(order => order.status === 'shipped').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-600">Manage and track your customer orders</p>
                </div>
                <Button>
                    <Package className="h-4 w-4 mr-2" />
                    Export Orders
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockOrders.length}</div>
                        <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingOrders}</div>
                        <p className="text-xs text-muted-foreground">Awaiting fulfillment</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Shipped</CardTitle>
                        <Truck className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{shippedOrders}</div>
                        <p className="text-xs text-muted-foreground">In transit</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Excluding cancelled</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
                <Button
                    variant={selectedStatus === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedStatus('all')}
                >
                    All Orders
                </Button>
                <Button
                    variant={selectedStatus === 'pending' ? 'default' : 'outline'}
                    onClick={() => setSelectedStatus('pending')}
                >
                    Pending
                </Button>
                <Button
                    variant={selectedStatus === 'shipped' ? 'default' : 'outline'}
                    onClick={() => setSelectedStatus('shipped')}
                >
                    Shipped
                </Button>
                <Button
                    variant={selectedStatus === 'delivered' ? 'default' : 'outline'}
                    onClick={() => setSelectedStatus('delivered')}
                >
                    Delivered
                </Button>
                <Button
                    variant={selectedStatus === 'cancelled' ? 'default' : 'outline'}
                    onClick={() => setSelectedStatus('cancelled')}
                >
                    Cancelled
                </Button>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.map((order) => (
                    <Card key={order.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    {getStatusIcon(order.status)}
                                    <div>
                                        <CardTitle className="text-lg">{order.id}</CardTitle>
                                        <CardDescription>
                                            {order.customer} • {order.date}
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {getStatusBadge(order.status)}
                                    <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4 mr-2" />
                                        View
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <h4 className="font-medium text-gray-900">Product</h4>
                                    <p className="text-gray-600">{order.product}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Amount</h4>
                                    <p className="text-gray-600">${order.amount}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Shipping Address</h4>
                                    <p className="text-gray-600 text-sm">{order.shippingAddress}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-600">No orders match the selected filters.</p>
                </div>
            )}
        </div>
    );
}