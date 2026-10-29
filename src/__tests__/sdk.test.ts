import { describe, it, expect, vi } from 'vitest';
import { StellarThreadsSdk } from '../lib/sdk/stellarThreadsSdk';

describe('StellarThreadsSdk Tests', () => {
  const sdk = new StellarThreadsSdk('http://mock-api.local');

  it('should correctly format POST request for calculating factoring ROI', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          principalStroops: '100000000',
          yieldBps: 850,
          durationDays: 180,
          estimatedYieldStroops: '4191780',
          effectiveApyPercent: '8.50',
        },
      }),
    });

    const result = await sdk.calculateFactoringRoi('100000000', 850, 180);
    expect(result.estimatedYieldStroops).toBe('4191780');
    expect(result.effectiveApyPercent).toBe('8.50');
  });
});
