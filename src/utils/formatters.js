// src/utils/formatters.js - Data formatting functions

/**
 * Format token information for display
 * @param {Object} tokenInfo - Token information from API
 * @param {Object} tokenScore - Token score information
 * @returns {string} Formatted token information
 */
function formatTokenInfo(tokenInfo, tokenScore) {
    if (!tokenInfo) {
        return '❌ No information available for this token.';
    }

    // Format basic token info
    let result = `*${tokenInfo.name || 'Unknown Token'}* (${tokenInfo.symbol || '?'})\n` +
        `Contract: \`${tokenInfo.address}\`\n` +
        `Chain: ${tokenInfo.blockchain || 'Unknown'}\n\n`;

    // Format market data if available
    if (tokenInfo.market && Object.keys(tokenInfo.market).length > 0) {
        result += `*📊 Market Data:*\n`;

        if (tokenInfo.market.price) {
            result += `• Price: $${formatNumber(tokenInfo.market.price)}\n`;
        }

        if (tokenInfo.market.marketCap) {
            result += `• Market Cap: $${formatNumber(tokenInfo.market.marketCap)}\n`;
        }

        if (tokenInfo.market.volume24h) {
            result += `• 24h Volume: $${formatNumber(tokenInfo.market.volume24h)}\n`;
        }

        result += '\n';
    }

    // Format token score if available
    if (tokenScore) {
        result += `*🔍 Decentralization Analysis:*\n`;

        if (tokenScore.score !== undefined) {
            const scorePercentage = Math.round(tokenScore.score * 100);
            result += `• Decentralization Score: ${scorePercentage}%\n`;
        }

        if (tokenScore.holders) {
            result += `• Total Holders: ${formatNumber(tokenScore.holders)}\n`;
        }

        if (tokenScore.clusters) {
            result += `• Holder Clusters: ${tokenScore.clusters}\n`;
        }

        if (tokenScore.largeHolders) {
            result += `• Large Holders: ${tokenScore.largeHolders}\n`;
        }

        result += '\n';
    }

    // Format holder distribution if available
    if (tokenInfo.holders && tokenInfo.holders.distribution) {
        result += `*👥 Top Holder Distribution:*\n`;

        // Get top 5 holders
        const topHolders = tokenInfo.holders.distribution.slice(0, 5);

        topHolders.forEach((holder, index) => {
            const percentage = (holder.percentage * 100).toFixed(2);
            result += `• Holder #${index + 1}: ${percentage}% (${formatAddress(holder.address)})\n`;
        });

        result += '\n';
    }

    result += `[View Full Bubblemap](https://bubblemaps.io/token/${tokenInfo.address})`;

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