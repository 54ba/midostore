#!/bin/bash

# Test script for MidoHub in keyless mode
# This script tests the API endpoints without Clerk authentication

echo "🧪 Testing MidoHub in Keyless Mode"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL (adjust if your server runs on a different port)
BASE_URL="http://localhost:3000"

echo -e "\n${YELLOW}1. Testing Health Check${NC}"
echo "GET $BASE_URL/api/products"

# Test GET products endpoint
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$BASE_URL/api/products")
HTTP_STATUS=$(echo "$RESPONSE" | tail -n1 | sed 's/.*HTTP_STATUS://')
RESPONSE_BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ GET /api/products - SUCCESS (Status: $HTTP_STATUS)${NC}"
    echo "Response: $RESPONSE_BODY"
else
    echo -e "${RED}❌ GET /api/products - FAILED (Status: $HTTP_STATUS)${NC}"
    echo "Response: $RESPONSE_BODY"
fi

echo -e "\n${YELLOW}2. Testing Product Creation (Keyless Mode)${NC}"
echo "POST $BASE_URL/api/products"

# Test POST products endpoint with sample data
SAMPLE_PRODUCT='{
  "alibaba_url": "https://example.alibaba.com/product/123",
  "product_name": "Test Product",
  "category": "electronics",
  "price": 99.99,
  "alibaba_price": 79.99
}'

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
    -X POST \
    -H "Content-Type: application/json" \
    -d "$SAMPLE_PRODUCT" \
    "$BASE_URL/api/products")

HTTP_STATUS=$(echo "$RESPONSE" | tail -n1 | sed 's/.*HTTP_STATUS://')
RESPONSE_BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ POST /api/products - SUCCESS (Status: $HTTP_STATUS)${NC}"
    echo "Response: $RESPONSE_BODY"
else
    echo -e "${RED}❌ POST /api/products - FAILED (Status: $HTTP_STATUS)${NC}"
    echo "Response: $RESPONSE_BODY"
fi

echo -e "\n${YELLOW}3. Testing Products with Category Filter${NC}"
echo "GET $BASE_URL/api/products?category=electronics"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$BASE_URL/api/products?category=electronics")
HTTP_STATUS=$(echo "$RESPONSE" | tail -n1 | sed 's/.*HTTP_STATUS://')
RESPONSE_BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ GET /api/products?category=electronics - SUCCESS (Status: $HTTP_STATUS)${NC}"
    echo "Response: $RESPONSE_BODY"
else
    echo -e "${RED}❌ GET /api/products?category=electronics - FAILED (Status: $HTTP_STATUS)${NC}"
    echo "Response: $RESPONSE_BODY"
fi

echo -e "\n${YELLOW}4. Testing Products with Search${NC}"
echo "GET $BASE_URL/api/products?search=test"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$BASE_URL/api/products?search=test")
HTTP_STATUS=$(echo "$RESPONSE" | tail -n1 | sed 's/.*HTTP_STATUS://')
RESPONSE_BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ GET /api/products?search=test - SUCCESS (Status: $HTTP_STATUS)${NC}"
    echo "Response: $RESPONSE_BODY"
else
    echo -e "${RED}❌ GET /api/products?search=test - FAILED (Status: $HTTP_STATUS)${NC}"
    echo "Response: $RESPONSE_BODY"
fi

echo -e "\n${YELLOW}5. Testing Main Page${NC}"
echo "GET $BASE_URL/"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$BASE_URL/")
HTTP_STATUS=$(echo "$RESPONSE" | tail -n1 | sed 's/.*HTTP_STATUS://')

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ GET / - SUCCESS (Status: $HTTP_STATUS)${NC}"
    echo "Main page loads successfully"
else
    echo -e "${RED}❌ GET / - FAILED (Status: $HTTP_STATUS)${NC}"
fi

echo -e "\n${YELLOW}6. Testing Dashboard Page${NC}"
echo "GET $BASE_URL/dashboard"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$BASE_URL/dashboard")
HTTP_STATUS=$(echo "$RESPONSE" | tail -n1 | sed 's/.*HTTP_STATUS://')

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ GET /dashboard - SUCCESS (Status: $HTTP_STATUS)${NC}"
    echo "Dashboard page loads successfully"
else
    echo -e "${RED}❌ GET /dashboard - FAILED (Status: $HTTP_STATUS)${NC}"
fi

echo -e "\n${YELLOW}7. Testing Products Page${NC}"
echo "GET $BASE_URL/products"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$BASE_URL/products")
HTTP_STATUS=$(echo "$RESPONSE" | tail -n1 | sed 's/.*HTTP_STATUS://')

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ GET /products - SUCCESS (Status: $HTTP_STATUS)${NC}"
    echo "Products page loads successfully"
else
    echo -e "${RED}❌ GET /products - FAILED (Status: $HTTP_STATUS)${NC}"
fi

echo -e "\n${YELLOW}Summary${NC}"
echo "========"
echo "This test verifies that MidoHub works in keyless mode without Clerk authentication."
echo "All endpoints should return 200 status codes and work without requiring user login."
echo ""
echo "To enable Clerk authentication:"
echo "1. Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in your environment variables"
echo "2. Set CLERK_SECRET_KEY in your environment variables"
echo "3. Restart your development server"
echo ""
echo "For more information, see CLERK_SETUP_GUIDE.md"