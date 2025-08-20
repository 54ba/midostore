import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const PROXY_URL = 'https://api.internal.tasker.ai'
const CHAT_ROOM_UUID = "91d799d8-8f50-4e00-92b7-738e055f90c4"
const USER_UUID = "b3f753f4-ee49-4263-a1ec-1b798c8d5948"
const FUNCTION_UUID = "f324061f-985b-4c0a-8b0c-fbe6c98a3541"
const SPREADSHEET_ID = '18EGqQ8F7mBO08nqDin9mwfLt_R-lB1xSDmlgI_BNyXw'

interface UserSession {
  user_id: string
  email: string
  full_name: string
  phone: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Read users from Google Sheets
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
        range: 'User!A1:F1000'
      })
    })

    if (!readResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to read user data' },
        { status: 500 }
      )
    }

    const readData = await readResponse.json()
    const users = readData.result?.values || []

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Find user by email (assuming password is already hashed with SHA256)
    const userRow = users.find((user: string[]) => user[1] === email && user[2] === password)

    if (!userRow) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create user session
    const userSession: UserSession = {
      user_id: userRow[0],
      email: userRow[1],
      full_name: userRow[3],
      phone: userRow[4]
    }

    // Set auth cookie
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
        user: userSession,
        message: 'Login successful'
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')

    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const userSession: UserSession = JSON.parse(authToken.value)

    return NextResponse.json({
      success: true,
      data: {
        user: userSession,
        authenticated: true
      }
    })

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { success: false, error: 'Invalid authentication token' },
      { status: 401 }
    )
  }
}