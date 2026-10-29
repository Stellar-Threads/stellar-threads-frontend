'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface Props {
  stroops: string | number | bigint;
  showXlm?: boolean;
  copyable?: boolean;
}

export function StroopFormatter({ stroops, showXlm = true, copyable = false }: Props) {
  const [copied, setCopied] = useState(false);

  const stroopBig = BigInt(stroops.toString());
  const xlmValue = (Number(stroopBig) / 10_000_000).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(stroopBig.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs">
      {showXlm ? (
        <>
          <span className="font-bold text-amber-400">{xlmValue} XLM</span>
          <span className="text-neutral-500 text-[10px]">({stroopBig.toLocaleString()} stroops)</span>
        </>
      ) : (
        <span className="font-medium text-neutral-200">{stroopBig.toLocaleString()} stroops</span>
      )}
      {copyable && (
        <button
          onClick={handleCopy}
          title="Copy exact Stroop amount"
          className="text-neutral-500 hover:text-amber-400 transition-colors p-0.5"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
        </button>
      )}
    </span>
  );
}
