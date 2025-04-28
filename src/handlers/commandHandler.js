// src/handlers/commandHandler.js - Handles bot commands
const config = require('../config');
const { botHelp, aboutAction, startAction, selectChain, analyzeAction } = require('../functions/actions');
const { default: storage } = require('../libs/db');

/**
 * Setup command handlers for the bot
 * @param {Telegraf} bot - Telegraf bot instance
 */
function setup(bot) {
    // Set bot commands
    bot.telegram.setMyCommands(config.bot.commands);
    // Start command
    bot.command('start', async (ctx) => startAction(ctx, config, storage));
    // Help command 
    bot.command('help', async (ctx) => botHelp(ctx, config));

    // Info command
    bot.command('about', async (ctx) => aboutAction(ctx, config));

    // Handle analyze command with arguments
    bot.command('analyze', async (ctx) => analyzeAction(ctx, storage));


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