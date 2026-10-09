'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchAccountPayments } from '../lib/stellar/client';
import { SessionTransaction, OnChainPayment } from '../types/stellar';

const STORAGE_KEY_SESSION_TXS = 'stellar_threads_session_transactions';

export function useTransactionHistory(userAddress: string | null) {
  const [sessionTransactions, setSessionTransactions] = useState<SessionTransaction[]>([]);
  const [onChainPayments, setOnChainPayments] = useState<OnChainPayment[]>([]);
  const [isLoadingOnChain, setIsLoadingOnChain] = useState(false);

  // Load session transactions from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SESSION_TXS);
      if (stored) {
        const parsed = JSON.parse(stored) as SessionTransaction[];
        setSessionTransactions(parsed);
      }
    } catch {
      // Local storage corrupted or disabled
    }
  }, []);

  // Fetch on-chain payments from Horizon when address changes
  const loadOnChainPayments = useCallback(async () => {
    if (!userAddress) {
      setOnChainPayments([]);
      return;
    }

    setIsLoadingOnChain(true);
    try {
      const records = await fetchAccountPayments(userAddress, 10);
      setOnChainPayments(records);
    } catch (err) {
      console.warn('Failed to load on-chain payments:', err);
    } finally {
      setIsLoadingOnChain(false);
    }
  }, [userAddress]);

  useEffect(() => {
    loadOnChainPayments();
  }, [loadOnChainPayments]);

  const addSessionTransaction = useCallback((tx: SessionTransaction) => {
    setSessionTransactions((prev) => {
      const updated = [tx, ...prev.filter((item) => item.hash !== tx.hash)].slice(0, 50);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY_SESSION_TXS, JSON.stringify(updated));
        } catch {
          // Local storage write fallback
        }
      }
      return updated;
    });
  }, []);

  const clearSessionTransactions = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_SESSION_TXS);
    }
    setSessionTransactions([]);
  }, []);

  return {
    sessionTransactions,
    onChainPayments,
    isLoadingOnChain,
    addSessionTransaction,
    clearSessionTransactions,
    refreshHistory: loadOnChainPayments,
  };
}
