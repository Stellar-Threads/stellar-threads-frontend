'use client';

import { useState, useEffect } from 'react';

export interface FinancingProposal {
  campaignId: number;
  designer: string;
  targetStroops: string;
  raisedStroops: string;
  yieldBps: number;
  durationDays: number;
  status: string;
}

export function useFinancingCampaigns() {
  const [campaigns, setCampaigns] = useState<FinancingProposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch('/api/v1/financing/campaigns');
        const json = await res.json();
        setCampaigns(json.data || []);
      } catch {
        // Fallback demo factoring proposal
        setCampaigns([
          {
            campaignId: 201,
            designer: 'GBTYMGFXTESTADDRESS1234567890DESIGNER1',
            targetStroops: '1000000000',
            raisedStroops: '450000000',
            yieldBps: 850,
            durationDays: 180,
            status: 'Active',
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  return { campaigns, loading };
}
