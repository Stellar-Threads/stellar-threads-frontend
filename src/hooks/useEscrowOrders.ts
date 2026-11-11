'use client';

import { useState, useEffect } from 'react';
import { safeFetchJson } from '../lib/api/safeFetch';

export interface EscrowOrder {
  orderId: number;
  buyer: string;
  designer: string;
  amountStroops: string;
  status: string;
  createdAt: string;
}

export function useEscrowOrders() {
  const [orders, setOrders] = useState<EscrowOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const json = await safeFetchJson<{ data?: EscrowOrder[] }>('/api/v1/escrow/orders');
      if (json?.data && json.data.length > 0) {
        setOrders(json.data);
      } else {
        // Fallback demo orders for offline / static hosting
        setOrders([
          {
            orderId: 101,
            buyer: 'GBUYERTESTADDRESS1234567890BUYER1',
            designer: 'GBTYMGFXTESTADDRESS1234567890DESIGNER1',
            amountStroops: '500000000',
            status: 'Funded',
            createdAt: new Date().toISOString(),
          },
        ]);
      }
      setError(null);
    } catch {
      // Graceful fallback without polluting error state
      setOrders([
        {
          orderId: 101,
          buyer: 'GBUYERTESTADDRESS1234567890BUYER1',
          designer: 'GBTYMGFXTESTADDRESS1234567890DESIGNER1',
          amountStroops: '500000000',
          status: 'Funded',
          createdAt: new Date().toISOString(),
        },
      ]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, refetch: fetchOrders };
}
