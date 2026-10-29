'use client';

import React from 'react';
import { Filter } from 'lucide-react';

export type EventTopicFilter = 'all' | 'escrow' | 'passport' | 'financing' | 'designer';

interface Props {
  activeFilter: EventTopicFilter;
  onFilterChange: (filter: EventTopicFilter) => void;
}

export function EventFilterToolbar({ activeFilter, onFilterChange }: Props) {
  const filters: { id: EventTopicFilter; label: string }[] = [
    { id: 'all', label: 'All Events' },
    { id: 'escrow', label: 'Escrow' },
    { id: 'passport', label: 'Passports' },
    { id: 'financing', label: 'Financing' },
    { id: 'designer', label: 'Ateliers' },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2">
      <div className="flex items-center gap-1 text-xs text-neutral-500 mr-2">
        <Filter className="h-3.5 w-3.5" />
        <span>Filter:</span>
      </div>
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => onFilterChange(f.id)}
          className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
            activeFilter === f.id
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-neutral-400 hover:text-neutral-200 bg-neutral-900 border border-neutral-800'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
