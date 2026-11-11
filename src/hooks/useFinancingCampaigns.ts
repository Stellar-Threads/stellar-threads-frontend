'use client';

import { useState, useEffect } from 'react';
import { safeFetchJson } from '../lib/api/safeFetch';

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
        const json = await safeFetchJson<{ data?: FinancingProposal[] }>('/api/v1/financing/campaigns');
        if (json?.data && json.data.length > 0) {
          setCampaigns(json.data);
        } else {
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
        }
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
