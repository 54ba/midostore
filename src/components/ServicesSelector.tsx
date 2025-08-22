"use client";

import React, { useState } from 'react';
import { Settings, ChevronDown, Check, Zap, Brain, Target, TrendingUp, Globe, ShoppingBag, Building, Wrench, User, Home, Sparkles, ChevronRight } from 'lucide-react';
import { useThemeStyles } from '@/hooks/useThemeStyles';
import Link from 'next/link';

export default function ServicesSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedService, setSelectedService] = useState('all');
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const styles = useThemeStyles();

    const serviceCategories = [
        {
            title: "🛍️ Products & Categories",
            services: [
                { value: 'products', label: 'All Products', icon: ShoppingBag, color: 'text-blue-500', href: '/products' },
                { value: 'electronics', label: 'Electronics', icon: Zap, color: 'text-yellow-500', href: '/products?category=electronics' },
                { value: 'clothing', label: 'Clothing', icon: ShoppingBag, color: 'text-green-500', href: '/products?category=clothing' },
                { value: 'home', label: 'Home & Garden', icon: Home, color: 'text-emerald-500', href: '/products?category=home' },
                { value: 'beauty', label: 'Beauty', icon: Sparkles, color: 'text-pink-500', href: '/products?category=beauty' },
                { value: 'sports', label: 'Sports', icon: Target, color: 'text-orange-500', href: '/products?category=sports' }
            ]
        },
        {
            title: "🤖 AI Services",
            services: [
                { value: 'ai-recommendations', label: 'AI Recommendations', icon: Brain, color: 'text-purple-500', href: '/ai-recommendations' },
                { value: 'ai-powered-scraping', label: 'AI Scraping Tools', icon: Zap, color: 'text-yellow-500', href: '/ai-powered-scraping' },
                { value: 'social-trend-analysis', label: 'Social Trend Analysis', icon: TrendingUp, color: 'text-green-500', href: '/social-trend-analysis' },
                { value: 'ai-orchestrator', label: 'AI Orchestrator', icon: Target, color: 'text-red-500', href: '/ai-orchestrator' },
                { value: 'ai-agents', label: 'AI Agents', icon: Globe, color: 'text-indigo-500', href: '/ai-agents' },
                { value: 'ai-integration-test', label: 'AI Integration Test', icon: Brain, color: 'text-purple-500', href: '/ai-integration-test' }
            ]
        },
        {
            title: "💼 Business Services",
            services: [
                { value: 'dashboard', label: 'Dashboard', icon: Target, color: 'text-blue-500', href: '/dashboard' },
                { value: 'enhanced-dashboard', label: 'Analytics', icon: TrendingUp, color: 'text-green-500', href: '/enhanced-dashboard' },
                { value: 'orders', label: 'Orders', icon: ShoppingBag, color: 'text-orange-500', href: '/orders' },
                { value: 'bulk-deals', label: 'Bulk Pricing', icon: Building, color: 'text-emerald-500', href: '/bulk-deals' },
                { value: 'advertising', label: 'Advertising', icon: Target, color: 'text-purple-500', href: '/advertising' },
                { value: 'manager', label: 'Manager', icon: User, color: 'text-indigo-500', href: '/manager' },
                { value: 'order-batching', label: 'Order Batching', icon: ShoppingBag, color: 'text-blue-500', href: '/order-batching' }
            ]
        },
        {
            title: "🛠️ Development Tools",
            services: [
                { value: 'scraping', label: 'Scraping Tools', icon: Zap, color: 'text-yellow-500', href: '/scraping' },
                { value: 'localization-demo', label: 'Localization', icon: Globe, color: 'text-green-500', href: '/localization-demo' },
            ]
        }
    ];

    const currentService = serviceCategories.flatMap(cat => cat.services).find(service => service.value === selectedService) ||
        { value: 'all', label: 'All Services', icon: Settings, color: 'text-blue-500', href: '/' };
    const IconComponent = currentService.icon || Settings;

    const handleServiceChange = (serviceValue: string, href: string) => {
        setSelectedService(serviceValue);
        setIsOpen(false);

        // Navigate to the selected service if it's not 'all'
        if (serviceValue !== 'all') {
            window.location.href = href;
        }
    };

    const toggleCategory = (categoryTitle: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryTitle)
                ? prev.filter(title => title !== categoryTitle)
                : [...prev, categoryTitle]
        );
    };

    const isCategoryExpanded = (categoryTitle: string) => {
        return expandedCategories.includes(categoryTitle);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 hover:shadow-md ${styles.border.primary} ${styles.bg.card} ${styles.text.primary}`}
                aria-label="Select service"
            >
                <IconComponent className={`w-4 h-4 ${currentService.color}`} />
                <span className="text-sm font-medium">
                    {currentService.label}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className={`absolute right-0 top-full mt-2 w-80 ${styles.bg.card} border rounded-lg shadow-lg z-20 py-2 ${styles.border.primary} max-h-96 overflow-y-auto`}>
                        {serviceCategories.map((category, categoryIndex) => {
                            const isExpanded = isCategoryExpanded(category.title);
                            return (
                                <div key={category.title}>
                                    {/* Category Header - Clickable to expand/collapse */}
                                    <button
                                        onClick={() => toggleCategory(category.title)}
                                        className={`w-full px-4 py-2 ${styles.bg.secondary} ${styles.text.accent} font-semibold text-sm border-b ${styles.border.primary} flex items-center justify-between hover:${styles.bg.primary} transition-colors duration-150`}
                                    >
                                        <span>{category.title}</span>
                                        {isExpanded ? (
                                            <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                                        )}
                                    </button>

                                    {/* Category Services - Only show when expanded */}
                                    {isExpanded && (
                                        <div className="py-1">
                                            {category.services.map((service) => {
                                                const ServiceIcon = service.icon;
                                                return (
                                                    <button
                                                        key={service.value}
                                                        onClick={() => handleServiceChange(service.value, service.href)}
                                                        className={`w-full flex items-start gap-3 px-6 py-3 text-left hover:${styles.bg.secondary} transition-colors duration-150 ${selectedService === service.value
                                                            ? `${styles.bg.secondary} ${styles.text.accent}`
                                                            : styles.text.secondary
                                                            }`}
                                                    >
                                                        <ServiceIcon className={`w-5 h-5 ${service.color} mt-0.5`} />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium text-sm">{service.label}</div>
                                                        </div>
                                                        {selectedService === service.value && (
                                                            <Check className="w-4 h-4 ml-2 flex-shrink-0" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Add separator between categories (except for the last one) */}
                                    {categoryIndex < serviceCategories.length - 1 && (
                                        <div className={`border-b ${styles.border.primary} my-2`}></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}