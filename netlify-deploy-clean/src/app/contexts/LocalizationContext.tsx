'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { config } from '../../../env.config';

export interface LocaleConfig {
    code: string;
    name: string;
    nameAr: string;
    currency: string;
    currencyAr: string;
    timezone: string;
    locale: string;
    flag: string;
}

export interface LocalizationContextType {
    currentLocale: string;
    currentCurrency: string;
    currentCountry: LocaleConfig | null;
    setLocale: (locale: string) => void;
    setCurrency: (currency: string) => void;
    availableLocales: LocaleConfig[];
    availableCurrencies: string[];
    formatPrice: (price: number, currency?: string) => string;
    formatDate: (date: Date) => string;
    isRTL: boolean;
    t: (key: string, params?: Record<string, any>) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

// Enhanced locale configurations with flags
const enhancedLocales: LocaleConfig[] = [
    {
        code: "AE",
        name: "United Arab Emirates",
        nameAr: "الإمارات العربية المتحدة",
        currency: "AED",
        currencyAr: "درهم إماراتي",
        timezone: "Asia/Dubai",
        locale: "en-AE",
        flag: "🇦🇪"
    },
    {
        code: "SA",
        name: "Saudi Arabia",
        nameAr: "المملكة العربية السعودية",
        currency: "SAR",
        currencyAr: "ريال سعودي",
        timezone: "Asia/Riyadh",
        locale: "en-SA",
        flag: "🇸🇦"
    },
    {
        code: "KW",
        name: "Kuwait",
        nameAr: "الكويت",
        currency: "KWD",
        currencyAr: "دينار كويتي",
        timezone: "Asia/Kuwait",
        locale: "en-KW",
        flag: "🇰🇼"
    },
    {
        code: "QA",
        name: "Qatar",
        nameAr: "قطر",
        currency: "QAR",
        currencyAr: "ريال قطري",
        timezone: "Asia/Qatar",
        locale: "en-QA",
        flag: "🇶🇦"
    },
    {
        code: "BH",
        name: "Bahrain",
        nameAr: "البحرين",
        currency: "BHD",
        currencyAr: "دينار بحريني",
        timezone: "Asia/Bahrain",
        locale: "en-BH",
        flag: "🇧🇭"
    },
    {
        code: "OM",
        name: "Oman",
        nameAr: "عُمان",
        currency: "OMR",
        currencyAr: "ريال عماني",
        timezone: "Asia/Muscat",
        locale: "en-OM",
        flag: "🇴🇲"
    }
];

// Arabic locales
const arabicLocales: LocaleConfig[] = enhancedLocales.map(locale => ({
    ...locale,
    locale: locale.locale.replace('en-', 'ar-')
}));

// Combine all locales
const allLocales = [...enhancedLocales, ...arabicLocales];

// Basic translations
const translations: Record<string, Record<string, string>> = {
    'en': {
        'welcome': 'Welcome',
        'products': 'Products',
        'cart': 'Cart',
        'profile': 'Profile',
        'signIn': 'Sign In',
        'signUp': 'Sign Up',
        'search': 'Search',
        'filter': 'Filter',
        'price': 'Price',
        'category': 'Category',
        'rating': 'Rating',
        'addToCart': 'Add to Cart',
        'viewDetails': 'View Details',
        'language': 'Language',
        'currency': 'Currency',
        'country': 'Country',
        'settings': 'Settings',
        'preferences': 'Preferences',
        'save': 'Save',
        'cancel': 'Cancel',
        'close': 'Close',
        'loading': 'Loading...',
        'error': 'Error',
        'success': 'Success',
        'recommendations': 'Recommendations',
        'popular': 'Popular',
        'trending': 'Trending',
        'new': 'New',
        'sale': 'Sale',
        'outOfStock': 'Out of Stock',
        'inStock': 'In Stock',
        'freeShipping': 'Free Shipping',
        'fastDelivery': 'Fast Delivery',
        'securePayment': 'Secure Payment',
        'customerSupport': 'Customer Support',
        'aboutUs': 'About Us',
        'contactUs': 'Contact Us',
        'privacyPolicy': 'Privacy Policy',
        'termsOfService': 'Terms of Service',
        'shippingInfo': 'Shipping Information',
        'returnPolicy': 'Return Policy',
        'faq': 'Frequently Asked Questions',
        'help': 'Help',
        'logout': 'Logout',
        'myAccount': 'My Account',
        'orderHistory': 'Order History',
        'wishlist': 'Wishlist',
        'notifications': 'Notifications',
        'darkMode': 'Dark Mode',
        'lightMode': 'Light Mode',
        'auto': 'Auto',
        'discoverAmazingProducts': 'Discover amazing products from Alibaba and AliExpress',
        'aiPoweredRecommendations': 'AI-Powered Recommendations',
        'discoverProductsTailored': 'Discover products tailored to your interests and trending items loved by our community.',
        'recommendedForYou': 'Recommended for You',
        'signInForPersonalized': 'Sign in to get personalized recommendations',
        'trendingProductsInRegion': 'Trending products in your region',
        'viewPopular': 'View Popular',
        'previous': 'Previous',
        'next': 'Next',
        'popularProductsForYou': 'Popular Products for You',
        'similarProducts': 'Similar Products',
        'productRecommendations': 'Product Recommendations',
        'signInToLikeProducts': 'Sign in to like products',
        'signInToAddToCart': 'Sign in to add to cart',
        'productAddedToFavorites': 'Product added to your favorites! Sign in to sync across devices.',
        'productAddedToCart': 'Product added to cart! Sign in to complete your purchase.',
        'signInForPersonalizedRecommendations': 'Sign in for personalized recommendations',
        'currentlyShowingPopular': 'Currently showing popular products. Sign in to get personalized recommendations based on your preferences and browsing history.'
    },
    'ar': {
        'welcome': 'مرحباً',
        'products': 'المنتجات',
        'cart': 'عربة التسوق',
        'profile': 'الملف الشخصي',
        'signIn': 'تسجيل الدخول',
        'signUp': 'إنشاء حساب',
        'search': 'البحث',
        'filter': 'تصفية',
        'price': 'السعر',
        'category': 'الفئة',
        'rating': 'التقييم',
        'addToCart': 'أضف إلى السلة',
        'viewDetails': 'عرض التفاصيل',
        'language': 'اللغة',
        'currency': 'العملة',
        'country': 'البلد',
        'settings': 'الإعدادات',
        'preferences': 'التفضيلات',
        'save': 'حفظ',
        'cancel': 'إلغاء',
        'close': 'إغلاق',
        'loading': 'جاري التحميل...',
        'error': 'خطأ',
        'success': 'نجح',
        'recommendations': 'التوصيات',
        'popular': 'شائع',
        'trending': 'رائج',
        'new': 'جديد',
        'sale': 'تخفيض',
        'outOfStock': 'نفذت الكمية',
        'inStock': 'متوفر',
        'freeShipping': 'شحن مجاني',
        'fastDelivery': 'توصيل سريع',
        'securePayment': 'دفع آمن',
        'customerSupport': 'دعم العملاء',
        'aboutUs': 'من نحن',
        'contactUs': 'اتصل بنا',
        'privacyPolicy': 'سياسة الخصوصية',
        'termsOfService': 'شروط الخدمة',
        'shippingInfo': 'معلومات الشحن',
        'returnPolicy': 'سياسة الإرجاع',
        'faq': 'الأسئلة الشائعة',
        'help': 'المساعدة',
        'logout': 'تسجيل الخروج',
        'myAccount': 'حسابي',
        'orderHistory': 'تاريخ الطلبات',
        'wishlist': 'المفضلة',
        'notifications': 'الإشعارات',
        'darkMode': 'الوضع المظلم',
        'lightMode': 'الوضع المضيء',
        'auto': 'تلقائي',
        'discoverAmazingProducts': 'اكتشف منتجات رائعة من علي بابا وعلي إكسبرس',
        'aiPoweredRecommendations': 'توصيات مدعومة بالذكاء الاصطناعي',
        'discoverProductsTailored': 'اكتشف منتجات مصممة خصيصاً لاهتماماتك والمنتجات الرائجة التي يحبها مجتمعنا.',
        'recommendedForYou': 'موصى به لك',
        'signInForPersonalized': 'سجل دخولك للحصول على توصيات مخصصة',
        'trendingProductsInRegion': 'المنتجات الرائجة في منطقتك',
        'viewPopular': 'عرض الشائع',
        'previous': 'السابق',
        'next': 'التالي',
        'popularProductsForYou': 'المنتجات الشائعة لك',
        'similarProducts': 'منتجات مشابهة',
        'productRecommendations': 'توصيات المنتجات',
        'signInToLikeProducts': 'سجل دخولك لإعجابك بالمنتجات',
        'signInToAddToCart': 'سجل دخولك لإضافة المنتجات إلى السلة',
        'productAddedToFavorites': 'تم إضافة المنتج إلى المفضلة! سجل دخولك للمزامنة عبر الأجهزة.',
        'productAddedToCart': 'تم إضافة المنتج إلى السلة! سجل دخولك لإكمال عملية الشراء.',
        'signInForPersonalizedRecommendations': 'سجل دخولك للحصول على توصيات مخصصة',
        'currentlyShowingPopular': 'نعرض حالياً المنتجات الشائعة. سجل دخولك للحصول على توصيات مخصصة بناءً على تفضيلاتك وسجل التصفح.'
    }
};

export function LocalizationProvider({ children }: { children: ReactNode }) {
    const [currentLocale, setCurrentLocale] = useState<string>('en-AE');
    const [currentCurrency, setCurrentCurrency] = useState<string>('AED');
    const [currentCountry, setCurrentCountry] = useState<LocaleConfig | null>(enhancedLocales[0]);

    // Initialize from localStorage or default values
    useEffect(() => {
        const savedLocale = localStorage.getItem('selectedLocale');
        const savedCurrency = localStorage.getItem('selectedCurrency');

        if (savedLocale) {
            setCurrentLocale(savedLocale);
            const country = allLocales.find(l => l.locale === savedLocale);
            if (country) {
                setCurrentCountry(country);
                setCurrentCurrency(country.currency);
            }
        }

        if (savedCurrency) {
            setCurrentCurrency(savedCurrency);
        }
    }, []);

    // Update localStorage when preferences change
    useEffect(() => {
        localStorage.setItem('selectedLocale', currentLocale);
        localStorage.setItem('selectedCurrency', currentCurrency);
    }, [currentLocale, currentCurrency]);

    const setLocale = (locale: string) => {
        setCurrentLocale(locale);
        const country = allLocales.find(l => l.locale === locale);
        if (country) {
            setCurrentCountry(country);
            setCurrentCurrency(country.currency);
        }
    };

    const setCurrency = (currency: string) => {
        setCurrentCurrency(currency);
    };

    const availableLocales = allLocales;
    const availableCurrencies = [...new Set(allLocales.map(l => l.currency))];

    const formatPrice = (price: number, currency?: string): string => {
        const targetCurrency = currency || currentCurrency;
        const locale = currentLocale.startsWith('ar') ? 'ar' : 'en';

        try {
            const formatter = new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: targetCurrency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            return formatter.format(price);
        } catch (error) {
            return `${price.toFixed(2)} ${targetCurrency}`;
        }
    };

    const formatDate = (date: Date): string => {
        const locale = currentLocale.startsWith('ar') ? 'ar' : 'en';
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    };

    const isRTL = currentLocale.startsWith('ar');

    const t = (key: string, params?: Record<string, any>): string => {
        const locale = currentLocale.startsWith('ar') ? 'ar' : 'en';
        let translation = translations[locale]?.[key] || key;

        if (params) {
            Object.entries(params).forEach(([param, value]) => {
                translation = translation.replace(`{${param}}`, String(value));
            });
        }

        return translation;
    };

    const value: LocalizationContextType = {
        currentLocale,
        currentCurrency,
        currentCountry,
        setLocale,
        setCurrency,
        availableLocales,
        availableCurrencies,
        formatPrice,
        formatDate,
        isRTL,
        t
    };

    return (
        <LocalizationContext.Provider value={value}>
            {children}
        </LocalizationContext.Provider>
    );
}

export function useLocalization(): LocalizationContextType {
    const context = useContext(LocalizationContext);
    if (context === undefined) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
    }
    return context;
}