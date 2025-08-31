import { prisma } from './db'
import { z } from 'zod'

// Payment schemas
const PaymentRequestSchema = z.object({
    amount: z.number().positive(),
    currency: z.string().length(3),
    orderId: z.string(),
    userId: z.string(),
    paymentMethod: z.enum(['USDT', 'BTC', 'ETH', 'BNB', 'BYBIT_BALANCE']),
    customerEmail: z.string().email(),
    customerName: z.string(),
    description: z.string().optional(),
})

const PaymentResponseSchema = z.object({
    success: z.boolean(),
    paymentId: z.string().optional(),
    transactionHash: z.string().optional(),
    redirectUrl: z.string().optional(),
    error: z.string().optional(),
    status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled']),
})

const ExchangeRateSchema = z.object({
    fromCurrency: z.string().length(3),
    toCurrency: z.string().length(3),
    rate: z.number().positive(),
    lastUpdated: z.date(),
})

export class EnhancedBybitPaymentService {
    private apiKey: string
    private secretKey: string
    private testnet: boolean
    private baseUrl: string

    constructor() {
        this.apiKey = process.env.BYBIT_API_KEY || ''
        this.secretKey = process.env.BYBIT_SECRET_KEY || ''
        this.testnet = process.env.BYBIT_TESTNET === 'true'
        this.baseUrl = this.testnet
            ? 'https://api-testnet.bybit.com'
            : 'https://api.bybit.com'
    }

    /**
     * Process a payment in any supported currency
     */
    async processPayment(paymentData: z.infer<typeof PaymentRequestSchema>): Promise<z.infer<typeof PaymentResponseSchema>> {
        try {
            // Validate input
            const validatedData = PaymentRequestSchema.parse(paymentData)

            // Get exchange rate for the target currency
            const exchangeRate = await this.getExchangeRate(validatedData.currency, 'USDT')
            if (!exchangeRate) {
                return {
                    success: false,
                    error: `Exchange rate not available for ${validatedData.currency}`,
                    status: 'failed'
                }
            }

            // Convert amount to USDT (Bybit's base currency)
            const usdtAmount = validatedData.amount * exchangeRate.rate

            // Create payment record in database
            const payment = await prisma.cryptoPayment.create({
                data: {
                    userId: validatedData.userId,
                    orderId: validatedData.orderId,
                    amount: validatedData.amount,
                    currency: validatedData.currency,
                    cryptoAmount: usdtAmount,
                    cryptoCurrency: 'USDT',
                    walletAddress: this.getWalletAddress(validatedData.paymentMethod),
                    status: 'PENDING'
                }
            })

            // Process payment based on method
            let result: z.infer<typeof PaymentResponseSchema>

            switch (validatedData.paymentMethod) {
                case 'USDT':
                case 'BTC':
                case 'ETH':
                case 'BNB':
                    result = await this.processCryptoPayment(payment.id, validatedData, usdtAmount)
                    break
                case 'BYBIT_BALANCE':
                    result = await this.processBybitBalancePayment(payment.id, validatedData, usdtAmount)
                    break
                default:
                    throw new Error(`Unsupported payment method: ${validatedData.paymentMethod}`)
            }

            // Update payment status
            await prisma.cryptoPayment.update({
                where: { id: payment.id },
                data: {
                    status: result.status === 'completed' ? 'CONFIRMED' : 'PENDING',
                    transactionHash: result.transactionHash
                }
            })

            return result

        } catch (error) {
            console.error('Payment processing error:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                status: 'failed'
            }
        }
    }

    /**
     * Process cryptocurrency payment
     */
    private async processCryptoPayment(
        paymentId: string,
        paymentData: z.infer<typeof PaymentRequestSchema>,
        usdtAmount: number
    ): Promise<z.infer<typeof PaymentResponseSchema>> {
        try {
            // Generate payment address and QR code
            const walletAddress = this.getWalletAddress(paymentData.paymentMethod)

            // Create payment session
            const session = await this.createPaymentSession({
                paymentId,
                amount: usdtAmount,
                currency: 'USDT',
                walletAddress,
                orderId: paymentData.orderId,
                customerEmail: paymentData.customerEmail,
                customerName: paymentData.customerName,
                description: paymentData.description || `Order ${paymentData.orderId}`
            })

            return {
                success: true,
                paymentId,
                redirectUrl: session.redirectUrl,
                status: 'pending'
            }

        } catch (error) {
            console.error('Crypto payment error:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Crypto payment failed',
                status: 'failed'
            }
        }
    }

    /**
     * Process Bybit balance payment
     */
    private async processBybitBalancePayment(
        paymentId: string,
        paymentData: z.infer<typeof PaymentRequestSchema>,
        usdtAmount: number
    ): Promise<z.infer<typeof PaymentResponseSchema>> {
        try {
            // Check if user has sufficient balance
            const balance = await this.getUserBalance(paymentData.userId)
            if (balance < usdtAmount) {
                return {
                    success: false,
                    error: 'Insufficient balance',
                    status: 'failed'
                }
            }

            // Process internal transfer
            const transfer = await this.processInternalTransfer({
                fromUserId: paymentData.userId,
                toUserId: 'SYSTEM', // System account
                amount: usdtAmount,
                currency: 'USDT',
                description: `Payment for order ${paymentData.orderId}`
            })

            return {
                success: true,
                paymentId,
                transactionHash: transfer.transactionId,
                status: 'completed'
            }

        } catch (error) {
            console.error('Bybit balance payment error:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Balance payment failed',
                status: 'failed'
            }
        }
    }

    /**
     * Get exchange rate between currencies
     */
    async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<z.infer<typeof ExchangeRateSchema> | null> {
        try {
            // First try to get from database
            let rate = await prisma.exchangeRate.findUnique({
                where: {
                    fromCurrency_toCurrency: {
                        fromCurrency,
                        toCurrency
                    }
                }
            })

            // If not in database, fetch from API
            if (!rate) {
                const apiRate = await this.fetchExchangeRate(fromCurrency, toCurrency)
                if (apiRate) {
                    rate = await prisma.exchangeRate.upsert({
                        where: {
                            fromCurrency_toCurrency: {
                                fromCurrency,
                                toCurrency
                            }
                        },
                        update: {
                            rate: apiRate.rate,
                            lastUpdated: new Date()
                        },
                        create: {
                            fromCurrency,
                            toCurrency,
                            rate: apiRate.rate,
                            isStable: apiRate.isStable || false,
                            volatility: apiRate.volatility || 0,
                            lastUpdated: new Date()
                        }
                    })
                }
            }

            return rate
        } catch (error) {
            console.error('Exchange rate error:', error)
            return null
        }
    }

    /**
     * Fetch exchange rate from external API
     */
    private async fetchExchangeRate(fromCurrency: string, toCurrency: string) {
        try {
            // Try multiple exchange rate APIs
            const apis = [
                {
                    name: 'ExchangeRate-API',
                    url: `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`,
                    transform: (data: any) => ({
                        rate: data.rates[toCurrency],
                        isStable: true,
                        volatility: 0.02
                    })
                },
                {
                    name: 'Fixer',
                    url: `http://data.fixer.io/api/latest?access_key=${process.env.FIXER_API_KEY}&base=${fromCurrency}&symbols=${toCurrency}`,
                    transform: (data: any) => ({
                        rate: data.rates[toCurrency],
                        isStable: true,
                        volatility: 0.02
                    })
                },
                {
                    name: 'CurrencyAPI',
                    url: `https://api.currencyapi.com/v3/latest?apikey=${process.env.CURRENCY_API_KEY}&base_currency=${fromCurrency}&currencies=${toCurrency}`,
                    transform: (data: any) => ({
                        rate: data.data[toCurrency].value,
                        isStable: true,
                        volatility: 0.02
                    })
                }
            ]

            for (const api of apis) {
                try {
                    const response = await fetch(api.url)
                    if (response.ok) {
                        const data = await response.json()
                        return api.transform(data)
                    }
                } catch (error) {
                    console.warn(`Failed to fetch from ${api.name}:`, error)
                }
            }

            return null
        } catch (error) {
            console.error('Failed to fetch exchange rate:', error)
            return null
        }
    }

    /**
     * Create payment session
     */
    private async createPaymentSession(sessionData: {
        paymentId: string
        amount: number
        currency: string
        walletAddress: string
        orderId: string
        customerEmail: string
        customerName: string
        description: string
    }) {
        // In a real implementation, this would create a payment session with Bybit
        // For now, we'll return a mock session
        return {
            sessionId: `session_${Date.now()}`,
            redirectUrl: `/payment/confirm/${sessionData.paymentId}`,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
        }
    }

    /**
     * Get user's Bybit balance
     */
    private async getUserBalance(userId: string): Promise<number> {
        try {
            // In a real implementation, this would fetch from Bybit API
            // For now, we'll return a mock balance
            const userCredits = await prisma.userCredits.findUnique({
                where: { userId }
            })

            return userCredits?.balance || 0
        } catch (error) {
            console.error('Failed to get user balance:', error)
            return 0
        }
    }

    /**
     * Process internal transfer
     */
    private async processInternalTransfer(transferData: {
        fromUserId: string
        toUserId: string
        amount: number
        currency: string
        description: string
    }) {
        try {
            // Create credit transaction records
            const fromTransaction = await prisma.creditTransaction.create({
                data: {
                    userId: transferData.fromUserId,
                    type: 'SPENT',
                    amount: -transferData.amount,
                    description: transferData.description
                }
            })

            const toTransaction = await prisma.creditTransaction.create({
                data: {
                    userId: transferData.toUserId,
                    type: 'EARNED',
                    amount: transferData.amount,
                    description: transferData.description
                }
            })

            // Update user credits
            await prisma.userCredits.update({
                where: { userId: transferData.fromUserId },
                data: { balance: { decrement: transferData.amount } }
            })

            await prisma.userCredits.update({
                where: { userId: transferData.toUserId },
                data: { balance: { increment: transferData.amount } }
            })

            return {
                transactionId: `transfer_${Date.now()}`,
                fromTransactionId: fromTransaction.id,
                toTransactionId: toTransaction.id
            }

        } catch (error) {
            console.error('Internal transfer error:', error)
            throw error
        }
    }

    /**
     * Get wallet address for payment method
     */
    private getWalletAddress(paymentMethod: string): string {
        const addresses: Record<string, string> = {
            'USDT': process.env.USDT_WALLET_ADDRESS || '0x0000000000000000000000000000000000000000',
            'BTC': process.env.BTC_WALLET_ADDRESS || 'bc1q000000000000000000000000000000000000000000',
            'ETH': process.env.ETH_WALLET_ADDRESS || '0x0000000000000000000000000000000000000000',
            'BNB': process.env.BNB_WALLET_ADDRESS || '0x0000000000000000000000000000000000000000',
            'BYBIT_BALANCE': 'SYSTEM_BALANCE'
        }

        return addresses[paymentMethod] || addresses['USDT']
    }

    /**
     * Verify payment status
     */
    async verifyPayment(paymentId: string): Promise<z.infer<typeof PaymentResponseSchema>> {
        try {
            const payment = await prisma.cryptoPayment.findUnique({
                where: { id: paymentId }
            })

            if (!payment) {
                return {
                    success: false,
                    error: 'Payment not found',
                    status: 'failed'
                }
            }

            // Check blockchain for confirmation if it's a crypto payment
            if (payment.transactionHash && payment.status === 'PENDING') {
                const isConfirmed = await this.verifyBlockchainTransaction(
                    payment.transactionHash,
                    payment.cryptoCurrency
                )

                if (isConfirmed) {
                    await prisma.cryptoPayment.update({
                        where: { id: paymentId },
                        data: { status: 'CONFIRMED' }
                    })

                    return {
                        success: true,
                        paymentId,
                        transactionHash: payment.transactionHash,
                        status: 'completed'
                    }
                }
            }

            return {
                success: true,
                paymentId,
                transactionHash: payment.transactionHash,
                status: payment.status === 'CONFIRMED' ? 'completed' : 'pending'
            }

        } catch (error) {
            console.error('Payment verification error:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Verification failed',
                status: 'failed'
            }
        }
    }

    /**
     * Verify blockchain transaction
     */
    private async verifyBlockchainTransaction(transactionHash: string, currency: string): Promise<boolean> {
        try {
            // In a real implementation, this would check the blockchain
            // For now, we'll simulate confirmation after a delay
            const payment = await prisma.cryptoPayment.findFirst({
                where: { transactionHash }
            })

            if (payment && payment.createdAt) {
                const timeSinceCreation = Date.now() - payment.createdAt.getTime()
                // Simulate confirmation after 5 minutes
                return timeSinceCreation > 5 * 60 * 1000
            }

            return false
        } catch (error) {
            console.error('Blockchain verification error:', error)
            return false
        }
    }

    /**
     * Get supported currencies
     */
    getSupportedCurrencies(): string[] {
        return [
            'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY',
            'AED', 'SAR', 'KWD', 'BHD', 'QAR', 'OMR', // Gulf currencies
            'INR', 'BRL', 'MXN', 'SGD', 'HKD', 'KRW', 'TRY', 'ZAR'
        ]
    }

    /**
     * Get supported payment methods
     */
    getSupportedPaymentMethods(): string[] {
        return ['USDT', 'BTC', 'ETH', 'BNB', 'BYBIT_BALANCE']
    }

    /**
     * Get payment fees
     */
    getPaymentFees(currency: string, paymentMethod: string): number {
        const baseFees: Record<string, number> = {
            'USDT': 0.001, // 0.1%
            'BTC': 0.0001, // 0.01%
            'ETH': 0.001,  // 0.1%
            'BNB': 0.001,  // 0.1%
            'BYBIT_BALANCE': 0.0005 // 0.05%
        }

        return baseFees[paymentMethod] || 0.001
    }
}

export default EnhancedBybitPaymentService