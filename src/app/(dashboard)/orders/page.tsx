"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Star,
  MessageSquare,
  Calendar,
  MapPin,
  Loader2,
  RefreshCw,
  X
} from 'lucide-react';

interface Order {
  order_id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  quantity: string;
  total_amount: string;
  created_at?: string;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Transform API data to match our interface and add mock statuses for demo
          const transformedOrders = data.data.map((order: any) => ({
            ...order,
            status: getRandomStatus(), // Mock status for demo purposes
            created_at: order.created_at || new Date().toISOString()
          }));
          setOrders(transformedOrders);
        } else {
          throw new Error(data.error || 'Failed to fetch orders');
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again later.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  // Mock function to generate random statuses for demo purposes
  const getRandomStatus = (): 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' => {
    const statuses: ('pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled')[] = [
      'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    ];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      // In a real app, you would call an API to cancel the order
      console.log('Cancelling order:', orderId);

      // For demo purposes, update the local state
      setOrders(prev => prev.map(order =>
        order.order_id === orderId
          ? { ...order, status: 'cancelled' as const }
          : order
      ));
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const handleTrackPackage = (orderId: string) => {
    // In a real app, this would open a tracking modal or redirect to tracking page
    console.log('Tracking package for order:', orderId);
    alert('Tracking functionality would be implemented here');
  };

  const handleLeaveReview = (orderId: string) => {
    // In a real app, this would open a review modal
    console.log('Leaving review for order:', orderId);
    alert('Review functionality would be implemented here');
  };

  const handleContactSeller = (orderId: string) => {
    // In a real app, this would open a contact form or chat
    console.log('Contacting seller for order:', orderId);
    alert('Contact seller functionality would be implemented here');
  };

  const filteredOrders = orders.filter(order =>
    selectedStatus === 'all' || order.status === selectedStatus
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchOrders} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-1">Track and manage your orders</p>
            </div>
            <Button
              onClick={refreshOrders}
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.order_id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="p-6 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900">
                        Order #{order.order_id}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Placed on {new Date(order.created_at || Date.now()).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge className={`${getStatusColor(order.status || 'pending')} border`}>
                      {getStatusIcon(order.status || 'pending')}
                      <span className="ml-1 capitalize">{order.status || 'pending'}</span>
                    </Badge>
                    <span className="text-lg font-semibold text-gray-900">
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-0">
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{order.product_name}</h4>
                      <p className="text-sm text-gray-600">Product ID: {order.product_id}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {order.quantity} × ${(parseFloat(order.total_amount) / parseInt(order.quantity)).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${order.total_amount}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Order date: {new Date(order.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Estimated delivery: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>

                  {order.status === 'delivered' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLeaveReview(order.order_id)}
                      >
                        <Star className="mr-2 h-4 w-4" />
                        Leave Review
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleContactSeller(order.order_id)}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact Seller
                      </Button>
                    </>
                  )}

                  {order.status === 'shipped' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTrackPackage(order.order_id)}
                    >
                      <Truck className="mr-2 h-4 w-4" />
                      Track Package
                    </Button>
                  )}

                  {order.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => handleCancelOrder(order.order_id)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {selectedStatus === 'all'
                ? 'You haven\'t placed any orders yet.'
                : `You don't have any ${selectedStatus} orders.`
              }
            </p>
            {selectedStatus !== 'all' && (
              <Button
                onClick={() => setSelectedStatus('all')}
                className="mt-4"
              >
                View All Orders
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}