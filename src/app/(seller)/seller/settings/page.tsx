"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Settings, Store, CreditCard, Bell, Shield, Globe, Save, RefreshCw } from 'lucide-react';

export default function SellerSettingsPage() {
    const [settings, setSettings] = useState({
        storeName: "TechStore Pro",
        email: "seller@techstorepro.com",
        phone: "+1 (555) 123-4567",
        address: "123 Business St, Suite 100, New York, NY 10001",
        currency: "USD",
        language: "English",
        timezone: "America/New_York",
        notifications: {
            newOrders: true,
            lowStock: true,
            customerReviews: true,
            marketingUpdates: false,
            systemUpdates: true
        },
        security: {
            twoFactorAuth: true,
            loginAlerts: true,
            sessionTimeout: 30
        },
        shipping: {
            freeShippingThreshold: 50,
            defaultShippingCost: 5.99,
            handlingTime: 2
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSettingChange = (category: string, key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category as keyof typeof prev],
                [key]: value
            }
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        setMessage('');

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setMessage('Settings saved successfully!');
        setIsLoading(false);

        setTimeout(() => setMessage(''), 3000);
    };

    const handleReset = () => {
        // Reset to default values
        setSettings({
            storeName: "TechStore Pro",
            email: "seller@techstorepro.com",
            phone: "+1 (555) 123-4567",
            address: "123 Business St, Suite 100, New York, NY 10001",
            currency: "USD",
            language: "English",
            timezone: "America/New_York",
            notifications: {
                newOrders: true,
                lowStock: true,
                customerReviews: true,
                marketingUpdates: false,
                systemUpdates: true
            },
            security: {
                twoFactorAuth: true,
                loginAlerts: true,
                sessionTimeout: 30
            },
            shipping: {
                freeShippingThreshold: 50,
                defaultShippingCost: 5.99,
                handlingTime: 2
            }
        });
        setMessage('Settings reset to defaults');
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600">Manage your store configuration and preferences</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" onClick={handleReset} disabled={isLoading}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            {/* Success Message */}
            {message && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <p className="text-green-800">{message}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Store Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Store className="h-5 w-5 mr-2" />
                            Store Information
                        </CardTitle>
                        <CardDescription>Basic store details and contact information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="storeName">Store Name</Label>
                            <Input
                                id="storeName"
                                value={settings.storeName}
                                onChange={(e) => setSettings(prev => ({ ...prev, storeName: e.target.value }))}
                                placeholder="Enter store name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={settings.email}
                                onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="Enter email address"
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                value={settings.phone}
                                onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div>
                            <Label htmlFor="address">Business Address</Label>
                            <Input
                                id="address"
                                value={settings.address}
                                onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                                placeholder="Enter business address"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Regional Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Globe className="h-5 w-5 mr-2" />
                            Regional Settings
                        </CardTitle>
                        <CardDescription>Language, currency, and timezone preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="currency">Currency</Label>
                            <select
                                id="currency"
                                value={settings.currency}
                                onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="USD">USD - US Dollar</option>
                                <option value="EUR">EUR - Euro</option>
                                <option value="GBP">GBP - British Pound</option>
                                <option value="CAD">CAD - Canadian Dollar</option>
                                <option value="AUD">AUD - Australian Dollar</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="language">Language</Label>
                            <select
                                id="language"
                                value={settings.language}
                                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="English">English</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                                <option value="German">German</option>
                                <option value="Chinese">Chinese</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="timezone">Timezone</Label>
                            <select
                                id="timezone"
                                value={settings.timezone}
                                onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="America/New_York">Eastern Time (ET)</option>
                                <option value="America/Chicago">Central Time (CT)</option>
                                <option value="America/Denver">Mountain Time (MT)</option>
                                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                <option value="Europe/London">London (GMT)</option>
                                <option value="Europe/Paris">Paris (CET)</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Bell className="h-5 w-5 mr-2" />
                            Notifications
                        </CardTitle>
                        <CardDescription>Manage your notification preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>New Orders</Label>
                                <p className="text-sm text-gray-500">Get notified when new orders arrive</p>
                            </div>
                            <Switch
                                checked={settings.notifications.newOrders}
                                onCheckedChange={(checked) => handleSettingChange('notifications', 'newOrders', checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Low Stock Alerts</Label>
                                <p className="text-sm text-gray-500">Receive alerts when products are running low</p>
                            </div>
                            <Switch
                                checked={settings.notifications.lowStock}
                                onCheckedChange={(checked) => handleSettingChange('notifications', 'lowStock', checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Customer Reviews</Label>
                                <p className="text-sm text-gray-500">Get notified of new customer reviews</p>
                            </div>
                            <Switch
                                checked={settings.notifications.customerReviews}
                                onCheckedChange={(checked) => handleSettingChange('notifications', 'customerReviews', checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Marketing Updates</Label>
                                <p className="text-sm text-gray-500">Receive marketing and promotional updates</p>
                            </div>
                            <Switch
                                checked={settings.notifications.marketingUpdates}
                                onCheckedChange={(checked) => handleSettingChange('notifications', 'marketingUpdates', checked)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Security Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Shield className="h-5 w-5 mr-2" />
                            Security
                        </CardTitle>
                        <CardDescription>Account security and authentication settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Two-Factor Authentication</Label>
                                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                            </div>
                            <Switch
                                checked={settings.security.twoFactorAuth}
                                onCheckedChange={(checked) => handleSettingChange('security', 'twoFactorAuth', checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Login Alerts</Label>
                                <p className="text-sm text-gray-500">Get notified of suspicious login attempts</p>
                            </div>
                            <Switch
                                checked={settings.security.loginAlerts}
                                onCheckedChange={(checked) => handleSettingChange('security', 'loginAlerts', checked)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                            <Input
                                id="sessionTimeout"
                                type="number"
                                value={settings.security.sessionTimeout}
                                onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                                min="5"
                                max="120"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Shipping Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <CreditCard className="h-5 w-5 mr-2" />
                            Shipping & Handling
                        </CardTitle>
                        <CardDescription>Configure your shipping policies and costs</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="freeShippingThreshold">Free Shipping Threshold ($)</Label>
                            <Input
                                id="freeShippingThreshold"
                                type="number"
                                value={settings.shipping.freeShippingThreshold}
                                onChange={(e) => handleSettingChange('shipping', 'freeShippingThreshold', parseFloat(e.target.value))}
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <div>
                            <Label htmlFor="defaultShippingCost">Default Shipping Cost ($)</Label>
                            <Input
                                id="defaultShippingCost"
                                type="number"
                                value={settings.shipping.defaultShippingCost}
                                onChange={(e) => handleSettingChange('shipping', 'defaultShippingCost', parseFloat(e.target.value))}
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <div>
                            <Label htmlFor="handlingTime">Handling Time (days)</Label>
                            <Input
                                id="handlingTime"
                                type="number"
                                value={settings.shipping.handlingTime}
                                onChange={(e) => handleSettingChange('shipping', 'handlingTime', parseInt(e.target.value))}
                                min="0"
                                max="14"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}