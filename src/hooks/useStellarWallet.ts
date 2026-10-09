'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  isFreighterAvailable,
  connectFreighterWallet,
} from '../lib/wallet/freighter';
import { WalletState } from '../types/stellar';

const STORAGE_KEY_CONNECTED = 'stellar_threads_wallet_connected';

export function useStellarWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    status: 'disconnected',
    address: null,
    network: null,
    isFreighterInstalled: false,
    error: null,
  });

  // Check Freighter availability on mount
  useEffect(() => {
    let isMounted = true;

    async function checkAvailability() {
      const available = await isFreighterAvailable();
      if (isMounted) {
        setWallet((prev) => ({
          ...prev,
          isFreighterInstalled: available,
        }));

        // Auto-reconnect if previously connected in this session/browser
        const wasConnected = typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY_CONNECTED) === 'true';
        if (wasConnected && available) {
          reconnect();
        }
      }
    }

    checkAvailability();

    return () => {
      isMounted = false;
    };
  }, []);

  const reconnect = useCallback(async () => {
    try {
      const result = await connectFreighterWallet();
      if (result.success && result.address) {
        setWallet({
          status: result.isUnsupportedNetwork ? 'unsupported_network' : 'connected',
          address: result.address,
          network: result.network || 'testnet',
          isFreighterInstalled: true,
          error: result.isUnsupportedNetwork
            ? 'Freighter is set to an unsupported network. Please switch to Stellar Testnet.'
            : null,
        });
      } else {
        localStorage.removeItem(STORAGE_KEY_CONNECTED);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY_CONNECTED);
    }
  }, []);

  const connect = useCallback(async () => {
    setWallet((prev) => ({ ...prev, status: 'connecting', error: null }));

    try {
      const result = await connectFreighterWallet();
      if (result.success && result.address) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY_CONNECTED, 'true');
        }
        setWallet({
          status: result.isUnsupportedNetwork ? 'unsupported_network' : 'connected',
          address: result.address,
          network: result.network || 'testnet',
          isFreighterInstalled: true,
          error: result.isUnsupportedNetwork
            ? 'Freighter is set to an unsupported network. Please switch to Stellar Testnet.'
            : null,
        });
      } else {
        setWallet((prev) => ({
          ...prev,
          status: 'error',
          error: result.error || 'Failed to connect wallet',
        }));
      }
    } catch (err: unknown) {
      setWallet((prev) => ({
        ...prev,
        status: 'error',
        error: err instanceof Error ? err.message : 'Unknown connection error',
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_CONNECTED);
    }
    setWallet((prev) => ({
      ...prev,
      status: 'disconnected',
      address: null,
      network: null,
      error: null,
    }));
  }, []);

  return {
    ...wallet,
    connect,
    disconnect,
  };
}
