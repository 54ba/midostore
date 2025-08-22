"use client";

import React from 'react';
import { useLocalization } from '@/app/contexts/LocalizationContext';
import { useThemeStyles } from '@/hooks/useThemeStyles';
import { Globe, Flag, DollarSign, Calendar, Clock, Star, ShoppingCart, TrendingUp, Users, BarChart3 } from 'lucide-react';
import LocalizationSelector from '@/components/LocalizationSelector';
import ThemeToggle from '@/components/ThemeToggle';

export default function LocalizationDemo() {
  const {
    currentLocale,
    currentCurrency,
    currentCountry,
    availableLocales,
    availableCurrencies,
    formatPrice,
    formatDate,
    isRTL,
    t
  } = useLocalization();

  const styles = useThemeStyles();

  const sampleProducts = [
    {
      id: 1,
      name: t('wirelessHeadphonesPro'),
      price: 89.99,
      rating: 4.8,
      reviewCount: 1247,
      soldCount: 8500,
      category: t('electronics'),
      isHotDeal: true,
      discount: 40
    },
    {
      id: 2,
      name: t('smartFitnessWatch'),
      price: 199.99,
      rating: 4.6,
      reviewCount: 892,
      soldCount: 4200,
      category: t('electronics'),
      isHotDeal: true,
      discount: 33
    },
    {
      id: 3,
      name: t('organicFaceCream'),
      price: 29.99,
      rating: 4.3,
      reviewCount: 567,
      soldCount: 3200,
      category: t('beauty'),
      isHotDeal: false,
      discount: 50
    }
  ];

  const sampleAnalytics = {
    totalSales: 15420,
    activeUsers: 1247,
    conversionRate: 3.2,
    avgOrderValue: 89.45,
    customerLifetime: 1247,
    topCategories: [
      { name: t('electronics'), count: 150, sales: 8000 },
      { name: t('fashion'), count: 120, sales: 6000 },
      { name: t('homeGarden'), count: 100, sales: 4000 }
    ]
  };

  return (
    <div className={`min-h-screen ${styles.bg.primary} ${styles.text.primary} ${isRTL ? 'rtl' : 'ltr'}`}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Settings Display */}
        <section className="mb-12">
          <div className={`${styles.bg.card} ${styles.border.primary} border rounded-2xl p-6 shadow-lg`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Flag className="w-6 h-6 mr-3 rtl:ml-3 rtl:mr-0" />
              {t('currentLocalizationSettings')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`${styles.bg.secondary} rounded-xl p-4`}>
                <div className="flex items-center mb-2">
                  <Globe className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 text-blue-500" />
                  <span className="font-semibold">{t('language')}</span>
                </div>
                <p className="text-lg font-bold">{currentCountry?.name}</p>
                <p className="text-sm opacity-75">{currentCountry?.nameAr}</p>
                <p className="text-xs opacity-60">{currentLocale}</p>
              </div>

              <div className={`${styles.bg.secondary} rounded-xl p-4`}>
                <div className="flex items-center mb-2">
                  <DollarSign className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 text-green-500" />
                  <span className="font-semibold">{t('currency')}</span>
                </div>
                <p className="text-lg font-bold">{currentCurrency}</p>
                <p className="text-sm opacity-75">{currentCountry?.currencyAr}</p>
                <p className="text-xs opacity-60">{currentCountry?.timezone}</p>
              </div>

              <div className={`${styles.bg.secondary} rounded-xl p-4`}>
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 text-purple-500" />
                  <span className="font-semibold">{t('textDirection')}</span>
                </div>
                <p className="text-lg font-bold">{isRTL ? 'RTL' : 'LTR'}</p>
                <p className="text-sm opacity-75">{isRTL ? t('rightToLeft') : t('leftToRight')}</p>
                <p className="text-xs opacity-60">{t('layoutDirection')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Localization Features Demo */}
        <section className="mb-12">
          <div className={`${styles.bg.card} ${styles.border.primary} border rounded-2xl p-6 shadow-lg`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Globe className="w-6 h-6 mr-3 rtl:ml-3 rtl:mr-0" />
              {t('localizationFeatures')}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Available Locales */}
              <div>
                <h3 className="text-xl font-semibold mb-4">{t('availableLocales')}</h3>
                <div className="space-y-3">
                  {availableLocales.slice(0, 6).map((locale) => (
                    <div
                      key={locale.locale}
                      className={`p-3 rounded-lg border ${currentLocale === locale.locale
                          ? `${styles.border.accent} ${styles.bg.secondary}`
                          : styles.border.secondary
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <span className="text-2xl">{locale.flag}</span>
                          <div>
                            <p className="font-medium">{locale.name}</p>
                            <p className="text-sm opacity-75">{locale.nameAr}</p>
                          </div>
                        </div>
                        <div className="text-right rtl:text-left">
                          <p className="text-sm font-medium">{locale.currency}</p>
                          <p className="text-xs opacity-75">{locale.currencyAr}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Currencies */}
              <div>
                <h3 className="text-xl font-semibold mb-4">{t('availableCurrencies')}</h3>
                <div className="space-y-3">
                  {availableCurrencies.map((currency) => {
                    const currencyConfig = availableLocales.find(l => l.currency === currency);
                    return (
                      <div
                        key={currency}
                        className={`p-3 rounded-lg border ${currentCurrency === currency
                            ? `${styles.border.accent} ${styles.bg.secondary}`
                            : styles.border.secondary
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{currency}</p>
                            <p className="text-sm opacity-75">{currencyConfig?.currencyAr}</p>
                          </div>
                          <div className="text-right rtl:text-left">
                            <p className="text-sm opacity-75">{currencyConfig?.name}</p>
                            <p className="text-xs opacity-60">{currencyConfig?.code}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sample Content with Localization */}
        <section className="mb-12">
          <div className={`${styles.bg.card} ${styles.border.primary} border rounded-2xl p-6 shadow-lg`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <ShoppingCart className="w-6 h-6 mr-3 rtl:ml-3 rtl:mr-0" />
              {t('sampleLocalizedContent')}
            </h2>

            {/* Sample Products */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">{t('sampleProducts')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sampleProducts.map((product) => (
                  <div key={product.id} className={`${styles.bg.secondary} rounded-xl p-4 border ${styles.border.secondary}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.isHotDeal
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                        {product.isHotDeal ? t('hotDeal') : t('regularPrice')}
                      </span>
                      {product.isHotDeal && (
                        <span className="text-sm font-bold text-red-600 dark:text-red-400">
                          -{product.discount}%
                        </span>
                      )}
                    </div>

                    <h4 className="font-semibold mb-2">{product.name}</h4>
                    <p className="text-sm opacity-75 mb-3">{product.category}</p>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold">{formatPrice(product.price)}</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1 rtl:ml-1 rtl:mr-0" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs opacity-75">
                      <span>{t('reviews')}: {product.reviewCount}</span>
                      <span>{t('sold')}: {product.soldCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Analytics */}
            <div>
              <h3 className="text-xl font-semibold mb-4">{t('sampleAnalytics')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className={`${styles.bg.secondary} rounded-xl p-4 border ${styles.border.secondary}`}>
                  <div className="flex items-center mb-3">
                    <TrendingUp className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 text-green-500" />
                    <span className="font-semibold">{t('totalSales')}</span>
                  </div>
                  <p className="text-2xl font-bold">{formatPrice(sampleAnalytics.totalSales)}</p>
                  <p className="text-sm opacity-75">{t('thisMonth')}</p>
                </div>

                <div className={`${styles.bg.secondary} rounded-xl p-4 border ${styles.border.secondary}`}>
                  <div className="flex items-center mb-3">
                    <Users className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 text-blue-500" />
                    <span className="font-semibold">{t('activeUsers')}</span>
                  </div>
                  <p className="text-2xl font-bold">{sampleAnalytics.activeUsers.toLocaleString()}</p>
                  <p className="text-sm opacity-75">{t('currentlyOnline')}</p>
                </div>

                <div className={`${styles.bg.secondary} rounded-xl p-4 border ${styles.border.secondary}`}>
                  <div className="flex items-center mb-3">
                    <BarChart3 className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 text-purple-500" />
                    <span className="font-semibold">{t('conversionRate')}</span>
                  </div>
                  <p className="text-2xl font-bold">{sampleAnalytics.conversionRate}%</p>
                  <p className="text-sm opacity-75">{t('visitorsToCustomers')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Formatting Examples */}
        <section className="mb-12">
          <div className={`${styles.bg.card} ${styles.border.primary} border rounded-2xl p-6 shadow-lg`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-3 rtl:ml-3 rtl:mr-0" />
              {t('formattingExamples')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">{t('priceFormatting')}</h3>
                <div className="space-y-3">
                  <div className={`${styles.bg.secondary} rounded-lg p-3`}>
                    <p className="text-sm opacity-75">{t('samplePrice')}</p>
                    <p className="text-lg font-bold">{formatPrice(89.99)}</p>
                  </div>
                  <div className={`${styles.bg.secondary} rounded-lg p-3`}>
                    <p className="text-sm opacity-75">{t('largeAmount')}</p>
                    <p className="text-lg font-bold">{formatPrice(15420.50)}</p>
                  </div>
                  <div className={`${styles.bg.secondary} rounded-lg p-3`}>
                    <p className="text-sm opacity-75">{t('smallAmount')}</p>
                    <p className="text-lg font-bold">{formatPrice(0.99)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">{t('dateFormatting')}</h3>
                <div className="space-y-3">
                  <div className={`${styles.bg.secondary} rounded-lg p-3`}>
                    <p className="text-sm opacity-75">{t('currentDate')}</p>
                    <p className="text-lg font-bold">{formatDate(new Date())}</p>
                  </div>
                  <div className={`${styles.bg.secondary} rounded-lg p-3`}>
                    <p className="text-sm opacity-75">{t('yesterday')}</p>
                    <p className="text-lg font-bold">{formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000))}</p>
                  </div>
                  <div className={`${styles.bg.secondary} rounded-lg p-3`}>
                    <p className="text-sm opacity-75">{t('lastWeek')}</p>
                    <p className="text-lg font-bold">{formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Instructions */}
        <section className="mb-12">
          <div className={`${styles.bg.card} ${styles.border.primary} border rounded-2xl p-6 shadow-lg`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Globe className="w-6 h-6 mr-3 rtl:ml-3 rtl:mr-0" />
              {t('howToUseLocalization')}
            </h2>

            <div className="prose dark:prose-invert max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">{t('forDevelopers')}</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• {t('useTranslationHook')}</li>
                    <li>• {t('accessLocaleInfo')}</li>
                    <li>• {t('formatPricesDates')}</li>
                    <li>• {t('handleRtlLayout')}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">{t('forUsers')}</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• {t('switchLanguages')}</li>
                    <li>• {t('changeCurrencies')}</li>
                    <li>• {t('viewLocalizedContent')}</li>
                    <li>• {t('experienceRtlLayout')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}