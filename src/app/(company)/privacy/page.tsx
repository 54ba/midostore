"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Shield,
    Lock,
    Eye,
    Database,
    Users,
    Globe,
    FileText,
    Calendar
} from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="h-8 w-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
                        <p className="text-gray-600 mt-2">Last updated: December 2024</p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Introduction */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <FileText className="h-5 w-5" />
                            <span>Introduction</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 mb-4">
                            At MidoStore, we are committed to protecting your privacy and ensuring the security of your personal information.
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                        </p>
                        <p className="text-gray-700">
                            By using MidoStore, you agree to the collection and use of information in accordance with this policy.
                            If you do not agree with our policies and practices, please do not use our platform.
                        </p>
                    </CardContent>
                </Card>

                {/* Information We Collect */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Database className="h-5 w-5" />
                            <span>Information We Collect</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                    <li>Name, email address, and phone number</li>
                                    <li>Billing and shipping addresses</li>
                                    <li>Payment information (processed securely through Bybit)</li>
                                    <li>Account credentials and profile information</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Usage Information</h4>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                    <li>Browsing history and search queries</li>
                                    <li>Products viewed and purchased</li>
                                    <li>Interaction with sellers and other users</li>
                                    <li>Device information and IP address</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Seller Information</h4>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                    <li>Business details and verification documents</li>
                                    <li>Product catalogs and pricing information</li>
                                    <li>Sales performance and analytics data</li>
                                    <li>Communication with buyers</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* How We Use Your Information */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Eye className="h-5 w-5" />
                            <span>How We Use Your Information</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <h4 className="font-semibold text-blue-900 mb-2">Service Provision</h4>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• Process orders and payments</li>
                                        <li>• Facilitate buyer-seller communication</li>
                                        <li>• Provide customer support</li>
                                        <li>• Manage your account</li>
                                    </ul>
                                </div>

                                <div className="p-4 bg-green-50 rounded-lg">
                                    <h4 className="font-semibold text-green-900 mb-2">Platform Improvement</h4>
                                    <ul className="text-sm text-green-800 space-y-1">
                                        <li>• Analyze usage patterns</li>
                                        <li>• Improve user experience</li>
                                        <li>• Develop new features</li>
                                        <li>• Optimize performance</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="p-4 bg-purple-50 rounded-lg">
                                <h4 className="font-semibold text-purple-900 mb-2">Personalization</h4>
                                <ul className="text-sm text-purple-800 space-y-1">
                                    <li>• Recommend relevant products</li>
                                    <li>• Show personalized content</li>
                                    <li>• Target advertising (with consent)</li>
                                    <li>• Improve search results</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Information Sharing */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Users className="h-5 w-5" />
                            <span>Information Sharing</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-gray-700">
                                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent,
                                except in the following circumstances:
                            </p>

                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <Badge variant="secondary">1</Badge>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Service Providers</h4>
                                        <p className="text-sm text-gray-600">
                                            We may share information with trusted third-party service providers who assist us in operating our platform,
                                            such as payment processors, shipping companies, and analytics services.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Badge variant="secondary">2</Badge>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Legal Requirements</h4>
                                        <p className="text-sm text-gray-600">
                                            We may disclose information if required by law or in response to valid legal requests,
                                            such as subpoenas or court orders.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Badge variant="secondary">3</Badge>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Business Transfers</h4>
                                        <p className="text-sm text-gray-600">
                                            In the event of a merger, acquisition, or sale of assets, your information may be transferred
                                            as part of the business transaction.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Badge variant="secondary">4</Badge>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Buyer-Seller Communication</h4>
                                        <p className="text-sm text-gray-600">
                                            When you interact with sellers, we may share necessary information to facilitate the transaction
                                            and communication between parties.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Security */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Lock className="h-5 w-5" />
                            <span>Data Security</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-gray-700">
                                We implement appropriate technical and organizational security measures to protect your personal information
                                against unauthorized access, alteration, disclosure, or destruction.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-2">Technical Measures</h4>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        <li>• SSL/TLS encryption</li>
                                        <li>• Secure data centers</li>
                                        <li>• Regular security audits</li>
                                        <li>• Access controls</li>
                                    </ul>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-2">Organizational Measures</h4>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        <li>• Employee training</li>
                                        <li>• Data access policies</li>
                                        <li>• Incident response plans</li>
                                        <li>• Regular policy reviews</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Your Rights */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Shield className="h-5 w-5" />
                            <span>Your Rights</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-gray-700">
                                You have certain rights regarding your personal information, including:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="outline">Access</Badge>
                                        <span className="text-sm text-gray-700">View your personal information</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="outline">Rectification</Badge>
                                        <span className="text-sm text-gray-700">Correct inaccurate information</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="outline">Erasure</Badge>
                                        <span className="text-sm text-gray-700">Delete your information</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="outline">Portability</Badge>
                                        <span className="text-sm text-gray-700">Export your data</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="outline">Objection</Badge>
                                        <span className="text-sm text-gray-700">Object to processing</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="outline">Restriction</Badge>
                                        <span className="text-sm text-gray-700">Limit data processing</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* International Transfers */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Globe className="h-5 w-5" />
                            <span>International Data Transfers</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700">
                            Your information may be transferred to and processed in countries other than your own.
                            We ensure that such transfers comply with applicable data protection laws and implement
                            appropriate safeguards to protect your information.
                        </p>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5" />
                            <span>Contact Us</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-gray-700">
                                If you have any questions about this Privacy Policy or our data practices, please contact us:
                            </p>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="space-y-2">
                                    <p className="text-sm text-blue-800">
                                        <strong>Email:</strong> privacy@midostore.com
                                    </p>
                                    <p className="text-sm text-blue-800">
                                        <strong>Address:</strong> MidoStore Privacy Team, Dubai, UAE
                                    </p>
                                    <p className="text-sm text-blue-800">
                                        <strong>Response Time:</strong> We aim to respond within 48 hours
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Updates to Policy */}
                <Card>
                    <CardHeader>
                        <CardTitle>Updates to This Policy</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700">
                            We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational,
                            legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page
                            and updating the "Last updated" date.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}