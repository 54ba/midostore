import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ProductService } from '../../../../lib/product-service';
import { isClerkConfigured } from '../../../../env.config';

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

    // Mock data for now to get the frontend working
    const mockProducts = [
      {
        id: 'prod_1',
        title: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 89.99,
        currency: 'USD',
        category: 'electronics',
        image: '/api/placeholder/300/300?text=Headphones',
        rating: 4.5,
        reviewCount: 128,
        soldCount: 1500,
        isFeatured: true,
        isActive: true,
        supplier: { name: 'TechSupplier Co.' },
        variants: []
      },
      {
        id: 'prod_2',
        title: 'Smart Fitness Watch',
        description: 'Advanced fitness tracking with heart rate monitor',
        price: 199.99,
        currency: 'USD',
        category: 'electronics',
        image: '/api/placeholder/300/300?text=SmartWatch',
        rating: 4.3,
        reviewCount: 89,
        soldCount: 750,
        isFeatured: true,
        isActive: true,
        supplier: { name: 'FitnessGear Ltd.' },
        variants: []
      },
      {
        id: 'prod_3',
        title: 'Organic Face Cream',
        description: 'Natural anti-aging face cream with organic ingredients',
        price: 29.99,
        currency: 'USD',
        category: 'beauty',
        image: '/api/placeholder/300/300?text=FaceCream',
        rating: 4.7,
        reviewCount: 256,
        soldCount: 3200,
        isFeatured: true,
        isActive: true,
        supplier: { name: 'BeautyNatural Inc.' },
        variants: []
      },
      {
        id: 'prod_4',
        title: 'Educational Building Blocks',
        description: 'STEM learning blocks for children aged 6-12',
        price: 45.99,
        currency: 'USD',
        category: 'toys',
        image: '/api/placeholder/300/300?text=BuildingBlocks',
        rating: 4.6,
        reviewCount: 167,
        soldCount: 2100,
        isFeatured: true,
        isActive: true,
        supplier: { name: 'EduToys Corp.' },
        variants: []
      }
    ];

    let result = mockProducts;

    // Filter by category if specified
    if (category && category !== 'all') {
      result = mockProducts.filter(product => product.category === category);
    }

    // Filter by search if specified
    if (search) {
      result = mockProducts.filter(product =>
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    result = result.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: result,
      pagination: {
        page,
        limit,
        total: mockProducts.length,
        totalPages: Math.ceil(mockProducts.length / limit)
      }
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
    // Check if Clerk is configured for authentication
    if (isClerkConfigured()) {
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
            price,
            alibaba_price
          ]]
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to add product: ${response.statusText}`);
      }

      return NextResponse.json({
        success: true,
        message: 'Product added successfully',
        product_id
      });
    } else {
      // Keyless mode - allow product creation without authentication
      const body = await request.json()

      const { alibaba_url, product_name, category, price, alibaba_price } = body

      if (!alibaba_url || !product_name || !category || !price || !alibaba_price) {
        return NextResponse.json({
          error: 'Missing required fields: alibaba_url, product_name, category, price, alibaba_price'
        }, { status: 400 })
      }

      // Generate unique product ID
      const product_id = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // In keyless mode, we can still process the product
      // You might want to store it in a local database or file system
      console.log('Product created in keyless mode:', {
        product_id,
        alibaba_url,
        product_name,
        category,
        price,
        alibaba_price
      });

      return NextResponse.json({
        success: true,
        message: 'Product added successfully (keyless mode)',
        product_id
      });
    }
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    );
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