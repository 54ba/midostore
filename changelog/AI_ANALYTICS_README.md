# AI Analytics Dashboard for Dropshipping Store

## 🚀 Overview

This system provides a comprehensive AI-powered analytics dashboard for your dropshipping store, integrating with Netlify addons like Neon DB and using modern AI data analysis packages to identify trends and optimize your store's performance.

## ✨ Features

### 📊 **Analytics Dashboard**
- **Real-time Metrics**: Revenue, orders, customers, ratings, and reviews
- **Interactive Charts**: Revenue trends, category performance, and product analytics
- **Time Range Analysis**: 7 days, 30 days, 90 days, and 1 year views
- **Responsive Design**: Works on all devices with modern UI/UX

### 🤖 **AI-Powered Insights**
- **Trend Analysis**: Identify product and category trends using machine learning
- **Seasonal Patterns**: Detect seasonal demand patterns and opportunities
- **Profit Optimization**: Analyze profit margins and suggest pricing strategies
- **Smart Recommendations**: AI-generated actionable business insights

### 🔍 **Data Analysis**
- **Category Performance**: Conversion rates, order values, and revenue analysis
- **Product Insights**: Best-performing products, ratings, and sales metrics
- **Customer Behavior**: Interaction patterns and purchasing trends
- **Market Opportunities**: Identify gaps and expansion opportunities

## 🏗️ Architecture

### **Frontend (Next.js 15 + React 19)**
- Modern React with TypeScript
- Recharts for interactive data visualization
- Responsive design with Tailwind CSS
- Real-time data updates

### **Backend (Node.js + Prisma)**
- RESTful API endpoints for analytics data
- Prisma ORM for database operations
- Integration with Neon DB (PostgreSQL)
- Efficient data aggregation and processing

### **AI Service (Python + FastAPI)**
- Machine learning models for trend analysis
- Clustering algorithms for product segmentation
- Predictive analytics for sales forecasting
- RESTful API for AI operations

## 🚀 Quick Start

### **1. Setup AI Analytics Service**
```bash
# Install and configure AI service
npm run ai:setup

# Start AI service
npm run ai:start
```

### **2. Access Analytics Dashboard**
1. Navigate to your dashboard: `/dashboard`
2. Click "Analytics Dashboard" button
3. Explore real-time analytics and AI insights

### **3. View AI API Documentation**
- API Base URL: `http://localhost:8000`
- Documentation: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/`

## 📦 Installation

### **Prerequisites**
- Node.js 20+
- Python 3.11+
- PostgreSQL database (Neon DB recommended)
- Netlify account

### **1. Install Dependencies**
```bash
# Install Node.js dependencies
npm install

# Install AI service dependencies
npm run ai:setup
```

### **2. Configure Environment**
```bash
# Copy environment template
cp env.example .env

# Add your configuration
DATABASE_URL="your_neon_db_url"
ALIBABA_API_KEY="your_api_key"
AI_MODEL_PATH="ai/models/"
```

### **3. Setup Database**
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

## 🔧 Configuration

### **Environment Variables**
```env
# Database
DATABASE_URL="postgresql://user:pass@host:port/db"

# AI Analytics
AI_MODEL_PATH="ai/models/"
ENABLE_AI_TRAINING="true"
API_HOST="0.0.0.0"
API_PORT="8000"

# Alibaba/AliExpress API
ALIBABA_API_BASE_URL="https://api.alibaba.com"
ALIBABA_API_KEY="your_api_key"

# Prisma (for NixOS compatibility)
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING="1"
```

### **Netlify Configuration**
```toml
[build.environment]
  NODE_VERSION = "20"
  NPM_VERSION = "10"
  PYTHON_VERSION = "3.11"
  PIP_VERSION = "23.0"

[functions]
  node_bundler = "esbuild"
  external_node_modules = ["@prisma/client", "prisma"]
```

## 📊 Dashboard Features

### **Overview Tab**
- **Key Metrics**: Revenue, orders, customers, ratings
- **Trend Indicators**: Growth/decline with visual indicators
- **Quick Actions**: Access to main dashboard functions

### **Trends Tab**
- **Revenue Trends**: Monthly revenue and order patterns
- **Category Performance**: Conversion rates and order values
- **Top Products**: Best-selling products with metrics
- **Performance Charts**: Interactive visualizations

### **AI Insights Tab**
- **Profit Analysis**: Total profit and margin analysis
- **Category Opportunities**: AI-identified business opportunities
- **Seasonal Trends**: Seasonal demand patterns
- **Performance Metrics**: Detailed product performance data

### **Recommendations Tab**
- **AI-Generated Insights**: Actionable business recommendations
- **Impact Assessment**: High/medium/low impact categorization
- **Action Items**: Specific steps to implement recommendations
- **Priority Ranking**: Sorted by potential impact

## 🤖 AI Service Features

### **Trend Analyzer**
```python
from trend_analyzer import TrendAnalyzer

# Initialize analyzer
analyzer = TrendAnalyzer()

# Analyze product trends
results = analyzer.analyze_product_trends(products_data)

# Get insights summary
insights = analyzer.get_insights_summary(results)
```

### **Machine Learning Models**
- **Clustering**: Product segmentation by performance
- **Regression**: Sales prediction and forecasting
- **Classification**: Category performance analysis
- **Time Series**: Seasonal trend detection

### **API Endpoints**
- `POST /analyze` - Analyze product trends
- `POST /train` - Train AI models with new data
- `GET /models/status` - Check model status
- `GET /insights/{id}` - Retrieve specific insights

## 📈 Data Sources

### **Product Data**
- Sales counts and revenue
- Ratings and reviews
- Categories and tags
- Profit margins and pricing

### **Order Data**
- Transaction amounts
- Order timestamps
- Customer information
- Order status tracking

### **User Data**
- Customer interactions
- Purchase history
- Preference patterns
- Engagement metrics

## 🔄 Data Flow

```
Database (Neon DB) → Prisma ORM → Analytics API → Dashboard
                                    ↓
                              AI Service (Python)
                                    ↓
                              Machine Learning Models
                                    ↓
                              Insights & Recommendations
```

## 🚀 Deployment

### **Netlify Deployment**
1. **Connect Repository**: Link your GitHub repository
2. **Configure Build**: Use provided `netlify.toml`
3. **Set Environment Variables**: Configure in Netlify dashboard
4. **Deploy**: Automatic deployment on push to main branch

### **AI Service Deployment**
1. **Local Development**: `npm run ai:start`
2. **Production**: Deploy to cloud platform (Heroku, AWS, etc.)
3. **Docker**: Use provided Dockerfile (if available)
4. **Systemd Service**: Use generated service file

### **Database Setup**
1. **Neon DB**: Create PostgreSQL database
2. **Connection**: Update `DATABASE_URL` in environment
3. **Schema**: Run Prisma migrations
4. **Seed Data**: Populate with sample data

## 📊 Performance Optimization

### **Database Optimization**
- Proper indexing on frequently queried fields
- Efficient aggregation queries
- Connection pooling for high traffic
- Regular database maintenance

### **AI Model Optimization**
- Batch processing for large datasets
- Model caching and persistence
- Incremental training with new data
- Performance monitoring and metrics

### **Frontend Optimization**
- Lazy loading of charts and components
- Efficient data fetching with caching
- Responsive design for all devices
- Progressive enhancement

## 🔍 Monitoring & Analytics

### **Performance Metrics**
- API response times
- Database query performance
- AI model accuracy
- User engagement metrics

### **Error Tracking**
- API error logging
- Database connection monitoring
- AI model training errors
- Frontend error boundaries

### **Usage Analytics**
- Dashboard access patterns
- Feature usage statistics
- User interaction tracking
- Performance bottlenecks

## 🛠️ Troubleshooting

### **Common Issues**

#### **Build Errors**
```bash
# Fix Prisma compatibility issues
export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# Regenerate Prisma client
npm run db:generate
```

#### **AI Service Issues**
```bash
# Check Python environment
cd ai && source venv/bin/activate

# Test service
python3 -c "from trend_analyzer import TrendAnalyzer; print('OK')"

# Restart service
npm run ai:start
```

#### **Database Connection**
```bash
# Test database connection
npm run db:studio

# Check environment variables
echo $DATABASE_URL
```

### **Debug Mode**
```bash
# Enable debug logging
DEBUG=analytics npm run dev

# AI service debug
cd ai && LOG_LEVEL=DEBUG python3 api_server.py
```

## 🔮 Future Enhancements

### **Advanced AI Features**
- **Natural Language Processing**: Customer review sentiment analysis
- **Computer Vision**: Product image analysis and categorization
- **Predictive Analytics**: Advanced sales forecasting
- **Recommendation Engine**: Personalized product suggestions

### **Integration Features**
- **E-commerce Platforms**: Shopify, WooCommerce integration
- **Marketing Tools**: Google Analytics, Facebook Ads integration
- **CRM Systems**: Customer relationship management
- **Inventory Management**: Stock level optimization

### **Mobile & PWA**
- **Mobile App**: Native mobile application
- **Progressive Web App**: Offline functionality
- **Push Notifications**: Real-time alerts
- **Mobile Analytics**: Touch and gesture tracking

## 📚 API Documentation

### **Analytics API**
```typescript
// Fetch analytics data
const response = await fetch('/api/analytics?timeRange=30d');
const data = await response.json();

// Data structure
interface AnalyticsData {
  overview: OverviewMetrics;
  trends: TrendData;
  insights: InsightData;
  recommendations: Recommendation[];
}
```

### **AI Service API**
```typescript
// Analyze trends
const response = await fetch('http://localhost:8000/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    products: productsData,
    analysis_type: 'comprehensive'
  })
});
```

## 🤝 Contributing

### **Development Setup**
1. Fork the repository
2. Create feature branch
3. Make changes and test
4. Submit pull request

### **Code Standards**
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Jest for testing

### **Testing**
```bash
# Run tests
npm test

# Test AI service
cd ai && python3 -m pytest

# Test analytics API
npm run test:analytics
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### **Documentation**
- [API Reference](./API_REFERENCE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

### **Community**
- GitHub Issues: Report bugs and request features
- Discussions: Ask questions and share ideas
- Wiki: Community-contributed documentation

### **Contact**
- Email: support@midohub.com
- Discord: Join our community server
- Twitter: Follow for updates and tips

---

**🎯 Ready to transform your dropshipping business with AI-powered insights? Start with the analytics dashboard today!**