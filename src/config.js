// src/config.js - Configuration settings
module.exports = {
    // Bot configuration
    bot: {
        name: 'BubblemapsBot',
        description: 'A Telegram bot that provides token analytics using Bubblemaps',
        commands: [
            { command: 'start', description: 'Start the bot' },
            { command: 'help', description: 'Show help information' },
            { command: 'info', description: 'Show information about the bot' },
            { command: 'analyze', description: 'Analyze a contract address' }
        ]
    },

    // Bubblemaps API configuration
    bubblemaps: {
        frameUrl: process.env.BUBBLEMAPS_FRAME_URL || 'https://bubblemaps.io',
        scanUrl: process.env.BUBBLEMAPS_SCAN_URL || 'https://scan.bubblemaps.io',
        baseUrl: process.env.BUBBLEMAPS_API_URL || 'https://api.bubblemaps.io',
        legacyUrl: process.env.BUBBLEMAPS_LEGACY_URL || 'https://api-legacy.bubblemaps.io/',
        timeout: 10000, // 10 seconds
        retries: 3,
        embedUrl: 'https://bubblemaps.io/embed',
        scoreApiUrl: 'https://score-api.bubblemaps.io',
    },

    endpoints: {
        metaData: legacyUrl + '/map-metadata',
        mapData: legacyUrl + '/map-data',
    },

    // Cache configuration
    cache: {
        ttl: 1800, // 30 minutes
        checkPeriod: 600 // 10 minutes
    },

    // Screenshot configuration
    screenshot: {
        width: 1200,
        height: 800,
        waitTime: 5000, // 5 seconds to wait for map to load
        quality: 80 // JPEG quality
    }
};