// index.js - Main bot entry point
require('dotenv').config();
const { Telegraf } = require('telegraf');
const commandHandler = require('./src/handlers/commandHandler');
const actionHandler = require('./src/handlers/actionHandler');
const contractHandler = require('./src/handlers/contractHandler');
const express = require('express');

// Initialize bot with token from environment variables
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);


commandHandler.setup(bot); // This sets the bots commands

actionHandler.setup(bot); // This sets the action handlers

// Set up contract address handling
contractHandler.setup(bot);






// Error handling
bot.catch((err, ctx) => {
    console.error(`Error for ${ctx.updateType}:`, err);
    ctx.reply('An error occurred while processing your request. Please try again later.' + JSON.stringify(err));
});

// If webhook is configured, use webhook, otherwise use long polling
// if (process.env.NODE_ENV === 'production') {
//     // Set up webhook
const app = express();

app.get('/', (req, res) => {
    res.send('Bubblemaps Telegram Bot is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// } else {

// Use long polling
bot.launch();
console.log('Bot started with long polling');
// }

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));