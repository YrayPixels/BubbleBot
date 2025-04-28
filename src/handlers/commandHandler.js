// src/handlers/commandHandler.js - Handles bot commands
const config = require('../config');

/**
 * Setup command handlers for the bot
 * @param {Telegraf} bot - Telegraf bot instance
 */
function setup(bot) {
    // Set bot commands
    bot.telegram.setMyCommands(config.bot.commands);

    // Start command
    bot.command('start', async (ctx) => {
        await ctx.reply(
            `👋 Welcome to the ${config.bot.name}!\n\n` +
            `This bot allows you to analyze token contracts using Bubblemaps. ` +
            `Simply send me a contract address, or use the /analyze command followed by an address.\n\n` +
            `For more information, type /help.`
        );
    });

    // Help command
    bot.command('help', async (ctx) => {
        await ctx.reply(
            `📚 *${config.bot.name} Help*\n\n` +
            `This bot allows you to analyze token contracts using Bubblemaps.\n\n` +
            `*Available Commands:*\n` +
            `/start - Start the bot\n` +
            `/help - Show this help message\n` +
            `/info - Show information about the bot\n` +
            `/analyze <contract_address> - Analyze a specific contract address\n\n` +
            `You can also simply send a contract address directly to analyze it.`,
            { parse_mode: 'Markdown' }
        );
    });

    // Info command
    bot.command('info', async (ctx) => {
        await ctx.reply(
            `ℹ️ *${config.bot.name} Information*\n\n` +
            `${config.bot.description}\n\n` +
            `This bot integrates with Bubblemaps to provide token analytics including:\n` +
            `• Bubble map visualization\n` +
            `• Market metrics (price, market cap, volume)\n` +
            `• Decentralization score\n` +
            `• Holder distribution information\n\n` +
            `Created for the Bubblemaps hackathon bounty.`,
            { parse_mode: 'Markdown' }
        );
    });

    // Handle analyze command with arguments
    bot.command('analyze', async (ctx) => {
        const text = ctx.message.text;
        const parts = text.split(' ');

        if (parts.length < 2) {
            await ctx.reply(
                '⚠️ Please provide a contract address.\n' +
                'Example: `/analyze 0x1234...abcd`',
                { parse_mode: 'Markdown' }
            );
            return;
        }

        // Extract contract address and forward to contract handler
        const address = parts[1].trim();
        ctx.state.command = 'analyze';

        // We'll pass this to the contractHandler, which will be implemented next
        ctx.state.forwardToContractHandler = true;
        ctx.state.contractAddress = address;
    });

    // Generic response for unknown commands
    bot.on('text', (ctx, next) => {
        if (ctx.message.text.startsWith('/')) {
            ctx.reply(
                '❓ Unknown command. Type /help for a list of available commands.'
            );
            return;
        }
        return next();
    });
}

module.exports = { setup };