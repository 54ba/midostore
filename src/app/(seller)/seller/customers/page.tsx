"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Search, Mail, Phone, MapPin, ShoppingBag, Star, TrendingUp } from 'lucide-react';

// Mock customers data for demonstration
const mockCustomers = [
    {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        location: "New York, NY",
        totalOrders: 15,
        totalSpent: 2499.99,
        lastOrder: "2024-01-15",
        status: "active",
        rating: 4.8
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+1 (555) 234-5678",
        location: "Los Angeles, CA",
        totalOrders: 8,
        totalSpent: 1299.99,
        lastOrder: "2024-01-14",
        status: "active",
        rating: 4.9
    },
    {
        id: 3,
        name: "Mike Johnson",
        email: "mike.johnson@example.com",
        phone: "+1 (555) 345-6789",
        location: "Chicago, IL",
        totalOrders: 22,
        totalSpent: 3899.99,
        lastOrder: "2024-01-13",
        status: "vip",
        rating: 5.0
    },
    {
        id: 4,
        name: "Sarah Wilson",
        email: "sarah.wilson@example.com",
        phone: "+1 (555) 456-7890",
        location: "Houston, TX",
        totalOrders: 5,
        totalSpent: 799.99,
        lastOrder: "2024-01-12",
        status: "active",
        rating: 4.7
    },
    {
        id: 5,
        name: "David Brown",
        email: "david.brown@example.com",
        phone: "+1 (555) 567-8901",
        location: "Phoenix, AZ",
        totalOrders: 12,
        totalSpent: 1899.99,
        lastOrder: "2024-01-11",
        status: "active",
        rating: 4.6
    }
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'active':
            return <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>;
        case 'vip':
            return <Badge variant="secondary" className="bg-purple-100 text-purple-800">VIP</Badge>;
        case 'inactive':
            return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inactive</Badge>;
        default:
            return <Badge variant="secondary">Unknown</Badge>;
    }
};

export default function SellerCustomersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    const filteredCustomers = mockCustomers.filter(customer => {
        const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const totalCustomers = mockCustomers.length;
    const activeCustomers = mockCustomers.filter(c => c.status === 'active').length;
    const vipCustomers = mockCustomers.filter(c => c.status === 'vip').length;
    const totalRevenue = mockCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
                    <p className="text-gray-600">Manage and analyze your customer relationships</p>
                </div>
                <Button>
                    <Users className="h-4 w-4 mr-2" />
                    Export Customers
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCustomers}</div>
                        <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeCustomers}</div>
                        <p className="text-xs text-muted-foreground">Currently active</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
                        <Star className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vipCustomers}</div>
                        <p className="text-xs text-muted-foreground">High-value customers</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">From all customers</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search customers by name, email, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant={selectedStatus === 'all' ? 'default' : 'outline'}
                        onClick={() => setSelectedStatus('all')}
                    >
                        All
                    </Button>
                    <Button
                        variant={selectedStatus === 'active' ? 'default' : 'outline'}
                        onClick={() => setSelectedStatus('active')}
                    >
                        Active
                    </Button>
                    <Button
                        variant={selectedStatus === 'vip' ? 'default' : 'outline'}
                        onClick={() => setSelectedStatus('vip')}
                    >
                        VIP
                    </Button>
                </div>
            </div>

            {/* Customers List */}
            <div className="space-y-4">
                {filteredCustomers.map((customer) => (
                    <Card key={customer.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                        {customer.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{customer.name}</CardTitle>
                                        <CardDescription className="flex items-center space-x-4">
                                            <span className="flex items-center">
                                                <Mail className="h-4 w-4 mr-1" />
                                                {customer.email}
                                            </span>
                                            <span className="flex items-center">
                                                <Phone className="h-4 w-4 mr-1" />
                                                {customer.phone}
                                            </span>
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {getStatusBadge(customer.status)}
                                    <div className="flex items-center space-x-1">
                                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                        <span className="text-sm font-medium">{customer.rating}</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">{customer.location}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <ShoppingBag className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">{customer.totalOrders} orders</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <TrendingUp className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">${customer.totalSpent.toFixed(2)}</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    Last order: {customer.lastOrder}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center space-x-2">
                                <Button variant="outline" size="sm">
                                    View Profile
                                </Button>
                                <Button variant="outline" size="sm">
                                    Send Email
                                </Button>
                                <Button variant="outline" size="sm">
                                    Order History
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredCustomers.length === 0 && (
                <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
                    <p className="text-gray-600">No customers match the selected filters.</p>
                </div>
            )}
        </div>
    );
}