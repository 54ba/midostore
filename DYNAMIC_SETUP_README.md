# 🚀 Dynamic Dropshipping Store Setup

This project has evolved from a Next.js app to a **dynamic hybrid system** that combines Node.js and Python modules, allowing you to run both services simultaneously for a powerful dropshipping platform.

## 🌟 What's New

- **Hybrid Architecture**: Node.js (Next.js) + Python (AI/ML) services
- **Dynamic Configuration**: Automatic environment detection and setup
- **Unified Startup**: Single command to start all services
- **AI-Powered Analytics**: Machine learning for product recommendations and trend analysis
- **Smart Service Management**: Automatic health checks and service monitoring

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App  │    │  AI Analytics   │    │   Database      │
│   (Port 3000)  │◄──►│   (Port 8000)   │◄──►│   (Prisma)      │
│                 │    │                 │    │                 │
│ • Frontend      │    │ • ML Models     │    │ • Products      │
│ • API Routes    │    │ • Analytics     │    │ • Orders        │
│ • E-commerce    │    │ • Predictions   │    │ • Users         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### 1. Prerequisites

- **Node.js 18+** and **npm**
- **Python 3.8+** and **pip**
- **Git** (for cloning)

### 2. Clone and Setup

```bash
git clone <your-repo>
cd midostore

# Install Node.js dependencies
npm install

# Setup AI service (Python)
npm run dynamic:setup
```

### 3. Start All Services

```bash
# Start everything with one command
npm run dynamic:start
```

This will start:
- 🌐 **Next.js App** on http://localhost:3000
- 🤖 **AI Analytics API** on http://localhost:8000
- 📚 **API Documentation** on http://localhost:8000/docs

## 🔧 Dynamic Configuration

### Check System Status

```bash
# View current configuration and service status
npm run dynamic:config

# Save configuration to file
npm run services:status

# Generate environment template
npm run services:env-template
```

### Manual Service Control

```bash
# Start Next.js only
npm run dev

# Start AI service only
cd ai && ./start_ai_service.sh

# Setup AI service manually
./scripts/setup-ai-analytics.sh
```

## 🤖 AI Service Features

The Python AI service provides:

- **Product Trend Analysis**: ML-powered insights into product performance
- **Smart Recommendations**: AI-driven product suggestions
- **Sales Forecasting**: Predictive analytics for business planning
- **Category Insights**: Deep analysis of product categories

### API Endpoints

- `GET /` - Service status
- `GET /health` - Health check
- `POST /analyze/trends` - Analyze product trends
- `POST /recommendations` - Get product recommendations
- `POST /train` - Train ML models
- `GET /models/status` - Model status
- `GET /sample-data` - Sample data for testing

## 📁 Project Structure

```
midostore/
├── src/                    # Next.js application
├── ai/                     # Python AI service
│   ├── api_server.py      # FastAPI server
│   ├── requirements.txt    # Python dependencies
│   ├── start_ai_service.sh # AI service startup
│   └── models/            # Trained ML models
├── lib/                    # Node.js utilities
├── scripts/                # Setup and utility scripts
├── prisma/                 # Database schema
├── start-services.sh       # Main startup script
├── dynamic-config.js       # Configuration manager
└── package.json            # Node.js dependencies
```

## 🔄 Service Lifecycle

### Development Mode

```bash
npm run dynamic:start
```

1. **Prerequisites Check**: Validates Node.js, Python, and dependencies
2. **AI Service Setup**: Creates virtual environment and installs Python packages
3. **Service Startup**: Starts both Next.js and AI services in parallel
4. **Health Monitoring**: Continuously monitors service health
5. **Graceful Shutdown**: Handles Ctrl+C and cleanup

### Production Mode

```bash
NODE_ENV=production npm run dynamic:start
```

- Builds Next.js for production
- Starts production servers
- Optimized for performance

## 🐛 Troubleshooting

### Common Issues

#### Python Service Won't Start

```bash
# Check Python installation
python3 --version

# Reinstall AI service
npm run dynamic:setup

# Check logs
tail -f ai-service.log
```

#### Next.js Won't Start

```bash
# Check Node.js version
node --version

# Clear Next.js cache
rm -rf .next
npm run dev
```

#### Port Conflicts

```bash
# Check what's using the ports
lsof -i :3000
lsof -i :8000

# Use different ports
NEXT_PORT=3001 API_PORT=8001 npm run dynamic:start
```

### Log Files

- **Next.js**: `next-service.log`
- **AI Service**: `ai-service.log`
- **Configuration**: `dynamic-config.json`

## 🔧 Advanced Configuration

### Environment Variables

Create a `.env` file:

```bash
# Node.js Configuration
NODE_ENV=development
NEXT_PORT=3000
NEXT_HOST=localhost

# AI Service Configuration
API_PORT=8000
API_HOST=0.0.0.0
PYTHON_PATH=python3
VENV_PATH=./ai/venv

# Database Configuration
DATABASE_URL=your_database_url_here
DATABASE_TYPE=postgresql

# Additional Configuration
LOG_LEVEL=INFO
ENABLE_AI_TRAINING=true
```

### Custom Ports

```bash
# Start with custom ports
NEXT_PORT=3001 API_PORT=8001 npm run dynamic:start
```

### Service Isolation

```bash
# Start services separately
npm run dev &          # Next.js in background
cd ai && ./start_ai_service.sh &  # AI service in background
```

## 📊 Monitoring and Health Checks

### Service Status

```bash
# Check all services
curl http://localhost:3000/api/health
curl http://localhost:8000/health
```

### Performance Monitoring

- **Next.js**: Built-in Next.js analytics
- **AI Service**: FastAPI automatic metrics
- **System**: Process monitoring via startup script

## 🚀 Deployment

### Netlify (Current)

```bash
# Deploy to Netlify
npm run netlify:deploy
```

### Docker (Future)

```dockerfile
# Multi-stage build for both Node.js and Python
FROM node:18-alpine AS node-builder
# ... Node.js build steps

FROM python:3.9-slim AS python-builder
# ... Python build steps

FROM nginx:alpine
# ... Final image with both services
```

### VPS/Server

```bash
# Setup systemd services
sudo systemctl enable ai-analytics.service
sudo systemctl start ai-analytics.service

# Start Next.js with PM2
pm2 start npm --name "nextjs" -- start
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Test** both Node.js and Python services
4. **Submit** a pull request

### Development Guidelines

- **Node.js**: Follow Next.js best practices
- **Python**: Follow PEP 8 and FastAPI conventions
- **Integration**: Ensure services communicate properly
- **Testing**: Test both services independently and together

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [AI/ML Best Practices](https://scikit-learn.org/stable/)

## 🆘 Support

- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions
- **Documentation**: Check this README and inline code comments

---

**Happy coding! 🎉**

Your dropshipping store is now a powerful, dynamic system that combines the best of both Node.js and Python worlds!