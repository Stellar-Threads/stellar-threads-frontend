'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Props {
  type: ToastType;
  title: string;
  message?: string;
  onDismiss: () => void;
}

export function NotificationToast({ type, title, message, onDismiss }: Props) {
  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/40 bg-emerald-950/90 text-emerald-200';
      case 'error':
        return 'border-rose-500/40 bg-rose-950/90 text-rose-200';
      case 'info':
      default:
        return 'border-amber-500/40 bg-amber-950/90 text-amber-200';
    }
  };

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-3 rounded-xl border p-4 shadow-2xl backdrop-blur-md transition-all ${getStyles()}`}
    >
      {type === 'success' && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />}
      {type === 'error' && <AlertCircle className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" />}
      {type === 'info' && <Info className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />}

      <div className="flex-1">
        <h4 className="text-xs font-bold leading-tight">{title}</h4>
        {message && <p className="mt-1 text-[11px] opacity-80">{message}</p>}
      </div>

      <button onClick={onDismiss} className="text-neutral-400 hover:text-white transition-colors">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
