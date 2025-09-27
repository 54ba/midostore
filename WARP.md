# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**MidoStore** is a sophisticated multi-seller dropshipping platform that combines Next.js, Python AI services, and MongoDB to create a comprehensive e-commerce ecosystem. The platform enables multiple sellers to customize and sell products while providing buyers with price comparison capabilities and AI-powered recommendations.

### Key Characteristics
- **Hybrid Architecture**: Node.js/Next.js frontend with Python AI backend services
- **Multi-Seller Platform**: Each product can have multiple seller versions with different pricing
- **AI-Powered**: Machine learning recommendations and analytics
- **Dynamic Services**: Configurable service management system
- **Gulf Market Focus**: Localized for Middle Eastern markets with currency conversion

## Architecture Overview

### System Components

#### 1. **Frontend Application** (`src/`)
- **Next.js 15** with App Router architecture
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Context** for state management (Cart, Wishlist, Auth)
- **Component-based**: Modular UI components in `src/components/`

#### 2. **Hybrid Service Layer** (`lib/`)
The service layer contains 30+ specialized services that handle different aspects of the platform:

**Core Business Services:**
- `seller-service.ts` - Multi-seller management and product customization
- `buyer-service.ts` - Product browsing, search, and comparison
- `product-service.ts` - Product catalog management
- `order-batching-service.ts` - Advanced order processing

**AI & Analytics Services:**
- `ai-orchestrator-service.ts` - Central AI decision making
- `ai-agent-supervisor.ts` - AI agent management
- `recommendation-service.ts` - Product recommendation engine
- `social-trend-analysis-service.ts` - Market trend analysis
- `analytics-service.ts` - Business intelligence

**Payment & Financial Services:**
- `crypto-payment-service.ts` - Cryptocurrency payment processing
- `enhanced-bybit-payment-service.ts` - Bybit integration
- `p2p-marketplace-service.ts` - Peer-to-peer trading
- `token-rewards-service.ts` - Reward system
- `exchange-rate-service.ts` - Multi-currency support

**E-commerce Features:**
- `bulk-pricing-service.ts` - Volume pricing and deals
- `advertising-service.ts` - Campaign management
- `shipping-tracking-service.ts` - Logistics integration
- `sharing-service.ts` - Product sharing capabilities

#### 3. **Python AI Engine** (`ai/`)
- **FastAPI Server** (`api_server.py`) - AI service API
- **Machine Learning Models** - Recommendation algorithms using LightFM
- **Virtual Environment** - Isolated Python dependencies
- **Service Scripts** - Easy startup and management

#### 4. **Database Layer**
- **MongoDB** - Primary database for scalable document storage
- **Multiple Collections** - Separate collections for sellers, products, analytics, orders
- **Optimized Indexes** - Performance-tuned database queries
- **Data Services** - Abstracted database operations

#### 5. **Dynamic Configuration System**
- **Service Detection** - Automatically finds and configures services
- **Health Monitoring** - Continuous service status checks
- **Environment Management** - Dynamic environment configuration
- **Process Management** - Automated service lifecycle handling

### Data Flow Architecture

```
Browser → Next.js App → API Routes → Service Layer → MongoDB
                    ↓
               Python AI Service → ML Models → Recommendations
                    ↑
              External APIs (Exchange Rates, Scraping)
```

### Multi-Seller Model

The platform implements a sophisticated multi-seller architecture:

1. **BaseProduct** - Master product catalog from suppliers (Alibaba/AliExpress)
2. **SellerProduct** - Seller-specific versions with custom pricing and descriptions
3. **Seller** - Individual seller accounts with business metrics
4. **Buyer Experience** - Price comparison and seller verification

## Development Commands

### Quick Start
```bash
# Development with all services
npm run quick:start

# Dynamic service management
npm run services:start
npm run services:status
```

### Build Commands
```bash
# Development build
npm run build

# Simple build
npm run build:simple

# Standalone build
npm run build:standalone

# Production build and deploy
npm run build:deploy
```

### Database Operations
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Run migrations
npm run db:migrate

# Open database studio
npm run db:studio

# Seed database with sample data
npm run db:seed

# Enhanced review seeding
npm run enhanced:reviews
```

### AI & Machine Learning
```bash
# Setup AI services
npm run ai:setup

# Start AI service
npm run ai:start

# Train ML models
npm run ai:train
```

### Service Management
```bash
# Start dynamic services
npm run services:start

# Start Web3/crypto services
npm run services:web3

# Check service status
npm run services:status

# View service configuration
npm run services:config
```

### Testing & Quality
```bash
# Run all tests
npm run test:all

# Test specific components
npm run test:apis
npm run test:orchestrator
npm run test:agents
npm run test:reviews

# Environment checks
npm run env:check

# Health monitoring
npm run health
```

### Deployment
```bash
# Netlify deployments
npm run netlify:deploy
npm run netlify:deploy:optimized
npm run netlify:deploy:ultra
npm run netlify:deploy:static

# Direct deployment
npm run deploy:direct
```

### Data Scraping
```bash
# Scrape products from suppliers
npm run scrape:products

# Test scraping services
npm run test:scraping
```

### Maintenance & Monitoring
```bash
# Clean build artifacts
npm run clean

# Monitor build status
npm run monitor

# Check function sizes (for Netlify)
npm run netlify:check
```

## Key Development Concepts

### Service-Oriented Architecture
- Each major feature is encapsulated in a dedicated service class
- Services are located in `lib/` and follow consistent patterns
- Cross-service communication through well-defined interfaces

### Multi-Environment Support
- Development: Local development with hot reloading
- Dynamic: Hybrid Node.js + Python services
- Production: Optimized builds with service orchestration

### AI Integration Patterns
- AI services run as separate Python processes
- Communication via HTTP API between Node.js and Python
- Real-time model training from user interactions
- TypeScript client (`src/lib/ai-client.ts`) for type-safe AI integration

### Database Design
- Document-oriented design optimized for e-commerce
- Separate collections for different business entities
- Optimized indexes for performance
- Analytics-friendly data structure

### Configuration Management
- Dynamic configuration system (`dynamic-config.js`)
- Environment-specific settings
- Service discovery and health monitoring
- Automated process management

## Testing Strategy

The platform includes comprehensive testing for:
- **API Endpoints** - Full API test coverage
- **AI Systems** - ML model performance and orchestrator logic
- **Services** - Individual service functionality
- **Authentication** - Auth system protection
- **Integration** - End-to-end workflow testing

## Common Development Patterns

### Adding New Services
1. Create service class in `lib/`
2. Add corresponding API route in `src/app/api/`
3. Update service configuration in `dynamic-config.js`
4. Add npm scripts for service management
5. Include in test suite

### AI/ML Integration
1. Python models in `ai/` directory
2. FastAPI endpoints for model access
3. TypeScript client for frontend integration
4. Database integration for training data

### Multi-Seller Features
1. Seller-specific business logic in `seller-service.ts`
2. Buyer comparison features in `buyer-service.ts`
3. Database collections for seller/product relationships
4. UI components for multi-seller displays

### Environment Configuration
- Use `env.template` for new environment variables
- Dynamic configuration for service-specific settings
- Netlify-specific environment handling
- Local development environment setup

This architecture enables rapid development of complex e-commerce features while maintaining code organization, type safety, and scalability.
