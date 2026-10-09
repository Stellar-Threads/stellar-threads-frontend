import {
  WalletOption,
  WalletProviderId,
} from '../../types/stellar';
import {
  connectFreighterWallet,
  isFreighterAvailable,
  signTransactionWithFreighter,
  WalletConnectionResult,
} from './freighter';

export const SUPPORTED_WALLETS: WalletOption[] = [
  {
    id: 'freighter',
    name: 'Freighter',
    type: 'extension',
    description: 'Official browser extension by SDF. Recommended for Stellar Testnet.',
    isAvailable: false,
    downloadUrl: 'https://www.freighter.app/',
  },
  {
    id: 'xbull',
    name: 'xBull Wallet',
    type: 'extension',
    description: 'Secure, multi-platform wallet with Soroban smart contract support.',
    isAvailable: false,
    downloadUrl: 'https://xbull.app/',
  },
  {
    id: 'albedo',
    name: 'Albedo',
    type: 'web',
    description: 'Web-based delegated signer. Works everywhere without extensions.',
    isAvailable: true,
    downloadUrl: 'https://albedo.link/',
  },
  {
    id: 'lobstr',
    name: 'LOBSTR',
    type: 'mobile',
    description: 'Popular mobile wallet with SEP-43 and WalletConnect support.',
    isAvailable: false,
    downloadUrl: 'https://lobstr.co/',
  },
  {
    id: 'rabet',
    name: 'Rabet',
    type: 'extension',
    description: 'Lightweight browser extension wallet for Stellar networks.',
    isAvailable: false,
    downloadUrl: 'https://rabet.io/',
  },
  {
    id: 'hana',
    name: 'Hana Wallet',
    type: 'extension',
    description: 'Multi-chain Web3 wallet with Stellar and Soroban capability.',
    isAvailable: false,
    downloadUrl: 'https://hanawallet.io/',
  },
];

export async function detectAvailableWallets(): Promise<WalletOption[]> {
  if (typeof window === 'undefined') {
    return SUPPORTED_WALLETS;
  }

  const freighterOk = await isFreighterAvailable();
  const xbullOk = Boolean((window as any).xBullSDK);
  const rabetOk = Boolean((window as any).rabet);

  return SUPPORTED_WALLETS.map((w) => {
    if (w.id === 'freighter') return { ...w, isAvailable: freighterOk };
    if (w.id === 'xbull') return { ...w, isAvailable: xbullOk };
    if (w.id === 'rabet') return { ...w, isAvailable: rabetOk };
    if (w.id === 'albedo') return { ...w, isAvailable: true };
    return w;
  });
}

/**
 * Connect to specified wallet provider
 */
export async function connectWalletProvider(
  walletId: WalletProviderId
): Promise<WalletConnectionResult & { walletId: WalletProviderId; walletName: string }> {
  const walletMeta = SUPPORTED_WALLETS.find((w) => w.id === walletId) || SUPPORTED_WALLETS[0];

  if (walletId === 'freighter') {
    const res = await connectFreighterWallet();
    return {
      ...res,
      walletId: 'freighter',
      walletName: 'Freighter',
    };
  }

  // Fallback / multi-wallet connection using dynamic StellarWalletsKit or direct adapter
  try {
    if (walletId === 'xbull') {
      const xbull = (window as any).xBullSDK;
      if (!xbull) {
        return {
          success: false,
          error: 'xBull Wallet extension not detected. Please install from xbull.app',
          walletId,
          walletName: walletMeta.name,
        };
      }
      const address = await xbull.getPublicKey();
      return {
        success: true,
        address,
        network: 'testnet',
        walletId: 'xbull',
        walletName: 'xBull',
      };
    }

    if (walletId === 'rabet') {
      const rabet = (window as any).rabet;
      if (!rabet) {
        return {
          success: false,
          error: 'Rabet extension not detected. Please install from rabet.io',
          walletId,
          walletName: walletMeta.name,
        };
      }
      const result = await rabet.connect();
      return {
        success: true,
        address: result.publicKey,
        network: 'testnet',
        walletId: 'rabet',
        walletName: 'Rabet',
      };
    }

    if (walletId === 'albedo') {
      try {
        const { StellarWalletsKit } = await import('@creit.tech/stellar-wallets-kit');
        const { AlbedoModule } = await import('@creit.tech/stellar-wallets-kit/modules/albedo');
        StellarWalletsKit.init({
          modules: [new AlbedoModule()],
          network: 'testnet' as any,
          selectedWalletId: 'albedo',
        });
        const res = await StellarWalletsKit.getAddress();
        const pubKey = typeof res === 'string' ? res : (res as any)?.address || '';
        return {
          success: true,
          address: pubKey,
          network: 'testnet',
          walletId: 'albedo',
          walletName: 'Albedo',
        };
      } catch (err: any) {
        return {
          success: false,
          error: `Albedo connection error: ${err.message || String(err)}`,
          walletId,
          walletName: 'Albedo',
        };
      }
    }

    // Default: try Freighter
    const res = await connectFreighterWallet();
    return {
      ...res,
      walletId: 'freighter',
      walletName: 'Freighter',
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Failed to connect ${walletMeta.name}: ${err.message || String(err)}`,
      walletId,
      walletName: walletMeta.name,
    };
  }
}

/**
 * Sign transaction XDR using active wallet
 */
export async function signTransactionWithSelectedWallet(
  walletId: WalletProviderId,
  transactionXdr: string,
  userAddress: string
): Promise<{ success: boolean; signedTxXdr?: string; error?: string }> {
  if (walletId === 'freighter') {
    return signTransactionWithFreighter(transactionXdr, userAddress);
  }

  try {
    const { StellarWalletsKit } = await import('@creit.tech/stellar-wallets-kit');
    const result = await StellarWalletsKit.signTransaction(transactionXdr, {
      address: userAddress,
    });
    if (result && (result as any).signedTxXdr) {
      return { success: true, signedTxXdr: (result as any).signedTxXdr };
    }
    if (typeof result === 'string') {
      return { success: true, signedTxXdr: result };
    }
    return { success: false, error: 'Wallet did not return signed transaction XDR' };
  } catch (err: any) {
    // If fallback to freighter works
    if (await isFreighterAvailable()) {
      return signTransactionWithFreighter(transactionXdr, userAddress);
    }
    return {
      success: false,
      error: err.message || 'Signing failed with selected wallet',
    };
  }
}
