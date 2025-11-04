import pnlCalculator from '../services/pnlCalculator.js';
import { validatePnLRequest } from '../utils/validation.js';

/**
 * Controller for HyperLiquid PnL API endpoints
 */

/**
 * GET /api/hyperliquid/:wallet/pnl
 * Get daily PnL for a wallet within a date range
 */
export async function getWalletPnL(req, res, next) {
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

    // Calculate daily PnL
    const dailyPnL = await pnlCalculator.calculateDailyPnL(
      wallet,
      start,
      end
    );

    // Calculate summary statistics
    const summary = calculateSummary(dailyPnL);

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
 * Calculate summary statistics from daily PnL data
 * @private
 */
function calculateSummary(dailyPnL) {
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
