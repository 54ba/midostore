import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Required for static export compatibility
export const dynamic = 'force-static'

const PROXY_URL = 'https://api.internal.tasker.ai'
const CHAT_ROOM_UUID = "91d799d8-8f50-4e00-92b7-738e055f90c4"
const USER_UUID = "b3f753f4-ee49-4263-a1ec-1b798c8d5948"
const FUNCTION_UUID = "00990cf8-6ca6-487b-ad47-c60a3732d0c8"
const SPREADSHEET_ID = '18EGqQ8F7mBO08nqDin9mwfLt_R-lB1xSDmlgI_BNyXw'

interface UserSession {
  user_id: string
  email: string
  full_name: string
}

interface Order {
  order_id: string
  user_id: string
  product_id: string
  product_name: string
  quantity: string
  total_amount: string
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')

    if (!authToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const userSession: UserSession = JSON.parse(authToken.value)
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    const userId = searchParams.get('user_id') ?? userSession.user_id

    // Read orders from Google Sheets
    const response = await fetch(`${PROXY_URL}/proxy/google-sheets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatRoomUUID: CHAT_ROOM_UUID,
        userUUID: USER_UUID,
        functionUUID: FUNCTION_UUID,
        operation: 'read',
        spreadsheetId: SPREADSHEET_ID,
        range: 'Order!A1:F1000'
      })
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    const sheetsData = await response.json()
    const rows = sheetsData.result?.values || []

    if (rows.length === 0) {
      return NextResponse.json({ success: true, data: [] })
    }

    // Skip header row and map data
    const orders = rows.slice(1).map((row: string[]) => ({
      order_id: row[0] || '',
      user_id: row[1] || '',
      product_id: row[2] || '',
      product_name: row[3] || '',
      quantity: row[4] || '',
      total_amount: row[5] || ''
    })).filter((order: Order) => order.order_id) // Filter out empty rows

    // Filter by specific order ID if provided
    if (orderId) {
      const order = orders.find((order: Order) => order.order_id === orderId)
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: order })
    }

    // Filter by user ID
    const userOrders = orders.filter((order: Order) => order.user_id === userId)

    return NextResponse.json({ success: true, data: userOrders })

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')

    if (!authToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const userSession: UserSession = JSON.parse(authToken.value)
    const body = await request.json()

    const { product_id, product_name, quantity, total_amount } = body

    if (!product_id || !product_name || !quantity || !total_amount) {
      return NextResponse.json({
        error: 'Missing required fields: product_id, product_name, quantity, total_amount'
      }, { status: 400 })
    }

    // Generate unique order ID
    const order_id = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create new order in Google Sheets
    const response = await fetch(`${PROXY_URL}/proxy/google-sheets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatRoomUUID: CHAT_ROOM_UUID,
        userUUID: USER_UUID,
        functionUUID: FUNCTION_UUID,
        operation: 'write',
        spreadsheetId: SPREADSHEET_ID,
        range: 'Order!A:F',
        values: [[
          order_id,
          userSession.user_id,
          product_id,
          product_name,
          quantity.toString(),
          total_amount.toString()
        ]],
        valueInputOption: 'RAW'
      })
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    const newOrder = {
      order_id,
      user_id: userSession.user_id,
      product_id,
      product_name,
      quantity: quantity.toString(),
      total_amount: total_amount.toString()
    }

    return NextResponse.json({ success: true, data: newOrder })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')

    if (!authToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const userSession: UserSession = JSON.parse(authToken.value)
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID parameter is required' }, { status: 400 })
    }

    const body = await request.json()

    // First, read all orders to find the one to update
    const readResponse = await fetch(`${PROXY_URL}/proxy/google-sheets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatRoomUUID: CHAT_ROOM_UUID,
        userUUID: USER_UUID,
        functionUUID: FUNCTION_UUID,
        operation: 'read',
        spreadsheetId: SPREADSHEET_ID,
        range: 'Order!A1:F1000'
      })
    })

    if (!readResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    const sheetsData = await readResponse.json()
    const rows = sheetsData.result?.values || []

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Find the order row (skip header)
    let orderRowIndex = -1
    let existingOrder: Order | null = null

    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === orderId) {
        orderRowIndex = i + 1 // +1 because sheets are 1-indexed
        existingOrder = {
          order_id: rows[i][0] || '',
          user_id: rows[i][1] || '',
          product_id: rows[i][2] || '',
          product_name: rows[i][3] || '',
          quantity: rows[i][4] || '',
          total_amount: rows[i][5] || ''
        }
        break
      }
    }

    if (!existingOrder || orderRowIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if user owns this order
    if (existingOrder.user_id !== userSession.user_id) {
      return NextResponse.json({ error: 'Unauthorized to update this order' }, { status: 403 })
    }

    // Update the order with new data
    const updatedOrder = {
      order_id: existingOrder.order_id,
      user_id: existingOrder.user_id,
      product_id: body.product_id || existingOrder.product_id,
      product_name: body.product_name || existingOrder.product_name,
      quantity: body.quantity ? body.quantity.toString() : existingOrder.quantity,
      total_amount: body.total_amount ? body.total_amount.toString() : existingOrder.total_amount
    }

    // Update the specific row in Google Sheets
    const updateResponse = await fetch(`${PROXY_URL}/proxy/google-sheets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatRoomUUID: CHAT_ROOM_UUID,
        userUUID: USER_UUID,
        functionUUID: FUNCTION_UUID,
        operation: 'update',
        spreadsheetId: SPREADSHEET_ID,
        range: `Order!A${orderRowIndex}:F${orderRowIndex}`,
        values: [[
          updatedOrder.order_id,
          updatedOrder.user_id,
          updatedOrder.product_id,
          updatedOrder.product_name,
          updatedOrder.quantity,
          updatedOrder.total_amount
        ]],
        valueInputOption: 'RAW'
      })
    })

    if (!updateResponse.ok) {
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: updatedOrder })

  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}