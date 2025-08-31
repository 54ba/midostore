'use client';

import { useState, useEffect } from 'react';
import { aiClient, type ProductData, type TrendAnalysisResult, type RecommendationResult } from '@/lib/ai-client';

export default function AIIntegrationTest() {
    const [aiStatus, setAiStatus] = useState<string>('Checking...');
    const [trends, setTrends] = useState<TrendAnalysisResult | null>(null);
    const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sample product data for testing
    const sampleProducts: ProductData[] = [
        {
            id: '1',
            name: 'Wireless Headphones',
            category: 'Electronics',
            price: 99.99,
            sales_count: 150,
            rating: 4.5,
            review_count: 25,
            created_at: '2024-01-01T00:00:00Z'
        },
        {
            id: '2',
            name: 'Smart Watch',
            category: 'Electronics',
            price: 199.99,
            sales_count: 75,
            rating: 4.2,
            review_count: 18,
            created_at: '2024-01-15T00:00:00Z'
        },
        {
            id: '3',
            name: 'Running Shoes',
            category: 'Sports',
            price: 89.99,
            sales_count: 200,
            rating: 4.7,
            review_count: 42,
            created_at: '2024-02-01T00:00:00Z'
        },
        {
            id: '4',
            name: 'Yoga Mat',
            category: 'Sports',
            price: 29.99,
            sales_count: 120,
            rating: 4.3,
            review_count: 15,
            created_at: '2024-02-15T00:00:00Z'
        }
    ];

    useEffect(() => {
        checkAIStatus();
    }, []);

    const checkAIStatus = async () => {
        try {
            const isAvailable = await aiClient.isAvailable();
            setAiStatus(isAvailable ? '✅ Available' : '❌ Not Available');
        } catch (error) {
            setAiStatus('❌ Error checking status');
            console.error('AI status check failed:', error);
        }
    };

    const testTrendAnalysis = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await aiClient.analyzeTrends(sampleProducts, {
                time_period: '30d',
                include_forecast: true
            });
            setTrends(result);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to analyze trends');
        } finally {
            setLoading(false);
        }
    };

    const testRecommendations = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await aiClient.getRecommendations(sampleProducts, {
                limit: 5
            });
            setRecommendations(result);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to get recommendations');
        } finally {
            setLoading(false);
        }
    };

    const testModelTraining = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await aiClient.trainModels(sampleProducts);
            alert(`Training started: ${result.message}`);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to start training');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        🤖 AI Integration Test
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        Testing the integration between Next.js and Python AI services
                    </p>
                </div>

                {/* AI Service Status */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                        AI Service Status
                    </h2>
                    <div className="flex items-center space-x-4">
                        <span className="text-lg">{aiStatus}</span>
                        <button
                            onClick={checkAIStatus}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Refresh Status
                        </button>
                    </div>
                </div>

                {/* Test Controls */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                        Test Controls
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={testTrendAnalysis}
                            disabled={loading}
                            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Testing...' : 'Test Trend Analysis'}
                        </button>
                        <button
                            onClick={testRecommendations}
                            disabled={loading}
                            className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Testing...' : 'Test Recommendations'}
                        </button>
                        <button
                            onClick={testModelTraining}
                            disabled={loading}
                            className="px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Training...' : 'Test Model Training'}
                        </button>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error</h3>
                                <div className="mt-2 text-sm text-red-700">{error}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sample Data Display */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                        Sample Product Data
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sampleProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sales_count}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.rating}/5</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Trend Analysis Results */}
                {trends && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Trend Analysis Results
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium text-blue-900">Total Products</h3>
                                <p className="text-3xl font-bold text-blue-600">{trends.data.total_products}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium text-green-900">Average Price</h3>
                                <p className="text-3xl font-bold text-green-600">${trends.data.avg_price.toFixed(2)}</p>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium text-yellow-900">Average Rating</h3>
                                <p className="text-3xl font-bold text-yellow-600">{trends.data.avg_rating.toFixed(1)}/5</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium text-purple-900">Total Sales</h3>
                                <p className="text-3xl font-bold text-purple-600">{trends.data.total_sales}</p>
                            </div>
                        </div>

                        {trends.data.top_categories && (
                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Top Categories</h3>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(trends.data.top_categories).map(([category, count]) => (
                                        <span key={category} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                                            {category}: {count}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Recommendations Results */}
                {recommendations && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Product Recommendations
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recommendations.data.map((product) => (
                                <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">{product.name}</h3>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p>Category: {product.category}</p>
                                        <p>Price: ${product.price}</p>
                                        <p>Rating: {product.rating}/5</p>
                                        <p>Score: {product.score.toFixed(3)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                        How to Use This Test Page
                    </h2>
                    <div className="space-y-3 text-blue-800">
                        <p>1. <strong>Start the AI service:</strong> Run <code className="bg-blue-100 px-2 py-1 rounded">npm run dynamic:start</code> in your terminal</p>
                        <p>2. <strong>Check AI status:</strong> The page will automatically check if the AI service is available</p>
                        <p>3. <strong>Test features:</strong> Use the test buttons to try different AI functionalities</p>
                        <p>4. <strong>View results:</strong> Results will appear below after successful API calls</p>
                        <p>5. <strong>Troubleshoot:</strong> If you see errors, check that both Next.js and Python services are running</p>
                    </div>
                </div>
            </div>
        </div>
    );
}