"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Gift,
  Star,
  Trophy,
  Zap,
  Target,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Eye,
  MousePointer,
  Heart,
  Share2,
  MessageCircle,
  RefreshCw,
  Filter,
  Download,
  Coins,
  Award,
  Crown
} from 'lucide-react';

// Mock token rewards data
const mockTokenRewardsData = {
  overview: {
    totalUsers: 12450,
    activeRewards: 89,
    totalTokensIssued: 456200,
    avgTokensPerUser: 36.6
  },
  rewardTiers: [
    {
      id: 1,
      name: 'Bronze',
      minTokens: 0,
      maxTokens: 999,
      benefits: ['5% discount on first purchase', 'Free shipping on orders over $50'],
      color: 'bg-orange-100 text-orange-800',
      icon: '🥉'
    },
    {
      id: 2,
      name: 'Silver',
      minTokens: 1000,
      maxTokens: 4999,
      benefits: ['10% discount on all purchases', 'Free shipping on all orders', 'Priority customer support'],
      color: 'bg-gray-100 text-gray-800',
      icon: '🥈'
    },
    {
      id: 3,
      name: 'Gold',
      minTokens: 5000,
      maxTokens: 19999,
      benefits: ['15% discount on all purchases', 'Free shipping on all orders', 'Priority customer support', 'Exclusive product access'],
      color: 'bg-yellow-100 text-yellow-800',
      icon: '🥇'
    },
    {
      id: 4,
      name: 'Platinum',
      minTokens: 20000,
      maxTokens: 99999,
      benefits: ['20% discount on all purchases', 'Free shipping on all orders', 'VIP customer support', 'Exclusive product access', 'Early access to sales'],
      color: 'bg-blue-100 text-blue-800',
      icon: '💎'
    },
    {
      id: 5,
      name: 'Diamond',
      minTokens: 100000,
      maxTokens: null,
      benefits: ['25% discount on all purchases', 'Free shipping on all orders', 'Personal account manager', 'Exclusive product access', 'Early access to sales', 'Invitation to exclusive events'],
      color: 'bg-purple-100 text-purple-800',
      icon: '👑'
    }
  ],
  activities: [
    {
      id: 1,
      type: 'purchase',
      description: 'Made a purchase',
      tokens: 150,
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: 2,
      type: 'review',
      description: 'Left a product review',
      tokens: 50,
      date: '2024-01-14',
      status: 'completed'
    },
    {
      id: 3,
      type: 'referral',
      description: 'Referred a friend',
      tokens: 200,
      date: '2024-01-13',
      status: 'pending'
    },
    {
      id: 4,
      type: 'social',
      description: 'Shared on social media',
      tokens: 25,
      date: '2024-01-12',
      status: 'completed'
    }
  ],
  waysToEarn: [
    {
      id: 1,
      title: 'Make Purchases',
      description: 'Earn tokens for every dollar spent',
      tokens: '1 token per $1',
      icon: '🛒',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 2,
      title: 'Leave Reviews',
      description: 'Share your experience and earn tokens',
      tokens: '50 tokens per review',
      icon: '⭐',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 3,
      title: 'Refer Friends',
      description: 'Invite friends and earn bonus tokens',
      tokens: '200 tokens per referral',
      icon: '👥',
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 4,
      title: 'Social Sharing',
      description: 'Share products on social media',
      tokens: '25 tokens per share',
      icon: '📱',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 5,
      title: 'Birthday Bonus',
      description: 'Special tokens on your birthday',
      tokens: '100 tokens',
      icon: '🎂',
      color: 'bg-pink-100 text-pink-800'
    },
    {
      id: 6,
      title: 'Daily Login',
      description: 'Check in daily for bonus tokens',
      tokens: '10 tokens per day',
      icon: '📅',
      color: 'bg-indigo-100 text-indigo-800'
    }
  ]
};

export default function TokenRewardsPage() {
  const [selectedTier, setSelectedTier] = useState(mockTokenRewardsData.rewardTiers[0]);
  const [userTokens, setUserTokens] = useState(2500);

  useEffect(() => {
    // Calculate user's current tier based on tokens
    const tier = mockTokenRewardsData.rewardTiers.find(t =>
      userTokens >= t.minTokens && (t.maxTokens === null || userTokens <= t.maxTokens)
    );
    if (tier) setSelectedTier(tier);
  }, [userTokens]);

  const nextTier = mockTokenRewardsData.rewardTiers.find(t => t.minTokens > userTokens);
  const tokensToNextTier = nextTier ? nextTier.minTokens - userTokens : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-6">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Token Rewards Program
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Earn tokens for your engagement and unlock exclusive benefits. Our loyalty program rewards you for shopping, reviewing, and sharing your experience with our community.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{mockTokenRewardsData.overview.totalUsers.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Gift className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Rewards</p>
                  <p className="text-2xl font-bold text-gray-900">{mockTokenRewardsData.overview.activeRewards}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Coins className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tokens</p>
                  <p className="text-2xl font-bold text-gray-900">{mockTokenRewardsData.overview.totalTokensIssued.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Tokens/User</p>
                  <p className="text-2xl font-bold text-gray-900">{mockTokenRewardsData.overview.avgTokensPerUser}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Current Status */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span>Your Current Status</span>
              </CardTitle>
              <CardDescription>Track your progress and rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-4 rounded-lg ${selectedTier.color}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{selectedTier.icon}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{selectedTier.name} Tier</h3>
                      <p className="text-sm opacity-80">
                        {selectedTier.minTokens.toLocaleString()}+ tokens
                        {selectedTier.maxTokens && ` - ${selectedTier.maxTokens.toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {userTokens.toLocaleString()} tokens
                  </Badge>
                </div>
              </div>

              {nextTier && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Next Tier: {nextTier.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {tokensToNextTier.toLocaleString()} tokens needed
                    </span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (userTokens / nextTier.minTokens) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Current Benefits:</h4>
                <ul className="space-y-2">
                  {selectedTier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Ways to Earn */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Ways to Earn Tokens</span>
              </CardTitle>
              <CardDescription>Discover how to boost your token balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {mockTokenRewardsData.waysToEarn.map(way => (
                  <div key={way.id} className={`p-3 rounded-lg ${way.color} flex items-center justify-between`}>
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{way.icon}</span>
                      <div>
                        <h4 className="font-semibold text-sm">{way.title}</h4>
                        <p className="text-xs opacity-80">{way.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {way.tokens}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reward Tiers */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="w-5 h-5" />
              <span>Reward Tiers</span>
            </CardTitle>
            <CardDescription>Unlock more benefits as you earn more tokens</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {mockTokenRewardsData.rewardTiers.map(tier => (
                <div key={tier.id} className={`p-4 rounded-lg ${tier.color} text-center`}>
                  <div className="text-3xl mb-2">{tier.icon}</div>
                  <h3 className="font-semibold mb-2">{tier.name}</h3>
                  <p className="text-sm mb-3">
                    {tier.minTokens.toLocaleString()}+ tokens
                    {tier.maxTokens && ` - ${tier.maxTokens.toLocaleString()}`}
                  </p>
                  <ul className="text-xs space-y-1 text-left">
                    {tier.benefits.slice(0, 3).map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-1">
                        <div className="w-1 h-1 bg-current rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                    {tier.benefits.length > 3 && (
                      <li className="text-xs opacity-70">+{tier.benefits.length - 3} more benefits</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Track your recent token earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTokenRewardsData.activities.map(activity => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {activity.status === 'completed' ? '✓' : '⏳'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-600">{activity.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      +{activity.tokens} tokens
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy to Earn</h3>
              <p className="text-gray-600 text-sm">
                Earn tokens through everyday activities like shopping, reviewing, and sharing.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Progressive Rewards</h3>
              <p className="text-gray-600 text-sm">
                Unlock better benefits and discounts as you climb the reward tiers.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Gift className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Exclusive Benefits</h3>
              <p className="text-gray-600 text-sm">
                Access special offers, early sales, and VIP experiences at higher tiers.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600">
          <p className="mb-2">Start earning tokens today and unlock exclusive rewards</p>
          <p className="text-sm">© 2024 MidoStore. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}