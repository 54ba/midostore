/**
 * AI Service Client for Next.js
 * Provides TypeScript interfaces to communicate with the Python AI service
 */

export interface ProductData {
    id: string;
    name: string;
    category: string;
    price: number;
    sales_count: number;
    rating: number;
    review_count: number;
    created_at: string;
}

export interface TrendAnalysisRequest {
    category?: string;
    time_period?: string;
    include_forecast?: boolean;
}

export interface RecommendationRequest {
    user_id?: string;
    category?: string;
    limit?: number;
}

export interface TrendAnalysisResult {
    success: boolean;
    data: {
        total_products: number;
        avg_price: number;
        avg_rating: number;
        total_sales: number;
        top_categories: Record<string, number>;
        price_distribution: {
            min: number;
            max: number;
            median: number;
        };
        monthly_sales_trend?: Record<string, number>;
    };
    timestamp: string;
}

export interface RecommendationResult {
    success: boolean;
    data: Array<{
        id: string;
        name: string;
        category: string;
        price: number;
        rating: number;
        score: number;
    }>;
    timestamp: string;
}

export interface AIHealthStatus {
    status: string;
    timestamp: string;
    models: {
        trend_analyzer: boolean;
        recommendation_engine: boolean;
    };
}

export class AIClient {
    private baseUrl: string;
    private timeout: number;

    constructor(baseUrl: string = 'http://localhost:8000', timeout: number = 10000) {
        this.baseUrl = baseUrl;
        this.timeout = timeout;
    }

    /**
     * Check if the AI service is healthy
     */
    async healthCheck(): Promise<AIHealthStatus> {
        try {
            const response = await fetch(`${this.baseUrl}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: AbortSignal.timeout(this.timeout),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('AI service health check failed:', error);
            throw new Error('AI service is not available');
        }
    }

    /**
     * Analyze product trends
     */
    async analyzeTrends(
        data: ProductData[],
        request: TrendAnalysisRequest = {}
    ): Promise<TrendAnalysisResult> {
        try {
            const response = await fetch(`${this.baseUrl}/analyze/trends`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data,
                    ...request,
                }),
                signal: AbortSignal.timeout(this.timeout),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Trend analysis failed:', error);
            throw new Error('Failed to analyze trends');
        }
    }

    /**
     * Get product recommendations
     */
    async getRecommendations(
        data: ProductData[],
        request: RecommendationRequest = {}
    ): Promise<RecommendationResult> {
        try {
            const response = await fetch(`${this.baseUrl}/recommendations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data,
                    ...request,
                }),
                signal: AbortSignal.timeout(this.timeout),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to get recommendations:', error);
            throw new Error('Failed to get recommendations');
        }
    }

    /**
     * Train AI models with new data
     */
    async trainModels(data: ProductData[]): Promise<{ success: boolean; message: string; timestamp: string }> {
        try {
            const response = await fetch(`${this.baseUrl}/train`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data }),
                signal: AbortSignal.timeout(this.timeout),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Model training failed:', error);
            throw new Error('Failed to train models');
        }
    }

    /**
     * Get model status
     */
    async getModelStatus(): Promise<{
        trend_analyzer: { trained: boolean; model_type: string | null };
        recommendation_engine: { trained: boolean; model_type: string | null };
        models_directory: string;
        timestamp: string;
    }> {
        try {
            const response = await fetch(`${this.baseUrl}/models/status`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: AbortSignal.timeout(this.timeout),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to get model status:', error);
            throw new Error('Failed to get model status');
        }
    }

    /**
     * Get sample data for testing
     */
    async getSampleData(): Promise<{ data: ProductData[] }> {
        try {
            const response = await fetch(`${this.baseUrl}/sample-data`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: AbortSignal.timeout(this.timeout),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to get sample data:', error);
            throw new Error('Failed to get sample data');
        }
    }

    /**
     * Check if the AI service is available
     */
    async isAvailable(): Promise<boolean> {
        try {
            await this.healthCheck();
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get service information
     */
    async getServiceInfo(): Promise<{ message: string; version: string; status: string; endpoints: string[] }> {
        try {
            const response = await fetch(`${this.baseUrl}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: AbortSignal.timeout(this.timeout),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to get service info:', error);
            throw new Error('Failed to get service info');
        }
    }
}

// Create a default instance
export const aiClient = new AIClient();

// Export types for use in other parts of the app
export type {
    ProductData,
    TrendAnalysisRequest,
    RecommendationRequest,
    TrendAnalysisResult,
    RecommendationResult,
    AIHealthStatus,
};