# HyperLiquid Wallet Daily PnL API

A backend service that fetches and calculates a wallet's daily Profit and Loss (PnL) from HyperLiquid, including realized/unrealized PnL, fees, and funding payments.

## Features

- ✅ Fetch wallet activity from HyperLiquid (trades, positions, funding, fees)
- ✅ Calculate daily realized PnL from closed trades
- ✅ Calculate daily unrealized PnL from open positions
- ✅ Track fees and funding payments
- ✅ Comprehensive input validation
- ✅ Graceful error handling
- ✅ RESTful API design
- ✅ Summary statistics across date ranges

## API Endpoints

### 1. Get Wallet Daily PnL

```
GET /api/hyperliquid/:wallet/pnl?start=YYYY-MM-DD&end=YYYY-MM-DD
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `wallet` | string | Yes | Ethereum wallet address (0x...) |
| `start` | string | Yes | Start date in YYYY-MM-DD format |
| `end` | string | Yes | End date in YYYY-MM-DD format |

#### Validation Rules

- Wallet address must be a valid Ethereum address (42 characters, starts with 0x)
- Both start and end dates are required
- Dates must be in YYYY-MM-DD format
- Start date must be before end date
- Start date cannot be in the future
- Start date cannot be more than 1 year in the past
- Date range cannot exceed 90 days

#### Response Format

```json
{
  "success": true,
  "wallet": "0x563C175E6F11582f65D6d9E360A618699DEe14a9",
  "startDate": "2025-01-01",
  "endDate": "2025-01-07",
  "summary": {
    "totalRealizedPnL": 1234.5678,
    "totalUnrealizedPnL": -234.5678,
    "totalFees": 45.6789,
    "totalFunding": 12.3456,
    "totalNetPnL": 966.6667,
    "totalTrades": 42,
    "profitableDays": 5,
    "losingDays": 2,
    "averageDailyPnL": 138.0952
  },
  "daily": [
    {
      "date": "2025-01-01",
      "realizedPnL": 123.4567,
      "unrealizedPnL": -23.4567,
      "fees": 4.5678,
      "funding": 1.2345,
      "netPnL": 96.6667,
      "trades": 6,
      "breakdown": {
        "fills": [
          {
            "coin": "BTC",
            "side": "Buy",
            "size": "0.5",
            "price": "45000.00",
            "closedPnl": 123.4567,
            "fee": 2.5,
            "time": "2025-01-01T10:30:00.000Z"
          }
        ],
        "funding": [
          {
            "coin": "BTC",
            "amount": 1.2345,
            "fundingRate": "0.0001",
            "time": "2025-01-01T16:00:00.000Z"
          }
        ]
      }
    }
  ]
}
```

#### Field Descriptions

**Summary Fields:**
- `totalRealizedPnL`: Total profit/loss from closed trades
- `totalUnrealizedPnL`: Total profit/loss from open positions
- `totalFees`: Total trading fees paid (including builder fees)
- `totalFunding`: Total funding payments (positive = received, negative = paid)
- `totalNetPnL`: Net PnL = realized + unrealized - fees + funding
- `totalTrades`: Total number of trades executed
- `profitableDays`: Number of days with positive net PnL
- `losingDays`: Number of days with negative net PnL
- `averageDailyPnL`: Average net PnL per day

**Daily Fields:**
- `date`: The date (YYYY-MM-DD)
- `realizedPnL`: Profit/loss from trades closed on this day
- `unrealizedPnL`: Profit/loss from positions held at end of day
- `fees`: Total fees paid on this day
- `funding`: Net funding payments on this day
- `netPnL`: Net PnL for the day
- `trades`: Number of trades on this day
- `breakdown`: Detailed breakdown of fills and funding events

#### Error Responses

**400 Bad Request - Validation Error**
```json
{
  "error": "Validation error",
  "message": "Invalid wallet address. Must be a valid Ethereum address (0x...)"
}
```

**502 Bad Gateway - External API Error**
```json
{
  "error": "External API error",
  "message": "Failed to fetch data from HyperLiquid API",
  "details": "HyperLiquid API error: 500 - Internal Server Error"
}
```

**503 Service Unavailable - HyperLiquid API Down**
```json
{
  "error": "Service unavailable",
  "message": "HyperLiquid API is not responding"
}
```

**500 Internal Server Error - Generic Error**
```json
{
  "error": "Internal server error"
}
```

### 2. Get Wallet Summary

Get comprehensive wallet information including recent fills, positions, and margin data.

```
GET /api/hyperliquid/:wallet/summary
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `wallet` | string | Yes | Ethereum wallet address (0x...) |

#### Response Format

```json
{
  "success": true,
  "wallet": "0x563C175E6F11582f65D6d9E360A618699DEe14a9",
  "fills": [
    {
      "coin": "BTC",
      "px": "45000.00",
      "sz": "0.5",
      "side": "B",
      "time": 1704067200000,
      "closedPnl": "123.45",
      "fee": "2.50"
    }
  ],
  "totalFills": 150,
  "positions": [
    {
      "coin": "ETH",
      "szi": "1.5",
      "entryPx": "2500.00",
      "unrealizedPnl": "75.50",
      "leverage": {
        "value": 3
      }
    }
  ],
  "marginSummary": {
    "accountValue": "10000.50",
    "totalNtlPos": "5000.00",
    "totalRawUsd": "10000.50",
    "totalMarginUsed": "1666.67"
  }
}
```

#### Field Descriptions

- `fills`: Array of 10 most recent fills/trades
- `totalFills`: Total number of fills available
- `positions`: Array of open positions with unrealized PnL
- `marginSummary`: Account margin and value information
  - `accountValue`: Total account value in USD
  - `totalNtlPos`: Total notional position value
  - `totalRawUsd`: Raw USD balance
  - `totalMarginUsed`: Margin currently in use

#### Use Cases

- Quick wallet overview
- Check current positions and P&L
- Monitor account margin status
- View recent trading activity

## Quick Start

### Installation

```bash
# Install dependencies
npm install
```

### Running the Server

```bash
# Start the server (production)
npm run server

# Start with auto-reload (development)
npm run server:dev
```

The server will start on port 3001 by default.

### Testing

```bash
# Health check
curl http://localhost:3001/health

# Get wallet PnL
curl "http://localhost:3001/api/hyperliquid/0x563C175E6F11582f65D6d9E360A618699DEe14a9/pnl?start=2025-01-01&end=2025-01-07"

# Get wallet summary
curl "http://localhost:3001/api/hyperliquid/0x563C175E6F11582f65D6d9E360A618699DEe14a9/summary"
```

## Project Structure

```
server/
├── index.js                 # Main Express server
├── controllers/
│   └── hyperliquidController.js   # Request handlers (class-based)
├── routes/
│   └── hyperliquid.js      # API routes
├── services/
│   ├── hyperliquidService.js      # Main HyperLiquid service (combines client + calculator)
│   ├── hyperliquidClient.js       # HyperLiquid API client (class)
│   └── pnlCalculator.js    # PnL calculation logic (class)
└── utils/
    └── validation.js        # Input validation utilities
```

### Class-Based Architecture

The implementation uses a clean object-oriented architecture with dependency injection:

**HyperLiquidClient** - Low-level API client
```javascript
import { HyperLiquidClient } from './services/hyperliquidClient.js';

const client = new HyperLiquidClient();
const fills = await client.getUserFills(walletAddress);
```

**PnlCalculator** - Business logic for PnL calculations
```javascript
import { HyperLiquidClient } from './services/hyperliquidClient.js';
import { PnlCalculator } from './services/pnlCalculator.js';

const client = new HyperLiquidClient();
const calculator = new PnlCalculator(client);
const dailyPnL = await calculator.calculateDailyPnL(wallet, start, end);
```

**HyperLiquidService** - High-level service combining all functionality
```javascript
import { HyperLiquidService } from './services/hyperliquidService.js';

// Create service instance (combines client + calculator)
const service = new HyperLiquidService({
  apiUrl: 'https://api.hyperliquid.xyz/info',
  timeout: 15000
});

// Use convenience methods
const dailyPnL = await service.calculateDailyPnL(wallet, start, end);
const summary = await service.getWalletSummary(wallet);
const fills = await service.getUserFills(wallet);
```

**HyperLiquidController** - HTTP request handlers
```javascript
import { HyperLiquidController } from './controllers/hyperliquidController.js';
import { HyperLiquidService } from './services/hyperliquidService.js';

// Create controller with custom service (dependency injection)
const service = new HyperLiquidService();
const controller = new HyperLiquidController(service);
```

Benefits:
- ✅ Dependency injection for better testability
- ✅ Loose coupling between components
- ✅ Easy to mock services in tests
- ✅ Configurable instances
- ✅ Follows SOLID principles

## Technical Details

### HyperLiquid API Integration

The service integrates with the following HyperLiquid API endpoints:

1. **userFills** - Fetches all user trades/fills
   - Returns up to 2000 most recent fills
   - Includes closedPnl, fees, side, price, size

2. **userFunding** - Fetches funding payments
   - Time-based filtering (startTime, endTime)
   - Returns funding rate and USDC amount

3. **clearinghouseState** - Fetches current open positions
   - Includes unrealized PnL for each position
   - Provides margin summary

4. **candleSnapshot** - Fetches historical OHLC data (future enhancement)
   - Can be used for more accurate end-of-day position valuations

### PnL Calculation Logic

**Realized PnL:**
- Sum of `closedPnl` from all fills on a given day
- Represents actual profit/loss from trades that were closed

**Unrealized PnL:**
- Sum of `unrealizedPnl` from current open positions
- Calculated by HyperLiquid as: `side × (mark_price - entry_price) × position_size`
- Note: Uses current positions as proxy for end-of-day positions

**Fees:**
- Sum of `fee` and `builderFee` from all fills
- Includes both trading fees and builder fees

**Funding:**
- Sum of funding payments received or paid
- Positive values = received funding
- Negative values = paid funding

**Net PnL:**
```
Net PnL = Realized PnL + Unrealized PnL - Fees + Funding
```

## Configuration

### Environment Variables

Create a `.env` file in the server directory:

```env
PORT=3001
NODE_ENV=development
```

## Dependencies

- **express** (^5.1.0) - Web framework
- **axios** (^1.13.1) - HTTP client for API requests
- **cors** (^2.8.5) - CORS middleware
- **dotenv** (^17.2.3) - Environment variable management

## Rate Limits

Be aware of HyperLiquid API rate limits:
- `clearinghouseState`: weight 2
- `userFills`, `userFunding`: additional weight per 20 items returned

## Limitations

1. **Historical Positions**: Current implementation uses current positions to calculate unrealized PnL. For more accurate historical data, you'd need to track positions at the end of each day.

2. **Data Availability**: HyperLiquid only provides the 10,000 most recent fills and 5,000 most recent candles.

3. **Date Range**: Limited to 90 days per request and maximum 1 year lookback to prevent excessive API usage.

## Future Enhancements

- [ ] Cache frequently requested wallet data
- [ ] Add WebSocket support for real-time PnL updates
- [ ] Implement historical position tracking for more accurate unrealized PnL
- [ ] Add support for multiple wallets in a single request
- [ ] Export PnL data to CSV/Excel
- [ ] Add authentication/API keys for rate limiting
- [ ] Add database for storing calculated PnL data
- [ ] Add charts and visualizations
- [ ] Support for spot trading PnL (currently focuses on perpetuals)

## License

MIT

## Support

For issues or questions, please open an issue on the repository.
