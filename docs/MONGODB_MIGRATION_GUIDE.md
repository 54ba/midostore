# 🚀 MongoDB Migration Guide for MidoStore

This guide will help you migrate from SQLite to MongoDB using Prisma.

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB installed and running
- Access to your project directory

## 🔧 Step 1: Install MongoDB

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### macOS
```bash
brew install mongodb/brew/mongodb-community
brew services start mongodb/brew/mongodb-community
```

### Windows
Download and install from [MongoDB Community Server](https://www.mongodb.com/try/download/community)

## 🔄 Step 2: Update Prisma Schema

The Prisma schema has been updated to use MongoDB:

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
```

**Key Changes Made:**
- Changed provider from `sqlite` to `mongodb`
- Converted `Decimal` fields to `Float` (MongoDB doesn't support Decimal)
- Maintained all relationships and indexes
- Kept `@default(cuid())` for ID generation

## 🌐 Step 3: Update Environment Variables

Update your `.env` file:

```bash
# Old SQLite configuration
# DATABASE_URL="file:./dev.db"

# New MongoDB configuration
DATABASE_URL="mongodb://localhost:27017/midostore"
```

## 📦 Step 4: Install Dependencies

```bash
npm install mongodb
```

## 🚀 Step 5: Run MongoDB Setup

Use the automated setup script:

```bash
npm run db:mongodb:setup
```

This script will:
- ✅ Check MongoDB installation
- ✅ Start MongoDB service
- ✅ Create database and collections
- ✅ Set up indexes for performance
- ✅ Update environment files
- ✅ Generate Prisma client
- ✅ Push schema to MongoDB
- ✅ Seed database (if seed script exists)

## 🧪 Step 6: Test MongoDB Connection

```bash
npm run db:mongodb:test
```

This will test:
- Connection to MongoDB
- Basic CRUD operations
- Aggregation queries
- Database performance

## 📊 Step 7: Verify Database Setup

Connect to MongoDB and verify:

```bash
mongo midostore
```

```javascript
// Show collections
show collections

// Check indexes
db.products.getIndexes()

// Test a query
db.products.findOne()

// Exit
exit
```

## 🔍 Step 8: Update Your Code

### Database Connection

Use the new MongoDB connection utility:

```typescript
// Old: Direct Prisma usage
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// New: MongoDB connection (if needed)
import clientPromise from '@/lib/mongodb'
const client = await clientPromise
const db = client.db('midostore')
```

### Data Types

**Important:** Decimal fields are now Float in MongoDB:

```typescript
// Old SQLite types
price: Decimal
profitMargin: Decimal

// New MongoDB types
price: number
profitMargin: number
```

## 🚨 Common Issues & Solutions

### Issue 1: MongoDB Connection Refused
```bash
# Check MongoDB status
sudo systemctl status mongodb

# Start MongoDB
sudo systemctl start mongodb

# Check if port 27017 is listening
netstat -tlnp | grep 27017
```

### Issue 2: Authentication Failed
- Verify connection string format
- Check if MongoDB requires authentication
- Ensure user has proper permissions

### Issue 3: Prisma Client Generation Failed
```bash
# Clear Prisma cache
rm -rf node_modules/.prisma

# Regenerate client
npm run db:generate
```

### Issue 4: Schema Push Failed
```bash
# Reset database
npm run db:reset

# Push schema again
npm run db:push
```

## 📈 Performance Considerations

### Indexes
MongoDB automatically creates indexes for:
- `_id` field (primary key)
- Foreign key relationships
- Unique constraints

### Additional Indexes Created
```javascript
// Products collection
db.products.createIndex({ 'source': 1, 'externalId': 1 })
db.products.createIndex({ 'category': 1, 'isActive': 1 })
db.products.createIndex({ 'isFeatured': 1 })

// Reviews collection
db.reviews.createIndex({ 'productId': 1 })
db.reviews.createIndex({ 'rating': 1 })

// Orders collection
db.orders.createIndex({ 'userId': 1 })
db.orders.createIndex({ 'status': 1 })

// Exchange rates collection
db.exchangeRates.createIndex({ 'fromCurrency': 1, 'toCurrency': 1 })
```

## 🔒 Security Best Practices

### Production MongoDB Setup
```bash
# Enable authentication
mongosh admin --eval "db.createUser({user: 'admin', pwd: 'secure_password', roles: ['userAdminAnyDatabase']})"

# Update connection string
DATABASE_URL="mongodb://admin:secure_password@localhost:27017/midostore?authSource=admin"
```

### Network Security
```bash
# Bind to localhost only (development)
mongod --bind_ip 127.0.0.1

# Use firewall rules in production
sudo ufw allow from trusted_ip to any port 27017
```

## 📊 Monitoring & Maintenance

### Check Database Status
```bash
# Database stats
mongosh midostore --eval "db.stats()"

# Collection stats
mongosh midostore --eval "db.products.stats()"

# Index usage
mongosh midostore --eval "db.products.aggregate([{\$indexStats: {}}])"
```

### Backup & Restore
```bash
# Backup database
mongodump --db midostore --out ./backup

# Restore database
mongorestore --db midostore ./backup/midostore
```

## 🎯 Next Steps

1. **Test Your Application**: Ensure all features work with MongoDB
2. **Performance Testing**: Monitor query performance and optimize if needed
3. **Data Migration**: If you have existing SQLite data, create a migration script
4. **Production Deployment**: Update production environment variables
5. **Monitoring**: Set up MongoDB monitoring and alerting

## 🆘 Need Help?

### Useful Commands
```bash
# Check MongoDB logs
tail -f ~/mongodb/data/mongod.log

# Check MongoDB process
ps aux | grep mongod

# Check MongoDB version
mongod --version

# Check Prisma status
npx prisma --version
```

### Troubleshooting Resources
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Prisma MongoDB Guide](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
- [MongoDB Community Forums](https://www.mongodb.com/community/forums/)

## 🎉 Migration Complete!

After following these steps, your MidoStore application will be running on MongoDB with:
- ✅ Improved scalability
- ✅ Better performance for complex queries
- ✅ Native support for JSON-like documents
- ✅ Enhanced aggregation capabilities
- ✅ Better support for large datasets

Happy coding! 🚀