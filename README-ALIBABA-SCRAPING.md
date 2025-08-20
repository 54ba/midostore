# Alibaba & AliExpress Product Scraping & Selling Platform

A comprehensive Next.js application for scraping products from Alibaba and AliExpress, with localization support for Gulf Arab countries, exchange rate management, and a modern e-commerce interface.

## 🌟 Features

### 🕷️ Web Scraping
- **Multi-source scraping**: Alibaba and AliExpress support
- **Category-based scraping**: Electronics, clothing, home, beauty, sports, etc.
- **Stealth mode**: Uses Puppeteer with stealth plugins to avoid detection
- **Batch processing**: Scrape multiple pages with configurable delays
- **Real-time monitoring**: Track scraping job progress and status

### 🌍 Localization & Gulf Countries Support
- **Multi-language support**: English and Arabic interfaces
- **Gulf country coverage**: UAE, Saudi Arabia, Kuwait, Qatar, Bahrain, Oman
- **Local currencies**: AED, SAR, KWD, QAR, BHD, OMR
- **Timezone handling**: Proper timezone support for each region
- **Cultural adaptation**: Arabic text and right-to-left support

### 💱 Exchange Rate Management
- **Real-time rates**: Multiple API sources for redundancy
- **Automatic updates**: Scheduled rate updates
- **Local pricing**: Convert prices to local currencies
- **Profit margins**: Configurable markup by category

### 🛒 E-commerce Features
- **Product catalog**: Browse products by category
- **Search functionality**: Full-text search across products
- **Filtering**: Category, price, rating filters
- **Responsive design**: Mobile-first approach
- **Shopping cart**: Add to cart functionality

### 🚀 Netlify Integration
- **Serverless functions**: Netlify functions for scraping
- **Edge deployment**: Global CDN for fast access
- **Auto-scaling**: Handles traffic spikes automatically
- **Easy deployment**: One-click deployment from Git
- **Prisma integration**: Automatic database management

### 🔐 Authentication
- **Clerk integration**: Modern authentication system
- **Custom domain**: [handy-cow-68.accounts.dev](https://handy-cow-68.accounts.dev)
- **Secure sessions**: JWT-based authentication
- **User management**: Profile and preferences

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Prisma ORM
- **Web Scraping**: Puppeteer with stealth plugins
- **Deployment**: Netlify with Prisma plugin
- **Authentication**: Clerk
- **State Management**: React hooks and context

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database
- Netlify account (for deployment)
- Clerk account for authentication
- Exchange rate API keys (optional)

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd midostore
```

### 2. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Environment setup
Create a `.env.local` file with your configuration:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/midostore_db"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_clerk_key"
CLERK_SECRET_KEY="sk_test_your_clerk_secret"

# Exchange Rate API (optional)
EXCHANGE_RATE_API_KEY="your_api_key"
EXCHANGE_RATE_BASE_URL="https://api.exchangerate-api.com/v4/latest"

# Scraping Configuration
SCRAPING_DELAY_MS=2000
MAX_CONCURRENT_SCRAPES=3
SCRAPING_TIMEOUT_MS=30000
```

### 4. Database setup
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

### 5. Start development server
```bash
npm run dev
```

## 🌐 Clerk Configuration

The application is configured to use Clerk for authentication with the following URLs:

- **Sign In**: [https://handy-cow-68.accounts.dev/sign-in](https://handy-cow-68.accounts.dev/sign-in)
- **Sign Up**: [https://handy-cow-68.accounts.dev/sign-up](https://handy-cow-68.accounts.dev/sign-up)
- **After Sign In**: [https://handy-cow-68.accounts.dev/](https://handy-cow-68.accounts.dev/)
- **After Sign Up**: [https://handy-cow-68.accounts.dev/](https://handy-cow-68.accounts.dev/)

## 📊 Usage

### Starting Scraping Jobs

#### Via Web Interface
1. Navigate to `/scraping` dashboard
2. Click "Start New Job"
3. Select source (Alibaba/AliExpress)
4. Choose category
5. Set number of pages to scrape
6. Click "Start Job"

#### Via Command Line
```bash
# Scrape Alibaba electronics (1 page)
npm run scrape:products alibaba electronics 1

# Scrape AliExpress clothing (3 pages)
npm run scrape:products aliexpress clothing 3
```

### Managing Products

#### View Products
- **All products**: `/products`
- **By category**: `/products?category=electronics`
- **Search**: `/products?search=bluetooth`

#### Localization
- **Change locale**: Use the locale selector in the header
- **Supported locales**: en-AE, ar-AE, en-SA, ar-SA, etc.

### Exchange Rates

#### Update Rates
```bash
# Via API
curl -X POST /api/exchange-rates

# Via web interface
# Navigate to exchange rates section
```

#### View Rates
```bash
# All Gulf country rates
curl /api/exchange-rates

# Specific conversion
curl /api/exchange-rates?from=USD&to=AED
```

## 🚀 Netlify Deployment

### 1. Connect Repository
- Connect your GitHub repository to Netlify
- Set build command: `npm run build`
- Set publish directory: `.next`

### 2. Environment Variables
Add your environment variables in Netlify dashboard:
- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `EXCHANGE_RATE_API_KEY`

### 3. Install Prisma Plugin
- Go to Build plugins in Netlify
- Install `@netlify/plugin-prisma`
- The plugin will automatically handle database migrations

### 4. Deploy
- Push to your main branch
- Netlify will automatically deploy with Prisma integration

For detailed deployment instructions, see [NETLIFY-PRISMA-DEPLOYMENT.md](./NETLIFY-PRISMA-DEPLOYMENT.md)

## 🏗️ Project Structure

```
midostore/
├── src/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   ├── (dashboard)/            # Dashboard pages
│   │   │   ├── products/           # Product listing
│   │   │   └── scraping/           # Scraping dashboard
│   │   └── contexts/               # React contexts
│   ├── components/                 # Reusable components
│   └── lib/                        # Utility libraries
├── lib/                            # Core services
│   ├── scraping-service.ts         # Web scraping logic
│   ├── product-service.ts          # Product management
│   ├── exchange-rate-service.ts    # Currency conversion
│   └── db.ts                      # Database client
├── prisma/                         # Database schema
├── netlify/                        # Netlify functions
├── scripts/                        # Utility scripts
└── config/                         # Configuration files
```

## 🔧 Configuration

### Scraping Settings
```typescript
// env.config.ts
scraping: {
  delayMs: 2000,                    // Delay between requests
  maxConcurrent: 3,                 // Max concurrent scrapes
  timeoutMs: 30000,                 // Page timeout
}
```

### Profit Margins
```typescript
profitMargins: {
  default: 25,                      // Default markup %
  byCategory: {
    electronics: 20,                // Electronics markup
    clothing: 30,                   // Clothing markup
    home: 25,                       // Home goods markup
    beauty: 35,                     // Beauty products markup
    sports: 25,                     // Sports equipment markup
  }
}
```

### Gulf Countries
```typescript
gulfCountries: [
  {
    code: "AE",
    name: "United Arab Emirates",
    nameAr: "الإمارات العربية المتحدة",
    currency: "AED",
    currencyAr: "درهم إماراتي",
    timezone: "Asia/Dubai",
    locale: "ar-AE",
  },
  // ... more countries
]
```

## 🗄️ Database Management

### Prisma Commands
```bash
# Generate client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Push schema changes
npm run db:push

# Open Prisma Studio
npm run db:studio
```

### Database Schema
The application includes comprehensive database models for:
- Products with variants and localizations
- Suppliers with ratings and verification
- Exchange rates with caching
- Scraping jobs with progress tracking
- Gulf countries configuration
- User preferences and authentication

## 🔒 Security & Compliance

### Web Scraping Ethics
- **Rate limiting**: Configurable delays between requests
- **User agent rotation**: Avoid detection
- **Respect robots.txt**: Check before scraping
- **Terms of service**: Ensure compliance

### Data Protection
- **GDPR compliance**: User data handling
- **Secure storage**: Encrypted database connections
- **Access control**: Role-based permissions
- **Audit logging**: Track all operations

## 🐛 Troubleshooting

### Common Issues

#### Scraping Fails
```bash
# Check selectors
# Verify website structure hasn't changed
# Increase timeout values
# Check for CAPTCHA/anti-bot measures
```

#### Database Connection
```bash
# Verify DATABASE_URL
# Check PostgreSQL is running
# Run migrations: npm run db:migrate
```

#### Exchange Rate Errors
```bash
# Check API keys
# Verify API endpoints
# Check rate limits
# Use fallback rates
```

### Debug Mode
```bash
# Enable detailed logging
DEBUG=* npm run dev

# Check scraping logs
npm run scrape:products alibaba electronics 1 --debug
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow commit message conventions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Reference](./docs/api.md)
- [Database Schema](./docs/database.md)
- [Deployment Guide](./NETLIFY-PRISMA-DEPLOYMENT.md)

### Community
- [GitHub Issues](https://github.com/your-repo/issues)
- [Discussions](https://github.com/your-repo/discussions)
- [Wiki](https://github.com/your-repo/wiki)

### Professional Support
For enterprise support and custom development, contact:
- Email: support@yourcompany.com
- Phone: +1-555-0123

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Basic scraping functionality
- ✅ Gulf country localization
- ✅ Exchange rate management
- ✅ Product catalog
- ✅ Clerk authentication
- ✅ Netlify Prisma integration

### Phase 2 (Next)
- 🔄 Advanced filtering
- 🔄 Price alerts
- 🔄 Supplier analytics
- 🔄 Mobile app

### Phase 3 (Future)
- 📱 AI-powered recommendations
- 📱 Advanced analytics dashboard
- 📱 Multi-language support expansion
- 📱 Integration with other platforms

---

**Built with ❤️ for the Gulf region e-commerce community**

**Authentication powered by [Clerk](https://handy-cow-68.accounts.dev)**