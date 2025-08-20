import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

// Required for static export compatibility
export const dynamic = 'force-static'

const PROXY_URL = 'https://api.internal.tasker.ai'
const CHAT_ROOM_UUID = "91d799d8-8f50-4e00-92b7-738e055f90c4"
const USER_UUID = "b3f753f4-ee49-4263-a1ec-1b798c8d5948"
const FUNCTION_UUID = "55a21942-3b81-4103-8311-c9b772423a11"
const SPREADSHEET_ID = '18EGqQ8F7mBO08nqDin9mwfLt_R-lB1xSDmlgI_BNyXw'

interface RegisterRequest {
  email: string
  password: string
  full_name: string
  phone: string
}

interface UserSession {
  user_id: string
  email: string
  full_name: string
  phone: string
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json()
    const { email, password, full_name, phone } = body

    // Validate required fields
    if (!email || !password || !full_name || !phone) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if user already exists
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
        range: 'User!A:F'
      })
    })

    if (!readResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to check existing users' },
        { status: 500 }
      )
    }

    const readData = await readResponse.json()
    const existingUsers = readData.result?.values || []

    // Check if email already exists (skip header row)
    const emailExists = existingUsers.slice(1).some((row: string[]) => row[1] === email)

    if (emailExists) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Generate user ID and timestamp
    const userId = uuidv4()
    const createdAt = new Date().toISOString()

    // Create new user record
    const writeResponse = await fetch(`${PROXY_URL}/proxy/google-sheets`, {
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
        range: 'User!A:F',
        values: [[userId, email, password, full_name, phone, createdAt]],
        valueInputOption: 'RAW'
      })
    })

    if (!writeResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    // Create user session
    const userSession: UserSession = {
      user_id: userId,
      email,
      full_name,
      phone
    }

    // Set authentication cookie
    const cookieStore = await cookies()
    cookieStore.set('auth_token', JSON.stringify(userSession), {
      httpOnly: true,
      sameSite: 'None',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: true
    })

    return NextResponse.json({
      success: true,
      data: {
        user_id: userId,
        email,
        full_name,
        phone,
        message: 'Account created successfully'
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}