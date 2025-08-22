# 🗄️ Local Database Setup for MidoStore

This guide explains how to set up and use a local SQLite database instead of cloud services for development.

## 🚀 Quick Setup

### 1. Automatic Setup (Recommended)
```bash
# Run the setup script
./scripts/setup-local-db.sh
```

### 2. Manual Setup
```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Create database and tables
npm run db:push

# Seed with initial data
npm run db:seed
```

## 📊 Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio (GUI) |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:reset` | Reset database (⚠️ destructive) |

## 🗃️ Database Schema

The local SQLite database includes these main models:

- **Products** - Product catalog with variants and localizations
- **Users** - User accounts and preferences
- **Orders** - Order management and tracking
- **Reviews** - Product reviews and ratings
- **Suppliers** - Supplier information and ratings
- **Analytics** - User interactions and trends
- **Localization** - Multi-language and currency support

## 🔧 Configuration

### Environment Variables
```bash
# Database URL (SQLite)
DATABASE_URL="file:./dev.db"

# Database location
# The database file will be created at: prisma/dev.db
```

### Prisma Schema
- **Provider**: SQLite (local file-based)
- **Location**: `prisma/dev.db`
- **Migrations**: Stored in `prisma/migrations/`

## 📁 File Structure

```
midostore/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── dev.db                 # SQLite database file
│   └── migrations/            # Database migrations
├── lib/
│   └── db.ts                  # Database connection
└── scripts/
    ├── setup-local-db.sh      # Setup script
    └── db-seed.ts             # Database seeding
```

## 🚨 Important Notes

### Development vs Production
- **Development**: Uses local SQLite database
- **Production**: Can be configured to use PostgreSQL/MySQL
- **Netlify**: Compatible with both local and cloud databases

### Performance
- **SQLite**: Good for development and small to medium applications
- **Scaling**: Consider migrating to PostgreSQL for production use
- **Concurrent Users**: SQLite has limitations with concurrent writes

### Data Persistence
- **Local**: Database file is stored in your project directory
- **Backup**: Include `prisma/dev.db` in your `.gitignore`
- **Reset**: Use `npm run db:reset` to start fresh

## 🐛 Troubleshooting

### Common Issues

1. **Database Locked**
   ```bash
   # Close any open database connections
   npm run db:reset
   ```

2. **Schema Mismatch**
   ```bash
   # Regenerate and push schema
   npm run db:generate
   npm run db:push
   ```

3. **Permission Denied**
   ```bash
   # Make setup script executable
   chmod +x scripts/setup-local-db.sh
   ```

### Reset Database
```bash
# Complete database reset (⚠️ destroys all data)
npm run db:reset

# Re-seed with sample data
npm run db:seed
```

## 🔄 Live Data Refresh Intervals

Since the site is not yet launched, live data refresh intervals have been slowed down:

| Component | Previous | Current | Reason |
|-----------|----------|---------|---------|
| Enhanced Dashboard | 1 minute | 5 minutes | Reduce server load |
| AI Agent Dashboard | 30 seconds | 2 minutes | Development mode |
| Manager Dashboard | 30 seconds | 3 minutes | Development mode |
| Live Sales Ticker | 3-10 seconds | 30-120 seconds | Development mode |
| Bulk Pricing | 30 seconds | 3 minutes | Development mode |
| Scraping Jobs | 5 seconds | 30 seconds | Development mode |

## 📈 Next Steps

1. **Test the setup**: Run `npm run dev` and verify database connectivity
2. **View data**: Use `npm run db:studio` to browse your database
3. **Customize**: Modify `scripts/db-seed.ts` to add your own sample data
4. **Production**: When ready, update `DATABASE_URL` to use cloud database

## 🆘 Support

If you encounter issues:
1. Check the console for error messages
2. Verify your environment variables
3. Try resetting the database: `npm run db:reset`
4. Check Prisma documentation: https://www.prisma.io/docs