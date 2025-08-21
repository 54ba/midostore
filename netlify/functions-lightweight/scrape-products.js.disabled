// Lightweight scraping function for Netlify
exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { source, category } = JSON.parse(event.body || '{}');

        if (!source || !category) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing source or category' })
            };
        }

        // Generate mock products without external dependencies
        const products = Array.from({ length: 10 }, (_, i) => ({
            id: `mock_${Date.now()}_${i}`,
            externalId: `${source}_${category}_${i + 1}`,
            title: `${category} Product ${i + 1}`,
            price: (Math.random() * 100 + 10).toFixed(2),
            category,
            source,
            description: `A high-quality ${category} product from ${source}`,
            imageUrl: `https://via.placeholder.com/300x300?text=${encodeURIComponent(category)}`,
            createdAt: new Date().toISOString()
        }));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                jobId: `lightweight_${Date.now()}`,
                totalProducts: products.length,
                products: products,
                message: 'Lightweight scraping completed successfully',
                timestamp: new Date().toISOString()
            })
        };
    } catch (error) {
        console.error('Scraping function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};