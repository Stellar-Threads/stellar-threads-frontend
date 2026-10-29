'use client';

import React from 'react';
import { Layers, ArrowDown } from 'lucide-react';

interface Props {
  principalPercent?: number;
  yieldPercent?: number;
  platformFeePercent?: number;
}

export function FactoringWaterfallCard({
  principalPercent = 90,
  yieldPercent = 8.5,
  platformFeePercent = 1.5,
}: Props) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
      <div className="flex items-center gap-2 mb-4 text-neutral-200 font-bold text-sm">
        <Layers className="h-4 w-4 text-amber-400" />
        <span>10,000 Basis Points Repayment Waterfall</span>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3">
          <div className="flex justify-between text-xs text-emerald-300 font-semibold mb-1">
            <span>1. Investor Principal Return</span>
            <span>{principalPercent}% (9,000 bps)</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${principalPercent}%` }} />
          </div>
        </div>

        <div className="flex justify-center text-neutral-600">
          <ArrowDown className="h-3.5 w-3.5" />
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3">
          <div className="flex justify-between text-xs text-amber-300 font-semibold mb-1">
            <span>2. Factoring Yield Distribution</span>
            <span>{yieldPercent}% (850 bps)</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
            <div className="h-full bg-amber-500" style={{ width: `${yieldPercent * 4}%` }} />
          </div>
        </div>

        <div className="flex justify-center text-neutral-600">
          <ArrowDown className="h-3.5 w-3.5" />
        </div>

        <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-3">
          <div className="flex justify-between text-xs text-purple-300 font-semibold mb-1">
            <span>3. Protocol Reserve & Insurance Pool</span>
            <span>{platformFeePercent}% (150 bps)</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
            <div className="h-full bg-purple-500" style={{ width: `${platformFeePercent * 10}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
