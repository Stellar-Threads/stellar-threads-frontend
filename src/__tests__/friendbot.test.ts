import { describe, it, expect, vi } from 'vitest';
import { Keypair } from '@stellar/stellar-sdk';
import { requestFriendbotFunds } from '../lib/stellar/friendbot';

describe('Friendbot Faucet Client Tests', () => {
  it('should reject invalid public keys before making network requests', async () => {
    const res = await requestFriendbotFunds('INVALID_KEY');
    expect(res.success).toBe(false);
    expect(res.message).toContain('Invalid Stellar public key');
  });

  it('should handle simulated successful Friendbot response', async () => {
    const validKey = Keypair.random().publicKey();
    // Mock global fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ hash: 'test_hash_123' }),
    });

    const res = await requestFriendbotFunds(validKey);
    expect(res.success).toBe(true);
    expect(res.txHash).toBe('test_hash_123');
  });
});
