'use client';

import React, { ReactNode } from 'react';
import { TrendingUp } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: ReactNode;
  trend?: string;
  loading?: boolean;
}

export function StatsMetricCard({ label, value, subValue, icon, trend, loading = false }: Props) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 animate-pulse">
        <div className="h-4 w-24 bg-neutral-800 rounded mb-3" />
        <div className="h-8 w-36 bg-neutral-800 rounded mb-2" />
        <div className="h-3 w-20 bg-neutral-800 rounded" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-sm transition-all hover:border-amber-500/30">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-neutral-400">{label}</span>
        {icon && <div className="text-amber-400">{icon}</div>}
      </div>
      <div className="text-2xl font-bold tracking-tight text-neutral-100">{value}</div>
      <div className="flex items-center justify-between mt-2 text-xs">
        {subValue && <span className="text-neutral-500 text-[11px]">{subValue}</span>}
        {trend && (
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 text-[11px]">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
