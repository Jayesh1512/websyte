import { HyperliquidClient } from './hyperliquidClient.js';
import { PnlCalculator } from './pnlCalculator.js';

/**
 * Main HyperLiquid Service
 * Provides high-level interface for HyperLiquid operations
 * Combines API client and PnL calculation functionality
 */
class HyperLiquidService {
  /**
   * Create a new HyperLiquidService instance
   * @param {Object} config - Configuration options
   * @param {string} config.apiUrl - HyperLiquid API URL (optional)
   */
  constructor(config = {}) {
    this.config = {
      apiUrl: config.apiUrl || 'https://api.hyperliquid.xyz/info',
      timeout: config.timeout || 15000,
    };

    // Initialize HyperLiquid API client
    this.client = new HyperliquidClient();

    // Initialize PnL calculator with the client
    this.pnlCalculator = new PnlCalculator(this.client);
  }

  /**
   * Get the HyperLiquid API client
   * @returns {HyperliquidClient}
   */
  getClient() {
    return this.client;
  }

  /**
   * Get the PnL calculator
   * @returns {PnlCalculator}
   */
  getPnlCalculator() {
    return this.pnlCalculator;
  }

  /**
   * Calculate daily PnL for a wallet within a date range
   * This is a convenience method that delegates to the PnL calculator
   *
   * @param {string} wallet - Wallet address
   * @param {string|Date} startDate - Start date
   * @param {string|Date} endDate - End date
   * @returns {Promise<Array>} Array of daily PnL objects
   */
  async calculateDailyPnL(wallet, startDate, endDate) {
    return this.pnlCalculator.calculateDailyPnL(wallet, startDate, endDate);
  }

  /**
   * Get user fills (trades) for a wallet
   * @param {string} wallet - Wallet address (0x format)
   * @returns {Promise<Array>} Array of fill objects
   */
  async getUserFills(wallet) {
    return this.client.getUserFills(wallet);
  }

  /**
   * Get user funding payments for a date range
   * @param {string} wallet - Wallet address (0x format)
   * @param {number} startTime - Start timestamp in milliseconds
   * @param {number} endTime - End timestamp in milliseconds
   * @returns {Promise<Array>} Array of funding events
   */
  async getUserFunding(wallet, startTime, endTime) {
    return this.client.getUserFunding(wallet, startTime, endTime);
  }

  /**
   * Get user's current positions and margin state
   * @param {string} wallet - Wallet address (0x format)
   * @returns {Promise<Object>} User's clearinghouse state
   */
  async getClearinghouseState(wallet) {
    return this.client.getClearinghouseState(wallet);
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
    return this.client.getCandleSnapshot(coin, interval, startTime, endTime);
  }

  /**
   * Get metadata about available assets
   * @returns {Promise<Object>} Meta information about assets
   */
  async getMeta() {
    return this.client.getMeta();
  }

  /**
   * Get comprehensive wallet summary
   * Fetches all wallet data in parallel
   *
   * @param {string} wallet - Wallet address
   * @returns {Promise<Object>} Comprehensive wallet data
   */
  async getWalletSummary(wallet) {
    const [fills, clearinghouseState] = await Promise.all([
      this.client.getUserFills(wallet),
      this.client.getClearinghouseState(wallet),
    ]);

    return {
      wallet,
      fills: fills.slice(0, 10), // Most recent 10 fills
      totalFills: fills.length,
      positions: clearinghouseState.assetPositions || [],
      marginSummary: clearinghouseState.marginSummary || {},
    };
  }
}

export { HyperLiquidService };
