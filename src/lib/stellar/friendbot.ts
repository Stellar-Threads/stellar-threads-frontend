import { STELLAR_NETWORK } from '../../config/stellar';

export interface FriendbotResult {
  success: boolean;
  message: string;
  txHash?: string;
}

export async function requestFriendbotFunds(publicKey: string): Promise<FriendbotResult> {
  if (!publicKey || !publicKey.startsWith('G') || publicKey.length !== 56) {
    return {
      success: false,
      message: 'Invalid Stellar public key format for Friendbot faucet funding.',
    };
  }

  try {
    const url = `${STELLAR_NETWORK.friendbotUrl}?addr=${encodeURIComponent(publicKey)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    const data = await res.json();

    if (res.ok) {
      return {
        success: true,
        message: 'Successfully funded account with 10,000 Testnet XLM!',
        txHash: (data as any)?.hash,
      };
    } else {
      return {
        success: false,
        message: (data as any)?.detail || 'Friendbot funding request rejected by network.',
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Network timeout contacting Stellar Friendbot.',
    };
  }
}
