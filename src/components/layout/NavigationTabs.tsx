'use client';

import React from 'react';
import { LayoutDashboard, Shield, Tag, Coins, Building2, CheckCircle2 } from 'lucide-react';

export type ActiveTabId = 'overview' | 'escrows' | 'passports' | 'financing' | 'registry' | 'auditor';

interface Props {
  activeTab: ActiveTabId;
  onSelectTab: (tab: ActiveTabId) => void;
}

export function NavigationTabs({ activeTab, onSelectTab }: Props) {
  const tabs: { id: ActiveTabId; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'escrows', label: 'Fashion Escrow', icon: Shield },
    { id: 'passports', label: 'Garment Passports', icon: Tag },
    { id: 'financing', label: 'Production Financing', icon: Coins },
    { id: 'registry', label: 'Atelier Registry', icon: Building2 },
    { id: 'auditor', label: 'Solvency Auditor', icon: CheckCircle2 },
  ];

  return (
    <nav className="flex space-x-2 border-b border-neutral-800 pb-2 overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
              isActive
                ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
