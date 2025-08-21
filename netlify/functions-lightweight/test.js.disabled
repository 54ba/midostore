// Simple test function for Netlify
exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            message: 'Test function working successfully',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            functionName: 'test'
        })
    };
};