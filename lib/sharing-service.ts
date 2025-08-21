import { prisma } from './db';
import envConfig from '../env.config';

export interface ShareableProduct {
    product_id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    images: string[];
    category: string;
    tags: string[];
    rating?: number;
    reviewCount: number;
}

export interface SocialMediaPost {
    platform: 'facebook' | 'instagram' | 'twitter' | 'tiktok' | 'pinterest' | 'linkedin';
    content: string;
    images: string[];
    hashtags: string[];
    link: string;
    scheduledAt?: Date;
}

export interface EmbedWidget {
    type: 'product-card' | 'product-grid' | 'product-carousel' | 'price-comparison';
    theme: 'light' | 'dark' | 'minimal' | 'modern';
    size: 'small' | 'medium' | 'large' | 'custom';
    customCSS?: string;
    showPrice: boolean;
    showRating: boolean;
    showReviews: boolean;
    showBuyButton: boolean;
    buttonText: string;
    buttonColor: string;
    borderRadius: number;
}

export interface ShareAnalytics {
    shareId: string;
    productId: string;
    platform: string;
    clicks: number;
    conversions: number;
    revenue: number;
    engagement: {
        likes: number;
        shares: number;
        comments: number;
        saves: number;
    };
    demographics: {
        ageGroups: Record<string, number>;
        locations: Record<string, number>;
        devices: Record<string, number>;
    };
}

export class SharingService {
    private prisma = prisma;

    // Generate shareable product link
    async createShareableLink(
        productId: string,
        userId: string,
        platform?: string,
        customParams?: Record<string, string>
    ): Promise<string> {
        try {
            // Create share record
            const share = await this.prisma.productShare.create({
                data: {
                    productId,
                    userId,
                    platform: platform || 'direct',
                    shareUrl: '',
                    metadata: customParams || {},
                    createdAt: new Date(),
                },
            });

            // Generate shareable URL with tracking
            const baseUrl = envConfig.NEXT_PUBLIC_NETLIFY_SITE_URL || 'http://localhost:3000';
            const shareUrl = `${baseUrl}/share/product/${productId}?ref=${share.id}&utm_source=${platform || 'direct'}&utm_medium=social&utm_campaign=product_share`;

            // Update share record with URL
            await this.prisma.productShare.update({
                where: { id: share.id },
                data: { shareUrl },
            });

            return shareUrl;
        } catch (error) {
            console.error('Error creating shareable link:', error);
            throw error;
        }
    }

    // Generate social media posts
    async generateSocialMediaPost(
        product: ShareableProduct,
        platform: SocialMediaPost['platform'],
        tone: 'professional' | 'casual' | 'exciting' | 'informative' = 'professional'
    ): Promise<SocialMediaPost> {
        const shareUrl = await this.createShareableLink(product.product_id, 'system', platform);

        // Generate platform-specific content
        const content = this.generatePostContent(product, platform, tone);
        const hashtags = this.generateHashtags(product, platform);

        return {
            platform,
            content,
            images: product.images.slice(0, platform === 'twitter' ? 4 : 10),
            hashtags,
            link: shareUrl,
        };
    }

    // Generate embed code for websites
    generateEmbedCode(
        productId: string,
        options: Partial<EmbedWidget> = {}
    ): string {
        const defaultOptions: EmbedWidget = {
            type: 'product-card',
            theme: 'light',
            size: 'medium',
            showPrice: true,
            showRating: true,
            showReviews: true,
            showBuyButton: true,
            buttonText: 'Buy Now',
            buttonColor: '#3B82F6',
            borderRadius: 8,
            ...options,
        };

        const baseUrl = envConfig.NEXT_PUBLIC_NETLIFY_SITE_URL || 'http://localhost:3000';
        const embedUrl = `${baseUrl}/embed/product/${productId}`;

        const embedParams = new URLSearchParams({
            theme: defaultOptions.theme,
            size: defaultOptions.size,
            type: defaultOptions.type,
            showPrice: defaultOptions.showPrice.toString(),
            showRating: defaultOptions.showRating.toString(),
            showReviews: defaultOptions.showReviews.toString(),
            showBuyButton: defaultOptions.showBuyButton.toString(),
            buttonText: defaultOptions.buttonText,
            buttonColor: encodeURIComponent(defaultOptions.buttonColor),
            borderRadius: defaultOptions.borderRadius.toString(),
        });

        return `<iframe
      src="${embedUrl}?${embedParams.toString()}"
      width="${this.getSizeWidth(defaultOptions.size)}"
      height="${this.getSizeHeight(defaultOptions.size)}"
      frameborder="0"
      scrolling="no"
      style="border-radius: ${defaultOptions.borderRadius}px; ${defaultOptions.customCSS || ''}"
      title="Product Embed - ${productId}">
    </iframe>`;
    }

    // Track sharing analytics
    async trackShareClick(shareId: string, metadata: Record<string, any> = {}): Promise<void> {
        try {
            await this.prisma.shareAnalytics.upsert({
                where: { shareId },
                update: {
                    clicks: { increment: 1 },
                    lastClickAt: new Date(),
                    metadata: {
                        ...metadata,
                    },
                },
                create: {
                    shareId,
                    clicks: 1,
                    conversions: 0,
                    revenue: 0,
                    engagement: {},
                    demographics: {},
                    metadata,
                    lastClickAt: new Date(),
                },
            });
        } catch (error) {
            console.error('Error tracking share click:', error);
        }
    }

    // Track conversion from share
    async trackShareConversion(
        shareId: string,
        revenue: number = 0,
        metadata: Record<string, any> = {}
    ): Promise<void> {
        try {
            await this.prisma.shareAnalytics.upsert({
                where: { shareId },
                update: {
                    conversions: { increment: 1 },
                    revenue: { increment: revenue },
                    lastConversionAt: new Date(),
                    metadata: {
                        ...metadata,
                    },
                },
                create: {
                    shareId,
                    clicks: 0,
                    conversions: 1,
                    revenue,
                    engagement: {},
                    demographics: {},
                    metadata,
                    lastConversionAt: new Date(),
                },
            });
        } catch (error) {
            console.error('Error tracking share conversion:', error);
        }
    }

    // Get sharing analytics
    async getShareAnalytics(
        productId?: string,
        platform?: string,
        dateRange?: { from: Date; to: Date }
    ): Promise<ShareAnalytics[]> {
        try {
            const where: any = {};

            if (productId) {
                where.share = { productId };
            }

            if (platform) {
                where.share = { ...where.share, platform };
            }

            if (dateRange) {
                where.createdAt = {
                    gte: dateRange.from,
                    lte: dateRange.to,
                };
            }

            const analytics = await this.prisma.shareAnalytics.findMany({
                where,
                include: {
                    share: {
                        include: {
                            product: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });

            return analytics.map(this.transformAnalytics);
        } catch (error) {
            console.error('Error fetching share analytics:', error);
            return [];
        }
    }

    // AI-powered content generation
    async generateAIContent(
        product: ShareableProduct,
        platform: string,
        audience: 'general' | 'tech-savvy' | 'budget-conscious' | 'luxury' = 'general'
    ): Promise<string> {
        try {
            // This would integrate with your AI service
            const aiServiceUrl = `http://localhost:${envConfig.API_PORT}/generate-content`;

            const response = await fetch(aiServiceUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product,
                    platform,
                    audience,
                    action: 'generate_social_content',
                }),
            });

            if (response.ok) {
                const data = await response.json();
                return data.content || this.generatePostContent(product, platform as any, 'professional');
            }
        } catch (error) {
            console.error('AI content generation failed, using fallback:', error);
        }

        // Fallback to template-based content
        return this.generatePostContent(product, platform as any, 'professional');
    }

    // Generate trending insights
    async getTrendingInsights(userId: string): Promise<any> {
        try {
            const analytics = await this.getShareAnalytics();

            // Calculate trends
            const platformPerformance = this.calculatePlatformPerformance(analytics);
            const topPerformingProducts = this.getTopPerformingProducts(analytics);
            const bestPostingTimes = this.getBestPostingTimes(analytics);
            const audienceInsights = this.getAudienceInsights(analytics);

            return {
                platformPerformance,
                topPerformingProducts,
                bestPostingTimes,
                audienceInsights,
                recommendations: this.generateRecommendations(analytics),
            };
        } catch (error) {
            console.error('Error generating trending insights:', error);
            return {};
        }
    }

    // Private helper methods
    private generatePostContent(
        product: ShareableProduct,
        platform: SocialMediaPost['platform'],
        tone: string
    ): string {
        const templates = {
            facebook: {
                professional: `🌟 Check out this amazing ${product.title}!\n\n${product.description}\n\n💰 Only $${product.price} ${product.currency}\n⭐ ${product.rating}/5 stars (${product.reviewCount} reviews)\n\n#ecommerce #deals #shopping`,
                casual: `Hey friends! 👋 Found this cool ${product.title} and had to share!\n\n${product.description}\n\nSuper affordable at just $${product.price}! 🎉`,
                exciting: `🚀 AMAZING DEAL ALERT! 🚀\n\n${product.title} is here and it's INCREDIBLE!\n\n${product.description}\n\n💥 Get it now for only $${product.price}!\n⭐ ${product.reviewCount} happy customers can't be wrong!`,
            },
            instagram: {
                professional: `✨ ${product.title} ✨\n\n${product.description}\n\n💰 $${product.price} ${product.currency}\n⭐ ${product.rating}/5\n\n#product #ecommerce #shopping #deals`,
                casual: `Love this ${product.title}! 😍\n\n${product.description.substring(0, 100)}...\n\nOnly $${product.price}! 💕`,
                exciting: `OMG! 😱 This ${product.title} is EVERYTHING!\n\n${product.description.substring(0, 80)}...\n\n🔥 Get yours now! 🔥`,
            },
            twitter: {
                professional: `🌟 ${product.title}\n\n${product.description.substring(0, 100)}...\n\n💰 $${product.price} | ⭐ ${product.rating}/5\n\n#deals #ecommerce`,
                casual: `Found this cool ${product.title}! 😊\n\nOnly $${product.price} and totally worth it!\n\n#shopping #deals`,
                exciting: `🚀 DEAL ALERT! 🚀\n\n${product.title} for just $${product.price}!\n\nDon't miss out! 🔥`,
            },
        };

        return templates[platform]?.[tone] || templates.facebook.professional;
    }

    private generateHashtags(product: ShareableProduct, platform: string): string[] {
        const baseHashtags = [
            '#ecommerce',
            '#shopping',
            '#deals',
            '#products',
            `#${product.category.toLowerCase()}`,
            ...product.tags.map(tag => `#${tag.toLowerCase().replace(/\s+/g, '')}`),
        ];

        const platformSpecific = {
            instagram: ['#instagood', '#photooftheday', '#sale', '#musthave'],
            twitter: ['#deal', '#sale', '#buy', '#offer'],
            facebook: ['#marketplace', '#forsale', '#deal'],
            tiktok: ['#viral', '#fyp', '#trending', '#musthave'],
            pinterest: ['#inspiration', '#style', '#home', '#design'],
            linkedin: ['#business', '#professional', '#innovation'],
        };

        return [...baseHashtags, ...(platformSpecific[platform] || [])].slice(0, 15);
    }

    private getSizeWidth(size: string): string {
        const sizes = { small: '250', medium: '350', large: '500', custom: '100%' };
        return sizes[size] || sizes.medium;
    }

    private getSizeHeight(size: string): string {
        const sizes = { small: '300', medium: '400', large: '600', custom: '400' };
        return sizes[size] || sizes.medium;
    }

    private transformAnalytics(analytics: any): ShareAnalytics {
        return {
            shareId: analytics.shareId,
            productId: analytics.share.productId,
            platform: analytics.share.platform,
            clicks: analytics.clicks,
            conversions: analytics.conversions,
            revenue: analytics.revenue,
            engagement: analytics.engagement || {},
            demographics: analytics.demographics || {},
        };
    }

    private calculatePlatformPerformance(analytics: ShareAnalytics[]): Record<string, any> {
        const platforms = analytics.reduce((acc, item) => {
            if (!acc[item.platform]) {
                acc[item.platform] = { clicks: 0, conversions: 0, revenue: 0 };
            }
            acc[item.platform].clicks += item.clicks;
            acc[item.platform].conversions += item.conversions;
            acc[item.platform].revenue += item.revenue;
            return acc;
        }, {} as Record<string, any>);

        // Calculate conversion rates
        Object.keys(platforms).forEach(platform => {
            const data = platforms[platform];
            data.conversionRate = data.clicks > 0 ? (data.conversions / data.clicks) * 100 : 0;
            data.averageOrderValue = data.conversions > 0 ? data.revenue / data.conversions : 0;
        });

        return platforms;
    }

    private getTopPerformingProducts(analytics: ShareAnalytics[]): any[] {
        const products = analytics.reduce((acc, item) => {
            if (!acc[item.productId]) {
                acc[item.productId] = { clicks: 0, conversions: 0, revenue: 0 };
            }
            acc[item.productId].clicks += item.clicks;
            acc[item.productId].conversions += item.conversions;
            acc[item.productId].revenue += item.revenue;
            return acc;
        }, {} as Record<string, any>);

        return Object.entries(products)
            .map(([productId, data]) => ({ productId, ...data }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);
    }

    private getBestPostingTimes(analytics: ShareAnalytics[]): any {
        // This would analyze when posts perform best
        return {
            bestDays: ['Monday', 'Wednesday', 'Friday'],
            bestHours: ['9:00 AM', '1:00 PM', '7:00 PM'],
            timezone: 'UTC',
        };
    }

    private getAudienceInsights(analytics: ShareAnalytics[]): any {
        const demographics = analytics.reduce((acc, item) => {
            Object.entries(item.demographics).forEach(([key, value]) => {
                if (!acc[key]) acc[key] = {};
                Object.entries(value).forEach(([subKey, subValue]) => {
                    acc[key][subKey] = (acc[key][subKey] || 0) + subValue;
                });
            });
            return acc;
        }, {} as Record<string, any>);

        return demographics;
    }

    private generateRecommendations(analytics: ShareAnalytics[]): string[] {
        const recommendations = [];

        const platformPerf = this.calculatePlatformPerformance(analytics);
        const topPlatform = Object.entries(platformPerf)
            .sort(([, a], [, b]) => b.conversionRate - a.conversionRate)[0];

        if (topPlatform) {
            recommendations.push(`Focus more on ${topPlatform[0]} - it has the highest conversion rate at ${topPlatform[1].conversionRate.toFixed(1)}%`);
        }

        recommendations.push('Post during peak hours (9 AM, 1 PM, 7 PM) for better engagement');
        recommendations.push('Use high-quality product images to increase click-through rates');
        recommendations.push('Include customer reviews in your social media posts');

        return recommendations;
    }
}

export default SharingService;