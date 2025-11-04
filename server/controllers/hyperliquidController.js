import { HyperLiquidService } from '../services/hyperliquidService.js';
import { validatePnLRequest } from '../utils/validation.js';

/**
 * Controller for HyperLiquid PnL API endpoints
 * Handles HTTP requests and responses for HyperLiquid operations
 */
class HyperLiquidController {
  /**
   * Create a new HyperLiquidController instance
   * @param {HyperLiquidService} hyperLiquidService - HyperLiquid service instance
   */
  constructor(hyperLiquidService = null) {
    // Allow dependency injection or create new instance
    this.service = hyperLiquidService || new HyperLiquidService();
  }

  /**
   * GET /api/hyperliquid/:wallet/pnl
   * Get daily PnL for a wallet within a date range
   */
  async getWalletPnL(req, res, next) {
    try {
      const { wallet } = req.params;
      const { start, end } = req.query;

      // Validate request parameters
      const validation = validatePnLRequest(wallet, start, end);
      if (!validation.valid) {
        return res.status(400).json({
          error: 'Validation error',
          message: validation.error,
        });
      }

      // Calculate daily PnL using the service
      const dailyPnL = await this.service.calculateDailyPnL(
        wallet,
        start,
        end
      );

      // Calculate summary statistics
      const summary = this.calculateSummary(dailyPnL);

      // Return response
      res.json({
        success: true,
        wallet,
        startDate: start,
        endDate: end,
        summary,
        daily: dailyPnL,
      });
    } catch (error) {
      console.error('Error fetching PnL:', error);

      // Handle specific error types
      if (error.message.includes('HyperLiquid API error')) {
        return res.status(502).json({
          error: 'External API error',
          message: 'Failed to fetch data from HyperLiquid API',
          details: error.message,
        });
      }

      if (error.message.includes('No response from HyperLiquid API')) {
        return res.status(503).json({
          error: 'Service unavailable',
          message: 'HyperLiquid API is not responding',
        });
      }

      // Generic error
      next(error);
    }
  }

  /**
   * GET /api/hyperliquid/:wallet/summary
   * Get comprehensive wallet summary
   */
  async getWalletSummary(req, res, next) {
    try {
      const { wallet } = req.params;

      // Validate wallet address
      if (!wallet) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Wallet address is required',
        });
      }

      // Get wallet summary using the service
      const summary = await this.service.getWalletSummary(wallet);

      // Return response
      res.json({
        success: true,
        ...summary,
      });
    } catch (error) {
      console.error('Error fetching wallet summary:', error);

      // Handle specific error types
      if (error.message.includes('HyperLiquid API error')) {
        return res.status(502).json({
          error: 'External API error',
          message: 'Failed to fetch data from HyperLiquid API',
          details: error.message,
        });
      }

      if (error.message.includes('No response from HyperLiquid API')) {
        return res.status(503).json({
          error: 'Service unavailable',
          message: 'HyperLiquid API is not responding',
        });
      }

      // Generic error
      next(error);
    }
  }

  /**
   * Calculate summary statistics from daily PnL data
   * @private
   * @param {Array} dailyPnL - Array of daily PnL objects
   * @returns {Object} Summary statistics
   */
  calculateSummary(dailyPnL) {
    if (!dailyPnL || dailyPnL.length === 0) {
      return {
        totalRealizedPnL: 0,
        totalUnrealizedPnL: 0,
        totalFees: 0,
        totalFunding: 0,
        totalNetPnL: 0,
        totalTrades: 0,
        profitableDays: 0,
        losingDays: 0,
        averageDailyPnL: 0,
      };
    }

    const summary = dailyPnL.reduce(
      (acc, day) => {
        acc.totalRealizedPnL += day.realizedPnL;
        acc.totalUnrealizedPnL += day.unrealizedPnL;
        acc.totalFees += day.fees;
        acc.totalFunding += day.funding;
        acc.totalNetPnL += day.netPnL;
        acc.totalTrades += day.trades;

        if (day.netPnL > 0) {
          acc.profitableDays++;
        } else if (day.netPnL < 0) {
          acc.losingDays++;
        }

        return acc;
      },
      {
        totalRealizedPnL: 0,
        totalUnrealizedPnL: 0,
        totalFees: 0,
        totalFunding: 0,
        totalNetPnL: 0,
        totalTrades: 0,
        profitableDays: 0,
        losingDays: 0,
      }
    );

    summary.averageDailyPnL = summary.totalNetPnL / dailyPnL.length;

    // Round all values
    Object.keys(summary).forEach(key => {
      if (typeof summary[key] === 'number' && key !== 'totalTrades' && key !== 'profitableDays' && key !== 'losingDays') {
        summary[key] = Math.round(summary[key] * 10000) / 10000;
      }
    });

    return summary;
  }
}

// Create a singleton instance for use in routes
const controller = new HyperLiquidController();

// Export both the class and bound methods for route compatibility
export { HyperLiquidController };
export const getWalletPnL = controller.getWalletPnL.bind(controller);
export const getWalletSummary = controller.getWalletSummary.bind(controller);
