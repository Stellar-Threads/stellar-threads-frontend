import { describe, it, expect } from 'vitest';
import { truncateAddress, stroopsToXlm, formatBpsAsPercent } from '../lib/stellar/formatters';

describe('Frontend Formatting Utilities Tests', () => {
  it('should truncate 56-char public key correctly', () => {
    const key = 'GBTYMGFXTESTADDRESS1234567890123456789012345678901234567';
    expect(truncateAddress(key, 4)).toBe('GBTY...4567');
  });

  it('should convert stroops to human readable XLM', () => {
    expect(stroopsToXlm('10000000')).toBe('1.00');
    expect(stroopsToXlm('500000000')).toBe('50.00');
  });

  it('should format basis points into percentage', () => {
    expect(formatBpsAsPercent(850)).toBe('8.50%');
    expect(formatBpsAsPercent(10000)).toBe('100.00%');
  });
});
