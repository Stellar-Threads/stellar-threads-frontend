'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchAccountDetails, fundWithFriendbot } from '../lib/stellar/client';
import { AccountBalanceState } from '../types/stellar';

export function useStellarBalance(address: string | null) {
  const [balanceState, setBalanceState] = useState<AccountBalanceState>({
    nativeBalance: null,
    otherBalances: [],
    isAccountFunded: true,
    isLoading: false,
    error: null,
    lastFetchedAt: null,
  });

  const [isFunding, setIsFunding] = useState(false);
  const [fundingMessage, setFundingMessage] = useState<string | null>(null);

  const loadBalance = useCallback(async () => {
    if (!address) {
      setBalanceState({
        nativeBalance: null,
        otherBalances: [],
        isAccountFunded: true,
        isLoading: false,
        error: null,
        lastFetchedAt: null,
      });
      return;
    }

    setBalanceState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const res = await fetchAccountDetails(address);
      if (res.exists) {
        setBalanceState({
          nativeBalance: res.nativeBalance,
          otherBalances: res.otherBalances,
          isAccountFunded: true,
          isLoading: false,
          error: null,
          lastFetchedAt: Date.now(),
        });
      } else {
        // Account exists on Testnet? No (404)
        setBalanceState({
          nativeBalance: '0.0000000',
          otherBalances: [],
          isAccountFunded: false,
          isLoading: false,
          error: null, // Not a fatal error, just needs funding
          lastFetchedAt: Date.now(),
        });
      }
    } catch (err) {
      setBalanceState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to retrieve account balance',
      }));
    }
  }, [address]);

  useEffect(() => {
    loadBalance();
  }, [loadBalance]);

  const requestFriendbotFunding = useCallback(async () => {
    if (!address) return;
    setIsFunding(true);
    setFundingMessage(null);

    try {
      const res = await fundWithFriendbot(address);
      if (res.success) {
        setFundingMessage('Success: Account funded with 10,000 Testnet XLM! Refreshing balances...');
        // Wait 1.5s for testnet ledger confirmation then reload
        setTimeout(() => {
          loadBalance();
          setIsFunding(false);
        }, 1500);
      } else {
        setFundingMessage(`Friendbot error: ${res.message}`);
        setIsFunding(false);
      }
    } catch (err) {
      setFundingMessage(
        `Funding error: ${err instanceof Error ? err.message : 'Network error'}`
      );
      setIsFunding(false);
    }
  }, [address, loadBalance]);

  return {
    ...balanceState,
    refreshBalance: loadBalance,
    requestFriendbotFunding,
    isFunding,
    fundingMessage,
  };
}
