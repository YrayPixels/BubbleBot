// index.js - Main bot entry point
require('dotenv').config();
const { Telegraf } = require('telegraf');
const commandHandler = require('./src/handlers/commandHandler');
const contractHandler = require('./src/handlers/contractHandler');
const config = require('./src/config');
const express = require('express');

// Initialize bot with token from environment variables
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

commandHandler.setup(bot); // This sets the bots commands

// Set up contract address handling
contractHandler.setup(bot);

// Error handling
bot.catch((err, ctx) => {
    console.error(`Error for ${ctx.updateType}:`, err);
    ctx.reply('An error occurred while processing your request. Please try again later.');
});

// If webhook is configured, use webhook, otherwise use long polling
if (process.env.NODE_ENV === 'production' && process.env.WEBHOOK_URL) {
    // Set up webhook
    const app = express();
    app.use(bot.webhookCallback('/webhook'));

    app.get('/', (req, res) => {
        res.send('Bubblemaps Telegram Bot is running!');
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}/webhook`);
    console.log(`Bot webhook set to ${process.env.WEBHOOK_URL}/webhook`);
} else {
    // Use long polling
    bot.launch();
    console.log('Bot started with long polling');
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));