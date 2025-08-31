'use client'

import React, { useState, useEffect } from 'react'
import {
    Cpu,
    Gpu,
    Cloud,
    Coins,
    TrendingUp,
    Activity,
    Play,
    Square,
    Zap,
    DollarSign,
    Clock,
    BarChart3,
    RefreshCw,
    Settings,
    Wallet,
    Gift,
    Users
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface MiningStats {
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
}

interface TokenEconomy {
    totalTokensInCirculation: number
    totalTokensMined: number
    averageTokenPrice: number
    marketCap: number
    miningDifficulty: number
    activeMiners: number
}

interface MiningType {
    type: string
    reward: number
    difficulty: number
    energyCost: number
    description: string
}

export default function MiningDashboard() {
    const [miningStats, setMiningStats] = useState<MiningStats>({
        totalMined: 0,
        activeMining: false,
        miningType: null,
        currentReward: 0,
        totalRewards: 0,
        miningHistory: []
    })
    const [tokenEconomy, setTokenEconomy] = useState<TokenEconomy>({
        totalTokensInCirculation: 0,
        totalTokensMined: 0,
        averageTokenPrice: 0,
        marketCap: 0,
        miningDifficulty: 0,
        activeMiners: 0
    })
    const [availableMiningTypes, setAvailableMiningTypes] = useState<MiningType[]>([])
    const [selectedMiningType, setSelectedMiningType] = useState('')
    const [miningDuration, setMiningDuration] = useState(1)
    const [isMining, setIsMining] = useState(false)
    const [miningProgress, setMiningProgress] = useState(0)
    const [selectedTab, setSelectedTab] = useState('mining')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadMiningData()
        const interval = setInterval(loadMiningData, 30000) // Update every 30 seconds
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (isMining) {
            const progressInterval = setInterval(() => {
                setMiningProgress(prev => {
                    if (prev >= 100) {
                        setIsMining(false)
                        return 0
                    }
                    return prev + 1
                })
            }, 1000)
            return () => clearInterval(progressInterval)
        }
    }, [isMining])

    const loadMiningData = async () => {
        try {
            setIsLoading(true)
            // In a real implementation, these would be API calls
            await Promise.all([
                loadMiningStats(),
                loadTokenEconomy(),
                loadMiningTypes()
            ])
        } catch (error) {
            console.error('Failed to load mining data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const loadMiningStats = async () => {
        // Mock data - replace with real API call
        setMiningStats({
            totalMined: 1250.75,
            activeMining: isMining,
            miningType: isMining ? selectedMiningType : null,
            currentReward: isMining ? 0.5 : 0,
            totalRewards: 45,
            miningHistory: [
                { type: 'GPU', duration: 2, reward: 1.0, date: '2024-01-20' },
                { type: 'CPU', duration: 1, reward: 0.1, date: '2024-01-19' },
                { type: 'CLOUD', duration: 3, reward: 3.0, date: '2024-01-18' }
            ]
        })
    }

    const loadTokenEconomy = async () => {
        // Mock data - replace with real API call
        setTokenEconomy({
            totalTokensInCirculation: 50000,
            totalTokensMined: 75000,
            averageTokenPrice: 0.01,
            marketCap: 500,
            miningDifficulty: 1.5,
            activeMiners: 1250
        })
    }

    const loadMiningTypes = async () => {
        // Mock data - replace with real API call
        setAvailableMiningTypes([
            {
                type: 'CPU',
                reward: 0.1,
                difficulty: 1.0,
                energyCost: 0.1,
                description: 'Mine using your computer\'s CPU'
            },
            {
                type: 'GPU',
                reward: 0.5,
                difficulty: 0.8,
                energyCost: 0.5,
                description: 'Mine using your graphics card'
            },
            {
                type: 'CLOUD',
                reward: 1.0,
                difficulty: 0.6,
                energyCost: 0.0,
                description: 'Mine using cloud computing resources'
            },
            {
                type: 'STAKE',
                reward: 0.2,
                difficulty: 1.2,
                energyCost: 0.0,
                description: 'Earn rewards by staking your tokens'
            },
            {
                type: 'LIQUIDITY',
                reward: 0.3,
                difficulty: 1.1,
                energyCost: 0.0,
                description: 'Provide liquidity to earn rewards'
            }
        ])
    }

    const startMining = async () => {
        if (!selectedMiningType) return

        try {
            setIsMining(true)
            setMiningProgress(0)

            // In a real implementation, this would call the mining service
            console.log(`Starting ${selectedMiningType} mining for ${miningDuration} hours`)

            // Simulate mining process
            setTimeout(() => {
                setIsMining(false)
                setMiningProgress(100)
                loadMiningData()
            }, miningDuration * 60 * 60 * 1000) // Convert hours to milliseconds

        } catch (error) {
            console.error('Failed to start mining:', error)
            setIsMining(false)
        }
    }

    const stopMining = async () => {
        try {
            setIsMining(false)
            setMiningProgress(0)

            // In a real implementation, this would call the mining service
            console.log('Stopping mining')
            loadMiningData()

        } catch (error) {
            console.error('Failed to stop mining:', error)
        }
    }

    const getMiningTypeIcon = (type: string) => {
        switch (type) {
            case 'CPU': return <Cpu className="w-5 h-5" />
            case 'GPU': return <Gpu className="w-5 h-5" />
            case 'CLOUD': return <Cloud className="w-5 h-5" />
            case 'STAKE': return <Coins className="w-5 h-5" />
            case 'LIQUIDITY': return <TrendingUp className="w-5 h-5" />
            default: return <Activity className="w-5 h-5" />
        }
    }

    const getMiningTypeColor = (type: string) => {
        switch (type) {
            case 'CPU': return 'bg-blue-100 text-blue-800'
            case 'GPU': return 'bg-green-100 text-green-800'
            case 'CLOUD': return 'bg-purple-100 text-purple-800'
            case 'STAKE': return 'bg-yellow-100 text-yellow-800'
            case 'LIQUIDITY': return 'bg-orange-100 text-orange-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Token Mining Dashboard</h1>
                    <p className="text-gray-600">Mine tokens and earn rewards through various mining methods</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tokens Mined</CardTitle>
                            <Coins className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{miningStats.totalMined.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">
                                {miningStats.totalRewards} mining sessions
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Current Mining</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {miningStats.activeMining ? miningStats.miningType : 'Inactive'}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {miningStats.activeMining ? `${miningStats.currentReward.toFixed(2)} tokens/hr` : 'Not mining'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Token Price</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${tokenEconomy.averageTokenPrice.toFixed(4)}</div>
                            <p className="text-xs text-muted-foreground">
                                Market cap: ${tokenEconomy.marketCap.toFixed(2)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Miners</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{tokenEconomy.activeMiners.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                Difficulty: {tokenEconomy.miningDifficulty.toFixed(2)}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="mining">Mining</TabsTrigger>
                        <TabsTrigger value="rewards">Rewards</TabsTrigger>
                        <TabsTrigger value="economy">Economy</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    {/* Mining Tab */}
                    <TabsContent value="mining" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Mining Control */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Mining Control</CardTitle>
                                    <CardDescription>Start or stop your mining operations</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="mining-type">Mining Type</Label>
                                        <Select value={selectedMiningType} onValueChange={setSelectedMiningType}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select mining type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableMiningTypes.map(type => (
                                                    <SelectItem key={type.type} value={type.type}>
                                                        <div className="flex items-center space-x-2">
                                                            {getMiningTypeIcon(type.type)}
                                                            <span>{type.type}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="duration">Duration (hours)</Label>
                                        <Input
                                            id="duration"
                                            type="number"
                                            min="1"
                                            max="24"
                                            value={miningDuration}
                                            onChange={(e) => setMiningDuration(parseInt(e.target.value) || 1)}
                                        />
                                    </div>

                                    {selectedMiningType && (
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <h4 className="font-medium mb-2">Mining Details</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span>Reward Rate:</span>
                                                    <span className="font-medium">
                                                        {availableMiningTypes.find(t => t.type === selectedMiningType)?.reward.toFixed(2)} tokens/hr
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Difficulty:</span>
                                                    <span className="font-medium">
                                                        {availableMiningTypes.find(t => t.type === selectedMiningType)?.difficulty.toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Energy Cost:</span>
                                                    <span className="font-medium">
                                                        {availableMiningTypes.find(t => t.type === selectedMiningType)?.energyCost.toFixed(2)} kWh/hr
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex space-x-2">
                                        <Button
                                            onClick={startMining}
                                            disabled={!selectedMiningType || isMining}
                                            className="flex-1"
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            Start Mining
                                        </Button>
                                        <Button
                                            onClick={stopMining}
                                            disabled={!isMining}
                                            variant="destructive"
                                            className="flex-1"
                                        >
                                            <Square className="w-4 h-4 mr-2" />
                                            Stop Mining
                                        </Button>
                                    </div>

                                    {isMining && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Mining Progress</span>
                                                <span>{miningProgress}%</span>
                                            </div>
                                            <Progress value={miningProgress} className="w-full" />
                                            <p className="text-xs text-gray-500">
                                                Mining {selectedMiningType} for {miningDuration} hours
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Available Mining Types */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Available Mining Types</CardTitle>
                                    <CardDescription>Choose your preferred mining method</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {availableMiningTypes.map(type => (
                                            <div
                                                key={type.type}
                                                className={`p-3 rounded-lg border ${selectedMiningType === type.type ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        {getMiningTypeIcon(type.type)}
                                                        <div>
                                                            <h4 className="font-medium">{type.type}</h4>
                                                            <p className="text-sm text-gray-600">{type.description}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-medium">{type.reward.toFixed(2)} tokens/hr</div>
                                                        <Badge variant="outline" className={getMiningTypeColor(type.type)}>
                                                            {type.difficulty.toFixed(2)} difficulty
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Rewards Tab */}
                    <TabsContent value="rewards" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Token Balance */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Token Balance</CardTitle>
                                    <CardDescription>Your current token holdings and rewards</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-center p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
                                        <div className="text-3xl font-bold">{miningStats.totalMined.toFixed(2)}</div>
                                        <div className="text-blue-100">Total Tokens Earned</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600">
                                                ${(miningStats.totalMined * tokenEconomy.averageTokenPrice).toFixed(2)}
                                            </div>
                                            <div className="text-sm text-gray-600">USD Value</div>
                                        </div>
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {miningStats.totalRewards}
                                            </div>
                                            <div className="text-sm text-gray-600">Mining Sessions</div>
                                        </div>
                                    </div>

                                    <Button className="w-full" variant="outline">
                                        <Gift className="w-4 h-4 mr-2" />
                                        Claim Rewards
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Mining History */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Mining History</CardTitle>
                                    <CardDescription>Recent mining activities and rewards</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {miningStats.miningHistory.map((session, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <Badge className={getMiningTypeColor(session.type)}>
                                                        {session.type}
                                                    </Badge>
                                                    <div>
                                                        <div className="font-medium">{session.reward.toFixed(2)} tokens</div>
                                                        <div className="text-sm text-gray-600">
                                                            {session.duration}h session on {session.date}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-gray-500">
                                                        {session.reward / session.duration} tokens/hr
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Economy Tab */}
                    <TabsContent value="economy" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Token Economy Overview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Token Economy</CardTitle>
                                    <CardDescription>Global token statistics and market data</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <div className="text-2xl font-bold">
                                                {tokenEconomy.totalTokensInCirculation.toLocaleString()}
                                            </div>
                                            <div className="text-sm text-gray-600">Circulating Supply</div>
                                        </div>
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <div className="text-2xl font-bold">
                                                {tokenEconomy.totalTokensMined.toLocaleString()}
                                            </div>
                                            <div className="text-sm text-gray-600">Total Mined</div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span>Market Cap:</span>
                                            <span className="font-medium">${tokenEconomy.marketCap.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Mining Difficulty:</span>
                                            <span className="font-medium">{tokenEconomy.miningDifficulty.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Active Miners:</span>
                                            <span className="font-medium">{tokenEconomy.activeMiners.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Market Trends */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Market Trends</CardTitle>
                                    <CardDescription>Token price and mining difficulty trends</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <div className="flex items-center space-x-2">
                                                <TrendingUp className="w-5 h-5 text-green-600" />
                                                <span className="font-medium text-green-800">Price Trend</span>
                                            </div>
                                            <p className="text-sm text-green-700 mt-1">
                                                Token price is stable with slight upward trend
                                            </p>
                                        </div>

                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <div className="flex items-center space-x-2">
                                                <BarChart3 className="w-5 h-5 text-blue-600" />
                                                <span className="font-medium text-blue-800">Mining Difficulty</span>
                                            </div>
                                            <p className="text-sm text-blue-700 mt-1">
                                                Difficulty increasing as more miners join
                                            </p>
                                        </div>

                                        <div className="p-4 bg-purple-50 rounded-lg">
                                            <div className="flex items-center space-x-2">
                                                <Users className="w-5 h-5 text-purple-600" />
                                                <span className="font-medium text-purple-800">Network Growth</span>
                                            </div>
                                            <p className="text-sm text-purple-700 mt-1">
                                                Active miners increased by 15% this month
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mining Settings</CardTitle>
                                <CardDescription>Configure your mining preferences and automation</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Auto-Start Mining</Label>
                                        <Select defaultValue="disabled">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="disabled">Disabled</SelectItem>
                                                <SelectItem value="daily">Daily</SelectItem>
                                                <SelectItem value="weekly">Weekly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Preferred Mining Type</Label>
                                        <Select defaultValue="GPU">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableMiningTypes.map(type => (
                                                    <SelectItem key={type.type} value={type.type}>
                                                        {type.type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Energy Cost Limit</Label>
                                        <Input type="number" placeholder="0.5" step="0.1" />
                                        <p className="text-xs text-gray-500">Maximum kWh per hour</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Reward Threshold</Label>
                                        <Input type="number" placeholder="10" step="1" />
                                        <p className="text-xs text-gray-500">Minimum tokens before claiming</p>
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <Button>
                                        <Settings className="w-4 h-4 mr-2" />
                                        Save Settings
                                    </Button>
                                    <Button variant="outline">
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Reset to Defaults
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}