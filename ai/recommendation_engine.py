#!/usr/bin/env python3
"""
AI-Powered Recommendation Engine using LightFM
Advanced recommendation system for e-commerce products
"""

import json
import numpy as np
import pandas as pd
from lightfm import LightFM
from lightfm.evaluation import precision_at_k, recall_at_k, auc_score
from lightfm.data import Dataset
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import os
from datetime import datetime, timedelta
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RecommendationEngine:
    def __init__(self, model_path="models/recommendation_model.pkl"):
        self.model_path = model_path
        self.model = None
        self.dataset = Dataset()
        self.user_features = None
        self.item_features = None
        self.interaction_matrix = None
        self.user_mapping = {}
        self.item_mapping = {}
        self.reverse_user_mapping = {}
        self.reverse_item_mapping = {}
        self.tfidf_vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.scaler = StandardScaler()

    def load_data_from_json(self, data_file):
        """Load data from JSON file exported from the database"""
        try:
            with open(data_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return data
        except Exception as e:
            logger.error(f"Error loading data: {e}")
            return None

    def prepare_user_features(self, users_data):
        """Prepare user features for the recommendation model"""
        user_features = []
        user_ids = []

        for user in users_data:
            user_id = user.get('user_id')
            if user_id:
                user_ids.append(user_id)

                # Basic user features
                features = []

                # User preferences (if available)
                if 'preferences' in user:
                    prefs = user['preferences']
                    features.extend([
                        prefs.get('electronics', 0),
                        prefs.get('clothing', 0),
                        prefs.get('home', 0),
                        prefs.get('beauty', 0),
                        prefs.get('sports', 0)
                    ])
                else:
                    features.extend([0, 0, 0, 0, 0])

                # User behavior features
                features.extend([
                    user.get('total_orders', 0),
                    user.get('total_spent', 0),
                    user.get('avg_order_value', 0),
                    user.get('days_since_last_order', 30),
                    user.get('preferred_currency', 'USD') == 'USD' and 1 or 0
                ])

                user_features.append(features)

        if user_features:
            user_features = np.array(user_features)
            user_features = self.scaler.fit_transform(user_features)

        return user_ids, user_features

    def prepare_item_features(self, products_data):
        """Prepare item features for the recommendation model"""
        item_features = []
        item_ids = []

        # Prepare text features for TF-IDF
        product_descriptions = []

        for product in products_data:
            item_id = product.get('external_id')
            if item_id:
                item_ids.append(item_id)

                # Combine text features
                text_features = f"{product.get('title', '')} {product.get('description', '')} {' '.join(product.get('tags', []))}"
                product_descriptions.append(text_features)

                # Numerical features
                features = [
                    product.get('price', 0),
                    product.get('rating', 0),
                    product.get('review_count', 0),
                    product.get('sold_count', 0),
                    product.get('profit_margin', 0),
                    # Category encoding
                    1 if product.get('category') == 'electronics' else 0,
                    1 if product.get('category') == 'clothing' else 0,
                    1 if product.get('category') == 'home' else 0,
                    1 if product.get('category') == 'beauty' else 0,
                    1 if product.get('category') == 'sports' else 0,
                ]

                item_features.append(features)

        # Apply TF-IDF to text features
        if product_descriptions:
            tfidf_features = self.tfidf_vectorizer.fit_transform(product_descriptions).toarray()

            # Combine numerical and TF-IDF features
            if item_features:
                item_features = np.array(item_features)
                item_features = np.hstack([item_features, tfidf_features])
                item_features = self.scaler.fit_transform(item_features)

        return item_ids, item_features

    def prepare_interactions(self, interactions_data):
        """Prepare user-item interaction matrix"""
        interactions = []

        for interaction in interactions_data:
            user_id = interaction.get('user_id')
            item_id = interaction.get('product_id')
            interaction_type = interaction.get('type', 'view')

            if user_id and item_id:
                # Weight different types of interactions
                weight = {
                    'view': 1,
                    'like': 2,
                    'cart': 3,
                    'purchase': 5
                }.get(interaction_type, 1)

                interactions.append((user_id, item_id, weight))

        return interactions

    def build_dataset(self, users_data, products_data, interactions_data):
        """Build the LightFM dataset"""
        logger.info("Building LightFM dataset...")

        # Prepare features
        user_ids, user_features = self.prepare_user_features(users_data)
        item_ids, item_features = self.prepare_item_features(products_data)
        interactions = self.prepare_interactions(interactions_data)

        # Fit the dataset
        self.dataset.fit(
            users=user_ids,
            items=item_ids,
            user_features=user_features,
            item_features=item_features
        )

        # Build interaction matrix
        self.interaction_matrix, self.user_mapping, self.item_mapping = self.dataset.build_interactions(interactions)

        # Create reverse mappings
        self.reverse_user_mapping = {v: k for k, v in self.user_mapping.items()}
        self.reverse_item_mapping = {v: k for k, v in self.item_mapping.items()}

        # Build feature matrices
        self.user_features = self.dataset.build_user_features(user_features)
        self.item_features = self.dataset.build_item_features(item_features)

        logger.info(f"Dataset built with {len(user_ids)} users, {len(item_ids)} items, {len(interactions)} interactions")

    def train_model(self, epochs=100, learning_rate=0.05, loss='warp'):
        """Train the LightFM model"""
        logger.info("Training LightFM model...")

        # Initialize model
        self.model = LightFM(
            loss=loss,
            learning_rate=learning_rate,
            random_state=42
        )

        # Train the model
        self.model.fit(
            self.interaction_matrix,
            user_features=self.user_features,
            item_features=self.item_features,
            epochs=epochs,
            verbose=True
        )

        logger.info("Model training completed")

        # Evaluate model
        self.evaluate_model()

    def evaluate_model(self):
        """Evaluate the model performance"""
        logger.info("Evaluating model performance...")

        # Calculate precision at k
        precision = precision_at_k(self.model, self.interaction_matrix, k=10).mean()
        recall = recall_at_k(self.model, self.interaction_matrix, k=10).mean()
        auc = auc_score(self.model, self.interaction_matrix).mean()

        logger.info(f"Precision@10: {precision:.4f}")
        logger.info(f"Recall@10: {recall:.4f}")
        logger.info(f"AUC: {auc:.4f}")

        return {
            'precision_at_10': precision,
            'recall_at_10': recall,
            'auc': auc
        }

    def get_recommendations(self, user_id, n_items=10, user_features=None, item_features=None):
        """Get personalized recommendations for a user"""
        if self.model is None:
            logger.error("Model not trained. Please train the model first.")
            return []

        try:
            # Get user index
            user_idx = self.user_mapping.get(user_id)
            if user_idx is None:
                logger.warning(f"User {user_id} not found in training data")
                return self.get_popular_items(n_items)

            # Get scores for all items
            scores = self.model.predict(
                user_idx,
                np.arange(self.interaction_matrix.shape[1]),
                user_features=user_features or self.user_features,
                item_features=item_features or self.item_features
            )

            # Get top items
            top_items = np.argsort(-scores)[:n_items]

            # Convert back to item IDs
            recommendations = []
            for item_idx in top_items:
                item_id = self.reverse_item_mapping.get(item_idx)
                if item_id:
                    recommendations.append({
                        'item_id': item_id,
                        'score': float(scores[item_idx]),
                        'rank': len(recommendations) + 1
                    })

            return recommendations

        except Exception as e:
            logger.error(f"Error getting recommendations: {e}")
            return self.get_popular_items(n_items)

    def get_popular_items(self, n_items=10):
        """Get popular items based on interaction counts"""
        if self.interaction_matrix is None:
            return []

        # Sum interactions for each item
        item_popularity = np.sum(self.interaction_matrix, axis=0).A1

        # Get top popular items
        top_items = np.argsort(-item_popularity)[:n_items]

        recommendations = []
        for item_idx in top_items:
            item_id = self.reverse_item_mapping.get(item_idx)
            if item_id:
                recommendations.append({
                    'item_id': item_id,
                    'score': float(item_popularity[item_idx]),
                    'rank': len(recommendations) + 1,
                    'type': 'popular'
                })

        return recommendations

    def get_similar_items(self, item_id, n_items=10):
        """Get similar items based on item features"""
        if self.item_features is None:
            return []

        try:
            # Get item index
            item_idx = self.item_mapping.get(item_id)
            if item_idx is None:
                logger.warning(f"Item {item_id} not found in training data")
                return []

            # Get item features
            item_feature_vector = self.item_features[item_idx].toarray().flatten()

            # Calculate similarity with all other items
            similarities = cosine_similarity(
                item_feature_vector.reshape(1, -1),
                self.item_features.toarray()
            ).flatten()

            # Get top similar items (excluding the item itself)
            similarities[item_idx] = -1  # Exclude self
            top_items = np.argsort(-similarities)[:n_items]

            recommendations = []
            for similar_idx in top_items:
                similar_item_id = self.reverse_item_mapping.get(similar_idx)
                if similar_item_id:
                    recommendations.append({
                        'item_id': similar_item_id,
                        'score': float(similarities[similar_idx]),
                        'rank': len(recommendations) + 1,
                        'type': 'similar'
                    })

            return recommendations

        except Exception as e:
            logger.error(f"Error getting similar items: {e}")
            return []

    def get_category_recommendations(self, category, n_items=10):
        """Get recommendations within a specific category"""
        if self.item_features is None:
            return []

        try:
            # Find items in the category
            category_items = []
            for item_id, item_idx in self.item_mapping.items():
                # This would need to be implemented based on your category structure
                # For now, we'll return popular items
                pass

            return self.get_popular_items(n_items)

        except Exception as e:
            logger.error(f"Error getting category recommendations: {e}")
            return []

    def save_model(self):
        """Save the trained model"""
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)

        model_data = {
            'model': self.model,
            'dataset': self.dataset,
            'user_mapping': self.user_mapping,
            'item_mapping': self.item_mapping,
            'reverse_user_mapping': self.reverse_user_mapping,
            'reverse_item_mapping': self.reverse_item_mapping,
            'user_features': self.user_features,
            'item_features': self.item_features,
            'interaction_matrix': self.interaction_matrix,
            'tfidf_vectorizer': self.tfidf_vectorizer,
            'scaler': self.scaler,
            'metadata': {
                'created_at': datetime.now().isoformat(),
                'n_users': len(self.user_mapping),
                'n_items': len(self.item_mapping),
                'n_interactions': self.interaction_matrix.nnz if self.interaction_matrix else 0
            }
        }

        with open(self.model_path, 'wb') as f:
            pickle.dump(model_data, f)

        logger.info(f"Model saved to {self.model_path}")

    def load_model(self):
        """Load a previously trained model"""
        try:
            with open(self.model_path, 'rb') as f:
                model_data = pickle.load(f)

            self.model = model_data['model']
            self.dataset = model_data['dataset']
            self.user_mapping = model_data['user_mapping']
            self.item_mapping = model_data['item_mapping']
            self.reverse_user_mapping = model_data['reverse_user_mapping']
            self.reverse_item_mapping = model_data['reverse_item_mapping']
            self.user_features = model_data['user_features']
            self.item_features = model_data['item_features']
            self.interaction_matrix = model_data['interaction_matrix']
            self.tfidf_vectorizer = model_data['tfidf_vectorizer']
            self.scaler = model_data['scaler']

            logger.info(f"Model loaded from {self.model_path}")
            logger.info(f"Model metadata: {model_data['metadata']}")

            return True

        except Exception as e:
            logger.error(f"Error loading model: {e}")
            return False

    def update_model(self, new_interactions):
        """Update the model with new interactions (online learning)"""
        if self.model is None:
            logger.error("Model not trained. Please train the model first.")
            return False

        try:
            # Convert new interactions to the dataset format
            new_interaction_matrix, _, _ = self.dataset.build_interactions(new_interactions)

            # Update the model with new data
            self.model.fit_partial(
                new_interaction_matrix,
                user_features=self.user_features,
                item_features=self.item_features,
                epochs=10
            )

            logger.info("Model updated with new interactions")
            return True

        except Exception as e:
            logger.error(f"Error updating model: {e}")
            return False

def main():
    """Main function for training the recommendation model"""
    # Initialize the recommendation engine
    engine = RecommendationEngine()

    # Check if model exists and load it
    if os.path.exists(engine.model_path):
        logger.info("Loading existing model...")
        if engine.load_model():
            logger.info("Existing model loaded successfully")
            return
        else:
            logger.warning("Failed to load existing model, will train new one")

    # Load training data (you'll need to export this from your database)
    users_data = engine.load_data_from_json('data/users.json')
    products_data = engine.load_data_from_json('data/products.json')
    interactions_data = engine.load_data_from_json('data/interactions.json')

    if not all([users_data, products_data, interactions_data]):
        logger.error("Missing training data files")
        return

    # Build dataset
    engine.build_dataset(users_data, products_data, interactions_data)

    # Train model
    engine.train_model(epochs=100, learning_rate=0.05, loss='warp')

    # Save model
    engine.save_model()

    logger.info("Recommendation engine setup completed!")

if __name__ == "__main__":
    main()