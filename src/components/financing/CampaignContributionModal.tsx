'use client';

import React, { useState } from 'react';
import { DollarSign, X, CheckCircle2, Loader2 } from 'lucide-react';
import { StroopFormatter } from '../common/StroopFormatter';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  campaignId: number;
  targetStroops: string;
  onContribute: (stroops: string) => Promise<void>;
}

export function CampaignContributionModal({ isOpen, onClose, campaignId, targetStroops, onContribute }: Props) {
  const [amountXlm, setAmountXlm] = useState('50');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const stroopsToCommit = BigInt(Math.floor(parseFloat(amountXlm || '0') * 10_000_000)).toString();

  const handleCommit = async () => {
    try {
      setLoading(true);
      await onContribute(stroopsToCommit);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-neutral-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-100">Commit Production Capital</h3>
            <p className="text-xs text-neutral-400">Campaign #{campaignId}</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            Investment Amount (XLM)
          </label>
          <input
            type="number"
            min="10"
            value={amountXlm}
            onChange={(e) => setAmountXlm(e.target.value)}
            className="w-full rounded-xl border border-neutral-700 bg-neutral-950 p-2.5 text-xs text-neutral-100 focus:border-amber-500 focus:outline-none"
          />
          <div className="mt-1 text-[11px] text-neutral-500">
            Stroop Equivalent: <StroopFormatter stroops={stroopsToCommit} showXlm={false} />
          </div>
        </div>

        {success ? (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Investment registered! Claim token issued on Stellar.</span>
          </div>
        ) : (
          <button
            disabled={loading || !parseFloat(amountXlm)}
            onClick={handleCommit}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Authorize & Deploy Liquidity'}
          </button>
        )}
      </div>
    </div>
  );
}
