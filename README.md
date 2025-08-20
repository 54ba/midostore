# Mido Dropshipping Platform

## About
{
  "needsGoogleSheets": true,
  "db_name": "Mido Dropshipping Database",
  "app_name": "Mido Dropshipping Platform",
  "has_userLogin_auth": "true",
  "sheets": [
    {
      "name": "User",
      "schema": [
        { "name": "user_id", "type": "string", "description": "Unique user identifier" },
        { "name": "email", "type": "string", "description": "User email for login" },
        { "name": "password", "type": "string", "description": "Hashed password using SHA256 encryption" },
        { "name": "full_name", "type": "string", "description": "User's full name" },
        { "name": "phone", "type": "string", "description": "User's phone number" },
        { "name": "created_at", "type": "string", "description": "Account creation timestamp" }
      ]
    },
    {
      "name": "Product",
      "schema": [
        { "name": "product_id", "type": "string", "description": "Unique product identifier" },
        { "name": "alibaba_url", "type": "string", "description": "Original Alibaba product URL" },
        { "name": "product_name", "type": "string", "description": "Product title" },
        { "name": "category", "type": "string", "description": "Product category (toys/cosmetics)" },
        { "name": "price", "type": "number", "description": "Selling price in USD" },
        { "name": "alibaba_price", "type": "number", "description": "Original Alibaba price" }
      ]
    },
    {
      "name": "Order",
      "schema": [
        { "name": "order_id", "type": "string", "description": "Unique order identifier" },
        { "name": "user_id", "type": "string", "description": "Foreign key to User" },
        { "name": "product_id", "type": "string", "description": "Foreign key to Product" },
        { "name": "product_name", "type": "string", "description": "Product name for display" },
        { "name": "quantity", "type": "number", "description": "Order quantity" },
        { "name": "total_amount", "type": "number", "description": "Total order amount" }
      ]
    },
    {
      "name": "Payment",
      "schema": [
        { "name": "payment_id", "type": "string", "description": "Unique payment identifier" },
        { "name": "order_id", "type": "string", "description": "Foreign key to Order" },
        { "name": "stripe_payment_id", "type": "string", "description": "Stripe payment intent ID" },
        { "name": "amount", "type": "number", "description": "Payment amount" },
        { "name": "status", "type": "string", "description": "Payment status (pending/completed/failed)" },
        { "name": "created_at", "type": "string", "description": "Payment timestamp" }
      ]
    }
  ]
}

## Project Description
create a website for dropshipping to connect clients to alibaba using Google Sheets as the backend


## 🚀 Live Demo
- **Application URL**: `<will be available after deployment>`
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript

## ✨ Features
- {
  "needsGoogleSheets": true,
  "db_name": "Mido Dropshipping Database",
  "app_name": "Mido Dropshipping Platform",
  "has_userLogin_auth": "true",
  "sheets": [
    {
      "name": "User",
      "schema": [
        { "name": "user_id", "type": "string", "description": "Unique user identifier" },
        { "name": "email", "type": "string", "description": "User email for login" },
        { "name": "password", "type": "string", "description": "Hashed password using SHA256 encryption" },
        { "name": "full_name", "type": "string", "description": "User's full name" },
        { "name": "phone", "type": "string", "description": "User's phone number" },
        { "name": "created_at", "type": "string", "description": "Account creation timestamp" }
      ]
    },
    {
      "name": "Product",
      "schema": [
        { "name": "product_id", "type": "string", "description": "Unique product identifier" },
        { "name": "alibaba_url", "type": "string", "description": "Original Alibaba product URL" },
        { "name": "product_name", "type": "string", "description": "Product title" },
        { "name": "category", "type": "string", "description": "Product category (toys/cosmetics)" },
        { "name": "price", "type": "number", "description": "Selling price in USD" },
        { "name": "alibaba_price", "type": "number", "description": "Original Alibaba price" }
      ]
    },
    {
      "name": "Order",
      "schema": [
        { "name": "order_id", "type": "string", "description": "Unique order identifier" },
        { "name": "user_id", "type": "string", "description": "Foreign key to User" },
        { "name": "product_id", "type": "string", "description": "Foreign key to Product" },
        { "name": "product_name", "type": "string", "description": "Product name for display" },
        { "name": "quantity", "type": "number", "description": "Order quantity" },
        { "name": "total_amount", "type": "number", "description": "Total order amount" }
      ]
    },
    {
      "name": "Payment",
      "schema": [
        { "name": "payment_id", "type": "string", "description": "Unique payment identifier" },
        { "name": "order_id", "type": "string", "description": "Foreign key to Order" },
        { "name": "stripe_payment_id", "type": "string", "description": "Stripe payment intent ID" },
        { "name": "amount", "type": "number", "description": "Payment amount" },
        { "name": "status", "type": "string", "description": "Payment status (pending/completed/failed)" },
        { "name": "created_at", "type": "string", "description": "Payment timestamp" }
      ]
    }
  ]
}

- User Authentication System

- Google Sheets Integration

- RESTful API Backend

- Reusable UI Components


## 🛠 Tech Stack
- **Frontend**: Next.js 14, TypeScript, React
- **Styling**: Tailwind CSS (Custom Global Styles)
- **Backend**: Next.js API Routes
- **Database**: Google Sheets

- **Authentication**: Custom Auth System


## 📁 Project Structure
```
/
├── src/
│   ├── app/
│   │   ├── api/          # API routes

│   │   ├── landing-page/     # Landing page showcasing Mido's dropshipping services for toys and cosmetics with modern design and call-to-action buttons
│   │   ├── register/     # User registration form with full name, email, password, and phone number fields (covers register endpoint)
│   │   ├── login/     # User login form with email and password authentication (covers login endpoint)
│   │   ├── dashboard/     # Main dashboard displaying featured toys and cosmetics products imported from Alibaba (covers Product endpoint GET functionality)
│   │   ├── products/${product.id}/     # Detailed product page showing product information, pricing, Alibaba link, and add to cart functionality (covers Product endpoint single item queries)
│   │   ├── cart/     # Shopping cart page to review selected items, adjust quantities, view total amount, and proceed to checkout
│   │   ├── checkout/     # Checkout page that initiates Stripe payment process and creates orders (covers Order and Payment endpoints POST functionality)
│   │   ├── order-confirmation/     # Order confirmation page showing order summary and payment status after successful checkout
│   │   ├── orders/     # Order history page displaying past orders with details and payment status (covers Order and Payment endpoints GET functionality)
│   │   ├── profile/     # User profile page to view and edit personal information (covers User endpoint GET and PUT functionality)
│   │   ├── contact/     # Contact us page for customer support and inquiries

│   │   └── components/   # Reusable components

│   ├── layouts/          # Layout components

│   └── ...
├── .env.local            # Environment variables

├── package.json
└── README.md
```

## 🔌 API Endpoints
### register
- **Path**: `src/app/api/auth/register/route.ts`
- **Purpose**: Create new user account with email, password, full name, and phone number
- **Description**: This endpoint handles user registration for the Mido dropshipping platform. It creates a new user account by validating the provided information (email, password, full name, phone number), checking for existing users, and storing the new user data in Google Sheets. Upon successful registration, it automatically logs the user in by setting an authentication cookie.
- **Inputs**: {"method": "POST", "body": {"email": "string (required) - User's email address for login", "password": "string (required) - User's password (already hashed with SHA256)", "full_name": "string (required) - User's full name", "phone": "string (required) - User's phone number"}}
- **Outputs**: {"success": true, "data": {"user_id": "string - Generated UUID for the user", "email": "string - User's email", "full_name": "string - User's full name", "phone": "string - User's phone number", "message": "string - Success message"}} or {"success": false, "error": "string - Error message describing what went wrong"}

### login
- **Path**: `src/app/api/auth/login/route.ts`
- **Purpose**: Authenticate user with email and password, return user session
- **Description**: Authentication endpoint for user login and session management. The POST method handles user login by validating email and password against the Google Sheets database, creates a user session, and sets an authentication cookie. The GET method checks if a user is currently authenticated by validating the auth_token cookie and returns the user session data.
- **Inputs**: {"POST": {"method": "POST", "body": {"email": "string (required)", "password": "string (required, SHA256 hashed)"}}, "GET": {"method": "GET", "cookies": {"auth_token": "string (JWT-like session token)"}}}
- **Outputs**: {"POST_success": {"success": true, "data": {"user": {"user_id": "string", "email": "string", "full_name": "string", "phone": "string"}, "message": "Login successful"}}, "POST_error": {"success": false, "error": "string", "status": 400|401|500}, "GET_success": {"success": true, "data": {"user": {"user_id": "string", "email": "string", "full_name": "string", "phone": "string"}, "authenticated": true}}, "GET_error": {"success": false, "error": "string", "status": 401}}

### User
- **Path**: `src/app/api/users/route.ts`
- **Purpose**: GET: Fetch user profile (?id=user_id), PUT: Update user profile (?id=user_id)
- **Description**: This file contains API endpoints for user profile management. The GET function fetches user profile data by user ID (from query parameter or authenticated session), returning user information excluding the password for security. The PUT function updates user profile information (full_name, phone, email) for the authenticated user, preserving existing data and updating the authentication cookie when necessary. Both functions require authentication via auth_token cookie and interact with Google Sheets as the database backend.
- **Inputs**: GET method:
- Query parameters: id (optional, string) - User ID to fetch profile for, defaults to authenticated user's ID
- Headers: Cookie with auth_token for authentication
- No request body

PUT method:
- Query parameters: id (optional, string) - User ID to update profile for, defaults to authenticated user's ID  
- Headers: Cookie with auth_token for authentication
- Request body (JSON): {
  "full_name": "string (optional)",
  "phone": "string (optional)", 
  "email": "string (optional)"
}
- **Outputs**: GET method success response:
{
  "success": true,
  "data": {
    "user_id": "string",
    "email": "string", 
    "full_name": "string",
    "phone": "string",
    "created_at": "string"
  }
}

PUT method success response:
{
  "success": true,
  "data": {
    "user_id": "string",
    "email": "string",
    "full_name": "string", 
    "phone": "string",
    "created_at": "string"
  }
}

Error responses:
- 401: {"error": "Authentication required"} or {"error": "Invalid authentication token"}
- 400: {"error": "User ID parameter is required"} or {"error": "At least one field (full_name, phone, email) is required for update"}
- 404: {"error": "User not found"}
- 500: {"error": "Failed to fetch user data"} or {"error": "Failed to update user data"} or {"error": "Internal server error"}

### Product
- **Path**: `src/app/api/products/route.ts`
- **Purpose**: GET: Fetch all products or single product (?id=product_id), POST: Create new product, PUT: Update product (?id=product_id), DELETE: Delete product (?id=product_id)
- **Description**: This file contains CRUD operations for managing products in the Mido dropshipping platform. It includes GET (fetch all products or single product by ID), POST (create new product), PUT (update existing product), and DELETE (remove product) endpoints. All operations interact with Google Sheets as the database and require user authentication via cookies.
- **Inputs**: {
  "GET": {
    "method": "GET",
    "query": {
      "id": "string (optional) - Product ID to fetch specific product"
    },
    "headers": {
      "Cookie": "auth_token - Required for authentication"
    }
  },
  "POST": {
    "method": "POST",
    "body": {
      "alibaba_url": "string (required) - Original Alibaba product URL",
      "product_name": "string (required) - Product title",
      "category": "string (required) - Product category (toys/cosmetics)",
      "price": "number (required) - Selling price in USD",
      "alibaba_price": "number (required) - Original Alibaba price"
    },
    "headers": {
      "Cookie": "auth_token - Required for authentication",
      "Content-Type": "application/json"
    }
  },
  "PUT": {
    "method": "PUT",
    "query": {
      "id": "string (required) - Product ID to update"
    },
    "body": {
      "alibaba_url": "string (optional) - Original Alibaba product URL",
      "product_name": "string (optional) - Product title",
      "category": "string (optional) - Product category (toys/cosmetics)",
      "price": "number (optional) - Selling price in USD",
      "alibaba_price": "number (optional) - Original Alibaba price"
    },
    "headers": {
      "Cookie": "auth_token - Required for authentication",
      "Content-Type": "application/json"
    }
  },
  "DELETE": {
    "method": "DELETE",
    "query": {
      "id": "string (required) - Product ID to delete"
    },
    "headers": {
      "Cookie": "auth_token - Required for authentication"
    }
  }
}
- **Outputs**: {
  "GET": {
    "success": {
      "status": 200,
      "body": {
        "success": true,
        "data": "Product[] | Product - Array of products or single product object"
      }
    },
    "error": {
      "status": 401,
      "body": {
        "error": "Authentication required"
      }
    },
    "not_found": {
      "status": 404,
      "body": {
        "error": "Product not found"
      }
    }
  },
  "POST": {
    "success": {
      "status": 200,
      "body": {
        "success": true,
        "data": "Product - Created product object"
      }
    },
    "error": {
      "status": 400,
      "body": {
        "error": "Missing required fields: alibaba_url, product_name, category, price, alibaba_price"
      }
    }
  },
  "PUT": {
    "success": {
      "status": 200,
      "body": {
        "success": true,
        "data": "Product - Updated product object"
      }
    },
    "error": {
      "status": 400,
      "body": {
        "error": "Product ID parameter is required"
      }
    }
  },
  "DELETE": {
    "success": {
      "status": 200,
      "body": {
        "success": true,
        "data": {
          "message": "Product deleted successfully"
        }
      }
    },
    "error": {
      "status": 404,
      "body": {
        "error": "Product not found"
      }
    }
  }
}

### Order
- **Path**: `src/app/api/orders/route.ts`
- **Purpose**: GET: Fetch user orders (?user_id=user_id) or single order (?id=order_id), POST: Create new order, PUT: Update order (?id=order_id)
- **Description**: Order management API endpoint that handles CRUD operations for orders in a dropshipping application. Provides functionality to fetch user orders (with optional filtering by order ID or user ID), create new orders, and update existing orders. All operations require user authentication via auth_token cookie and interact with Google Sheets as the database backend.
- **Inputs**: {
  "GET": {
    "method": "GET",
    "query_params": {
      "id": "string (optional) - Specific order ID to fetch",
      "user_id": "string (optional) - User ID to filter orders (defaults to authenticated user)"
    },
    "headers": {
      "Cookie": "auth_token - Required for authentication"
    }
  },
  "POST": {
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Cookie": "auth_token - Required for authentication"
    },
    "body": {
      "product_id": "string (required) - Product identifier",
      "product_name": "string (required) - Product name for display",
      "quantity": "number (required) - Order quantity",
      "total_amount": "number (required) - Total order amount"
    }
  },
  "PUT": {
    "method": "PUT",
    "query_params": {
      "id": "string (required) - Order ID to update"
    },
    "headers": {
      "Content-Type": "application/json",
      "Cookie": "auth_token - Required for authentication"
    },
    "body": {
      "product_id": "string (optional) - Updated product identifier",
      "product_name": "string (optional) - Updated product name",
      "quantity": "number (optional) - Updated order quantity",
      "total_amount": "number (optional) - Updated total amount"
    }
  }
}
- **Outputs**: {
  "GET": {
    "success_single_order": {
      "success": true,
      "data": {
        "order_id": "string",
        "user_id": "string",
        "product_id": "string",
        "product_name": "string",
        "quantity": "string",
        "total_amount": "string"
      }
    },
    "success_multiple_orders": {
      "success": true,
      "data": [
        {
          "order_id": "string",
          "user_id": "string",
          "product_id": "string",
          "product_name": "string",
          "quantity": "string",
          "total_amount": "string"
        }
      ]
    },
    "error_401": {
      "error": "Authentication required"
    },
    "error_404": {
      "error": "Order not found"
    }
  },
  "POST": {
    "success": {
      "success": true,
      "data": {
        "order_id": "string",
        "user_id": "string",
        "product_id": "string",
        "product_name": "string",
        "quantity": "string",
        "total_amount": "string"
      }
    },
    "error_400": {
      "error": "Missing required fields: product_id, product_name, quantity, total_amount"
    },
    "error_401": {
      "error": "Authentication required"
    }
  },
  "PUT": {
    "success": {
      "success": true,
      "data": {
        "order_id": "string",
        "user_id": "string",
        "product_id": "string",
        "product_name": "string",
        "quantity": "string",
        "total_amount": "string"
      }
    },
    "error_400": {
      "error": "Order ID parameter is required"
    },
    "error_401": {
      "error": "Authentication required"
    },
    "error_403": {
      "error": "Unauthorized to update this order"
    },
    "error_404": {
      "error": "Order not found"
    }
  }
}

### Payment
- **Path**: `src/app/api/payments/route.ts`
- **Purpose**: GET: Fetch payment details (?id=payment_id or ?order_id=order_id), POST: Create payment record
- **Description**: Payment API endpoint that handles payment record management. GET function fetches payment details by payment ID or order ID with user authentication. POST function creates new payment records with order ID, Stripe payment ID, amount, and status. Both functions require user authentication via auth_token cookie and interact with Google Sheets Payment table.
- **Inputs**: GET: Query parameters - id (payment_id) or order_id (order_id). Requires auth_token cookie for authentication.
POST: Request body - { order_id: string, stripe_payment_id: string, amount: number, status: string }. Requires auth_token cookie for authentication.
- **Outputs**: GET: Returns { success: true, data: Payment | Payment[] } with payment details filtered by payment_id or order_id.
POST: Returns { success: true, data: Payment } with the newly created payment record including generated payment_id and timestamp.

### create-checkout-session
- **Path**: `src/app/api/stripe/create-checkout-session/route.ts`
- **Purpose**: Create Stripe checkout session for subscription payment
- **Description**: This endpoint creates a Stripe checkout session for subscription payment. It authenticates the user via auth_token cookie, validates the required priceId parameter, and creates a Stripe checkout session with subscription mode. The session includes customer email, user metadata, and configurable success/cancel URLs.
- **Inputs**: {"POST": {"method": "POST", "body": {"priceId": "string (required) - Stripe price ID for the subscription", "successUrl": "string (optional) - URL to redirect after successful payment", "cancelUrl": "string (optional) - URL to redirect after cancelled payment"}, "headers": {"Cookie": "auth_token - Required authentication cookie containing user session data"}}}
- **Outputs**: {"success": {"success": true, "data": {"sessionId": "string - Stripe checkout session ID", "url": "string - Stripe checkout session URL"}}, "error_no_stripe_keys": {"success": false, "error": "No stripe keys provided"}, "error_unauthorized": {"success": false, "error": "Authentication required"}, "error_invalid_token": {"success": false, "error": "Invalid authentication token"}, "error_missing_price": {"success": false, "error": "Price ID is required"}, "error_stripe": {"success": false, "error": "string - Stripe error message"}}

### webhook
- **Path**: `src/app/api/stripe/webhook/route.ts`
- **Purpose**: Handle Stripe webhook notifications for payment confirmations
- **Description**: Stripe webhook handler that processes payment confirmations and failures. Handles checkout.session.completed events to update payment status to 'completed' and payment_intent.payment_failed events to update payment status to 'failed'. Updates the Payment sheet in Google Sheets with the appropriate status and Stripe payment intent ID.
- **Inputs**: {"method": "POST", "headers": {"stripe-signature": "string"}, "body": "Raw webhook payload from Stripe"}
- **Outputs**: {"success": true, "received": true} for successful webhook processing, or {"success": false, "error": "error message"} for failures


## 📄 Frontend Pages
### landing-page
- **Route**: `/`
- **Purpose**: Landing page showcasing Mido's dropshipping services for toys and cosmetics with modern design and call-to-action buttons
- **File**: `src/app/page.tsx`

### register-page
- **Route**: `/register`
- **Purpose**: User registration form with full name, email, password, and phone number fields (covers register endpoint)
- **File**: `src/app/(auth)/register/page.tsx`

### login-page
- **Route**: `/login`
- **Purpose**: User login form with email and password authentication (covers login endpoint)
- **File**: `src/app/(auth)/login/page.tsx`

### dashboard
- **Route**: `/dashboard`
- **Purpose**: Main dashboard displaying featured toys and cosmetics products imported from Alibaba (covers Product endpoint GET functionality)
- **File**: `src/app/(dashboard)/dashboard/page.tsx`

### product-detail
- **Route**: `/products/${product.id}`
- **Purpose**: Detailed product page showing product information, pricing, Alibaba link, and add to cart functionality (covers Product endpoint single item queries)
- **File**: `src/app/(dashboard)/products/[id]/page.tsx`

### cart
- **Route**: `/cart`
- **Purpose**: Shopping cart page to review selected items, adjust quantities, view total amount, and proceed to checkout
- **File**: `src/app/(dashboard)/cart/page.tsx`

### checkout
- **Route**: `/checkout`
- **Purpose**: Checkout page that initiates Stripe payment process and creates orders (covers Order and Payment endpoints POST functionality)
- **File**: `src/app/(dashboard)/checkout/page.tsx`

### order-confirmation
- **Route**: `/order-confirmation`
- **Purpose**: Order confirmation page showing order summary and payment status after successful checkout
- **File**: `src/app/(dashboard)/order-confirmation/page.tsx`

### order-history
- **Route**: `/orders`
- **Purpose**: Order history page displaying past orders with details and payment status (covers Order and Payment endpoints GET functionality)
- **File**: `src/app/(dashboard)/orders/page.tsx`

### profile
- **Route**: `/profile`
- **Purpose**: User profile page to view and edit personal information (covers User endpoint GET and PUT functionality)
- **File**: `src/app/(dashboard)/profile/page.tsx`

### contact
- **Route**: `/contact`
- **Purpose**: Contact us page for customer support and inquiries
- **File**: `src/app/(dashboard)/contact/page.tsx`


## 🧩 Components
### Header
- **Dependencies**: react, next/link
- **Used in**: /dashboard, /products/[id], /cart, /checkout, /order-confirmation, /orders, /profile, /contact
- **Props**: id: string
- **Styling**: bg-white border-b border-gray-200 sticky top-0 z-50

### ProductCard
- **Dependencies**: react, next/link, next/image
- **Used in**: /dashboard
- **Props**: id: string, product: { product_id: string; product_name: string; category: string; price: number; alibaba_price: number; alibaba_url: string; }, onAddToCart: (productId: string, quantity: number) => void
- **Styling**: bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group overflow-hidden

### ProductImageGallery
- **Dependencies**: react, next/image
- **Used in**: /products/[id]
- **Props**: id: string, images: string[], productName: string
- **Styling**: product-image-gallery-container

### ProductInfo
- **Dependencies**: react
- **Used in**: /products/[id]
- **Props**: id: string, product: { product_id: string; product_name: string; category: string; price: number; alibaba_price: number; alibaba_url: string; }, onAddToCart: (productId: string, quantity: number) => void
- **Styling**: bg-white rounded-lg shadow-sm border overflow-hidden

### QuantitySelector
- **Dependencies**: react
- **Used in**: /products/[id], /cart
- **Props**: id: string, quantity: number, onQuantityChange: (quantity: number) => void, min: number, max: number
- **Styling**: flex items-center space-x-2

### CartItem
- **Dependencies**: react, next/image
- **Used in**: /cart
- **Props**: id: string, item: { product_id: string; product_name: string; price: number; quantity: number; }, onQuantityChange: (productId: string, quantity: number) => void, onRemove: (productId: string) => void
- **Styling**: bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md

### OrderSummary
- **Dependencies**: react
- **Used in**: /cart, /checkout
- **Props**: id: string, items: { product_id: string; product_name: string; price: number; quantity: number; }[], subtotal: number, shipping: number, total: number
- **Styling**: bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6

### CheckoutForm
- **Dependencies**: react
- **Used in**: /checkout
- **Props**: id: string, onSubmit: (formData: { email: string; fullName: string; phone: string; address: string; city: string; country: string; }) => void, loading: boolean
- **Styling**: max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8

### OrderConfirmationCard
- **Dependencies**: react
- **Used in**: /order-confirmation
- **Props**: id: string, order: { order_id: string; product_name: string; quantity: number; total_amount: number; }, paymentStatus: string
- **Styling**: order-confirmation-card-container

### OrderHistoryTable
- **Dependencies**: react
- **Used in**: /orders
- **Props**: id: string, orders: { order_id: string; product_name: string; quantity: number; total_amount: number; created_at?: string; }[], payments: { order_id: string; status: string; created_at: string; }[]
- **Styling**: bg-white rounded-lg shadow-sm border border-gray-200

### ProfileForm
- **Dependencies**: react
- **Used in**: /profile
- **Props**: id: string, user: { user_id: string; email: string; full_name: string; phone: string; }, onSubmit: (userData: { full_name: string; phone: string; email: string; }) => void, loading: boolean
- **Styling**: max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8

### ContactForm
- **Dependencies**: react
- **Used in**: /contact
- **Props**: id: string, onSubmit: (contactData: { name: string; email: string; subject: string; message: string; }) => void, loading: boolean
- **Styling**: w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8

### HeroSection
- **Dependencies**: react, next/link
- **Used in**: /
- **Props**: id: string, title: string, subtitle: string, ctaText: string, ctaLink: string
- **Styling**: bg-teal-700 text-white overflow-hidden

### FeatureGrid
- **Dependencies**: react
- **Used in**: /
- **Props**: id: string, features: { title: string; description: string; icon: string; }[]
- **Styling**: feature-grid-section

### TestimonialCard
- **Dependencies**: react, next/image
- **Used in**: /
- **Props**: id: string, testimonial: { name: string; avatar: string; rating: number; comment: string; }
- **Styling**: bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300

### Footer
- **Dependencies**: react, next/link
- **Used in**: /, /register, /login, /dashboard, /products/[id], /cart, /checkout, /order-confirmation, /orders, /profile, /contact
- **Props**: id: string
- **Styling**: bg-white border-t border-gray-200 mt-auto

### AuthForm
- **Dependencies**: react, next/link
- **Used in**: /register, /login
- **Props**: id: string, type: 'login' | 'register', onSubmit: (formData: any) => void, loading: boolean, error: string | null
- **Styling**: min-h-screen bg-gray-50 flex items-center justify-center

### LoadingSpinner
- **Dependencies**: react
- **Used in**: /dashboard, /products/[id], /cart, /checkout, /orders, /profile
- **Props**: id: string, size: 'sm' | 'md' | 'lg', color: string
- **Styling**: flex items-center justify-center

### Button
- **Dependencies**: react
- **Used in**: /, /register, /login, /dashboard, /products/[id], /cart, /checkout, /profile, /contact
- **Props**: id: string, variant: 'primary' | 'secondary' | 'danger' | 'outline', size: 'sm' | 'md' | 'lg', children: React.ReactNode, onClick: () => void, disabled: boolean, loading: boolean, type: 'button' | 'submit' | 'reset'
- **Styling**: inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius)] font-medium ring-offset-[rgb(var(--background))] transition-all duration-200 transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]

### Input
- **Dependencies**: react
- **Used in**: /register, /login, /checkout, /profile, /contact
- **Props**: id: string, type: 'text' | 'email' | 'password' | 'tel' | 'number', placeholder: string, value: string, onChange: (value: string) => void, required: boolean, disabled: boolean, error: string | null, label: string
- **Styling**: w-full space-y-2

### NavigationLogger
- **Dependencies**: None
- **Used in**: Multiple pages


## 📐 Layouts
### layout
- **File**: `src/app/layout.tsx`
- **Purpose**: Root layout with global styles, metadata, and basic HTML structure for the entire application
- **Type**: Root Layout

### layout
- **File**: `src/app/(auth)/layout.tsx`
- **Purpose**: Minimal authentication layout for login and register pages with clean, focused design without navigation elements

### layout
- **File**: `src/app/(dashboard)/layout.tsx`
- **Purpose**: Dashboard layout with navigation header, user menu, cart icon, and sidebar for authenticated users accessing the main application features


## 📊 Google Sheets Integration
**Spreadsheet URL**: [View Spreadsheet](https://docs.google.com/spreadsheets/d/18EGqQ8F7mBO08nqDin9mwfLt_R-lB1xSDmlgI_BNyXw/edit)

### User
- **Sheet ID**: `0`
- **URL**: [User](https://docs.google.com/spreadsheets/d/18EGqQ8F7mBO08nqDin9mwfLt_R-lB1xSDmlgI_BNyXw/edit#gid=0)
- **Schema**:
  - **user_id** (string): Unique user identifier
  - **email** (string): User email for login
  - **password** (string): Hashed password using SHA256 encryption
  - **full_name** (string): User's full name
  - **phone** (string): User's phone number
  - **created_at** (string): Account creation timestamp

### Product
- **Sheet ID**: `1`
- **URL**: [Product](https://docs.google.com/spreadsheets/d/18EGqQ8F7mBO08nqDin9mwfLt_R-lB1xSDmlgI_BNyXw/edit#gid=1)
- **Schema**:
  - **product_id** (string): Unique product identifier
  - **alibaba_url** (string): Original Alibaba product URL
  - **product_name** (string): Product title
  - **category** (string): Product category (toys/cosmetics)
  - **price** (number): Selling price in USD
  - **alibaba_price** (number): Original Alibaba price

### Order
- **Sheet ID**: `2`
- **URL**: [Order](https://docs.google.com/spreadsheets/d/18EGqQ8F7mBO08nqDin9mwfLt_R-lB1xSDmlgI_BNyXw/edit#gid=2)
- **Schema**:
  - **order_id** (string): Unique order identifier
  - **user_id** (string): Foreign key to User
  - **product_id** (string): Foreign key to Product
  - **product_name** (string): Product name for display
  - **quantity** (number): Order quantity
  - **total_amount** (number): Total order amount

### Payment
- **Sheet ID**: `3`
- **URL**: [Payment](https://docs.google.com/spreadsheets/d/18EGqQ8F7mBO08nqDin9mwfLt_R-lB1xSDmlgI_BNyXw/edit#gid=3)
- **Schema**:
  - **payment_id** (string): Unique payment identifier
  - **order_id** (string): Foreign key to Order
  - **stripe_payment_id** (string): Stripe payment intent ID
  - **amount** (number): Payment amount
  - **status** (string): Payment status (pending/completed/failed)
  - **created_at** (string): Payment timestamp


## 🔐 Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```env
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_next_public_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
NEXT_PUBLIC_BASE_URL=your_next_public_base_url_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```


## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mido-dropshipping-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables in `.env.local`

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Usage
# MidoHub Design System Guidelines

**Website Name: MidoHub** - A modern dropshipping platform connecting Gulf consumers to affordable toys and cosmetics.

• **Navigation Structure**: Primary navigation resides in a clean header bar with the MidoHub logo on the left, main navigation menu items in the center (Dashboard, Products, Orders, Cart), and user account dropdown with profile photo on the right. All authenticated pages maintain this same header structure with no secondary navigation bars.

• **Color Scheme**: Primary brand color is deep teal (#0f766e), secondary color is warm amber (#f59e0b), background uses light gray (#f9fafb), text is charcoal (#374151), success states use emerald (#10b981), and error states use red (#ef4444). All buttons, links, and interactive elements strictly follow this color palette.

• **Landing Page Layout**: Full-width hero section with centered content, followed by three-column feature grid, testimonials section with avatar cards in a two-column layout, and footer with four-column link structure. Hero uses teal background with white text, features use white cards with subtle shadows on light gray background.

• **Authentication Pages Layout**: Login and register pages use identical centered card layouts (max-width 400px) on a light gray background, with the MidoHub logo at top, form fields stacked vertically with consistent spacing, primary teal submit buttons, and subtle link styling for switching between login/register using amber color.

• **Dashboard Layout**: Main content area spans full width with no sidebar navigation, using a grid system for product cards (4 columns on desktop, 2 on tablet, 1 on mobile). Each product card has white background, rounded corners, product image at top, title and price in charcoal text, and teal "Add to Cart" button at bottom.

• **Product Detail Page**: Two-column layout with product image gallery on left (60% width) and product information panel on right (40% width). Product info panel has white background, includes title, price in large teal text, description, quantity selector with +/- buttons, and prominent "Add to Cart" button in teal with white text.

• **Cart and Checkout Pages**: Single-column layout with item list cards stacked vertically, each card showing product thumbnail, name, price, and quantity controls on white background. Order summary section uses light gray background with teal accent borders. Checkout form uses two-column layout for shipping/billing information.

• **Order Confirmation and History**: Clean table layout for order history with alternating row colors (white and very light gray), order confirmation uses centered success message with green checkmark icon, order details in structured card format with clear typography hierarchy using charcoal headings and gray body text.

• **Profile Page**: Two-column layout with user information form on left and account settings on right, both sections use white background cards with subtle shadows. Form inputs have consistent border styling and teal focus states, save buttons match primary button styling.

• **Responsive Breakpoints**: Mobile-first design with breakpoints at 640px (sm), 768px (md), 1024px (lg), and 1280px (xl). Navigation collapses to hamburger menu below 768px, product grids adjust from 4-2-1 columns, and two-column layouts stack vertically on mobile with proper spacing maintained throughout all screen sizes.

### User Flow
1. **The app should be paid with a subscription model using Stripe.**

2. **User visits the landing page showcasing Mido's modern design, highlighting dropshipping services for toys and cosmetics.**

3. **User navigates to the 'Sign Up' page to create an account by providing full name, email, password, and phone number, followed by a signup confirmation.**

4. **User logs in from the 'Login' page using their email and password.**

5. **After login, the user is redirected to the dashboard where they can view featured toys and cosmetics products imported from Alibaba.**

6. **User clicks on a product to view detailed information including the product name, price, Alibaba price, and a link to the original Alibaba page.**

7. **User adds a product to the cart by specifying the quantity and clicking 'Add to Cart'.**

8. **User navigates to the 'Cart' page to review selected items, adjust quantities, and view the total amount.**

9. **User initiates the checkout process by clicking 'Proceed to Checkout'.**

10. **User is redirected to the Stripe Checkout page for subscription payment.**

11. **Upon successful payment, user data is updated with the active subscription information.**

12. **Stripe sends a webhook notification to confirm payment success or failure.**

13. **User is redirected back to the 'Order Confirmation' page showing the order summary and payment status.**

14. **User can access the 'Order History' page to view past orders, including order details and payment status.**

15. **For any questions or concerns, user can access the 'Contact Us' page to get in touch with Mido's support team.**


## 🏗 Build for Production

```bash
npm run build
npm start
```

## 📚 Additional Information



### Data Schema
```json
[
  {
    "name": "user_id",
    "type": "string"
  },
  {
    "name": "email",
    "type": "string"
  },
  {
    "name": "password",
    "type": "string"
  },
  {
    "name": "full_name",
    "type": "string"
  },
  {
    "name": "phone",
    "type": "string"
  },
  {
    "name": "created_at",
    "type": "string"
  }
]
```


## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License
This project is created using Tasker's Full Stack App Generator.

---
*Generated automatically by Tasker AI*