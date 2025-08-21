import { prisma } from './db';
import envConfig from '../env.config';

export interface AdCampaign {
    id: string;
    userId: string;
    productId: string;
    name: string;
    description: string;
    platform: 'facebook' | 'google' | 'instagram' | 'tiktok' | 'twitter' | 'linkedin' | 'youtube';
    status: 'draft' | 'pending' | 'active' | 'paused' | 'completed' | 'rejected';
    budget: number;
    currency: string;
    dailyBudget: number;
    totalSpent: number;
    startDate: Date;
    endDate: Date;
    targeting: AdTargeting;
    creatives: AdCreative[];
    performance: AdPerformance;
    createdAt: Date;
    updatedAt: Date;
}

export interface AdTargeting {
    locations: string[];
    ageGroups: string[];
    interests: string[];
    behaviors: string[];
    languages: string[];
    devices: string[];
    customAudience?: string;
    lookalikeAudience?: string;
    excludedAudiences?: string[];
}

export interface AdCreative {
    id: string;
    type: 'image' | 'video' | 'carousel' | 'story' | 'reel';
    title: string;
    description: string;
    mediaUrl: string;
    thumbnailUrl?: string;
    callToAction: string;
    buttonText: string;
    isActive: boolean;
}

export interface AdPerformance {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    ctr: number;
    cpc: number;
    cpm: number;
    roas: number;
    lastUpdated: Date;
}

export interface UserCredits {
    userId: string;
    availableCredits: number;
    usedCredits: number;
    totalCredits: number;
    creditValue: number; // USD value per credit
    lastRecharge: Date;
    nextRecharge: Date;
}

export interface AdPlatform {
    name: string;
    code: string;
    apiKey: string;
    apiSecret: string;
    accessToken?: string;
    refreshToken?: string;
    isConnected: boolean;
    lastSync: Date;
}

export class AdvertisingService {
    private supportedPlatforms = [
        { name: 'Facebook Ads', code: 'facebook', minBudget: 5, currency: 'USD' },
        { name: 'Google Ads', code: 'google', minBudget: 10, currency: 'USD' },
        { name: 'Instagram Ads', code: 'instagram', minBudget: 5, currency: 'USD' },
        { name: 'TikTok Ads', code: 'tiktok', minBudget: 20, currency: 'USD' },
        { name: 'Twitter Ads', code: 'twitter', minBudget: 5, currency: 'USD' },
        { name: 'LinkedIn Ads', code: 'linkedin', minBudget: 10, currency: 'USD' },
        { name: 'YouTube Ads', code: 'youtube', minBudget: 10, currency: 'USD' },
    ];

    // Create new ad campaign
    async createAdCampaign(
        userId: string,
        productId: string,
        campaignData: Partial<AdCampaign>
    ): Promise<AdCampaign> {
        try {
            // Check user credits
            const userCredits = await this.getUserCredits(userId);
            const requiredCredits = this.calculateRequiredCredits(campaignData.budget || 0);

            if (userCredits.availableCredits < requiredCredits) {
                throw new Error(`Insufficient credits. Required: ${requiredCredits}, Available: ${userCredits.availableCredits}`);
            }

            // Validate campaign data
            this.validateCampaignData(campaignData);

            // Create campaign
            const campaign = await prisma.adCampaign.create({
                data: {
                    userId,
                    productId,
                    name: campaignData.name || 'New Campaign',
                    description: campaignData.description || '',
                    platform: campaignData.platform || 'facebook',
                    status: 'draft',
                    budget: campaignData.budget || 0,
                    currency: campaignData.currency || 'USD',
                    dailyBudget: campaignData.dailyBudget || 0,
                    totalSpent: 0,
                    startDate: campaignData.startDate || new Date(),
                    endDate: campaignData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    targeting: campaignData.targeting || {},
                    creatives: campaignData.creatives || [],
                    performance: {
                        impressions: 0,
                        clicks: 0,
                        conversions: 0,
                        spend: 0,
                        ctr: 0,
                        cpc: 0,
                        cpm: 0,
                        roas: 0,
                        lastUpdated: new Date(),
                    },
                },
            });

            // Reserve credits
            await this.reserveCredits(userId, requiredCredits);

            return campaign;
        } catch (error) {
            console.error('Error creating ad campaign:', error);
            throw error;
        }
    }

    // Update ad campaign
    async updateAdCampaign(
        campaignId: string,
        userId: string,
        updates: Partial<AdCampaign>
    ): Promise<AdCampaign> {
        try {
            // Verify ownership
            const existingCampaign = await prisma.adCampaign.findFirst({
                where: { id: campaignId, userId },
            });

            if (!existingCampaign) {
                throw new Error('Campaign not found or access denied');
            }

            // Update campaign
            const campaign = await prisma.adCampaign.update({
                where: { id: campaignId },
                data: updates,
            });

            return campaign;
        } catch (error) {
            console.error('Error updating ad campaign:', error);
            throw error;
        }
    }

    // Launch ad campaign
    async launchCampaign(campaignId: string, userId: string): Promise<boolean> {
        try {
            const campaign = await prisma.adCampaign.findFirst({
                where: { id: campaignId, userId },
                include: { product: true },
            });

            if (!campaign) {
                throw new Error('Campaign not found');
            }

            if (campaign.status !== 'draft' && campaign.status !== 'paused') {
                throw new Error('Campaign cannot be launched from current status');
            }

            // Validate campaign requirements
            if (!campaign.creatives || campaign.creatives.length === 0) {
                throw new Error('Campaign must have at least one creative');
            }

            if (campaign.budget <= 0) {
                throw new Error('Campaign must have a positive budget');
            }

            // Launch on platform
            const platformSuccess = await this.launchOnPlatform(campaign);

            if (platformSuccess) {
                // Update campaign status
                await prisma.adCampaign.update({
                    where: { id: campaignId },
                    data: {
                        status: 'active',
                        updatedAt: new Date(),
                    },
                });

                return true;
            }

            return false;
        } catch (error) {
            console.error('Error launching campaign:', error);
            throw error;
        }
    }

    // Pause ad campaign
    async pauseCampaign(campaignId: string, userId: string): Promise<boolean> {
        try {
            const campaign = await prisma.adCampaign.findFirst({
                where: { id: campaignId, userId },
            });

            if (!campaign) {
                throw new Error('Campaign not found');
            }

            // Pause on platform
            await this.pauseOnPlatform(campaign);

            // Update campaign status
            await prisma.adCampaign.update({
                where: { id: campaignId },
                data: {
                    status: 'paused',
                    updatedAt: new Date(),
                },
            });

            return true;
        } catch (error) {
            console.error('Error pausing campaign:', error);
            throw error;
        }
    }

    // Get user campaigns
    async getUserCampaigns(userId: string, status?: string): Promise<AdCampaign[]> {
        try {
            const where: any = { userId };
            if (status) {
                where.status = status;
            }

            const campaigns = await prisma.adCampaign.findMany({
                where,
                include: {
                    product: {
                        select: {
                            title: true,
                            images: true,
                            price: true,
                            currency: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });

            return campaigns;
        } catch (error) {
            console.error('Error fetching user campaigns:', error);
            return [];
        }
    }

    // Get campaign performance
    async getCampaignPerformance(campaignId: string, userId: string): Promise<AdPerformance | null> {
        try {
            const campaign = await prisma.adCampaign.findFirst({
                where: { id: campaignId, userId },
                select: { performance: true },
            });

            return campaign?.performance || null;
        } catch (error) {
            console.error('Error fetching campaign performance:', error);
            return null;
        }
    }

    // Create ad creative
    async createAdCreative(
        campaignId: string,
        userId: string,
        creativeData: Partial<AdCreative>
    ): Promise<AdCreative> {
        try {
            // Verify campaign ownership
            const campaign = await prisma.adCampaign.findFirst({
                where: { id: campaignId, userId },
            });

            if (!campaign) {
                throw new Error('Campaign not found or access denied');
            }

            // Create creative
            const creative = await prisma.adCreative.create({
                data: {
                    campaignId,
                    type: creativeData.type || 'image',
                    title: creativeData.title || '',
                    description: creativeData.description || '',
                    mediaUrl: creativeData.mediaUrl || '',
                    thumbnailUrl: creativeData.thumbnailUrl,
                    callToAction: creativeData.callToAction || 'Learn More',
                    buttonText: creativeData.buttonText || 'Shop Now',
                    isActive: true,
                },
            });

            return creative;
        } catch (error) {
            console.error('Error creating ad creative:', error);
            throw error;
        }
    }

    // Get targeting suggestions
    async getTargetingSuggestions(
        productId: string,
        platform: string
    ): Promise<AdTargeting> {
        try {
            // Get product data
            const product = await prisma.product.findUnique({
                where: { id: productId },
                include: {
                    category: true,
                    tags: true,
                },
            });

            if (!product) {
                throw new Error('Product not found');
            }

            // Generate targeting based on product and platform
            const targeting = this.generateTargetingSuggestions(product, platform);

            return targeting;
        } catch (error) {
            console.error('Error getting targeting suggestions:', error);
            return this.getDefaultTargeting();
        }
    }

    // Manage user credits
    async getUserCredits(userId: string): Promise<UserCredits> {
        try {
            let userCredits = await prisma.userCredits.findUnique({
                where: { userId },
            });

            if (!userCredits) {
                // Create default credits for new user
                userCredits = await prisma.userCredits.create({
                    data: {
                        userId,
                        availableCredits: 100, // Free credits for new users
                        usedCredits: 0,
                        totalCredits: 100,
                        creditValue: 0.01, // $0.01 per credit
                        lastRecharge: new Date(),
                        nextRecharge: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Monthly
                    },
                });
            }

            return userCredits;
        } catch (error) {
            console.error('Error getting user credits:', error);
            throw error;
        }
    }

    // Purchase credits
    async purchaseCredits(
        userId: string,
        amount: number,
        paymentMethod: string
    ): Promise<UserCredits> {
        try {
            const userCredits = await this.getUserCredits(userId);

            // Calculate credit value
            const creditValue = userCredits.creditValue;
            const creditsToAdd = Math.floor(amount / creditValue);

            // Update credits
            const updatedCredits = await prisma.userCredits.update({
                where: { userId },
                data: {
                    availableCredits: userCredits.availableCredits + creditsToAdd,
                    totalCredits: userCredits.totalCredits + creditsToAdd,
                    lastRecharge: new Date(),
                },
            });

            // Log transaction
            await prisma.creditTransaction.create({
                data: {
                    userId,
                    type: 'purchase',
                    amount: amount,
                    credits: creditsToAdd,
                    paymentMethod,
                    status: 'completed',
                },
            });

            return updatedCredits;
        } catch (error) {
            console.error('Error purchasing credits:', error);
            throw error;
        }
    }

    // Get ad platform integrations
    async getPlatformIntegrations(userId: string): Promise<AdPlatform[]> {
        try {
            const platforms = await prisma.adPlatform.findMany({
                where: { userId },
            });

            return platforms;
        } catch (error) {
            console.error('Error fetching platform integrations:', error);
            return [];
        }
    }

    // Connect ad platform
    async connectPlatform(
        userId: string,
        platformCode: string,
        credentials: any
    ): Promise<AdPlatform> {
        try {
            // Validate platform
            const supportedPlatform = this.supportedPlatforms.find(p => p.code === platformCode);
            if (!supportedPlatform) {
                throw new Error('Unsupported platform');
            }

            // Test connection
            const connectionTest = await this.testPlatformConnection(platformCode, credentials);
            if (!connectionTest.success) {
                throw new Error(`Connection failed: ${connectionTest.error}`);
            }

            // Save platform connection
            const platform = await prisma.adPlatform.upsert({
                where: { userId_platformCode: { userId, platformCode } },
                update: {
                    apiKey: credentials.apiKey,
                    apiSecret: credentials.apiSecret,
                    accessToken: credentials.accessToken,
                    refreshToken: credentials.refreshToken,
                    isConnected: true,
                    lastSync: new Date(),
                },
                create: {
                    userId,
                    platformCode,
                    name: supportedPlatform.name,
                    apiKey: credentials.apiKey,
                    apiSecret: credentials.apiSecret,
                    accessToken: credentials.accessToken,
                    refreshToken: credentials.refreshToken,
                    isConnected: true,
                    lastSync: new Date(),
                },
            });

            return platform;
        } catch (error) {
            console.error('Error connecting platform:', error);
            throw error;
        }
    }

    // Private helper methods
    private validateCampaignData(data: Partial<AdCampaign>): void {
        if (data.budget && data.budget <= 0) {
            throw new Error('Budget must be positive');
        }

        if (data.dailyBudget && data.dailyBudget <= 0) {
            throw new Error('Daily budget must be positive');
        }

        if (data.startDate && data.endDate && data.startDate >= data.endDate) {
            throw new Error('Start date must be before end date');
        }
    }

    private calculateRequiredCredits(budget: number): number {
        // 1 credit per $1 of budget
        return Math.ceil(budget);
    }

    private async reserveCredits(userId: string, credits: number): Promise<void> {
        await prisma.userCredits.update({
            where: { userId },
            data: {
                availableCredits: { decrement: credits },
                usedCredits: { increment: credits },
            },
        });
    }

    private async launchOnPlatform(campaign: AdCampaign): Promise<boolean> {
        try {
            // This would integrate with actual ad platform APIs
            switch (campaign.platform) {
                case 'facebook':
                    return await this.launchFacebookCampaign(campaign);
                case 'google':
                    return await this.launchGoogleCampaign(campaign);
                case 'instagram':
                    return await this.launchInstagramCampaign(campaign);
                default:
                    console.log(`Launching ${campaign.platform} campaign: ${campaign.name}`);
                    return true; // Mock success
            }
        } catch (error) {
            console.error('Error launching on platform:', error);
            return false;
        }
    }

    private async pauseOnPlatform(campaign: AdCampaign): Promise<void> {
        try {
            // This would integrate with actual ad platform APIs
            console.log(`Pausing ${campaign.platform} campaign: ${campaign.name}`);
        } catch (error) {
            console.error('Error pausing on platform:', error);
        }
    }

    private generateTargetingSuggestions(product: any, platform: string): AdTargeting {
        // Generate smart targeting based on product and platform
        const targeting: AdTargeting = {
            locations: ['United States', 'Canada', 'United Kingdom', 'Australia'],
            ageGroups: ['25-34', '35-44', '45-54'],
            interests: [product.category, ...product.tags],
            behaviors: ['Online shoppers', 'Tech enthusiasts'],
            languages: ['English'],
            devices: ['Mobile', 'Desktop'],
        };

        // Platform-specific targeting
        switch (platform) {
            case 'facebook':
                targeting.interests.push('Social media users', 'Online shopping');
                break;
            case 'google':
                targeting.behaviors.push('Search users', 'Comparison shoppers');
                break;
            case 'instagram':
                targeting.ageGroups = ['18-24', '25-34', '35-44'];
                targeting.interests.push('Visual content', 'Lifestyle');
                break;
        }

        return targeting;
    }

    private getDefaultTargeting(): AdTargeting {
        return {
            locations: ['United States'],
            ageGroups: ['25-54'],
            interests: ['Online shopping'],
            behaviors: ['Online shoppers'],
            languages: ['English'],
            devices: ['Mobile', 'Desktop'],
        };
    }

    private async testPlatformConnection(platformCode: string, credentials: any): Promise<{ success: boolean; error?: string }> {
        try {
            // This would test actual platform API connections
            switch (platformCode) {
                case 'facebook':
                    return await this.testFacebookConnection(credentials);
                case 'google':
                    return await this.testGoogleConnection(credentials);
                default:
                    return { success: true }; // Mock success for other platforms
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    private async testFacebookConnection(credentials: any): Promise<{ success: boolean; error?: string }> {
        try {
            // Test Facebook Marketing API connection
            const response = await fetch(`https://graph.facebook.com/v18.0/me/adaccounts?access_token=${credentials.accessToken}`);
            if (response.ok) {
                return { success: true };
            } else {
                return { success: false, error: 'Invalid access token' };
            }
        } catch (error) {
            return { success: false, error: 'Connection failed' };
        }
    }

    private async testGoogleConnection(credentials: any): Promise<{ success: boolean; error?: string }> {
        try {
            // Test Google Ads API connection
            // This would use the Google Ads API client library
            return { success: true }; // Mock success for now
        } catch (error) {
            return { success: false, error: 'Connection failed' };
        }
    }

    private async launchFacebookCampaign(campaign: AdCampaign): Promise<boolean> {
        // Facebook Marketing API integration
        console.log('Launching Facebook campaign:', campaign.name);
        return true; // Mock success
    }

    private async launchGoogleCampaign(campaign: AdCampaign): Promise<boolean> {
        // Google Ads API integration
        console.log('Launching Google campaign:', campaign.name);
        return true; // Mock success
    }

    private async launchInstagramCampaign(campaign: AdCampaign): Promise<boolean> {
        // Instagram Ads API integration
        console.log('Launching Instagram campaign:', campaign.name);
        return true; // Mock success
    }
}

export default AdvertisingService;