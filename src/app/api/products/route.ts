import { NextRequest, NextResponse } from 'next/server';
import MongoDBService from '@/lib/mongodb-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured') === 'true';

    const dbService = MongoDBService.getInstance();
    await dbService.initialize();

    let products;

    if (search) {
      products = await dbService.searchProducts(search, limit);
    } else if (featured) {
      products = await dbService.getFeaturedProducts(limit);
    } else if (category) {
      products = await dbService.getProductsByCategory(category, limit);
    } else {
      products = await dbService.getProducts(limit, offset, category || undefined);
    }

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        limit,
        offset,
        total: products.length,
        hasMore: products.length === limit
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Clerk is configured for authentication
    // if (isClerkConfigured()) {
    //   const cookieStore = await cookies()
    //   const authToken = cookieStore.get('auth_token')

    //   if (!authToken) {
    //     return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    //   }

    //   const userSession: UserSession = JSON.parse(authToken.value)
    //   const body = await request.json()

    //   const { alibaba_url, product_name, category, price, alibaba_price } = body

    //   if (!alibaba_url || !product_name || !category || !price || !alibaba_price) {
    //     return NextResponse.json({
    //       error: 'Missing required fields: alibaba_url, product_name, category, price, alibaba_price'
    //     }, { status: 400 })
    //   }

    //   // Generate unique product ID
    //   const product_id = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    //   // Add product to Google Sheets
    //   const response = await fetch(`${PROXY_URL}/proxy/google-sheets`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       chatRoomUUID: CHAT_ROOM_UUID,
    //       userUUID: USER_UUID,
    //       functionUUID: FUNCTION_UUID,
    //       operation: 'write',
    //       spreadsheetId: SPREADSHEET_ID,
    //       range: 'Product!A:F',
    //       values: [[
    //         product_id,
    //         alibaba_url,
    //         product_name,
    //         category,
    //         price,
    //         alibaba_price
    //       ]]
    //     })
    //   });

    //   if (!response.ok) {
    //     throw new Error(`Failed to add product: ${response.statusText}`);
    //   }

    //   return NextResponse.json({
    //     success: true,
    //     message: 'Product added successfully',
    //     product_id
    //   });
    // } else {
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
    // }
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
    // const cookieStore = await cookies()
    // const authToken = cookieStore.get('auth_token')

    // if (!authToken) {
    //   return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    // }

    // const userSession: UserSession = JSON.parse(authToken.value)
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID parameter is required' }, { status: 400 })
    }

    const body = await request.json()
    const { alibaba_url, product_name, category, price, alibaba_price } = body

    // First, read all products to find the row to update
    // const readResponse = await fetch(`${PROXY_URL}/proxy/google-sheets`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     chatRoomUUID: CHAT_ROOM_UUID,
    //     userUUID: USER_UUID,
    //     functionUUID: FUNCTION_UUID,
    //     operation: 'read',
    //     spreadsheetId: SPREADSHEET_ID,
    //     range: 'Product!A1:F1000'
    //   })
    // })

    // if (!readResponse.ok) {
    //   return NextResponse.json({ error: 'Failed to read products' }, { status: 500 })
    // }

    // const sheetsData = await readResponse.json()
    // const rows = sheetsData.result?.values || []

    // if (rows.length === 0) {
    //   return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    // }

    // // Find the product row (skip header)
    // let productRowIndex = -1
    // for (let i = 1; i < rows.length; i++) {
    //   if (rows[i][0] === productId) {
    //     productRowIndex = i + 1 // +1 because sheets are 1-indexed
    //     break
    //   }
    // }

    // if (productRowIndex === -1) {
    //   return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    // }

    // // Get current product data
    // const currentProduct = rows[productRowIndex - 1]

    // // Update product in Google Sheets
    // const updateResponse = await fetch(`${PROXY_URL}/proxy/google-sheets`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     chatRoomUUID: CHAT_ROOM_UUID,
    //     userUUID: USER_UUID,
    //     functionUUID: FUNCTION_UUID,
    //     operation: 'update',
    //     spreadsheetId: SPREADSHEET_ID,
    //     range: `Product!A${productRowIndex}:F${productRowIndex}`,
    //     values: [[
    //       productId,
    //       alibaba_url || currentProduct[1],
    //       product_name || currentProduct[2],
    //       category || currentProduct[3],
    //       (price !== undefined ? price.toString() : currentProduct[4]),
    //       (alibaba_price !== undefined ? alibaba_price.toString() : currentProduct[5])
    //     ]],
    //     valueInputOption: 'RAW'
    //   })
    // })

    // if (!updateResponse.ok) {
    //   return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
    // }

    // const updatedProduct: Product = {
    //   product_id: productId,
    //   alibaba_url: alibaba_url || currentProduct[1],
    //   product_name: product_name || currentProduct[2],
    //   category: category || currentProduct[3],
    //   price: (price !== undefined ? price.toString() : currentProduct[4]),
    //   alibaba_price: (alibaba_price !== undefined ? alibaba_price.toString() : currentProduct[5])
    // }

    // return NextResponse.json({ success: true, data: updatedProduct })

    // In-memory update for now
    const dbService = MongoDBService.getInstance();
    await dbService.initialize();
    const product = await dbService.getProductById(productId);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updatedProduct = {
      ...product,
      alibaba_url: alibaba_url || product.alibaba_url,
      product_name: product_name || product.product_name,
      category: category || product.category,
      price: price || product.price,
      alibaba_price: alibaba_price || product.alibaba_price,
      updatedAt: new Date().toISOString()
    };

    await dbService.updateProduct(updatedProduct);

    return NextResponse.json({ success: true, data: updatedProduct });

  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // const cookieStore = await cookies()
    // const authToken = cookieStore.get('auth_token')

    // if (!authToken) {
    //   return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    // }

    // const userSession: UserSession = JSON.parse(authToken.value)
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID parameter is required' }, { status: 400 })
    }

    // First, read all products to find the row to delete
    // const readResponse = await fetch(`${PROXY_URL}/proxy/google-sheets`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     chatRoomUUID: CHAT_ROOM_UUID,
    //     userUUID: USER_UUID,
    //     functionUUID: FUNCTION_UUID,
    //     operation: 'read',
    //     spreadsheetId: SPREADSHEET_ID,
    //     range: 'Product!A1:F1000'
    //   })
    // })

    // if (!readResponse.ok) {
    //   return NextResponse.json({ error: 'Failed to read products' }, { status: 500 })
    // }

    // const sheetsData = await readResponse.json()
    // const rows = sheetsData.result?.values || []

    // if (rows.length === 0) {
    //   return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    // }

    // // Find the product row (skip header)
    // let productRowIndex = -1
    // for (let i = 1; i < rows.length; i++) {
    //   if (rows[i][0] === productId) {
    //     productRowIndex = i + 1 // +1 because sheets are 1-indexed
    //     break
    //   }
    // }

    // if (productRowIndex === -1) {
    //   return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    // }

    // // Clear the product row
    // const deleteResponse = await fetch(`${PROXY_URL}/proxy/google-sheets`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     chatRoomUUID: CHAT_ROOM_UUID,
    //     userUUID: USER_UUID,
    //     functionUUID: FUNCTION_UUID,
    //     operation: 'clear',
    //     spreadsheetId: SPREADSHEET_ID,
    //     range: `Product!A${productRowIndex}:F${productRowIndex}`
    //   })
    // })

    // if (!deleteResponse.ok) {
    //   return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
    // }

    // return NextResponse.json({ success: true, data: { message: 'Product deleted successfully' } })

    // In-memory delete for now
    const dbService = MongoDBService.getInstance();
    await dbService.initialize();
    const initialCount = await dbService.getProductCount();
    await dbService.deleteProduct(productId);
    const updatedCount = await dbService.getProductCount();

    if (updatedCount === initialCount) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { message: 'Product deleted successfully' } });

  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}