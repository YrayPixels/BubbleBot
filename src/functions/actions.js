
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Markup } = require('telegraf');




const callBack = async (ctx, storage) => {
    const data = ctx.callbackQuery.data;

    if (data.startsWith('analyze:')) {
        const chain = data.split(':')[1]; // eth, bsc, sol, etc.

        await ctx.answerCbQuery(); // optional, just clears the loading spinner

        await ctx.reply(
            `🔗 You have selected the ${chain.toUpperCase()} chain.\n` +
            `Please send me a contract address to analyze.`
        );

        const username = ctx.from.id
        await storage.set(username + 'selectedChain', chain);

        return
    }

    if (data.startsWith('explain:')) {
        const loadingMsg = await ctx.reply('🔍 Analyzing Token Information. Please wait...');

        const fetchedData = await storage.get(data)


        if (!fetchedData) {
            await ctx.telegram.editMessageText(
                ctx.chat.id,
                loadingMsg.message_id,
                undefined,
                '📊 Analysis Failed'
            );
        }
        const genAI = new GoogleGenerativeAI(process.env.GA_KEY || "");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const explainText = async (sentence) => {
            const result = await model.generateContent([
                `"${sentence} "You are a trading expert with knowledge on how tokennomics works with this information given  I want you to explain to me what it means and how It affects the token integrity and also the general outlook on the token
        `,
            ]);
            return result.response.text();
        };

        const aiExplanation = await explainText(fetchedData)

        await ctx.telegram.editMessageText(
            ctx.chat.id,
            loadingMsg.message_id,
            undefined,
            aiExplanation,
        );
    }
}


const selectChain = async (ctx) => {

    const inlineKeyboard = Markup.inlineKeyboard([
        [
            Markup.button.callback('🔗 Ethereum (ETH)', 'analyze:eth'),
            Markup.button.callback('🔗 BSC (BSC)', 'analyze:bsc')
        ],
        [
            Markup.button.callback('🔗 Fantom (FTM)', 'analyze:ftm'),
            Markup.button.callback('🔗 Avalanche (AVAX)', 'analyze:avax')
        ],
        [
            Markup.button.callback('🔗 Cronos (CRO)', 'analyze:cro'),
            Markup.button.callback('🔗 Arbitrum (ARBI)', 'analyze:arbi')
        ],
        [
            Markup.button.callback('🔗 Polygon (POLY)', 'analyze:poly'),
            Markup.button.callback('🔗 Base (BASE)', 'analyze:base')
        ],
        [
            Markup.button.callback('🔗 Solana (SOL)', 'analyze:sol'),
            Markup.button.callback('🔗 Sonic (SONIC)', 'analyze:sonic')
        ]
    ]);

    await ctx.reply(
        '⚠️ Please Kindly Select One of these chains  that this address belongs to.\n',
        inlineKeyboard
    );

}

const aboutAction = async (ctx, config) => {
    await ctx.reply(
        `ℹ️ *${config.bot.name} Information*\n\n` +
        `${config.bot.description}\n\n` +
        `This bot integrates with Bubblemaps to provide token analytics including:\n` +
        `• Bubble map visualization\n` +
        `• Market metrics (price, market cap, volume)\n` +
        `• Decentralization score\n` +
        `• Holder distribution information\n\n` +
        `Created for the Bubblemaps hackathon bounty.`,
        // { parse_mode: 'Markdown' }
    );
}

const botHelp = async (ctx, config) => {
    await ctx.reply(
        `📚 *${config.bot.name} Help*\n\n` +
        `This bot allows you to analyze token contracts using Bubblemaps.\n\n` +
        `*Available Commands:*\n` +
        `/start - Start the bot\n` +
        `/help - Show this help message\n` +
        `/about - Show information about the bot\n` +
        `/analyze <contract_address> - Analyze a specific contract address\n\n` +
        `You can also simply send a contract address directly to analyze it.`,
        // { parse_mode: 'Markdown' }
    );
}

const startAction = async (ctx, config, storage) => {

    const inlineKeyboard = Markup.inlineKeyboard([
        [
            Markup.button.callback('🔍 Analyze Contract Address', 'select_chain'),
        ],
        [
            Markup.button.callback('📚 Help Guide', 'bot_help'),
            Markup.button.callback('ℹ️ About', 'about')
        ],
        [
            Markup.button.url('🌐 Visit Bubblemaps', 'https://bubblemaps.io')
        ]
    ]);

    const welcomeMessage = `👋 Welcome to the ${config.bot.name}!\n\n` +
        `This bot allows you to analyze token contracts using Bubblemaps. ` +
        `Simply send me a contract address, or use the /analyze command followed by an address.\n\n` +
        `For more information, type /help.`

    const username = ctx.from.id
    await storage.delete(username + 'selectedChain'); // Clear all data in the database

    await ctx.reply(welcomeMessage, inlineKeyboard);

}


const analyzeAction = async (ctx, storage) => {

    const text = ctx.message.text;
    const parts = text.split(' ');


    const username = ctx.from.id
    await storage.delete(username + 'selectedChain');



    if (parts.length < 2) {
        await ctx.reply(
            '⚠️ Please provide a contract address.\n' +
            'Example: `/analyze 0x1234...abcd`',
            // { parse_mode: 'Markdown' }
        );
        return;
    }

    // Extract contract address and forward to contract handler
    const address = parts[1].trim();
    ctx.state.command = 'analyze';

    // We'll pass this to the contractHandler, which will be implemented next
    ctx.forwardToContractHandler = true;
    ctx.contractAddress = address;
};


module.exports = {
    callBack,
    selectChain,
    aboutAction,
    botHelp,
    startAction,
    analyzeAction,
}