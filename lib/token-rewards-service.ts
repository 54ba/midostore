import { ethers } from 'ethers';
import { prisma } from './db';
import Web3Service from './web3-service';

export interface RewardActivity {
    id: string;
    userId: string;
    userAddress: string;
    activityType: string;
    description: string;
    tokensEarned: number;
    metadata: any;
    createdAt: Date;
    transactionHash?: string;
    status: 'pending' | 'confirmed' | 'failed';
}

export interface RewardTier {
    id: string;
    name: string;
    minTokens: number;
    maxTokens: number;
    benefits: string[];
    discount: number;
    specialAccess: string[];
}

export interface UserRewardProfile {
    userId: string;
    userAddress: string;
    totalTokensEarned: number;
    currentBalance: number;
    tier: RewardTier | null;
    nextTier: RewardTier | null;
    progressToNextTier: number;
    activities: RewardActivity[];
    lastActivity: Date;
}

export interface RewardRule {
    id: string;
    activityType: string;
    name: string;
    description: string;
    baseTokens: number;
    multiplier: number;
    maxPerDay: number;
    maxPerUser: number;
    conditions: any;
    isActive: boolean;
}

export class TokenRewardsService {
    private web3Service: Web3Service;
    private rewardRules: RewardRule[] = [];

    constructor(web3Service: Web3Service) {
        this.web3Service = web3Service;
        this.initializeRewardRules();
    }

    // Initialize default reward rules
    private initializeRewardRules(): void {
        this.rewardRules = [
            {
                id: 'daily-login',
                activityType: 'daily_login',
                name: 'Daily Login',
                description: 'Earn tokens for logging in daily',
                baseTokens: 5,
                multiplier: 1,
                maxPerDay: 1,
                maxPerUser: 365,
                conditions: { consecutiveDays: 1 },
                isActive: true,
            },
            {
                id: 'product-purchase',
                activityType: 'product_purchase',
                name: 'Product Purchase',
                description: 'Earn tokens for purchasing products',
                baseTokens: 10,
                multiplier: 1,
                maxPerDay: 10,
                maxPerUser: 1000,
                conditions: { minAmount: 10 },
                isActive: true,
            },
            {
                id: 'product-review',
                activityType: 'product_review',
                name: 'Product Review',
                description: 'Earn tokens for writing helpful reviews',
                baseTokens: 15,
                multiplier: 1,
                maxPerDay: 5,
                maxPerUser: 500,
                conditions: { minLength: 50, helpfulVotes: 3 },
                isActive: true,
            },
            {
                id: 'referral',
                activityType: 'referral',
                name: 'User Referral',
                description: 'Earn tokens for referring new users',
                baseTokens: 50,
                multiplier: 1,
                maxPerDay: 5,
                maxPerUser: 100,
                conditions: { referralSignup: true, firstPurchase: true },
                isActive: true,
            },
            {
                id: 'social-sharing',
                activityType: 'social_sharing',
                name: 'Social Media Sharing',
                description: 'Earn tokens for sharing products on social media',
                baseTokens: 8,
                multiplier: 1,
                maxPerDay: 3,
                maxPerUser: 300,
                conditions: { platform: ['facebook', 'twitter', 'instagram'] },
                isActive: true,
            },
            {
                id: 'bulk-purchase',
                activityType: 'bulk_purchase',
                name: 'Bulk Purchase',
                description: 'Earn bonus tokens for bulk purchases',
                baseTokens: 25,
                multiplier: 1.5,
                maxPerDay: 5,
                maxPerUser: 200,
                conditions: { minQuantity: 5, minAmount: 100 },
                isActive: true,
            },
            {
                id: 'early-adopter',
                activityType: 'early_adopter',
                name: 'Early Adopter',
                description: 'Earn tokens for being an early adopter of new features',
                baseTokens: 100,
                multiplier: 2,
                maxPerDay: 1,
                maxPerUser: 10,
                conditions: { featureLaunch: true, withinDays: 7 },
                isActive: true,
            },
            {
                id: 'community-contribution',
                activityType: 'community_contribution',
                name: 'Community Contribution',
                description: 'Earn tokens for contributing to the community',
                baseTokens: 20,
                multiplier: 1,
                maxPerDay: 2,
                maxPerUser: 100,
                conditions: { contributionType: ['help', 'feedback', 'bug_report'] },
                isActive: true,
            },
            {
                id: 'loyalty-streak',
                activityType: 'loyalty_streak',
                name: 'Loyalty Streak',
                description: 'Earn bonus tokens for consecutive days of activity',
                baseTokens: 10,
                multiplier: 1.2,
                maxPerDay: 1,
                maxPerUser: 365,
                conditions: { consecutiveDays: 7 },
                isActive: true,
            },
            {
                id: 'p2p-trading',
                activityType: 'p2p_trading',
                name: 'P2P Trading',
                description: 'Earn tokens for successful P2P trades',
                baseTokens: 30,
                multiplier: 1,
                maxPerDay: 10,
                maxPerUser: 500,
                conditions: { successfulTrade: true, minAmount: 25 },
                isActive: true,
            },
        ];
    }

    // Award tokens for user activity
    async awardTokens(
        userId: string,
        activityType: string,
        metadata: any = {}
    ): Promise<RewardActivity | null> {
        try {
            const userAddress = await this.web3Service.getAddress();
            if (!userAddress) {
                throw new Error('User wallet not connected');
            }

            // Find applicable reward rule
            const rule = this.rewardRules.find(r => r.activityType === activityType && r.isActive);
            if (!rule) {
                console.log(`No reward rule found for activity: ${activityType}`);
                return null;
            }

            // Check if user has reached daily/user limits
            const canEarn = await this.canUserEarnTokens(userId, rule, metadata);
            if (!canEarn) {
                console.log(`User ${userId} cannot earn tokens for ${activityType} - limits reached`);
                return null;
            }

            // Calculate tokens to award
            const tokensToAward = this.calculateTokens(rule, metadata);

            // Create reward activity record
            const rewardActivity = await prisma.rewardActivity.create({
                data: {
                    userId,
                    userAddress,
                    activityType,
                    description: rule.description,
                    tokensEarned: tokensToAward,
                    metadata,
                    status: 'pending',
                },
            });

            // Mint tokens on blockchain
            const success = await this.mintTokens(userAddress, tokensToAward);
            if (success) {
                // Update activity status
                await prisma.rewardActivity.update({
                    where: { id: rewardActivity.id },
                    data: { status: 'confirmed' },
                });

                // Update user's total tokens earned
                await this.updateUserTokens(userId, tokensToAward);

                return rewardActivity;
            } else {
                // Update activity status to failed
                await prisma.rewardActivity.update({
                    where: { id: rewardActivity.id },
                    data: { status: 'failed' },
                });

                return null;
            }
        } catch (error) {
            console.error('Error awarding tokens:', error);
            return null;
        }
    }

    // Check if user can earn tokens for specific activity
    private async canUserEarnTokens(
        userId: string,
        rule: RewardRule,
        metadata: any
    ): Promise<boolean> {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Check daily limit
            const todayActivities = await prisma.rewardActivity.count({
                where: {
                    userId,
                    activityType: rule.activityType,
                    createdAt: { gte: today },
                    status: 'confirmed',
                },
            });

            if (todayActivities >= rule.maxPerDay) {
                return false;
            }

            // Check user lifetime limit
            const totalActivities = await prisma.rewardActivity.count({
                where: {
                    userId,
                    activityType: rule.activityType,
                    status: 'confirmed',
                },
            });

            if (totalActivities >= rule.maxPerUser) {
                return false;
            }

            // Check specific conditions
            if (!this.checkActivityConditions(rule, metadata)) {
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error checking if user can earn tokens:', error);
            return false;
        }
    }

    // Check if activity meets specific conditions
    private checkActivityConditions(rule: RewardRule, metadata: any): boolean {
        try {
            const conditions = rule.conditions;

            // Check minimum amount
            if (conditions.minAmount && metadata.amount < conditions.minAmount) {
                return false;
            }

            // Check minimum quantity
            if (conditions.minQuantity && metadata.quantity < conditions.minQuantity) {
                return false;
            }

            // Check minimum length
            if (conditions.minLength && metadata.length < conditions.minLength) {
                return false;
            }

            // Check platform
            if (conditions.platform && !conditions.platform.includes(metadata.platform)) {
                return false;
            }

            // Check contribution type
            if (conditions.contributionType && !conditions.contributionType.includes(metadata.contributionType)) {
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error checking activity conditions:', error);
            return false;
        }
    }

    // Calculate tokens to award based on rule and metadata
    private calculateTokens(rule: RewardRule, metadata: any): number {
        try {
            let baseTokens = rule.baseTokens;

            // Apply multiplier
            let finalTokens = baseTokens * rule.multiplier;

            // Apply bonus multipliers based on metadata
            if (metadata.consecutiveDays) {
                const streakBonus = Math.min(metadata.consecutiveDays * 0.1, 1.0);
                finalTokens *= (1 + streakBonus);
            }

            if (metadata.amount && metadata.amount > 100) {
                const amountBonus = Math.min((metadata.amount - 100) * 0.01, 0.5);
                finalTokens *= (1 + amountBonus);
            }

            if (metadata.helpfulVotes && metadata.helpfulVotes > 5) {
                const helpfulBonus = Math.min(metadata.helpfulVotes * 0.05, 0.3);
                finalTokens *= (1 + helpfulBonus);
            }

            // Round to nearest whole token
            return Math.round(finalTokens);
        } catch (error) {
            console.error('Error calculating tokens:', error);
            return rule.baseTokens;
        }
    }

    // Mint tokens on blockchain
    private async mintTokens(userAddress: string, amount: number): Promise<boolean> {
        try {
            // In a real implementation, this would call the smart contract
            // For now, we'll simulate the minting process
            console.log(`Minting ${amount} tokens to ${userAddress}`);

            // Simulate blockchain transaction
            const transactionHash = ethers.randomBytes(32).toString('hex');

            return true;
        } catch (error) {
            console.error('Error minting tokens:', error);
            return false;
        }
    }

    // Update user's total tokens earned
    private async updateUserTokens(userId: string, amount: number): Promise<void> {
        try {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    totalTokensEarned: { increment: amount },
                    currentTokenBalance: { increment: amount },
                },
            });
        } catch (error) {
            console.error('Error updating user tokens:', error);
        }
    }

    // Get user's reward profile
    async getUserRewardProfile(userId: string): Promise<UserRewardProfile | null> {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    totalTokensEarned: true,
                    currentTokenBalance: true,
                },
            });

            if (!user) return null;

            const userAddress = await this.web3Service.getAddress();
            if (!userAddress) return null;

            // Get user's activities
            const activities = await prisma.rewardActivity.findMany({
                where: { userId, status: 'confirmed' },
                orderBy: { createdAt: 'desc' },
                take: 10,
            });

            // Get user's tier information
            const tier = this.getUserTier(user.totalTokensEarned);
            const nextTier = this.getNextTier(user.totalTokensEarned);
            const progressToNextTier = this.calculateProgressToNextTier(user.totalTokensEarned, nextTier);

            return {
                userId: user.id,
                userAddress,
                totalTokensEarned: user.totalTokensEarned,
                currentBalance: user.currentTokenBalance,
                tier,
                nextTier,
                progressToNextTier,
                activities,
                lastActivity: activities[0]?.createdAt || new Date(),
            };
        } catch (error) {
            console.error('Error getting user reward profile:', error);
            return null;
        }
    }

    // Get user's current tier
    private getUserTier(totalTokens: number): RewardTier | null {
        const tiers = this.getRewardTiers();
        return tiers.find(tier => totalTokens >= tier.minTokens && totalTokens <= tier.maxTokens) || null;
    }

    // Get next tier for user
    private getNextTier(totalTokens: number): RewardTier | null {
        const tiers = this.getRewardTiers();
        return tiers.find(tier => totalTokens < tier.minTokens) || null;
    }

    // Calculate progress to next tier
    private calculateProgressToNextTier(totalTokens: number, nextTier: RewardTier | null): number {
        if (!nextTier) return 100;

        const currentTier = this.getUserTier(totalTokens);
        if (!currentTier) return 0;

        const currentTierTokens = currentTier.maxTokens;
        const nextTierTokens = nextTier.minTokens;
        const progress = ((totalTokens - currentTierTokens) / (nextTierTokens - currentTierTokens)) * 100;

        return Math.min(Math.max(progress, 0), 100);
    }

    // Get all reward tiers
    getRewardTiers(): RewardTier[] {
        return [
            {
                id: 'bronze',
                name: 'Bronze',
                minTokens: 0,
                maxTokens: 999,
                benefits: ['Basic access to marketplace', 'Standard customer support'],
                discount: 0,
                specialAccess: [],
            },
            {
                id: 'silver',
                name: 'Silver',
                minTokens: 1000,
                maxTokens: 4999,
                benefits: ['5% discount on purchases', 'Priority customer support', 'Early access to sales'],
                discount: 5,
                specialAccess: ['Early sales access'],
            },
            {
                id: 'gold',
                name: 'Gold',
                minTokens: 5000,
                maxTokens: 19999,
                benefits: ['10% discount on purchases', 'VIP customer support', 'Exclusive product access', 'Free shipping'],
                discount: 10,
                specialAccess: ['Exclusive products', 'Free shipping'],
            },
            {
                id: 'platinum',
                name: 'Platinum',
                minTokens: 20000,
                maxTokens: 99999,
                benefits: ['15% discount on purchases', 'Personal account manager', 'Exclusive events access', 'Custom products'],
                discount: 15,
                specialAccess: ['Personal manager', 'Exclusive events', 'Custom products'],
            },
            {
                id: 'diamond',
                name: 'Diamond',
                minTokens: 100000,
                maxTokens: 999999,
                benefits: ['20% discount on purchases', '24/7 concierge service', 'Private shopping sessions', 'Investment opportunities'],
                discount: 20,
                specialAccess: ['Concierge service', 'Private shopping', 'Investment access'],
            },
        ];
    }

    // Get leaderboard of top token earners
    async getTokenLeaderboard(limit: number = 10): Promise<Array<{
        userId: string;
        userAddress: string;
        totalTokens: number;
        rank: number;
    }>> {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    totalTokensEarned: true,
                },
                where: {
                    totalTokensEarned: { gt: 0 },
                },
                orderBy: {
                    totalTokensEarned: 'desc',
                },
                take: limit,
            });

            return users.map((user, index) => ({
                userId: user.id,
                userAddress: '', // Would need to be fetched separately
                totalTokens: user.totalTokensEarned,
                rank: index + 1,
            }));
        } catch (error) {
            console.error('Error getting token leaderboard:', error);
            return [];
        }
    }

    // Get reward statistics
    async getRewardStats(): Promise<{
        totalTokensDistributed: number;
        totalUsersEarned: number;
        averageTokensPerUser: number;
        topActivityType: string;
        totalActivities: number;
    }> {
        try {
            const [totalTokens, totalUsers, totalActivities, topActivity] = await Promise.all([
                prisma.rewardActivity.aggregate({
                    where: { status: 'confirmed' },
                    _sum: { tokensEarned: true },
                }),
                prisma.rewardActivity.groupBy({
                    by: ['userId'],
                    where: { status: 'confirmed' },
                    _count: { userId: true },
                }),
                prisma.rewardActivity.count({
                    where: { status: 'confirmed' },
                }),
                prisma.rewardActivity.groupBy({
                    by: ['activityType'],
                    where: { status: 'confirmed' },
                    _count: { activityType: true },
                    orderBy: { _count: { activityType: 'desc' } },
                    take: 1,
                }),
            ]);

            const totalTokensDistributed = totalTokens._sum.tokensEarned || 0;
            const totalUsersEarned = totalUsers.length;
            const averageTokensPerUser = totalUsersEarned > 0 ? totalTokensDistributed / totalUsersEarned : 0;
            const topActivityType = topActivity[0]?.activityType || 'none';

            return {
                totalTokensDistributed,
                totalUsersEarned,
                averageTokensPerUser,
                topActivityType,
                totalActivities,
            };
        } catch (error) {
            console.error('Error getting reward stats:', error);
            return {
                totalTokensDistributed: 0,
                totalUsersEarned: 0,
                averageTokensPerUser: 0,
                topActivityType: 'none',
                totalActivities: 0,
            };
        }
    }

    // Transfer tokens between users
    async transferTokens(
        fromUserId: string,
        toUserId: string,
        amount: number
    ): Promise<boolean> {
        try {
            const fromUser = await prisma.user.findUnique({
                where: { id: fromUserId },
                select: { currentTokenBalance: true },
            });

            if (!fromUser || fromUser.currentTokenBalance < amount) {
                throw new Error('Insufficient token balance');
            }

            // Update both users' balances
            await Promise.all([
                prisma.user.update({
                    where: { id: fromUserId },
                    data: { currentTokenBalance: { decrement: amount } },
                }),
                prisma.user.update({
                    where: { id: toUserId },
                    data: { currentTokenBalance: { increment: amount } },
                }),
            ]);

            // Record the transfer
            await prisma.rewardActivity.create({
                data: {
                    userId: fromUserId,
                    userAddress: '', // Would need to be fetched
                    activityType: 'token_transfer',
                    description: `Transferred ${amount} tokens to another user`,
                    tokensEarned: -amount,
                    metadata: { transferType: 'out', toUserId },
                    status: 'confirmed',
                },
            });

            await prisma.rewardActivity.create({
                data: {
                    userId: toUserId,
                    userAddress: '', // Would need to be fetched
                    activityType: 'token_transfer',
                    description: `Received ${amount} tokens from another user`,
                    tokensEarned: amount,
                    metadata: { transferType: 'in', fromUserId },
                    status: 'confirmed',
                },
            });

            return true;
        } catch (error) {
            console.error('Error transferring tokens:', error);
            return false;
        }
    }
}

export default TokenRewardsService;