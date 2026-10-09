import { describe, it, expect } from 'vitest';
import {
  validateStellarAddress,
  validatePaymentAmount,
  validateMemoValue,
} from '../lib/stellar/validation';

describe('Frontend Stellar Validation', () => {
  const validAddress = 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN';
  const validAddress2 = 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';

  describe('validateStellarAddress', () => {
    it('accepts valid 56-character Ed25519 G-addresses', () => {
      expect(validateStellarAddress(validAddress).isValid).toBe(true);
      expect(validateStellarAddress(validAddress2).isValid).toBe(true);
    });

    it('rejects addresses not starting with G', () => {
      expect(validateStellarAddress('SA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN').isValid).toBe(false);
      expect(validateStellarAddress('0x71C8363820912bfABc4291882d95393f345E9F8E').isValid).toBe(false);
    });

    it('rejects wrong length or empty addresses', () => {
      expect(validateStellarAddress('').isValid).toBe(false);
      expect(validateStellarAddress('GA5ZSEJYB37').isValid).toBe(false);
    });

    it('rejects corrupt checksum addresses', () => {
      const corrupt = 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZV9';
      expect(validateStellarAddress(corrupt).isValid).toBe(false);
    });
  });

  describe('validatePaymentAmount', () => {
    it('accepts positive numbers within precision limits', () => {
      expect(validatePaymentAmount('10').isValid).toBe(true);
      expect(validatePaymentAmount('0.0000001').isValid).toBe(true);
      expect(validatePaymentAmount('100.5').isValid).toBe(true);
    });

    it('rejects non-positive, zero, or malformed inputs', () => {
      expect(validatePaymentAmount('0').isValid).toBe(false);
      expect(validatePaymentAmount('-5').isValid).toBe(false);
      expect(validatePaymentAmount('').isValid).toBe(false);
      expect(validatePaymentAmount('xyz').isValid).toBe(false);
    });

    it('rejects precision exceeding 7 decimal places', () => {
      expect(validatePaymentAmount('1.00000001').isValid).toBe(false);
    });

    it('enforces spendable balance with 1.0 XLM minimum reserve buffer', () => {
      // With 5 XLM balance, spendable is ~3.99999 XLM
      expect(validatePaymentAmount('3', '5.0').isValid).toBe(true);
      expect(validatePaymentAmount('4.5', '5.0').isValid).toBe(false);
    });
  });

  describe('validateMemoValue', () => {
    it('permits none memo type', () => {
      expect(validateMemoValue('none', '').isValid).toBe(true);
    });

    it('validates text memo within 28 bytes', () => {
      expect(validateMemoValue('text', 'Atelier payment').isValid).toBe(true);
      expect(
        validateMemoValue('text', 'This is a very lengthy memo that exceeds the 28-byte limit of the Stellar protocol').isValid
      ).toBe(false);
    });

    it('validates memo ID format', () => {
      expect(validateMemoValue('id', '123456').isValid).toBe(true);
      expect(validateMemoValue('id', '-1').isValid).toBe(false);
      expect(validateMemoValue('id', 'abc').isValid).toBe(false);
    });

    it('validates memo hash as 64 hex characters', () => {
      const validHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
      expect(validateMemoValue('hash', validHash).isValid).toBe(true);
      expect(validateMemoValue('hash', 'short-hash').isValid).toBe(false);
    });
  });
});
