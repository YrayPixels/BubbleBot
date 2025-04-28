// src/services/screenshotService.js - Handles screenshot generation
const puppeteer = require('puppeteer');
const config = require('../config');
const bubblemapsService = require('./bubblemapsService');
const NodeCache = require('node-cache');

// Initialize cache
const cache = new NodeCache({
    stdTTL: config.cache.ttl,
    checkperiod: config.cache.checkPeriod
});

// Store browser instance for reuse
let browser = null;

/**
 * Get or create a browser instance
 * @returns {Promise<Browser>} Puppeteer browser instance
 */
async function getBrowser() {
    if (!browser) {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
            defaultViewport: {
                width: config.screenshot.width,
                height: config.screenshot.height
            }
        });

        // Close browser on process exit
        process.on('exit', async () => {
            if (browser) {
                await browser.close();
            }
        });
    }

    return browser;
}

/**
 * Capture a screenshot of a token's bubble map
 * @param {string} address - Contract address
 * @returns {Promise<Buffer>} Screenshot buffer
 */
async function captureTokenBubbleMap(address) {
    const cacheKey = `screenshot-${address}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    try {
        const browser = await getBrowser();
        const page = await browser.newPage();

        // Navigate to the embed URL
        const embedUrl = bubblemapsService.getEmbedUrl(address);
        await page.goto(embedUrl, { waitUntil: 'networkidle2' });

        // Wait for the bubble map to load
        await page.waitForTimeout(config.screenshot.waitTime);

        // Take screenshot
        const screenshot = await page.screenshot({
            type: 'jpeg',
            quality: config.screenshot.quality
        });

        await page.close();

        // Cache the result
        cache.set(cacheKey, screenshot);

        return screenshot;
    } catch (error) {
        console.error('Error capturing screenshot:', error);
        return null;
    }
}

module.exports = {
    captureTokenBubbleMap
};