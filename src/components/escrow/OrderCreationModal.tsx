'use client';

import React, { useState } from 'react';
import { Shield, X, CheckCircle2, Loader2 } from 'lucide-react';
import { StroopFormatter } from '../common/StroopFormatter';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreateOrder: (designerAddress: string, amountXlm: string) => Promise<void>;
}

export function OrderCreationModal({ isOpen, onClose, onCreateOrder }: Props) {
  const [designer, setDesigner] = useState('');
  const [amountXlm, setAmountXlm] = useState('100');
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onCreateOrder(designer, amountXlm);
      setComplete(true);
      setTimeout(() => {
        onClose();
        setComplete(false);
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
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-100">Create B2B Fashion Escrow</h3>
            <p className="text-xs text-neutral-400">4-Stage Milestone Escrow Agreement</p>
          </div>
        </div>

        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Designer Atelier Public Key (G...)
            </label>
            <input
              type="text"
              placeholder="GBTY..."
              value={designer}
              onChange={(e) => setDesigner(e.target.value)}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 p-2.5 text-xs text-neutral-100 focus:border-amber-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Escrow Value (XLM)
            </label>
            <input
              type="number"
              min="10"
              value={amountXlm}
              onChange={(e) => setAmountXlm(e.target.value)}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 p-2.5 text-xs text-neutral-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {complete ? (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Escrow created and funded on Stellar!</span>
          </div>
        ) : (
          <button
            disabled={loading || !designer || !amountXlm}
            onClick={handleSubmit}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Deploy Escrow Agreement'}
          </button>
        )}
      </div>
    </div>
  );
}
