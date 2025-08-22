import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const PROXY_URL = 'https://web-service-5299-acfb1ec2-2gyvifq4.onporter.run'
const SPREADSHEET_ID = '18EGqQ8F7mBO08nqDin9mwfLt_R-lB1xSDmlgI_BNyXw'
const CHAT_ROOM_UUID = "91d799d8-8f50-4e00-92b7-738e055f90c4"
const USER_UUID = "b3f753f4-ee49-4263-a1ec-1b798c8d5948"
const FUNCTION_UUID = "cb898722-4187-48f1-9a8b-93453bb21f49"

interface UserSession {
  user_id: string
  email: string
  full_name: string
}

interface PaymentData {
  order_id: string;
  amount: number;
  status: string;
  payment_method: string;
  currency: string;
  timestamp: string;
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')

    if (!authToken) {
      // For testing purposes, return demo data if no auth token
      return NextResponse.json({
        success: true,
        data: [
          {
            payment_id: 'demo-payment-123',
            order_id: 'demo-order-123',
            stripe_payment_id: 'pi_demo_123',
            amount: '29.99',
            status: 'succeeded',
            created_at: new Date().toISOString()
          }
        ],
        message: 'Demo payments data (provide auth_token for real data)'
      })
    }

    let userSession: UserSession
    try {
      userSession = JSON.parse(authToken.value)
    } catch {
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('id')
    const orderId = searchParams.get('order_id')

    if (!paymentId && !orderId) {
      return NextResponse.json({ error: 'Payment ID or Order ID parameter is required' }, { status: 400 })
    }

    // Read all payments from Google Sheets
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
        range: 'Payment!A1:F1000'
      })
    })

    if (!readResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 })
    }

    const readData = await readResponse.json()
    const rows = readData.result?.values || []

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No payments found' }, { status: 404 })
    }

    // Skip header row and filter payments
    const payments = rows.slice(1).map((row: string[]) => ({
      payment_id: row[0] || '',
      order_id: row[1] || '',
      amount: row[3] || '',
      status: row[4] || '',
      created_at: row[5] || ''
    }))

    let filteredPayments: PaymentData[]

    if (paymentId) {
      // Filter by payment ID
      filteredPayments = payments.filter((payment: PaymentData) => payment.payment_id === paymentId)
    } else if (orderId) {
      // Filter by order ID
      filteredPayments = payments.filter((payment: PaymentData) => payment.order_id === orderId)
    } else {
      filteredPayments = []
    }

    if (filteredPayments.length === 0) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // If searching by payment ID, return single payment, otherwise return array
    const data = paymentId ? filteredPayments[0] : filteredPayments

    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, amount, status, payment_method, currency } = body;

    if (!order_id || !amount || !status || !payment_method || !currency) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: order_id, amount, status, payment_method, currency'
      }, { status: 400 });
    }

    // Generate a unique payment ID
    const payment_id = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create payment record
    const payment: PaymentData = {
      order_id,
      amount,
      status,
      payment_method,
      currency,
      timestamp: new Date().toISOString()
    };

    // In a real application, you would save this to a database
    // For now, we'll just return the created payment
    return NextResponse.json({
      success: true,
      message: 'Payment created successfully',
      data: {
        payment_id,
        ...payment
      }
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create payment'
    }, { status: 500 });
  }
}