# 🤖 AI-Powered Recommendation System

Advanced product recommendation engine using LightFM and machine learning for personalized e-commerce experiences.

## ✨ Features

### 🧠 **Core AI Capabilities**
- **LightFM Integration**: State-of-the-art hybrid recommendation algorithm
- **Personalized Recommendations**: User-specific product suggestions
- **Similar Item Detection**: Find related products based on features
- **Popular Item Ranking**: Trending and best-selling products
- **Category-based Filtering**: Recommendations within specific categories

### 🔄 **Real-time Learning**
- **Online Model Updates**: Continuous learning from user interactions
- **Interaction Tracking**: View, like, cart, and purchase events
- **Behavioral Analysis**: User preference learning over time
- **A/B Testing Ready**: Framework for recommendation experiments

### 📊 **Advanced Analytics**
- **Model Performance Metrics**: Precision, Recall, AUC scores
- **User Engagement Tracking**: Interaction patterns and preferences
- **Recommendation Accuracy**: Continuous model evaluation
- **Cache Statistics**: Performance monitoring and optimization

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App  │    │  Python Engine   │    │   PostgreSQL    │
│                 │    │                  │    │                 │
│ • React UI      │◄──►│ • LightFM Model  │◄──►│ • User Data     │
│ • API Routes    │    │ • Feature Engine │    │ • Products      │
│ • Components    │    │ • ML Pipeline    │    │ • Interactions  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### 1. **Setup Python Environment**
```bash
cd ai
chmod +x setup.sh
./setup.sh
```

### 2. **Activate Virtual Environment**
```bash
source ai/venv/bin/activate
```

### 3. **Install Dependencies**
```bash
npm install
```

### 4. **Setup Database**
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 5. **Train Initial Model**
```bash
# Via API
curl -X POST /api/recommendations \
  -H "Content-Type: application/json" \
  -d '{"action": "train"}'

# Or via dashboard at /ai-recommendations
```

## 📁 Project Structure

```
ai/
├── recommendation_engine.py    # Main LightFM engine
├── requirements.txt            # Python dependencies
├── setup.sh                   # Environment setup script
├── models/                    # Trained model files
├── data/                      # Training data exports
└── logs/                      # Training logs

src/
├── components/
│   └── AIRecommendations.tsx  # React recommendation component
├── app/
│   ├── api/recommendations/   # Recommendation APIs
│   └── (dashboard)/ai-recommendations/  # AI Dashboard
└── lib/
    └── recommendation-service.ts  # Node.js service wrapper
```

## 🔧 Configuration

### **Environment Variables**
```env
# AI Model Configuration
AI_MODEL_PATH=ai/models/recommendation_model.pkl
AI_TRAINING_EPOCHS=100
AI_LEARNING_RATE=0.05
AI_LOSS_FUNCTION=warp

# Feature Engineering
AI_TFIDF_MAX_FEATURES=1000
AI_CACHE_DURATION_MINUTES=15
AI_UPDATE_FREQUENCY_MINUTES=15
```

### **Model Parameters**
```python
# LightFM Configuration
model = LightFM(
    loss='warp',              # WARP loss for ranking
    learning_rate=0.05,       # Learning rate
    random_state=42           # Reproducibility
)

# Training Parameters
epochs=100                    # Training iterations
batch_size=1000              # Batch size for training
```

## 📊 API Endpoints

### **Get Recommendations**
```http
GET /api/recommendations?type=personalized&userId=123&nItems=10&category=electronics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "item_id": "product_123",
        "score": 0.85,
        "rank": 1,
        "type": "personalized",
        "confidence": 0.92
      }
    ],
    "type": "personalized",
    "category": "electronics",
    "nItems": 10,
    "userId": "123"
  }
}
```

### **Record User Interaction**
```http
POST /api/recommendations
{
  "action": "interaction",
  "user_id": "123",
  "product_id": "product_456",
  "type": "view",
  "metadata": {
    "source": "search",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### **Train/Retrain Model**
```http
POST /api/recommendations
{
  "action": "train"
}
```

### **Get Analytics**
```http
GET /api/recommendations/analytics
```

## 🎯 Usage Examples

### **React Component Integration**
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

// Popular products
<AIRecommendations
  type="popular"
  nItems={12}
  category="all"
/>
```

### **Programmatic Usage**
```typescript
import { RecommendationService } from '../lib/recommendation-service';

const recommendationService = new RecommendationService();

// Get personalized recommendations
const recommendations = await recommendationService.getPersonalizedRecommendations(
  userId,
  10,
  'electronics'
);

// Record user interaction
await recommendationService.recordUserInteraction({
  user_id: userId,
  product_id: productId,
  type: 'purchase',
  timestamp: new Date()
});
```

## 🧪 Model Training

### **Automatic Training**
The system automatically trains models when:
- Initial setup is completed
- New training data is available
- Model performance degrades
- Scheduled retraining (configurable)

### **Manual Training**
```bash
# Via API
curl -X POST /api/recommendations/analytics \
  -H "Content-Type: application/json" \
  -d '{"action": "retrain"}'

# Via Python script
cd ai
python recommendation_engine.py
```

### **Training Data Sources**
- **User Interactions**: Views, likes, cart additions, purchases
- **Product Features**: Title, description, tags, category, price
- **User Behavior**: Order history, preferences, demographics
- **Product Performance**: Ratings, reviews, sales data

## 📈 Performance Metrics

### **Model Evaluation**
- **Precision@K**: Accuracy of top-K recommendations
- **Recall@K**: Coverage of relevant items
- **AUC**: Overall model performance
- **User Satisfaction**: Click-through rates, conversion

### **Optimization Strategies**
- **Hyperparameter Tuning**: Automated optimization
- **Feature Engineering**: Advanced text and numerical features
- **Ensemble Methods**: Multiple model combination
- **Real-time Updates**: Continuous learning

## 🔍 Monitoring & Debugging

### **Dashboard Features**
- Real-time model status
- Training progress tracking
- Performance metrics
- User interaction analytics
- Cache statistics

### **Logging**
```bash
# View training logs
tail -f ai/logs/training.log

# Check model status
curl /api/recommendations/analytics?action=status
```

## 🚀 Deployment

### **Netlify Integration**
```toml
# netlify.toml
[build.environment]
  AI_MODEL_PATH = "ai/models/recommendation_model.pkl"
  PYTHON_VERSION = "3.9"
```

### **Docker Support**
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY ai/requirements.txt .
RUN pip install -r requirements.txt

COPY ai/ .
CMD ["python", "recommendation_engine.py"]
```

## 🔒 Security & Privacy

### **Data Protection**
- User data anonymization
- Secure model storage
- Access control for admin functions
- GDPR compliance features

### **Rate Limiting**
- API request throttling
- Model training limits
- Resource usage monitoring

## 🧪 Testing

### **Unit Tests**
```bash
# Python tests
cd ai
python -m pytest tests/

# Node.js tests
npm test
```

### **Integration Tests**
```bash
# Test recommendation API
npm run test:integration

# Test model training
npm run test:ai
```

## 📚 Advanced Features

### **Multi-Modal Recommendations**
- Text-based similarity
- Image feature extraction
- Price range matching
- Category affinity

### **A/B Testing Framework**
- Recommendation algorithm comparison
- User group segmentation
- Performance measurement
- Statistical significance testing

### **Real-time Personalization**
- Session-based recommendations
- Contextual suggestions
- Dynamic feature updates
- Instant model updates

## 🆘 Troubleshooting

### **Common Issues**

#### **Model Training Fails**
```bash
# Check Python environment
source ai/venv/bin/activate
python -c "import lightfm; print('LightFM OK')"

# Check dependencies
pip list | grep lightfm
```

#### **Recommendations Not Working**
```bash
# Check model status
curl /api/recommendations/analytics?action=status

# Check database connections
npm run db:studio
```

#### **Performance Issues**
```bash
# Monitor cache statistics
curl /api/recommendations/analytics

# Check model file size
ls -lh ai/models/
```

### **Debug Mode**
```env
DEBUG_AI=true
LOG_LEVEL=debug
```

## 🔮 Future Enhancements

### **Phase 2 (Next 3 months)**
- [ ] Advanced filtering algorithms
- [ ] Price alert systems
- [ ] Supplier analytics
- [ ] Mobile app integration

### **Phase 3 (6+ months)**
- [ ] Multi-language support expansion
- [ ] Integration with other platforms
- [ ] Advanced analytics dashboard
- [ ] Real-time streaming recommendations

## 📞 Support

### **Documentation**
- [LightFM Documentation](https://making.lyst.com/lightfm/docs/home.html)
- [Scikit-learn Guide](https://scikit-learn.org/stable/)
- [Next.js AI Integration](https://nextjs.org/docs/app/building-your-application/ai)

### **Community**
- GitHub Issues
- Discord Community
- Stack Overflow

---

**🎯 Ready to revolutionize your e-commerce with AI-powered recommendations!**

Start with the setup guide above and explore the dashboard at `/ai-recommendations` to see the system in action.