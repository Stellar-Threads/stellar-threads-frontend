'use client';

import React, { useState } from 'react';
import { Calculator, X, TrendingUp } from 'lucide-react';
import { StroopFormatter } from '../common/StroopFormatter';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function FactoringCalculatorModal({ isOpen, onClose }: Props) {
  const [principalXlm, setPrincipalXlm] = useState(100);
  const [yieldBps, setYieldBps] = useState(850); // 8.5%
  const [durationDays, setDurationDays] = useState(180);

  if (!isOpen) return null;

  const principalStroops = BigInt(Math.floor(principalXlm * 10_000_000));
  // Yield = (Principal * BPS * Days) / (10000 * 365)
  const estimatedYieldStroops =
    (principalStroops * BigInt(yieldBps) * BigInt(durationDays)) /
    BigInt(10_000 * 365);

  const apyPercent = (yieldBps / 100).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-amber-500/20 bg-neutral-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-100">Factoring Yield Calculator</h3>
            <p className="text-xs text-neutral-400">Production Financing Return Model</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <div className="flex justify-between text-xs text-neutral-300 mb-1">
              <span>Investment Principal</span>
              <span className="font-bold text-amber-400">{principalXlm} XLM</span>
            </div>
            <input
              type="range"
              min="10"
              max="5000"
              step="10"
              value={principalXlm}
              onChange={(e) => setPrincipalXlm(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-neutral-300 mb-1">
              <span>Target Annual Yield (APY)</span>
              <span className="font-bold text-amber-400">{apyPercent}% ({yieldBps} bps)</span>
            </div>
            <input
              type="range"
              min="200"
              max="2500"
              step="25"
              value={yieldBps}
              onChange={(e) => setYieldBps(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-neutral-300 mb-1">
              <span>Financing Duration</span>
              <span className="font-bold text-amber-400">{durationDays} Days</span>
            </div>
            <input
              type="range"
              min="30"
              max="365"
              step="15"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-4 text-xs">
          <div className="flex items-center gap-2 mb-2 text-amber-300 font-semibold">
            <TrendingUp className="h-4 w-4" />
            <span>Estimated Investor Return</span>
          </div>
          <div className="flex justify-between py-1 text-neutral-400">
            <span>Interest Earned:</span>
            <StroopFormatter stroops={estimatedYieldStroops} />
          </div>
          <div className="flex justify-between py-1 text-neutral-400">
            <span>Total Repayment Claim:</span>
            <StroopFormatter stroops={principalStroops + estimatedYieldStroops} />
          </div>
        </div>
      </div>
    </div>
  );
}
