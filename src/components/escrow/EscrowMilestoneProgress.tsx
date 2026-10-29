'use client';

import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';

export type MilestoneStage = 1 | 2 | 3 | 4;

interface Props {
  currentStage: MilestoneStage;
  isDisputed?: boolean;
}

const STAGES = [
  { step: 1, title: 'Deposit', desc: 'Escrow Funded' },
  { step: 2, title: 'Production', desc: 'Fabric Sourced' },
  { step: 3, title: 'Inspection', desc: 'Quality Check' },
  { step: 4, title: 'Settlement', desc: 'Funds Released' },
];

export function EscrowMilestoneProgress({ currentStage, isDisputed = false }: Props) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {STAGES.map((s, idx) => {
          const isCompleted = s.step < currentStage;
          const isCurrent = s.step === currentStage;

          return (
            <React.Fragment key={s.step}>
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all ${
                    isDisputed && isCurrent
                      ? 'border-rose-500 bg-rose-950/60 text-rose-400'
                      : isCompleted
                      ? 'border-emerald-500 bg-emerald-950/60 text-emerald-400'
                      : isCurrent
                      ? 'border-amber-500 bg-amber-950/60 text-amber-400 ring-2 ring-amber-500/30'
                      : 'border-neutral-700 bg-neutral-900 text-neutral-500'
                  }`}
                >
                  {isDisputed && isCurrent ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : isCurrent ? (
                    <Clock className="h-4 w-4 animate-spin" />
                  ) : (
                    s.step
                  )}
                </div>
                <span className="mt-1.5 text-[11px] font-semibold text-neutral-300">{s.title}</span>
                <span className="text-[10px] text-neutral-500">{s.desc}</span>
              </div>
              {idx < STAGES.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 transition-colors ${
                    s.step < currentStage ? 'bg-emerald-500' : 'bg-neutral-800'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
