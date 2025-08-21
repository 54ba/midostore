#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Specific fixes for remaining errors
const specificFixes = [
    // Fix AdvertisingDashboard type issues
    {
        file: 'src/components/AdvertisingDashboard.tsx',
        fixes: [
            {
                from: /const getStatusColor = \(status\) => \{/,
                to: 'const getStatusColor = (status: string): string => {'
            },
            {
                from: /const getStatusIcon = \(status\) => \{/,
                to: 'const getStatusIcon = (status: string): React.ReactElement => {'
            },
            {
                from: /campaigns\.filter\(c => c\.status === 'active'\)/g,
                to: 'campaigns.filter((c: any) => c.status === \'active\')'
            },
            {
                from: /campaigns\.reduce\(\(sum, c\) => sum \+ \(c\.totalSpent \|\| 0\), 0\)/g,
                to: 'campaigns.reduce((sum: number, c: any) => sum + (c.totalSpent || 0), 0)'
            }
        ]
    },

    // Fix MarketingDashboard type issues
    {
        file: 'src/components/MarketingDashboard.tsx',
        fixes: [
            {
                from: /const getPlatformIcon = \(platform\) => \{/,
                to: 'const getPlatformIcon = (platform: string): React.ReactElement => {'
            },
            {
                from: /const getPlatformColor = \(platform\) => \{/,
                to: 'const getPlatformColor = (platform: string): string => {'
            }
        ]
    },

    // Fix EnhancedDashboard type issues
    {
        file: 'src/components/EnhancedDashboard.tsx',
        fixes: [
            {
                from: /const getStatusColor = \(status\) => \{/,
                to: 'const getStatusColor = (status: string): string => {'
            }
        ]
    },

    // Fix AI client export conflicts
    {
        file: 'src/lib/ai-client.ts',
        fixes: [
            {
                from: /export \{\s*([^}]*ProductData[^}]*)\s*\};/,
                to: '// Removed conflicting exports'
            }
        ]
    },

    // Fix analytics route parameter types
    {
        file: 'src/app/api/analytics/live-sales/route.ts',
        fixes: [
            {
                from: /\.map\(order => \{/g,
                to: '.map((order: any) => {'
            },
            {
                from: /\.reduce\(\(sum, item\) => sum \+ \(item\.price \* item\.quantity\), 0\)/g,
                to: '.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)'
            }
        ]
    },

    // Fix analytics overview route
    {
        file: 'src/app/api/analytics/overview/route.ts',
        fixes: [
            {
                from: /\.map\(async \(item\) => \{/g,
                to: '.map(async (item: any) => {'
            },
            {
                from: /\.reduce\(\(acc, order\) => \{/g,
                to: '.reduce((acc: any, order: any) => {'
            },
            {
                from: /\.map\(stat => \(\{/g,
                to: '.map((stat: any) => ({'
            },
            {
                from: /\.reduce\(\(sum, order\) => sum \+ \(order\.totalAmount \|\| 0\), 0\)/g,
                to: '.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0)'
            }
        ]
    },

    // Fix features route
    {
        file: 'src/app/api/features/route.ts',
        fixes: [
            {
                from: /\.map\(feature => \(\{/g,
                to: '.map((feature: any) => ({'
            }
        ]
    },

    // Fix reviews route
    {
        file: 'src/app/api/reviews/route.ts',
        fixes: [
            {
                from: /\.map\(review => \(\{/g,
                to: '.map((review: any) => ({'
            },
            {
                from: /dbError\.message/g,
                to: '(dbError as Error).message'
            }
        ]
    },

    // Fix dynamic data service
    {
        file: 'src/lib/dynamic-data-service.ts',
        fixes: [
            {
                from: /\.map\(i => i\.product\.category\)/g,
                to: '.map((i: any) => i.product.category)'
            },
            {
                from: /\.map\(i => i\.productId\)/g,
                to: '.map((i: any) => i.productId)'
            },
            {
                from: /\.map\(product => \(\{/g,
                to: '.map((product: any) => ({'
            },
            {
                from: /\.map\(review => \(\{/g,
                to: '.map((review: any) => ({'
            }
        ]
    },

    // Fix manager dashboard
    {
        file: 'src/components/ManagerDashboard.tsx',
        fixes: [
            {
                from: /\.map\(\(category, index\) => \(/g,
                to: '.map((category: any, index: number) => ('
            }
        ]
    }
];

// Function to apply specific fixes
function applySpecificFixes() {
    let totalFixed = 0;

    for (const fileConfig of specificFixes) {
        const filePath = fileConfig.file;

        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');
            let hasChanges = false;

            for (const fix of fileConfig.fixes) {
                const originalContent = content;
                content = content.replace(fix.from, fix.to);

                if (originalContent !== content) {
                    hasChanges = true;
                }
            }

            if (hasChanges) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`✅ Fixed ${filePath}`);
                totalFixed++;
            }
        } else {
            console.log(`⚠️  File not found: ${filePath}`);
        }
    }

    console.log(`🎉 Applied fixes to ${totalFixed} files`);
}

// Main execution
if (require.main === module) {
    console.log('🔧 Applying remaining TypeScript fixes...');
    applySpecificFixes();
    console.log('✅ All remaining fixes applied!');
}

module.exports = { applySpecificFixes };