"use client";

import React, { useState } from 'react';
import { useLocalization } from '@/app/contexts/LocalizationContext';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useThemeStyles } from '@/hooks/useThemeStyles';

export default function LocalizationSelector() {
    const {
        currentLocale,
        currentCurrency,
        currentCountry,
        setLocale,
        setCurrency,
        availableLocales,
        availableCurrencies,
        isRTL
    } = useLocalization();

    const [isLocaleOpen, setIsLocaleOpen] = useState(false);
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
    const styles = useThemeStyles();

    const currentLocaleConfig = availableLocales.find(l => l.locale === currentLocale);
    const currentCurrencyConfig = availableLocales.find(l => l.currency === currentCurrency);

    const handleLocaleChange = (locale: string) => {
        setLocale(locale);
        setIsLocaleOpen(false);
    };

    const handleCurrencyChange = (currency: string) => {
        setCurrency(currency);
        setIsCurrencyOpen(false);
    };

    return (
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Locale Selector */}
            <div className="relative">
                <button
                    onClick={() => setIsLocaleOpen(!isLocaleOpen)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 hover:shadow-md ${styles.border.primary
                        } ${styles.bg.card} ${styles.text.primary}`}
                >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">
                        {currentLocaleConfig?.flag} {currentLocaleConfig?.code}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isLocaleOpen ? 'rotate-180' : ''
                        }`} />
                </button>

                {isLocaleOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsLocaleOpen(false)}
                        />

                        {/* Dropdown */}
                        <div className={`absolute top-full mt-2 w-48 ${styles.bg.card} border rounded-lg shadow-lg z-20 py-2 ${styles.border.primary
                            } ${isRTL ? 'right-0' : 'left-0'}`}>
                            {availableLocales.map((locale) => (
                                <button
                                    key={locale.locale}
                                    onClick={() => handleLocaleChange(locale.locale)}
                                    className={`w-full flex items-center justify-between px-4 py-2 text-left hover:${styles.bg.secondary} transition-colors duration-150 ${currentLocale === locale.locale
                                            ? `${styles.bg.secondary} ${styles.text.accent}`
                                            : styles.text.secondary
                                        }`}
                                >
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                        <span className="text-lg">{locale.flag}</span>
                                        <div className="text-left rtl:text-right">
                                            <div className="font-medium">{locale.name}</div>
                                            <div className="text-xs opacity-75">{locale.nameAr}</div>
                                        </div>
                                    </div>
                                    {currentLocale === locale.locale && (
                                        <Check className="w-4 h-4" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Currency Selector */}
            <div className="relative">
                <button
                    onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 hover:shadow-md ${styles.border.primary
                        } ${styles.bg.card} ${styles.text.primary}`}
                >
                    <span className="text-sm font-medium">
                        {currentCurrency} {currentCurrencyConfig?.currencyAr}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCurrencyOpen ? 'rotate-180' : ''
                        }`} />
                </button>

                {isCurrencyOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsCurrencyOpen(false)}
                        />

                        {/* Dropdown */}
                        <div className={`absolute top-full mt-2 w-32 ${styles.bg.card} border rounded-lg shadow-lg z-20 py-2 ${styles.border.primary
                            } ${isRTL ? 'right-0' : 'left-0'}`}>
                            {availableCurrencies.map((currency) => {
                                const currencyConfig = availableLocales.find(l => l.currency === currency);
                                return (
                                    <button
                                        key={currency}
                                        onClick={() => handleCurrencyChange(currency)}
                                        className={`w-full flex items-center justify-between px-4 py-2 text-left hover:${styles.bg.secondary} transition-colors duration-150 ${currentCurrency === currency
                                                ? `${styles.bg.secondary} ${styles.text.accent}`
                                                : styles.text.secondary
                                            }`}
                                    >
                                        <div className="text-left rtl:text-right">
                                            <div className="font-medium">{currency}</div>
                                            <div className="text-xs opacity-75">{currencyConfig?.currencyAr}</div>
                                        </div>
                                        {currentCurrency === currency && (
                                            <Check className="w-4 h-4" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}