'use client';

import React from 'react';
import { useLocalization } from '../../app/contexts/LocalizationContext';
import LocalizationPanel from '../../components/LocalizationPanel';
import { Globe, DollarSign, Calendar, Clock, MapPin } from 'lucide-react';

export default function LocalizationDemoPage() {
    const {
        currentLocale,
        currentCurrency,
        currentCountry,
        formatPrice,
        formatDate,
        isRTL,
        t
    } = useLocalization();

    const sampleProducts = [
        { id: 1, name: 'Smartphone', price: 299.99, currency: 'USD' },
        { id: 2, name: 'Laptop', price: 899.99, currency: 'USD' },
        { id: 3, name: 'Headphones', price: 149.99, currency: 'USD' },
    ];

    const sampleDate = new Date();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Globe className="w-12 h-12 text-blue-600" />
                        <h1 className="text-4xl font-bold text-gray-900">Localization Demo</h1>
                    </div>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Experience the power of our localization system with language and currency selection
                    </p>
                </div>

                {/* Current Settings Display */}
                <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Language</p>
                            <p className="text-lg font-semibold text-gray-900">{currentLocale}</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg hover-lift">
                            <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2 animate-float" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Currency Conversion</h3>
                            <p className="text-gray-600 text-sm">Real-time exchange rates for accurate pricing</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Country</p>
                            <p className="text-lg font-semibold text-gray-900">{currentCountry?.name || 'Unknown'}</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-yellow-600 text-lg font-bold">{isRTL ? 'RTL' : 'LTR'}</span>
                            </div>
                            <p className="text-sm text-gray-600">Text Direction</p>
                            <p className="text-lg font-semibold text-gray-900">{isRTL ? 'Right to Left' : 'Left to Right'}</p>
                        </div>
                    </div>
                </div>

                {/* Localization Panel Demo */}
                <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Language & Currency Selection</h2>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <LocalizationPanel variant="header" />
                        <LocalizationPanel variant="dropdown" />
                        <LocalizationPanel variant="modal" />
                    </div>
                </div>

                {/* Formatting Examples */}
                <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Formatting Examples</h2>

                    {/* Price Formatting */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Price Formatting</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {sampleProducts.map((product) => (
                                <div key={product.id} className="p-4 border border-gray-200 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-2">{product.name}</h4>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {formatPrice(product.price, product.currency)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Original: {product.price.toFixed(2)} {product.currency}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Date Formatting */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Date Formatting</h3>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-5 h-5 text-gray-500" />
                                <span className="text-sm text-gray-600">Current Date</span>
                            </div>
                            <p className="text-xl font-semibold text-gray-900">{formatDate(sampleDate)}</p>
                            <p className="text-sm text-gray-500">
                                Raw: {sampleDate.toISOString()}
                            </p>
                        </div>
                    </div>

                    {/* Translation Examples */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Translation Examples</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2">Common Phrases</h4>
                                <ul className="space-y-1 text-sm">
                                    <li><strong>Welcome:</strong> {t('welcome')}</li>
                                    <li><strong>Products:</strong> {t('products')}</li>
                                    <li><strong>Cart:</strong> {t('cart')}</li>
                                    <li><strong>Profile:</strong> {t('profile')}</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2">Actions</h4>
                                <ul className="space-y-1 text-sm">
                                    <li><strong>Sign In:</strong> {t('signIn')}</li>
                                    <li><strong>Sign Up:</strong> {t('signUp')}</li>
                                    <li><strong>Search:</strong> {t('search')}</li>
                                    <li><strong>Filter:</strong> {t('filter')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RTL Support Demo */}
                {isRTL && (
                    <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Right-to-Left (RTL) Support</h2>
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                            <p className="text-lg text-gray-700 mb-4">
                                This text is displayed in right-to-left format for Arabic language support.
                            </p>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-blue-600 mb-2">
                                    مرحباً بكم في منصة ميدو هب
                                </p>
                                <p className="text-gray-600">
                                    منصة التسوق الإلكتروني الرائدة في منطقة الخليج
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Country Information */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Country Information</h2>
                    {currentCountry ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                                <div className="text-center mb-4">
                                    <span className="text-6xl">{currentCountry.flag}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{currentCountry.name}</h3>
                                <p className="text-gray-600 mb-4">{currentCountry.nameAr}</p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Currency:</span>
                                        <span className="font-medium">{currentCountry.currency} ({currentCountry.currencyAr})</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Timezone:</span>
                                        <span className="font-medium">{currentCountry.timezone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Locale:</span>
                                        <span className="font-medium">{currentCountry.locale}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Local Time</h3>
                                <div className="text-center">
                                    <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
                                    <p className="text-2xl font-bold text-gray-900">
                                        {new Date().toLocaleTimeString(currentLocale, {
                                            timeZone: currentCountry.timezone,
                                            hour12: false
                                        })}
                                    </p>
                                    <p className="text-gray-600 mt-2">
                                        {currentCountry.timezone}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No country information available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}