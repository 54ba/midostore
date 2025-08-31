'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Bitcoin, Users, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface PaymentMethod {
    id: string;
    name: string;
    type: 'crypto' | 'fiat' | 'p2p';
    currencies: string[];
    minAmount: number;
    maxAmount: number;
    fees: {
        percentage: number;
        fixed: number;
    };
    processingTime: string;
    enabled: boolean;
    description: string;
    icon: React.ReactNode;
}

interface PaymentMethodSelectorProps {
    amount: number;
    currency: string;
    onMethodSelect: (method: PaymentMethod) => void;
    selectedMethod?: PaymentMethod;
}

export default function PaymentMethodSelector({
    amount,
    currency,
    onMethodSelect,
    selectedMethod,
}: PaymentMethodSelectorProps) {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    const fetchPaymentMethods = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/bybit-payments?action=methods');

            if (!response.ok) {
                throw new Error('Failed to fetch payment methods');
            }

            const data = await response.json();
            if (data.success) {
                // Enhance the methods with icons and descriptions
                const enhancedMethods = data.data.map((method: any) => ({
                    ...method,
                    icon: getMethodIcon(method.type),
                    description: getMethodDescription(method),
                }));
                setPaymentMethods(enhancedMethods);
            } else {
                throw new Error(data.error || 'Failed to fetch payment methods');
            }
        } catch (err) {
            console.error('Error fetching payment methods:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch payment methods');

            // Fallback to demo methods
            setPaymentMethods(getDemoPaymentMethods());
        } finally {
            setLoading(false);
        }
    };

    const getMethodIcon = (type: string) => {
        switch (type) {
            case 'crypto':
                return <Bitcoin className="w-6 h-6 text-orange-500" />;
            case 'p2p':
                return <Users className="w-6 h-6 text-blue-500" />;
            case 'fiat':
                return <CreditCard className="w-6 h-6 text-green-500" />;
            default:
                return <CreditCard className="w-6 h-6 text-gray-500" />;
        }
    };

    const getMethodDescription = (method: any) => {
        switch (method.type) {
            case 'crypto':
                return `Pay with ${method.currencies.join(', ')} - Fast and secure blockchain payments`;
            case 'p2p':
                return 'Peer-to-peer transactions with escrow protection';
            case 'fiat':
                return 'Traditional bank transfers and card payments';
            default:
                return 'Secure payment processing';
        }
    };

    const getDemoPaymentMethods = (): PaymentMethod[] => [
        {
            id: 'crypto_btc',
            name: 'Bitcoin Payment',
            type: 'crypto',
            currencies: ['BTC'],
            minAmount: 0.001,
            maxAmount: 10,
            fees: { percentage: 0.5, fixed: 0 },
            processingTime: '10-30 minutes',
            enabled: true,
            description: 'Pay with Bitcoin - Fast and secure blockchain payments',
            icon: <Bitcoin className="w-6 h-6 text-orange-500" />,
        },
        {
            id: 'crypto_eth',
            name: 'Ethereum Payment',
            type: 'crypto',
            currencies: ['ETH'],
            minAmount: 0.01,
            maxAmount: 100,
            fees: { percentage: 0.5, fixed: 0 },
            processingTime: '2-5 minutes',
            enabled: true,
            description: 'Pay with Ethereum - Fast and secure blockchain payments',
            icon: <Bitcoin className="w-6 h-6 text-blue-500" />,
        },
        {
            id: 'crypto_usdt',
            name: 'USDT Payment',
            type: 'crypto',
            currencies: ['USDT'],
            minAmount: 10,
            maxAmount: 10000,
            fees: { percentage: 0.1, fixed: 1 },
            processingTime: '1-3 minutes',
            enabled: true,
            description: 'Pay with USDT - Fast and secure blockchain payments',
            icon: <Bitcoin className="w-6 h-6 text-green-500" />,
        },
        {
            id: 'p2p_escrow',
            name: 'P2P Escrow',
            type: 'p2p',
            currencies: ['BTC', 'ETH', 'USDT', 'BNB', 'SOL'],
            minAmount: 1,
            maxAmount: 50000,
            fees: { percentage: 0.2, fixed: 5 },
            processingTime: '5-15 minutes',
            enabled: true,
            description: 'Peer-to-peer transactions with escrow protection',
            icon: <Users className="w-6 h-6 text-purple-500" />,
        },
        {
            id: 'fiat_bank',
            name: 'Bank Transfer',
            type: 'fiat',
            currencies: ['USD', 'EUR', 'GBP'],
            minAmount: 50,
            maxAmount: 100000,
            fees: { percentage: 1.5, fixed: 10 },
            processingTime: '1-3 business days',
            enabled: true,
            description: 'Traditional bank transfers and card payments',
            icon: <CreditCard className="w-6 h-6 text-green-500" />,
        },
    ];

    const calculateFees = (method: PaymentMethod) => {
        const percentageFee = (amount * method.fees.percentage) / 100;
        const totalFees = percentageFee + method.fees.fixed;
        return totalFees;
    };

    const isMethodAvailable = (method: PaymentMethod) => {
        if (!method.enabled) return false;
        if (amount < method.minAmount || amount > method.maxAmount) return false;
        if (!method.currencies.includes(currency)) return false;
        return true;
    };

    const handleMethodSelect = (method: PaymentMethod) => {
        if (isMethodAvailable(method)) {
            onMethodSelect(method);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-700">Error: {error}</span>
                </div>
            </div>
        );
    }

    const availableMethods = paymentMethods.filter(isMethodAvailable);
    const unavailableMethods = paymentMethods.filter(method => !isMethodAvailable(method));

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Choose Payment Method
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Select your preferred payment method to complete your order
                </p>
            </div>

            {/* Available Payment Methods */}
            {availableMethods.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Available Methods
                    </h4>
                    {availableMethods.map((method) => (
                        <div
                            key={method.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedMethod?.id === method.id
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                            onClick={() => handleMethodSelect(method)}
                        >
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-1">
                                    {method.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                                            {method.name}
                                        </h5>
                                        {selectedMethod?.id === method.id && (
                                            <CheckCircle className="w-5 h-5 text-blue-500" />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        {method.description}
                                    </p>
                                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        <span>Processing: {method.processingTime}</span>
                                        <span>Fees: ${calculateFees(method).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Unavailable Payment Methods */}
            {unavailableMethods.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Other Methods
                    </h4>
                    {unavailableMethods.map((method) => (
                        <div
                            key={method.id}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 opacity-50 cursor-not-allowed"
                        >
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-1">
                                    {method.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                                        {method.name}
                                    </h5>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        {method.description}
                                    </p>
                                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        {!method.enabled && <span className="text-red-500">Disabled</span>}
                                        {method.enabled && amount < method.minAmount && (
                                            <span className="text-red-500">
                                                Minimum amount: ${method.minAmount}
                                            </span>
                                        )}
                                        {method.enabled && amount > method.maxAmount && (
                                            <span className="text-red-500">
                                                Maximum amount: ${method.maxAmount}
                                            </span>
                                        )}
                                        {method.enabled && !method.currencies.includes(currency) && (
                                            <span className="text-red-500">
                                                Currency {currency} not supported
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Security Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start">
                    <Shield className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                        <p className="font-medium">Secure Payment Processing</p>
                        <p className="mt-1">
                            All payments are processed securely through Bybit's trusted platform.
                            Your financial information is protected with bank-level security.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}