import { RestClientV5 } from 'bybit-api';

export interface CryptoPayment {
    id: string;
    orderId: string;
    currency: string;
    usdAmount: number;
    cryptoAmount: number;
    status: 'pending' | 'confirmed' | 'failed' | 'expired';
    walletAddress: string;
    txHash?: string;
    createdAt: Date;
    expiresAt: Date;
    networkInfo: NetworkInfo;
}

export interface NetworkInfo {
    name: string;
    chainId: number;
    rpcUrl: string;
    explorerUrl: string;
    confirmations: number;
}

export interface P2PTransaction {
    id: string;
    orderId: string;
    buyerId: string;
    sellerId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'escrow' | 'completed' | 'disputed';
    escrowAddress: string;
    createdAt: Date;
    completedAt?: Date;
}

export interface CryptoRate {
    currency: string;
    usdRate: number;
    timestamp: Date;
    source: string;
}

export interface WalletBalance {
    currency: string;
    balance: number;
    available: number;
    locked: number;
    timestamp: Date;
}

export default class CryptoPaymentService {
    private bybitApi: RestClientV5;
    private supportedCryptos: Map<string, NetworkInfo>;
    private paymentStore: Map<string, CryptoPayment>;
    private p2pStore: Map<string, P2PTransaction>;

    constructor() {
        // Initialize Bybit API with environment variables
        const apiKey = process.env.BYBIT_API_KEY;
        const secretKey = process.env.BYBIT_SECRET_KEY;
        const testnet = process.env.BYBIT_TESTNET === 'true';

        if (!apiKey || !secretKey) {
            console.warn('Bybit API credentials not found. Running in demo mode.');
        }

        this.bybitApi = new RestClientV5({
            key: apiKey || 'run',
            secret: secretKey || 'demo',
            testnet: testnet || false,
        });

        this.supportedCryptos = new Map();
        this.paymentStore = new Map();
        this.p2pStore = new Map();

        this.initializeSupportedCryptos();
    }

    private initializeSupportedCryptos() {
        // Initialize supported cryptocurrencies with network information
        const cryptos = [
            {
                symbol: 'BTC',
                name: 'Bitcoin',
                chainId: 1,
                rpcUrl: 'https://bitcoin.getblock.io/mainnet/',
                explorerUrl: 'https://blockstream.info/',
                confirmations: 6,
            },
            {
                symbol: 'ETH',
                name: 'Ethereum',
                chainId: 1,
                rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/',
                explorerUrl: 'https://etherscan.io/',
                confirmations: 12,
            },
            {
                symbol: 'USDT',
                name: 'Tether',
                chainId: 1,
                rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/',
                explorerUrl: 'https://etherscan.io/',
                confirmations: 12,
            },
            {
                symbol: 'BNB',
                name: 'BNB',
                chainId: 56,
                rpcUrl: 'https://bsc-dataseed.binance.org/',
                explorerUrl: 'https://bscscan.com/',
                confirmations: 15,
            },
            {
                symbol: 'SOL',
                name: 'Solana',
                chainId: 101,
                rpcUrl: 'https://api.mainnet-beta.solana.com',
                explorerUrl: 'https://explorer.solana.com/',
                confirmations: 32,
            },
        ];

        cryptos.forEach(crypto => {
            this.supportedCryptos.set(crypto.symbol, crypto);
        });
    }

    getSupportedCryptos(): string[] {
        return Array.from(this.supportedCryptos.keys());
    }

    getNetworkInfo(currency: string): NetworkInfo | null {
        return this.supportedCryptos.get(currency) || null;
    }

    async createCryptoPayment(
        orderId: string,
        currency: string,
        usdAmount: number
    ): Promise<CryptoPayment> {
        const networkInfo = this.getNetworkInfo(currency);
        if (!networkInfo) {
            throw new Error(`Unsupported cryptocurrency: ${currency}`);
        }

        // Get current crypto rate
        const rate = await this.getCryptoRate(currency);
        const cryptoAmount = usdAmount / rate.usdRate;

        // Generate a unique payment ID
        const paymentId = `crypto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Generate a demo wallet address (in production, this would be a real wallet)
        const walletAddress = this.generateDemoWalletAddress(currency);

        // Create payment record
        const payment: CryptoPayment = {
            id: paymentId,
            orderId,
            currency,
            usdAmount,
            cryptoAmount,
            status: 'pending',
            walletAddress,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
            networkInfo,
        };

        // Store payment
        this.paymentStore.set(paymentId, payment);

        // In production, you would integrate with Bybit's payment API here
        if (process.env.BYBIT_API_KEY && process.env.BYBIT_SECRET_KEY) {
            try {
                // Create Bybit payment order
                await this.createBybitPaymentOrder(payment);
            } catch (error) {
                console.error('Failed to create Bybit payment order:', error);
                // Continue with local payment record
            }
        }

        return payment;
    }

    async checkPaymentStatus(paymentId: string): Promise<CryptoPayment | null> {
        const payment = this.paymentStore.get(paymentId);
        if (!payment) {
            return null;
        }

        // In production, check actual blockchain for confirmations
        if (payment.txHash) {
            // Simulate checking blockchain confirmations
            const confirmations = await this.checkBlockchainConfirmations(
                payment.currency,
                payment.txHash
            );

            if (confirmations >= payment.networkInfo.confirmations) {
                payment.status = 'confirmed';
                this.paymentStore.set(paymentId, payment);
            }
        }

        return payment;
    }

    async updatePaymentTransaction(paymentId: string, txHash: string): Promise<boolean> {
        const payment = this.paymentStore.get(paymentId);
        if (!payment) {
            return false;
        }

        payment.txHash = txHash;
        payment.status = 'pending'; // Reset to pending for confirmation check
        this.paymentStore.set(paymentId, payment);

        return true;
    }

    async getCryptoRate(currency: string): Promise<CryptoRate> {
        try {
            if (process.env.BYBIT_API_KEY && process.env.BYBIT_SECRET_KEY) {
                // Get real-time rate from Bybit
                const ticker = await this.bybitApi.getTickers({ category: 'linear', symbol: `${currency}USDT` });
                return {
                    currency,
                    usdRate: parseFloat(ticker.result.list[0]?.lastPrice || '0'),
                    timestamp: new Date(),
                    source: 'Bybit',
                };
            }
        } catch (error) {
            console.error('Failed to fetch rate from Bybit:', error);
        }

        // Fallback to demo rates
        const demoRates: Record<string, number> = {
            BTC: 45000,
            ETH: 2800,
            USDT: 1,
            BNB: 320,
            SOL: 95,
        };

        return {
            currency,
            usdRate: demoRates[currency] || 1,
            timestamp: new Date(),
            source: 'Demo',
        };
    }

    async getWalletBalance(currency: string): Promise<WalletBalance> {
        try {
            if (process.env.BYBIT_API_KEY && process.env.BYBIT_SECRET_KEY) {
                        // Get real wallet balance from Bybit
        const balance = await this.bybitApi.getWalletBalance({ accountType: 'UNIFIED', coin: currency });
        const account = balance.result.list[0];

                return {
                    currency,
                    balance: parseFloat(account?.walletBalance || '0'),
                    available: parseFloat(account?.availableToWithdraw || '0'),
                    locked: parseFloat(account?.locked || '0'),
                    timestamp: new Date(),
                };
            }
        } catch (error) {
            console.error('Failed to fetch wallet balance from Bybit:', error);
        }

        // Fallback to demo balance
        return {
            currency,
            balance: 1000,
            available: 950,
            locked: 50,
            timestamp: new Date(),
        };
    }

    // P2P Transaction Methods
    async createP2PTransaction(
        orderId: string,
        buyerId: string,
        sellerId: string,
        amount: number,
        currency: string
    ): Promise<P2PTransaction> {
        const transactionId = `p2p_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const escrowAddress = this.generateDemoWalletAddress('ESCROW');

        const transaction: P2PTransaction = {
            id: transactionId,
            orderId,
            buyerId,
            sellerId,
            amount,
            currency,
            status: 'pending',
            escrowAddress,
            createdAt: new Date(),
        };

        this.p2pStore.set(transactionId, transaction);
        return transaction;
    }

    async updateP2PStatus(transactionId: string, status: P2PTransaction['status']): Promise<boolean> {
        const transaction = this.p2pStore.get(transactionId);
        if (!transaction) {
            return false;
        }

        transaction.status = status;
        if (status === 'completed') {
            transaction.completedAt = new Date();
        }

        this.p2pStore.set(transactionId, transaction);
        return true;
    }

    async getP2PTransaction(transactionId: string): Promise<P2PTransaction | null> {
        return this.p2pStore.get(transactionId) || null;
    }

    // Demo/Utility Methods
    private generateDemoWalletAddress(currency: string): string {
        const prefixes: Record<string, string> = {
            BTC: 'bc1',
            ETH: '0x',
            USDT: '0x',
            BNB: '0x',
            SOL: '',
            ESCROW: '0x',
        };

        const prefix = prefixes[currency] || '';
        const randomHex = Math.random().toString(16).substr(2, 40);
        return prefix + randomHex;
    }

    private async checkBlockchainConfirmations(currency: string, txHash: string): Promise<number> {
        // In production, this would check actual blockchain
        // For demo purposes, return a random number
        return Math.floor(Math.random() * 10);
    }

    private async createBybitPaymentOrder(payment: CryptoPayment): Promise<void> {
        try {
            // This would integrate with Bybit's payment API
            // For now, just log the attempt
            console.log('Creating Bybit payment order:', payment.id);
        } catch (error) {
            console.error('Bybit payment order creation failed:', error);
            throw error;
        }
    }

    // Scraping method for crypto products
    async scrapeCryptoProducts(
        source: string,
        category: string = 'crypto',
        pageCount: number = 1
    ): Promise<any[]> {
        // Demo implementation - in production this would scrape actual crypto products
        const demoProducts = [
            {
                id: 'crypto_1',
                name: 'Bitcoin Mining Rig',
                price: 2500,
                currency: 'USD',
                category: 'mining',
                source: source,
            },
            {
                id: 'crypto_2',
                name: 'Ethereum Staking Node',
                price: 1800,
                currency: 'USD',
                category: 'staking',
                source: source,
            },
            {
                id: 'crypto_3',
                name: 'Crypto Hardware Wallet',
                price: 150,
                currency: 'USD',
                category: 'security',
                source: source,
            },
        ];

        return demoProducts.slice(0, pageCount * 3);
    }
}