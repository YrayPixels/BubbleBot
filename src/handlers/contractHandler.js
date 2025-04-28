// src/handlers/contractHandler.js - Handles contract address processing
const { isValidAddress } = require('../utils/validators');
const bubblemapsService = require('../services/bubblemapsService');
const screenshotService = require('../services/screenshotService');
const { formatTokenInfo } = require('../utils/formatters');

/**
 * Setup contract handler for the bot
 * @param {Telegraf} bot - Telegraf bot instance
 */
function setup(bot) {
    // Handle forwarded contract address from command handler
    bot.use(async (ctx, next) => {
        if (ctx.state.forwardToContractHandler && ctx.state.contractAddress) {
            await handleContractAddress(ctx, ctx.state.contractAddress);
            return;
        }
        return next();
    });

    // Handle directly sent contract addresses
    bot.on('text', async (ctx) => {
        const address = ctx.message.text.trim();
        if (isValidAddress(address)) {
            await handleContractAddress(ctx, address);
        } else {
            await ctx.reply(
                `⚠️ This doesn't appear to be a valid contract address. 
        'Please send a valid Ethereum or compatible blockchain contract address.'`
            );
        }
    });
}

/**
 * Handle contract address processing
 * @param {Context} ctx - Telegraf context
 * @param {string} address - Contract address to analyze
 */
async function handleContractAddress(ctx, address) {
    try {
        // Send loading message
        const loadingMsg = await ctx.reply('🔍 Analyzing contract address. Please wait...');

        // Get token info from Bubblemaps API
        const tokenInfo = await bubblemapsService.getTokenInfo(address);

        if (!tokenInfo) {
            await ctx.telegram.editMessageText(
                ctx.chat.id,
                loadingMsg.message_id,
                undefined,
                '❌ Contract not found on Bubblemaps or it is not a token contract.'
            );
            return;
        }

        // Update status message
        await ctx.telegram.editMessageText(
            ctx.chat.id,
            loadingMsg.message_id,
            undefined,
            '📊 Generating bubble map visualization...'
        );

        // Generate screenshot of the bubble map
        const screenshot = await screenshotService.captureTokenBubbleMap(address);

        // Get token score
        const tokenScore = await bubblemapsService.getTokenScore(address);

        // Format all token information
        const formattedInfo = formatTokenInfo(tokenInfo, tokenScore);

        // Send screenshot
        if (screenshot) {
            await ctx.replyWithPhoto(
                { source: screenshot },
                { caption: 'Bubble Map Visualization' }
            );
        }

        // Send token information
        await ctx.reply(formattedInfo, { parse_mode: 'Markdown' });

        // Delete loading message
        await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);

    } catch (error) {
        console.error('Error handling contract address:', error);
        await ctx.reply(
            '❌ Error analyzing this contract. Please try again later or verify that the contract address is correct.'
        );
    }
}

module.exports = { setup };