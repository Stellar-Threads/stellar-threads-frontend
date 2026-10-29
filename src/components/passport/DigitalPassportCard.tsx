'use client';

import React from 'react';
import { ShieldCheck, QrCode, Tag, Leaf } from 'lucide-react';
import { PassportRecord } from '../../hooks/useProductPassports';

interface Props {
  passport: PassportRecord;
  onVerifyNfc: (productId: string) => void;
}

export function DigitalPassportCard({ passport, onVerifyNfc }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 transition-all hover:border-amber-500/40 hover:bg-neutral-900/90 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            <Tag className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-neutral-100">{passport.productId}</h4>
            <span className="text-[10px] text-neutral-500 font-mono">
              Designer: {passport.designer.slice(0, 6)}...{passport.designer.slice(-4)}
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
          <ShieldCheck className="h-3 w-3" />
          {passport.status}
        </span>
      </div>

      <div className="space-y-2 mb-4 text-xs">
        <div className="flex justify-between text-neutral-400">
          <span>Batch Size:</span>
          <span className="font-semibold text-neutral-200">{passport.batchSize} Units</span>
        </div>
        <div className="flex justify-between text-neutral-400">
          <span>Materials Digest:</span>
          <span className="font-mono text-neutral-400 truncate max-w-[150px]">
            {passport.materialsHash}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/90 pt-1">
          <Leaf className="h-3.5 w-3.5" />
          <span>GOTS Certified 100% Organic Bio-Silk</span>
        </div>
      </div>

      <button
        onClick={() => onVerifyNfc(passport.productId)}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
      >
        <QrCode className="h-3.5 w-3.5" />
        Verify Physical Twin NFC
      </button>
    </div>
  );
}
