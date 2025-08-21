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
        'currentlyShowingPopular': 'Currently showing popular products. Sign in to get personalized recommendations based on your preferences and browsing history.',

        // New home page translations
        'aiPowered': 'AI-Powered',
        'intelligentProductRecommendations': 'Intelligent Product Recommendations',
        'aiRecommendationsDescription': 'Our advanced AI analyzes customer behavior, market trends, and product performance to deliver personalized recommendations that boost your sales and customer satisfaction.',
        'smartTargeting': 'Smart Targeting',
        'smartTargetingDescription': 'AI-driven customer segmentation and personalized product suggestions based on browsing patterns and purchase history.',
        'trendAnalysis': 'Trend Analysis',
        'trendAnalysisDescription': 'Real-time market trend detection and predictive analytics to stay ahead of customer demands and market shifts.',
        'insightGeneration': 'Insight Generation',
        'insightGenerationDescription': 'Deep insights into product performance, customer preferences, and optimization opportunities for your business.',
        'analyticsInsights': 'Analytics & Insights',
        'comprehensiveBusinessIntelligence': 'Comprehensive Business Intelligence',
        'businessIntelligenceDescription': 'Get deep insights into your business performance with real-time analytics, customizable dashboards, and actionable intelligence to drive growth.',
        'realTimeMonitoring': 'Real-Time Monitoring',
        'realTimeMonitoringDescription': 'Track sales, inventory, and customer behavior in real-time with live dashboards and instant notifications.',
        'advancedReporting': 'Advanced Reporting',
        'advancedReportingDescription': 'Generate comprehensive reports with customizable metrics, visualizations, and export capabilities.',
        'performanceTracking': 'Performance Tracking',
        'performanceTrackingDescription': 'Monitor KPIs, set goals, and track progress with automated alerts and performance insights.',
        'conversionRate': 'Conversion Rate',
        'avgOrderValue': 'Avg. Order Value',
        'customerLifetime': 'Customer Lifetime',
        'aiOrchestrator': 'AI Orchestrator',
        'centralizedAiCommandCenter': 'Centralized AI Command Center',
        'aiOrchestratorDescription': 'Manage all your AI-powered tools from one unified dashboard. Coordinate scraping, recommendations, analytics, and automation workflows seamlessly.',
        'workflowManagement': 'Workflow Management',
        'workflowManagementDescription': 'Create and manage complex AI workflows with drag-and-drop interface',
        'automationEngine': 'Automation Engine',
        'automationEngineDescription': 'Set up automated tasks and triggers for seamless operation',
        'securityCompliance': 'Security & Compliance',
        'securityComplianceDescription': 'Enterprise-grade security with role-based access control',
        'globalIntegration': 'Global Integration',
        'globalIntegrationDescription': 'Connect with 100+ platforms and services worldwide',
        'realTimeAnalytics': 'Real-Time Analytics',
        'comprehensiveProductAnalytics': 'Comprehensive Product Analytics',
        'productAnalyticsDescription': 'Track product performance, sales trends, and customer behavior in real-time. Make data-driven decisions to maximize your profits.',
        'realCustomerReviews': 'Real Customer Reviews',
        'whatOurCustomersSay': 'What Our Customers Say About Products',
        'customerReviewsDescription': 'Read authentic reviews from verified customers who have purchased and used our products. Real feedback, real experiences, real insights.',
        'readyToStartYourDropshippingEmpire': 'Ready to Start Your Dropshipping Empire?',
        'ctaDescription': 'Join thousands of successful entrepreneurs who trust MidoHub for their Alibaba product sourcing needs. Start today and transform your business!',
        'startYourEmpireNow': 'Start Your Empire Now',
        'learnMore': 'Learn More',

        // Product review translations
        'wirelessHeadphonesPro': 'Wireless Noise-Canceling Headphones Pro',
        'smartFitnessWatch': 'Smart Fitness Watch with Health Monitoring',
        'organicFaceCream': 'Organic Anti-Aging Face Cream Set',
        'educationalBuildingBlocks': 'Educational Building Blocks Set',
        'headphonesReviewComment': 'These headphones are absolutely incredible! The noise cancellation is top-notch and the sound quality is premium. Perfect for my daily commute and work calls.',
        'fitnessWatchReviewComment': 'This watch has transformed my fitness journey! The heart rate monitoring is accurate and the sleep tracking gives me insights I never had before. Battery life is amazing!',
        'faceCreamReviewComment': 'Great value for money! The cream is lightweight and absorbs quickly. I noticed improvement in my skin texture after just a week of use. Will definitely repurchase!',
        'buildingBlocksReviewComment': 'Perfect for my 6-year-old! The blocks are high quality and the educational aspect is fantastic. He learns while having fun. Highly recommend for parents!',
        'twoDaysLeft': '2 days left',
        'oneDayLeft': '1 day left',

        // Localization demo page translations
        'localizationDemo': 'Localization Demo',
        'currentLocalizationSettings': 'Current Localization Settings',
        'textDirection': 'Text Direction',
        'rightToLeft': 'Right to Left',
        'leftToRight': 'Left to Right',
        'layoutDirection': 'Layout Direction',
        'localizationFeatures': 'Localization Features',
        'availableLocales': 'Available Locales',
        'availableCurrencies': 'Available Currencies',
        'sampleLocalizedContent': 'Sample Localized Content',
        'sampleProducts': 'Sample Products',
        'hotDeal': 'Hot Deal',
        'regularPrice': 'Regular Price',
        'reviews': 'Reviews',
        'sold': 'Sold',
        'sampleAnalytics': 'Sample Analytics',
        'thisMonth': 'This Month',
        'currentlyOnline': 'Currently Online',
        'visitorsToCustomers': 'Visitors to Customers',
        'formattingExamples': 'Formatting Examples',
        'priceFormatting': 'Price Formatting',
        'samplePrice': 'Sample Price',
        'largeAmount': 'Large Amount',
        'smallAmount': 'Small Amount',
        'dateFormatting': 'Date Formatting',
        'currentDate': 'Current Date',
        'yesterday': 'Yesterday',
        'lastWeek': 'Last Week',
        'howToUseLocalization': 'How to Use Localization',
        'forDevelopers': 'For Developers',
        'useTranslationHook': 'Use the translation hook (t function)',
        'accessLocaleInfo': 'Access locale information and settings',
        'formatPricesDates': 'Format prices and dates automatically',
        'handleRtlLayout': 'Handle RTL layout automatically',
        'forUsers': 'For Users',
        'switchLanguages': 'Switch between different languages',
        'changeCurrencies': 'Change currencies for pricing',
        'viewLocalizedContent': 'View content in your preferred language',
        'experienceRtlLayout': 'Experience RTL layout for Arabic',

        // Category translations
        'electronics': 'Electronics',
        'fashion': 'Fashion',
        'beauty': 'Beauty',
        'homeGarden': 'Home & Garden'
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
        'currentlyShowingPopular': 'نعرض حالياً المنتجات الشائعة. سجل دخولك للحصول على توصيات مخصصة بناءً على تفضيلاتك وسجل التصفح.',

        // New home page translations in Arabic
        'aiPowered': 'مدعوم بالذكاء الاصطناعي',
        'intelligentProductRecommendations': 'توصيات منتجات ذكية',
        'aiRecommendationsDescription': 'يحلل الذكاء الاصطناعي المتقدم سلوك العملاء واتجاهات السوق وأداء المنتجات لتقديم توصيات مخصصة تعزز مبيعاتك ورضا العملاء.',
        'smartTargeting': 'استهداف ذكي',
        'smartTargetingDescription': 'تقسيم العملاء مدعوم بالذكاء الاصطناعي وتوصيات منتجات مخصصة بناءً على أنماط التصفح وتاريخ المشتريات.',
        'trendAnalysis': 'تحليل الاتجاهات',
        'trendAnalysisDescription': 'اكتشاف اتجاهات السوق في الوقت الفعلي والتحليلات التنبؤية للبقاء متقدماً على طلبات العملاء وتغيرات السوق.',
        'insightGeneration': 'توليد الرؤى',
        'insightGenerationDescription': 'رؤى عميقة حول أداء المنتجات وتفضيلات العملاء وفرص التحسين لعملك.',
        'analyticsInsights': 'التحليلات والرؤى',
        'comprehensiveBusinessIntelligence': 'ذكاء أعمال شامل',
        'businessIntelligenceDescription': 'احصل على رؤى عميقة حول أداء عملك مع التحليلات في الوقت الفعلي ولوحات المعلومات القابلة للتخصيص والذكاء القابل للتنفيذ لدفع النمو.',
        'realTimeMonitoring': 'المراقبة في الوقت الفعلي',
        'realTimeMonitoringDescription': 'تتبع المبيعات والمخزون وسلوك العملاء في الوقت الفعلي مع لوحات المعلومات المباشرة والإشعارات الفورية.',
        'advancedReporting': 'تقارير متقدمة',
        'advancedReportingDescription': 'إنشاء تقارير شاملة مع مقاييس قابلة للتخصيص وتصورات وقدرات تصدير.',
        'performanceTracking': 'تتبع الأداء',
        'performanceTrackingDescription': 'مراقبة مؤشرات الأداء الرئيسية وتحديد الأهداف وتتبع التقدم مع تنبيهات آلية ورؤى الأداء.',
        'conversionRate': 'معدل التحويل',
        'avgOrderValue': 'متوسط قيمة الطلب',
        'customerLifetime': 'عمر العميل',
        'aiOrchestrator': 'منظم الذكاء الاصطناعي',
        'centralizedAiCommandCenter': 'مركز القيادة المركزي للذكاء الاصطناعي',
        'aiOrchestratorDescription': 'إدارة جميع أدواتك المدعومة بالذكاء الاصطناعي من لوحة معلومات موحدة. تنسيق الخدش والتوصيات والتحليلات وسير العمل الآلي بسلاسة.',
        'workflowManagement': 'إدارة سير العمل',
        'workflowManagementDescription': 'إنشاء وإدارة سير عمل الذكاء الاصطناعي المعقدة مع واجهة السحب والإفلات',
        'automationEngine': 'محرك الأتمتة',
        'automationEngineDescription': 'إعداد المهام وال triggers الآلية للتشغيل السلس',
        'securityCompliance': 'الأمان والامتثال',
        'securityComplianceDescription': 'أمان على مستوى المؤسسة مع التحكم في الوصول القائم على الأدوار',
        'globalIntegration': 'التكامل العالمي',
        'globalIntegrationDescription': 'الاتصال بأكثر من 100 منصة وخدمة في جميع أنحاء العالم',
        'realTimeAnalytics': 'التحليلات في الوقت الفعلي',
        'comprehensiveProductAnalytics': 'تحليلات منتجات شاملة',
        'productAnalyticsDescription': 'تتبع أداء المنتجات واتجاهات المبيعات وسلوك العملاء في الوقت الفعلي. اتخاذ قرارات مدعومة بالبيانات لتعظيم أرباحك.',
        'realCustomerReviews': 'تقييمات عملاء حقيقية',
        'whatOurCustomersSay': 'ماذا يقول عملاؤنا عن المنتجات',
        'customerReviewsDescription': 'اقرأ تقييمات أصلية من عملاء موثقين اشتروا واستخدموا منتجاتنا. تعليقات حقيقية، تجارب حقيقية، رؤى حقيقية.',
        'readyToStartYourDropshippingEmpire': 'هل أنت مستعد لبدء إمبراطورية الدروب شيبينج؟',
        'ctaDescription': 'انضم إلى آلاف رواد الأعمال الناجحين الذين يثقون بـ MidoHub لاحتياجاتهم من منتجات علي بابا. ابدأ اليوم وحول عملك!',
        'startYourEmpireNow': 'ابدأ إمبراطوريتك الآن',
        'learnMore': 'اعرف المزيد',

        // Product review translations in Arabic
        'wirelessHeadphonesPro': 'سماعات لاسلكية احترافية مع إلغاء الضوضاء',
        'smartFitnessWatch': 'ساعة ذكية للياقة البدنية مع مراقبة الصحة',
        'organicFaceCream': 'كريم وجه عضوي مضاد للشيخوخة',
        'educationalBuildingBlocks': 'مجموعة مكعبات تعليمية',
        'headphonesReviewComment': 'هذه السماعات مذهلة تماماً! إلغاء الضوضاء ممتاز وجودة الصوت عالية المستوى. مثالية لرحلاتي اليومية ومكالمات العمل.',
        'fitnessWatchReviewComment': 'هذه الساعة غيرت رحلتي في اللياقة البدنية! مراقبة معدل ضربات القلب دقيقة وتتبع النوم يعطيني رؤى لم أكن أملكها من قبل. عمر البطارية مذهل!',
        'faceCreamReviewComment': 'قيمة ممتازة مقابل المال! الكريم خفيف ويمتص بسرعة. لاحظت تحسناً في نسيج بشرتي بعد أسبوع واحد فقط من الاستخدام. سأعيد الشراء بالتأكيد!',
        'buildingBlocksReviewComment': 'مثالية لابني البالغ من العمر 6 سنوات! المكعبات عالية الجودة والجانب التعليمي رائع. يتعلم بينما يستمتع. أوصي بشدة للآباء!',
        'twoDaysLeft': 'متبقي يومان',
        'oneDayLeft': 'متبقي يوم واحد',

        // Localization demo page translations in Arabic
        'localizationDemo': 'عرض تجريبي للترجمة',
        'currentLocalizationSettings': 'إعدادات الترجمة الحالية',
        'textDirection': 'اتجاه النص',
        'rightToLeft': 'من اليمين إلى اليسار',
        'leftToRight': 'من اليسار إلى اليمين',
        'layoutDirection': 'اتجاه التخطيط',
        'localizationFeatures': 'ميزات الترجمة',
        'availableLocales': 'اللغات المتاحة',
        'availableCurrencies': 'العملات المتاحة',
        'sampleLocalizedContent': 'محتوى مترجم عينة',
        'sampleProducts': 'منتجات عينة',
        'hotDeal': 'عرض حر',
        'regularPrice': 'السعر العادي',
        'reviews': 'التقييمات',
        'sold': 'باع',
        'sampleAnalytics': 'تحليلات عينة',
        'thisMonth': 'هذا الشهر',
        'currentlyOnline': 'حالياً على الإنترنت',
        'visitorsToCustomers': 'الزوار إلى العملاء',
        'formattingExamples': 'أمثلة للتنسيق',
        'priceFormatting': 'تنسيق الأسعار',
        'samplePrice': 'سعر عينة',
        'largeAmount': 'مبلغ كبير',
        'smallAmount': 'مبلغ صغير',
        'dateFormatting': 'تنسيق التواريخ',
        'currentDate': 'التاريخ الحالي',
        'yesterday': 'أمس',
        'lastWeek': 'الأسبوع الماضي',
        'howToUseLocalization': 'كيفية استخدام الترجمة',
        'forDevelopers': 'للمطورين',
        'useTranslationHook': 'استخدم دعم الترجمة (دالة t)',
        'accessLocaleInfo': 'الوصول إلى معلومات اللغة وإعداداتها',
        'formatPricesDates': 'تنسيق الأسعار والتواريخ تلقائياً',
        'handleRtlLayout': 'التعامل مع تخطيط RTL تلقائياً',
        'forUsers': 'للمستخدمين',
        'switchLanguages': 'التبديل بين اللغات المختلفة',
        'changeCurrencies': 'تغيير العملات للتسعير',
        'viewLocalizedContent': 'عرض المحتوى باللغة المفضلة لديك',
        'experienceRtlLayout': 'تجربة التخطيط RTL للعربية',

        // Category translations in Arabic
        'electronics': 'الإلكترونيات',
        'fashion': 'الموضة',
        'beauty': 'الجمال',
        'homeGarden': 'المنزل والحديقة'
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