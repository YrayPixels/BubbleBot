// src/utils/formatters.js - Data formatting functions

/**
 * Format token information for display
 * @param {Object} tokenInfo - Token information from API
 * @param {Object} tokenScore - Token score information
 * @returns {string} Formatted token information
 */
function formatTokenInfo(tokenScore, tokenInfo) {
    if (!tokenInfo) {
        return '❌ No information available for this token.';
    }

    // Format basic token info
    let result = `*${tokenInfo.name || 'Unknown Token'}* (${tokenInfo.symbol || '?'})\n` +
        `Contract: \`${tokenInfo.address}\`\n` +
        `Chain:` + `${tokenInfo.chain}`.toUpperCase() + `\n\n`;

    // Format market data if available
    if (Object.keys(tokenInfo).length > 0) {
        result += `*📊 Market Data:*\n`;

        if (tokenInfo.maxAmount) {
            result += `• Max Amount: $${formatNumber(tokenInfo.maxAmount)}\n`;
        }
        if (tokenInfo.minAmount) {
            result += `• Min Amount: $${formatNumber(tokenInfo.minAmount)}\n`;
        }


        if (tokenInfo.largeHolders) {
            result += `• Biggest Node: $${tokenInfo.largeHolders.name}\n`;
            result += `• Amount: $${formatNumber(tokenInfo.largeHolders.amount)}\n`;
            result += `• Percentage: $${formatNumber(tokenInfo.largeHolders.percentage)}%\n`;

        }

        if (tokenInfo.smallestHolder) {
            result += `• Smallest Node: $${tokenInfo.smallestHolder.name}\n`;
            result += `• Amount: $${formatNumber(tokenInfo.smallestHolder.amount)}\n`;
            result += `• Percentage: $${formatNumber(tokenInfo.smallestHolder.percentage)}%\n`;

        }

        result += '\n';
    }

    // Format token score if available
    if (tokenScore) {
        result += `*🔍 Decentralization Analysis:*\n`;

        if (tokenScore.decentralisation_score) {
            const scorePercentage = Math.round(tokenScore.decentralisation_score);
            result += `• Decentralization Score: ${scorePercentage}%\n`;
        }

        if (tokenInfo.totalHolders) {
            result += `• Total Nodes: ${formatNumber(tokenInfo.totalHolders)}\n`;
        }

        result += '\n';
    }

    result += `[View Full Bubblemap](https://app.bubblemaps.io/${tokenInfo.chain}/token/${tokenInfo.address})`;

    return result;
}

/**
 * Format number with commas and limit decimal places
 * @param {number} num - Number to format
 * @param {number} decimals - Maximum decimal places
 * @returns {string} Formatted number
 */
function formatNumber(num, decimals = 2) {
    if (num === undefined || num === null) return 'N/A';

    // Handle very large numbers
    if (num >= 1000000000) {
        return `${(num / 1000000000).toFixed(decimals)}B`;
    }

    // Handle millions
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(decimals)}M`;
    }

    // Handle thousands
    if (num >= 1000) {
        return `${(num / 1000).toFixed(decimals)}K`;
    }

    return num.toFixed(decimals);
}

/**
 * Format address to show only first and last few characters
 * @param {string} address - Address to format
 * @returns {string} Formatted address
 */
function formatAddress(address) {
    if (!address) return 'Unknown';
    if (address.length <= 10) return address;

    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

module.exports = {
    formatTokenInfo,
    formatNumber,
    formatAddress
};