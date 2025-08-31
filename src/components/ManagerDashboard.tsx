'use client'

import React, { useState, useEffect } from 'react'
import {
    Users,
    ShoppingCart,
    DollarSign,
    TrendingUp,
    Settings,
    Shield,
    Database,
    Activity,
    Package,
    Truck,
    CreditCard,
    BarChart3,
    UserCheck,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Edit,
    Trash2,
    Plus,
    Search,
    Filter,
    Download,
    RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DashboardStats {
    totalUsers: number
    totalOrders: number
    totalRevenue: number
    activeUsers: number
    pendingOrders: number
    systemHealth: 'healthy' | 'warning' | 'critical'
}

interface User {
    id: string
    name: string
    email: string
    role: string
    status: 'active' | 'suspended' | 'pending'
    createdAt: string
    lastLogin: string
}

interface Order {
    id: string
    orderNumber: string
    customerName: string
    total: number
    status: string
    createdAt: string
    paymentStatus: string
}

interface SystemAlert {
    id: string
    type: 'info' | 'warning' | 'error' | 'success'
    message: string
    timestamp: string
    isRead: boolean
}

export default function ManagerDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        activeUsers: 0,
        pendingOrders: 0,
        systemHealth: 'healthy'
    })
    const [users, setUsers] = useState<User[]>([])
    const [orders, setOrders] = useState<Order[]>([])
    const [alerts, setAlerts] = useState<SystemAlert[]>([])
    const [selectedTab, setSelectedTab] = useState('overview')
    const [searchTerm, setSearchTerm] = useState('')
    const [filterRole, setFilterRole] = useState('all')
    const [filterStatus, setFilterStatus] = useState('all')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        try {
            setIsLoading(true)
            // In a real implementation, these would be API calls
            await Promise.all([
                loadStats(),
                loadUsers(),
                loadOrders(),
                loadAlerts()
            ])
        } catch (error) {
            console.error('Failed to load dashboard data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const loadStats = async () => {
        // Mock data - replace with real API calls
        setStats({
            totalUsers: 1247,
            totalOrders: 8934,
            totalRevenue: 124750.50,
            activeUsers: 892,
            pendingOrders: 156,
            systemHealth: 'healthy'
        })
    }

    const loadUsers = async () => {
        // Mock data - replace with real API calls
        const mockUsers: User[] = [
            {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                role: 'customer',
                status: 'active',
                createdAt: '2024-01-15',
                lastLogin: '2024-01-20'
            },
            {
                id: '2',
                name: 'Jane Smith',
                email: 'jane@example.com',
                role: 'seller',
                status: 'active',
                createdAt: '2024-01-10',
                lastLogin: '2024-01-19'
            },
            {
                id: '3',
                name: 'Bob Johnson',
                email: 'bob@example.com',
                role: 'admin',
                status: 'active',
                createdAt: '2024-01-05',
                lastLogin: '2024-01-20'
            }
        ]
        setUsers(mockUsers)
    }

    const loadOrders = async () => {
        // Mock data - replace with real API calls
        const mockOrders: Order[] = [
            {
                id: '1',
                orderNumber: 'ORD-001',
                customerName: 'John Doe',
                total: 299.99,
                status: 'pending',
                createdAt: '2024-01-20',
                paymentStatus: 'paid'
            },
            {
                id: '2',
                orderNumber: 'ORD-002',
                customerName: 'Jane Smith',
                total: 149.50,
                status: 'shipped',
                createdAt: '2024-01-19',
                paymentStatus: 'paid'
            }
        ]
        setOrders(mockOrders)
    }

    const loadAlerts = async () => {
        // Mock data - replace with real API calls
        const mockAlerts: SystemAlert[] = [
            {
                id: '1',
                type: 'info',
                message: 'System maintenance scheduled for tonight at 2 AM',
                timestamp: '2024-01-20 10:00',
                isRead: false
            },
            {
                id: '2',
                type: 'warning',
                message: 'High server load detected',
                timestamp: '2024-01-20 09:30',
                isRead: false
            }
        ]
        setAlerts(mockAlerts)
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = filterRole === 'all' || user.role === filterRole
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus

        return matchesSearch && matchesRole && matchesStatus
    })

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            active: 'default',
            suspended: 'destructive',
            pending: 'secondary',
            shipped: 'default',
            delivered: 'default',
            cancelled: 'destructive'
        }

        return <Badge variant={variants[status] || 'outline'}>{status}</Badge>
    }

    const getHealthStatus = (health: string) => {
        switch (health) {
            case 'healthy':
                return <div className="flex items-center text-green-600"><CheckCircle className="w-4 h-4 mr-2" />Healthy</div>
            case 'warning':
                return <div className="flex items-center text-yellow-600"><AlertTriangle className="w-4 h-4 mr-2" />Warning</div>
            case 'critical':
                return <div className="flex items-center text-red-600"><XCircle className="w-4 h-4 mr-2" />Critical</div>
            default:
                return <div className="flex items-center text-gray-600"><Activity className="w-4 h-4 mr-2" />Unknown</div>
        }
    }

    const handleUserAction = async (userId: string, action: string) => {
        try {
            // In a real implementation, this would make API calls
            console.log(`Performing ${action} on user ${userId}`)

            // Update local state
            if (action === 'suspend') {
                setUsers(users.map(user =>
                    user.id === userId ? { ...user, status: 'suspended' as const } : user
                ))
            } else if (action === 'activate') {
                setUsers(users.map(user =>
                    user.id === userId ? { ...user, status: 'active' as const } : user
                ))
            } else if (action === 'delete') {
                setUsers(users.filter(user => user.id !== userId))
            }
        } catch (error) {
            console.error(`Failed to ${action} user:`, error)
        }
    }

    const handleExportData = (type: string) => {
        // In a real implementation, this would generate and download CSV/Excel files
        console.log(`Exporting ${type} data`)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
                    <p className="text-gray-600">Complete control over your e-commerce platform</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                +{stats.activeUsers} active
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.pendingOrders} pending
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                +12% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">System Health</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {getHealthStatus(stats.systemHealth)}
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="orders">Orders</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="system">System</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Activity */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>Latest system events and user actions</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {alerts.slice(0, 5).map(alert => (
                                            <div key={alert.id} className="flex items-start space-x-3">
                                                <div className={`w-2 h-2 rounded-full mt-2 ${alert.type === 'error' ? 'bg-red-500' :
                                                        alert.type === 'warning' ? 'bg-yellow-500' :
                                                            alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                                                    }`} />
                                                <div className="flex-1">
                                                    <p className="text-sm">{alert.message}</p>
                                                    <p className="text-xs text-gray-500">{alert.timestamp}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                    <CardDescription>Common management tasks</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button variant="outline" className="h-20 flex-col">
                                            <UserCheck className="w-6 h-6 mb-2" />
                                            <span className="text-sm">User Management</span>
                                        </Button>
                                        <Button variant="outline" className="h-20 flex-col">
                                            <Package className="w-6 h-6 mb-2" />
                                            <span className="text-sm">Product Catalog</span>
                                        </Button>
                                        <Button variant="outline" className="h-20 flex-col">
                                            <Truck className="w-6 h-6 mb-2" />
                                            <span className="text-sm">Shipping</span>
                                        </Button>
                                        <Button variant="outline" className="h-20 flex-col">
                                            <CreditCard className="w-6 h-6 mb-2" />
                                            <span className="text-sm">Payments</span>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Users Tab */}
                    <TabsContent value="users" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>User Management</CardTitle>
                                        <CardDescription>Manage platform users and permissions</CardDescription>
                                    </div>
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add User
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Filters */}
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Search users..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="max-w-sm"
                                        />
                                    </div>
                                    <Select value={filterRole} onValueChange={setFilterRole}>
                                        <SelectTrigger className="w-32">
                                            <SelectValue placeholder="Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Roles</SelectItem>
                                            <SelectItem value="customer">Customer</SelectItem>
                                            <SelectItem value="seller">Seller</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                                        <SelectTrigger className="w-32">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="suspended">Suspended</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button variant="outline" onClick={() => handleExportData('users')}>
                                        <Download className="w-4 h-4 mr-2" />
                                        Export
                                    </Button>
                                </div>

                                {/* Users Table */}
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead>Last Login</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map(user => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{user.role}</Badge>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(user.status)}</TableCell>
                                                <TableCell>{user.createdAt}</TableCell>
                                                <TableCell>{user.lastLogin}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => handleUserAction(user.id, 'edit')}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit User
                                                            </DropdownMenuItem>
                                                            {user.status === 'active' ? (
                                                                <DropdownMenuItem onClick={() => handleUserAction(user.id, 'suspend')}>
                                                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                                                    Suspend User
                                                                </DropdownMenuItem>
                                                            ) : (
                                                                <DropdownMenuItem onClick={() => handleUserAction(user.id, 'activate')}>
                                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                                    Activate User
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => handleUserAction(user.id, 'delete')}
                                                                className="text-red-600"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete User
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Orders Tab */}
                    <TabsContent value="orders" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Order Management</CardTitle>
                                        <CardDescription>Monitor and manage customer orders</CardDescription>
                                    </div>
                                    <Button variant="outline" onClick={() => handleExportData('orders')}>
                                        <Download className="w-4 h-4 mr-2" />
                                        Export Orders
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order #</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Payment</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.map(order => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                                                <TableCell>{order.customerName}</TableCell>
                                                <TableCell>${order.total.toFixed(2)}</TableCell>
                                                <TableCell>{getStatusBadge(order.status)}</TableCell>
                                                <TableCell>{getStatusBadge(order.paymentStatus)}</TableCell>
                                                <TableCell>{order.createdAt}</TableCell>
                                                <TableCell>
                                                    <Button variant="outline" size="sm">
                                                        View Details
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Revenue Analytics</CardTitle>
                                    <CardDescription>Track your platform's financial performance</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span>Monthly Revenue</span>
                                            <span className="font-bold">${(stats.totalRevenue / 12).toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Average Order Value</span>
                                            <span className="font-bold">${(stats.totalRevenue / stats.totalOrders).toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Conversion Rate</span>
                                            <span className="font-bold">{(stats.totalOrders / stats.totalUsers * 100).toFixed(1)}%</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>User Analytics</CardTitle>
                                    <CardDescription>Understand your user base and behavior</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span>Active Users</span>
                                            <span className="font-bold">{stats.activeUsers}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>User Growth</span>
                                            <span className="font-bold text-green-600">+15%</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Retention Rate</span>
                                            <span className="font-bold">78%</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* System Tab */}
                    <TabsContent value="system" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>System Status</CardTitle>
                                    <CardDescription>Monitor platform health and performance</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span>Database Status</span>
                                            <Badge variant="default">Connected</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>API Response Time</span>
                                            <span className="font-bold">45ms</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Uptime</span>
                                            <span className="font-bold">99.9%</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Last Backup</span>
                                            <span className="font-bold">2 hours ago</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>System Alerts</CardTitle>
                                    <CardDescription>Active system notifications</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {alerts.map(alert => (
                                            <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-3 h-3 rounded-full ${alert.type === 'error' ? 'bg-red-500' :
                                                            alert.type === 'warning' ? 'bg-yellow-500' :
                                                                alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                                                        }`} />
                                                    <span className="text-sm">{alert.message}</span>
                                                </div>
                                                <Button variant="ghost" size="sm">
                                                    Mark Read
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Platform Settings</CardTitle>
                                <CardDescription>Configure your e-commerce platform</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Platform Name</label>
                                            <Input defaultValue="MidoStore" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Default Currency</label>
                                            <Select defaultValue="USD">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="USD">USD</SelectItem>
                                                    <SelectItem value="EUR">EUR</SelectItem>
                                                    <SelectItem value="GBP">GBP</SelectItem>
                                                    <SelectItem value="AED">AED</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Timezone</label>
                                            <Select defaultValue="UTC">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="UTC">UTC</SelectItem>
                                                    <SelectItem value="EST">EST</SelectItem>
                                                    <SelectItem value="PST">PST</SelectItem>
                                                    <SelectItem value="GMT">GMT</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Maintenance Mode</label>
                                            <Select defaultValue="false">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="false">Disabled</SelectItem>
                                                    <SelectItem value="true">Enabled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="flex space-x-4">
                                        <Button>Save Settings</Button>
                                        <Button variant="outline">Reset to Defaults</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}