'use client';

import React from 'react';
import { Cpu, CheckCircle, AlertTriangle } from 'lucide-react';

interface Props {
  protocolVersion?: string;
  isOnline?: boolean;
}

export function ProtocolBadge({ protocolVersion = 'Protocol 22', isOnline = true }: Props) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/80 px-3 py-1 text-xs backdrop-blur-sm">
      <Cpu className="h-3.5 w-3.5 text-amber-400" />
      <span className="font-semibold text-neutral-200">{protocolVersion}</span>
      <span className="h-3 w-px bg-neutral-700" />
      <span className="inline-flex items-center gap-1.5 text-neutral-400">
        {isOnline ? (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-emerald-400 font-medium">Soroban Testnet</span>
          </>
        ) : (
          <>
            <AlertTriangle className="h-3 w-3 text-amber-500" />
            <span className="text-[11px] text-amber-400">Offline</span>
          </>
        )}
      </span>
    </div>
  );
}
