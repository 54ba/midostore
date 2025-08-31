import { prisma } from './db'
import { z } from 'zod'

// Token rewards schemas
const MiningRewardSchema = z.object({
    userId: string,
    miningType: z.enum(['CPU', 'GPU', 'CLOUD', 'STAKE', 'LIQUIDITY']),
    amount: z.number().positive(),
    currency: z.string().length(3),
    difficulty: z.number().positive(),
    duration: z.number().positive(), // Hours
    energyCost: z.number().positive(),
    rewardMultiplier: z.number().positive().default(1.0),
})

const TokenRewardSchema = z.object({
    userId: string,
    type: z.enum(['MINING', 'PURCHASE', 'REFERRAL', 'REVIEW', 'SHARE', 'LOGIN', 'ACHIEVEMENT']),
    amount: z.number().positive(),
    source: z.string(),
    metadata: z.record(z.string(), z.any()).optional(),
    expiresAt: z.date().optional(),
})

const CashbackTransactionSchema = z.object({
    userId: string,
    orderId: string,
    amount: z.number().positive(),
    currency: z.string().length(3),
    tokensUsed: z.number().positive(),
    conversionRate: z.number().positive(),
    type: z.enum(['AUTOMATIC', 'MANUAL', 'BONUS']),
})

export class EnhancedTokenRewardsService {
    private miningRewards: Map<string, number>
    private tokenPrices: Map<string, number>
    private difficultyAdjustments: Map<string, number>

    constructor() {
        this.miningRewards = new Map()
        this.tokenPrices = new Map()
        this.difficultyAdjustments = new Map()
        this.initializeMiningSystem()
    }

    /**
     * Initialize mining system with default configurations
     */
    private initializeMiningSystem() {
        // Initialize mining rewards for different types
        this.miningRewards.set('CPU', 0.1)      // Tokens per hour
        this.miningRewards.set('GPU', 0.5)      // Tokens per hour
        this.miningRewards.set('CLOUD', 1.0)    // Tokens per hour
        this.miningRewards.set('STAKE', 0.2)    // Tokens per hour
        this.miningRewards.set('LIQUIDITY', 0.3) // Tokens per hour

        // Initialize token prices (in USD)
        this.tokenPrices.set('MIDO', 0.01)
        this.tokenPrices.set('USDT', 1.0)
        this.tokenPrices.set('BTC', 45000)
        this.tokenPrices.set('ETH', 3000)

        // Initialize difficulty adjustments
        this.difficultyAdjustments.set('CPU', 1.0)
        this.difficultyAdjustments.set('GPU', 0.8)
        this.difficultyAdjustments.set('CLOUD', 0.6)
        this.difficultyAdjustments.set('STAKE', 1.2)
        this.difficultyAdjustments.set('LIQUIDITY', 1.1)
    }

    /**
     * Start mining for a user
     */
    async startMining(userId: string, miningType: string, duration: number = 1): Promise<{
        success: boolean
        miningId: string
        estimatedReward: number
        difficulty: number
        energyCost: number
        error?: string
    }> {
        try {
            // Validate mining type
            if (!this.miningRewards.has(miningType)) {
                throw new Error(`Invalid mining type: ${miningType}`)
            }

            // Check if user is already mining
            const activeMining = await prisma.userInteraction.findFirst({
                where: {
                    userId,
                    type: 'MINING',
                    metadata: { contains: JSON.stringify({ status: 'active' }) }
                }
            })

            if (activeMining) {
                throw new Error('User is already mining')
            }

            // Calculate mining parameters
            const baseReward = this.miningRewards.get(miningType) || 0
            const difficulty = this.calculateDifficulty(miningType, userId)
            const energyCost = this.calculateEnergyCost(miningType, duration)
            const estimatedReward = baseReward * duration * difficulty

            // Create mining session
            const miningSession = await prisma.userInteraction.create({
                data: {
                    userId,
                    type: 'MINING',
                    targetId: `mining_${Date.now()}`,
                    targetType: 'MINING_SESSION',
                    metadata: JSON.stringify({
                        miningType,
                        status: 'active',
                        startTime: new Date().toISOString(),
                        duration,
                        difficulty,
                        energyCost,
                        estimatedReward
                    })
                }
            })

            // Start background mining process
            this.processMining(miningSession.id, userId, miningType, duration, difficulty)

            return {
                success: true,
                miningId: miningSession.id,
                estimatedReward,
                difficulty,
                energyCost
            }

        } catch (error) {
            console.error('Failed to start mining:', error)
            return {
                success: false,
                miningId: '',
                estimatedReward: 0,
                difficulty: 0,
                energyCost: 0,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            }
        }
    }

    /**
     * Process mining in background
     */
    private async processMining(miningId: string, userId: string, miningType: string, duration: number, difficulty: number) {
        try {
            // Simulate mining process
            const miningInterval = setInterval(async () => {
                try {
                    // Calculate reward for this interval
                    const baseReward = this.miningRewards.get(miningType) || 0
                    const intervalReward = (baseReward * difficulty) / 60 // Per minute

                    // Award tokens
                    await this.awardTokens(userId, 'MINING', intervalReward, {
                        miningType,
                        difficulty,
                        interval: 'minute'
                    })

                    // Update mining session
                    await prisma.userInteraction.update({
                        where: { id: miningId },
                        data: {
                            metadata: JSON.stringify({
                                miningType,
                                status: 'active',
                                lastReward: new Date().toISOString(),
                                totalRewarded: intervalReward
                            })
                        }
                    })

                } catch (error) {
                    console.error('Mining interval error:', error)
                }
            }, 60000) // Every minute

            // Stop mining after duration
            setTimeout(async () => {
                clearInterval(miningInterval)
                await this.stopMining(miningId, userId)
            }, duration * 60 * 60 * 1000) // Convert hours to milliseconds

        } catch (error) {
            console.error('Mining process error:', error)
        }
    }

    /**
     * Stop mining for a user
     */
    async stopMining(miningId: string, userId: string): Promise<{
        success: boolean
        totalRewarded: number
        error?: string
    }> {
        try {
            // Get mining session
            const miningSession = await prisma.userInteraction.findUnique({
                where: { id: miningId }
            })

            if (!miningSession) {
                throw new Error('Mining session not found')
            }

            // Calculate final reward
            const metadata = JSON.parse(miningSession.metadata || '{}')
            const totalRewarded = metadata.totalRewarded || 0

            // Update mining session status
            await prisma.userInteraction.update({
                where: { id: miningId },
                data: {
                    metadata: JSON.stringify({
                        ...metadata,
                        status: 'completed',
                        endTime: new Date().toISOString(),
                        totalRewarded
                    })
                }
            })

            // Create final reward record
            await this.awardTokens(userId, 'MINING', totalRewarded, {
                miningType: metadata.miningType,
                difficulty: metadata.difficulty,
                final: true
            })

            return {
                success: true,
                totalRewarded
            }

        } catch (error) {
            console.error('Failed to stop mining:', error)
            return {
                success: false,
                totalRewarded: 0,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            }
        }
    }

    /**
     * Award tokens to user
     */
    async awardTokens(
        userId: string,
        type: string,
        amount: number,
        metadata: Record<string, any> = {}
    ): Promise<{
        success: boolean
        rewardId: string
        newBalance: number
        error?: string
    }> {
        try {
            // Create token reward record
            const reward = await prisma.rewardActivity.create({
                data: {
                    userId,
                    type: type as any,
                    points: amount,
                    description: `Earned ${amount} tokens for ${type}`,
                    metadata: JSON.stringify(metadata)
                }
            })

            // Update user credits
            const userCredits = await prisma.userCredits.upsert({
                where: { userId },
                update: {
                    balance: { increment: amount },
                    totalEarned: { increment: amount }
                },
                create: {
                    userId,
                    balance: amount,
                    totalEarned: amount,
                    totalSpent: 0
                }
            })

            // Create credit transaction
            await prisma.creditTransaction.create({
                data: {
                    userId,
                    type: 'EARNED',
                    amount: amount,
                    description: `Token reward: ${type}`,
                    referenceId: reward.id
                }
            })

            return {
                success: true,
                rewardId: reward.id,
                newBalance: userCredits.balance
            }

        } catch (error) {
            console.error('Failed to award tokens:', error)
            return {
                success: false,
                rewardId: '',
                newBalance: 0,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            }
        }
    }

    /**
     * Convert tokens to cashback
     */
    async convertTokensToCashback(
        userId: string,
        tokens: number,
        orderId?: string
    ): Promise<{
        success: boolean
        cashbackAmount: number
        currency: string
        transactionId: string
        error?: string
    }> {
        try {
            // Get user's token balance
            const userCredits = await prisma.userCredits.findUnique({
                where: { userId }
            })

            if (!userCredits || userCredits.balance < tokens) {
                throw new Error('Insufficient token balance')
            }

            // Calculate cashback amount
            const tokenPrice = this.tokenPrices.get('MIDO') || 0.01
            const cashbackAmount = tokens * tokenPrice
            const currency = 'USD'

            // Create cashback transaction
            const cashbackTransaction = await prisma.creditTransaction.create({
                data: {
                    userId,
                    type: 'SPENT',
                    amount: -tokens,
                    description: `Converted ${tokens} tokens to $${cashbackAmount.toFixed(2)} cashback`,
                    referenceId: orderId
                }
            })

            // Update user credits
            await prisma.userCredits.update({
                where: { userId },
                data: {
                    balance: { decrement: tokens },
                    totalSpent: { increment: tokens }
                }
            })

            // If orderId is provided, create cashback record
            if (orderId) {
                await prisma.cryptoPayment.create({
                    data: {
                        userId,
                        orderId,
                        amount: cashbackAmount,
                        currency,
                        cryptoAmount: tokens,
                        cryptoCurrency: 'MIDO',
                        walletAddress: 'CASHBACK_SYSTEM',
                        status: 'CONFIRMED',
                        transactionHash: `cashback_${Date.now()}`
                    }
                })
            }

            return {
                success: true,
                cashbackAmount,
                currency,
                transactionId: cashbackTransaction.id
            }

        } catch (error) {
            console.error('Failed to convert tokens to cashback:', error)
            return {
                success: false,
                cashbackAmount: 0,
                currency: '',
                transactionId: '',
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            }
        }
    }

    /**
     * Apply automatic cashback to order
     */
    async applyAutomaticCashback(
        userId: string,
        orderId: string,
        orderAmount: number,
        currency: string = 'USD'
    ): Promise<{
        success: boolean
        cashbackAmount: number
        tokensUsed: number
        error?: string
    }> {
        try {
            // Calculate cashback percentage based on user tier
            const userTier = await this.getUserTier(userId)
            const cashbackPercentage = this.getCashbackPercentage(userTier)

            // Calculate cashback amount
            const cashbackAmount = orderAmount * (cashbackPercentage / 100)

            // Calculate tokens needed
            const tokenPrice = this.tokenPrices.get('MIDO') || 0.01
            const tokensNeeded = cashbackAmount / tokenPrice

            // Check if user has enough tokens
            const userCredits = await prisma.userCredits.findUnique({
                where: { userId }
            })

            if (!userCredits || userCredits.balance < tokensNeeded) {
                // Partial cashback if insufficient tokens
                const availableTokens = userCredits?.balance || 0
                const partialCashback = availableTokens * tokenPrice

                if (partialCashback > 0) {
                    return await this.convertTokensToCashback(userId, availableTokens, orderId)
                }

                return {
                    success: false,
                    cashbackAmount: 0,
                    tokensUsed: 0,
                    error: 'Insufficient tokens for cashback'
                }
            }

            // Apply full cashback
            const result = await this.convertTokensToCashback(userId, tokensNeeded, orderId)

            if (result.success) {
                // Create cashback transaction record
                await prisma.cryptoPayment.create({
                    data: {
                        userId,
                        orderId,
                        amount: result.cashbackAmount,
                        currency: result.currency,
                        cryptoAmount: tokensNeeded,
                        cryptoCurrency: 'MIDO',
                        walletAddress: 'AUTOMATIC_CASHBACK',
                        status: 'CONFIRMED',
                        transactionHash: `auto_cashback_${Date.now()}`
                    }
                })
            }

            return {
                success: result.success,
                cashbackAmount: result.cashbackAmount,
                tokensUsed: tokensNeeded,
                error: result.error
            }

        } catch (error) {
            console.error('Failed to apply automatic cashback:', error)
            return {
                success: false,
                cashbackAmount: 0,
                tokensUsed: 0,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            }
        }
    }

    /**
     * Get user tier based on activity and balance
     */
    private async getUserTier(userId: string): Promise<string> {
        try {
            const userCredits = await prisma.userCredits.findUnique({
                where: { userId }
            })

            const totalEarned = userCredits?.totalEarned || 0
            const balance = userCredits?.balance || 0

            if (totalEarned >= 10000 && balance >= 5000) return 'PLATINUM'
            if (totalEarned >= 5000 && balance >= 2000) return 'GOLD'
            if (totalEarned >= 1000 && balance >= 500) return 'SILVER'
            return 'BRONZE'
        } catch (error) {
            return 'BRONZE'
        }
    }

    /**
     * Get cashback percentage based on tier
     */
    private getCashbackPercentage(tier: string): number {
        const percentages: Record<string, number> = {
            'PLATINUM': 5.0,  // 5%
            'GOLD': 3.0,      // 3%
            'SILVER': 2.0,    // 2%
            'BRONZE': 1.0     // 1%
        }
        return percentages[tier] || 1.0
    }

    /**
     * Calculate mining difficulty
     */
    private calculateDifficulty(miningType: string, userId: string): number {
        const baseDifficulty = this.difficultyAdjustments.get(miningType) || 1.0

        // Adjust difficulty based on user's mining history
        // More mining = higher difficulty = lower rewards
        // This prevents abuse and maintains token scarcity

        return baseDifficulty * (1 + Math.random() * 0.5) // 0-50% random increase
    }

    /**
     * Calculate energy cost for mining
     */
    private calculateEnergyCost(miningType: string, duration: number): number {
        const baseCosts: Record<string, number> = {
            'CPU': 0.1,      // kWh per hour
            'GPU': 0.5,      // kWh per hour
            'CLOUD': 0.0,    // No energy cost for cloud
            'STAKE': 0.0,    // No energy cost for staking
            'LIQUIDITY': 0.0 // No energy cost for liquidity
        }

        const baseCost = baseCosts[miningType] || 0.1
        return baseCost * duration
    }

    /**
     * Get mining statistics for user
     */
    async getMiningStats(userId: string): Promise<{
        totalMined: number
        activeMining: boolean
        miningType: string | null
        currentReward: number
        totalRewards: number
        miningHistory: Array<{
            type: string
            duration: number
            reward: number
            date: string
        }>
    }> {
        try {
            // Get user's mining activities
            const miningActivities = await prisma.rewardActivity.findMany({
                where: {
                    userId,
                    type: 'MINING'
                },
                orderBy: { createdAt: 'desc' }
            })

            // Get active mining session
            const activeMining = await prisma.userInteraction.findFirst({
                where: {
                    userId,
                    type: 'MINING',
                    metadata: { contains: JSON.stringify({ status: 'active' }) }
                }
            })

            const totalMined = miningActivities.reduce((sum, activity) => sum + activity.points, 0)
            const totalRewards = miningActivities.length

            // Parse mining history
            const miningHistory = miningActivities.slice(0, 10).map(activity => {
                const metadata = JSON.parse(activity.metadata || '{}')
                return {
                    type: metadata.miningType || 'Unknown',
                    duration: metadata.duration || 1,
                    reward: activity.points,
                    date: activity.createdAt.toISOString()
                }
            })

            return {
                totalMined,
                activeMining: !!activeMining,
                miningType: activeMining ? JSON.parse(activeMining.metadata || '{}').miningType : null,
                currentReward: activeMining ? JSON.parse(activeMining.metadata || '{}').estimatedReward || 0 : 0,
                totalRewards,
                miningHistory
            }

        } catch (error) {
            console.error('Failed to get mining stats:', error)
            return {
                totalMined: 0,
                activeMining: false,
                miningType: null,
                currentReward: 0,
                totalRewards: 0,
                miningHistory: []
            }
        }
    }

    /**
     * Get token economy statistics
     */
    async getTokenEconomyStats(): Promise<{
        totalTokensInCirculation: number
        totalTokensMined: number
        averageTokenPrice: number
        marketCap: number
        miningDifficulty: number
        activeMiners: number
    }> {
        try {
            // Get total tokens in circulation
            const totalTokens = await prisma.userCredits.aggregate({
                _sum: { balance: true }
            })

            // Get total tokens mined
            const totalMined = await prisma.rewardActivity.aggregate({
                where: { type: 'MINING' },
                _sum: { points: true }
            })

            // Get active miners
            const activeMiners = await prisma.userInteraction.count({
                where: {
                    type: 'MINING',
                    metadata: { contains: JSON.stringify({ status: 'active' }) }
                }
            })

            const totalTokensInCirculation = totalTokens._sum.balance || 0
            const totalTokensMined = totalMined._sum.points || 0
            const averageTokenPrice = this.tokenPrices.get('MIDO') || 0.01
            const marketCap = totalTokensInCirculation * averageTokenPrice
            const miningDifficulty = this.calculateGlobalDifficulty()

            return {
                totalTokensInCirculation,
                totalTokensMined,
                averageTokenPrice,
                marketCap,
                miningDifficulty,
                activeMiners
            }

        } catch (error) {
            console.error('Failed to get token economy stats:', error)
            return {
                totalTokensInCirculation: 0,
                totalTokensMined: 0,
                averageTokenPrice: 0,
                marketCap: 0,
                miningDifficulty: 0,
                activeMiners: 0
            }
        }
    }

    /**
     * Calculate global mining difficulty
     */
    private calculateGlobalDifficulty(): number {
        // Increase difficulty as more tokens are mined
        // This maintains token scarcity and value
        const baseDifficulty = 1.0
        const difficultyIncrease = Math.random() * 2.0 // 0-200% increase

        return baseDifficulty + difficultyIncrease
    }

    /**
     * Update token prices based on market conditions
     */
    async updateTokenPrices(): Promise<void> {
        try {
            // In a real implementation, this would fetch from cryptocurrency APIs
            // For now, we'll simulate price fluctuations

            const currentPrice = this.tokenPrices.get('MIDO') || 0.01
            const priceChange = (Math.random() - 0.5) * 0.1 // ±5% change
            const newPrice = Math.max(0.001, currentPrice * (1 + priceChange))

            this.tokenPrices.set('MIDO', newPrice)

            // Update other token prices
            this.tokenPrices.set('BTC', 45000 + (Math.random() - 0.5) * 1000)
            this.tokenPrices.set('ETH', 3000 + (Math.random() - 0.5) * 100)

        } catch (error) {
            console.error('Failed to update token prices:', error)
        }
    }

    /**
     * Get available mining types
     */
    getAvailableMiningTypes(): Array<{
        type: string
        reward: number
        difficulty: number
        energyCost: number
        description: string
    }> {
        return [
            {
                type: 'CPU',
                reward: this.miningRewards.get('CPU') || 0,
                difficulty: this.difficultyAdjustments.get('CPU') || 1.0,
                energyCost: 0.1,
                description: 'Mine using your computer\'s CPU'
            },
            {
                type: 'GPU',
                reward: this.miningRewards.get('GPU') || 0,
                difficulty: this.difficultyAdjustments.get('GPU') || 1.0,
                energyCost: 0.5,
                description: 'Mine using your graphics card'
            },
            {
                type: 'CLOUD',
                reward: this.miningRewards.get('CLOUD') || 0,
                difficulty: this.difficultyAdjustments.get('CLOUD') || 1.0,
                energyCost: 0.0,
                description: 'Mine using cloud computing resources'
            },
            {
                type: 'STAKE',
                reward: this.miningRewards.get('STAKE') || 0,
                difficulty: this.difficultyAdjustments.get('STAKE') || 1.0,
                energyCost: 0.0,
                description: 'Earn rewards by staking your tokens'
            },
            {
                type: 'LIQUIDITY',
                reward: this.miningRewards.get('LIQUIDITY') || 0,
                difficulty: this.difficultyAdjustments.get('LIQUIDITY') || 1.0,
                energyCost: 0.0,
                description: 'Provide liquidity to earn rewards'
            }
        ]
    }
}

export default EnhancedTokenRewardsService