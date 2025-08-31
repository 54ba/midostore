import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import PackageManagerService from '@/lib/package-manager-service'

const packageManager = new PackageManagerService()

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
      case 'available':
        const availablePackages = await packageManager.getAvailablePackages()
        return NextResponse.json({ success: true, data: availablePackages })

      case 'installed':
        const installedPackages = await packageManager.getInstalledPackages(userId)
        return NextResponse.json({ success: true, data: installedPackages })

      case 'stats':
        const stats = await packageManager.getPackageStats(userId)
        return NextResponse.json({ success: true, data: stats })

      case 'package':
        const packageId = searchParams.get('packageId')
        if (!packageId) {
          return NextResponse.json(
            { success: false, error: 'Package ID is required' },
            { status: 400 }
          )
        }
        const pkg = await packageManager.getPackage(packageId)
        return NextResponse.json({ success: true, data: pkg })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Packages GET error:', error)
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
      case 'install':
        const { packageId, config } = data
        if (!packageId) {
          return NextResponse.json(
            { success: false, error: 'Package ID is required' },
            { status: 400 }
          )
        }

        const installResult = await packageManager.installPackage(packageId, userId, config)
        return NextResponse.json({ success: true, data: installResult })

      case 'uninstall':
        const { packageId: uninstallPackageId } = data
        if (!uninstallPackageId) {
          return NextResponse.json(
            { success: false, error: 'Package ID is required' },
            { status: 400 }
          )
        }

        const uninstallResult = await packageManager.uninstallPackage(uninstallPackageId, userId)
        return NextResponse.json({ success: true, data: uninstallResult })

      case 'update':
        const { packageId: updatePackageId } = data
        if (!updatePackageId) {
          return NextResponse.json(
            { success: false, error: 'Package ID is required' },
            { status: 400 }
          )
        }

        const updateResult = await packageManager.updatePackage(updatePackageId, userId)
        return NextResponse.json({ success: true, data: updateResult })

      case 'configure':
        const { packageId: configPackageId, config: packageConfig } = data
        if (!configPackageId || !packageConfig) {
          return NextResponse.json(
            { success: false, error: 'Package ID and config are required' },
            { status: 400 }
          )
        }

        const configResult = await packageManager.configurePackage(configPackageId, userId, packageConfig)
        return NextResponse.json({ success: true, data: configResult })

      case 'update-api-keys':
        const { packageId: apiPackageId, apiKeys } = data
        if (!apiPackageId || !apiKeys) {
          return NextResponse.json(
            { success: false, error: 'Package ID and API keys are required' },
            { status: 400 }
          )
        }

        const apiKeysResult = await packageManager.updatePackageApiKeys(apiPackageId, userId, apiKeys)
        return NextResponse.json({ success: true, data: apiKeysResult })

      case 'update-settings':
        const { packageId: settingsPackageId, settings } = data
        if (!settingsPackageId || !settings) {
          return NextResponse.json(
            { success: false, error: 'Package ID and settings are required' },
            { status: 400 }
          )
        }

        const settingsResult = await packageManager.updatePackageSettings(settingsPackageId, userId, settings)
        return NextResponse.json({ success: true, data: settingsResult })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Packages POST error:', error)
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
      case 'update-config':
        const { packageId, config } = data
        if (!packageId || !config) {
          return NextResponse.json(
            { success: false, error: 'Package ID and config are required' },
            { status: 400 }
          )
        }

        const configResult = await packageManager.configurePackage(packageId, userId, config)
        return NextResponse.json({ success: true, data: configResult })

      case 'update-api-keys':
        const { packageId: apiPackageId, apiKeys } = data
        if (!apiPackageId || !apiKeys) {
          return NextResponse.json(
            { success: false, error: 'Package ID and API keys are required' },
            { status: 400 }
          )
        }

        const apiKeysResult = await packageManager.updatePackageApiKeys(apiPackageId, userId, apiKeys)
        return NextResponse.json({ success: true, data: apiKeysResult })

      case 'update-settings':
        const { packageId: settingsPackageId, settings } = data
        if (!settingsPackageId || !settings) {
          return NextResponse.json(
            { success: false, error: 'Package ID and settings are required' },
            { status: 400 }
          )
        }

        const settingsResult = await packageManager.updatePackageSettings(settingsPackageId, userId, settings)
        return NextResponse.json({ success: true, data: settingsResult })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Packages PUT error:', error)
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
      case 'uninstall':
        const { packageId } = data
        if (!packageId) {
          return NextResponse.json(
            { success: false, error: 'Package ID is required' },
            { status: 400 }
          )
        }

        const uninstallResult = await packageManager.uninstallPackage(packageId, userId)
        return NextResponse.json({ success: true, data: uninstallResult })

      case 'remove-config':
        const { packageId: configPackageId } = data
        if (!configPackageId) {
          return NextResponse.json(
            { success: false, error: 'Package ID is required' },
            { status: 400 }
          )
        }

        // Remove package configuration
        await prisma.installedPackage.update({
          where: {
            packageId: configPackageId,
            userId
          },
          data: {
            config: '{}',
            updatedAt: new Date()
          }
        })

        return NextResponse.json({
          success: true,
          message: 'Package configuration removed'
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Packages DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}