'use client';

import React, { useState } from 'react';
import { Droplet, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { requestFriendbotFunds } from '../../lib/stellar/friendbot';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultPublicKey?: string;
  onFunded?: () => void;
}

export function FriendbotFaucetModal({ isOpen, onClose, defaultPublicKey = '', onFunded }: Props) {
  const [address, setAddress] = useState(defaultPublicKey);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleFund = async () => {
    setLoading(true);
    setResult(null);
    const res = await requestFriendbotFunds(address.trim());
    setResult(res);
    setLoading(false);
    if (res.success && onFunded) {
      onFunded();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-amber-500/20 bg-neutral-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Droplet className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-100">Stellar Testnet Faucet</h3>
            <p className="text-xs text-neutral-400">Instant 10,000 XLM Friendbot Grant</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            Destination Public Key (G-Address)
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="G..."
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs font-mono text-neutral-200 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {result && (
          <div
            className={`mb-4 flex items-center gap-2 rounded-lg p-3 text-xs ${
              result.success
                ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/40 border border-rose-500/30 text-rose-300'
            }`}
          >
            {result.success ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{result.message}</span>
          </div>
        )}

        <button
          disabled={loading || !address}
          onClick={handleFund}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-semibold text-neutral-950 hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Requesting Testnet Lumens...
            </>
          ) : (
            'Fund Account (10,000 XLM)'
          )}
        </button>
      </div>
    </div>
  );
}
