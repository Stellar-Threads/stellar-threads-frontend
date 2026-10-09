import {
  isConnected,
  requestAccess,
  getAddress,
  getNetwork,
  getNetworkDetails,
  signTransaction,
} from '@stellar/freighter-api';
import { STELLAR_NETWORK } from '../../config/stellar';

export interface WalletConnectionResult {
  success: boolean;
  address?: string;
  network?: string;
  networkPassphrase?: string;
  error?: string;
  isUnsupportedNetwork?: boolean;
}

/**
 * Checks if the Freighter browser extension is installed and responsive.
 */
export async function isFreighterAvailable(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    const result = await isConnected();
    if (result && typeof result === 'object' && 'isConnected' in result) {
      return Boolean(result.isConnected);
    }
    return Boolean(result);
  } catch (err) {
    console.debug('Freighter detection check failed:', err);
    return false;
  }
}

/**
 * Requests wallet permission and retrieves the active Stellar public address.
 */
export async function connectFreighterWallet(): Promise<WalletConnectionResult> {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Browser environment required for wallet connection' };
  }

  const available = await isFreighterAvailable();
  if (!available) {
    return {
      success: false,
      error:
        'Freighter wallet extension was not detected. Please install Freighter from freighter.app and refresh.',
    };
  }

  try {
    // Request access from user
    const accessRes = await requestAccess();
    if (accessRes?.error) {
      return {
        success: false,
        error: `Wallet connection rejected: ${accessRes.error}`,
      };
    }

    // Get public address
    const addressRes = await getAddress();
    if (addressRes?.error || !addressRes?.address) {
      return {
        success: false,
        error: addressRes?.error || 'Failed to retrieve public address from Freighter',
      };
    }

    const publicAddress = addressRes.address;

    // Verify active network
    let networkName = 'unknown';
    let networkPassphrase = '';
    let isUnsupported = false;

    try {
      const netRes = await getNetworkDetails();
      if (!netRes?.error && netRes?.networkPassphrase) {
        networkName = netRes.network || 'testnet';
        networkPassphrase = netRes.networkPassphrase;
        if (netRes.networkPassphrase !== STELLAR_NETWORK.passphrase) {
          isUnsupported = true;
        }
      } else {
        const simpleNet = await getNetwork();
        if (!simpleNet?.error && simpleNet?.network) {
          networkName = simpleNet.network;
          if (simpleNet.networkPassphrase && simpleNet.networkPassphrase !== STELLAR_NETWORK.passphrase) {
            isUnsupported = true;
          }
        }
      }
    } catch {
      // Non-critical network detection fallback
    }

    return {
      success: true,
      address: publicAddress,
      network: networkName,
      networkPassphrase,
      isUnsupportedNetwork: isUnsupported,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error during wallet connection';
    return {
      success: false,
      error: msg.includes('User declined')
        ? 'Wallet authorization was cancelled by the user'
        : msg,
    };
  }
}

/**
 * Prompts the Freighter extension to sign a transaction XDR.
 */
export async function signTransactionWithFreighter(
  transactionXdr: string,
  userAddress: string
): Promise<{
  success: boolean;
  signedTxXdr?: string;
  error?: string;
}> {
  try {
    const result = await signTransaction(transactionXdr, {
      networkPassphrase: STELLAR_NETWORK.passphrase,
      address: userAddress,
    });

    if (result?.error) {
      return {
        success: false,
        error: `Freighter signing error: ${result.error}`,
      };
    }

    if (!result?.signedTxXdr) {
      return {
        success: false,
        error: 'Wallet did not return signed transaction XDR',
      };
    }

    return {
      success: true,
      signedTxXdr: result.signedTxXdr,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Transaction signing was cancelled';
    return {
      success: false,
      error: msg.includes('User declined') || msg.includes('cancel')
        ? 'Transaction signing was cancelled by user'
        : msg,
    };
  }
}
