'use client';

import React from 'react';
import { StatsMetricCard } from '../common/StatsMetricCard';
import { Coins, ShieldCheck, Tag, TrendingUp } from 'lucide-react';

export function ProtocolAnalyticsDashboard() {
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
          value="450,000 XLM"
          subValue="4,500,000,000,000 Stroops"
          icon={<Coins className="h-5 w-5" />}
          trend="+18.4% this epoch"
        />
        <StatsMetricCard
          label="Active Escrow Volume"
          value="182,500 XLM"
          subValue="24 Active B2B Orders"
          icon={<ShieldCheck className="h-5 w-5" />}
          trend="+4 Orders today"
        />
        <StatsMetricCard
          label="Minted Digital Passports"
          value="1,420 Items"
          subValue="100% Cryptographic NFC Twin"
          icon={<Tag className="h-5 w-5" />}
          trend="8 Ateliers active"
        />
        <StatsMetricCard
          label="Average Factoring APY"
          value="8.50%"
          subValue="850 Basis Points"
          icon={<TrendingUp className="h-5 w-5" />}
          trend="Senior tranche protected"
        />
      </div>
    </div>
  );
}
