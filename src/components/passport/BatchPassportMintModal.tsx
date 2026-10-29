'use client';

import React, { useState } from 'react';
import { Tag, X, CheckCircle2, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function BatchPassportMintModal({ isOpen, onClose }: Props) {
  const [batchCount, setBatchCount] = useState(25);
  const [minting, setMinting] = useState(false);
  const [complete, setComplete] = useState(false);

  if (!isOpen) return null;

  const handleMint = () => {
    setMinting(true);
    setTimeout(() => {
      setMinting(false);
      setComplete(true);
      setTimeout(() => {
        onClose();
        setComplete(false);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-neutral-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-100">Batch Mint Passports</h3>
            <p className="text-xs text-neutral-400">Protocol 22 Batch Minting Engine</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            Number of Garment Passports in Batch
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={batchCount}
            onChange={(e) => setBatchCount(Number(e.target.value))}
            className="w-full rounded-xl border border-neutral-700 bg-neutral-950 p-2.5 text-xs text-neutral-100 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {complete ? (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Batch minted! {batchCount} Digital passports anchored to Soroban.</span>
          </div>
        ) : (
          <button
            disabled={minting || batchCount <= 0}
            onClick={handleMint}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors disabled:opacity-50"
          >
            {minting ? <Loader2 className="h-4 w-4 animate-spin" /> : `Mint ${batchCount} Digital Twins`}
          </button>
        )}
      </div>
    </div>
  );
}
