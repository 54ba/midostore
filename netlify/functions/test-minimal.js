exports.handler = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Minimal function test', timestamp: Date.now() })
    };
};