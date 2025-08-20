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

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**", // wildcard for any domain
            },
        ],
    },
};

export default nextConfig;