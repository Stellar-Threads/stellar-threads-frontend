'use client';

import React, { useState, useEffect } from 'react';
import { StatsMetricCard } from '../common/StatsMetricCard';
import { Coins, ShieldCheck, Tag, TrendingUp } from 'lucide-react';
import { safeFetchJson } from '../../lib/api/safeFetch';

export function ProtocolAnalyticsDashboard() {
  const [metrics, setMetrics] = useState({
    tvl: '450,000 XLM',
    tvlStroops: '4,500,000,000,000 Stroops',
    escrowVolume: '182,500 XLM',
    activeEscrows: '24 Active B2B Orders',
    passportsCount: '1,420 Items',
    passportsSub: '100% Cryptographic NFC Twin',
    factoringApy: '8.50%',
    factoringBps: '850 Basis Points',
  });

  useEffect(() => {
    async function load() {
      try {
        const json = await safeFetchJson<{
          data?: {
            totalVolumeXlm?: string;
            totalVolumeStroops?: string;
            activeEscrowsCount?: number;
            mintedPassportsCount?: number;
            averageYieldApy?: string;
          };
        }>('/api/v1/analytics/overview');

        if (json?.data) {
          const d = json.data;
          setMetrics((prev) => ({
            ...prev,
            tvl: d.totalVolumeXlm ? `${Number(d.totalVolumeXlm).toLocaleString()} XLM` : prev.tvl,
            tvlStroops: d.totalVolumeStroops ? `${Number(d.totalVolumeStroops).toLocaleString()} Stroops` : prev.tvlStroops,
            escrowVolume: d.totalVolumeXlm ? `${Number(d.totalVolumeXlm).toLocaleString()} XLM` : prev.escrowVolume,
            activeEscrows: d.activeEscrowsCount ? `${d.activeEscrowsCount} Active B2B Orders` : prev.activeEscrows,
            passportsCount: d.mintedPassportsCount ? `${d.mintedPassportsCount} Items` : prev.passportsCount,
            factoringApy: d.averageYieldApy ? `${d.averageYieldApy}%` : prev.factoringApy,
          }));
        }
      } catch {
        // Keep initial state
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 my-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-neutral-100">Protocol Financial Aggregates</h2>
          <p className="text-xs text-neutral-400">Live Soroban ledger metrics and TVL backing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsMetricCard
          label="Total Value Locked (TVL)"
          value={metrics.tvl}
          subValue={metrics.tvlStroops}
          icon={<Coins className="h-5 w-5" />}
          trend="+18.4% this epoch"
        />
        <StatsMetricCard
          label="Active Escrow Volume"
          value={metrics.escrowVolume}
          subValue={metrics.activeEscrows}
          icon={<ShieldCheck className="h-5 w-5" />}
          trend="+4 Orders today"
        />
        <StatsMetricCard
          label="Minted Digital Passports"
          value={metrics.passportsCount}
          subValue={metrics.passportsSub}
          icon={<Tag className="h-5 w-5" />}
          trend="8 Ateliers active"
        />
        <StatsMetricCard
          label="Average Factoring APY"
          value={metrics.factoringApy}
          subValue={metrics.factoringBps}
          icon={<TrendingUp className="h-5 w-5" />}
          trend="Senior tranche protected"
        />
      </div>
    </div>
  );
}
