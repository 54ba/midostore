exports.handler = async (event, context) => {
    const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

    try {
        const { source, category } = JSON.parse(event.body);
        if (!source || !category) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing params' }) };

        // Generate mock data without any external dependencies
        const products = [];
        for (let i = 1; i <= 20; i++) {
            products.push({
                id: i,
                externalId: `${source}_${category}_${i}`,
                title: `${category} Product ${i}`,
                price: (Math.random() * 100 + 10).toFixed(2),
                category,
                source
            });
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                jobId: `minimal_${Date.now()}`,
                totalProducts: products.length,
                products: products.slice(0, 5),
                message: 'Minimal function working - no external deps'
            })
        };
    } catch (error) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal error' }) };
    }
};