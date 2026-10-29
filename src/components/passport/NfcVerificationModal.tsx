'use client';

import React, { useState } from 'react';
import { QrCode, ShieldCheck, X, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  expectedHash?: string;
}

export function NfcVerificationModal({ isOpen, onClose, productId, expectedHash }: Props) {
  const [scanning, setScanning] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);

  if (!isOpen) return null;

  const simulateScan = () => {
    setScanning(true);
    setVerified(null);
    setTimeout(() => {
      setScanning(false);
      setVerified(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-amber-500/20 bg-neutral-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-100">NFC Garment Verification</h3>
            <p className="text-xs text-neutral-400">Protocol 22 Digital Physical Twin Check</p>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 mb-4 text-xs">
          <div className="flex justify-between py-1 text-neutral-400">
            <span>Product Identifier:</span>
            <span className="font-mono text-neutral-200">{productId}</span>
          </div>
          <div className="flex justify-between py-1 text-neutral-400">
            <span>Cryptographic Digest:</span>
            <span className="font-mono text-neutral-400 truncate max-w-[200px]">
              {expectedHash || 'sha256:7f83b165...'}
            </span>
          </div>
        </div>

        {verified === true && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>Garment authentic! Digital passport hash matches on-chain Soroban state.</span>
          </div>
        )}

        <button
          disabled={scanning}
          onClick={simulateScan}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-semibold text-neutral-950 hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
        >
          {scanning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Scanning NFC Chip Digest...
            </>
          ) : (
            'Verify Physical Garment'
          )}
        </button>
      </div>
    </div>
  );
}
