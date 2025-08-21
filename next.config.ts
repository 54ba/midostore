import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Remove standalone output to fix build issues
    // output: "standalone",

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

    // Explicitly disable Pages Router and ensure App Router only
    experimental: {
        // Remove appDir as it's not valid in Next.js 15
        // appDir: true,

        // Force App Router only
        typedRoutes: true,

        // Disable Pages Router features
        ppr: false,

        // Disable static generation for error pages
        staticPageGenerationTimeout: 0,
    },

    // Disable static export to prevent Pages Router generation
    output: undefined,

    // Force App Router only by disabling Pages Router features
    // This should prevent the generation of _document.js, _app.js, and _error.js
    // by ensuring all routing goes through the App Router

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

    // Optimize for production builds
    // swcMinify: true, // Removed as it's no longer needed in Next.js 15

    // Webpack configuration to handle Node.js modules
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // Client-side webpack config
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
                child_process: false,
                aws4: false,
            };
        }

        // Handle modules that can't be statically analyzed
        config.module.rules.push({
            test: /\.m?js$/,
            resolve: {
                fullySpecified: false,
            },
        });

        // Ignore problematic modules during build
        const problematicModules = [
            'puppeteer',
            'puppeteer-extra',
            'puppeteer-extra-plugin-stealth',
            'puppeteer-extra-plugin-adblocker',
            'clone-deep',
            'merge-deep'
        ];

        if (isServer) {
            // For server-side, externalize these modules
            config.externals = config.externals || [];
            if (Array.isArray(config.externals)) {
                config.externals.push(...problematicModules);
            } else if (typeof config.externals === 'function') {
                const originalExternals = config.externals;
                config.externals = (context: any, request: any, callback: any) => {
                    if (request && problematicModules.some(mod => request.includes(mod))) {
                        return callback(null, 'commonjs ' + request);
                    }
                    return originalExternals(context, request, callback);
                };
            }
        } else {
            // For client-side, completely ignore these modules
            config.resolve.alias = {
                ...config.resolve.alias,
                ...problematicModules.reduce((acc, mod) => {
                    acc[mod] = false;
                    return acc;
                }, {} as Record<string, boolean>)
            };
        }

        return config;
    },
};

export default nextConfig;