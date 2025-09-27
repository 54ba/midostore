# Contributing to MidoStore

We're thrilled that you're interested in contributing to MidoStore! This document provides guidelines for contributing to our AI-powered multi-seller dropshipping platform.

## 🚀 How to Contribute

### 1. **Fork & Clone**
```bash
# Fork the repository on GitHub
git clone https://github.com/yourusername/midostore.git
cd midostore
```

### 2. **Setup Development Environment**
```bash
# Install dependencies
npm install

# Setup environment
cp env.example .env.local
# Edit .env.local with your configuration

# Setup AI services
npm run ai:setup

# Initialize database
npm run db:generate
npm run db:push
npm run db:seed

# Start development
npm run quick:start
```

### 3. **Create a Feature Branch**
```bash
git checkout -b feature/your-amazing-feature
```

## 📝 Development Guidelines

### **Code Style**
- **TypeScript**: Use strict typing, avoid `any` types
- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Code formatting is enforced
- **File Naming**: Use kebab-case for files, PascalCase for components
- **Comments**: Document complex business logic and algorithms

### **Commit Messages**
Follow conventional commits:
```
feat: add user authentication system
fix: resolve payment gateway timeout issue
docs: update API documentation
style: format code with prettier
refactor: optimize recommendation algorithm
test: add unit tests for seller service
```

### **Testing**
- **Unit Tests**: Required for new services and utilities
- **Integration Tests**: Required for API endpoints
- **E2E Tests**: Recommended for critical user flows

```bash
# Run tests
npm run test:all

# Test specific areas
npm run test:apis
npm run test:services
npm run test:ai
```

## 🏗️ Project Structure

Understanding the codebase structure will help you contribute effectively:

```
midostore/
├── src/                     # Frontend application
│   ├── app/                # Next.js App Router
│   ├── components/         # React components
│   └── lib/               # Client-side utilities
├── lib/                   # Backend services (30+ services)
├── ai/                    # Python AI engine
├── scripts/               # Development and deployment scripts
├── docs/                  # Documentation
└── prisma/               # Database schema
```

## 🎯 Contribution Areas

### **🚀 High Priority**
- **Performance Optimization**: Database queries, API responses
- **AI/ML Improvements**: Recommendation algorithms, analytics
- **Security Enhancements**: Authentication, data validation
- **Mobile Responsiveness**: UI/UX improvements

### **🔧 Medium Priority**
- **New Payment Methods**: Additional payment integrations
- **Localization**: Support for more languages/regions
- **API Extensions**: New endpoints and features
- **Testing Coverage**: Expand test suites

### **💡 Feature Requests**
- **Mobile Apps**: React Native implementation
- **Advanced Analytics**: Business intelligence features
- **Third-party Integrations**: External service connections
- **Performance Monitoring**: Real-time metrics

## 🔍 Pull Request Process

### **Before Submitting**
1. **Code Quality**: Ensure code passes all lints and tests
2. **Documentation**: Update relevant documentation
3. **Testing**: Add tests for new functionality
4. **Changelog**: Update if your changes affect users

### **PR Requirements**
- **Clear Title**: Descriptive and specific
- **Detailed Description**: What, why, and how
- **Testing**: Describe how you tested your changes
- **Screenshots**: For UI changes
- **Breaking Changes**: Highlight any breaking changes

### **Review Process**
1. **Automated Checks**: All CI checks must pass
2. **Code Review**: At least one maintainer review
3. **Testing**: Manual testing for complex features
4. **Approval**: Final approval before merge

## 🐛 Bug Reports

### **Before Reporting**
- Search existing issues
- Try the latest version
- Provide minimal reproduction case

### **Bug Report Template**
```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Go to...
2. Click on...
3. Error occurs...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Node.js Version: [e.g., 18.17.0]
- npm Version: [e.g., 9.6.7]

## Additional Context
Any other relevant information
```

## 💡 Feature Requests

### **Feature Request Template**
```markdown
## Feature Summary
Brief description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How would you like this to work?

## Alternatives Considered
Any alternative solutions considered?

## Additional Context
Any other relevant information
```

## 🔧 Development Tips

### **Service Development**
- **Service Location**: Add new services to `lib/`
- **API Routes**: Add corresponding routes in `src/app/api/`
- **Type Safety**: Define interfaces in `lib/types.ts`
- **Error Handling**: Use consistent error patterns

### **AI/ML Features**
- **Python Code**: Add to `ai/` directory
- **FastAPI Endpoints**: Update `ai/api_server.py`
- **TypeScript Client**: Update `src/lib/ai-client.ts`
- **Testing**: Test both Python and TypeScript integration

### **Database Changes**
- **Schema Updates**: Modify collections as needed
- **Indexes**: Add performance indexes for new queries
- **Migrations**: Document any required data migrations
- **Testing**: Test with realistic data volumes

## 📚 Resources

### **Documentation**
- [API Documentation](./docs/README-API-ENDPOINTS.md)
- [Multi-Seller Architecture](./docs/MULTI_SELLER_SYSTEM_OVERVIEW.md)
- [Service Management](./docs/DYNAMIC_SYSTEM_SUMMARY.md)
- [Environment Setup](./docs/ENV_SETUP_GUIDE.md)

### **External Resources**
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

## ❓ Getting Help

### **Community Support**
- **GitHub Discussions**: For questions and ideas
- **Issues**: For bugs and feature requests
- **Discord**: [Join our community](#) (coming soon)

### **Maintainer Contact**
- **Email**: maintainer@midostore.com
- **GitHub**: [@maintainer](#)

## 🏆 Recognition

We recognize all contributors! Your contributions will be:
- **Listed**: In our contributors section
- **Credited**: In release notes for significant contributions
- **Appreciated**: With GitHub badges and recognition

## 📄 Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

### **Our Standards**
- **Respectful**: Be respectful of differing viewpoints
- **Constructive**: Focus on constructive criticism
- **Inclusive**: Welcome newcomers and encourage participation
- **Professional**: Maintain professional behavior

## 🎉 Thank You

Thank you for contributing to MidoStore! Your efforts help make this platform better for everyone. Every contribution, no matter how small, is valuable and appreciated.

---

*Happy coding! 🚀*
