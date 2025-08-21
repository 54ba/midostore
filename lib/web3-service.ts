import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';

// ABI for our custom smart contracts
const TOKEN_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) returns (bool)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function mint(address to, uint256 amount)",
    "function burn(uint256 amount)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

const REWARD_ABI = [
    "function rewardUser(address user, uint256 amount) external",
    "function getUserRewards(address user) view returns (uint256)",
    "function claimRewards(address user) external",
    "function getRewardHistory(address user) view returns (tuple(uint256 amount, uint256 timestamp)[])",
    "event RewardClaimed(address indexed user, uint256 amount, uint256 timestamp)"
];

const P2P_MARKETPLACE_ABI = [
    "function createListing(uint256 productId, uint256 price, uint256 quantity) external",
    "function buyFromListing(uint256 listingId, uint256 quantity) external payable",
    "function cancelListing(uint256 listingId) external",
    "function getListing(uint256 listingId) view returns (tuple(uint256 productId, address seller, uint256 price, uint256 quantity, bool active))",
    "function getUserListings(address user) view returns (uint256[])",
    "event ListingCreated(uint256 indexed listingId, address indexed seller, uint256 productId, uint256 price, uint256 quantity)",
    "event ListingSold(uint256 indexed listingId, address indexed buyer, uint256 quantity)",
    "event ListingCancelled(uint256 indexed listingId)"
];

export interface Web3Config {
    rpcUrl: string;
    chainId: number;
    tokenContractAddress: string;
    rewardContractAddress: string;
    p2pMarketplaceAddress: string;
    gaslessRelayerUrl?: string;
}

export interface TokenInfo {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
    balance: string;
}

export interface RewardInfo {
    totalRewards: string;
    claimableRewards: string;
    rewardHistory: Array<{
        amount: string;
        timestamp: number;
    }>;
}

export interface P2PListing {
    id: number;
    productId: number;
    seller: string;
    price: string;
    quantity: number;
    active: boolean;
}

export interface GaslessTransaction {
    to: string;
    data: string;
    value: string;
    nonce: number;
    deadline: number;
    signature: string;
}

export class Web3Service {
    private provider: Web3Provider | null = null;
    private signer: ethers.Signer | null = null;
    private config: Web3Config;
    private tokenContract: Contract | null = null;
    private rewardContract: Contract | null = null;
    private p2pMarketplaceContract: Contract | null = null;

    constructor(config: Web3Config) {
        this.config = config;
    }

    // Initialize Web3 connection
    async initialize(): Promise<boolean> {
        try {
            // Check if MetaMask is installed
            if (typeof window !== 'undefined' && window.ethereum) {
                // Request account access
                await window.ethereum.request({ method: 'eth_requestAccounts' });

                // Create provider and signer
                this.provider = new ethers.providers.Web3Provider(window.ethereum);
                this.signer = this.provider.getSigner();

                // Check if we're on the correct network
                const network = await this.provider.getNetwork();
                if (network.chainId !== this.config.chainId) {
                    await this.switchNetwork();
                }

                // Initialize contracts
                await this.initializeContracts();

                return true;
            } else {
                console.error('MetaMask not found');
                return false;
            }
        } catch (error) {
            console.error('Failed to initialize Web3:', error);
            return false;
        }
    }

    // Switch to correct network
    private async switchNetwork(): Promise<void> {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${this.config.chainId.toString(16)}` }],
            });
        } catch (error) {
            // If network doesn't exist, add it
            if (error.code === 4902) {
                await this.addNetwork();
            }
        }
    }

    // Add network if it doesn't exist
    private async addNetwork(): Promise<void> {
        const networkConfig = this.getNetworkConfig();
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkConfig],
        });
    }

    // Get network configuration
    private getNetworkConfig() {
        const networks = {
            1: { // Ethereum Mainnet
                chainId: '0x1',
                chainName: 'Ethereum Mainnet',
                nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://mainnet.infura.io/v3/your-project-id'],
                blockExplorerUrls: ['https://etherscan.io']
            },
            137: { // Polygon
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                rpcUrls: ['https://polygon-rpc.com'],
                blockExplorerUrls: ['https://polygonscan.com']
            },
            80001: { // Mumbai Testnet
                chainId: '0x13881',
                chainName: 'Mumbai Testnet',
                nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
                blockExplorerUrls: ['https://mumbai.polygonscan.com']
            }
        };

        return networks[this.config.chainId] || networks[80001];
    }

    // Initialize smart contracts
    private async initializeContracts(): Promise<void> {
        if (!this.signer) throw new Error('Signer not initialized');

        this.tokenContract = new Contract(
            this.config.tokenContractAddress,
            TOKEN_ABI,
            this.signer
        );

        this.rewardContract = new Contract(
            this.config.rewardContractAddress,
            REWARD_ABI,
            this.signer
        );

        this.p2pMarketplaceContract = new Contract(
            this.config.p2pMarketplaceAddress,
            P2P_MARKETPLACE_ABI,
            this.signer
        );
    }

    // Get user's wallet address
    async getAddress(): Promise<string | null> {
        try {
            if (!this.signer) return null;
            return await this.signer.getAddress();
        } catch (error) {
            console.error('Failed to get address:', error);
            return null;
        }
    }

    // Get token information
    async getTokenInfo(): Promise<TokenInfo | null> {
        try {
            if (!this.tokenContract || !this.signer) return null;

            const address = await this.signer.getAddress();
            const [name, symbol, decimals, totalSupply, balance] = await Promise.all([
                this.tokenContract.name(),
                this.tokenContract.symbol(),
                this.tokenContract.decimals(),
                this.tokenContract.totalSupply(),
                this.tokenContract.balanceOf(address)
            ]);

                    return {
            name,
            symbol,
            decimals,
            totalSupply: ethers.formatUnits(totalSupply, decimals),
            balance: ethers.formatUnits(balance, decimals)
        };
        } catch (error) {
            console.error('Failed to get token info:', error);
            return null;
        }
    }

    // Transfer tokens
    async transferTokens(to: string, amount: string): Promise<boolean> {
        try {
            if (!this.tokenContract || !this.signer) return false;

            const decimals = await this.tokenContract.decimals();
            const amountWei = ethers.parseUnits(amount, decimals);

            const tx = await this.tokenContract.transfer(to, amountWei);
            await tx.wait();

            return true;
        } catch (error) {
            console.error('Failed to transfer tokens:', error);
            return false;
        }
    }

    // Get reward information
    async getRewardInfo(): Promise<RewardInfo | null> {
        try {
            if (!this.rewardContract || !this.signer) return null;

            const address = await this.signer.getAddress();
            const [totalRewards, claimableRewards, rewardHistory] = await Promise.all([
                this.rewardContract.getUserRewards(address),
                this.rewardContract.getUserRewards(address), // This would be different in a real contract
                this.rewardContract.getRewardHistory(address)
            ]);

            return {
                totalRewards: ethers.formatEther(totalRewards),
                claimableRewards: ethers.formatEther(claimableRewards),
                rewardHistory: rewardHistory.map((reward: any) => ({
                    amount: ethers.formatEther(reward.amount),
                    timestamp: reward.timestamp.toNumber()
                }))
            };
        } catch (error) {
            console.error('Failed to get reward info:', error);
            return null;
        }
    }

    // Claim rewards
    async claimRewards(): Promise<boolean> {
        try {
            if (!this.rewardContract || !this.signer) return false;

            const address = await this.signer.getAddress();
            const tx = await this.rewardContract.claimRewards(address);
            await tx.wait();

            return true;
        } catch (error) {
            console.error('Failed to claim rewards:', error);
            return false;
        }
    }

    // Create P2P listing
    async createP2PListing(productId: number, price: string, quantity: number): Promise<boolean> {
        try {
            if (!this.p2pMarketplaceContract || !this.signer) return false;

            const priceWei = ethers.parseEther(price);
            const tx = await this.p2pMarketplaceContract.createListing(productId, priceWei, quantity);
            await tx.wait();

            return true;
        } catch (error) {
            console.error('Failed to create P2P listing:', error);
            return false;
        }
    }

    // Buy from P2P listing
    async buyFromP2PListing(listingId: number, quantity: number): Promise<boolean> {
        try {
            if (!this.p2pMarketplaceContract || !this.signer) return false;

            const listing = await this.p2pMarketplaceContract.getListing(listingId);
            const totalPrice = listing.price.mul(quantity);

            const tx = await this.p2pMarketplaceContract.buyFromListing(listingId, quantity, {
                value: totalPrice
            });
            await tx.wait();

            return true;
        } catch (error) {
            console.error('Failed to buy from P2P listing:', error);
            return false;
        }
    }

    // Get P2P listings
    async getP2PListings(): Promise<P2PListing[]> {
        try {
            if (!this.p2pMarketplaceContract) return [];

            // This is a simplified version - in reality you'd need to track listing IDs
            const listings: P2PListing[] = [];

            // For demo purposes, return mock data
            // In production, you'd query events or use a subgraph
            return listings;
        } catch (error) {
            console.error('Failed to get P2P listings:', error);
            return [];
        }
    }

    // Gasless transaction using meta-transactions
    async executeGaslessTransaction(transaction: GaslessTransaction): Promise<boolean> {
        try {
            if (!this.config.gaslessRelayerUrl) {
                throw new Error('Gasless relayer not configured');
            }

            const response = await fetch(this.config.gaslessRelayerUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transaction)
            });

            if (!response.ok) {
                throw new Error('Gasless transaction failed');
            }

            return true;
        } catch (error) {
            console.error('Failed to execute gasless transaction:', error);
            return false;
        }
    }

    // Sign message for authentication
    async signMessage(message: string): Promise<string | null> {
        try {
            if (!this.signer) return null;
            return await this.signer.signMessage(message);
        } catch (error) {
            console.error('Failed to sign message:', error);
            return null;
        }
    }

    // Verify message signature
    verifyMessage(message: string, signature: string, address: string): boolean {
        try {
            const recoveredAddress = ethers.verifyMessage(message, signature);
            return recoveredAddress.toLowerCase() === address.toLowerCase();
        } catch (error) {
            console.error('Failed to verify message:', error);
            return false;
        }
    }

    // Get transaction status
    async getTransactionStatus(txHash: string): Promise<any> {
        try {
            if (!this.provider) return null;

            const receipt = await this.provider.getTransactionReceipt(txHash);
            return {
                hash: txHash,
                status: receipt.status === 1 ? 'success' : 'failed',
                blockNumber: receipt.blockNumber,
                gasUsed: receipt.gasUsed.toString(),
                confirmations: receipt.confirmations
            };
        } catch (error) {
            console.error('Failed to get transaction status:', error);
            return null;
        }
    }

    // Listen to events
    async listenToEvents(eventName: string, callback: (event: any) => void): Promise<void> {
        try {
            if (!this.tokenContract) return;

            this.tokenContract.on(eventName, callback);
        } catch (error) {
            console.error('Failed to listen to events:', error);
        }
    }

    // Stop listening to events
    async stopListeningToEvents(eventName: string): Promise<void> {
        try {
            if (!this.tokenContract) return;

            this.tokenContract.off(eventName);
        } catch (error) {
            console.error('Failed to stop listening to events:', error);
        }
    }

    // Disconnect
    async disconnect(): Promise<void> {
        this.provider = null;
        this.signer = null;
        this.tokenContract = null;
        this.rewardContract = null;
        this.p2pMarketplaceContract = null;
    }
}

export default Web3Service;