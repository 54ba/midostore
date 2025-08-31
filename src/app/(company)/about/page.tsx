"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Target,
    Users,
    Globe,
    Shield,
    Zap,
    TrendingUp,
    Star,
    Award
} from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm">
                            About MidoStore
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Revolutionizing
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                {' '}Dropshipping
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We're building the world's most advanced multi-seller dropshipping platform,
                            empowering entrepreneurs to build successful businesses with cutting-edge technology.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Mission & Vision */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                        <p className="text-lg text-gray-600 mb-6">
                            To democratize entrepreneurship by providing anyone with the tools, technology,
                            and platform needed to build a successful dropshipping business. We believe
                            that success should be accessible to everyone, regardless of their background
                            or location.
                        </p>
                        <p className="text-lg text-gray-600">
                            Through our innovative multi-seller platform, we're creating opportunities
                            for thousands of entrepreneurs to connect with customers worldwide,
                            while building sustainable, profitable businesses.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
                        <p className="text-lg text-gray-600 mb-6">
                            To become the global standard for dropshipping and e-commerce,
                            where millions of sellers and buyers connect seamlessly,
                            creating a thriving ecosystem of innovation and growth.
                        </p>
                        <p className="text-lg text-gray-600">
                            We envision a future where anyone with a great product idea can turn it
                            into a successful business within days, not years, thanks to our
                            comprehensive platform and support system.
                        </p>
                    </div>
                </div>

                {/* Core Values */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="text-center">
                            <CardHeader>
                                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                <CardTitle>Innovation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    We constantly push the boundaries of what's possible in e-commerce,
                                    always looking for new ways to help our users succeed.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                <CardTitle>Community</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    We believe in the power of community and collaboration,
                                    fostering connections between sellers, buyers, and our team.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                                <CardTitle>Trust</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Security and transparency are at the heart of everything we do,
                                    ensuring safe transactions and honest business practices.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <Zap className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                                <CardTitle>Excellence</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    We strive for excellence in every aspect of our platform,
                                    from user experience to technical performance.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Company Stats */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-16">
                    <div className="text-center text-white mb-8">
                        <h2 className="text-3xl font-bold mb-4">MidoStore by the Numbers</h2>
                        <p className="text-xl opacity-90">Our impact in the dropshipping industry</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold mb-2">1000+</div>
                            <div className="text-blue-100">Active Sellers</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">50K+</div>
                            <div className="text-blue-100">Products Listed</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">$2M+</div>
                            <div className="text-blue-100">Monthly Sales</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">99.9%</div>
                            <div className="text-blue-100">Platform Uptime</div>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="text-center">
                            <CardHeader>
                                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-white text-2xl font-bold">M</span>
                                </div>
                                <CardTitle>Mohammed Al-Midani</CardTitle>
                                <CardDescription>Founder & CEO</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    Visionary entrepreneur with 10+ years in e-commerce and technology.
                                    Passionate about democratizing entrepreneurship.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-white text-2xl font-bold">A</span>
                                </div>
                                <CardTitle>Ahmed Hassan</CardTitle>
                                <CardDescription>CTO & Head of Engineering</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    Technology leader with expertise in scalable platforms and AI systems.
                                    Building the future of e-commerce.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-white text-2xl font-bold">S</span>
                                </div>
                                <CardTitle>Sarah Johnson</CardTitle>
                                <CardDescription>Head of Operations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    Operations expert focused on creating seamless experiences for our
                                    sellers and buyers worldwide.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Awards & Recognition */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Awards & Recognition</h2>
                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                            <Award className="h-5 w-5 text-yellow-500" />
                            <span className="text-sm font-medium">Best E-commerce Platform 2024</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                            <Star className="h-5 w-5 text-blue-500" />
                            <span className="text-sm font-medium">Innovation Award</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                            <span className="text-sm font-medium">Fastest Growing Startup</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}