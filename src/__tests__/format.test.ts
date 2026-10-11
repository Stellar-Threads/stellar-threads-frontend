import { describe, it, expect } from 'vitest';
import { formatLocaleNumber, formatCryptoAmount } from '../lib/format';

describe('formatLocaleNumber utility', () => {
  it('formats whole numbers with thousands separators in en-US', () => {
    expect(formatLocaleNumber(50000, { locale: 'en-US' })).toBe('50,000');
    expect(formatLocaleNumber('1000000', { locale: 'en-US' })).toBe('1,000,000');
  });

  it('formats decimals within specified precision', () => {
    expect(formatLocaleNumber(1234.567, { locale: 'en-US', maximumFractionDigits: 2 })).toBe('1,234.57');
    expect(formatLocaleNumber(1234.5, { locale: 'en-US', minimumFractionDigits: 2 })).toBe('1,234.50');
  });

  it('formats numbers correctly across European locales (de-DE)', () => {
    const formatted = formatLocaleNumber(50000, { locale: 'de-DE' });
    // de-DE uses period as thousands separator
    expect(formatted).toBe('50.000');
  });

  it('handles string inputs containing existing commas cleanly', () => {
    expect(formatLocaleNumber('32,500', { locale: 'en-US' })).toBe('32,500');
  });

  it('returns safe fallback for empty, null, or invalid inputs', () => {
    expect(formatLocaleNumber(null)).toBe('0');
    expect(formatLocaleNumber(undefined)).toBe('0');
    expect(formatLocaleNumber('')).toBe('0');
    expect(formatLocaleNumber('invalid-number')).toBe('0');
  });
});

describe('formatCryptoAmount utility', () => {
  it('appends default XLM ticker symbol', () => {
    expect(formatCryptoAmount(25000, 'XLM', { locale: 'en-US' })).toBe('25,000 XLM');
  });

  it('supports custom token tickers', () => {
    expect(formatCryptoAmount('500.5', 'USDC', { locale: 'en-US' })).toBe('500.5 USDC');
  });
});