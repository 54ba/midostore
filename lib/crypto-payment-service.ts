// @ts-nocheck
import { prisma } from './db';
import envConfig from '../env.config';

export interface CryptoWallet {
  address: string;
  currency: string;
  network: string;
  balance?: number;
}

export interface CryptoPayment {
  id: string;
  orderId: string;
  currency: string;
  amount: number;
  usdAmount: number;
  walletAddress: string;
  txHash?: string;
  status: 'pending' | 'confirmed' | 'failed' | 'expired';
  confirmations: number;
  requiredConfirmations: number;
  expiresAt: Date;
  createdAt: Date;
}

export interface CryptoProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  originalPrice?: number;
  originalCurrency?: string;
  cryptoAccepted: string[];
  volatilityWarning: boolean;
  source: string;
  category: string;
  images: string[];
}

export class CryptoPaymentService {
  private supportedNetworks = {
    BTC: { name: 'Bitcoin', confirmations: 6, blockTime: 600 },
    ETH: { name: 'Ethereum', confirmations: 12, blockTime: 15 },
    USDT: { name: 'Tether (ERC-20)', confirmations: 12, blockTime: 15 },
    BNB: { name: 'Binance Smart Chain', confirmations: 15, blockTime: 3 },
    ADA: { name: 'Cardano', confirmations: 15, blockTime: 20 },
    DOT: { name: 'Polkadot', confirmations: 10, blockTime: 6 },
    MATIC: { name: 'Polygon', confirmations: 20, blockTime: 2 },
    SOL: { name: 'Solana', confirmations: 32, blockTime: 0.4 },
  };

  private walletAddresses: Record<string, CryptoWallet> = {
    BTC: {
      address: process.env.BTC_WALLET_ADDRESS || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      currency: 'BTC',
      network: 'bitcoin',
    },
    ETH: {
      address: process.env.ETH_WALLET_ADDRESS || '0x742d35Cc6634C0532925a3b8D4C25dE6C41E8b8C',
      currency: 'ETH',
      network: 'ethereum',
    },
    USDT: {
      address: process.env.USDT_WALLET_ADDRESS || '0x742d35Cc6634C0532925a3b8D4C25dE6C41E8b8C',
      currency: 'USDT',
      network: 'ethereum',
    },
    BNB: {
      address: process.env.BNB_WALLET_ADDRESS || '0x742d35Cc6634C0532925a3b8D4C25dE6C41E8b8C',
      currency: 'BNB',
      network: 'bsc',
    },
  };

  // Create crypto payment
  async createCryptoPayment(
    orderId: string,
    currency: string,
    usdAmount: number
  ): Promise<CryptoPayment> {
    try {
      // Get current crypto rate
      const rate = await this.getCryptoRate(currency);
      const cryptoAmount = usdAmount / rate;

      // Get wallet address
      const wallet = this.walletAddresses[currency];
      if (!wallet) {
        throw new Error(`Unsupported cryptocurrency: ${currency}`);
      }

      // Create payment record
      const payment = await prisma.cryptoPayment.create({
        data: {
          orderId,
          currency,
          amount: cryptoAmount,
          usdAmount,
          walletAddress: wallet.address,
          status: 'pending',
          confirmations: 0,
          requiredConfirmations: this.supportedNetworks[currency].confirmations,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        },
      });

      return {
        id: payment.id,
        orderId: payment.orderId,
        currency: payment.currency,
        amount: payment.amount,
        usdAmount: payment.usdAmount,
        walletAddress: payment.walletAddress,
        status: payment.status as any,
        confirmations: payment.confirmations,
        requiredConfirmations: payment.requiredConfirmations,
        expiresAt: payment.expiresAt,
        createdAt: payment.createdAt,
      };
    } catch (error) {
      console.error('Error creating crypto payment:', error);
      throw error;
    }
  }

  // Check payment status
  async checkPaymentStatus(paymentId: string): Promise<CryptoPayment | null> {
    try {
      const payment = await prisma.cryptoPayment.findUnique({
        where: { id: paymentId },
      });

      if (!payment) return null;

      // Check if payment is expired
      if (payment.expiresAt < new Date() && payment.status === 'pending') {
        await prisma.cryptoPayment.update({
          where: { id: paymentId },
          data: { status: 'expired' },
        });
        payment.status = 'expired';
      }

      // Check blockchain for confirmation
      if (payment.status === 'pending' && payment.txHash) {
        const confirmations = await this.getTransactionConfirmations(
          payment.txHash,
          payment.currency
        );

        if (confirmations >= payment.requiredConfirmations) {
          await prisma.cryptoPayment.update({
            where: { id: paymentId },
            data: {
              status: 'confirmed',
              confirmations,
            },
          });
          payment.status = 'confirmed';
          payment.confirmations = confirmations;
        } else {
          await prisma.cryptoPayment.update({
            where: { id: paymentId },
            data: { confirmations },
          });
          payment.confirmations = confirmations;
        }
      }

      return {
        id: payment.id,
        orderId: payment.orderId,
        currency: payment.currency,
        amount: payment.amount,
        usdAmount: payment.usdAmount,
        walletAddress: payment.walletAddress,
        txHash: payment.txHash,
        status: payment.status as any,
        confirmations: payment.confirmations,
        requiredConfirmations: payment.requiredConfirmations,
        expiresAt: payment.expiresAt,
        createdAt: payment.createdAt,
      };
    } catch (error) {
      console.error('Error checking payment status:', error);
      return null;
    }
  }

  // Update payment with transaction hash
  async updatePaymentTransaction(
    paymentId: string,
    txHash: string
  ): Promise<boolean> {
    try {
      await prisma.cryptoPayment.update({
        where: { id: paymentId },
        data: { txHash },
      });
      return true;
    } catch (error) {
      console.error('Error updating payment transaction:', error);
      return false;
    }
  }

  // Scrape crypto products
  async scrapeCryptoProducts(
    source: string,
    category: string = 'crypto',
    pageCount: number = 1
  ): Promise<CryptoProduct[]> {
    try {
      const products: CryptoProduct[] = [];

      // Scrape from various crypto marketplaces
      if (source === 'opensea') {
        const openSeaProducts = await this.scrapeOpenSea(category, pageCount);
        products.push(...openSeaProducts);
      } else if (source === 'rarible') {
        const raribleProducts = await this.scrapeRarible(category, pageCount);
        products.push(...raribleProducts);
      } else if (source === 'crypto-store') {
        const cryptoStoreProducts = await this.scrapeCryptoStore(category, pageCount);
        products.push(...cryptoStoreProducts);
      }

      // Save products to database
      for (const product of products) {
        await this.saveCryptoProduct(product);
      }

      return products;
    } catch (error) {
      console.error('Error scraping crypto products:', error);
      return [];
    }
  }

  // Get crypto exchange rate
  async getCryptoRate(currency: string): Promise<number> {
    try {
      // Use multiple APIs for redundancy
      const apis = [
        `https://api.coingecko.com/api/v3/simple/price?ids=${currency.toLowerCase()}&vs_currencies=usd`,
        `https://api.coinbase.com/v2/exchange-rates?currency=${currency}`,
        `https://api.binance.com/api/v3/ticker/price?symbol=${currency}USDT`,
      ];

      for (const api of apis) {
        try {
          const response = await fetch(api);
          const data = await response.json();

          if (data && typeof data === 'object') {
            // Parse different API response formats
            if (data[currency.toLowerCase()]?.usd) {
              return data[currency.toLowerCase()].usd;
            } else if (data.data?.rates?.USD) {
              return parseFloat(data.data.rates.USD);
            } else if (data.price) {
              return parseFloat(data.price);
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch rate from ${api}:`, error);
          continue;
        }
      }

      // Fallback to stored rate
      const storedRate = await prisma.exchangeRate.findUnique({
        where: { currency },
      });

      return storedRate?.rate || 1;
    } catch (error) {
      console.error('Error getting crypto rate:', error);
      return 1;
    }
  }

  // Get wallet balance
  async getWalletBalance(currency: string): Promise<number> {
    try {
      const wallet = this.walletAddresses[currency];
      if (!wallet) return 0;

      // Use blockchain APIs to get balance
      if (currency === 'BTC') {
        return await this.getBitcoinBalance(wallet.address);
      } else if (['ETH', 'USDT'].includes(currency)) {
        return await this.getEthereumBalance(wallet.address, currency);
      } else if (currency === 'BNB') {
        return await this.getBNBBalance(wallet.address);
      }

      return 0;
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      return 0;
    }
  }

  // Get supported cryptocurrencies
  getSupportedCryptos(): string[] {
    return Object.keys(this.supportedNetworks);
  }

  // Get network info
  getNetworkInfo(currency: string) {
    return this.supportedNetworks[currency];
  }

  // Private helper methods
  private async getTransactionConfirmations(
    txHash: string,
    currency: string
  ): Promise<number> {
    try {
      if (currency === 'BTC') {
        return await this.getBitcoinConfirmations(txHash);
      } else if (['ETH', 'USDT'].includes(currency)) {
        return await this.getEthereumConfirmations(txHash);
      } else if (currency === 'BNB') {
        return await this.getBNBConfirmations(txHash);
      }

      return 0;
    } catch (error) {
      console.error('Error getting transaction confirmations:', error);
      return 0;
    }
  }

  private async getBitcoinBalance(address: string): Promise<number> {
    try {
      const response = await fetch(`https://blockstream.info/api/address/${address}`);
      const data = await response.json();
      return (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100000000;
    } catch (error) {
      console.error('Error getting Bitcoin balance:', error);
      return 0;
    }
  }

  private async getEthereumBalance(address: string, currency: string): Promise<number> {
    try {
      if (currency === 'ETH') {
        const response = await fetch(
          `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.ETHERSCAN_API_KEY}`
        );
        const data = await response.json();
        return parseFloat(data.result) / 1e18;
      } else if (currency === 'USDT') {
        // USDT contract address
        const contractAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
        const response = await fetch(
          `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${address}&tag=latest&apikey=${process.env.ETHERSCAN_API_KEY}`
        );
        const data = await response.json();
        return parseFloat(data.result) / 1e6; // USDT has 6 decimals
      }
      return 0;
    } catch (error) {
      console.error('Error getting Ethereum balance:', error);
      return 0;
    }
  }

  private async getBNBBalance(address: string): Promise<number> {
    try {
      const response = await fetch(
        `https://api.bscscan.com/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.BSCSCAN_API_KEY}`
      );
      const data = await response.json();
      return parseFloat(data.result) / 1e18;
    } catch (error) {
      console.error('Error getting BNB balance:', error);
      return 0;
    }
  }

  private async getBitcoinConfirmations(txHash: string): Promise<number> {
    try {
      const response = await fetch(`https://blockstream.info/api/tx/${txHash}`);
      const data = await response.json();
      if (data.status?.confirmed) {
        const currentHeight = await this.getBitcoinBlockHeight();
        return Math.max(0, currentHeight - data.status.block_height + 1);
      }
      return 0;
    } catch (error) {
      console.error('Error getting Bitcoin confirmations:', error);
      return 0;
    }
  }

  private async getEthereumConfirmations(txHash: string): Promise<number> {
    try {
      const response = await fetch(
        `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${process.env.ETHERSCAN_API_KEY}`
      );
      const data = await response.json();
      if (data.result?.blockNumber) {
        const currentBlock = await this.getEthereumBlockHeight();
        const txBlock = parseInt(data.result.blockNumber, 16);
        return Math.max(0, currentBlock - txBlock + 1);
      }
      return 0;
    } catch (error) {
      console.error('Error getting Ethereum confirmations:', error);
      return 0;
    }
  }

  private async getBNBConfirmations(txHash: string): Promise<number> {
    try {
      const response = await fetch(
        `https://api.bscscan.com/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${process.env.BSCSCAN_API_KEY}`
      );
      const data = await response.json();
      if (data.result?.blockNumber) {
        const currentBlock = await this.getBNBBlockHeight();
        const txBlock = parseInt(data.result.blockNumber, 16);
        return Math.max(0, currentBlock - txBlock + 1);
      }
      return 0;
    } catch (error) {
      console.error('Error getting BNB confirmations:', error);
      return 0;
    }
  }

  private async getBitcoinBlockHeight(): Promise<number> {
    try {
      const response = await fetch('https://blockstream.info/api/blocks/tip/height');
      return await response.json();
    } catch (error) {
      console.error('Error getting Bitcoin block height:', error);
      return 0;
    }
  }

  private async getEthereumBlockHeight(): Promise<number> {
    try {
      const response = await fetch(
        `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${process.env.ETHERSCAN_API_KEY}`
      );
      const data = await response.json();
      return parseInt(data.result, 16);
    } catch (error) {
      console.error('Error getting Ethereum block height:', error);
      return 0;
    }
  }

  private async getBNBBlockHeight(): Promise<number> {
    try {
      const response = await fetch(
        `https://api.bscscan.com/api?module=proxy&action=eth_blockNumber&apikey=${process.env.BSCSCAN_API_KEY}`
      );
      const data = await response.json();
      return parseInt(data.result, 16);
    } catch (error) {
      console.error('Error getting BNB block height:', error);
      return 0;
    }
  }

  private async scrapeOpenSea(category: string, pageCount: number): Promise<CryptoProduct[]> {
    // Mock implementation - would integrate with OpenSea API
    return [
      {
        id: 'opensea-1',
        title: 'Crypto Art Collection #1',
        description: 'Unique digital artwork',
        price: 0.5,
        currency: 'ETH',
        cryptoAccepted: ['ETH', 'USDT'],
        volatilityWarning: true,
        source: 'opensea',
        category: 'nft',
        images: ['https://example.com/nft1.jpg'],
      },
    ];
  }

  private async scrapeRarible(category: string, pageCount: number): Promise<CryptoProduct[]> {
    // Mock implementation - would integrate with Rarible API
    return [
      {
        id: 'rarible-1',
        title: 'Digital Collectible',
        description: 'Rare digital collectible',
        price: 0.3,
        currency: 'ETH',
        cryptoAccepted: ['ETH', 'USDT'],
        volatilityWarning: true,
        source: 'rarible',
        category: 'collectible',
        images: ['https://example.com/collectible1.jpg'],
      },
    ];
  }

  private async scrapeCryptoStore(category: string, pageCount: number): Promise<CryptoProduct[]> {
    // Mock implementation - would scrape crypto-accepting stores
    return [
      {
        id: 'crypto-store-1',
        title: 'Hardware Wallet',
        description: 'Secure crypto storage device',
        price: 0.002,
        currency: 'BTC',
        originalPrice: 120,
        originalCurrency: 'USD',
        cryptoAccepted: ['BTC', 'ETH', 'USDT'],
        volatilityWarning: false,
        source: 'crypto-store',
        category: 'hardware',
        images: ['https://example.com/wallet1.jpg'],
      },
    ];
  }

  private async saveCryptoProduct(product: CryptoProduct): Promise<void> {
    try {
      await prisma.product.upsert({
        where: { externalId: product.id },
        update: {
          title: product.title,
          description: product.description,
          price: product.price,
          currency: product.currency,
          originalPrice: product.originalPrice,
          images: product.images,
          category: product.category,
          tags: product.cryptoAccepted,
          source: product.source,
          acceptsCrypto: true,
          isVolatile: product.volatilityWarning,
          lastScraped: new Date(),
        },
        create: {
          externalId: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          currency: product.currency,
          originalPrice: product.originalPrice,
          images: product.images,
          category: product.category,
          tags: product.cryptoAccepted,
          source: product.source,
          acceptsCrypto: true,
          isVolatile: product.volatilityWarning,
          isActive: true,
          lastScraped: new Date(),
        },
      });
    } catch (error) {
      console.error('Error saving crypto product:', error);
    }
  }
}

export default CryptoPaymentService;