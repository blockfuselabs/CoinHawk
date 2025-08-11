# BaseGecko-API

A Node.js API for fetching cryptocurrency data using the Zora API with OpenAI integration for coin summaries and chat functionality.

## Features

- **Coin Data Fetching**: Get new coins, trending coins, top gainers, and most valuable coins
- **AI-Powered Summaries**: Generate intelligent summaries of coins using OpenAI
- **Chat Interface**: Ask questions about specific coins and get AI-generated responses
- **Pagination Support**: All list endpoints now support pagination with `count` and `page` parameters

## Pagination

All coin list endpoints now support pagination with the following query parameters:

- `count` (optional): Number of items per page (default varies by endpoint, max 100)
- `page` (optional): Page number (default: 1)

### Pagination Response Format

```json
{
  "success": true,
  "data": [...], // Array of coins
  "pagination": {
    "page": 1,
    "count": 10,
    "total": 50,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "cursor": "cursor_string"
  }
}
```

## API Endpoints

### GET /api/coins/new
Get newly listed coins with pagination.

**Query Parameters:**
- `count` (optional): Number of coins to fetch (default: 10)
- `page` (optional): Page number (default: 1)

**Example:**
```
GET /api/coins/new?count=5&page=2
```

### GET /api/coins/trending-coins
Get trending coins by volume with pagination.

**Query Parameters:**
- `count` (optional): Number of coins to fetch (default: 20)
- `page` (optional): Page number (default: 1)

**Example:**
```
GET /api/coins/trending-coins?count=15&page=1
```

### GET /api/coins/top-gainers
Get top gaining coins with pagination.

**Query Parameters:**
- `count` (optional): Number of coins to fetch (default: 100)
- `page` (optional): Page number (default: 1)

**Example:**
```
GET /api/coins/top-gainers?count=25&page=3
```

### GET /api/coins/most-valuable
Get most valuable coins by market cap with pagination.

**Query Parameters:**
- `count` (optional): Number of coins to fetch (default: 100)
- `page` (optional): Page number (default: 1)

**Example:**
```
GET /api/coins/most-valuable?count=50&page=1
```

### GET /api/coins/summary
Get AI-generated summary for a specific coin.

**Query Parameters:**
- `coinAddress` (required): The coin's contract address

### POST /api/coins/chat
Chat with AI about a specific coin.

**Body:**
```json
{
  "coinAddress": "0x...",
  "userQuestion": "What is this coin about?"
}
```

### GET /api/coins/:address
Get detailed information about a specific coin.

**Path Parameters:**
- `address`: The coin's contract address

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `env.example` to `.env` and fill in required values
4. Start the server: `npm start`

## Environment Variables

- `PORT`: Server port (default: 5000)
- `BASEAPP_REFERRER_ADDRESS`: Base app referrer address for filtering
- `OPENAI_API_KEY`: OpenAI API key for AI features

## Dependencies

- Express.js for the web server
- Zora Coins SDK for cryptocurrency data
- OpenAI API for AI features
- TypeScript for type safety

## Development

- Build: `npm run build`
- Start: `npm start`
- The server runs on port 5000 by default

