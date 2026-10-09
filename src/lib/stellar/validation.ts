import { StrKey } from '@stellar/stellar-sdk';
import { MemoType } from '../../types/stellar';
import { STELLAR_NETWORK } from '../../config/stellar';

export interface FieldValidation {
  isValid: boolean;
  error?: string;
}

export function validateStellarAddress(address: string): FieldValidation {
  if (!address || !address.trim()) {
    return { isValid: false, error: 'Recipient Stellar public address is required' };
  }

  const trimmed = address.trim();

  if (!trimmed.startsWith('G')) {
    return { isValid: false, error: 'Stellar account addresses must start with "G"' };
  }

  if (trimmed.length !== 56) {
    return {
      isValid: false,
      error: `Address must be 56 characters long (currently ${trimmed.length})`,
    };
  }

  try {
    if (!StrKey.isValidEd25519PublicKey(trimmed)) {
      return { isValid: false, error: 'Invalid Stellar address checksum' };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Malformed Stellar address format' };
  }
}

export function validatePaymentAmount(
  amountStr: string,
  availableBalanceXlm?: string | null
): FieldValidation {
  if (!amountStr || !amountStr.trim()) {
    return { isValid: false, error: 'Payment amount is required' };
  }

  const trimmed = amountStr.trim();
  const num = parseFloat(trimmed);

  if (isNaN(num) || !isFinite(num)) {
    return { isValid: false, error: 'Enter a valid numerical amount' };
  }

  if (num <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0 XLM' };
  }

  const parts = trimmed.split('.');
  if (parts.length > 2) {
    return { isValid: false, error: 'Amount contains multiple decimal points' };
  }
  if (parts.length === 2 && parts[1].length > 7) {
    return {
      isValid: false,
      error: 'Stellar only supports up to 7 decimal places (stroops)',
    };
  }

  if (availableBalanceXlm !== undefined && availableBalanceXlm !== null) {
    const balanceNum = parseFloat(availableBalanceXlm);
    if (!isNaN(balanceNum)) {
      const minReserve = STELLAR_NETWORK.minAccountReserveXlm;
      const baseFee = parseFloat(STELLAR_NETWORK.baseFeeXlm);
      const spendable = Math.max(0, balanceNum - minReserve - baseFee);

      if (num > spendable) {
        return {
          isValid: false,
          error: `Insufficient spendable balance. Available: ${balanceNum.toFixed(
            4
          )} XLM (spendable: ~${spendable.toFixed(
            4
          )} XLM after reserve requirement)`,
        };
      }
    }
  }

  return { isValid: true };
}

export function validateMemoValue(memoType: MemoType, memoValue: string): FieldValidation {
  if (memoType === 'none' || !memoValue || !memoValue.trim()) {
    return { isValid: true };
  }

  const trimmed = memoValue.trim();

  if (memoType === 'text') {
    // UTF-8 byte length max 28 bytes
    const encoder = new TextEncoder();
    const bytes = encoder.encode(trimmed).length;
    if (bytes > 28) {
      return {
        isValid: false,
        error: `Memo text cannot exceed 28 bytes (currently ${bytes} bytes)`,
      };
    }
    return { isValid: true };
  }

  if (memoType === 'id') {
    if (!/^\d+$/.test(trimmed)) {
      return { isValid: false, error: 'Memo ID must be a non-negative integer' };
    }
    try {
      const big = BigInt(trimmed);
      const maxUint64 = BigInt('18446744073709551615');
      if (big < BigInt(0) || big > maxUint64) {
        return { isValid: false, error: 'Memo ID exceeds 64-bit unsigned integer range' };
      }
      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Invalid Memo ID integer format' };
    }
  }

  if (memoType === 'hash') {
    if (!/^[0-9a-fA-F]{64}$/.test(trimmed)) {
      return {
        isValid: false,
        error: 'Memo Hash must be exactly 32 bytes represented as 64 hexadecimal characters',
      };
    }
    return { isValid: true };
  }

  return { isValid: true };
}
