# 🚀 MidoStore - AI-Powered E-commerce Platform

Advanced e-commerce platform with AI-powered product recommendations, dynamic exchange rates, and automated product scraping from Alibaba and AliExpress.

## ✨ **Key Features**

### 🧠 **AI-Powered Recommendations**
- **LightFM Integration**: State-of-the-art hybrid recommendation algorithm
- **Personalized Suggestions**: User-specific product recommendations
- **Similar Item Detection**: Find related products automatically
- **Real-time Learning**: Continuous model updates from user interactions
- **Advanced Analytics**: Performance metrics and user behavior insights

### 💱 **Dynamic Exchange Rates**
- **Real-time Updates**: Automatic currency conversion every 15 minutes
- **Multiple API Sources**: Redundant exchange rate providers for reliability
- **Gulf Countries Support**: Full localization for Arabic markets
- **Smart Caching**: 15-minute cache with intelligent fallbacks

### 🔄 **Automated Product Scraping**
- **Multi-Source Scraping**: Alibaba and AliExpress integration
- **Intelligent Data Extraction**: Product details, images, and pricing
- **Automated Updates**: Scheduled scraping with configurable intervals
- **Quality Assurance**: Rating, review, and supplier verification

### 🌍 **Localization & Multi-Currency**
- **Gulf Market Focus**: UAE, Saudi Arabia, Kuwait, Qatar, Bahrain, Oman
- **Arabic Language Support**: RTL layout and cultural adaptation
- **Dynamic Pricing**: Automatic profit margin calculations
- **Timezone Awareness**: Local time display and scheduling

## 🏗️ **Technology Stack**

### **Frontend**
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icons

### **Backend**
- **Python AI Engine**: LightFM recommendation system
- **Node.js Services**: API and business logic
- **Prisma ORM**: Database management
- **PostgreSQL**: Primary database

### **AI/ML**
- **LightFM**: Hybrid recommendation algorithms
- **Scikit-learn**: Machine learning utilities
- **TF-IDF**: Text feature extraction
- **Real-time Learning**: Continuous model updates

### **Infrastructure**
- **Netlify**: Deployment and hosting
- **Prisma Extensions**: Database automation
- **Clerk**: Authentication and user management
- **Scheduled Tasks**: Automated operations

## 🚀 **Quick Start**

### **1. Clone & Setup**
```bash
git clone <repository-url>
cd midostore
npm install
```

### **2. Environment Configuration**
```bash
cp netlify.env.example .env.local
# Edit .env.local with your configuration
```

### **3. Database Setup**
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### **4. AI Engine Setup**
```bash
cd ai
chmod +x setup.sh
./setup.sh
source venv/bin/activate
```

### **5. Start Development**
```bash
npm run dev
```

## 📁 **Project Structure**

```
midostore/
├── ai/                          # AI Recommendation Engine
│   ├── recommendation_engine.py # LightFM implementation
│   ├── requirements.txt         # Python dependencies
│   └── setup.sh                # Environment setup
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   ├── (dashboard)/        # Dashboard pages
│   │   └── contexts/           # React contexts
│   ├── components/             # Reusable components
│   └── lib/                    # Utility services
├── prisma/                     # Database schema & migrations
├── netlify/                    # Netlify functions
└── scripts/                    # Database & scraping scripts
```

## 🔧 **Configuration**

### **Environment Variables**
```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Exchange Rate APIs
EXCHANGE_RATE_API_KEY=your_key
FIXER_API_KEY=your_key
CURRENCY_API_KEY=your_key

# AI Configuration
AI_MODEL_PATH=ai/models/recommendation_model.pkl
AI_TRAINING_EPOCHS=100
```

### **Exchange Rate Sources**
- **Primary**: Exchange Rate API
- **Backup**: Fixer.io, Currency API
- **Fallback**: Open Exchange Rates, Currency Layer

## 📊 **API Endpoints**

### **Products & Scraping**
- `GET /api/products` - Product catalog with filtering
- `POST /api/scraping/start` - Start scraping job
- `GET /api/scraping/jobs` - Scraping job status

### **AI Recommendations**
- `GET /api/recommendations` - Get product recommendations
- `POST /api/recommendations` - Record interactions & train models
- `GET /api/recommendations/analytics` - Model performance metrics

### **Exchange Rates**
- `GET /api/exchange-rates` - Current exchange rates
- `POST /api/exchange-rates/update` - Manual rate updates

## 🎯 **Usage Examples**

### **AI Recommendations Component**
```tsx
import AIRecommendations from '../components/AIRecommendations';

// Personalized recommendations
<AIRecommendations
  type="personalized"
  nItems={8}
  category="electronics"
/>

// Similar products
<AIRecommendations
  type="similar"
  sourceProductId="product_123"
  nItems={6}
/>
```

### **Exchange Rate Service**
```typescript
import { ExchangeRateService } from '../lib/exchange-rate-service';

const exchangeService = new ExchangeRateService();
const rate = await exchangeService.getExchangeRate('USD', 'AED');
const localPrice = await exchangeService.convertPrice(100, 'USD', 'AED');
```

### **Product Scraping**
```typescript
import { ScrapingService } from '../lib/scraping-service';

const scrapingService = new ScrapingService();
await scrapingService.scrapeProducts('alibaba', 'electronics', 5);
```

## 🧪 **AI Model Training**

### **Automatic Training**
```bash
# Via API
curl -X POST /api/recommendations \
  -H "Content-Type: application/json" \
  -d '{"action": "train"}'

# Via Dashboard
# Navigate to /ai-recommendations
```

### **Model Configuration**
```python
# LightFM Parameters
model = LightFM(
    loss='warp',              # WARP loss for ranking
    learning_rate=0.05,       # Learning rate
    random_state=42           # Reproducibility
)
```

## 📈 **Performance & Monitoring**

### **Scheduled Tasks**
- **Exchange Rates**: Every 15 minutes
- **Product Prices**: Every hour
- **Cache Cleanup**: Every 30 minutes
- **Daily Maintenance**: 2 AM UTC

### **Analytics Dashboard**
- **Model Performance**: Precision, Recall, AUC scores
- **User Engagement**: Interaction patterns and preferences
- **System Health**: Cache statistics and API status
- **Training Progress**: Real-time model updates

## 🚀 **Deployment**

### **Netlify Deployment**
```bash
# Build and deploy
npm run build
netlify deploy --prod

# Environment setup in Netlify dashboard
# Functions directory: netlify/functions
# Build command: npm run build
```

### **Database Setup**
- **Supabase**: Recommended for production
- **Railway**: Alternative cloud database
- **Local**: Development and testing

## 🔒 **Security Features**

- **Clerk Authentication**: Secure user management
- **API Rate Limiting**: Request throttling
- **Data Validation**: Input sanitization
- **Secure Storage**: Environment variable protection

## 🧪 **Testing**

```bash
# Run tests
npm test

# Database operations
npm run db:studio    # Prisma Studio
npm run db:seed      # Seed database
npm run db:migrate   # Run migrations

# Scraping
npm run scrape:products alibaba electronics 5
```

## 📚 **Documentation**

- **[AI Recommendations](AI_RECOMMENDATIONS_README.md)**: Complete AI system guide
- **[Netlify Deployment](NETLIFY-PRISMA-DEPLOYMENT.md)**: Deployment instructions
- **[Alibaba Scraping](README-ALIBABA-SCRAPING.md)**: Scraping system details

## 🔮 **Roadmap**

### **Phase 1 (Current)**
- ✅ AI-powered recommendations
- ✅ Dynamic exchange rates
- ✅ Automated product scraping
- ✅ Gulf market localization

### **Phase 2 (Next 3 months)**
- 🔄 Advanced filtering algorithms
- 🔄 Price alert systems
- 🔄 Supplier analytics
- 🔄 Mobile app integration

### **Phase 3 (6+ months)**
- 📱 Multi-language support expansion
- 📱 Integration with other platforms
- 📱 Advanced analytics dashboard
- 📱 Real-time streaming recommendations

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

- **Documentation**: Check the README files above
- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions
- **AI System**: `/ai-recommendations` dashboard

---

**🎯 Transform your e-commerce with AI-powered recommendations, dynamic pricing, and automated product management!**

Built with ❤️ for the Gulf market and beyond.