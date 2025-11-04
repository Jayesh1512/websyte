import express from 'express';
import { getWalletPnL } from '../controllers/hyperliquidController.js';

const router = express.Router();

/**
 * GET /api/hyperliquid/:wallet/pnl
 * Get daily PnL for a wallet
 *
 * Query Parameters:
 * - start: Start date (YYYY-MM-DD)
 * - end: End date (YYYY-MM-DD)
 *
 * Example:
 * GET /api/hyperliquid/0x1234.../pnl?start=2025-01-01&end=2025-01-31
 */
router.get('/:wallet/pnl', getWalletPnL);

export default router;
