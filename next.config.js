/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'example.com',
            'via.placeholder.com',
            'images.unsplash.com',
            'picsum.photos'
        ],
    },
    env: {
        CUSTOM_KEY: 'my-value',
    },
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
                ],
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: '/api/:path*',
            },
        ];
    },
};

module.exports = nextConfig;