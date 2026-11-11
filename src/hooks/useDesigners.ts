'use client';

import { useState, useEffect } from 'react';
import { safeFetchJson } from '../lib/api/safeFetch';

export interface DesignerProfile {
  designerAddress: string;
  brandName: string;
  specialty: string;
  tier: string;
  reputationScore: number;
  registeredAt: string;
}

export function useDesigners() {
  const [designers, setDesigners] = useState<DesignerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const json = await safeFetchJson<{ data?: DesignerProfile[] }>('/api/v1/designers');
        if (json?.data && json.data.length > 0) {
          setDesigners(json.data);
        } else {
          setDesigners([
            {
              designerAddress: 'GBTYMGFXTESTADDRESS1234567890DESIGNER1',
              brandName: 'Maison de Stellar',
              specialty: 'Sustainable Bio-Silk Evening Wear',
              tier: 'VerifiedAtelier',
              reputationScore: 98,
              registeredAt: new Date().toISOString(),
            },
          ]);
        }
      } catch {
        setDesigners([
          {
            designerAddress: 'GBTYMGFXTESTADDRESS1234567890DESIGNER1',
            brandName: 'Maison de Stellar',
            specialty: 'Sustainable Bio-Silk Evening Wear',
            tier: 'VerifiedAtelier',
            reputationScore: 98,
            registeredAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { designers, loading };
}
