"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Users,
  ShoppingCart,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
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
              <span>Agreement to Terms</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              These Terms of Service ("Terms") govern your use of MidoStore, our website, mobile applications,
              and related services (collectively, the "Service"). By accessing or using the Service, you agree
              to be bound by these Terms.
            </p>
            <p className="text-gray-700">
              If you disagree with any part of these terms, you may not access the Service. These Terms apply
              to all visitors, users, and others who access or use the Service.
            </p>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Service Description</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                MidoStore is a multi-seller dropshipping platform that connects buyers with verified sellers.
                Our services include:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">For Buyers</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Browse products from multiple sellers</li>
                    <li>• Compare prices and reviews</li>
                    <li>• Secure payment processing</li>
                    <li>• Order tracking and support</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">For Sellers</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Product listing and management</li>
                    <li>• Sales analytics and insights</li>
                    <li>• Customer communication tools</li>
                    <li>• Payment processing and escrow</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Accounts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>User Accounts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Account Creation</h4>
                    <p className="text-sm text-gray-600">
                      You must provide accurate, current, and complete information when creating an account.
                      You are responsible for maintaining the security of your account credentials.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Account Responsibility</h4>
                    <p className="text-sm text-gray-600">
                      You are responsible for all activities that occur under your account.
                      Notify us immediately of any unauthorized use of your account.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Prohibited Activities</h4>
                    <p className="text-sm text-gray-600">
                      Creating multiple accounts, sharing account credentials, or using accounts for fraudulent purposes is strictly prohibited.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seller Responsibilities */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Seller Responsibilities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">Product Quality & Accuracy</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Provide accurate product descriptions and images</li>
                    <li>• Ensure products meet quality standards</li>
                    <li>• Maintain adequate inventory levels</li>
                    <li>• Honor advertised prices and availability</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Customer Service</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Respond to customer inquiries promptly</li>
                    <li>• Process orders in a timely manner</li>
                    <li>• Handle returns and refunds according to policy</li>
                    <li>• Maintain professional communication</li>
                  </ul>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">Compliance Requirements</h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• Comply with all applicable laws and regulations</li>
                    <li>• Obtain necessary licenses and permits</li>
                    <li>• Pay applicable taxes and fees</li>
                    <li>• Follow platform policies and guidelines</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buyer Responsibilities */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Buyer Responsibilities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Order Accuracy</h4>
                    <p className="text-sm text-gray-600">
                      Review your orders carefully before confirming. Ensure shipping addresses and contact information are correct.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Payment Obligations</h4>
                    <p className="text-sm text-gray-600">
                      Pay for orders in full at the time of purchase. Use only authorized payment methods.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Prohibited Behavior</h4>
                    <p className="text-sm text-gray-600">
                      False claims, chargebacks without cause, or harassment of sellers is not permitted.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment & Fees */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Payment & Fees</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Platform Fees</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Transaction fees: 2.9% + $0.30</li>
                    <li>• Monthly subscription: $29.99</li>
                    <li>• Premium features: $9.99/month</li>
                    <li>• No hidden charges</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Payment Methods</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Credit/Debit cards</li>
                    <li>• Bybit crypto payments</li>
                    <li>• Bank transfers</li>
                    <li>• Digital wallets</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Important Notes</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• All prices are in USD unless otherwise stated</li>
                  <li>• Fees are non-refundable except in cases of platform error</li>
                  <li>• Sellers are responsible for their own pricing and fees</li>
                  <li>• Payment disputes are handled according to our dispute resolution policy</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prohibited Activities */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Prohibited Activities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                The following activities are strictly prohibited on our platform:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-1" />
                    <span className="text-sm text-gray-700">Selling counterfeit or illegal products</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-1" />
                    <span className="text-sm text-gray-700">Engaging in fraudulent activities</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-1" />
                    <span className="text-sm text-gray-700">Violating intellectual property rights</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-1" />
                    <span className="text-sm text-gray-700">Harassing other users</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-1" />
                    <span className="text-sm text-gray-700">Manipulating reviews or ratings</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-1" />
                    <span className="text-sm text-gray-700">Circumventing platform fees</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-1" />
                    <span className="text-sm text-gray-700">Using automated tools maliciously</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-1" />
                    <span className="text-sm text-gray-700">Violating applicable laws</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Intellectual Property</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Platform Rights</h4>
                <p className="text-sm text-blue-800">
                  MidoStore and its original content, features, and functionality are owned by MidoStore Inc.
                  and are protected by international copyright, trademark, patent, trade secret, and other
                  intellectual property laws.
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">User Content</h4>
                <p className="text-sm text-green-800">
                  You retain ownership of content you submit to the platform. By submitting content, you grant
                  us a worldwide, non-exclusive license to use, reproduce, and distribute your content in
                  connection with our services.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dispute Resolution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>Dispute Resolution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Badge variant="secondary">1</Badge>
                  <div>
                    <h4 className="font-semibold text-gray-900">Direct Communication</h4>
                    <p className="text-sm text-gray-600">
                      Buyers and sellers should first attempt to resolve disputes directly through our messaging system.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Badge variant="secondary">2</Badge>
                  <div>
                    <h4 className="font-semibold text-gray-900">Platform Mediation</h4>
                    <p className="text-sm text-gray-600">
                      If direct resolution fails, our support team will mediate the dispute according to our policies.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Badge variant="secondary">3</Badge>
                  <div>
                    <h4 className="font-semibold text-gray-900">Escalation</h4>
                    <p className="text-sm text-gray-600">
                      Complex disputes may be escalated to our dispute resolution team for final decision.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Account Termination</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                We may terminate or suspend your account immediately, without prior notice, for conduct that
                we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-2">Grounds for Termination</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Violation of these Terms</li>
                  <li>• Fraudulent or illegal activities</li>
                  <li>• Harassment of other users</li>
                  <li>• Repeated policy violations</li>
                  <li>• Non-payment of fees</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                If you have any questions about these Terms of Service, please contact us:
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="space-y-2">
                  <p className="text-sm text-green-800">
                    <strong>Email:</strong> legal@midostore.com
                  </p>
                  <p className="text-sm text-green-800">
                    <strong>Address:</strong> MidoStore Legal Team, Dubai, UAE
                  </p>
                  <p className="text-sm text-green-800">
                    <strong>Response Time:</strong> We aim to respond within 72 hours
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}