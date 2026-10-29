'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';

export interface ProvenanceStep {
  title: string;
  location: string;
  date: string;
  status: 'completed' | 'in_progress' | 'pending';
}

interface Props {
  steps?: ProvenanceStep[];
}

const DEFAULT_STEPS: ProvenanceStep[] = [
  { title: 'Organic Mulberry Silk Harvest', location: 'Como, Italy', date: '2026-08-12', status: 'completed' },
  { title: 'Precision Atelier Weaving & Dyeing', location: 'Florence, Italy', date: '2026-09-04', status: 'completed' },
  { title: 'Independent Quality Inspection', location: 'Milan Lab #4', date: '2026-09-18', status: 'completed' },
  { title: 'B2B Trade Escrow Final Settlement', location: 'Stellar Protocol 22', date: '2026-10-02', status: 'completed' },
];

export function ProvenanceTimeline({ steps = DEFAULT_STEPS }: Props) {
  return (
    <div className="relative border-l border-neutral-800 ml-4 pl-6 space-y-6 my-4">
      {steps.map((s, idx) => (
        <div key={idx} className="relative group">
          <div className="absolute -left-[31px] top-0 flex h-6 w-6 items-center justify-center rounded-full border border-amber-500/40 bg-neutral-900 text-amber-400">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-neutral-200">{s.title}</h5>
            <div className="flex items-center gap-3 mt-1 text-[11px] text-neutral-500">
              <span>{s.location}</span>
              <span>•</span>
              <span className="font-mono">{s.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
