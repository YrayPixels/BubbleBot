// src/utils/validators.js - Input validation functions

/**
 * Validate if string is a valid Ethereum-style contract address
 * @param {string} address - Contract address to validate
 * @returns {boolean} True if address is valid
 */
function isValidAddress(address) {
    // Basic validation - checks if it's a string, starts with '0x', and is the right length
    if (typeof address !== 'string') return false;
    if (!address.startsWith('0x')) return false;

    // Valid Ethereum addresses are 42 characters (0x + 40 hex characters)
    if (address.length !== 42) return false;

    // Check if the remaining characters are valid hex (0-9, a-f, A-F)
    const hexRegex = /^0x[0-9a-fA-F]{40}$/;
    if (!hexRegex.test(address)) return false;

    return true;
}

/**
 * Validate if string is a valid blockchain network name
 * @param {string} network - Network name to validate
 * @returns {boolean} True if network name is valid
 */
function isValidNetwork(network) {
    const validNetworks = [
        'ethereum', 'bsc', 'polygon', 'avalanche', 'arbitrum', 'optimism',
        'fantom', 'base', 'solana'
    ];

    return validNetworks.includes(network.toLowerCase());
}

module.exports = {
    isValidAddress,
    isValidNetwork
};