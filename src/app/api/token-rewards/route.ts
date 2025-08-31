// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import EnhancedTokenRewardsService from '@/lib/enhanced-token-rewards-service'

const tokenRewardsService = new EnhancedTokenRewardsService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'stats':
        const stats = await tokenRewardsService.getMiningStats(userId)
        return NextResponse.json({ success: true, data: stats })

      case 'economy':
        const economy = await tokenRewardsService.getTokenEconomyStats()
        return NextResponse.json({ success: true, data: economy })

      case 'mining-types':
        const miningTypes = tokenRewardsService.getAvailableMiningTypes()
        return NextResponse.json({ success: true, data: miningTypes })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Token rewards GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, ...data } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'start-mining':
        const { miningType, duration } = data
        if (!miningType) {
          return NextResponse.json(
            { success: false, error: 'Mining type is required' },
            { status: 400 }
          )
        }

        const miningResult = await tokenRewardsService.startMining(
          userId,
          miningType,
          duration || 1
        )
        return NextResponse.json({ success: true, data: miningResult })

      case 'stop-mining':
        const { miningId } = data
        if (!miningId) {
          return NextResponse.json(
            { success: false, error: 'Mining ID is required' },
            { status: 400 }
          )
        }

        const stopResult = await tokenRewardsService.stopMining(miningId, userId)
        return NextResponse.json({ success: true, data: stopResult })

      case 'award-tokens':
        const { type, amount, metadata } = data
        if (!type || !amount) {
          return NextResponse.json(
            { success: false, error: 'Type and amount are required' },
            { status: 400 }
          )
        }

        const awardResult = await tokenRewardsService.awardTokens(
          userId,
          type,
          amount,
          metadata
        )
        return NextResponse.json({ success: true, data: awardResult })

      case 'convert-to-cashback':
        const { tokens, orderId } = data
        if (!tokens) {
          return NextResponse.json(
            { success: false, error: 'Token amount is required' },
            { status: 400 }
          )
        }

        const cashbackResult = await tokenRewardsService.convertTokensToCashback(
          userId,
          tokens,
          orderId
        )
        return NextResponse.json({ success: true, data: cashbackResult })

      case 'apply-automatic-cashback':
        const { orderId: autoOrderId, orderAmount, currency } = data
        if (!autoOrderId || !orderAmount) {
          return NextResponse.json(
            { success: false, error: 'Order ID and amount are required' },
            { status: 400 }
          )
        }

        const autoCashbackResult = await tokenRewardsService.applyAutomaticCashback(
          userId,
          autoOrderId,
          orderAmount,
          currency || 'USD'
        )
        return NextResponse.json({ success: true, data: autoCashbackResult })

      case 'get-user-credits':
        const userCredits = await prisma.userCredits.findUnique({
          where: { userId }
        })

        if (!userCredits) {
          return NextResponse.json({
            success: true,
            data: {
              balance: 0,
              totalEarned: 0,
              totalSpent: 0
            }
          })
        }

        return NextResponse.json({ success: true, data: userCredits })

      case 'get-reward-history':
        const { limit = 50, offset = 0 } = data
        const rewards = await prisma.rewardActivity.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: parseInt(limit),
          skip: parseInt(offset)
        })

        return NextResponse.json({ success: true, data: rewards })

      case 'get-credit-transactions':
        const { txnLimit = 50, txnOffset = 0 } = data
        const transactions = await prisma.creditTransaction.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: parseInt(txnLimit),
          skip: parseInt(txnOffset)
        })

        return NextResponse.json({ success: true, data: transactions })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Token rewards POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, ...data } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'update-mining-session':
        const { miningId, updates } = data
        if (!miningId) {
          return NextResponse.json(
            { success: false, error: 'Mining ID is required' },
            { status: 400 }
          )
        }

        const updatedSession = await prisma.userInteraction.update({
          where: { id: miningId },
          data: {
            metadata: JSON.stringify(updates)
          }
        })

        return NextResponse.json({ success: true, data: updatedSession })

      case 'update-user-preferences':
        const { preferences } = data
        const updatedPreferences = await prisma.userPreference.upsert({
          where: { userId },
          update: {
            ...preferences,
            updatedAt: new Date()
          },
          create: {
            userId,
            ...preferences
          }
        })

        return NextResponse.json({ success: true, data: updatedPreferences })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Token rewards PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, ...data } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'cancel-mining':
        const { miningId } = data
        if (!miningId) {
          return NextResponse.json(
            { success: false, error: 'Mining ID is required' },
            { status: 400 }
          )
        }

        // Cancel mining session
        await prisma.userInteraction.update({
          where: { id: miningId },
          data: {
            metadata: JSON.stringify({
              status: 'cancelled',
              cancelledAt: new Date().toISOString()
            })
          }
        })

        return NextResponse.json({ success: true, message: 'Mining cancelled' })

      case 'clear-reward-history':
        // Clear old reward activities (keep last 100)
        const oldRewards = await prisma.rewardActivity.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          skip: 100
        })

        if (oldRewards.length > 0) {
          await prisma.rewardActivity.deleteMany({
            where: {
              id: { in: oldRewards.map(r => r.id) }
            }
          })
        }

        return NextResponse.json({
          success: true,
          message: `Cleared ${oldRewards.length} old reward records`
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Token rewards DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}