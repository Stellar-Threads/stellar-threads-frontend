'use client';

import { useState, useEffect } from 'react';
import { safeFetchJson } from '../lib/api/safeFetch';

export interface PassportRecord {
  productId: string;
  designer: string;
  materialsHash: string;
  batchSize: number;
  status: string;
  mintedAt: string;
}

export function useProductPassports() {
  const [passports, setPassports] = useState<PassportRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const json = await safeFetchJson<{ data?: PassportRecord[] }>('/api/v1/passports');
        if (json?.data && json.data.length > 0) {
          setPassports(json.data);
        } else {
          // Fallback demo passport
          setPassports([
            {
              productId: 'PASSPORT-BIO-SILK-001',
              designer: 'GBTYMGFXTESTADDRESS1234567890DESIGNER1',
              materialsHash: 'sha256-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
              batchSize: 50,
              status: 'Authentic',
              mintedAt: new Date().toISOString(),
            },
          ]);
        }
      } catch {
        // Fallback demo passport
        setPassports([
          {
            productId: 'PASSPORT-BIO-SILK-001',
            designer: 'GBTYMGFXTESTADDRESS1234567890DESIGNER1',
            materialsHash: 'sha256-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
            batchSize: 50,
            status: 'Authentic',
            mintedAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { passports, loading };
}
