# Bubblemaps Telegram Bot

A Telegram bot that provides token analytics using Bubblemaps. This bot allows users to analyze token contracts by providing real-time data and visualizations.

## Features

- **Token Contract Analysis**: Send any token contract address to receive a comprehensive analysis
- **Bubble Map Visualization**: Get a screenshot of the token's bubble map
- **Market Metrics**: View important data such as price, market cap, and trading volume
- **Decentralization Score**: Check the token's decentralization score
- **Holder Distribution**: See the top holders and their percentages

## Installation

### Prerequisites

- Node.js (v16 or higher)
- A Telegram Bot Token (obtained from BotFather)
- A Bubblemaps API Key

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bubblemaps-telegram-bot.git
   cd bubblemaps-telegram-bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your configuration:
   ```
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   BUBBLEMAPS_API_KEY=your_bubblemaps_api_key_here
   ```

4. Start the bot:
   ```bash
   npm start
   ```

### Deployment

For production deployment, set the following environment variables:

```
NODE_ENV=production
WEBHOOK_URL=https://your-app-url.example.com
PORT=3000
```

## Usage

### Available Commands

- `/start` - Start the bot
- `/help` - Show help information
- `/info` - Show information about the bot
- `/analyze <contract_address>` - Analyze a specific contract address

Alternatively, you can simply send a contract address directly to the bot.

### Examples

1. Using the `/analyze` command:
   ```
   /analyze 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984
   ```

2. Sending the address directly:
   ```
   0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984
   ```

## Project Structure

```
bubblemaps-telegram-bot/
├── index.js                 # Main bot entry point
├── src/
│   ├── handlers/            # Telegram command handlers
│   ├── services/            # Bubblemaps API integration
│   ├── utils/               # Helper functions
│   └── config.js            # Configuration settings
├── package.json             # Dependencies and scripts
└── README.md                # Documentation
```

## Dependencies

- [Telegraf](https://github.com/telegraf/telegraf) - Modern Telegram Bot Framework for Node.js
- [Axios](https://github.com/axios/axios) - Promise-based HTTP client
- [Puppeteer](https://github.com/puppeteer/puppeteer) - Headless Chrome Node.js API
- [Node-Cache](https://github.com/node-cache/node-cache) - Simple caching module
- [Express](https://github.com/expressjs/express) - Web framework for Node.js (used for webhooks)
- [Dotenv](https://github.com/motdotla/dotenv) - Environment variable loader

## License

MIT

## Acknowledgements

- [Bubblemaps](https://bubblemaps.io/) for providing the API
- [Telegram Bot API](https://core.telegram.org/bots/api) for the bot platform