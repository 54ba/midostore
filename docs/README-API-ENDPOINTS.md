# MidoStore API Endpoints & Services Documentation

## 🚀 **API Endpoints Overview**

### **Core Product APIs**
- **`GET /api/products`** - Get products with filtering, search, and pagination
- **`POST /api/products`** - Create new product (requires authentication)
- **`GET /api/products?category={category}`** - Get products by category
- **`GET /api/products?search={query}`** - Search products by query

### **User & Order Management**
- **`GET /api/users`** - Get user information
- **`POST /api/users`** - Create/update user profile
- **`GET /api/orders`** - Get order history
- **`POST /api/orders`** - Create new order
- **`GET /api/payments`** - Get payment information

### **Authentication & Payment**
- **`POST /api/stripe/create-checkout-session`** - Create Stripe checkout session
- **`POST /api/stripe/webhook`** - Stripe webhook handler

### **Analytics & AI**
- **`GET /api/analytics`** - Comprehensive analytics data
- **`GET /api/analytics?action=live-sales&limit={n}`** - Live sales updates
- **`GET /api/analytics?action=price-updates&limit={n}`** - Price change updates
- **`GET /api/analytics?action=inventory-updates&limit={n}`** - Inventory updates
- **`GET /api/analytics/live-sales`** - Live sales ticker data
- **`GET /api/recommendations`** - AI-powered product recommendations
- **`GET /api/ai-recommendations`** - Advanced AI recommendations

### **Localization & Currency**
- **`GET /api/localization`** - Localization settings and currency conversion
- **`GET /api/localization?action=price-updates&limit={n}`** - Price updates
- **`GET /api/exchange-rates`** - Currency exchange rates
- **`POST /api/exchange-rates/update`** - Update exchange rates

### **E-commerce Features**
- **`GET /api/bulk-pricing`** - Bulk pricing and tier information
- **`POST /api/bulk-pricing`** - Create bulk pricing deals
- **`GET /api/advertising`** - Advertising campaign data
- **`POST /api/advertising`** - Create advertising campaigns
- **`GET /api/sharing`** - Product sharing and embedding
- **`POST /api/sharing`** - Create shareable links

### **Crypto & Web3**
- **`GET /api/crypto`** - Cryptocurrency payment information
- **`POST /api/crypto`** - Process crypto payments
- **`GET /api/web3`** - Web3 wallet and blockchain operations
- **`POST /api/web3`** - Web3 transactions
- **`GET /api/p2p-marketplace`** - P2P marketplace listings
- **`POST /api/p2p-marketplace`** - Create P2P listings
- **`GET /api/token-rewards`** - Token reward system
- **`POST /api/token-rewards`** - Claim rewards

### **Shipping & Logistics**
- **`GET /api/shipping`** - Shipping rates and tracking
- **`POST /api/shipping`** - Calculate shipping costs

### **Social & Marketing**
- **`GET /api/social-trends`** - Social media trend analysis
- **`POST /api/social-trends/analyze`** - Analyze social trends

### **Scraping & Data**
- **`GET /api/scraping/jobs`** - Get scraping job status
- **`POST /api/scraping/start`** - Start new scraping job
- **`GET /api/scraping/ai-powered`** - AI-powered scraping results

### **Reviews & Content**
- **`GET /api/reviews`** - Product reviews
- **`POST /api/reviews`** - Create/import reviews

### **AI Orchestrator & Management**
- **`GET /api/ai-orchestrator`** - AI orchestrator status and decisions
- **`POST /api/ai-orchestrator`** - Control AI orchestrator
- **`GET /api/ai-agent-supervisor`** - AI agent supervisor status
- **`POST /api/ai-agent-supervisor`** - Manage AI agents
- **`GET /api/role-management`** - User role management
- **`POST /api/role-management`** - Update user roles

### **Utility APIs**
- **`GET /api/placeholder/{width}/{height}?text={text}`** - Generate placeholder images

## 🔧 **Service Layer Architecture**

### **Core Services**
- **`ProductService`** - Product management and operations
- **`ExchangeRateService`** - Currency conversion and exchange rates
- **`PricingService`** - Dynamic pricing and profit calculations
- **`AnalyticsService`** - Data analytics and insights

### **AI & Analytics Services**
- **`AIOrchestratorService`** - Central AI decision making
- **`AIAgentSupervisorService`** - AI agent management
- **`RoleManagementService`** - User role and permissions
- **`AILocationRecommendationService`** - Location-based recommendations
- **`RecommendationService`** - Product recommendations
- **`SocialTrendAnalysisService`** - Social media analysis
- **`SimpleAnalyticsService`** - Basic analytics

### **E-commerce Services**
- **`BulkPricingService`** - Bulk pricing and deals
- **`AdvertisingService`** - Advertising campaign management
- **`SharingService`** - Product sharing and embedding
- **`CryptoPaymentService`** - Cryptocurrency payments
- **`Web3Service`** - Blockchain and Web3 operations
- **`P2PMarketplaceService`** - P2P trading
- **`TokenRewardsService`** - Reward system

### **Infrastructure Services**
- **`ScrapingService`** - Web scraping operations
- **`AIPoweredScrapingService`** - AI-enhanced scraping
- **`ShippingTrackingService`** - Shipping and logistics
- **`EnhancedLocalizationService`** - Localization and currency
- **`RealTimePriceMonitor`** - Price monitoring
- **`ScheduledTasks`** - Background task management

## 📊 **Data Models & Types**

### **Core Entities**
- **`Product`** - Product information and metadata
- **`User`** - User accounts and profiles
- **`Order`** - Order management and tracking
- **`Payment`** - Payment processing and history

### **Live Data Types**
- **`LiveSale`** - Real-time sales data
- **`LivePriceUpdate`** - Price change notifications
- **`LiveInventoryUpdate`** - Inventory status updates

### **AI & Analytics Types**
- **`AIOrchestratorDecision`** - AI decision records
- **`AIAgentTask`** - AI agent task management
- **`AnalyticsData`** - Analytics and metrics
- **`SocialTrend`** - Social media trends

## 🚀 **Usage Examples**

### **Get Live Sales Data**
```bash
curl "http://localhost:3000/api/analytics?action=live-sales&limit=10"
```

### **Get Products by Category**
```bash
curl "http://localhost:3000/api/products?category=electronics&limit=20"
```

### **Get Price Updates**
```bash
curl "http://localhost:3000/api/localization?action=price-updates&limit=5"
```

### **Get AI Recommendations**
```bash
curl "http://localhost:3000/api/recommendations?type=popular&category=electronics&nItems=5"
```

## 🔐 **Authentication & Security**

- **Public Endpoints**: Products, analytics, recommendations
- **Protected Endpoints**: User management, orders, payments, admin functions
- **Authentication**: Clerk integration with role-based access control
- **Rate Limiting**: Implemented for API protection
- **CORS**: Configured for cross-origin requests

## 📈 **Performance & Monitoring**

- **Response Times**: Target < 200ms for most endpoints
- **Caching**: Redis caching for frequently accessed data
- **Monitoring**: Real-time performance metrics
- **Error Handling**: Comprehensive error logging and reporting

## 🛠 **Development & Testing**

- **Environment**: Development, staging, and production configurations
- **Testing**: API endpoint testing with mock data
- **Documentation**: OpenAPI/Swagger documentation (planned)
- **Versioning**: API versioning strategy for future updates

---

*This documentation covers all available API endpoints and services in the MidoStore application. For specific implementation details, refer to the individual service files in the `lib/` directory.*