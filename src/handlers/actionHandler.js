// src/handlers/commandHandler.js - Handles bot commands
const config = require('../config');
const { callBack, selectChain, aboutAction, botHelp } = require('../functions/actions');
const { default: storage } = require('../libs/db')

/**
 * Setup Action handlers for the bot
 * @param {Telegraf} bot - Telegraf bot instance
 */
function setup(bot) {
    // Help command
    bot.action('bot_help', async (ctx) => botHelp(ctx, config));
    // About command
    bot.action('about', async (ctx) => aboutAction(ctx, config));
    // Handle analyze command with arguments
    bot.action('select_chain', async (ctx) => { selectChain(ctx) });
    bot.on('callback_query', async (ctx) => callBack(ctx, storage));

}

module.exports = { setup };