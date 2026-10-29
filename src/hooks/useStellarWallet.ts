'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  connectWalletProvider,
  detectAvailableWallets,
  SUPPORTED_WALLETS,
} from '../lib/wallet/multiWallet';
import { WalletOption, WalletProviderId, WalletState } from '../types/stellar';

const STORAGE_KEY_CONNECTED = 'stellar_threads_wallet_connected';
const STORAGE_KEY_PROVIDER = 'stellar_threads_wallet_provider';

export function useStellarWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    status: 'disconnected',
    address: null,
    network: null,
    selectedWalletId: null,
    selectedWalletName: null,
    isFreighterInstalled: false,
    error: null,
  });

  const [availableWallets, setAvailableWallets] = useState<WalletOption[]>(SUPPORTED_WALLETS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Detect installed extensions on mount
  useEffect(() => {
    let isMounted = true;

    async function init() {
      const detected = await detectAvailableWallets();
      if (isMounted) {
        setAvailableWallets(detected);
        const freighter = detected.find((w) => w.id === 'freighter');
        setWallet((prev) => ({
          ...prev,
          isFreighterInstalled: Boolean(freighter?.isAvailable),
        }));

        // Auto-reconnect if previously connected
        if (typeof window !== 'undefined') {
          const wasConnected = localStorage.getItem(STORAGE_KEY_CONNECTED) === 'true';
          const savedProvider = (localStorage.getItem(STORAGE_KEY_PROVIDER) as WalletProviderId) || 'freighter';
          if (wasConnected) {
            connect(savedProvider);
          }
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = useCallback(async (providerId: WalletProviderId = 'freighter') => {
    setWallet((prev) => ({
      ...prev,
      status: 'connecting',
      selectedWalletId: providerId,
      error: null,
    }));

    try {
      const result = await connectWalletProvider(providerId);

      if (result.success && result.address) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY_CONNECTED, 'true');
          localStorage.setItem(STORAGE_KEY_PROVIDER, providerId);
        }

        setWallet({
          status: result.isUnsupportedNetwork ? 'unsupported_network' : 'connected',
          address: result.address,
          network: result.network || 'testnet',
          selectedWalletId: providerId,
          selectedWalletName: result.walletName,
          isFreighterInstalled: true,
          error: result.isUnsupportedNetwork
            ? `${result.walletName} is on an unsupported network. Please switch to Stellar Testnet.`
            : null,
        });
        setIsModalOpen(false);
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
      localStorage.removeItem(STORAGE_KEY_PROVIDER);
    }
    setWallet({
      status: 'disconnected',
      address: null,
      network: null,
      selectedWalletId: null,
      selectedWalletName: null,
      isFreighterInstalled: wallet.isFreighterInstalled,
      error: null,
    });
  }, [wallet.isFreighterInstalled]);

  return {
    ...wallet,
    availableWallets,
    isModalOpen,
    openModal: () => setIsModalOpen(true),
    closeModal: () => setIsModalOpen(false),
    connect,
    disconnect,
  };
}
