#!/usr/bin/env python3
"""
FastAPI Server for AI Analytics Service
Provides REST API endpoints for trend analysis and insights
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
import json
import logging
from datetime import datetime
import os
import sys

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from trend_analyzer import TrendAnalyzer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Dropshipping AI Analytics API",
    description="AI-powered analytics and trend analysis for dropshipping stores",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the trend analyzer
analyzer = TrendAnalyzer()

# Pydantic models for request/response
class ProductData(BaseModel):
    id: str
    title: str
    soldCount: int
    rating: float
    reviewCount: int
    price: float
    profitMargin: float
    category: str
    createdAt: str
    tags: Optional[List[str]] = None
    supplier: Optional[str] = None

class AnalysisRequest(BaseModel):
    products: List[ProductData]
    analysis_type: str = "comprehensive"  # comprehensive, trends, predictions, opportunities

class AnalysisResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    timestamp: str
    analysis_type: str

class TrainingRequest(BaseModel):
    products: List[ProductData]
    model_type: str = "all"  # all, clustering, prediction

class TrainingResponse(BaseModel):
    success: bool
    message: str
    models_trained: List[str]
    timestamp: str

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    models_loaded: bool
    version: str

@app.get("/", response_model=HealthResponse)
async def root():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now().isoformat(),
        models_loaded=analyzer.models_loaded,
        version="1.0.0"
    )

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_trends(request: AnalysisRequest):
    """
    Analyze product trends and generate insights

    Args:
        request: AnalysisRequest containing product data and analysis type

    Returns:
        AnalysisResponse with analysis results
    """
    try:
        logger.info(f"Received analysis request for {len(request.products)} products")

        # Convert Pydantic models to dictionaries
        products_data = [product.dict() for product in request.products]

        # Perform analysis based on type
        if request.analysis_type == "comprehensive":
            results = analyzer.analyze_product_trends(products_data)
        elif request.analysis_type == "trends":
            results = analyzer.analyze_product_trends(products_data)
            # Filter to only trends
            results = {"trends": results.get("trends", {})}
        elif request.analysis_type == "predictions":
            results = analyzer.analyze_product_trends(products_data)
            # Filter to only predictions
            results = {"predictions": results.get("predictions", {})}
        elif request.analysis_type == "opportunities":
            results = analyzer.analyze_product_trends(products_data)
            # Filter to only opportunities
            results = {"opportunities": results.get("opportunities", [])}
        else:
            raise HTTPException(status_code=400, detail="Invalid analysis type")

        # Generate insights summary
        insights = analyzer.get_insights_summary(results)

        return AnalysisResponse(
            success=True,
            data={
                "analysis": results,
                "insights": insights
            },
            timestamp=datetime.now().isoformat(),
            analysis_type=request.analysis_type
        )

    except Exception as e:
        logger.error(f"Error in trend analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train", response_model=TrainingResponse)
async def train_models(request: TrainingRequest):
    """
    Train AI models with new data

    Args:
        request: TrainingRequest containing product data and model type

    Returns:
        TrainingResponse with training results
    """
    try:
        logger.info(f"Received training request for {len(request.products)} products")

        # Convert Pydantic models to dictionaries
        products_data = [product.dict() for product in request.products]

        # Train models
        if request.model_type == "all":
            analyzer.train_models(products_data)
            models_trained = ["clustering", "prediction", "scaling"]
        elif request.model_type == "clustering":
            # Train only clustering model
            df = analyzer._prepare_features(analyzer._prepare_features(products_data))
            analyzer.kmeans.fit(df)
            models_trained = ["clustering"]
        elif request.model_type == "prediction":
            # Train only prediction model
            df = analyzer._prepare_features(analyzer._prepare_features(products_data))
            if 'soldCount' in df.columns:
                target = df['soldCount'].values
                analyzer.trend_model.fit(df, target)
            models_trained = ["prediction"]
        else:
            raise HTTPException(status_code=400, detail="Invalid model type")

        return TrainingResponse(
            success=True,
            message="Models trained successfully",
            models_trained=models_trained,
            timestamp=datetime.now().isoformat()
        )

    except Exception as e:
        logger.error(f"Error in model training: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/insights/{analysis_id}")
async def get_insights(analysis_id: str):
    """
    Get insights for a specific analysis ID

    Args:
        analysis_id: Unique identifier for the analysis

    Returns:
        Insights data
    """
    try:
        # In a real implementation, you'd store and retrieve analysis results
        # For now, return a sample response
        return {
            "analysis_id": analysis_id,
            "insights": {
                "key_findings": ["Sample finding 1", "Sample finding 2"],
                "recommendations": ["Sample recommendation 1"],
                "opportunity_score": 0.7
            },
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        logger.error(f"Error retrieving insights: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models/status")
async def get_models_status():
    """Get the status of all AI models"""
    return {
        "models_loaded": analyzer.models_loaded,
        "models_available": [
            "clustering",
            "prediction",
            "scaling",
            "dimensionality_reduction"
        ],
        "last_training": "2024-01-01T00:00:00Z",  # In real implementation, track this
        "model_performance": {
            "clustering": "trained",
            "prediction": "trained" if analyzer.models_loaded else "not_trained"
        }
    }

@app.post("/models/reset")
async def reset_models():
    """Reset all trained models"""
    try:
        # Reset models
        analyzer.models_loaded = False
        analyzer.scaler = analyzer.scaler.__class__()
        analyzer.pca = analyzer.pca.__class__()
        analyzer.kmeans = analyzer.kmeans.__class__()
        analyzer.trend_model = analyzer.trend_model.__class__()

        return {
            "success": True,
            "message": "All models reset successfully",
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        logger.error(f"Error resetting models: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/docs")
async def get_documentation():
    """Get API documentation"""
    return {
        "endpoints": {
            "GET /": "Health check",
            "POST /analyze": "Analyze product trends",
            "POST /train": "Train AI models",
            "GET /insights/{id}": "Get insights by ID",
            "GET /models/status": "Get model status",
            "POST /models/reset": "Reset all models"
        },
        "request_examples": {
            "analyze": {
                "products": [
                    {
                        "id": "1",
                        "title": "Sample Product",
                        "soldCount": 100,
                        "rating": 4.5,
                        "reviewCount": 25,
                        "price": 29.99,
                        "profitMargin": 30,
                        "category": "electronics",
                        "createdAt": "2024-01-01T00:00:00Z"
                    }
                ],
                "analysis_type": "comprehensive"
            }
        }
    }

if __name__ == "__main__":
    # Run the server
    uvicorn.run(
        "api_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )