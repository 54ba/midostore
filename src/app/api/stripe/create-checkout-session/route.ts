import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

interface UserSession {
  user_id: string
  email: string
  full_name: string
}

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe keys are available
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: 'No stripe keys provided' },
        { status: 500 }
      )
    }

    // Check authentication
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')

    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    let userSession: UserSession
    try {
      userSession = JSON.parse(authToken.value)
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid authentication token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { priceId, successUrl, cancelUrl } = body

    if (!priceId) {
      return NextResponse.json(
        { success: false, error: 'Price ID is required' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: userSession.email,
      metadata: {
        user_id: userSession.user_id,
        user_email: userSession.email,
      },
      success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    })

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url
      }
    })

  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}