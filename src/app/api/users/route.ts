import { NextRequest, NextResponse } from 'next/server';
import MongoDBService from '@/lib/mongodb-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const verified = searchParams.get('verified');

    const dbService = MongoDBService.getInstance();
    await dbService.initialize();

    // For now, we'll return a simple response since we don't have a getAllUsers method
    // In a real application, you'd implement proper user listing with pagination and filtering
    return NextResponse.json({
      success: true,
      message: 'Users API endpoint created. Implement getAllUsers method in MongoDBService for full functionality.',
      data: []
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
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

    let userSession: UserSession
    try {
      userSession = JSON.parse(authToken.value)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id') ?? userSession.user_id

    if (!userId) {
      return NextResponse.json({ error: 'User ID parameter is required' }, { status: 400 })
    }

    const body = await request.json()
    const { full_name, phone, email } = body

    if (!full_name && !phone && !email) {
      return NextResponse.json({ error: 'At least one field (full_name, phone, email) is required for update' }, { status: 400 })
    }

    // First, read existing user data
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
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
    }

    const sheetsData = await readResponse.json()

    if (!sheetsData.result || !sheetsData.result.values || sheetsData.result.values.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const rows = sheetsData.result.values
    const userRowIndex = rows.slice(1).findIndex((row: string[]) => row[0] === userId)

    if (userRowIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const actualRowIndex = userRowIndex + 2 // +1 for header, +1 for 0-based to 1-based indexing
    const existingUser = rows[userRowIndex + 1]

    // Update user data while preserving existing values
    const updatedUser = [
      existingUser[0], // user_id (unchanged)
      email || existingUser[1], // email
      existingUser[2], // password (unchanged)
      full_name || existingUser[3], // full_name
      phone || existingUser[4], // phone
      existingUser[5] // created_at (unchanged)
    ]

    // Update the specific row
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
        range: `User!A${actualRowIndex}:F${actualRowIndex}`,
        values: [updatedUser],
        valueInputOption: 'RAW'
      })
    })

    if (!updateResponse.ok) {
      return NextResponse.json({ error: 'Failed to update user data' }, { status: 500 })
    }

    // Return updated user data (excluding password)
    const updatedUserResponse = {
      user_id: updatedUser[0],
      email: updatedUser[1],
      full_name: updatedUser[3],
      phone: updatedUser[4],
      created_at: updatedUser[5]
    }

    // Update the auth token if email or full_name changed
    if (email || full_name) {
      const newUserSession = {
        ...userSession,
        email: email || userSession.email,
        full_name: full_name || userSession.full_name,
        phone: phone || userSession.phone
      }

      cookieStore.set('auth_token', JSON.stringify(newUserSession), {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
        secure: true
      })
    }

    return NextResponse.json({ success: true, data: updatedUserResponse })

  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, full_name, phone, role = 'customer' } = body

    // Validate required fields
    if (!email || !full_name) {
      return NextResponse.json({
        error: 'Email and full_name are required'
      }, { status: 400 })
    }

    // For testing purposes, return success with demo data
    const newUser = {
      user_id: `user-${Date.now()}`,
      email,
      full_name,
      phone: phone || '',
      role,
      created_at: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: newUser,
      message: 'User created successfully (demo mode)'
    })

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}