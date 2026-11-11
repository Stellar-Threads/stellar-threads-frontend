/**
 * @stellar-threads/client-sdk
 * Centralized interface for querying and executing Stellar Threads Soroban smart contracts.
 */
export interface EscrowOrderSummary {
  orderId: number;
  buyer: string;
  designer: string;
  amountStroops: string;
  status: string;
}

export interface ProductPassportSummary {
  productId: string;
  designer: string;
  materialsHash: string;
  batchSize: number;
  status: string;
}

export interface FactoringRoiCalculation {
  principalStroops: string;
  yieldBps: number;
  durationDays: number;
  estimatedYieldStroops: string;
  effectiveApyPercent: string;
}

export class StellarThreadsSdk {
  private baseUrl: string;

  constructor(baseUrl = process.env.NEXT_PUBLIC_CORE_API_URL ? `${process.env.NEXT_PUBLIC_CORE_API_URL}/api/v1` : 'http://localhost:3001/api/v1') {
    this.baseUrl = baseUrl;
  }

  async getHealth() {
    try {
      const res = await fetch(`${this.baseUrl}/health`);
      if (!res.ok) return { status: 'offline' };
      return await res.json();
    } catch {
      return { status: 'offline' };
    }
  }

  async getAnalyticsOverview() {
    try {
      const res = await fetch(`${this.baseUrl}/analytics/overview`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async calculateFactoringRoi(principalStroops: string, yieldBps: number, durationDays: number): Promise<FactoringRoiCalculation> {
    const res = await fetch(`${this.baseUrl}/financing/calculate-roi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ principalStroops, yieldBps, durationDays }),
    });
    const json = await res.json();
    return json.data;
  }

  async getPassportQr(productId: string) {
    try {
      const res = await fetch(`${this.baseUrl}/passports/qr/${encodeURIComponent(productId)}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
}

export const stellarThreadsSdk = new StellarThreadsSdk();
