/**
 * PnL Calculator Service
 * Handles calculation of daily realized/unrealized PnL, fees, and funding
 */
class PnlCalculator {
  /**
   * Create a new PnlCalculator instance
   * @param {HyperliquidClient} hyperliquidClient - HyperLiquid API client instance
   */
  constructor(hyperliquidClient) {
    this.hyperliquidClient = hyperliquidClient;
  }

  /**
   * Calculate daily PnL for a wallet within a date range
   * @param {string} wallet - Wallet address
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} Array of daily PnL objects
   */
  async calculateDailyPnL(wallet, startDate, endDate) {
    // Convert dates to timestamps (start of day and end of day)
    const startTime = new Date(startDate).setHours(0, 0, 0, 0);
    const endTime = new Date(endDate).setHours(23, 59, 59, 999);

    // Fetch all required data in parallel for better performance
    const [fills, funding, clearinghouseState] = await Promise.all([
      this.hyperliquidClient.getUserFills(wallet),
      this.hyperliquidClient.getUserFunding(wallet, startTime, endTime),
      this.hyperliquidClient.getClearinghouseState(wallet),
    ]);

    // Filter fills to date range
    const filteredFills = fills.filter(
      fill => fill.time >= startTime && fill.time <= endTime
    );

    // Group data by day
    const dailyData = this.groupByDay(filteredFills, funding, startTime, endTime);

    // Calculate daily PnL for each day
    const dailyPnL = await Promise.all(
      Object.entries(dailyData).map(([date, data]) =>
        this.calculateDayPnL(date, data, clearinghouseState)
      )
    );

    return dailyPnL.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  /**
   * Group fills and funding by day
   * @private
   */
  groupByDay(fills, funding, startTime, endTime) {
    const dailyData = {};

    // Initialize all days in range
    const currentDate = new Date(startTime);
    const end = new Date(endTime);

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dailyData[dateStr] = {
        fills: [],
        funding: [],
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Group fills by day
    fills.forEach(fill => {
      const date = new Date(fill.time).toISOString().split('T')[0];
      if (dailyData[date]) {
        dailyData[date].fills.push(fill);
      }
    });

    // Group funding by day
    funding.forEach(fund => {
      const date = new Date(fund.time).toISOString().split('T')[0];
      if (dailyData[date]) {
        dailyData[date].funding.push(fund);
      }
    });

    return dailyData;
  }

  /**
   * Calculate PnL for a single day
   * @private
   */
  async calculateDayPnL(date, data, clearinghouseState) {
    const { fills, funding } = data;

    // Calculate realized PnL from closed trades
    const realizedPnL = fills.reduce((sum, fill) => {
      const closedPnl = parseFloat(fill.closedPnl || 0);
      return sum + closedPnl;
    }, 0);

    // Calculate total fees
    const fees = fills.reduce((sum, fill) => {
      const fee = parseFloat(fill.fee || 0);
      const builderFee = parseFloat(fill.builderFee || 0);
      return sum + fee + builderFee;
    }, 0);

    // Calculate funding payments (positive = received, negative = paid)
    const fundingPnL = funding.reduce((sum, fund) => {
      const usdc = parseFloat(fund.delta.usdc);
      return sum + usdc;
    }, 0);

    // Calculate unrealized PnL for positions held at end of day
    // This is an approximation using current positions
    // In a production system, you'd want to get the exact positions at EOD
    const unrealizedPnL = await this.calculateUnrealizedPnL(
      date,
      clearinghouseState.assetPositions
    );

    // Calculate net PnL
    const netPnL = realizedPnL + unrealizedPnL - fees + fundingPnL;

    return {
      date,
      realizedPnL: this.roundTo(realizedPnL, 4),
      unrealizedPnL: this.roundTo(unrealizedPnL, 4),
      fees: this.roundTo(fees, 4),
      funding: this.roundTo(fundingPnL, 4),
      netPnL: this.roundTo(netPnL, 4),
      trades: fills.length,
      breakdown: {
        fills: fills.map(fill => ({
          coin: fill.coin,
          side: fill.side === 'B' ? 'Buy' : 'Sell',
          size: fill.sz,
          price: fill.px,
          closedPnl: parseFloat(fill.closedPnl || 0),
          fee: parseFloat(fill.fee || 0),
          time: new Date(fill.time).toISOString(),
        })),
        funding: funding.map(fund => ({
          coin: fund.delta.coin,
          amount: parseFloat(fund.delta.usdc),
          fundingRate: fund.delta.fundingRate,
          time: new Date(fund.time).toISOString(),
        })),
      },
    };
  }

  /**
   * Calculate unrealized PnL for open positions
   * Note: This uses current positions as a proxy. In production, you'd want
   * to track positions at the end of each day.
   * @private
   */
  async calculateUnrealizedPnL(date, positions) {
    if (!positions || positions.length === 0) {
      return 0;
    }

    let totalUnrealizedPnL = 0;

    for (const position of positions) {
      // Use the unrealized PnL from the position data
      // This is calculated by HyperLiquid as: side * (mark_price - entry_price) * position_size
      const unrealizedPnl = parseFloat(position.unrealizedPnl || 0);
      totalUnrealizedPnL += unrealizedPnl;
    }

    return totalUnrealizedPnL;
  }

  /**
   * Helper to round numbers to specified decimal places
   * @private
   */
  roundTo(num, decimals) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
}

export { PnlCalculator };
