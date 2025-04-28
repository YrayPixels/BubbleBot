// src/services/bubblemapsService.js - Interacts with Bubblemaps API
const axios = require('axios');
const config = require('../config');
const NodeCache = require('node-cache');
const { default: storage } = require('../libs/db');

// Initialize cache
const cache = new NodeCache({
    stdTTL: config.cache.ttl,
    checkperiod: config.cache.checkPeriod
});

// Create axios instance for Bubblemaps API
const bubblemapsApi = axios.create({
    baseURL: config.bubblemaps.metaDataUrl,
    timeout: config.bubblemaps.timeout,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Create axios instance for Mapdata API
const mapDataApi = axios.create({
    baseURL: config.bubblemaps.mapDataUrl,
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
async function getMapMetadata(address, chain) {

    const cacheKey = `token-score-${address}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return cachedData;
    }


    try {
        // First, try to get basic token info
        const tokenResponse = await bubblemapsApi.get(`?chain=${chain}&token=${address}`);


        if (tokenResponse.data.status !== 'OK') {
            console.log(`Token not found: ${address}`);
            return "Token not found or not a token contract.";
        }


        const tokenInfo = {
            ...tokenResponse.data,
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
async function getMapdata(address, chain) {
    const cacheKey = `token-info-${address}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await mapDataApi.get(`?chain=${chain}&token=${address}`);
        const mapData = response.data;

        const format = {
            name: mapData.full_name,
            symbol: mapData.symbol,
            address: mapData.token_address,
            chain: mapData.chain,
            maxAmount: mapData.metadata.max_amount,
            minAmount: mapData.metadata.min_amount,
            topTenHolders: mapData.nodes.slice(0, 10),
            largetHolder: mapData.nodes[0],
            smallestHolder: mapData.nodes[mapData.nodes.length - 1],
            totalHolders: mapData.nodes.length,
        }
        // Cache the result
        cache.set(cacheKey, format);

        return format;
    } catch (error) {
        console.error('Error fetching token info:', error.message);
        return null;
    }
}

/**
 * Get embedding URL for a token's bubble map
 * @param {string} address - Contract address
 * @returns {string} URL for embedding the bubble map
 */
function getBubbleUrl(address, chain) {
    return `${config.bubblemaps.tokenUrl}/${chain}/token/${address}`;
}

module.exports = {
    getMapMetadata,
    getMapdata,
    getBubbleUrl

};