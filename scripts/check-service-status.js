#!/usr/bin/env node

const http = require('http');
const https = require('https');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    baseUrl: process.env.NEXT_BASE_URL || 'http://localhost:3000',
    timeout: 10000,
    logFile: 'service-status.log',
    services: [
        {
            name: 'Next.js App',
            url: '/',
            method: 'GET',
            expectedStatus: 200,
            description: 'Main application server'
        },
        {
            name: 'Bybit Payments API',
            url: '/api/bybit-payments?action=methods',
            method: 'GET',
            expectedStatus: 200,
            description: 'Bybit payment methods endpoint'
        },
        {
            name: 'Crypto API',
            url: '/api/crypto?action=supported-cryptos',
            method: 'GET',
            expectedStatus: 200,
            description: 'Cryptocurrency support endpoint'
        },
        {
            name: 'P2P API',
            url: '/api/p2p?action=supported-cryptos',
            method: 'GET',
            expectedStatus: 200,
            description: 'Peer-to-peer transactions endpoint'
        },
        {
            name: 'Bybit Webhook',
            url: '/api/bybit-webhook',
            method: 'GET',
            expectedStatus: 200,
            description: 'Bybit webhook health check'
        },
        {
            name: 'Payments API',
            url: '/api/payments',
            method: 'GET',
            expectedStatus: 200,
            description: 'General payments endpoint'
        }
    ]
};

// Colors for console output
const COLORS = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

class ServiceStatusChecker {
    constructor() {
        this.results = [];
        this.startTime = Date.now();
        this.logStream = null;
    }

    async start() {
        console.log(`${COLORS.bright}${COLORS.blue}🔍 Service Status Checker Starting...${COLORS.reset}\n`);

        // Initialize log file
        this.initLogFile();

        // Check system status
        await this.checkSystemStatus();

        // Check all services
        await this.checkAllServices();

        // Generate report
        this.generateReport();

        // Close log stream
        if (this.logStream) {
            this.logStream.end();
        }
    }

    initLogFile() {
        try {
            this.logStream = fs.createWriteStream(CONFIG.logFile, { flags: 'a' });
            this.logStream.write(`\n=== Service Status Check ${new Date().toISOString()} ===\n`);
        } catch (error) {
            console.error('Failed to create log file:', error.message);
        }
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;

        console.log(logMessage);

        if (this.logStream) {
            this.logStream.write(logMessage + '\n');
        }
    }

    async checkSystemStatus() {
        this.log('Checking system status...', 'info');

        // Check Node.js version
        try {
            const nodeVersion = process.version;
            this.log(`Node.js version: ${nodeVersion}`, 'info');
        } catch (error) {
            this.log(`Failed to get Node.js version: ${error.message}`, 'error');
        }

        // Check if Next.js is running
        try {
            const isNextRunning = await this.checkProcessRunning('next');
            this.log(`Next.js process running: ${isNextRunning ? 'Yes' : 'No'}`, isNextRunning ? 'info' : 'warn');
        } catch (error) {
            this.log(`Failed to check Next.js process: ${error.message}`, 'error');
        }

        // Check environment variables
        this.checkEnvironmentVariables();
    }

    async checkProcessRunning(processName) {
        return new Promise((resolve) => {
            exec(`pgrep -f "${processName}"`, (error, stdout) => {
                resolve(!error && stdout.trim().length > 0);
            });
        });
    }

    checkEnvironmentVariables() {
        this.log('Checking environment variables...', 'info');

        const requiredVars = [
            'BYBIT_API_KEY',
            'BYBIT_SECRET_KEY',
            'BYBIT_TESTNET',
            'BYBIT_WEBHOOK_SECRET'
        ];

        requiredVars.forEach(varName => {
            const value = process.env[varName];
            if (value) {
                this.log(`✓ ${varName}: ${varName.includes('SECRET') ? '***' : value}`, 'info');
            } else {
                this.log(`✗ ${varName}: Not set`, 'warn');
            }
        });
    }

    async checkAllServices() {
        this.log('Checking all services...', 'info');

        for (const service of CONFIG.services) {
            await this.checkService(service);
            // Add delay between requests
            await this.delay(500);
        }
    }

    async checkService(service) {
        const startTime = Date.now();

        try {
            this.log(`Checking ${service.name}...`, 'info');

            const result = await this.makeRequest(service);
            const responseTime = Date.now() - startTime;

            const isHealthy = result.status === service.expectedStatus;

            const resultObj = {
                name: service.name,
                url: service.url,
                status: result.status,
                expectedStatus: service.expectedStatus,
                responseTime,
                healthy: isHealthy,
                error: result.error,
                description: service.description,
                timestamp: new Date().toISOString()
            };

            this.results.push(resultObj);

            if (isHealthy) {
                this.log(`✓ ${service.name}: Healthy (${result.status}) - ${responseTime}ms`, 'success');
            } else {
                this.log(`✗ ${service.name}: Unhealthy (${result.status}, expected ${service.expectedStatus}) - ${responseTime}ms`, 'error');
            }

        } catch (error) {
            const responseTime = Date.now() - startTime;

            const resultObj = {
                name: service.name,
                url: service.url,
                status: 'ERROR',
                expectedStatus: service.expectedStatus,
                responseTime,
                healthy: false,
                error: error.message,
                description: service.description,
                timestamp: new Date().toISOString()
            };

            this.results.push(resultObj);
            this.log(`✗ ${service.name}: Error - ${error.message}`, 'error');
        }
    }

    async makeRequest(service) {
        return new Promise((resolve, reject) => {
            const url = new URL(service.url, CONFIG.baseUrl);
            const isHttps = url.protocol === 'https:';
            const client = isHttps ? https : http;

            const options = {
                hostname: url.hostname,
                port: url.port || (isHttps ? 443 : 80),
                path: url.pathname + url.search,
                method: service.method,
                timeout: CONFIG.timeout,
                headers: {
                    'User-Agent': 'ServiceStatusChecker/1.0'
                }
            };

            const req = client.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const jsonData = JSON.parse(data);
                        resolve({
                            status: res.statusCode,
                            data: jsonData,
                            error: null
                        });
                    } catch (error) {
                        resolve({
                            status: res.statusCode,
                            data: data,
                            error: 'Invalid JSON response'
                        });
                    }
                });
            });

            req.on('error', (error) => {
                reject(new Error(`Request failed: ${error.message}`));
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            req.end();
        });
    }

    generateReport() {
        const endTime = Date.now();
        const totalTime = endTime - this.startTime;

        console.log(`\n${COLORS.bright}${COLORS.blue}📊 Service Status Report${COLORS.reset}`);
        console.log(`${COLORS.cyan}================================${COLORS.reset}\n`);

        // Summary
        const totalServices = this.results.length;
        const healthyServices = this.results.filter(r => r.healthy).length;
        const unhealthyServices = totalServices - healthyServices;
        const successRate = ((healthyServices / totalServices) * 100).toFixed(1);

        console.log(`${COLORS.bright}Summary:${COLORS.reset}`);
        console.log(`  Total Services: ${totalServices}`);
        console.log(`  Healthy: ${COLORS.green}${healthyServices}${COLORS.reset}`);
        console.log(`  Unhealthy: ${COLORS.red}${unhealthyServices}${COLORS.reset}`);
        console.log(`  Success Rate: ${COLORS.cyan}${successRate}%${COLORS.reset}`);
        console.log(`  Total Check Time: ${totalTime}ms\n`);

        // Detailed results
        console.log(`${COLORS.bright}Detailed Results:${COLORS.reset}`);
        this.results.forEach((result, index) => {
            const statusIcon = result.healthy ? '✓' : '✗';
            const statusColor = result.healthy ? COLORS.green : COLORS.red;
            const statusText = result.healthy ? 'HEALTHY' : 'UNHEALTHY';

            console.log(`\n${index + 1}. ${COLORS.bright}${result.name}${COLORS.reset}`);
            console.log(`   Status: ${statusColor}${statusIcon} ${statusText}${COLORS.reset}`);
            console.log(`   URL: ${result.url}`);
            console.log(`   Response Time: ${result.responseTime}ms`);
            console.log(`   Description: ${result.description}`);

            if (!result.healthy) {
                if (result.error) {
                    console.log(`   Error: ${COLORS.red}${result.error}${COLORS.reset}`);
                } else {
                    console.log(`   Expected: ${result.expectedStatus}, Got: ${result.status}`);
                }
            }
        });

        // Recommendations
        if (unhealthyServices > 0) {
            console.log(`\n${COLORS.bright}${COLORS.yellow}⚠️  Recommendations:${COLORS.reset}`);

            this.results.filter(r => !r.healthy).forEach(result => {
                console.log(`  • ${result.name}: Check if the service is running and accessible`);
                if (result.error) {
                    console.log(`    Error details: ${result.error}`);
                }
            });
        } else {
            console.log(`\n${COLORS.bright}${COLORS.green}🎉 All services are healthy!${COLORS.reset}`);
        }

        // Log summary
        this.log(`Status check completed. ${healthyServices}/${totalServices} services healthy.`, 'info');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Main execution
async function main() {
    try {
        const checker = new ServiceStatusChecker();
        await checker.start();
    } catch (error) {
        console.error('Service status check failed:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = ServiceStatusChecker;