// src/config.js - Configuration settings
module.exports = {
    // Bot configuration
    bot: {
        name: 'BubblemapsBot',
        description: 'A Telegram bot that provides token analytics using Bubblemaps',
        commands: [
            { command: 'start', description: 'Start the bot' },
            { command: 'help', description: 'Show help information' },
            { command: 'about', description: 'Show information about the bot' },
            { command: 'analyze', description: 'Analyze a contract address' }
        ]
    },

    // Bubblemaps API configuration
    bubblemaps: {
        metaDataUrl: "https://api-legacy.bubblemaps.io/map-metadata",
        mapDataUrl: "https://api-legacy.bubblemaps.io/map-data",
        tokenUrl: "https://app.bubblemaps.io",
        timeout: 10000, // 10 seconds
        retries: 3,
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