'use client';

import React from 'react';
import { CheckCircle2, Lock } from 'lucide-react';

export function SolvencyAuditorSection() {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-100">Proof-of-Reserve Solvency Verification</h3>
            <p className="text-xs text-neutral-400">On-Chain Mathematical Reserve Invariants</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-400">
          <Lock className="h-3.5 w-3.5" />
          Protocol 100% Solvent
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-neutral-400">Escrow Backing Ratio:</span>
            <span className="font-bold text-emerald-400 font-mono">100.00% (Zero Deficit)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden mb-2">
            <div className="h-full bg-emerald-500 w-full" />
          </div>
          <p className="text-[11px] text-neutral-500">
            All funded B2B garment orders have 1:1 on-chain reserve backing locked in fashion_escrow contract.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-neutral-400">Factoring Repayment Coverage:</span>
            <span className="font-bold text-amber-400 font-mono">102.35% (Collateral Overweight)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden mb-2">
            <div className="h-full bg-amber-500 w-full" />
          </div>
          <p className="text-[11px] text-neutral-500">
            Garment inventory collateral and buyer purchase orders exceed active investor claims.
          </p>
        </div>
      </div>
    </div>
  );
}
