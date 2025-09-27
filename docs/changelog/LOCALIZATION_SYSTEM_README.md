# 🌍 Localization System - Language & Currency Selection

## Overview
The MidoStore platform now features a comprehensive localization system that supports multiple languages and currencies for Gulf countries. Users can seamlessly switch between different locales and currencies, with automatic formatting and translation support.

## ✨ Features

### 🌐 **Multi-Language Support**
- **English & Arabic**: Full support for both languages
- **Gulf Countries**: UAE, Saudi Arabia, Kuwait, Qatar, Bahrain, Oman
- **RTL Support**: Right-to-left layout for Arabic text
- **Contextual Translations**: Dynamic translation based on selected locale

### 💱 **Multi-Currency Support**
- **Local Currencies**: AED, SAR, KWD, QAR, BHD, OMR
- **Automatic Formatting**: Currency symbols and formatting based on locale
- **Exchange Rate Integration**: Real-time currency conversion
- **Price Display**: Localized price formatting with proper symbols

### 🎯 **User Experience**
- **Language Selection**: Easy switching between languages
- **Currency Selection**: Independent currency choice
- **Persistent Settings**: User preferences saved in localStorage
- **Responsive Design**: Works on all device sizes

## 🏗️ Architecture

### **Core Components**
```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│ LocalizationContext│    │ LocalizationPanel  │    │ Translation System │
│                     │    │                     │    │                     │
│ • State Management │◄──►│ • UI Components     │◄──►│ • English/Arabic   │
│ • Currency Format  │    │ • Language Picker   │    │ • Dynamic Keys      │
│ • Date Format      │    │ • Currency Picker   │    │ • RTL Support       │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

### **Data Flow**
1. **User Selection** → LocalizationPanel
2. **Context Update** → LocalizationContext
3. **State Change** → All Components
4. **UI Update** → Formatted Display

## 🚀 Quick Start

### **1. Setup Provider**
```tsx
// In your root layout
import { LocalizationProvider } from '@/app/contexts/LocalizationContext';

export default function Layout({ children }) {
  return (
    <LocalizationProvider>
      {children}
    </LocalizationProvider>
  );
}
```

### **2. Use in Components**
```tsx
import { useLocalization } from '@/app/contexts/LocalizationContext';

export default function MyComponent() {
  const {
    currentLocale,
    currentCurrency,
    formatPrice,
    formatDate,
    t,
    isRTL
  } = useLocalization();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>Price: {formatPrice(99.99)}</p>
      <p>Date: {formatDate(new Date())}</p>
    </div>
  );
}
```

### **3. Add Selection Panel**
```tsx
import LocalizationPanel from '@/components/LocalizationPanel';

// Header variant
<LocalizationPanel variant="header" />

// Dropdown variant
<LocalizationPanel variant="dropdown" />

// Modal variant
<LocalizationPanel variant="modal" />
```

## 🎨 UI Components

### **LocalizationPanel Variants**

#### **Header Variant**
- Compact design for header navigation
- Shows current language and currency
- Expandable dropdown with tabs
- Perfect for main navigation

#### **Dropdown Variant**
- Standard dropdown interface
- Quick language/currency switching
- Ideal for forms and settings
- Responsive design

#### **Modal Variant**
- Full-screen modal interface
- Detailed language selection
- Country information display
- Best for settings pages

### **Visual Features**
- **Flag Icons**: Country flags for easy identification
- **Currency Symbols**: Visual currency representation
- **Language Names**: Native language names
- **RTL Indicators**: Clear text direction indication

## 🌍 Supported Locales

### **English Locales**
```typescript
[
  'en-AE', // UAE
  'en-SA', // Saudi Arabia
  'en-KW', // Kuwait
  'en-QA', // Qatar
  'en-BH', // Bahrain
  'en-OM'  // Oman
]
```

### **Arabic Locales**
```typescript
[
  'ar-AE', // الإمارات العربية المتحدة
  'ar-SA', // المملكة العربية السعودية
  'ar-KW', // الكويت
  'ar-QA', // قطر
  'ar-BH', // البحرين
  'ar-OM'  // عُمان
]
```

### **Currencies**
```typescript
[
  'AED', // UAE Dirham
  'SAR', // Saudi Riyal
  'KWD', // Kuwaiti Dinar
  'QAR', // Qatari Riyal
  'BHD', // Bahraini Dinar
  'OMR'  // Omani Rial
]
```

## 🔧 Configuration

### **Environment Variables**
```bash
# Default locale and currency
DEFAULT_LOCALE=en-AE
DEFAULT_CURRENCY=AED

# Supported locales (JSON array)
SUPPORTED_LOCALES=["en-AE", "ar-AE", "en-SA", "ar-SA", "en-KW", "ar-KW", "en-QA", "ar-QA", "en-BH", "ar-BH", "en-OM", "ar-OM"]
```

### **Context Configuration**
```typescript
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
  // ... more countries
];
```

## 📱 Responsive Design

### **Mobile Optimization**
- **Touch-friendly**: Large touch targets
- **Swipe gestures**: Intuitive navigation
- **Adaptive layout**: Responsive grid system
- **Mobile-first**: Optimized for small screens

### **Desktop Features**
- **Hover effects**: Interactive elements
- **Keyboard navigation**: Accessibility support
- **Multi-column layout**: Efficient space usage
- **Advanced interactions**: Rich user experience

## 🔄 State Management

### **LocalStorage Persistence**
```typescript
// Automatically saves user preferences
useEffect(() => {
  localStorage.setItem('selectedLocale', currentLocale);
  localStorage.setItem('selectedCurrency', currentCurrency);
}, [currentLocale, currentCurrency]);
```

### **Context State**
```typescript
interface LocalizationContextType {
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
```

## 🌐 Translation System

### **Translation Keys**
```typescript
const translations = {
  'en': {
    'welcome': 'Welcome',
    'products': 'Products',
    'cart': 'Cart',
    // ... more keys
  },
  'ar': {
    'welcome': 'مرحباً',
    'products': 'المنتجات',
    'cart': 'عربة التسوق',
    // ... more keys
  }
};
```

### **Dynamic Translation**
```typescript
// Basic translation
const message = t('welcome');

// With parameters
const message = t('helloUser', { name: 'Ahmed' });

// Fallback handling
const message = t('unknownKey') || 'Default Message';
```

## 💰 Currency Formatting

### **Price Formatting**
```typescript
// Automatic currency detection
const price = formatPrice(99.99); // Uses currentCurrency

// Specific currency
const price = formatPrice(99.99, 'SAR');

// Examples
formatPrice(99.99, 'AED'); // "99.99 AED"
formatPrice(99.99, 'SAR'); // "99.99 SAR"
formatPrice(99.99, 'KWD'); // "99.99 KWD"
```

### **Number Formatting**
```typescript
// Locale-aware formatting
const formatter = new Intl.NumberFormat(currentLocale, {
  style: 'currency',
  currency: currentCurrency,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

return formatter.format(price);
```

## 📅 Date & Time Formatting

### **Date Formatting**
```typescript
const formatDate = (date: Date): string => {
  const locale = currentLocale.startsWith('ar') ? 'ar' : 'en';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};
```

### **Timezone Support**
```typescript
// Local time display
const localTime = new Date().toLocaleTimeString(currentLocale, {
  timeZone: currentCountry.timezone,
  hour12: false
});
```

## 🎯 Usage Examples

### **Product Display**
```tsx
function ProductCard({ product }) {
  const { formatPrice, t } = useLocalization();

  return (
    <div className="product-card">
      <h3>{product.title}</h3>
      <p className="price">{formatPrice(product.price)}</p>
      <button>{t('addToCart')}</button>
    </div>
  );
}
```

### **Navigation Menu**
```tsx
function Navigation() {
  const { t, currentLocale } = useLocalization();

  return (
    <nav className={currentLocale.startsWith('ar') ? 'rtl' : 'ltr'}>
      <a href="/products">{t('products')}</a>
      <a href="/cart">{t('cart')}</a>
      <a href="/profile">{t('profile')}</a>
    </nav>
  );
}
```

### **Settings Panel**
```tsx
function Settings() {
  const { setLocale, setCurrency, availableLocales } = useLocalization();

  return (
    <div className="settings-panel">
      <LocalizationPanel variant="modal" />
    </div>
  );
}
```

## 🧪 Testing

### **Demo Page**
Visit `/localization-demo` to test all features:
- Language switching
- Currency selection
- Formatting examples
- RTL support
- Country information

### **Test Scenarios**
1. **Language Switching**: Test all supported locales
2. **Currency Changes**: Verify price formatting
3. **RTL Layout**: Check Arabic text direction
4. **Persistence**: Verify localStorage saving
5. **Responsiveness**: Test on different screen sizes

## 🚀 Future Enhancements

### **Planned Features**
- **More Languages**: French, German, Chinese
- **Advanced Formatting**: Custom number formats
- **Time Zones**: User timezone selection
- **Regional Preferences**: Country-specific settings
- **Auto-detection**: Browser language detection

### **Advanced Features**
- **Pluralization**: Language-specific plural rules
- **Gender Support**: Gender-aware translations
- **Contextual Translations**: Dynamic content adaptation
- **Translation Memory**: User preference learning
- **Offline Support**: Cached translations

## 📚 API Reference

### **LocalizationContext Methods**
```typescript
// Core methods
setLocale(locale: string): void
setCurrency(currency: string): void
formatPrice(price: number, currency?: string): string
formatDate(date: Date): string
t(key: string, params?: Record<string, any>): string

// Properties
currentLocale: string
currentCurrency: string
currentCountry: LocaleConfig | null
availableLocales: LocaleConfig[]
availableCurrencies: string[]
isRTL: boolean
```

### **LocalizationPanel Props**
```typescript
interface LocalizationPanelProps {
  className?: string;
  variant?: 'header' | 'dropdown' | 'modal';
}
```

## 🤝 Contributing

### **Adding New Languages**
1. **Update Config**: Add locale to `enhancedLocales`
2. **Add Translations**: Include in `translations` object
3. **Test RTL**: Verify right-to-left support
4. **Update Tests**: Add test coverage
5. **Document**: Update this README

### **Adding New Currencies**
1. **Update Config**: Add currency to country config
2. **Add Symbols**: Include currency symbols
3. **Test Formatting**: Verify number formatting
4. **Update Exchange Rates**: Add rate support
5. **Validate**: Test with real data

## 📝 License

This localization system is part of the MidoStore platform and follows the same licensing terms.

---

**🌍 The localization system provides a seamless, user-friendly experience for users across the Gulf region and beyond!**