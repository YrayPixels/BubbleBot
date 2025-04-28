// src/services/bubblemapsService.js - Interacts with Bubblemaps API
const axios = require('axios');
const config = require('../config');
const NodeCache = require('node-cache');

// Initialize cache
const cache = new NodeCache({
    stdTTL: config.cache.ttl,
    checkperiod: config.cache.checkPeriod
});

// Create axios instance for Bubblemaps API
const bubblemapsApi = axios.create({
    baseURL: config.bubblemaps.baseUrl,
    timeout: config.bubblemaps.timeout,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': process.env.BUBBLEMAPS_API_KEY || ''
    }
});

// Create axios instance for Score API
const scoreApi = axios.create({
    baseURL: config.bubblemaps.scoreApiUrl,
    timeout: config.bubblemaps.timeout,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

/**
 * Get token information from Bubblemaps API
 * @param {string} address - Contract address to analyze
 * @returns {Promise<Object>} Token information
 */
async function getTokenInfo(address) {
    const cacheKey = `token-info-${address}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    try {
        // First, try to get basic token info
        const tokenResponse = await bubblemapsApi.get(`/tokens/${address}`);

        // Get additional market data if available
        let marketData = {};
        try {
            const marketResponse = await bubblemapsApi.get(`/tokens/${address}/market`);
            marketData = marketResponse.data;
        } catch (error) {
            console.log(`Market data not available for ${address}`);
        }

        // Get holder distribution data
        let holderData = {};
        try {
            const holderResponse = await bubblemapsApi.get(`/tokens/${address}/holders`);
            holderData = holderResponse.data;
        } catch (error) {
            console.log(`Holder data not available for ${address}`);
        }

        // Combine all data
        const tokenInfo = {
            ...tokenResponse.data,
            market: marketData,
            holders: holderData
        };

        // Cache the result
        cache.set(cacheKey, tokenInfo);

        return tokenInfo;
    } catch (error) {
        console.error('Error fetching token info:', error.message);
        return null;
    }
}

/**
 * Get token decentralization score from Score API
 * @param {string} address - Contract address to analyze
 * @returns {Promise<Object>} Token score information
 */
async function getTokenScore(address) {
    const cacheKey = `token-score-${address}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await scoreApi.get(`/score/${address}`);
        const scoreData = response.data;

        // Cache the result
        cache.set(cacheKey, scoreData);

        return scoreData;
    } catch (error) {
        console.error('Error fetching token score:', error.message);
        return null;
    }
}

/**
 * Get embedding URL for a token's bubble map
 * @param {string} address - Contract address
 * @returns {string} URL for embedding the bubble map
 */
function getEmbedUrl(address) {
    return `${config.bubblemaps.embedUrl}/${address}`;
}

module.exports = {
    getTokenInfo,
    getTokenScore,
    getEmbedUrl
};