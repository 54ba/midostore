# Review Seeding System

This system provides comprehensive review seeding capabilities for your e-commerce platform, allowing you to generate realistic product reviews using multiple approaches.

## Features

- **Faker-based Review Generation**: Generate realistic fake reviews using the Faker library
- **Alibaba/AliExpress API Integration**: Import real reviews from external platforms
- **Mock Data Fallback**: Automatic fallback to realistic mock data when APIs are unavailable
- **Category-Specific Content**: Reviews tailored to product categories (electronics, clothing, home, etc.)
- **Realistic Rating Distribution**: Natural distribution of ratings (60% 5-star, 25% 4-star, etc.)
- **Batch Processing**: Efficient handling of large numbers of reviews
- **Multiple Seeding Strategies**: Choose between different review sources and approaches

## Prerequisites

1. **Database Setup**: Ensure your Prisma database is set up and migrated
2. **Dependencies**: Install required packages:
   ```bash
   npm install faker @types/faker
   ```

## Environment Variables

Add these to your `.env` file for API integration:

```env
# Alibaba/AliExpress API Configuration
ALIBABA_API_BASE_URL=https://api.alibaba.com
ALIBABA_API_KEY=your_api_key_here
```

## Database Schema

The system adds a `Review` model to your Prisma schema:

```prisma
model Review {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  reviewerName String
  rating      Int      // 1-5 stars
  title       String?
  content     String
  helpful     Int      @default(0)
  verified    Boolean  @default(false)
  source      String   // "alibaba", "aliexpress", "generated"
  externalId  String?  // Original review ID from source platform
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([productId])
  @@index([rating])
  @@index([source])
}
```

## Usage

### 1. Basic Review Seeding

Generate reviews for all products using the basic seeder:

```bash
# Generate 15 reviews per product using faker
npm run seed:reviews all

# Generate 20 reviews per product for electronics category
npm run seed:reviews category electronics 20

# Generate reviews for a specific product
npm run seed:reviews product <productId> 15
```

### 2. Enhanced Review Seeding

Use the enhanced seeder for more advanced options:

```bash
# Generate reviews using mixed approach (70% API + 30% generated)
npm run enhanced:reviews all

# Generate reviews using only faker
npm run enhanced:reviews all faker 20

# Generate reviews using only Alibaba API
npm run enhanced:reviews all alibaba 25

# Generate reviews using only AliExpress API
npm run enhanced:reviews all aliexpress 30

# Generate reviews for specific category using mixed approach
npm run enhanced:reviews category electronics mixed 20

# Import reviews from Alibaba for all Alibaba products
npm run enhanced:reviews import alibaba 25
```

### 3. Database Seeding with Reviews

The main database seeder now includes review generation:

```bash
# This will seed products AND generate reviews
npm run db:seed
```

## Review Sources

### Faker (Generated)
- **Pros**: Fast, consistent, customizable
- **Cons**: Not real user feedback
- **Use Case**: Development, testing, initial setup

### Alibaba API
- **Pros**: Real user reviews, authentic content
- **Cons**: Requires API key, rate limits
- **Use Case**: Production, real user feedback

### AliExpress API
- **Pros**: Real user reviews, diverse feedback
- **Cons**: Requires API key, rate limits
- **Use Case**: Production, real user feedback

### Mixed Approach
- **Pros**: Best of both worlds, realistic distribution
- **Cons**: Slightly more complex
- **Use Case**: Production with fallback options

## Review Content Generation

### Rating Distribution
- **5 Stars**: 60% (Excellent products)
- **4 Stars**: 25% (Good products)
- **3 Stars**: 10% (Average products)
- **2 Stars**: 3% (Below average)
- **1 Star**: 2% (Poor products)

### Category-Specific Content
Reviews are tailored to product categories:

- **Electronics**: Battery life, performance, ease of use
- **Clothing**: Fit, material quality, design
- **Home**: Craftsmanship, assembly, functionality

### Review Structure
Each review includes:
- **Title**: Concise summary
- **Content**: Detailed feedback (2-3 sentences)
- **Rating**: 1-5 star rating
- **Helpful Count**: Random helpful votes
- **Verification**: Verified buyer status
- **Reviewer Name**: Realistic names or verified badges

## API Integration

### Alibaba API
```typescript
// Fetch reviews from Alibaba
const reviews = await alibabaService.fetchAlibabaReviews(productId, 50);

// Import to database
await alibabaService.importReviewsToDatabase(productId, 'alibaba', 50);
```

### AliExpress API
```typescript
// Fetch reviews from AliExpress
const reviews = await alibabaService.fetchAliExpressReviews(productId, 50);

// Import to database
await alibabaService.importReviewsToDatabase(productId, 'aliexpress', 50);
```

## Fallback Strategy

When APIs are unavailable, the system automatically falls back to realistic mock data:

1. **API Call Fails**: Automatic fallback to mock data
2. **No API Key**: Uses mock data with warning
3. **Rate Limits**: Graceful degradation to mock data
4. **Network Issues**: Seamless fallback to local generation

## Performance Considerations

- **Batch Processing**: Reviews are created in batches of 25-50
- **Database Indexes**: Optimized queries with proper indexing
- **Memory Management**: Efficient handling of large datasets
- **Progress Tracking**: Real-time progress updates for long operations

## Customization

### Adding New Categories
Extend the `categorySpecificPhrases` in `ReviewSeedingService`:

```typescript
const categorySpecificPhrases: Record<string, string[]> = {
  // ... existing categories
  sports: [
    'Durable construction',
    'Comfortable fit',
    'Good performance',
    'Lightweight design'
  ]
};
```

### Custom Review Templates
Modify the review generation logic in the service classes:

```typescript
// Add custom phrases
const customPhrases = [
  'Perfect for outdoor use',
  'Great for beginners',
  'Professional quality'
];

// Integrate with existing system
phrases = [...phrases, ...customPhrases];
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Ensure database is running
   npm run db:generate
   npm run db:push
   ```

2. **API Key Issues**
   ```bash
   # Check environment variables
   echo $ALIBABA_API_KEY
   ```

3. **Memory Issues with Large Datasets**
   ```bash
   # Reduce batch size
   npm run enhanced:reviews all faker 10
   ```

### Debug Mode
Enable detailed logging by setting environment variable:
```bash
DEBUG=review-seeding npm run enhanced:reviews all
```

## Examples

### Generate Reviews for Electronics
```bash
npm run enhanced:reviews category electronics mixed 25
```

### Import Real Reviews from Alibaba
```bash
npm run enhanced:reviews import alibaba 30
```

### Quick Setup for Development
```bash
# Seed database with products and reviews
npm run db:seed

# Generate additional reviews
npm run enhanced:reviews all faker 20
```

## Best Practices

1. **Start Small**: Begin with 10-15 reviews per product
2. **Use Mixed Approach**: Combine API and generated reviews for realism
3. **Monitor Performance**: Watch database performance with large datasets
4. **Regular Updates**: Refresh reviews periodically for fresh content
5. **Quality Control**: Review generated content for appropriateness

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review database logs
3. Verify environment configuration
4. Test with smaller datasets first

---

**Note**: This system is designed to work seamlessly with your existing Prisma setup and provides multiple fallback options to ensure review generation always succeeds, even when external APIs are unavailable.