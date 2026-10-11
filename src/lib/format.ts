/**
 * Utility functions for locale-aware numeric and currency formatting across fashion financing and escrow flows.
 */

interface FormatOptions {
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Formats a numeric value or string according to user locale with thousands separators.
 */
export function formatLocaleNumber(
  amount: number | string | null | undefined,
  options: FormatOptions = {}
): string {
  if (amount === null || amount === undefined || amount === '') return '0';
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/,/g, ''));
  if (isNaN(num)) return '0';

  const {
    locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(num);
}

/**
 * Formats a numeric figure with an asset/currency ticker suffix (e.g. "50,000 XLM").
 */
export function formatCryptoAmount(
  amount: number | string | null | undefined,
  symbol: string = 'XLM',
  options?: FormatOptions
): string {
  return `${formatLocaleNumber(amount, options)} ${symbol}`;
}