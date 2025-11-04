import axios from 'axios';

const HYPERLIQUID_API_URL = 'https://api.hyperliquid.xyz/info';

/**
 * HyperLiquid API Client
 * Handles all API requests to HyperLiquid
 */
class HyperliquidClient {
  constructor() {
    this.baseURL = HYPERLIQUID_API_URL;
  }

  /**
   * Make a POST request to HyperLiquid API
   */
  async request(payload) {
    try {
      const response = await axios.post(this.baseURL, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000, // 15 second timeout
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        // API returned an error response
        throw new Error(`HyperLiquid API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('No response from HyperLiquid API. Please check your connection.');
      } else {
        // Error in request setup
        throw new Error(`Request error: ${error.message}`);
      }
    }
  }

  /**
   * Get user fills (trades) for a wallet
   * @param {string} wallet - Wallet address (0x format)
   * @returns {Promise<Array>} Array of fill objects
   */
  async getUserFills(wallet) {
    return this.request({
      type: 'userFills',
      user: wallet,
    });
  }

  /**
   * Get user funding payments for a date range
   * @param {string} wallet - Wallet address (0x format)
   * @param {number} startTime - Start timestamp in milliseconds
   * @param {number} endTime - End timestamp in milliseconds
   * @returns {Promise<Array>} Array of funding events
   */
  async getUserFunding(wallet, startTime, endTime) {
    return this.request({
      type: 'userFunding',
      user: wallet,
      startTime,
      endTime,
    });
  }

  /**
   * Get user's current positions and margin state
   * @param {string} wallet - Wallet address (0x format)
   * @returns {Promise<Object>} User's clearinghouse state
   */
  async getClearinghouseState(wallet) {
    return this.request({
      type: 'clearinghouseState',
      user: wallet,
    });
  }

  /**
   * Get historical candle data for a coin
   * @param {string} coin - Coin symbol (e.g., 'BTC', 'ETH')
   * @param {string} interval - Candle interval (e.g., '1d')
   * @param {number} startTime - Start timestamp in milliseconds
   * @param {number} endTime - End timestamp in milliseconds
   * @returns {Promise<Array>} Array of candle objects
   */
  async getCandleSnapshot(coin, interval, startTime, endTime) {
    return this.request({
      type: 'candleSnapshot',
      req: {
        coin,
        interval,
        startTime,
        endTime,
      },
    });
  }

  /**
   * Get metadata about available assets
   * @returns {Promise<Object>} Meta information about assets
   */
  async getMeta() {
    return this.request({
      type: 'meta',
    });
  }
}

export default new HyperliquidClient();
