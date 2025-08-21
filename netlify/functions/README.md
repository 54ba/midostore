# Netlify Functions - Lightweight Approach

## Overview
This directory contains lightweight Netlify functions designed to stay under the 250MB size limit. Heavy dependencies like Puppeteer have been removed and replaced with API-based approaches.

## Functions

### scrape-products.js
- **Purpose**: Scrapes product data from Alibaba and AliExpress
- **Approach**: Uses external APIs instead of Puppeteer for lightweight operation
- **Size**: ~13KB (well under 250MB limit)
- **Dependencies**: Only @prisma/client

## Heavy Dependencies Moved to External Services

The following heavy dependencies have been removed from Netlify functions and should be handled by external services:

### 1. Puppeteer (Browser Automation)
- **Size**: ~300MB+
- **Alternative**: Use external scraping services or official APIs
- **Implementation**: Moved to separate microservices or edge functions

### 2. Python-shell
- **Size**: ~50MB+
- **Alternative**: Use serverless Python functions or external AI services
- **Implementation**: AI services moved to separate infrastructure

### 3. Large Data Processing Libraries
- **xlsx**: ~20MB
- **json2csv**: ~15MB
- **Alternative**: Use cloud-based data processing or edge functions

## Deployment Strategy

### Netlify Functions (Lightweight)
- Product scraping via APIs
- Database operations
- Basic data processing

### External Services (Heavy Operations)
- Browser automation (Puppeteer)
- AI model training and inference
- Large file processing
- Data analysis and reporting

## API Integration

For production use, replace the mock API functions with:

1. **Alibaba Official API**: Use Alibaba's product search API
2. **AliExpress Official API**: Use AliExpress's product search API
3. **Third-party Scraping Services**: Services like ScrapingBee, ScraperAPI
4. **Custom Microservices**: Deploy heavy operations on separate infrastructure

## Environment Variables

Ensure these are set in your Netlify environment:
- `DATABASE_URL`: Your Prisma database connection string
- `ALIBABA_API_KEY`: Alibaba API credentials (if using official API)
- `ALIEXPRESS_API_KEY`: AliExpress API credentials (if using official API)

## Performance Notes

- Functions are optimized for cold starts
- Database connections are properly managed
- CORS headers are included for frontend integration
- Error handling and logging are implemented