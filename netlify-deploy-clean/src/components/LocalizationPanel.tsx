'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Settings } from 'lucide-react';
import { useLocalization, LocaleConfig } from '../app/contexts/LocalizationContext';

interface LocalizationPanelProps {
    className?: string;
    variant?: 'header' | 'dropdown' | 'modal';
}

export default function LocalizationPanel({
    className = '',
    variant = 'header'
}: LocalizationPanelProps) {
    const {
        currentLocale,
        currentCurrency,
        currentCountry,
        setLocale,
        setCurrency,
        availableLocales,
        availableCurrencies,
        t
    } = useLocalization();

    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'language' | 'currency'>('language');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLocaleSelect = (locale: string) => {
        setLocale(locale);
        setIsOpen(false);
    };

    const handleCurrencySelect = (currency: string) => {
        setCurrency(currency);
        setIsOpen(false);
    };

    const getCurrentLocaleDisplay = (): LocaleConfig | undefined => {
        return availableLocales.find(l => l.locale === currentLocale);
    };

    const getCurrentCurrencyDisplay = (): string => {
        return currentCurrency;
    };

    if (variant === 'header') {
        return (
            <div className={`relative ${className}`} ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Globe className="w-4 h-4" />
                    <span className="hidden sm:inline">
                        {getCurrentLocaleDisplay()?.flag} {getCurrentLocaleDisplay()?.name}
                    </span>
                    <span className="hidden sm:inline text-gray-500">
                        ({getCurrentCurrencyDisplay()})
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{t('language')} & {t('currency')}</h3>
                                    <p className="text-sm text-gray-500">Choose your preferred language and currency</p>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('language')}
                                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'language'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {t('language')}
                            </button>
                            <button
                                onClick={() => setActiveTab('currency')}
                                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'currency'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {t('currency')}
                            </button>
                        </div>

                        {/* Content */}
                        <div className="max-h-96 overflow-y-auto">
                            {activeTab === 'language' ? (
                                <div className="p-4 space-y-2">
                                    {availableLocales.map((locale) => (
                                        <button
                                            key={locale.locale}
                                            onClick={() => handleLocaleSelect(locale.locale)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${currentLocale === locale.locale
                                                ? 'bg-blue-50 border border-blue-200'
                                                : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="text-2xl">{locale.flag}</div>
                                            <div className="flex-1 text-left">
                                                <div className="font-medium text-gray-900">
                                                    {locale.locale.startsWith('en') ? locale.name : locale.nameAr}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {locale.locale.startsWith('en') ? locale.nameAr : locale.name}
                                                </div>
                                            </div>
                                            {currentLocale === locale.locale && (
                                                <Check className="w-5 h-5 text-blue-600" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 space-y-2">
                                    {availableCurrencies.map((currency) => (
                                        <button
                                            key={currency}
                                            onClick={() => handleCurrencySelect(currency)}
                                            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${currentCurrency === currency
                                                ? 'bg-blue-50 border border-blue-200'
                                                : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center animate-float">
                                                    <span className="text-blue-600 font-semibold text-sm">
                                                        {currency}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{currency}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {availableLocales.find(l => l.currency === currency)?.name || currency}
                                                    </div>
                                                </div>
                                            </div>
                                            {currentCurrency === currency && (
                                                <Check className="w-5 h-5 text-blue-600" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>Current: {getCurrentLocaleDisplay()?.flag} {getCurrentLocaleDisplay()?.name} ({getCurrentCurrencyDisplay()})</span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    {t('close')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (variant === 'dropdown') {
        return (
            <div className={`relative ${className}`} ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                        {getCurrentLocaleDisplay()?.flag} {getCurrentCurrencyDisplay()}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="p-3">
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                                {t('language')}
                            </div>
                            <div className="space-y-1 mb-3">
                                {availableLocales.slice(0, 6).map((locale) => (
                                    <button
                                        key={locale.locale}
                                        onClick={() => handleLocaleSelect(locale.locale)}
                                        className={`w-full flex items-center gap-2 p-2 rounded text-sm transition-colors ${currentLocale === locale.locale
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'hover:bg-gray-50 text-gray-700'
                                            }`}
                                    >
                                        <span>{locale.flag}</span>
                                        <span>{locale.locale.startsWith('en') ? locale.name : locale.nameAr}</span>
                                        {currentLocale === locale.locale && <Check className="w-4 h-4 ml-auto" />}
                                    </button>
                                ))}
                            </div>

                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                                {t('currency')}
                            </div>
                            <div className="space-y-1">
                                {availableCurrencies.map((currency) => (
                                    <button
                                        key={currency}
                                        onClick={() => handleCurrencySelect(currency)}
                                        className={`w-full flex items-center gap-2 p-2 rounded text-sm transition-colors ${currentCurrency === currency
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'hover:bg-gray-50 text-gray-700'
                                            }`}
                                    >
                                        <span className="font-mono">{currency}</span>
                                        <span className="text-gray-500">
                                            {availableLocales.find(l => l.currency === currency)?.name || currency}
                                        </span>
                                        {currentCurrency === currency && <Check className="w-4 h-4 ml-auto" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Modal variant
    return (
        <div className={`${className}`}>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                <Settings className="w-4 h-4" />
                <span>{t('settings')}</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">{t('language')} & {t('currency')}</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="space-y-6">
                                {/* Language Selection */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">{t('language')}</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {availableLocales.map((locale) => (
                                            <button
                                                key={locale.locale}
                                                onClick={() => handleLocaleSelect(locale.locale)}
                                                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${currentLocale === locale.locale
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <span className="text-2xl">{locale.flag}</span>
                                                <div className="flex-1 text-left">
                                                    <div className="font-medium text-gray-900">
                                                        {locale.locale.startsWith('en') ? locale.name : locale.nameAr}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {locale.locale.startsWith('en') ? locale.nameAr : locale.name}
                                                    </div>
                                                </div>
                                                {currentLocale === locale.locale && (
                                                    <Check className="w-5 h-5 text-blue-600" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Currency Selection */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">{t('currency')}</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {availableCurrencies.map((currency) => (
                                            <button
                                                key={currency}
                                                onClick={() => handleCurrencySelect(currency)}
                                                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${currentCurrency === currency
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center animate-float">
                                                    <span className="text-blue-600 font-semibold">{currency}</span>
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <div className="font-medium text-gray-900">{currency}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {availableLocales.find(l => l.currency === currency)?.name || currency}
                                                    </div>
                                                </div>
                                                {currentCurrency === currency && (
                                                    <Check className="w-5 h-5 text-blue-600" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gray-50">
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    {t('close')}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {t('save')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}