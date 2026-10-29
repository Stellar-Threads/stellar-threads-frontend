'use client';

import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        <button onClick={onCancel} className="absolute right-4 top-4 text-neutral-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <AlertCircle className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-neutral-100">{title}</h3>
        </div>

        <p className="text-xs text-neutral-400 mb-6 leading-relaxed">{description}</p>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-neutral-700 bg-neutral-800 py-2 text-xs font-semibold text-neutral-300 hover:bg-neutral-700"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-amber-500 py-2 text-xs font-semibold text-neutral-950 hover:bg-amber-400"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
