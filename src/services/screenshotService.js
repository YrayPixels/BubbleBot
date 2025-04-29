// src/services/screenshotService.js - Handles screenshot generation
const puppeteer = require('puppeteer');
const config = require('../config');
const bubblemapsService = require('./bubblemapsService');
const NodeCache = require('node-cache');
require('dotenv').config()


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
            args: ['--no-sandbox', '--disable-setuid-sandbox',
                '--single-process',
                '--no-zygote',
                '--disable-gpu'],
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
async function captureTokenBubbleMap(address, chain) {
    const cacheKey = `screenshot-${address}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    try {
        const browser = await getBrowser();
        const page = await browser.newPage();

        // Navigate to the embed URL
        const embedUrl = bubblemapsService.getBubbleUrl(address, chain);
        await page.goto(embedUrl, { waitUntil: 'networkidle2' });


        // Wait for the SVG element to be available
        await page.waitForSelector(`#svg`, { timeout: config.screenshot.waitTime });

        // Get the bounding box of the SVG element
        const svgBoundingBox = await page.evaluate((id) => {
            const element = document.getElementById(id);

            if (!element) return null;
            if (element) {
                svg.style.transform = 'scale(0.7)';
                svg.style.transformOrigin = 'top left';
            }

            const { x, y, width, height } = element.getBoundingClientRect();
            return { x, y, width, height };
        }, 'svg');

        if (!svgBoundingBox) {
            throw new Error(`SVG element with ID "svg" not found`);
        }

        // Take screenshot of just the SVG element
        const screenshot = await page.screenshot({
            type: 'jpeg',
            quality: config.screenshot.quality,
            clip: {
                x: svgBoundingBox.x,
                y: svgBoundingBox.y,
                width: svgBoundingBox.width,
                height: svgBoundingBox.height
            }
        });

        await page.close();

        // // Wait for the bubble map to load
        // await page.waitForTimeout(config.screenshot.waitTime);

        // // Take screenshot
        // const screenshot = await page.screenshot({
        //     type: 'jpeg',
        //     quality: config.screenshot.quality
        // });

        // await page.close();

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