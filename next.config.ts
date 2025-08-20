import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Static export for Netlify compatibility
    output: "export",

    // Do not fail production builds on ESLint issues
    eslint: {
        ignoreDuringBuilds: true,
    },

    // Allow build to pass even with TS errors
    typescript: {
        ignoreBuildErrors: true,
    },

    // Optimize for Netlify deployment
    trailingSlash: false,

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
};

export default nextConfig;