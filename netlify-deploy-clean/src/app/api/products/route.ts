import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ProductService } from '../../../../lib/product-service';

interface UserSession {
  user_id: string;
  email: string;
  [key: string]: any;
}

interface Product {
  product_id: string;
  alibaba_url: string;
  product_name: string;
  category: string;
  price: number;
  alibaba_price: number;
  [key: string]: any;
}

const PROXY_URL = process.env.PROXY_URL || 'http://localhost:3000';
const CHAT_ROOM_UUID = process.env.CHAT_ROOM_UUID || '';
const USER_UUID = process.env.USER_UUID || '';
const FUNCTION_UUID = process.env.FUNCTION_UUID || '';
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const locale = searchParams.get('locale') || 'en-AE';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const productService = new ProductService();

    let result;

    if (search) {
      result = await productService.searchProducts(search, locale, page, limit);
    } else if (category) {
      result = await productService.getProductsByCategory(category, locale, page, limit);
    } else {
      result = await productService.getFeaturedProducts(locale, limit);
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error getting products:', error);
    return NextResponse.json(
      { error: 'Failed to get products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')

    if (!authToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const userSession: UserSession = JSON.parse(authToken.value)
    const body = await request.json()

    const { alibaba_url, product_name, category, price, alibaba_price } = body

    if (!alibaba_url || !product_name || !category || !price || !alibaba_price) {
      return NextResponse.json({
        error: 'Missing required fields: alibaba_url, product_name, category, price, alibaba_price'
      }, { status: 400 })
    }

    // Generate unique product ID
    const product_id = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Add product to Google Sheets
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
        range: 'Product!A:F',
        values: [[
          product_id,
          alibaba_url,
          product_name,
          category,
          price.toString(),
          alibaba_price.toString()
        ]],
        valueInputOption: 'RAW'
      })
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
    }

    const newProduct: Product = {
      product_id,
      alibaba_url,
      product_name,
      category,
      price: price.toString(),
      alibaba_price: alibaba_price.toString()
    }

    return NextResponse.json({ success: true, data: newProduct })

  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')

    if (!authToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const userSession: UserSession = JSON.parse(authToken.value)
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID parameter is required' }, { status: 400 })
    }

    const body = await request.json()
    const { alibaba_url, product_name, category, price, alibaba_price } = body

    // First, read all products to find the row to update
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
        range: 'Product!A1:F1000'
      })
    })

    if (!readResponse.ok) {
      return NextResponse.json({ error: 'Failed to read products' }, { status: 500 })
    }

    const sheetsData = await readResponse.json()
    const rows = sheetsData.result?.values || []

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Find the product row (skip header)
    let productRowIndex = -1
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === productId) {
        productRowIndex = i + 1 // +1 because sheets are 1-indexed
        break
      }
    }

    if (productRowIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Get current product data
    const currentProduct = rows[productRowIndex - 1]

    // Update product in Google Sheets
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
        range: `Product!A${productRowIndex}:F${productRowIndex}`,
        values: [[
          productId,
          alibaba_url || currentProduct[1],
          product_name || currentProduct[2],
          category || currentProduct[3],
          (price !== undefined ? price.toString() : currentProduct[4]),
          (alibaba_price !== undefined ? alibaba_price.toString() : currentProduct[5])
        ]],
        valueInputOption: 'RAW'
      })
    })

    if (!updateResponse.ok) {
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
    }

    const updatedProduct: Product = {
      product_id: productId,
      alibaba_url: alibaba_url || currentProduct[1],
      product_name: product_name || currentProduct[2],
      category: category || currentProduct[3],
      price: (price !== undefined ? price.toString() : currentProduct[4]),
      alibaba_price: (alibaba_price !== undefined ? alibaba_price.toString() : currentProduct[5])
    }

    return NextResponse.json({ success: true, data: updatedProduct })

  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')

    if (!authToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const userSession: UserSession = JSON.parse(authToken.value)
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID parameter is required' }, { status: 400 })
    }

    // First, read all products to find the row to delete
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
        range: 'Product!A1:F1000'
      })
    })

    if (!readResponse.ok) {
      return NextResponse.json({ error: 'Failed to read products' }, { status: 500 })
    }

    const sheetsData = await readResponse.json()
    const rows = sheetsData.result?.values || []

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Find the product row (skip header)
    let productRowIndex = -1
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === productId) {
        productRowIndex = i + 1 // +1 because sheets are 1-indexed
        break
      }
    }

    if (productRowIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Clear the product row
    const deleteResponse = await fetch(`${PROXY_URL}/proxy/google-sheets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatRoomUUID: CHAT_ROOM_UUID,
        userUUID: USER_UUID,
        functionUUID: FUNCTION_UUID,
        operation: 'clear',
        spreadsheetId: SPREADSHEET_ID,
        range: `Product!A${productRowIndex}:F${productRowIndex}`
      })
    })

    if (!deleteResponse.ok) {
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: { message: 'Product deleted successfully' } })

  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}