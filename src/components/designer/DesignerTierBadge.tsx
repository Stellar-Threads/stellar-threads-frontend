'use client';

import React from 'react';
import { Sparkles, Award, Crown } from 'lucide-react';

export type DesignerTierType = 'Emerging' | 'VerifiedAtelier' | 'HauteCouture';

interface Props {
  tier: DesignerTierType | string;
}

export function DesignerTierBadge({ tier }: Props) {
  switch (tier) {
    case 'HauteCouture':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-950/40 px-2.5 py-0.5 text-[11px] font-semibold text-purple-300">
          <Crown className="h-3 w-3 text-purple-400" />
          Haute Couture
        </span>
      );
    case 'VerifiedAtelier':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-950/40 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
          <Award className="h-3 w-3 text-amber-400" />
          Verified Atelier
        </span>
      );
    case 'Emerging':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-950/40 px-2.5 py-0.5 text-[11px] font-semibold text-blue-300">
          <Sparkles className="h-3 w-3 text-blue-400" />
          Emerging Designer
        </span>
      );
  }
}
