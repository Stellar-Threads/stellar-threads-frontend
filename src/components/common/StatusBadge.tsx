import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'gold';

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  pulse?: boolean;
  className?: string;
}

export function StatusBadge({
  label,
  variant = 'neutral',
  pulse = false,
  className = '',
}: StatusBadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60',
    warning: 'bg-amber-950/70 text-amber-300 border-amber-800/60',
    error: 'bg-rose-950/70 text-rose-300 border-rose-800/60',
    info: 'bg-sky-950/70 text-sky-300 border-sky-800/60',
    neutral: 'bg-zinc-900 text-zinc-300 border-zinc-700/60',
    gold: 'bg-amber-950/40 text-[#e5c158] border-[#d4af37]/40',
  };

  const dotColors: Record<BadgeVariant, string> = {
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    error: 'bg-rose-400',
    info: 'bg-sky-400',
    neutral: 'bg-zinc-400',
    gold: 'bg-[#d4af37]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border tracking-wide uppercase ${variantStyles[variant]} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant]}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant]}`} />
      </span>
      {label}
    </span>
  );
}
