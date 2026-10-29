'use client';

import React, { useState } from 'react';
import { AlertTriangle, Scale, Check, X } from 'lucide-react';

interface Props {
  orderId: number;
  totalStroops: string;
  onResolve: (refundBps: number) => void;
}

export function DisputeResolutionCard({ orderId, totalStroops, onResolve }: Props) {
  const [refundBps, setRefundBps] = useState(5000); // 50% default

  const refundPercent = (refundBps / 100).toFixed(0);

  return (
    <div className="rounded-2xl border border-rose-500/30 bg-rose-950/15 p-5 text-neutral-200">
      <div className="flex items-center gap-2 mb-3 text-rose-400 font-bold text-sm">
        <AlertTriangle className="h-4 w-4" />
        <span>Dispute Settlement Negotiation (Order #{orderId})</span>
      </div>

      <p className="text-xs text-neutral-400 mb-4">
        Buyer and atelier can negotiate a partial refund agreement. Select the refund percentage to execute on-chain.
      </p>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-neutral-400">Buyer Refund Percentage:</span>
          <span className="font-bold text-rose-300">{refundPercent}% ({refundBps} bps)</span>
        </div>
        <input
          type="range"
          min="1000"
          max="10000"
          step="500"
          value={refundBps}
          onChange={(e) => setRefundBps(Number(e.target.value))}
          className="w-full accent-rose-500"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onResolve(refundBps)}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-2 text-xs font-semibold text-white hover:bg-rose-500 transition-colors"
        >
          <Scale className="h-3.5 w-3.5" />
          Propose Resolution
        </button>
      </div>
    </div>
  );
}
