#!/bin/bash

echo "🚀 Setting up AI Analytics Service for Dropshipping Store"
echo "========================================================"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
echo "✅ Python version: $PYTHON_VERSION"

# Create AI directory if it doesn't exist
mkdir -p ai
cd ai

# Create virtual environment
echo "📦 Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️ Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "📚 Installing AI packages..."
pip install -r requirements.txt

# Create models directory
mkdir -p models

# Test the AI service
echo "🧪 Testing AI service..."
python3 -c "
from trend_analyzer import TrendAnalyzer
analyzer = TrendAnalyzer()
print('✅ AI Analytics service initialized successfully!')
"

# Create startup script
echo "📝 Creating startup script..."
cat > start_ai_service.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
source venv/bin/activate
echo "🚀 Starting AI Analytics Service..."
python3 api_server.py
EOF

chmod +x start_ai_service.sh

# Create systemd service file (optional)
if command -v systemctl &> /dev/null; then
    echo "🔧 Creating systemd service..."
    sudo tee /etc/systemd/system/ai-analytics.service > /dev/null << EOF
[Unit]
Description=AI Analytics Service for Dropshipping Store
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=$(pwd)/start_ai_service.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    echo "📋 Systemd service created. To enable:"
    echo "   sudo systemctl enable ai-analytics.service"
    echo "   sudo systemctl start ai-analytics.service"
fi

# Create environment file
echo "📝 Creating environment configuration..."
cat > .env << EOF
# AI Analytics Service Configuration
AI_MODEL_PATH=models/
ENABLE_AI_TRAINING=true
LOG_LEVEL=INFO

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=*

# Database Configuration (if needed)
# DATABASE_URL=your_database_url_here
EOF

echo ""
echo "🎉 AI Analytics Service setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Start the service: ./ai/start_ai_service.sh"
echo "2. Access the API: http://localhost:8000"
echo "3. View documentation: http://localhost:8000/docs"
echo ""
echo "🔧 Configuration files:"
echo "   - AI service: ./ai/"
echo "   - Environment: ./ai/.env"
echo "   - Requirements: ./ai/requirements.txt"
echo ""
echo "📊 Features available:"
echo "   - Product trend analysis"
echo "   - Category performance insights"
echo "   - Seasonal trend detection"
echo "   - AI-powered recommendations"
echo "   - Profit margin analysis"
echo ""
echo "🚀 To integrate with your dashboard:"
echo "   - The service runs on port 8000"
echo "   - Use the /analyze endpoint for trend analysis"
echo "   - Use the /train endpoint to train models with new data"
echo ""
echo "Happy analyzing! 🎯"