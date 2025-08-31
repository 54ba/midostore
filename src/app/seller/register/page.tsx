"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Store,
    CheckCircle,
    Shield,
    TrendingUp,
    Users,
    ArrowRight,
    Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SellerRegisterPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        businessName: '',
        email: '',
        phone: '',
        businessType: '',
        description: '',
        website: '',
        categories: [] as string[]
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const router = useRouter();

    const businessTypes = ['Individual', 'Company', 'Partnership', 'LLC', 'Corporation'];
    const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Beauty', 'Sports', 'Books', 'Toys', 'Automotive'];

    const validateStep = (stepNumber: number): boolean => {
        const newErrors: Record<string, string> = {};

        if (stepNumber === 1) {
            if (!formData.businessName.trim()) {
                newErrors.businessName = 'Business name is required';
            }
            if (!formData.businessType) {
                newErrors.businessType = 'Business type is required';
            }
            if (!formData.description.trim()) {
                newErrors.description = 'Business description is required';
            }
        } else if (stepNumber === 2) {
            if (!formData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address';
            }
            if (!formData.phone.trim()) {
                newErrors.phone = 'Phone number is required';
            }
        } else if (stepNumber === 3) {
            if (formData.categories.length === 0) {
                newErrors.categories = 'Please select at least one category';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleCategoryToggle = (category: string) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category]
        }));
        // Clear error when user selects a category
        if (errors.categories) {
            setErrors(prev => ({ ...prev, categories: '' }));
        }
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(step + 1);
        }
    };

    const prevStep = () => setStep(step - 1);

    const handleSubmit = async () => {
        if (!validateStep(4)) return;

        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Success - redirect to seller dashboard
            router.push('/seller/dashboard');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Name *
                        </label>
                        <input
                            type="text"
                            value={formData.businessName}
                            onChange={(e) => handleInputChange('businessName', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.businessName ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter your business name"
                        />
                        {errors.businessName && (
                            <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Type *
                        </label>
                        <select
                            value={formData.businessType}
                            onChange={(e) => handleInputChange('businessType', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.businessType ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Select business type</option>
                            {businessTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        {errors.businessType && (
                            <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Description *
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="Describe your business and what you sell"
                />
                {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
            </div>

            <div className="flex justify-end">
                <Button onClick={nextStep} disabled={!formData.businessName || !formData.businessType || !formData.description}>
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter your email address"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter your phone number"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website (Optional)
                </label>
                <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://yourwebsite.com"
                />
            </div>

            <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                    Previous Step
                </Button>
                <Button onClick={nextStep} disabled={!formData.email || !formData.phone}>
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Product Categories</h3>
                <p className="text-gray-600 mb-4">Select the categories that best describe your products</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categories.map(category => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => handleCategoryToggle(category)}
                            className={`p-3 border rounded-lg text-sm font-medium transition-all duration-200 ${formData.categories.includes(category)
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                {errors.categories && (
                    <p className="text-red-500 text-sm mt-2">{errors.categories}</p>
                )}
            </div>

            <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                    Previous Step
                </Button>
                <Button onClick={nextStep} disabled={formData.categories.length === 0}>
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Review & Submit</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                        <span className="font-medium">Business Name:</span>
                        <span>{formData.businessName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Business Type:</span>
                        <span>{formData.businessType}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Email:</span>
                        <span>{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Phone:</span>
                        <span>{formData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Categories:</span>
                        <span>{formData.categories.join(', ')}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                    Previous Step
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                        </>
                    ) : (
                        'Submit Application'
                    )}
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">Become a Seller</h1>
                    <p className="text-gray-600 mt-1">Join thousands of successful entrepreneurs on MidoStore</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3, 4].map((stepNumber) => (
                            <div key={stepNumber} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    {stepNumber}
                                </div>
                                {stepNumber < 4 && (
                                    <div className={`w-16 h-1 mx-2 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                        <span>Business Info</span>
                        <span>Contact</span>
                        <span>Categories</span>
                        <span>Review</span>
                    </div>
                </div>

                {/* Main Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Store className="mr-2 h-5 w-5" />
                            Seller Registration
                        </CardTitle>
                        <CardDescription>
                            Step {step} of 4: Complete your seller profile
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}
                        {step === 4 && renderStep4()}
                    </CardContent>
                </Card>

                {/* Benefits Section */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="text-center">
                            <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <CardTitle className="text-lg">Secure Platform</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-sm text-gray-600">
                                Enterprise-grade security with escrow protection for all transactions
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="text-center">
                            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <CardTitle className="text-lg">Growth Tools</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-sm text-gray-600">
                                Advanced analytics and AI-powered insights to grow your business
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="text-center">
                            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                            <CardTitle className="text-lg">Global Reach</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-sm text-gray-600">
                                Access customers worldwide with our international marketplace
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}