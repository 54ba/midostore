import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */

    // Disable ESLint during build for deployment
    eslint: {
        ignoreDuringBuilds: true,
    },

    // Disable TypeScript errors during build for deployment
    typescript: {
        ignoreBuildErrors: true,
    },

    // Webpack configuration
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Handle SVG files
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        return config;
    },

    // Output configuration
    output: 'standalone',

    // Server external packages (moved from experimental)
    serverExternalPackages: ['prisma', '@prisma/client'],

    // Images configuration
    images: {
        domains: [
            'localhost',
            'api.internal.tasker.ai',
            'cdn.tasker.ai',
            'images.unsplash.com',
            'via.placeholder.com'
        ],
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },

    // Redirects
    async redirects() {
        return [
            {
                source: '/products',
                destination: '/dashboard/products',
                permanent: true,
            },
        ];
    },

    // Headers
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;