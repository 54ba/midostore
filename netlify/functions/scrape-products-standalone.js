exports.handler = async (event, context) => {
    const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

    try {
        const { source, category } = JSON.parse(event.body);
        if (!source || !category) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing params' }) };

        // Mock response for now - this avoids the Prisma dependency issue
        const products = Array.from({ length: 20 }, (_, i) => ({
            externalId: `${source}_${category}_${i + 1}`,
            title: `${category} Product ${i + 1}`,
            price: (Math.random() * 100 + 10).toFixed(2),
            category,
            source
        }));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                jobId: `mock_${Date.now()}`,
                totalProducts: products.length,
                products: products.slice(0, 5), // Return first 5 for preview
                message: 'Mock scraping completed - database integration pending'
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal error' }) };
    }
};