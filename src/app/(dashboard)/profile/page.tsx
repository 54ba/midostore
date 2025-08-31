"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Edit,
    Save,
    X,
    Camera,
    Settings,
    Bell,
    Lock,
    CreditCard,
    Heart,
    Package
} from 'lucide-react';

interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    avatar: string;
    memberSince: string;
    userType: 'buyer' | 'seller';
    verified: boolean;
    preferences: {
        emailNotifications: boolean;
        smsNotifications: boolean;
        marketingEmails: boolean;
        language: string;
        currency: string;
    };
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        // Simulate loading profile
        setTimeout(() => {
            setProfile({
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '+971 50 123 4567',
                dateOfBirth: '1990-05-15',
                address: {
                    street: '123 Main Street',
                    city: 'Dubai',
                    state: 'Dubai',
                    zipCode: '12345',
                    country: 'UAE'
                },
                avatar: '/avatar.jpg',
                memberSince: '2023-01-15',
                userType: 'buyer',
                verified: true,
                preferences: {
                    emailNotifications: true,
                    smsNotifications: false,
                    marketingEmails: true,
                    language: 'English',
                    currency: 'USD'
                }
            });
            setLoading(false);
        }, 1000);
    }, []);

    const handleEdit = () => {
        setEditForm({
            firstName: profile?.firstName,
            lastName: profile?.lastName,
            phone: profile?.phone,
            address: profile?.address,
            preferences: profile?.preferences
        });
        setIsEditing(true);
    };

    const handleSave = () => {
        if (profile) {
            setProfile({
                ...profile,
                ...editForm
            });
        }
        setIsEditing(false);
        setEditForm({});
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm({});
    };

    const handleInputChange = (field: string, value: any) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setEditForm(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent as keyof typeof prev],
                    [child]: value
                }
            }));
        } else {
            setEditForm(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Profile not found</h3>
                    <p className="text-gray-600">Unable to load your profile information.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-center mb-6">
                                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        {profile.avatar ? (
                                            <img
                                                src={profile.avatar}
                                                alt="Profile"
                                                className="w-24 h-24 rounded-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-12 w-12 text-white" />
                                        )}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {profile.firstName} {profile.lastName}
                                    </h3>
                                    <div className="flex items-center justify-center space-x-2 mt-2">
                                        <Badge variant={profile.userType === 'seller' ? 'default' : 'secondary'}>
                                            {profile.userType === 'seller' ? 'Seller' : 'Buyer'}
                                        </Badge>
                                        {profile.verified && (
                                            <Badge className="bg-green-100 text-green-800 border-green-200">
                                                <Shield className="mr-1 h-3 w-3" />
                                                Verified
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Member since {new Date(profile.memberSince).toLocaleDateString()}
                                    </p>
                                </div>

                                <Button className="w-full mb-3">
                                    <Camera className="mr-2 h-4 w-4" />
                                    Change Photo
                                </Button>

                                {/* Navigation Tabs */}
                                <div className="space-y-2">
                                    {[
                                        { id: 'profile', label: 'Profile', icon: User },
                                        { id: 'settings', label: 'Settings', icon: Settings },
                                        { id: 'notifications', label: 'Notifications', icon: Bell },
                                        { id: 'security', label: 'Security', icon: Lock },
                                        { id: 'payment', label: 'Payment', icon: CreditCard },
                                        { id: 'wishlist', label: 'Wishlist', icon: Heart },
                                        { id: 'orders', label: 'Orders', icon: Package }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === tab.id
                                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <tab.icon className="h-4 w-4" />
                                            <span className="text-sm font-medium">{tab.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Personal Information</CardTitle>
                                        <CardDescription>
                                            Update your personal details and contact information
                                        </CardDescription>
                                    </div>
                                    {!isEditing ? (
                                        <Button onClick={handleEdit} variant="outline">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Profile
                                        </Button>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <Button onClick={handleSave} size="sm">
                                                <Save className="mr-2 h-4 w-4" />
                                                Save
                                            </Button>
                                            <Button onClick={handleCancel} variant="outline" size="sm">
                                                <X className="mr-2 h-4 w-4" />
                                                Cancel
                                            </Button>
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Basic Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                First Name
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editForm.firstName || profile.firstName}
                                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            ) : (
                                                <p className="text-gray-900">{profile.firstName}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Last Name
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editForm.lastName || profile.lastName}
                                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            ) : (
                                                <p className="text-gray-900">{profile.lastName}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                <p className="text-gray-900">{profile.email}</p>
                                                <Badge variant="secondary">Primary</Badge>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    value={editForm.phone || profile.phone}
                                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            ) : (
                                                <div className="flex items-center space-x-2">
                                                    <Phone className="h-4 w-4 text-gray-400" />
                                                    <p className="text-gray-900">{profile.phone}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Date of Birth
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <p className="text-gray-900">
                                                    {new Date(profile.dateOfBirth).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <h4 className="text-lg font-medium text-gray-900 mb-4">Address Information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Street Address
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editForm.address?.street || profile.address.street}
                                                        onChange={(e) => handleInputChange('address.street', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                ) : (
                                                    <div className="flex items-center space-x-2">
                                                        <MapPin className="h-4 w-4 text-gray-400" />
                                                        <p className="text-gray-900">{profile.address.street}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    City
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editForm.address?.city || profile.address.city}
                                                        onChange={(e) => handleInputChange('address.city', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                ) : (
                                                    <p className="text-gray-900">{profile.address.city}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    State/Province
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editForm.address?.state || profile.address.state}
                                                        onChange={(e) => handleInputChange('address.state', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                ) : (
                                                    <p className="text-gray-900">{profile.address.state}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    ZIP/Postal Code
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editForm.address?.zipCode || profile.address.zipCode}
                                                        onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                ) : (
                                                    <p className="text-gray-900">{profile.address.zipCode}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Country
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editForm.address?.country || profile.address.country}
                                                        onChange={(e) => handleInputChange('address.country', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                ) : (
                                                    <p className="text-gray-900">{profile.address.country}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Settings</CardTitle>
                                    <CardDescription>
                                        Manage your account preferences and settings
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Language
                                            </label>
                                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <option value="en">English</option>
                                                <option value="ar">العربية</option>
                                                <option value="fr">Français</option>
                                                <option value="es">Español</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Currency
                                            </label>
                                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <option value="USD">USD ($)</option>
                                                <option value="EUR">EUR (€)</option>
                                                <option value="GBP">GBP (£)</option>
                                                <option value="AED">AED (د.إ)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <Button>Save Settings</Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Other tabs can be implemented similarly */}
                        {activeTab !== 'profile' && activeTab !== 'settings' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="capitalize">{activeTab}</CardTitle>
                                    <CardDescription>
                                        This section is under development
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        The {activeTab} section will be available soon. Please check back later.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}