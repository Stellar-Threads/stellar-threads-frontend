import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

interface AlertBannerProps {
  type?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  message: React.ReactNode;
  onDismiss?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export function AlertBanner({
  type = 'info',
  title,
  message,
  onDismiss,
  action,
  className = '',
}: AlertBannerProps) {
  const styles = {
    info: {
      container: 'bg-sky-950/40 border-sky-800/60 text-sky-200',
      icon: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
    },
    warning: {
      container: 'bg-amber-950/40 border-amber-800/60 text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    },
    error: {
      container: 'bg-rose-950/40 border-rose-800/60 text-rose-200',
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    },
    success: {
      container: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    },
  };

  const current = styles[type];

  return (
    <div
      role="alert"
      className={`relative flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm ${current.container} ${className}`}
    >
      <div className="pt-0.5">{current.icon}</div>
      <div className="flex-1 text-sm">
        {title && <h4 className="font-semibold mb-0.5 tracking-tight">{title}</h4>}
        <div className="text-zinc-300 leading-relaxed">{message}</div>
        {action && <div className="mt-3">{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-zinc-400 hover:text-zinc-200 p-1 -mr-1 -mt-1 transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
