/**
 * Runtime loader for puppeteer modules
 * This file uses require() calls to avoid webpack analysis during build
 */

// Browser environment check
const isBrowser = typeof window !== 'undefined';

let puppeteerInstance: any = null;
let isInitialized = false;

/**
 * Load puppeteer modules at runtime using require()
 */
async function loadPuppeteerModules() {
    if (isBrowser) {
        throw new Error('Puppeteer cannot be loaded in browser environment');
    }

    if (isInitialized) {
        return puppeteerInstance;
    }

    try {
        // Use eval to prevent webpack from analyzing these requires
        const puppeteerExtraModule = eval('require')('puppeteer-extra');
        let stealthPlugin = null;
        let adblockerPlugin = null;

        try {
            stealthPlugin = eval('require')('puppeteer-extra-plugin-stealth');
        } catch (e) {
            console.warn('Stealth plugin not available:', e);
        }

        try {
            adblockerPlugin = eval('require')('puppeteer-extra-plugin-adblocker');
        } catch (e) {
            console.warn('Adblocker plugin not available:', e);
        }

        puppeteerInstance = puppeteerExtraModule;

        // Add plugins if available
        if (stealthPlugin) {
            puppeteerInstance.use(stealthPlugin());
        }
        if (adblockerPlugin) {
            puppeteerInstance.use(adblockerPlugin());
        }

        isInitialized = true;
        return puppeteerInstance;

    } catch (error) {
        console.error('Failed to load puppeteer modules:', error);
        throw new Error(`Puppeteer modules not available: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Launch browser with puppeteer
 */
export async function launchPuppeteerBrowser() {
    const puppeteer = await loadPuppeteerModules();

    return await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-features=TranslateUI',
            '--disable-ipc-flooding-protection',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-extensions',
            '--disable-plugins',
            '--window-size=1920,1080',
        ],
    });
}

/**
 * Check if puppeteer is available in the current environment
 */
export function isPuppeteerAvailable(): boolean {
    if (isBrowser) return false;

    try {
        eval('require')('puppeteer-extra');
        return true;
    } catch {
        return false;
    }
}