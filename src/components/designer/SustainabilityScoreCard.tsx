'use client';

import React from 'react';
import { Leaf, Droplets, Wind, ShieldCheck } from 'lucide-react';

interface Props {
  brandName: string;
  score: number;
}

export function SustainabilityScoreCard({ brandName: _brandName, score }: Props) {
  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/15 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
          <Leaf className="h-4 w-4" />
          <span>ESG Sustainability Rating</span>
        </div>
        <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400 font-mono">
          {score} / 100
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-2.5">
          <Droplets className="h-4 w-4 mx-auto mb-1 text-cyan-400" />
          <span className="block font-bold text-neutral-200">-85%</span>
          <span className="text-[10px] text-neutral-500">Water Footprint</span>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-2.5">
          <Wind className="h-4 w-4 mx-auto mb-1 text-emerald-400" />
          <span className="block font-bold text-neutral-200">Zero</span>
          <span className="text-[10px] text-neutral-500">Toxic Chemicals</span>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-2.5">
          <ShieldCheck className="h-4 w-4 mx-auto mb-1 text-amber-400" />
          <span className="block font-bold text-neutral-200">100%</span>
          <span className="text-[10px] text-neutral-500">Traceable Fiber</span>
        </div>
      </div>
    </div>
  );
}
