# 🚀 Dynamic Dropshipping Store Services

This document explains how to start and use the dynamic services that power the MidoHub dropshipping platform with real-time data instead of hardcoded content.

## 🎯 Overview

The store now uses **real-time dynamic data** from:
- **AI-powered scraping services** for product data
- **Live analytics** and recommendations
- **Real-time updates** and notifications
- **Dynamic pricing** and inventory management
- **AI orchestration** for intelligent operations

## 🚀 Quick Start

### Option 1: Simple Startup (Recommended)
```bash
# Start everything with one command
./start-dynamic.sh
```

### Option 2: Manual Startup
```bash
# 1. Seed the database first
npx tsx scripts/comprehensive-seed.ts

# 2. Start all services
./scripts/start-dynamic-services.sh
```

### Option 3: Individual Services
```bash
# Start specific service categories
npm run start:ai          # AI services only
npm run start:scraping    # Scraping services only
npm run start:analytics   # Analytics services only
```

## 🗄️ Database Setup

### Prerequisites
- PostgreSQL database running
- Environment variables configured (see `.env.example`)
- Prisma CLI installed: `npm install -g prisma`

### Initial Setup
```bash
# 1. Set up environment
cp .env.example .env
# Edit .env with your database credentials

# 2. Run migrations
npx prisma migrate deploy

# 3. Seed initial data
npx tsx scripts/comprehensive-seed.ts
```

### What Gets Seeded
- **Gulf Countries**: UAE, Saudi Arabia, Kuwait, Qatar, Bahrain, Oman
- **Suppliers**: 6 verified suppliers from different countries
- **Products**: 120+ products across 8 categories
- **Reviews**: 3-8 reviews per product
- **Exchange Rates**: Realistic currency conversion rates

## 🔧 Service Architecture

### 🤖 AI Services
```
AI Agent Supervisor     → Manages AI workflows and coordination
AI Orchestrator        → Centralized AI command center
AI Location Service     → Location-based recommendations
AI Scraping Service     → Intelligent product data extraction
```

### 🕷️ Scraping Services
```
AI-Powered Scraping     → Smart product data extraction
Product Service         → Product management and updates
Scraping Service        → Basic scraping operations
```

### 📊 Analytics Services
```
Analytics Service       → Basic analytics and metrics
Enhanced Analytics      → Advanced business intelligence
Recommendation Service  → Product recommendations
AI Recommendations      → AI-powered suggestions
```

### 💼 Business Services
```
Order Batching          → Batch order processing
Bulk Pricing           → Volume-based pricing
Pricing Service        → Dynamic pricing management
Exchange Rates         → Currency conversion
```

### ⏰ Scheduled Tasks
```
Scheduled Tasks        → Automated operations and maintenance
```

## 📊 Dynamic Data Sources

### Real-Time Products
- **Live scraping** from Alibaba/AliExpress
- **AI-powered** data extraction and validation
- **Automatic updates** every 15-30 minutes
- **Smart categorization** and tagging

### Live Analytics
- **Real-time sales** tracking
- **Active user** monitoring
- **Inventory levels** and stock updates
- **Conversion rates** and performance metrics

### Dynamic Recommendations
- **Personalized** based on user behavior
- **Trending** products from real data
- **Category-based** suggestions
- **AI-powered** insights

### Live Updates Feed
- **Product updates** in real-time
- **New reviews** and ratings
- **Inventory changes** and stock updates
- **Price adjustments** and promotions

## 🔄 Service Lifecycle

### Starting Services
1. **Database Check**: Verifies database connectivity and data
2. **Service Initialization**: Starts all service instances
3. **Health Checks**: Monitors service status
4. **Data Loading**: Populates initial data and caches

### Running Services
- **Continuous Operation**: Services run in background
- **Real-time Updates**: Data refreshes automatically
- **Error Handling**: Automatic retry and recovery
- **Performance Monitoring**: Logs and metrics collection

### Stopping Services
- **Graceful Shutdown**: Saves state and closes connections
- **Cleanup**: Removes temporary files and processes
- **Log Archival**: Preserves logs for analysis

## 📁 File Structure

```
scripts/
├── start-dynamic-services.sh      # Main service starter
├── comprehensive-seed.ts          # Database seeding
└── start-dynamic.sh              # Simple startup script

lib/
├── dynamic-data-service.ts       # Dynamic data provider
├── ai-powered-scraping-service.ts # AI scraping
├── analytics-service.ts          # Analytics
├── recommendation-service.ts      # Recommendations
└── ...                          # Other services

logs/                             # Service logs
pids/                             # Process IDs
```

## 🎮 Usage Examples

### Using Dynamic Data in Components

```tsx
import { dynamicDataService } from '@/lib/dynamic-data-service';

function MyComponent() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Get real-time featured products
    const loadProducts = async () => {
      const featured = await dynamicDataService.getFeaturedProducts(8);
      setProducts(featured);
    };

    loadProducts();

    // Refresh every 5 minutes
    const interval = setInterval(loadProducts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Real-Time Updates

```tsx
import { dynamicDataService } from '@/lib/dynamic-data-service';

function LiveUpdates() {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const loadUpdates = async () => {
      const liveUpdates = await dynamicDataService.getLiveUpdates(10);
      setUpdates(liveUpdates);
    };

    loadUpdates();

    // Update every 10 seconds
    const interval = setInterval(loadUpdates, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {updates.map(update => (
        <UpdateItem key={update.id} update={update} />
      ))}
    </div>
  );
}
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check database status
npx prisma db execute --stdin <<< "SELECT 1"

# Verify environment variables
cat .env | grep DATABASE_URL
```

#### 2. Services Not Starting
```bash
# Check service logs
tail -f logs/*.log

# Check process status
ls -la pids/

# Restart specific service
kill $(cat pids/service-name.pid)
```

#### 3. No Data Displayed
```bash
# Check if database is seeded
npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"Product\""

# Re-seed if needed
npx tsx scripts/comprehensive-seed.ts
```

#### 4. Performance Issues
```bash
# Check service resource usage
ps aux | grep node

# Monitor logs for errors
tail -f logs/*.log | grep ERROR
```

### Debug Mode

Enable debug logging by setting environment variables:
```bash
export DEBUG=*
export LOG_LEVEL=debug
```

## 📈 Monitoring & Maintenance

### Service Health Checks
```bash
# Check all services
./scripts/check-service-health.sh

# Monitor specific service
tail -f logs/ai-scraping.log
```

### Performance Metrics
- **Response Times**: API endpoint performance
- **Data Freshness**: How recent the data is
- **Error Rates**: Service reliability metrics
- **Resource Usage**: CPU and memory consumption

### Regular Maintenance
- **Daily**: Check service logs and error rates
- **Weekly**: Review performance metrics and optimize
- **Monthly**: Update service configurations and dependencies

## 🔮 Future Enhancements

### Planned Features
- **Real-time Chat**: Customer support integration
- **Advanced AI**: Machine learning for better recommendations
- **Multi-platform**: Support for more e-commerce platforms
- **Predictive Analytics**: Sales forecasting and trends
- **Automated Marketing**: AI-powered campaign management

### Scalability Improvements
- **Microservices**: Break down into smaller services
- **Load Balancing**: Distribute traffic across instances
- **Caching**: Redis for better performance
- **Queue System**: Background job processing

## 📞 Support

### Getting Help
1. **Check Logs**: Look at service logs for errors
2. **Documentation**: Review this README and code comments
3. **Issues**: Create GitHub issues for bugs
4. **Discussions**: Use GitHub discussions for questions

### Contributing
- **Code**: Submit pull requests for improvements
- **Documentation**: Help improve this README
- **Testing**: Test services and report issues
- **Ideas**: Suggest new features and enhancements

---

**🎉 Congratulations!** You now have a fully dynamic dropshipping store with real-time data, AI-powered services, and automated operations. The store will continuously update with fresh product data, live analytics, and intelligent recommendations.