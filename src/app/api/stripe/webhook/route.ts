import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const PROXY_URL = 'https://api.internal.tasker.ai'
const CHAT_ROOM_UUID = "91d799d8-8f50-4e00-92b7-738e055f90c4"
const USER_UUID = "b3f753f4-ee49-4263-a1ec-1b798c8d5948"
const FUNCTION_UUID = "e5c8cf65-ab03-4943-a18c-42f77dd99e8f"
const SPREADSHEET_ID = '18EGqQ8F7mBO08nqDin9mwfLt_R-lB1xSDmlgI_BNyXw'

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe keys are available
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!stripeSecretKey || !webhookSecret) {
      return NextResponse.json(
        { success: false, error: 'No stripe keys provided' },
        { status: 500 }
      )
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20'
    })

    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { success: false, error: 'No signature provided' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        
        // Extract order_id from metadata
        const orderId = session.metadata?.order_id
        
        if (!orderId) {
          console.error('No order_id found in session metadata')
          return NextResponse.json(
            { success: false, error: 'No order_id in metadata' },
            { status: 400 }
          )
        }

        // Update payment status to completed
        try {
          // First, read existing payments to find the payment record
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
            throw new Error('Failed to read payments')
          }

          const readData = await readResponse.json()
          const payments = readData.result?.values || []
          
          if (payments.length === 0) {
            throw new Error('No payments found')
          }

          // Find the payment record for this order
          const headers = payments[0]
          const paymentRows = payments.slice(1)
          
          const orderIdIndex = headers.indexOf('order_id')
          const statusIndex = headers.indexOf('status')
          const stripePaymentIdIndex = headers.indexOf('stripe_payment_id')
          
          let paymentRowIndex = -1
          for (let i = 0; i < paymentRows.length; i++) {
            if (paymentRows[i][orderIdIndex] === orderId) {
              paymentRowIndex = i + 2 // +2 because we need to account for header row and 0-based index
              break
            }
          }

          if (paymentRowIndex === -1) {
            throw new Error('Payment record not found for order')
          }

          // Update the payment status and stripe payment ID
          const updateRange = `Payment!A${paymentRowIndex}:F${paymentRowIndex}`
          const currentRow = paymentRows[paymentRowIndex - 2]
          
          // Update status and stripe_payment_id
          currentRow[statusIndex] = 'completed'
          currentRow[stripePaymentIdIndex] = session.payment_intent as string

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
              range: updateRange,
              values: [currentRow],
              valueInputOption: 'RAW'
            })
          })

          if (!updateResponse.ok) {
            throw new Error('Failed to update payment status')
          }

          console.log(`Payment updated successfully for order: ${orderId}`)
          
        } catch (error: any) {
          console.error('Error updating payment status:', error.message)
          return NextResponse.json(
            { success: false, error: 'Failed to update payment status' },
            { status: 500 }
          )
        }
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        
        // Extract order_id from metadata
        const failedOrderId = failedPayment.metadata?.order_id
        
        if (!failedOrderId) {
          console.error('No order_id found in failed payment metadata')
          break
        }

        // Update payment status to failed
        try {
          // Read existing payments to find the payment record
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
            throw new Error('Failed to read payments')
          }

          const readData = await readResponse.json()
          const payments = readData.result?.values || []
          
          if (payments.length === 0) {
            throw new Error('No payments found')
          }

          // Find the payment record for this order
          const headers = payments[0]
          const paymentRows = payments.slice(1)
          
          const orderIdIndex = headers.indexOf('order_id')
          const statusIndex = headers.indexOf('status')
          
          let paymentRowIndex = -1
          for (let i = 0; i < paymentRows.length; i++) {
            if (paymentRows[i][orderIdIndex] === failedOrderId) {
              paymentRowIndex = i + 2 // +2 because we need to account for header row and 0-based index
              break
            }
          }

          if (paymentRowIndex === -1) {
            throw new Error('Payment record not found for failed order')
          }

          // Update the payment status to failed
          const updateRange = `Payment!A${paymentRowIndex}:F${paymentRowIndex}`
          const currentRow = paymentRows[paymentRowIndex - 2]
          
          // Update status to failed
          currentRow[statusIndex] = 'failed'

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
              range: updateRange,
              values: [currentRow],
              valueInputOption: 'RAW'
            })
          })

          if (!updateResponse.ok) {
            throw new Error('Failed to update failed payment status')
          }

          console.log(`Payment marked as failed for order: ${failedOrderId}`)
          
        } catch (error: any) {
          console.error('Error updating failed payment status:', error.message)
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ success: true, received: true })

  } catch (error: any) {
    console.error('Webhook error:', error.message)
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}