/**
 * Validation utilities for API inputs
 */

/**
 * Validate if a string is a valid Ethereum address
 * @param {string} address - Address to validate
 * @returns {boolean}
 */
export function isValidAddress(address) {
  if (!address || typeof address !== 'string') {
    return false;
  }
  // Check if it's a valid hex address (0x followed by 40 hex characters)
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate if a string is a valid date in YYYY-MM-DD format
 * @param {string} dateString - Date string to validate
 * @returns {boolean}
 */
export function isValidDateString(dateString) {
  if (!dateString || typeof dateString !== 'string') {
    return false;
  }

  // Check format YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }

  // Check if it's a valid date
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

/**
 * Validate date range
 * @param {string} start - Start date (YYYY-MM-DD)
 * @param {string} end - End date (YYYY-MM-DD)
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validateDateRange(start, end) {
  if (!isValidDateString(start)) {
    return { valid: false, error: 'Invalid start date format. Use YYYY-MM-DD' };
  }

  if (!isValidDateString(end)) {
    return { valid: false, error: 'Invalid end date format. Use YYYY-MM-DD' };
  }

  const startDate = new Date(start);
  const endDate = new Date(end);
  const now = new Date();

  if (startDate > endDate) {
    return { valid: false, error: 'Start date must be before end date' };
  }

  if (startDate > now) {
    return { valid: false, error: 'Start date cannot be in the future' };
  }

  // Limit to 1 year of data
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  if (startDate < oneYearAgo) {
    return {
      valid: false,
      error: 'Start date cannot be more than 1 year in the past',
    };
  }

  // Limit range to 90 days
  const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  if (daysDiff > 90) {
    return {
      valid: false,
      error: 'Date range cannot exceed 90 days',
    };
  }

  return { valid: true };
}

/**
 * Validate PnL request parameters
 * @param {string} wallet - Wallet address
 * @param {string} start - Start date
 * @param {string} end - End date
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validatePnLRequest(wallet, start, end) {
  // Validate wallet address
  if (!wallet) {
    return { valid: false, error: 'Wallet address is required' };
  }

  if (!isValidAddress(wallet)) {
    return {
      valid: false,
      error: 'Invalid wallet address. Must be a valid Ethereum address (0x...)',
    };
  }

  // Validate date range
  if (!start || !end) {
    return { valid: false, error: 'Both start and end dates are required' };
  }

  return validateDateRange(start, end);
}
