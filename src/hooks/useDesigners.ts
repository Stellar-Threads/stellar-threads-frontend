'use client';

import { useState, useEffect } from 'react';

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
        const res = await fetch('/api/v1/designers');
        const json = await res.json();
        setDesigners(json.data || []);
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
