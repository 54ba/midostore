"use client";

import React, { useState, useEffect } from 'react';
import {
    Wallet,
    Coins,
    TrendingUp,
    Users,
    ShoppingBag,
    Gift,
    Shield,
    Zap,
    Globe,
    Lock,
    Unlock,
    RefreshCw,
    ExternalLink,
    Copy,
    CheckCircle,
    AlertCircle,
    Star,
    Fire,
    Timer,
    ArrowRight,
    Plus,
    Minus,
    Send,
    Download,
    Upload,
    Flame
} from 'lucide-react';

interface DecentralizedDashboardProps {
    className?: string;
}

interface TokenInfo {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
    balance: string;
}

interface RewardInfo {
    totalRewards: string;
    claimableRewards: string;
    rewardHistory: Array<{
        amount: string;
        timestamp: number;
    }>;
}

interface P2PListing {
    id: string;
    productId: string;
    sellerId: string;
    sellerAddress: string;
    price: number;
    quantity: number;
    currency: string;
    status: string;
    metadata: any;
}

export default function DecentralizedDashboard({ className = '' }: DecentralizedDashboardProps) {
    const [walletConnected, setWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
    const [rewardInfo, setRewardInfo] = useState<RewardInfo | null>(null);
    const [p2pListings, setP2pListings] = useState<P2PListing[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [copiedAddress, setCopiedAddress] = useState(false);

    useEffect(() => {
        checkWalletConnection();
        if (walletConnected) {
            fetchData();
        }
    }, [walletConnected]);

    const checkWalletConnection = async () => {
        try {
            const response = await fetch('/api/web3?action=status');
            const data = await response.json();
            if (data.success && data.data.connected) {
                setWalletConnected(true);
                const addressResponse = await fetch('/api/web3?action=status');
                if (addressResponse.ok) {
                    const addressData = await addressResponse.json();
                    setWalletAddress(addressData.data.address || '');
                }
            }
        } catch (error) {
            console.error('Error checking wallet connection:', error);
        }
    };

    const connectWallet = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/web3', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'connect-wallet' }),
            });

            const data = await response.json();
            if (data.success) {
                setWalletConnected(true);
                setWalletAddress(data.data.address);
                await fetchData();
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
        } finally {
            setLoading(false);
        }
    };

    const disconnectWallet = async () => {
        try {
            await fetch('/api/web3', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'disconnect' }),
            });
            setWalletConnected(false);
            setWalletAddress('');
            setTokenInfo(null);
            setRewardInfo(null);
            setP2pListings([]);
        } catch (error) {
            console.error('Error disconnecting wallet:', error);
        }
    };

    const fetchData = async () => {
        if (!walletConnected) return;

        try {
            setLoading(true);

            // Fetch token info
            const tokenResponse = await fetch('/api/web3?action=token-info');
            if (tokenResponse.ok) {
                const tokenData = await tokenResponse.json();
                if (tokenData.success) {
                    setTokenInfo(tokenData.data);
                }
            }

            // Fetch reward info
            const rewardResponse = await fetch('/api/web3?action=reward-info');
            if (rewardResponse.ok) {
                const rewardData = await rewardResponse.json();
                if (rewardData.success) {
                    setRewardInfo(rewardData.data);
                }
            }

            // Fetch P2P listings
            const listingsResponse = await fetch('/api/p2p-marketplace?action=listings');
            if (listingsResponse.ok) {
                const listingsData = await listingsResponse.json();
                if (listingsData.success) {
                    setP2pListings(listingsData.data);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyAddress = () => {
        navigator.clipboard.writeText(walletAddress);
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
    };

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const formatNumber = (num: string | number) => {
        return new Intl.NumberFormat('en-US').format(Number(num));
    };

    const formatCurrency = (amount: number, currency: string = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    if (!walletConnected) {
        return (
            <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-8 ${className}`}>
                <div className="text-center">
                    <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
                    <p className="text-gray-600 mb-6">
                        Connect your Web3 wallet to access decentralized features, earn tokens, and participate in the P2P marketplace.
                    </p>

                    <button
                        onClick={connectWallet}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 mx-auto"
                    >
                        {loading ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                            <Wallet className="w-5 h-5" />
                        )}
                        {loading ? 'Connecting...' : 'Connect Wallet'}
                    </button>

                    <div className="mt-6 text-sm text-gray-500">
                        <p>Supported wallets: MetaMask, WalletConnect, Coinbase Wallet</p>
                        <p>Connect to access: Token rewards, P2P trading, DeFi features</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
            {/* Header */}
            <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Globe className="w-6 h-6 text-green-600" />
                            Decentralized Dashboard
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Manage your tokens, rewards, and P2P trading activities
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Wallet Info */}
                        <div className="bg-gray-50 rounded-lg px-4 py-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">Connected</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-mono text-gray-900">
                                    {formatAddress(walletAddress)}
                                </span>
                                <button
                                    onClick={copyAddress}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    {copiedAddress ? (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={disconnectWallet}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                        >
                            <Unlock className="w-4 h-4" />
                            Disconnect
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-1 mt-6">
                    {[
                        { id: 'overview', label: 'Overview', icon: TrendingUp },
                        { id: 'tokens', label: 'Tokens', icon: Coins },
                        { id: 'rewards', label: 'Rewards', icon: Gift },
                        { id: 'p2p', label: 'P2P Marketplace', icon: Users },
                        { id: 'defi', label: 'DeFi', icon: Zap },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-green-100 text-green-700'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-600 font-medium">Token Balance</p>
                                        <p className="text-2xl font-bold text-blue-900">
                                            {tokenInfo ? formatNumber(tokenInfo.balance) : '0'}
                                        </p>
                                    </div>
                                    <Coins className="w-8 h-8 text-blue-500" />
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-green-600 font-medium">Total Rewards</p>
                                        <p className="text-2xl font-bold text-green-900">
                                            {rewardInfo ? formatNumber(rewardInfo.totalRewards) : '0'}
                                        </p>
                                    </div>
                                    <Gift className="w-8 h-8 text-green-500" />
                                </div>
                            </div>

                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-purple-600 font-medium">P2P Listings</p>
                                        <p className="text-2xl font-bold text-purple-900">
                                            {p2pListings.length}
                                        </p>
                                    </div>
                                    <Users className="w-8 h-8 text-purple-500" />
                                </div>
                            </div>

                            <div className="bg-orange-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-orange-600 font-medium">Network</p>
                                        <p className="text-2xl font-bold text-orange-900">Ethereum</p>
                                    </div>
                                    <Shield className="w-8 h-8 text-orange-500" />
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                                    <Send className="w-5 h-5 text-blue-600" />
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">Send Tokens</p>
                                        <p className="text-sm text-gray-600">Transfer to another wallet</p>
                                    </div>
                                </button>

                                <button className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
                                    <Download className="w-5 h-5 text-green-600" />
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">Claim Rewards</p>
                                        <p className="text-sm text-gray-600">Collect earned tokens</p>
                                    </div>
                                </button>

                                <button className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
                                    <Plus className="w-5 h-5 text-purple-600" />
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">Create Listing</p>
                                        <p className="text-sm text-gray-600">Sell on P2P marketplace</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                            <div className="space-y-3">
                                {rewardInfo?.rewardHistory.slice(0, 5).map((reward, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <Gift className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Token Reward</p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(reward.timestamp * 1000).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-green-600">+{reward.amount}</p>
                                            <p className="text-sm text-gray-500">tokens</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'tokens' && (
                    <div className="space-y-6">
                        {tokenInfo ? (
                            <>
                                {/* Token Info */}
                                <div className="bg-blue-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Token Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm text-blue-600 font-medium">Token Name</p>
                                            <p className="text-xl font-bold text-blue-900">{tokenInfo.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-blue-600 font-medium">Symbol</p>
                                            <p className="text-xl font-bold text-blue-900">{tokenInfo.symbol}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-blue-600 font-medium">Your Balance</p>
                                            <p className="text-2xl font-bold text-blue-900">
                                                {formatNumber(tokenInfo.balance)} {tokenInfo.symbol}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-blue-600 font-medium">Total Supply</p>
                                            <p className="text-xl font-bold text-blue-900">
                                                {formatNumber(tokenInfo.totalSupply)} {tokenInfo.symbol}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Token Actions */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <h4 className="font-semibold text-gray-900 mb-4">Send Tokens</h4>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                placeholder="Recipient Address"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Amount"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                                                <Send className="w-4 h-4" />
                                                Send Tokens
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <h4 className="font-semibold text-gray-900 mb-4">Token Analytics</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Market Cap</span>
                                                <span className="font-medium">$0.00</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">24h Volume</span>
                                                <span className="font-medium">$0.00</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Circulating Supply</span>
                                                <span className="font-medium">{formatNumber(tokenInfo.balance)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <Coins className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">Token information not available</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'rewards' && (
                    <div className="space-y-6">
                        {rewardInfo ? (
                            <>
                                {/* Rewards Overview */}
                                <div className="bg-green-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-green-900 mb-4">Rewards Overview</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm text-green-600 font-medium">Total Rewards Earned</p>
                                            <p className="text-2xl font-bold text-green-900">
                                                {formatNumber(rewardInfo.totalRewards)} tokens
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-green-600 font-medium">Claimable Rewards</p>
                                            <p className="text-2xl font-bold text-green-900">
                                                {formatNumber(rewardInfo.claimableRewards)} tokens
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Claim Rewards */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Claim Your Rewards</h4>
                                            <p className="text-gray-600">Collect all your earned tokens</p>
                                        </div>
                                        <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                                            <Gift className="w-4 h-4" />
                                            Claim All
                                        </button>
                                    </div>
                                </div>

                                {/* Reward History */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h4 className="font-semibold text-gray-900 mb-4">Reward History</h4>
                                    <div className="space-y-3">
                                        {rewardInfo.rewardHistory.map((reward, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                        <Star className="w-4 h-4 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Activity Reward</p>
                                                        <p className="text-sm text-gray-600">
                                                            {new Date(reward.timestamp * 1000).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-green-600">+{reward.amount}</p>
                                                    <p className="text-sm text-gray-500">tokens</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">Reward information not available</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'p2p' && (
                    <div className="space-y-6">
                        {/* P2P Marketplace Header */}
                        <div className="bg-purple-50 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-purple-900">P2P Marketplace</h3>
                                    <p className="text-purple-700">Trade directly with other users without intermediaries</p>
                                </div>
                                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Create Listing
                                </button>
                            </div>
                        </div>

                        {/* Active Listings */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h4 className="font-semibold text-gray-900 mb-4">Active Listings</h4>
                            {p2pListings.length > 0 ? (
                                <div className="space-y-4">
                                    {p2pListings.map((listing) => (
                                        <div key={listing.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                                    <ShoppingBag className="w-6 h-6 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">Product #{listing.productId}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {formatAddress(listing.sellerAddress)} • {listing.quantity} units
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900">
                                                    {formatCurrency(listing.price, listing.currency)}
                                                </p>
                                                <p className="text-sm text-gray-500">{listing.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-600">No active listings found</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'defi' && (
                    <div className="space-y-6">
                        {/* DeFi Features */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-2">DeFi Features Coming Soon</h3>
                            <p className="text-blue-100">
                                Advanced DeFi features including staking, yield farming, and liquidity pools
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h4 className="font-semibold text-gray-900 mb-4">Staking</h4>
                                <p className="text-gray-600 mb-4">Stake your tokens to earn passive income</p>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Coming Soon
                                </button>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h4 className="font-semibold text-gray-900 mb-4">Yield Farming</h4>
                                <p className="text-gray-600 mb-4">Provide liquidity and earn rewards</p>
                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                    Coming Soon
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}