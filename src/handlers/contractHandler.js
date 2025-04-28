const { selectChain } = require('../functions/actions');
const { default: storage } = require('../libs/db');
const bubblemapsService = require('../services/bubblemapsService');
const screenshotService = require('../services/screenshotService');
const { formatTokenInfo } = require('../utils/formatters');

/**
 * Setup contract handler for the bot
 * @param {Telegraf} bot - Telegraf bot instance
 */
function setup(bot) {

    // Handle directly sent contract addresses
    bot.on('text', async (ctx) => {
        const address = ctx.message.text.trim();

        const username = ctx.from.id
        const chain = await storage.get(username + 'selectedChain')

        if (!chain) {
            selectChain(ctx)
            return;
        }
        if (address !== "") {
            await handleContractAddress(ctx, address);
        } else {
            await ctx.reply(
                `⚠️ This doesn't appear to be a valid contract address. 
        'Please send a valid ${chain}  address.'`
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

        const userId = ctx.from.id
        const chain = await storage.get(userId + 'selectedChain')

        // Get token info from Bubblemaps API
        const tokenScore = await bubblemapsService.getMapMetadata(address, chain);
        if (!tokenScore) {
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
        const screenshot = await screenshotService.captureTokenBubbleMap(address, chain);

        // Get token score
        const tokenInfo = await bubblemapsService.getMapdata(address, chain);

        // Format all token information
        const formattedInfo = formatTokenInfo(tokenScore, tokenInfo);

        // Send screenshot
        if (screenshot) {
            await ctx.replyWithPhoto(
                { source: screenshot },
                { caption: 'Bubble Map for Token' }
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