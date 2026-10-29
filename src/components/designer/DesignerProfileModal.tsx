'use client';

import React from 'react';
import { Award, X, ExternalLink } from 'lucide-react';
import { DesignerProfile } from '../../hooks/useDesigners';
import { DesignerTierBadge } from './DesignerTierBadge';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  designer: DesignerProfile | null;
}

export function DesignerProfileModal({ isOpen, onClose, designer }: Props) {
  if (!isOpen || !designer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-neutral-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-100">{designer.brandName}</h3>
            <DesignerTierBadge tier={designer.tier} />
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 mb-4 text-xs">
          <div className="flex justify-between py-1 text-neutral-400">
            <span>Specialty:</span>
            <span className="font-semibold text-neutral-200">{designer.specialty}</span>
          </div>
          <div className="flex justify-between py-1 text-neutral-400">
            <span>Reputation Score:</span>
            <span className="font-bold text-amber-400 font-mono">{designer.reputationScore} / 100</span>
          </div>
          <div className="flex justify-between py-1 text-neutral-400">
            <span>Registered Address:</span>
            <span className="font-mono text-neutral-400 truncate max-w-[150px]">
              {designer.designerAddress}
            </span>
          </div>
        </div>

        <a
          href={`https://stellar.expert/explorer/testnet/account/${designer.designerAddress}`}
          target="_blank"
          rel="noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800 py-2.5 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View on Stellar Expert Explorer
        </a>
      </div>
    </div>
  );
}
