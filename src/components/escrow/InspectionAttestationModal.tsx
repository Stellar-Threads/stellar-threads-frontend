'use client';

import React, { useState } from 'react';
import { ClipboardCheck, X, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  onSubmitVerdict: (verdict: 'Passed' | 'Rejected' | 'Conditional') => void;
}

export function InspectionAttestationModal({ isOpen, onClose, orderId, onSubmitVerdict }: Props) {
  const [verdict, setVerdict] = useState<'Passed' | 'Rejected' | 'Conditional'>('Passed');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-neutral-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <ClipboardCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-100">Quality Inspection Attestation</h3>
            <p className="text-xs text-neutral-400">Order #{orderId} Verification</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            type="button"
            onClick={() => setVerdict('Passed')}
            className={`rounded-xl border p-2 text-center text-xs font-semibold transition-all ${
              verdict === 'Passed'
                ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                : 'border-neutral-800 bg-neutral-950 text-neutral-400'
            }`}
          >
            <CheckCircle2 className="h-4 w-4 mx-auto mb-1 text-emerald-400" />
            Passed
          </button>
          <button
            type="button"
            onClick={() => setVerdict('Conditional')}
            className={`rounded-xl border p-2 text-center text-xs font-semibold transition-all ${
              verdict === 'Conditional'
                ? 'border-amber-500 bg-amber-950/60 text-amber-300'
                : 'border-neutral-800 bg-neutral-950 text-neutral-400'
            }`}
          >
            <AlertCircle className="h-4 w-4 mx-auto mb-1 text-amber-400" />
            Conditional
          </button>
          <button
            type="button"
            onClick={() => setVerdict('Rejected')}
            className={`rounded-xl border p-2 text-center text-xs font-semibold transition-all ${
              verdict === 'Rejected'
                ? 'border-rose-500 bg-rose-950/60 text-rose-300'
                : 'border-neutral-800 bg-neutral-950 text-neutral-400'
            }`}
          >
            <XCircle className="h-4 w-4 mx-auto mb-1 text-rose-400" />
            Rejected
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            Laboratory Notes & Certificate ID
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Attestation audit details..."
            className="w-full rounded-xl border border-neutral-700 bg-neutral-950 p-2.5 text-xs text-neutral-200 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <button
          onClick={() => {
            onSubmitVerdict(verdict);
            onClose();
          }}
          className="w-full rounded-xl bg-amber-500 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors"
        >
          Sign & Broadcast Attestation
        </button>
      </div>
    </div>
  );
}
