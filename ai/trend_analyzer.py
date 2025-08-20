#!/usr/bin/env python3
"""
AI-Powered Trend Analysis Service for Dropshipping Store
Uses modern AI packages to analyze product trends, customer behavior, and market opportunities
"""

import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import json
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Any
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TrendAnalyzer:
    def __init__(self, model_path: str = "models/"):
        self.model_path = model_path
        self.scaler = StandardScaler()
        self.pca = PCA(n_components=3)
        self.kmeans = KMeans(n_clusters=5, random_state=42)
        self.trend_model = RandomForestRegressor(n_components=100, random_state=42)
        self.models_loaded = False

        # Create models directory if it doesn't exist
        os.makedirs(model_path, exist_ok=True)

        # Load pre-trained models if they exist
        self.load_models()

    def load_models(self):
        """Load pre-trained models from disk"""
        try:
            if os.path.exists(f"{self.model_path}scaler.pkl"):
                self.scaler = joblib.load(f"{self.model_path}scaler.pkl")
                self.pca = joblib.load(f"{self.model_path}pca.pkl")
                self.kmeans = joblib.load(f"{self.model_path}kmeans.pkl")
                self.trend_model = joblib.load(f"{self.model_path}trend_model.pkl")
                self.models_loaded = True
                logger.info("Models loaded successfully")
        except Exception as e:
            logger.warning(f"Could not load models: {e}")
            self.models_loaded = False

    def save_models(self):
        """Save trained models to disk"""
        try:
            joblib.dump(self.scaler, f"{self.model_path}scaler.pkl")
            joblib.dump(self.pca, f"{self.model_path}pca.pkl")
            joblib.dump(self.kmeans, f"{self.model_path}kmeans.pkl")
            joblib.dump(self.trend_model, f"{self.model_path}trend_model.pkl")
            logger.info("Models saved successfully")
        except Exception as e:
            logger.error(f"Error saving models: {e}")

    def analyze_product_trends(self, products_data: List[Dict]) -> Dict[str, Any]:
        """
        Analyze product trends using AI algorithms

        Args:
            products_data: List of product dictionaries with sales, ratings, etc.

        Returns:
            Dictionary containing trend analysis results
        """
        try:
            # Convert to DataFrame
            df = pd.DataFrame(products_data)

            if df.empty:
                return {"error": "No product data provided"}

            # Prepare features for analysis
            features = self._prepare_features(df)

            # Perform clustering analysis
            clusters = self._perform_clustering(features)

            # Analyze trends
            trends = self._analyze_trends(df, clusters)

            # Generate predictions
            predictions = self._generate_predictions(df, features)

            # Identify opportunities
            opportunities = self._identify_opportunities(df, trends)

            return {
                "clusters": clusters,
                "trends": trends,
                "predictions": predictions,
                "opportunities": opportunities,
                "analysis_timestamp": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Error in product trend analysis: {e}")
            return {"error": str(e)}

    def _prepare_features(self, df: pd.DataFrame) -> np.ndarray:
        """Prepare features for AI analysis"""
        # Select numerical features
        feature_columns = ['soldCount', 'rating', 'reviewCount', 'price', 'profitMargin']

        # Handle missing values
        for col in feature_columns:
            if col in df.columns:
                df[col] = df[col].fillna(df[col].median())
            else:
                df[col] = 0

        # Create additional features
        df['revenue'] = df['soldCount'] * df['price']
        df['rating_weighted'] = df['rating'] * df['reviewCount']
        df['profit'] = df['revenue'] * (df['profitMargin'] / 100)

        # Normalize features
        features = df[['soldCount', 'rating', 'reviewCount', 'price', 'profitMargin', 'revenue', 'rating_weighted', 'profit']].values

        if not self.models_loaded:
            features = self.scaler.fit_transform(features)
        else:
            features = self.scaler.transform(features)

        return features

    def _perform_clustering(self, features: np.ndarray) -> Dict[str, Any]:
        """Perform K-means clustering on products"""
        if not self.models_loaded:
            self.kmeans.fit(features)

        cluster_labels = self.kmeans.labels_
        cluster_centers = self.kmeans.cluster_centers_

        # Analyze clusters
        clusters = {}
        for i in range(self.kmeans.n_clusters):
            cluster_mask = cluster_labels == i
            cluster_size = np.sum(cluster_mask)

            clusters[f"cluster_{i}"] = {
                "size": int(cluster_size),
                "center": cluster_centers[i].tolist(),
                "characteristics": self._describe_cluster(features[cluster_mask])
            }

        return clusters

    def _describe_cluster(self, cluster_features: np.ndarray) -> Dict[str, Any]:
        """Describe characteristics of a cluster"""
        if len(cluster_features) == 0:
            return {}

        return {
            "avg_sales": float(np.mean(cluster_features[:, 0])),
            "avg_rating": float(np.mean(cluster_features[:, 1])),
            "avg_reviews": float(np.mean(cluster_features[:, 2])),
            "avg_price": float(np.mean(cluster_features[:, 3])),
            "avg_profit_margin": float(np.mean(cluster_features[:, 4]))
        }

    def _analyze_trends(self, df: pd.DataFrame, clusters: Dict) -> Dict[str, Any]:
        """Analyze product trends"""
        trends = {}

        # Sales trends
        if 'soldCount' in df.columns:
            sales_trend = self._calculate_trend(df['soldCount'])
            trends['sales_trend'] = sales_trend

        # Rating trends
        if 'rating' in df.columns:
            rating_trend = self._calculate_trend(df['rating'])
            trends['rating_trend'] = rating_trend

        # Price trends
        if 'price' in df.columns:
            price_trend = self._calculate_trend(df['price'])
            trends['price_trend'] = price_trend

        # Category performance
        if 'category' in df.columns:
            category_performance = self._analyze_category_performance(df)
            trends['category_performance'] = category_performance

        # Seasonal patterns
        if 'createdAt' in df.columns:
            seasonal_patterns = self._analyze_seasonal_patterns(df)
            trends['seasonal_patterns'] = seasonal_patterns

        return trends

    def _calculate_trend(self, series: pd.Series) -> Dict[str, Any]:
        """Calculate trend direction and strength"""
        if len(series) < 2:
            return {"direction": "stable", "strength": 0, "change": 0}

        # Simple trend calculation
        first_half = series.iloc[:len(series)//2].mean()
        second_half = series.iloc[len(series)//2:].mean()

        change = second_half - first_half
        change_percent = (change / first_half * 100) if first_half != 0 else 0

        if change_percent > 10:
            direction = "increasing"
            strength = min(abs(change_percent) / 50, 1.0)
        elif change_percent < -10:
            direction = "decreasing"
            strength = min(abs(change_percent) / 50, 1.0)
        else:
            direction = "stable"
            strength = 0

        return {
            "direction": direction,
            "strength": float(strength),
            "change": float(change_percent),
            "first_half_avg": float(first_half),
            "second_half_avg": float(second_half)
        }

    def _analyze_category_performance(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze performance by category"""
        if 'category' not in df.columns:
            return {}

        category_stats = df.groupby('category').agg({
            'soldCount': ['mean', 'sum', 'count'],
            'rating': 'mean',
            'price': 'mean',
            'reviewCount': 'mean'
        }).round(2)

        # Calculate category scores
        category_scores = {}
        for category in category_stats.index:
            stats = category_stats.loc[category]

            # Simple scoring algorithm
            sales_score = min(stats[('soldCount', 'sum')] / 100, 1.0)
            rating_score = stats[('rating', 'mean')] / 5.0
            review_score = min(stats[('reviewCount', 'mean')] / 50, 1.0)

            total_score = (sales_score * 0.4 + rating_score * 0.4 + review_score * 0.2)

            category_scores[category] = {
                "avg_sales": float(stats[('soldCount', 'mean')]),
                "total_sales": int(stats[('soldCount', 'sum')]),
                "product_count": int(stats[('soldCount', 'count')]),
                "avg_rating": float(stats[('rating', 'mean')]),
                "avg_price": float(stats[('price', 'mean')]),
                "avg_reviews": float(stats[('reviewCount', 'mean')]),
                "performance_score": float(total_score)
            }

        return category_scores

    def _analyze_seasonal_patterns(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze seasonal patterns in product performance"""
        if 'createdAt' not in df.columns:
            return {}

        try:
            # Convert to datetime
            df['createdAt'] = pd.to_datetime(df['createdAt'])
            df['month'] = df['createdAt'].dt.month
            df['season'] = df['createdAt'].dt.month.map({
                12: 'Winter', 1: 'Winter', 2: 'Winter',
                3: 'Spring', 4: 'Spring', 5: 'Spring',
                6: 'Summer', 7: 'Summer', 8: 'Summer',
                9: 'Fall', 10: 'Fall', 11: 'Fall'
            })

            seasonal_stats = df.groupby('season').agg({
                'soldCount': 'sum',
                'rating': 'mean',
                'reviewCount': 'sum'
            }).round(2)

            seasonal_patterns = {}
            for season in seasonal_stats.index:
                stats = seasonal_stats.loc[season]
                seasonal_patterns[season] = {
                    "total_sales": int(stats['soldCount']),
                    "avg_rating": float(stats['rating']),
                    "total_reviews": int(stats['reviewCount'])
                }

            return seasonal_patterns

        except Exception as e:
            logger.warning(f"Could not analyze seasonal patterns: {e}")
            return {}

    def _generate_predictions(self, df: pd.DataFrame, features: np.ndarray) -> Dict[str, Any]:
        """Generate predictions for future performance"""
        try:
            if len(df) < 10:
                return {"error": "Insufficient data for predictions"}

            # Prepare target variable (future sales)
            target = df['soldCount'].values

            # Split data for training
            X_train, X_test, y_train, y_test = train_test_split(
                features, target, test_size=0.2, random_state=42
            )

            # Train model if not loaded
            if not self.models_loaded:
                self.trend_model.fit(X_train, y_train)

            # Make predictions
            y_pred = self.trend_model.predict(X_test)

            # Calculate model performance
            mse = mean_squared_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)

            # Generate future predictions (simple extrapolation)
            future_predictions = self._extrapolate_future_sales(df)

            return {
                "model_performance": {
                    "mse": float(mse),
                    "r2_score": float(r2)
                },
                "future_predictions": future_predictions,
                "prediction_confidence": min(r2, 1.0) if r2 > 0 else 0
            }

        except Exception as e:
            logger.error(f"Error generating predictions: {e}")
            return {"error": str(e)}

    def _extrapolate_future_sales(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Extrapolate future sales based on current trends"""
        if 'soldCount' not in df.columns:
            return {}

        # Simple linear extrapolation
        sales = df['soldCount'].values
        if len(sales) < 2:
            return {}

        # Calculate trend
        x = np.arange(len(sales))
        slope = np.polyfit(x, sales, 1)[0]

        # Predict next 3 periods
        future_periods = 3
        future_sales = []

        for i in range(1, future_periods + 1):
            future_sale = sales[-1] + slope * i
            future_sales.append(max(0, int(future_sale)))

        return {
            "trend_slope": float(slope),
            "next_period": future_sales[0],
            "two_periods": future_sales[1],
            "three_periods": future_sales[2],
            "trend_direction": "increasing" if slope > 0 else "decreasing"
        }

    def _identify_opportunities(self, df: pd.DataFrame, trends: Dict) -> List[Dict[str, Any]]:
        """Identify business opportunities based on analysis"""
        opportunities = []

        # High-performing products with low visibility
        if 'soldCount' in df.columns and 'rating' in df.columns:
            high_rated = df[df['rating'] >= 4.0]
            low_sales = high_rated[high_rated['soldCount'] < high_rated['soldCount'].quantile(0.5)]

            if not low_sales.empty:
                opportunities.append({
                    "type": "marketing",
                    "title": "Boost High-Rated Products",
                    "description": f"{len(low_sales)} high-rated products have low sales. Consider marketing campaigns.",
                    "potential_impact": "high",
                    "products_count": len(low_sales)
                })

        # Category expansion opportunities
        if 'category' in df.columns:
            category_counts = df['category'].value_counts()
            under_represented = category_counts[category_counts < 5]

            if not under_represented.empty:
                opportunities.append({
                    "type": "inventory",
                    "title": "Expand Product Categories",
                    "description": f"Consider adding more products to {len(under_represented)} under-represented categories.",
                    "potential_impact": "medium",
                    "categories": under_represented.index.tolist()
                })

        # Pricing optimization opportunities
        if 'profitMargin' in df.columns:
            low_margin = df[df['profitMargin'] < 20]
            if not low_margin.empty:
                opportunities.append({
                    "type": "pricing",
                    "title": "Optimize Pricing Strategy",
                    "description": f"{len(low_margin)} products have profit margins below 20%. Consider price adjustments.",
                    "potential_impact": "high",
                    "products_count": len(low_margin)
                })

        return opportunities

    def train_models(self, products_data: List[Dict]):
        """Train all AI models with new data"""
        try:
            logger.info("Training AI models...")

            df = pd.DataFrame(products_data)
            if df.empty:
                logger.warning("No data provided for training")
                return

            features = self._prepare_features(df)

            # Train clustering model
            self.kmeans.fit(features)

            # Train trend prediction model
            if 'soldCount' in df.columns:
                target = df['soldCount'].values
                if len(features) > 10:
                    self.trend_model.fit(features, target)

            # Save trained models
            self.save_models()
            self.models_loaded = True

            logger.info("Models trained and saved successfully")

        except Exception as e:
            logger.error(f"Error training models: {e}")

    def get_insights_summary(self, analysis_results: Dict) -> Dict[str, Any]:
        """Generate a summary of key insights"""
        if "error" in analysis_results:
            return analysis_results

        summary = {
            "key_findings": [],
            "recommendations": [],
            "risk_alerts": [],
            "opportunity_score": 0
        }

        # Extract key findings
        if "trends" in analysis_results:
            trends = analysis_results["trends"]

            # Sales trend insights
            if "sales_trend" in trends:
                sales_trend = trends["sales_trend"]
                if sales_trend["direction"] == "decreasing":
                    summary["key_findings"].append("Sales are declining - immediate attention needed")
                    summary["risk_alerts"].append("Declining sales trend detected")
                elif sales_trend["direction"] == "increasing":
                    summary["key_findings"].append("Sales are growing - capitalize on momentum")
                    summary["opportunity_score"] += 0.3

            # Category performance insights
            if "category_performance" in trends:
                category_perf = trends["category_performance"]
                best_category = max(category_perf.items(), key=lambda x: x[1]["performance_score"])
                summary["key_findings"].append(f"Best performing category: {best_category[0]}")
                summary["recommendations"].append(f"Focus marketing efforts on {best_category[0]} category")

        # Extract opportunities
        if "opportunities" in analysis_results:
            opportunities = analysis_results["opportunities"]
            high_impact = [opp for opp in opportunities if opp["potential_impact"] == "high"]
            if high_impact:
                summary["recommendations"].extend([opp["title"] for opp in high_impact[:3]])
                summary["opportunity_score"] += 0.4

        # Calculate overall opportunity score
        summary["opportunity_score"] = min(summary["opportunity_score"], 1.0)

        return summary

def main():
    """Main function for testing the trend analyzer"""
    # Sample data for testing
    sample_data = [
        {
            "id": "1",
            "title": "Sample Product 1",
            "soldCount": 100,
            "rating": 4.5,
            "reviewCount": 25,
            "price": 29.99,
            "profitMargin": 30,
            "category": "electronics",
            "createdAt": "2024-01-01T00:00:00Z"
        },
        {
            "id": "2",
            "title": "Sample Product 2",
            "soldCount": 75,
            "rating": 4.2,
            "reviewCount": 18,
            "price": 19.99,
            "profitMargin": 25,
            "category": "clothing",
            "createdAt": "2024-01-02T00:00:00Z"
        }
    ]

    # Initialize analyzer
    analyzer = TrendAnalyzer()

    # Analyze trends
    results = analyzer.analyze_product_trends(sample_data)

    # Get insights summary
    summary = analyzer.get_insights_summary(results)

    # Print results
    print("=== AI Trend Analysis Results ===")
    print(json.dumps(results, indent=2))
    print("\n=== Key Insights Summary ===")
    print(json.dumps(summary, indent=2))

if __name__ == "__main__":
    main()