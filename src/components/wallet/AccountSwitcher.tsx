'use client';

import React from 'react';
import { Users, User, ShieldCheck, Sparkles } from 'lucide-react';

export type UserPersona = 'Buyer' | 'Designer' | 'Inspector';

interface Props {
  currentPersona: UserPersona;
  onSelectPersona: (persona: UserPersona) => void;
}

export function AccountSwitcher({ currentPersona, onSelectPersona }: Props) {
  const personas: { id: UserPersona; label: string; icon: any }[] = [
    { id: 'Buyer', label: 'B2B Retailer', icon: User },
    { id: 'Designer', label: 'Fashion Atelier', icon: Sparkles },
    { id: 'Inspector', label: 'Quality Auditor', icon: ShieldCheck },
  ];

  return (
    <div className="inline-flex rounded-xl border border-neutral-800 bg-neutral-950 p-1">
      {personas.map((p) => {
        const Icon = p.icon;
        const isActive = currentPersona === p.id;
        return (
          <button
            key={p.id}
            onClick={() => onSelectPersona(p.id)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              isActive
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{p.label}</span>
          </button>
        );
      })}
    </div>
  );
}
