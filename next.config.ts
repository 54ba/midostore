import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Enable standalone output so Electron can run the
    // production Next.js server without dev dependencies
    output: "standalone",

    // Do not fail production builds on ESLint issues
    eslint: {
        ignoreDuringBuilds: true,
    },

    // Allow build to pass even with TS errors (to package Electron app)
    typescript: {
        ignoreBuildErrors: true,
    },

    // Optimize for Netlify deployment
    trailingSlash: false,

    // Ensure proper static generation
    generateStaticParams: async () => {
        return [];
    },

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**", // wildcard for any domain
            },
        ],
        // Disable image optimization for Netlify compatibility
        unoptimized: true,
    },

    // Ensure proper export for Netlify
    experimental: {
        // Enable app directory features
        appDir: true,
    },
};

export default nextConfig;